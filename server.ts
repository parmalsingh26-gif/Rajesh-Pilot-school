import 'dotenv/config';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cookieParser from 'cookie-parser';
import { v2 as cloudinary } from 'cloudinary';

import dbConnection, {
  seedDatabase, User, Slider, Ticker, Notification, Gallery,
  Stat, ActivityLog, Officer, Message, Page, Result, Setting, FAQ, Career
} from './database.js';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-for-dev-only-change-in-prod';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadToCloudinary = (buffer: Buffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: 'auto' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result?.secure_url || '');
      }
    );
    uploadStream.end(buffer);
  });
};

// Use memory storage for uploads before sending to Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage });

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Wait for DB connection to be ready and seed data
  await dbConnection.asPromise();
  await seedDatabase();

  app.use(express.json());
  app.use(cookieParser());
  
  // Keep uploads directory static route just in case there are old links in DB during migration
  const uploadDir = path.resolve(process.cwd(), 'uploads');
  if (fs.existsSync(uploadDir)) {
    app.use('/uploads', express.static(uploadDir));
  }

  // --- Auth Middleware ---
  const authenticate = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const token = req.cookies.admin_token;
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      (req as any).user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  };

  // --- Helper ---
  const logActivity = async (action: string, details: string) => {
    try {
      await ActivityLog.create({ action, details });
    } catch (e) {
      console.error('Failed to log activity', e);
    }
  };

  const getAiModel = async (): Promise<string> => {
    const row = await Setting.findOne({ key: 'ai_model' });
    const value = row?.value?.trim();
    return value || 'models/gemini-2.5-flash';
  };

  const getAiModelForSdk = async (): Promise<string> => {
    const raw = await getAiModel();
    return raw.startsWith('models/') ? raw.slice(7) : raw;
  };

  // --- API Routes ---

  // Auth
  app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id.toString(), username: user.username }, JWT_SECRET, { expiresIn: '1d' });
    res.cookie('admin_token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' });
    res.json({ success: true });
  });

  app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('admin_token');
    res.json({ success: true });
  });

  app.get('/api/auth/me', authenticate, (req, res) => {
    res.json({ user: (req as any).user });
  });

  app.put('/api/auth/change-password', authenticate, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    if (typeof currentPassword !== 'string' || typeof newPassword !== 'string') {
      return res.status(400).json({ error: 'currentPassword and newPassword are required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }
    const userId = (req as any).user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(401).json({ error: 'User not found' });
    if (!bcrypt.compareSync(currentPassword, user.password)) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }
    const hashed = bcrypt.hashSync(newPassword, 10);
    user.password = hashed;
    await user.save();
    await logActivity('Security', 'Admin password changed successfully');
    res.json({ success: true, message: 'Password updated successfully' });
  });

  // Sliders
  app.get('/api/sliders', async (req, res) => {
    const sliders = await Slider.find().sort({ orderIndex: 1 });
    res.json(sliders);
  });

  app.post('/api/sliders', authenticate, upload.single('image'), async (req, res) => {
    try {
      const { title, orderIndex } = req.body;
      let imageUrl = req.body.imageUrl;
      
      if (req.file) {
        imageUrl = await uploadToCloudinary(req.file.buffer);
      }
      
      if (!imageUrl) return res.status(400).json({ error: 'Image is required' });
      
      const slider = await Slider.create({ title: title || '', imageUrl, orderIndex: orderIndex || 0 });
      await logActivity('Added Slider', `Title: ${title || 'Untitled'}`);
      res.json(slider);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to upload image' });
    }
  });

  app.delete('/api/sliders/:id', authenticate, async (req, res) => {
    await Slider.findByIdAndDelete(req.params.id);
    await logActivity('Deleted Slider', `ID: ${req.params.id}`);
    res.json({ success: true });
  });

  app.put('/api/sliders/reorder', authenticate, async (req, res) => {
    const items = req.body;
    if (!Array.isArray(items)) return res.status(400).json({ error: 'Body must be an array of { id, orderIndex }' });
    for (const { id, orderIndex } of items) {
      if (!id || typeof orderIndex !== 'number') continue;
      await Slider.findByIdAndUpdate(id, { orderIndex });
    }
    await logActivity('Reordered Sliders', 'Updated display order');
    res.json({ success: true });
  });

  // Tickers
  app.get('/api/tickers', async (req, res) => {
    const tickers = await Ticker.find({ isActive: true });
    res.json(tickers);
  });

  app.get('/api/admin/tickers', authenticate, async (req, res) => {
    const tickers = await Ticker.find();
    res.json(tickers);
  });

  app.post('/api/tickers', authenticate, async (req, res) => {
    const { text, isActive } = req.body;
    const ticker = await Ticker.create({ text, isActive: isActive === undefined ? true : isActive });
    await logActivity('Added Ticker', `Text: ${text.substring(0, 30)}...`);
    res.json(ticker);
  });

  app.put('/api/tickers/:id', authenticate, async (req, res) => {
    const id = req.params.id;
    const { isActive } = req.body;
    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ error: 'isActive must be a boolean' });
    }
    await Ticker.findByIdAndUpdate(id, { isActive });
    await logActivity('Updated Ticker', `ID: ${id} → ${isActive ? 'Active' : 'Inactive'}`);
    res.json({ success: true, isActive });
  });

  app.delete('/api/tickers/:id', authenticate, async (req, res) => {
    await Ticker.findByIdAndDelete(req.params.id);
    await logActivity('Deleted Ticker', `ID: ${req.params.id}`);
    res.json({ success: true });
  });

  // AI: Enhance ticker text
  app.post('/api/ai/enhance-ticker', authenticate, async (req, res) => {
    const { text } = req.body;
    if (typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ error: 'text is required and must be a non-empty string' });
    }
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({ error: 'AI service is not configured. Please set GEMINI_API_KEY.' });
    }
    try {
      const genAI = new GoogleGenAI({ apiKey });
      const model = await getAiModelForSdk();
      const prompt = `You are an AI assistant for Rajesh Pilot School. Rewrite the following text into a professional, concise, and formal news ticker flash for a school website. Keep it strictly under 15 words. Do not include quotes or conversational text. Text to rewrite: ${text.trim()}`;
      const response = await genAI.models.generateContent({
        model,
        contents: prompt,
      });
      const enhancedText = (response?.text ?? '').trim();
      if (!enhancedText) {
        return res.status(502).json({ error: 'AI did not return any text. Please try again.' });
      }
      res.json({ enhancedText });
    } catch (err) {
      console.error('AI enhance-ticker error:', err);
      res.status(502).json({
        error: err instanceof Error ? err.message : 'AI service failed. Please try again.',
      });
    }
  });

  // Global search (public)
  app.get('/api/search', async (req, res) => {
    const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
    if (!q) {
      return res.json({ success: true, results: { notifications: [], tickers: [], gallery: [] } });
    }
    const regex = new RegExp(q, 'i');
    
    const [notifications, tickers, gallery] = await Promise.all([
      Notification.find({ title: regex }).sort({ createdAt: -1 }).limit(20).select('id title pdfUrl category createdAt'),
      Ticker.find({ isActive: true, text: regex }).limit(20).select('id text'),
      Gallery.find({ caption: regex }).sort({ createdAt: -1 }).limit(20).select('id imageUrl caption createdAt')
    ]);
    
    res.json({ success: true, results: { notifications, tickers, gallery } });
  });

  // Public AI Chatbot
  const RAIL_MITRA_SYSTEM =
    "You are 'School Mitra', a helpful and polite AI assistant for Rajesh Pilot Secondary School, Bonl, Karauli, Rajasthan. Answer queries concisely in English or Hindi as asked. You help students, parents, and the public with general information about the school — admissions, fees, academics, transport, career opportunities, school timings, and contact details. Contact: 9983264013 / 6376157995. Email: Doiramavtar16@gmail.com. Address: Village Bonl, Tehsil Thodabhim, Dist. Karauli, PIN 321611. Do not answer irrelevant questions unrelated to the school. Keep responses short (under 3 sentences).";
  
  app.post('/api/chat', async (req, res) => {
    const message = typeof req.body?.message === 'string' ? req.body.message.trim() : '';
    if (!message) {
      return res.status(400).json({ error: 'message is required' });
    }
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.json({
        reply: 'School Mitra is currently unavailable. Please contact Rajesh Pilot Secondary School at 9983264013 / 6376157995 or email Doiramavtar16@gmail.com.',
      });
    }
    try {
      const genAI = new GoogleGenAI({ apiKey });
      const model = await getAiModelForSdk();
      const fullPrompt = `${RAIL_MITRA_SYSTEM}\n\nUser: ${message}\n\nAssistant:`;
      const response = await genAI.models.generateContent({
        model,
        contents: fullPrompt,
      });
      const reply = (response?.text ?? '').trim();
      res.json({ reply: reply || 'I could not generate a response. Please try rephrasing or contact the school office directly.' });
    } catch (err) {
      console.error('School Mitra chat error:', err);
      res.json({
        reply: 'Sorry, I am unable to respond at the moment. Please try again later or contact Rajesh Pilot Secondary School at 9983264013.',
      });
    }
  });

  // Contact (public)
  app.post('/api/contact', async (req, res) => {
    const { name, email, subject, message, enquiryType } = req.body;
    if (typeof name !== 'string' || !name.trim() || typeof email !== 'string' || !email.trim() || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }
    await Message.create({
      name: name.trim(),
      email: email.trim(),
      subject: typeof subject === 'string' ? subject.trim() : '',
      message: message.trim(),
      enquiryType: typeof enquiryType === 'string' ? enquiryType.trim() : 'General'
    });
    res.json({ success: true });
  });

  // Notifications
  app.get('/api/notifications', async (req, res) => {
    const { search, category, page = '1', limit = '10' } = req.query;
    const query: any = {};
    if (search) query.title = new RegExp(search as string, 'i');
    if (category && category !== 'All') query.category = category;

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const offset = (pageNum - 1) * limitNum;

    const [notifications, totalCount] = await Promise.all([
      Notification.find(query).sort({ createdAt: -1 }).skip(offset).limit(limitNum),
      Notification.countDocuments(query)
    ]);

    res.json({ notifications, totalPages: Math.ceil(totalCount / limitNum), currentPage: pageNum });
  });

  app.post('/api/notifications', authenticate, upload.single('pdf'), async (req, res) => {
    try {
      const { title, category = 'General' } = req.body;
      let pdfUrl = req.body.pdfUrl;
      
      if (req.file) {
        pdfUrl = await uploadToCloudinary(req.file.buffer);
      }
      
      if (!pdfUrl) return res.status(400).json({ error: 'PDF is required' });

      const notification = await Notification.create({ title, pdfUrl, category });
      await logActivity('Added Notification', `Title: ${title}, Category: ${category}`);
      res.json(notification);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to upload PDF' });
    }
  });

  app.delete('/api/notifications/:id', authenticate, async (req, res) => {
    await Notification.findByIdAndDelete(req.params.id);
    await logActivity('Deleted Notification', `ID: ${req.params.id}`);
    res.json({ success: true });
  });

  // Results
  app.get('/api/results', async (req, res) => {
    const { search, category, page = '1', limit = '10' } = req.query;
    const query: any = {};
    if (search) query.title = new RegExp(search as string, 'i');
    if (category && category !== 'All') query.category = category;

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const offset = (pageNum - 1) * limitNum;

    const [results, totalCount] = await Promise.all([
      Result.find(query).sort({ createdAt: -1 }).skip(offset).limit(limitNum),
      Result.countDocuments(query)
    ]);

    res.json({ results, totalPages: Math.ceil(totalCount / limitNum), currentPage: pageNum });
  });

  app.post('/api/results', authenticate, upload.single('pdf'), async (req, res) => {
    try {
      const { title, category = 'General' } = req.body;
      let pdfUrl = req.body.pdfUrl;
      
      if (req.file) {
        pdfUrl = await uploadToCloudinary(req.file.buffer);
      }
      
      if (!pdfUrl) return res.status(400).json({ error: 'PDF is required' });
      const result = await Result.create({ title: title || '', pdfUrl, category: category || 'General' });
      await logActivity('Added Result', `Title: ${title}, Category: ${category}`);
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to upload PDF' });
    }
  });

  app.delete('/api/results/:id', authenticate, async (req, res) => {
    await Result.findByIdAndDelete(req.params.id);
    await logActivity('Deleted Result', `ID: ${req.params.id}`);
    res.json({ success: true });
  });

  // Officers
  app.get('/api/officers', async (req, res) => {
    const officers = await Officer.find().sort({ orderIndex: 1 });
    res.json(officers);
  });

  app.post('/api/officers', authenticate, upload.single('image'), async (req, res) => {
    try {
      const { name, designation, orderIndex } = req.body;
      let imageUrl = req.body.imageUrl;
      
      if (req.file) {
        imageUrl = await uploadToCloudinary(req.file.buffer);
      }
      
      if (!name || !designation?.trim()) return res.status(400).json({ error: 'Name and designation are required' });
      if (!imageUrl) return res.status(400).json({ error: 'Image file is required' });
      
      const officer = await Officer.create({ name: name.trim(), designation: designation.trim(), imageUrl, orderIndex: Number(orderIndex) || 0 });
      await logActivity('Added Officer', `Name: ${name.trim()}`);
      res.json(officer);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to upload image' });
    }
  });

  app.delete('/api/officers/:id', authenticate, async (req, res) => {
    await Officer.findByIdAndDelete(req.params.id);
    await logActivity('Deleted Officer', `ID: ${req.params.id}`);
    res.json({ success: true });
  });

  app.put('/api/officers/:id', authenticate, upload.single('image'), async (req, res) => {
    try {
      const { name, designation, orderIndex } = req.body;
      const id = req.params.id;
      
      const updateData: any = { name, designation, orderIndex: orderIndex || 0 };
      if (req.file) {
        updateData.imageUrl = await uploadToCloudinary(req.file.buffer);
      }
      
      await Officer.findByIdAndUpdate(id, updateData);
      await logActivity('Updated Officer', `Name: ${name}`);
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to upload image' });
    }
  });

  app.put('/api/officers/reorder', authenticate, async (req, res) => {
    const items = req.body;
    if (!Array.isArray(items)) return res.status(400).json({ error: 'Body must be an array of { id, orderIndex }' });
    for (const { id, orderIndex } of items) {
      if (!id || typeof orderIndex !== 'number') continue;
      await Officer.findByIdAndUpdate(id, { orderIndex });
    }
    await logActivity('Reordered Officers', 'Updated display order');
    res.json({ success: true });
  });

  // Gallery
  app.get('/api/gallery', async (req, res) => {
    const gallery = await Gallery.find().sort({ createdAt: -1 });
    res.json(gallery);
  });

  app.post('/api/gallery', authenticate, upload.single('image'), async (req, res) => {
    try {
      const { caption } = req.body;
      let imageUrl = req.body.imageUrl;
      
      if (req.file) {
        imageUrl = await uploadToCloudinary(req.file.buffer);
      }
      
      if (!imageUrl) return res.status(400).json({ error: 'Image is required' });
      
      const gallery = await Gallery.create({ imageUrl, caption: caption || '' });
      await logActivity('Added Gallery Image', `Caption: ${caption || 'None'}`);
      res.json(gallery);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to upload image' });
    }
  });

  app.delete('/api/gallery/:id', authenticate, async (req, res) => {
    await Gallery.findByIdAndDelete(req.params.id);
    await logActivity('Deleted Gallery Image', `ID: ${req.params.id}`);
    res.json({ success: true });
  });

  // Stats
  app.get('/api/stats', async (req, res) => {
    const stats = await Stat.find();
    res.json(stats);
  });

  app.put('/api/stats', authenticate, async (req, res) => {
    const { stats } = req.body;
    if (!Array.isArray(stats)) return res.status(400).json({ error: 'Invalid format' });
    
    for (const stat of stats) {
      await Stat.findOneAndUpdate({ key: stat.key }, { value: stat.value, label: stat.label, icon: stat.icon });
    }
    await logActivity('Updated Stats', 'School stats updated');
    res.json({ success: true });
  });

  // Admin Quick Stats & Logs
  app.get('/api/admin/quick-stats', authenticate, async (req, res) => {
    const [totalPdfs, totalSliders, totalNews] = await Promise.all([
      Notification.countDocuments(),
      Slider.countDocuments(),
      Ticker.countDocuments()
    ]);
    res.json({ totalPdfs, totalSliders, totalNews });
  });

  app.get('/api/admin/activity-logs', authenticate, async (req, res) => {
    const logs = await ActivityLog.find().sort({ timestamp: -1 }).limit(20);
    res.json(logs);
  });

  // AI models list
  app.get('/api/admin/ai-models', authenticate, async (req, res) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({ error: 'GEMINI_API_KEY is not configured.', models: [] });
    }
    try {
      const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey)}`);
      const data = await resp.json();
      if (!resp.ok) {
        return res.status(resp.status).json({ error: data?.error?.message || 'Failed to fetch models', models: [] });
      }
      const models = (data?.models || [])
        .filter((m: any) => Array.isArray(m.supportedGenerationMethods) && m.supportedGenerationMethods.includes('generateContent'))
        .map((m: any) => m.name)
        .filter(Boolean);
      res.json({ models });
    } catch (err) {
      console.error('AI models fetch error:', err);
      res.status(502).json({ error: err instanceof Error ? err.message : 'Failed to fetch models', models: [] });
    }
  });

  // Get current AI model setting
  app.get('/api/admin/settings/ai', authenticate, async (req, res) => {
    const modelName = await getAiModel();
    res.json({ modelName });
  });

  // Save AI model setting
  app.put('/api/admin/settings/ai', authenticate, async (req, res) => {
    const modelName = typeof req.body?.modelName === 'string' ? req.body.modelName.trim() : '';
    if (!modelName) {
      return res.status(400).json({ error: 'modelName is required' });
    }
    await Setting.updateOne({ key: 'ai_model' }, { value: modelName }, { upsert: true });
    res.json({ success: true });
  });

  // Analytics for dashboard charts
  app.get('/api/admin/analytics', authenticate, async (req, res) => {
    const [notificationsByCategory, resultsByCategory, readCount, unreadCount] = await Promise.all([
      Notification.aggregate([{ $group: { _id: '$category', value: { $sum: 1 } } }]),
      Result.aggregate([{ $group: { _id: '$category', value: { $sum: 1 } } }]),
      Message.countDocuments({ isRead: true }),
      Message.countDocuments({ isRead: false })
    ]);

    const messagesStats = [
      { name: 'Read', value: readCount },
      { name: 'Unread', value: unreadCount },
    ];
    res.json({ 
      notificationsByCategory: notificationsByCategory.map(n => ({ name: n._id, value: n.value })), 
      resultsByCategory: resultsByCategory.map(n => ({ name: n._id, value: n.value })), 
      messagesStats 
    });
  });

  app.get('/api/admin/messages', authenticate, async (req, res) => {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  });

  app.put('/api/admin/messages/:id/read', authenticate, async (req, res) => {
    await Message.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ success: true });
  });

  // ---- FAQs ----
  app.get('/api/faqs', async (req, res) => {
    const faqs = await FAQ.find().sort({ orderIndex: 1 });
    res.json(faqs);
  });

  app.post('/api/faqs', authenticate, async (req, res) => {
    const { question, answer, orderIndex } = req.body;
    if (typeof question !== 'string' || !question.trim() || typeof answer !== 'string' || !answer.trim()) {
      return res.status(400).json({ error: 'question and answer are required' });
    }
    const faq = await FAQ.create({ question: question.trim(), answer: answer.trim(), orderIndex: typeof orderIndex === 'number' ? orderIndex : 0 });
    await logActivity('Added FAQ', `Q: ${question.trim().substring(0, 40)}`);
    res.json(faq);
  });

  app.put('/api/faqs/:id', authenticate, async (req, res) => {
    const { question, answer } = req.body;
    if (typeof question !== 'string' || !question.trim() || typeof answer !== 'string' || !answer.trim()) {
      return res.status(400).json({ error: 'question and answer are required' });
    }
    await FAQ.findByIdAndUpdate(req.params.id, { question: question.trim(), answer: answer.trim() });
    await logActivity('Updated FAQ', `ID: ${req.params.id}`);
    res.json({ success: true });
  });

  app.delete('/api/faqs/:id', authenticate, async (req, res) => {
    await FAQ.findByIdAndDelete(req.params.id);
    await logActivity('Deleted FAQ', `ID: ${req.params.id}`);
    res.json({ success: true });
  });

  app.put('/api/faqs/reorder', authenticate, async (req, res) => {
    const items = req.body;
    if (!Array.isArray(items)) return res.status(400).json({ error: 'Body must be an array' });
    for (const { id, orderIndex } of items) {
      if (!id || typeof orderIndex !== 'number') continue;
      await FAQ.findByIdAndUpdate(id, { orderIndex });
    }
    res.json({ success: true });
  });

  // ---- Careers ----
  app.get('/api/careers', async (req, res) => {
    const careers = await Career.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(careers);
  });

  app.get('/api/admin/careers', authenticate, async (req, res) => {
    const careers = await Career.find().sort({ createdAt: -1 });
    res.json(careers);
  });

  app.post('/api/careers', authenticate, async (req, res) => {
    const { title, department, qualification, experience, deadline, description } = req.body;
    if (typeof title !== 'string' || !title.trim() || typeof department !== 'string' || !department.trim()) {
      return res.status(400).json({ error: 'title and department are required' });
    }
    const career = await Career.create({
      title: title.trim(), department: department.trim(),
      qualification: typeof qualification === 'string' ? qualification.trim() : '',
      experience: typeof experience === 'string' ? experience.trim() : 'Fresher',
      deadline: typeof deadline === 'string' ? deadline.trim() : '',
      description: typeof description === 'string' ? description.trim() : '',
      isActive: true
    });
    await logActivity('Added Career Vacancy', `Title: ${title.trim()}`);
    res.json(career);
  });

  app.put('/api/careers/:id', authenticate, async (req, res) => {
    const { title, department, qualification, experience, deadline, description, isActive } = req.body;
    await Career.findByIdAndUpdate(req.params.id, {
      title, department, qualification, experience, deadline, description, isActive: isActive ? true : false
    });
    await logActivity('Updated Career Vacancy', `ID: ${req.params.id}`);
    res.json({ success: true });
  });

  app.delete('/api/careers/:id', authenticate, async (req, res) => {
    await Career.findByIdAndDelete(req.params.id);
    await logActivity('Deleted Career Vacancy', `ID: ${req.params.id}`);
    res.json({ success: true });
  });

  // Pages (public read)
  app.get('/api/pages/:slug', async (req, res) => {
    const page = await Page.findOne({ slug: req.params.slug });
    if (!page) return res.status(404).json({ error: 'Page not found' });
    res.json({ success: true, page: { title: page.title, content: page.content } });
  });

  app.put('/api/admin/pages/:slug', authenticate, async (req, res) => {
    const slug = req.params.slug;
    const { title, content } = req.body;
    if (typeof title !== 'string' || !title.trim() || typeof content !== 'string') {
      return res.status(400).json({ error: 'title and content are required; title must be non-empty' });
    }
    await Page.updateOne({ slug }, { title: title.trim(), content, updatedAt: new Date() }, { upsert: true });
    await logActivity('Page Updated', `Slug: ${slug}`);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve('dist/index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

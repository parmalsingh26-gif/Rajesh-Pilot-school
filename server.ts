import 'dotenv/config';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import db from './database.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cookieParser from 'cookie-parser';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-for-dev-only-change-in-prod';

// Ensure uploads directory exists
const uploadDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cookieParser());
  app.use('/uploads', express.static(uploadDir));

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
  const logActivity = (action: string, details: string) => {
    try {
      db.prepare('INSERT INTO activity_logs (action, details) VALUES (?, ?)').run(action, details);
    } catch (e) {
      console.error('Failed to log activity', e);
    }
  };

  const getAiModel = (): string => {
    const row = db.prepare('SELECT value FROM settings WHERE key = ?').get('ai_model') as { value: string } | undefined;
    const value = row?.value?.trim();
    return value || 'models/gemini-2.5-flash';
  };

  /** Normalize model name for SDK: API list returns "models/xyz", SDK often expects "xyz". */
  const getAiModelForSdk = (): string => {
    const raw = getAiModel();
    return raw.startsWith('models/') ? raw.slice(7) : raw;
  };

  // --- API Routes ---

  // Auth
  app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username) as any;
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1d' });
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

  app.put('/api/auth/change-password', authenticate, (req, res) => {
    const { currentPassword, newPassword } = req.body;
    if (typeof currentPassword !== 'string' || typeof newPassword !== 'string') {
      return res.status(400).json({ error: 'currentPassword and newPassword are required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }
    const userId = (req as any).user.id;
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as any;
    if (!user) return res.status(401).json({ error: 'User not found' });
    if (!bcrypt.compareSync(currentPassword, user.password)) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }
    const hashed = bcrypt.hashSync(newPassword, 10);
    db.prepare('UPDATE users SET password = ? WHERE id = ?').run(hashed, userId);
    logActivity('Security', 'Admin password changed successfully');
    res.json({ success: true, message: 'Password updated successfully' });
  });

  // Sliders
  app.get('/api/sliders', (req, res) => {
    const sliders = db.prepare('SELECT * FROM sliders ORDER BY orderIndex ASC').all();
    res.json(sliders);
  });

  app.post('/api/sliders', authenticate, upload.single('image'), (req, res) => {
    const { title, orderIndex } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : req.body.imageUrl;
    if (!imageUrl) return res.status(400).json({ error: 'Image is required' });
    
    const stmt = db.prepare('INSERT INTO sliders (title, imageUrl, orderIndex) VALUES (?, ?, ?)');
    const info = stmt.run(title || '', imageUrl, orderIndex || 0);
    logActivity('Added Slider', `Title: ${title || 'Untitled'}`);
    res.json({ id: info.lastInsertRowid, title, imageUrl, orderIndex });
  });

  app.delete('/api/sliders/:id', authenticate, (req, res) => {
    db.prepare('DELETE FROM sliders WHERE id = ?').run(req.params.id);
    logActivity('Deleted Slider', `ID: ${req.params.id}`);
    res.json({ success: true });
  });

  app.put('/api/sliders/reorder', authenticate, (req, res) => {
    const items = req.body;
    if (!Array.isArray(items)) return res.status(400).json({ error: 'Body must be an array of { id, orderIndex }' });
    const stmt = db.prepare('UPDATE sliders SET orderIndex = ? WHERE id = ?');
    for (const { id, orderIndex } of items) {
      if (typeof id !== 'number' || typeof orderIndex !== 'number') continue;
      stmt.run(orderIndex, id);
    }
    logActivity('Reordered Sliders', 'Updated display order');
    res.json({ success: true });
  });

  // Tickers
  app.get('/api/tickers', (req, res) => {
    const tickers = db.prepare('SELECT * FROM tickers WHERE isActive = 1').all();
    res.json(tickers);
  });

  app.get('/api/admin/tickers', authenticate, (req, res) => {
    const tickers = db.prepare('SELECT * FROM tickers').all();
    res.json(tickers);
  });

  app.post('/api/tickers', authenticate, (req, res) => {
    const { text, isActive } = req.body;
    const stmt = db.prepare('INSERT INTO tickers (text, isActive) VALUES (?, ?)');
    const info = stmt.run(text, isActive === undefined ? 1 : isActive);
    logActivity('Added Ticker', `Text: ${text.substring(0, 30)}...`);
    res.json({ id: info.lastInsertRowid, text, isActive });
  });

  app.put('/api/tickers/:id', authenticate, (req, res) => {
    const id = req.params.id;
    const { isActive } = req.body;
    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ error: 'isActive must be a boolean' });
    }
    db.prepare('UPDATE tickers SET isActive = ? WHERE id = ?').run(isActive ? 1 : 0, id);
    logActivity('Updated Ticker', `ID: ${id} → ${isActive ? 'Active' : 'Inactive'}`);
    res.json({ success: true, isActive });
  });

  app.delete('/api/tickers/:id', authenticate, (req, res) => {
    db.prepare('DELETE FROM tickers WHERE id = ?').run(req.params.id);
    logActivity('Deleted Ticker', `ID: ${req.params.id}`);
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
      const model = getAiModelForSdk();
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
  app.get('/api/search', (req, res) => {
    const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
    if (!q) {
      return res.json({ success: true, results: { notifications: [], tickers: [], gallery: [] } });
    }
    const pattern = `%${q}%`;
    const notifications = db.prepare('SELECT id, title, pdfUrl, category, createdAt FROM notifications WHERE title LIKE ? ORDER BY createdAt DESC LIMIT 20').all(pattern);
    const tickers = db.prepare('SELECT id, text FROM tickers WHERE isActive = 1 AND text LIKE ? LIMIT 20').all(pattern);
    const gallery = db.prepare('SELECT id, imageUrl, caption, createdAt FROM gallery WHERE caption LIKE ? ORDER BY createdAt DESC LIMIT 20').all(pattern);
    res.json({ success: true, results: { notifications, tickers, gallery } });
  });

  // Public AI Chatbot — Rail Mitra (no auth)
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
      const model = getAiModelForSdk();
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
  app.post('/api/contact', (req, res) => {
    const { name, email, subject, message, enquiryType } = req.body;
    if (typeof name !== 'string' || !name.trim() || typeof email !== 'string' || !email.trim() || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }
    db.prepare('INSERT INTO messages (name, email, subject, message, enquiryType) VALUES (?, ?, ?, ?, ?)').run(
      name.trim(),
      email.trim(),
      typeof subject === 'string' ? subject.trim() : '',
      message.trim(),
      typeof enquiryType === 'string' ? enquiryType.trim() : 'General'
    );
    res.json({ success: true });
  });

  // Notifications
  app.get('/api/notifications', (req, res) => {
    const { search, category, page = '1', limit = '10' } = req.query;
    let query = 'SELECT * FROM notifications WHERE 1=1';
    const params: any[] = [];

    if (search) {
      query += ' AND title LIKE ?';
      params.push(`%${search}%`);
    }
    if (category && category !== 'All') {
      query += ' AND category = ?';
      params.push(category);
    }

    query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
    const offset = (Number(page) - 1) * Number(limit);
    params.push(Number(limit), offset);

    const notifications = db.prepare(query).all(...params);
    
    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as count FROM notifications WHERE 1=1';
    const countParams: any[] = [];
    if (search) {
      countQuery += ' AND title LIKE ?';
      countParams.push(`%${search}%`);
    }
    if (category && category !== 'All') {
      countQuery += ' AND category = ?';
      countParams.push(category);
    }
    const totalCount = (db.prepare(countQuery).get(...countParams) as any).count;

    res.json({ notifications, totalPages: Math.ceil(totalCount / Number(limit)), currentPage: Number(page) });
  });

  app.post('/api/notifications', authenticate, upload.single('pdf'), (req, res) => {
    const { title, category = 'General' } = req.body;
    const pdfUrl = req.file ? `/uploads/${req.file.filename}` : req.body.pdfUrl;
    if (!pdfUrl) return res.status(400).json({ error: 'PDF is required' });

    const stmt = db.prepare('INSERT INTO notifications (title, pdfUrl, category) VALUES (?, ?, ?)');
    const info = stmt.run(title, pdfUrl, category);
    logActivity('Added Notification', `Title: ${title}, Category: ${category}`);
    res.json({ id: info.lastInsertRowid, title, pdfUrl, category });
  });

  app.delete('/api/notifications/:id', authenticate, (req, res) => {
    db.prepare('DELETE FROM notifications WHERE id = ?').run(req.params.id);
    logActivity('Deleted Notification', `ID: ${req.params.id}`);
    res.json({ success: true });
  });

  // Results (LDCE/GDCE etc.)
  app.get('/api/results', (req, res) => {
    const { search, category, page = '1', limit = '10' } = req.query;
    let query = 'SELECT * FROM results WHERE 1=1';
    const params: any[] = [];
    if (search) {
      query += ' AND title LIKE ?';
      params.push(`%${search}%`);
    }
    if (category && category !== 'All') {
      query += ' AND category = ?';
      params.push(category);
    }
    query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
    const offset = (Number(page) - 1) * Number(limit);
    params.push(Number(limit), offset);
    const results = db.prepare(query).all(...params);
    let countQuery = 'SELECT COUNT(*) as count FROM results WHERE 1=1';
    const countParams: any[] = [];
    if (search) { countQuery += ' AND title LIKE ?'; countParams.push(`%${search}%`); }
    if (category && category !== 'All') { countQuery += ' AND category = ?'; countParams.push(category); }
    const totalCount = (db.prepare(countQuery).get(...countParams) as any).count;
    res.json({ results, totalPages: Math.ceil(totalCount / Number(limit)), currentPage: Number(page) });
  });

  app.post('/api/results', authenticate, upload.single('pdf'), (req, res) => {
    const { title, category = 'General' } = req.body;
    const pdfUrl = req.file ? `/uploads/${req.file.filename}` : req.body.pdfUrl;
    if (!pdfUrl) return res.status(400).json({ error: 'PDF is required' });
    const stmt = db.prepare('INSERT INTO results (title, pdfUrl, category) VALUES (?, ?, ?)');
    const info = stmt.run(title || '', pdfUrl, category || 'General');
    logActivity('Added Result', `Title: ${title}, Category: ${category}`);
    res.json({ id: info.lastInsertRowid, title, pdfUrl, category });
  });

  app.delete('/api/results/:id', authenticate, (req, res) => {
    db.prepare('DELETE FROM results WHERE id = ?').run(req.params.id);
    logActivity('Deleted Result', `ID: ${req.params.id}`);
    res.json({ success: true });
  });

  // Officers
  app.get('/api/officers', (req, res) => {
    const officers = db.prepare('SELECT * FROM officers ORDER BY orderIndex ASC').all();
    res.json(officers);
  });

  app.post('/api/officers', authenticate, upload.single('image'), (req, res) => {
    const { name, designation, orderIndex } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';
    if (!name || !designation?.trim()) return res.status(400).json({ error: 'Name and designation are required' });
    if (!imageUrl) return res.status(400).json({ error: 'Image file is required' });
    const stmt = db.prepare('INSERT INTO officers (name, designation, imageUrl, orderIndex) VALUES (?, ?, ?, ?)');
    const info = stmt.run(name.trim(), designation.trim(), imageUrl, Number(orderIndex) || 0);
    logActivity('Added Officer', `Name: ${name.trim()}`);
    res.json({ id: info.lastInsertRowid, name: name.trim(), designation: designation.trim(), imageUrl, orderIndex: Number(orderIndex) || 0 });
  });

  app.delete('/api/officers/:id', authenticate, (req, res) => {
    db.prepare('DELETE FROM officers WHERE id = ?').run(req.params.id);
    logActivity('Deleted Officer', `ID: ${req.params.id}`);
    res.json({ success: true });
  });

  app.put('/api/officers/:id', authenticate, upload.single('image'), (req, res) => {
    const { name, designation, orderIndex } = req.body;
    const id = req.params.id;
    
    let stmt;
    if (req.file) {
      const imageUrl = `/uploads/${req.file.filename}`;
      stmt = db.prepare('UPDATE officers SET name = ?, designation = ?, imageUrl = ?, orderIndex = ? WHERE id = ?');
      stmt.run(name, designation, imageUrl, orderIndex || 0, id);
    } else {
      stmt = db.prepare('UPDATE officers SET name = ?, designation = ?, orderIndex = ? WHERE id = ?');
      stmt.run(name, designation, orderIndex || 0, id);
    }
    logActivity('Updated Officer', `Name: ${name}`);
    res.json({ success: true });
  });

  app.put('/api/officers/reorder', authenticate, (req, res) => {
    const items = req.body;
    if (!Array.isArray(items)) return res.status(400).json({ error: 'Body must be an array of { id, orderIndex }' });
    const stmt = db.prepare('UPDATE officers SET orderIndex = ? WHERE id = ?');
    for (const { id, orderIndex } of items) {
      if (typeof id !== 'number' || typeof orderIndex !== 'number') continue;
      stmt.run(orderIndex, id);
    }
    logActivity('Reordered Officers', 'Updated display order');
    res.json({ success: true });
  });

  // Gallery
  app.get('/api/gallery', (req, res) => {
    const gallery = db.prepare('SELECT * FROM gallery ORDER BY createdAt DESC').all();
    res.json(gallery);
  });

  app.post('/api/gallery', authenticate, upload.single('image'), (req, res) => {
    const { caption } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : req.body.imageUrl;
    if (!imageUrl) return res.status(400).json({ error: 'Image is required' });
    
    const stmt = db.prepare('INSERT INTO gallery (imageUrl, caption) VALUES (?, ?)');
    const info = stmt.run(imageUrl, caption || '');
    logActivity('Added Gallery Image', `Caption: ${caption || 'None'}`);
    res.json({ id: info.lastInsertRowid, imageUrl, caption });
  });

  app.delete('/api/gallery/:id', authenticate, (req, res) => {
    db.prepare('DELETE FROM gallery WHERE id = ?').run(req.params.id);
    logActivity('Deleted Gallery Image', `ID: ${req.params.id}`);
    res.json({ success: true });
  });

  // Stats
  app.get('/api/stats', (req, res) => {
    const stats = db.prepare('SELECT * FROM stats').all();
    res.json(stats);
  });

  app.put('/api/stats', authenticate, (req, res) => {
    const { stats } = req.body;
    if (!Array.isArray(stats)) return res.status(400).json({ error: 'Invalid format' });
    
    const stmt = db.prepare('UPDATE stats SET value = ?, label = ?, icon = ? WHERE key = ?');
    const transaction = db.transaction((statsToUpdate) => {
      for (const stat of statsToUpdate) {
        stmt.run(stat.value, stat.label, stat.icon, stat.key);
      }
    });
    transaction(stats);
    logActivity('Updated Stats', 'School stats updated');
    res.json({ success: true });
  });

  // Admin Quick Stats & Logs
  app.get('/api/admin/quick-stats', authenticate, (req, res) => {
    const totalPdfs = (db.prepare('SELECT COUNT(*) as count FROM notifications').get() as any).count;
    const totalSliders = (db.prepare('SELECT COUNT(*) as count FROM sliders').get() as any).count;
    const totalNews = (db.prepare('SELECT COUNT(*) as count FROM tickers').get() as any).count;
    res.json({ totalPdfs, totalSliders, totalNews });
  });

  app.get('/api/admin/activity-logs', authenticate, (req, res) => {
    const logs = db.prepare('SELECT * FROM activity_logs ORDER BY timestamp DESC LIMIT 20').all();
    res.json(logs);
  });

  // AI models list (from Google API, authenticated)
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

  // Get current AI model setting (authenticated)
  app.get('/api/admin/settings/ai', authenticate, (req, res) => {
    const modelName = getAiModel();
    res.json({ modelName });
  });

  // Save AI model setting (authenticated)
  app.put('/api/admin/settings/ai', authenticate, (req, res) => {
    const modelName = typeof req.body?.modelName === 'string' ? req.body.modelName.trim() : '';
    if (!modelName) {
      return res.status(400).json({ error: 'modelName is required' });
    }
    db.prepare(
      `INSERT INTO settings (key, value) VALUES ('ai_model', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value`
    ).run(modelName);
    res.json({ success: true });
  });

  // 1-Click Database Backup (authenticated)
  app.get('/api/admin/backup', authenticate, (req, res) => {
    const dbPath = path.resolve(process.cwd(), 'database.sqlite');
    if (!fs.existsSync(dbPath)) {
      return res.status(404).json({ error: 'Database file not found' });
    }
    logActivity('Security', 'System database backup downloaded');
    res.download(dbPath, 'database.sqlite');
  });

  // Analytics for dashboard charts (authenticated)
  app.get('/api/admin/analytics', authenticate, (req, res) => {
    const notificationsByCategory = db.prepare(
      'SELECT category AS name, COUNT(*) AS value FROM notifications GROUP BY category'
    ).all() as { name: string; value: number }[];
    const resultsByCategory = db.prepare(
      'SELECT category AS name, COUNT(*) AS value FROM results GROUP BY category'
    ).all() as { name: string; value: number }[];
    const readCount = (db.prepare('SELECT COUNT(*) AS count FROM messages WHERE isRead = 1').get() as { count: number }).count;
    const unreadCount = (db.prepare('SELECT COUNT(*) AS count FROM messages WHERE isRead = 0').get() as { count: number }).count;
    const messagesStats = [
      { name: 'Read', value: readCount },
      { name: 'Unread', value: unreadCount },
    ];
    res.json({ notificationsByCategory, resultsByCategory, messagesStats });
  });

  app.get('/api/admin/messages', authenticate, (req, res) => {
    const messages = db.prepare('SELECT * FROM messages ORDER BY createdAt DESC').all();
    res.json(messages);
  });

  app.put('/api/admin/messages/:id/read', authenticate, (req, res) => {
    db.prepare('UPDATE messages SET isRead = 1 WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

  // ---- FAQs ----
  app.get('/api/faqs', (req, res) => {
    const faqs = db.prepare('SELECT * FROM faqs ORDER BY orderIndex ASC').all();
    res.json(faqs);
  });

  app.post('/api/faqs', authenticate, (req, res) => {
    const { question, answer, orderIndex } = req.body;
    if (typeof question !== 'string' || !question.trim() || typeof answer !== 'string' || !answer.trim()) {
      return res.status(400).json({ error: 'question and answer are required' });
    }
    const info = db.prepare('INSERT INTO faqs (question, answer, orderIndex) VALUES (?, ?, ?)').run(
      question.trim(), answer.trim(), typeof orderIndex === 'number' ? orderIndex : 0
    );
    logActivity('Added FAQ', `Q: ${question.trim().substring(0, 40)}`);
    res.json({ id: info.lastInsertRowid, question: question.trim(), answer: answer.trim() });
  });

  app.put('/api/faqs/:id', authenticate, (req, res) => {
    const { question, answer } = req.body;
    if (typeof question !== 'string' || !question.trim() || typeof answer !== 'string' || !answer.trim()) {
      return res.status(400).json({ error: 'question and answer are required' });
    }
    db.prepare('UPDATE faqs SET question = ?, answer = ? WHERE id = ?').run(question.trim(), answer.trim(), req.params.id);
    logActivity('Updated FAQ', `ID: ${req.params.id}`);
    res.json({ success: true });
  });

  app.delete('/api/faqs/:id', authenticate, (req, res) => {
    db.prepare('DELETE FROM faqs WHERE id = ?').run(req.params.id);
    logActivity('Deleted FAQ', `ID: ${req.params.id}`);
    res.json({ success: true });
  });

  app.put('/api/faqs/reorder', authenticate, (req, res) => {
    const items = req.body;
    if (!Array.isArray(items)) return res.status(400).json({ error: 'Body must be an array' });
    const stmt = db.prepare('UPDATE faqs SET orderIndex = ? WHERE id = ?');
    for (const { id, orderIndex } of items) {
      if (typeof id !== 'number' || typeof orderIndex !== 'number') continue;
      stmt.run(orderIndex, id);
    }
    res.json({ success: true });
  });

  // ---- Careers ----
  app.get('/api/careers', (req, res) => {
    const careers = db.prepare('SELECT * FROM careers WHERE isActive = 1 ORDER BY createdAt DESC').all();
    res.json(careers);
  });

  app.get('/api/admin/careers', authenticate, (req, res) => {
    const careers = db.prepare('SELECT * FROM careers ORDER BY createdAt DESC').all();
    res.json(careers);
  });

  app.post('/api/careers', authenticate, (req, res) => {
    const { title, department, qualification, experience, deadline, description } = req.body;
    if (typeof title !== 'string' || !title.trim() || typeof department !== 'string' || !department.trim()) {
      return res.status(400).json({ error: 'title and department are required' });
    }
    const info = db.prepare('INSERT INTO careers (title, department, qualification, experience, deadline, description, isActive) VALUES (?, ?, ?, ?, ?, ?, 1)').run(
      title.trim(), department.trim(),
      typeof qualification === 'string' ? qualification.trim() : '',
      typeof experience === 'string' ? experience.trim() : 'Fresher',
      typeof deadline === 'string' ? deadline.trim() : '',
      typeof description === 'string' ? description.trim() : ''
    );
    logActivity('Added Career Vacancy', `Title: ${title.trim()}`);
    res.json({ id: info.lastInsertRowid });
  });

  app.put('/api/careers/:id', authenticate, (req, res) => {
    const { title, department, qualification, experience, deadline, description, isActive } = req.body;
    db.prepare('UPDATE careers SET title=?, department=?, qualification=?, experience=?, deadline=?, description=?, isActive=? WHERE id=?').run(
      title, department, qualification, experience, deadline, description,
      isActive ? 1 : 0, req.params.id
    );
    logActivity('Updated Career Vacancy', `ID: ${req.params.id}`);
    res.json({ success: true });
  });

  app.delete('/api/careers/:id', authenticate, (req, res) => {
    db.prepare('DELETE FROM careers WHERE id = ?').run(req.params.id);
    logActivity('Deleted Career Vacancy', `ID: ${req.params.id}`);
    res.json({ success: true });
  });

  // Pages (public read)
  app.get('/api/pages/:slug', (req, res) => {
    const page = db.prepare('SELECT title, content FROM pages WHERE slug = ?').get(req.params.slug) as any;
    if (!page) return res.status(404).json({ error: 'Page not found' });
    res.json({ success: true, page: { title: page.title, content: page.content } });
  });

  app.put('/api/admin/pages/:slug', authenticate, (req, res) => {
    const slug = req.params.slug;
    const { title, content } = req.body;
    if (typeof title !== 'string' || !title.trim() || typeof content !== 'string') {
      return res.status(400).json({ error: 'title and content are required; title must be non-empty' });
    }
    db.prepare(`
      INSERT INTO pages (slug, title, content, updatedAt) VALUES (?, ?, ?, datetime('now'))
      ON CONFLICT(slug) DO UPDATE SET title = excluded.title, content = excluded.content, updatedAt = datetime('now')
    `).run(slug, title.trim(), content);
    logActivity('Page Updated', `Slug: ${slug}`);
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

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

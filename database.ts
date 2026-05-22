import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/school_website';

// Transform _id to id in all JSON outputs
mongoose.set('toJSON', {
  virtuals: true,
  transform: (doc, converted) => {
    delete converted._id;
    delete converted.__v;
  }
});

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Schemas
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const sliderSchema = new mongoose.Schema({
  title: String,
  imageUrl: { type: String, required: true },
  orderIndex: { type: Number, default: 0 }
});

const tickerSchema = new mongoose.Schema({
  text: { type: String, required: true },
  isActive: { type: Boolean, default: true }
});

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  pdfUrl: { type: String, required: true },
  category: { type: String, default: 'General' },
  createdAt: { type: Date, default: Date.now }
});

const gallerySchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  caption: String,
  createdAt: { type: Date, default: Date.now }
});

const statSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: String, required: true },
  label: { type: String, required: true },
  icon: String
});

const activityLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  details: String,
  timestamp: { type: Date, default: Date.now }
});

const officerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  designation: { type: String, required: true },
  imageUrl: { type: String, required: true },
  orderIndex: { type: Number, default: 0 }
});

const messageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: String,
  message: { type: String, required: true },
  enquiryType: { type: String, default: 'General' },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const pageSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now }
});

const resultSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, default: 'General' },
  pdfUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const settingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: String
});

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  orderIndex: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const careerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  department: { type: String, required: true },
  qualification: { type: String, required: true },
  experience: { type: String, default: 'Fresher' },
  deadline: String,
  description: String,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

// Models
export const User = mongoose.model('User', userSchema);
export const Slider = mongoose.model('Slider', sliderSchema);
export const Ticker = mongoose.model('Ticker', tickerSchema);
export const Notification = mongoose.model('Notification', notificationSchema);
export const Gallery = mongoose.model('Gallery', gallerySchema);
export const Stat = mongoose.model('Stat', statSchema);
export const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
export const Officer = mongoose.model('Officer', officerSchema);
export const Message = mongoose.model('Message', messageSchema);
export const Page = mongoose.model('Page', pageSchema);
export const Result = mongoose.model('Result', resultSchema);
export const Setting = mongoose.model('Setting', settingSchema);
export const FAQ = mongoose.model('FAQ', faqSchema);
export const Career = mongoose.model('Career', careerSchema);

// Seeding Function
export async function seedDatabase() {
  try {
    // Seed admin
    const adminExists = await User.findOne({ username: 'admin' });
    if (!adminExists) {
      const hashedPassword = bcrypt.hashSync('admin123', 10);
      await User.create({ username: 'admin', password: hashedPassword });
    }

    // Seed settings
    await Setting.updateOne(
      { key: 'ai_model' },
      { $setOnInsert: { value: 'models/gemini-2.5-flash' } },
      { upsert: true }
    );

    // Seed officers
    const officersCount = await Officer.countDocuments();
    if (officersCount === 0) {
      await Officer.insertMany([
        { name: 'Dr. Suresh Sharma', designation: 'Principal', imageUrl: 'https://picsum.photos/seed/principal1/400/400', orderIndex: 1 },
        { name: 'Mrs. Anita Verma', designation: 'Vice Principal', imageUrl: 'https://picsum.photos/seed/vp1/400/400', orderIndex: 2 },
        { name: 'Mr. Ramesh Kumar', designation: 'Head of Science Dept.', imageUrl: 'https://picsum.photos/seed/sci1/400/400', orderIndex: 3 },
        { name: 'Mrs. Priya Mehta', designation: 'Head of Mathematics Dept.', imageUrl: 'https://picsum.photos/seed/math1/400/400', orderIndex: 4 },
      ]);
    }

    // Seed sliders
    const slidersCount = await Slider.countDocuments();
    if (slidersCount === 0) {
      await Slider.insertMany([
        { title: 'Welcome to Rajesh Pilot Secondary School, Bonl', imageUrl: 'https://picsum.photos/seed/school1/1920/600', orderIndex: 1 },
        { title: 'Excellence in Education — Karauli, Rajasthan', imageUrl: 'https://picsum.photos/seed/school2/1920/600', orderIndex: 2 },
        { title: 'Admission Open 2024-25 — Apply Now!', imageUrl: 'https://picsum.photos/seed/school3/1920/600', orderIndex: 3 },
      ]);
    }

    // Seed tickers
    const tickersCount = await Ticker.countDocuments();
    if (tickersCount === 0) {
      await Ticker.insertMany([
        { text: '📚 Admission Open 2024-25 — Apply Now at Rajesh Pilot Secondary School, Bonl!', isActive: true },
        { text: '🏆 Half-Yearly Exam Result Published — Check Results Section!', isActive: true },
        { text: '🎉 Annual Sports Day — All Students Must Participate.', isActive: true },
      ]);
    }

    // Seed stats
    const statsCount = await Stat.countDocuments();
    if (statsCount === 0) {
      await Stat.insertMany([
        { key: 'students', value: '1500+', label: 'Happy Students', icon: 'Users' },
        { key: 'teachers', value: '85+', label: 'Expert Teachers', icon: 'GraduationCap' },
        { key: 'classrooms', value: '50+', label: 'Modern Classrooms', icon: 'Building' },
        { key: 'awards', value: '120+', label: 'Awards Won', icon: 'Trophy' },
      ]);
    }

    // Seed pages
    const defaultPages = [
      { slug: 'about-history', title: 'Our History', content: '<h2>History of Rajesh Pilot Secondary School</h2><p>Founded with the vision to provide quality education...</p>' },
      { slug: 'about-vision-mission', title: 'Vision & Mission', content: '<h2>Our Vision</h2><p>To be a premier institution of learning...</p><h2>Our Mission</h2><p>To nurture young minds...</p>' },
      { slug: 'about-principal-desk', title: "Principal's Desk", content: '<h2>Message from the Principal</h2><p>Welcome to Rajesh Pilot Secondary School...</p>' },
      { slug: 'academics-curriculum', title: 'Curriculum (RBSE)', content: '<h2>Academic Curriculum</h2><p>We follow the Rajasthan Board of Secondary Education (RBSE) syllabus...</p>' },
      { slug: 'school-life-infrastructure', title: 'Infrastructure', content: '<h2>Campus & Facilities</h2><p>Our campus is equipped with modern classrooms, science labs, and sports facilities...</p>' }
    ];

    for (const page of defaultPages) {
      await Page.updateOne({ slug: page.slug }, { $setOnInsert: page }, { upsert: true });
    }

  } catch (err) {
    console.error('Error seeding database:', err);
  }
}

export default mongoose.connection;

import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const dbPath = path.resolve(process.cwd(), 'database.sqlite');
const db = new Database(dbPath);

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS sliders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    imageUrl TEXT NOT NULL,
    orderIndex INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS tickers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    isActive BOOLEAN DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    pdfUrl TEXT NOT NULL,
    category TEXT DEFAULT 'General',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS gallery (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    imageUrl TEXT NOT NULL,
    caption TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    label TEXT NOT NULL,
    icon TEXT
  );

  CREATE TABLE IF NOT EXISTS activity_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    action TEXT NOT NULL,
    details TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS officers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    designation TEXT NOT NULL,
    imageUrl TEXT NOT NULL,
    orderIndex INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    enquiryType TEXT DEFAULT 'General',
    isRead BOOLEAN DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS pages (
    slug TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    category TEXT DEFAULT 'General',
    pdfUrl TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );

  CREATE TABLE IF NOT EXISTS faqs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    orderIndex INTEGER DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS careers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    department TEXT NOT NULL,
    qualification TEXT NOT NULL,
    experience TEXT DEFAULT 'Fresher',
    deadline TEXT,
    description TEXT,
    isActive BOOLEAN DEFAULT 1,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Add enquiryType column to messages if it doesn't exist (migration)
try {
  db.exec(`ALTER TABLE messages ADD COLUMN enquiryType TEXT DEFAULT 'General'`);
} catch (_) { /* column already exists */ }

// Seed default AI model if not set
db.prepare(
  `INSERT OR IGNORE INTO settings (key, value) VALUES ('ai_model', 'models/gemini-2.5-flash')`
).run();

// Seed admin user if not exists
const adminExists = db.prepare('SELECT * FROM users WHERE username = ?').get('admin');
if (!adminExists) {
  const hashedPassword = bcrypt.hashSync('admin123', 10);
  db.prepare('INSERT INTO users (username, password) VALUES (?, ?)').run('admin', hashedPassword);
}

// Seed officers (school staff) if not exists
const officersCount = db.prepare('SELECT COUNT(*) as count FROM officers').get() as { count: number };
if (officersCount.count === 0) {
  const seedOfficers = [
    { name: 'Dr. Suresh Sharma', designation: 'Principal', imageUrl: 'https://picsum.photos/seed/principal1/400/400', orderIndex: 1 },
    { name: 'Mrs. Anita Verma', designation: 'Vice Principal', imageUrl: 'https://picsum.photos/seed/vp1/400/400', orderIndex: 2 },
    { name: 'Mr. Ramesh Kumar', designation: 'Head of Science Dept.', imageUrl: 'https://picsum.photos/seed/sci1/400/400', orderIndex: 3 },
    { name: 'Mrs. Priya Mehta', designation: 'Head of Mathematics Dept.', imageUrl: 'https://picsum.photos/seed/math1/400/400', orderIndex: 4 },
  ];
  const insertOfficer = db.prepare('INSERT INTO officers (name, designation, imageUrl, orderIndex) VALUES (?, ?, ?, ?)');
  seedOfficers.forEach(o => insertOfficer.run(o.name, o.designation, o.imageUrl, o.orderIndex));
}

// Seed sliders if not exists
const slidersCount = db.prepare('SELECT COUNT(*) as count FROM sliders').get() as { count: number };
if (slidersCount.count === 0) {
  const seedSliders = [
    { title: 'Welcome to Rajesh Pilot School', imageUrl: 'https://picsum.photos/seed/school1/1920/600', orderIndex: 1 },
    { title: 'Excellence in Education Since 2000', imageUrl: 'https://picsum.photos/seed/school2/1920/600', orderIndex: 2 },
    { title: 'Admission Open 2024-25', imageUrl: 'https://picsum.photos/seed/school3/1920/600', orderIndex: 3 },
  ];
  const insertSlider = db.prepare('INSERT INTO sliders (title, imageUrl, orderIndex) VALUES (?, ?, ?)');
  seedSliders.forEach(s => insertSlider.run(s.title, s.imageUrl, s.orderIndex));
}

// Seed tickers if not exists
const tickersCount = db.prepare('SELECT COUNT(*) as count FROM tickers').get() as { count: number };
if (tickersCount.count === 0) {
  const seedTickers = [
    { text: '📚 Admission Open 2024-25 — Apply Now for Classes Nursery to XII!', isActive: 1 },
    { text: '🏆 Congratulations to our Class X students — 98% result in Board Exams!', isActive: 1 },
    { text: '🎉 Annual Sports Day on 28th May — All students must participate.', isActive: 1 },
  ];
  const insertTicker = db.prepare('INSERT INTO tickers (text, isActive) VALUES (?, ?)');
  seedTickers.forEach(t => insertTicker.run(t.text, t.isActive));
}

// Seed notifications if not exists
const notificationsCount = db.prepare('SELECT COUNT(*) as count FROM notifications').get() as { count: number };
if (notificationsCount.count === 0) {
  const seedNotifications = [
    { title: 'Admit Card — Class X Board Examination 2024', pdfUrl: '#', category: 'Examination' },
    { title: 'Holiday Notice — Summer Vacation Schedule 2024', pdfUrl: '#', category: 'General' },
    { title: 'Notice for Annual Sports Day Registration', pdfUrl: '#', category: 'Events' },
  ];
  const insertNotification = db.prepare('INSERT INTO notifications (title, pdfUrl, category) VALUES (?, ?, ?)');
  seedNotifications.forEach(n => insertNotification.run(n.title, n.pdfUrl, n.category));
}

// Seed stats if not exists
const statsCount = db.prepare('SELECT COUNT(*) as count FROM stats').get() as { count: number };
if (statsCount.count === 0) {
  const seedStats = [
    { key: 'students', value: '1200+', label: 'Students Enrolled', icon: 'GraduationCap' },
    { key: 'teachers', value: '85+', label: 'Expert Teachers', icon: 'Users' },
    { key: 'estb', value: '25+', label: 'Years of Excellence', icon: 'Building' },
    { key: 'awards', value: '50+', label: 'Awards Won', icon: 'Trophy' },
  ];
  const insertStat = db.prepare('INSERT INTO stats (key, value, label, icon) VALUES (?, ?, ?, ?)');
  seedStats.forEach(s => insertStat.run(s.key, s.value, s.label, s.icon));
}

// Seed gallery if not exists
const galleryCount = db.prepare('SELECT COUNT(*) as count FROM gallery').get() as { count: number };
if (galleryCount.count === 0) {
  const seedGallery = [
    { imageUrl: 'https://picsum.photos/seed/schoolgal1/800/600', caption: 'Annual Sports Day' },
    { imageUrl: 'https://picsum.photos/seed/schoolgal2/600/800', caption: 'Science Exhibition' },
    { imageUrl: 'https://picsum.photos/seed/schoolgal3/800/800', caption: 'Cultural Program' },
    { imageUrl: 'https://picsum.photos/seed/schoolgal4/800/500', caption: 'Classroom Activities' },
    { imageUrl: 'https://picsum.photos/seed/schoolgal5/600/600', caption: 'School Library' },
    { imageUrl: 'https://picsum.photos/seed/schoolgal6/700/600', caption: 'Computer Lab' },
  ];
  const insertGallery = db.prepare('INSERT INTO gallery (imageUrl, caption) VALUES (?, ?)');
  seedGallery.forEach(g => insertGallery.run(g.imageUrl, g.caption));
}

// Seed FAQs if not exists
const faqsCount = db.prepare('SELECT COUNT(*) as count FROM faqs').get() as { count: number };
if (faqsCount.count === 0) {
  const seedFaqs = [
    { question: 'What is the admission process for Rajesh Pilot School?', answer: 'Admission process includes: 1) Fill online/offline enquiry form, 2) Document verification, 3) Entrance test (Class VI onwards), 4) Interview with Principal, 5) Fee payment and confirmation.', orderIndex: 1 },
    { question: 'What classes are available at Rajesh Pilot School?', answer: 'We offer classes from Nursery to Class XII (Science & Commerce streams) under CBSE curriculum.', orderIndex: 2 },
    { question: 'What is the fee structure?', answer: 'Fee varies by class. Please visit our Fees page or contact the school office for the current academic year fee details. Scholarships are available for meritorious students.', orderIndex: 3 },
    { question: 'Does the school provide transportation?', answer: 'Yes, the school provides bus service covering major areas of the city. Please contact the transport office for route details and transport fees.', orderIndex: 4 },
    { question: 'What are the school timings?', answer: 'School timings are 8:00 AM to 2:30 PM (Monday to Saturday). Office hours are 9:00 AM to 4:00 PM.', orderIndex: 5 },
    { question: 'Are there any scholarships available?', answer: 'Yes, we offer merit scholarships for top performers and need-based financial assistance. Please contact the school office for more details.', orderIndex: 6 },
    { question: 'What extracurricular activities are offered?', answer: 'We offer a wide range of activities including Sports (Cricket, Football, Basketball, Athletics), Cultural activities (Dance, Music, Drama), Science Club, Math Club, Debate Club, and more.', orderIndex: 7 },
    { question: 'How can I apply for a teaching position?', answer: 'Please visit our Career page to see current vacancies and submit your application. You can also email your resume to the school office.', orderIndex: 8 },
  ];
  const insertFaq = db.prepare('INSERT INTO faqs (question, answer, orderIndex) VALUES (?, ?, ?)');
  seedFaqs.forEach(f => insertFaq.run(f.question, f.answer, f.orderIndex));
}

// Seed careers if not exists
const careersCount = db.prepare('SELECT COUNT(*) as count FROM careers').get() as { count: number };
if (careersCount.count === 0) {
  const seedCareers = [
    { title: 'PGT Mathematics Teacher', department: 'Mathematics', qualification: 'M.Sc. Mathematics + B.Ed.', experience: '2+ years', deadline: '2024-06-30', description: 'We are looking for an experienced PGT Mathematics teacher with strong command over CBSE curriculum. Candidates with JEE/competitive exam coaching experience will be preferred.', isActive: 1 },
    { title: 'TGT English Teacher', department: 'English', qualification: 'M.A. English + B.Ed.', experience: '1+ years', deadline: '2024-06-30', description: 'Required TGT English teacher for secondary classes. Good communication skills and experience in CBSE board teaching required.', isActive: 1 },
    { title: 'Computer Science Teacher', department: 'Computer Science', qualification: 'B.Tech/MCA + B.Ed.', experience: 'Fresher accepted', deadline: '2024-07-15', description: 'Computer Science teacher required for Classes IX-XII. Knowledge of Python, Java, and web technologies required.', isActive: 1 },
  ];
  const insertCareer = db.prepare('INSERT INTO careers (title, department, qualification, experience, deadline, description, isActive) VALUES (?, ?, ?, ?, ?, ?, ?)');
  seedCareers.forEach(c => insertCareer.run(c.title, c.department, c.qualification, c.experience, c.deadline, c.description, c.isActive));
}

// Seed default pages for school
const pagesCount = db.prepare('SELECT COUNT(*) as count FROM pages').get() as { count: number };
if (pagesCount.count === 0) {
  const seedPages = [
    {
      slug: 'about-history',
      title: 'Our History',
      content: `Rajesh Pilot School was established with a vision to provide quality education accessible to all. Founded in 2000 by dedicated educators and community leaders, the school has grown from a small institution to one of the most respected schools in the region.

Over the past 25 years, we have consistently maintained academic excellence while nurturing the overall development of our students. Our alumni have gone on to achieve great success in various fields — engineering, medicine, arts, sports, and public service.

The school is affiliated with the Central Board of Secondary Education (CBSE) and follows a comprehensive curriculum that balances academics with co-curricular activities. We believe in creating lifelong learners who are equipped to face the challenges of the 21st century.`
    },
    {
      slug: 'about-vision-mission',
      title: 'Vision & Mission',
      content: `Our Vision:
To be a center of excellence in education that nurtures young minds to become responsible, innovative, and compassionate global citizens.

Our Mission:
• To provide a safe, inclusive, and stimulating learning environment
• To deliver quality education that builds critical thinking and creativity
• To develop character, values, and leadership skills in every student
• To embrace technology and modern teaching methods
• To foster a strong partnership between school, parents, and community

Our Core Values:
• Excellence — We strive for the highest standards in all we do
• Integrity — We act with honesty, respect, and responsibility
• Innovation — We encourage curiosity, creativity, and problem-solving
• Inclusivity — We celebrate diversity and ensure equal opportunities for all
• Service — We instill a sense of duty towards society and the nation`
    },
    {
      slug: 'about-our-team',
      title: 'Our Team',
      content: `Rajesh Pilot School takes pride in its dedicated team of educators and staff who are committed to the holistic development of every student.

Our faculty consists of highly qualified and experienced teachers, many of whom hold post-graduate degrees and specialized teaching certifications. Our teaching staff participates in regular professional development programs to stay updated with the latest educational practices and technologies.

The administrative team ensures smooth operation of the school, while our support staff maintains a clean, safe, and conducive learning environment.

Together, our team works towards the common goal of nurturing each student's potential and helping them achieve their dreams.`
    },
    {
      slug: 'academics-curriculum',
      title: 'Curriculum',
      content: `Rajesh Pilot School follows the CBSE (Central Board of Secondary Education) curriculum from Nursery to Class XII.

Primary Section (Nursery to Class V):
Our primary curriculum focuses on building strong foundations in language, mathematics, environmental science, and the arts. We use activity-based and experiential learning methods to make education engaging and effective.

Middle Section (Class VI to VIII):
Students are introduced to a wider range of subjects including Science, Mathematics, Social Science, Hindi, English, and a third language. Emphasis is placed on developing analytical and problem-solving skills.

Secondary Section (Class IX-X):
Board-oriented preparation with a focus on conceptual clarity and application. Regular assessments, practice papers, and counseling sessions help students excel in board examinations.

Senior Secondary (Class XI-XII):
Streams available:
• Science (PCM / PCB)
• Commerce

Special coaching for competitive exams (JEE, NEET, CA Foundation) is provided as part of the curriculum.`
    },
    {
      slug: 'academics-subjects',
      title: 'Subjects Offered',
      content: `Primary (Nursery to V):
English, Hindi, Mathematics, Environmental Science (EVS), General Knowledge, Computer Basics, Art & Craft, Physical Education

Middle (VI to VIII):
English, Hindi, Sanskrit/French, Mathematics, Science, Social Science, Computer Science, Physical Education, Art & Music

Secondary (IX-X):
English, Hindi, Mathematics, Science (Physics, Chemistry, Biology), Social Science, Computer Applications, Physical Education

Senior Secondary (XI-XII) Science:
Physics, Chemistry, Mathematics/Biology, English, Computer Science/Physical Education, Optional subjects

Senior Secondary (XI-XII) Commerce:
Accountancy, Business Studies, Economics, Mathematics/Informatics Practices, English, Physical Education`
    },
    {
      slug: 'academics-timetable',
      title: 'School Timetable',
      content: `School Timings:
Monday to Saturday: 8:00 AM – 2:30 PM

Morning Assembly: 8:00 AM – 8:20 AM
Period 1: 8:20 AM – 9:00 AM
Period 2: 9:00 AM – 9:40 AM
Period 3: 9:40 AM – 10:20 AM
Recess: 10:20 AM – 10:40 AM
Period 4: 10:40 AM – 11:20 AM
Period 5: 11:20 AM – 12:00 PM
Lunch Break: 12:00 PM – 12:30 PM
Period 6: 12:30 PM – 1:10 PM
Period 7: 1:10 PM – 1:50 PM
Period 8: 1:50 PM – 2:30 PM

Office Hours: 9:00 AM – 4:00 PM (Monday to Saturday)

Note: Timetable may vary for different classes and may be subject to change. Class-specific timetables are shared with students at the beginning of each academic session.`
    },
    {
      slug: 'admissions-process',
      title: 'Admission Process',
      content: `Admission Process at Rajesh Pilot School:

Step 1: Enquiry & Registration
Visit the school or fill the online enquiry form. Collect the admission form from the school office or download it from the website.

Step 2: Document Submission
Submit the following documents:
• Previous class marksheet / Report Card
• Transfer Certificate (TC) from previous school
• Birth Certificate
• Aadhar Card (Student & Parents)
• Passport size photographs (4 copies)
• Address proof

Step 3: Entrance Assessment (Class VI onwards)
Students seeking admission to Class VI and above will appear for a written assessment in English, Mathematics, and General Knowledge.

Step 4: Interaction
Selected candidates and their parents are invited for a brief interaction with the Principal.

Step 5: Confirmation
Upon selection, complete the admission by paying the prescribed fees within 7 days of selection to confirm your seat.

Admission Helpline: +91-XXXXXXXXXX
Email: admissions@rajeshpilotschool.edu.in`
    },
    {
      slug: 'admissions-fee-structure',
      title: 'Fee Structure',
      content: `Fee Structure for Academic Year 2024-25

Nursery to Class II:
Admission Fee (One-time): ₹5,000
Annual Fee: ₹15,000
Monthly Tuition Fee: ₹2,500/month
Transport Fee: ₹1,200/month (optional)

Class III to Class V:
Admission Fee (One-time): ₹5,000
Annual Fee: ₹18,000
Monthly Tuition Fee: ₹3,000/month
Transport Fee: ₹1,200/month (optional)

Class VI to Class VIII:
Admission Fee (One-time): ₹6,000
Annual Fee: ₹20,000
Monthly Tuition Fee: ₹3,500/month
Transport Fee: ₹1,400/month (optional)

Class IX to Class X:
Admission Fee (One-time): ₹7,000
Annual Fee: ₹22,000
Monthly Tuition Fee: ₹4,000/month
Transport Fee: ₹1,400/month (optional)

Class XI to Class XII:
Admission Fee (One-time): ₹8,000
Annual Fee: ₹25,000
Monthly Tuition Fee: ₹5,000/month
Transport Fee: ₹1,500/month (optional)

Payment Modes: Cash, Cheque, Online Transfer, UPI
Scholarships available for meritorious students. Contact school office for details.

Note: Fees are subject to revision. Contact school office for the most current fee structure.`
    },
    {
      slug: 'school-life-initiatives',
      title: 'School Initiatives',
      content: `Rajesh Pilot School believes in the all-round development of students through various initiatives and programs:

🌱 Green School Initiative
We are committed to environmental sustainability. Our school has a garden maintained by students, solar panels, rainwater harvesting, and a zero-plastic policy on campus.

📚 Reading for Life Program
A dedicated library period every week encourages students to develop reading habits. Book clubs, author interactions, and reading challenges are regularly organized.

🏅 Sports Excellence Program
Our school has produced state-level athletes in Cricket, Football, Athletics, and Badminton. We have dedicated coaches and modern sports facilities.

🎭 Arts & Culture Club
Regular workshops in Dance, Music, Drama, and Fine Arts help students discover and nurture their creative talents. Annual cultural fest is a highlight of the school calendar.

💻 Digital Literacy Program
All students from Class IV onwards receive computer education. Coding clubs, robotics workshops, and science fairs encourage innovation and technology adoption.

🤝 Community Service
Students actively participate in community service initiatives including cleanliness drives, teaching underprivileged children, blood donation camps, and old age home visits.

🧠 Mindfulness & Wellness
Weekly yoga and meditation sessions, counseling services, and mental health awareness programs ensure the holistic wellbeing of our students.`
    },
    {
      slug: 'school-life-transport',
      title: 'Transport Policy',
      content: `Rajesh Pilot School provides a safe, reliable, and comfortable transport service for students.

Bus Routes Available:
Route 1: City Center – School (via Main Market, Bus Stand)
Route 2: North Zone – School (via Sector 5, 7, 9)
Route 3: South Zone – School (via Civil Lines, Gandhi Nagar)
Route 4: East Zone – School (via New Colony, Industrial Area)
Route 5: West Zone – School (via Shastri Nagar, Railway Station)

Transport Rules & Guidelines:
• Students must be at the bus stop 5 minutes before scheduled time
• Students should always wear their school ID card while travelling in school bus
• No standing in the bus aisle; always remain seated
• Maintain discipline and silence while boarding/alighting
• Ragging or misbehaviour in the bus will result in cancellation of transport facility
• Any lost or damaged property must be reported to the transport in-charge immediately

Transport Fee:
The transport fee is charged monthly along with tuition fees. Rates vary by distance from school.

For route details and registration, contact:
Transport In-charge: +91-XXXXXXXXXX
Email: transport@rajeshpilotschool.edu.in`
    },
  ];
  const insertPage = db.prepare('INSERT INTO pages (slug, title, content) VALUES (?, ?, ?)');
  seedPages.forEach(p => insertPage.run(p.slug, p.title, p.content));
}

export default db;

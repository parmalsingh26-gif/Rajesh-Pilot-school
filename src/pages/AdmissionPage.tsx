import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, FileText, Users, ClipboardList, MessageSquare, GraduationCap, Phone, Mail } from 'lucide-react';

const steps = [
  {
    icon: ClipboardList,
    step: '01',
    title: 'Enquiry & Registration',
    desc: 'Fill the online enquiry form or visit the school office to collect the admission form. Submit the form with basic details.',
    color: 'bg-blue-600',
  },
  {
    icon: FileText,
    step: '02',
    title: 'Document Submission',
    desc: 'Submit required documents: Previous marksheet, TC, Birth Certificate, Aadhar Card, Photos, Address Proof.',
    color: 'bg-purple-600',
  },
  {
    icon: GraduationCap,
    step: '03',
    title: 'Entrance Assessment',
    desc: 'Students seeking admission to Class VI onwards appear for a written assessment in English, Maths, and GK.',
    color: 'bg-emerald-600',
  },
  {
    icon: Users,
    step: '04',
    title: 'Principal Interaction',
    desc: 'Selected candidates and parents are invited for a brief interaction with the Principal and academic team.',
    color: 'bg-amber-600',
  },
  {
    icon: CheckCircle,
    step: '05',
    title: 'Seat Confirmation',
    desc: 'Complete admission by paying fees within 7 days of selection. Seat is confirmed upon fee payment.',
    color: 'bg-rose-600',
  },
];

const eligibility = [
  { class: 'Nursery / LKG', age: '3 – 4 years' },
  { class: 'UKG', age: '4 – 5 years' },
  { class: 'Class I', age: '5 – 6 years' },
  { class: 'Class II – V', age: 'As per DOB + previous class pass' },
  { class: 'Class VI – VIII', age: 'Pass in previous class + assessment test' },
  { class: 'Class IX – X', age: 'Pass in previous class + assessment test' },
  { class: 'Class XI', age: 'Class X pass with minimum 55% marks' },
  { class: 'Class XII', age: 'Class XI pass certificate required' },
];

export default function AdmissionPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [classApplied, setClassApplied] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setSuccess(false);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          subject: `Admission Enquiry – Class ${classApplied}`,
          message: `Phone: ${phone}\nClass Applying For: ${classApplied}\n\nMessage: ${message}`,
          enquiryType: 'Admission',
        }),
      });
      if (res.ok) {
        setSuccess(true);
        setName(''); setEmail(''); setPhone(''); setClassApplied(''); setMessage('');
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-blue-300 font-medium uppercase tracking-widest text-sm mb-2">Join Our Family</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Admission 2024–25</h1>
            <p className="text-blue-200 text-lg max-w-2xl">
              Welcome to Rajesh Pilot School. We are now accepting applications for the academic year 2024–25 for Classes Nursery to XII.
            </p>
            <div className="w-24 h-1 bg-blue-400 rounded-full mt-6" />
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Admission Process Steps */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-4">Admission Process</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 text-center hover:shadow-md transition-shadow"
                >
                  <div className={`${step.color} text-white w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                    <Icon size={26} />
                  </div>
                  <div className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-2">STEP {step.step}</div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2 text-sm">{step.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">{step.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Eligibility Table */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6">Age Eligibility Criteria</h2>
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="bg-blue-900 text-white">
                    <th className="text-left py-3 px-5 font-semibold text-sm">Class</th>
                    <th className="text-left py-3 px-5 font-semibold text-sm">Age / Criteria</th>
                  </tr>
                </thead>
                <tbody>
                  {eligibility.map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-slate-50 dark:bg-slate-800' : 'bg-white dark:bg-slate-900/50'}>
                      <td className="py-3 px-5 text-sm font-medium text-slate-700 dark:text-slate-300">{row.class}</td>
                      <td className="py-3 px-5 text-sm text-slate-600 dark:text-slate-400">{row.age}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6">
              <h3 className="font-bold text-amber-900 dark:text-amber-200 mb-3 text-lg">Important Dates</h3>
              <ul className="space-y-2 text-sm text-amber-800 dark:text-amber-300">
                <li>📅 <strong>Form Available From:</strong> 1st April 2024</li>
                <li>📅 <strong>Last Date for Submission:</strong> 31st May 2024</li>
                <li>📅 <strong>Entrance Test:</strong> 10th June 2024</li>
                <li>📅 <strong>Result Announcement:</strong> 20th June 2024</li>
                <li>📅 <strong>Fee Payment Deadline:</strong> 30th June 2024</li>
                <li>📅 <strong>Session Begins:</strong> 1st July 2024</li>
              </ul>
            </div>

            <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
              <h3 className="font-bold text-blue-900 dark:text-blue-200 mb-3">Admission Helpdesk</h3>
              <div className="space-y-2 text-sm">
                <a href="tel:+91XXXXXXXXXX" className="flex items-center gap-2 text-blue-700 dark:text-blue-300 hover:underline">
                  <Phone size={16} /> +91-XX-XXXX-XXXX
                </a>
                <a href="mailto:admissions@rajeshpilotschool.edu.in" className="flex items-center gap-2 text-blue-700 dark:text-blue-300 hover:underline">
                  <Mail size={16} /> admissions@rajeshpilotschool.edu.in
                </a>
              </div>
            </div>
          </div>

          {/* Admission Enquiry Form */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6">Send Admission Enquiry</h2>
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
              {success && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-sm flex items-center gap-2">
                  <CheckCircle size={20} /> Your enquiry has been submitted! We'll contact you within 24 hours.
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Parent / Guardian Name *</label>
                  <input
                    type="text" value={name} onChange={e => setName(e.target.value)} required
                    className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="Your full name"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email *</label>
                    <input
                      type="email" value={email} onChange={e => setEmail(e.target.value)} required
                      className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone *</label>
                    <input
                      type="tel" value={phone} onChange={e => setPhone(e.target.value)} required
                      className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Class Applying For *</label>
                  <select
                    value={classApplied} onChange={e => setClassApplied(e.target.value)} required
                    className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  >
                    <option value="">— Select Class —</option>
                    {['Nursery', 'LKG', 'UKG', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI (Science)', 'XI (Commerce)', 'XII (Science)', 'XII (Commerce)'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Message / Questions</label>
                  <textarea
                    value={message} onChange={e => setMessage(e.target.value)} rows={4}
                    className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-y"
                    placeholder="Any questions or additional information..."
                  />
                </div>
                <button
                  type="submit" disabled={sending}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <MessageSquare size={18} />
                  {sending ? 'Submitting...' : 'Submit Enquiry'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Briefcase, MapPin, GraduationCap, Clock, Calendar, CheckCircle, MessageSquare, Building } from 'lucide-react';
import Skeleton from '../components/ui/Skeleton';

interface Career {
  id: number;
  title: string;
  department: string;
  qualification: string;
  experience: string;
  deadline: string;
  description: string;
  isActive: number;
  createdAt: string;
}

export default function CareerPage() {
  const [careers, setCareers] = useState<Career[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Application form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [position, setPosition] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/careers')
      .then(res => res.json())
      .then(setCareers)
      .finally(() => setIsLoading(false));
  }, []);

  const handleApply = async (e: React.FormEvent) => {
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
          subject: `Job Application – ${position}`,
          message: `Phone: ${phone}\nPosition: ${position}\n\nCover Letter:\n${coverLetter}`,
          enquiryType: 'Career',
        }),
      });
      if (res.ok) {
        setSuccess(true);
        setName(''); setEmail(''); setPhone(''); setPosition(''); setCoverLetter('');
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-blue-300 font-medium uppercase tracking-widest text-sm mb-2">Join Our Team</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Career Opportunities</h1>
            <p className="text-blue-200 text-lg max-w-2xl">
              We are always looking for passionate educators and support staff who share our commitment to excellence in education.
            </p>
            <div className="w-24 h-1 bg-blue-400 rounded-full mt-6" />
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Vacancies List */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6">Current Openings</h2>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-40 rounded-2xl" />)}
              </div>
            ) : careers.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-700">
                <Briefcase size={48} className="text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <p className="text-slate-500 dark:text-slate-400 text-lg">No current openings.</p>
                <p className="text-slate-400 dark:text-slate-500 text-sm mt-2">Please check back later or send us your resume.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {careers.map((job, index) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    className={`bg-white dark:bg-slate-800 rounded-2xl border shadow-sm transition-all duration-300 overflow-hidden ${selectedId === job.id ? 'border-blue-500 shadow-blue-100 dark:shadow-blue-900/20' : 'border-slate-200 dark:border-slate-700 hover:shadow-md'}`}
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">{job.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Building size={14} className="text-blue-500" />
                            <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">{job.department}</span>
                          </div>
                        </div>
                        <span className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold px-3 py-1.5 rounded-full shrink-0">Hiring</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <GraduationCap size={15} className="text-purple-500 shrink-0" />
                          <span>{job.qualification}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <Clock size={15} className="text-amber-500 shrink-0" />
                          <span>{job.experience}</span>
                        </div>
                        {job.deadline && (
                          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <Calendar size={15} className="text-rose-500 shrink-0" />
                            <span>Deadline: {job.deadline}</span>
                          </div>
                        )}
                      </div>
                      {job.description && (
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">{job.description}</p>
                      )}
                      <button
                        onClick={() => {
                          setSelectedId(job.id);
                          setPosition(job.title);
                          document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium text-sm transition-colors flex items-center gap-2"
                      >
                        <MessageSquare size={16} /> Apply Now
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Application Form */}
          <div id="apply-form">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6">Apply Now</h2>
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm sticky top-24">
              {success && (
                <div className="mb-4 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-sm flex items-center gap-2">
                  <CheckCircle size={18} /> Application submitted! We'll contact you soon.
                </div>
              )}
              <form onSubmit={handleApply} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} required
                    className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
                    placeholder="Your full name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email *</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                    className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
                    placeholder="email@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone *</label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required
                    className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
                    placeholder="+91 XXXXX XXXXX" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Position Applying For *</label>
                  <input type="text" value={position} onChange={e => setPosition(e.target.value)} required
                    className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
                    placeholder="e.g. PGT Mathematics" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cover Letter / Message *</label>
                  <textarea value={coverLetter} onChange={e => setCoverLetter(e.target.value)} required rows={5}
                    className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm resize-y"
                    placeholder="Tell us about yourself, your experience, and why you want to join us..." />
                </div>
                <button type="submit" disabled={sending}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-xl transition-colors disabled:cursor-not-allowed text-sm">
                  {sending ? 'Submitting...' : 'Submit Application'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

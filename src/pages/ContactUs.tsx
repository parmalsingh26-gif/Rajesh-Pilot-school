import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageSquare, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function ContactUs() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [enquiryType, setEnquiryType] = useState('General');
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
        body: JSON.stringify({ name, email, subject, message, enquiryType }),
      });
      if (res.ok) {
        setSuccess(true);
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
        setEnquiryType('General');
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
            <p className="text-blue-300 font-medium uppercase tracking-widest text-sm mb-2">Get In Touch</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-blue-200 text-lg">
              We're here to help. Reach out with your questions, feedback, or admission enquiries.
            </p>
            <div className="w-24 h-1 bg-blue-400 rounded-full mt-6" />
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Left: Contact Info */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6">School Contact Info</h2>
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
              <address className="not-italic space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0">
                    <MapPin className="text-blue-600 dark:text-blue-400" size={24} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Address</p>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                      Rajesh Pilot School,<br />
                      School Road, City Name,<br />
                      State – 000000
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0">
                    <Phone className="text-blue-600 dark:text-blue-400" size={24} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Phone</p>
                    <a href="tel:+91XXXXXXXXXX" className="text-slate-600 dark:text-slate-400 text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors block">
                      +91-XX-XXXX-XXXX (Office)
                    </a>
                    <a href="tel:+91XXXXXXXXXX" className="text-slate-600 dark:text-slate-400 text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors block">
                      +91-XX-XXXX-XXXX (Admission)
                    </a>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0">
                    <Mail className="text-blue-600 dark:text-blue-400" size={24} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Email</p>
                    <a href="mailto:info@rajeshpilotschool.edu.in" className="text-slate-600 dark:text-slate-400 text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors block">
                      info@rajeshpilotschool.edu.in
                    </a>
                    <a href="mailto:admissions@rajeshpilotschool.edu.in" className="text-slate-600 dark:text-slate-400 text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors block">
                      admissions@rajeshpilotschool.edu.in
                    </a>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0">
                    <Clock className="text-blue-600 dark:text-blue-400" size={24} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Office Hours</p>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">Mon – Sat: 9:00 AM – 4:00 PM</p>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">School Timings: 8:00 AM – 2:30 PM</p>
                  </div>
                </div>
              </address>
            </div>

            {/* Quick Action Boxes */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <a href="/admission" className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-2xl text-center transition-colors">
                <p className="font-bold text-sm">Admission Enquiry</p>
                <p className="text-blue-200 text-xs mt-1">Apply for 2024–25</p>
              </a>
              <a href="/faq" className="bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 text-white p-4 rounded-2xl text-center transition-colors">
                <p className="font-bold text-sm">View FAQs</p>
                <p className="text-slate-400 text-xs mt-1">Quick answers</p>
              </a>
            </div>
          </div>

          {/* Right: Enquiry Form */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6">Send an Enquiry</h2>
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
              {success && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-sm flex items-center gap-2">
                  <CheckCircle size={20} /> Your message has been sent! We will get back to you soon.
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type of Enquiry</label>
                  <select
                    value={enquiryType}
                    onChange={e => setEnquiryType(e.target.value)}
                    className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  >
                    <option value="General">General Enquiry</option>
                    <option value="Admission">Admission Enquiry</option>
                    <option value="Transport">Transport Enquiry</option>
                    <option value="Career">Career / Job Application</option>
                    <option value="Fee">Fee Related</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="Brief subject (optional)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Message *</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={5}
                    className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-y"
                    placeholder="Your message..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <MessageSquare size={18} />
                  {sending ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

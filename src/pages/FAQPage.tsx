import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronDown, ChevronUp, HelpCircle, Search } from 'lucide-react';
import Skeleton from '../components/ui/Skeleton';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  orderIndex: number;
}

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openId, setOpenId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/api/faqs')
      .then(res => res.json())
      .then(setFaqs)
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = faqs.filter(faq =>
    !searchQuery ||
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-blue-300 font-medium uppercase tracking-widest text-sm mb-2">Help Center</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-blue-200 text-lg">Find answers to the most common questions about Rajesh Pilot School.</p>
            <div className="w-24 h-1 bg-blue-400 rounded-full mt-6" />
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Search */}
        <div className="relative mb-10">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search FAQs..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-sm text-base"
          />
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} className="h-16 rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <HelpCircle size={48} className="text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400 text-lg">No FAQs found matching your search.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                  className="w-full flex items-center justify-between p-6 text-left gap-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  aria-expanded={openId === faq.id}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-blue-700 dark:text-blue-300 font-bold text-sm">{index + 1}</span>
                    </div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 text-base leading-snug">
                      {faq.question}
                    </span>
                  </div>
                  <div className="shrink-0 text-blue-600 dark:text-blue-400">
                    {openId === faq.id ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
                  </div>
                </button>
                {openId === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pl-[4.5rem] text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Still have questions? */}
        <div className="mt-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-center text-white">
          <HelpCircle size={40} className="mx-auto mb-4 opacity-80" />
          <h3 className="text-2xl font-bold mb-2">Still have questions?</h3>
          <p className="text-blue-100 mb-6">Our team is happy to help you with any other questions you may have.</p>
          <a
            href="/contact"
            className="inline-block bg-white text-blue-700 font-semibold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}

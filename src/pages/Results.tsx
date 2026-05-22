import ResultsBoard from '../components/ResultsBoard';
import { FileText } from 'lucide-react';
import { motion } from 'motion/react';

export default function Results() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-blue-300 font-medium uppercase tracking-widest text-sm mb-2">Academic Performance</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Exam Results</h1>
            <p className="text-blue-200 text-lg max-w-2xl">
              Annual, Half-Yearly, Unit Tests, Monthly Tests, Pre-Board, and Board Exam results for Rajesh Pilot Secondary School, Bonl.
            </p>
            <div className="w-24 h-1 bg-blue-400 rounded-full mt-6" />
          </motion.div>
        </div>
      </div>

      {/* Category Quick Filters */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-[64px] z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {['All', 'Annual Exam', 'Half-Yearly Exam', 'Unit Test - I', 'Unit Test - II', 'Unit Test - III', 'Monthly Test', 'Pre-Board', 'Board Exam Class X', 'Board Exam Class XII', 'Internal Assessment', 'Merit List'].map(cat => (
              <a
                key={cat}
                href={`/results?category=${encodeURIComponent(cat)}`}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-slate-700 transition-colors whitespace-nowrap border border-blue-100 dark:border-slate-700"
              >
                {cat}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="py-10">
        <ResultsBoard limit={20} showSearch={true} category="All" />
      </div>
    </div>
  );
}

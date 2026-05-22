import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import Skeleton from './ui/Skeleton';

interface Officer {
  id: string;
  name: string;
  designation: string;
  imageUrl: string;
  orderIndex: number;
}

export default function Leadership() {
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/officers')
      .then((res) => res.json())
      .then((data) => setOfficers(data))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <section className="py-16 bg-slate-50 dark:bg-slate-800/50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-900 dark:text-blue-400 mb-4">Principal &amp; Staff</h2>
            <div className="w-24 h-1 bg-blue-600 dark:bg-blue-500 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm overflow-hidden border border-slate-100 dark:border-slate-700"
              >
                <Skeleton className="aspect-square w-full rounded-none" />
                <div className="p-6 -mt-4 rounded-t-2xl bg-white dark:bg-slate-800 flex flex-col items-center">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (officers.length === 0) return null;

  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-800/50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-blue-900 dark:text-blue-400 mb-4">Principal &amp; Staff</h2>
          <div className="w-24 h-1 bg-blue-600 dark:bg-blue-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {officers.map((officer, index) => (
            <motion.div
              key={officer.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-slate-100 dark:border-slate-700"
            >
              <div className="aspect-square overflow-hidden relative">
                <div className="absolute inset-0 bg-blue-900/20 dark:bg-blue-900/40 group-hover:bg-transparent transition-colors z-10"></div>
                <img
                  src={officer.imageUrl}
                  alt={officer.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-6 text-center bg-white dark:bg-slate-800 relative z-20 -mt-4 rounded-t-2xl">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-1">{officer.name}</h3>
                <p className="text-blue-600 dark:text-blue-400 font-medium text-sm">{officer.designation}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

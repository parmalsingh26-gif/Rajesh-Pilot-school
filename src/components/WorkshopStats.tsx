import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { GraduationCap, Users, Building, Trophy } from 'lucide-react';
import Skeleton from './ui/Skeleton';

interface Stat {
  id: string;
  key: string;
  value: string;
  label: string;
  icon: string;
}

const iconMap: Record<string, any> = {
  GraduationCap,
  Users,
  Building,
  Trophy,
  // Keep legacy icons for backward compatibility
  Train: GraduationCap,
  Wrench: Trophy,
};

export default function SchoolStats() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 dark:bg-slate-950 text-white relative overflow-hidden transition-colors duration-300">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">School at a Glance</h2>
            <div className="w-24 h-1 bg-blue-400 dark:bg-blue-600 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-blue-800/30 dark:bg-slate-900/30 backdrop-blur-sm p-8 rounded-2xl border border-blue-700/30 dark:border-slate-800/50"
              >
                <Skeleton className="w-16 h-16 rounded-full mx-auto mb-6 bg-blue-700/50 dark:bg-slate-700" />
                <Skeleton className="h-10 w-24 mx-auto mb-2 bg-blue-700/50 dark:bg-slate-700" />
                <Skeleton className="h-4 w-32 mx-auto rounded bg-blue-700/50 dark:bg-slate-700" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (stats.length === 0) return null;

  return (
    <section className="py-16 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 dark:bg-slate-950 text-white relative overflow-hidden transition-colors duration-300">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
      {/* Decorative circles */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <p className="text-blue-300 font-medium uppercase tracking-widest text-sm mb-2">Why Choose Us</p>
          <h2 className="text-3xl font-bold mb-4">School at a Glance</h2>
          <div className="w-24 h-1 bg-blue-400 dark:bg-blue-600 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const IconComponent = iconMap[stat.icon] || GraduationCap;
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 text-center hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <IconComponent size={32} className="text-white" />
                </div>
                <h3 className="text-4xl font-black mb-2 text-white drop-shadow-md">{stat.value}</h3>
                <p className="text-blue-200 font-medium tracking-wide uppercase text-sm">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

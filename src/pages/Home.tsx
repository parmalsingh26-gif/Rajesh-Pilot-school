import { Link } from 'react-router-dom';
import HeroSlider from '../components/HeroSlider';
import NewsTicker from '../components/NewsTicker';
import Leadership from '../components/Leadership';
import NotificationBoard from '../components/NotificationBoard';
import SchoolStats from '../components/WorkshopStats';
import MediaGallery from '../components/MediaGallery';
import { GraduationCap, FileText, HelpCircle, Bus, Briefcase, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';

const quickLinks = [
  {
    icon: GraduationCap,
    title: 'Admission 2024-25',
    desc: 'Apply for admission — Classes Nursery to XII',
    path: '/admission',
    color: 'bg-blue-600',
    lightColor: 'bg-blue-50 dark:bg-blue-900/30',
    textColor: 'text-blue-700 dark:text-blue-300',
  },
  {
    icon: FileText,
    title: 'Fee Structure',
    desc: 'View class-wise fee details and payment info',
    path: '/fees',
    color: 'bg-emerald-600',
    lightColor: 'bg-emerald-50 dark:bg-emerald-900/30',
    textColor: 'text-emerald-700 dark:text-emerald-300',
  },
  {
    icon: BookOpen,
    title: 'Academics',
    desc: 'Curriculum, subjects, and timetable info',
    path: '/academics/curriculum',
    color: 'bg-purple-600',
    lightColor: 'bg-purple-50 dark:bg-purple-900/30',
    textColor: 'text-purple-700 dark:text-purple-300',
  },
  {
    icon: Bus,
    title: 'Transport',
    desc: 'Bus routes, timings, and transport policy',
    path: '/transport',
    color: 'bg-amber-600',
    lightColor: 'bg-amber-50 dark:bg-amber-900/30',
    textColor: 'text-amber-700 dark:text-amber-300',
  },
  {
    icon: Briefcase,
    title: 'Career',
    desc: 'Current vacancies for teachers and staff',
    path: '/career',
    color: 'bg-rose-600',
    lightColor: 'bg-rose-50 dark:bg-rose-900/30',
    textColor: 'text-rose-700 dark:text-rose-300',
  },
  {
    icon: HelpCircle,
    title: 'FAQ',
    desc: 'Frequently asked questions — get quick answers',
    path: '/faq',
    color: 'bg-teal-600',
    lightColor: 'bg-teal-50 dark:bg-teal-900/30',
    textColor: 'text-teal-700 dark:text-teal-300',
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSlider />
      <NewsTicker />
      <main className="flex-grow" id="main-content">
        <SchoolStats />

        {/* Quick Links Section */}
        <section className="py-16 bg-white dark:bg-slate-900 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-blue-600 dark:text-blue-400 font-medium uppercase tracking-widest text-sm mb-2">Quick Access</p>
              <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-4">Everything You Need</h2>
              <div className="w-24 h-1 bg-blue-600 dark:bg-blue-500 mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {quickLinks.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08, duration: 0.4 }}
                  >
                    <Link
                      to={item.path}
                      className={`group flex items-start gap-4 p-6 rounded-2xl ${item.lightColor} border border-transparent hover:border-current hover:shadow-lg transition-all duration-300`}
                    >
                      <div className={`${item.color} text-white p-3 rounded-xl shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon size={24} />
                      </div>
                      <div>
                        <h3 className={`font-bold text-lg ${item.textColor} mb-1`}>{item.title}</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <Leadership />
        <MediaGallery limit={6} />
        <NotificationBoard limit={5} />
      </main>
    </div>
  );
}

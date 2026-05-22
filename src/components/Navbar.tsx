import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, GraduationCap, ChevronDown, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx } from 'clsx';
import { useLanguage } from '../context/LanguageContext';

interface NavSubLink { name: string; path: string; }
interface NavLink { name: string; path: string; children?: NavSubLink[]; }

const navLinks: NavLink[] = [
  { name: 'Home', path: '/' },
  {
    name: 'About Us', path: '/about',
    children: [
      { name: 'History', path: '/about/history' },
      { name: 'Vision & Mission', path: '/about/vision-mission' },
      { name: 'Our Team', path: '/about/our-team' },
    ],
  },
  {
    name: 'Academics', path: '/academics',
    children: [
      { name: 'Curriculum', path: '/academics/curriculum' },
      { name: 'Subjects', path: '/academics/subjects' },
      { name: 'Timetable', path: '/academics/timetable' },
    ],
  },
  {
    name: 'Admissions', path: '/admissions',
    children: [
      { name: 'Admission Process', path: '/admission' },
      { name: 'Fee Structure', path: '/admissions/fee-structure' },
    ],
  },
  {
    name: 'School Life', path: '/school-life',
    children: [
      { name: 'Initiatives', path: '/school-life/initiatives' },
      { name: 'Transport Policy', path: '/school-life/transport' },
      { name: 'Gallery', path: '/gallery' },
    ],
  },
  { name: 'Notifications', path: '/notifications' },
  { name: 'Results', path: '/results' },
  { name: 'Career', path: '/career' },
  { name: 'FAQ', path: '/faq' },
  { name: 'Contact', path: '/contact' },
];

function isActive(pathname: string, item: NavLink) {
  if (!item.children?.length) return pathname === item.path;
  return pathname === item.path || pathname.startsWith(item.path + '/') || (item.children?.some(c => c.path === pathname) ?? false);
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) { navigate(`/search?q=${encodeURIComponent(q)}`); setIsOpen(false); }
  };

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 shadow-sm transition-colors duration-300">
      {/* Main row */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-10 h-10 bg-blue-900 dark:bg-blue-800 rounded-full flex items-center justify-center text-white shrink-0">
              <GraduationCap size={22} />
            </div>
            <div className="leading-tight hidden sm:block">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-400 leading-none">RAJESH PILOT SEC. SCHOOL</p>
              <p className="text-[9px] font-semibold text-blue-600 dark:text-blue-500 leading-none mt-0.5 uppercase tracking-wide">Bonl • Karauli • Rajasthan</p>
            </div>
          </Link>

          {/* Desktop Nav — single scrollable row */}
          <div className="hidden lg:flex items-center gap-0.5 flex-1 justify-center overflow-x-auto">
            {navLinks.map((link) => {
              const active = isActive(location.pathname, link);
              const hasDropdown = !!(link.children?.length);

              if (hasDropdown) {
                return (
                  <div key={link.name} className="relative group/dd shrink-0">
                    <Link
                      to={link.path}
                      className={clsx(
                        'inline-flex items-center gap-0.5 px-2.5 py-2 rounded-md text-xs font-semibold transition-all duration-150 relative whitespace-nowrap',
                        active ? 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-slate-800' : 'text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800'
                      )}
                    >
                      {t(link.name)}
                      <ChevronDown size={12} className="transition-transform duration-200 group-hover/dd:rotate-180 shrink-0" />
                      {active && <motion.div layoutId="nav-active" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-t-full" initial={false} transition={{ type: 'spring', stiffness: 500, damping: 30 }} />}
                    </Link>
                    <div className="absolute top-full left-0 pt-1 opacity-0 invisible group-hover/dd:opacity-100 group-hover/dd:visible transition-all duration-150 z-50">
                      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 py-1.5 min-w-[190px]">
                        {link.children!.map(sub => (
                          <Link key={sub.path} to={sub.path}
                            className={clsx('block px-4 py-2.5 text-xs font-medium transition-colors whitespace-nowrap',
                              location.pathname === sub.path ? 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-slate-700/60' : 'text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700/60'
                            )}>{t(sub.name)}</Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link key={link.name} to={link.path}
                  className={clsx(
                    'px-2.5 py-2 rounded-md text-xs font-semibold transition-all duration-150 relative shrink-0 whitespace-nowrap',
                    active ? 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-slate-800' : 'text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800'
                  )}
                >
                  {t(link.name)}
                  {active && <motion.div layoutId="nav-active" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-t-full" initial={false} transition={{ type: 'spring', stiffness: 500, damping: 30 }} />}
                </Link>
              );
            })}
          </div>

          {/* Search + Mobile toggle */}
          <div className="flex items-center gap-2">
            <form onSubmit={handleSearch} className="hidden md:flex items-center relative">
              <Search size={15} className="absolute left-2.5 text-slate-400 pointer-events-none" />
              <input
                type="search" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search..." aria-label="Search site"
                className="pl-8 pr-3 py-1.5 w-28 xl:w-36 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </form>
            <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 rounded-md text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors">
              <span className="sr-only">Toggle menu</span>
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
            <form onSubmit={handleSearch} className="p-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2">
                <Search size={18} className="text-slate-400 shrink-0" />
                <input type="search" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search..." aria-label="Search"
                  className="flex-1 bg-transparent text-slate-900 dark:text-slate-200 text-sm placeholder-slate-400 focus:outline-none" />
              </div>
            </form>
            <div className="px-2 py-2 space-y-0.5">
              {navLinks.map((link) => {
                const active = isActive(location.pathname, link);
                const hasDropdown = !!(link.children?.length);
                const expanded = expandedKey === link.name;

                if (hasDropdown) {
                  return (
                    <div key={link.name}>
                      <div className="flex items-center gap-1">
                        <Link to={link.path} onClick={() => setIsOpen(false)}
                          className={clsx('flex-1 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors',
                            active ? 'bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                          )}>{t(link.name)}</Link>
                        <button onClick={() => setExpandedKey(expanded ? null : link.name)}
                          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                          <ChevronDown size={18} className={clsx('transition-transform duration-200', expanded && 'rotate-180')} />
                        </button>
                      </div>
                      <AnimatePresence>
                        {expanded && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                            <div className="pl-4 ml-2 border-l-2 border-blue-200 dark:border-slate-700 space-y-0.5 py-1">
                              {link.children!.map(sub => (
                                <Link key={sub.path} to={sub.path} onClick={() => setIsOpen(false)}
                                  className={clsx('block px-3 py-2 rounded-lg text-sm transition-colors',
                                    location.pathname === sub.path ? 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-slate-800 font-medium' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                  )}>{t(sub.name)}</Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                return (
                  <Link key={link.name} to={link.path} onClick={() => setIsOpen(false)}
                    className={clsx('block px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors',
                      active ? 'bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    )}>{t(link.name)}</Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

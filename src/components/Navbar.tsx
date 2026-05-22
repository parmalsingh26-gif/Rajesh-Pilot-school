import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, GraduationCap, ChevronDown, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx } from 'clsx';
import { useLanguage } from '../context/LanguageContext';

/** Sub-link for dropdown menus (placeholder routes) */
interface NavSubLink {
  name: string;
  path: string;
}

/** Top-level nav item: either a direct link or a link with children (dropdown) */
interface NavLink {
  name: string;
  path: string;
  children?: NavSubLink[];
}

const navLinks: NavLink[] = [
  { name: 'Home', path: '/' },
  {
    name: 'About Us',
    path: '/about',
    children: [
      { name: 'History', path: '/about/history' },
      { name: 'Vision & Mission', path: '/about/vision-mission' },
      { name: 'Our Team', path: '/about/our-team' },
    ],
  },
  {
    name: 'Academics',
    path: '/academics',
    children: [
      { name: 'Curriculum', path: '/academics/curriculum' },
      { name: 'Subjects', path: '/academics/subjects' },
      { name: 'Timetable', path: '/academics/timetable' },
    ],
  },
  {
    name: 'Admissions',
    path: '/admissions',
    children: [
      { name: 'Admission Process', path: '/admission' },
      { name: 'Fee Structure', path: '/fees' },
    ],
  },
  {
    name: 'School Life',
    path: '/school-life',
    children: [
      { name: 'Initiatives', path: '/initiatives' },
      { name: 'Transport Policy', path: '/transport' },
      { name: 'Gallery', path: '/gallery' },
    ],
  },
  { name: 'Notifications', path: '/notifications' },
  { name: 'Results', path: '/results' },
  { name: 'Career', path: '/career' },
  { name: 'FAQ', path: '/faq' },
  { name: 'Contact Us', path: '/contact' },
];

function isNavItemActive(pathname: string, item: NavLink): boolean {
  if (!item.children?.length) return pathname === item.path;
  return pathname === item.path || pathname.startsWith(item.path + '/') || item.children.some((c) => c.path === pathname);
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedMobileKey, setExpandedMobileKey] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      navigate(`/search?q=${encodeURIComponent(q)}`);
      setIsOpen(false);
    }
  };

  return (
    <nav className="bg-white dark:bg-slate-900 shadow-md sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-900 dark:bg-blue-800 rounded-full flex items-center justify-center text-white shrink-0">
              <GraduationCap size={28} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-blue-900 dark:text-blue-400 leading-tight">Rajesh Pilot School</span>
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium tracking-wide">Excellence in Education</span>
            </div>
          </Link>

          {/* Desktop Menu + Search */}
          <div className="hidden lg:flex items-center gap-2 flex-1 justify-end">
            <div className="flex items-center space-x-0.5 flex-wrap">
            {navLinks.map((link) => {
              const isActive = isNavItemActive(location.pathname, link);
              const hasDropdown = link.children && link.children.length > 0;

              if (hasDropdown) {
                return (
                  <div
                    key={link.name}
                    className="relative group/dropdown"
                  >
                    <Link
                      to={link.path}
                      className={clsx(
                        'inline-flex items-center gap-0.5 px-2.5 py-2 rounded-md text-sm font-medium transition-all duration-200 relative',
                        isActive ? 'text-blue-700 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800'
                      )}
                    >
                      {t(link.name)}
                      <ChevronDown size={14} className="ml-0.5 shrink-0 transition-transform duration-200 group-hover/dropdown:rotate-180" />
                      {isActive && (
                        <motion.div
                          layoutId="navbar-indicator"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-t-full"
                          initial={false}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      )}
                    </Link>
                    {/* Hover dropdown panel */}
                    <div className="absolute top-full left-0 pt-1 opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all duration-200">
                      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1 min-w-[200px]">
                        {link.children!.map((sub) => {
                          const isSubActive = location.pathname === sub.path;
                          return (
                            <Link
                              key={sub.path}
                              to={sub.path}
                              className={clsx(
                                'block px-4 py-2.5 text-sm font-medium transition-colors',
                                isSubActive
                                  ? 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-slate-700/50'
                                  : 'text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700/50'
                              )}
                            >
                              {t(sub.name)}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={clsx(
                    'px-2.5 py-2 rounded-md text-sm font-medium transition-all duration-200 relative group',
                    isActive ? 'text-blue-700 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800'
                  )}
                >
                  {t(link.name)}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-t-full"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
            </div>
            <form onSubmit={handleSearch} className="flex items-center ml-2">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('Search...')}
                className="w-28 xl:w-36 py-1.5 pl-3 pr-9 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-200 text-sm placeholder-slate-400 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                aria-label="Search site"
              />
              <button type="submit" className=" -ml-8 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors pointer-events-auto" aria-label="Submit search">
                <Search size={18} />
              </button>
            </form>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (accordion for dropdowns) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900"
          >
            <form onSubmit={handleSearch} className="p-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 px-3 py-2">
                <Search size={20} className="text-slate-400 shrink-0" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('Search...')}
                  className="flex-1 min-w-0 bg-transparent text-slate-900 dark:text-slate-200 text-sm placeholder-slate-400 focus:outline-none"
                  aria-label="Search site"
                />
              </div>
            </form>
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => {
                const isActive = isNavItemActive(location.pathname, link);
                const hasDropdown = link.children && link.children.length > 0;
                const isExpanded = expandedMobileKey === link.name;

                if (hasDropdown) {
                  return (
                    <div key={link.name} className="rounded-md overflow-hidden">
                      <div className="flex items-center">
                        <Link
                          to={link.path}
                          onClick={() => setIsOpen(false)}
                          className={clsx(
                            'flex-1 px-3 py-2 rounded-md text-base font-medium transition-colors',
                            isActive ? 'bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400'
                          )}
                        >
                          {t(link.name)}
                        </Link>
                        <button
                          type="button"
                          onClick={() => setExpandedMobileKey(isExpanded ? null : link.name)}
                          className="p-2 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                          aria-expanded={isExpanded}
                          aria-label={isExpanded ? 'Collapse submenu' : 'Expand submenu'}
                        >
                          <ChevronDown
                            size={20}
                            className={clsx('transition-transform duration-200', isExpanded && 'rotate-180')}
                          />
                        </button>
                      </div>
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="pl-4 pb-2 space-y-0.5 border-l-2 border-slate-200 dark:border-slate-700 ml-3">
                              {link.children!.map((sub) => {
                                const isSubActive = location.pathname === sub.path;
                                return (
                                  <Link
                                    key={sub.path}
                                    to={sub.path}
                                    onClick={() => setIsOpen(false)}
                                    className={clsx(
                                      'block px-3 py-2 rounded-md text-sm font-medium transition-colors',
                                      isSubActive
                                        ? 'bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-blue-400'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400'
                                    )}
                                  >
                                    {t(sub.name)}
                                  </Link>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={clsx(
                      'block px-3 py-2 rounded-md text-base font-medium transition-colors',
                      isActive ? 'bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400'
                    )}
                  >
                    {t(link.name)}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

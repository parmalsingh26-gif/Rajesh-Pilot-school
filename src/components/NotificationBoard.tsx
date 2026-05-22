import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { FileText, Download, Calendar, ArrowRight, Search, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import PdfPreviewModal from './PdfPreviewModal';
import Skeleton from './ui/Skeleton';

interface Notification {
  id: string;
  title: string;
  pdfUrl: string;
  category: string;
  createdAt: string;
}

export default function NotificationBoard({ limit = 5, showSearch = false, category = 'All' }: { limit?: number, showSearch?: boolean, category?: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [previewPdf, setPreviewPdf] = useState<{ url: string; title: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(searchQuery && { search: searchQuery }),
        ...(category !== 'All' && { category })
      });
      try {
        const res = await fetch(`/api/notifications?${params}`);
        const data = await res.json();
        setNotifications(data.notifications || []);
        setTotalPages(data.totalPages || 1);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchNotifications, 300);
    return () => clearTimeout(timeoutId);
  }, [page, limit, searchQuery, category]);

  if (!showSearch && !isLoading && notifications.length === 0) return null;

  return (
    <section className="py-16 bg-white dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-3xl font-bold text-blue-900 dark:text-blue-400 mb-2 flex items-center gap-3">
              <FileText className="text-blue-600 dark:text-blue-500" size={32} />
              {category === 'All' ? 'Notifications & Circulars' : category}
            </h2>
            <p className="text-slate-500 dark:text-slate-400">Stay updated with the latest announcements, orders, and notices.</p>
          </div>
          {!showSearch && (
            <Link to="/notifications" className="text-blue-600 dark:text-blue-400 font-medium hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1 transition-colors mt-4 md:mt-0 group">
              View All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>

        {showSearch && (
          <div className="mb-8 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="text-slate-400" size={20} />
            </div>
            <input
              type="text"
              placeholder="Search notifications by keyword..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              className="w-full pl-12 pr-4 py-3 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400"
            />
          </div>
        )}

        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
          {isLoading ? (
            <ul className="divide-y divide-slate-200 dark:divide-slate-700">
              {Array.from({ length: limit }).map((_, i) => (
                <li key={i} className="px-6 py-5 flex items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <Skeleton className="w-12 h-12 rounded-xl shrink-0 mt-1" />
                    <div className="space-y-2 min-w-0 flex-1">
                      <Skeleton className="h-5 w-full max-w-sm" />
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-5 w-20 rounded-full" />
                        <Skeleton className="h-4 w-28 rounded" />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Skeleton className="h-9 w-24 rounded-lg" />
                    <Skeleton className="h-9 w-9 rounded-lg" />
                  </div>
                </li>
              ))}
            </ul>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400">No notifications found.</div>
          ) : (
            <ul className="divide-y divide-slate-200 dark:divide-slate-700">
              {notifications.map((notification, index) => (
              <motion.li
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="hover:bg-blue-50/50 dark:hover:bg-slate-800 transition-colors group"
              >
                <div className="px-6 py-5 flex items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 p-3 rounded-xl shrink-0 mt-1">
                      <FileText size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors mb-1">
                        {notification.title}
                      </h3>
                      <div className="flex items-center gap-3">
                        <span className="inline-block px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-semibold rounded-full border border-blue-200 dark:border-blue-800">
                          {notification.category}
                        </span>
                        <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 gap-1.5 font-medium">
                          <Calendar size={14} />
                          {notification.createdAt ? new Date(notification.createdAt.replace(' ', 'T')).toLocaleString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                          }) : 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setPreviewPdf({ url: notification.pdfUrl, title: notification.title })}
                      className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 hover:border-blue-600 dark:hover:border-blue-500 hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white text-blue-700 dark:text-blue-400 px-3 py-2 rounded-lg font-medium transition-all shadow-sm"
                      title="Preview PDF"
                    >
                      <Eye size={18} />
                      <span className="hidden sm:inline">Preview</span>
                    </button>
                    <a
                      href={notification.pdfUrl}
                      download
                      className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:border-blue-600 dark:hover:border-blue-500 hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white text-slate-700 dark:text-slate-300 px-3 py-2 rounded-lg font-medium transition-all shadow-sm"
                      title="Download PDF"
                    >
                      <Download size={18} />
                    </a>
                  </div>
                </div>
              </motion.li>
            ))}
          </ul>
          )}
        </div>

        {showSearch && totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center gap-4">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      <PdfPreviewModal
        isOpen={!!previewPdf}
        onClose={() => setPreviewPdf(null)}
        pdfUrl={previewPdf?.url || ''}
        title={previewPdf?.title || ''}
      />
    </section>
  );
}

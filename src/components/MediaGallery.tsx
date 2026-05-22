import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Image as ImageIcon, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Skeleton from './ui/Skeleton';

interface GalleryImage {
  id: string;
  imageUrl: string;
  caption: string;
}

export default function MediaGallery({ limit = 6, showHeader = true }: { limit?: number, showHeader?: boolean }) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/gallery')
      .then(res => res.json())
      .then(data => setImages(data.slice(0, limit)))
      .finally(() => setIsLoading(false));
  }, [limit]);

  if (isLoading) {
    return (
      <section className="py-16 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {showHeader && (
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <Skeleton className="h-9 w-64 mb-2" />
                <Skeleton className="h-5 w-96 rounded" />
              </div>
              <Skeleton className="h-6 w-20 rounded mt-4 md:mt-0" />
            </div>
          )}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {Array.from({ length: limit }).map((_, i) => (
              <div key={i} className="break-inside-avoid space-y-2">
                <Skeleton className="w-full aspect-[4/3] rounded-2xl" />
                <Skeleton className="h-4 w-2/3 rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (images.length === 0) return null;

  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {showHeader && (
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-3xl font-bold text-blue-900 dark:text-blue-400 mb-2 flex items-center gap-3">
                <ImageIcon className="text-blue-600 dark:text-blue-500" size={32} />
                Media Gallery
              </h2>
              <p className="text-slate-500 dark:text-slate-400">Glimpses of our workshop activities and infrastructure.</p>
            </div>
            <Link to="/gallery" className="text-blue-600 dark:text-blue-400 font-medium hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1 transition-colors mt-4 md:mt-0 group">
              View All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {images.map((img, index) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="break-inside-avoid relative group rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <img
                src={img.imageUrl}
                alt={img.caption}
                className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              {img.caption && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <p className="text-white font-medium">{img.caption}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

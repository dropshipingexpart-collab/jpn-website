import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore, News } from '../../store';
import { X, Calendar, ArrowUpRight, Maximize2 } from 'lucide-react';

export default function LatestNews() {
  const news = useStore(state => state.news);
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  return (
    <section id="news" className="py-12 sm:py-16 px-4 sm:px-6 md:px-20 relative bg-dark-900 overflow-hidden border-y border-white/5">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-gold-500 uppercase tracking-widest text-xs font-bold mb-4 block">Press & Insights</span>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-white mb-6">Latest <span className="text-gradient-gold">News</span></h2>
            <div className="w-20 h-[1px] bg-gold-600" />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
          {news.map((item, i) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              onClick={() => setSelectedNews(item)}
              className="group cursor-pointer flex flex-col"
            >
              <div className="relative w-full aspect-[4/3] overflow-hidden rounded-xl mb-6 border border-white/5 shadow-lg group-hover:border-gold-500/30 transition-all duration-300 bg-dark-950 flex items-center justify-center">
                {/* Ambient blurred backdrop so letterboxing looks organic in cards */}
                <img
                  src={item.imageUrl}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover blur-md opacity-25 scale-105 select-none pointer-events-none"
                />
                
                {/* Full, uncropped image */}
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="max-h-full max-w-full object-contain relative z-10 filter grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-[1.02] transition-all duration-700 p-2"
                />
                
                {/* Dynamic overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4 z-20">
                  <div className="text-gold-500 font-mono text-xs uppercase tracking-widest flex items-center space-x-1">
                    <span>Read Details</span>
                    <ArrowUpRight size={14} />
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col flex-1">
                <time className="text-gold-600 text-xs uppercase tracking-widest font-medium mb-3">{new Date(item.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric'})}</time>
                <h3 className="font-display text-2xl text-white mb-3 group-hover:text-gold-400 transition-colors line-clamp-2">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-gray-400 font-light text-sm line-clamp-3">
                    {item.description}
                  </p>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {/* LATEST NEWS DETAIL MODAL */}
      <AnimatePresence>
        {selectedNews && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setSelectedNews(null);
              setIsLightboxOpen(false);
            }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl bg-dark-900 border border-gold-600/30 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(202,138,4,0.25)] cursor-default flex flex-col text-white"
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setSelectedNews(null);
                  setIsLightboxOpen(false);
                }}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-dark-800/80 border border-white/10 hover:border-gold-500 hover:text-gold-500 text-gray-400 transition-all cursor-pointer shadow-lg"
                title="Close"
              >
                <X size={18} />
              </button>

              {/* Cover Image with Full Zoom Action */}
              <div 
                className="w-full h-56 sm:h-72 md:h-96 relative overflow-hidden bg-dark-950 flex items-center justify-center border-b border-white/5 cursor-zoom-in group/cover"
                onClick={() => setIsLightboxOpen(true)}
                title="Click to view full screen"
              >
                {/* Ambient blurred backdrop so letterboxing looks organic */}
                <img
                  src={selectedNews.imageUrl}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover blur-lg opacity-30 scale-105 select-none pointer-events-none"
                />
                
                {/* Full, uncropped high-quality image */}
                <img
                  src={selectedNews.imageUrl}
                  alt={selectedNews.title}
                  className="max-w-full max-h-full object-contain relative z-10 p-4 transition-transform duration-500 group-hover/cover:scale-[1.02]"
                />
                
                {/* Subtle dark ambient shadows */}
                <div className="absolute inset-0 bg-black/10 z-10 pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-dark-900 to-transparent z-10 pointer-events-none" />
                
                {/* Hover indicator for full screen */}
                <div className="absolute bottom-4 right-4 z-20 bg-dark-950/80 border border-white/10 rounded-full px-3 py-1.5 flex items-center space-x-1.5 text-xs text-gold-400 opacity-60 group-hover/cover:opacity-100 transition-opacity">
                  <Maximize2 size={12} />
                  <span>View Full Image</span>
                </div>
              </div>

              {/* Content Space */}
              <div className="p-6 sm:p-8 flex flex-col text-left">
                <div className="flex flex-wrap items-center gap-3 text-xs text-gold-500 uppercase tracking-widest font-semibold mb-4">
                  {selectedNews.category && (
                    <span className="bg-gold-500/10 text-gold-400 px-2.5 py-1 rounded border border-gold-500/20 font-mono">
                      {selectedNews.category}
                    </span>
                  )}
                  <div className="flex items-center space-x-1.5 font-mono text-gray-400">
                    <Calendar size={14} className="text-gold-500/50" />
                    <span>{new Date(selectedNews.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric'})}</span>
                  </div>
                </div>

                <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 leading-snug">
                  {selectedNews.title}
                </h3>

                <div className="w-12 h-[1px] bg-gold-600/50 mb-4" />

                <div className="text-gray-300 text-xs sm:text-sm md:text-base font-light leading-relaxed whitespace-pre-wrap max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                  {selectedNews.description}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FULLSCREEN LIGHTBOX OPTION FOR ULTIMATE VISIBILITY */}
      <AnimatePresence>
        {selectedNews && isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsLightboxOpen(false)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-lg p-4 cursor-zoom-out"
          >
            {/* Safe zone indicators */}
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-6 right-6 z-[110] p-3 rounded-full bg-white/10 hover:bg-gold-500 hover:text-black text-white transition-all cursor-pointer shadow-2xl"
              title="Close Fullscreen View"
            >
              <X size={24} />
            </button>
            
            {/* The Image itself with high definition styles */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ ease: "easeOut", duration: 0.25 }}
              className="relative max-w-full max-h-full flex items-center justify-center p-2"
            >
              <img
                src={selectedNews.imageUrl}
                alt={selectedNews.title}
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl border border-white/10"
              />
              <div className="absolute -bottom-8 left-0 right-0 text-center text-gray-400 text-xs sm:text-sm font-light select-none">
                {selectedNews.title}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

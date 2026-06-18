import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore, Event } from '../../store';
import { X, ArrowUpRight } from 'lucide-react';

export default function EventSlider() {
  const events = useStore((state) => state.events);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  
  useEffect(() => {
    if (currentIndex >= events.length) {
      setCurrentIndex(Math.max(0, events.length - 1));
    }
  }, [events.length]);
  
  useEffect(() => {
    if (!isPlaying || events.length === 0 || selectedEvent !== null) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % events.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPlaying, events.length, selectedEvent]);

  if (events.length === 0) return null;

  const safeIndex = currentIndex < events.length && currentIndex >= 0 ? currentIndex : 0;
  const currentEvent = events[safeIndex];

  if (!currentEvent) return null;

  const nextSlide = () => {
    if (events.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % events.length);
    }
  };
  const prevSlide = () => {
    if (events.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);
    }
  };
  const togglePlay = () => setIsPlaying(!isPlaying);

  return (
    <>
      <section 
        id="events" 
        className="relative w-full h-[70svh] min-h-[500px] overflow-hidden flex items-center justify-center transition-colors duration-1000 cursor-pointer group/section" 
        style={{ backgroundColor: currentEvent.bgColor }}
        onClick={() => setSelectedEvent(currentEvent)}
      >
        
        {/* Dynamic Ambient Background Elements based on color */}
        <div 
          className="absolute inset-0 opacity-30 transition-opacity duration-1000 mix-blend-screen pointer-events-none" 
          style={{ 
            background: `radial-gradient(circle at center, ${currentEvent.bgColor} 0%, transparent 70%)` 
          }} 
        />



        <AnimatePresence mode="wait">
          <motion.div
            key={currentEvent.id}
            initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 flex flex-col md:flex-row"
          >
            {/* IMAGE SIDE */}
            <div className="w-full md:w-[62%] h-1/2 md:h-full relative overflow-hidden flex items-center justify-center bg-black/40">
              {/* Beautiful blurred background preview to avoid cropping and empty sides */}
              <img 
                src={currentEvent.imageUrl} 
                alt="" 
                className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 select-none pointer-events-none scale-105" 
                referrerPolicy="no-referrer"
              />
              <motion.div 
                initial={{ scale: 1.05 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 w-full h-full p-2 sm:p-3 md:p-4 flex items-center justify-center"
              >
                <img 
                  src={currentEvent.imageUrl} 
                  alt={currentEvent.title} 
                  className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl border border-white/10 filter brightness-95" 
                  referrerPolicy="no-referrer"
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-transparent via-dark-950/20 to-dark-950/80 pointer-events-none" />
            </div>

            {/* CONTENT SIDE */}
            <div className="w-full md:w-[38%] h-1/2 md:h-full relative flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-10 z-10 overflow-hidden">
              <div className="max-w-xl w-full">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="flex flex-col justify-center h-full"
                >
                  <div className="flex items-center space-x-4 mb-3 md:mb-4">
                    <div className="h-[1px] w-8 bg-gold-500" />
                    <span className="text-gold-500 font-bold uppercase tracking-widest text-[10px] sm:text-xs">Featured Event</span>
                  </div>
                  <h2 className="font-display text-lg sm:text-xl md:text-2xl lg:text-2xl xl:text-3xl text-white mb-3 lg:mb-4 leading-tight sm:leading-snug drop-shadow-lg group-hover/section:text-gold-400 transition-colors">
                    {currentEvent.title}
                  </h2>
                  <p className="text-gray-300 font-light text-xs sm:text-sm lg:text-sm mb-4 leading-relaxed line-clamp-3 sm:line-clamp-4 md:line-clamp-5 xl:line-clamp-6">
                    {currentEvent.description}
                  </p>
                  
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* DOTS NAVIGATION */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-20" onClick={(e) => e.stopPropagation()}>
          {events.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${index === safeIndex ? 'bg-gold-500 w-8' : 'bg-white/45 hover:bg-white/70'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* EVENT DETAIL MODAL WITH PERFECT READABILITY */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-black/90 backdrop-blur-md"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-dark-900 border border-gold-600/30 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl flex flex-col md:flex-row overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* CLOSE BUTTON */}
              <button 
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 text-white hover:text-gold-400 bg-black/60 hover:bg-black/80 p-2.5 rounded-full z-30 border border-white/10 transition-colors"
                aria-label="Close details"
              >
                <X size={20} />
              </button>

              {/* IMAGE COLUMN */}
              <div className="w-full md:w-[62%] h-[250px] md:h-auto min-h-[300px] md:min-h-[420px] relative bg-black/50 border-b md:border-b-0 md:border-r border-white/10 overflow-hidden flex items-center justify-center">
                {/* Beautiful blurred backdrop to avoid empty space */}
                <img 
                  src={selectedEvent.imageUrl} 
                  alt="" 
                  className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 select-none pointer-events-none scale-110" 
                  referrerPolicy="no-referrer"
                />
                <img 
                  src={selectedEvent.imageUrl} 
                  alt={selectedEvent.title} 
                  className="relative z-10 max-w-full max-h-full object-contain p-2 rounded-2xl filter brightness-95"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/10 to-transparent md:hidden pointer-events-none" />
              </div>

              {/* DETAIL CONTENT COLUMN - CRISP CONTRAST TEXT */}
              <div className="w-full md:w-[38%] p-6 md:p-8 flex flex-col justify-center">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-gold-500 font-bold uppercase tracking-widest text-[10px] sm:text-xs">Event Detail</span>
                  <div className="h-[1px] flex-1 bg-gold-600/20" />
                </div>
                
                <h3 className="font-display text-lg sm:text-xl md:text-2xl lg:text-3xl text-white mb-4 leading-tight">
                  {selectedEvent.title}
                </h3>
                
                <div className="w-12 h-[2px] bg-gold-600 mb-4" />
                
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 text-xs sm:text-sm leading-relaxed font-light whitespace-pre-wrap">
                    {selectedEvent.description}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

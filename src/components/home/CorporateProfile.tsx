import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store';
import { Target, Eye, Building2, Heart } from 'lucide-react';

export default function CorporateProfile() {
  const profile = useStore(state => state.profile);
  const [activeTab, setActiveTab] = useState<'mission'|'vision'|'overview'|'values'>('overview');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['mission', 'vision', 'overview', 'values'].includes(hash)) {
        setActiveTab(hash as any);
        const profileElement = document.getElementById('profile');
        if (profileElement) {
          profileElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const tabs = [
    { id: 'overview', title: 'Company Overview', icon: Building2, content: profile.overview },
    { id: 'mission', title: 'Our Mission', icon: Target, content: profile.mission },
    { id: 'vision', title: 'Our Vision', icon: Eye, content: profile.vision },
    { id: 'values', title: 'Core Values', icon: Heart, content: profile.coreValues }
  ] as const;

  return (
    <section id="profile" className="relative w-full flex flex-col justify-center px-4 sm:px-6 md:px-20 py-8 sm:py-24 bg-dark-900 overflow-hidden border-y border-white/5">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-gold-600/5 to-transparent pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1000px] h-full bg-[radial-gradient(ellipse_at_center,rgba(202,138,4,0.05)_0%,rgba(0,0,0,0)_70%)] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto w-full relative z-10">
        <div className="text-center mb-8 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-gold-500 uppercase tracking-widest text-[10px] sm:text-xs font-bold mb-2 sm:mb-4 block">Who We Are</span>
            <h2 className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-3 sm:mb-6">JPN Group <span className="text-gradient-gold">Corporate Profile</span></h2>
            <div className="w-16 sm:w-20 h-[1px] bg-gold-600 mx-auto" />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16">
          {/* Tabs */}
          <div className="col-span-1 lg:col-span-4 flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible space-x-3 lg:space-x-0 lg:space-y-4 pb-3 lg:pb-0 scrollbar-hide px-2 sm:px-0">
            {tabs.map((tab, i) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 flex items-center space-x-3 sm:space-x-4 w-44 sm:w-64 lg:w-full text-left p-3 sm:p-5 transition-all duration-300 rounded-lg sm:rounded-xl relative overflow-hidden group ${isActive ? 'glass-panel-gold border-gold-500/50 shadow-[0_0_20px_rgba(202,138,4,0.1)]' : 'glass-panel hover:bg-white/5 border-transparent hover:border-white/10'}`}
                >
                  {/* Hover gradient sweep */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold-500/10 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                  
                  <div className={`p-2 sm:p-3 rounded-md sm:rounded-lg flex-shrink-0 transition-colors ${isActive ? 'bg-gold-500 text-dark-950' : 'bg-dark-800 text-gold-500 border border-gold-600/30 group-hover:bg-dark-700'}`}>
                    <Icon className="w-4 h-4 sm:w-6 sm:h-6" />
                  </div>
                  <span className={`font-display text-xs sm:text-base md:text-xl transition-colors ${isActive ? 'text-white font-medium' : 'text-gray-400 group-hover:text-gray-200'}`}>
                    {tab.title}
                  </span>
                </motion.button>
              )
            })}
          </div>

          {/* Content Display */}
          <div className="col-span-1 lg:col-span-8 flex items-stretch">
            <div className="w-full h-full glass-panel border border-gold-600/20 rounded-xl sm:rounded-2xl relative flex flex-col justify-center min-h-[180px] sm:min-h-[350px]">
              <AnimatePresence mode="wait">
                {tabs.map((tab) => {
                  if (tab.id !== activeTab) return null;
                  return (
                    <motion.div
                      key={tab.id}
                      initial={{ opacity: 0, y: 20, filter: 'blur(5px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: -20, filter: 'blur(5px)' }}
                      transition={{ duration: 0.4 }}
                      className="p-5 sm:p-8 md:p-16 flex flex-col justify-center w-full"
                    >
                      <h3 className="font-display text-lg sm:text-2xl md:text-4xl text-white mb-2 sm:mb-6 md:mb-8 bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent w-fit font-bold">
                        {tab.title}
                      </h3>
                      <p className="text-gray-300 text-xs sm:text-base md:text-xl font-light leading-relaxed whitespace-pre-wrap">
                        {tab.content}
                      </p>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

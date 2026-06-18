import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { useStore } from '../../store';
import { JpnLogo } from './JpnLogo';

export default function Navbar({ isScrolled }: { isScrolled: boolean }) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { companies } = useStore();

  const handleMouseEnter = (menu: string) => {
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'glass-panel border-b border-white/5 py-4 bg-dark-950/80 backdrop-blur-xl' : 'bg-transparent py-6'}`}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* LOGO */}
        <Link to="/" className="z-50 flex items-center">
          <JpnLogo className="h-10 md:h-12 w-auto hover:opacity-90 transition-opacity" />
        </Link>
        
        {/* DESKTOP MENU */}
        <div className="hidden lg:flex items-center space-x-8 text-xs xl:text-sm uppercase tracking-widest font-medium text-gray-300">
          <a href="#home" className="hover:text-gold-400 transition-colors">Home</a>
          
          {/* Dropdown: Sister Concerns */}
          <div 
            className="relative h-full py-4 cursor-pointer group"
            onMouseEnter={() => handleMouseEnter('companies')}
            onMouseLeave={handleMouseLeave}
          >
            <a href="#companies" className="flex items-center hover:text-gold-400 transition-colors">
              Sister Concerns <ChevronDown size={14} className="ml-1" />
            </a>
            <AnimatePresence>
              {activeDropdown === 'companies' && (
                <motion.div
                  initial={{ opacity: 0, y: 10, rotateX: -10 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  exit={{ opacity: 0, y: 10, rotateX: -10 }}
                  transition={{ duration: 0.3 }}
                  style={{ perspective: 1000 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 w-[600px] glass-panel-gold border-gold-600/20 p-6 rounded-xl grid grid-cols-2 gap-4 origin-top shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                >
                  {companies.map(c => (
                    <Link key={c.id} to={`/company/${c.id}`} onClick={() => setActiveDropdown(null)} className="group flex items-center space-x-4 p-3 hover:bg-gold-600/10 rounded-lg transition-colors">
                      {c.logoUrl && c.logoUrl !== 'undefined' ? (
                        <img src={c.logoUrl} alt={c.name} className="w-10 h-10 object-cover rounded-md border border-gold-600/30 group-hover:scale-110 transition-transform flex-shrink-0" />
                      ) : c.imageUrl && c.imageUrl !== 'undefined' ? (
                        <img src={c.imageUrl} alt={c.name} className="w-10 h-10 object-cover rounded-md border border-gold-600/30 group-hover:scale-110 transition-transform flex-shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-md border border-gold-600/30 flex items-center justify-center bg-white/5 flex-shrink-0">
                          <span className="text-white/50 text-[10px] font-bold uppercase">{c.name ? c.name.substring(0, 3) : '---'}</span>
                        </div>
                      )}
                      <div>
                        <h4 className="text-white text-xs font-bold">{c.name}</h4>
                        <p className="text-gray-400 text-[10px] leading-tight mt-1 line-clamp-1">{c.description}</p>
                      </div>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Dropdown: Mission & Vision */}
          <div 
            className="relative h-full py-4 cursor-pointer group"
            onMouseEnter={() => handleMouseEnter('mission')}
            onMouseLeave={handleMouseLeave}
          >
            <a href="#profile" className="flex items-center hover:text-gold-400 transition-colors">
              Mission & Vision <ChevronDown size={14} className="ml-1" />
            </a>
            <AnimatePresence>
              {activeDropdown === 'mission' && (
                <motion.div
                  initial={{ opacity: 0, y: 10, rotateX: -10 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  exit={{ opacity: 0, y: 10, rotateX: -10 }}
                  transition={{ duration: 0.3 }}
                  style={{ perspective: 1000 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 w-[350px] glass-panel-gold border-gold-600/20 p-6 rounded-xl origin-top flex flex-col space-y-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                >
                  <a href="#profile" onClick={() => setActiveDropdown(null)} className="text-white hover:text-gold-400 text-xs font-bold border-b border-white/5 pb-2">Corporate Profile</a>
                  <a href="#mission" onClick={() => setActiveDropdown(null)} className="text-white hover:text-gold-400 text-xs font-bold border-b border-white/5 pb-2">Mission</a>
                  <a href="#vision" onClick={() => setActiveDropdown(null)} className="text-white hover:text-gold-400 text-xs font-bold border-b border-white/5 pb-2">Vision</a>
                  <a href="#overview" onClick={() => setActiveDropdown(null)} className="text-white hover:text-gold-400 text-xs font-bold border-b border-white/5 pb-2">Company Overview</a>
                  <a href="#values" onClick={() => setActiveDropdown(null)} className="text-white hover:text-gold-400 text-xs font-bold pb-1">Core Values</a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <a href="#news" className="hover:text-gold-400 transition-colors">News</a>
          <a href="#events" className="hover:text-gold-400 transition-colors">Events</a>
          <a href="#contact" className="hover:text-gold-400 transition-colors">Contact</a>
        </div>
        
        {/* RIGHT CTA / LOGIN */}
        <div className="hidden lg:block z-50 flex-shrink-0">
          <Link to="/admin/login" className="text-[9px] whitespace-nowrap uppercase tracking-widest text-gold-600 hover:text-gold-400 border border-gold-600/30 px-3 py-1.5 rounded-full transition-all hover:bg-gold-600/10 hover:shadow-[0_0_15px_rgba(202,138,4,0.3)]">
            Auth
          </Link>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <button 
          className="lg:hidden text-white z-50 focus:outline-none p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <div className="w-6 flex flex-col items-end space-y-1.5">
            <span className={`block h-[2px] bg-gold-500 transition-all ${isMobileMenuOpen ? 'w-6 rotate-45 translate-y-[8px]' : 'w-6'}`} />
            <span className={`block h-[2px] bg-gold-400 transition-all ${isMobileMenuOpen ? 'opacity-0' : 'w-5'}`} />
            <span className={`block h-[2px] bg-gold-300 transition-all ${isMobileMenuOpen ? 'w-6 -rotate-45 -translate-y-[8px]' : 'w-4'}`} />
          </div>
        </button>
      </div>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.4 }}
            className="fixed inset-0 bg-dark-950 z-40 lg:hidden flex flex-col pt-32 px-8 overflow-y-auto"
          >
            <div className="flex flex-col space-y-6 text-xl font-display text-white mb-12">
              <a href="#home" onClick={() => setIsMobileMenuOpen(false)}>Home</a>
              <div className="h-[1px] w-full bg-white/10" />
              <div className="text-gold-500 text-sm uppercase tracking-widest">Sister Concerns</div>
              {companies.map(c => (
                <Link key={c.id} to={`/company/${c.id}`} className="text-lg pl-4 text-gray-400" onClick={() => setIsMobileMenuOpen(false)}>{c.name}</Link>
              ))}
              <div className="h-[1px] w-full bg-white/10" />
              <div className="text-gold-500 text-sm uppercase tracking-widest">Profile</div>
              <div className="flex flex-col space-y-3 pl-4 pt-2">
                <a href="#profile" className="text-lg text-gray-400" onClick={() => setIsMobileMenuOpen(false)}>Corporate Profile</a>
                <a href="#mission" className="text-lg text-gray-400" onClick={() => setIsMobileMenuOpen(false)}>Mission</a>
                <a href="#vision" className="text-lg text-gray-400" onClick={() => setIsMobileMenuOpen(false)}>Vision</a>
                <a href="#overview" className="text-lg text-gray-400" onClick={() => setIsMobileMenuOpen(false)}>Company Overview</a>
                <a href="#values" className="text-lg text-gray-400" onClick={() => setIsMobileMenuOpen(false)}>Core Values</a>
              </div>
              <div className="h-[1px] w-full bg-white/10" />
              <a href="#news" onClick={() => setIsMobileMenuOpen(false)}>News & Updates</a>
              <a href="#contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</a>
            </div>
            <div className="mt-auto pb-12 flex justify-center">
              <Link to="/admin/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center text-sm uppercase tracking-widest text-dark-950 bg-gold-500 font-bold px-6 py-4 rounded-full transition-all">
                Internal Auth
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

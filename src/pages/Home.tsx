import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useStore, Member } from '../store';
import { ArrowRight, Briefcase, Globe, X } from 'lucide-react';

import Navbar from '../components/home/Navbar';
import EventSlider from '../components/home/EventSlider';
import CorporateProfile from '../components/home/CorporateProfile';
import SisterConcerns from '../components/home/SisterConcerns';
import LatestNews from '../components/home/LatestNews';
import { JpnLogo } from '../components/home/JpnLogo';



// Reusable Section Component
function Section({ id, children, className = "", fullHeight = true }: { id: string, children: React.ReactNode, className?: string, fullHeight?: boolean }) {
  return (
    <section id={id} className={`${fullHeight ? 'min-h-[50vh] sm:min-h-[100svh]' : ''} w-full relative z-10 flex flex-col justify-center px-4 sm:px-6 md:px-20 py-10 sm:py-24 ${className}`}>
      {children}
    </section>
  );
}

export default function Home() {
  const { members, contact } = useStore();
  const { scrollY, scrollYProgress } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once initially to check state
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Dynamic Background color overlay driven by scroll
  const bgOpacity = useTransform(scrollYProgress, [0, 0.2, 0.5, 1], [0.3, 0.7, 0.8, 0.9]);

  return (
    <div className="relative w-full bg-dark-950 font-sans text-white">
      <Navbar isScrolled={isScrolled} />

      {/* Elegant, high-performance CSS and SVG glowing assets for top visual design */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-dark-950">
        {/* Golden Glowing Ambient Blobs */}
        <div className="absolute top-[10%] left-[20%] w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-gold-600/5 rounded-full filter blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[10%] right-[20%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-gold-600/5 rounded-full filter blur-[100px] animate-pulse" style={{ animationDuration: '12s' }} />
        
        {/* Floating Sparkles/Stars */}
        <div className="absolute inset-0 opacity-40">
          {Array.from({ length: 25 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-gold-400 animate-pulse"
              style={{
                top: `${(i * 17) % 100}%`,
                left: `${(i * 23) % 100}%`,
                width: `${(i % 3) + 1}px`,
                height: `${(i % 3) + 1}px`,
                animationDuration: `${((i % 4) + 3)}s`,
                animationDelay: `${(i % 3)}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Dynamic Overlay to darken background as user scrolls down */}
      <motion.div 
        className="fixed inset-0 z-0 bg-dark-950 pointer-events-none"
        style={{ opacity: bgOpacity }}
      />

      {/* Page Content */}
      <div className="relative z-10 w-full overflow-hidden">
        
        {/* HERO */}
        <Section id="home" className="items-center text-center pt-32 pb-16" fullHeight={false}>
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-5xl"
          >
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight tracking-tight drop-shadow-2xl">
              BUILDING BANGLADESH'S FUTURE THROUGH <span className="text-gradient-gold">INNOVATION</span> & <span className="text-gradient-gold">EXCELLENCE</span>
            </h1>
            <p className="text-gray-300 text-base md:text-xl font-light mb-8 md:mb-12 max-w-2xl mx-auto drop-shadow-md">
              A diversified luxury business conglomerate leading in Consultancy, Trading, Real Estate, Agro & Biotech, and Engineering.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <a href="#companies" className="px-10 py-4 bg-gold-600 text-dark-950 font-bold uppercase tracking-widest text-sm rounded-none hover:bg-gold-500 transition-colors shadow-[0_0_20px_rgba(202,138,4,0.4)]">
                Explore Businesses
              </a>
              <a href="#contact" className="px-10 py-4 glass-panel border border-gold-600/50 text-gold-500 font-bold uppercase tracking-widest text-sm hover:bg-gold-600/10 transition-colors">
                Contact Us
              </a>
            </div>
          </motion.div>
          

        </Section>

        <EventSlider />
        <CorporateProfile />





        <SisterConcerns />


        {/* TEAM SECTION */}
        <Section id="teams" className="bg-dark-900/50 backdrop-blur-sm border-y border-white/5" fullHeight={false}>
          <div className="max-w-[1440px] mx-auto w-full">
            <div className="text-center mb-20">
              <span className="text-gold-500 uppercase tracking-widest text-xs font-bold mb-4 block">The Visionaries</span>
              <h2 className="font-display text-4xl md:text-6xl text-white mb-6">Our Team <span className="text-gradient-gold">Members</span></h2>
              <div className="w-20 h-[1px] bg-gold-600 mx-auto mb-6" />
              <p className="text-gray-400 max-w-2xl mx-auto font-light">The visionaries steering JPN Group towards global distinction.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 max-w-7xl mx-auto px-4 sm:px-0">
              {members.map((member, i) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                  onClick={() => setSelectedMember(member)}
                  className="group bg-white rounded-xl p-5 shadow-[0_10px_25px_rgba(0,0,0,0.1)] border border-gray-100 flex flex-col justify-between text-left hover:shadow-[0_15px_30px_rgba(0,0,0,0.15)] hover:-translate-y-1 hover:border-gold-500/50 transition-all duration-300 w-full cursor-pointer"
                >
                  {/* Top Block: Side-by-side Image & Name */}
                  <div className="flex items-start space-x-4">
                    {/* Member image with rectangular frame */}
                    <div className="w-28 h-32 sm:w-32 sm:h-36 flex-shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                      <img 
                        src={member.imageUrl} 
                        alt={member.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                      />
                    </div>

                    {/* Member name alongside the image */}
                    <div className="flex-1 py-1">
                      <h3 className="font-sans text-sm sm:text-base md:text-lg font-bold text-gray-900 leading-snug group-hover:text-gold-600 transition-colors">
                        {member.name}
                      </h3>
                    </div>
                  </div>

                  {/* Divider line exactly like professional designs */}
                  <div className="w-full h-[1px] bg-gray-100 my-4" />

                  {/* Bottom Block: Position & Group name */}
                  <div className="flex flex-col">
                    <p className="text-gray-900 text-xs sm:text-sm font-bold tracking-tight leading-snug uppercase">
                      {member.position}
                    </p>
                    {member.groupName && (
                      <p className="text-gray-500 text-[10px] sm:text-xs font-semibold uppercase tracking-wider mt-1">
                        {member.groupName}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>
        
        <LatestNews />

        {/* CONTACT SECTION */}
        <Section id="contact" className="bg-dark-900 border-y border-white/5" fullHeight={false}>
          <div className="max-w-[1440px] mx-auto w-full">
            <div className="flex flex-col items-center text-center">
              <div className="max-w-2xl w-full mb-12">
                <span className="text-gold-500 uppercase tracking-widest text-xs font-bold mb-4 block">Get In Touch</span>
                <h2 className="font-display text-4xl md:text-6xl text-white mb-6">Contact <span className="text-gradient-gold">Us</span></h2>
                <div className="w-20 h-[1px] bg-gold-600 mx-auto mb-8" />
                <p className="text-gray-400 font-light leading-relaxed max-w-lg mx-auto">
                  Partner with us to create sustainable value. Our team is ready to discuss strategic opportunities, investor relations, and media inquiries.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-center items-center sm:items-start gap-12 max-w-3xl w-full text-center">
                <div className="flex flex-col items-center space-y-3 flex-1">
                  <div className="w-12 h-12 rounded-full border border-gold-600/30 flex items-center justify-center text-gold-500 bg-gold-600/10 flex-shrink-0 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                    <Globe size={20} />
                  </div>
                  <div>
                    <h4 className="text-white text-sm font-bold uppercase tracking-widest mb-1">Global Headquarters</h4>
                    <p className="text-gray-400 font-light text-sm leading-relaxed whitespace-pre-line">
                      {contact?.address || "JPN Tower, 123 Luxury Avenue,\nCommercial District, Dhaka, Bangladesh"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-center space-y-3 flex-1">
                  <div className="w-12 h-12 rounded-full border border-gold-600/30 flex items-center justify-center text-gold-500 bg-gold-600/10 flex-shrink-0 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                     <span className="font-bold text-lg">@</span>
                  </div>
                  <div>
                    <h4 className="text-white text-sm font-bold uppercase tracking-widest mb-1">Contact Details</h4>
                    <p className="text-gray-400 font-light text-sm leading-relaxed whitespace-pre-line">
                      {contact?.email?.split(',').map(e => e.trim()).join('\n') || "investors@jpngroup.bd\ninfo@jpngroup.bd"}
                      {contact?.phone && `\nPhone: ${contact.phone}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* FOOTER */}
        <footer className="w-full bg-dark-950 border-t border-white/10 pt-20 pb-10 px-6 md:px-20 relative z-10 glass-panel">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 max-w-[1440px] mx-auto">
            <div className="col-span-1 md:col-span-2">
              <div className="mb-6">
                <JpnLogo className="h-10 md:h-12 w-auto" />
              </div>
              <p className="text-gray-400 font-light max-w-sm mb-8 leading-relaxed">
                Building Bangladesh's future through unwavering commitment to innovation, quality, and excellence across diverse global industries.
              </p>
              <div className="flex items-center space-x-4">
              </div>
            </div>
            
            <div className="col-span-1">
              <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-6">Quick Links</h4>
              <p className="text-gray-400 font-light text-sm flex flex-col space-y-3">
                <a href="#profile" className="hover:text-gold-400 transition-colors w-fit">About Us</a>
                <a href="#companies" className="hover:text-gold-400 transition-colors w-fit">Sister Concerns</a>
                <a href="#news" className="hover:text-gold-400 transition-colors w-fit">News & Updates</a>
              </p>
            </div>

            <div className="col-span-1">
              <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-6">Connect</h4>
              <p className="text-gray-400 font-light text-sm space-y-2 flex flex-col">
                {contact?.email?.split(',').map((e, index) => (
                  <a key={index} href={`mailto:${e.trim()}`} className="hover:text-gold-400 transition-colors w-fit block">{e.trim()}</a>
                )) || (
                  <a href="mailto:info@jpngroup.bd" className="hover:text-gold-400 transition-colors w-fit">info@jpngroup.bd</a>
                )}
                {contact?.phone && (
                  <a href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`} className="hover:text-gold-400 transition-colors w-fit block">{contact.phone}</a>
                )}
              </p>

            </div>
          </div>
          
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 uppercase tracking-wider font-medium max-w-[1440px] mx-auto">
            <p>&copy; {new Date().getFullYear()} JPN Group BD. All Rights Reserved.</p>
            <div className="space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-gold-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-gold-400 transition-colors">Terms of Service</a>
            </div>
          </div>
        </footer>

      </div>

      {/* TEAM MEMBER DETAIL MODAL */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMember(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md cursor-pointer"
          >
            {/* Modal Content container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl bg-dark-900 border border-gold-600/30 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(202,138,4,0.25)] cursor-default flex flex-col md:flex-row text-white"
            >
              {/* Close button with subtle hover animation */}
              <button
                onClick={() => setSelectedMember(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-dark-800/80 border border-white/10 hover:border-gold-500 hover:text-gold-500 text-gray-400 transition-all cursor-pointer shadow-lg"
                title="Close"
              >
                <X size={18} />
              </button>

              {/* Photo layout frame with back drop decoration */}
              <div className="w-full md:w-[45%] h-60 sm:h-64 md:h-auto bg-dark-950 flex flex-col items-center justify-center p-6 border-b md:border-b-0 md:border-r border-white/5 relative group/img overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent opacity-60 pointer-events-none" />
                <div className="w-full h-full relative z-10 flex items-center justify-center">
                  <img
                    src={selectedMember.imageUrl}
                    alt={selectedMember.name}
                    className="max-h-full max-w-full object-contain rounded-lg shadow-2xl transition-transform duration-700 group-hover/img:scale-105"
                  />
                </div>
              </div>

              {/* Detailed professional bio and title fields */}
              <div className="w-full md:w-[55%] p-6 sm:p-8 flex flex-col justify-center text-left">
                <span className="text-gold-500 uppercase tracking-widest text-[10px] sm:text-xs font-bold mb-2 block font-mono">
                  {selectedMember.groupName || "JPN GROUP BD"}
                </span>
                
                <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 leading-snug">
                  {selectedMember.name}
                </h3>
                
                <p className="text-gold-400 text-xs sm:text-sm font-semibold uppercase tracking-widest mb-3">
                  {selectedMember.position}
                </p>

                {selectedMember.department && (
                  <p className="text-gray-400 text-[10px] sm:text-xs font-mono mb-4 bg-white/5 px-2.5 py-0.5 rounded border border-white/5 w-fit">
                    {selectedMember.department}
                  </p>
                )}

                {selectedMember.bio && (
                  <>
                    <div className="w-12 h-[1px] bg-gold-600/50 mb-4" />

                    <h4 className="text-[10px] uppercase tracking-widest text-gold-500/50 font-bold mb-1.5 font-mono">
                      Biography / Profile
                    </h4>
                    
                    <p className="text-gray-300 text-xs sm:text-sm font-light leading-relaxed whitespace-pre-wrap max-h-[140px] overflow-y-auto pr-2 custom-scrollbar">
                      {selectedMember.bio}
                    </p>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

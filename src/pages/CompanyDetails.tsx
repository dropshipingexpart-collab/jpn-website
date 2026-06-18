import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store';
import { ArrowLeft, CheckCircle2, ChevronRight } from 'lucide-react';
import { JpnLogo } from '../components/home/JpnLogo';

export default function CompanyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const company = useStore(state => state.companies.find(c => c.id === id));

  // Automatic scroll-to-top on mount to prevent stale or cut-off viewport position
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  if (!company) {
    return (
      <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-3xl font-display text-white mb-4">Company Not Found</h1>
        <button onClick={() => navigate('/')} className="text-gold-500 hover:text-white flex items-center space-x-2 transition-colors">
          <ArrowLeft size={20} />
          <span>Return Home</span>
        </button>
      </div>
    );
  }

  // Parse description lines for elegant bullet rendering
  const descriptionLines = company.description
    ? company.description.split(/\n+/).map(line => line.trim()).filter(Boolean)
    : [];

  return (
    <div className="min-h-screen bg-dark-950 font-sans selection:bg-gold-500/30 selection:text-white relative overflow-x-hidden flex flex-col">
      
      {/* Decorative Subtle Gold Ambient Glow Blobs in the background */}
      <div className="absolute top-[10%] left-[5%] w-[400px] h-[400px] bg-gold-600/5 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-gold-600/5 rounded-full filter blur-[120px] pointer-events-none" />

      {/* Navigation Bar with Solid Backdrop Blur - completely guarantees no visual overlap */}
      <nav className="fixed w-full top-0 left-0 z-50 transition-all duration-300 bg-dark-950/95 backdrop-blur-md border-b border-white/10 py-5">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex justify-between items-center w-full">
          {/* Brand Logo Link to Home */}
          <Link to="/" className="flex items-center">
            <JpnLogo className="h-8 md:h-10 w-auto hover:opacity-90 transition-opacity" />
          </Link>
          
          {/* Elegant Back to Home button */}
          <button 
            onClick={() => navigate('/')} 
            className="text-gold-500 flex items-center space-x-2 hover:text-white transition-colors group"
          >
            <ArrowLeft size={18} className="transform group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold tracking-widest uppercase text-xs sm:text-sm">Back to Home</span>
          </button>
        </div>
      </nav>

      {/* Main Container - Padded down with mt-32/pt-12 to push everything way below the sticky header area */}
      <main className="max-w-[1440px] mx-auto w-full px-6 md:px-12 pt-32 pb-24 relative z-10 flex-grow">
        
        {/* Breadcrumbs for visual pathing and extra buffer space */}
        <div className="flex items-center space-x-2 text-gray-400 text-xs uppercase tracking-widest mb-10">
          <Link to="/" className="hover:text-gold-500 transition-colors">Home</Link>
          <ChevronRight size={12} className="text-gray-600" />
          <span className="hover:text-gold-500 transition-colors cursor-pointer" onClick={() => navigate('/#companies')}>Sister Concerns</span>
          <ChevronRight size={12} className="text-gray-600" />
          <span className="text-gold-400 font-medium truncate max-w-[200px]">{company.name}</span>
        </div>

        {/* STUNNING UN-CROPPED HERO BANNER: Displaying full-width company banner without any cropping */}
        {company.imageUrl && company.imageUrl !== 'undefined' && company.imageUrl !== '' && (
          <div className="w-full mb-12 rounded-3xl overflow-hidden border border-white/10 bg-dark-900/40 p-1 sm:p-2 shadow-[0_20px_50px_rgba(0,0,0,0.4)] relative group">
            <img 
              src={company.imageUrl} 
              alt={`${company.name} Corporate Banner`} 
              className="w-full h-auto rounded-2xl object-contain max-h-[580px] mx-auto block"
              referrerPolicy="no-referrer"
            />
            {/* Subtle overlay border */}
            <div className="absolute inset-0 pointer-events-none rounded-3xl border border-gold-600/10" />
          </div>
        )}

        {/* Dynamic Split Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20 items-start">
          
          {/* LEFT COLUMN: Sticky Panel with high-contrast branding */}
          <div className="lg:col-span-5 lg:sticky lg:top-36 flex flex-col items-center justify-center bg-dark-900 border border-white/5 rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <div className="text-center">
              <span className="text-gold-500 font-bold uppercase tracking-widest text-[10px] sm:text-xs mb-3 block">
                Sister Concern of JPN Group BD
              </span>
              <h2 className="text-white font-display text-2xl font-semibold mb-2">
                {company.name}
              </h2>
              <div className="w-12 h-0.5 bg-gold-600/50 mx-auto mt-4" />
            </div>
          </div>

          {/* RIGHT COLUMN: Rich Services / Description listings with pristine contrast */}
          <div className="lg:col-span-7 flex flex-col">
            
            {/* Small corporate section badge */}
            <div className="inline-flex items-center space-x-3 mb-4">
              <span className="text-gold-500 font-bold uppercase tracking-widest text-xs">Division profile</span>
              <div className="h-[1px] w-12 bg-gold-600/30" />
            </div>

            {/* Main title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-medium text-white mb-6 leading-tight">
              {company.name}
            </h1>

            {/* Divider */}
            <div className="w-20 h-1 bg-gradient-to-r from-gold-600 to-gold-400 mb-10 rounded-full shadow-[0_0_10px_rgba(212,175,55,0.4)]" />

            {/* DYNAMIC READABLE LIST OF SERVICES */}
            <div className="space-y-4 w-full">
              {descriptionLines.length > 1 ? (
                <>
                  <h3 className="text-white text-md font-bold uppercase tracking-wider mb-6">
                    Our Specialized Services & Solutions
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-4 w-full">
                    {descriptionLines.map((line, index) => (
                      <div 
                        key={index} 
                        className="flex items-start space-x-4 bg-dark-900 border border-white/5 rounded-2xl p-5 shadow-lg hover:border-gold-500/20 transition-all duration-300 group"
                      >
                        <div className="w-6 h-6 mt-1 rounded-full flex items-center justify-center text-gold-500 bg-gold-600/15 flex-shrink-0 group-hover:bg-gold-600/25 transition-colors">
                          <CheckCircle2 size={15} className="text-gold-400" />
                        </div>
                        <span className="text-gray-200 text-sm sm:text-base md:text-lg font-light leading-relaxed">
                          {line}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                /* Paragraph-style description block */
                <p className="text-gray-300 text-base sm:text-lg md:text-xl leading-relaxed font-light whitespace-pre-wrap">
                  {company.description}
                </p>
              )}
            </div>

          </div>

        </div>
      </main>

    </div>
  );
}

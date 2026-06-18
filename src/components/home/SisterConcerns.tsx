import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useStore } from "../../store";
import { ArrowRight } from "lucide-react";

export default function SisterConcerns() {
  const navigate = useNavigate();
  const companies = useStore((state) => state.companies);

  return (
    <section
      id="companies"
      className="py-12 sm:py-16 px-4 sm:px-6 md:px-20 relative bg-dark-950 overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1440px] mx-auto">
        <div className="text-center mb-8 sm:mb-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-gold-500 uppercase tracking-widest text-xs font-bold mb-4 block">
              Our Expanding Network
            </span>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-white mb-6">
              Sister <span className="text-gradient-gold">Concerns</span>
            </h2>
            <div className="w-20 h-[1px] bg-gold-600 mx-auto" />
          </motion.div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 relative z-10">
          {companies.map((company, i) => (
            <motion.div
              key={company.id}
              id={`company-${company.id}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              onClick={() => navigate(`/company/${company.id}`)}
              className="group relative h-36 sm:h-48 md:h-[300px] glass-panel md:rounded-2xl rounded-xl overflow-hidden cursor-pointer"
              style={{ perspective: "1000px" }}
            >
              {/* Background Image that zooms on hover */}
              <div className="absolute inset-0 flex items-center justify-center p-2 md:p-8">
                {(company.imageUrl && company.imageUrl !== 'undefined' && company.imageUrl !== '') || (company.logoUrl && company.logoUrl !== 'undefined' && company.logoUrl !== '') ? (
                  <img
                    src={(company.imageUrl && company.imageUrl !== 'undefined' && company.imageUrl !== '') ? company.imageUrl : company.logoUrl}
                    alt={company.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-110 transition-all duration-1000 ease-out"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gold-600/5 to-gold-500/10 flex items-center justify-center rounded-xl">
                    <span className="font-display font-bold text-3xl md:text-5xl text-gold-500/40 select-none">
                      {company.name ? company.name.substring(0, 3).toUpperCase() : 'JPN'}
                    </span>
                  </div>
                )}
              </div>

              {/* 3D floating content container */}
              <div className="absolute inset-0 flex flex-col p-3 md:p-8 bg-gradient-to-t from-dark-950/80 via-transparent to-transparent group-hover:from-dark-950/90 transition-all duration-500">
                {/* Spacer to replace Floating Logo to keep layout bottom-aligned */}
                <div className="mb-auto"></div>

                <div className="transform translate-y-4 md:translate-y-8 group-hover:translate-y-0 transition-all duration-500">
                  <h3 className="font-display text-xs md:text-2xl text-white mb-1 md:mb-3 group-hover:text-gold-400 transition-colors line-clamp-2 md:line-clamp-none">
                    {company.name}
                  </h3>

                  <div className="w-full h-[1px] bg-white/10 mb-2 md:mb-6 group-hover:bg-gold-500/30 transition-colors hidden md:block" />

                  {/* No explore text to keep design clean */}
                </div>
              </div>

              {/* Gold border shine effect */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-gold-500/30 rounded-2xl transition-colors duration-500 pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

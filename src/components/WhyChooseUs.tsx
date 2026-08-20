import React from 'react';
import { whyChooseUsData } from '../data/farmData';
import { TestimonialCarousel } from './TestimonialCarousel';
import { CustomerTestimonials } from './CustomerTestimonials';
import { ShieldCheck, MapPin, Truck, SunMedium, Users, TrendingUp, CheckCircle2 } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-emerald-700" />;
      case 'MapPin':
        return <MapPin className="w-6 h-6 text-emerald-700" />;
      case 'Truck':
        return <Truck className="w-6 h-6 text-emerald-700" />;
      case 'SunMedium':
        return <SunMedium className="w-6 h-6 text-emerald-700" />;
      case 'Users':
        return <Users className="w-6 h-6 text-emerald-700" />;
      case 'TrendingUp':
        return <TrendingUp className="w-6 h-6 text-emerald-700" />;
      default:
        return <CheckCircle2 className="w-6 h-6 text-emerald-700" />;
    }
  };

  return (
    <section id="why-us" className="py-12 lg:py-16 bg-transparent text-[#FDFBF5] relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#4A7C59]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        {/* Header */}
        

        {/* 6 Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {whyChooseUsData.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#0A2217] hover:bg-[#071810] rounded-2xl p-6 sm:p-7 border border-white/10 hover:border-[#D4AF37]/40 transition-all duration-300 flex flex-col justify-between group shadow-xl"
            >
              <div>
                <div className="w-12 h-12 rounded-full bg-[#D4AF37] text-[#0D2B1D] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform shadow-md">
                  {getIcon(item.iconName)}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2.5 font-['Outfit',sans-serif]">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#FDFBF5]/70 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-[#FDFBF5]/50">
                <span className="uppercase tracking-wider font-semibold text-[#D4AF37]">Pillar 0{idx + 1}</span>
                <span className="text-[#FDFBF5]/70 font-medium">Kaduna, Nigeria</span>
              </div>
            </div>
          ))}
        </div>

        {/* Auto-playing Testimonial Carousel for Kaduna Caterers & Families */}
        <TestimonialCarousel />

        {/* Full Community Review Feed with Photos and Ratings */}
        <CustomerTestimonials />

        {/* Agribusiness verification banner */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-[#0A2217] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left shadow-2xl">
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-[#D4AF37] uppercase tracking-[0.2em]">
              Commitment to Verifiable Truth
            </h4>
            <p className="text-xs sm:text-sm text-[#FDFBF5]/75 max-w-2xl">
              YIFA Farms adheres to transparent animal nutrition and genuine farm practices without making misleading chemical-free claims.
            </p>
          </div>
          <a
            href="#contact"
            className="px-6 py-3.5 rounded-full bg-[#D4AF37] hover:bg-[#E5C158] text-[#0D2B1D] font-bold text-xs uppercase tracking-widest whitespace-nowrap shrink-0 transition-all shadow-md"
          >
            Connect With Our Team
          </a>
        </div>
      </div>
    </section>
  );
};


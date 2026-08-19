import React from 'react';
import { facilitiesData } from '../data/farmData';
import { ShieldCheck, Wind, Droplets, Snowflake, Sparkles } from 'lucide-react';
import { ClientConfirmBadge } from './ClientConfirmBadge';

export const FarmFacilitiesSection: React.FC = () => {
  return (
    <section id="farm" className="py-12 lg:py-16 bg-transparent text-[#FDFBF5] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="h-[1px] w-6 bg-[#D4AF37]"></span>
            <span className="text-[#D4AF37] text-xs font-bold tracking-[0.25em] uppercase">Farm Operations & Infrastructure</span>
            <span className="h-[1px] w-6 bg-[#D4AF37]"></span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#FDFBF5] tracking-tight uppercase">
            Inside YIFA Farms
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#FDFBF5]/75 leading-relaxed">
            Take a look into our Kaduna agribusiness facility — purpose-built for clean poultry management, biosecure egg grading, and irrigated crop production.
          </p>
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {facilitiesData.map((facility, index) => (
            <div
              key={facility.id}
              className="group bg-[#0D2B1D] rounded-2xl overflow-hidden border border-white/10 shadow-xl hover:shadow-2xl hover:border-[#D4AF37]/40 transition-all duration-300 flex flex-col"
            >
              {/* Image with Placeholder Indicator */}
              <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-black/40">
                <img
                  src={facility.image}
                  alt={facility.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 filter brightness-90 contrast-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D2B1D] via-[#0D2B1D]/40 to-transparent"></div>

                {/* Metric pill */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-[#0D2B1D]/90 text-[#D4AF37] text-xs font-bold border border-[#D4AF37]/40 backdrop-blur-sm shadow-sm">
                    {facility.metric}
                  </span>
                </div>

                {/* Client Photo Marker */}
                <div className="absolute top-4 right-4">
                  <ClientConfirmBadge label="FARM PHOTO PLACEHOLDER" />
                </div>

                {/* Title */}
                <div className="absolute bottom-4 left-6 right-6 text-white">
                  <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.2em] block mb-1">
                    Facility Unit 0{index + 1}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white font-['Outfit',sans-serif]">
                    {facility.title}
                  </h3>
                </div>
              </div>

              {/* Description */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-sm sm:text-base text-[#FDFBF5]/75 leading-relaxed">
                  {facility.description}
                </p>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-[#FDFBF5]/60">
                  <span className="flex items-center gap-1.5 font-semibold text-[#D4AF37]">
                    <ShieldCheck className="w-4 h-4 text-[#4A7C59]" />
                    Continuous Biosecurity Protocol
                  </span>
                  <span className="italic">Kaduna State</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Environmental Stewardship Note */}
        <div className="mt-12 p-6 rounded-2xl bg-[#0D2B1D] border border-white/10 text-center max-w-4xl mx-auto shadow-lg">
          <p className="text-xs sm:text-sm text-[#FDFBF5]/70 leading-relaxed">
            <strong className="text-[#D4AF37] font-semibold">Note on farm visits:</strong> In compliance with standard poultry biosecurity regulations to protect bird health from external contamination, physical farm tours in Kaduna require advance appointment booking with our management team.
          </p>
        </div>
      </div>
    </section>
  );
};

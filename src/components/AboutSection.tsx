import React from 'react';
import { useFarmConfig } from '../context/FarmConfigContext';
import pic1 from "../assets/images/pic1.jpg";
import pic2 from "../assets/images/pic2.jpg";
import { Calendar, User, MapPin, Award, CheckCircle2, ShieldCheck, HeartHandshake, Sprout } from 'lucide-react';
import { ClientConfirmBadge } from './ClientConfirmBadge';

export const AboutSection: React.FC = () => {
  const { config } = useFarmConfig();

  return (
    <section id="about" className="py-12 lg:py-16 bg-transparent text-[#FDFBF5] relative overflow-hidden">
      {/* Decorative dark glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#4A7C59]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 mb-3">
            
            
          </div>
          
         
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Visual Story & Farm Founder card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <img
                src={pic1}
                alt="Agricultural supervisor inspecting crops and poultry"
                className="w-full h-96 object-cover object-center filter brightness-90 contrast-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#091F15] via-[#091F15]/40 to-transparent"></div>
              
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-9 h-9 rounded-full bg-[#D4AF37] text-[#0D2B1D] font-bold flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#D4AF37]">
                      Founder & Lead Agriculturist
                    </div>
                    <div className="text-lg font-bold text-[#FDFBF5]">
                      {config.founderName}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-[#FDFBF5]/80 mt-2 italic leading-relaxed">
                  &ldquo;Our goal from day one in Kaduna has been simple: produce real, wholesome food that every family and caterer can trust without doubt.&rdquo;
                </p>
              </div>
            </div>

            {/* Quick Farm Milestones Card */}
            <div className="bg-[#0D2B1D] rounded-2xl p-6 border border-white/10 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-[#FDFBF5]/80">
                  <Calendar className="w-4 h-4 text-[#D4AF37]" />
                  <span>Year Established</span>
                </div>
                <span className="font-extrabold text-[#D4AF37] text-base">{config.foundedYear}</span>
              </div>

              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-[#FDFBF5]/80">
                  <MapPin className="w-4 h-4 text-[#D4AF37]" />
                  <span>Primary Base</span>
                </div>
                <span className="font-semibold text-[#FDFBF5] text-xs">Kaduna State, Nigeria</span>
              </div>

              {/* Bird capacity stat - with Client to Confirm banner */}
              <div className="border-b border-white/10 pb-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#FDFBF5]/80">Flock Capacity</span>
                  <ClientConfirmBadge label="BIRD COUNT CONFIRMATION" />
                </div>
                <p className="text-xs text-[#FDFBF5]/70">
                  {config.isBirdCapacityConfirmed ? (
                    <span className="font-semibold text-white">{config.birdCapacityText}</span>
                  ) : (
                    <span className="italic text-[#FDFBF5]/60">
                      {config.birdCapacityText} <span className="text-[#D4AF37] font-semibold">[Pending client audit]</span>
                    </span>
                  )}
                </p>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs uppercase tracking-wider font-semibold text-[#FDFBF5]/80">Primary Output</span>
                <span className="text-[11px] font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-[#4A7C59]/30 text-[#4EFA8B] border border-[#4A7C59]/50">
                  Eggs • Poultry • Veggies
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Mission & Philosophy Breakdown */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-[#FDFBF5] mb-3">
                The YIFA Story: Bridging Farm Freshness & Reliable Urban Supply
              </h3>
              <p className="text-base text-[#FDFBF5]/75 leading-relaxed">
                In 2018, Abubakar Ibrahim identified a critical gap across Kaduna’s food supply chain: households, restaurants, and wholesalers struggled to find consistently fresh, hygienically reared poultry and crisp vegetables that didn’t sit for days in unrefrigerated transit.
              </p>
              <p className="mt-3 text-base text-[#FDFBF5]/75 leading-relaxed">
                YIFA Farms was founded to bridge that gap with direct farm-to-table logistics, dedicated borehole irrigation, modern layer pens, and structured cold-chain freezing. We prioritize clean management practices over rushed shortcuts.
              </p>
            </div>

            {/* 3 Farm Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#0D2B1D] rounded-xl p-5 border border-white/10 hover:border-[#D4AF37]/40 transition-all">
                <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center font-bold text-xs mb-3 border border-[#D4AF37]/30">
                  01
                </div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#FDFBF5] mb-1.5">
                  Sanitary Husbandry
                </h4>
                <p className="text-xs text-[#FDFBF5]/65 leading-relaxed">
                  Strict biosecurity, clean water filtration, and balanced grain diets ensuring naturally healthy birds.
                </p>
              </div>

              <div className="bg-[#0D2B1D] rounded-xl p-5 border border-white/10 hover:border-[#4A7C59]/50 transition-all">
                <div className="w-8 h-8 rounded-full bg-[#4A7C59]/20 text-[#4A7C59] flex items-center justify-center font-bold text-xs mb-3 border border-[#4A7C59]/30">
                  02
                </div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#FDFBF5] mb-1.5">
                  Speed to Kitchen
                </h4>
                <p className="text-xs text-[#FDFBF5]/65 leading-relaxed">
                  Eggs collected daily; vegetables harvested before daybreak to preserve vitamins and natural crunch.
                </p>
              </div>

              <div className="bg-[#0D2B1D] rounded-xl p-5 border border-white/10 hover:border-[#D4AF37]/40 transition-all">
                <div className="w-8 h-8 rounded-full bg-white/10 text-[#FDFBF5] flex items-center justify-center font-bold text-xs mb-3 border border-white/20">
                  03
                </div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#FDFBF5] mb-1.5">
                  Predictable Logistics
                </h4>
                <p className="text-xs text-[#FDFBF5]/65 leading-relaxed">
                  Reliable delivery schedules for hotels, supermarkets, and catering vendors across Kaduna metropolis.
                </p>
              </div>
            </div>

            {/* Farm Philosophy Quote Box */}
            <div className="bg-[#0D2B1D] text-[#FDFBF5] rounded-2xl p-6 sm:p-7 border border-[#D4AF37]/30 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-xl pointer-events-none"></div>
              <div className="flex items-start gap-4 relative z-10">
                <div className="p-2.5 rounded-full bg-[#D4AF37] text-[#0D2B1D] font-bold shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-[#D4AF37]">
                    Our Operational Transparency
                  </h4>
                  <p className="mt-2 text-sm text-[#FDFBF5]/85 leading-relaxed">
                    We stand on verifiable facts: genuine good feed, fresh clean borehole water, veterinary checks, and spotless handling. We treat our clients as partners in building Nigeria's food independence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

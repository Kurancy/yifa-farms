import React from 'react';
import { useFarmConfig } from '../context/FarmConfigContext';
import heroLivestockImg from '../assets/images/hero_farm_animals_1787046783503.jpg';
import { PageType } from '../types';
import {
  MessageCircle,
  Sparkles,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Award
} from 'lucide-react';

interface HeroProps {
  onNavigate: (page: PageType) => void;
  onOpenQuote: () => void;
  onSelectCategory: (cat: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate, onOpenQuote, onSelectCategory }) => {
  const { config } = useFarmConfig();

  return (
    <section className="relative min-h-[92vh] lg:min-h-screen flex flex-col justify-between pt-28 pb-12 lg:pt-32 lg:pb-14 bg-[#071810] text-[#FDFBF5] overflow-hidden">
      {/* Background with Chicken, Fish, Ram, and Goat Livestock Photography */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={heroLivestockImg}
          alt="YIFA Farms Kaduna livestock - Healthy Chicken, Aquaculture Fish, Northern Ram, and Farm Goat"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center sm:object-[center_right] filter brightness-[0.70] contrast-110 saturate-[1.15] scale-100 hover:scale-105 transition-transform duration-1000"
        />
        {/* Left-to-Right directional gradient for maximum text contrast on the left & clear animal visibility on the right */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#071810] via-[#071810]/85 sm:via-[#071810]/65 sm:to-[#071810]/20 to-[#071810]/60 z-10"></div>
        {/* Bottom and Top Vignettes */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#071810] via-transparent to-[#071810]/70 z-10 pointer-events-none"></div>
        <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_70%_40%,#D4AF37_0%,transparent_60%)] z-10 pointer-events-none"></div>
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 my-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Headlines & Primary Actions (7 cols) */}
          <div className="lg:col-span-8 max-w-3xl">
            {/* Gold Divider & Trust Line */}
            <div className="flex items-center gap-3 mb-6">
              <span className="h-[1px] w-8 bg-[#D4AF37]"></span>
              <span className="text-[#D4AF37] text-xs font-bold tracking-[0.3em] uppercase">Est. 2018</span>
              <span className="text-white/30">•</span>
              <span className="text-xs uppercase tracking-widest text-[#FDFBF5]/80 flex items-center gap-1.5 font-medium">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" /> Kaduna, Nigeria
              </span>
            </div>

            {/* Main Headline strictly matching Sophisticated Dark design */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[0.95] mb-6 uppercase text-white drop-shadow-md">
              QUALITY FOOD.<br />
              <span className="text-[#4A7C59]">GROWN WITH</span><br />
              PURPOSE.
            </h1>

            {/* Subtext highlighting all key farm specialities */}
            <p className="max-w-xl text-base sm:text-lg text-[#FDFBF5]/90 leading-relaxed mb-6 font-normal drop-shadow-sm">
              Founded by Abubakar Ibrahim, <strong className="text-[#FDFBF5] font-bold">YIFA Farms</strong> supplies trusted poultry, fresh eggs, prime rams, goats, aquaculture fish, and field vegetables directly from our farm in Kaduna.
            </p>

            {/* Tagline highlight */}
            <div className="mb-8 text-xs sm:text-sm font-medium text-[#D4AF37] italic flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>&ldquo;{config.tagline}&rdquo;</span>
            </div>

            {/* Action Buttons & Sector Badges */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-8">
              <button
                type="button"
                onClick={() => onNavigate('quote')}
                className="px-8 py-4 bg-[#D4AF37] hover:bg-[#E5C158] text-[#0D2B1D] rounded-full text-xs font-bold tracking-widest uppercase transition-all shadow-xl hover:shadow-[#D4AF37]/30 active:scale-95 cursor-pointer"
              >
                REQUEST A QUOTE
              </button>

              <button
                type="button"
                onClick={() => onNavigate('products')}
                className="px-8 py-4 bg-[#0A2217]/80 backdrop-blur-sm border border-white/25 rounded-full text-xs font-bold tracking-widest uppercase text-[#FDFBF5] hover:bg-white hover:text-[#0D2B1D] transition-all shadow-md cursor-pointer"
              >
                EXPLORE PRODUCTS
              </button>

              {/* 4 Featured Animals Quick Visual Stack */}
              <div className="flex items-center gap-2.5 pl-1 py-1">
                <div className="flex -space-x-2">
                  <span className="w-8 h-8 rounded-full border-2 border-[#0D2B1D] bg-[#D4AF37] flex items-center justify-center text-sm shadow-md" title="Chicken & Poultry">
                    🐓
                  </span>
                  <span className="w-8 h-8 rounded-full border-2 border-[#0D2B1D] bg-[#4A7C59] flex items-center justify-center text-sm shadow-md" title="Aquaculture Fish">
                    🐟
                  </span>
                  <span className="w-8 h-8 rounded-full border-2 border-[#0D2B1D] bg-[#2E5A3D] flex items-center justify-center text-sm shadow-md" title="Northern Rams">
                    🐏
                  </span>
                  <span className="w-8 h-8 rounded-full border-2 border-[#0D2B1D] bg-[#8C6D1F] flex items-center justify-center text-sm shadow-md" title="Farm Goats">
                    🐐
                  </span>
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37]">
                  Poultry, Fish & Livestock
                </span>
              </div>
            </div>

            {/* Quick verification reassurance */}
            <div className="pt-5 border-t border-white/10 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-[#FDFBF5]/80">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>Founded by Abubakar Ibrahim (2018)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#4A7C59] shrink-0" />
                <span>Same-day Kaduna Metro Dispatch</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>Retail & Commercial Wholesale</span>
              </div>
            </div>
          </div>

          {/* Right Column: Attention-Grabbing Livestock Highlight Glass Card (4 cols) */}
          <div className="lg:col-span-4 hidden lg:block">
            <div className="bg-[#0A2217]/85 backdrop-blur-md border border-white/15 p-6 rounded-3xl shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-pulse"></span>
                  <span className="text-xs uppercase font-bold tracking-wider text-[#D4AF37]">
                    Live Farm Stock & Output
                  </span>
                </div>
                <span className="text-[10px] text-[#FDFBF5]/60 uppercase font-mono">Kaduna Farm</span>
              </div>

              {/* 4 Mini Cards for Chicken, Fish, Ram, Goat */}
              <div className="grid grid-cols-2 gap-2.5 text-left">
                <div
                  onClick={() => onSelectCategory('chicken')}
                  className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-[#D4AF37]/50 transition-all group cursor-pointer"
                >
                  <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">🐓</div>
                  <div className="font-bold text-xs text-white uppercase tracking-wider">Chicken & Fowl</div>
                  <div className="text-[10px] text-[#D4AF37]">Broilers & Layers</div>
                </div>

                <div
                  onClick={() => onSelectCategory('fish')}
                  className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-[#4A7C59]/50 transition-all group cursor-pointer"
                >
                  <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">🐟</div>
                  <div className="font-bold text-xs text-white uppercase tracking-wider">Fresh Fish</div>
                  <div className="text-[10px] text-emerald-300">Catfish & Tilapia</div>
                </div>

                <div
                  onClick={() => onSelectCategory('livestock')}
                  className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-[#D4AF37]/50 transition-all group cursor-pointer"
                >
                  <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">🐏</div>
                  <div className="font-bold text-xs text-white uppercase tracking-wider">Northern Rams</div>
                  <div className="text-[10px] text-[#D4AF37]">Festive & Meat Stock</div>
                </div>

                <div
                  onClick={() => onSelectCategory('livestock')}
                  className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-[#4A7C59]/50 transition-all group cursor-pointer"
                >
                  <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">🐐</div>
                  <div className="font-bold text-xs text-white uppercase tracking-wider">Farm Goats</div>
                  <div className="text-[10px] text-emerald-300">Healthy Purebreeds</div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('quote')}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 text-[#D4AF37] border border-[#D4AF37]/40 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>Inquire Farm Livestock Rates</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Category Navigation Bar at Bottom of Hero */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 w-full mt-6 sm:mt-8">
        <div className="bg-[#0A2217]/90 backdrop-blur-md border border-white/15 rounded-2xl p-4 sm:p-5 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3 pb-2.5 border-b border-white/10">
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#D4AF37] flex items-center gap-2">
              <span>🌾</span> Farm Livestock & Produce Navigator:
            </span>
            <span className="text-[11px] tracking-wide text-[#FDFBF5]/60">
              Click any category to open full catalog & live specs
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              type="button"
              onClick={() => onSelectCategory('eggs')}
              className="group p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#D4AF37]/50 transition-all text-left flex items-center gap-3 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
                🥚
              </div>
              <div className="overflow-hidden">
                <div className="font-bold text-xs uppercase tracking-wider text-[#FDFBF5] group-hover:text-[#D4AF37] transition-colors truncate">
                  Fresh Farm Eggs
                </div>
                <div className="text-[11px] text-[#FDFBF5]/70 truncate">
                  30-Egg Crates & Wholesale
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onSelectCategory('chicken')}
              className="group p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#4A7C59]/50 transition-all text-left flex items-center gap-3 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg bg-[#4A7C59]/20 text-[#4A7C59] flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
                🐓
              </div>
              <div className="overflow-hidden">
                <div className="font-bold text-xs uppercase tracking-wider text-[#FDFBF5] group-hover:text-[#4A7C59] transition-colors truncate">
                  Poultry & Chicken
                </div>
                <div className="text-[11px] text-[#FDFBF5]/70 truncate">
                  Dressed Broilers & Live Birds
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onSelectCategory('livestock')}
              className="group p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#D4AF37]/50 transition-all text-left flex items-center gap-3 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
                🐏
              </div>
              <div className="overflow-hidden">
                <div className="font-bold text-xs uppercase tracking-wider text-[#FDFBF5] group-hover:text-[#D4AF37] transition-colors truncate">
                  Rams, Goats & Fish
                </div>
                <div className="text-[11px] text-[#FDFBF5]/70 truncate">
                  Healthy Livestock & Aquaculture
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onSelectCategory('vegetables')}
              className="group p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#4A7C59]/50 transition-all text-left flex items-center gap-3 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg bg-[#4A7C59]/20 text-[#4A7C59] flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
                🥬
              </div>
              <div className="overflow-hidden">
                <div className="font-bold text-xs uppercase tracking-wider text-[#FDFBF5] group-hover:text-[#4A7C59] transition-colors truncate">
                  Fresh Vegetables
                </div>
                <div className="text-[11px] text-[#FDFBF5]/70 truncate">
                  Tomatoes, Peppers & Greens
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};


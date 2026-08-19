import React from 'react';
import { useFarmConfig } from '../context/FarmConfigContext';
import { PageType } from '../types';
import {
  ShoppingBag,
  Calculator,
  Search,
  Building2,
  Award,
  Image as ImageIcon,
  Phone,
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  CheckCircle2,
  User,
  Calendar,
  Gift
} from 'lucide-react';

interface HomeOverviewHubProps {
  onNavigate: (page: PageType) => void;
  onOpenLoyalty: () => void;
}

export const HomeOverviewHub: React.FC<HomeOverviewHubProps> = ({
  onNavigate,
  onOpenLoyalty
}) => {
  const { config } = useFarmConfig();

  const farmHubCards: {
    id: PageType;
    title: string;
    description: string;
    icon: any;
    badge: string;
    cta: string;
    accent: string;
    emoji: string;
  }[] = [
    {
      id: 'products',
      title: 'Products & Livestock',
      description: 'Explore fresh farm eggs, dressed poultry, live catfish, Northern rams, and crisp Kaduna vegetables.',
      icon: ShoppingBag,
      badge: 'Farm Direct',
      cta: 'View Catalog',
      accent: 'border-[#D4AF37]/30 hover:border-[#D4AF37]',
      emoji: '🥚'
    },
    {
      id: 'quote',
      title: 'Order & Quote Builder',
      description: 'Interactive instant price calculation, volume discounts, WhatsApp direct dispatch & custom orders.',
      icon: Calculator,
      badge: 'Instant Pricing',
      cta: 'Calculate Quote',
      accent: 'border-[#4A7C59]/40 hover:border-[#4A7C59]',
      emoji: '📋'
    },
    {
      id: 'track',
      title: 'Track Order Status',
      description: 'Enter your invoice number to see real-time Kaduna preparation, driver dispatch, and delivery timeline.',
      icon: Search,
      badge: 'Live Tracking',
      cta: 'Lookup Invoice',
      accent: 'border-[#D4AF37]/30 hover:border-[#D4AF37]',
      emoji: '🚚'
    },
    {
      id: 'facilities',
      title: 'Farm Facilities & Story',
      description: 'Discover Abubakar Ibrahim\'s agricultural heritage, biosecure ventilated pens, and borehole irrigation.',
      icon: Building2,
      badge: 'Biosecure Pens',
      cta: 'Tour Facilities',
      accent: 'border-white/10 hover:border-white/30',
      emoji: '🚜'
    },
    {
      id: 'why-us',
      title: 'Why YIFA & Reviews',
      description: 'See why top Kaduna caterers, supermarkets, and families trust YIFA Farms for weekly supplies.',
      icon: Award,
      badge: 'Verified Reviews',
      cta: 'Read Reviews',
      accent: 'border-white/10 hover:border-white/30',
      emoji: '⭐'
    },
    {
      id: 'contact',
      title: 'Contact & Farm Hub',
      description: 'Kaduna farm location, directions, direct phone lines, WhatsApp ordering, and opening hours.',
      icon: Phone,
      badge: 'Kaduna, NG',
      cta: 'Get in Touch',
      accent: 'border-[#4A7C59]/40 hover:border-[#4A7C59]',
      emoji: '📍'
    }
  ];

  return (
    <section className="py-16 lg:py-20 bg-transparent text-[#FDFBF5] relative overflow-hidden">
      {/* Background glow accents */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#4A7C59]/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        {/* Value Pillars Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          <div className="p-5 rounded-2xl bg-[#0D2B1D] border border-white/10 shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-1">
              Biosecure Farming
            </h4>
            <p className="text-xs text-[#FDFBF5]/70 leading-relaxed">
              Vaccinated flocks, deep-well water, and sanitary egg packing.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0D2B1D] border border-white/10 shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-[#4A7C59]/20 text-[#4A7C59] flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-1">
              Daily Fresh Harvest
            </h4>
            <p className="text-xs text-[#FDFBF5]/70 leading-relaxed">
              Eggs gathered twice daily; veggies harvested at sunrise.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0D2B1D] border border-white/10 shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center mb-3">
              <Truck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-1">
              Kaduna Dispatch
            </h4>
            <p className="text-xs text-[#FDFBF5]/70 leading-relaxed">
              Fast, temperature-conscious delivery across Kaduna Metro.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0D2B1D] border border-white/10 shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-[#4A7C59]/20 text-[#4A7C59] flex items-center justify-center mb-3">
              <Gift className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-1">
              Loyalty Rewards
            </h4>
            <p className="text-xs text-[#FDFBF5]/70 leading-relaxed">
              Earn points on crates and birds for discounts & VIP perks.
            </p>
          </div>
        </div>

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold uppercase tracking-[0.2em] mb-3">
            <span>Explore Farm Hub</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
            Dedicated Farm Pages & Services
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#FDFBF5]/75">
            Navigate directly to any section of YIFA Farms to view products, calculate pricing, track deliveries, or contact our team.
          </p>
        </div>

        {/* 6 Clean Navigation Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {farmHubCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => onNavigate(card.id)}
                className={`bg-[#0D2B1D] rounded-3xl p-6 sm:p-7 border ${card.accent} shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group cursor-pointer hover:-translate-y-1`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                      {card.emoji}
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#D4AF37] px-3 py-1 rounded-full bg-white/5 border border-white/10">
                      {card.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold uppercase tracking-tight text-white group-hover:text-[#D4AF37] transition-colors mb-2">
                    {card.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#FDFBF5]/70 leading-relaxed mb-6">
                    {card.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#D4AF37] group-hover:text-white">
                  <span>{card.cta}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Founder & Heritage Quick Spotlight Banner */}
        <div className="bg-[#0D2B1D] rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-2">
                <span className="h-[1px] w-6 bg-[#D4AF37]"></span>
                <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-[0.2em]">
                  Agribusiness Heritage
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
                Founded by {config.founderName} in {config.foundedYear}
              </h3>
              <p className="text-xs sm:text-sm text-[#FDFBF5]/80 leading-relaxed max-w-2xl">
                YIFA Farms was founded with a singular purpose in Kaduna: providing uncompromised, clean agricultural produce with transparent farm-gate pricing. Today, we supply reputable caterers, supermarkets, restaurants, and thousands of households.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate('facilities')}
                  className="px-6 py-3 rounded-full bg-[#D4AF37] hover:bg-[#E5C158] text-[#0D2B1D] text-xs font-bold uppercase tracking-widest transition-all cursor-pointer shadow-md"
                >
                  Read Story & Facilities
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('why-us')}
                  className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/15 text-white border border-white/10 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer"
                >
                  Customer Reviews
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white/5 rounded-2xl p-5 border border-white/10 text-center space-y-3">
              <div className="text-3xl">🌱</div>
              <div className="text-sm font-bold text-white uppercase tracking-wider">
                YIFA Farm Club
              </div>
              <p className="text-xs text-[#FDFBF5]/70">
                Join our loyalty program to earn rewards on every crate and poultry batch.
              </p>
              <button
                type="button"
                onClick={onOpenLoyalty}
                className="w-full py-2.5 px-4 rounded-xl bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 text-[#D4AF37] border border-[#D4AF37]/40 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                View Points & Perks
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

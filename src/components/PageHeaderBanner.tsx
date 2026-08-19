import React from 'react';
import { PageType } from '../types';
import { ChevronRight, Home } from 'lucide-react';

interface PageHeaderBannerProps {
  title: string;
  subtitle: string;
  badge: string;
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
}

export const PageHeaderBanner: React.FC<PageHeaderBannerProps> = ({
  title,
  subtitle,
  badge,
  onNavigate,
}) => {
  return (
    <div className="pt-28 pb-6 sm:pt-32 sm:pb-8 bg-[#071810] text-[#FDFBF5] relative overflow-hidden">
      {/* Subtle atmospheric glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#4A7C59]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-10 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#FDFBF5]/60 mb-3">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="hover:text-[#D4AF37] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>
          <ChevronRight className="w-3 h-3 text-[#D4AF37]" />
          <span className="text-[#D4AF37] font-bold">{badge}</span>
        </div>

        {/* Title & Subtitle */}
        <div className="max-w-3xl">
          <div className="inline-block px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-[11px] font-bold uppercase tracking-[0.2em] mb-2.5">
            {badge}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight uppercase text-white font-['Outfit',sans-serif]">
            {title}
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#FDFBF5]/80 leading-relaxed">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
};

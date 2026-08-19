import React, { useState, useEffect } from 'react';
import { Sparkles, X, ArrowRight, Truck, Tag } from 'lucide-react';

interface SeasonalNoticeBannerProps {
  onActionClick: () => void;
}

export const SeasonalNoticeBanner: React.FC<SeasonalNoticeBannerProps> = ({ onActionClick }) => {
  const [isVisible, setIsVisible] = useState<boolean>(true);

  useEffect(() => {
    const isDismissed = sessionStorage.getItem('yifa_seasonal_banner_dismissed');
    if (isDismissed === 'true') {
      setIsVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('yifa_seasonal_banner_dismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <aside aria-label="Seasonal Harvest Announcement" className="relative z-50 bg-[#071810] text-[#FDFBF5] border-b border-[#D4AF37]/30 text-xs transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-2.5 flex items-center justify-between gap-3">
        {/* Left / Center Message Content */}
        <div className="flex-1 flex items-center justify-center sm:justify-start gap-2.5 sm:gap-3 flex-wrap sm:flex-nowrap text-center sm:text-left">
          {/* Badge */}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-bold uppercase tracking-wider shrink-0">
            <Sparkles className="w-3 h-3 animate-pulse" />
            <span>Seasonal Harvest Notice</span>
          </span>

          {/* Text */}
          <p className="text-xs text-[#FDFBF5]/90 leading-snug">
            <strong className="text-[#D4AF37] font-semibold">Fresh Daily Crates & Prime Broilers:</strong>{' '}
            High-volume morning harvest ready for same-day Kaduna delivery & wholesale freight.
          </p>

          {/* Action Link button */}
          <button
            type="button"
            onClick={onActionClick}
            className="inline-flex items-center gap-1 text-[#D4AF37] hover:text-[#E5C158] font-bold text-xs underline underline-offset-4 cursor-pointer hover:scale-102 transition-transform shrink-0"
          >
            <span>Order Fresh Harvest</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Dismiss button */}
        <button
          type="button"
          onClick={handleDismiss}
          className="p-1 rounded-full text-[#FDFBF5]/60 hover:text-white hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
          aria-label="Dismiss seasonal harvest notice"
          title="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};

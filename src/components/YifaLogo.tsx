import React from 'react';

// Official Generated / Uploaded Logo Asset
import officialLogoImg from '../assets/images/yifa_farms_logo_1787109583619.jpg';

interface YifaLogoProps {
  variant?: 'full' | 'icon' | 'badge';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
}

export const YifaLogo: React.FC<YifaLogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
  showText = true
}) => {
  const sizeMap = {
    sm: { img: 'w-8 h-8', text: 'text-base', sub: 'text-[9px]' },
    md: { img: 'w-10 h-10', text: 'text-xl', sub: 'text-[10px]' },
    lg: { img: 'w-14 h-14', text: 'text-2xl', sub: 'text-xs' },
    xl: { img: 'w-20 h-20', text: 'text-3xl', sub: 'text-sm' }
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  if (variant === 'badge') {
    return (
      <div className={`relative inline-flex items-center justify-center rounded-full bg-white p-1 shadow-md border border-white/20 overflow-hidden ${currentSize.img} ${className}`}>
        <img
          src={officialLogoImg}
          alt="YIFA Farms Official Logo"
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain rounded-full"
        />
      </div>
    );
  }

  if (variant === 'icon') {
    return (
      <div className={`relative rounded-full overflow-hidden bg-white/10 p-0.5 border border-white/15 flex items-center justify-center shrink-0 ${currentSize.img} ${className}`}>
        <img
          src={officialLogoImg}
          alt="YIFA Farms Mark"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover rounded-full"
        />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-3 shrink-0 ${className}`}>
      <div className={`relative rounded-full overflow-hidden bg-white shadow-sm p-0.5 border border-white/20 flex items-center justify-center shrink-0 ${currentSize.img}`}>
        <img
          src={officialLogoImg}
          alt="YIFA Farms Official Logo"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover rounded-full"
        />
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <span className={`${currentSize.text} font-black tracking-tight leading-none text-[#FDFBF5] uppercase font-['Cabinet_Grotesk',sans-serif]`}>
            YIFA FARMS
          </span>
          <span className={`${currentSize.sub} tracking-[0.22em] uppercase font-bold text-[#D4AF37] mt-0.5`}>
            Kaduna, Nigeria
          </span>
        </div>
      )}
    </div>
  );
};

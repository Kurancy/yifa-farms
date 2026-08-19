import React from 'react';
import { useFarmConfig } from '../context/FarmConfigContext';
import { PageType } from '../types';
import { MessageCircle, Phone, Calculator, Search, Home, ShoppingBag } from 'lucide-react';

interface StickyMobileBarProps {
  currentPage?: PageType;
  onNavigate?: (page: PageType) => void;
  onOpenQuote: () => void;
}

export const StickyMobileBar: React.FC<StickyMobileBarProps> = ({
  currentPage = 'home',
  onNavigate,
  onOpenQuote
}) => {
  const { config } = useFarmConfig();

  const whatsappStickyLink = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(
    `Hello YIFA Farms Kaduna, I would like to place an order for fresh farm products.`
  )}`;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#071810]/98 backdrop-blur-md border-t border-white/10 py-2.5 px-3 sm:hidden shadow-2xl">
      <div className="grid grid-cols-4 items-center gap-1.5 max-w-md mx-auto">
        <button
          type="button"
          onClick={() => onNavigate?.('home')}
          className={`py-2 px-1 rounded-xl text-center flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer ${
            currentPage === 'home'
              ? 'bg-white/15 text-[#D4AF37] font-bold'
              : 'text-[#FDFBF5]/70 hover:text-white'
          }`}
        >
          <Home className="w-4 h-4" />
          <span className="text-[10px] tracking-tight">Home</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate?.('products')}
          className={`py-2 px-1 rounded-xl text-center flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer ${
            currentPage === 'products'
              ? 'bg-white/15 text-[#D4AF37] font-bold'
              : 'text-[#FDFBF5]/70 hover:text-white'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span className="text-[10px] tracking-tight">Products</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate?.('track')}
          className={`py-2 px-1 rounded-xl text-center flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer ${
            currentPage === 'track'
              ? 'bg-white/15 text-[#D4AF37] font-bold'
              : 'text-[#FDFBF5]/70 hover:text-white'
          }`}
        >
          <Search className="w-4 h-4" />
          <span className="text-[10px] tracking-tight">Track</span>
        </button>

        <button
          type="button"
          onClick={() => (onNavigate ? onNavigate('quote') : onOpenQuote())}
          className={`py-2 px-2 rounded-xl text-center flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer font-bold shadow-md ${
            currentPage === 'quote'
              ? 'bg-white text-[#0D2B1D]'
              : 'bg-[#D4AF37] text-[#0D2B1D]'
          }`}
        >
          <Calculator className="w-4 h-4 shrink-0" />
          <span className="text-[10px] uppercase tracking-wider">Quote</span>
        </button>
      </div>
    </div>
  );
};


import React, { useState, useEffect } from 'react';
import { useFarmConfig } from '../context/FarmConfigContext';
import { SeasonalNoticeBanner } from './SeasonalNoticeBanner';
import { LoyaltyModal } from './LoyaltyModal';
import { YifaLogo } from './YifaLogo';
import { PageType } from '../types';
import { MessageCircle, Phone, Menu, X, Sliders, ArrowUpRight, Search, Gift, Home, ShoppingBag, Award, Eye, FileText } from 'lucide-react';

interface HeaderProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
  onOpenQuote: () => void;
  onOpenHarvestNotice?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  onOpenQuote,
  onOpenHarvestNotice
}) => {
  const { config, setIsConfigModalOpen } = useFarmConfig();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoyaltyOpen, setIsLoyaltyOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const whatsappLink = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(
    `Hello YIFA Farms, I would like to inquire about your farm products (Eggs / Chicken / Vegetables / Fish / Rams).`
  )}`;

  const navItems: { label: string; page: PageType; icon?: any }[] = [
    { label: 'Home', page: 'home' },
    { label: 'Products', page: 'products' },
    { label: 'Facilities', page: 'facilities' },
    { label: 'Why Us', page: 'why-us' },
    { label: 'Gallery', page: 'gallery' },
    { label: 'Track Order', page: 'track', icon: Search },
    { label: 'Contact', page: 'contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0D2B1D]/98 backdrop-blur-md shadow-2xl border-b border-white/10'
            : 'bg-[#0D2B1D] border-b border-white/5'
        }`}
      >
        {/* Seasonal Harvest Alert Dismissible Banner */}
        <SeasonalNoticeBanner onActionClick={onOpenHarvestNotice || onOpenQuote} />

        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between gap-4 transition-all duration-300 ${
          isScrolled ? 'py-2.5' : 'py-3.5 sm:py-4'
        }`}>
          {/* Zone 1: Brand Title */}
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="flex items-center group whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#D4AF37] rounded-md text-left cursor-pointer transition-transform hover:scale-[1.02]"
            aria-label="YIFA Farms Home"
          >
            <YifaLogo variant="full" size={isScrolled ? "sm" : "md"} />
          </button>

          {/* Zone 2: Multi-Page Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2 text-xs font-medium tracking-wider uppercase">
            {navItems.map((item) => {
              const isActive = currentPage === item.page;
              const Icon = item.icon;
              return (
                <button
                  key={item.page}
                  type="button"
                  onClick={() => onNavigate(item.page)}
                  className={`px-3 py-1.5 rounded-full transition-all whitespace-nowrap shrink-0 flex items-center gap-1 cursor-pointer ${
                    isActive
                      ? 'bg-[#D4AF37] text-[#0D2B1D] font-extrabold shadow-sm'
                      : 'text-[#FDFBF5]/80 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {Icon && <Icon className="w-3 h-3" />}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Loyalty Rewards CTA Button */}
            <button
              type="button"
              onClick={() => setIsLoyaltyOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold uppercase tracking-widest rounded-full bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 text-[#D4AF37] border border-[#D4AF37]/40 transition-all shadow-sm whitespace-nowrap shrink-0 cursor-pointer"
              title="YIFA Farm Club & Loyalty Rewards Program"
            >
              <Gift className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Loyalty Rewards</span>
              <span className="xl:hidden">Rewards</span>
            </button>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#4A7C59] hover:bg-[#5A8C69] text-white px-3.5 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-all shadow-sm whitespace-nowrap shrink-0 inline-flex items-center gap-1.5"
              title="Chat with YIFA Farms on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            <button
              type="button"
              onClick={() => onNavigate('quote')}
              className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-full transition-all shadow-sm whitespace-nowrap shrink-0 cursor-pointer ${
                currentPage === 'quote'
                  ? 'bg-white text-[#0D2B1D]'
                  : 'bg-[#D4AF37] text-[#0D2B1D] hover:bg-[#E5C158]'
              }`}
            >
              <span>Order / Quote</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            {/* Asset customizer button for developer / client */}
            <button
              type="button"
              onClick={() => setIsConfigModalOpen(true)}
              title="Customize Phone, Address & Data"
              aria-label="Customize Phone, Address and Farm Data"
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-[#FDFBF5]/80 hover:text-white border border-white/10 transition-colors"
            >
              <Sliders className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => setIsLoyaltyOpen(true)}
              title="Loyalty Rewards"
              aria-label="Loyalty Rewards"
              className="p-2 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40"
            >
              <Gift className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setIsConfigModalOpen(true)}
              title="Edit Farm Config"
              aria-label="Edit Farm Config"
              className="p-2 rounded-full bg-white/5 text-[#D4AF37] border border-white/10"
            >
              <Sliders className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#FDFBF5] hover:bg-white/5 focus:outline-none cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0A2217] border-t border-white/10 px-4 pt-3 pb-6 space-y-3 shadow-2xl">
            <div className="grid grid-cols-2 gap-2 pt-2 pb-3 border-b border-white/10">
              {navItems.map((item) => {
                const isActive = currentPage === item.page;
                return (
                  <button
                    key={item.page}
                    type="button"
                    onClick={() => {
                      onNavigate(item.page);
                      setMobileMenuOpen(false);
                    }}
                    className={`px-3 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-xl text-left transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#D4AF37] text-[#0D2B1D] font-bold shadow-md'
                        : 'text-[#FDFBF5] hover:bg-white/5'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 flex flex-col gap-2.5">
              {/* Loyalty Rewards Button in Mobile Menu */}
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsLoyaltyOpen(true);
                }}
                className="w-full py-2.5 px-4 text-center font-bold text-xs uppercase tracking-widest rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37]/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Gift className="w-4 h-4" />
                <span>Loyalty Rewards & Points</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('quote');
                }}
                className="w-full py-3 px-4 text-center font-bold text-xs uppercase tracking-widest rounded-full bg-[#D4AF37] text-[#0D2B1D] hover:bg-[#E5C158] cursor-pointer shadow-md"
              >
                Request a Quote / Order
              </button>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-bold uppercase tracking-wider rounded-full bg-[#4A7C59] text-white"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
                <a
                  href={`tel:${config.phoneRaw}`}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-bold uppercase tracking-wider rounded-full bg-white/10 text-[#FDFBF5] border border-white/10"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Farm</span>
                </a>
              </div>

              {/* Operations Portal Button */}
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('admin');
                }}
                className="w-full py-2 px-4 text-center text-xs font-semibold text-[#D4AF37] hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer border border-white/5"
              >
                <span>Staff & Admin Portal</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Loyalty Program Modal */}
      <LoyaltyModal
        isOpen={isLoyaltyOpen}
        onClose={() => setIsLoyaltyOpen(false)}
        onOpenQuote={() => {
          setIsLoyaltyOpen(false);
          onNavigate('quote');
        }}
      />
    </>
  );
};




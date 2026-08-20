import React, { useState, useEffect } from 'react';
import { useFarmConfig } from '../context/FarmConfigContext';
import { SeasonalNoticeBanner } from './SeasonalNoticeBanner';
import { LoyaltyModal } from './LoyaltyModal';
import { YifaLogo } from './YifaLogo';
import { ThemeToggle } from './ThemeToggle';
import { PageType } from '../types';
import {
  MessageCircle,
  Phone,
  Menu,
  X,
  Sliders,
  ArrowUpRight,
  Search,
  Gift,
  ShieldCheck,
  Package,
  Layers,
  Star,
  Image as ImageIcon,
  Mail,
  UserCheck
} from 'lucide-react';

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
    { label: 'Products', page: 'products', icon: Package },
    { label: 'Facilities', page: 'facilities', icon: Layers },
    { label: 'Why Us', page: 'why-us', icon: ShieldCheck },
    { label: 'Gallery', page: 'gallery', icon: ImageIcon },
    { label: 'Track Order', page: 'track', icon: Search },
    { label: 'Contact', page: 'contact', icon: Mail }
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 w-full z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0D2B1D]/98 backdrop-blur-md shadow-2xl border-b border-white/10'
            : 'bg-[#0D2B1D] border-b border-white/5'
        }`}
      >
        {/* Seasonal Harvest Alert Dismissible Banner - Spans Full Width */}
        <SeasonalNoticeBanner onActionClick={onOpenHarvestNotice || onOpenQuote} />

        {/* Full-width Responsive Header Bar */}
        <div className={`w-full px-4 sm:px-6 md:px-8 lg:px-8 xl:px-12 flex items-center justify-between gap-2 sm:gap-4 transition-all duration-300 ${
          isScrolled ? 'py-2.5' : 'py-3 sm:py-3.5'
        }`}>
          
          {/* ZONE 1: Brand Title & Logo (Left-aligned) */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="flex items-center group whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#D4AF37] rounded-md text-left cursor-pointer transition-transform hover:scale-[1.02]"
              aria-label="YIFA Farms Kaduna Home"
            >
              <YifaLogo variant="full" size={isScrolled ? "sm" : "md"} />
            </button>
          </div>

          {/* ZONE 2: Navigation Links (Centered, Evenly Spaced, Fully Visible) */}
          <nav className="hidden xl:flex items-center justify-center gap-1.5 2xl:gap-2 text-xs font-bold tracking-wider uppercase flex-1 mx-2 2xl:mx-6">
            {navItems.map((item) => {
              const isActive = currentPage === item.page;
              const Icon = item.icon;
              return (
                <button
                  key={item.page}
                  type="button"
                  onClick={() => onNavigate(item.page)}
                  className={`px-3 py-1.5 rounded-full transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-[#D4AF37] text-[#0D2B1D] font-extrabold shadow-sm'
                      : 'text-[#FDFBF5]/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5" />}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Medium Desktop (lg to xl) Navigation Strip with compact items */}
          <nav className="hidden lg:flex xl:hidden items-center justify-center gap-1 text-[11px] font-bold tracking-wide uppercase flex-1 mx-2">
            {navItems.map((item) => {
              const isActive = currentPage === item.page;
              return (
                <button
                  key={item.page}
                  type="button"
                  onClick={() => onNavigate(item.page)}
                  className={`px-2.5 py-1 rounded-full transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#D4AF37] text-[#0D2B1D] font-extrabold shadow-sm'
                      : 'text-[#FDFBF5]/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* ZONE 3: Action Buttons & Utilities (Right-aligned, Spans Edge-to-Edge) */}
          <div className="hidden lg:flex items-center justify-end gap-2 xl:gap-2.5 shrink-0">
            {/* Loyalty Rewards CTA Button */}
            <button
              type="button"
              onClick={() => setIsLoyaltyOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-full bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 text-[#D4AF37] border border-[#D4AF37]/40 transition-all shadow-sm whitespace-nowrap shrink-0 cursor-pointer active:scale-95"
              title="YIFA Farm Club & Loyalty Rewards Program"
            >
              <Gift className="w-3.5 h-3.5" />
              <span className="hidden 2xl:inline">Loyalty Rewards</span>
              <span className="2xl:hidden">Rewards</span>
            </button>

            {/* WhatsApp Direct Chat */}
            
             
            

            {/* Request Order / Quote Button */}
            <button
              type="button"
              onClick={() => onNavigate('quote')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-black uppercase tracking-wider rounded-full transition-all shadow-md whitespace-nowrap shrink-0 cursor-pointer active:scale-95 ${
                currentPage === 'quote'
                  ? 'bg-white text-[#0D2B1D]'
                  : 'bg-[#D4AF37] text-[#0D2B1D] hover:bg-[#E5C158]'
              }`}
            >
              <span>Order / Quote</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            {/* Dark / Light Mode Toggle */}
            <ThemeToggle />

            {/* Client / Developer Config Modal Trigger */}
            <button
              type="button"
              onClick={() => setIsConfigModalOpen(true)}
              title="Customize Phone, Address & Live Farm Data"
              aria-label="Customize Phone, Address and Farm Data"
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-[#FDFBF5]/80 hover:text-white border border-white/10 transition-colors cursor-pointer shrink-0"
            >
              <Sliders className="w-4 h-4" />
            </button>
          </div>

          {/* MOBILE / TABLET CONTROLS (< lg) */}
          <div className="flex items-center gap-1.5 sm:gap-2 lg:hidden shrink-0">
            {/* Quick Dark Mode Toggle */}
            <ThemeToggle />

            {/* Quick Loyalty Rewards Button */}
            <button
              type="button"
              onClick={() => setIsLoyaltyOpen(true)}
              title="Loyalty Rewards"
              aria-label="Loyalty Rewards"
              className="p-2 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 cursor-pointer"
            >
              <Gift className="w-4 h-4" />
            </button>

            {/* Quick Config Modal Trigger */}
            <button
              type="button"
              onClick={() => setIsConfigModalOpen(true)}
              title="Edit Farm Config"
              aria-label="Edit Farm Config"
              className="p-2 rounded-full bg-white/5 text-[#D4AF37] border border-white/10 cursor-pointer"
            >
              <Sliders className="w-4 h-4" />
            </button>

            {/* Hamburger Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#FDFBF5] hover:bg-white/10 focus:outline-none cursor-pointer active:scale-95 transition-all"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#D4AF37]" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* MOBILE NAVIGATION DRAWER (Full Width) */}
        {mobileMenuOpen && (
          <div className="lg:hidden w-full bg-[#071810] border-t border-white/10 px-4 sm:px-6 pt-4 pb-7 space-y-4 shadow-2xl animate-in slide-in-from-top-2 duration-200">
            {/* Navigation Grid */}
            <div className="grid grid-cols-2 gap-2 pb-3 border-b border-white/10">
              {navItems.map((item) => {
                const isActive = currentPage === item.page;
                const Icon = item.icon;
                return (
                  <button
                    key={item.page}
                    type="button"
                    onClick={() => {
                      onNavigate(item.page);
                      setMobileMenuOpen(false);
                    }}
                    className={`px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl text-left transition-all cursor-pointer flex items-center gap-2 ${
                      isActive
                        ? 'bg-[#D4AF37] text-[#0D2B1D] font-black shadow-md'
                        : 'text-[#FDFBF5]/80 hover:text-white hover:bg-white/5 bg-white/[0.02] border border-white/5'
                    }`}
                  >
                    {Icon && <Icon className="w-3.5 h-3.5 opacity-80" />}
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Mobile Action Buttons */}
            <div className="pt-1 flex flex-col gap-2.5">
              {/* Loyalty Rewards in Mobile Drawer */}
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsLoyaltyOpen(true);
                }}
                className="w-full py-2.5 px-4 font-bold text-xs uppercase tracking-widest rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37]/25 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Gift className="w-4 h-4" />
                <span>Loyalty Rewards & Points Program</span>
              </button>

              {/* Request Order / Quote Button */}
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('quote');
                }}
                className="w-full py-3 px-4 text-center font-black text-xs uppercase tracking-widest rounded-xl bg-[#D4AF37] text-[#0D2B1D] hover:bg-[#E5C158] cursor-pointer shadow-lg flex items-center justify-center gap-1.5"
              >
                <span>Request a Quote / Place Order</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              {/* Direct Contact Shortcuts */}
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 px-3 text-xs font-bold uppercase tracking-wider rounded-xl bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 hover:bg-[#25D366]/30"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
                <a
                  href={`tel:${config.phoneRaw}`}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 text-xs font-bold uppercase tracking-wider rounded-xl bg-white/5 hover:bg-white/10 text-[#FDFBF5] border border-white/10"
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
                className="w-full py-2.5 px-4 text-center text-xs font-bold text-[#D4AF37] hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer border border-white/10"
              >
                <UserCheck className="w-4 h-4" />
                <span>Staff & Operations Portal</span>
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

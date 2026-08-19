import React from 'react';
import { useFarmConfig } from '../context/FarmConfigContext';
import { YifaLogo } from './YifaLogo';
import { PageType } from '../types';
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  ArrowUp,
  ShieldCheck,
  Facebook,
  Instagram,
  Twitter,
  ExternalLink,
  Heart
} from 'lucide-react';
import { ClientConfirmBadge } from './ClientConfirmBadge';

interface FooterProps {
  currentPage?: PageType;
  onNavigate?: (page: PageType) => void;
}

export const Footer: React.FC<FooterProps> = ({ currentPage, onNavigate }) => {
  const { config, setIsConfigModalOpen } = useFarmConfig();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNav = (page: PageType) => {
    if (onNavigate) {
      onNavigate(page);
    } else {
      scrollToTop();
    }
  };

  const whatsappFooterLink = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(
    `Hello YIFA Farms, I am inquiring from your website.`
  )}`;

  return (
    <footer className="bg-[#071810] text-[#FDFBF5]/70 pt-16 pb-20 sm:pb-12 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Brand Col (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <button
              type="button"
              onClick={() => handleNav('home')}
              className="text-left cursor-pointer group transition-transform hover:scale-[1.02] inline-block"
              aria-label="YIFA Farms Home"
            >
              <YifaLogo variant="full" size="lg" />
            </button>

            <p className="text-xs sm:text-sm text-[#FDFBF5]/80 leading-relaxed max-w-sm italic">
              &ldquo;{config.tagline}&rdquo;
            </p>

            <p className="text-xs text-[#FDFBF5]/60 leading-relaxed max-w-sm">
              Founded in {config.foundedYear} by {config.founderName}. Dedicated to wholesome table eggs, hygienically dressed poultry, fresh fish, rams, goats, and farm-fresh Kaduna vegetables.
            </p>

            {/* Social Icons & Client badges toggle */}
            <div className="pt-2 flex items-center gap-3">
              <a
                href={whatsappFooterLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#25D366] hover:text-slate-950 text-white flex items-center justify-center transition-all border border-white/10"
                title="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href={`tel:${config.phoneRaw}`}
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#D4AF37] hover:text-[#0D2B1D] text-white flex items-center justify-center transition-all border border-white/10"
                title="Call Farm"
              >
                <Phone className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${config.email}`}
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white hover:text-slate-950 text-white flex items-center justify-center transition-all border border-white/10"
                title="Email Farm"
              >
                <Mail className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={() => setIsConfigModalOpen(true)}
                className="px-3.5 py-2 rounded-full bg-white/5 hover:bg-white/10 text-[10px] uppercase font-bold tracking-wider text-[#D4AF37] border border-[#D4AF37]/30 cursor-pointer transition-all"
                title="Edit Client Assets"
              >
                Config Desk
              </button>
            </div>
          </div>

          {/* Quick Page Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37] border-b border-white/10 pb-2">
              Farm Pages
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('home')}
                  className={`hover:text-[#D4AF37] transition-colors cursor-pointer text-left ${
                    currentPage === 'home' ? 'text-[#D4AF37] font-bold' : ''
                  }`}
                >
                  Home Overview
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('products')}
                  className={`hover:text-[#D4AF37] transition-colors cursor-pointer text-left ${
                    currentPage === 'products' ? 'text-[#D4AF37] font-bold' : ''
                  }`}
                >
                  Our Products
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('facilities')}
                  className={`hover:text-[#D4AF37] transition-colors cursor-pointer text-left ${
                    currentPage === 'facilities' ? 'text-[#D4AF37] font-bold' : ''
                  }`}
                >
                  Facilities & Story
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('why-us')}
                  className={`hover:text-[#D4AF37] transition-colors cursor-pointer text-left ${
                    currentPage === 'why-us' ? 'text-[#D4AF37] font-bold' : ''
                  }`}
                >
                  Why YIFA Farms
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('gallery')}
                  className={`hover:text-[#D4AF37] transition-colors cursor-pointer text-left ${
                    currentPage === 'gallery' ? 'text-[#D4AF37] font-bold' : ''
                  }`}
                >
                  Photo Gallery
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('quote')}
                  className={`hover:text-[#D4AF37] transition-colors cursor-pointer text-left ${
                    currentPage === 'quote' ? 'text-[#D4AF37] font-bold' : ''
                  }`}
                >
                  Request a Quote
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('track')}
                  className="text-[#D4AF37] hover:underline font-semibold transition-colors cursor-pointer text-left"
                >
                  Track Order Status
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('contact')}
                  className={`hover:text-[#D4AF37] transition-colors cursor-pointer text-left ${
                    currentPage === 'contact' ? 'text-[#D4AF37] font-bold' : ''
                  }`}
                >
                  Contact & Location
                </button>
              </li>
              <li className="pt-1.5 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => handleNav('admin')}
                  className={`hover:text-[#D4AF37] transition-colors cursor-pointer text-left flex items-center gap-1.5 font-bold ${
                    currentPage === 'admin' ? 'text-[#D4AF37]' : 'text-emerald-400/90'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Operations & Admin Portal</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Farm Products (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37] border-b border-white/10 pb-2">
              Our Specialities
            </h4>
            <ul className="space-y-2.5 text-xs text-[#FDFBF5]/80">
              <li className="flex items-center gap-2">
                <span className="text-amber-400">🥚</span>
                <span>Fresh Farm Eggs (30-Egg Crates)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-400">🍗</span>
                <span>Dressed Frozen Chicken & Broilers</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-cyan-400">🐟</span>
                <span>Aquaculture Catfish & Tilapia</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-yellow-400">🐏</span>
                <span>Northern Rams & Farm Goats</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400">🥬</span>
                <span>Tomatoes, Peppers & Fresh Veggies</span>
              </li>
            </ul>

            <div className="pt-2">
              <ClientConfirmBadge label="KADUNA FARM DIRECT" />
            </div>
          </div>

          {/* Contact Details (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37] border-b border-white/10 pb-2">
              Kaduna Contact Hub
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span className="text-[#FDFBF5]/80 leading-relaxed">
                  {config.exactAddress}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <a href={`tel:${config.phoneRaw}`} className="hover:text-[#D4AF37] transition-colors">
                  {config.phoneDisplay}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0" />
                <a href={whatsappFooterLink} target="_blank" rel="noopener noreferrer" className="hover:underline text-[#25D366]">
                  WhatsApp: {config.whatsappDisplay}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <a href={`mailto:${config.email}`} className="hover:text-[#D4AF37] transition-colors">
                  {config.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FDFBF5]/60">
          <div>
            © {new Date().getFullYear()} <strong className="text-white">YIFA Farms</strong>. All rights reserved. Kaduna, Nigeria.
          </div>

          {/* Mandatory Axion Technologies credit from prompt */}
          <div className="flex items-center gap-1.5 text-xs text-[#FDFBF5]/80 font-medium">
            <span>Technology by</span>
            <a
              href="https://axiontech.ng"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[#D4AF37] hover:text-[#E5C158] underline inline-flex items-center gap-1 transition-colors"
            >
              <span>Axion Technologies</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Back to top */}
          <button
            type="button"
            onClick={scrollToTop}
            className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center gap-1 cursor-pointer transition-colors border border-white/10"
            title="Scroll to top"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span className="text-[11px] font-semibold pr-1">Top</span>
          </button>
        </div>
      </div>
    </footer>
  );
};


import React from 'react';
import { useFarmConfig } from '../context/FarmConfigContext';
import { Phone, MessageCircle, Mail, MapPin, Clock, Truck, ShieldCheck, ExternalLink } from 'lucide-react';
import { ClientConfirmBadge } from './ClientConfirmBadge';

interface ContactSectionProps {
  onOpenQuote: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onOpenQuote }) => {
  const { config } = useFarmConfig();

  const whatsappDirect = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(
    `Hello YIFA Farms Kaduna, I would like to inquire about ordering fresh eggs, poultry, and vegetables.`
  )}`;

  return (
    <section id="contact" className="pt-2 pb-20 sm:pt-4 sm:pb-24 bg-transparent text-[#FDFBF5] relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-[#4A7C59]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        {/* Main Headline from brief */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="h-[1px] w-6 bg-[#D4AF37]"></span>
            <span className="text-[#D4AF37] text-xs font-bold tracking-[0.25em] uppercase">Direct Farm Despatch & Sales</span>
            <span className="h-[1px] w-6 bg-[#D4AF37]"></span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#FDFBF5] tracking-tight uppercase">
            Want to order eggs, chicken or vegetables?
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#FDFBF5]/75 leading-relaxed">
            Reach out directly to Abubakar Ibrahim and the YIFA Farms team in Kaduna. We are ready to fulfill household crates, bulk catering orders, and wholesale transport requests.
          </p>

          {/* 3 Prominent Quick Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <a
              href={`tel:${config.phoneRaw}`}
              className="px-7 py-4 rounded-full bg-[#D4AF37] hover:bg-[#E5C158] text-[#0D2B1D] font-black text-xs sm:text-sm uppercase tracking-widest transition-all flex items-center gap-2 shadow-xl cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              <span>Call Us ({config.phoneDisplay})</span>
            </a>

            <a
              href={whatsappDirect}
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-4 rounded-full bg-[#25D366] hover:bg-[#20BA58] text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center gap-2 shadow-xl"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Us Now</span>
            </a>

            <button
              type="button"
              onClick={onOpenQuote}
              className="px-7 py-4 rounded-full bg-white/10 hover:bg-white/15 text-[#FDFBF5] border border-white/10 font-bold text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer backdrop-blur-sm"
            >
              <Mail className="w-4 h-4" />
              <span>Send an Inquiry</span>
            </button>
          </div>
        </div>

        {/* Contact Information & Map Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Contact Details Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
            {/* Address Card */}
            <div className="bg-[#0A2217] rounded-3xl p-6 sm:p-7 border border-white/10 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#D4AF37] font-bold text-xs uppercase tracking-[0.2em]">
                  <MapPin className="w-4 h-4" />
                  <span>Farm & Dispatch Location</span>
                </div>
                <ClientConfirmBadge label="EXACT ADDRESS CONFIRMATION" />
              </div>
              <p className="text-sm font-semibold text-white leading-relaxed">
                {config.exactAddress}
              </p>
              <div className="text-xs text-[#FDFBF5]/60 pt-1">
                Kaduna State, Northern Nigeria
              </div>
            </div>

            {/* Operating Hours & Dispatch */}
            <div className="bg-[#0A2217] rounded-3xl p-6 sm:p-7 border border-white/10 shadow-xl space-y-3">
              <div className="flex items-center gap-2 text-[#D4AF37] font-bold text-xs uppercase tracking-[0.2em]">
                <Clock className="w-4 h-4" />
                <span>Operating Hours & Dispatch Schedule</span>
              </div>
              <div className="text-xs space-y-2 text-[#FDFBF5]/80">
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span>Office & Sales:</span>
                  <span className="font-semibold text-white">{config.openingHours}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span>Morning Dispatch:</span>
                  <span className="font-semibold text-[#D4AF37]">6:30 AM – 10:00 AM</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span>Afternoon Run:</span>
                  <span className="font-semibold text-[#D4AF37]">2:00 PM – 5:30 PM</span>
                </div>
              </div>
            </div>

            {/* Direct Channels summary */}
            <div className="bg-[#0A2217] rounded-3xl p-6 sm:p-7 border border-white/10 shadow-xl space-y-3">
              <div className="flex items-center gap-2 text-[#D4AF37] font-bold text-xs uppercase tracking-[0.2em]">
                <ShieldCheck className="w-4 h-4" />
                <span>Direct Contact Channels</span>
              </div>
              <div className="text-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[#FDFBF5]/60">Phone:</span>
                  <a href={`tel:${config.phoneRaw}`} className="font-bold text-white hover:text-[#D4AF37] transition-colors">
                    {config.phoneDisplay}
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#FDFBF5]/60">WhatsApp:</span>
                  <a href={whatsappDirect} target="_blank" rel="noopener noreferrer" className="font-bold text-[#25D366] hover:underline">
                    {config.whatsappDisplay}
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#FDFBF5]/60">Email:</span>
                  <a href={`mailto:${config.email}`} className="font-semibold text-white hover:text-[#D4AF37] transition-colors">
                    {config.email}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Map Preview & Location Details (7 cols) */}
          <div className="lg:col-span-7 bg-[#0A2217] rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col justify-between">
            {/* Map Header */}
            <div className="p-5 bg-[#071810] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#D4AF37]" />
                <span className="font-bold text-xs sm:text-sm text-white uppercase tracking-wider">
                  Kaduna Agribusiness Hub & Supply Radius
                </span>
              </div>
              <a
                href="https://maps.google.com/?q=Kaduna+Nigeria"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-semibold text-[#D4AF37] hover:text-white flex items-center gap-1"
              >
                <span>Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Interactive Simulated Kaduna Map Display */}
            <div className="relative h-72 sm:h-96 w-full bg-black overflow-hidden">
              <iframe
                title="Kaduna Nigeria Map Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125556.76007421377!2d7.359258416406253!3d10.510464200000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104d49fb4c753b89%3A0xb351515ef454c000!2sKaduna%2C%20Nigeria!5e0!3m2!1sen!2sng!4v1700000000000!5m2!1sen!2sng"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'contrast(1.1) saturate(1.1)' }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full opacity-85 hover:opacity-100 transition-opacity"
              ></iframe>

              {/* Map Floating Card */}
              <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-xs p-4 rounded-2xl bg-[#0D2B1D]/95 backdrop-blur-md border border-white/10 shadow-2xl text-xs space-y-1 text-white">
                <div className="font-bold text-[#D4AF37] flex items-center gap-1.5">
                  <span>📍</span> YIFA Farms Dispatch Hub
                </div>
                <p className="text-[#FDFBF5]/80 text-[11px] leading-relaxed">
                  Daily scheduled drops to Barnawa, Malali, Kawo, Rigachikun, Sabon Tasha, and interstate freight terminals.
                </p>
              </div>
            </div>

            {/* Map Footer Note */}
            <div className="p-4 bg-[#071810] border-t border-white/10 text-xs text-[#FDFBF5]/70 flex flex-col sm:flex-row items-center justify-between gap-2">
              <span>Looking to visit our farm? Contact us ahead to schedule biosecure access.</span>
              <a
                href={whatsappDirect}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#D4AF37] font-bold hover:underline whitespace-nowrap"
              >
                Schedule Appointment →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

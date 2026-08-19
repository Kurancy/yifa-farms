import React, { useState } from 'react';
import { useFarmConfig } from '../context/FarmConfigContext';
import {
  X,
  Sliders,
  Save,
  RotateCcw,
  Check,
  Copy,
  AlertTriangle,
  Phone,
  MessageCircle,
  MapPin,
  HelpCircle,
  Eye,
  EyeOff
} from 'lucide-react';

export const ClientConfigModal: React.FC = () => {
  const {
    config,
    updateConfig,
    resetConfig,
    isConfigModalOpen,
    setIsConfigModalOpen,
    toggleBadgeVisibility
  } = useFarmConfig();

  const [phoneDisplay, setPhoneDisplay] = useState(config.phoneDisplay);
  const [phoneRaw, setPhoneRaw] = useState(config.phoneRaw);
  const [whatsappNumber, setWhatsappNumber] = useState(config.whatsappNumber);
  const [whatsappDisplay, setWhatsappDisplay] = useState(config.whatsappDisplay);
  const [exactAddress, setExactAddress] = useState(config.exactAddress);
  const [isAddressConfirmed, setIsAddressConfirmed] = useState(config.isAddressConfirmed);
  const [birdCapacityText, setBirdCapacityText] = useState(config.birdCapacityText);
  const [isBirdCapacityConfirmed, setIsBirdCapacityConfirmed] = useState(config.isBirdCapacityConfirmed);
  const [email, setEmail] = useState(config.email);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);

  if (!isConfigModalOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig({
      phoneDisplay,
      phoneRaw: phoneRaw.replace(/\D/g, ''),
      whatsappNumber: whatsappNumber.replace(/\D/g, ''),
      whatsappDisplay,
      exactAddress,
      isAddressConfirmed,
      birdCapacityText,
      isBirdCapacityConfirmed,
      email
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsConfigModalOpen(false);
    }, 1200);
  };

  const handleCopyChecklist = () => {
    const checklistText = `*YIFA FARMS — CLIENT ASSET & CONTACT STATUS*\n` +
      `------------------------------------------\n` +
      `• Farm Name: ${config.farmName}\n` +
      `• Founder: ${config.founderName} (Est. ${config.foundedYear})\n` +
      `• Phone: ${phoneDisplay} (Raw: ${phoneRaw})\n` +
      `• WhatsApp: ${whatsappDisplay} (Wa.me: ${whatsappNumber})\n` +
      `• Email: ${email}\n` +
      `• Address: ${exactAddress} [Confirmed: ${isAddressConfirmed ? 'YES' : 'PENDING'}]\n` +
      `• Bird Flock Capacity: ${birdCapacityText} [Confirmed: ${isBirdCapacityConfirmed ? 'YES' : 'PENDING'}]\n` +
      `• Visual Badges Display: ${config.showClientBadges ? 'Draft Markers Enabled' : 'Live Production Mode'}\n` +
      `• Built by: Axion Technologies\n` +
      `------------------------------------------`;

    navigator.clipboard.writeText(checklistText);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
      <div
        className="bg-[#0D2B1D] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/10 text-[#FDFBF5]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-[#0A2217] text-white flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-[#D4AF37] text-[#0D2B1D] font-bold shadow-md">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-['Outfit',sans-serif]">
                YIFA Farms Asset & Contact Configurator
              </h3>
              <p className="text-xs text-[#FDFBF5]/70">
                Update phone numbers, addresses, and confirmation flags in real-time.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsConfigModalOpen(false)}
            aria-label="Close configuration window"
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-6 sm:p-8 space-y-6">
          {/* Status Alert */}
          <div className="p-4 rounded-2xl bg-white/5 border border-[#D4AF37]/30 text-[#FDFBF5] text-xs flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-bold text-[#D4AF37]">Client Verification Mode Active</div>
              <p className="text-[#FDFBF5]/80 leading-relaxed">
                Items marked with <span className="font-bold uppercase tracking-wider text-[10px] px-1.5 py-0.5 bg-[#D4AF37]/20 border border-[#D4AF37]/40 rounded-md text-[#D4AF37]">[CLIENT TO CONFIRM]</span> indicate placeholders pending final data from Abubakar Ibrahim / farm management.
              </p>
            </div>
          </div>

          {/* Toggle Badges Button */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-white">
                Show `[CLIENT TO CONFIRM]` Markers in Website UI
              </div>
              <div className="text-[11px] text-[#FDFBF5]/60">
                Toggle off for clean client demonstration or production screenshot
              </div>
            </div>
            <button
              type="button"
              onClick={toggleBadgeVisibility}
              className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                config.showClientBadges
                  ? 'bg-[#D4AF37] text-[#0D2B1D] shadow-md'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {config.showClientBadges ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>{config.showClientBadges ? 'Markers Visible' : 'Markers Hidden'}</span>
            </button>
          </div>

          {/* Phone & WhatsApp */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase font-bold text-[#D4AF37] tracking-[0.2em] border-b border-white/10 pb-2 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Contact & WhatsApp Dispatch Numbers</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#FDFBF5]/80 mb-1">
                  WhatsApp Number (Intl format, e.g. 2348030001234)
                </label>
                <input
                  type="text"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#091F15] text-xs font-mono text-[#FDFBF5] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#FDFBF5]/80 mb-1">
                  WhatsApp Display Text
                </label>
                <input
                  type="text"
                  value={whatsappDisplay}
                  onChange={(e) => setWhatsappDisplay(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#091F15] text-xs text-[#FDFBF5] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#FDFBF5]/80 mb-1">
                  Phone Raw (Dialing)
                </label>
                <input
                  type="text"
                  value={phoneRaw}
                  onChange={(e) => setPhoneRaw(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#091F15] text-xs font-mono text-[#FDFBF5] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#FDFBF5]/80 mb-1">
                  Phone Display Text
                </label>
                <input
                  type="text"
                  value={phoneDisplay}
                  onChange={(e) => setPhoneDisplay(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#091F15] text-xs text-[#FDFBF5] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                  required
                />
              </div>
            </div>
          </div>

          {/* Farm Address & Kaduna Details */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase font-bold text-[#D4AF37] tracking-[0.2em] border-b border-white/10 pb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Physical Farm Address in Kaduna</span>
            </h4>

            <div>
              <label className="block text-xs font-medium text-[#FDFBF5]/80 mb-1">
                Full Farm Address Text
              </label>
              <textarea
                rows={2}
                value={exactAddress}
                onChange={(e) => setExactAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#091F15] text-xs text-[#FDFBF5] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="addrConfirmed"
                checked={isAddressConfirmed}
                onChange={(e) => setIsAddressConfirmed(e.target.checked)}
                className="w-4 h-4 accent-[#D4AF37] rounded-sm"
              />
              <label htmlFor="addrConfirmed" className="text-xs font-medium text-[#FDFBF5]/80 cursor-pointer">
                Mark exact address as fully verified by client
              </label>
            </div>
          </div>

          {/* Bird Capacity Stat Confirmation */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase font-bold text-[#D4AF37] tracking-[0.2em] border-b border-white/10 pb-2">
              Flock Capacity & Growth Metric
            </h4>

            <div>
              <label className="block text-xs font-medium text-[#FDFBF5]/80 mb-1">
                Bird Capacity Text
              </label>
              <input
                type="text"
                value={birdCapacityText}
                onChange={(e) => setBirdCapacityText(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#091F15] text-xs text-[#FDFBF5] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="birdConfirmed"
                checked={isBirdCapacityConfirmed}
                onChange={(e) => setIsBirdCapacityConfirmed(e.target.checked)}
                className="w-4 h-4 accent-[#D4AF37] rounded-sm"
              />
              <label htmlFor="birdConfirmed" className="text-xs font-medium text-[#FDFBF5]/80 cursor-pointer">
                Mark bird count metric as audited and approved for live release
              </label>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-[#FDFBF5]/80 mb-1">
              Official Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#091F15] text-xs text-[#FDFBF5] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
              required
            />
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={resetConfig}
                className="px-3.5 py-2.5 rounded-full border border-white/10 text-[#FDFBF5]/80 hover:bg-white/10 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>

              <button
                type="button"
                onClick={handleCopyChecklist}
                className="px-3.5 py-2.5 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37] hover:bg-[#D4AF37]/20 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSummary ? 'Copied Details!' : 'Copy Summary'}</span>
              </button>
            </div>

            <button
              type="submit"
              className="px-7 py-3 rounded-full bg-[#D4AF37] hover:bg-[#E5C158] text-[#0D2B1D] font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{savedSuccess ? 'Saved Changes!' : 'Apply Settings'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

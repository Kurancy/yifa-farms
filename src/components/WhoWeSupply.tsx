import React, { useState } from 'react';
import { whoWeSupplyData } from '../data/farmData';
import { Home, Utensils, Building2, Store, Boxes, CheckCircle2, ArrowRight } from 'lucide-react';

interface WhoWeSupplyProps {
  onSelectSegmentQuote: (segmentTitle: string) => void;
}

export const WhoWeSupply: React.FC<WhoWeSupplyProps> = ({ onSelectSegmentQuote }) => {
  const [activeSegmentId, setActiveSegmentId] = useState(whoWeSupplyData[0].id);

  const getSegmentIcon = (iconName: string) => {
    switch (iconName) {
      case 'Home':
        return <Home className="w-5 h-5" />;
      case 'Utensils':
        return <Utensils className="w-5 h-5" />;
      case 'Building2':
        return <Building2 className="w-5 h-5" />;
      case 'Store':
        return <Store className="w-5 h-5" />;
      case 'Boxes':
        return <Boxes className="w-5 h-5" />;
      default:
        return <CheckCircle2 className="w-5 h-5" />;
    }
  };

  const currentSegment = whoWeSupplyData.find(s => s.id === activeSegmentId) || whoWeSupplyData[0];

  return (
    <section id="supply" className="py-12 lg:py-16 bg-transparent text-[#FDFBF5] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="h-[1px] w-6 bg-[#D4AF37]"></span>
            <span className="text-[#D4AF37] text-xs font-bold tracking-[0.25em] uppercase">Market Channels & Logistics</span>
            <span className="h-[1px] w-6 bg-[#D4AF37]"></span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#FDFBF5] tracking-tight uppercase">
            Who We Supply
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#FDFBF5]/75 leading-relaxed">
            From single-family breakfast tables to full trailer loads for regional wholesalers, our supply chain is structured to deliver peak freshness.
          </p>
        </div>

        {/* Sector Nav Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-12">
          {whoWeSupplyData.map((seg) => (
            <button
              key={seg.id}
              type="button"
              onClick={() => setActiveSegmentId(seg.id)}
              className={`inline-flex items-center gap-2 px-5 py-3 rounded-full font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                activeSegmentId === seg.id
                  ? 'bg-[#D4AF37] text-[#0D2B1D] shadow-lg'
                  : 'bg-white/5 text-[#FDFBF5]/70 border border-white/10 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span>{getSegmentIcon(seg.iconName)}</span>
              <span>{seg.title}</span>
            </button>
          ))}
        </div>

        {/* Active Segment Feature Showcase */}
        <div className="bg-[#0D2B1D] rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 text-[10px] font-bold uppercase tracking-[0.2em] mb-3">
                Specialized Supply Solution
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white font-['Outfit',sans-serif]">
                {currentSegment.title}
              </h3>
              <p className="text-xs uppercase tracking-wider font-semibold text-[#D4AF37] mt-1">
                {currentSegment.subtitle}
              </p>
              <p className="mt-3 text-sm sm:text-base text-[#FDFBF5]/80 leading-relaxed">
                {currentSegment.description}
              </p>
            </div>

            {/* Typical Order Packages */}
            <div className="bg-white/5 rounded-2xl p-5 border border-white/10 space-y-3">
              <h4 className="text-xs uppercase font-bold text-[#D4AF37] tracking-wider">
                Typical Supply Configurations
              </h4>
              <div className="space-y-2">
                {currentSegment.typicalOrders.map((ord, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-[#FDFBF5]/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4A7C59] mt-2 shrink-0"></span>
                    <span>{ord}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Advantages */}
            <div className="space-y-2">
              <h4 className="text-xs uppercase font-bold text-[#D4AF37] tracking-wider">
                Dedicated Service Benefits
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {currentSegment.benefits.map((ben, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-[#FDFBF5]/80 flex items-center gap-2 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-[#4A7C59] shrink-0" />
                    <span className="truncate">{ben}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Trigger */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => onSelectSegmentQuote(currentSegment.title)}
                className="px-7 py-3.5 rounded-full bg-[#D4AF37] hover:bg-[#E5C158] text-[#0D2B1D] font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <span>Request {currentSegment.title} Supply Quote</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Visual Tile */}
          <div className="lg:col-span-5 bg-[#0A2217] text-[#FDFBF5] rounded-2xl p-6 sm:p-8 space-y-6 flex flex-col justify-between border border-white/10 shadow-xl">
            <div className="space-y-3">
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#D4AF37]">
                Kaduna & Regional Reach
              </span>
              <h4 className="text-xl font-bold text-white">
                Scheduled Dispatch Runs
              </h4>
              <p className="text-xs sm:text-sm text-[#FDFBF5]/75 leading-relaxed">
                We operate early morning dispatch runs across Kaduna North, Kaduna South, Barnawa, Malali, and the Zaria corridor to ensure goods arrive prior to market opening and kitchen prep times.
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-white/10">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#FDFBF5]/60">Payment Terms:</span>
                <span className="font-semibold text-white">Bank Transfer / Cash / Commercial Terms</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#FDFBF5]/60">Dispatch Hub:</span>
                <span className="font-semibold text-[#D4AF37]">Kaduna Metropolis & Freight Corridor</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

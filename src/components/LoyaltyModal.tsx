import React, { useState } from 'react';
import { useFarmConfig } from '../context/FarmConfigContext';
import {
  Gift,
  X,
  Award,
  Sparkles,
  CheckCircle2,
  MessageCircle,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  Calculator,
  Crown
} from 'lucide-react';

interface LoyaltyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenQuote?: () => void;
}

export const LoyaltyModal: React.FC<LoyaltyModalProps> = ({
  isOpen,
  onClose,
  onOpenQuote
}) => {
  const { config } = useFarmConfig();
  const [calcEggCrates, setCalcEggCrates] = useState<number>(10);
  const [calcChickens, setCalcChickens] = useState<number>(8);
  const [calcName, setCalcName] = useState<string>('');
  const [calcPhone, setCalcPhone] = useState<string>('');

  if (!isOpen) return null;

  // Calculate points: 10 pts per egg crate, 25 pts per chicken
  const monthlyPoints = calcEggCrates * 10 + calcChickens * 25;
  const annualPoints = monthlyPoints * 12;

  let currentTier = 'Green Sprout';
  let tierColor = 'text-emerald-400';
  let tierDiscount = 'Standard Farm Gate Rates + Harvest Alerts';
  if (monthlyPoints >= 350) {
    currentTier = 'Golden Roost VIP';
    tierColor = 'text-[#D4AF37]';
    tierDiscount = '10% Off Bulk Poultry + Free Weekend Priority Kaduna Dispatch';
  } else if (monthlyPoints >= 150) {
    currentTier = 'Harvest Silver';
    tierColor = 'text-slate-200';
    tierDiscount = '5% Off Egg Crates + Free Crate Cushioning on Bulk Runs';
  }

  const handleJoinWhatsApp = () => {
    const text = `Hello YIFA Farms, I would like to register for the YIFA Farm Club Loyalty Rewards Program.${
      calcName ? ` Name: ${calcName}.` : ''
    }${calcPhone ? ` Phone: ${calcPhone}.` : ''} I estimate buying ~${calcEggCrates} egg crates and ${calcChickens} chickens monthly.`;
    window.open(`https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="loyalty-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in"
    >
      <div
        className="relative bg-[#091F15] border border-white/15 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden text-[#FDFBF5] my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Decorative Gold Bar */}
        <div className="h-2 bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#4A7C59]"></div>

        {/* Modal Header */}
        <div className="p-6 sm:p-8 border-b border-white/10 flex items-start justify-between gap-4 bg-[#0D2B1D]">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#D4AF37] text-[#0D2B1D] flex items-center justify-center font-black shadow-lg">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#D4AF37]">
                  YIFA Farm Club & Rewards
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-[9px] font-bold uppercase tracking-wider">
                  Kaduna Customer Club
                </span>
              </div>
              <h2 id="loyalty-modal-title" className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase mt-0.5">
                Earn Points on Every Egg & Poultry Order
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close loyalty modal"
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 sm:p-8 space-y-8 max-h-[75vh] overflow-y-auto">
          {/* Program Overview Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0A2217] border border-[#D4AF37]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                <Crown className="w-3.5 h-3.5" />
                <span>Transparent Farm Rewards for Kaduna Kitchens</span>
              </div>
              <p className="text-xs sm:text-sm text-[#FDFBF5]/85 leading-relaxed">
                Whether you run a catering business in Barnawa, bake pastries in Sabon Tasha, or cook for your family in Malali, every purchase accrues redeemable points.
              </p>
            </div>
            <div className="px-4 py-2 rounded-xl bg-[#D4AF37] text-[#0D2B1D] font-black text-xs uppercase tracking-wider whitespace-nowrap shrink-0 shadow-md">
              100% Free Enrollment
            </div>
          </div>

          {/* 3 Steps: How Points Are Earned */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
              How You Accumulate Points
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">🥚</span>
                  <span className="text-xs font-black px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37]">
                    +10 pts / Crate
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Fresh Farm Eggs</h4>
                  <p className="text-[11px] text-[#FDFBF5]/60 mt-1">
                    Earn 10 points per 30-egg crate (or 150 points per 12-crate wholesale carton).
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">🍗</span>
                  <span className="text-xs font-black px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37]">
                    +25 pts / Bird
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Chilled & Live Poultry</h4>
                  <p className="text-[11px] text-[#FDFBF5]/60 mt-1">
                    Earn 25 points per dressed broiler (or 300 points per commercial coop batch).
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">🤝</span>
                  <span className="text-xs font-black px-2 py-0.5 rounded-full bg-[#4A7C59]/30 text-emerald-300">
                    +100 pts Bonus
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Referral Bonus</h4>
                  <p className="text-[11px] text-[#FDFBF5]/60 mt-1">
                    Introduce a fellow Kaduna caterer or household and get 100 bonus points on their first order.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Monthly Points & Rewards Simulator */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#0D2B1D] border border-white/10 space-y-5">
            <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
                  Interactive Rewards Calculator
                </span>
              </div>
              <span className="text-[11px] text-[#FDFBF5]/60">Simulate Monthly Savings</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Egg Crates Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span>Monthly Egg Crates:</span>
                  <span className="text-sm font-mono font-bold text-[#D4AF37]">{calcEggCrates} Crates ({calcEggCrates * 30} Eggs)</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={calcEggCrates}
                  onChange={(e) => setCalcEggCrates(Number(e.target.value))}
                  className="w-full accent-[#D4AF37] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#FDFBF5]/40 font-mono">
                  <span>1 Crate (Household)</span>
                  <span>50+ Crates (Commercial Baker)</span>
                </div>
              </div>

              {/* Chickens Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span>Monthly Dressed Broilers:</span>
                  <span className="text-sm font-mono font-bold text-[#D4AF37]">{calcChickens} Birds</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="80"
                  value={calcChickens}
                  onChange={(e) => setCalcChickens(Number(e.target.value))}
                  className="w-full accent-[#D4AF37] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#FDFBF5]/40 font-mono">
                  <span>0 Birds</span>
                  <span>80 Birds (Events & Restos)</span>
                </div>
              </div>
            </div>

            {/* Simulated Tier Output */}
            <div className="p-4 rounded-2xl bg-[#071810] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-[#FDFBF5]/60">
                  Estimated Rewards Yield:
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-2xl font-black font-mono text-[#D4AF37]">
                    {monthlyPoints.toLocaleString()} Points/mo
                  </span>
                  <span className="text-xs text-[#FDFBF5]/50">
                    (~{annualPoints.toLocaleString()} pts/yr)
                  </span>
                </div>
              </div>

              <div className="text-center sm:text-right">
                <div className="text-[10px] uppercase font-bold tracking-wider text-[#FDFBF5]/60">
                  Unlocked Farm Club Tier:
                </div>
                <div className={`text-base font-extrabold ${tierColor} flex items-center justify-center sm:justify-end gap-1.5`}>
                  <Sparkles className="w-4 h-4" />
                  <span>{currentTier}</span>
                </div>
                <div className="text-[11px] text-[#FDFBF5]/70 mt-0.5">
                  {tierDiscount}
                </div>
              </div>
            </div>
          </div>

          {/* 3 Tier Levels Breakdown */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
              Farm Club Tier Privileges
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                <div className="font-bold text-emerald-400 uppercase text-[11px]">🌱 Green Sprout (0–149 pts)</div>
                <p className="text-[11px] text-[#FDFBF5]/70">
                  Farm-gate price access, daily harvest alert SMS/WhatsApp, and standard Kaduna dispatch booking.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-slate-400/30 space-y-1.5">
                <div className="font-bold text-slate-200 uppercase text-[11px]">🥈 Harvest Silver (150–349 pts)</div>
                <p className="text-[11px] text-[#FDFBF5]/70">
                  5% rebate on bulk egg cartons, free crate cushioning, and priority morning packing slots.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-[#D4AF37]/50 space-y-1.5">
                <div className="font-bold text-[#D4AF37] uppercase text-[11px]">🥇 Golden Roost VIP (350+ pts)</div>
                <p className="text-[11px] text-[#FDFBF5]/70">
                  10% poultry discounts, guaranteed festive flock reservations (Christmas/Eid), and zero dispatch fees in Kaduna Central.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-6 sm:p-8 bg-[#0D2B1D] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleJoinWhatsApp}
            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20B858] text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Join Farm Club on WhatsApp</span>
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {onOpenQuote && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenQuote();
                }}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#D4AF37] hover:bg-[#E5C158] text-[#0D2B1D] font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer text-center"
              >
                Place Qualifying Order
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3.5 rounded-full bg-white/5 hover:bg-white/10 text-[#FDFBF5]/70 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

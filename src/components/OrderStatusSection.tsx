import React, { useState, useEffect } from 'react';
import { OrderStatusRecord } from '../types';
import { useFarmConfig } from '../context/FarmConfigContext';
import { useToast } from '../context/ToastContext';
import { OrderStatusSkeleton } from './skeletons/LoadingSkeletons';
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  MessageCircle,
  AlertCircle,
  FileText,
  User,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

export const OrderStatusSection: React.FC = () => {
  const { config, orders } = useFarmConfig();
  const toast = useToast();
  const [query, setQuery] = useState<string>('YIFA-8421');
  const [searchedRecord, setSearchedRecord] = useState<OrderStatusRecord | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(true);
  const [hasSearched, setHasSearched] = useState<boolean>(true);

  // Initialize with first order if available
  useEffect(() => {
    if (orders.length > 0 && !searchedRecord) {
      handleSearch(undefined, orders[0].id, false);
    } else {
      setIsSearching(false);
    }
  }, [orders]);

  const handleSearch = (e?: React.FormEvent, explicitCode?: string, showToastFeedback: boolean = true) => {
    if (e) e.preventDefault();
    const codeToSearch = (explicitCode || query).trim().toUpperCase();
    if (!codeToSearch) {
      toast.error('Please enter an Invoice / Order reference code (e.g. YIFA-8421).', 'Missing Code');
      return;
    }

    setIsSearching(true);
    setTimeout(() => {
      // 1. Search in live unified orders database
      const liveMatch = orders.find(
        o => o.id.toUpperCase() === codeToSearch ||
             o.id.replace('YIFA-', '').toUpperCase() === codeToSearch.replace('YIFA-', '')
      );

      if (liveMatch) {
        let stageNum: 1 | 2 | 3 | 4 = 1;
        let stageName: OrderStatusRecord['stageName'] = 'Order Confirmed';

        if (liveMatch.status === 'confirmed') {
          stageNum = 1;
          stageName = 'Order Confirmed';
        } else if (liveMatch.status === 'processing') {
          stageNum = 2;
          stageName = 'Quality Batching';
        } else if (liveMatch.status === 'dispatched') {
          stageNum = 3;
          stageName = 'Dispatched & En Route';
        } else if (liveMatch.status === 'delivered') {
          stageNum = 4;
          stageName = 'Delivered';
        } else if (liveMatch.status === 'pending') {
          stageNum = 1;
          stageName = 'Order Confirmed';
        }

        const itemsList = liveMatch.items.map(i => `${i.name} (${i.quantity} ${i.unit})`);

        setSearchedRecord({
          invoiceNumber: liveMatch.id,
          customerName: liveMatch.customerName,
          items: itemsList.length > 0 ? itemsList : ['Fresh Farm Produce Consignment'],
          totalVolume: `₦${liveMatch.totalAmount.toLocaleString()} (${liveMatch.items.length} Product Line${liveMatch.items.length > 1 ? 's' : ''})`,
          destination: liveMatch.deliveryAddress || 'Kaduna Delivery',
          currentStage: stageNum,
          stageName,
          stageDescription: liveMatch.stageDescription || 'Processing at Kaduna Farm.',
          orderDate: liveMatch.orderDate,
          estimatedDelivery: liveMatch.estimatedDelivery || 'Today',
          dispatchDriver: liveMatch.dispatchDriver || 'Logistics Fleet Team',
          vehicleNote: liveMatch.vehicleNote || 'Farm Dispatch Vehicle',
          paymentStatus: liveMatch.paymentStatus as any
        });

        if (showToastFeedback) {
          toast.success(`Found live dispatch status for Order #${liveMatch.id} (${stageName})`, 'Order Located');
        }
      } else {
        // Fallback for custom code
        const stageNum: 1 | 2 | 3 | 4 = 2;
        setSearchedRecord({
          invoiceNumber: codeToSearch.startsWith('YIFA-') ? codeToSearch : `YIFA-${codeToSearch}`,
          customerName: 'Kaduna Commercial Customer',
          items: ['Fresh Farm Table Eggs (Graded Crates)', 'Chilled Farm Broilers'],
          totalVolume: 'Consignment in Active Batching',
          destination: 'Kaduna Metropolis & Dispatch Corridor',
          currentStage: stageNum,
          stageName: 'Quality Batching',
          stageDescription: 'Eggs and poultry are undergoing size sorting and secure crate padding at Kaduna farm.',
          orderDate: 'Today',
          estimatedDelivery: 'Scheduled Dispatch Run',
          dispatchDriver: 'Kaduna Farm Logistics Desk',
          vehicleNote: 'Farm Dispatch Vehicle',
          paymentStatus: 'Paid'
        });

        if (showToastFeedback) {
          toast.info(`Showing simulated dispatch batch for #${codeToSearch}`, 'Status Retrieved');
        }
      }
      setIsSearching(false);
      setHasSearched(true);
    }, 450);
  };

  const handleSelectQuickDemo = (invoiceCode: string) => {
    setQuery(invoiceCode);
    handleSearch(undefined, invoiceCode);
  };

  const whatsappEscalation = searchedRecord
    ? `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(
        `Hello YIFA Farms, I am tracking my delivery for Invoice #${searchedRecord.invoiceNumber} (${searchedRecord.destination}). Please give me a live dispatch update.`
      )}`
    : `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(
        `Hello YIFA Farms, I would like to check the status of my recent farm order.`
      )}`;

  const getStageColor = (stage: number, currentStage: number) => {
    if (stage < currentStage) return 'bg-[#D4AF37] text-[#0D2B1D] border-[#D4AF37]';
    if (stage === currentStage) return 'bg-[#D4AF37] text-[#0D2B1D] border-[#D4AF37] ring-4 ring-[#D4AF37]/20';
    return 'bg-[#071810] text-[#FDFBF5]/40 border-white/10';
  };

  return (
    <section id="order-status" className="pt-2 pb-20 sm:pt-4 sm:pb-24 bg-transparent text-[#FDFBF5] relative overflow-hidden">
      {/* Background visual highlight */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="h-[1px] w-6 bg-[#D4AF37]"></span>
            <span className="text-[#D4AF37] text-xs font-bold tracking-[0.25em] uppercase">
              Live Logistics & Dispatch Tracking
            </span>
            <span className="h-[1px] w-6 bg-[#D4AF37]"></span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#FDFBF5] tracking-tight uppercase">
            Check Order & Delivery Status
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#FDFBF5]/75 leading-relaxed">
            Enter your YIFA Farms invoice number or quote reference to track packing stages, Kaduna dispatch routes, and estimated delivery times.
          </p>
        </div>

        {/* Search Bar & Quick Demo Chips */}
        <div className="max-w-3xl mx-auto mb-12">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#FDFBF5]/40" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter Invoice Number (e.g. YIFA-8421)"
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[#0D2B1D] border border-white/10 text-white placeholder-[#FDFBF5]/40 font-mono text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] shadow-xl"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="py-4 px-8 rounded-2xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#0D2B1D] font-bold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-lg active:scale-98 flex items-center justify-center gap-2 shrink-0 disabled:opacity-80"
            >
              <Search className="w-4 h-4" />
              <span>Track Consignment</span>
            </button>
          </form>

          {/* Quick Demo Clickable Pills */}
          <div className="mt-4 flex items-center justify-center sm:justify-start gap-2 flex-wrap text-xs text-[#FDFBF5]/60">
            <span className="text-[11px] font-semibold text-[#D4AF37]">Live Order Lookup:</span>
            {orders.slice(0, 4).map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => handleSelectQuickDemo(s.id)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-mono border transition-all cursor-pointer ${
                  query.toUpperCase() === s.id
                    ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37] font-bold'
                    : 'bg-white/5 border-white/10 text-[#FDFBF5]/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                {s.id}
              </button>
            ))}
          </div>
        </div>

        {/* Results Card or Skeleton Loading State */}
        {isSearching ? (
          <OrderStatusSkeleton />
        ) : hasSearched && searchedRecord ? (
          <div className="max-w-4xl mx-auto bg-[#0D2B1D] rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl space-y-8 animate-in fade-in duration-300">
            {/* Top Bar of Record */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-bold text-[#D4AF37] tracking-[0.2em]">
                    Consignment Manifest
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-white/5 text-[#FDFBF5]/60 border border-white/10 font-mono">
                    {searchedRecord.orderDate}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-mono font-bold text-white mt-1">
                  #{searchedRecord.invoiceNumber}
                </h3>
                <p className="text-xs sm:text-sm text-[#FDFBF5]/75 mt-0.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Customer: <strong className="text-white">{searchedRecord.customerName}</strong></span>
                </p>
              </div>

              {/* Status Badge */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2">
                <div className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 ${
                  searchedRecord.currentStage === 4
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : searchedRecord.currentStage === 3
                    ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 animate-pulse'
                    : 'bg-white/10 text-white border border-white/10'
                }`}>
                  <Truck className="w-3.5 h-3.5" />
                  <span>{searchedRecord.stageName}</span>
                </div>
                <span className="text-[11px] text-[#FDFBF5]/50">
                  Payment: <strong className="text-[#D4AF37]">{searchedRecord.paymentStatus}</strong>
                </span>
              </div>
            </div>

            {/* Visual 4-Step Progress Bar */}
            <div className="space-y-4">
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
                Dispatch & Delivery Timeline
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-2 relative">
                {[
                  { step: 1, title: 'Order Confirmed', subtitle: 'Flock Allocation Logged' },
                  { step: 2, title: 'Quality Batching', subtitle: 'Graded & Crate Padded' },
                  { step: 3, title: 'En Route', subtitle: 'Kaduna Van Dispatch' },
                  { step: 4, title: 'Delivered', subtitle: 'Handed Over at Gate' },
                ].map((st, idx) => {
                  const isPassed = st.step <= searchedRecord.currentStage;
                  const isCurrent = st.step === searchedRecord.currentStage;
                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl border transition-all ${
                        isCurrent
                          ? 'bg-[#0A2217] border-[#D4AF37] shadow-lg'
                          : isPassed
                          ? 'bg-white/5 border-white/10'
                          : 'bg-white/[0.02] border-white/5 opacity-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs border ${getStageColor(st.step, searchedRecord.currentStage)}`}>
                          {isPassed && !isCurrent ? '✓' : st.step}
                        </div>
                        {isCurrent && (
                          <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#D4AF37] text-[#0D2B1D]">
                            Current
                          </span>
                        )}
                      </div>
                      <div className="font-bold text-xs sm:text-sm text-white">
                        {st.title}
                      </div>
                      <div className="text-[11px] text-[#FDFBF5]/60 mt-0.5">
                        {st.subtitle}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Current Stage Note */}
            <div className="p-4 rounded-2xl bg-[#0A2217] border border-[#D4AF37]/30 text-xs sm:text-sm flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-bold text-[#D4AF37] uppercase tracking-wider text-[11px]">
                  Live Dispatch Update Note
                </div>
                <p className="text-[#FDFBF5]/85 leading-relaxed">
                  {searchedRecord.stageDescription}
                </p>
              </div>
            </div>

            {/* Consignment Items & Logistics Detail Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Ordered Items & Volume */}
              <div className="bg-[#071810] p-6 rounded-2xl border border-white/10 space-y-4">
                <div className="text-xs uppercase font-bold text-[#D4AF37] tracking-wider flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  <span>Itemized Manifest</span>
                </div>
                <div className="space-y-2">
                  {searchedRecord.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-[#FDFBF5]/90">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-[#FDFBF5]/60">
                  <span>Consignment Total:</span>
                  <strong className="text-white font-mono">{searchedRecord.totalVolume}</strong>
                </div>
              </div>

              {/* Right Column: Destination & Dispatch Driver */}
              <div className="bg-[#071810] p-6 rounded-2xl border border-white/10 space-y-4">
                <div className="text-xs uppercase font-bold text-[#D4AF37] tracking-wider flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Destination & Assigned Driver</span>
                </div>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="text-[#FDFBF5]/90">
                    <span className="text-[#FDFBF5]/50 block text-[11px]">Delivery Location:</span>
                    <strong>{searchedRecord.destination}</strong>
                  </div>
                  <div className="text-[#FDFBF5]/90">
                    <span className="text-[#FDFBF5]/50 block text-[11px]">Assigned Driver & Unit:</span>
                    <strong>{searchedRecord.dispatchDriver}</strong> ({searchedRecord.vehicleNote})
                  </div>
                </div>
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-[#FDFBF5]/60">
                  <span>Estimated Delivery Time:</span>
                  <strong className="text-emerald-400">{searchedRecord.estimatedDelivery}</strong>
                </div>
              </div>
            </div>

            {/* Bottom Support & Escalation Actions */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-[#FDFBF5]/60 text-center sm:text-left">
                Need priority rerouting or invoice assistance? Our Kaduna dispatch team is online.
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => handleSearch(undefined, searchedRecord.invoiceNumber)}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-white/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Refresh Status</span>
                </button>

                <a
                  href={whatsappEscalation}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20BA58] text-slate-950 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Dispatch WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
};

import React, { useState, useEffect, useMemo } from 'react';
import { useFarmConfig } from '../../context/FarmConfigContext';
import { UnifiedOrder, OrderStatus } from '../../types';
import { AdminOrderRowsSkeleton } from '../skeletons/LoadingSkeletons';
import {
  generateDynamicDailySales,
  getFormattedRangeHeader,
  getTodayFullFormatted
} from '../../utils/dateUtils';
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Clock,
  Truck,
  AlertTriangle,
  ArrowUpRight,
  Plus,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronRight,
  Eye,
  RefreshCw,
  Sparkles
} from 'lucide-react';

interface AdminDashboardOverviewProps {
  onNavigateTab: (tab: 'orders' | 'inventory' | 'reports' | 'staff') => void;
  onOpenNewOrderModal: () => void;
  onSelectOrder: (order: UnifiedOrder) => void;
}

export const AdminDashboardOverview: React.FC<AdminDashboardOverviewProps> = ({
  onNavigateTab,
  onOpenNewOrderModal,
  onSelectOrder
}) => {
  const { salesMetrics, orders, inventory, lowStockCount, updateOrderStatus } = useFarmConfig();
  const [chartView, setChartView] = useState<'7days' | '30days'>('7days');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 250);
    return () => clearTimeout(timer);
  }, []);

  // Dynamic real-time calculated days ending on system TODAY
  const daily7DaysPoints = useMemo(() => {
    return generateDynamicDailySales(orders, 7);
  }, [orders]);

  const daily30DaysPoints = useMemo(() => {
    return generateDynamicDailySales(orders, 30);
  }, [orders]);

  const activePoints = chartView === '7days' ? daily7DaysPoints : daily30DaysPoints;

  const maxRevenue = useMemo(() => {
    const maxVal = Math.max(...activePoints.map((d) => d.revenue), 100000);
    return Math.ceil(maxVal * 1.15); // headroom for chart bars
  }, [activePoints]);

  const totalPeriodRevenue = useMemo(() => {
    return activePoints.reduce((acc, curr) => acc + curr.revenue, 0);
  }, [activePoints]);

  const peakPoint = useMemo(() => {
    if (activePoints.length === 0) return null;
    return [...activePoints].sort((a, b) => b.revenue - a.revenue)[0];
  }, [activePoints]);

  const lowStockItems = inventory.filter((i) => i.currentStock <= i.lowStockThreshold);
  const recentOrders = orders.slice(0, 6);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Pending
          </span>
        );
      case 'confirmed':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
            Confirmed
          </span>
        );
      case 'processing':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
            Batching
          </span>
        );
      case 'dispatched':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            En Route
          </span>
        );
      case 'delivered':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Delivered
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#0D2B1D] p-6 rounded-3xl border border-white/10 shadow-xl">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest">
              Live Operations Feed
            </span>
            <span className="text-white/30">•</span>
            <span className="text-xs text-white/80 font-medium font-mono">
              {getTodayFullFormatted()}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            Farm Performance Overview
          </h1>
          <p className="text-xs text-[#FDFBF5]/60 mt-1 max-w-2xl">
            Real-time synchronization between Rigachikun farm pens, dispatch logistics, and customer storefront.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigateTab('reports')}
            className="py-3 px-4 rounded-xl border border-white/15 hover:bg-white/5 text-[#FDFBF5] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2"
          >
            <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
            <span>Sales Analytics</span>
          </button>

          <button
            onClick={onOpenNewOrderModal}
            className="py-3 px-5 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#0D2B1D] text-xs font-black uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-[#D4AF37]/15 flex items-center gap-2 active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Record Order</span>
          </button>
        </div>
      </div>

      {/* 4 Core Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Sales */}
        <div className="bg-[#0D2B1D] border border-white/10 p-5 rounded-2xl shadow-lg relative overflow-hidden group hover:border-[#D4AF37]/40 transition-all">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#FDFBF5]/60">Today's Sales</span>
            <div className="p-2 rounded-xl bg-[#D4AF37]/15 text-[#D4AF37]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            ₦{salesMetrics.todayRevenue.toLocaleString()}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-emerald-400 font-bold flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" />
              {salesMetrics.todayOrders} Orders Today
            </span>
            <span className="text-[#FDFBF5]/40 font-mono text-[11px]">Real-time</span>
          </div>
        </div>

        {/* This Week */}
        <div className="bg-[#0D2B1D] border border-white/10 p-5 rounded-2xl shadow-lg relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#FDFBF5]/60">This Week's Revenue</span>
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            ₦{salesMetrics.weekRevenue.toLocaleString()}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-[#FDFBF5]/70 font-medium">
              {salesMetrics.weekOrders} Consignments
            </span>
            <span className="text-emerald-400 text-[11px] font-bold">Past 7 Days</span>
          </div>
        </div>

        {/* This Month */}
        <div className="bg-[#0D2B1D] border border-white/10 p-5 rounded-2xl shadow-lg relative overflow-hidden group hover:border-blue-500/40 transition-all">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#FDFBF5]/60">This Month's Sales</span>
            <div className="p-2 rounded-xl bg-blue-500/15 text-blue-400">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            ₦{salesMetrics.monthRevenue.toLocaleString()}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-[#FDFBF5]/70 font-medium">
              Avg. Order: <span className="font-mono text-white font-bold">₦{Math.round(salesMetrics.averageOrderValue).toLocaleString()}</span>
            </span>
            <span className="text-blue-400 text-[11px] font-bold">30 Days</span>
          </div>
        </div>

        {/* Pending & Dispatches */}
        <div className="bg-[#0D2B1D] border border-white/10 p-5 rounded-2xl shadow-lg relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#FDFBF5]/60">Active Dispatch Run</span>
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {salesMetrics.activeDispatches} En Route
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-amber-300 font-medium">
              {salesMetrics.pendingOrders} Pending Review
            </span>
            {lowStockCount > 0 ? (
              <span className="text-rose-400 font-bold text-[11px]">{lowStockCount} Low Stock</span>
            ) : (
              <span className="text-emerald-400 font-bold text-[11px]">Stock Healthy</span>
            )}
          </div>
        </div>
      </div>

      {/* Low Stock Warning Banner if any */}
      {lowStockItems.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                Inventory Attention Required ({lowStockItems.length} Products Low in Warehouse)
              </h4>
              <p className="text-xs text-[#FDFBF5]/70 mt-0.5">
                {lowStockItems.map((i) => `${i.name} (${i.currentStock} ${i.unit} left)`).join(' • ')}
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('inventory')}
            className="py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#071810] font-black text-xs uppercase tracking-wider transition-all cursor-pointer shrink-0"
          >
            Restock Inventory
          </button>
        </div>
      )}

      {/* Interactive Sales Trend & Dynamic Daily Chart */}
      <div className="bg-[#0D2B1D] border border-white/10 rounded-3xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-widest">
                Dynamic Revenue Analytics
              </span>
              <span className="text-xs text-[#FDFBF5]/40 font-mono">
                ({getFormattedRangeHeader(chartView === '7days' ? 7 : 30)})
              </span>
            </div>
            <h3 className="text-lg font-bold text-white uppercase tracking-wide mt-0.5">
              Daily Commercial Sales Trend
            </h3>
          </div>

          <div className="flex items-center gap-2 bg-[#071810] p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setChartView('7days')}
              className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                chartView === '7days' ? 'bg-[#D4AF37] text-[#0D2B1D]' : 'text-[#FDFBF5]/60 hover:text-white'
              }`}
            >
              Past 7 Days
            </button>
            <button
              onClick={() => setChartView('30days')}
              className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                chartView === '30days' ? 'bg-[#D4AF37] text-[#0D2B1D]' : 'text-[#FDFBF5]/60 hover:text-white'
              }`}
            >
              Past 30 Days
            </button>
          </div>
        </div>

        {/* SVG Dynamic Bars */}
        <div className="space-y-4">
          <div
            className={`grid gap-2 sm:gap-3 items-end h-60 pt-8 pb-3 px-3 bg-[#071810]/70 rounded-2xl border border-white/5 ${
              chartView === '7days' ? 'grid-cols-7' : 'grid-cols-10 sm:grid-cols-15 md:grid-cols-30 overflow-x-auto'
            }`}
          >
            {activePoints.map((point, idx) => {
              const heightPct = Math.max(14, Math.round((point.revenue / maxRevenue) * 100));

              return (
                <div key={idx} className="flex flex-col items-center h-full justify-end group relative min-w-[20px]">
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-12 bg-black/95 text-white text-[11px] font-mono py-1.5 px-2.5 rounded-xl pointer-events-none whitespace-nowrap z-30 border border-[#D4AF37]/30 shadow-2xl">
                    <div className="font-bold text-[#D4AF37]">{point.fullLabel}</div>
                    <div>₦{point.revenue.toLocaleString()} • {point.ordersCount} orders</div>
                  </div>

                  {/* Bar */}
                  <div
                    style={{ height: `${heightPct}%` }}
                    className={`w-full max-w-[44px] rounded-t-xl transition-all duration-500 relative cursor-pointer ${
                      point.isToday
                        ? 'bg-[#D4AF37] shadow-lg shadow-[#D4AF37]/30'
                        : point.isYesterday
                        ? 'bg-emerald-400 group-hover:bg-emerald-300'
                        : 'bg-emerald-600/75 group-hover:bg-emerald-500'
                    }`}
                  >
                    {chartView === '7days' && (
                      <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold text-[#FDFBF5]/80 hidden sm:block">
                        {Math.round(point.revenue / 1000)}k
                      </div>
                    )}
                  </div>

                  {/* Dynamic Label */}
                  {chartView === '7days' ? (
                    <span
                      className={`text-[11px] font-bold mt-2 truncate w-full text-center ${
                        point.isToday ? 'text-[#D4AF37] font-black' : 'text-[#FDFBF5]/60'
                      }`}
                    >
                      {point.dayLabel}
                    </span>
                  ) : (
                    idx % 5 === 0 && (
                      <span className="text-[9px] font-mono mt-1 text-[#FDFBF5]/40 truncate">
                        {point.shortDate}
                      </span>
                    )
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs text-[#FDFBF5]/60 px-2 gap-2">
            <span>
              {peakPoint && (
                <>
                  <strong className="text-white">Peak Period:</strong> {peakPoint.fullLabel} (₦{peakPoint.revenue.toLocaleString()} / {peakPoint.ordersCount} orders)
                </>
              )}
            </span>
            <span className="font-mono text-white">
              Period Aggregate: <strong className="text-[#D4AF37]">₦{totalPeriodRevenue.toLocaleString()}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-[#0D2B1D] border border-white/10 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-widest">Real-time Feed</div>
            <h3 className="text-lg font-bold text-white uppercase tracking-wide">Recent Farm Orders</h3>
          </div>

          <button
            onClick={() => onNavigateTab('orders')}
            className="text-xs font-bold text-[#D4AF37] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({orders.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#FDFBF5]/90">
            <thead className="bg-[#071810] text-[#FDFBF5]/60 uppercase tracking-wider text-[10px] border-b border-white/10 font-bold">
              <tr>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Consignment Items</th>
                <th className="py-3 px-4 text-right">Amount (₦)</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentOrders.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => onSelectOrder(order)}
                  className="hover:bg-white/[0.03] transition-colors cursor-pointer"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-[#D4AF37]">{order.id}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white">{order.customerName}</div>
                    <div className="text-[11px] text-[#FDFBF5]/50">{order.customerPhone}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-[#FDFBF5]/80 line-clamp-1">
                      {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-white">
                    ₦{order.totalAmount.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-center">{getStatusBadge(order.status)}</td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectOrder(order);
                      }}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-[#FDFBF5]/70 hover:text-white transition-colors cursor-pointer"
                      title="Inspect Invoice & Dispatch"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

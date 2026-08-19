import React, { useState, useEffect } from 'react';
import { useFarmConfig } from '../../context/FarmConfigContext';
import { UnifiedOrder, OrderStatus } from '../../types';
import { AdminOrderRowsSkeleton } from '../skeletons/LoadingSkeletons';
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
  RefreshCw
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
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Realistic revenue data points for 7 days
  const last7DaysData = [
    { label: 'Mon', revenue: 185000, orders: 4 },
    { label: 'Tue', revenue: 240000, orders: 6 },
    { label: 'Wed', revenue: 310000, orders: 8 },
    { label: 'Thu', revenue: 275000, orders: 5 },
    { label: 'Fri', revenue: 420000, orders: 11 },
    { label: 'Sat', revenue: 580000, orders: 14 },
    { label: 'Sun (Today)', revenue: salesMetrics.todayRevenue || 485000, orders: salesMetrics.todayOrders || 7 }
  ];

  const maxRevenue = Math.max(...last7DaysData.map(d => d.revenue), 600000);

  const lowStockItems = inventory.filter(i => i.currentStock <= i.lowStockThreshold);
  const recentOrders = orders.slice(0, 6);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">Pending</span>;
      case 'confirmed':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">Confirmed</span>;
      case 'processing':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">Batching</span>;
      case 'dispatched':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">En Route</span>;
      case 'delivered':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Delivered</span>;
      case 'cancelled':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">Cancelled</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0D2B1D] p-6 rounded-3xl border border-white/10 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest">
              Kaduna Operations Live Feed
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            Farm Performance Overview
          </h1>
          <p className="text-xs text-[#FDFBF5]/60 mt-1">
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
              Avg. Order: <span className="font-mono text-white font-bold">₦{salesMetrics.averageOrderValue.toLocaleString()}</span>
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
                {lowStockItems.map(i => `${i.name} (${i.currentStock} ${i.unit} left)`).join(' • ')}
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

      {/* Interactive Sales Trend & Revenue Chart */}
      <div className="bg-[#0D2B1D] border border-white/10 rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-widest">Revenue Analytics</div>
            <h3 className="text-lg font-bold text-white uppercase tracking-wide">Daily Commercial Sales Trend</h3>
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
              Monthly Summary
            </button>
          </div>
        </div>

        {/* SVG Bar / Area Visualization */}
        <div className="space-y-4">
          <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-56 pt-8 pb-2 px-2 bg-[#071810]/60 rounded-2xl border border-white/5">
            {last7DaysData.map((day, idx) => {
              const heightPct = Math.max(15, Math.round((day.revenue / maxRevenue) * 100));
              const isToday = idx === last7DaysData.length - 1;

              return (
                <div key={idx} className="flex flex-col items-center h-full justify-end group relative">
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-10 bg-black/90 text-white text-[11px] font-mono py-1 px-2 rounded-lg pointer-events-none whitespace-nowrap z-20 border border-white/15 shadow-xl">
                    ₦{day.revenue.toLocaleString()} ({day.orders} orders)
                  </div>

                  {/* Bar */}
                  <div
                    style={{ height: `${heightPct}%` }}
                    className={`w-full max-w-[48px] rounded-t-xl transition-all duration-500 relative ${
                      isToday
                        ? 'bg-[#D4AF37] shadow-lg shadow-[#D4AF37]/25'
                        : 'bg-emerald-600/70 group-hover:bg-emerald-500'
                    }`}
                  >
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold text-[#FDFBF5]/70 hidden sm:block">
                      {Math.round(day.revenue / 1000)}k
                    </div>
                  </div>

                  {/* Label */}
                  <span className={`text-[11px] font-bold mt-2 truncate w-full text-center ${
                    isToday ? 'text-[#D4AF37]' : 'text-[#FDFBF5]/50'
                  }`}>
                    {day.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center text-xs text-[#FDFBF5]/50 px-2">
            <span>Peak Day: Saturday (₦580,000 / 14 Wholesale Crates & Live Birds)</span>
            <span className="font-mono">Weekly Total: ₦{salesMetrics.weekRevenue.toLocaleString()}</span>
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

        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#071810]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0D2B1D] text-[#FDFBF5]/60 uppercase tracking-wider text-[10px] border-b border-white/10">
              <tr>
                <th className="py-3.5 px-4">Invoice #</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Items Summary</th>
                <th className="py-3.5 px-4 text-right">Total Amount</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-center">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-[#FDFBF5]/90">
              {isLoading ? (
                <AdminOrderRowsSkeleton rowsCount={4} />
              ) : (
                recentOrders.map((ord) => (
                  <tr
                    key={ord.id}
                    onClick={() => onSelectOrder(ord)}
                    className="hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-white">
                      {ord.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">{ord.customerName}</div>
                      <div className="text-[11px] text-[#FDFBF5]/50 truncate max-w-[180px]">{ord.deliveryAddress}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="truncate max-w-[220px]">
                        {ord.items.map(i => `${i.quantity} ${i.unit} ${i.name}`).join(', ') || 'Produce'}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-white">
                      ₦{ord.totalAmount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {getStatusBadge(ord.status)}
                    </td>
                    <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onSelectOrder(ord)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-[#D4AF37]/20 hover:text-[#D4AF37] text-[#FDFBF5]/70 transition-colors cursor-pointer"
                        title="Manage Order & Dispatch"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

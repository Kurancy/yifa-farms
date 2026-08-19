import React, { useState, useMemo } from 'react';
import { useFarmConfig } from '../../context/FarmConfigContext';
import {
  TrendingUp,
  Download,
  Printer,
  Calendar,
  DollarSign,
  ShoppingBag,
  Award,
  PieChart,
  ArrowUpRight,
  BarChart3,
  Layers,
  FileSpreadsheet,
  Users,
  CheckCircle2,
  PackageCheck
} from 'lucide-react';

export const AdminReportsPage: React.FC = () => {
  const { salesMetrics, orders, inventory, customers } = useFarmConfig();
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month' | 'all'>('month');

  // Compute Best Sellers
  const productPerformance = useMemo(() => {
    const map: Record<string, { name: string; category: string; quantity: number; revenue: number; unit: string }> = {};

    orders.forEach(ord => {
      if (ord.status === 'cancelled') return;
      ord.items.forEach(item => {
        const key = item.productId || item.name;
        if (!map[key]) {
          map[key] = {
            name: item.name,
            category: item.category,
            quantity: 0,
            revenue: 0,
            unit: item.unit
          };
        }
        map[key].quantity += item.quantity;
        map[key].revenue += item.totalPrice || (item.quantity * item.unitPrice);
      });
    });

    return Object.values(map).sort((a, b) => b.revenue - a.revenue);
  }, [orders]);

  // Compute Category Breakdown
  const categoryBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    let totalRev = 0;

    orders.forEach(ord => {
      if (ord.status === 'cancelled') return;
      ord.items.forEach(item => {
        const cat = item.category || 'other';
        const rev = item.totalPrice || (item.quantity * item.unitPrice);
        map[cat] = (map[cat] || 0) + rev;
        totalRev += rev;
      });
    });

    return Object.entries(map).map(([category, revenue]) => ({
      category,
      revenue,
      percentage: totalRev > 0 ? Math.round((revenue / totalRev) * 100) : 0
    })).sort((a, b) => b.revenue - a.revenue);
  }, [orders]);

  // Customer Loyalty & Cohort Statistics
  const repeatCustomerCount = useMemo(() => {
    return customers.filter(c => c.ordersCount > 1).length;
  }, [customers]);

  const repeatCustomerRate = customers.length > 0
    ? Math.round((repeatCustomerCount / customers.length) * 100)
    : 0;

  const handleExportFullReport = () => {
    const headers = ['Metric', 'Value'];
    const rows = [
      ['Report Generated Date', new Date().toLocaleString()],
      ["Today's Revenue", `NGN ${salesMetrics.todayRevenue.toLocaleString()}`],
      ["Today's Orders", salesMetrics.todayOrders],
      ["This Week's Revenue", `NGN ${salesMetrics.weekRevenue.toLocaleString()}`],
      ["This Week's Orders", salesMetrics.weekOrders],
      ["This Month's Revenue", `NGN ${salesMetrics.monthRevenue.toLocaleString()}`],
      ["This Month's Orders", salesMetrics.monthOrders],
      ['Total Cumulative Revenue', `NGN ${salesMetrics.totalRevenue.toLocaleString()}`],
      ['Total Completed Orders', salesMetrics.totalOrders],
      ['Average Order Value', `NGN ${Math.round(salesMetrics.averageOrderValue).toLocaleString()}`],
      ['Repeat Buyer Retention Rate', `${repeatCustomerRate}%`]
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => `"${e[0]}","${e[1]}"`)].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `YIFA_Farms_Executive_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const activeRevenue =
    timeRange === 'today'
      ? salesMetrics.todayRevenue
      : timeRange === 'week'
      ? salesMetrics.weekRevenue
      : timeRange === 'month'
      ? salesMetrics.monthRevenue
      : salesMetrics.totalRevenue;

  const activeOrdersCount =
    timeRange === 'today'
      ? salesMetrics.todayOrders
      : timeRange === 'week'
      ? salesMetrics.weekOrders
      : timeRange === 'month'
      ? salesMetrics.monthOrders
      : salesMetrics.totalOrders;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0D2B1D] p-6 rounded-3xl border border-white/10 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase font-bold text-[#D4AF37] tracking-[0.25em]">
              Executive Business Intelligence
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Sales & Agribusiness Analytics
          </h1>
          <p className="text-xs text-[#FDFBF5]/70 mt-0.5">
            Production yields, commercial turnover, customer cohorts, and product profitability.
          </p>
        </div>

        {/* Time Filter & Export Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex bg-[#071810] p-1 rounded-2xl border border-white/10">
            {(['today', 'week', 'month', 'all'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer capitalize ${
                  timeRange === r
                    ? 'bg-[#D4AF37] text-[#0D2B1D] shadow-sm'
                    : 'text-[#FDFBF5]/60 hover:text-white'
                }`}
              >
                {r === 'all' ? 'All Time' : r}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleExportFullReport}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold border border-white/10 transition-all flex items-center gap-2 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold border border-white/10 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Selected Period Revenue */}
        <div className="bg-[#0D2B1D] p-5 rounded-3xl border border-white/10 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs text-[#FDFBF5]/60">
            <span className="uppercase font-mono text-[10px]">{timeRange.toUpperCase()} Revenue</span>
            <div className="p-2 rounded-xl bg-[#D4AF37]/15 text-[#D4AF37]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-[#D4AF37]">
            ₦{activeRevenue.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Kaduna Retail & Commercial Flow</span>
          </div>
        </div>

        {/* Selected Period Orders */}
        <div className="bg-[#0D2B1D] p-5 rounded-3xl border border-white/10 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs text-[#FDFBF5]/60">
            <span className="uppercase font-mono text-[10px]">{timeRange.toUpperCase()} Orders</span>
            <div className="p-2 rounded-xl bg-blue-500/15 text-blue-300">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-white">
            {activeOrdersCount}
          </div>
          <div className="text-[11px] text-[#FDFBF5]/60 font-mono">
            {orders.length} total orders on record
          </div>
        </div>

        {/* Average Order Value */}
        <div className="bg-[#0D2B1D] p-5 rounded-3xl border border-white/10 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs text-[#FDFBF5]/60">
            <span className="uppercase font-mono text-[10px]">Average Order Value</span>
            <div className="p-2 rounded-xl bg-purple-500/15 text-purple-300">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-white">
            ₦{Math.round(salesMetrics.averageOrderValue).toLocaleString()}
          </div>
          <div className="text-[11px] text-[#FDFBF5]/60">
            Per transaction basket size
          </div>
        </div>

        {/* Customer Retention Rate */}
        <div className="bg-[#0D2B1D] p-5 rounded-3xl border border-white/10 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs text-[#FDFBF5]/60">
            <span className="uppercase font-mono text-[10px]">Repeat Buyer Rate</span>
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-300">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-emerald-400">
            {repeatCustomerRate}%
          </div>
          <div className="text-[11px] text-[#FDFBF5]/60">
            {repeatCustomerCount} recurring accounts
          </div>
        </div>
      </div>

      {/* Deep Analytics Grid: Top Products vs Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Top Selling Products Leaderboard */}
        <div className="lg:col-span-7 bg-[#0D2B1D] p-6 rounded-3xl border border-white/10 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-[#D4AF37]/15 text-[#D4AF37]">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider">
                  Top Selling Produce & Livestock
                </h3>
                <p className="text-xs text-[#FDFBF5]/60">Ranked by gross sales volume and turnover</p>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {productPerformance.slice(0, 5).map((prod, index) => {
              const maxRev = productPerformance[0]?.revenue || 1;
              const widthPct = Math.min(100, Math.round((prod.revenue / maxRev) * 100));

              return (
                <div key={index} className="bg-[#071810] p-4 rounded-2xl border border-white/5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-white/10 text-white font-mono font-bold text-[11px] flex items-center justify-center">
                        {index + 1}
                      </span>
                      <strong className="text-white text-sm">{prod.name}</strong>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-white/10 text-[#D4AF37]">
                        {prod.category}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-black text-[#D4AF37] text-sm">
                        ₦{prod.revenue.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-[#FDFBF5]/50">
                        {prod.quantity} {prod.unit} sold
                      </div>
                    </div>
                  </div>

                  {/* Visual Bar */}
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#D4AF37] to-emerald-400 rounded-full transition-all duration-500"
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Category Distribution */}
        <div className="lg:col-span-5 bg-[#0D2B1D] p-6 rounded-3xl border border-white/10 shadow-xl space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-500/15 text-purple-300">
              <PieChart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                Revenue by Farm Category
              </h3>
              <p className="text-xs text-[#FDFBF5]/60">Share of total enterprise turnover</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {categoryBreakdown.map((cat, idx) => (
              <div key={idx} className="bg-[#071810] p-3.5 rounded-2xl border border-white/5 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white capitalize">{cat.category}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-emerald-400 font-bold">₦{cat.revenue.toLocaleString()}</span>
                    <span className="font-mono font-bold text-white bg-white/10 px-1.5 py-0.5 rounded text-[10px]">
                      {cat.percentage}%
                    </span>
                  </div>
                </div>

                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#D4AF37] rounded-full"
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Quick Summary Footnote */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 text-[11px] text-[#FDFBF5]/70 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Poultry layers and dressed chicken account for the highest daily velocity in Kaduna retail.</span>
          </div>
        </div>

      </div>
    </div>
  );
};

import React, { useState, useMemo, useEffect } from 'react';
import { useFarmConfig } from '../../context/FarmConfigContext';
import { UnifiedOrder, OrderStatus, PaymentStatus } from '../../types';
import { AdminOrderRowsSkeleton } from '../skeletons/LoadingSkeletons';
import {
  Search,
  Filter,
  Plus,
  Download,
  Calendar,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  Phone,
  MessageCircle,
  FileSpreadsheet,
  Trash2,
  User,
  MapPin,
  CheckSquare,
  Square,
  FileText,
  RotateCcw,
  Printer,
  ChevronDown
} from 'lucide-react';

interface AdminOrdersPageProps {
  onOpenNewOrderModal: () => void;
  onSelectOrder: (order: UnifiedOrder) => void;
}

export const AdminOrdersPage: React.FC<AdminOrdersPageProps> = ({
  onOpenNewOrderModal,
  onSelectOrder
}) => {
  const { orders, deleteOrder, bulkUpdateOrderStatus, bulkDeleteOrders, currentStaffUser } = useFarmConfig();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedDateFilter, setSelectedDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [selectedCustomerType, setSelectedCustomerType] = useState<string>('all');
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [bulkStatusToApply, setBulkStatusToApply] = useState<OrderStatus>('confirmed');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initial load and filter transition effect
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 350);
    return () => clearTimeout(timer);
  }, [selectedStatus, selectedDateFilter, selectedCustomerType]);

  // Filtering Logic
  const filteredOrders = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const sevenDaysAgo = now.getTime() - 7 * 24 * 3600 * 1000;
    const thirtyDaysAgo = now.getTime() - 30 * 24 * 3600 * 1000;

    return orders.filter(ord => {
      // 1. Search Query (name, phone, invoice id, address)
      const q = searchQuery.toLowerCase().trim();
      if (q) {
        const matchesId = ord.id.toLowerCase().includes(q);
        const matchesName = ord.customerName.toLowerCase().includes(q);
        const matchesPhone = ord.phone.toLowerCase().includes(q);
        const matchesAddress = ord.deliveryAddress.toLowerCase().includes(q);
        const matchesItems = ord.items.some(i => i.name.toLowerCase().includes(q));

        if (!matchesId && !matchesName && !matchesPhone && !matchesAddress && !matchesItems) {
          return false;
        }
      }

      // 2. Status Filter
      if (selectedStatus !== 'all' && ord.status !== selectedStatus) {
        return false;
      }

      // 3. Customer Type Filter
      if (selectedCustomerType !== 'all' && ord.customerType !== selectedCustomerType) {
        return false;
      }

      // 4. Date Range Filter
      const ordTime = new Date(ord.createdAt).getTime() || Date.now();
      if (selectedDateFilter === 'today' && ordTime < todayStart && !ord.orderDate?.toLowerCase().includes('today')) {
        return false;
      }
      if (selectedDateFilter === 'week' && ordTime < sevenDaysAgo) {
        return false;
      }
      if (selectedDateFilter === 'month' && ordTime < thirtyDaysAgo) {
        return false;
      }

      return true;
    });
  }, [orders, searchQuery, selectedStatus, selectedDateFilter, selectedCustomerType]);

  // Bulk Selection Handlers
  const handleToggleSelectAll = () => {
    if (selectedOrderIds.length === filteredOrders.length) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(filteredOrders.map(o => o.id));
    }
  };

  const handleToggleSelectOne = (id: string) => {
    setSelectedOrderIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleApplyBulkStatus = () => {
    if (selectedOrderIds.length === 0) return;
    if (window.confirm(`Update ${selectedOrderIds.length} orders to '${bulkStatusToApply.toUpperCase()}'?`)) {
      bulkUpdateOrderStatus(selectedOrderIds, bulkStatusToApply);
      setSelectedOrderIds([]);
    }
  };

  const handleApplyBulkDelete = () => {
    if (selectedOrderIds.length === 0) return;
    if (window.confirm(`Are you sure you want to permanently delete ${selectedOrderIds.length} selected orders?`)) {
      bulkDeleteOrders(selectedOrderIds);
      setSelectedOrderIds([]);
    }
  };

  // Export to CSV helper
  const handleExportCSV = (ordersToExport = filteredOrders) => {
    const headers = ['Invoice ID', 'Order Date', 'Customer Name', 'Phone', 'Address', 'Customer Type', 'Items', 'Subtotal (NGN)', 'Discount (NGN)', 'Delivery Fee (NGN)', 'Total Amount (NGN)', 'Status', 'Payment Status', 'Driver'];
    const rows = ordersToExport.map(o => [
      `"${o.id}"`,
      `"${o.orderDate}"`,
      `"${o.customerName.replace(/"/g, '""')}"`,
      `"${o.phone}"`,
      `"${o.deliveryAddress.replace(/"/g, '""')}"`,
      `"${o.customerType}"`,
      `"${o.items.map(i => `${i.quantity}x ${i.name}`).join('; ')}"`,
      o.subtotal,
      o.discount,
      o.deliveryFee,
      o.totalAmount,
      `"${o.status}"`,
      `"${o.paymentStatus}"`,
      `"${o.dispatchDriver || 'Unassigned'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `YIFA_Farms_Orders_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'confirmed':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">Confirmed</span>;
      case 'processing':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">Quality Batching</span>;
      case 'dispatched':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">Dispatched & En Route</span>;
      case 'delivered':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Delivered</span>;
      case 'cancelled':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">Pending Review</span>;
    }
  };

  const getPaymentBadge = (status: PaymentStatus) => {
    switch (status) {
      case 'Paid':
        return <span className="text-[11px] font-semibold text-emerald-400">Paid ✓</span>;
      case 'Cash on Delivery':
        return <span className="text-[11px] font-semibold text-amber-400">Cash on Delivery</span>;
      case 'Commercial Credit':
        return <span className="text-[11px] font-semibold text-sky-400">Commercial Credit (30D)</span>;
      default:
        return <span className="text-[11px] font-semibold text-rose-400">Payment Pending</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Fast Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0D2B1D] p-6 rounded-3xl border border-white/10 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase font-bold text-[#D4AF37] tracking-[0.25em]">
              Dispatch & Fulfillment Hub
            </span>
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-white text-xs font-mono">
              {filteredOrders.length} {filteredOrders.length === 1 ? 'Order' : 'Orders'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Orders Management
          </h1>
          <p className="text-xs text-[#FDFBF5]/70 mt-0.5">
            Real-time synchronization with Kaduna farm sales desk, storefront quotes, and logistics fleet.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => handleExportCSV(filteredOrders)}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#FDFBF5] text-xs font-bold border border-white/10 transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            title="Download CSV for Excel or Google Sheets"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export CSV ({filteredOrders.length})</span>
          </button>

          <button
            type="button"
            onClick={onOpenNewOrderModal}
            className="px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#0D2B1D] text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-[#D4AF37]/20"
          >
            <Plus className="w-4 h-4" />
            <span>Log New Farm Order</span>
          </button>
        </div>
      </div>

      {/* Filters & Search Controls Grid */}
      <div className="bg-[#0D2B1D] p-5 rounded-3xl border border-white/10 shadow-lg space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="md:col-span-4 relative">
            <Search className="w-4 h-4 text-[#FDFBF5]/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by customer, phone, address, or invoice #..."
              className="w-full bg-[#071810] border border-white/10 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder:text-[#FDFBF5]/40 focus:outline-none focus:border-[#D4AF37]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#FDFBF5]/50 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-[#071810] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37] cursor-pointer"
            >
              <option value="all">All Order Statuses</option>
              <option value="pending">Pending Review</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Quality Batching</option>
              <option value="dispatched">Dispatched & En Route</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedDateFilter}
              onChange={(e) => setSelectedDateFilter(e.target.value as 'all' | 'today' | 'week' | 'month')}
              className="w-full bg-[#071810] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37] cursor-pointer"
            >
              <option value="all">All Time (Full Ledger)</option>
              <option value="today">Today's Orders</option>
              <option value="week">Past 7 Days (This Week)</option>
              <option value="month">Past 30 Days (This Month)</option>
            </select>
          </div>

          {/* Customer Segment Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedCustomerType}
              onChange={(e) => setSelectedCustomerType(e.target.value)}
              className="w-full bg-[#071810] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37] cursor-pointer"
            >
              <option value="all">All Clients</option>
              <option value="household">Household</option>
              <option value="caterer">Caterer / Bakery</option>
              <option value="hotel">Hotel / Restaurant</option>
              <option value="wholesaler">Wholesaler</option>
            </select>
          </div>
        </div>

        {/* Quick Filter Pill Shortcuts */}
        <div className="flex items-center gap-2 flex-wrap text-xs pt-1 border-t border-white/5">
          <span className="text-[11px] text-[#D4AF37] font-bold uppercase tracking-wider">Quick Status:</span>
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'pending', label: 'Pending' },
            { id: 'confirmed', label: 'Confirmed' },
            { id: 'dispatched', label: 'En Route' },
            { id: 'delivered', label: 'Delivered' }
          ].map((pill) => (
            <button
              key={pill.id}
              type="button"
              onClick={() => setSelectedStatus(pill.id)}
              className={`px-3 py-1 rounded-full text-[11px] transition-all cursor-pointer ${
                selectedStatus === pill.id
                  ? 'bg-[#D4AF37] text-[#0D2B1D] font-bold shadow-sm'
                  : 'bg-white/5 text-[#FDFBF5]/70 hover:bg-white/10 hover:text-white border border-white/5'
              }`}
            >
              {pill.label}
            </button>
          ))}

          {(searchQuery || selectedStatus !== 'all' || selectedDateFilter !== 'all' || selectedCustomerType !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedStatus('all');
                setSelectedDateFilter('all');
                setSelectedCustomerType('all');
              }}
              className="ml-auto text-xs text-[#D4AF37] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Bulk Action Bar (Visible when 1+ orders selected) */}
      {selectedOrderIds.length > 0 && (
        <div className="bg-[#133E2B] border border-[#D4AF37]/40 p-4 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2.5 text-xs text-white">
            <CheckSquare className="w-4 h-4 text-[#D4AF37]" />
            <span>
              <strong className="text-[#D4AF37]">{selectedOrderIds.length}</strong> {selectedOrderIds.length === 1 ? 'order' : 'orders'} selected
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 bg-[#071810] border border-white/15 rounded-xl px-2.5 py-1.5">
              <span className="text-[11px] text-[#FDFBF5]/60">Change Status to:</span>
              <select
                value={bulkStatusToApply}
                onChange={(e) => setBulkStatusToApply(e.target.value as OrderStatus)}
                className="bg-transparent text-xs text-white font-bold focus:outline-none cursor-pointer"
              >
                <option value="confirmed" className="bg-[#071810]">Confirmed</option>
                <option value="processing" className="bg-[#071810]">Quality Batching</option>
                <option value="dispatched" className="bg-[#071810]">Dispatched & En Route</option>
                <option value="delivered" className="bg-[#071810]">Delivered</option>
                <option value="cancelled" className="bg-[#071810]">Cancelled</option>
              </select>
              <button
                type="button"
                onClick={handleApplyBulkStatus}
                className="px-2.5 py-1 bg-[#D4AF37] text-[#0D2B1D] font-bold text-[11px] rounded-lg hover:bg-[#E5C158] cursor-pointer"
              >
                Apply
              </button>
            </div>

            <button
              type="button"
              onClick={() => handleExportCSV(orders.filter(o => selectedOrderIds.includes(o.id)))}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/10 flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export Selected ({selectedOrderIds.length})</span>
            </button>

            {currentStaffUser?.role === 'admin' && (
              <button
                type="button"
                onClick={handleApplyBulkDelete}
                className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-semibold border border-rose-500/30 flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Selected</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setSelectedOrderIds([])}
              className="px-2 py-1 text-xs text-[#FDFBF5]/60 hover:text-white cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Orders Table Container */}
      <div className="bg-[#0D2B1D] rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#071810] text-[#D4AF37] uppercase text-[10px] tracking-wider font-mono border-b border-white/10">
              <tr>
                <th className="py-4 px-4 w-10 text-center">
                  <button
                    type="button"
                    onClick={handleToggleSelectAll}
                    className="cursor-pointer text-[#FDFBF5]/70 hover:text-[#D4AF37]"
                    title="Select all filtered orders"
                  >
                    {selectedOrderIds.length > 0 && selectedOrderIds.length === filteredOrders.length ? (
                      <CheckSquare className="w-4 h-4 text-[#D4AF37]" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="py-4 px-4">Invoice / Date</th>
                <th className="py-4 px-4">Customer & Destination</th>
                <th className="py-4 px-4">Items Summary</th>
                <th className="py-4 px-4 text-right">Amount (NGN)</th>
                <th className="py-4 px-4">Payment</th>
                <th className="py-4 px-4">Dispatch Status</th>
                <th className="py-4 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <AdminOrderRowsSkeleton rowsCount={5} />
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-[#FDFBF5]/60 space-y-3">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto text-[#D4AF37]">
                      <Search className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-semibold text-white">No farm orders found matching your filter.</p>
                    <p className="text-xs text-[#FDFBF5]/60 max-w-sm mx-auto">
                      Try clearing search parameters, choosing a wider date range, or log a new walk-in order.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const isSelected = selectedOrderIds.includes(order.id);
                  const cleanPhone = order.whatsapp || order.phone;
                  const waUrl = `https://wa.me/${cleanPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                    `Hello ${order.customerName}, regarding your YIFA Farms order #${order.id} (${order.status.toUpperCase()})...`
                  )}`;

                  return (
                    <tr
                      key={order.id}
                      className={`hover:bg-white/[0.04] transition-colors ${
                        isSelected ? 'bg-[#133E2B]/50' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-4 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleSelectOne(order.id)}
                          className="cursor-pointer text-[#FDFBF5]/60 hover:text-[#D4AF37]"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-[#D4AF37]" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      {/* Invoice & Date */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="font-mono font-bold text-white text-sm">
                          #{order.id}
                        </div>
                        <div className="text-[11px] text-[#FDFBF5]/60 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3 text-[#D4AF37]" />
                          <span>{order.orderDate}</span>
                        </div>
                      </td>

                      {/* Customer & Destination */}
                      <td className="py-4 px-4 max-w-[220px]">
                        <div className="font-bold text-white truncate flex items-center gap-1.5">
                          <span className="truncate">{order.customerName}</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 uppercase tracking-wider text-[#D4AF37] shrink-0 font-mono">
                            {order.customerType}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#FDFBF5]/70 truncate mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span className="truncate">{order.deliveryAddress}</span>
                        </div>
                        <div className="text-[11px] text-[#FDFBF5]/50 mt-0.5 font-mono">
                          {order.phone}
                        </div>
                      </td>

                      {/* Items */}
                      <td className="py-4 px-4 max-w-[200px]">
                        <div className="space-y-0.5">
                          {order.items.slice(0, 2).map((item, i) => (
                            <div key={i} className="text-xs text-[#FDFBF5]/90 truncate">
                              <strong className="text-white">{item.quantity}x</strong> {item.name}
                            </div>
                          ))}
                          {order.items.length > 2 && (
                            <span className="text-[10px] text-[#D4AF37] font-semibold">
                              +{order.items.length - 2} more item(s)
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="font-mono font-bold text-white text-sm">
                          ₦{order.totalAmount.toLocaleString()}
                        </div>
                        {order.deliveryFee > 0 && (
                          <div className="text-[10px] text-[#FDFBF5]/50">
                            incl. ₦{order.deliveryFee.toLocaleString()} delivery
                          </div>
                        )}
                      </td>

                      {/* Payment */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {getPaymentBadge(order.paymentStatus)}
                        {order.paymentMethod && (
                          <div className="text-[10px] text-[#FDFBF5]/50 mt-0.5">
                            {order.paymentMethod}
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {getStatusBadge(order.status)}
                        {order.dispatchDriver && (
                          <div className="text-[10px] text-[#FDFBF5]/60 mt-1 flex items-center gap-1">
                            <Truck className="w-3 h-3 text-[#D4AF37]" />
                            <span className="truncate max-w-[110px]">{order.dispatchDriver}</span>
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Manage / Open Drawer */}
                          <button
                            type="button"
                            onClick={() => onSelectOrder(order)}
                            className="p-2 rounded-xl bg-white/5 hover:bg-[#D4AF37] hover:text-[#0D2B1D] text-white transition-colors cursor-pointer border border-white/10"
                            title="Open Full Order Drawer & Dispatch Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Direct WhatsApp Contact */}
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366] text-[#25D366] hover:text-slate-950 transition-colors cursor-pointer border border-[#25D366]/30"
                            title="Direct Message Customer on WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>

                          {/* Delete Order (Admin only) */}
                          {currentStaffUser?.role === 'admin' && (
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Delete order #${order.id}?`)) {
                                  deleteOrder(order.id);
                                }
                              }}
                              className="p-2 rounded-xl bg-white/5 hover:bg-rose-500 hover:text-white text-rose-400 transition-colors cursor-pointer border border-white/10"
                              title="Delete Order Record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Summary */}
        <div className="p-4 bg-[#071810] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#FDFBF5]/60">
          <div>
            Showing <strong className="text-white">{filteredOrders.length}</strong> of <strong className="text-white">{orders.length}</strong> total orders in system.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Real-Time Storefront Sync Active</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

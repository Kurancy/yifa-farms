import React, { useState } from 'react';
import { UnifiedOrder, OrderStatus, PaymentStatus } from '../../types';
import { useFarmConfig } from '../../context/FarmConfigContext';
import { useToast } from '../../context/ToastContext';
import { YifaLogo } from '../YifaLogo';
import {
  X,
  Printer,
  MessageCircle,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Mail,
  User,
  ShieldCheck,
  Package,
  Calendar,
  CreditCard,
  AlertCircle,
  FileText,
  Send,
  Download,
  Share2,
  Sparkles
} from 'lucide-react';

interface AdminOrderDetailModalProps {
  order: UnifiedOrder | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AdminOrderDetailModal: React.FC<AdminOrderDetailModalProps> = ({
  order,
  isOpen,
  onClose
}) => {
  const { updateOrderStatus, config, sendAutomatedNotification, currentStaffUser } = useFarmConfig();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState<'details' | 'invoice' | 'whatsapp' | 'automated'>('details');
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(order?.status || 'pending');
  const [driverName, setDriverName] = useState<string>(order?.dispatchDriver || '');
  const [vehicleNote, setVehicleNote] = useState<string>(order?.vehicleNote || '');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(order?.paymentStatus || 'Pending');
  const [notes, setNotes] = useState<string>(order?.notes || '');
  const [isSavedToast, setIsSavedToast] = useState<boolean>(false);
  const [selectedWaTemplate, setSelectedWaTemplate] = useState<'confirmation' | 'dispatch' | 'delivery' | 'custom'>('dispatch');
  const [customWaMessage, setCustomWaMessage] = useState<string>('');
  const [automatedSentMsg, setAutomatedSentMsg] = useState<string | null>(null);

  if (!isOpen || !order) return null;

  const handleSaveUpdates = async () => {
    if (currentStatus === 'cancelled' && order.status !== 'cancelled') {
      const proceed = await toast.confirmAction({
        title: 'Cancel Farm Consignment',
        message: `Are you sure you want to cancel Order #${order.id} for ${order.customerName}? Inventory reservations will be adjusted.`,
        confirmText: 'Yes, Cancel Order',
        cancelText: 'Keep Active',
        type: 'danger'
      });
      if (!proceed) return;
    }

    try {
      updateOrderStatus(order.id, currentStatus, {
        driver: driverName,
        vehicleNote,
        paymentStatus,
        notes
      });

      toast.success(`Order #${order.id} updated to "${currentStatus}".`, 'Order Updated');
      setIsSavedToast(true);
      setTimeout(() => setIsSavedToast(false), 2500);
    } catch {
      toast.error('Failed to save order updates. Please try again.', 'Update Failed');
    }
  };

  const handlePrintInvoice = () => {
    toast.info('Opening Kaduna print waybill formatting...', 'Print Preview');
    window.print();
  };

  // WhatsApp Message Composer Templates
  const getWhatsAppMessage = () => {
    if (selectedWaTemplate === 'confirmation') {
      return `Hello ${order.customerName},\n\nYour order *#${order.id}* has been confirmed by YIFA Farms Kaduna.\n\n*Items Ordered:*\n${order.items.map(i => `• ${i.quantity}x ${i.name}`).join('\n')}\n\n*Total Amount:* ₦${order.totalAmount.toLocaleString()}\n*Delivery Address:* ${order.deliveryAddress}\n\nOur team is preparing your consignment with fresh quality assurance. Thank you!`;
    }
    if (selectedWaTemplate === 'dispatch') {
      return `Hello ${order.customerName},\n\n🚚 *Dispatch Alert:* Your YIFA Farms order *#${order.id}* is now DISPATCHED and en route to your address!\n\n*Assigned Logistics:* ${driverName || 'Kaduna Farm Dispatch Unit'}\n*Vehicle / Unit:* ${vehicleNote || 'Farm Cold Van'}\n*Destination:* ${order.deliveryAddress}\n\nYou can track live status at https://yifafarms.ng/#track\n\nDriver will reach you upon arrival. Thank you!`;
    }
    if (selectedWaTemplate === 'delivery') {
      return `Hello ${order.customerName},\n\n✅ Your YIFA Farms order *#${order.id}* has been successfully DELIVERED to ${order.deliveryAddress}.\n\nThank you for choosing YIFA Farms Kaduna! We hope you enjoy your produce. Please let us know if you need any further supplies.`;
    }
    return customWaMessage || `Hello ${order.customerName}, regarding your YIFA Farms order #${order.id}...`;
  };

  const cleanPhone = (order.whatsapp || order.phone).replace(/[^0-9]/g, '');
  const finalWaUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(getWhatsAppMessage())}`;

  const handleTriggerAutomatedPing = (channel: 'sms' | 'email') => {
    try {
      sendAutomatedNotification(order.id, channel, currentStatus === 'dispatched' ? 'dispatched' : currentStatus === 'delivered' ? 'delivered' : 'order_confirmed');
      toast.success(`Automated ${channel.toUpperCase()} dispatch alert transmitted to customer.`, 'Notification Dispatched');
      setAutomatedSentMsg(`Automated ${channel.toUpperCase()} notification dispatched successfully!`);
      setTimeout(() => setAutomatedSentMsg(null), 3000);
    } catch {
      toast.error(`Failed to send automated ${channel.toUpperCase()} alert.`, 'Gateway Error');
    }
  };

  const getStatusBadge = (st: OrderStatus) => {
    switch (st) {
      case 'pending':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">Pending Review</span>;
      case 'confirmed':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">Confirmed</span>;
      case 'processing':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">Quality Batching</span>;
      case 'dispatched':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">Dispatched & En Route</span>;
      case 'delivered':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Delivered</span>;
      case 'cancelled':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">Cancelled</span>;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-[#0D2B1D] border border-white/15 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in zoom-in-95">
        
        {/* Header Bar */}
        <div className="bg-[#071810] px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] font-black">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-mono text-white">#{order.id}</h2>
                {getStatusBadge(order.status)}
              </div>
              <p className="text-xs text-[#FDFBF5]/60 mt-0.5">
                Placed on {order.orderDate} • Customer: <strong className="text-white">{order.customerName}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#FDFBF5]/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-[#0A2217] px-6 py-2 border-b border-white/10 flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'details', label: 'Order & Dispatch Controls', icon: Truck },
            { id: 'invoice', label: 'Printable Invoice / Receipt', icon: Printer },
            { id: 'whatsapp', label: 'WhatsApp Messaging', icon: MessageCircle },
            { id: 'automated', label: 'Automated SMS / Email', icon: Send }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#D4AF37] text-[#0D2B1D] shadow-md'
                    : 'text-[#FDFBF5]/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* TAB 1: ORDER DETAILS & DISPATCH CONTROLS */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Status Update Card */}
              <div className="bg-[#071810] p-5 rounded-2xl border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs uppercase font-bold text-[#D4AF37] tracking-[0.2em] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Fulfillment Status & Stage Control</span>
                  </h3>
                  {isSavedToast && (
                    <span className="text-xs text-emerald-400 font-bold bg-emerald-400/10 px-2.5 py-1 rounded-full animate-in fade-in">
                      Changes Saved Successfully ✓
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                  {[
                    { id: 'pending', label: 'Pending Review', color: 'amber' },
                    { id: 'confirmed', label: 'Confirmed', color: 'blue' },
                    { id: 'processing', label: 'Quality Batching', color: 'purple' },
                    { id: 'dispatched', label: 'Dispatched', color: 'cyan' },
                    { id: 'delivered', label: 'Delivered', color: 'emerald' },
                    { id: 'cancelled', label: 'Cancelled', color: 'rose' }
                  ].map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setCurrentStatus(st.id as OrderStatus)}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                        currentStatus === st.id
                          ? 'bg-[#D4AF37] text-[#0D2B1D] border-[#D4AF37] shadow-lg font-black'
                          : 'bg-white/5 border-white/10 text-[#FDFBF5]/70 hover:bg-white/10'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>

                {/* Driver & Vehicle Allocation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/10">
                  <div>
                    <label className="block text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider mb-1.5">
                      Assign Dispatch Driver:
                    </label>
                    <select
                      value={driverName}
                      onChange={(e) => setDriverName(e.target.value)}
                      className="w-full bg-[#0D2B1D] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37] cursor-pointer"
                    >
                      <option value="">Unassigned (Farm Gate Pickup)</option>
                      <option value="Driver Haruna (Cold Van Unit #01)">Driver Haruna (Cold Van Unit #01)</option>
                      <option value="Courier Musa (Logistics Bike KD-88)">Courier Musa (Logistics Bike KD-88)</option>
                      <option value="Driver Shehu (Heavy Livestock Truck #02)">Driver Shehu (Heavy Livestock Truck #02)</option>
                      <option value="Driver Abubakar (Abuja Corridor Express)">Driver Abubakar (Abuja Corridor Express)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider mb-1.5">
                      Vehicle & Cargo Unit Note:
                    </label>
                    <input
                      type="text"
                      value={vehicleNote}
                      onChange={(e) => setVehicleNote(e.target.value)}
                      placeholder="e.g. Temperature Regulated Van, Insulated Cold Box"
                      className="w-full bg-[#0D2B1D] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                {/* Payment Status & Internal Notes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/10">
                  <div>
                    <label className="block text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider mb-1.5">
                      Payment Verification:
                    </label>
                    <select
                      value={paymentStatus}
                      onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
                      className="w-full bg-[#0D2B1D] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37] cursor-pointer"
                    >
                      <option value="Paid">Paid (Verified in Bank Account)</option>
                      <option value="Cash on Delivery">Cash on Delivery</option>
                      <option value="Commercial Credit">Commercial Credit (30-Day Terms)</option>
                      <option value="Pending">Payment Pending</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider mb-1.5">
                      Dispatch Desk Internal Note:
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Gate pass required, verify crate counts"
                      className="w-full bg-[#0D2B1D] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSaveUpdates}
                    className="px-6 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#0D2B1D] text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md"
                  >
                    Save Dispatch Updates
                  </button>
                </div>
              </div>

              {/* Items & Customer Breakdown Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Items Card */}
                <div className="bg-[#071810] p-5 rounded-2xl border border-white/10 space-y-3">
                  <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37] flex items-center gap-1.5">
                    <Package className="w-4 h-4" />
                    <span>Ordered Produce ({order.items.length} items)</span>
                  </div>
                  <div className="divide-y divide-white/5 text-xs">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="py-2.5 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-white">{item.name}</div>
                          <div className="text-[11px] text-[#FDFBF5]/60">
                            {item.quantity} {item.unit} @ ₦{item.unitPrice.toLocaleString()}/{item.unit}
                          </div>
                        </div>
                        <div className="font-mono font-bold text-white">
                          ₦{item.totalPrice.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-white/10 space-y-1.5 text-xs">
                    <div className="flex justify-between text-[#FDFBF5]/70">
                      <span>Subtotal:</span>
                      <span className="font-mono">₦{order.subtotal.toLocaleString()}</span>
                    </div>
                    {order.discount > 0 && (
                      <div className="flex justify-between text-emerald-400">
                        <span>Discount:</span>
                        <span className="font-mono">-₦{order.discount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-[#FDFBF5]/70">
                      <span>Delivery Logistics:</span>
                      <span className="font-mono">₦{order.deliveryFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/10">
                      <span>Total Consignment Amount:</span>
                      <span className="font-mono text-[#D4AF37]">₦{order.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="bg-[#071810] p-5 rounded-2xl border border-white/10 space-y-3">
                  <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37] flex items-center gap-1.5">
                    <User className="w-4 h-4" />
                    <span>Customer & Delivery Destination</span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-[#FDFBF5]/50">Customer Name:</div>
                      <div className="font-bold text-white text-sm mt-0.5">{order.customerName}</div>
                      <div className="text-[10px] text-[#D4AF37] uppercase font-mono mt-0.5">
                        Tier: {order.customerType.toUpperCase()}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] uppercase font-bold text-[#FDFBF5]/50">Phone / WhatsApp:</div>
                      <div className="font-mono text-white mt-0.5">{order.phone}</div>
                    </div>

                    {order.email && (
                      <div>
                        <div className="text-[10px] uppercase font-bold text-[#FDFBF5]/50">Email Address:</div>
                        <div className="text-white mt-0.5">{order.email}</div>
                      </div>
                    )}

                    <div>
                      <div className="text-[10px] uppercase font-bold text-[#FDFBF5]/50">Kaduna Delivery Address:</div>
                      <div className="text-white mt-0.5 bg-white/5 p-2.5 rounded-xl border border-white/10 leading-relaxed">
                        {order.deliveryAddress}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRINTABLE INVOICE / RECEIPT */}
          {activeTab === 'invoice' && (
            <div className="space-y-4">
              <div className="flex justify-end gap-3 print:hidden">
                <button
                  type="button"
                  onClick={handlePrintInvoice}
                  className="px-5 py-2.5 bg-[#D4AF37] text-[#0D2B1D] font-bold text-xs rounded-xl hover:bg-[#E5C158] flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Official Invoice / Receipt</span>
                </button>
              </div>

              {/* Printable Invoice Sheet */}
              <div className="bg-white text-slate-900 p-8 rounded-3xl shadow-2xl max-w-3xl mx-auto font-sans print:p-0 print:shadow-none print:rounded-none">
                {/* Header */}
                <div className="flex justify-between items-start border-b border-slate-200 pb-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <YifaLogo variant="badge" size="sm" />
                      <div>
                        <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">YIFA FARMS</h1>
                        <p className="text-[11px] font-bold text-emerald-800 tracking-wider uppercase">Kaduna, Nigeria</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 mt-2 max-w-xs leading-relaxed">
                      {config.exactAddress || "Off Zaria Road Agribusiness Corridor, Rigachikun / Maraban Jos Axis, Kaduna State"}
                    </p>
                    <p className="text-xs text-slate-600">
                      Phone: {config.phoneDisplay} | Email: {config.email}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-500 block">
                      OFFICIAL INVOICE
                    </span>
                    <span className="text-2xl font-mono font-black text-slate-900 block mt-1">
                      #{order.id}
                    </span>
                    <span className="text-xs text-slate-600 block mt-1">
                      Date: {order.orderDate}
                    </span>
                    <div className="mt-2 inline-block px-3 py-1 rounded-full text-xs font-bold uppercase border border-emerald-600 bg-emerald-50 text-emerald-800">
                      {order.paymentStatus}
                    </div>
                  </div>
                </div>

                {/* Billed To & Destination */}
                <div className="grid grid-cols-2 gap-6 py-6 border-b border-slate-200 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                      BILLED TO:
                    </span>
                    <strong className="text-sm text-slate-900 block">{order.customerName}</strong>
                    <span className="text-slate-600 block mt-0.5">{order.phone}</span>
                    {order.email && <span className="text-slate-600 block">{order.email}</span>}
                    <span className="text-slate-500 block capitalize mt-0.5">Account: {order.customerType}</span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                      DELIVERY DESTINATION:
                    </span>
                    <p className="text-slate-800 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      {order.deliveryAddress}
                    </p>
                    {order.dispatchDriver && (
                      <span className="text-slate-600 block mt-1">
                        Driver: <strong>{order.dispatchDriver}</strong>
                      </span>
                    )}
                  </div>
                </div>

                {/* Itemized Table */}
                <div className="py-6">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b-2 border-slate-900 text-slate-900 font-bold uppercase text-[10px] tracking-wider">
                        <th className="py-2.5">Item & Description</th>
                        <th className="py-2.5 text-center">Qty / Unit</th>
                        <th className="py-2.5 text-right">Unit Price (NGN)</th>
                        <th className="py-2.5 text-right">Total (NGN)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {order.items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="py-3 font-semibold text-slate-900">{item.name}</td>
                          <td className="py-3 text-center text-slate-700">{item.quantity} {item.unit}</td>
                          <td className="py-3 text-right text-slate-700 font-mono">₦{item.unitPrice.toLocaleString()}</td>
                          <td className="py-3 text-right font-mono font-bold text-slate-900">₦{item.totalPrice.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Calculations */}
                  <div className="mt-4 border-t-2 border-slate-900 pt-4 flex justify-end text-xs">
                    <div className="w-64 space-y-2">
                      <div className="flex justify-between text-slate-600">
                        <span>Subtotal:</span>
                        <span className="font-mono">₦{order.subtotal.toLocaleString()}</span>
                      </div>
                      {order.discount > 0 && (
                        <div className="flex justify-between text-emerald-700">
                          <span>Discount:</span>
                          <span className="font-mono">-₦{order.discount.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-slate-600">
                        <span>Delivery Fee:</span>
                        <span className="font-mono">₦{order.deliveryFee.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-300">
                        <span>Grand Total:</span>
                        <span className="font-mono text-emerald-900">₦{order.totalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Note & Stamp */}
                <div className="mt-6 pt-6 border-t border-slate-200 flex justify-between items-end text-[11px] text-slate-500">
                  <div>
                    <p className="font-semibold text-slate-700">Thank you for your patronage!</p>
                    <p className="mt-0.5">Goods certified farm-fresh upon dispatch. Verified by YIFA Farms Kaduna.</p>
                  </div>
                  <div className="text-right border-t border-dashed border-slate-400 pt-2 px-4">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Authorized Farm Officer</span>
                    <span className="font-bold text-slate-800">{currentStaffUser?.fullName || 'Sales Desk Manager'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DIRECT WHATSAPP COMPOSER */}
          {activeTab === 'whatsapp' && (
            <div className="bg-[#071810] p-6 rounded-2xl border border-white/10 space-y-5">
              <div>
                <h3 className="text-xs uppercase font-bold text-[#D4AF37] tracking-[0.2em] flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span>Direct Customer WhatsApp Outreach</span>
                </h3>
                <p className="text-xs text-[#FDFBF5]/70 mt-1">
                  Send instant dispatch alerts, receipt confirmations, and arrival notifications directly to <strong className="text-white">{order.customerName} ({order.phone})</strong>.
                </p>
              </div>

              {/* Template Picker */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider block">
                  Select Quick Message Template:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'dispatch', label: '🚚 Dispatch & Tracking' },
                    { id: 'confirmation', label: '📋 Order Confirmation' },
                    { id: 'delivery', label: '✅ Delivery Completed' },
                    { id: 'custom', label: '✍️ Custom Message' }
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setSelectedWaTemplate(t.id as typeof selectedWaTemplate)}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                        selectedWaTemplate === t.id
                          ? 'bg-[#25D366] text-slate-950 border-[#25D366] font-black'
                          : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Preview / Editor */}
              <div>
                <label className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider block mb-1.5">
                  Message Payload Preview:
                </label>
                {selectedWaTemplate === 'custom' ? (
                  <textarea
                    rows={6}
                    value={customWaMessage}
                    onChange={(e) => setCustomWaMessage(e.target.value)}
                    placeholder="Type custom WhatsApp message to customer..."
                    className="w-full bg-[#0D2B1D] border border-white/10 rounded-xl p-3.5 text-xs text-white font-mono focus:outline-none focus:border-[#D4AF37]"
                  />
                ) : (
                  <pre className="w-full bg-[#0D2B1D] border border-white/10 rounded-xl p-3.5 text-xs text-[#FDFBF5]/90 font-mono whitespace-pre-wrap leading-relaxed">
                    {getWhatsAppMessage()}
                  </pre>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <span className="text-xs text-[#FDFBF5]/60">
                  Target: <strong>{cleanPhone}</strong>
                </span>
                <a
                  href={finalWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20BA58] text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Launch WhatsApp & Send Message</span>
                </a>
              </div>
            </div>
          )}

          {/* TAB 4: AUTOMATED NOTIFICATIONS (SMS & EMAIL) */}
          {activeTab === 'automated' && (
            <div className="bg-[#071810] p-6 rounded-2xl border border-white/10 space-y-5">
              <div>
                <h3 className="text-xs uppercase font-bold text-[#D4AF37] tracking-[0.2em] flex items-center gap-2">
                  <Send className="w-4 h-4 text-emerald-400" />
                  <span>Automated Multi-Channel Dispatch Pings</span>
                </h3>
                <p className="text-xs text-[#FDFBF5]/70 mt-1">
                  Trigger automated SMS and Email order status dispatches. All sent logs are recorded in the central audit ledger.
                </p>
              </div>

              {automatedSentMsg && (
                <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{automatedSentMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* SMS Card */}
                <div className="p-5 rounded-2xl bg-[#0D2B1D] border border-white/10 space-y-3">
                  <div className="text-xs font-bold uppercase text-[#D4AF37] flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-sky-400" />
                    <span>Instant SMS Gateway</span>
                  </div>
                  <p className="text-xs text-[#FDFBF5]/70">
                    Recipient: <strong className="text-white">{order.phone}</strong>
                  </p>
                  <div className="text-[11px] bg-[#071810] p-3 rounded-xl border border-white/5 text-[#FDFBF5]/80 font-mono">
                    &ldquo;YIFA Farms: Your order #{order.id} status is now {currentStatus.toUpperCase()}. Driver: {driverName || 'Scheduled Unit'}.&rdquo;
                  </div>
                  <button
                    type="button"
                    onClick={() => handleTriggerAutomatedPing('sms')}
                    className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-slate-950 font-bold text-xs cursor-pointer shadow-md"
                  >
                    Trigger SMS Status Ping
                  </button>
                </div>

                {/* Email Card */}
                <div className="p-5 rounded-2xl bg-[#0D2B1D] border border-white/10 space-y-3">
                  <div className="text-xs font-bold uppercase text-[#D4AF37] flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-purple-400" />
                    <span>Email Dispatch Receipt</span>
                  </div>
                  <p className="text-xs text-[#FDFBF5]/70">
                    Recipient: <strong className="text-white">{order.email || 'customer@gmail.com'}</strong>
                  </p>
                  <div className="text-[11px] bg-[#071810] p-3 rounded-xl border border-white/5 text-[#FDFBF5]/80 font-mono">
                    &ldquo;YIFA Farms Order Update: #{order.id} ({order.items.length} items, ₦{order.totalAmount.toLocaleString()})&rdquo;
                  </div>
                  <button
                    type="button"
                    onClick={() => handleTriggerAutomatedPing('email')}
                    className="w-full py-2.5 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-bold text-xs cursor-pointer shadow-md"
                  >
                    Trigger Email Dispatch Receipt
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-[#071810] px-6 py-4 border-t border-white/10 flex items-center justify-between text-xs">
          <div className="text-[#FDFBF5]/60 font-mono">
            Synced with Unified Database • {order.items.length} produce item(s)
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold cursor-pointer"
          >
            Close Drawer
          </button>
        </div>

      </div>
    </div>
  );
};

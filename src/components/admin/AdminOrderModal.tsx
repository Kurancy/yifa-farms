import React, { useState } from 'react';
import { useFarmConfig } from '../../context/FarmConfigContext';
import { UnifiedOrder, OrderItem } from '../../types';
import { X, Plus, Trash2, ShoppingCart, User, MapPin, Phone, CreditCard } from 'lucide-react';

interface AdminOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminOrderModal: React.FC<AdminOrderModalProps> = ({ isOpen, onClose }) => {
  const { inventory, addOrder } = useFarmConfig();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [customerType, setCustomerType] = useState<UnifiedOrder['customerType']>('household');
  const [deliveryAddress, setDeliveryAddress] = useState('Kaduna Central Pick-up / Delivery');
  const [paymentStatus, setPaymentStatus] = useState<UnifiedOrder['paymentStatus']>('Paid');
  const [paymentMethod, setPaymentMethod] = useState('Cash at Farm Gate / POS');
  const [deliveryFee, setDeliveryFee] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<OrderItem[]>([
    {
      productId: inventory[0]?.productId || 'fresh-eggs',
      name: inventory[0]?.name || 'Fresh Farm Eggs (30-Egg Crate)',
      category: inventory[0]?.category || 'eggs',
      quantity: 5,
      unit: inventory[0]?.unit || 'Crates',
      unitPrice: inventory[0]?.unitPrice || 4200,
      totalPrice: (inventory[0]?.unitPrice || 4200) * 5
    }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleAddItem = () => {
    const defaultProduct = inventory[0] || {
      productId: 'fresh-eggs',
      name: 'Fresh Farm Eggs (30-Egg Crate)',
      category: 'eggs',
      unit: 'Crates',
      unitPrice: 4200
    };

    setItems([
      ...items,
      {
        productId: defaultProduct.productId,
        name: defaultProduct.name,
        category: defaultProduct.category,
        quantity: 1,
        unit: defaultProduct.unit,
        unitPrice: defaultProduct.unitPrice,
        totalPrice: defaultProduct.unitPrice * 1
      }
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleProductChange = (index: number, productId: string) => {
    const selected = inventory.find(inv => inv.productId === productId || inv.id === productId);
    if (!selected) return;

    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      productId: selected.productId,
      name: selected.name,
      category: selected.category,
      unit: selected.unit,
      unitPrice: selected.unitPrice,
      totalPrice: selected.unitPrice * newItems[index].quantity
    };
    setItems(newItems);
  };

  const handleQuantityChange = (index: number, qty: number) => {
    const cleanQty = Math.max(1, qty);
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      quantity: cleanQty,
      totalPrice: newItems[index].unitPrice * cleanQty
    };
    setItems(newItems);
  };

  const subtotal = items.reduce((acc, item) => acc + item.totalPrice, 0);
  const totalAmount = Math.max(0, subtotal - discount + deliveryFee);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || items.length === 0) return;

    setIsSubmitting(true);
    await addOrder({
      customerName,
      phone,
      whatsapp: phone,
      email,
      customerType,
      deliveryAddress,
      items,
      subtotal,
      discount,
      deliveryFee,
      totalAmount,
      status: 'confirmed',
      paymentStatus,
      paymentMethod,
      notes: notes || 'Walk-in / Direct Farm Gate Order',
      source: 'admin_manual'
    });

    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#0D2B1D] border border-white/15 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl text-[#FDFBF5] font-sans">
        {/* Modal Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#071810] rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#D4AF37]/15 text-[#D4AF37]">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white uppercase tracking-wider">Record Walk-in / Phone Order</h2>
              <p className="text-xs text-[#FDFBF5]/50">Instantly logs order & automatically deduces warehouse stock.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#FDFBF5]/60 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Customer Details */}
          <div>
            <h3 className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest mb-3 flex items-center gap-2">
              <User className="w-3.5 h-3.5" />
              <span>Customer Information</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#FDFBF5]/70 mb-1.5">Customer / Organization Name *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Alhaji Mustapha / Arewa Buka"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#071810] border border-white/10 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#FDFBF5]/70 mb-1.5">Phone / WhatsApp Number *</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +234 803 123 4567"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#071810] border border-white/10 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#FDFBF5]/70 mb-1.5">Customer Category</label>
                <select
                  value={customerType}
                  onChange={(e) => setCustomerType(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#071810] border border-white/10 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                >
                  <option value="household">Household / Family</option>
                  <option value="caterer">Caterer / Restaurant</option>
                  <option value="wholesaler">Wholesaler / Reseller</option>
                  <option value="hotel">Hotel / Hospitality</option>
                  <option value="retailer">Supermarket / Retailer</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#FDFBF5]/70 mb-1.5">Email (Optional)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="customer@email.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#071810] border border-white/10 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="block text-xs font-semibold text-[#FDFBF5]/70 mb-1.5">Delivery Address / Destination</label>
              <input
                type="text"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="e.g. Malali G.R.A., Kaduna North"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#071810] border border-white/10 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>

          {/* Line Items */}
          <div className="pt-4 border-t border-white/10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest flex items-center gap-2">
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Ordered Farm Items</span>
              </h3>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-xs font-bold text-[#D4AF37] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="flex flex-col sm:flex-row gap-2.5 items-start sm:items-center bg-[#071810] p-3 rounded-xl border border-white/5">
                  <div className="flex-1 w-full sm:w-auto">
                    <select
                      value={item.productId}
                      onChange={(e) => handleProductChange(index, e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#0D2B1D] border border-white/10 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                    >
                      {inventory.map((inv) => (
                        <option key={inv.id} value={inv.productId}>
                          {inv.name} (Stock: {inv.currentStock} {inv.unit}) — ₦{inv.unitPrice.toLocaleString()}/{inv.unit}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
                    <div className="flex items-center gap-1">
                      <span className="text-[11px] text-[#FDFBF5]/50">Qty:</span>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(index, parseInt(e.target.value) || 1)}
                        className="w-16 px-2 py-1.5 rounded-lg bg-[#0D2B1D] border border-white/10 text-white text-xs font-mono text-center focus:border-[#D4AF37] focus:outline-none"
                      />
                      <span className="text-[11px] text-[#FDFBF5]/50">{item.unit}</span>
                    </div>

                    <div className="text-right min-w-[80px] font-mono text-xs font-bold text-white">
                      ₦{item.totalPrice.toLocaleString()}
                    </div>

                    <button
                      type="button"
                      disabled={items.length <= 1}
                      onClick={() => handleRemoveItem(index)}
                      className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors disabled:opacity-30 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment & Financials */}
          <div className="pt-4 border-t border-white/10">
            <h3 className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest mb-3 flex items-center gap-2">
              <CreditCard className="w-3.5 h-3.5" />
              <span>Payment & Settlement</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#FDFBF5]/70 mb-1.5">Payment Status</label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#071810] border border-white/10 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                >
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Cash on Delivery">Cash on Delivery</option>
                  <option value="Commercial Credit">Commercial Credit (Net-7)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#FDFBF5]/70 mb-1.5">Payment Method</label>
                <input
                  type="text"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  placeholder="e.g. Bank Transfer / POS Terminal"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#071810] border border-white/10 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#FDFBF5]/70 mb-1.5">Delivery Fee (₦)</label>
                <input
                  type="number"
                  min="0"
                  value={deliveryFee}
                  onChange={(e) => setDeliveryFee(parseInt(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#071810] border border-white/10 text-white text-xs font-mono focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#FDFBF5]/70 mb-1.5">Discount (₦)</label>
                <input
                  type="number"
                  min="0"
                  value={discount}
                  onChange={(e) => setDiscount(parseInt(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#071810] border border-white/10 text-white text-xs font-mono focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="block text-xs font-semibold text-[#FDFBF5]/70 mb-1.5">Internal Notes / Logistics Instructions</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Customer picking up at Rigachikun gate at 2 PM."
                className="w-full px-3.5 py-2 rounded-xl bg-[#071810] border border-white/10 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>

          {/* Totals Summary */}
          <div className="p-4 rounded-2xl bg-[#071810] border border-white/10 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div>
              <div className="text-[11px] text-[#FDFBF5]/50">Order Total Calculation</div>
              <div className="text-xs text-[#FDFBF5]/80 mt-0.5">
                Subtotal: <span className="font-mono font-bold text-white">₦{subtotal.toLocaleString()}</span>
                {discount > 0 && <span className="text-emerald-400 font-mono"> - ₦{discount.toLocaleString()}</span>}
                {deliveryFee > 0 && <span className="text-amber-400 font-mono"> + ₦{deliveryFee.toLocaleString()} (Delivery)</span>}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-bold">Total Bill</div>
              <div className="text-2xl font-black font-mono text-white">₦{totalAmount.toLocaleString()}</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl border border-white/10 text-[#FDFBF5]/70 hover:bg-white/5 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-2 py-3 px-6 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#0D2B1D] font-bold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-lg active:scale-98 disabled:opacity-50"
            >
              {isSubmitting ? 'Logging Order...' : 'Confirm & Log Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

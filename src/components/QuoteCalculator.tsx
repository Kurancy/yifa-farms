import React, { useState, useEffect } from 'react';
import { useFarmConfig } from '../context/FarmConfigContext';
import { useToast } from '../context/ToastContext';
import { kadunaLocations } from '../data/farmData';
import { QuoteRequest, PageType } from '../types';
import {
  Calculator,
  MessageCircle,
  Send,
  CheckCircle2,
  Phone,
  MapPin,
  Package,
  Calendar,
  AlertCircle,
  FileText,
  Copy,
  Check
} from 'lucide-react';
import { ClientConfirmBadge } from './ClientConfirmBadge';

interface QuoteCalculatorProps {
  initialProduct?: string;
  initialCategory?: string;
  onNavigate?: (page: PageType) => void;
}

export const QuoteCalculator: React.FC<QuoteCalculatorProps> = ({
  initialProduct = 'Fresh Eggs',
  initialCategory = 'Eggs',
  onNavigate
}) => {
  const { config, submitQuote, inventory } = useFarmConfig();
  const toast = useToast();

  const [productCategory, setProductCategory] = useState<string>(initialCategory || 'Eggs');
  const [specificItem, setSpecificItem] = useState<string>(initialProduct || 'Fresh Farm Eggs (30-Egg Crate)');
  const [quantity, setQuantity] = useState<number>(5);
  const [customerType, setCustomerType] = useState<string>('Household / Family');
  const [deliveryLocation, setDeliveryLocation] = useState<string>(kadunaLocations[0]);
  const [frequency, setFrequency] = useState<string>('One-time Order');
  const [fullName, setFullName] = useState<string>('');
  const [phoneOrWhatsapp, setPhoneOrWhatsapp] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedQuoteId, setSubmittedQuoteId] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Update specificItem defaults when category changes
  useEffect(() => {
    if (productCategory === 'Eggs') {
      setSpecificItem('Fresh Farm Eggs (30-Egg Crate)');
    } else if (productCategory === 'Frozen Chicken') {
      setSpecificItem('Whole Dressed Chicken (1.5kg - 1.8kg)');
    } else if (productCategory === 'Fish') {
      setSpecificItem('Live Table-size African Catfish / Tilapia (kg)');
    } else if (productCategory === 'Rams & Goats') {
      setSpecificItem('Prime Northern Ram (Medium / Giant) or Farm Goat');
    } else if (productCategory === 'Vegetables') {
      setSpecificItem('Fresh Vegetable Basket (Tomatoes, Pepper & Greens)');
    } else if (productCategory === 'Live Poultry') {
      setSpecificItem('Live Mature Broilers / Layers');
    } else if (productCategory === 'Bulk Order') {
      setSpecificItem('Combined Wholesale Carton (Eggs + Poultry + Veggies)');
    }
  }, [productCategory]);

  const getUnitName = () => {
    if (productCategory === 'Eggs') return quantity > 1 ? 'Crates' : 'Crate';
    if (productCategory === 'Frozen Chicken') return quantity > 1 ? 'Birds / Cartons' : 'Bird';
    if (productCategory === 'Fish') return quantity > 1 ? 'Kg / Cartons' : 'Kg';
    if (productCategory === 'Rams & Goats') return quantity > 1 ? 'Heads' : 'Head';
    if (productCategory === 'Vegetables') return quantity > 1 ? 'Baskets / Sacks' : 'Basket';
    if (productCategory === 'Live Poultry') return quantity > 1 ? 'Birds' : 'Bird';
    return 'Units / Cartons';
  };

  // Compile WhatsApp message string
  const compileWhatsAppText = () => {
    return `*NEW QUOTE REQUEST - YIFA FARMS (Kaduna)*\n` +
      `--------------------------------\n` +
      `👤 *Name:* ${fullName.trim() || 'Client'}\n` +
      `📞 *Phone/WhatsApp:* ${phoneOrWhatsapp.trim() || 'Not provided'}\n` +
      `📍 *Delivery Location:* ${deliveryLocation}\n` +
      `📦 *Product:* ${productCategory} - ${specificItem}\n` +
      `🔢 *Quantity:* ${quantity} ${getUnitName()}\n` +
      `👥 *Customer Type:* ${customerType}\n` +
      `🔄 *Supply Frequency:* ${frequency}\n` +
      (message ? `📝 *Notes/Specifications:* ${message}\n` : '') +
      `--------------------------------\n` +
      `Sent via YIFA Farms Website Quote Engine`;
  };

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phoneOrWhatsapp.trim()) {
      toast.error('Please enter your Full Name and Phone/WhatsApp number so we can address your quote.', 'Missing Details');
      return;
    }

    const matchedInv = inventory.find(
      (inv) => inv.name.toLowerCase().includes(specificItem.toLowerCase().slice(0, 8))
    );
    if (matchedInv && matchedInv.currentStock <= 0) {
      toast.warning('This item is currently sold out for immediate dispatch. Your quote will be queued for the next harvest batch.', 'Pre-Order Harvest Notice');
    }

    const payloadText = compileWhatsAppText();
    const whatsappUrl = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(payloadText)}`;

    // Save lead locally as well
    submitQuote({
      fullName,
      phoneOrWhatsapp,
      email,
      productCategory,
      specificItem,
      quantity,
      unit: getUnitName(),
      customerType,
      deliveryLocation,
      frequency,
      message
    });

    toast.info('Opening direct WhatsApp quote chat with Kaduna dispatch...', 'Connecting WhatsApp');
    window.open(whatsappUrl, '_blank');
  };

  const handleDirectFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phoneOrWhatsapp.trim()) {
      toast.error('Please fill in your Full Name and Phone/WhatsApp number.', 'Required Fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitQuote({
        fullName,
        phoneOrWhatsapp,
        email,
        productCategory,
        specificItem,
        quantity,
        unit: getUnitName(),
        customerType,
        deliveryLocation,
        frequency,
        message
      });

      setSubmittedQuoteId(res.id);
      toast.success('Your quote request has been recorded. Our dispatch desk will contact you within 15 minutes with verified farm-gate rates.', 'Quote Generated');
    } catch {
      toast.error('We could not transmit your quote request. Please try again or reach us directly via WhatsApp.', 'Submission Failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopySummary = () => {
    navigator.clipboard.writeText(compileWhatsAppText());
    setCopiedLink(true);
    toast.success('Quote spec sheet copied to clipboard.', 'Copied');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <section id="quote-section" className="pt-2 pb-20 sm:pt-4 sm:pb-24 bg-transparent text-[#FDFBF5] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="h-[1px] w-6 bg-[#D4AF37]"></span>
            <span className="text-[#D4AF37] text-xs font-bold tracking-[0.25em] uppercase">Instant Lead & Quote Generator</span>
            <span className="h-[1px] w-6 bg-[#D4AF37]"></span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#FDFBF5] tracking-tight uppercase">
            Request a Farm Quote
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#FDFBF5]/75 leading-relaxed">
            Specify your desired farm produce, quantities, and Kaduna delivery address. We dispatch quotes directly to your WhatsApp or phone within minutes.
          </p>
        </div>

        {/* Quote Form & Live Order Summary Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Interactive Form (8 Cols) */}
          <div className="lg:col-span-7 bg-[#0D2B1D] rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl">
            {submittedQuoteId ? (
              <div className="py-8 text-center space-y-6 animate-in fade-in">
                <div className="w-16 h-16 rounded-full bg-[#D4AF37] text-[#0D2B1D] flex items-center justify-center mx-auto shadow-lg">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-[0.2em]">
                    Quote Request Received Successfully
                  </span>
                  <h3 className="text-2xl font-bold text-white mt-1">
                    Reference ID: #{submittedQuoteId}
                  </h3>
                  <p className="text-sm text-[#FDFBF5]/80 mt-2 max-w-md mx-auto">
                    Thank you, <strong className="text-[#D4AF37]">{fullName}</strong>. Our Kaduna farm sales desk will reach out to you via WhatsApp / Phone at <strong className="text-[#D4AF37]">{phoneOrWhatsapp}</strong> with confirmed pricing.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#0A2217] border border-white/10 text-left text-xs space-y-2 max-w-md mx-auto">
                  <div className="font-bold text-[#D4AF37] uppercase tracking-wider border-b border-white/10 pb-1.5">
                    Summary of Order Request:
                  </div>
                  <div className="text-[#FDFBF5]/80">• <strong className="text-white">Product:</strong> {productCategory} ({specificItem})</div>
                  <div className="text-[#FDFBF5]/80">• <strong className="text-white">Quantity:</strong> {quantity} {getUnitName()}</div>
                  <div className="text-[#FDFBF5]/80">• <strong className="text-white">Delivery Point:</strong> {deliveryLocation}</div>
                  <div className="text-[#FDFBF5]/80">• <strong className="text-white">Customer:</strong> {customerType} ({frequency})</div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                  <a
                    href={`https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(compileWhatsAppText())}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-7 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20B858] text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Chat on WhatsApp Now</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      if (onNavigate) {
                        onNavigate('track');
                      } else {
                        const elem = document.getElementById('order-status');
                        elem?.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="px-6 py-3.5 rounded-full bg-[#D4AF37] hover:bg-[#E5C158] text-[#0D2B1D] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <Package className="w-4 h-4" />
                    <span>Track Order Status</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedQuoteId(null);
                      setFullName('');
                      setMessage('');
                    }}
                    className="px-5 py-3.5 rounded-full bg-white/10 text-[#FDFBF5] hover:bg-white/15 font-bold text-xs uppercase tracking-wider border border-white/10 transition-all cursor-pointer"
                  >
                    New Quote
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleDirectFormSubmit} className="space-y-6">
                {/* Step 1: Product Selection */}
                <div>
                  <label className="block text-xs uppercase font-bold text-[#D4AF37] tracking-[0.2em] mb-2.5">
                    1. Select Primary Produce
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { label: 'Fresh Eggs', id: 'Eggs', emoji: '🥚' },
                      { label: 'Frozen Chicken', id: 'Frozen Chicken', emoji: '🍗' },
                      { label: 'Live Poultry', id: 'Live Poultry', emoji: '🐓' },
                      { label: 'Fresh Fish', id: 'Fish', emoji: '🐟' },
                      { label: 'Rams & Goats', id: 'Rams & Goats', emoji: '🐏' },
                      { label: 'Vegetables', id: 'Vegetables', emoji: '🥬' },
                      { label: 'Bulk Wholesale', id: 'Bulk Order', emoji: '📦' },
                      { label: 'Other Farm Inquiry', id: 'Other', emoji: '🌾' }
                    ].map((prod) => (
                      <button
                        key={prod.id}
                        type="button"
                        onClick={() => setProductCategory(prod.id)}
                        className={`p-3 rounded-xl text-left border transition-all cursor-pointer flex items-center gap-2 ${
                          productCategory === prod.id
                            ? 'bg-[#D4AF37] text-[#0D2B1D] border-[#D4AF37] font-bold shadow-md'
                            : 'bg-white/5 text-[#FDFBF5]/80 border-white/10 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <span className="text-base">{prod.emoji}</span>
                        <span className="text-xs font-semibold leading-tight">{prod.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sub-item specific detail */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#FDFBF5]/80 mb-1.5">
                      Specific Specification / Cut
                    </label>
                    <input
                      type="text"
                      value={specificItem}
                      onChange={(e) => setSpecificItem(e.target.value)}
                      placeholder="e.g. 30-egg Large Crate, Whole Broiler 1.8kg"
                      className="w-full px-4 py-3 rounded-xl border border-white/10 bg-[#091F15] text-[#FDFBF5] placeholder-[#FDFBF5]/40 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#FDFBF5]/80 mb-1.5 flex items-center justify-between">
                      <span>Quantity Required:</span>
                      <span className="text-[#D4AF37] font-bold">{quantity} {getUnitName()}</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        max="10000"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full px-4 py-3 rounded-xl border border-white/10 bg-[#091F15] text-[#FDFBF5] placeholder-[#FDFBF5]/40 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                      />
                    </div>
                  </div>
                </div>

                {/* Customer Type & Frequency */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#FDFBF5]/80 mb-1.5">
                      Customer Profile
                    </label>
                    <select
                      value={customerType}
                      onChange={(e) => setCustomerType(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-white/10 bg-[#091F15] text-[#FDFBF5] text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                    >
                      <option value="Household / Family" className="bg-[#0D2B1D] text-white">Household / Family</option>
                      <option value="Restaurant / Food Bukateria" className="bg-[#0D2B1D] text-white">Restaurant / Food Bukateria</option>
                      <option value="Event Caterer / Baker" className="bg-[#0D2B1D] text-white">Event Caterer / Baker</option>
                      <option value="Hotel / Hospitality" className="bg-[#0D2B1D] text-white">Hotel / Hospitality</option>
                      <option value="Supermarket / Retail Store" className="bg-[#0D2B1D] text-white">Supermarket / Retail Store</option>
                      <option value="Wholesale Distributor / Agro Merchant" className="bg-[#0D2B1D] text-white">Wholesale Distributor / Agro Merchant</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#FDFBF5]/80 mb-1.5">
                      Supply Frequency
                    </label>
                    <select
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-white/10 bg-[#091F15] text-[#FDFBF5] text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                    >
                      <option value="One-time Order" className="bg-[#0D2B1D] text-white">One-time Order</option>
                      <option value="Weekly Recurring Delivery" className="bg-[#0D2B1D] text-white">Weekly Recurring Delivery</option>
                      <option value="Bi-Weekly Supply" className="bg-[#0D2B1D] text-white">Bi-Weekly Supply</option>
                      <option value="Monthly Bulk Contract" className="bg-[#0D2B1D] text-white">Monthly Bulk Contract</option>
                    </select>
                  </div>
                </div>

                {/* Delivery Location dropdown */}
                <div>
                  <label className="block text-xs font-semibold text-[#FDFBF5]/80 mb-1.5">
                    Delivery Destination / Pickup
                  </label>
                  <select
                    value={deliveryLocation}
                    onChange={(e) => setDeliveryLocation(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-[#091F15] text-[#FDFBF5] text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                  >
                    {kadunaLocations.map((loc, idx) => (
                      <option key={idx} value={loc} className="bg-[#0D2B1D] text-white">
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Contact Information Fields */}
                <div className="pt-4 border-t border-white/10">
                  <label className="block text-xs uppercase font-bold text-[#D4AF37] tracking-[0.2em] mb-3">
                    2. Contact Information
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#FDFBF5]/80 mb-1">
                        Full Name / Business Name *
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Hajiya Maryam or Royal Palms Hotel"
                        className="w-full px-4 py-3 rounded-xl border border-white/10 bg-[#091F15] text-[#FDFBF5] placeholder-[#FDFBF5]/40 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#FDFBF5]/80 mb-1">
                        Phone / WhatsApp Number *
                      </label>
                      <input
                        type="tel"
                        value={phoneOrWhatsapp}
                        onChange={(e) => setPhoneOrWhatsapp(e.target.value)}
                        placeholder="e.g. 0803 123 4567"
                        className="w-full px-4 py-3 rounded-xl border border-white/10 bg-[#091F15] text-[#FDFBF5] placeholder-[#FDFBF5]/40 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-xs font-medium text-[#FDFBF5]/80 mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. order@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-white/10 bg-[#091F15] text-[#FDFBF5] placeholder-[#FDFBF5]/40 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-xs font-medium text-[#FDFBF5]/80 mb-1">
                      Additional Notes or Special Delivery Instructions
                    </label>
                    <textarea
                      rows={2}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Specify preferred delivery times, egg crate sizes, chicken dressing preferences..."
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-[#091F15] text-[#FDFBF5] placeholder-[#FDFBF5]/40 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                    />
                  </div>
                </div>

                {/* Action Buttons: Request Quote & WhatsApp */}
                <div className="pt-4 flex flex-col sm:flex-row gap-3.5">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-4 px-6 rounded-full bg-[#D4AF37] hover:bg-[#E5C158] text-[#0D2B1D] font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-[0.99]"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Processing...' : 'REQUEST QUOTE'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleWhatsAppSubmit}
                    className="py-4 px-6 rounded-full bg-[#25D366] hover:bg-[#20BA58] text-slate-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Instant WhatsApp Quote</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Live Order Preview Card (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#0D2B1D] text-[#FDFBF5] rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#D4AF37] text-[#0D2B1D] flex items-center justify-center font-bold shadow-md">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-[0.2em] block">
                      Live Spec Sheet
                    </span>
                    <h3 className="text-lg font-bold text-white">
                      Order Breakdown
                    </h3>
                  </div>
                </div>
                <ClientConfirmBadge label="PRICING TO CONFIRM" />
              </div>

              {/* Order spec line items */}
              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-[#FDFBF5]/60">Produce Type:</span>
                  <span className="font-bold text-white text-right">{productCategory}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-[#FDFBF5]/60">Item Spec:</span>
                  <span className="font-semibold text-white text-right truncate max-w-[200px]">
                    {specificItem}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-[#FDFBF5]/60">Estimated Volume:</span>
                  <span className="font-bold text-[#D4AF37] text-right">
                    {quantity} {getUnitName()}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-[#FDFBF5]/60">Account Type:</span>
                  <span className="font-semibold text-white text-right">{customerType}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-[#FDFBF5]/60">Schedule:</span>
                  <span className="font-semibold text-white text-right">{frequency}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-[#FDFBF5]/60">Delivery Zone:</span>
                  <span className="font-semibold text-white text-right truncate max-w-[200px]">
                    {deliveryLocation}
                  </span>
                </div>
              </div>

              {/* Pricing transparency note */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs space-y-2">
                <div className="flex items-center gap-1.5 text-[#D4AF37] font-bold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Transparent Kaduna Farm-Gate Rates</span>
                </div>
                <p className="text-[#FDFBF5]/70 text-[11px] leading-relaxed">
                  Prices fluctuate with weekly grain market indices to give you the freshest farm-gate rate. Your formal quotation includes verified current per-crate or per-kg pricing and transport schedule.
                </p>
              </div>

              {/* Quick Copy summary button */}
              <button
                type="button"
                onClick={handleCopySummary}
                className="w-full py-3 px-4 rounded-full bg-white/5 hover:bg-white/10 text-[#D4AF37] text-xs font-semibold flex items-center justify-center gap-2 border border-white/10 transition-colors cursor-pointer"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'Copied to Clipboard!' : 'Copy Quote Text'}</span>
              </button>
            </div>

            {/* Kaduna Direct Hotline Card */}
            <div className="bg-[#0D2B1D] rounded-3xl p-6 border border-white/10 shadow-xl flex items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-wider block">
                  Prefer Direct Phone Call?
                </span>
                <div className="text-base font-bold text-white">
                  {config.phoneDisplay}
                </div>
                <p className="text-xs text-[#FDFBF5]/60">Mon–Sat 7:00 AM – 6:00 PM</p>
              </div>

              <a
                href={`tel:${config.phoneRaw}`}
                className="p-3.5 rounded-full bg-[#D4AF37] hover:bg-[#E5C158] text-[#0D2B1D] transition-colors shadow-md"
                title="Call YIFA Farms"
              >
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

import React, { useState, useMemo } from 'react';
import { useFarmConfig } from '../../context/FarmConfigContext';
import { CustomerAccount } from '../../types';
import {
  Users,
  Search,
  Plus,
  Phone,
  MessageCircle,
  Award,
  TrendingUp,
  MapPin,
  Calendar,
  CreditCard,
  Edit3,
  Trash2,
  X,
  CheckCircle2,
  Gift,
  Star,
  ShoppingBag
} from 'lucide-react';

export const AdminCustomersPage: React.FC = () => {
  const {
    customers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    awardLoyaltyPoints,
    orders,
    currentStaffUser
  } = useFarmConfig();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTierFilter, setSelectedTierFilter] = useState<string>('all');
  const [selectedCustomerType, setSelectedCustomerType] = useState<string>('all');
  const [selectedCustomerForDetail, setSelectedCustomerForDetail] = useState<CustomerAccount | null>(null);
  const [isNewCustomerModalOpen, setIsNewCustomerModalOpen] = useState(false);
  const [pointsAdjustDelta, setPointsAdjustDelta] = useState<number>(100);
  const [pointsAdjustReason, setPointsAdjustReason] = useState<string>('Storefront Purchase Reward');

  // Form State for new customer
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newType, setNewType] = useState<CustomerAccount['customerType']>('household');
  const [newAddress, setNewAddress] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const filteredCustomers = useMemo(() => {
    return customers.filter(cust => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        cust.name.toLowerCase().includes(q) ||
        cust.phone.toLowerCase().includes(q) ||
        (cust.email && cust.email.toLowerCase().includes(q)) ||
        cust.address.toLowerCase().includes(q);

      const matchesTier = selectedTierFilter === 'all' || cust.loyaltyTier === selectedTierFilter;
      const matchesType = selectedCustomerType === 'all' || cust.customerType === selectedCustomerType;

      return matchesSearch && matchesTier && matchesType;
    });
  }, [customers, searchQuery, selectedTierFilter, selectedCustomerType]);

  // Customer Analytics
  const totalLifetimeSpent = useMemo(() => {
    return customers.reduce((sum, c) => sum + c.totalSpent, 0);
  }, [customers]);

  const totalLoyaltyPointsIssued = useMemo(() => {
    return customers.reduce((sum, c) => sum + c.loyaltyPoints, 0);
  }, [customers]);

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) return;

    addCustomer({
      name: newName,
      phone: newPhone,
      email: newEmail || undefined,
      customerType: newType,
      address: newAddress || 'Kaduna Central, Nigeria',
      savedAddresses: newAddress ? [newAddress] : ['Kaduna Central, Nigeria'],
      ordersCount: 0,
      totalSpent: 0,
      loyaltyTier: 'Bronze',
      loyaltyPoints: 0,
      notes: newNotes || undefined,
      lastOrderDate: 'Never'
    });

    setIsNewCustomerModalOpen(false);
    setNewName('');
    setNewPhone('');
    setNewEmail('');
    setNewAddress('');
    setNewNotes('');
  };

  const handleAwardPoints = (customerId: string) => {
    if (!pointsAdjustDelta) return;
    awardLoyaltyPoints(customerId, pointsAdjustDelta, pointsAdjustReason);
    if (selectedCustomerForDetail && selectedCustomerForDetail.id === customerId) {
      setSelectedCustomerForDetail(prev => prev ? {
        ...prev,
        loyaltyPoints: Math.max(0, prev.loyaltyPoints + pointsAdjustDelta)
      } : null);
    }
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'Platinum':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
            <Star className="w-3 h-3 text-purple-400 fill-purple-400" />
            Platinum Tier
          </span>
        );
      case 'Gold':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 flex items-center gap-1">
            <Award className="w-3 h-3 text-[#D4AF37]" />
            Gold Tier
          </span>
        );
      case 'Silver':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-slate-300/20 text-slate-200 border border-slate-300/30 flex items-center gap-1">
            <Award className="w-3 h-3" />
            Silver Tier
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-700/20 text-amber-300 border border-amber-700/30 flex items-center gap-1">
            Bronze Tier
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0D2B1D] p-6 rounded-3xl border border-white/10 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase font-bold text-[#D4AF37] tracking-[0.25em]">
              Customer Relationship & Loyalty Engine
            </span>
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-white text-xs font-mono">
              {customers.length} Accounts
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Customer Directory & Loyalty
          </h1>
          <p className="text-xs text-[#FDFBF5]/70 mt-0.5">
            Synchronized with storefront loyalty program, order histories, and saved delivery destinations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsNewCustomerModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#0D2B1D] text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Create Customer Account</span>
          </button>
        </div>
      </div>

      {/* Analytics Metric Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0D2B1D] p-5 rounded-3xl border border-white/10 shadow-md flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-mono text-[#FDFBF5]/50">Total Customer Accounts</div>
            <div className="text-2xl font-black font-mono text-white mt-1">{customers.length}</div>
            <div className="text-[11px] text-emerald-400 mt-0.5">100% Active in Kaduna</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#D4AF37]">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#0D2B1D] p-5 rounded-3xl border border-white/10 shadow-md flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-mono text-[#FDFBF5]/50">Lifetime Order Revenue</div>
            <div className="text-2xl font-black font-mono text-[#D4AF37] mt-1">₦{totalLifetimeSpent.toLocaleString()}</div>
            <div className="text-[11px] text-[#FDFBF5]/60 mt-0.5">Across All Customer Segments</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#0D2B1D] p-5 rounded-3xl border border-white/10 shadow-md flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-mono text-[#FDFBF5]/50">Loyalty Rewards Issued</div>
            <div className="text-2xl font-black font-mono text-purple-300 mt-1">{totalLoyaltyPointsIssued.toLocaleString()} Pts</div>
            <div className="text-[11px] text-purple-400 mt-0.5">Storefront Loyalty Program</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-300">
            <Gift className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0D2B1D] p-5 rounded-3xl border border-white/10 shadow-lg space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-[#FDFBF5]/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search customer name, phone, email, address..."
              className="w-full bg-[#071810] border border-white/10 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder:text-[#FDFBF5]/40 focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedTierFilter}
              onChange={(e) => setSelectedTierFilter(e.target.value)}
              className="w-full bg-[#071810] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37] cursor-pointer"
            >
              <option value="all">All Loyalty Tiers</option>
              <option value="Platinum">Platinum (2,000+ Pts)</option>
              <option value="Gold">Gold (1,000+ Pts)</option>
              <option value="Silver">Silver (500+ Pts)</option>
              <option value="Bronze">Bronze (Standard)</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedCustomerType}
              onChange={(e) => setSelectedCustomerType(e.target.value)}
              className="w-full bg-[#071810] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37] cursor-pointer"
            >
              <option value="all">All Customer Types</option>
              <option value="household">Household / Family</option>
              <option value="caterer">Caterer / Bakery</option>
              <option value="hotel">Hotel / Restaurant</option>
              <option value="wholesaler">Wholesaler</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customer Directory Table */}
      <div className="bg-[#0D2B1D] rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#071810] text-[#D4AF37] uppercase text-[10px] tracking-wider font-mono border-b border-white/10">
              <tr>
                <th className="py-4 px-5">Customer Profile</th>
                <th className="py-4 px-5">Segment & Destination</th>
                <th className="py-4 px-5 text-center">Orders Placed</th>
                <th className="py-4 px-5 text-right">Total Spent</th>
                <th className="py-4 px-5">Loyalty Tier & Points</th>
                <th className="py-4 px-5 text-center">Outreach & Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#FDFBF5]/60">
                    No customer accounts matched your search.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => {
                  const cleanPhone = cust.phone.replace(/[^0-9]/g, '');
                  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                    `Hello ${cust.name}, this is YIFA Farms Kaduna checking in on your produce supply needs!`
                  )}`;

                  return (
                    <tr key={cust.id} className="hover:bg-white/[0.04] transition-colors">
                      <td className="py-4 px-5">
                        <div className="font-bold text-white text-sm">{cust.name}</div>
                        <div className="text-[11px] text-[#FDFBF5]/60 font-mono mt-0.5">{cust.phone}</div>
                        {cust.email && <div className="text-[11px] text-[#FDFBF5]/40">{cust.email}</div>}
                      </td>

                      <td className="py-4 px-5 max-w-[240px]">
                        <div className="inline-block px-2 py-0.5 rounded bg-white/10 text-[10px] font-bold uppercase text-[#D4AF37] mb-1">
                          {cust.customerType}
                        </div>
                        <div className="text-[11px] text-[#FDFBF5]/70 truncate flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span className="truncate">{cust.address}</span>
                        </div>
                      </td>

                      <td className="py-4 px-5 text-center whitespace-nowrap font-mono font-bold text-white">
                        {cust.ordersCount}
                      </td>

                      <td className="py-4 px-5 text-right whitespace-nowrap font-mono font-bold text-[#D4AF37] text-sm">
                        ₦{cust.totalSpent.toLocaleString()}
                      </td>

                      <td className="py-4 px-5 whitespace-nowrap">
                        <div>{getTierBadge(cust.loyaltyTier)}</div>
                        <div className="text-[11px] text-purple-300 font-mono font-semibold mt-1">
                          {cust.loyaltyPoints} Rewards Points
                        </div>
                      </td>

                      <td className="py-4 px-5 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedCustomerForDetail(cust)}
                            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-[#D4AF37] hover:text-[#0D2B1D] text-white border border-white/10 font-bold text-[11px] cursor-pointer"
                          >
                            View Profile
                          </button>

                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366] text-[#25D366] hover:text-slate-950 border border-[#25D366]/30 transition-colors"
                            title="Direct Message on WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>

                          {currentStaffUser?.role === 'admin' && (
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Delete customer profile for ${cust.name}?`)) {
                                  deleteCustomer(cust.id);
                                }
                              }}
                              className="p-2 rounded-xl bg-white/5 hover:bg-rose-500 hover:text-white text-rose-400 border border-white/10"
                              title="Delete customer record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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
      </div>

      {/* CUSTOMER DETAIL & LOYALTY ADJUST MODAL */}
      {selectedCustomerForDetail && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0D2B1D] border border-white/15 rounded-3xl w-full max-w-2xl shadow-2xl p-6 space-y-6 my-auto max-h-[92vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white">{selectedCustomerForDetail.name}</h3>
                <p className="text-xs text-[#D4AF37] font-mono mt-0.5">
                  ID: #{selectedCustomerForDetail.id} • Member Since: {selectedCustomerForDetail.createdAt}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCustomerForDetail(null)}
                className="p-2 text-[#FDFBF5]/60 hover:text-white rounded-xl hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-[#071810] p-3.5 rounded-2xl border border-white/10">
                <div className="text-[10px] uppercase font-mono text-[#FDFBF5]/50">Total Orders</div>
                <div className="text-lg font-black font-mono text-white mt-0.5">{selectedCustomerForDetail.ordersCount}</div>
              </div>
              <div className="bg-[#071810] p-3.5 rounded-2xl border border-white/10">
                <div className="text-[10px] uppercase font-mono text-[#FDFBF5]/50">Lifetime Spend</div>
                <div className="text-lg font-black font-mono text-[#D4AF37] mt-0.5">₦{selectedCustomerForDetail.totalSpent.toLocaleString()}</div>
              </div>
              <div className="bg-[#071810] p-3.5 rounded-2xl border border-white/10">
                <div className="text-[10px] uppercase font-mono text-[#FDFBF5]/50">Loyalty Points</div>
                <div className="text-lg font-black font-mono text-purple-300 mt-0.5">{selectedCustomerForDetail.loyaltyPoints}</div>
              </div>
            </div>

            {/* Saved Delivery Addresses */}
            <div className="bg-[#071810] p-4 rounded-2xl border border-white/10 space-y-2">
              <div className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                <span>Saved Delivery Addresses in Kaduna</span>
              </div>
              <div className="space-y-1.5 text-xs text-[#FDFBF5]/80">
                {selectedCustomerForDetail.savedAddresses.map((addr, idx) => (
                  <div key={idx} className="p-2.5 bg-[#0D2B1D] rounded-xl border border-white/5 flex items-center justify-between">
                    <span>{addr}</span>
                    {idx === 0 && <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Default</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Loyalty Point Award & Adjust Tool */}
            <div className="bg-[#071810] p-4 rounded-2xl border border-white/10 space-y-3">
              <div className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                <Gift className="w-4 h-4 text-purple-400" />
                <span>Award / Adjust Loyalty Points</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] text-[#FDFBF5]/70 mb-1">Points Delta (+ or -):</label>
                  <input
                    type="number"
                    value={pointsAdjustDelta}
                    onChange={(e) => setPointsAdjustDelta(parseInt(e.target.value) || 0)}
                    className="w-full bg-[#0D2B1D] border border-white/10 rounded-xl px-3.5 py-2 text-white font-mono focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#FDFBF5]/70 mb-1">Reason / Note:</label>
                  <input
                    type="text"
                    value={pointsAdjustReason}
                    onChange={(e) => setPointsAdjustReason(e.target.value)}
                    placeholder="e.g. VIP caterer bonus, Campaign reward"
                    className="w-full bg-[#0D2B1D] border border-white/10 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => handleAwardPoints(selectedCustomerForDetail.id)}
                  className="px-5 py-2 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-bold text-xs cursor-pointer shadow-md"
                >
                  Apply Loyalty Adjustment
                </button>
              </div>
            </div>

            {/* Close */}
            <div className="flex justify-end pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setSelectedCustomerForDetail(null)}
                className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold cursor-pointer"
              >
                Close Customer Card
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE NEW CUSTOMER MODAL */}
      {isNewCustomerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0D2B1D] border border-white/15 rounded-3xl w-full max-w-lg shadow-2xl p-6 space-y-5 my-auto max-h-[92vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-[#D4AF37]" />
                <span>Register New Customer Account</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsNewCustomerModalOpen(false)}
                className="p-2 text-[#FDFBF5]/60 hover:text-white rounded-xl hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-[#D4AF37] uppercase mb-1">Full Customer Name *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Alhaji Mustapha Sani"
                  className="w-full bg-[#071810] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#D4AF37] uppercase mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+234 803 000 0000"
                    className="w-full bg-[#071810] border border-white/10 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#D4AF37] uppercase mb-1">Email Address</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="customer@gmail.com"
                    className="w-full bg-[#071810] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#D4AF37] uppercase mb-1">Customer Category *</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as typeof newType)}
                  className="w-full bg-[#071810] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4AF37] cursor-pointer"
                >
                  <option value="household">Household / Family Kitchen</option>
                  <option value="caterer">Caterer / Bakery Studio</option>
                  <option value="hotel">Hotel / Restaurant Bay</option>
                  <option value="wholesaler">Commercial Wholesaler</option>
                  <option value="retailer">Retail Market Vendor</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#D4AF37] uppercase mb-1">Delivery Destination in Kaduna *</label>
                <textarea
                  rows={2}
                  required
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="Street address, Estate, or Market Location in Kaduna"
                  className="w-full bg-[#071810] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewCustomerModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#0D2B1D] font-black uppercase tracking-wider cursor-pointer shadow-lg"
                >
                  Save Customer Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

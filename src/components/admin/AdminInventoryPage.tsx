import React, { useState, useMemo } from 'react';
import { useFarmConfig } from '../../context/FarmConfigContext';
import { InventoryItem } from '../../types';
import {
  Package,
  AlertTriangle,
  Plus,
  Minus,
  Edit3,
  CheckCircle2,
  TrendingDown,
  Layers,
  Search,
  Filter,
  DollarSign,
  X,
  RotateCcw,
  Sparkles,
  Calendar,
  ShieldAlert,
  Clock,
  Zap,
  TrendingUp
} from 'lucide-react';

export const AdminInventoryPage: React.FC = () => {
  const {
    inventory,
    updateInventoryStock,
    updateInventoryPricing,
    updateInventoryFreshness,
    lowStockCount,
    currentStaffUser
  } = useFarmConfig();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFreshnessFilter, setSelectedFreshnessFilter] = useState<string>('all');
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  // Edit State
  const [editStock, setEditStock] = useState<number>(0);
  const [editUnitPrice, setEditUnitPrice] = useState<number>(0);
  const [editWholesalePrice, setEditWholesalePrice] = useState<number>(0);
  const [editUnitCost, setEditUnitCost] = useState<number>(0);
  const [restockReason, setRestockReason] = useState<string>('Morning Harvest / Farm Gate Collection');

  // Freshness metadata edit state
  const [editBatchNumber, setEditBatchNumber] = useState<string>('');
  const [editHarvestDate, setEditHarvestDate] = useState<string>('');
  const [editExpiryDate, setEditExpiryDate] = useState<string>('');
  const [editShelfLifeDays, setEditShelfLifeDays] = useState<number>(14);
  const [editFreshnessStatus, setEditFreshnessStatus] = useState<'freshly_harvested' | 'optimal' | 'expiring_soon' | 'expired'>('optimal');

  const filteredInventory = useMemo(() => {
    return inventory.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (item.batchNumber && item.batchNumber.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesFreshness = selectedFreshnessFilter === 'all' || item.freshnessStatus === selectedFreshnessFilter;
      return matchesSearch && matchesCategory && matchesFreshness;
    });
  }, [inventory, searchQuery, selectedCategory, selectedFreshnessFilter]);

  // Inventory Asset Value calculations
  const totalAssetValue = useMemo(() => {
    return inventory.reduce((acc, item) => acc + (item.currentStock * item.unitPrice), 0);
  }, [inventory]);

  const totalCostValue = useMemo(() => {
    return inventory.reduce((acc, item) => acc + (item.currentStock * item.unitCost), 0);
  }, [inventory]);

  const handleOpenEditModal = (item: InventoryItem) => {
    setEditingItem(item);
    setEditStock(item.currentStock);
    setEditUnitPrice(item.unitPrice);
    setEditWholesalePrice(item.wholesalePrice);
    setEditUnitCost(item.unitCost);
    setEditBatchNumber(item.batchNumber || `BATCH-${Date.now().toString().slice(-4)}`);
    setEditHarvestDate(item.harvestDate || 'Today');
    setEditExpiryDate(item.expiryDate || '30 Days');
    setEditShelfLifeDays(item.shelfLifeDays || 14);
    setEditFreshnessStatus(item.freshnessStatus || 'optimal');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    // 1. Update stock if changed
    if (editStock !== editingItem.currentStock) {
      updateInventoryStock(editingItem.id, editStock, false, restockReason);
    }

    // 2. Update pricing
    updateInventoryPricing(editingItem.id, editUnitPrice, editWholesalePrice, editUnitCost);

    // 3. Update Freshness & Expiry metadata
    updateInventoryFreshness(editingItem.id, {
      batchNumber: editBatchNumber,
      harvestDate: editHarvestDate,
      expiryDate: editExpiryDate,
      shelfLifeDays: editShelfLifeDays,
      freshnessStatus: editFreshnessStatus
    });

    setEditingItem(null);
  };

  const getStockStatusBadge = (item: InventoryItem) => {
    if (item.currentStock === 0) {
      return (
        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1 w-fit">
          <AlertTriangle className="w-3 h-3" />
          Out of Stock
        </span>
      );
    }
    if (item.currentStock <= item.lowStockThreshold) {
      return (
        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 w-fit">
          <AlertTriangle className="w-3 h-3" />
          Low Stock Warning
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 w-fit">
        <CheckCircle2 className="w-3 h-3" />
        Optimal Stock
      </span>
    );
  };

  const getFreshnessBadge = (status?: string) => {
    switch (status) {
      case 'freshly_harvested':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-emerald-400" />
            Fresh Harvest
          </span>
        );
      case 'expiring_soon':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
            <Clock className="w-2.5 h-2.5 text-amber-400" />
            Expiring Soon
          </span>
        );
      case 'expired':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
            <ShieldAlert className="w-2.5 h-2.5 text-rose-400" />
            Depleted/Expired
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
            Optimal Quality
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
              Central Agribusiness Logistics
            </span>
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-white text-xs font-mono">
              {inventory.length} Tracked SKUs
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Inventory & Perishables Tracker
          </h1>
          <p className="text-xs text-[#FDFBF5]/70 mt-0.5">
            Auto-reducing inventory on orders, shelf-life freshness monitoring, and reorder thresholds.
          </p>
        </div>

        {/* Quick Metrics Bar */}
        <div className="flex items-center gap-3">
          <div className="bg-[#071810] px-4 py-3 rounded-2xl border border-white/10 text-right">
            <div className="text-[10px] text-[#FDFBF5]/50 uppercase font-mono">Total Stock Value</div>
            <div className="text-base font-black font-mono text-[#D4AF37]">₦{totalAssetValue.toLocaleString()}</div>
          </div>

          <div className="bg-[#071810] px-4 py-3 rounded-2xl border border-white/10 text-right">
            <div className="text-[10px] text-[#FDFBF5]/50 uppercase font-mono">Low Stock Flags</div>
            <div className={`text-base font-black font-mono ${lowStockCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {lowStockCount} {lowStockCount === 1 ? 'Item' : 'Items'}
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0D2B1D] p-5 rounded-3xl border border-white/10 shadow-lg space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-[#FDFBF5]/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search produce name, category, or batch number..."
              className="w-full bg-[#071810] border border-white/10 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder:text-[#FDFBF5]/40 focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          {/* Category Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-[#071810] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37] cursor-pointer"
            >
              <option value="all">All Farm Categories</option>
              <option value="eggs">Layer Eggs</option>
              <option value="chicken">Dressed Chicken & Portions</option>
              <option value="poultry">Live Birds & Broilers</option>
              <option value="fish">Table Catfish</option>
              <option value="vegetables">Fresh Vegetables</option>
              <option value="livestock">Rams & Goats</option>
            </select>
          </div>

          {/* Freshness Status Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedFreshnessFilter}
              onChange={(e) => setSelectedFreshnessFilter(e.target.value)}
              className="w-full bg-[#071810] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37] cursor-pointer"
            >
              <option value="all">All Freshness Levels</option>
              <option value="freshly_harvested">Freshly Harvested Today</option>
              <option value="optimal">Optimal Quality</option>
              <option value="expiring_soon">Expiring Soon (5 Days or less)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Inventory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInventory.map((item) => {
          const margin = item.unitPrice > 0 ? Math.round(((item.unitPrice - item.unitCost) / item.unitPrice) * 100) : 0;
          const isLow = item.currentStock <= item.lowStockThreshold;

          return (
            <div
              key={item.id}
              className={`bg-[#0D2B1D] border rounded-3xl p-5 shadow-xl transition-all flex flex-col justify-between space-y-4 ${
                isLow ? 'border-amber-500/40 bg-gradient-to-b from-[#162a1a] to-[#0D2B1D]' : 'border-white/10'
              }`}
            >
              {/* Card Top: Image, Name & Badges */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-2xl object-cover border border-white/15 shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#D4AF37]">
                        <Package className="w-6 h-6" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-white text-sm leading-tight">{item.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] uppercase font-mono text-[#D4AF37] font-bold">
                          {item.category}
                        </span>
                        {item.batchNumber && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-[#FDFBF5]/60 font-mono">
                            {item.batchNumber}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(item)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-[#D4AF37] hover:text-[#0D2B1D] text-white transition-colors cursor-pointer border border-white/10 shrink-0"
                    title="Edit Stock, Pricing, & Freshness Logs"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>

                {/* Stock Level & Freshness Meters */}
                <div className="bg-[#071810] p-3.5 rounded-2xl border border-white/10 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase font-mono text-[#FDFBF5]/50">Current Stock Level</div>
                      <div className="text-xl font-black font-mono text-white mt-0.5">
                        {item.currentStock}{' '}
                        <span className="text-xs font-normal text-[#FDFBF5]/60">{item.unit}</span>
                      </div>
                    </div>
                    <div>{getStockStatusBadge(item)}</div>
                  </div>

                  {/* Freshness Badge & Shelf Life */}
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-[#D4AF37]" />
                      <span className="text-[11px] text-[#FDFBF5]/70">
                        {item.harvestDate || 'Harvested recently'}
                      </span>
                    </div>
                    <div>{getFreshnessBadge(item.freshnessStatus)}</div>
                  </div>

                  {item.expiryDate && (
                    <div className="text-[10px] text-[#FDFBF5]/50 flex items-center justify-between">
                      <span>Shelf-life / Expiry:</span>
                      <span className="font-mono text-[#FDFBF5]/80">{item.expiryDate}</span>
                    </div>
                  )}
                </div>

                {/* Pricing & Margin Breakdown */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                    <div className="text-[9px] uppercase font-mono text-[#FDFBF5]/50">Retail</div>
                    <div className="font-bold text-white font-mono mt-0.5">₦{item.unitPrice.toLocaleString()}</div>
                  </div>
                  <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                    <div className="text-[9px] uppercase font-mono text-[#FDFBF5]/50">Wholesale</div>
                    <div className="font-bold text-[#D4AF37] font-mono mt-0.5">₦{item.wholesalePrice.toLocaleString()}</div>
                  </div>
                  <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                    <div className="text-[9px] uppercase font-mono text-[#FDFBF5]/50">Gross Margin</div>
                    <div className="font-bold text-emerald-400 font-mono mt-0.5">+{margin}%</div>
                  </div>
                </div>
              </div>

              {/* Card Bottom: Quick Stock Adjusters */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                <span className="text-[10px] uppercase font-mono text-[#FDFBF5]/50">Quick Restock:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => updateInventoryStock(item.id, -5, true, 'Spoilage / Damaged Goods')}
                    disabled={item.currentStock < 5}
                    className="px-2 py-1 bg-white/5 hover:bg-rose-500/20 text-rose-300 border border-white/10 rounded-lg text-xs font-mono font-bold cursor-pointer disabled:opacity-30"
                    title="Deduct 5 units"
                  >
                    -5
                  </button>
                  <button
                    type="button"
                    onClick={() => updateInventoryStock(item.id, 10, true, 'Daily Pen / Field Harvest')}
                    className="px-2.5 py-1 bg-white/5 hover:bg-[#D4AF37] hover:text-[#0D2B1D] text-white border border-white/10 rounded-lg text-xs font-mono font-bold cursor-pointer"
                    title="Add 10 units"
                  >
                    +10
                  </button>
                  <button
                    type="button"
                    onClick={() => updateInventoryStock(item.id, 50, true, 'Bulk Harvest / Batch Delivery')}
                    className="px-2.5 py-1 bg-[#D4AF37]/20 hover:bg-[#D4AF37] hover:text-[#0D2B1D] text-[#D4AF37] border border-[#D4AF37]/30 rounded-lg text-xs font-mono font-bold cursor-pointer"
                    title="Add 50 units"
                  >
                    +50
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* EDIT INVENTORY & FRESHNESS MODAL */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0D2B1D] border border-white/15 rounded-3xl w-full max-w-2xl shadow-2xl p-6 space-y-6 my-auto max-h-[92vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#D4AF37]" />
                  <span>Update Stock & Freshness: {editingItem.name}</span>
                </h3>
                <p className="text-xs text-[#FDFBF5]/60 mt-0.5">
                  Category: {editingItem.category} • Unit: {editingItem.unit}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="p-2 text-[#FDFBF5]/60 hover:text-white rounded-xl hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-5">
              {/* Section 1: Stock Level & Reason */}
              <div className="bg-[#071810] p-4 rounded-2xl border border-white/10 space-y-3">
                <h4 className="text-xs uppercase font-bold text-[#D4AF37] tracking-wider">
                  1. Stock Level Adjustment
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-[#FDFBF5]/70 mb-1">
                      Exact Current Stock Count ({editingItem.unit}):
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={editStock}
                      onChange={(e) => setEditStock(parseInt(e.target.value) || 0)}
                      className="w-full bg-[#0D2B1D] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white font-mono font-bold focus:outline-none focus:border-[#D4AF37]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-[#FDFBF5]/70 mb-1">
                      Adjustment Reason:
                    </label>
                    <input
                      type="text"
                      value={restockReason}
                      onChange={(e) => setRestockReason(e.target.value)}
                      placeholder="e.g. Morning harvest collection, Spoilage"
                      className="w-full bg-[#0D2B1D] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Perishables & Freshness Tracking */}
              <div className="bg-[#071810] p-4 rounded-2xl border border-white/10 space-y-3">
                <h4 className="text-xs uppercase font-bold text-[#D4AF37] tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>2. Perishable Freshness & Batch Tracking</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-[#FDFBF5]/70 mb-1">
                      Batch Code / Pen Unit ID:
                    </label>
                    <input
                      type="text"
                      value={editBatchNumber}
                      onChange={(e) => setEditBatchNumber(e.target.value)}
                      placeholder="e.g. EGG-2024-0818-A"
                      className="w-full bg-[#0D2B1D] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-[#FDFBF5]/70 mb-1">
                      Freshness Classification:
                    </label>
                    <select
                      value={editFreshnessStatus}
                      onChange={(e) => setEditFreshnessStatus(e.target.value as typeof editFreshnessStatus)}
                      className="w-full bg-[#0D2B1D] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37] cursor-pointer"
                    >
                      <option value="freshly_harvested">Freshly Harvested Today</option>
                      <option value="optimal">Optimal Storage Condition</option>
                      <option value="expiring_soon">Expiring Soon (Within 5 Days)</option>
                      <option value="expired">Depleted / Expired</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-[#FDFBF5]/70 mb-1">
                      Harvest / Packaging Time:
                    </label>
                    <input
                      type="text"
                      value={editHarvestDate}
                      onChange={(e) => setEditHarvestDate(e.target.value)}
                      placeholder="e.g. Today 06:00 AM"
                      className="w-full bg-[#0D2B1D] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-[#FDFBF5]/70 mb-1">
                      Best Before / Expiry Note:
                    </label>
                    <input
                      type="text"
                      value={editExpiryDate}
                      onChange={(e) => setEditExpiryDate(e.target.value)}
                      placeholder="e.g. 30 Days (Best Before Sep 17)"
                      className="w-full bg-[#0D2B1D] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Pricing & Unit Cost */}
              <div className="bg-[#071810] p-4 rounded-2xl border border-white/10 space-y-3">
                <h4 className="text-xs uppercase font-bold text-[#D4AF37] tracking-wider">
                  3. Pricing & Production Cost (NGN)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-[#FDFBF5]/70 mb-1">Unit Cost (Farm Cost):</label>
                    <input
                      type="number"
                      min={0}
                      value={editUnitCost}
                      onChange={(e) => setEditUnitCost(parseInt(e.target.value) || 0)}
                      className="w-full bg-[#0D2B1D] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#FDFBF5]/70 mb-1">Retail Selling Price:</label>
                    <input
                      type="number"
                      min={0}
                      value={editUnitPrice}
                      onChange={(e) => setEditUnitPrice(parseInt(e.target.value) || 0)}
                      className="w-full bg-[#0D2B1D] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#FDFBF5]/70 mb-1">Wholesale Selling Price:</label>
                    <input
                      type="number"
                      min={0}
                      value={editWholesalePrice}
                      onChange={(e) => setEditWholesalePrice(parseInt(e.target.value) || 0)}
                      className="w-full bg-[#0D2B1D] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#0D2B1D] text-xs font-black uppercase tracking-wider cursor-pointer shadow-lg"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

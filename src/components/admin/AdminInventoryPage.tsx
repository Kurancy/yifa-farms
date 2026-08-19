import React, { useState, useMemo } from 'react';
import { useFarmConfig } from '../../context/FarmConfigContext';
import { useToast } from '../../context/ToastContext';
import { InventoryItem } from '../../types';
import { AdminCreateItemModal } from './AdminCreateItemModal';
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
  TrendingUp,
  Image as ImageIcon,
  Trash2,
  Eye,
  ExternalLink
} from 'lucide-react';

export const AdminInventoryPage: React.FC = () => {
  const {
    inventory,
    updateInventoryStock,
    deleteInventoryItem,
    lowStockCount,
    currentStaffUser
  } = useFarmConfig();
  const toast = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFreshnessFilter, setSelectedFreshnessFilter] = useState<string>('all');

  // Modal State for Create & Full Edit
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [itemToEdit, setItemToEdit] = useState<InventoryItem | null>(null);

  // Quick Restock State
  const [quickAdjustItem, setQuickAdjustItem] = useState<InventoryItem | null>(null);
  const [quickDelta, setQuickDelta] = useState<number>(10);
  const [quickReason, setQuickReason] = useState<string>('Morning Harvest / Collection');

  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.batchNumber && item.batchNumber.toLowerCase().includes(q));
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesFreshness =
        selectedFreshnessFilter === 'all' || item.freshnessStatus === selectedFreshnessFilter;
      return matchesSearch && matchesCategory && matchesFreshness;
    });
  }, [inventory, searchQuery, selectedCategory, selectedFreshnessFilter]);

  // Inventory Asset Value calculations
  const totalAssetValue = useMemo(() => {
    return inventory.reduce((acc, item) => acc + item.currentStock * item.unitPrice, 0);
  }, [inventory]);

  const handleOpenCreateModal = () => {
    setItemToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: InventoryItem) => {
    setItemToEdit(item);
    setIsModalOpen(true);
  };

  const handleQuickAdjust = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickAdjustItem) return;
    try {
      updateInventoryStock(quickAdjustItem.id, quickDelta, true, quickReason);
      const sign = quickDelta >= 0 ? `+${quickDelta}` : `${quickDelta}`;
      toast.success(`Updated "${quickAdjustItem.name}" stock by ${sign} ${quickAdjustItem.unit}.`, 'Inventory Adjusted');
      setQuickAdjustItem(null);
    } catch {
      toast.error(`Failed to adjust stock for ${quickAdjustItem.name}.`, 'Update Error');
    }
  };

  const handleDeleteItem = async (item: InventoryItem) => {
    const proceed = await toast.confirmAction({
      title: 'Remove Product & Inventory Record',
      message: `Are you sure you want to permanently remove "${item.name}" from live inventory and the public storefront catalog?`,
      confirmText: 'Yes, Delete Item',
      cancelText: 'Cancel',
      type: 'danger'
    });

    if (proceed) {
      try {
        const ok = deleteInventoryItem(item.id);
        if (ok) {
          toast.success(`"${item.name}" was removed from inventory.`, 'Item Removed');
        } else {
          toast.error(`Could not delete "${item.name}".`, 'Deletion Failed');
        }
      } catch {
        toast.error('An error occurred while deleting the inventory item.', 'Error');
      }
    }
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
          Low Stock Alert
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 w-fit">
        <CheckCircle2 className="w-3 h-3" />
        In Stock
      </span>
    );
  };

  const getFreshnessBadge = (status?: string) => {
    switch (status) {
      case 'freshly_harvested':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-emerald-400" />
            Fresh Harvest
          </span>
        );
      case 'expiring_soon':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
            <Clock className="w-2.5 h-2.5 text-amber-400" />
            Expiring Soon
          </span>
        );
      case 'expired':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
            <ShieldAlert className="w-2.5 h-2.5 text-rose-400" />
            Expired
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
            Optimal
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#0D2B1D] p-6 rounded-3xl border border-white/10 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase font-bold text-[#D4AF37] tracking-[0.25em]">
              Central Agribusiness Logistics
            </span>
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-white text-xs font-mono">
              {inventory.length} SKUs Live
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Inventory & Stock Catalog
          </h1>
          <p className="text-xs text-[#FDFBF5]/70 mt-0.5 max-w-xl">
            Live operations database synced in real time with the storefront catalog. Track stock levels, pricing, freshness, and photos.
          </p>
        </div>

        {/* Metrics & Create Button */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-[#071810] px-4 py-2.5 rounded-2xl border border-white/10 text-right">
            <div className="text-[10px] text-[#FDFBF5]/50 uppercase font-mono">Total Asset Value</div>
            <div className="text-sm sm:text-base font-black font-mono text-[#D4AF37]">
              ₦{totalAssetValue.toLocaleString()}
            </div>
          </div>

          <div className="bg-[#071810] px-4 py-2.5 rounded-2xl border border-white/10 text-right">
            <div className="text-[10px] text-[#FDFBF5]/50 uppercase font-mono">Low Stock</div>
            <div
              className={`text-sm sm:text-base font-black font-mono ${
                lowStockCount > 0 ? 'text-amber-400' : 'text-emerald-400'
              }`}
            >
              {lowStockCount} {lowStockCount === 1 ? 'Item' : 'Items'}
            </div>
          </div>

          {/* Create New Item Button */}
          <button
            onClick={handleOpenCreateModal}
            className="px-5 py-3 rounded-2xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#0D2B1D] font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Item</span>
          </button>
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
              placeholder="Search product name, category, or batch number..."
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
              <option value="all">All Categories</option>
              <option value="eggs">Eggs (Table Crates)</option>
              <option value="chicken">Dressed Frozen Chicken</option>
              <option value="poultry">Live Poultry & Broilers</option>
              <option value="fish">Fresh Catfish & Tilapia</option>
              <option value="vegetables">Field Vegetables & Greens</option>
              <option value="livestock">Rams & Goats</option>
              <option value="dairy">Dairy & Yoghurt</option>
              <option value="feed">Animal Feeds</option>
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
              <option value="optimal">Optimal Condition</option>
              <option value="expiring_soon">Expiring Soon</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-[#0D2B1D] border border-white/10 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#FDFBF5]/90">
            <thead className="bg-[#071810] text-[#FDFBF5]/60 uppercase tracking-wider text-[10px] border-b border-white/10 font-bold">
              <tr>
                <th className="py-4 px-4">Item & Photo</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4 text-center">Stock Level</th>
                <th className="py-4 px-4 text-right">Selling Price</th>
                <th className="py-4 px-4 text-right">Wholesale Rate</th>
                <th className="py-4 px-4 text-center">Freshness / Batch</th>
                <th className="py-4 px-4 text-center">Status</th>
                <th className="py-4 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-[#FDFBF5]/60 space-y-3">
                    <Package className="w-8 h-8 text-[#D4AF37] mx-auto opacity-60" />
                    <p className="text-sm font-semibold text-white">No inventory items found.</p>
                    <button
                      onClick={handleOpenCreateModal}
                      className="px-4 py-2 rounded-xl bg-[#D4AF37] text-[#0D2B1D] font-bold text-xs uppercase tracking-wider cursor-pointer"
                    >
                      Create First Product
                    </button>
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.03] transition-colors">
                    {/* Item Photo & Title */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-black/40 border border-white/10 shrink-0 relative group">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#FDFBF5]/40">
                              <ImageIcon className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm">{item.name}</div>
                          <div className="text-[11px] text-[#FDFBF5]/50 flex items-center gap-2 mt-0.5">
                            <span>Per {item.unit}</span>
                            <span>•</span>
                            <span className="font-mono text-[10px]">Threshold: {item.lowStockThreshold}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold uppercase text-[#D4AF37] tracking-wider">
                        {item.category}
                      </span>
                    </td>

                    {/* Stock Level & Quick +/- */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => updateInventoryStock(item.id, -1, true, 'Quick decrement')}
                          disabled={item.currentStock <= 0}
                          className="w-6 h-6 rounded-md bg-white/5 hover:bg-white/10 disabled:opacity-30 text-white flex items-center justify-center font-bold cursor-pointer"
                          title="Reduce 1"
                        >
                          <Minus className="w-3 h-3" />
                        </button>

                        <span className="font-mono font-black text-sm px-2 text-white min-w-[40px]">
                          {item.currentStock}
                        </span>

                        <button
                          onClick={() => updateInventoryStock(item.id, 1, true, 'Quick increment')}
                          className="w-6 h-6 rounded-md bg-white/5 hover:bg-white/10 text-white flex items-center justify-center font-bold cursor-pointer"
                          title="Add 1"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </td>

                    {/* Selling Price */}
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-white text-sm">
                      ₦{item.unitPrice.toLocaleString()}
                    </td>

                    {/* Wholesale Rate */}
                    <td className="py-3.5 px-4 text-right font-mono text-xs text-[#D4AF37]">
                      ₦{(item.wholesalePrice || item.unitPrice).toLocaleString()}
                    </td>

                    {/* Freshness / Batch */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        {getFreshnessBadge(item.freshnessStatus)}
                        {item.batchNumber && (
                          <span className="text-[10px] font-mono text-[#FDFBF5]/40">
                            {item.batchNumber}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Stock Status Badge */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex justify-center">{getStockStatusBadge(item)}</div>
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* Quick Restock Dialog */}
                        <button
                          onClick={() => setQuickAdjustItem(item)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-[#D4AF37]/20 hover:text-[#D4AF37] text-[#FDFBF5]/70 transition-colors cursor-pointer"
                          title="Quick Restock / Stock Adjustment"
                        >
                          <Zap className="w-3.5 h-3.5" />
                        </button>

                        {/* Full Edit Modal */}
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-[#D4AF37]/20 hover:text-[#D4AF37] text-[#FDFBF5]/70 transition-colors cursor-pointer"
                          title="Edit Specifications & Photo"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Item */}
                        <button
                          onClick={() => handleDeleteItem(item)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 hover:text-rose-400 text-[#FDFBF5]/40 transition-colors cursor-pointer"
                          title="Delete from Catalog"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Restock Popover Modal */}
      {quickAdjustItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D2B1D] border border-white/15 rounded-3xl w-full max-w-md p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-bold text-white uppercase tracking-wider">
                  Quick Stock Adjustment
                </h3>
                <p className="text-xs text-[#FDFBF5]/60 mt-0.5">
                  {quickAdjustItem.name} ({quickAdjustItem.currentStock} {quickAdjustItem.unit} currently)
                </p>
              </div>
              <button
                onClick={() => setQuickAdjustItem(null)}
                className="p-1.5 text-[#FDFBF5]/60 hover:text-white rounded-lg hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleQuickAdjust} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#FDFBF5]/80 uppercase tracking-wider block mb-1">
                  Stock Adjustment Delta (+ or -)
                </label>
                <input
                  type="number"
                  required
                  value={quickDelta}
                  onChange={(e) => setQuickDelta(Number(e.target.value))}
                  placeholder="e.g. +25 or -5"
                  className="w-full bg-[#071810] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white font-mono font-bold focus:outline-none focus:border-[#D4AF37]"
                />
                <span className="text-[10px] text-[#FDFBF5]/50 mt-1 block">
                  New stock will be: {Math.max(0, quickAdjustItem.currentStock + quickDelta)} {quickAdjustItem.unit}
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-[#FDFBF5]/80 uppercase tracking-wider block mb-1">
                  Reason for Adjustment
                </label>
                <input
                  type="text"
                  value={quickReason}
                  onChange={(e) => setQuickReason(e.target.value)}
                  placeholder="e.g. Morning harvest collection, Spoilage"
                  className="w-full bg-[#071810] border border-white/15 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setQuickAdjustItem(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#0D2B1D] font-black text-xs uppercase tracking-wider cursor-pointer"
                >
                  Confirm Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Create / Edit Full Modal */}
      <AdminCreateItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        itemToEdit={itemToEdit}
      />
    </div>
  );
};

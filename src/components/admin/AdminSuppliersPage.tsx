import React, { useState } from 'react';
import { useFarmConfig } from '../../context/FarmConfigContext';
import { useToast } from '../../context/ToastContext';
import { Supplier, PurchaseOrder, PurchaseOrderItem } from '../../types';
import {
  Truck,
  Plus,
  Search,
  Package,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  MapPin,
  FileSpreadsheet,
  Trash2,
  X,
  Star,
  Layers,
  ArrowDownLeft,
  Calendar,
  AlertCircle
} from 'lucide-react';

export const AdminSuppliersPage: React.FC = () => {
  const {
    suppliers,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    purchaseOrders,
    addPurchaseOrder,
    receivePurchaseOrder,
    deletePurchaseOrder,
    inventory,
    currentStaffUser
  } = useFarmConfig();
  const toast = useToast();

  const [activeSubTab, setActiveSubTab] = useState<'pos' | 'suppliers'>('pos');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewPOModalOpen, setIsNewPOModalOpen] = useState(false);
  const [isNewSupplierModalOpen, setIsNewSupplierModalOpen] = useState(false);

  // New PO Form State
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>(suppliers[0]?.id || '');
  const [expectedDate, setExpectedDate] = useState<string>('Tomorrow');
  const [poNotes, setPoNotes] = useState<string>('');
  const [poItems, setPoItems] = useState<PurchaseOrderItem[]>([
    { name: 'Layer Super Mash (50kg)', quantity: 50, unit: 'Bags', unitCost: 18500, totalCost: 925000, productId: 'fresh-eggs' }
  ]);

  // New Supplier Form State
  const [supName, setSupName] = useState('');
  const [supCategory, setSupCategory] = useState('Poultry & Fish Feeds');
  const [supContact, setSupContact] = useState('');
  const [supPhone, setSupPhone] = useState('');
  const [supEmail, setSupEmail] = useState('');
  const [supAddress, setSupAddress] = useState('');
  const [supItemsText, setSupItemsText] = useState('');

  const totalPOCost = poItems.reduce((sum, item) => sum + item.totalCost, 0);

  const handleAddItemToPO = () => {
    setPoItems(prev => [
      ...prev,
      { name: 'New Supply Item', quantity: 10, unit: 'Units', unitCost: 1000, totalCost: 10000 }
    ]);
  };

  const handleRemovePOItem = (index: number) => {
    if (poItems.length <= 1) {
      toast.warning('Purchase order requires at least one line item.', 'Item Required');
      return;
    }
    setPoItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdatePOItem = (index: number, field: keyof PurchaseOrderItem, value: string | number) => {
    setPoItems(prev => {
      const updated = [...prev];
      const target = { ...updated[index], [field]: value };
      if (field === 'quantity' || field === 'unitCost') {
        target.totalCost = target.quantity * target.unitCost;
      }
      updated[index] = target;
      return updated;
    });
  };

  const handleCreatePO = (e: React.FormEvent) => {
    e.preventDefault();
    const sup = suppliers.find(s => s.id === selectedSupplierId) || suppliers[0];
    if (!sup) {
      toast.error('Please select a valid supplier.', 'Supplier Missing');
      return;
    }

    const poNumber = `PO-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    try {
      addPurchaseOrder({
        poNumber,
        supplierId: sup.id,
        supplierName: sup.name,
        items: poItems,
        totalCost: totalPOCost,
        status: 'ordered',
        orderDate: new Date().toISOString().split('T')[0],
        expectedDeliveryDate: expectedDate,
        notes: poNotes
      });

      toast.success(`Generated Purchase Order #${poNumber} for ${sup.name}.`, 'PO Created');
      setIsNewPOModalOpen(false);
      setPoItems([
        { name: 'Layer Super Mash (50kg)', quantity: 50, unit: 'Bags', unitCost: 18500, totalCost: 925000, productId: 'fresh-eggs' }
      ]);
    } catch {
      toast.error('Failed to create purchase order.', 'Error');
    }
  };

  const handleCreateSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supName.trim() || !supPhone.trim()) {
      toast.error('Supplier business name and phone number are required.', 'Missing Fields');
      return;
    }

    try {
      addSupplier({
        name: supName.trim(),
        category: supCategory,
        contactPerson: supContact.trim() || 'Sales Desk',
        phone: supPhone.trim(),
        email: supEmail.trim() || 'contact@supplier.com',
        address: supAddress.trim() || 'Kaduna State, Nigeria',
        itemsSupplied: supItemsText.split(',').map(s => s.trim()).filter(Boolean),
        status: 'active',
        rating: 5.0
      });

      toast.success(`Added "${supName.trim()}" to verified supplier directory.`, 'Supplier Registered');
      setIsNewSupplierModalOpen(false);
      setSupName('');
      setSupContact('');
      setSupPhone('');
      setSupEmail('');
      setSupAddress('');
      setSupItemsText('');
    } catch {
      toast.error('Failed to register supplier.', 'Error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0D2B1D] p-6 rounded-3xl border border-white/10 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase font-bold text-[#D4AF37] tracking-[0.25em]">
              Supply Chain & Restocking Operations
            </span>
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-white text-xs font-mono">
              {purchaseOrders.length} Restock POs
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Suppliers & Restock Purchase Orders
          </h1>
          <p className="text-xs text-[#FDFBF5]/70 mt-0.5">
            Procure farm feeds, packaging crates, vaccines, and day-old chicks with automatic inventory replenishment.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsNewSupplierModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-bold transition-all cursor-pointer"
          >
            + Add Supplier
          </button>

          <button
            type="button"
            onClick={() => setIsNewPOModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#0D2B1D] text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Create Restock PO</span>
          </button>
        </div>
      </div>

      {/* Sub-tab switcher */}
      <div className="flex items-center gap-3 border-b border-white/10 pb-2">
        <button
          type="button"
          onClick={() => setActiveSubTab('pos')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'pos'
              ? 'bg-[#D4AF37] text-[#0D2B1D] shadow-md'
              : 'bg-white/5 text-[#FDFBF5]/70 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Purchase Orders Tracker ({purchaseOrders.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('suppliers')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'suppliers'
              ? 'bg-[#D4AF37] text-[#0D2B1D] shadow-md'
              : 'bg-white/5 text-[#FDFBF5]/70 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Approved Suppliers Registry ({suppliers.length})</span>
        </button>
      </div>

      {/* SUB-TAB 1: PURCHASE ORDERS */}
      {activeSubTab === 'pos' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {purchaseOrders.map((po) => {
              const isReceived = po.status === 'received';

              return (
                <div
                  key={po.id}
                  className={`bg-[#0D2B1D] rounded-3xl p-6 border shadow-xl transition-all ${
                    isReceived ? 'border-emerald-500/30' : 'border-white/10'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white text-base">#{po.poNumber}</span>
                        {isReceived ? (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Stock Received & Added to Inventory
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Awaiting Farm Delivery
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-[#D4AF37] font-bold mt-1">
                        Supplier: {po.supplierName}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-[10px] uppercase font-mono text-[#FDFBF5]/50">Total PO Value</div>
                        <div className="text-base font-black font-mono text-white">₦{po.totalCost.toLocaleString()}</div>
                      </div>

                      {!isReceived && (
                        <button
                          type="button"
                          onClick={async () => {
                            const proceed = await toast.confirmAction({
                              title: 'Receive Consignment & Restock',
                              message: `Confirm physical arrival of Purchase Order #${po.poNumber}? All item quantities will be added to warehouse stock.`,
                              confirmText: 'Verify & Add to Stock',
                              cancelText: 'Cancel',
                              type: 'info'
                            });
                            if (proceed) {
                              try {
                                receivePurchaseOrder(po.id);
                                toast.success(`PO #${po.poNumber} received. Warehouse inventory automatically updated.`, 'Stock Received');
                              } catch {
                                toast.error('Failed to update inventory for received PO.', 'Error');
                              }
                            }
                          }}
                          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                          title="Verify delivery and automatically add quantities to inventory"
                        >
                          <ArrowDownLeft className="w-4 h-4" />
                          <span>Receive & Add Stock</span>
                        </button>
                      )}

                      {currentStaffUser?.role === 'admin' && (
                        <button
                          type="button"
                          onClick={async () => {
                            const proceed = await toast.confirmAction({
                              title: 'Cancel Purchase Order',
                              message: `Are you sure you want to cancel and delete PO #${po.poNumber}?`,
                              confirmText: 'Cancel PO',
                              cancelText: 'Keep Active',
                              type: 'danger'
                            });
                            if (proceed) {
                              try {
                                deletePurchaseOrder(po.id);
                                toast.success(`Purchase Order #${po.poNumber} cancelled.`, 'PO Removed');
                              } catch {
                                toast.error('Failed to delete PO.', 'Error');
                              }
                            }
                          }}
                          className="p-2 rounded-xl bg-white/5 hover:bg-rose-500 hover:text-white text-rose-400 border border-white/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* PO Items */}
                  <div className="py-4 space-y-2">
                    <div className="text-[11px] font-bold text-[#FDFBF5]/60 uppercase tracking-wider">
                      Ordered Supplies & Materials ({po.items.length} lines):
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {po.items.map((item, i) => (
                        <div key={i} className="bg-[#071810] p-3 rounded-2xl border border-white/5 flex items-center justify-between text-xs">
                          <div>
                            <div className="font-bold text-white">{item.name}</div>
                            <div className="text-[11px] text-[#FDFBF5]/60">
                              {item.quantity} {item.unit} @ ₦{item.unitCost.toLocaleString()}
                            </div>
                          </div>
                          <div className="font-mono font-bold text-[#D4AF37]">
                            ₦{item.totalCost.toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-[#FDFBF5]/60">
                    <div className="flex items-center gap-3">
                      <span>Order Date: <strong>{po.orderDate}</strong></span>
                      <span>Expected: <strong>{po.expectedDeliveryDate}</strong></span>
                    </div>
                    {po.notes && <div className="italic text-[#FDFBF5]/70">Note: {po.notes}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: SUPPLIERS DIRECTORY */}
      {activeSubTab === 'suppliers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {suppliers.map((sup) => (
            <div key={sup.id} className="bg-[#0D2B1D] rounded-3xl p-6 border border-white/10 shadow-xl space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">{sup.name}</h3>
                  <div className="text-xs text-[#D4AF37] font-semibold mt-0.5">{sup.category}</div>
                </div>
                <div className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-full text-xs font-mono text-amber-300 border border-white/10">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{sup.rating.toFixed(1)}</span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-[#FDFBF5]/80">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{sup.phone} ({sup.contactPerson})</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{sup.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{sup.address}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 space-y-1.5">
                <div className="text-[10px] uppercase font-bold text-[#FDFBF5]/50">Supplied Product Lines:</div>
                <div className="flex flex-wrap gap-1.5">
                  {sup.itemsSupplied.map((prod, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-lg bg-white/5 text-[11px] text-[#FDFBF5]/80 border border-white/5">
                      {prod}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE PURCHASE ORDER MODAL */}
      {isNewPOModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0D2B1D] border border-white/15 rounded-3xl w-full max-w-2xl shadow-2xl p-6 space-y-5 my-auto max-h-[92vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#D4AF37]" />
                <span>Issue Restock Purchase Order</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsNewPOModalOpen(false)}
                className="p-2 text-[#FDFBF5]/60 hover:text-white rounded-xl hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePO} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#D4AF37] uppercase mb-1">Select Supplier *</label>
                  <select
                    value={selectedSupplierId}
                    onChange={(e) => setSelectedSupplierId(e.target.value)}
                    className="w-full bg-[#071810] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4AF37] cursor-pointer"
                  >
                    {suppliers.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.category})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#D4AF37] uppercase mb-1">Expected Delivery Date *</label>
                  <input
                    type="text"
                    value={expectedDate}
                    onChange={(e) => setExpectedDate(e.target.value)}
                    placeholder="e.g. Tomorrow Morning, 2024-08-20"
                    className="w-full bg-[#071810] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              {/* Items Table in PO */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-[#D4AF37] uppercase">Items / Materials to Restock:</label>
                  <button
                    type="button"
                    onClick={handleAddItemToPO}
                    className="px-2.5 py-1 bg-white/10 hover:bg-white/15 text-white rounded-lg text-xs font-bold cursor-pointer"
                  >
                    + Add Line
                  </button>
                </div>

                <div className="space-y-2">
                  {poItems.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 bg-[#071810] p-3 rounded-xl border border-white/10 items-center">
                      <div className="col-span-5">
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => handleUpdatePOItem(idx, 'name', e.target.value)}
                          placeholder="Item name (e.g. Layer Mash 50kg)"
                          className="w-full bg-transparent text-white font-bold focus:outline-none"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) => handleUpdatePOItem(idx, 'quantity', parseInt(e.target.value) || 1)}
                          className="w-full bg-white/5 rounded px-2 py-1 text-white font-mono text-center"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="text"
                          value={item.unit}
                          onChange={(e) => handleUpdatePOItem(idx, 'unit', e.target.value)}
                          className="w-full bg-white/5 rounded px-2 py-1 text-white text-center"
                        />
                      </div>
                      <div className="col-span-2 text-right font-mono font-bold text-[#D4AF37]">
                        ₦{item.totalCost.toLocaleString()}
                      </div>
                      <div className="col-span-1 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemovePOItem(idx)}
                          className="text-rose-400 hover:text-rose-300"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-right text-sm font-bold text-white pt-2">
                  Total PO Estimated Cost: <span className="font-mono text-[#D4AF37]">₦{totalPOCost.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#D4AF37] uppercase mb-1">Internal Instructions / Notes</label>
                <input
                  type="text"
                  value={poNotes}
                  onChange={(e) => setPoNotes(e.target.value)}
                  placeholder="e.g. Request certificate of quality analysis upon truck unloading"
                  className="w-full bg-[#071810] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsNewPOModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#0D2B1D] font-black uppercase tracking-wider cursor-pointer shadow-lg"
                >
                  Issue Restock Purchase Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE NEW SUPPLIER MODAL */}
      {isNewSupplierModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0D2B1D] border border-white/15 rounded-3xl w-full max-w-lg shadow-2xl p-6 space-y-5 my-auto max-h-[92vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#D4AF37]" />
                <span>Register Farm Supplier</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsNewSupplierModalOpen(false)}
                className="p-2 text-[#FDFBF5]/60 hover:text-white rounded-xl hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSupplier} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-[#D4AF37] uppercase mb-1">Company / Supplier Name *</label>
                <input
                  type="text"
                  required
                  value={supName}
                  onChange={(e) => setSupName(e.target.value)}
                  placeholder="e.g. Northern Grains & Feeds Ltd"
                  className="w-full bg-[#071810] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#D4AF37] uppercase mb-1">Category *</label>
                  <input
                    type="text"
                    required
                    value={supCategory}
                    onChange={(e) => setSupCategory(e.target.value)}
                    placeholder="e.g. Poultry & Fish Feeds"
                    className="w-full bg-[#071810] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#D4AF37] uppercase mb-1">Contact Officer</label>
                  <input
                    type="text"
                    value={supContact}
                    onChange={(e) => setSupContact(e.target.value)}
                    placeholder="e.g. Alhaji Danbaba"
                    className="w-full bg-[#071810] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#D4AF37] uppercase mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={supPhone}
                    onChange={(e) => setSupPhone(e.target.value)}
                    placeholder="+234 803 000 0000"
                    className="w-full bg-[#071810] border border-white/10 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#D4AF37] uppercase mb-1">Email</label>
                  <input
                    type="email"
                    value={supEmail}
                    onChange={(e) => setSupEmail(e.target.value)}
                    placeholder="sales@supplier.com"
                    className="w-full bg-[#071810] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#D4AF37] uppercase mb-1">Warehouse Address in Kaduna</label>
                <input
                  type="text"
                  value={supAddress}
                  onChange={(e) => setSupAddress(e.target.value)}
                  placeholder="e.g. Kudenda Industrial Area, Kaduna South"
                  className="w-full bg-[#071810] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#D4AF37] uppercase mb-1">Items Supplied (comma separated)</label>
                <input
                  type="text"
                  value={supItemsText}
                  onChange={(e) => setSupItemsText(e.target.value)}
                  placeholder="Layer Mash, Broiler Starter, Catfish Pellets"
                  className="w-full bg-[#071810] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewSupplierModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#0D2B1D] font-black uppercase tracking-wider cursor-pointer shadow-lg"
                >
                  Save Supplier Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

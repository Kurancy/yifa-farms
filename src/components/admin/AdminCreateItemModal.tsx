import React, { useState, useRef } from 'react';
import { useFarmConfig, CreateItemPayload } from '../../context/FarmConfigContext';
import { useToast } from '../../context/ToastContext';
import { ProductCategory, InventoryItem } from '../../types';
import {
  X,
  Upload,
  Camera,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Layers,
  Tag,
  DollarSign,
  Package,
  Trash2,
  RefreshCw,
  Info
} from 'lucide-react';

interface AdminCreateItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemToEdit?: InventoryItem | null;
}

// Curated high quality farm photo presets for fast selection
const FARM_PRESET_IMAGES: { category: ProductCategory; label: string; url: string }[] = [
  {
    category: 'eggs',
    label: 'Fresh Morning Brown Eggs (Crate)',
    url: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=1000&q=80'
  },
  {
    category: 'eggs',
    label: 'Egg Basket Farm Gate',
    url: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=1000&q=80'
  },
  {
    category: 'chicken',
    label: 'Dressed Whole Frozen Chicken',
    url: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=1000&q=80'
  },
  {
    category: 'poultry',
    label: 'Live Healthy Broilers & Layers',
    url: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=1000&q=80'
  },
  {
    category: 'fish',
    label: 'Fresh Pond Catfish / Tilapia',
    url: 'https://images.unsplash.com/photo-1534043464124-3be32fe00099?auto=format&fit=crop&w=1000&q=80'
  },
  {
    category: 'vegetables',
    label: 'Fresh Field Tomatoes & Peppers',
    url: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=1000&q=80'
  },
  {
    category: 'vegetables',
    label: 'Crisp Garden Greens & Cabbage',
    url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=80'
  },
  {
    category: 'livestock',
    label: 'Prime Northern Ram / Goat',
    url: 'https://images.unsplash.com/photo-1563281577-a7be47e20db9?auto=format&fit=crop&w=1000&q=80'
  },
  {
    category: 'dairy',
    label: 'Fresh Farm Yoghurt & Milk',
    url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=1000&q=80'
  },
  {
    category: 'feed',
    label: 'Nutrient-Dense Poultry Feed Bag',
    url: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=1000&q=80'
  }
];

export const AdminCreateItemModal: React.FC<AdminCreateItemModalProps> = ({
  isOpen,
  onClose,
  itemToEdit
}) => {
  const { createInventoryAndProductItem, updateInventoryItemFull } = useFarmConfig();
  const toast = useToast();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [name, setName] = useState<string>(itemToEdit?.name || '');
  const [category, setCategory] = useState<ProductCategory>(itemToEdit?.category || 'eggs');
  const [unitPrice, setUnitPrice] = useState<number>(itemToEdit?.unitPrice || 4500);
  const [wholesalePrice, setWholesalePrice] = useState<number>(itemToEdit?.wholesalePrice || 4200);
  const [unitCost, setUnitCost] = useState<number>(itemToEdit?.unitCost || 3200);
  const [unit, setUnit] = useState<string>(itemToEdit?.unit || 'Crate (30 Eggs)');
  const [currentStock, setCurrentStock] = useState<number>(itemToEdit?.currentStock !== undefined ? itemToEdit.currentStock : 50);
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(itemToEdit?.lowStockThreshold || 10);
  const [description, setDescription] = useState<string>(
    itemToEdit?.description ||
      'Freshly harvested, 100% natural farm produce from YIFA Farms in Kaduna. Inspected and graded for peak quality and freshness.'
  );
  const [badge, setBadge] = useState<string>('Daily Morning Harvest');
  const [shelfLifeDays, setShelfLifeDays] = useState<number>(itemToEdit?.shelfLifeDays || 14);
  const [harvestDate, setHarvestDate] = useState<string>(itemToEdit?.harvestDate || 'Today');

  // Image Upload & Preview State
  const [imagePreview, setImagePreview] = useState<string>(
    itemToEdit?.image || FARM_PRESET_IMAGES[0].url
  );
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [imageSourceNote, setImageSourceNote] = useState<string>(
    itemToEdit?.image ? 'Existing Photo' : 'Preset Photo'
  );
  const [showPresetPicker, setShowPresetPicker] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<boolean>(false);

  if (!isOpen) return null;

  // Handle client-side canvas compression for uploaded images (JPG, PNG, WEBP, camera)
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (JPG, PNG, or WEBP).');
      return;
    }

    setIsCompressing(true);
    setErrorMsg(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Max dimension bounds (keeps photos sharp yet lightweight)
        const MAX_WIDTH = 960;
        const MAX_HEIGHT = 720;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Compress to high quality WebP or JPEG
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.84);
          setImagePreview(compressedDataUrl);
          const sizeKb = Math.round((compressedDataUrl.length * 3) / 4 / 1024);
          setImageSourceNote(`Uploaded Photo (${width}×${height}px, ~${sizeKb} KB)`);
        }
        setIsCompressing(false);
      };
      img.onerror = () => {
        setIsCompressing(false);
        setErrorMsg('Failed to process image. Please try another file.');
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (presetUrl: string, label: string) => {
    setImagePreview(presetUrl);
    setImageSourceNote(`Preset: ${label}`);
    setShowPresetPicker(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Product name is required.');
      toast.error('Product name is required.', 'Validation Error');
      return;
    }
    if (unitPrice <= 0) {
      setErrorMsg('Price must be greater than 0.');
      toast.error('Price must be greater than ₦0.', 'Invalid Pricing');
      return;
    }

    try {
      if (itemToEdit) {
        // Update existing item
        updateInventoryItemFull(itemToEdit.id, {
          name: name.trim(),
          category,
          unitPrice,
          wholesalePrice: wholesalePrice || unitPrice,
          unitCost: unitCost || Math.round(unitPrice * 0.75),
          unit,
          currentStock,
          lowStockThreshold,
          description,
          image: imagePreview,
          shelfLifeDays,
          harvestDate
        });
        toast.success(`Updated "${name.trim()}" across inventory and catalog.`, 'Product Updated');
      } else {
        // Create brand new item (syncs to inventory + storefront catalog)
        const payload: CreateItemPayload = {
          name: name.trim(),
          category,
          unitPrice,
          wholesalePrice: wholesalePrice || unitPrice,
          unitCost: unitCost || Math.round(unitPrice * 0.75),
          unit,
          currentStock,
          lowStockThreshold,
          description,
          image: imagePreview,
          badge: badge || 'Fresh Harvest',
          shelfLifeDays,
          harvestDate
        };
        createInventoryAndProductItem(payload);
        toast.success(`Added new product "${name.trim()}" to Kaduna farm inventory and store.`, 'Product Created');
      }

      setSuccessToast(true);
      setTimeout(() => {
        setSuccessToast(false);
        onClose();
      }, 500);
    } catch {
      toast.error('Could not save product. Please try again.', 'Error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-[#0D2B1D] border border-white/15 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in zoom-in-95">
        
        {/* Modal Header */}
        <div className="bg-[#071810] px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] font-black">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wide">
                {itemToEdit ? `Edit Farm Item: ${itemToEdit.name}` : 'Create New Farm Product'}
              </h2>
              <p className="text-xs text-[#FDFBF5]/60 mt-0.5">
                Automatically connects to Storefront Catalog & Operations Database
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#FDFBF5]/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1">
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-500/20 border border-rose-500/30 text-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successToast && (
            <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-200 text-sm font-bold flex items-center gap-2 animate-bounce">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>
                {itemToEdit
                  ? 'Item successfully updated and synced live across storefront & inventory!'
                  : 'New product created! Live on storefront catalog immediately.'}
              </span>
            </div>
          )}

          {/* Section 1: Product Photo Upload (Key requirement) */}
          <div className="bg-[#071810] p-5 rounded-2xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider block">
                  Product Image (Essential for Storefront)
                </label>
                <p className="text-[11px] text-[#FDFBF5]/60">
                  Upload photo from device camera/gallery or choose from farm preset gallery.
                </p>
              </div>

              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 text-[#FDFBF5]/60 border border-white/10">
                {imageSourceNote}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              {/* Image Preview Box */}
              <div className="sm:col-span-5 relative group">
                <div className="w-full h-44 rounded-2xl overflow-hidden border-2 border-white/15 bg-black/40 relative shadow-inner flex items-center justify-center">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Product preview"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="text-center p-4 text-[#FDFBF5]/40">
                      <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
                      <span className="text-xs">No image selected</span>
                    </div>
                  )}

                  {isCompressing && (
                    <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center gap-2 text-xs text-white">
                      <RefreshCw className="w-5 h-5 animate-spin text-[#D4AF37]" />
                      <span>Optimizing Photo...</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Upload Controls */}
              <div className="sm:col-span-7 space-y-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageFileChange}
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                />

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#0D2B1D] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Upload / Camera</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowPresetPicker(!showPresetPicker)}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all border border-white/10 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Farm Presets</span>
                  </button>
                </div>

                <p className="text-[11px] text-[#FDFBF5]/50 leading-relaxed">
                  Automatic client-side compression resizes photos to under ~120KB for instantaneous loading across mobile devices.
                </p>

                {/* Preset Gallery Picker Dropdown */}
                {showPresetPicker && (
                  <div className="p-3 bg-[#0A2217] rounded-xl border border-white/10 space-y-2 max-h-48 overflow-y-auto">
                    <div className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider">
                      Select High-Res Farm Preset:
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {FARM_PRESET_IMAGES.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectPreset(preset.url, preset.label)}
                          className="flex items-center gap-2 p-1.5 rounded-lg bg-black/30 hover:bg-[#D4AF37]/20 border border-white/5 hover:border-[#D4AF37]/40 text-left transition-all cursor-pointer"
                        >
                          <img
                            src={preset.url}
                            alt={preset.label}
                            className="w-8 h-8 rounded-md object-cover"
                          />
                          <span className="text-[10px] text-[#FDFBF5]/80 truncate font-semibold">
                            {preset.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Product Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-[#FDFBF5]/80 uppercase tracking-wider block mb-1.5">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Fresh Farm Eggs (30-Egg Crate)"
                className="w-full bg-[#071810] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#FDFBF5]/30 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#FDFBF5]/80 uppercase tracking-wider block mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full bg-[#071810] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37] cursor-pointer"
              >
                <option value="eggs">Eggs (Table Eggs & Crates)</option>
                <option value="chicken">Frozen Chicken (Dressed & Cuts)</option>
                <option value="poultry">Live Poultry (Broilers & Layers)</option>
                <option value="fish">Fresh Fish (Catfish & Tilapia)</option>
                <option value="livestock">Rams, Goats & Livestock</option>
                <option value="vegetables">Field Vegetables & Greens</option>
                <option value="dairy">Yoghurt & Fresh Dairy</option>
                <option value="feed">Animal Feeds & Supplements</option>
              </select>
            </div>
          </div>

          {/* Section 3: Pricing & Unit */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-[#FDFBF5]/80 uppercase tracking-wider block mb-1.5">
                Retail Price (₦) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-[#D4AF37] font-bold text-sm">₦</span>
                <input
                  type="number"
                  min="1"
                  required
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(Number(e.target.value))}
                  placeholder="4500"
                  className="w-full bg-[#071810] border border-white/15 rounded-xl pl-8 pr-4 py-2.5 text-sm text-white font-mono font-bold focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#FDFBF5]/80 uppercase tracking-wider block mb-1.5">
                Wholesale Price (₦)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-emerald-400 font-bold text-sm">₦</span>
                <input
                  type="number"
                  min="1"
                  value={wholesalePrice}
                  onChange={(e) => setWholesalePrice(Number(e.target.value))}
                  placeholder="4200"
                  className="w-full bg-[#071810] border border-white/15 rounded-xl pl-8 pr-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#FDFBF5]/80 uppercase tracking-wider block mb-1.5">
                Unit of Measurement *
              </label>
              <input
                type="text"
                required
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="e.g. Crate (30 Eggs), per kg, per Bird"
                className="w-full bg-[#071810] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          {/* Section 4: Stock & Low-Stock Alert Threshold */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-[#FDFBF5]/80 uppercase tracking-wider block mb-1.5">
                Current Stock Quantity *
              </label>
              <input
                type="number"
                min="0"
                required
                value={currentStock}
                onChange={(e) => setCurrentStock(Number(e.target.value))}
                placeholder="50"
                className="w-full bg-[#071810] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white font-mono font-bold focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#FDFBF5]/80 uppercase tracking-wider block mb-1.5">
                Low Stock Threshold (Alert) *
              </label>
              <input
                type="number"
                min="1"
                required
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                placeholder="10"
                className="w-full bg-[#071810] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-amber-400 font-mono focus:outline-none focus:border-[#D4AF37]"
              />
              <span className="text-[10px] text-[#FDFBF5]/50 mt-1 block">
                Triggers notification when stock dips below this level.
              </span>
            </div>

            <div>
              <label className="text-xs font-bold text-[#FDFBF5]/80 uppercase tracking-wider block mb-1.5">
                Catalog Badge / Tag
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="e.g. Daily Harvest, Bestseller"
                className="w-full bg-[#071810] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          {/* Section 5: Description */}
          <div>
            <label className="text-xs font-bold text-[#FDFBF5]/80 uppercase tracking-wider block mb-1.5">
              Short Description & Quality Highlights
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the farm freshness, origin, and quality guarantees for customers..."
              className="w-full bg-[#071810] border border-white/15 rounded-xl p-3.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#D4AF37] leading-relaxed"
            ></textarea>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="bg-[#071810] px-6 py-4 border-t border-white/10 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-[#FDFBF5]/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isCompressing}
            className="px-7 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#0D2B1D] font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{itemToEdit ? 'Save & Sync Changes' : 'Publish Product to Storefront'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

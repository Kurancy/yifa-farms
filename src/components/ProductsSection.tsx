import React, { useState, useEffect } from 'react';
import { useFarmConfig } from '../context/FarmConfigContext';
import { ProductItem } from '../types';
import { ProductCard } from './ProductCard';
import { ProductModal } from './ProductModal';
import { ProductGridSkeleton } from './skeletons/LoadingSkeletons';
import { Sparkles, ShoppingBag, ShieldCheck, ArrowRight, RefreshCw } from 'lucide-react';

interface ProductsSectionProps {
  selectedCategoryFilter?: string;
  onSelectForQuote: (product: ProductItem) => void;
  onOpenBulkInquiry: () => void;
}

export const ProductsSection: React.FC<ProductsSectionProps> = ({
  selectedCategoryFilter = 'all',
  onSelectForQuote,
  onOpenBulkInquiry
}) => {
  const { products } = useFarmConfig();
  const [activeTab, setActiveTab] = useState<string>(selectedCategoryFilter);
  const [activeModalProduct, setActiveModalProduct] = useState<ProductItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initial load simulation & category filter transition
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [activeTab]);

  // Sync if prop changed
  useEffect(() => {
    if (selectedCategoryFilter && selectedCategoryFilter !== 'all') {
      setActiveTab(selectedCategoryFilter);
    }
  }, [selectedCategoryFilter]);

  const handleTabChange = (tab: string) => {
    if (tab === activeTab) return;
    setIsLoading(true);
    setActiveTab(tab);
  };

  const filteredProducts =
    activeTab === 'all'
      ? products
      : products.filter((p) => p.category === activeTab);

  return (
    <section id="products" className="pt-2 pb-20 sm:pt-4 sm:pb-24 bg-transparent text-[#FDFBF5] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Filter & Live Count Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-10 pb-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-pulse"></span>
            <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37]">
              Live Farm Inventory ({filteredProducts.length} Items Listed)
            </span>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
            <button
              type="button"
              onClick={() => handleTabChange('all')}
              className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-[#D4AF37] text-[#0D2B1D] shadow-md'
                  : 'text-[#FDFBF5]/70 hover:text-white hover:bg-white/5'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('eggs')}
              className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                activeTab === 'eggs'
                  ? 'bg-[#D4AF37] text-[#0D2B1D] shadow-md'
                  : 'text-[#FDFBF5]/70 hover:text-white hover:bg-white/5'
              }`}
            >
              🥚 Eggs
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('chicken')}
              className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                activeTab === 'chicken'
                  ? 'bg-[#D4AF37] text-[#0D2B1D] shadow-md'
                  : 'text-[#FDFBF5]/70 hover:text-white hover:bg-white/5'
              }`}
            >
              🍗 Frozen Chicken
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('poultry')}
              className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                activeTab === 'poultry'
                  ? 'bg-[#D4AF37] text-[#0D2B1D] shadow-md'
                  : 'text-[#FDFBF5]/70 hover:text-white hover:bg-white/5'
              }`}
            >
              🐓 Live Poultry
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('fish')}
              className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                activeTab === 'fish'
                  ? 'bg-[#D4AF37] text-[#0D2B1D] shadow-md'
                  : 'text-[#FDFBF5]/70 hover:text-white hover:bg-white/5'
              }`}
            >
              🐟 Catfish & Fish
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('vegetables')}
              className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                activeTab === 'vegetables'
                  ? 'bg-[#D4AF37] text-[#0D2B1D] shadow-md'
                  : 'text-[#FDFBF5]/70 hover:text-white hover:bg-white/5'
              }`}
            >
              🥬 Vegetables
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('livestock')}
              className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                activeTab === 'livestock'
                  ? 'bg-[#D4AF37] text-[#0D2B1D] shadow-md'
                  : 'text-[#FDFBF5]/70 hover:text-white hover:bg-white/5'
              }`}
            >
              🐐 Rams & Goats
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('dairy')}
              className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                activeTab === 'dairy'
                  ? 'bg-[#D4AF37] text-[#0D2B1D] shadow-md'
                  : 'text-[#FDFBF5]/70 hover:text-white hover:bg-white/5'
              }`}
            >
              🥛 Yoghurt & Dairy
            </button>
          </div>
        </div>

        {/* Product Cards Grid with Skeleton Loading */}
        {isLoading ? (
          <ProductGridSkeleton count={6} />
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-[#0A2217] rounded-3xl border border-white/10 p-8">
            <ShoppingBag className="w-12 h-12 text-[#D4AF37] mx-auto mb-3 opacity-60" />
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">No Products in this Category</h3>
            <p className="text-xs text-[#FDFBF5]/60 mt-1 max-w-md mx-auto">
              Our farm team adds freshly harvested batches daily. Switch categories or contact sales directly for custom allocations.
            </p>
            <button
              onClick={() => setActiveTab('all')}
              className="mt-4 px-5 py-2.5 rounded-xl bg-[#D4AF37] text-[#0D2B1D] font-bold text-xs uppercase tracking-wider cursor-pointer"
            >
              View All Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectForQuote={onSelectForQuote}
                onOpenDetails={setActiveModalProduct}
              />
            ))}
          </div>
        )}

        {/* Wholesale & Commercial Banner */}
        <div className="mt-16 bg-[#0A2217] rounded-3xl p-8 sm:p-10 border border-[#D4AF37]/20 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">Commercial Supply Contracts</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                Supplying Supermarkets, Hotels, Caterers & Institutions
              </h3>
              <p className="mt-2 text-sm text-[#FDFBF5]/75 leading-relaxed">
                Need 50 to 500+ crates of eggs weekly, bulk dressed chicken for restaurants, or contract supply for school cafeterias across Kaduna and Abuja? We offer customized contracts and farm-gate wholesale discounts.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 shrink-0">
              <button
                type="button"
                onClick={onOpenBulkInquiry}
                className="px-8 py-4 rounded-full bg-[#D4AF37] hover:bg-[#E5C158] text-[#0D2B1D] font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 shadow-xl cursor-pointer"
              >
                <span>Request Wholesale Quotation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      {activeModalProduct && (
        <ProductModal
          product={activeModalProduct}
          onClose={() => setActiveModalProduct(null)}
          onSelectForQuote={onSelectForQuote}
        />
      )}
    </section>
  );
};

import React, { useState, useEffect } from 'react';
import { productsData } from '../data/farmData';
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
  const [activeTab, setActiveTab] = useState<string>(selectedCategoryFilter);
  const [activeModalProduct, setActiveModalProduct] = useState<ProductItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initial load simulation & category filter transition
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 450);
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

  const filteredProducts = activeTab === 'all'
    ? productsData
    : productsData.filter(p => p.category === activeTab);

  return (
    <section id="products" className="pt-2 pb-20 sm:pt-4 sm:pb-24 bg-transparent text-[#FDFBF5] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Filter & Live Count Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-10 pb-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-pulse"></span>
            <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37]">
              Live Farm Inventory ({filteredProducts.length} Categories / Items)
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
              🐟 Fish
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
              🐏 Rams & Goats
            </button>
          </div>
        </div>

        {/* Product Cards Grid: Show Skeleton while loading, real cards with fade-in when ready */}
        {isLoading ? (
          <ProductGridSkeleton count={activeTab === 'all' ? 8 : Math.max(filteredProducts.length, 4)} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-300">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={(p) => setActiveModalProduct(p)}
                onSelectForQuote={onSelectForQuote}
              />
            ))}
          </div>
        )}

        {/* Commercial Wholesale Box */}
        <div className="mt-14 bg-[#0A2217] rounded-3xl p-6 sm:p-10 text-[#FDFBF5] flex flex-col md:flex-row items-center justify-between gap-6 border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#4A7C59]/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="space-y-2 text-center md:text-left relative z-10">
            <span className="inline-block px-3 py-1 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 font-bold text-[10px] uppercase tracking-[0.2em]">
              Wholesaler & Commercial Off-Takers
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Need Regular Weekly or Monthly Bulk Allocations?
            </h3>
            <p className="text-sm text-[#FDFBF5]/70 max-w-2xl">
              We provide fixed schedule delivery contracts, crate bulk rates, and vehicle dispatch support for supermarkets, catering enterprises, and hotel food chains.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenBulkInquiry}
            className="px-7 py-4 rounded-full bg-[#D4AF37] hover:bg-[#E5C158] text-[#0D2B1D] font-extrabold text-xs uppercase tracking-widest transition-all whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer shadow-lg relative z-10"
          >
            <span>Request Commercial Quote</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Detail Modal */}
      <ProductModal
        product={activeModalProduct}
        onClose={() => setActiveModalProduct(null)}
        onSelectForQuote={onSelectForQuote}
      />
    </section>
  );
};

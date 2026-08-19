import React from 'react';
import { ProductItem } from '../types';
import { useFarmConfig } from '../context/FarmConfigContext';
import { X, Check, MessageCircle, ArrowRight, Package, Clock, ShieldCheck, Truck } from 'lucide-react';
import { ClientConfirmBadge } from './ClientConfirmBadge';

interface ProductModalProps {
  product: ProductItem | null;
  onClose: () => void;
  onSelectForQuote: (product: ProductItem) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onSelectForQuote
}) => {
  const { config } = useFarmConfig();

  if (!product) return null;

  const whatsappProductLink = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(
    `Hello YIFA Farms, I am inquiring about "${product.name}". Please share current pricing and delivery availability in Kaduna.`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-[#0D2B1D] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/10 text-[#FDFBF5]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with image */}
        <div className="relative h-60 sm:h-72 w-full overflow-hidden bg-black/40">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D2B1D] via-black/30 to-transparent"></div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close product details"
            className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 hover:bg-black text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 text-white">
            {product.badge && (
              <span className="inline-block px-3 py-1 rounded-full bg-[#D4AF37] text-[#0D2B1D] font-bold text-xs uppercase tracking-wider mb-2">
                {product.badge}
              </span>
            )}
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              {product.name}
            </h3>
            <p className="text-[#D4AF37] text-xs sm:text-sm">{product.tagline}</p>
          </div>
        </div>

        {/* Content body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <h4 className="text-xs uppercase font-bold text-[#D4AF37] tracking-[0.2em] mb-2">
              Product Overview
            </h4>
            <p className="text-sm sm:text-base text-[#FDFBF5]/80 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Key Features */}
          <div>
            <h4 className="text-xs uppercase font-bold text-[#D4AF37] tracking-[0.2em] mb-3">
              Quality & Handling Highlights
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {product.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-[#FDFBF5]/90">
                  <Check className="w-4 h-4 text-[#4A7C59] shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Specs Table */}
          <div className="bg-white/5 rounded-2xl p-5 border border-white/10 space-y-3">
            <h4 className="text-xs uppercase font-bold text-[#D4AF37] tracking-wider border-b border-white/10 pb-2">
              Supply Specifications
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[#FDFBF5]/60 block font-medium">Standard Unit:</span>
                <span className="font-bold text-[#FDFBF5]">{product.specs.unit}</span>
              </div>
              <div>
                <span className="text-[#FDFBF5]/60 block font-medium">Packaging:</span>
                <span className="font-bold text-[#FDFBF5]">{product.specs.packaging}</span>
              </div>
              <div>
                <span className="text-[#FDFBF5]/60 block font-medium">Minimum Order:</span>
                <span className="font-bold text-[#FDFBF5]">{product.specs.minOrder}</span>
              </div>
              <div>
                <span className="text-[#FDFBF5]/60 block font-medium">Availability:</span>
                <span className="font-bold text-[#4EFA8B]">{product.specs.availability}</span>
              </div>
              {product.specs.shelfLife && (
                <div className="col-span-2">
                  <span className="text-[#FDFBF5]/60 block font-medium">Recommended Storage:</span>
                  <span className="font-semibold text-[#FDFBF5]">{product.specs.shelfLife}</span>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-[#FDFBF5]/60">Pricing Status:</span>
              <ClientConfirmBadge label="MARKET-INDEXED / CLIENT PRICING" />
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => {
                onSelectForQuote(product);
                onClose();
              }}
              className="flex-1 py-3.5 px-5 rounded-full bg-[#D4AF37] hover:bg-[#E5C158] text-[#0D2B1D] font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <span>Build Custom Quote</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href={whatsappProductLink}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3.5 px-6 rounded-full bg-[#4A7C59] hover:bg-[#5A8C69] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Inquire via WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

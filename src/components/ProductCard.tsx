import React from 'react';
import { ProductItem } from '../types';
import { useFarmConfig } from '../context/FarmConfigContext';
import { MessageCircle, ArrowRight, CheckCircle, Eye, Package } from 'lucide-react';
import { ClientConfirmBadge } from './ClientConfirmBadge';

interface ProductCardProps {
  product: ProductItem;
  onViewDetails: (product: ProductItem) => void;
  onSelectForQuote: (product: ProductItem) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDetails,
  onSelectForQuote
}) => {
  const { config } = useFarmConfig();

  const whatsappDirectLink = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(
    `Hello YIFA Farms, I would like to order "${product.name}". Please let me know your latest price list for delivery in Kaduna.`
  )}`;

  return (
    <div className="group bg-[#0A2217] rounded-2xl overflow-hidden border border-white/10 shadow-xl hover:shadow-2xl hover:border-[#D4AF37]/40 transition-all duration-300 flex flex-col justify-between text-[#FDFBF5]">
      {/* Product Image Banner */}
      <div className="relative h-56 w-full overflow-hidden bg-black/40">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 filter brightness-90 contrast-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A2217] via-transparent to-transparent"></div>

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3">
            <span className="inline-block px-2.5 py-1 rounded-full bg-[#0D2B1D]/90 text-[#D4AF37] text-[10px] font-bold tracking-wider uppercase border border-[#D4AF37]/40 shadow-sm backdrop-blur-xs">
              {product.badge}
            </span>
          </div>
        )}

        {/* View full details button overlay */}
        <button
          type="button"
          onClick={() => onViewDetails(product)}
          className="absolute top-3 right-3 p-2 rounded-full bg-black/60 hover:bg-black text-white text-xs opacity-90 group-hover:opacity-100 transition-opacity flex items-center gap-1 cursor-pointer"
          title="View full specs"
        >
          <Eye className="w-3.5 h-3.5" />
        </button>

        {/* Title overlay */}
        <div className="absolute bottom-2 left-4 right-4 text-white">
          <h3 className="text-lg font-bold tracking-tight text-white leading-tight font-['Outfit',sans-serif]">
            {product.name}
          </h3>
          <p className="text-xs text-[#D4AF37] line-clamp-1 mt-0.5">{product.tagline}</p>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <p className="text-xs text-[#FDFBF5]/70 leading-relaxed line-clamp-3">
          {product.description}
        </p>

        {/* Spec bullet points */}
        <div className="space-y-1.5 pt-2 border-t border-white/10">
          {product.features.slice(0, 3).map((feature, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-[#FDFBF5]/80">
              <CheckCircle className="w-3.5 h-3.5 text-[#4A7C59] shrink-0 mt-0.5" />
              <span className="line-clamp-1">{feature}</span>
            </div>
          ))}
        </div>

        {/* Packaging specification pill */}
        <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-[#FDFBF5]/70">
            <Package className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
            <span className="font-semibold text-[#FDFBF5] truncate">{product.specs.unit}</span>
          </div>
          <ClientConfirmBadge label="PRICING CONFIRMATION" />
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
          <button
            type="button"
            onClick={() => onSelectForQuote(product)}
            className="w-full sm:flex-1 py-2.5 px-3 rounded-full bg-[#4A7C59] hover:bg-[#5A8C69] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
          >
            <span>Request Quote</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <a
            href={whatsappDirectLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-[#4EFA8B] border border-white/10 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
            title="Inquire on WhatsApp"
          >
            <MessageCircle className="w-4 h-4 text-[#25D366]" />
            <span className="sm:hidden">WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};

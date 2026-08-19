import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'rectangular' | 'circular' | 'rounded' | 'text';
  width?: string | number;
  height?: string | number;
}

/**
 * Base Shimmer Skeleton Element
 * Utilizes a smooth CSS gradient shimmer pulse effect matching the dark green/gold aesthetic.
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rounded',
  width,
  height
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'circular':
        return 'rounded-full';
      case 'text':
        return 'rounded-md h-3.5';
      case 'rectangular':
        return 'rounded-none';
      case 'rounded':
      default:
        return 'rounded-xl';
    }
  };

  const style: React.CSSProperties = {};
  if (width !== undefined) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height !== undefined) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      style={style}
      aria-hidden="true"
      className={`relative overflow-hidden bg-white/[0.07] before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.8s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/[0.09] before:to-transparent ${getVariantClass()} ${className}`}
    />
  );
};

/**
 * Product Card Skeleton
 * Exactly mirrors the layout, padding, and structure of `ProductCard.tsx`
 * to eliminate cumulative layout shift (CLS).
 */
export const ProductCardSkeleton: React.FC = () => {
  return (
    <div
      className="bg-[#0A2217] rounded-2xl overflow-hidden border border-white/10 shadow-xl flex flex-col justify-between text-[#FDFBF5] animate-in fade-in duration-300"
      aria-label="Loading product details..."
    >
      {/* Product Image Area */}
      <div className="relative h-56 w-full bg-black/40 overflow-hidden">
        <Skeleton className="w-full h-full rounded-none" />

        {/* Top-left Badge Skeleton */}
        <div className="absolute top-3 left-3">
          <Skeleton className="h-5 w-24 rounded-full bg-white/15" />
        </div>

        {/* Top-right Action Button Skeleton */}
        <div className="absolute top-3 right-3">
          <Skeleton className="w-8 h-8 rounded-full bg-black/60" />
        </div>

        {/* Bottom Title & Tagline Overlay Skeleton */}
        <div className="absolute bottom-2 left-4 right-4 space-y-1.5">
          <Skeleton className="h-5 w-3/4 bg-white/20" />
          <Skeleton className="h-3 w-1/2 bg-[#D4AF37]/30" />
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        {/* Description Lines */}
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
          <Skeleton className="h-3 w-2/3" />
        </div>

        {/* Feature Checkpoints */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          <div className="flex items-center gap-2">
            <Skeleton variant="circular" className="w-3.5 h-3.5 bg-emerald-500/20 shrink-0" />
            <Skeleton className="h-3 w-4/5" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton variant="circular" className="w-3.5 h-3.5 bg-emerald-500/20 shrink-0" />
            <Skeleton className="h-3 w-3/4" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton variant="circular" className="w-3.5 h-3.5 bg-emerald-500/20 shrink-0" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>

        {/* Packaging / Price Pill Skeleton */}
        <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton variant="circular" className="w-3.5 h-3.5 bg-[#D4AF37]/30" />
            <Skeleton className="h-3.5 w-24" />
          </div>
          <Skeleton className="h-4 w-28 rounded-full bg-emerald-500/20" />
        </div>

        {/* Action Buttons Skeleton */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
          <Skeleton className="h-10 w-full sm:flex-1 rounded-full bg-[#4A7C59]/30" />
          <Skeleton className="h-10 w-full sm:w-10 rounded-full bg-white/10 shrink-0" />
        </div>
      </div>
    </div>
  );
};

/**
 * Product Grid Skeleton
 * Renders a grid of ProductCardSkeletons matching the active responsive layout.
 */
interface ProductGridSkeletonProps {
  count?: number;
}

export const ProductGridSkeleton: React.FC<ProductGridSkeletonProps> = ({ count = 8 }) => {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      role="status"
      aria-live="polite"
      aria-label="Loading farm catalog products..."
    >
      {Array.from({ length: count }).map((_, idx) => (
        <ProductCardSkeleton key={idx} />
      ))}
    </div>
  );
};

/**
 * Order Status Single Record Skeleton
 * Used in customer-facing `OrderStatusSection.tsx` tracking lookup.
 * Renders individual field skeletons (header, status badge pill, progress line, items, destination).
 */
export const OrderStatusSkeleton: React.FC = () => {
  return (
    <div
      className="max-w-4xl mx-auto bg-[#0D2B1D] rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl space-y-8 animate-in fade-in"
      role="status"
      aria-live="polite"
      aria-label="Retrieving consignment status..."
    >
      {/* Header Manifest */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-32 bg-[#D4AF37]/30" />
            <Skeleton className="h-4 w-20 rounded-md" />
          </div>
          <Skeleton className="h-8 w-44 font-mono" />
          <div className="flex items-center gap-2">
            <Skeleton variant="circular" className="w-3.5 h-3.5 bg-[#D4AF37]/40" />
            <Skeleton className="h-3.5 w-48" />
          </div>
        </div>

        {/* Status Badge Pill Skeleton */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2">
          <Skeleton className="h-8 w-40 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/30" />
          <Skeleton className="h-3 w-28" />
        </div>
      </div>

      {/* 4-Step Progress Bar Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-3 w-48 bg-[#D4AF37]/30" />
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-2">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="p-4 rounded-2xl bg-[#071810] border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton variant="circular" className="w-6 h-6 bg-[#D4AF37]/30" />
                <Skeleton className="h-3 w-12" />
              </div>
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Manifest Detail Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Left Box */}
        <div className="bg-[#071810] p-6 rounded-2xl border border-white/10 space-y-4">
          <Skeleton className="h-3.5 w-36 bg-[#D4AF37]/40" />
          <div className="space-y-2.5">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="pt-3 border-t border-white/10 flex justify-between">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-3.5 w-32" />
          </div>
        </div>

        {/* Right Box */}
        <div className="bg-[#071810] p-6 rounded-2xl border border-white/10 space-y-4">
          <Skeleton className="h-3.5 w-44 bg-[#D4AF37]/40" />
          <div className="space-y-2.5">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          <div className="pt-3 border-t border-white/10 flex justify-between">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-3.5 w-36" />
          </div>
        </div>
      </div>

      {/* Actions Bottom Bar */}
      <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
        <Skeleton className="h-3 w-48" />
        <div className="flex gap-2 w-full sm:w-auto">
          <Skeleton className="h-10 w-full sm:w-36 rounded-xl" />
          <Skeleton className="h-10 w-full sm:w-44 rounded-xl bg-[#25D366]/20" />
        </div>
      </div>
    </div>
  );
};

/**
 * Admin Table Row Skeleton
 * Used in `AdminOrdersPage.tsx` and `AdminDashboardOverview.tsx` while orders ledger is fetching or updating.
 */
interface AdminOrderRowsSkeletonProps {
  rowsCount?: number;
}

export const AdminOrderRowsSkeleton: React.FC<AdminOrderRowsSkeletonProps> = ({ rowsCount = 5 }) => {
  return (
    <>
      {Array.from({ length: rowsCount }).map((_, idx) => (
        <tr key={idx} className="border-b border-white/5 animate-pulse">
          {/* Checkbox */}
          <td className="py-4 px-4 text-center">
            <Skeleton className="w-4 h-4 rounded mx-auto" />
          </td>

          {/* Invoice ID & Date */}
          <td className="py-4 px-4">
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-24 font-mono" />
              <Skeleton className="h-3 w-20" />
            </div>
          </td>

          {/* Customer & Destination */}
          <td className="py-4 px-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3.5 w-16 rounded bg-[#D4AF37]/20" />
              </div>
              <Skeleton className="h-3 w-44" />
              <Skeleton className="h-2.5 w-24" />
            </div>
          </td>

          {/* Items Summary */}
          <td className="py-4 px-4">
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-36" />
              <Skeleton className="h-3 w-28" />
            </div>
          </td>

          {/* Amount */}
          <td className="py-4 px-4 text-right">
            <div className="space-y-1 ml-auto w-fit">
              <Skeleton className="h-4 w-20 ml-auto font-mono" />
              <Skeleton className="h-2.5 w-14 ml-auto" />
            </div>
          </td>

          {/* Payment Badge */}
          <td className="py-4 px-4">
            <Skeleton className="h-5 w-20 rounded-md" />
          </td>

          {/* Dispatch Status Badge */}
          <td className="py-4 px-4">
            <Skeleton className="h-6 w-28 rounded-full bg-white/10" />
          </td>

          {/* Actions */}
          <td className="py-4 px-4 text-center">
            <div className="flex items-center justify-center gap-1.5">
              <Skeleton className="w-8 h-8 rounded-xl" />
              <Skeleton className="w-8 h-8 rounded-xl bg-[#25D366]/20" />
            </div>
          </td>
        </tr>
      ))}
    </>
  );
};

/**
 * Order Detail Drawer Skeleton
 * Field-by-field skeleton for modal / drawer views when viewing specific order details.
 */
export const OrderDetailDrawerSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in" role="status" aria-label="Loading order details...">
      {/* Top Status Selector Skeleton */}
      <div className="bg-[#071810] p-5 rounded-2xl border border-white/10 space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-3.5 w-48 bg-[#D4AF37]/30" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-9 rounded-xl" />
          ))}
        </div>
      </div>

      {/* 2 Column breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#071810] p-5 rounded-2xl border border-white/10 space-y-3">
          <Skeleton className="h-3.5 w-36 bg-[#D4AF37]/30" />
          <div className="space-y-2 pt-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between py-2 border-b border-white/5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#071810] p-5 rounded-2xl border border-white/10 space-y-3">
          <Skeleton className="h-3.5 w-40 bg-[#D4AF37]/30" />
          <div className="space-y-3 pt-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-16 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

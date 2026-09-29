import React from 'react';
import { ProductItem } from '../../types/store';
import { useStore } from '../../context/StoreContext';
import { ShoppingBag, Heart, ArrowLeftRight, Star, Check, Eye } from 'lucide-react';

interface ProductCardProps {
  product: ProductItem;
  layout?: 'grid' | 'list';
  compact?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  layout = 'grid',
  compact = false,
}) => {
  const {
    formatPrice,
    addToCart,
    toggleWishlist,
    isInWishlist,
    addToCompare,
    isInCompare,
    setSelectedProductId,
  } = useStore();

  const isFavorited = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);
  const hasDiscount = product.salePrice && product.salePrice < product.basePrice;
  const isOutOfStock = product.stock <= 0;

  if (layout === 'list') {
    return (
      <div className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-5 transition-all duration-300 shadow-lg group">
        {/* Image Frame */}
        <div
          onClick={() => setSelectedProductId(product.id)}
          className="w-full sm:w-48 h-48 rounded-2xl bg-slate-950 border border-slate-800/80 overflow-hidden relative shrink-0 cursor-pointer"
        >
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {product.badge && (
            <span className="absolute top-2.5 right-2.5 bg-amber-500 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-lg shadow">
              {product.badge}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 space-y-2 text-right w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-amber-400 text-xs">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span className="font-bold">{product.rating}</span>
              <span className="text-slate-500 text-[11px]">({product.reviewCount})</span>
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isOutOfStock ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'
              }`}
            >
              {isOutOfStock ? 'نفذت الكمية' : `متوفر (${product.stock})`}
            </span>
          </div>

          <h3
            onClick={() => setSelectedProductId(product.id)}
            className="text-base font-bold text-white group-hover:text-amber-300 transition-colors cursor-pointer line-clamp-1"
          >
            {product.name}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
            {/* Price */}
            <div>
              <div className="text-base sm:text-lg font-black text-amber-400">
                {formatPrice(product.salePrice || product.basePrice)}
              </div>
              {hasDiscount && (
                <div className="text-xs text-slate-500 line-through">
                  {formatPrice(product.basePrice)}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isFavorited
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
                title="المفضلة"
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-400' : ''}`} />
              </button>

              <button
                type="button"
                onClick={() => addToCompare(product)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isCompared
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
                title="مقارنة"
              >
                <ArrowLeftRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                disabled={isOutOfStock}
                onClick={() => addToCart(product)}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>إضافة للسلة</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid Layout
  return (
    <div className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-lg hover:shadow-2xl group">
      {/* Top Image Frame - Edge to Edge */}
      <div className="w-full aspect-[4/3] bg-slate-950 relative overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          onClick={() => setSelectedProductId(product.id)}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 cursor-pointer"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.badge && (
            <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-lg shadow-md">
              {product.badge}
            </span>
          )}
          {hasDiscount && (
            <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-lg shadow-md">
              خصم {Math.round(((product.basePrice - product.salePrice!) / product.basePrice) * 100)}%
            </span>
          )}
        </div>

        {/* Floating Action Buttons */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className={`p-2 rounded-xl backdrop-blur-md border shadow-md transition-all cursor-pointer ${
              isFavorited
                ? 'bg-rose-500 text-white border-rose-400'
                : 'bg-slate-950/80 text-slate-300 border-slate-700/80 hover:bg-rose-500/20 hover:text-rose-400'
            }`}
            title="إضافة للمفضلة"
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-white' : ''}`} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              addToCompare(product);
            }}
            className={`p-2 rounded-xl backdrop-blur-md border shadow-md transition-all cursor-pointer ${
              isCompared
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                : 'bg-slate-950/80 text-slate-300 border-slate-700/80 hover:bg-amber-500/20 hover:text-amber-400'
            }`}
            title="مقارنة المنتج"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProductId(product.id);
            }}
            className="p-2 rounded-xl bg-slate-950/80 text-slate-300 border border-slate-700/80 hover:bg-slate-800 hover:text-white backdrop-blur-md shadow-md transition-all cursor-pointer"
            title="معاينة سريعة"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Body Details */}
      <div
        className={`${
          compact ? 'p-3 space-y-2' : 'p-4 sm:p-5 space-y-3'
        } flex-1 flex flex-col justify-between`}
      >
        <div className="space-y-1 text-right">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="w-3 h-3 fill-amber-400" />
              <span className="font-bold text-[11px]">{product.rating}</span>
              <span className="text-slate-500 text-[9px]">({product.reviewCount})</span>
            </div>
            <span
              className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                isOutOfStock ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'
              }`}
            >
              {isOutOfStock ? 'نفذت' : 'متوفر'}
            </span>
          </div>

          <h3
            onClick={() => setSelectedProductId(product.id)}
            className={`${
              compact ? 'text-xs' : 'text-xs sm:text-sm'
            } font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1 cursor-pointer`}
          >
            {product.name}
          </h3>

          <p
            className={`${
              compact ? 'text-[10px] line-clamp-1' : 'text-[11px] line-clamp-2'
            } text-slate-400 leading-relaxed`}
          >
            {product.shortDescription}
          </p>
        </div>

        {/* Price & Action */}
        <div className="pt-2 sm:pt-3 border-t border-slate-800/80 flex items-center justify-between gap-1.5">
          <div className="min-w-0">
            <div
              className={`${
                compact ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'
              } font-black text-amber-400 truncate`}
            >
              {formatPrice(product.salePrice || product.basePrice)}
            </div>
            {hasDiscount && (
              <div className="text-[10px] text-slate-500 line-through truncate">
                {formatPrice(product.basePrice)}
              </div>
            )}
          </div>

          <button
            type="button"
            disabled={isOutOfStock}
            onClick={() => addToCart(product)}
            className={`${
              compact ? 'p-2 sm:px-2.5 sm:py-1.5' : 'p-2 sm:px-3 sm:py-2'
            } bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-md shadow-amber-500/20 flex items-center gap-1 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className={`${compact ? 'hidden md:inline' : 'hidden sm:inline'} text-[11px]`}>
              أضف
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

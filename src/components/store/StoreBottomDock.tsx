import React from 'react';
import { useStore } from '../../context/StoreContext';
import {
  ShoppingBag,
  Heart,
  ArrowLeftRight,
  ScanBarcode,
  Search,
  Store,
} from 'lucide-react';

interface StoreBottomDockProps {
  onOpenStore?: () => void;
  isStoreView?: boolean;
}

export const StoreBottomDock: React.FC<StoreBottomDockProps> = ({
  onOpenStore,
  isStoreView = false,
}) => {
  const {
    cartCount,
    wishlist,
    compareList,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsCompareOpen,
    setIsPOSOpen,
    storeConfig,
  } = useStore();

  if (!storeConfig.isEnabled) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-md w-[92%] sm:w-auto">
      <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800/90 shadow-2xl shadow-slate-950/80 rounded-2xl p-1.5 sm:p-2 flex items-center justify-around gap-1 sm:gap-2">
        {/* Store Page Button */}
        {onOpenStore && (
          <button
            type="button"
            onClick={onOpenStore}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              isStoreView
                ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Store className="w-4 h-4" />
            <span className="hidden sm:inline">المتجر</span>
          </button>
        )}

        {/* Compare Button */}
        {storeConfig.enableCompare && (
          <button
            type="button"
            onClick={() => setIsCompareOpen(true)}
            className="p-2.5 sm:px-3 sm:py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all flex items-center gap-1.5 relative cursor-pointer"
            title="مقارنة المنتجات"
          >
            <ArrowLeftRight className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">المقارنة</span>
            {compareList.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {compareList.length}
              </span>
            )}
          </button>
        )}

        {/* Wishlist Button */}
        {storeConfig.enableWishlist && (
          <button
            type="button"
            onClick={() => setIsWishlistOpen(true)}
            className="p-2.5 sm:px-3 sm:py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all flex items-center gap-1.5 relative cursor-pointer"
            title="قائمة المفضلة"
          >
            <Heart className="w-4 h-4 text-rose-400" />
            <span className="hidden sm:inline">المفضلة</span>
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>
        )}

        {/* POS Cashier Scanner */}
        {storeConfig.enablePOSBarcodeScanner && (
          <button
            type="button"
            onClick={() => setIsPOSOpen(true)}
            className="p-2.5 sm:px-3 sm:py-2 rounded-xl text-xs font-bold text-amber-400 hover:bg-amber-500/10 border border-amber-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
            title="نظام الكاشير والباركود"
          >
            <ScanBarcode className="w-4 h-4" />
            <span className="hidden sm:inline">كاشير POS</span>
          </button>
        )}

        {/* Cart Button */}
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/25 flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>السلة ({cartCount})</span>
        </button>
      </div>
    </div>
  );
};

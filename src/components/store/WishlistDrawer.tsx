import React from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';

export const WishlistDrawer: React.FC = () => {
  const {
    isWishlistOpen,
    setIsWishlistOpen,
    wishlist,
    toggleWishlist,
    storeConfig,
    formatPrice,
    addToCart,
    setSelectedProductId,
  } = useStore();

  if (!isWishlistOpen) return null;

  const wishlistProducts = storeConfig.products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full max-h-[85vh] overflow-y-auto shadow-2xl relative text-right">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900 z-10">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-400 fill-rose-400" />
            <h3 className="text-base font-bold text-white">
              قائمة أمنياتك والمفضلة ({wishlistProducts.length})
            </h3>
          </div>

          <button
            type="button"
            onClick={() => setIsWishlistOpen(false)}
            className="p-2 rounded-full bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List */}
        <div className="p-5 space-y-3">
          {wishlistProducts.length === 0 ? (
            <div className="py-16 text-center space-y-3 text-slate-500">
              <Heart className="w-12 h-12 mx-auto stroke-1 text-slate-600" />
              <p className="text-sm font-bold text-slate-400">قائمة المفضلة فارغة</p>
              <p className="text-xs text-slate-500">
                انقر على رمز القلب بأي منتج لحفظه والعودة إليه لاحقاً.
              </p>
            </div>
          ) : (
            wishlistProducts.map((p) => (
              <div
                key={p.id}
                className="p-3.5 bg-slate-950 border border-slate-800/80 rounded-2xl flex items-center justify-between gap-3"
              >
                <div
                  onClick={() => {
                    setIsWishlistOpen(false);
                    setSelectedProductId(p.id);
                  }}
                  className="flex items-center gap-3 cursor-pointer overflow-hidden"
                >
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="w-14 h-14 rounded-xl object-cover bg-slate-900 shrink-0"
                  />
                  <div className="space-y-0.5 overflow-hidden text-right">
                    <h4 className="text-xs font-bold text-white truncate hover:text-amber-300">
                      {p.name}
                    </h4>
                    <div className="text-xs font-black text-amber-400">
                      {formatPrice(p.salePrice || p.basePrice)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      addToCart(p);
                      toggleWishlist(p.id);
                    }}
                    className="p-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow transition-all cursor-pointer flex items-center gap-1"
                    title="نقل إلى السلة"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">أضف للسلة</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleWishlist(p.id)}
                    className="p-2 text-slate-500 hover:text-rose-400 bg-slate-900 border border-slate-800 rounded-xl transition-colors cursor-pointer"
                    title="حذف من المفضلة"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

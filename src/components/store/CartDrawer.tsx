import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  Ticket,
  Check,
  Truck,
  MessageCircle,
} from 'lucide-react';
import { CheckoutModal } from './CheckoutModal';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartSubtotal,
    discountAmount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    formatPrice,
    storeConfig,
    sendOrderViaWhatsApp,
    activeCurrency,
  } = useStore();

  const [couponCode, setCouponCode] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  if (!isCartOpen) return null;

  const isFreeShipping =
    storeConfig.freeShippingThreshold && cartSubtotal >= storeConfig.freeShippingThreshold;
  const shippingFee = isFreeShipping ? 0 : storeConfig.shippingFee;
  const finalTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const res = applyCoupon(couponCode);
    setCouponFeedback(res);
  };

  const handleQuickWhatsAppCart = () => {
    // Generate draft order
    const phone = storeConfig.whatsappNumber.replace(/[^0-9]/g, '');
    const itemsText = cart
      .map(
        (i, idx) =>
          `🔹 *[${idx + 1}]* ${i.product.name} ${
            i.selectedVariant ? `(${i.selectedVariant.title})` : ''
          }\n    الكمية: ${i.quantity} × ${formatPrice(i.price)}`
      )
      .join('\n\n');

    const text = `🛍️ *طلب سلة مشتريات من متجر أوريكس*
━━━━━━━━━━━━━━
🛒 *المنتجات:*
${itemsText}

━━━━━━━━━━━━━━
💰 *الإجمالي الفرعي:* ${formatPrice(cartSubtotal)}
${discountAmount > 0 ? `🎟️ *الخصم:* -${formatPrice(discountAmount)}\n` : ''}🚚 *الشحن والتوصيل:* ${shippingFee === 0 ? 'مجاني' : formatPrice(shippingFee)}
💵 *المبلغ المطلوب للدفع:* *${formatPrice(finalTotal)}*

يرجى تزويدي برقم الحساب أو المحفظة لتحويل المبلغ وشحن الطلب.`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm">
        {/* Drawer Backdrop click */}
        <div className="flex-1" onClick={() => setIsCartOpen(false)} />

        {/* Drawer Container */}
        <div className="w-full max-w-md bg-slate-900 border-r border-slate-800 h-full flex flex-col justify-between shadow-2xl relative text-right animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900 sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">
                سلة المشتريات ({cart.length})
              </h3>
            </div>

            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-[11px] text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                >
                  تفريغ السلة
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="p-2 rounded-full bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Free Shipping Progress Indicator */}
          {storeConfig.freeShippingThreshold && (
            <div className="bg-slate-950 px-5 py-3 border-b border-slate-800 text-xs">
              {cartSubtotal >= storeConfig.freeShippingThreshold ? (
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <Truck className="w-4 h-4" />
                  <span>مبروك! لقد حصلت على توصيل مجاني لكافة المحافظات</span>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-slate-300 text-[11px]">
                    <span>
                      أضف منتجات بقيمة{' '}
                      <strong className="text-amber-400">
                        {formatPrice(storeConfig.freeShippingThreshold - cartSubtotal)}
                      </strong>{' '}
                      للحصول على شحن مجاني
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(
                          100,
                          (cartSubtotal / storeConfig.freeShippingThreshold) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="py-20 text-center space-y-3 text-slate-500">
                <ShoppingBag className="w-12 h-12 mx-auto stroke-1 text-slate-600" />
                <p className="text-sm font-bold text-slate-400">سلتك فارغة حالياً</p>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  تصفح المنتجات في المتجر وأضف ما يعجبك إلى السلة.
                </p>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 px-5 py-2 bg-amber-500 text-slate-950 text-xs font-bold rounded-xl cursor-pointer"
                >
                  تصفح المتجر الآن
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 bg-slate-950 border border-slate-800/90 rounded-2xl flex items-center gap-3.5 group relative"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-xl object-cover bg-slate-900 shrink-0"
                  />

                  <div className="flex-1 space-y-1 overflow-hidden">
                    <h4 className="text-xs font-bold text-white truncate">
                      {item.product.name}
                    </h4>

                    {item.selectedVariant && (
                      <span className="text-[10px] text-amber-400 block font-mono">
                        {item.selectedVariant.title}
                      </span>
                    )}

                    <div className="text-xs font-black text-amber-400">
                      {formatPrice(item.price)}
                    </div>
                  </div>

                  {/* Quantity & Delete */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-500 hover:text-red-400 transition-colors p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="p-1 text-slate-400 hover:text-white cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-white">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="p-1 text-slate-400 hover:text-white cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Actions */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-slate-800 bg-slate-900 space-y-4">
              {/* Coupon Form */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs">
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                    <Ticket className="w-3.5 h-3.5" />
                    <span>الكوبون ({appliedCoupon.code}) مفعل</span>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-slate-400 hover:text-red-400 text-[10px] cursor-pointer"
                  >
                    إلغاء
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="كود الخصم (مثال: ORYX10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none uppercase"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    تطبيق
                  </button>
                </form>
              )}

              {couponFeedback && !appliedCoupon && (
                <p className="text-[11px] text-red-400 text-right">{couponFeedback.message}</p>
              )}

              {/* Totals Calculation */}
              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center justify-between">
                  <span>الإجمالي الفرعي:</span>
                  <span>{formatPrice(cartSubtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex items-center justify-between text-red-400 font-bold">
                    <span>قيمة الخصم:</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-slate-400">
                  <span>رسوم التوصيل:</span>
                  <span>{shippingFee === 0 ? 'مجاني' : formatPrice(shippingFee)}</span>
                </div>
                <div className="flex items-center justify-between text-sm font-black text-white pt-2 border-t border-slate-800">
                  <span>المبلغ الإجمالي:</span>
                  <span className="text-amber-400 text-base">{formatPrice(finalTotal)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutModalOpen(true);
                  }}
                  className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>إتمام الطلب والدفع بالمحافظ</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleQuickWhatsAppCart}
                  className="w-full py-2.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 font-bold text-xs rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>إرسال السلة مباشرة عبر واتساب</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
      />
    </>
  );
};

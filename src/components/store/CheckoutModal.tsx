import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  X,
  Check,
  Copy,
  MessageCircle,
  Truck,
  CreditCard,
  Building,
  Sparkles,
  Phone,
  User,
  MapPin,
  FileText,
} from 'lucide-react';
import { YemeniWallet } from '../../types/store';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const {
    storeConfig,
    cart,
    cartSubtotal,
    discountAmount,
    formatPrice,
    addOrder,
    sendOrderViaWhatsApp,
    activeCurrency,
  } = useStore();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerCity, setCustomerCity] = useState('صنعاء');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [selectedWalletId, setSelectedWalletId] = useState<string>(
    storeConfig.yemeniWallets[0]?.id || 'cod'
  );
  const [copiedWalletId, setCopiedWalletId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  if (!isOpen) return null;

  const isFreeShipping =
    storeConfig.freeShippingThreshold && cartSubtotal >= storeConfig.freeShippingThreshold;
  const shippingFee = isFreeShipping ? 0 : storeConfig.shippingFee;
  const finalTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee);

  const selectedWallet: YemeniWallet | undefined = storeConfig.yemeniWallets.find(
    (w) => w.id === selectedWalletId
  );

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedWalletId(id);
    setTimeout(() => setCopiedWalletId(null), 2500);
  };

  const handleCompleteCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
      setFormError('يرجى كتابة الاسم ورقم الهاتف والعنوان الكامل لإتمام الطلب بنجاح');
      return;
    }
    setFormError(null);

    setIsSubmitting(true);

    const paymentMethodName =
      selectedWalletId === 'cod' ? 'الدفع عند الاستلام (COD)' : selectedWallet?.name || 'محفظة يمنية';

    const newOrder = addOrder({
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerCity,
      customerAddress: customerAddress.trim(),
      customerNotes: customerNotes.trim() || undefined,
      items: cart,
      subtotal: cartSubtotal,
      discountAmount,
      shippingFee,
      total: finalTotal,
      currency: activeCurrency,
      paymentMethod: paymentMethodName,
      paymentWalletDetails: selectedWallet,
      paymentStatus: selectedWalletId === 'cod' ? 'pending_payment' : 'paid',
      status: 'new',
      loyaltyPointsEarned: Math.round(finalTotal * (storeConfig.loyalty.pointsPerCurrencyUnit || 0.01)),
    });

    setIsSubmitting(false);
    setCompletedOrder(newOrder);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative text-right">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="space-y-0.5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-amber-400" />
              <span>إتمام الطلب والدفع بالمحافظ الإلكترونية</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              تحويل مباشر عبر بنك الكريمي، كاش، ون كاش، جيب أو الدفع عند الاستلام
            </p>
          </div>
        </div>

        {/* Order Completed Screen */}
        {completedOrder ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <Check className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-amber-400">تم تسجيل طلبك بنجاح!</span>
              <h2 className="text-2xl font-black text-white">
                رقم الطلب: #{completedOrder.orderNumber}
              </h2>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                شكراً لتسوقك من متجر أوريكس! تم تأكيد طلبك بمبلغ{' '}
                <strong className="text-amber-400">
                  {formatPrice(completedOrder.total, completedOrder.currency)}
                </strong>
                .
              </p>
            </div>

            {/* Direct WhatsApp Confirmation Button */}
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <p className="text-xs text-slate-400">
                اضغط على الزر أدناه لإرسال الفاتورة وإشعار التحويل مباشرة إلى خدمة العملاء عبر واتساب:
              </p>
              <button
                type="button"
                onClick={() => sendOrderViaWhatsApp(completedOrder)}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <MessageCircle className="w-5 h-5" />
                <span>إرسال الفاتورة وتأكيد التحويل عبر واتساب</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              العودة للمتجر
            </button>
          </div>
        ) : (
          <form onSubmit={handleCompleteCheckout} className="p-6 space-y-6">
            {formError && (
              <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs font-bold text-center animate-in fade-in">
                {formError}
              </div>
            )}

            {/* Step 1: Customer Details */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                <User className="w-3.5 h-3.5" />
                <span>١. بيانات المستلم والشحن:</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300">الاسم الثلاثي *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: محمد عبد الله الصبري"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300">رقم الهاتف / الواتساب *</label>
                  <input
                    type="tel"
                    required
                    placeholder="770000000"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300">المدينة / المحافظة *</label>
                  <select
                    value={customerCity}
                    onChange={(e) => setCustomerCity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="صنعاء">صنعاء</option>
                    <option value="عدن">عدن</option>
                    <option value="تعز">تعز</option>
                    <option value="حضرموت (المكلا/سيئون)">حضرموت (المكلا / سيئون)</option>
                    <option value="إب">إب</option>
                    <option value="الحديدة">الحديدة</option>
                    <option value="مأرب">مأرب</option>
                    <option value="ذمار">ذمار</option>
                    <option value="محافظة أخرى">محافظة أخرى</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300">العنوان بالتفصيل *</label>
                  <input
                    type="text"
                    required
                    placeholder="الشارع، الحي، أقرب معلم بارز"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300">ملاحظات التوصيل (اختياري)</label>
                <input
                  type="text"
                  placeholder="أي تعليمات إضافية لمندوب الشحن"
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Step 2: Payment Wallets Selector */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <h4 className="text-xs font-black text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Building className="w-3.5 h-3.5" />
                <span>٢. اختر طريقة الدفع أو المحفظة الرقمية:</span>
              </h4>

              <div className="space-y-2">
                {/* Digital Wallets List */}
                {storeConfig.yemeniWallets.map((wallet) => {
                  const isSelected = selectedWalletId === wallet.id;
                  const isCopied = copiedWalletId === wallet.id;

                  return (
                    <div
                      key={wallet.id}
                      onClick={() => setSelectedWalletId(wallet.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-500 shadow-md'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <input
                            type="radio"
                            name="walletChoice"
                            checked={isSelected}
                            onChange={() => setSelectedWalletId(wallet.id)}
                            className="text-amber-500 focus:ring-amber-500"
                          />
                          <strong className="text-xs text-white">{wallet.name}</strong>
                        </div>

                        {/* Copy Account Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(wallet.accountNumber, wallet.id);
                          }}
                          className="px-2.5 py-1 bg-slate-900 border border-slate-700 hover:border-amber-500 text-amber-400 text-[11px] font-bold rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                        >
                          {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{isCopied ? 'تم النسخ' : wallet.accountNumber}</span>
                        </button>
                      </div>

                      {isSelected && (
                        <div className="text-[11px] text-slate-300 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 space-y-1">
                          <div>
                            صاحب الحساب: <strong className="text-white">{wallet.accountHolder}</strong>
                          </div>
                          {wallet.instructions && (
                            <p className="text-slate-400 text-[10px]">{wallet.instructions}</p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Cash on Delivery option */}
                <div
                  onClick={() => setSelectedWalletId('cod')}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    selectedWalletId === 'cod'
                      ? 'bg-amber-500/15 border-amber-500 shadow-md'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="walletChoice"
                      checked={selectedWalletId === 'cod'}
                      onChange={() => setSelectedWalletId('cod')}
                      className="text-amber-500 focus:ring-amber-500"
                    />
                    <div>
                      <strong className="text-xs text-white">الدفع نقداً عند الاستلام (COD)</strong>
                      <span className="block text-[10px] text-slate-400">
                        تسليم المبلغ نقداً للمندوب عند استلام ومعاينة الطلب
                      </span>
                    </div>
                  </div>
                  <Truck className="w-4 h-4 text-amber-400" />
                </div>
              </div>
            </div>

            {/* Order Summary Box */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>الإجمالي الفرعي ({cart.length} منتج):</span>
                <span>{formatPrice(cartSubtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex items-center justify-between text-red-400 font-bold">
                  <span>كوبون الخصم:</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-slate-400">
                <span>رسوم التوصيل:</span>
                <span>{shippingFee === 0 ? 'مجاني' : formatPrice(shippingFee)}</span>
              </div>
              <div className="flex items-center justify-between text-sm font-black text-white pt-2 border-t border-slate-800">
                <span>المبلغ الإجمالي للدفع:</span>
                <span className="text-amber-400 text-base">{formatPrice(finalTotal)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || cart.length === 0}
              className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSubmitting ? 'جاري تأكيد الطلب...' : 'تأكيد وإتمام الطلب الآن'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

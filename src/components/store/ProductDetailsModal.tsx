import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  X,
  ShoppingBag,
  Heart,
  ArrowLeftRight,
  Star,
  Share2,
  Check,
  Truck,
  ShieldCheck,
  RotateCcw,
  MessageCircle,
  Plus,
  Minus,
  Sparkles,
} from 'lucide-react';
import { ProductVariant } from '../../types/store';

export const ProductDetailsModal: React.FC = () => {
  const {
    storeConfig,
    selectedProductId,
    setSelectedProductId,
    formatPrice,
    addToCart,
    toggleWishlist,
    isInWishlist,
    addToCompare,
    isInCompare,
    reviews,
    addReview,
  } = useStore();

  const product = storeConfig.products.find((p) => p.id === selectedProductId);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);

  // Review Form
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewLocation, setNewReviewLocation] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  if (!product) return null;

  const isFavorited = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);
  const productReviews = reviews.filter((r) => r.productId === product.id);

  // Match selected variant if exists
  const selectedVariant: ProductVariant | undefined = product.variants?.find((v) => {
    // Basic match or first variant
    return true;
  });

  const finalUnitPrice = selectedVariant?.price ?? (product.salePrice || product.basePrice);
  const hasDiscount = product.salePrice && product.salePrice < product.basePrice;
  const isOutOfStock = product.stock <= 0;

  // Related Products
  const relatedProducts = storeConfig.products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.shortDescription,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleDirectWhatsAppBuy = () => {
    const phone = storeConfig.whatsappNumber.replace(/[^0-9]/g, '');
    const optionsText = Object.entries(selectedOptions)
      .map(([k, v]) => `${k}: ${v}`)
      .join(', ');

    const text = `السلام عليكم ورحمة الله، أود شراء المنتج التالي مباشرة:
📦 *اسم المنتج:* ${product.name}
🔢 *الكمية:* ${quantity}
${optionsText ? `⚙️ *الخيارات المحددة:* ${optionsText}\n` : ''}💰 *السعر الإجمالي:* ${formatPrice(finalUnitPrice * quantity)}
🔖 *كود المنتج:* ${product.sku}

يرجى تزويدي ببيانات الدفع عبر المحافظ الإلكترونية وشحن الطلب. شكراً!`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) return;

    addReview({
      productId: product.id,
      authorName: newReviewAuthor.trim(),
      authorLocation: newReviewLocation.trim() || undefined,
      rating: newReviewRating,
      comment: newReviewComment.trim(),
      isVerifiedPurchase: true,
    });

    setReviewSubmitted(true);
    setNewReviewAuthor('');
    setNewReviewLocation('');
    setNewReviewComment('');
    setTimeout(() => setReviewSubmitted(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative text-right">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => setSelectedProductId(null)}
          className="absolute top-4 left-4 z-20 p-2.5 rounded-full bg-slate-950/80 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content Container */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Top Section: Gallery & Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Gallery (Left/Top) */}
            <div className="md:col-span-6 space-y-3">
              {/* Main Active Image */}
              <div className="w-full aspect-square bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 relative">
                <img
                  src={product.images[activeImageIndex] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.badge && (
                  <span className="absolute top-3 right-3 bg-amber-500 text-slate-950 text-xs font-black px-3 py-1 rounded-xl shadow">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                        activeImageIndex === idx
                          ? 'border-amber-500 shadow-md scale-105'
                          : 'border-slate-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Meta & Actions (Right) */}
            <div className="md:col-span-6 space-y-5 flex flex-col justify-between">
              <div className="space-y-3">
                {/* Rating & Stock */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-amber-400">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span className="font-bold text-sm">{product.rating}</span>
                    <span className="text-slate-400">({productReviews.length} تقييم)</span>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full font-bold text-xs ${
                      isOutOfStock
                        ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}
                  >
                    {isOutOfStock ? 'نفذت الكمية' : `متوفر بالمخزون (${product.stock} قطعة)`}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  {product.name}
                </h2>

                {/* SKU & Barcode */}
                <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                  <span>كود SKU: <strong className="text-slate-200">{product.sku}</strong></span>
                  <span>•</span>
                  <span>الباركود: <strong className="text-slate-200">{product.barcode}</strong></span>
                </div>

                {/* Price Display */}
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-black text-amber-400">
                      {formatPrice(finalUnitPrice)}
                    </div>
                    {hasDiscount && (
                      <div className="text-xs text-slate-500 line-through mt-0.5">
                        {formatPrice(product.basePrice)}
                      </div>
                    )}
                  </div>

                  {hasDiscount && (
                    <span className="text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-lg">
                      وفر {Math.round(((product.basePrice - product.salePrice!) / product.basePrice) * 100)}%
                    </span>
                  )}
                </div>

                {/* Options Selection */}
                {product.options && product.options.length > 0 && (
                  <div className="space-y-3 pt-2">
                    {product.options.map((opt) => (
                      <div key={opt.name} className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300">{opt.name}:</label>
                        <div className="flex flex-wrap gap-2">
                          {opt.values.map((val) => {
                            const isSelected = selectedOptions[opt.name] === val || (!selectedOptions[opt.name] && opt.values[0] === val);
                            return (
                              <button
                                key={val}
                                type="button"
                                onClick={() =>
                                  setSelectedOptions((prev) => ({ ...prev, [opt.name]: val }))
                                }
                                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow font-black'
                                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
                                }`}
                              >
                                {val}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quantity Controls */}
                <div className="flex items-center gap-3 pt-2">
                  <span className="text-xs font-bold text-slate-300">الكمية:</span>
                  <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1">
                    <button
                      type="button"
                      disabled={quantity <= 1}
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-white">{quantity}</span>
                    <button
                      type="button"
                      disabled={quantity >= product.stock}
                      onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                      className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-4 border-t border-slate-800">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Add to Cart */}
                  <button
                    type="button"
                    disabled={isOutOfStock}
                    onClick={() => {
                      addToCart(product, quantity, selectedVariant, selectedOptions);
                      setSelectedProductId(null);
                    }}
                    className="py-3.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>إضافة إلى السلة</span>
                  </button>

                  {/* Direct WhatsApp Order */}
                  <button
                    type="button"
                    onClick={handleDirectWhatsAppBuy}
                    className="py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm rounded-2xl shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>شراء فوري عبر واتساب</span>
                  </button>
                </div>

                {/* Secondary Toggles */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleWishlist(product.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                        isFavorited
                          ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-rose-400' : ''}`} />
                      <span>{isFavorited ? 'في المفضلة' : 'حفظ'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => addToCompare(product)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                        isCompared
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      <ArrowLeftRight className="w-3.5 h-3.5" />
                      <span>مقارنة</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleShare}
                    className="px-3 py-2 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'تم نسخ الرابط' : 'مشاركة'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Guarantees Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs">
            <div className="flex items-center gap-2.5 text-slate-300">
              <Truck className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <strong className="block text-white">توصيل سريع</strong>
                <span className="text-[11px] text-slate-400">لكافة المحافظات اليمنية</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5 text-slate-300">
              <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <strong className="block text-white">ضمان أصلي 100%</strong>
                <span className="text-[11px] text-slate-400">منتجات أصلية معتمدة</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5 text-slate-300">
              <RotateCcw className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <strong className="block text-white">دفع بالمحافظ اليمنية</strong>
                <span className="text-[11px] text-slate-400">الكريمي، كاش، ون كاش، جيب</span>
              </div>
            </div>
          </div>

          {/* Full Description & Specs */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-base font-bold text-white">وصف ومواصفات المنتج:</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {product.fullDescription}
            </p>

            {product.specs && product.specs.length > 0 && (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-xs text-right">
                  <tbody>
                    {product.specs.map((spec, i) => (
                      <tr
                        key={i}
                        className={i % 2 === 0 ? 'bg-slate-900/40' : 'bg-slate-950'}
                      >
                        <td className="py-2.5 px-4 font-bold text-slate-400 w-1/3 border-b border-slate-800/60">
                          {spec.label}
                        </td>
                        <td className="py-2.5 px-4 text-white border-b border-slate-800/60 font-medium">
                          {spec.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Customer Reviews Section */}
          <div className="space-y-5 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>تقييمات وتجارب العملاء ({productReviews.length})</span>
              </h3>
            </div>

            {/* Reviews List */}
            <div className="space-y-3">
              {productReviews.length === 0 ? (
                <p className="text-xs text-slate-400 bg-slate-950 p-4 rounded-2xl text-center">
                  كن أول من يقيم هذا المنتج ويشارك تجربته!
                </p>
              ) : (
                productReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 bg-slate-950 border border-slate-800/80 rounded-2xl space-y-2 text-right"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <strong className="text-xs text-white">{rev.authorName}</strong>
                        {rev.authorLocation && (
                          <span className="text-[10px] text-slate-500">({rev.authorLocation})</span>
                        )}
                        {rev.isVerifiedPurchase && (
                          <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                            مشتري معتمد ✓
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < rev.rating ? 'fill-amber-400' : 'text-slate-700'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>
                    <span className="text-[10px] text-slate-500 block font-mono">{rev.date}</span>
                  </div>
                ))
              )}
            </div>

            {/* Add Review Form */}
            <form onSubmit={handleSubmitReview} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>أضف تقييمك للمنتج:</span>
              </h4>

              {reviewSubmitted ? (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-400 font-bold text-center">
                  شكراً لك! تم تسجيل تقييمك بنجاح.
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="اسمك الكريم *"
                      value={newReviewAuthor}
                      onChange={(e) => setNewReviewAuthor(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="المدينة (مثلاً: صنعاء، عدن، تعز)"
                      value={newReviewLocation}
                      onChange={(e) => setNewReviewLocation(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">التقييم:</span>
                    <div className="flex items-center gap-1 text-amber-400 cursor-pointer">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReviewRating(star)}
                          className="p-1"
                        >
                          <Star
                            className={`w-4 h-4 ${
                              star <= newReviewRating ? 'fill-amber-400' : 'text-slate-700'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    required
                    rows={2}
                    placeholder="اكتب رأيك وتجربتك مع المنتج..."
                    value={newReviewComment}
                    onChange={(e) => setNewReviewComment(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                  />

                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl transition-all cursor-pointer"
                  >
                    نشر التقييم
                  </button>
                </>
              )}
            </form>
          </div>

          {/* Related Products Section */}
          {relatedProducts.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <h3 className="text-base font-bold text-white">قد يعجبك أيضاً:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedProducts.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => {
                      setSelectedProductId(rel.id);
                      setActiveImageIndex(0);
                    }}
                    className="bg-slate-950 border border-slate-800 hover:border-amber-500/50 p-3 rounded-2xl flex items-center gap-3 cursor-pointer group transition-all"
                  >
                    <img
                      src={rel.images[0]}
                      alt={rel.name}
                      className="w-14 h-14 rounded-xl object-cover shrink-0"
                    />
                    <div className="space-y-1 overflow-hidden">
                      <h4 className="text-xs font-bold text-white group-hover:text-amber-300 truncate">
                        {rel.name}
                      </h4>
                      <div className="text-xs font-black text-amber-400">
                        {formatPrice(rel.salePrice || rel.basePrice)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

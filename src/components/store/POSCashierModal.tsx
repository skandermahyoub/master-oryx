import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  X,
  ScanBarcode,
  Search,
  Plus,
  Minus,
  Trash2,
  Printer,
  Check,
  Camera,
  CameraOff,
  DollarSign,
  TrendingUp,
  User,
  ShoppingBag,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { ProductItem, CartItem } from '../../types/store';

export const POSCashierModal: React.FC = () => {
  const {
    isPOSOpen,
    setIsPOSOpen,
    storeConfig,
    formatPrice,
    addOrder,
    activeCurrency,
  } = useStore();

  const [barcodeInput, setBarcodeInput] = useState('');
  const [posCart, setPosCart] = useState<CartItem[]>([]);
  const [cashierName, setCashierName] = useState('كاشير - أوريكس الفرع الرئيسي');
  const [customerName, setCustomerName] = useState('عميل نقدي سريع');
  const [customerPhone, setCustomerPhone] = useState('770000000');
  const [paymentMethod, setPaymentMethod] = useState('نقداً (كاش)');
  const [discountValue, setDiscountValue] = useState(0);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [recentCompletedOrder, setRecentCompletedOrder] = useState<any | null>(null);
  const [posFeedback, setPosFeedback] = useState<{ message: string; type: 'error' | 'success' } | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const barcodeInputRef = useRef<HTMLInputElement | null>(null);

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
      setPosFeedback(null);
    } catch (err) {
      setPosFeedback({
        message: 'تعذر تشغيل الكاميرا تلقائياً، يمكنك إدخال الباركود أو اسم المنتج يدوياً.',
        type: 'error',
      });
    }
  };

  useEffect(() => {
    if (isPOSOpen) {
      setTimeout(() => barcodeInputRef.current?.focus(), 150);
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isPOSOpen]);

  if (!isPOSOpen) return null;

  // Add product by barcode or ID
  const handleAddByBarcode = (query: string) => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return;

    const matched = storeConfig.products.find(
      (p) =>
        p.barcode.toLowerCase() === trimmed ||
        p.sku.toLowerCase() === trimmed ||
        p.name.toLowerCase().includes(trimmed)
    );

    if (matched) {
      addToPOSCart(matched);
      setBarcodeInput('');
      setPosFeedback({
        message: `تمت إضافة "${matched.name}" إلى سلة الكاشير بنجاح`,
        type: 'success',
      });
      setTimeout(() => setPosFeedback(null), 3000);
    } else {
      setPosFeedback({
        message: `لم يتم العثور على أي منتج يطابق الكود: "${query}"`,
        type: 'error',
      });
      setTimeout(() => setPosFeedback(null), 4000);
    }
  };

  const addToPOSCart = (product: ProductItem) => {
    const cartItemId = `pos-${product.id}`;
    const unitPrice = product.salePrice || product.basePrice;

    setPosCart((prev) => {
      const exists = prev.find((item) => item.id === cartItemId);
      if (exists) {
        return prev.map((item) =>
          item.id === cartItemId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: cartItemId,
          productId: product.id,
          product,
          quantity: 1,
          price: unitPrice,
        },
      ];
    });
  };

  const updatePOSQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      setPosCart((prev) => prev.filter((i) => i.id !== cartItemId));
    } else {
      setPosCart((prev) =>
        prev.map((item) => (item.id === cartItemId ? { ...item, quantity } : item))
      );
    }
  };

  // Calculations
  const posSubtotal = posCart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const posTotalCost = posCart.reduce((sum, i) => sum + (i.product.costPrice || 0) * i.quantity, 0);
  const posFinalTotal = Math.max(0, posSubtotal - discountValue);
  const posNetProfit = Math.max(0, posFinalTotal - posTotalCost);

  // Complete POS Sale
  const handleCompleteSale = () => {
    if (posCart.length === 0) return;

    const order = addOrder({
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerCity: 'مبيعات الكاشير المباشرة',
      customerAddress: 'نقطة بيع الفرع',
      items: posCart,
      subtotal: posSubtotal,
      discountAmount: discountValue,
      shippingFee: 0,
      total: posFinalTotal,
      currency: activeCurrency,
      paymentMethod,
      paymentStatus: 'paid',
      status: 'completed',
      posCashierName: cashierName,
      isPOSOrder: true,
    });

    setRecentCompletedOrder(order);
    setPosCart([]);
    setDiscountValue(0);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-5xl w-full max-h-[95vh] overflow-y-auto shadow-2xl relative text-right flex flex-col justify-between">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl">
              <ScanBarcode className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                نظام الكاشير والمبيعات السريعة (Oryx POS System)
              </h3>
              <p className="text-[11px] text-slate-400">
                مسح الباركود بالكاميرا وإصدار فواتير حرارية وطباعة فورية
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              stopCamera();
              setIsPOSOpen(false);
            }}
            className="p-2.5 rounded-full bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Alert Bar */}
        {posFeedback && (
          <div
            className={`px-4 py-2.5 text-xs font-bold text-center border-b ${
              posFeedback.type === 'error'
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
            }`}
          >
            {posFeedback.message}
          </div>
        )}

        {/* Invoice Receipt View if order just completed */}
        {recentCompletedOrder ? (
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-black text-white">تمت العملية وطباعة الفاتورة</h2>
              <p className="text-xs text-slate-400">
                رقم الفاتورة: #{recentCompletedOrder.orderNumber} • المبلغ:{' '}
                <strong className="text-amber-400">
                  {formatPrice(recentCompletedOrder.total, recentCompletedOrder.currency)}
                </strong>
              </p>
            </div>

            {/* Printable Thermal Receipt Box */}
            <div className="bg-white text-slate-950 p-6 rounded-2xl max-w-sm mx-auto font-mono text-xs text-right space-y-3 shadow-2xl border border-slate-300">
              <div className="text-center space-y-1 border-b pb-3">
                <h4 className="font-black text-sm">{storeConfig.storeName}</h4>
                <p className="text-[10px] text-slate-600">فاتورة مبيعات نقدية معتمدة</p>
                <div className="text-[10px] text-slate-600">
                  #{recentCompletedOrder.orderNumber} | {recentCompletedOrder.createdAt}
                </div>
              </div>

              <div className="space-y-1 border-b pb-2">
                <div>العميل: {recentCompletedOrder.customerName}</div>
                <div>الكاشير: {recentCompletedOrder.posCashierName}</div>
                <div>طريقة الدفع: {recentCompletedOrder.paymentMethod}</div>
              </div>

              <div className="space-y-1.5 border-b pb-2">
                {recentCompletedOrder.items.map((it: any, idx: number) => (
                  <div key={idx} className="flex justify-between">
                    <span>
                      {it.quantity}x {it.product.name.slice(0, 20)}...
                    </span>
                    <span className="font-bold">
                      {formatPrice(it.price * it.quantity, recentCompletedOrder.currency)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-1 pt-1 font-bold">
                <div className="flex justify-between">
                  <span>الإجمالي:</span>
                  <span>
                    {formatPrice(recentCompletedOrder.subtotal, recentCompletedOrder.currency)}
                  </span>
                </div>
                {recentCompletedOrder.discountAmount > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>الخصم:</span>
                    <span>
                      -{formatPrice(recentCompletedOrder.discountAmount, recentCompletedOrder.currency)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm pt-1 border-t">
                  <span>الصافي المدفوع:</span>
                  <span>{formatPrice(recentCompletedOrder.total, recentCompletedOrder.currency)}</span>
                </div>
              </div>

              <div className="text-center pt-2 text-[10px] text-slate-500 border-t">
                شكراً لزيارتكم • البضاعة المباعة ترد وتستبدل خلال 3 أيام
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={handlePrintReceipt}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-lg"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة الفاتورة الآن (Print)</span>
              </button>

              <button
                type="button"
                onClick={() => setRecentCompletedOrder(null)}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                عملية بيع جديدة
              </button>
            </div>
          </div>
        ) : (
          /* POS Main Layout */
          <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left/Middle Column: Scanner & Fast Catalog */}
            <div className="lg:col-span-7 space-y-4">
              {/* Barcode & Search Input Bar */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      ref={barcodeInputRef}
                      type="text"
                      value={barcodeInput}
                      onChange={(e) => setBarcodeInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddByBarcode(barcodeInput);
                        }
                      }}
                      placeholder="امسح الباركود بجهاز المسح أو اكتب الكود..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 pr-10 pl-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                    <ScanBarcode className="w-4 h-4 text-amber-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddByBarcode(barcodeInput)}
                    className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition-all cursor-pointer shrink-0"
                  >
                    إضافة
                  </button>

                  <button
                    type="button"
                    onClick={isCameraActive ? stopCamera : startCamera}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer shrink-0 ${
                      isCameraActive
                        ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                        : 'bg-slate-900 text-amber-400 border-slate-700 hover:bg-slate-800'
                    }`}
                    title="كاميرا مسح الباركود"
                  >
                    {isCameraActive ? <CameraOff className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
                  </button>
                </div>

                {/* Camera Live Video Box */}
                {isCameraActive && (
                  <div className="relative rounded-2xl overflow-hidden bg-black aspect-video border border-amber-500/50">
                    <video ref={videoRef} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 border-2 border-dashed border-amber-400/70 m-8 rounded-2xl pointer-events-none animate-pulse flex items-center justify-center">
                      <span className="bg-slate-950/80 text-amber-300 text-[10px] px-3 py-1 rounded-full">
                        وجه الكاميرا نحو باركود المنتج
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Products Grid */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400">انقر على المنتج لإضافته فورياً:</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-80 overflow-y-auto p-1">
                  {storeConfig.products.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => addToPOSCart(p)}
                      className="p-2.5 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/50 rounded-xl flex items-center gap-2 cursor-pointer transition-all group"
                    >
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-10 h-10 rounded-lg object-cover bg-slate-900 shrink-0"
                      />
                      <div className="space-y-0.5 overflow-hidden text-right flex-1">
                        <h5 className="text-[11px] font-bold text-white group-hover:text-amber-300 truncate">
                          {p.name}
                        </h5>
                        <div className="text-[10px] font-black text-amber-400">
                          {formatPrice(p.salePrice || p.basePrice)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cashier Session Profit Margin Badge */}
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <TrendingUp className="w-4 h-4" />
                  <span>هامش الربح التقديري للفاتورة الحالية:</span>
                </div>
                <strong className="text-emerald-400 font-mono text-sm">
                  +{formatPrice(posNetProfit)}
                </strong>
              </div>
            </div>

            {/* Right Column: Invoice Cart & Checkout Details */}
            <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                    <span>محتويات الفاتورة ({posCart.length})</span>
                  </h4>
                  {posCart.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setPosCart([])}
                      className="text-[10px] text-red-400 hover:underline cursor-pointer"
                    >
                      تفريغ
                    </button>
                  )}
                </div>

                {/* Items */}
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {posCart.length === 0 ? (
                    <div className="py-12 text-center text-xs text-slate-500">
                      امسح الباركود أو اختر منتجاً لبدء الفاتورة
                    </div>
                  ) : (
                    posCart.map((item) => (
                      <div
                        key={item.id}
                        className="p-2 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between text-xs"
                      >
                        <div className="overflow-hidden flex-1 pl-2">
                          <strong className="block text-white truncate text-[11px]">
                            {item.product.name}
                          </strong>
                          <span className="text-[10px] text-amber-400 font-mono">
                            {formatPrice(item.price)} × {item.quantity}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => updatePOSQuantity(item.id, item.quantity - 1)}
                            className="p-1 bg-slate-800 text-slate-300 rounded hover:text-white"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-5 text-center font-bold text-white text-[11px]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updatePOSQuantity(item.id, item.quantity + 1)}
                            className="p-1 bg-slate-800 text-slate-300 rounded hover:text-white"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Customer & Payment Selectors */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="اسم العميل"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded-xl p-2 text-[11px] text-white focus:outline-none"
                    />
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded-xl p-2 text-[11px] text-white focus:outline-none"
                    >
                      <option value="نقداً (كاش)">نقداً (كاش)</option>
                      <option value="محفظة الكريمي">محفظة الكريمي</option>
                      <option value="محفظة كاش">محفظة كاش</option>
                      <option value="محفظة ون كاش">محفظة ون كاش</option>
                      <option value="محفظة جيب">محفظة جيب</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 shrink-0">خصم يدوي:</span>
                    <input
                      type="number"
                      min={0}
                      value={discountValue}
                      onChange={(e) => setDiscountValue(Number(e.target.value))}
                      className="bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white w-full focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Totals & Confirm Button */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <div className="space-y-1 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span>الإجمالي الفرعي:</span>
                    <span>{formatPrice(posSubtotal)}</span>
                  </div>
                  {discountValue > 0 && (
                    <div className="flex justify-between text-red-400">
                      <span>الخصم:</span>
                      <span>-{formatPrice(discountValue)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-black text-white pt-1 border-t border-slate-800">
                    <span>المبلغ المطلوب:</span>
                    <span className="text-amber-400 text-base">{formatPrice(posFinalTotal)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={posCart.length === 0}
                  onClick={handleCompleteSale}
                  className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Check className="w-4 h-4" />
                  <span>إتمام البيع وحفظ الفاتورة</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

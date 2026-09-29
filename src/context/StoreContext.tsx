import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  StoreConfig,
  ProductItem,
  CartItem,
  StoreOrder,
  ProductReview,
  CurrencyCode,
  ProductVariant,
  YemeniWallet,
  CouponItem,
} from '../types/store';
import { defaultStoreConfig, sampleReviews, sampleOrders } from '../data/defaultStoreData';

interface StoreContextType {
  storeConfig: StoreConfig;
  updateStoreConfig: (newConfig: Partial<StoreConfig>) => void;
  // Currency
  activeCurrency: CurrencyCode;
  setActiveCurrency: (curr: CurrencyCode) => void;
  formatPrice: (amountInBaseCurrency: number, targetCurr?: CurrencyCode) => string;
  convertPrice: (amountInBaseCurrency: number, targetCurr?: CurrencyCode) => number;
  // Cart
  cart: CartItem[];
  addToCart: (product: ProductItem, quantity?: number, variant?: ProductVariant, options?: Record<string, string>) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  // Wishlist
  wishlist: string[]; // Product IDs
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  // Compare
  compareList: ProductItem[];
  addToCompare: (product: ProductItem) => void;
  removeFromCompare: (productId: string) => void;
  isInCompare: (productId: string) => boolean;
  clearCompare: () => void;
  // Modals & Active Views
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  isCompareOpen: boolean;
  setIsCompareOpen: (open: boolean) => void;
  isPOSOpen: boolean;
  setIsPOSOpen: (open: boolean) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  // Orders & Reviews
  orders: StoreOrder[];
  addOrder: (orderData: Omit<StoreOrder, 'id' | 'orderNumber' | 'createdAt'>) => StoreOrder;
  updateOrderStatus: (orderId: string, status: StoreOrder['status'], paymentStatus?: StoreOrder['paymentStatus']) => void;
  reviews: ProductReview[];
  addReview: (review: Omit<ProductReview, 'id' | 'date'>) => void;
  // Coupons
  appliedCoupon: CouponItem | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  discountAmount: number;
  // Dispatch WhatsApp Order
  sendOrderViaWhatsApp: (order: StoreOrder) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial config from LocalStorage if exists
  const [storeConfig, setStoreConfig] = useState<StoreConfig>(() => {
    try {
      const saved = localStorage.getItem('oryx_store_config');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return defaultStoreConfig;
  });

  const [activeCurrency, setActiveCurrency] = useState<CurrencyCode>(storeConfig.defaultCurrency || 'YER');
  
  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('oryx_store_cart');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('oryx_store_wishlist');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // Compare
  const [compareList, setCompareList] = useState<ProductItem[]>([]);

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isPOSOpen, setIsPOSOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // Orders & Reviews
  const [orders, setOrders] = useState<StoreOrder[]>(() => {
    try {
      const saved = localStorage.getItem('oryx_store_orders');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return sampleOrders;
  });

  const [reviews, setReviews] = useState<ProductReview[]>(() => {
    try {
      const saved = localStorage.getItem('oryx_store_reviews');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return sampleReviews;
  });

  // Coupons
  const [appliedCoupon, setAppliedCoupon] = useState<CouponItem | null>(null);

  // Persist storeConfig
  useEffect(() => {
    localStorage.setItem('oryx_store_config', JSON.stringify(storeConfig));
  }, [storeConfig]);

  // Persist Cart
  useEffect(() => {
    localStorage.setItem('oryx_store_cart', JSON.stringify(cart));
  }, [cart]);

  // Persist Wishlist
  useEffect(() => {
    localStorage.setItem('oryx_store_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Persist Orders
  useEffect(() => {
    localStorage.setItem('oryx_store_orders', JSON.stringify(orders));
  }, [orders]);

  // Persist Reviews
  useEffect(() => {
    localStorage.setItem('oryx_store_reviews', JSON.stringify(reviews));
  }, [reviews]);

  const updateStoreConfig = (newConfig: Partial<StoreConfig>) => {
    setStoreConfig((prev) => ({ ...prev, ...newConfig }));
  };

  // Price conversion based on default base currency (YER)
  const convertPrice = (amountInBase: number, targetCurr: CurrencyCode = activeCurrency): number => {
    const baseCurrConfig = storeConfig.currencies.find((c) => c.code === (storeConfig.defaultCurrency || 'YER')) || { rateAgainstUSD: 530 };
    const targetCurrConfig = storeConfig.currencies.find((c) => c.code === targetCurr) || { rateAgainstUSD: 530 };

    if (storeConfig.defaultCurrency === targetCurr) return amountInBase;
    
    // Convert base -> USD -> target
    const amountInUSD = amountInBase / (baseCurrConfig.rateAgainstUSD || 1);
    return Math.round(amountInUSD * (targetCurrConfig.rateAgainstUSD || 1));
  };

  const formatPrice = (amountInBase: number, targetCurr: CurrencyCode = activeCurrency): string => {
    const converted = convertPrice(amountInBase, targetCurr);
    const currConfig = storeConfig.currencies.find((c) => c.code === targetCurr) || { symbol: 'ر.ي' };
    return `${converted.toLocaleString('ar-YE')} ${currConfig.symbol}`;
  };

  // Cart Functions
  const addToCart = (
    product: ProductItem,
    quantity: number = 1,
    variant?: ProductVariant,
    options?: Record<string, string>
  ) => {
    const unitPrice = variant?.price ?? (product.salePrice || product.basePrice);
    const cartItemId = `${product.id}-${variant?.id || 'default'}-${JSON.stringify(options || {})}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.id === cartItemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          id: cartItemId,
          productId: product.id,
          product,
          selectedVariant: variant,
          selectedOptions: options,
          quantity,
          price: unitPrice,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Discount Calculation
  const discountAmount = appliedCoupon
    ? appliedCoupon.discountType === 'percentage'
      ? Math.round((cartSubtotal * appliedCoupon.discountValue) / 100)
      : appliedCoupon.discountValue
    : 0;

  const applyCoupon = (code: string): { success: boolean; message: string } => {
    const trimmed = code.trim().toUpperCase();
    const coupon = storeConfig.coupons.find((c) => c.code.toUpperCase() === trimmed && c.isActive);
    if (!coupon) {
      return { success: false, message: 'كوبون الخصم غير صحيح أو منتهي الصلاحية' };
    }
    if (coupon.minOrderAmount && cartSubtotal < coupon.minOrderAmount) {
      return {
        success: false,
        message: `الحد الأدنى لتطبيق هذا الكوبون هو ${formatPrice(coupon.minOrderAmount)}`,
      };
    }
    setAppliedCoupon(coupon);
    return { success: true, message: `تم تفعيل خصم ${coupon.discountValue}${coupon.discountType === 'percentage' ? '%' : ' ' + (storeConfig.defaultCurrency || 'YER')} بنجاح!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Compare
  const addToCompare = (product: ProductItem) => {
    if (compareList.length >= 4) {
      alert('يمكنك مقارنة حتى 4 منتجات كحد أقصى في نفس الوقت');
      return;
    }
    if (!compareList.some((p) => p.id === product.id)) {
      setCompareList((prev) => [...prev, product]);
      setIsCompareOpen(true);
    }
  };

  const removeFromCompare = (productId: string) => {
    setCompareList((prev) => prev.filter((p) => p.id !== productId));
  };

  const isInCompare = (productId: string) => compareList.some((p) => p.id === productId);

  const clearCompare = () => setCompareList([]);

  // Orders
  const addOrder = (orderData: Omit<StoreOrder, 'id' | 'orderNumber' | 'createdAt'>): StoreOrder => {
    const orderNumber = `ORYX-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: StoreOrder = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: new Date().toLocaleString('ar-YE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    const updated = [newOrder, ...orders];
    setOrders(updated);

    // Reduce product stocks
    const updatedProducts = storeConfig.products.map((p) => {
      const orderItem = orderData.items.find((item) => item.productId === p.id);
      if (orderItem) {
        return { ...p, stock: Math.max(0, p.stock - orderItem.quantity) };
      }
      return p;
    });
    updateStoreConfig({ products: updatedProducts });

    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (
    orderId: string,
    status: StoreOrder['status'],
    paymentStatus?: StoreOrder['paymentStatus']
  ) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? {
              ...ord,
              status,
              ...(paymentStatus ? { paymentStatus } : {}),
            }
          : ord
      )
    );
  };

  // Reviews
  const addReview = (reviewData: Omit<ProductReview, 'id' | 'date'>) => {
    const newRev: ProductReview = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    const updated = [newRev, ...reviews];
    setReviews(updated);

    // Update Product review count & average rating
    const productReviews = updated.filter((r) => r.productId === reviewData.productId);
    const avgRating =
      productReviews.reduce((sum, r) => sum + r.rating, 0) / (productReviews.length || 1);

    const updatedProducts = storeConfig.products.map((p) =>
      p.id === reviewData.productId
        ? { ...p, rating: Number(avgRating.toFixed(1)), reviewCount: productReviews.length }
        : p
    );
    updateStoreConfig({ products: updatedProducts });
  };

  // Dispatch WhatsApp Order
  const sendOrderViaWhatsApp = (order: StoreOrder) => {
    const phone = storeConfig.whatsappNumber.replace(/[^0-9]/g, '');
    const itemsText = order.items
      .map(
        (i, idx) =>
          `🔹 *[${idx + 1}]* ${i.product.name} ${
            i.selectedVariant ? `(${i.selectedVariant.title})` : ''
          }\n    الكمية: ${i.quantity} × ${formatPrice(i.price, order.currency)}`
      )
      .join('\n\n');

    const walletInfo = order.paymentWalletDetails
      ? `💳 *طريقة الدفع:* ${order.paymentWalletDetails.name}\n    رقم الحساب/المحفظة: ${order.paymentWalletDetails.accountNumber} (${order.paymentWalletDetails.accountHolder})`
      : `💳 *طريقة الدفع:* ${order.paymentMethod}`;

    const text = `🛍️ *طلب شراء جديد من متجر أوريكس*
━━━━━━━━━━━━━━
🔖 *رقم الطلب:* #${order.orderNumber}
📅 *التاريخ:* ${order.createdAt}

👤 *بيانات العميل:*
• الاسم: ${order.customerName}
• الهاتف: ${order.customerPhone}
• المدينة/العنوان: ${order.customerCity} - ${order.customerAddress}
${order.customerNotes ? `• ملاحظات: ${order.customerNotes}\n` : ''}
🛒 *المنتجات المطلوبة:*
${itemsText}

━━━━━━━━━━━━━━
💰 *الإجمالي الفرعي:* ${formatPrice(order.subtotal, order.currency)}
${order.discountAmount > 0 ? `🎟️ *الخصم:* -${formatPrice(order.discountAmount, order.currency)}\n` : ''}🚚 *الشحن والتوصيل:* ${order.shippingFee === 0 ? 'مجاني' : formatPrice(order.shippingFee, order.currency)}
💵 *المبلغ الإجمالي المستحق:* *${formatPrice(order.total, order.currency)}*

${walletInfo}
━━━━━━━━━━━━━━
⚡ *يرجى تأكيد تجهيز وإرسال الطلب، شكراً لكم!*`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <StoreContext.Provider
      value={{
        storeConfig,
        updateStoreConfig,
        activeCurrency,
        setActiveCurrency,
        formatPrice,
        convertPrice,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        wishlist,
        toggleWishlist,
        isInWishlist,
        compareList,
        addToCompare,
        removeFromCompare,
        isInCompare,
        clearCompare,
        isCartOpen,
        setIsCartOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        isCompareOpen,
        setIsCompareOpen,
        isPOSOpen,
        setIsPOSOpen,
        selectedProductId,
        setSelectedProductId,
        orders,
        addOrder,
        updateOrderStatus,
        reviews,
        addReview,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        discountAmount,
        sendOrderViaWhatsApp,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

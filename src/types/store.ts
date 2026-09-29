export type CurrencyCode = 'YER' | 'SAR' | 'USD';

export interface CurrencyConfig {
  code: CurrencyCode;
  name: string;
  symbol: string;
  rateAgainstUSD: number; // 1 USD = X Currency (e.g., 530 YER, 3.75 SAR, 1 USD)
}

export interface ProductVariantOption {
  name: string; // e.g. 'Color' or 'Size' or 'Storage'
  values: string[]; // e.g. ['256GB', '512GB', '1TB']
}

export interface ProductVariant {
  id: string;
  title: string; // e.g. 'أسود / 256GB'
  sku: string;
  barcode: string;
  price: number;
  costPrice: number;
  salePrice?: number;
  stock: number;
  image?: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  authorName: string;
  authorLocation?: string;
  rating: number; // 1-5
  comment: string;
  date: string;
  isVerifiedPurchase?: boolean;
}

export interface ProductItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  tags: string[];
  shortDescription: string;
  fullDescription: string;
  sku: string;
  barcode: string;
  basePrice: number;
  costPrice: number; // For accounting & profit calculations
  salePrice?: number; // Discounted price
  currency: CurrencyCode;
  stock: number;
  isFeatured?: boolean;
  badge?: string; // e.g. 'الأكثر مبيعاً', 'جديد', 'خصم 20%'
  images: string[];
  options?: ProductVariantOption[];
  variants?: ProductVariant[];
  specs?: { label: string; value: string }[];
  rating: number;
  reviewCount: number;
  createdAt: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  imageUrl?: string;
  description?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  product: ProductItem;
  selectedVariant?: ProductVariant;
  selectedOptions?: Record<string, string>;
  quantity: number;
  price: number; // Final price per unit
}

export interface YemeniWallet {
  id: string;
  name: string; // e.g. بنك الكريمي (حساب)، محفظة كاش، محفظة ون كاش
  shortCode: string; // e.g. 'kuraimi', 'cash', 'onecash', 'jeeb', 'floosak'
  accountNumber: string; // رقم الحساب أو المحفظة
  accountHolder: string; // اسم صاحب الحساب
  instructions?: string;
  icon?: string;
  isActive: boolean;
}

export interface CouponItem {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount?: number;
  expiresAt?: string;
  usageCount: number;
  isActive: boolean;
}

export interface StoreOrder {
  id: string;
  orderNumber: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  customerCity: string;
  customerAddress: string;
  customerNotes?: string;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  total: number;
  currency: CurrencyCode;
  paymentMethod: string; // Wallet name or 'COD'
  paymentWalletDetails?: YemeniWallet;
  paymentStatus: 'pending_payment' | 'paid' | 'verified';
  status: 'new' | 'processing' | 'shipped' | 'completed' | 'cancelled';
  transferReceiptImage?: string;
  loyaltyPointsEarned?: number;
  posCashierName?: string;
  isPOSOrder?: boolean;
}

export type StoreHomeLayout = 'carousel' | 'single' | 'two_cards' | 'grid';

export interface LoyaltyMember {
  id: string;
  name: string;
  phone: string;
  city: string;
  points: number;
  tier: 'bronze' | 'silver' | 'gold' | 'diamond';
  totalSpent: number;
  ordersCount: number;
  lastOrderDate: string;
}

export interface LoyaltyConfig {
  isEnabled: boolean;
  pointsPerCurrencyUnit: number; // e.g. 1 point for every 1000 YER or 1 USD
  pointValueInCurrency: number; // e.g. 100 points = 1 USD discount
  bronzeTierMinPoints: number;
  silverTierMinPoints: number;
  goldTierMinPoints: number;
  diamondTierMinPoints: number;
  members?: LoyaltyMember[];
}

export interface StoreConfig {
  isEnabled: boolean;
  homeLayout?: StoreHomeLayout; // 'carousel' | 'single' | 'two_cards' | 'grid'
  homeMaxProducts?: number;
  storeName: string;
  storeSubtitle: string;
  whatsappNumber: string; // e.g. '967770000000'
  defaultCurrency: CurrencyCode;
  currencies: CurrencyConfig[];
  shippingFee: number;
  freeShippingThreshold?: number;
  heroBannerTitle: string;
  heroBannerSubtitle: string;
  heroBannerImage: string;
  enableReviews: boolean;
  enableCompare: boolean;
  enableWishlist: boolean;
  enablePOSBarcodeScanner: boolean;
  enableWhatsAppCheckout: boolean;
  yemeniWallets: YemeniWallet[];
  categories: ProductCategory[];
  products: ProductItem[];
  coupons: CouponItem[];
  loyalty: LoyaltyConfig;
}

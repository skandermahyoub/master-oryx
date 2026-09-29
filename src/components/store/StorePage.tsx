import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './ProductCard';
import {
  ShoppingBag,
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Heart,
  ArrowLeftRight,
  ScanBarcode,
  ArrowRight,
  Filter,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { CurrencyCode } from '../../types/store';

interface StorePageProps {
  onBackToHome: () => void;
}

export const StorePage: React.FC<StorePageProps> = ({ onBackToHome }) => {
  const {
    storeConfig,
    activeCurrency,
    setActiveCurrency,
    cartCount,
    wishlist,
    compareList,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsCompareOpen,
    setIsPOSOpen,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'rating' | 'newest'>('featured');
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [onlyInStock, setOnlyInStock] = useState(false);

  const categories = storeConfig.categories || [];
  const products = storeConfig.products || [];

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
        const matchesSearch =
          !searchQuery.trim() ||
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.barcode.includes(searchQuery.trim()) ||
          p.sku.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStock = !onlyInStock || p.stock > 0;
        return matchesCategory && matchesSearch && matchesStock;
      })
      .sort((a, b) => {
        const priceA = a.salePrice || a.basePrice;
        const priceB = b.salePrice || b.basePrice;
        if (sortBy === 'price_asc') return priceA - priceB;
        if (sortBy === 'price_desc') return priceB - priceA;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [products, selectedCategory, searchQuery, sortBy, onlyInStock]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-28">
      {/* Top Header Bar for Store */}
      <div className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBackToHome}
            className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-300 hover:text-amber-400 transition-colors cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة للرئيسية</span>
          </button>

          {/* Quick Actions & Currency Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Currency Selector */}
            <div className="relative">
              <select
                value={activeCurrency}
                onChange={(e) => setActiveCurrency(e.target.value as CurrencyCode)}
                className="appearance-none bg-slate-950 border border-slate-700 text-amber-400 text-xs font-bold px-3 py-2 pl-7 rounded-xl focus:outline-none cursor-pointer"
              >
                {storeConfig.currencies.map((curr) => (
                  <option key={curr.code} value={curr.code}>
                    {curr.code} - {curr.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-amber-400 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* POS Cashier Quick Trigger */}
            {storeConfig.enablePOSBarcodeScanner && (
              <button
                type="button"
                onClick={() => setIsPOSOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-slate-950 border border-amber-500/40 hover:border-amber-400 text-amber-400 text-xs font-bold rounded-xl transition-all cursor-pointer shadow"
                title="نظام الكاشير والباركود"
              >
                <ScanBarcode className="w-4 h-4" />
                <span>الكاشير (POS)</span>
              </button>
            )}

            {/* Compare */}
            {storeConfig.enableCompare && (
              <button
                type="button"
                onClick={() => setIsCompareOpen(true)}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 relative transition-all cursor-pointer"
                title="مقارنة المنتجات"
              >
                <ArrowLeftRight className="w-4 h-4" />
                {compareList.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-slate-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {compareList.length}
                  </span>
                )}
              </button>
            )}

            {/* Wishlist */}
            {storeConfig.enableWishlist && (
              <button
                type="button"
                onClick={() => setIsWishlistOpen(true)}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 relative transition-all cursor-pointer"
                title="المفضلة"
              >
                <Heart className="w-4 h-4" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </button>
            )}

            {/* Cart Trigger */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>السلة ({cartCount})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner Hero */}
        <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 p-6 sm:p-10 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-l from-amber-500/10 via-slate-950/80 to-slate-950 z-10" />
          <img
            src={storeConfig.heroBannerImage}
            alt="Store Banner"
            className="absolute inset-0 w-full h-full object-cover opacity-25"
          />

          <div className="relative z-20 space-y-3 max-w-2xl text-right">
            <span className="inline-block px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold rounded-full">
              متجر أوريكس الإلكتروني • دفع بالمحافظ اليمنية وشحن فوري
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              {storeConfig.storeName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {storeConfig.storeSubtitle}
            </p>
          </div>
        </div>

        {/* Search, Filters, & Controls Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 space-y-4 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث بالاسم، الكود، الباركود، أو المواصفات..."
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3 pr-10 pl-4 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>

            {/* Sort Dropdown */}
            <div className="md:col-span-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs text-white focus:border-amber-500 focus:outline-none cursor-pointer"
              >
                <option value="featured">الترتيب: الأكثر تميزاً</option>
                <option value="price_asc">السعر: من الأقل للأعلى</option>
                <option value="price_desc">السعر: من الأعلى للأقل</option>
                <option value="rating">الأعلى تقييماً</option>
                <option value="newest">وصل حديثاً</option>
              </select>
            </div>

            {/* Layout & Quick Toggles */}
            <div className="md:col-span-3 flex items-center justify-between sm:justify-end gap-2">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer bg-slate-950 px-3 py-2.5 rounded-2xl border border-slate-800">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="rounded border-slate-700 text-amber-500 focus:ring-amber-500"
                />
                <span>المتوفر فقط</span>
              </label>

              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-2xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setLayout('grid')}
                  className={`p-2 rounded-xl transition-all cursor-pointer ${
                    layout === 'grid'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="عرض شبكي"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setLayout('list')}
                  className={`p-2 rounded-xl transition-all cursor-pointer ${
                    layout === 'list'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="عرض قائمة"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Category Chips Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-t border-slate-800/80 pt-3">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 cursor-pointer flex items-center gap-2 ${
                selectedCategory === 'all'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow font-black'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>الكل ({products.length})</span>
            </button>

            {categories.map((cat) => {
              const count = products.filter((p) => p.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 cursor-pointer flex items-center gap-2 ${
                    selectedCategory === cat.id
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow font-black'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-900 border border-slate-800">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>تم العثور على ({filteredProducts.length}) منتج</span>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-amber-400 hover:underline cursor-pointer"
            >
              إلغاء البحث
            </button>
          )}
        </div>

        {/* Products Display */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center bg-slate-900/60 border border-slate-800 rounded-3xl space-y-4">
            <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">لم يتم العثور على منتجات مطابقة</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              جرب البحث بكلمات أخرى أو اختر تصنيفاً مختلفاً من شريط التصنيفات أعلاه.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              إعادة ضبط الفلاتر
            </button>
          </div>
        ) : layout === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((p) => (
              <ProductCard key={p.id} product={p} layout="grid" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProducts.map((p) => (
              <ProductCard key={p.id} product={p} layout="list" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

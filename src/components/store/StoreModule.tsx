import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './ProductCard';
import { StoreHomeLayout } from '../../types/store';
import {
  ShoppingBag,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Layers,
  ChevronRight,
  ChevronLeft,
  SlidersHorizontal,
  Square,
  Columns2,
  LayoutGrid,
  Star,
  Heart,
  ArrowLeftRight,
  Eye,
  Check,
} from 'lucide-react';

interface StoreModuleProps {
  onNavigateToStore?: () => void;
}

export const StoreModule: React.FC<StoreModuleProps> = ({ onNavigateToStore }) => {
  const {
    storeConfig,
    formatPrice,
    addToCart,
    toggleWishlist,
    isInWishlist,
    addToCompare,
    isInCompare,
    setSelectedProductId,
  } = useStore();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [layoutMode, setLayoutMode] = useState<StoreHomeLayout>(
    storeConfig.homeLayout || 'carousel'
  );

  // Carousel & Single/Two-cards slide indexes
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [singleIndex, setSingleIndex] = useState(0);
  const [twoCardsIndex, setTwoCardsIndex] = useState(0);

  // Sync layout mode if storeConfig changes
  useEffect(() => {
    if (storeConfig.homeLayout) {
      setLayoutMode(storeConfig.homeLayout);
    }
  }, [storeConfig.homeLayout]);

  // Reset pagination index whenever category filter changes
  useEffect(() => {
    setCarouselIndex(0);
    setSingleIndex(0);
    setTwoCardsIndex(0);
  }, [activeCategory]);

  if (!storeConfig.isEnabled) return null;

  const categories = storeConfig.categories || [];
  const products = storeConfig.products || [];

  const filteredProducts =
    activeCategory === 'all'
      ? products
      : products.filter((p) => p.category === activeCategory);

  const totalFiltered = filteredProducts.length;

  // Single card controls
  const handleNextSingle = () => {
    if (totalFiltered === 0) return;
    setSingleIndex((prev) => (prev + 1) % totalFiltered);
  };
  const handlePrevSingle = () => {
    if (totalFiltered === 0) return;
    setSingleIndex((prev) => (prev - 1 + totalFiltered) % totalFiltered);
  };

  // Two cards pagination (pairs)
  const totalPairs = Math.ceil(totalFiltered / 2);
  const handleNextTwoCards = () => {
    if (totalPairs === 0) return;
    setTwoCardsIndex((prev) => (prev + 1) % totalPairs);
  };
  const handlePrevTwoCards = () => {
    if (totalPairs === 0) return;
    setTwoCardsIndex((prev) => (prev - 1 + totalPairs) % totalPairs);
  };

  // Carousel sliding
  const handleNextCarousel = () => {
    if (totalFiltered === 0) return;
    setCarouselIndex((prev) => Math.min(prev + 1, Math.max(0, totalFiltered - 1)));
  };
  const handlePrevCarousel = () => {
    setCarouselIndex((prev) => Math.max(0, prev - 1));
  };

  const currentSingleProduct = filteredProducts[singleIndex] || filteredProducts[0];
  const currentPairProducts = filteredProducts.slice(twoCardsIndex * 2, twoCardsIndex * 2 + 2);

  return (
    <section
      id="store-showcase"
      className="py-14 sm:py-20 md:py-24 bg-slate-950 border-y border-slate-800 relative overflow-hidden max-w-full"
    >
      {/* Subtle Glow Background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/5 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 space-y-8 sm:space-y-10 relative z-10">
        
        {/* Module Header & Direct CTA */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 text-right">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full text-xs font-bold">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>المتجر الرقمي والمنتجات المعتمدة</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight">
              {storeConfig.heroBannerTitle || 'تسوق أحدث المنتجات والعروض الحصرية'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-normal leading-relaxed">
              {storeConfig.heroBannerSubtitle ||
                'منتجات أصلية معتمدة مع دفع فوري بالمحافظ الرقمية اليمنية وشحن سريع لكافة المحافظات'}
            </p>
          </div>

          {/* Quick CTA to Full Store */}
          {onNavigateToStore && (
            <button
              type="button"
              onClick={onNavigateToStore}
              className="px-5 py-3 sm:px-6 sm:py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition-all group cursor-pointer shrink-0 self-start md:self-auto"
            >
              <span>دخول المتجر بالكامل</span>
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </button>
          )}
        </div>

        {/* Toolbar: Category Filter Tabs & Layout Mode Switcher */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-3 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-lg">
          
          {/* Category Tabs (Scrollable on mobile) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none max-w-full">
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                activeCategory === 'all'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-black'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>جميع المنتجات ({products.length})</span>
            </button>

            {categories.map((cat) => {
              const count = products.filter((p) => p.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                    activeCategory === cat.id
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-black'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-900/80 border border-slate-700/60 font-mono">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Interactive Layout Switcher Toggle (1-card, 2-cards, carousel, grid) */}
          <div className="flex items-center justify-between sm:justify-end gap-2 border-t lg:border-t-0 pt-2 lg:pt-0 border-slate-800 shrink-0">
            <span className="text-[11px] text-slate-400 font-bold hidden sm:inline">
              طريقة العرض:
            </span>

            <div className="flex items-center gap-1 bg-slate-950 p-1 border border-slate-800 rounded-xl">
              {/* 1. Carousel Mode */}
              <button
                type="button"
                onClick={() => setLayoutMode('carousel')}
                title="كاروسال منزلق تفاعلي"
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  layoutMode === 'carousel'
                    ? 'bg-amber-500 text-slate-950 font-black shadow'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span className="text-[11px]">كاروسال</span>
              </button>

              {/* 2. Single Card Mode */}
              <button
                type="button"
                onClick={() => setLayoutMode('single')}
                title="بطاقة واحدة في كل مرة"
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  layoutMode === 'single'
                    ? 'bg-amber-500 text-slate-950 font-black shadow'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Square className="w-3.5 h-3.5" />
                <span className="text-[11px]">بطاقة واحدة</span>
              </button>

              {/* 3. Two Cards Mode */}
              <button
                type="button"
                onClick={() => setLayoutMode('two_cards')}
                title="بطاقتين بالمرة الواحدة"
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  layoutMode === 'two_cards'
                    ? 'bg-amber-500 text-slate-950 font-black shadow'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Columns2 className="w-3.5 h-3.5" />
                <span className="text-[11px]">بطاقتين</span>
              </button>

              {/* 4. Full Grid */}
              <button
                type="button"
                onClick={() => setLayoutMode('grid')}
                title="شبكة كاملة"
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  layoutMode === 'grid'
                    ? 'bg-amber-500 text-slate-950 font-black shadow'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="text-[11px]">شبكة</span>
              </button>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {totalFiltered === 0 && (
          <div className="py-16 text-center space-y-3 bg-slate-900/50 border border-slate-800 rounded-3xl">
            <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">لا توجد منتجات متطابقة في هذا القسم</h3>
            <p className="text-xs text-slate-400">يرجى اختيار قسم آخر أو مراجعة قائمة المنتجات</p>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODE 1: CAROUSEL SLIDER (كاروسال منزلق) */}
        {/* ========================================================================= */}
        {layoutMode === 'carousel' && totalFiltered > 0 && (
          <div className="space-y-4">
            {/* Top Navigation Controls */}
            <div className="flex items-center justify-between text-xs px-1">
              <span className="text-slate-400 font-bold">
                عرض منزلق ({totalFiltered} منتج)
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrevCarousel}
                  disabled={carouselIndex === 0}
                  className="p-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-800 text-white rounded-xl transition-all cursor-pointer"
                  title="السابق"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <span className="font-mono text-xs text-amber-400 font-bold px-1">
                  {carouselIndex + 1} / {Math.max(1, totalFiltered - 1)}
                </span>
                <button
                  type="button"
                  onClick={handleNextCarousel}
                  disabled={carouselIndex >= totalFiltered - 1}
                  className="p-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-800 text-white rounded-xl transition-all cursor-pointer"
                  title="التالي"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Slider Track Wrapper - Guaranteed zero horizontal blowout */}
            <div className="overflow-hidden w-full max-w-full">
              <div
                className="flex transition-transform duration-500 ease-out gap-4 sm:gap-6"
                style={{
                  transform: `translateX(${carouselIndex * 100}%)`,
                }}
              >
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] shrink-0 max-w-full"
                  >
                    <ProductCard product={product} layout="grid" />
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination Dots */}
            <div className="flex items-center justify-center gap-1.5 pt-2">
              {filteredProducts.slice(0, Math.min(10, totalFiltered)).map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCarouselIndex(idx)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    carouselIndex === idx
                      ? 'w-6 bg-amber-400'
                      : 'w-2 bg-slate-800 hover:bg-slate-700'
                  }`}
                  aria-label={`انتقال للشريحة ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODE 2: SINGLE CARD SHOWCASE (بطاقة واحدة في كل مرة) */}
        {/* ========================================================================= */}
        {layoutMode === 'single' && currentSingleProduct && (
          <div className="space-y-4">
            {/* Top Navigation & Counter */}
            <div className="flex items-center justify-between text-xs px-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-xl font-bold">
                  عرض مميز لبطاقة واحدة
                </span>
                <span className="text-slate-400 font-mono">
                  المنتج {singleIndex + 1} من {totalFiltered}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrevSingle}
                  className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white rounded-xl transition-all cursor-pointer flex items-center gap-1.5 font-bold"
                >
                  <ChevronRight className="w-4 h-4" />
                  <span className="hidden sm:inline">السابق</span>
                </button>
                <button
                  type="button"
                  onClick={handleNextSingle}
                  className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white rounded-xl transition-all cursor-pointer flex items-center gap-1.5 font-bold"
                >
                  <span className="hidden sm:inline">التالي</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Luxurious Large Single Card Presentation */}
            <div className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-3xl p-5 sm:p-8 shadow-2xl transition-all relative overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Product Image Stage (5 Cols) */}
                <div className="lg:col-span-5 relative">
                  <div
                    onClick={() => setSelectedProductId(currentSingleProduct.id)}
                    className="w-full aspect-[4/3] sm:aspect-square bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 relative cursor-pointer group"
                  >
                    <img
                      src={currentSingleProduct.images[0]}
                      alt={currentSingleProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Badge */}
                    {currentSingleProduct.badge && (
                      <span className="absolute top-3 right-3 bg-amber-500 text-slate-950 text-xs font-black px-3 py-1 rounded-xl shadow-lg">
                        {currentSingleProduct.badge}
                      </span>
                    )}

                    {/* Stock Tag */}
                    <span
                      className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-xl backdrop-blur-md ${
                        currentSingleProduct.stock > 0
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-red-500/20 text-red-400 border border-red-500/40'
                      }`}
                    >
                      {currentSingleProduct.stock > 0
                        ? `متوفر (${currentSingleProduct.stock})`
                        : 'نفذت الكمية'}
                    </span>
                  </div>

                  {/* Thumbnail Row */}
                  {currentSingleProduct.images.length > 1 && (
                    <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
                      {currentSingleProduct.images.map((img, idx) => (
                        <div
                          key={idx}
                          onClick={() => setSelectedProductId(currentSingleProduct.id)}
                          className="w-14 h-14 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden cursor-pointer shrink-0"
                        >
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Info & Direct Actions (7 Cols) */}
                <div className="lg:col-span-7 space-y-5 text-right">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-1.5 text-amber-400 text-xs">
                        <Star className="w-4 h-4 fill-amber-400" />
                        <span className="font-black text-sm">{currentSingleProduct.rating}</span>
                        <span className="text-slate-500">
                          ({currentSingleProduct.reviewCount} تقييم حقيقي)
                        </span>
                      </div>

                      <span className="text-xs text-slate-400 font-mono">
                        كود: {currentSingleProduct.sku}
                      </span>
                    </div>

                    <h3
                      onClick={() => setSelectedProductId(currentSingleProduct.id)}
                      className="text-xl sm:text-2xl md:text-3xl font-black text-white hover:text-amber-300 transition-colors cursor-pointer leading-snug"
                    >
                      {currentSingleProduct.name}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {currentSingleProduct.shortDescription}
                    </p>
                  </div>

                  {/* Key Specs Pills */}
                  {currentSingleProduct.specs && currentSingleProduct.specs.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
                      {currentSingleProduct.specs.slice(0, 4).map((spec, i) => (
                        <div
                          key={i}
                          className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300"
                        >
                          <span className="text-slate-400 font-medium">{spec.label}: </span>
                          <span className="text-amber-300 font-bold">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Pricing and Action Bar */}
                  <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[11px] text-slate-400 block mb-0.5">السعر الحالي:</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl sm:text-3xl font-black text-amber-400">
                          {formatPrice(currentSingleProduct.salePrice || currentSingleProduct.basePrice)}
                        </span>
                        {currentSingleProduct.salePrice &&
                          currentSingleProduct.salePrice < currentSingleProduct.basePrice && (
                            <span className="text-sm text-slate-500 line-through">
                              {formatPrice(currentSingleProduct.basePrice)}
                            </span>
                          )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleWishlist(currentSingleProduct.id)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                          isInWishlist(currentSingleProduct.id)
                            ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                        title="إضافة للمفضلة"
                      >
                        <Heart
                          className={`w-5 h-5 ${
                            isInWishlist(currentSingleProduct.id) ? 'fill-rose-400' : ''
                          }`}
                        />
                      </button>

                      <button
                        type="button"
                        onClick={() => addToCompare(currentSingleProduct)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                          isInCompare(currentSingleProduct.id)
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                        title="مقارنة"
                      >
                        <ArrowLeftRight className="w-5 h-5" />
                      </button>

                      <button
                        type="button"
                        disabled={currentSingleProduct.stock <= 0}
                        onClick={() => addToCart(currentSingleProduct)}
                        className="flex-1 sm:flex-none px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>إضافة إلى سلة الشراء</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODE 3: TWO CARDS AT A TIME (بطاقتين بالمرة الواحدة) */}
        {/* ========================================================================= */}
        {layoutMode === 'two_cards' && currentPairProducts.length > 0 && (
          <div className="space-y-4">
            {/* Top Navigation & Pairs Counter */}
            <div className="flex items-center justify-between text-xs px-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-xl font-bold">
                  عرض بطاقتين متجاورتين
                </span>
                <span className="text-slate-400 font-mono">
                  المجموعة {twoCardsIndex + 1} من {totalPairs}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrevTwoCards}
                  className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white rounded-xl transition-all cursor-pointer flex items-center gap-1.5 font-bold"
                >
                  <ChevronRight className="w-4 h-4" />
                  <span className="hidden sm:inline">السابق</span>
                </button>
                <button
                  type="button"
                  onClick={handleNextTwoCards}
                  className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white rounded-xl transition-all cursor-pointer flex items-center gap-1.5 font-bold"
                >
                  <span className="hidden sm:inline">التالي</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Exactly Two Cards Grid - Fully responsive on mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {currentPairProducts.map((product) => (
                <ProductCard key={product.id} product={product} layout="grid" compact={true} />
              ))}
            </div>

            {/* Quick Pair Indicators */}
            <div className="flex items-center justify-center gap-1.5 pt-2">
              {Array.from({ length: totalPairs }).map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setTwoCardsIndex(idx)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    twoCardsIndex === idx
                      ? 'w-6 bg-amber-400'
                      : 'w-2 bg-slate-800 hover:bg-slate-700'
                  }`}
                  aria-label={`انتقال للمجموعة ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODE 4: FULL GRID VIEW (شبكة كاملة) */}
        {/* ========================================================================= */}
        {layoutMode === 'grid' && totalFiltered > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.slice(0, 12).map((product) => (
              <ProductCard key={product.id} product={product} layout="grid" />
            ))}
          </div>
        )}

        {/* Bottom Feature Banner */}
        {onNavigateToStore && (
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-900 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 text-right">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                <Sparkles className="w-4 h-4" />
                <span>عروض وخصومات يومية متجددة</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white">
                هل تريد مقارنة المواصفات والاطلاع على كافة المنتجات؟
              </h3>
              <p className="text-xs text-slate-400 max-w-xl">
                تفضل بزيارة صفحة المتجر المستقلة للتمتع بمحرك البحث الفوري، فرز الأسعار، ونظام الولاء والنقاط.
              </p>
            </div>

            <button
              type="button"
              onClick={onNavigateToStore}
              className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-xl shadow-amber-500/25 flex items-center gap-2.5 transition-all group cursor-pointer shrink-0"
            >
              <span>تسوق الآن وشاهد الكل</span>
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

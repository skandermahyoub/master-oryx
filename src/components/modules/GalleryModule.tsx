import React, { useState, useEffect } from 'react';
import { useCMS } from '../../context/CMSContext';
import { GalleryItem } from '../../types/cms';
import {
  Image as ImageIcon,
  ChevronRight,
  ChevronLeft,
  X,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Calendar,
  Tag,
  Download,
  ExternalLink,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const GalleryModule: React.FC = () => {
  const { cmsData, navigateToCustomPage } = useCMS();
  const { gallery } = cmsData;

  const [activeCategory, setActiveCategory] = useState<string>('الكل');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [zoomScale, setZoomScale] = useState<number>(1);
  const carouselTrackRef = React.useRef<HTMLDivElement>(null);

  if (!gallery || !gallery.items || gallery.items.length === 0) return null;

  // Filter items by category
  const filteredItems =
    activeCategory === 'الكل'
      ? gallery.items
      : gallery.items.filter((item) => item.category === activeCategory);

  const categories = gallery.categories || ['الكل'];

  // Lightbox Navigation
  const handlePrevImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (selectedImageIndex === null) return;
    setZoomScale(1);
    const prevIdx = (selectedImageIndex - 1 + filteredItems.length) % filteredItems.length;
    setSelectedImageIndex(prevIdx);
  };

  const handleNextImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (selectedImageIndex === null) return;
    setZoomScale(1);
    const nextIdx = (selectedImageIndex + 1) % filteredItems.length;
    setSelectedImageIndex(nextIdx);
  };

  // Zoom handlers
  const handleZoomIn = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setZoomScale((prev) => Math.min(3, prev + 0.5));
  };

  const handleZoomOut = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setZoomScale((prev) => Math.max(1, prev - 0.5));
  };

  const handleResetZoom = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setZoomScale(1);
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;
      if (e.key === 'Escape') setSelectedImageIndex(null);
      if (e.key === 'ArrowRight') handlePrevImage();
      if (e.key === 'ArrowLeft') handleNextImage();
      if (e.key === '+') handleZoomIn();
      if (e.key === '-') handleZoomOut();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex, filteredItems.length]);

  // Carousel scroll controls (RTL friendly)
  const scrollCarousel = (direction: 'prev' | 'next') => {
    if (!carouselTrackRef.current) return;
    const clientWidth = carouselTrackRef.current.clientWidth;
    const scrollStep = clientWidth * 0.75;
    // In RTL, scrolling right or left:
    const delta = direction === 'next' ? -scrollStep : scrollStep;
    carouselTrackRef.current.scrollBy({ left: delta, behavior: 'smooth' });
  };

  // Explicit Column mappings for Tailwind scanner with Number conversion
  const getGridColsClass = () => {
    const cols = Number(gallery.columns) || 3;
    if (cols === 2) return 'grid grid-cols-1 sm:grid-cols-2 gap-6';
    if (cols === 4) return 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6';
    return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6';
  };

  const getMasonryColsClass = () => {
    const cols = Number(gallery.columns) || 3;
    if (cols === 2) return 'columns-1 sm:columns-2 gap-6';
    if (cols === 4) return 'columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6';
    return 'columns-1 sm:columns-2 lg:columns-3 gap-6';
  };

  const getCarouselItemWidth = () => {
    const cols = Number(gallery.columns) || 3;
    if (cols === 2) return 'w-[85vw] sm:w-[48%] lg:w-[48.5%]';
    if (cols === 4) return 'w-[85vw] sm:w-[45%] md:w-[31%] lg:w-[23.5%]';
    return 'w-[85vw] sm:w-[45vw] lg:w-[31.5%]';
  };

  const getItemAspectClass = (aspect?: string) => {
    switch (aspect) {
      case 'square': return 'aspect-square';
      case 'portrait': return 'aspect-[3/4]';
      case 'wide': return 'aspect-[21/9]';
      case 'video':
      default: return 'aspect-video';
    }
  };

  return (
    <section id="gallery" className="py-20 md:py-28 bg-slate-950 relative overflow-hidden">
      {/* Background Subtle Accent */}
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-theme-primary-10 border border-theme-primary-30 text-xs font-bold text-theme-primary">
            <ImageIcon className="w-4 h-4 text-theme-primary" />
            <span>معرض الصور والوسائط التفاعلي</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
            {gallery.sectionTitle || 'معرض وسائط المنظومة'}
          </h2>

          <p className="text-sm md:text-base text-slate-400 font-normal leading-relaxed">
            {gallery.sectionSubtitle || 'لقطات توثيقية حية من فعاليات الشركة، مقرات العمل والمشاريع الميدانية'}
          </p>
        </div>

        {/* Categories Filter Bar */}
        {categories.length > 1 && (
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
            {categories.map((cat, idx) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveCategory(cat);
                    if (carouselTrackRef.current) carouselTrackRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20 scale-105'
                      : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        )}

        {/* Gallery Items Rendering */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800">
            <ImageIcon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-sm text-slate-400 font-bold">لا توجد صور في هذا التصنيف حالياً</p>
          </div>
        ) : gallery.layoutMode === 'carousel' ? (
          /* Carousel Layout Mode (Smooth scroll snap with uniform aspect ratio cards) */
          <div className="relative group/carousel">
            <div
              ref={carouselTrackRef}
              className="flex gap-6 overflow-x-auto pb-4 pt-2 scrollbar-none snap-x snap-mandatory scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {filteredItems.map((item, idx) => (
                <div
                  key={item.id}
                  className={`${getCarouselItemWidth()} shrink-0 snap-start cursor-pointer group`}
                  onClick={() => {
                    setSelectedImageIndex(idx);
                    setZoomScale(1);
                  }}
                >
                  <div className="relative rounded-2xl overflow-hidden aspect-[16/10] w-full border border-slate-800 bg-slate-900 shadow-xl group-hover:border-amber-500/50 transition-all">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                    <div className="absolute top-3 right-3 px-2.5 py-1 bg-slate-950/80 backdrop-blur-md rounded-lg border border-slate-800 text-[10px] font-bold text-amber-400">
                      {item.category}
                    </div>

                    <div className="absolute bottom-4 right-4 left-4 space-y-1">
                      <div className="flex items-center gap-1.5 text-[10px] text-amber-300/90 font-mono">
                        <Calendar className="w-3 h-3 text-amber-400" />
                        <span>{item.date}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                        {item.title}
                      </h4>
                      {item.description && (
                        <p className="text-xs text-slate-300 line-clamp-1">{item.description}</p>
                      )}
                    </div>

                    <div className="absolute top-3 left-3 p-2 bg-amber-500/20 text-amber-300 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity border border-amber-500/30 backdrop-blur-md">
                      <Maximize2 className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Controls */}
            <button
              type="button"
              onClick={() => scrollCarousel('next')}
              className="absolute -right-3 top-1/2 -translate-y-1/2 p-3 sm:p-3.5 rounded-2xl bg-slate-900 border border-slate-700 text-slate-100 hover:bg-amber-500 hover:text-slate-950 hover:border-amber-400 transition-all z-20 shadow-xl backdrop-blur-md cursor-pointer flex items-center justify-center"
              title="السابق"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => scrollCarousel('prev')}
              className="absolute -left-3 top-1/2 -translate-y-1/2 p-3 sm:p-3.5 rounded-2xl bg-slate-900 border border-slate-700 text-slate-100 hover:bg-amber-500 hover:text-slate-950 hover:border-amber-400 transition-all z-20 shadow-xl backdrop-blur-md cursor-pointer flex items-center justify-center"
              title="التالي"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        ) : gallery.layoutMode === 'masonry' ? (
          /* Masonry Layout Mode (Dynamic Column Support) */
          <div className={getMasonryColsClass()}>
            {filteredItems.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedImageIndex(idx);
                  setZoomScale(1);
                }}
                className="mb-6 break-inside-avoid relative rounded-2xl overflow-hidden border border-slate-800/80 bg-slate-900 group cursor-pointer hover:border-amber-500/50 transition-all duration-300 shadow-xl"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />

                  <div className="absolute top-3 right-3 px-2.5 py-1 bg-slate-950/80 backdrop-blur-md rounded-lg border border-slate-800 text-[10px] font-bold text-amber-400">
                    {item.category}
                  </div>

                  <div className="absolute top-3 left-3 p-2 bg-amber-500/20 text-amber-300 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity border border-amber-500/30 backdrop-blur-md">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>

                <div className="p-4 space-y-2 bg-slate-900/90 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-amber-400" />
                      <span>{item.date}</span>
                    </span>
                    <span className="text-amber-400/80 font-mono">أوريكس</span>
                  </div>

                  <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors leading-snug">
                    {item.title}
                  </h4>

                  {item.description && (
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Grid Layout Mode (Dynamic Column Support) */
          <div className={getGridColsClass()}>
            {filteredItems.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedImageIndex(idx);
                  setZoomScale(1);
                }}
                className="relative rounded-2xl overflow-hidden border border-slate-800/80 bg-slate-900 group cursor-pointer hover:border-amber-500/50 transition-all duration-300 shadow-xl flex flex-col"
              >
                <div className={`relative overflow-hidden ${getItemAspectClass(item.aspectRatio)} bg-slate-950`}>
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />

                  <div className="absolute top-3 right-3 px-2.5 py-1 bg-slate-950/80 backdrop-blur-md rounded-lg border border-slate-800 text-[10px] font-bold text-amber-400">
                    {item.category}
                  </div>

                  <div className="absolute top-3 left-3 p-2 bg-amber-500/20 text-amber-300 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity border border-amber-500/30 backdrop-blur-md">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>

                <div className="p-4 space-y-2 bg-slate-900/90 flex-1 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-amber-400" />
                      <span>{item.date}</span>
                    </span>
                    <span className="text-amber-400/80 font-mono">أوريكس</span>
                  </div>

                  <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors leading-snug">
                    {item.title}
                  </h4>

                  {item.description && (
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View Full Gallery Page CTA Button */}
        {gallery.showCtaButton !== false && (
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => navigateToCustomPage('gallery')}
              className="px-6 sm:px-8 py-3 bg-slate-900 hover:bg-slate-800 text-amber-400 hover:text-amber-300 font-bold text-xs sm:text-sm rounded-2xl border border-slate-700/80 hover:border-amber-500/60 shadow-lg shadow-amber-500/5 transition-all flex items-center justify-center gap-2.5 cursor-pointer group"
            >
              <ImageIcon className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>{gallery.ctaButtonText || 'افتح معرض الصور'}</span>
              <ArrowRight className="w-4 h-4 text-amber-400 group-hover:-translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>

      {/* Fullscreen Enhanced Lightbox Modal with Zoom & Descriptions & Thumbnail Bar */}
      {selectedImageIndex !== null && filteredItems[selectedImageIndex] && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200 overflow-hidden"
          onClick={() => setSelectedImageIndex(null)}
        >
          {/* Lightbox Top Control Bar */}
          <div
            className="flex items-center justify-between w-full max-w-7xl mx-auto z-50 bg-slate-900/80 border border-slate-800 backdrop-blur-md px-4 py-3 rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />
                <span>{filteredItems[selectedImageIndex].category}</span>
              </span>
              <span className="text-xs font-mono font-bold text-slate-400">
                {selectedImageIndex + 1} / {filteredItems.length}
              </span>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800">
              <button
                onClick={handleZoomIn}
                disabled={zoomScale >= 3}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg disabled:opacity-30 transition-all"
                title="تكبير الصورة (+)"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <span className="text-[11px] font-mono font-bold text-amber-400 min-w-[32px] text-center">
                {Math.round(zoomScale * 100)}%
              </span>
              <button
                onClick={handleZoomOut}
                disabled={zoomScale <= 1}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg disabled:opacity-30 transition-all"
                title="تصغير الصورة (-)"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              {zoomScale > 1 && (
                <button
                  onClick={handleResetZoom}
                  className="p-1.5 text-amber-400 hover:bg-slate-800 rounded-lg transition-all"
                  title="إعادة ضبط الحجم الاصلي"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={() => setSelectedImageIndex(null)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-white transition-all border border-slate-700 hover:border-red-500/30"
              title="إغلاق (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Lightbox Main Container */}
          <div
            className="max-w-7xl w-full mx-auto flex-1 flex flex-col lg:flex-row gap-6 my-4 overflow-hidden relative z-40 items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Full Photo Canvas */}
            <div className="lg:w-3/4 w-full h-full bg-slate-950/80 border border-slate-800 rounded-3xl flex items-center justify-center relative overflow-hidden group">
              <div className="w-full h-full flex items-center justify-center overflow-auto p-4 custom-scrollbar">
                <img
                  src={filteredItems[selectedImageIndex].imageUrl}
                  alt={filteredItems[selectedImageIndex].title}
                  className="max-w-full max-h-[70vh] object-contain transition-transform duration-300 ease-out"
                  style={{ transform: `scale(${zoomScale})` }}
                />
              </div>

              {/* Prev Navigation Button */}
              <button
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 text-white hover:bg-amber-500 hover:text-slate-950 transition-all shadow-2xl z-30"
                title="الصورة السابقة (سهم يمين)"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Next Navigation Button */}
              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 text-white hover:bg-amber-500 hover:text-slate-950 transition-all shadow-2xl z-30"
                title="الصورة التالية (سهم يسار)"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            </div>

            {/* Detailed Description Panel */}
            <div className="lg:w-1/4 w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-6 overflow-y-auto max-h-[70vh] custom-scrollbar shadow-2xl">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>{filteredItems[selectedImageIndex].date}</span>
                  </span>

                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                    عالية الدقة HD
                  </span>
                </div>

                <h3 className="text-lg font-black text-white leading-snug">
                  {filteredItems[selectedImageIndex].title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
                  {filteredItems[selectedImageIndex].description ||
                    'لقطة توثيقية حية توثق أهم المحطات والإنجازات في مسيرة شركة أوريكس للحلول الرقمية.'}
                </p>
              </div>

              {/* Action Links */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <a
                  href={filteredItems[selectedImageIndex].imageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center justify-center gap-2 border border-slate-700 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-amber-400" />
                  <span>فتح الصورة بحجمها الأصلي</span>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Thumbnails Navigation Strip */}
          <div
            className="w-full max-w-7xl mx-auto z-50 bg-slate-900/80 border border-slate-800 backdrop-blur-md p-3 rounded-2xl flex items-center gap-3 overflow-x-auto custom-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            {filteredItems.map((item, idx) => {
              const isSelected = idx === selectedImageIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedImageIndex(idx);
                    setZoomScale(1);
                  }}
                  className={`relative w-16 h-12 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                    isSelected
                      ? 'border-amber-400 scale-105 shadow-lg shadow-amber-500/20'
                      : 'border-slate-800 opacity-60 hover:opacity-100 hover:border-slate-600'
                  }`}
                >
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};

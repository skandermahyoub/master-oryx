import React from 'react';
import { useCMS } from '../../context/CMSContext';
import { CarouselSlider } from '../common/CarouselSlider';
import { Building2, Star } from 'lucide-react';

export const BrandsModule: React.FC = () => {
  const { cmsData } = useCMS();
  const { brands } = cmsData;

  const items = brands?.items || [];
  if (items.length === 0) return null;

  const isCarousel = (brands.layoutMode || 'carousel') === 'carousel';
  const shape = brands.logoCardShape === 'square' ? 'square' : 'rectangular';
  const imageFit = brands.imageFit || 'cover';

  const renderBrandCard = (item: any) => {
    return (
      <div
        key={item.id}
        className={`rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-lg hover:border-amber-500/50 hover:shadow-xl transition-all duration-300 h-full flex flex-col justify-between group ${
          brands.isGrayscale ? 'filter grayscale hover:grayscale-0' : ''
        }`}
      >
        {/* Top Image: Completely Clean with ZERO text or badges on top */}
        <div
          className={`w-full relative overflow-hidden bg-slate-950 border-b border-slate-800/80 ${
            shape === 'square' ? 'aspect-square' : 'aspect-[16/10] sm:aspect-video'
          }`}
        >
          <img
            src={item.logoUrl}
            alt={item.name}
            className={`w-full h-full ${
              imageFit === 'contain' ? 'object-contain p-3' : 'object-cover'
            } group-hover:scale-105 transition-transform duration-500`}
            loading="lazy"
          />
        </div>

        {/* Bottom Details Section (Located CLEANLY under the image, never on top) */}
        {brands.displayMode !== 'logo_only' && (
          <div className="p-4 sm:p-5 space-y-2 text-center flex-1 flex flex-col justify-center">
            {/* Category / Sector Pill (under image) */}
            {(brands.displayMode === 'logo_label' || brands.displayMode === 'logo_text_rating') && item.label && (
              <div>
                <span className="inline-block text-[10px] bg-slate-800 text-amber-400 px-2.5 py-0.5 rounded-full font-bold border border-slate-700">
                  {item.label}
                </span>
              </div>
            )}

            {/* Brand / Company Name */}
            <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors truncate">
              {item.name}
            </h4>

            {/* Optional Description / Text */}
            {(brands.displayMode === 'logo_text' || brands.displayMode === 'logo_text_rating') && item.text && (
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                {item.text}
              </p>
            )}

            {/* Optional Rating Stars */}
            {(brands.displayMode === 'logo_rating' || brands.displayMode === 'logo_text_rating') && (
              <div className="flex items-center justify-center gap-0.5 text-amber-400 pt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <section id="brands" className="py-16 md:py-24 bg-slate-950 border-y border-slate-800 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full text-xs font-bold">
            <Building2 className="w-4 h-4" />
            <span>شركاء النجاح وأبرز العملاء</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-white leading-tight">
            {brands.sectionTitle || 'شركاء النجاح وأبرز العلامات التجارية'}
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-slate-400 font-normal leading-relaxed">
            {brands.sectionSubtitle || 'شراكات استراتيجية متينة مع منظومات رائدة في مختلف القطاعات'}
          </p>
        </div>

        {/* Brands Carousel vs Grid */}
        {isCarousel ? (
          <CarouselSlider itemsPerPageDesktop={4} itemsPerPageMobile={2} autoPlay={true} autoPlayInterval={4000}>
            {items.map((item) => renderBrandCard(item))}
          </CarouselSlider>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => renderBrandCard(item))}
          </div>
        )}
      </div>
    </section>
  );
};

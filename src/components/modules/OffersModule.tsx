import React from 'react';
import { useCMS } from '../../context/CMSContext';
import { CarouselSlider } from '../common/CarouselSlider';
import { Sparkles, ArrowLeft, Tag } from 'lucide-react';

export const OffersModule: React.FC = () => {
  const { cmsData } = useCMS();
  const { offers } = cmsData;

  const items = offers.items || [];
  if (items.length === 0) return null;

  const renderOfferCard = (offer: any, isFeaturedHero: boolean = false) => (
    <div
      key={offer.id}
      className={`relative rounded-3xl overflow-hidden border border-slate-800 shadow-xl group flex flex-col justify-between p-6 sm:p-8 min-h-[340px] h-full transition-all duration-300 hover:border-amber-500/50 hover:shadow-2xl ${
        isFeaturedHero ? 'lg:col-span-2 min-h-[380px] bg-slate-900' : 'bg-slate-900'
      }`}
    >
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={offer.bgImageUrl}
          alt={offer.title}
          className="w-full h-full object-cover object-center filter brightness-50 group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 space-y-3">
        {offer.badge && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/90 text-slate-950 rounded-full text-xs font-black shadow-md">
            <Tag className="w-3.5 h-3.5" />
            <span>{offer.badge}</span>
          </span>
        )}

        <h3 className={`font-black text-white leading-tight ${isFeaturedHero ? 'text-2xl sm:text-3xl' : 'text-xl'}`}>
          {offer.title}
        </h3>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
          {offer.subtitle}
        </p>
      </div>

      {/* CTA Link */}
      <div className="relative z-10 pt-4">
        <a
          href={offer.linkUrl || '#contact'}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all"
        >
          <span>طلب العرض والتفاصيل</span>
          <ArrowLeft className="w-4 h-4" />
        </a>
      </div>
    </div>
  );

  return (
    <section id="offers" className="py-20 bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full text-xs font-bold">
            <Sparkles className="w-4 h-4" />
            <span>الحزم والتطبيقات المميزة (كاروسال عروض)</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">
            {offers.sectionTitle}
          </h2>
          <p className="text-sm sm:text-base text-slate-400 font-medium">
            {offers.sectionSubtitle}
          </p>
        </div>

        {/* Carousel Mode vs Grid Mode */}
        {offers.layoutType === 'carousel' ? (
          <CarouselSlider itemsPerPageDesktop={3} itemsPerPageMobile={1} autoPlay={true}>
            {items.map((offer) => renderOfferCard(offer, false))}
          </CarouselSlider>
        ) : (
          <div
            className={`grid gap-6 ${
              offers.layoutType === 'grid_4'
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                : offers.layoutType === 'horizontal_2'
                ? 'grid-cols-1 md:grid-cols-2'
                : offers.layoutType === 'vertical_2'
                ? 'grid-cols-1 max-w-3xl mx-auto'
                : offers.layoutType === 'split_3'
                ? 'grid-cols-1 lg:grid-cols-3'
                : 'grid-cols-1 md:grid-cols-3'
            }`}
          >
            {items.map((offer, idx) => {
              const isFeaturedHero = offers.layoutType === 'split_3' && idx === 0;
              return renderOfferCard(offer, isFeaturedHero);
            })}
          </div>
        )}
      </div>
    </section>
  );
};

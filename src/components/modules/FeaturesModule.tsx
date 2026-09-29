import React from 'react';
import { useCMS } from '../../context/CMSContext';
import { CarouselSlider } from '../common/CarouselSlider';
import {
  BrainCircuit,
  Zap,
  ShieldCheck,
  Headphones,
  SlidersHorizontal,
  Link as LinkIcon,
  Award,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export const FeaturesModule: React.FC = () => {
  const { cmsData } = useCMS();
  const { features } = cmsData;

  const items = features.items || [];
  if (items.length === 0) return null;

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'BrainCircuit':
        return <BrainCircuit className="w-6 h-6 text-amber-400" />;
      case 'Zap':
        return <Zap className="w-6 h-6 text-amber-400" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-emerald-400" />;
      case 'Headphones':
        return <Headphones className="w-6 h-6 text-amber-400" />;
      case 'SlidersHorizontal':
        return <SlidersHorizontal className="w-6 h-6 text-amber-400" />;
      case 'Link':
        return <LinkIcon className="w-6 h-6 text-blue-400" />;
      default:
        return <Sparkles className="w-6 h-6 text-amber-400" />;
    }
  };

  const isCarousel = (features.layoutMode || 'grid') === 'carousel';

  const renderFeatureCard = (item: any) => (
    <div
      key={item.id}
      className={`p-6 sm:p-8 rounded-3xl border transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between space-y-5 h-full min-h-[260px] ${
        item.isDigitalCard
          ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/30 border-amber-500/30 shadow-xl hover:border-amber-500/60'
          : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 shadow-md'
      }`}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-inner">
            {getIconComponent(item.icon)}
          </div>
          {item.badgeOrStat && (
            <span className="px-3 py-1 bg-amber-500/15 text-amber-300 border border-amber-500/30 rounded-full text-xs font-bold font-mono">
              {item.badgeOrStat}
            </span>
          )}
        </div>

        <h3 className="text-lg font-bold text-white">{item.title}</h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {item.description}
        </p>
      </div>

      <div className="pt-3 border-t border-slate-800/60 flex items-center gap-2 text-xs text-amber-400 font-semibold">
        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        <span>ميزة قياسية مفعّلة بالنظام</span>
      </div>
    </div>
  );

  return (
    <section id="features" className="py-20 bg-slate-900/60 border-y border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full text-xs font-bold">
            <Award className="w-4 h-4" />
            <span>مزايانا التنافسية</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">
            {features.sectionTitle}
          </h2>
          <p className="text-sm sm:text-base text-slate-400 font-medium">
            {features.sectionSubtitle}
          </p>
        </div>

        {/* Features Grid vs Carousel */}
        {isCarousel ? (
          <CarouselSlider itemsPerPageDesktop={3} itemsPerPageMobile={1} autoPlay={true}>
            {items.map((item) => renderFeatureCard(item))}
          </CarouselSlider>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => renderFeatureCard(item))}
          </div>
        )}
      </div>
    </section>
  );
};

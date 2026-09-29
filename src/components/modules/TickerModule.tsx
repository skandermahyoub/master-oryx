import React from 'react';
import { useCMS } from '../../context/CMSContext';
import { Megaphone, Sparkles, BellRing, Flame, ArrowLeft, Tag } from 'lucide-react';
import { CategoryType } from '../../types/cms';

export const TickerModule: React.FC = () => {
  const { cmsData } = useCMS();
  const { ticker } = cmsData;

  const items = ticker.items || [];
  if (items.length === 0) return null;

  const isL2R = (ticker.direction || 'leftToRight') === 'leftToRight';
  const marqueeClass = isL2R ? 'animate-marquee-l2r' : 'animate-marquee-r2l';
  const animationDuration = `${ticker.speed || 30}s`;

  const getCategoryBadge = (category: CategoryType) => {
    switch (category) {
      case 'news':
        return {
          label: 'أخبار أوريكس',
          bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
          icon: <BellRing className="w-3.5 h-3.5 text-blue-400" />,
        };
      case 'offer':
        return {
          label: 'عرض مميز',
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          icon: <Flame className="w-3.5 h-3.5 text-amber-400" />,
        };
      case 'announcement':
        return {
          label: 'إعلان هام',
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          icon: <Sparkles className="w-3.5 h-3.5 text-emerald-400" />,
        };
      case 'marketing':
        return {
          label: 'تمكين الأعمال',
          bg: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
          icon: <Megaphone className="w-3.5 h-3.5 text-purple-400" />,
        };
      default:
        return {
          label: 'مستجدات',
          bg: 'bg-slate-800 text-slate-300 border-slate-700',
          icon: <Tag className="w-3.5 h-3.5 text-slate-400" />,
        };
    }
  };

  return (
    <div className="bg-slate-900 border-y border-amber-500/20 py-2.5 overflow-hidden relative shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-3">
        {/* Fixed Label Badge */}
        <div className="shrink-0 flex items-center gap-2 px-3 py-1.5 bg-amber-500 text-slate-950 rounded-xl font-bold text-xs shadow-md shadow-amber-500/20 z-10">
          <Megaphone className="w-4 h-4" />
          <span className="hidden sm:inline">الشريط الإخباري</span>
        </div>

        {/* Scrolling Ticker Container with Left-to-Right direction support */}
        <div className="overflow-hidden whitespace-nowrap flex-1 relative" dir="ltr">
          <div
            className={`inline-flex gap-8 ${marqueeClass} hover:[animation-play-state:paused] items-center`}
            style={{ animationDuration }}
          >
            {/* Repeat items 3 times for seamless infinite marquee loop */}
            {[...items, ...items, ...items].map((item, idx) => {
              const cat = getCategoryBadge(item.category);
              return (
                <a
                  key={`${item.id}-${idx}`}
                  href={item.link || '#'}
                  dir="rtl"
                  className="inline-flex items-center gap-2.5 text-xs md:text-sm font-semibold text-slate-200 hover:text-amber-400 transition-colors group shrink-0"
                >
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[11px] font-bold ${cat.bg}`}
                  >
                    {cat.icon}
                    <span>{cat.label}</span>
                  </span>
                  <span>{item.text}</span>
                  <ArrowLeft className="w-3 h-3 text-slate-500 group-hover:text-amber-400 group-hover:-translate-x-1 transition-all" />
                  <span className="text-amber-500/40 px-2">•</span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

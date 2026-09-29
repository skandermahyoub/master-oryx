import React from 'react';
import { useCMS } from '../../context/CMSContext';
import {
  Award,
  Users,
  BarChart2,
  Zap,
  Globe,
  ShieldCheck,
  TrendingUp,
  Clock,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export const StatsModule: React.FC = () => {
  const { cmsData } = useCMS();
  const { stats } = cmsData;

  const items = stats?.items || [];
  if (!stats || items.length === 0) return null;

  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Award':
        return <Award className="w-6 h-6 text-amber-400" />;
      case 'Users':
        return <Users className="w-6 h-6 text-amber-400" />;
      case 'Zap':
        return <Zap className="w-6 h-6 text-amber-400" />;
      case 'Globe':
        return <Globe className="w-6 h-6 text-emerald-400" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-emerald-400" />;
      case 'TrendingUp':
        return <TrendingUp className="w-6 h-6 text-cyan-400" />;
      case 'Clock':
        return <Clock className="w-6 h-6 text-purple-400" />;
      case 'BarChart2':
      default:
        return <BarChart2 className="w-6 h-6 text-amber-400" />;
    }
  };

  const layoutStyle = stats.layoutStyle || 'grid_4';

  return (
    <section id="stats" className="py-20 md:py-24 bg-slate-950 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          {stats.badge && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{stats.badge}</span>
            </div>
          )}

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
            {stats.sectionTitle}
          </h2>

          {stats.sectionSubtitle && (
            <p className="text-sm sm:text-base text-slate-400 font-medium leading-relaxed">
              {stats.sectionSubtitle}
            </p>
          )}
        </div>

        {/* Layout Mode 1: grid_4 (Default Modern Clean Grid) */}
        {layoutStyle === 'grid_4' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 shadow-xl transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-amber-400 group-hover:scale-110 transition-transform shadow-inner">
                    {getIcon(item.icon)}
                  </div>
                  <div className="w-2 h-2 rounded-full bg-amber-400/60 group-hover:bg-amber-400 animate-pulse" />
                </div>

                <div className="space-y-1">
                  <div className="text-3xl sm:text-4xl font-black text-white group-hover:text-amber-400 transition-colors font-mono tracking-tight">
                    {item.value}
                  </div>
                  <h4 className="text-sm font-bold text-slate-200">
                    {item.label}
                  </h4>
                </div>

                {item.description && (
                  <p className="text-xs text-slate-400 leading-relaxed border-t border-slate-800/80 pt-3">
                    {item.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Layout Mode 2: cards (Luxury Gradient Glass Cards) */}
        {layoutStyle === 'cards' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/20 border border-amber-500/30 shadow-2xl relative overflow-hidden group hover:border-amber-500/60 transition-all text-center space-y-3"
              >
                <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />
                
                <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-md">
                  {getIcon(item.icon)}
                </div>

                <div className="text-4xl font-black text-white font-mono tracking-tight group-hover:text-amber-300 transition-colors">
                  {item.value}
                </div>

                <div className="text-sm font-bold text-slate-200">
                  {item.label}
                </div>

                {item.description && (
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Layout Mode 3: banner (Integrated Horizontal Strip) */}
        {layoutStyle === 'banner' && (
          <div className="p-6 sm:p-10 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x sm:divide-x-reverse divide-slate-800 gap-6 sm:gap-0">
              {items.map((item) => (
                <div key={item.id} className="sm:px-6 space-y-2 text-center pt-4 sm:pt-0">
                  <div className="flex justify-center text-amber-400 mb-1">
                    {getIcon(item.icon)}
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-white font-mono">
                    {item.value}
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-slate-300">
                    {item.label}
                  </div>
                  {item.description && (
                    <p className="text-[11px] text-slate-400">
                      {item.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Layout Mode 4: glow (Futuristic Glowing Highlights) */}
        {layoutStyle === 'glow' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="p-8 rounded-3xl bg-slate-950 border-2 border-amber-500/40 shadow-xl shadow-amber-500/10 group hover:border-amber-400 transition-all flex flex-col items-center text-center space-y-3"
              >
                <div className="p-3 bg-amber-500 text-slate-950 rounded-2xl shadow-lg shadow-amber-500/30">
                  {getIcon(item.icon)}
                </div>

                <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200 font-mono">
                  {item.value}
                </div>

                <div className="text-sm font-bold text-white">
                  {item.label}
                </div>

                {item.description && (
                  <p className="text-xs text-slate-400">
                    {item.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

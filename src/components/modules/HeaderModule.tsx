import React from 'react';
import { useCMS } from '../../context/CMSContext';
import { ChevronDown, ArrowLeft, Sparkles, Building2, ShieldCheck, Award } from 'lucide-react';

export const HeaderModule: React.FC = () => {
  const { cmsData } = useCMS();
  const { header } = cmsData;

  if (!header.showInHero) return null;

  return (
    <section id="hero" className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-24 pb-16">
      {/* Background Image with Cinematic Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={header.bgImageUrl}
          alt={header.appName}
          className="w-full h-full object-cover object-center scale-105 filter brightness-75 contrast-110 transform transition-transform duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/60" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 animate-in fade-in zoom-in-95 duration-700">
        {/* Enterprise Brand Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-slate-900/80 border border-amber-500/30 backdrop-blur-xl rounded-full shadow-2xl">
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          <span className="text-xs md:text-sm font-extrabold text-amber-300">
            {header.appName} • {header.slogan}
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight tracking-tight drop-shadow-lg max-w-4xl mx-auto">
          {header.welcomeTitle}
        </h1>

        {/* Hero Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium drop-shadow">
          {header.welcomeSubtitle}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <a
            href={header.ctaUrl}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-base rounded-2xl shadow-2xl shadow-amber-500/25 flex items-center justify-center gap-3 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>{header.ctaText}</span>
            <ArrowLeft className="w-5 h-5" />
          </a>
          <a
            href="#about"
            className="w-full sm:w-auto px-7 py-4 bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-bold text-base rounded-2xl border border-slate-700/80 backdrop-blur-md flex items-center justify-center gap-2 transition-all"
          >
            <span>استكشف الملف التعريفي</span>
          </a>
        </div>

        {/* Quick Highlights Bar */}
        <div className="pt-10 grid grid-cols-2 md:grid-cols-3 gap-3 max-w-3xl mx-auto text-right">
          <div className="p-3.5 bg-slate-900/60 border border-slate-800/80 backdrop-blur-md rounded-xl flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">حلول ذكية متكاملة</div>
              <div className="text-[10px] text-slate-400">نظام موديولار بالكامل</div>
            </div>
          </div>
          <div className="p-3.5 bg-slate-900/60 border border-slate-800/80 backdrop-blur-md rounded-xl flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">جودة واستدامة 100%</div>
              <div className="text-[10px] text-slate-400">معايير أمان معتمدة</div>
            </div>
          </div>
          <div className="col-span-2 md:col-span-1 p-3.5 bg-slate-900/60 border border-slate-800/80 backdrop-blur-md rounded-xl flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">خبرة استشارية</div>
              <div className="text-[10px] text-slate-400">أكثر من 500 شركاء للنجاح</div>
            </div>
          </div>
        </div>
      </div>

      {/* Down indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <a href="#slider" className="p-2 text-slate-400 hover:text-amber-400 transition-colors">
          <ChevronDown className="w-6 h-6" />
        </a>
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { CustomPageBlock } from '../../types/cms';
import { HeaderModule } from '../modules/HeaderModule';
import { TickerModule } from '../modules/TickerModule';
import { SliderModule } from '../modules/SliderModule';
import { GalleryModule } from '../modules/GalleryModule';
import { OffersModule } from '../modules/OffersModule';
import { Navbar } from './Navbar';
import { FooterModule } from '../modules/FooterModule';
import {
  ChevronRight,
  Quote,
  Volume2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Video,
  Layers,
  FileText,
  Award,
  Users,
  Clock,
  HelpCircle,
  BarChart2,
  ChevronDown,
  Play,
  ShieldCheck,
  Send,
} from 'lucide-react';

export const CustomPageRenderer: React.FC = () => {
  const { cmsData, activeCustomPageSlug, navigateToCustomPage } = useCMS();
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  if (!activeCustomPageSlug) return null;

  const page = (cmsData.customPages || []).find(
    (p) => p.slug === activeCustomPageSlug
  );

  if (!page) {
    return (
      <div className="min-h-screen bg-slate-950 text-white font-['Cairo',sans-serif] flex flex-col justify-between">
        <Navbar />
        <div className="max-w-3xl mx-auto text-center py-32 px-4 space-y-6">
          <FileText className="w-16 h-16 text-amber-400 mx-auto" />
          <h2 className="text-3xl font-black">عذراً، هذه الصفحة غير موجودة أو تم نقلها</h2>
          <button
            type="button"
            onClick={() => navigateToCustomPage(null)}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-lg transition-colors"
          >
            العودة للصفحة الرئيسية
          </button>
        </div>
        <FooterModule />
      </div>
    );
  }

  const renderBlockContent = (block: CustomPageBlock) => {
    switch (block.type) {
      /* Full CMS Modules */
      case 'ticker':
        return <TickerModule />;

      case 'slider':
        return <SliderModule />;

      case 'gallery':
        return <GalleryModule />;

      case 'offers':
        return <OffersModule />;

      /* Customized Hero Premium Block */
      case 'hero':
        return (
          <section className="py-12 md:py-20 relative overflow-hidden bg-slate-950/80 rounded-3xl border border-slate-800/80 shadow-2xl my-6">
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">
              <div
                className={`flex flex-col ${
                  block.layoutStyle === 'split' ? 'lg:flex-row items-center justify-between gap-12' : 'items-center text-center max-w-3xl mx-auto space-y-6'
                }`}
              >
                {/* Hero Text Content */}
                <div className="space-y-6 flex-1">
                  {block.badge && (
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-bold text-amber-400">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>{block.badge}</span>
                    </div>
                  )}

                  <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
                    {block.title || page.title}
                  </h1>

                  {block.subtitle && (
                    <p className="text-sm md:text-base text-slate-300 font-normal leading-relaxed">
                      {block.subtitle}
                    </p>
                  )}

                  {/* Buttons */}
                  {(block.buttonText || block.secondaryButtonText) && (
                    <div className="flex flex-wrap items-center gap-4 pt-2">
                      {block.buttonText && (
                        <button
                          type="button"
                          onClick={() => {
                            if (block.buttonUrl?.startsWith('#')) {
                              navigateToCustomPage(null);
                              setTimeout(() => {
                                document.querySelector(block.buttonUrl || '#contact')?.scrollIntoView({ behavior: 'smooth' });
                              }, 200);
                            } else if (block.buttonUrl?.startsWith('/')) {
                              const targetSlug = block.buttonUrl.replace('/?page=', '').replace('/', '');
                              navigateToCustomPage(targetSlug);
                            } else {
                              window.open(block.buttonUrl || '#', '_blank');
                            }
                          }}
                          className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-500/20 hover:scale-105 transition-all inline-flex items-center gap-2"
                        >
                          <span>{block.buttonText}</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      )}

                      {block.secondaryButtonText && (
                        <button
                          type="button"
                          onClick={() => {
                            if (block.secondaryButtonUrl?.startsWith('#')) {
                              navigateToCustomPage(null);
                              setTimeout(() => {
                                document.querySelector(block.secondaryButtonUrl || '#contact')?.scrollIntoView({ behavior: 'smooth' });
                              }, 200);
                            } else {
                              window.open(block.secondaryButtonUrl || '#', '_blank');
                            }
                          }}
                          className="px-6 py-3 bg-slate-900 border border-slate-700 text-slate-200 hover:text-white font-bold text-xs sm:text-sm rounded-xl hover:bg-slate-800 transition-colors"
                        >
                          {block.secondaryButtonText}
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Hero Image Graphic */}
                {block.imageUrl && (
                  <div className="w-full lg:w-1/2 relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl group">
                    <img
                      src={block.imageUrl}
                      alt={block.title}
                      className="w-full h-auto max-h-[420px] object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                  </div>
                )}
              </div>
            </div>
          </section>
        );

      /* STATS COUNTERS GRID */
      case 'stats':
        return (
          <div className="my-10 space-y-6">
            {(block.title || block.subtitle) && (
              <div className="text-center space-y-2">
                {block.title && <h3 className="text-2xl font-black text-white">{block.title}</h3>}
                {block.subtitle && <p className="text-xs text-slate-400">{block.subtitle}</p>}
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(block.items || []).map((stat) => (
                <div
                  key={stat.id}
                  className="p-6 bg-slate-900/80 border border-slate-800 rounded-3xl text-center space-y-2 shadow-xl hover:border-amber-500/40 transition-colors"
                >
                  <p className="text-3xl font-black text-amber-400 font-mono">{stat.value || '100+'}</p>
                  <h4 className="text-sm font-bold text-white">{stat.title}</h4>
                  {stat.subtitle && <p className="text-[11px] text-slate-400">{stat.subtitle}</p>}
                </div>
              ))}
            </div>
          </div>
        );

      /* FEATURES GRID */
      case 'features':
        return (
          <div className="my-10 space-y-6">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              {block.badge && (
                <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full text-xs font-bold">
                  {block.badge}
                </span>
              )}
              {block.title && <h3 className="text-2xl md:text-3xl font-black text-white">{block.title}</h3>}
              {block.subtitle && <p className="text-xs sm:text-sm text-slate-400">{block.subtitle}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(block.items || []).map((ft) => (
                <div
                  key={ft.id}
                  className="p-6 bg-slate-900/80 border border-slate-800 rounded-3xl space-y-3 hover:border-amber-500/50 transition-all shadow-xl group"
                >
                  <div className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl border border-amber-500/20 w-fit group-hover:scale-110 transition-transform">
                    <Award className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                    {ft.title}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{ft.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      /* TEAM MEMBERS GRID */
      case 'team':
        return (
          <div className="my-10 space-y-6">
            <div className="text-center space-y-2">
              {block.title && <h3 className="text-2xl font-black text-white">{block.title}</h3>}
              {block.subtitle && <p className="text-xs text-slate-400">{block.subtitle}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(block.items || []).map((member) => (
                <div
                  key={member.id}
                  className="p-5 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-4 hover:border-amber-500/40 transition-all shadow-xl text-center"
                >
                  <div className="w-24 h-24 mx-auto rounded-2xl overflow-hidden border-2 border-amber-500/30 shadow-lg bg-slate-950">
                    <img
                      src={
                        member.imageUrl ||
                        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'
                      }
                      alt={member.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-white">{member.title}</h4>
                    <p className="text-xs font-bold text-amber-400">{member.subtitle}</p>
                    <p className="text-xs text-slate-400 leading-relaxed pt-1">{member.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      /* TIMELINE MILESTONES */
      case 'timeline':
        return (
          <div className="my-10 space-y-6 max-w-3xl mx-auto">
            <div className="text-center space-y-2">
              {block.title && <h3 className="text-2xl font-black text-white">{block.title}</h3>}
              {block.subtitle && <p className="text-xs text-slate-400">{block.subtitle}</p>}
            </div>

            <div className="space-y-4 relative before:absolute before:right-6 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-800">
              {(block.items || []).map((item) => (
                <div key={item.id} className="relative pr-12 space-y-1">
                  <div className="absolute right-4 top-1.5 w-4 h-4 rounded-full bg-amber-500 border-4 border-slate-950 shadow-md" />
                  <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-md text-[11px] font-mono font-bold">
                    {item.date || '2026'}
                  </span>
                  <h4 className="text-base font-bold text-white pt-1">{item.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      /* FAQ ACCORDION */
      case 'faq':
        return (
          <div className="my-10 space-y-6 max-w-3xl mx-auto">
            <div className="text-center space-y-2">
              {block.title && <h3 className="text-2xl font-black text-white">{block.title}</h3>}
              {block.subtitle && <p className="text-xs text-slate-400">{block.subtitle}</p>}
            </div>

            <div className="space-y-3">
              {(block.items || []).map((fq) => {
                const isOpen = openFaqId === fq.id;
                return (
                  <div
                    key={fq.id}
                    className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-2 transition-all shadow-lg"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqId(isOpen ? null : fq.id)}
                      className="w-full flex items-center justify-between text-right gap-3"
                    >
                      <span className="text-sm font-bold text-white hover:text-amber-300 transition-colors">
                        {fq.title}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-amber-400 transition-transform ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <p className="text-xs text-slate-300 pt-2 border-t border-slate-800/80 leading-relaxed animate-in fade-in">
                        {fq.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'heading':
        return (
          <div className="text-center space-y-3 py-6 max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-black text-white leading-tight">
              {block.title || page.title}
            </h2>
            {block.subtitle && (
              <p className="text-sm text-slate-400 font-normal leading-relaxed">
                {block.subtitle}
              </p>
            )}
            <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full mx-auto" />
          </div>
        );

      case 'paragraph':
        return (
          <div className="py-2 leading-relaxed text-slate-300 text-xs sm:text-sm md:text-base">
            <p className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-3xl">
              {block.content || 'محتوى نصي تفصيلي للفقرة.'}
            </p>
          </div>
        );

      case 'quote':
        return (
          <div className="my-6 p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border-r-4 border-emerald-400 rounded-3xl relative overflow-hidden shadow-2xl space-y-3">
            <Quote className="w-10 h-10 text-emerald-400/20 absolute top-4 left-4" />
            <p className="text-base md:text-lg font-bold text-white italic leading-relaxed">
              "{block.content || 'اقتباس استراتيجي متميز'}"
            </p>
            {block.title && (
              <p className="text-xs font-bold text-amber-400 font-mono">— {block.title}</p>
            )}
          </div>
        );

      case 'video':
        return (
          <div className="my-8 space-y-3">
            {block.title && (
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Video className="w-5 h-5 text-amber-400" />
                <span>{block.title}</span>
              </h4>
            )}
            <div className="relative overflow-hidden rounded-3xl border border-slate-800 aspect-video bg-black shadow-2xl">
              <iframe
                src={block.mediaUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ'}
                title={block.title || 'فيديو تفاعلي'}
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          </div>
        );

      case 'audio':
        return (
          <div className="my-6 p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30">
                <Volume2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">{block.title || 'البودكاست الصوتي'}</h4>
                {block.subtitle && <p className="text-xs text-slate-400">{block.subtitle}</p>}
              </div>
            </div>
            <audio controls className="w-full accent-amber-500">
              <source src={block.mediaUrl} type="audio/mpeg" />
              متصفحك لا يدعم مشغل الصوت.
            </audio>
          </div>
        );

      case 'cta_button':
        return (
          <div className="my-10 p-8 bg-gradient-to-r from-amber-500/20 via-slate-900 to-emerald-500/20 border border-slate-800 rounded-3xl text-center space-y-5 shadow-2xl">
            <h3 className="text-xl md:text-2xl font-black text-white">{block.title || 'هل ترغب بالانضمام لمنظومة أوريكس؟'}</h3>
            <button
              type="button"
              onClick={() => {
                if (block.buttonUrl?.startsWith('#')) {
                  navigateToCustomPage(null);
                  setTimeout(() => {
                    document.querySelector(block.buttonUrl || '#contact')?.scrollIntoView({ behavior: 'smooth' });
                  }, 200);
                } else {
                  window.open(block.buttonUrl || '#contact', '_blank');
                }
              }}
              className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black text-sm rounded-2xl shadow-xl hover:scale-105 transition-all inline-flex items-center gap-2"
            >
              <span>{block.buttonText || 'تواصل معنا الآن'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-['Cairo',sans-serif] selection:bg-amber-500 selection:text-slate-950 flex flex-col justify-between">
      <Navbar />

      <main className="pt-28 sm:pt-32 md:pt-36 pb-16 relative overflow-hidden flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Top Breadcrumb Navigation Bar */}
          <div className="flex flex-wrap items-center justify-between bg-slate-900/80 backdrop-blur-md border border-slate-800/80 p-3 sm:p-4 rounded-2xl shadow-xl gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-bold overflow-hidden">
              <button
                type="button"
                onClick={() => navigateToCustomPage(null)}
                className="hover:text-amber-400 transition-colors shrink-0"
              >
                الرئيسية
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
              <span className="text-amber-400 font-bold truncate">{page.title}</span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => navigateToCustomPage(null)}
                className="px-3.5 py-1.5 bg-slate-950 hover:bg-slate-800 text-amber-400 text-xs font-bold rounded-xl border border-slate-800 transition-colors flex items-center gap-1.5 shadow-md"
              >
                <ChevronRight className="w-4 h-4" />
                <span>العودة للرئيسية</span>
              </button>
            </div>
          </div>

          {/* Render Page Blocks */}
          <div className="space-y-8">
            {page.blocks.map((block) => (
              <div key={block.id}>{renderBlockContent(block)}</div>
            ))}
          </div>
        </div>
      </main>

      <FooterModule />
    </div>
  );
};

import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { CarouselSlider } from '../common/CarouselSlider';
import { Eye, Target, Award, MailOpen, FileText, ArrowLeft, ShieldCheck, UserCheck, Sparkles } from 'lucide-react';

export const AboutModule: React.FC = () => {
  const { cmsData, setIsPdfModalOpen } = useCMS();
  const { about } = cmsData;

  const [activeTabId, setActiveTabId] = useState<string>(about.tabs?.[0]?.id || 'tab-vision');

  if (!about) return null;

  const getTabIcon = (iconName: string) => {
    switch (iconName) {
      case 'Eye':
        return <Eye className="w-6 h-6 text-amber-400" />;
      case 'Target':
        return <Target className="w-6 h-6 text-amber-400" />;
      case 'Award':
        return <Award className="w-6 h-6 text-amber-400" />;
      case 'MailOpen':
        return <MailOpen className="w-6 h-6 text-amber-400" />;
      default:
        return <Sparkles className="w-6 h-6 text-amber-400" />;
    }
  };

  const activeTab = (about.tabs || []).find((t) => t.id === activeTabId) || about.tabs?.[0];
  const isCarousel = (about.tabsLayoutMode || 'carousel') === 'carousel';

  return (
    <section id="about" className="py-20 bg-slate-950 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full text-xs font-bold">
            <UserCheck className="w-4 h-4" />
            <span>من نحن والرؤية الاستراتيجية</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">
            قصة التميز وقيادة التحول الذكي
          </h2>
        </div>

        {/* Executive Card & Company Paragraph */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Company Paragraph */}
          <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 md:p-10 flex flex-col justify-between space-y-6 shadow-xl backdrop-blur-md">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <span>شركة {cmsData.header.appName} {cmsData.header.slogan}</span>
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                {about.paragraph}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800/80 grid grid-cols-2 gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>حاصلة على معايير الجودة العالمية</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>كادر استشاري وطني وإقليمي متخصص</span>
              </div>
            </div>
          </div>

          {/* CEO / Leadership Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/30 rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center space-y-5 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 text-[10px] font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 border-b border-l border-amber-500/20 rounded-bl-2xl">
              قيادة المنظومة
            </div>

            <div className="relative pt-3">
              <img
                src={about.ceoPhotoUrl}
                alt={about.ceoName}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-amber-500/40 shadow-xl shadow-amber-500/10"
              />
              <span className="absolute bottom-1 right-1 p-1.5 bg-emerald-500 text-slate-950 rounded-full ring-4 ring-slate-900">
                <ShieldCheck className="w-4 h-4" />
              </span>
            </div>

            <div className="space-y-1">
              <h4 className="text-xl font-extrabold text-white">{about.ceoName}</h4>
              <p className="text-xs text-amber-400 font-semibold">{about.ceoTitle}</p>
            </div>

            <p className="text-xs text-slate-400 italic leading-relaxed px-2">
              "نضع الابتكار في خدمة الاستثمار، ونسخّر أدوات الذكاء الاصطناعي لتطوير أعمال مستدامة تليق بطموح شركائنا."
            </p>
          </div>
        </div>

        {/* Vision / Mission / Goal / Message Section - Rendered based on about.tabsLayoutMode selected in Admin */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>ركائز ورؤى المنظومة (الرؤية، الرسالة، الهدف، المهمة)</span>
            </h3>
            <span className="text-xs text-slate-400">
              {isCarousel
                ? 'تصفح الركائز الاستراتيجية عبر الكاروسال المنزلق'
                : 'اضغط على التبويب المفضل لمعاينة الركيزة الاستراتيجية'}
            </span>
          </div>

          {/* Render Sliding Carousel if configured in Admin */}
          {isCarousel ? (
            <CarouselSlider itemsPerPageDesktop={2} itemsPerPageMobile={1} autoPlay={true}>
              {(about.tabs || []).map((tab) => (
                <div
                  key={tab.id}
                  className="p-6 bg-slate-950 border border-slate-800/80 rounded-2xl space-y-3 min-h-[200px] flex flex-col justify-between hover:border-amber-500/40 transition-all shadow-lg"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl border border-amber-500/20">
                        {getTabIcon(tab.icon)}
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-white">{tab.title}</h4>
                        <span className="text-[10px] text-amber-400 font-semibold">ركيزة أساسية</span>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                      {tab.content}
                    </p>
                  </div>
                </div>
              ))}
            </CarouselSlider>
          ) : (
            /* Render Accordion / Tabs if configured in Admin */
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(about.tabs || []).map((tab) => {
                  const isActive = activeTabId === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTabId(tab.id)}
                      className={`p-4 rounded-2xl border text-right transition-all flex items-center gap-3 ${
                        isActive
                          ? 'bg-amber-500/15 border-amber-500 text-amber-300 shadow-lg shadow-amber-500/10'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                      }`}
                    >
                      <div className={`p-2 rounded-xl shrink-0 ${isActive ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800'}`}>
                        {getTabIcon(tab.icon)}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{tab.title}</div>
                        <div className="text-[10px] opacity-75">انقر للعرض</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {activeTab && (
                <div className="p-6 bg-slate-950/80 border border-slate-800/80 rounded-2xl space-y-2 animate-in fade-in duration-300">
                  <h4 className="text-base font-bold text-amber-400 flex items-center gap-2">
                    {getTabIcon(activeTab.icon)}
                    <span>{activeTab.title} شركة {cmsData.header.appName}</span>
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {activeTab.content}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom CTA Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => setIsPdfModalOpen(true)}
            className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xl shadow-red-600/20 flex items-center justify-center gap-2.5 transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>{about.downloadPdfLabel}</span>
          </button>

          <a
            href={about.learnMoreUrl || '#features'}
            className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs sm:text-sm rounded-xl border border-slate-700 flex items-center justify-center gap-2 transition-colors"
          >
            <span>{about.learnMoreLabel}</span>
            <ArrowLeft className="w-4 h-4 text-amber-400" />
          </a>
        </div>
      </div>
    </section>
  );
};

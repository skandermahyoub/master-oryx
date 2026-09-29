import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import {
  HelpCircle,
  ChevronDown,
  Search,
  MessageCircle,
  Sparkles,
  ArrowLeft,
  Tag,
} from 'lucide-react';

export const FAQModule: React.FC = () => {
  const { cmsData } = useCMS();
  const { faq } = cmsData;

  const [activeCategory, setActiveCategory] = useState<string>('الكل');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openIds, setOpenIds] = useState<string[]>(['faq-1']);

  const items = faq?.items || [];
  if (!faq || items.length === 0) return null;

  const categories = faq.categories || ['الكل'];

  // Toggle single accordion item
  const toggleItem = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filter items by category and search query
  const filteredItems = items.filter((item) => {
    const matchesCategory =
      activeCategory === 'الكل' || item.category === activeCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="faq" className="py-20 md:py-28 bg-slate-900/60 border-t border-slate-800 relative overflow-hidden">
      {/* Background Subtle Accents */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        {/* Section Header */}
        <div className="text-center space-y-3">
          {faq.badge && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-400">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{faq.badge}</span>
            </div>
          )}

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
            {faq.sectionTitle}
          </h2>

          {faq.sectionSubtitle && (
            <p className="text-sm sm:text-base text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto">
              {faq.sectionSubtitle}
            </p>
          )}
        </div>

        {/* Search Bar & Categories Filter */}
        <div className="space-y-4">
          <div className="relative max-w-xl mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث في الأسئلة الشائعة..."
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 pr-11 pl-4 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 shadow-xl transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {categories.length > 1 && (
            <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
              {categories.map((cat, idx) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                        : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Accordion Questions List */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 bg-slate-950/60 rounded-3xl border border-slate-800">
            <HelpCircle className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-sm text-slate-400 font-bold">لم نجد نتائج مطابقة لبحثك</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredItems.map((item) => {
              const isOpen = openIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden shadow-lg ${
                    isOpen
                      ? 'bg-slate-950 border-amber-500/50 shadow-amber-500/5'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(item.id)}
                    className="w-full p-5 sm:p-6 text-right flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <div className="space-y-1 flex-1">
                      {item.category && item.category !== 'الكل' && (
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20 inline-block mb-1">
                          {item.category}
                        </span>
                      )}
                      <h3
                        className={`text-sm sm:text-base font-bold transition-colors ${
                          isOpen ? 'text-amber-400' : 'text-white'
                        }`}
                      >
                        {item.question}
                      </h3>
                    </div>

                    <div
                      className={`p-2 rounded-xl shrink-0 transition-transform duration-300 ${
                        isOpen
                          ? 'bg-amber-500 text-slate-950 rotate-180'
                          : 'bg-slate-900 text-slate-400'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/80 animate-in fade-in duration-200">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom CTA Box */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500/10 via-slate-950 to-emerald-500/10 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right shadow-2xl">
          <div className="space-y-1">
            <h4 className="text-base font-bold text-white flex items-center justify-center sm:justify-start gap-2">
              <MessageCircle className="w-4 h-4 text-amber-400" />
              <span>لم تجد إجابة لسؤالك؟</span>
            </h4>
            <p className="text-xs text-slate-400">
              فريق مستشاري أوريكس جاهز للرد على كافة استفساراتك الفنية والاستراتيجية فورياً
            </p>
          </div>

          <a
            href={faq.ctaUrl || '#contact'}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 shrink-0 transition-all cursor-pointer"
          >
            <span>{faq.ctaText || 'تواصل معنا الآن'}</span>
            <ArrowLeft className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

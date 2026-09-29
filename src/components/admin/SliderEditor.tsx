import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { SlideItem } from '../../types/cms';
import { AIImageModal } from '../common/AIImageModal';
import { Sliders, Plus, Trash2, Save, Check, Sparkles, Upload, Image as ImageIcon } from 'lucide-react';

export const SliderEditor: React.FC = () => {
  const { cmsData, updateModuleData } = useCMS();
  const { slider } = cmsData;

  const [slides, setSlides] = useState<SlideItem[]>(slider.slides || []);
  const [autoPlayInterval, setAutoPlayInterval] = useState(slider.autoPlayInterval || 6000);
  const [savedNotice, setSavedNotice] = useState(false);

  // AI Modal active slide target index
  const [activeSlideIndex, setActiveSlideIndex] = useState<number | null>(null);

  // Sync state if slider changes in context
  React.useEffect(() => {
    if (slider) {
      setSlides(slider.slides || []);
      setAutoPlayInterval(slider.autoPlayInterval || 6000);
    }
  }, [slider]);

  const handleSave = () => {
    updateModuleData('slider', {
      autoPlayInterval,
      slides,
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleAddSlide = () => {
    const newSlide: SlideItem = {
      id: `slide-${Date.now()}`,
      bgImageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
      title: 'عنوان شريحة جديدة',
      subtitle: 'تفاصيل ووصف الشريحة الجاذب للزوار',
      ctaText: 'اعرف أكثر',
      ctaUrl: '#contact',
      badge: 'جديد 2026',
    };
    setSlides([...slides, newSlide]);
  };

  const handleRemoveSlide = (id: string) => {
    setSlides(slides.filter((s) => s.id !== id));
  };

  const handleUpdateSlide = (id: string, updated: Partial<SlideItem>) => {
    setSlides(slides.map((s) => (s.id === id ? { ...s, ...updated } : s)));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          handleUpdateSlide(id, { bgImageUrl: event.target.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8">
      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-400" />
            <span>لوحة تحكم الموديول الثاني: السلايدر السينمائي</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            إضافة وتعديل وحذف الشرائح السينمائية وتخصيص الصور بالذكاء الاصطناعي
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all"
        >
          {savedNotice ? <Check className="w-4 h-4 text-emerald-950" /> : <Save className="w-4 h-4" />}
          <span>{savedNotice ? 'تم الحفظ بنجاح!' : 'حفظ التعديلات'}</span>
        </button>
      </div>

      {/* AutoPlay Timer */}
      <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <label className="text-xs font-bold text-white block">زمن الانتقال التلقائي بين الشرائح (بالمللي ثانية):</label>
          <span className="text-[11px] text-slate-400">مثال: 6000 تعني 6 ثوانٍ لكل شريحة</span>
        </div>
        <input
          type="number"
          step="1000"
          min="2000"
          value={autoPlayInterval}
          onChange={(e) => setAutoPlayInterval(Number(e.target.value))}
          className="w-32 bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white text-center focus:outline-none"
        />
      </div>

      {/* Slides Editor Cards */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-white">قائمة الشرائح المعروضة ({slides.length}):</h4>
          <button
            type="button"
            onClick={handleAddSlide}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة شريحة جديدة</span>
          </button>
        </div>

        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-4 relative group"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono font-bold text-amber-400">الشريحة #{idx + 1}</span>
              <button
                type="button"
                onClick={() => handleRemoveSlide(slide.id)}
                className="p-1.5 text-red-400 hover:text-white hover:bg-red-500/20 rounded-lg transition-colors text-xs flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" />
                <span>حذف الشريحة</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300">العنوان الرئيسي للشريحة:</label>
                <input
                  type="text"
                  value={slide.title}
                  onChange={(e) => handleUpdateSlide(slide.id, { title: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300">شارة الشريحة (Badge):</label>
                <input
                  type="text"
                  value={slide.badge}
                  onChange={(e) => handleUpdateSlide(slide.id, { badge: e.target.value })}
                  placeholder="مثال: حزمة ذكية 2026"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-[11px] font-bold text-slate-300">العنوان الفرعي للشريحة:</label>
                <input
                  type="text"
                  value={slide.subtitle}
                  onChange={(e) => handleUpdateSlide(slide.id, { subtitle: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300">نص زر الانتقال (CTA):</label>
                <input
                  type="text"
                  value={slide.ctaText}
                  onChange={(e) => handleUpdateSlide(slide.id, { ctaText: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-300">رابط الانتقال (CTA Link):</label>
                  <span className="text-[10px] text-amber-400 font-bold">ربط بصفحة</span>
                </div>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={slide.ctaUrl}
                    onChange={(e) => handleUpdateSlide(slide.id, { ctaUrl: e.target.value })}
                    placeholder="/?page=about-us أو #about"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none font-mono flex-1"
                  />
                  <select
                    onChange={(e) => {
                      if (e.target.value) handleUpdateSlide(slide.id, { ctaUrl: e.target.value });
                    }}
                    defaultValue=""
                    className="bg-slate-950 border border-slate-700 rounded-xl px-2 text-[10px] text-amber-300 font-bold focus:outline-none cursor-pointer"
                    title="اختر صفحة مخصصة"
                  >
                    <option value="" disabled>اختر...</option>
                    {(cmsData.customPages || []).map((cp) => (
                      <option key={cp.id} value={`/?page=${cp.slug}`}>
                        {cp.title} (/{cp.slug})
                      </option>
                    ))}
                    <option value="#contact">تواصل معنا</option>
                    <option value="#offers">العروض</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Slide Image Box */}
            <div className="pt-2 border-t border-slate-900 flex flex-col sm:flex-row items-center gap-4">
              <div className="w-full sm:w-36 h-20 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shrink-0">
                <img src={slide.bgImageUrl} alt="Slide preview" className="w-full h-full object-cover" />
              </div>

              <div className="flex-1 space-y-2 w-full">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400">رابط الصورة المباشر:</label>
                  <input
                    type="text"
                    value={slide.bgImageUrl}
                    onChange={(e) => handleUpdateSlide(slide.id, { bgImageUrl: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveSlideIndex(idx)}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] rounded-lg flex items-center gap-1 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>توليد بالذكاء الاصطناعي</span>
                  </button>

                  <label className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold rounded-lg cursor-pointer flex items-center gap-1 border border-slate-700">
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>رفع من الجهاز</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, slide.id)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Modal */}
      {activeSlideIndex !== null && (
        <AIImageModal
          isOpen={true}
          onClose={() => setActiveSlideIndex(null)}
          onApplyImage={(url) => {
            if (activeSlideIndex !== null && slides[activeSlideIndex]) {
              handleUpdateSlide(slides[activeSlideIndex].id, { bgImageUrl: url });
            }
            setActiveSlideIndex(null);
          }}
          title="توليد خلفية الشريحة بالذكاء الاصطناعي"
          defaultPrompt="صورة خلفية سينمائية لتطبيق ذكي وخدمات استثمارية باللون الكحلي والذهبي"
          recommendedDimensions="9:16 للجوال و 16:9 للشاشات الكبيرة"
          aspectRatio="16:9"
        />
      )}
    </div>
  );
};

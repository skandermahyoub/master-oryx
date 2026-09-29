import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { AIImageModal } from '../common/AIImageModal';
import { Sparkles, Image as ImageIcon, Save, Check, Upload, Link as LinkIcon, Info } from 'lucide-react';

export const HeaderEditor: React.FC = () => {
  const { cmsData, updateModuleData } = useCMS();
  const { header } = cmsData;

  const [appName, setAppName] = useState(header.appName);
  const [slogan, setSlogan] = useState(header.slogan);
  const [welcomeTitle, setWelcomeTitle] = useState(header.welcomeTitle);
  const [welcomeSubtitle, setWelcomeSubtitle] = useState(header.welcomeSubtitle);
  const [logoUrl, setLogoUrl] = useState(header.logoUrl);
  const [bgImageUrl, setBgImageUrl] = useState(header.bgImageUrl);
  const [ctaText, setCtaText] = useState(header.ctaText);
  const [ctaUrl, setCtaUrl] = useState(header.ctaUrl);
  const [showInHero, setShowInHero] = useState(header.showInHero);

  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  // Sync state if header changes in context
  React.useEffect(() => {
    if (header) {
      setAppName(header.appName);
      setSlogan(header.slogan);
      setWelcomeTitle(header.welcomeTitle);
      setWelcomeSubtitle(header.welcomeSubtitle);
      setLogoUrl(header.logoUrl);
      setBgImageUrl(header.bgImageUrl);
      setCtaText(header.ctaText);
      setCtaUrl(header.ctaUrl);
      setShowInHero(header.showInHero);
    }
  }, [header]);

  const handleSave = () => {
    updateModuleData('header', {
      appName,
      slogan,
      welcomeTitle,
      welcomeSubtitle,
      logoUrl,
      bgImageUrl,
      ctaText,
      ctaUrl,
      showInHero,
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setLogoUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBgFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setBgImageUrl(event.target.result as string);
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
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>لوحة تحكم الموديول الأول: الهيدر الهيرو والشريط الثابت</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            تخصيص الهيرو الكبير وشريط الملاحة الثابت المعروض أعلى الموقع عند التمرير لأسفل
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

      {/* Recommended Dimensions Banner */}
      <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-200 leading-relaxed">
          <strong>دليل المقاسات المفضل للتصميم:</strong>
          <ul className="list-disc list-inside mt-1 space-y-0.5 text-amber-300/90">
            <li><strong>شعار المؤسسة (Logo):</strong> مقاس مربّع متناسب مثل 250x250 بكسل أو 512x512 بكسل بخلفية شفافة PNG.</li>
            <li><strong>صورة خلفية الهيرو الرئيسية (Hero Background):</strong> مقاس 1920x1080 بكسل (بنسبة 16:9) عالية الدقة HD/4K.</li>
          </ul>
        </div>
      </div>

      {/* Main Form Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Brand Name & Slogan */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-200">اسم المنشأة / المؤسسة:</label>
          <input
            type="text"
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-200">السلوجون (الشعار اللفظي):</label>
          <input
            type="text"
            value={slogan}
            onChange={(e) => setSlogan(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Hero Welcome Title */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-bold text-slate-200">العنوان الترحيبي الرئيسي للهيرو:</label>
          <input
            type="text"
            value={welcomeTitle}
            onChange={(e) => setWelcomeTitle(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Hero Welcome Subtitle */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-bold text-slate-200">العنوان الفرعي التوضيحي:</label>
          <textarea
            rows={2}
            value={welcomeSubtitle}
            onChange={(e) => setWelcomeSubtitle(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* CTA Button Text & URL */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-200">نص زر الدعوة لاتخاذ إجراء (CTA):</label>
          <input
            type="text"
            value={ctaText}
            onChange={(e) => setCtaText(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-200">رابط الانتقال عند الضغط على الزر (CTA URL):</label>
            <span className="text-[10px] text-amber-400 font-bold">ربط مباشر بصفحة</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={ctaUrl}
              onChange={(e) => setCtaUrl(e.target.value)}
              placeholder="مثال: /?page=about-us أو #contact"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500 font-mono flex-1"
            />
            <select
              onChange={(e) => {
                if (e.target.value) setCtaUrl(e.target.value);
              }}
              defaultValue=""
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-amber-300 font-bold focus:outline-none cursor-pointer"
            >
              <option value="" disabled>اختر صفحة مخصصة...</option>
              {(cmsData.customPages || []).map((cp) => (
                <option key={cp.id} value={`/?page=${cp.slug}`}>
                  {cp.title} (/{cp.slug})
                </option>
              ))}
              <option value="#about">قسم عن المنظومة (#about)</option>
              <option value="#contact">نموذج التواصل (#contact)</option>
              <option value="#offers">قسم العروض (#offers)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Logo Section */}
      <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-amber-400" />
          <span>تخصيص شعار المؤسسة (Logo)</span>
        </h4>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-slate-900 border border-slate-700 overflow-hidden flex items-center justify-center p-2 shrink-0">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo preview" className="w-full h-full object-contain" />
            ) : (
              <span className="text-xs text-slate-500">لا يوجد شعار</span>
            )}
          </div>

          <div className="flex-1 space-y-3 w-full">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-300">رابط مباشر للشعار (Logo URL):</label>
              <input
                type="text"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1.5 transition-colors border border-slate-700">
                <Upload className="w-3.5 h-3.5 text-amber-400" />
                <span>رفع شعار من الجهاز</span>
                <input type="file" accept="image/*" onChange={handleLogoFileUpload} className="hidden" />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Background Image Section with AI Prompt Generation */}
      <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-amber-400" />
            <span>صورة خلفية الهيرو الرئيسية</span>
          </h4>

          {/* AI Prompt Generator Button */}
          <button
            type="button"
            onClick={() => setAiModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-1.5 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>توليد بالذكاء الاصطناعي (AI Prompt)</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-full sm:w-48 h-28 rounded-2xl bg-slate-900 border border-slate-700 overflow-hidden shrink-0">
            {bgImageUrl ? (
              <img src={bgImageUrl} alt="Hero BG preview" className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs text-slate-500 flex items-center justify-center h-full">لا توجد خلفية</span>
            )}
          </div>

          <div className="flex-1 space-y-3 w-full">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-300">رابط مباشر لصورة الخلفية:</label>
              <input
                type="text"
                value={bgImageUrl}
                onChange={(e) => setBgImageUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1.5 transition-colors border border-slate-700">
                <Upload className="w-3.5 h-3.5 text-amber-400" />
                <span>رفع صورة من الجهاز</span>
                <input type="file" accept="image/*" onChange={handleBgFileUpload} className="hidden" />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* AI Image Modal */}
      <AIImageModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        onApplyImage={(url) => setBgImageUrl(url)}
        title="توليد خلفية الهيرو بالذكاء الاصطناعي"
        defaultPrompt="خلفية سينمائية فاخرة لشركة حلول استثمارية وتقنية باللون الذهبي والكحلي"
        recommendedDimensions="1920x1080 (16:9)"
        aspectRatio="16:9"
      />
    </div>
  );
};

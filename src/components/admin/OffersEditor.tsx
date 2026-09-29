import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { OfferItem } from '../../types/cms';
import { AIImageModal } from '../common/AIImageModal';
import { Sparkles, Plus, Trash2, Save, Check, Upload, LayoutGrid } from 'lucide-react';

export const OffersEditor: React.FC = () => {
  const { cmsData, updateModuleData } = useCMS();
  const { offers } = cmsData;

  const [sectionTitle, setSectionTitle] = useState(offers.sectionTitle);
  const [sectionSubtitle, setSectionSubtitle] = useState(offers.sectionSubtitle);
  const [layoutType, setLayoutType] = useState(offers.layoutType || 'split_3');
  const [items, setItems] = useState<OfferItem[]>(offers.items || []);
  const [savedNotice, setSavedNotice] = useState(false);

  // AI image target index
  const [activeOfferIndex, setActiveOfferIndex] = useState<number | null>(null);

  // Sync state if offers change in context
  React.useEffect(() => {
    if (offers) {
      setSectionTitle(offers.sectionTitle);
      setSectionSubtitle(offers.sectionSubtitle);
      setLayoutType(offers.layoutType || 'split_3');
      setItems(offers.items || []);
    }
  }, [offers]);

  const handleSave = () => {
    updateModuleData('offers', {
      sectionTitle,
      sectionSubtitle,
      layoutType,
      items,
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleAddItem = () => {
    const newItem: OfferItem = {
      id: `off-${Date.now()}`,
      title: 'إعلان أو عرض استثماري جديد',
      subtitle: 'وصف تفصيلي وحصري للمستفيدين من الخدمة',
      bgImageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      linkUrl: '#contact',
      badge: 'عرض جديد',
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const handleUpdateItem = (id: string, updated: Partial<OfferItem>) => {
    setItems(items.map((i) => (i.id === id ? { ...i, ...updated } : i)));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          handleUpdateItem(id, { bgImageUrl: event.target.result as string });
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
            <span>لوحة تحكم الموديول الثامن: العروض المميزة والإعلانات</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            صناعة الإعلانات والعروض المخصصة واختيار نماذج التقسيم (هيرو، رباعي، ثنائي، ثلاثي)
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

      {/* Layout Selection */}
      <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
        <label className="text-xs font-bold text-white flex items-center gap-2">
          <LayoutGrid className="w-4 h-4 text-amber-400" />
          <span>اختر نموذج تقسيم شبكة الإعلانات (Layout Mode):</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {[
            { id: 'split_3', label: 'ثلاثية مقسمة (هيرو رئيسي + 2 أفقي)' },
            { id: 'grid_4', label: 'رباعية متساوية (4 Grid)' },
            { id: 'horizontal_2', label: 'ثنائية أفقية (2 Grid)' },
            { id: 'vertical_2', label: 'ثنائية عمودية (Column)' },
            { id: 'carousel', label: 'كاروسال منزلق' },
          ].map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => setLayoutType(mode.id as any)}
              className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
                layoutType === mode.id
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Items */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-white">العروض والإعلانات ({items.length}):</h4>
          <button
            type="button"
            onClick={handleAddItem}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة إعلان/عرض جديد</span>
          </button>
        </div>

        {items.map((item, idx) => (
          <div key={item.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-mono font-bold text-amber-400">الإعلان #{idx + 1}</span>
              <button
                type="button"
                onClick={() => handleRemoveItem(item.id)}
                className="p-1 text-red-400 hover:text-white hover:bg-red-500/20 rounded-lg text-xs flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>حذف</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-slate-400">العنوان الرئيسي للإعلان:</label>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => handleUpdateItem(item.id, { title: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400">شارة الإعلان (Badge):</label>
                <input
                  type="text"
                  value={item.badge}
                  onChange={(e) => handleUpdateItem(item.id, { badge: e.target.value })}
                  placeholder="مثال: خصم 30%"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] text-slate-400">العنوان الفرعي التوضيحي:</label>
                <input
                  type="text"
                  value={item.subtitle}
                  onChange={(e) => handleUpdateItem(item.id, { subtitle: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] text-slate-400">رابط الانتقال عند الضغط على البطاقة:</label>
                  <span className="text-[10px] text-amber-400 font-bold">ربط بصفحة مخصصة</span>
                </div>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={item.linkUrl}
                    onChange={(e) => handleUpdateItem(item.id, { linkUrl: e.target.value })}
                    placeholder="#contact أو /?page=about-us"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none font-mono flex-1"
                  />
                  <select
                    onChange={(e) => {
                      if (e.target.value) handleUpdateItem(item.id, { linkUrl: e.target.value });
                    }}
                    defaultValue=""
                    className="bg-slate-950 border border-slate-700 rounded-xl px-2 text-[10px] text-amber-300 font-bold focus:outline-none cursor-pointer"
                    title="اختر صفحة للربط التلقائي"
                  >
                    <option value="" disabled>صفحة...</option>
                    {(cmsData.customPages || []).map((cp) => (
                      <option key={cp.id} value={`/?page=${cp.slug}`}>
                        {cp.title} (/{cp.slug})
                      </option>
                    ))}
                    <option value="#contact">نموذج التواصل</option>
                    <option value="#about">عن المنظومة</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Background Image Box with AI Prompt */}
            <div className="pt-2 border-t border-slate-900 flex flex-col sm:flex-row items-center gap-4">
              <img src={item.bgImageUrl} alt="Offer preview" className="w-full sm:w-32 h-20 object-cover rounded-xl bg-slate-900 border border-slate-800 shrink-0" />
              <div className="flex-1 space-y-2 w-full">
                <input
                  type="text"
                  value={item.bgImageUrl}
                  onChange={(e) => handleUpdateItem(item.id, { bgImageUrl: e.target.value })}
                  placeholder="رابط الصورة المباشر"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveOfferIndex(idx)}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] rounded-lg flex items-center gap-1 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>توليد بالذكاء الاصطناعي</span>
                  </button>
                  <label className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold rounded-lg cursor-pointer flex items-center gap-1 border border-slate-700">
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>رفع صورة</span>
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, item.id)} className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Image Modal */}
      {activeOfferIndex !== null && (
        <AIImageModal
          isOpen={true}
          onClose={() => setActiveOfferIndex(null)}
          onApplyImage={(url) => {
            if (activeOfferIndex !== null && items[activeOfferIndex]) {
              handleUpdateItem(items[activeOfferIndex].id, { bgImageUrl: url });
            }
            setActiveOfferIndex(null);
          }}
          title="توليد صورة الإعلان بالذكاء الاصطناعي"
          defaultPrompt="تصميم إعلاني سينمائي فاخر لعروض تقنية واستثمارية باللون الكحلي والذهبي"
          recommendedDimensions="800x600 (4:3) أو 16:9"
          aspectRatio="16:9"
        />
      )}
    </div>
  );
};

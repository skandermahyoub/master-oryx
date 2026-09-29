import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { FeatureItem } from '../../types/cms';
import { Award, Plus, Trash2, Save, Check, Sliders, LayoutGrid } from 'lucide-react';

export const FeaturesEditor: React.FC = () => {
  const { cmsData, updateModuleData } = useCMS();
  const { features } = cmsData;

  const [sectionTitle, setSectionTitle] = useState(features.sectionTitle);
  const [sectionSubtitle, setSectionSubtitle] = useState(features.sectionSubtitle);
  const [layoutMode, setLayoutMode] = useState<'grid' | 'carousel'>(features.layoutMode || 'grid');
  const [items, setItems] = useState<FeatureItem[]>(features.items || []);
  const [savedNotice, setSavedNotice] = useState(false);

  // Sync state if features change in context
  React.useEffect(() => {
    if (features) {
      setSectionTitle(features.sectionTitle);
      setSectionSubtitle(features.sectionSubtitle);
      setLayoutMode(features.layoutMode || 'grid');
      setItems(features.items || []);
    }
  }, [features]);

  const handleSave = () => {
    updateModuleData('features', {
      sectionTitle,
      sectionSubtitle,
      layoutMode,
      items,
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleAddItem = () => {
    const newItem: FeatureItem = {
      id: `feat-${Date.now()}`,
      title: 'ميزة جديدة تنافسية',
      description: 'شرح مقتضب يوضح للعميل تفاصيل الفائدة والقيمة المضافة.',
      icon: 'Award',
      badgeOrStat: 'جديد',
      isDigitalCard: false,
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const handleUpdateItem = (id: string, updated: Partial<FeatureItem>) => {
    setItems(items.map((i) => (i.id === id ? { ...i, ...updated } : i)));
  };

  return (
    <div className="space-y-8 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8">
      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span>لوحة تحكم الموديول الخامس: ما يميزنا والبطاقات الرقمية</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            إضافة وتعديل وحذف البطاقات المتميزة مع الأيقونات والشارات واختيار نمط العرض
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

      {/* Internal Display Mode Selector */}
      <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
        <label className="text-xs font-bold text-white flex items-center gap-2">
          <Sliders className="w-4 h-4 text-amber-400" />
          <span>اختر نمط عرض بطاقات المميزات بالصفحة الرئيسية:</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setLayoutMode('grid')}
            className={`p-3.5 rounded-xl border text-right transition-all flex items-center gap-3 ${
              layoutMode === 'grid'
                ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <LayoutGrid className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-white">شبكة بطاقات ثابتة (Grid Mode)</div>
              <div className="text-[10px] text-slate-400">عرض جميع المميزات في شبكة من 3 أعمدة</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setLayoutMode('carousel')}
            className={`p-3.5 rounded-xl border text-right transition-all flex items-center gap-3 ${
              layoutMode === 'carousel'
                ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Sliders className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-white">كاروسال منزلق (Sliding Carousel)</div>
              <div className="text-[10px] text-slate-400">عرض المميزات في مضمار كاروسال منزلق بأسهم تنقل</div>
            </div>
          </button>
        </div>
      </div>

      {/* Titles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-200">عنوان الموديول الرئيسي:</label>
          <input
            type="text"
            value={sectionTitle}
            onChange={(e) => setSectionTitle(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-200">العنوان الفرعي التوضيحي:</label>
          <input
            type="text"
            value={sectionSubtitle}
            onChange={(e) => setSectionSubtitle(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
          />
        </div>
      </div>

      {/* Feature Items */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-white">بطاقات المميزات ({items.length}):</h4>
          <button
            type="button"
            onClick={handleAddItem}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة بطاقة ميزة جديدة</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item, idx) => (
            <div key={item.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-mono font-bold text-amber-400">البطاقة #{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveItem(item.id)}
                  className="p-1 text-red-400 hover:text-white hover:bg-red-500/20 rounded-lg text-xs flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>حذف</span>
                </button>
              </div>

              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400">عنوان الميزة:</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => handleUpdateItem(item.id, { title: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400">الشارة أو الإحصائية:</label>
                    <input
                      type="text"
                      value={item.badgeOrStat}
                      onChange={(e) => handleUpdateItem(item.id, { badgeOrStat: e.target.value })}
                      placeholder="مثال: +99%"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400">رمز الأيقونة:</label>
                  <select
                    value={item.icon}
                    onChange={(e) => handleUpdateItem(item.id, { icon: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none"
                  >
                    <option value="BrainCircuit">ذكاء اصطناعي (BrainCircuit)</option>
                    <option value="Zap">سرعة فائقة (Zap)</option>
                    <option value="ShieldCheck">أمان وتشفير (ShieldCheck)</option>
                    <option value="Headphones">دعم استشاري (Headphones)</option>
                    <option value="SlidersHorizontal">تعديل مرن (SlidersHorizontal)</option>
                    <option value="Link">ربط API (Link)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400">وصف الميزة التفصيلي:</label>
                  <textarea
                    rows={2}
                    value={item.description}
                    onChange={(e) => handleUpdateItem(item.id, { description: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id={`digital-${item.id}`}
                    checked={item.isDigitalCard}
                    onChange={(e) => handleUpdateItem(item.id, { isDigitalCard: e.target.checked })}
                    className="rounded border-slate-700 text-amber-500 focus:ring-amber-500"
                  />
                  <label htmlFor={`digital-${item.id}`} className="text-xs text-amber-300 font-semibold cursor-pointer">
                    تصميم كبطاقة رقمية فاخرة ببريق ذهبي
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

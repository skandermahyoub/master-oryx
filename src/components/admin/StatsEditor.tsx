import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { StatItem } from '../../types/cms';
import {
  BarChart2,
  Plus,
  Trash2,
  Save,
  Check,
  Award,
  Users,
  Zap,
  Globe,
  ShieldCheck,
  TrendingUp,
  Clock,
  Sparkles,
  LayoutGrid,
} from 'lucide-react';

export const StatsEditor: React.FC = () => {
  const { cmsData, updateModuleData } = useCMS();
  const stats = cmsData.stats || {
    badge: 'أرقام وإنجازات 2026',
    sectionTitle: 'حقائق وأرقام ترسم مسيرة نجاحنا',
    sectionSubtitle: 'مؤشرات أداء استثنائية تؤكد مكانتنا الريادية',
    layoutStyle: 'grid_4',
    items: [],
  };

  const [sectionTitle, setSectionTitle] = useState(stats.sectionTitle);
  const [sectionSubtitle, setSectionSubtitle] = useState(stats.sectionSubtitle);
  const [badge, setBadge] = useState(stats.badge || '');
  const [layoutStyle, setLayoutStyle] = useState<'grid_4' | 'cards' | 'banner' | 'glow'>(
    stats.layoutStyle || 'grid_4'
  );
  const [items, setItems] = useState<StatItem[]>(stats.items || []);
  const [savedNotice, setSavedNotice] = useState(false);

  // Sync state if stats change in context
  React.useEffect(() => {
    if (cmsData.stats) {
      setSectionTitle(cmsData.stats.sectionTitle);
      setSectionSubtitle(cmsData.stats.sectionSubtitle);
      setBadge(cmsData.stats.badge || '');
      setLayoutStyle(cmsData.stats.layoutStyle || 'grid_4');
      setItems(cmsData.stats.items || []);
    }
  }, [cmsData.stats]);

  const handleSave = () => {
    updateModuleData('stats', {
      sectionTitle,
      sectionSubtitle,
      badge,
      layoutStyle,
      items,
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleSelectLayout = (style: 'grid_4' | 'cards' | 'banner' | 'glow') => {
    setLayoutStyle(style);
    updateModuleData('stats', { layoutStyle: style });
  };

  const handleAddItem = () => {
    const newItem: StatItem = {
      id: `stat-${Date.now()}`,
      value: '+١٠٠',
      label: 'مؤشر إنجاز جديد',
      description: 'وصف تفصيلي يوضح أثر هذا الرقم للعملاء والشركاء.',
      icon: 'Award',
    };
    const updated = [...items, newItem];
    setItems(updated);
    updateModuleData('stats', { items: updated });
  };

  const handleRemoveItem = (id: string) => {
    const updated = items.filter((i) => i.id !== id);
    setItems(updated);
    updateModuleData('stats', { items: updated });
  };

  const handleUpdateItem = (id: string, updatedProps: Partial<StatItem>) => {
    const updated = items.map((i) => (i.id === id ? { ...i, ...updatedProps } : i));
    setItems(updated);
    updateModuleData('stats', { items: updated });
  };

  return (
    <div className="space-y-8 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-amber-400" />
            <span>لوحة تحكم موديول الأرقام والإحصائيات الحية (Stats)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            إدارة مؤشرات النجاح، الأرقام المئوية، معدلات الرضا، وأشكال العرض
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={handleAddItem}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة رقم / إحصائية</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all shrink-0 cursor-pointer"
          >
            {savedNotice ? <Check className="w-4 h-4 text-emerald-950" /> : <Save className="w-4 h-4" />}
            <span>{savedNotice ? 'تم الحفظ بنجاح!' : 'حفظ التعديلات'}</span>
          </button>
        </div>
      </div>

      {/* Main Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-slate-950 border border-slate-800 rounded-2xl">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-200">شارة القسم (Badge):</label>
          <input
            type="text"
            value={badge}
            onChange={(e) => {
              setBadge(e.target.value);
              updateModuleData('stats', { badge: e.target.value });
            }}
            placeholder="مثال: أرقام وإنجازات 2026"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-200">عنوان القسم الرئيسي:</label>
          <input
            type="text"
            value={sectionTitle}
            onChange={(e) => {
              setSectionTitle(e.target.value);
              updateModuleData('stats', { sectionTitle: e.target.value });
            }}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-bold text-slate-200">الوصف الفرعي التوضيحي:</label>
          <textarea
            rows={2}
            value={sectionSubtitle}
            onChange={(e) => {
              setSectionSubtitle(e.target.value);
              updateModuleData('stats', { sectionSubtitle: e.target.value });
            }}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
          />
        </div>

        {/* Layout Style Selector */}
        <div className="space-y-2 md:col-span-2 pt-2 border-t border-slate-800">
          <label className="text-xs font-bold text-white flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 text-amber-400" />
            <span>طريقة العرض وتصميم بطاقات الأرقام:</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'grid_4', label: 'شبكي كلاسيكي فاخر (Grid)' },
              { id: 'cards', label: 'بطاقات متدرجة (Gradient Cards)' },
              { id: 'banner', label: 'شريط عرضي مدمج (Banner)' },
              { id: 'glow', label: 'توهج نيون مستقبلي (Neon Glow)' },
            ].map((style) => (
              <button
                key={style.id}
                type="button"
                onClick={() => handleSelectLayout(style.id as any)}
                className={`p-3 rounded-2xl border text-xs font-bold transition-all text-center cursor-pointer ${
                  layoutStyle === style.id
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-black'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {style.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Items List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-white">بطاقات الأرقام والإحصائيات ({items.length}):</h4>
          <span className="text-xs text-slate-400">يمكنك تعديل القيم والأيقونات فورياً</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item, idx) => (
            <div
              key={item.id}
              className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-4 hover:border-slate-700 transition-all shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-amber-400">
                  الإحصائية رقم #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveItem(item.id)}
                  className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                  title="حذف هذا الرقم"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300">القيمة / الرقم:</label>
                  <input
                    type="text"
                    value={item.value}
                    onChange={(e) => handleUpdateItem(item.id, { value: e.target.value })}
                    placeholder="مثال: +٥٠٠ أو ٩٩.٨٪"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-mono font-bold focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300">نوع الأيقونة:</label>
                  <select
                    value={item.icon || 'Award'}
                    onChange={(e) => handleUpdateItem(item.id, { icon: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-amber-300 font-bold focus:outline-none cursor-pointer"
                  >
                    <option value="Award">وسام التميز (Award)</option>
                    <option value="Users">الشركاء والعملاء (Users)</option>
                    <option value="Zap">السرعة والأتمتة (Zap)</option>
                    <option value="Globe">الانتشار العالمي (Globe)</option>
                    <option value="ShieldCheck">الأمان والجودة (ShieldCheck)</option>
                    <option value="TrendingUp">النمو والأرباح (TrendingUp)</option>
                    <option value="Clock">الدعم على مدار الساعة (Clock)</option>
                    <option value="BarChart2">رسم بياني (BarChart2)</option>
                  </select>
                </div>

                <div className="space-y-1 col-span-2">
                  <label className="text-[11px] font-bold text-slate-300">نص العنوان (Label):</label>
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) => handleUpdateItem(item.id, { label: e.target.value })}
                    placeholder="مثال: مشروع رقمي منجز"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-bold focus:outline-none"
                  />
                </div>

                <div className="space-y-1 col-span-2">
                  <label className="text-[11px] font-bold text-slate-300">الوصف الفرعي التوضيحي:</label>
                  <input
                    type="text"
                    value={item.description || ''}
                    onChange={(e) => handleUpdateItem(item.id, { description: e.target.value })}
                    placeholder="مثال: في مختلف قطاعات الأعمال بالمملكة"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-300 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

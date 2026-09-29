import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { TickerItem, CategoryType } from '../../types/cms';
import { Megaphone, Plus, Trash2, Save, Check, Sliders, ArrowLeftRight } from 'lucide-react';

export const TickerEditor: React.FC = () => {
  const { cmsData, updateModuleData } = useCMS();
  const { ticker } = cmsData;

  const [items, setItems] = useState<TickerItem[]>(ticker.items || []);
  const [speed, setSpeed] = useState(ticker.speed || 30);
  const [direction, setDirection] = useState<'leftToRight' | 'rightToLeft'>(ticker.direction || 'leftToRight');
  const [savedNotice, setSavedNotice] = useState(false);

  // Sync state if ticker changes in context
  React.useEffect(() => {
    if (ticker) {
      setItems(ticker.items || []);
      setSpeed(ticker.speed || 30);
      setDirection(ticker.direction || 'leftToRight');
    }
  }, [ticker]);

  const handleSave = () => {
    updateModuleData('ticker', {
      speed,
      direction,
      items,
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleAddItem = () => {
    const newItem: TickerItem = {
      id: `tick-${Date.now()}`,
      text: 'عنصر نصي جديد للشريط المتحرك',
      category: 'announcement',
      link: '#',
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const handleUpdateItem = (id: string, updated: Partial<TickerItem>) => {
    setItems(items.map((i) => (i.id === id ? { ...i, ...updated } : i)));
  };

  return (
    <div className="space-y-8 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8">
      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-amber-400" />
            <span>لوحة تحكم الموديول الثالث: الشريط النصي المتحرك</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            إضافة وإدارة عناصر الشريط المتحرك، اتجاه الحركة (من اليسار لليمين)، وسرعة الحركة
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

      {/* Global Ticker Controls (Speed & Direction) */}
      <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Direction Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-white flex items-center gap-2">
            <ArrowLeftRight className="w-4 h-4 text-amber-400" />
            <span>اتجاه حركة الشريط النصي:</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setDirection('leftToRight')}
              className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                direction === 'leftToRight'
                  ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span>من اليسار لليمين (المحدد بالبرومبت) ←</span>
            </button>

            <button
              type="button"
              onClick={() => setDirection('rightToLeft')}
              className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                direction === 'rightToLeft'
                  ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span>من اليمين لليسار →</span>
            </button>
          </div>
        </div>

        {/* Speed Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>زمن دورة الحركة الكاملة (السرعة):</span>
            </label>
            <span className="text-xs font-mono font-bold text-amber-400">{speed} ثانية</span>
          </div>
          <input
            type="range"
            min={10}
            max={60}
            step={5}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>سريع جداً (10ث)</span>
            <span>متوسط (30ث)</span>
            <span>بطيء ومهدئ (60ث)</span>
          </div>
        </div>
      </div>

      {/* Items Editor List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-white">العناصر المسجلة بالشريط ({items.length}):</h4>
          <button
            type="button"
            onClick={handleAddItem}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة عنصر للشريط</span>
          </button>
        </div>

        {items.map((item, idx) => (
          <div
            key={item.id}
            className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-mono font-bold text-amber-400">العنصر #{idx + 1}</span>
              <button
                type="button"
                onClick={() => handleRemoveItem(item.id)}
                className="p-1 text-red-400 hover:text-white hover:bg-red-500/20 rounded-lg text-xs flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>حذف</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-3 space-y-1">
                <label className="text-[11px] font-bold text-slate-300">التصنيف الأيقوني:</label>
                <select
                  value={item.category}
                  onChange={(e) =>
                    handleUpdateItem(item.id, { category: e.target.value as CategoryType })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none"
                >
                  <option value="news">أخبار (News)</option>
                  <option value="offer">عرض مميز (Featured Offer)</option>
                  <option value="announcement">إعلان (Announcement)</option>
                  <option value="marketing">عبارات تسويقية (Marketing)</option>
                  <option value="uncategorized">بلا تصنيف (Uncategorized)</option>
                </select>
              </div>

              <div className="sm:col-span-6 space-y-1">
                <label className="text-[11px] font-bold text-slate-300">نص العنصر النصي المتحرك:</label>
                <input
                  type="text"
                  value={item.text}
                  onChange={(e) => handleUpdateItem(item.id, { text: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="sm:col-span-3 space-y-1">
                <label className="text-[11px] font-bold text-slate-300">رابط الانتقال (اختياري):</label>
                <input
                  type="text"
                  value={item.link}
                  onChange={(e) => handleUpdateItem(item.id, { link: e.target.value })}
                  placeholder="#offers"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

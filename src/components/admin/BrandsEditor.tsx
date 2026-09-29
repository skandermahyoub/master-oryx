import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { BrandItem } from '../../types/cms';
import { Building2, Plus, Trash2, Save, Check, Upload, Sliders, LayoutGrid, Square, RectangleHorizontal, Sparkles, Image as ImageIcon } from 'lucide-react';

export const BrandsEditor: React.FC = () => {
  const { cmsData, updateModuleData } = useCMS();
  const { brands } = cmsData;

  const [sectionTitle, setSectionTitle] = useState(brands.sectionTitle || 'شركاء النجاح وأبرز العلامات التجارية');
  const [sectionSubtitle, setSectionSubtitle] = useState(brands.sectionSubtitle || 'شراكات استراتيجية متينة مع منظومات رائدة');
  const [layoutMode, setLayoutMode] = useState<'carousel' | 'grid'>(brands.layoutMode || 'carousel');
  const [logoCardShape, setLogoCardShape] = useState<'rectangular' | 'square'>(
    brands.logoCardShape === 'square' ? 'square' : 'rectangular'
  );
  const [imageFit, setImageFit] = useState<'cover' | 'contain'>(brands.imageFit || 'cover');
  const [isGrayscale, setIsGrayscale] = useState(brands.isGrayscale ?? false);
  const [displayMode, setDisplayMode] = useState(brands.displayMode || 'logo_text_rating');
  const [items, setItems] = useState<BrandItem[]>(brands.items || []);
  const [savedNotice, setSavedNotice] = useState(false);

  // Sync state if brands change in context
  React.useEffect(() => {
    if (brands) {
      setSectionTitle(brands.sectionTitle || 'شركاء النجاح وأبرز العلامات التجارية');
      setSectionSubtitle(brands.sectionSubtitle || 'شراكات استراتيجية متينة مع منظومات رائدة');
      setLayoutMode(brands.layoutMode || 'carousel');
      setLogoCardShape(brands.logoCardShape === 'square' ? 'square' : 'rectangular');
      setImageFit(brands.imageFit || 'cover');
      setIsGrayscale(brands.isGrayscale ?? false);
      setDisplayMode(brands.displayMode || 'logo_text_rating');
      setItems(brands.items || []);
    }
  }, [brands]);

  const handleSave = () => {
    updateModuleData('brands', {
      sectionTitle,
      sectionSubtitle,
      layoutMode,
      logoCardShape,
      imageFit,
      isGrayscale,
      displayMode,
      items,
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleAddItem = () => {
    const newItem: BrandItem = {
      id: `brand-${Date.now()}`,
      name: 'شركة شريكة جديدة',
      logoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
      label: 'قطاع الاستثمار',
      text: 'شريك استراتيجي في الحلول الذكية والتوسع المؤسسي',
      rating: 5,
    };
    const updated = [...items, newItem];
    setItems(updated);
    updateModuleData('brands', { items: updated });
  };

  const handleRemoveItem = (id: string) => {
    const updated = items.filter((i) => i.id !== id);
    setItems(updated);
    updateModuleData('brands', { items: updated });
  };

  const handleUpdateItem = (id: string, updated: Partial<BrandItem>) => {
    const next = items.map((i) => (i.id === id ? { ...i, ...updated } : i));
    setItems(next);
    updateModuleData('brands', { items: next });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          handleUpdateItem(id, { logoUrl: event.target.result as string });
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
            <Building2 className="w-5 h-5 text-amber-400" />
            <span>لوحة تحكم الموديول السابع: العلامات التجارية وشركاء النجاح</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            عرض صور وشعارات الشركاء والعملاء بملء الإطار الكامل وبدون أي هوامش جانبية
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all cursor-pointer"
        >
          {savedNotice ? <Check className="w-4 h-4 text-emerald-950" /> : <Save className="w-4 h-4" />}
          <span>{savedNotice ? 'تم الحفظ بنجاح!' : 'حفظ التعديلات'}</span>
        </button>
      </div>

      {/* Display Mode & Frame Shape */}
      <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-5">
        <div>
          <label className="text-xs font-bold text-white flex items-center gap-2 mb-2.5">
            <Sliders className="w-4 h-4 text-amber-400" />
            <span>١. نمط عرض البطاقات بالواجهة:</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setLayoutMode('carousel');
                updateModuleData('brands', { layoutMode: 'carousel' });
              }}
              className={`p-3.5 rounded-xl border text-right transition-all flex items-center gap-3 cursor-pointer ${
                layoutMode === 'carousel'
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <Sliders className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <div className="text-xs font-bold text-white">كاروسال منزلق تفاعلي (Sliding Carousel)</div>
                <div className="text-[10px] text-slate-400">عرض البطاقات في شريط منزلق متحرك تلقائياً</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setLayoutMode('grid');
                updateModuleData('brands', { layoutMode: 'grid' });
              }}
              className={`p-3.5 rounded-xl border text-right transition-all flex items-center gap-3 cursor-pointer ${
                layoutMode === 'grid'
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <LayoutGrid className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <div className="text-xs font-bold text-white">شبكة أعمدة متناسقة (Grid Columns)</div>
                <div className="text-[10px] text-slate-400">عرض البطاقات في شبكة أعمدة منتظمة</div>
              </div>
            </button>
          </div>
        </div>

        {/* Full-Bleed Logo Frame Shape */}
        <div className="pt-4 border-t border-slate-800">
          <label className="text-xs font-bold text-white flex items-center gap-2 mb-2.5">
            <RectangleHorizontal className="w-4 h-4 text-amber-400" />
            <span>٢. مقاس وشكل إطار الصورة (كامل الحواف بدون أي هوامش جانبية وبدون أي نصوص تغطي الصورة):</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                id: 'rectangular',
                label: 'مستطيل عريض كامل الحواف (16:10 / 16:9)',
                desc: 'صورة نقية ممتلئة العرض بالكامل مع عرض بيانات الشريك تحتها',
                icon: <RectangleHorizontal className="w-4 h-4 text-amber-400" />,
              },
              {
                id: 'square',
                label: 'مربع كامل الحواف (1:1 Square)',
                desc: 'صورة نقية ممتلئة الإطار مربع 1:1 مع عرض بيانات الشريك تحتها',
                icon: <Square className="w-4 h-4 text-amber-400" />,
              },
            ].map((shape) => (
              <button
                key={shape.id}
                type="button"
                onClick={() => {
                  setLogoCardShape(shape.id as any);
                  updateModuleData('brands', { logoCardShape: shape.id as any });
                }}
                className={`p-3.5 rounded-xl border text-right transition-all flex items-start gap-3 cursor-pointer ${
                  logoCardShape === shape.id
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-sm font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <div className="p-1 rounded bg-slate-950 border border-slate-800 shrink-0">{shape.icon}</div>
                <div>
                  <div className="text-xs text-white">{shape.label}</div>
                  <div className="text-[10px] text-slate-400 mt-1 leading-relaxed">{shape.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Object Fit Control */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <label className="text-xs font-bold text-white flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-amber-400" />
              <span>طريقة ملء الصورة للإطار:</span>
            </label>
            <p className="text-[11px] text-slate-400 mt-0.5">
              اختيار Cover يملأ الإطار بالكامل بدون أي فراغ أبيض، بينما Contain يظهر الصورة كاملة
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setImageFit('cover');
                updateModuleData('brands', { imageFit: 'cover' });
              }}
              className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                imageFit === 'cover'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-black'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              ملء كامل (Cover - مثل البروفايل)
            </button>
            <button
              type="button"
              onClick={() => {
                setImageFit('contain');
                updateModuleData('brands', { imageFit: 'contain' });
              }}
              className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                imageFit === 'contain'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-black'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              احتواء داخلي (Contain)
            </button>
          </div>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-slate-200">عنوان الموديول الرئيسي:</label>
          <input
            type="text"
            value={sectionTitle}
            onChange={(e) => {
              setSectionTitle(e.target.value);
              updateModuleData('brands', { sectionTitle: e.target.value });
            }}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none mt-1"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-200">العنوان الفرعي التوضيحي:</label>
          <input
            type="text"
            value={sectionSubtitle}
            onChange={(e) => {
              setSectionSubtitle(e.target.value);
              updateModuleData('brands', { sectionSubtitle: e.target.value });
            }}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none mt-1"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-200">طريقة عرض عناصر العلامة التجارية:</label>
          <select
            value={displayMode}
            onChange={(e) => {
              setDisplayMode(e.target.value as any);
              updateModuleData('brands', { displayMode: e.target.value as any });
            }}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none mt-1"
          >
            <option value="logo_only">عرض الصور فقط بدون نصوص سفلية</option>
            <option value="logo_label">صور + تسمية التصنيف / القطاع</option>
            <option value="logo_rating">صور + نجوم التقييم</option>
            <option value="logo_text_rating">صور + نص فرعي + نجوم التقييم</option>
            <option value="logo_text">صور + نص فرعي فقط</option>
          </select>
        </div>

        <div className="flex items-center gap-3 pt-6">
          <input
            type="checkbox"
            id="grayscale-toggle"
            checked={isGrayscale}
            onChange={(e) => {
              setIsGrayscale(e.target.checked);
              updateModuleData('brands', { isGrayscale: e.target.checked });
            }}
            className="rounded border-slate-700 text-amber-500 focus:ring-amber-500"
          />
          <label htmlFor="grayscale-toggle" className="text-xs font-bold text-slate-200 cursor-pointer">
            عرض الصور باللون الأبيض والأسود (Grayscale) وتلوينها عند تمرير الفأرة
          </label>
        </div>
      </div>

      {/* Items List */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-white">بطاقات الشركاء والعملاء ({items.length}):</h4>
          <button
            type="button"
            onClick={handleAddItem}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة علامة تجارية</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item, idx) => (
            <div key={item.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 relative group">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {/* Image Preview / Container - Edge to Edge preview */}
                  <div className="w-16 h-14 bg-slate-900 border border-slate-700 rounded-xl relative overflow-hidden shrink-0">
                    <img src={item.logoUrl} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-amber-400">#0{idx + 1}</span>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleUpdateItem(item.id, { name: e.target.value })}
                      placeholder="اسم الشركة / العلامة"
                      className="text-xs font-bold text-white bg-transparent border-b border-transparent focus:border-amber-500 focus:outline-none w-full block"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveItem(item.id)}
                  className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Logo Upload & URL */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-300">رابط أو رفع الصورة:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item.logoUrl}
                    onChange={(e) => handleUpdateItem(item.id, { logoUrl: e.target.value })}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
                    placeholder="https://..."
                  />
                  <label className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 cursor-pointer">
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleLogoUpload(e, item.id)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Label & Text Details */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400">التصنيف / القطاع:</label>
                  <input
                    type="text"
                    value={item.label || ''}
                    onChange={(e) => handleUpdateItem(item.id, { label: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1 text-xs text-white mt-0.5"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400">التقييم (1 - 5):</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={item.rating || 5}
                    onChange={(e) => handleUpdateItem(item.id, { rating: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1 text-xs text-white mt-0.5"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400">نبذة الشراكة:</label>
                <input
                  type="text"
                  value={item.text || ''}
                  onChange={(e) => handleUpdateItem(item.id, { text: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1 text-xs text-white mt-0.5"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { TestimonialItem } from '../../types/cms';
import { Star, Plus, Trash2, Save, Check, Inbox, Sliders, LayoutGrid } from 'lucide-react';

export const TestimonialsEditor: React.FC = () => {
  const { cmsData, updateModuleData, setAdminSubSection } = useCMS();
  const { testimonials } = cmsData;

  const [sectionTitle, setSectionTitle] = useState(testimonials.sectionTitle);
  const [sectionSubtitle, setSectionSubtitle] = useState(testimonials.sectionSubtitle);
  const [layoutMode, setLayoutMode] = useState<'carousel' | 'grid'>(testimonials.layoutMode || 'carousel');
  const [layoutStyle, setLayoutStyle] = useState(testimonials.layoutStyle || 'rating_photo');
  const [items, setItems] = useState<TestimonialItem[]>(testimonials.items || []);
  const [savedNotice, setSavedNotice] = useState(false);

  const pendingCount = items.filter((i) => i.status === 'pending').length;

  // Sync state if testimonials update in context
  React.useEffect(() => {
    if (testimonials) {
      setSectionTitle(testimonials.sectionTitle);
      setSectionSubtitle(testimonials.sectionSubtitle);
      setLayoutMode(testimonials.layoutMode || 'carousel');
      setLayoutStyle(testimonials.layoutStyle || 'rating_photo');
      setItems(testimonials.items || []);
    }
  }, [testimonials]);

  const handleSave = () => {
    updateModuleData('testimonials', {
      sectionTitle,
      sectionSubtitle,
      layoutMode,
      layoutStyle,
      items,
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleAddItem = () => {
    const newItem: TestimonialItem = {
      id: `test-${Date.now()}`,
      clientName: 'عميل جديد',
      clientRole: 'الرئيس التنفيذي',
      clientPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      reviewText: 'تجربة رائعة مع منظومة أوريكس الذكية.',
      rating: 5,
      status: 'approved',
      date: new Date().toISOString().split('T')[0],
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const handleUpdateItem = (id: string, updated: Partial<TestimonialItem>) => {
    setItems(items.map((i) => (i.id === id ? { ...i, ...updated } : i)));
  };

  return (
    <div className="space-y-8 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8">
      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <span>لوحة تحكم الموديول السادس: شهادات التقدير والتقييمات</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            إدارة تقييمات العملاء، اختيار نمط العرض (كاروسال منزلق أو شبكي) والموافقة على الشهادات
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

      {/* Inbox Link Notification */}
      {pendingCount > 0 && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-amber-300 font-bold">
            <Inbox className="w-4 h-4 text-amber-400" />
            <span>يوجد {pendingCount} شهادات/تقييمات قادمة تنتظر الموافقة في صندوق البريد الداخلي!</span>
          </div>
          <button
            type="button"
            onClick={() => setAdminSubSection('inbox')}
            className="px-3 py-1.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl"
          >
            الانتقال للبريد الداخلي
          </button>
        </div>
      )}

      {/* Display Mode Selection: Carousel vs Grid */}
      <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
        <label className="text-xs font-bold text-white flex items-center gap-2">
          <Sliders className="w-4 h-4 text-amber-400" />
          <span>اختر طريقة عرض بطاقات التقييمات في الواجهة الرئيسية:</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              <div className="text-xs font-bold text-white">كاروسال منزلق تفاعلي (Sliding Carousel)</div>
              <div className="text-[10px] text-slate-400">عرض التقييمات في مضمار منزلق بأسهم تنقل وسحب باللمس</div>
            </div>
          </button>

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
              <div className="text-xs font-bold text-white">شبكة ثابتة (Grid Mode)</div>
              <div className="text-[10px] text-slate-400">عرض التقييمات في شبكة ثابتة بأعمدة متساوية</div>
            </div>
          </button>
        </div>
      </div>

      {/* Settings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-bold text-slate-200">عنوان الموديول الرئيسي:</label>
          <input
            type="text"
            value={sectionTitle}
            onChange={(e) => setSectionTitle(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-200">العنوان الفرعي التوضيحي:</label>
          <input
            type="text"
            value={sectionSubtitle}
            onChange={(e) => setSectionSubtitle(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-200">نمط عرض تفاصيل البطاقة:</label>
          <select
            value={layoutStyle}
            onChange={(e) => setLayoutStyle(e.target.value as any)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
          >
            <option value="rating_photo">تقييم نجوم + صورة واسم ونص</option>
            <option value="photo_name_text">صورة واسم ونص (بدون نجوم)</option>
            <option value="name_text_only">اسم ونص فقط (بدون صورة)</option>
          </select>
        </div>
      </div>

      {/* Items List */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-white">الشهادات والتقييمات المعتمدة ({items.length}):</h4>
          <button
            type="button"
            onClick={handleAddItem}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة تقييم جديد يدويًا</span>
          </button>
        </div>

        <div className="space-y-4">
          {items.map((item, idx) => (
            <div key={item.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-mono font-bold text-amber-400">تقييم #{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveItem(item.id)}
                  className="p-1 text-red-400 hover:text-white hover:bg-red-500/20 rounded-lg text-xs flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>حذف</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400">اسم العميل:</label>
                  <input
                    type="text"
                    value={item.clientName}
                    onChange={(e) => handleUpdateItem(item.id, { clientName: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400">الصفة / المسمى:</label>
                  <input
                    type="text"
                    value={item.clientRole}
                    onChange={(e) => handleUpdateItem(item.id, { clientRole: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400">التقييم (النجوم):</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={item.rating}
                    onChange={(e) => handleUpdateItem(item.id, { rating: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="text-[10px] text-slate-400">نص الشهادة / التقييم:</label>
                  <textarea
                    rows={2}
                    value={item.reviewText}
                    onChange={(e) => handleUpdateItem(item.id, { reviewText: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none"
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

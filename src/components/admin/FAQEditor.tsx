import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { FAQItem } from '../../types/cms';
import {
  HelpCircle,
  Plus,
  Trash2,
  Save,
  Check,
  Tag,
  MessageSquare,
} from 'lucide-react';

export const FAQEditor: React.FC = () => {
  const { cmsData, updateModuleData } = useCMS();
  const faq = cmsData.faq || {
    badge: 'الأسئلة الشائعة والأجوبة',
    sectionTitle: 'إجابات وافية لكل ما يدور في ذهنك',
    sectionSubtitle: 'تعرف على تفاصيل المنظومة، الاشتراكات، الأمان، والدعم الفني',
    categories: ['الكل', 'المنظومة والحلول', 'الاشتراكات والأسعار', 'الأمان والتكامل', 'الدعم الفني'],
    ctaText: 'تواصل مع مستشارينا لمزيد من التفاصيل',
    ctaUrl: '#contact',
    items: [],
  };

  const [sectionTitle, setSectionTitle] = useState(faq.sectionTitle);
  const [sectionSubtitle, setSectionSubtitle] = useState(faq.sectionSubtitle);
  const [badge, setBadge] = useState(faq.badge || '');
  const [ctaText, setCtaText] = useState(faq.ctaText || 'تواصل معنا الآن');
  const [ctaUrl, setCtaUrl] = useState(faq.ctaUrl || '#contact');
  const [categories, setCategories] = useState<string[]>(faq.categories || ['الكل']);
  const [items, setItems] = useState<FAQItem[]>(faq.items || []);
  const [newCatInput, setNewCatInput] = useState('');
  const [savedNotice, setSavedNotice] = useState(false);

  // Sync state if faq changes in context
  React.useEffect(() => {
    if (cmsData.faq) {
      setSectionTitle(cmsData.faq.sectionTitle);
      setSectionSubtitle(cmsData.faq.sectionSubtitle);
      setBadge(cmsData.faq.badge || '');
      setCtaText(cmsData.faq.ctaText || 'تواصل معنا الآن');
      setCtaUrl(cmsData.faq.ctaUrl || '#contact');
      setCategories(cmsData.faq.categories || ['الكل']);
      setItems(cmsData.faq.items || []);
    }
  }, [cmsData.faq]);

  const handleSave = () => {
    updateModuleData('faq', {
      sectionTitle,
      sectionSubtitle,
      badge,
      ctaText,
      ctaUrl,
      categories,
      items,
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleAddCategory = () => {
    const trimmed = newCatInput.trim();
    if (trimmed && !categories.includes(trimmed)) {
      const updated = [...categories, trimmed];
      setCategories(updated);
      updateModuleData('faq', { categories: updated });
      setNewCatInput('');
    }
  };

  const handleRemoveCategory = (cat: string) => {
    if (cat === 'الكل') return;
    const updated = categories.filter((c) => c !== cat);
    setCategories(updated);
    updateModuleData('faq', { categories: updated });
  };

  const handleAddItem = () => {
    const newItem: FAQItem = {
      id: `faq-${Date.now()}`,
      question: 'سؤال شائع جديد يطرحه المستفيدون؟',
      answer: 'اكتب الإجابة النموذجية الوافية هنا لتوضيح الإجراءات والقيمة للعميل.',
      category: categories[1] || 'عام',
    };
    const updated = [newItem, ...items];
    setItems(updated);
    updateModuleData('faq', { items: updated });
  };

  const handleRemoveItem = (id: string) => {
    const updated = items.filter((i) => i.id !== id);
    setItems(updated);
    updateModuleData('faq', { items: updated });
  };

  const handleUpdateItem = (id: string, updatedProps: Partial<FAQItem>) => {
    const updated = items.map((i) => (i.id === id ? { ...i, ...updatedProps } : i));
    setItems(updated);
    updateModuleData('faq', { items: updated });
  };

  return (
    <div className="space-y-8 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-400" />
            <span>لوحة تحكم موديول الأسئلة الشائعة والأجوبة (FAQ)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            إدارة بنك الأسئلة التفاعلي الأكورديون، التصنيفات، والإجابات ومحرك البحث
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={handleAddItem}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition-all shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة سؤال جديد</span>
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
              updateModuleData('faq', { badge: e.target.value });
            }}
            placeholder="مثال: الأسئلة الشائعة والأجوبة"
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
              updateModuleData('faq', { sectionTitle: e.target.value });
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
              updateModuleData('faq', { sectionSubtitle: e.target.value });
            }}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
          />
        </div>

        {/* CTA Button Settings */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-200">نص زر الدعوة للتواصل بأسفل الأسئلة:</label>
          <input
            type="text"
            value={ctaText}
            onChange={(e) => {
              setCtaText(e.target.value);
              updateModuleData('faq', { ctaText: e.target.value });
            }}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-200">رابط زر التواصل:</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={ctaUrl}
              onChange={(e) => {
                setCtaUrl(e.target.value);
                updateModuleData('faq', { ctaUrl: e.target.value });
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-mono focus:outline-none flex-1"
            />
            <select
              onChange={(e) => {
                if (e.target.value) {
                  setCtaUrl(e.target.value);
                  updateModuleData('faq', { ctaUrl: e.target.value });
                }
              }}
              defaultValue=""
              className="bg-slate-900 border border-slate-700 rounded-xl px-2 text-xs text-amber-300 font-bold focus:outline-none cursor-pointer"
            >
              <option value="" disabled>صفحة...</option>
              {(cmsData.customPages || []).map((cp) => (
                <option key={cp.id} value={`/?page=${cp.slug}`}>
                  {cp.title} (/{cp.slug})
                </option>
              ))}
              <option value="#contact">نموذج التواصل</option>
            </select>
          </div>
        </div>
      </div>

      {/* Categories Manager */}
      <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
        <label className="text-xs font-bold text-white flex items-center gap-2">
          <Tag className="w-4 h-4 text-amber-400" />
          <span>تصنيفات وفلاتر الأسئلة الشائعة:</span>
        </label>

        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-200"
            >
              <span>{cat}</span>
              {cat !== 'الكل' && (
                <button
                  type="button"
                  onClick={() => handleRemoveCategory(cat)}
                  className="text-slate-400 hover:text-red-400 cursor-pointer"
                >
                  ×
                </button>
              )}
            </span>
          ))}
        </div>

        <div className="flex gap-2 max-w-md pt-2">
          <input
            type="text"
            value={newCatInput}
            onChange={(e) => setNewCatInput(e.target.value)}
            placeholder="اسم تصنيف جديد..."
            className="bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none flex-1"
          />
          <button
            type="button"
            onClick={handleAddCategory}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs rounded-xl border border-slate-700 cursor-pointer"
          >
            إضافة تصنيف
          </button>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-white">قائمة الأسئلة والأجوبة ({items.length}):</h4>
          <span className="text-xs text-slate-400">يمكنك تعديل أي سؤال وإجابته فورياً</span>
        </div>

        <div className="space-y-4">
          {items.map((item, idx) => (
            <div
              key={item.id}
              className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-4 hover:border-slate-700 transition-all shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-400">
                    السؤال #{idx + 1}
                  </span>
                  <select
                    value={item.category || categories[1] || 'الكل'}
                    onChange={(e) => handleUpdateItem(item.id, { category: e.target.value })}
                    className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-[11px] text-amber-300 font-bold focus:outline-none"
                  >
                    {categories
                      .filter((c) => c !== 'الكل')
                      .map((cat, cIdx) => (
                        <option key={cIdx} value={cat}>
                          {cat}
                        </option>
                      ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveItem(item.id)}
                  className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
                  title="حذف هذا السؤال"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300">نص السؤال:</label>
                  <input
                    type="text"
                    value={item.question}
                    onChange={(e) => handleUpdateItem(item.id, { question: e.target.value })}
                    placeholder="اكتب السؤال..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-bold focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300">نص الإجابة النموذجية الكاملة:</label>
                  <textarea
                    rows={3}
                    value={item.answer}
                    onChange={(e) => handleUpdateItem(item.id, { answer: e.target.value })}
                    placeholder="اكتب الإجابة الشاملة..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 leading-relaxed focus:outline-none"
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

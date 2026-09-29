import React, { useState } from 'react';
import { useStore } from '../../../context/StoreContext';
import { ProductCategory } from '../../../types/store';
import {
  Layers,
  Plus,
  Trash2,
  Edit,
  Save,
  Check,
  Smartphone,
  Laptop,
  Headphones,
  Watch,
  Package,
  Sparkles,
  Tag,
  ShieldCheck,
  FolderTree,
} from 'lucide-react';

const AVAILABLE_ICONS = [
  { name: 'Smartphone', label: 'هواتف وأجهزة', icon: Smartphone },
  { name: 'Laptop', label: 'حواسيب ولابتوب', icon: Laptop },
  { name: 'Headphones', label: 'سماعات وصوتيات', icon: Headphones },
  { name: 'Watch', label: 'ساعات وأساور', icon: Watch },
  { name: 'Package', label: 'حزمة وملحقات', icon: Package },
  { name: 'Sparkles', label: 'عروض مميزة', icon: Sparkles },
  { name: 'Tag', label: 'تخفيضات وتصنيف', icon: Tag },
  { name: 'ShieldCheck', label: 'أصلي ومضمون', icon: ShieldCheck },
];

export const CategoriesManager: React.FC = () => {
  const { storeConfig, updateStoreConfig } = useStore();
  const [categories, setCategories] = useState<ProductCategory[]>(storeConfig.categories || []);
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const products = storeConfig.products || [];

  const handleSaveAll = (updated: ProductCategory[]) => {
    setCategories(updated);
    updateStoreConfig({ categories: updated });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleStartAdd = () => {
    const newCat: ProductCategory = {
      id: `cat-${Date.now()}`,
      name: 'قسم جديد',
      slug: `category-${Date.now()}`,
      icon: 'Tag',
      description: 'وصف مختصر للتصنيف والمنتجات المشمولة فيه',
    };
    setEditingCategory(newCat);
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    const count = products.filter((p) => p.category === id).length;
    if (count > 0) {
      if (
        !confirm(
          `تنبيه: هذا القسم يحتوي على (${count}) منتجات حالياً. هل أنت متأكد من حذفه؟`
        )
      ) {
        return;
      }
    } else {
      if (!confirm('هل أنت متأكد من حذف هذا القسم؟')) return;
    }

    const updated = categories.filter((c) => c.id !== id);
    handleSaveAll(updated);
  };

  const handleSaveCategory = (cat: ProductCategory) => {
    let updated: ProductCategory[];
    if (isAdding) {
      updated = [...categories, cat];
    } else {
      updated = categories.map((c) => (c.id === cat.id ? cat : c));
    }
    handleSaveAll(updated);
    setEditingCategory(null);
    setIsAdding(false);
  };

  return (
    <div className="space-y-6 text-right">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <FolderTree className="w-5 h-5 text-amber-400" />
            <span>نظام إدارة التصنيفات والأقسام ({categories.length})</span>
          </h3>
          <p className="text-xs text-slate-400">
            إنشاء وتعديل أقسام المتجر الرقمي، تخصيص الأيقونات، وتوزيع المنتجات لتسهيل التصفح
          </p>
        </div>

        <button
          type="button"
          onClick={handleStartAdd}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-1.5 transition-all cursor-pointer self-start"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة قسم جديد</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-400 font-bold text-center">
          تم حفظ التصنيفات بنجاح وتحديث أقسام المتجر!
        </div>
      )}

      {/* Edit / Add Modal Form */}
      {editingCategory && (
        <div className="p-6 bg-slate-950 border border-amber-500/40 rounded-3xl space-y-5 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-sm font-black text-amber-400">
              {isAdding ? 'إضافة قسم جديد للمتجر' : `تعديل القسم: ${editingCategory.name}`}
            </h4>
            <button
              type="button"
              onClick={() => {
                setEditingCategory(null);
                setIsAdding(false);
              }}
              className="text-xs text-slate-400 hover:text-white"
            >
              إلغاء
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300">اسم القسم العربي *</label>
              <input
                type="text"
                value={editingCategory.name}
                onChange={(e) =>
                  setEditingCategory({ ...editingCategory, name: e.target.value })
                }
                placeholder="مثال: الهواتف الذكية"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white mt-1 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300">الاسم اللطيف (Slug) *</label>
              <input
                type="text"
                value={editingCategory.slug}
                onChange={(e) =>
                  setEditingCategory({
                    ...editingCategory,
                    slug: e.target.value.toLowerCase().replace(/\s+/g, '-'),
                  })
                }
                placeholder="phones-and-tablets"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white mt-1 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300">وصف القسم وفائدته للمشتري:</label>
            <textarea
              rows={2}
              value={editingCategory.description || ''}
              onChange={(e) =>
                setEditingCategory({ ...editingCategory, description: e.target.value })
              }
              placeholder="اكتب نبذة موجزة عن نوعية المنتجات الموجودة بهذا القسم..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white mt-1 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Icon Picker */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300">أيقونة القسم التعبيرية:</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {AVAILABLE_ICONS.map((ic) => {
                const IconComp = ic.icon;
                const isSelected = editingCategory.icon === ic.name;
                return (
                  <button
                    key={ic.name}
                    type="button"
                    onClick={() =>
                      setEditingCategory({ ...editingCategory, icon: ic.name })
                    }
                    className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <IconComp className="w-4 h-4 shrink-0" />
                    <span className="truncate">{ic.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => {
                setEditingCategory(null);
                setIsAdding(false);
              }}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="button"
              onClick={() => handleSaveCategory(editingCategory)}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>حفظ القسم</span>
            </button>
          </div>
        </div>
      )}

      {/* Categories Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const productCount = products.filter((p) => p.category === cat.id).length;
          const iconObj = AVAILABLE_ICONS.find((i) => i.name === cat.icon) || AVAILABLE_ICONS[0];
          const IconComp = iconObj.icon;

          return (
            <div
              key={cat.id}
              className="p-5 bg-slate-950 border border-slate-800 hover:border-amber-500/40 rounded-2xl space-y-3 transition-all relative group shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-amber-400">
                  <IconComp className="w-5 h-5" />
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCategory(cat);
                      setIsAdding(false);
                    }}
                    className="p-2 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-xl border border-slate-800 transition-colors cursor-pointer"
                    title="تعديل القسم"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(cat.id)}
                    className="p-2 bg-slate-900 hover:bg-red-500/10 text-slate-500 hover:text-red-400 rounded-xl border border-slate-800 transition-colors cursor-pointer"
                    title="حذف القسم"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-black text-white">{cat.name}</h4>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {cat.description || 'لا يوجد وصف مخصص لهذا القسم'}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="font-mono text-[10px] text-slate-500">slug: {cat.slug}</span>
                <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {productCount} منتجات
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

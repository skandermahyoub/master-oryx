import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { MODULE_METADATA } from '../../data/defaultPreset';
import { ModuleKey } from '../../types/cms';
import {
  GripVertical,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  PanelTop,
  Sliders,
  Megaphone,
  UserCheck,
  Award,
  Sparkles,
  Star,
  Building2,
  BookOpen,
  PhoneCall,
  PanelBottom,
  Check,
  Image as ImageIcon,
  BarChart2,
  HelpCircle,
  ShoppingBag,
} from 'lucide-react';

export const ModuleReorderList: React.FC = () => {
  const { cmsData, reorderModules, moveModule, toggleModuleVisibility, setAdminSubSection } = useCMS();
  const [draggedKey, setDraggedKey] = useState<ModuleKey | null>(null);
  const [dragOverKey, setDragOverKey] = useState<ModuleKey | null>(null);

  const getModuleIcon = (key: ModuleKey) => {
    switch (key) {
      case 'header':
        return <PanelTop className="w-5 h-5 text-amber-400" />;
      case 'slider':
        return <Sliders className="w-5 h-5 text-blue-400" />;
      case 'ticker':
        return <Megaphone className="w-5 h-5 text-purple-400" />;
      case 'about':
        return <UserCheck className="w-5 h-5 text-emerald-400" />;
      case 'stats':
        return <BarChart2 className="w-5 h-5 text-amber-400" />;
      case 'features':
        return <Award className="w-5 h-5 text-amber-400" />;
      case 'offers':
        return <Sparkles className="w-5 h-5 text-amber-400" />;
      case 'testimonials':
        return <Star className="w-5 h-5 text-yellow-400" />;
      case 'brands':
        return <Building2 className="w-5 h-5 text-indigo-400" />;
      case 'store':
        return <ShoppingBag className="w-5 h-5 text-amber-400" />;
      case 'gallery':
        return <ImageIcon className="w-5 h-5 text-amber-400" />;
      case 'faq':
        return <HelpCircle className="w-5 h-5 text-cyan-400" />;
      case 'blog':
        return <BookOpen className="w-5 h-5 text-pink-400" />;
      case 'contact':
        return <PhoneCall className="w-5 h-5 text-emerald-400" />;
      case 'footer':
        return <PanelBottom className="w-5 h-5 text-slate-400" />;
      default:
        return <GripVertical className="w-5 h-5 text-slate-400" />;
    }
  };

  const handleDragStart = (e: React.DragEvent, key: ModuleKey) => {
    setDraggedKey(key);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, key: ModuleKey) => {
    e.preventDefault();
    if (draggedKey && draggedKey !== key) {
      setDragOverKey(key);
    }
  };

  const handleDrop = (e: React.DragEvent, targetKey: ModuleKey) => {
    e.preventDefault();
    if (!draggedKey || draggedKey === targetKey) {
      setDraggedKey(null);
      setDragOverKey(null);
      return;
    }

    const currentOrder = [...cmsData.modulesOrder];
    const fromIndex = currentOrder.indexOf(draggedKey);
    const toIndex = currentOrder.indexOf(targetKey);

    if (fromIndex !== -1 && toIndex !== -1) {
      currentOrder.splice(fromIndex, 1);
      currentOrder.splice(toIndex, 0, draggedKey);
      reorderModules(currentOrder);
    }

    setDraggedKey(null);
    setDragOverKey(null);
  };

  return (
    <div className="space-y-6">
      {/* Intro info box */}
      <div className="p-5 bg-amber-500/10 border border-amber-500/20 rounded-2xl space-y-2">
        <h3 className="text-base font-bold text-amber-300 flex items-center gap-2">
          <GripVertical className="w-5 h-5 text-amber-400" />
          <span>إعادة ترتيب وتخصيص ظهور أقسام الصفحة الرئيسية (Drag & Drop)</span>
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          يمكنك إعادة ترتيب تسلسل ظهور الموديولات الـ 11 في الواجهة الرئيسية بسهولة عن طريق <strong>السحب والإفلات</strong> بالملاحة، أو باستخدام أزرار الأسهم (أعلى / أسفل). كما يمكنك إخفاء أو إظهار أي قسم بنقرة واحدة!
        </p>
      </div>

      {/* Modules Reorder Cards List */}
      <div className="space-y-3">
        {cmsData.modulesOrder.map((key, index) => {
          const meta = MODULE_METADATA[key] || {
            key,
            nameAr: key,
            description: '',
          };
          const isVisible = cmsData.moduleVisibility[key] ?? true;
          const isDragging = draggedKey === key;
          const isDragOver = dragOverKey === key;

          return (
            <div
              key={key}
              draggable
              onDragStart={(e) => handleDragStart(e, key)}
              onDragOver={(e) => handleDragOver(e, key)}
              onDrop={(e) => handleDrop(e, key)}
              onDragEnd={() => {
                setDraggedKey(null);
                setDragOverKey(null);
              }}
              className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                isDragging
                  ? 'opacity-40 bg-slate-800 border-amber-500/80 scale-98'
                  : isDragOver
                  ? 'bg-amber-500/20 border-amber-500 shadow-xl'
                  : isVisible
                  ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow-md'
                  : 'bg-slate-950/60 border-slate-900 opacity-60'
              }`}
            >
              {/* Left Side: Drag Handle & Name */}
              <div className="flex items-center gap-3.5 flex-1 cursor-grab active:cursor-grabbing">
                <div className="p-2 bg-slate-800/80 hover:bg-slate-700 rounded-xl text-slate-400 hover:text-white transition-colors shrink-0">
                  <GripVertical className="w-5 h-5" />
                </div>

                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 shrink-0">
                  {getModuleIcon(key)}
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-400/90">#{index + 1}</span>
                    <h4 className="text-sm font-bold text-white">{meta.nameAr}</h4>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">{meta.description}</p>
                </div>
              </div>

              {/* Right Side: Reorder Arrows & Edit / Hide Actions */}
              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                {/* Move Up / Down Buttons */}
                <div className="flex items-center bg-slate-950 rounded-xl border border-slate-800 p-1 gap-1">
                  <button
                    type="button"
                    onClick={() => moveModule(key, 'up')}
                    disabled={index === 0}
                    className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg disabled:opacity-30 transition-colors"
                    title="تحريك لأعلى"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveModule(key, 'down')}
                    disabled={index === cmsData.modulesOrder.length - 1}
                    className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg disabled:opacity-30 transition-colors"
                    title="تحريك لأسفل"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>

                {/* Show/Hide Toggle */}
                <button
                  type="button"
                  onClick={() => toggleModuleVisibility(key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                    isVisible
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                      : 'bg-slate-800 border-slate-700 text-slate-500'
                  }`}
                  title={isVisible ? 'القسم ظاهر بالصفحة الرئيسية' : 'القسم مخفي من الصفحة الرئيسية'}
                >
                  {isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{isVisible ? 'ظاهر' : 'مخفي'}</span>
                </button>

                {/* Edit Section Content Button */}
                <button
                  type="button"
                  onClick={() => setAdminSubSection(key)}
                  className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow-md shadow-amber-500/10"
                >
                  تعديل المحتوى
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

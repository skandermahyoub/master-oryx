import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { GalleryItem } from '../../types/cms';
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Save,
  Check,
  Sparkles,
  Wand2,
  Loader2,
  LayoutGrid,
  Grid,
  Calendar,
  Tag,
  Upload,
  UploadCloud,
  X,
  FileImage,
  Link as LinkIcon,
  ArrowUp,
  ArrowDown,
  Eye,
} from 'lucide-react';

export const GalleryEditor: React.FC = () => {
  const { cmsData, updateModuleData, generateAIImage, isGeneratingAI, setActiveView } = useCMS();
  const { gallery } = cmsData;
  const isLocalUpdateRef = React.useRef(false);

  const [sectionTitle, setSectionTitle] = useState(gallery.sectionTitle || 'معرض الوسائط واللقطات الحية');
  const [sectionSubtitle, setSectionSubtitle] = useState(
    gallery.sectionSubtitle ||
      'جولة بصرية في فعاليات أوريكس، مقرات العمل، المشاريع التقنية المعمارية، والمؤتمرات الدولية'
  );
  const [layoutMode, setLayoutMode] = useState<'grid' | 'carousel' | 'masonry'>(
    gallery.layoutMode || 'masonry'
  );
  const [columns, setColumns] = useState<number>(gallery.columns || 3);
  const [categories, setCategories] = useState<string[]>(
    gallery.categories || ['الكل', 'المشاريع', 'الفعاليات', 'مقر أوريكس', 'المؤتمرات']
  );
  const [items, setItems] = useState<GalleryItem[]>(gallery.items || []);

  const [newCatInput, setNewCatInput] = useState('');
  const [savedNotice, setSavedNotice] = useState(false);

  // New Image Modal / Drawer State
  const [showAddModal, setShowAddModal] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<'file' | 'ai' | 'url'>('file');
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState(categories[1] || 'المشاريع');
  const [newAspectRatio, setNewAspectRatio] = useState<'video' | 'square' | 'portrait' | 'wide'>('video');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const [aiGeneratingTargetId, setAiGeneratingTargetId] = useState<string | null>(null);

  // Sync state if gallery changes externally
  React.useEffect(() => {
    if (isLocalUpdateRef.current) {
      isLocalUpdateRef.current = false;
      return;
    }
    if (gallery) {
      setSectionTitle(gallery.sectionTitle || 'معرض الوسائط واللقطات الحية');
      setSectionSubtitle(gallery.sectionSubtitle || 'جولة بصرية في فعاليات أوريكس، مقرات العمل، والمؤتمرات');
      setLayoutMode(gallery.layoutMode || 'masonry');
      setColumns(Number(gallery.columns) || 3);
      setCategories(gallery.categories || ['الكل', 'المشاريع', 'الفعاليات', 'مقر أوريكس', 'المؤتمرات']);
      setItems(gallery.items || []);
    }
  }, [gallery]);

  // Real-time persistent setters
  const handleSelectLayoutMode = (mode: 'grid' | 'carousel' | 'masonry') => {
    isLocalUpdateRef.current = true;
    setLayoutMode(mode);
    updateModuleData('gallery', { layoutMode: mode });
  };

  const handleSelectColumns = (col: number) => {
    isLocalUpdateRef.current = true;
    setColumns(col);
    updateModuleData('gallery', { columns: col });
  };

  const handleTitleChange = (val: string) => {
    isLocalUpdateRef.current = true;
    setSectionTitle(val);
    updateModuleData('gallery', { sectionTitle: val });
  };

  const handleSubtitleChange = (val: string) => {
    isLocalUpdateRef.current = true;
    setSectionSubtitle(val);
    updateModuleData('gallery', { sectionSubtitle: val });
  };

  const handleSave = () => {
    isLocalUpdateRef.current = true;
    updateModuleData('gallery', {
      sectionTitle,
      sectionSubtitle,
      layoutMode,
      columns,
      categories,
      items,
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleMoveItem = (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= items.length) return;
    const updated = [...items];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    isLocalUpdateRef.current = true;
    setItems(updated);
    updateModuleData('gallery', { items: updated });
  };

  // Convert local image file to base64 Data URL
  const handleFileUpload = (file: File, callback: (dataUrl: string) => void) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        callback(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Confirm new image addition from modal
  const handleConfirmAddImage = () => {
    const finalImageUrl =
      newImageUrl.trim() ||
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80';

    const newItem: GalleryItem = {
      id: `gal-${Date.now()}`,
      title: newTitle.trim() || 'صورة جديدة بداخل المعرض',
      description: newDesc.trim() || 'وصف توثيقي للقطة المعروضة.',
      imageUrl: finalImageUrl,
      category: newCategory || categories[1] || 'عام',
      date: newDate || new Date().toISOString().split('T')[0],
      aspectRatio: newAspectRatio,
    };

    const updated = [newItem, ...items];
    isLocalUpdateRef.current = true;
    setItems(updated);
    updateModuleData('gallery', { items: updated });

    // Reset modal form
    setNewTitle('');
    setNewDesc('');
    setNewImageUrl('');
    setAiPrompt('');
    setShowAddModal(false);
  };

  const handleRemoveItem = (id: string) => {
    const updated = items.filter((i) => i.id !== id);
    isLocalUpdateRef.current = true;
    setItems(updated);
    updateModuleData('gallery', { items: updated });
  };

  const handleUpdateItem = (id: string, updatedProps: Partial<GalleryItem>) => {
    const updated = items.map((i) => (i.id === id ? { ...i, ...updatedProps } : i));
    isLocalUpdateRef.current = true;
    setItems(updated);
    updateModuleData('gallery', { items: updated });
  };

  // Category additions
  const handleAddCategory = () => {
    const trimmed = newCatInput.trim();
    if (trimmed && !categories.includes(trimmed)) {
      const updatedCats = [...categories, trimmed];
      setCategories(updatedCats);
      updateModuleData('gallery', { categories: updatedCats });
      setNewCatInput('');
    }
  };

  const handleRemoveCategory = (cat: string) => {
    if (cat === 'الكل') return;
    const updatedCats = categories.filter((c) => c !== cat);
    setCategories(updatedCats);
    updateModuleData('gallery', { categories: updatedCats });
  };

  // AI Image Generation trigger inside Modal
  const handleGenerateAIForNewModal = async () => {
    const promptToUse =
      aiPrompt.trim() ||
      `A high-end corporate photography of ${newTitle || 'technology enterprise team'} in Riyadh with warm modern ambient lighting`;

    setIsAiLoading(true);
    try {
      const url = await generateAIImage(promptToUse, '16:9');
      if (url) {
        setNewImageUrl(url);
      }
    } catch (e) {
      alert('فشل توليد الصورة بالذكاء الاصطناعي، يرجى إعادة المحاولة.');
    } finally {
      setIsAiLoading(false);
    }
  };

  // AI Image Generation for existing item card
  const handleGenerateAIForPhoto = async (targetId: string, customPrompt?: string) => {
    const targetItem = items.find((i) => i.id === targetId);
    const promptToUse =
      customPrompt ||
      `A corporate luxury photo of ${targetItem?.title || 'modern company'} in Riyadh with luxury warm lighting`;

    setAiGeneratingTargetId(targetId);
    try {
      const url = await generateAIImage(promptToUse, '16:9');
      if (url) {
        handleUpdateItem(targetId, { imageUrl: url });
      }
    } catch (e) {
      alert('فشل توليد الصورة بالذكاء الاصطناعي، يرجى المحاولة لاحقاً');
    } finally {
      setAiGeneratingTargetId(null);
    }
  };

  return (
    <div className="space-y-8 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8">
      {/* Header Info & Primary Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-amber-400" />
            <span>لوحة تحكم الموديول التاسع: معرض الصور والوسائط التفاعلي</span>
          </h3>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-bold">
              النمط النشط: {layoutMode === 'masonry' ? 'موزاييك' : layoutMode === 'grid' ? 'شبكي' : 'كاروسال منزلق'} ({columns} أعمدة)
            </span>
            <span className="px-2.5 py-0.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-mono">
              {items.length} صورة
            </span>
            <span className="px-2.5 py-0.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-[11px]">
              {categories.length} ألبومات
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={() => setActiveView('public')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors border border-slate-700"
            title="الانتقال للموقع العام لمعاينة المعرض"
          >
            <Eye className="w-4 h-4 text-emerald-400" />
            <span>معاينة بالرئيسية</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-600/20 flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
          >
            <UploadCloud className="w-4 h-4 text-emerald-100" />
            <span>إضافة صورة</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
          >
            {savedNotice ? <Check className="w-4 h-4 text-emerald-950" /> : <Save className="w-4 h-4" />}
            <span>{savedNotice ? 'تم الحفظ!' : 'حفظ التعديلات'}</span>
          </button>
        </div>
      </div>

      {/* Modern Upload & Add Photo Modal / Drawer */}
      {showAddModal && (
        <div className="p-6 bg-slate-950 border-2 border-emerald-500/50 rounded-3xl space-y-6 animate-in fade-in shadow-2xl relative">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-emerald-400" />
              <h4 className="text-base font-bold text-white">إضافة ورَفع صورة جديدة لمعرض الوسائط</h4>
            </div>
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Upload Method Tabs (File Upload / AI Generator / Image URL) */}
          <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl">
            <button
              type="button"
              onClick={() => setUploadMethod('file')}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                uploadMethod === 'file'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>رفع من جهازك (ملف)</span>
            </button>

            <button
              type="button"
              onClick={() => setUploadMethod('ai')}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                uploadMethod === 'ai'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Wand2 className="w-4 h-4" />
              <span>توليد بالذكاء الاصطناعي (AI)</span>
            </button>

            <button
              type="button"
              onClick={() => setUploadMethod('url')}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                uploadMethod === 'url'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LinkIcon className="w-4 h-4" />
              <span>رابط صورة مباشر (URL)</span>
            </button>
          </div>

          {/* Method 1: Local Device File Upload */}
          {uploadMethod === 'file' && (
            <div className="p-6 border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-2xl bg-slate-900/50 text-center space-y-3 transition-colors relative group">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, (url) => setNewImageUrl(url));
                }}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
              />
              <FileImage className="w-10 h-10 text-emerald-400 mx-auto group-hover:scale-110 transition-transform" />
              <div>
                <p className="text-xs font-bold text-white">انقر هنا لاختيار صورة من جهازك أو اسحب الملف وقُم بإسقاطه</p>
                <p className="text-[11px] text-slate-400 mt-1">يدعم صيغ PNG, JPG, WEBP, GIF (حتى 10 ميجابايت)</p>
              </div>
            </div>
          )}

          {/* Method 2: AI Image Generation */}
          {uploadMethod === 'ai' && (
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
              <label className="text-xs font-bold text-slate-200 block">وصف الصورة المطلوبة للذكاء الاصطناعي:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="مثال: لقطة احترافية لاجتماع قيادات شركة تقنية بالرياض بإضاءة دافئة"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={handleGenerateAIForNewModal}
                  disabled={isAiLoading || isGeneratingAI}
                  className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shrink-0 transition-all disabled:opacity-50"
                >
                  {isAiLoading ? <Loader2 className="w-4 h-4 animate-spin text-amber-300" /> : <Sparkles className="w-4 h-4 text-amber-300" />}
                  <span>توليد الصورة</span>
                </button>
              </div>
            </div>
          )}

          {/* Method 3: Direct Image URL */}
          {uploadMethod === 'url' && (
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
              <label className="text-xs font-bold text-slate-200 block">رابط الصورة المباشر (URL):</label>
              <input
                type="text"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs font-mono text-white focus:outline-none"
              />
            </div>
          )}

          {/* Image Preview Thumbnail if selected */}
          {newImageUrl && (
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-4">
              <div className="w-20 h-14 rounded-xl overflow-hidden border border-slate-700 shrink-0 bg-slate-950">
                <img src={newImageUrl} alt="معاينة" className="w-full h-full object-cover" />
              </div>
              <div className="text-xs text-slate-300 overflow-hidden">
                <p className="font-bold text-emerald-400">تم اختيار الصورة بنجاح!</p>
                <p className="text-[10px] text-slate-400 truncate font-mono mt-0.5">{newImageUrl.substring(0, 60)}...</p>
              </div>
            </div>
          )}

          {/* Photo Metadata Form (Title, Category, Date, Description) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-200">عنوان الصورة:</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="عنوان اللوقو أو الفعالية..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-200">التصنيف الألبومي:</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
              >
                {categories
                  .filter((c) => c !== 'الكل')
                  .map((cat, idx) => (
                    <option key={idx} value={cat}>
                      {cat}
                    </option>
                  ))}
              </select>
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-200">وصف الصورة التوثيقي التفصيلي:</label>
              <textarea
                rows={2}
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="اكتب وصفاً مفصلاً يظهر للمستكشف عند النقر على الصورة في الـ Lightbox..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-200">تاريخ التقاط/إدراج الصورة:</label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-200">نسبة أبعاد الصورة (Aspect Ratio):</label>
              <select
                value={newAspectRatio}
                onChange={(e) => setNewAspectRatio(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
              >
                <option value="video">١٦:٩ عريض سينمائي (16:9 - Video)</option>
                <option value="square">١:١ مربع (1:1 - Square)</option>
                <option value="portrait">٣:٤ عمودي (3:4 - Portrait)</option>
                <option value="wide">٢١:٩ بانورامي (21:9 - Wide)</option>
              </select>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl"
            >
              إلغاء
            </button>
            <button
              type="button"
              onClick={handleConfirmAddImage}
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all"
            >
              <Check className="w-4 h-4 text-slate-950" />
              <span>تأكيد الحفظ وإضافة الصورة للمعرض</span>
            </button>
          </div>
        </div>
      )}

      {/* Display Options & Layout Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-slate-950 border border-slate-800 rounded-2xl">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-200 block">عنوان القسم الرئيسي:</label>
          <input
            type="text"
            value={sectionTitle}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-200 block">الوصف الفرعي للقسم:</label>
          <input
            type="text"
            value={sectionSubtitle}
            onChange={(e) => handleSubtitleChange(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
          />
        </div>

        {/* Layout Mode Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-white flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 text-amber-400" />
            <span>طريقة العرض والتنسيق بالصفحة الرئيسية:</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'masonry', label: 'موزاييك / جرايد (Masonry)' },
              { id: 'grid', label: 'شبكي منتظم (Grid)' },
              { id: 'carousel', label: 'كاروسال منزلق (Carousel)' },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => handleSelectLayoutMode(m.id as any)}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  layoutMode === m.id
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-black'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Column Count Choice (for Grid & Masonry layouts) */}
        {(layoutMode === 'grid' || layoutMode === 'masonry') && (
          <div className="space-y-2">
            <label className="text-xs font-bold text-white flex items-center gap-2">
              <Grid className="w-4 h-4 text-amber-400" />
              <span>عدد الأعمدة ({layoutMode === 'masonry' ? 'موزاييك' : 'شبكي'}):</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[2, 3, 4].map((col) => (
                <button
                  key={col}
                  type="button"
                  onClick={() => handleSelectColumns(col)}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    columns === col
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-black'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {col} أعمدة
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Categories Management Bar */}
      <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
        <label className="text-xs font-bold text-white flex items-center gap-2">
          <Tag className="w-4 h-4 text-amber-400" />
          <span>تصنيفات ومعارض الألبومات:</span>
        </label>

        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat, idx) => (
            <span
              key={idx}
              className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-slate-200 flex items-center gap-2"
            >
              <span>{cat}</span>
              {cat !== 'الكل' && (
                <button
                  type="button"
                  onClick={() => handleRemoveCategory(cat)}
                  className="text-slate-500 hover:text-red-400 transition-colors"
                >
                  ×
                </button>
              )}
            </span>
          ))}
        </div>

        <div className="flex gap-2 pt-2">
          <input
            type="text"
            value={newCatInput}
            onChange={(e) => setNewCatInput(e.target.value)}
            placeholder="إضافة تصنيف جديد (مثلاً: المعارض الخارجية)"
            className="bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none flex-1 max-w-sm"
          />
          <button
            type="button"
            onClick={handleAddCategory}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة التصنيف</span>
          </button>
        </div>
      </div>

      {/* Gallery Items List Editor */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-white">قائمة الصور والوسائط بالمعرض ({items.length}):</h4>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-lg shadow-emerald-600/20"
          >
            <UploadCloud className="w-4 h-4" />
            <span>رفع / إضافة صورة جديدة</span>
          </button>
        </div>

        <div className="space-y-4">
          {items.map((item, idx) => {
            const isGeneratingThis = aiGeneratingTargetId === item.id;
            return (
              <div
                key={item.id}
                className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-4 relative group hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-400">الصورة #{idx + 1}</span>
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveItem(idx, 'up')}
                      className="p-1 text-slate-400 hover:text-white disabled:opacity-25 disabled:pointer-events-none rounded hover:bg-slate-800 transition-colors"
                      title="تحريك للأعلى"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === items.length - 1}
                      onClick={() => handleMoveItem(idx, 'down')}
                      className="p-1 text-slate-400 hover:text-white disabled:opacity-25 disabled:pointer-events-none rounded hover:bg-slate-800 transition-colors"
                      title="تحريك للأسفل"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-1.5 text-red-400 hover:text-white hover:bg-red-500/20 rounded-lg text-xs flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>حذف الصورة</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  {/* Image Preview & Upload / AI Buttons */}
                  <div className="md:col-span-4 space-y-2">
                    <div className="relative rounded-xl overflow-hidden aspect-video border border-slate-800 bg-slate-900 group/img">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />

                      {isGeneratingThis && (
                        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center">
                          <Loader2 className="w-6 h-6 text-amber-400 animate-spin mb-2" />
                          <span className="text-xs font-bold text-amber-300">جاري توليد الصورة بالذكاء الاصطناعي...</span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {/* Upload File Input Button */}
                      <label className="py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700 transition-colors">
                        <Upload className="w-3.5 h-3.5 text-emerald-400" />
                        <span>رفع ملف</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, (url) => handleUpdateItem(item.id, { imageUrl: url }));
                          }}
                          className="hidden"
                        />
                      </label>

                      {/* AI Generation Button */}
                      <button
                        type="button"
                        onClick={() =>
                          handleGenerateAIForPhoto(
                            item.id,
                            `A corporate luxury photo of ${item.title} in a high-tech modern enterprise`
                          )
                        }
                        disabled={isGeneratingAI}
                        className="py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md shadow-purple-600/20 disabled:opacity-50"
                      >
                        <Wand2 className="w-3.5 h-3.5 text-amber-300" />
                        <span>ذكاء اصطناعي</span>
                      </button>
                    </div>
                  </div>

                  {/* Form Details */}
                  <div className="md:col-span-8 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-300">عنوان الصورة:</label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => handleUpdateItem(item.id, { title: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-300">التصنيف:</label>
                        <select
                          value={item.category}
                          onChange={(e) => handleUpdateItem(item.id, { category: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none"
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
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-300">وصف الصورة التوثيقي:</label>
                      <textarea
                        rows={2}
                        value={item.description}
                        onChange={(e) => handleUpdateItem(item.id, { description: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-300">رابط الصورة (URL):</label>
                        <input
                          type="text"
                          value={item.imageUrl}
                          onChange={(e) => handleUpdateItem(item.id, { imageUrl: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs font-mono text-white focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-300">تاريخ الصورة:</label>
                        <input
                          type="date"
                          value={item.date}
                          onChange={(e) => handleUpdateItem(item.id, { date: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-[11px] font-bold text-slate-300">نسبة أبعاد الصورة (Aspect Ratio):</label>
                        <select
                          value={item.aspectRatio || 'video'}
                          onChange={(e) => handleUpdateItem(item.id, { aspectRatio: e.target.value as any })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-amber-300 font-bold focus:outline-none"
                        >
                          <option value="video">١٦:٩ عريض سينمائي (16:9 - Video)</option>
                          <option value="square">١:١ مربع (1:1 - Square)</option>
                          <option value="portrait">٣:٤ عمودي (3:4 - Portrait)</option>
                          <option value="wide">٢١:٩ بانورامي (21:9 - Wide)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

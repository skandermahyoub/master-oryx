import React, { useState, useEffect } from 'react';
import { useCMS } from '../../context/CMSContext';
import { BlogPost } from '../../types/cms';
import {
  BookOpen,
  Plus,
  Trash2,
  Save,
  Check,
  Upload,
  Sparkles,
  Sliders,
  LayoutGrid,
  Edit3,
  Eye,
  Search,
  Tag,
  Calendar,
  User,
  Clock,
  ArrowRight,
  Star,
  Settings2,
  X,
  ChevronDown,
  Layers,
  FileText,
} from 'lucide-react';
import { AIImageModal } from '../common/AIImageModal';

export const BlogEditor: React.FC = () => {
  const { cmsData, updateModuleData, setSelectedArticleId } = useCMS();
  const { blog } = cmsData;

  // Global Blog settings
  const [sectionTitle, setSectionTitle] = useState(blog.sectionTitle || 'مدونة أوريكس للحلول المعرفية');
  const [sectionSubtitle, setSectionSubtitle] = useState(
    blog.sectionSubtitle || 'رؤى تحليلية ومقالات متخصصة في الذكاء الاصطناعي وإدارة الأعمال والابتكار الرقمي'
  );
  const [postsToShow, setPostsToShow] = useState(blog.postsToShow || 6);
  const [layoutMode, setLayoutMode] = useState<'carousel_horizontal' | 'carousel_vertical' | 'grid'>(
    blog.layoutMode || 'carousel_horizontal'
  );
  const [posts, setPosts] = useState<BlogPost[]>(blog.posts || []);
  const [categories, setCategories] = useState<string[]>(
    blog.categories || ['الكل', 'الذكاء الاصطناعي', 'ريادة الأعمال', 'التقنية السحابية', 'أتمتة العمليات']
  );
  const [savedNotice, setSavedNotice] = useState(false);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);

  // List management state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('الكل');

  // Form Mode: 'list' | 'create' | 'edit'
  const [editorMode, setEditorMode] = useState<'list' | 'form'>('list');
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  // Form State for active post being created or edited
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formAuthor, setFormAuthor] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formReadTime, setFormReadTime] = useState('5 دقائق');
  const [formExcerpt, setFormExcerpt] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formFeatured, setFormFeatured] = useState(false);

  // Category addition
  const [newCategoryInput, setNewCategoryInput] = useState('');

  // AI Modal
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // Sync state if blog changes externally
  useEffect(() => {
    if (blog) {
      setSectionTitle(blog.sectionTitle || 'مدونة أوريكس للحلول المعرفية');
      setSectionSubtitle(blog.sectionSubtitle || 'رؤى تحليلية ومقالات متخصصة في الذكاء الاصطناعي وإدارة الأعمال والابتكار الرقمي');
      setPostsToShow(blog.postsToShow || 6);
      setLayoutMode(blog.layoutMode || 'carousel_horizontal');
      setPosts(blog.posts || []);
      setCategories(blog.categories || ['الكل', 'الذكاء الاصطناعي', 'ريادة الأعمال', 'التقنية السحابية', 'أتمتة العمليات']);
    }
  }, [blog]);

  // Persistent save to CMS context
  const saveAllToContext = (updatedPosts: BlogPost[], updatedCategories?: string[]) => {
    updateModuleData('blog', {
      sectionTitle,
      sectionSubtitle,
      postsToShow,
      layoutMode,
      categories: updatedCategories || categories,
      posts: updatedPosts,
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleSaveSettings = () => {
    updateModuleData('blog', {
      sectionTitle,
      sectionSubtitle,
      postsToShow,
      layoutMode,
      categories,
      posts,
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  // Open Form for creating new post
  const handleOpenCreateForm = () => {
    setEditingPostId(null);
    setFormTitle('');
    setFormCategory(categories.find((c) => c !== 'الكل') || 'الذكاء الاصطناعي');
    setFormAuthor(cmsData.about?.ceoName || 'مستشار أوريكس');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormReadTime('5 دقائق');
    setFormExcerpt('');
    setFormContent('');
    setFormImageUrl(
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'
    );
    setFormFeatured(true);
    setEditorMode('form');
  };

  // Open Form for editing existing post
  const handleOpenEditForm = (post: BlogPost) => {
    setEditingPostId(post.id);
    setFormTitle(post.title);
    setFormCategory(post.category);
    setFormAuthor(post.author);
    setFormDate(post.date);
    setFormReadTime(post.readTime || '5 دقائق');
    setFormExcerpt(post.excerpt);
    setFormContent(post.content);
    setFormImageUrl(post.imageUrl);
    setFormFeatured(post.featured ?? false);
    setEditorMode('form');
  };

  // Submit Form (Save or Update)
  const handleSubmitPostForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formTitle.trim()) {
      alert('يرجى كتابة عنوان للمقال');
      return;
    }

    const postPayload: BlogPost = {
      id: editingPostId || `post-${Date.now()}`,
      title: formTitle.trim(),
      category: formCategory || 'عام',
      author: formAuthor.trim() || 'مستشار أوريكس',
      date: formDate || new Date().toISOString().split('T')[0],
      readTime: formReadTime.trim() || '5 دقائق',
      excerpt: formExcerpt.trim() || 'ملخص تعريفي موجز للمقال.',
      content: formContent.trim() || 'نص المقال الكامل والتفاصيل الاستراتيجية.',
      imageUrl:
        formImageUrl.trim() ||
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      featured: formFeatured,
    };

    let updatedList: BlogPost[];
    if (editingPostId) {
      updatedList = posts.map((p) => (p.id === editingPostId ? postPayload : p));
    } else {
      updatedList = [postPayload, ...posts];
    }

    setPosts(updatedList);
    saveAllToContext(updatedList);
    setEditorMode('list');
    setEditingPostId(null);
  };

  // Delete Post
  const handleDeletePost = (id: string, title: string) => {
    if (confirm(`هل أنت متأكد من حذف المقال: "${title}"؟`)) {
      const updatedList = posts.filter((p) => p.id !== id);
      setPosts(updatedList);
      saveAllToContext(updatedList);
    }
  };

  // Toggle Featured Flag
  const handleToggleFeatured = (id: string) => {
    const updatedList = posts.map((p) =>
      p.id === id ? { ...p, featured: !p.featured } : p
    );
    setPosts(updatedList);
    saveAllToContext(updatedList);
  };

  // Upload Image File
  const handleFileUpload = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setFormImageUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Add new category
  const handleAddCategory = () => {
    const trimmed = newCategoryInput.trim();
    if (trimmed && !categories.includes(trimmed)) {
      const updatedCats = [...categories, trimmed];
      setCategories(updatedCats);
      saveAllToContext(posts, updatedCats);
      setNewCategoryInput('');
    }
  };

  // Filtered posts for list view
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategoryFilter === 'الكل' || post.category === selectedCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* TOP BAR / HEADER */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-pink-500/10 border border-pink-500/20 text-pink-400 rounded-2xl">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">نظام المدونة والمقالات المعرفية</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-mono font-bold">
                {posts.length} مقالات
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              إدارة المقالات، إضافة تدوينات جديدة، واختيار نمط العرض للواجهة الرئيسية
            </p>
          </div>
        </div>

        {/* Primary Actions */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
          {editorMode === 'list' ? (
            <>
              <button
                type="button"
                onClick={() => setShowSettingsPanel(!showSettingsPanel)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all cursor-pointer ${
                  showSettingsPanel
                    ? 'bg-slate-800 text-amber-400 border-amber-500/40'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Settings2 className="w-4 h-4" />
                <span>إعدادات العرض بالرئيسية</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${
                    showSettingsPanel ? 'rotate-180 text-amber-400' : ''
                  }`}
                />
              </button>

              <button
                type="button"
                onClick={handleOpenCreateForm}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all cursor-pointer scale-102"
              >
                <Plus className="w-4 h-4 text-slate-950 stroke-[3]" />
                <span>كتابة مقال جديد</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setEditorMode('list')}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <ArrowRight className="w-4 h-4 text-amber-400" />
              <span>العودة لقائمة المقالات</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. GLOBAL DISPLAY SETTINGS PANEL (COLLAPSIBLE)                             */}
      {/* ========================================================================= */}
      {showSettingsPanel && editorMode === 'list' && (
        <div className="bg-slate-900/95 border-2 border-amber-500/30 rounded-3xl p-6 space-y-6 animate-in fade-in duration-200 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">إعدادات موديول المدونة في الصفحة الرئيسية:</h3>
            </div>
            <button
              type="button"
              onClick={() => setShowSettingsPanel(false)}
              className="p-1 text-slate-400 hover:text-white rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Layout Mode Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 block">
              طريقة وشكل عرض تدوينات المدونة بالرئيسية:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: 'carousel_horizontal',
                  title: 'كاروسال منزلق أفقي',
                  desc: 'انزلاق سلس يميناً ويساراً مع أزرار التنقل',
                  icon: <Sliders className="w-4 h-4 text-amber-400" />,
                },
                {
                  id: 'carousel_vertical',
                  title: 'كاروسال منزلق عمودي',
                  desc: 'انزلاق رأسي مميز بين المقالات',
                  icon: <Sliders className="w-4 h-4 text-amber-400 rotate-90" />,
                },
                {
                  id: 'grid',
                  title: 'شبكة المقالات والفلاتر (Grid)',
                  desc: 'عرض شبكي تفاعلي مع شريط تصنيفات',
                  icon: <LayoutGrid className="w-4 h-4 text-amber-400" />,
                },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setLayoutMode(m.id as any)}
                  className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer flex items-start gap-3 ${
                    layoutMode === m.id
                      ? 'bg-amber-500/15 border-amber-500 text-white shadow-md ring-1 ring-amber-500/30'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 shrink-0 mt-0.5">
                    {m.icon}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{m.title}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{m.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Titles & Limits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">عنوان الموديول الرئيسي:</label>
              <input
                type="text"
                value={sectionTitle}
                onChange={(e) => setSectionTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">الوصف التوضيحي:</label>
              <input
                type="text"
                value={sectionSubtitle}
                onChange={(e) => setSectionSubtitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">عدد المقالات المعروضة بالرئيسية:</label>
              <input
                type="number"
                min="1"
                max="20"
                value={postsToShow}
                onChange={(e) => setPostsToShow(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
          </div>

          {/* Categories Manager */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label className="text-xs font-bold text-slate-300">تصنيفات وأقسام المدونة:</label>
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-slate-300 flex items-center gap-1.5"
                >
                  <Tag className="w-3 h-3 text-pink-400" />
                  <span>{cat}</span>
                  {cat !== 'الكل' && (
                    <button
                      type="button"
                      onClick={() => {
                        const updated = categories.filter((c) => c !== cat);
                        setCategories(updated);
                        saveAllToContext(posts, updated);
                      }}
                      className="text-slate-500 hover:text-red-400 text-xs px-1"
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
                value={newCategoryInput}
                onChange={(e) => setNewCategoryInput(e.target.value)}
                placeholder="إضافة تصنيف جديد (مثال: التحول الرقمي)..."
                className="bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-amber-500 flex-1 max-w-sm"
              />
              <button
                type="button"
                onClick={handleAddCategory}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة</span>
              </button>
            </div>
          </div>

          {/* Save Settings Button */}
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleSaveSettings}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg flex items-center gap-2 cursor-pointer"
            >
              {savedNotice ? <Check className="w-4 h-4 text-emerald-950" /> : <Save className="w-4 h-4" />}
              <span>{savedNotice ? 'تم حفظ الإعدادات!' : 'حفظ إعدادات الموديول'}</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. ARTICLES LIST TABLE VIEW (DEFAULT WORDPRESS-STYLE VIEW)                */}
      {/* ========================================================================= */}
      {editorMode === 'list' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-2xl">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث في المقالات والكتّاب..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-10 pl-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 custom-scrollbar">
              {categories.map((cat, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-colors cursor-pointer ${
                    selectedCategoryFilter === cat
                      ? 'bg-amber-500 text-slate-950 font-black'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Articles Table */}
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16 bg-slate-950/60 rounded-2xl border border-slate-800/80 space-y-3">
              <FileText className="w-12 h-12 text-slate-600 mx-auto" />
              <p className="text-sm font-bold text-slate-300">لا توجد مقالات مطابقة للبحث</p>
              <button
                type="button"
                onClick={handleOpenCreateForm}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl inline-flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>كتابة مقال الآن</span>
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400">
                    <th className="py-3 px-4">المقال والصورة</th>
                    <th className="py-3 px-3">التصنيف</th>
                    <th className="py-3 px-3">الكاتب والتاريخ</th>
                    <th className="py-3 px-3 text-center">مميز</th>
                    <th className="py-3 px-4 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-xs">
                  {filteredPosts.map((post) => (
                    <tr
                      key={post.id}
                      className="group hover:bg-slate-950/50 transition-colors"
                    >
                      {/* Image & Title */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3.5 max-w-md">
                          <div className="w-16 h-12 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shrink-0 relative group/thumb">
                            <img
                              src={post.imageUrl}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div className="space-y-1">
                            <h4
                              onClick={() => handleOpenEditForm(post)}
                              className="font-bold text-white hover:text-amber-400 transition-colors cursor-pointer line-clamp-1 text-xs sm:text-sm"
                            >
                              {post.title}
                            </h4>
                            <p className="text-[11px] text-slate-400 line-clamp-1">
                              {post.excerpt}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-3">
                        <span className="px-2.5 py-1 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-400 text-[11px] font-bold inline-block">
                          {post.category}
                        </span>
                      </td>

                      {/* Author & Date */}
                      <td className="py-3.5 px-3 text-slate-400">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 text-slate-300 font-bold text-[11px]">
                            <User className="w-3 h-3 text-amber-400" />
                            <span>{post.author}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                            <Calendar className="w-3 h-3" />
                            <span>{post.date}</span>
                            <span>•</span>
                            <span>{post.readTime || '5 دقائق'}</span>
                          </div>
                        </div>
                      </td>

                      {/* Featured Toggle */}
                      <td className="py-3.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(post.id)}
                          className={`p-2 rounded-xl border transition-all cursor-pointer ${
                            post.featured
                              ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                              : 'bg-slate-950 border-slate-800 text-slate-600 hover:text-slate-400'
                          }`}
                          title={post.featured ? 'مقال مميز بالرئيسية' : 'تحديد كمقال مميز'}
                        >
                          <Star className={`w-4 h-4 ${post.featured ? 'fill-amber-400' : ''}`} />
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Preview Modal Button */}
                          <button
                            type="button"
                            onClick={() => setSelectedArticleId(post.id)}
                            className="p-2 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-800 transition-colors cursor-pointer"
                            title="معاينة المقال الكامل"
                          >
                            <Eye className="w-3.5 h-3.5 text-blue-400" />
                          </button>

                          {/* Edit Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenEditForm(post)}
                            className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>تعديل</span>
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => handleDeletePost(post.id, post.title)}
                            className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl border border-red-500/30 transition-colors cursor-pointer"
                            title="حذف المقال"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. DEDICATED POST FORM (OPENED WHEN CREATING OR EDITING AN ARTICLE)        */}
      {/* ========================================================================= */}
      {editorMode === 'form' && (
        <form
          onSubmit={handleSubmitPostForm}
          className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 animate-in fade-in duration-200 shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <Edit3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">
                  {editingPostId ? 'تعديل المقال' : 'كتابة ونشر مقال جديد'}
                </h3>
                <p className="text-xs text-slate-400">
                  قم بملء تفاصيل المقال، محتواه، وإرفاق الصورة المناسبة أو توليدها
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setEditorMode('list')}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4 text-slate-950" />
                <span>حفظ ونشر المقال</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left Column: Form Fields */}
            <div className="md:col-span-8 space-y-4">
              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-200 block">
                  عنوان المقال: <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="مثال: مستقبل الذكاء الاصطناعي في تمكين المنشآت لعام 2026..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-500 font-bold"
                />
              </div>

              {/* Category, Author, Date, ReadTime Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 block">التصنيف:</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
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

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 block">الكاتب:</label>
                  <input
                    type="text"
                    value={formAuthor}
                    onChange={(e) => setFormAuthor(e.target.value)}
                    placeholder="اسم الكاتب..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 block">تاريخ النشر:</label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 block">وقت القراءة:</label>
                  <input
                    type="text"
                    value={formReadTime}
                    onChange={(e) => setFormReadTime(e.target.value)}
                    placeholder="مثال: 5 دقائق"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-200 block">
                  الملخص الموجز للمقال (يظهر في بطاقات المدونة بالرئيسية):
                </label>
                <textarea
                  rows={2}
                  value={formExcerpt}
                  onChange={(e) => setFormExcerpt(e.target.value)}
                  placeholder="موجز سريع يجذب القارئ في سطرين إلى ثلاثة..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500 leading-relaxed"
                />
              </div>

              {/* Full Content */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-200 block">
                  المحتوى الكامل للمقال (يظهر في نافذة القراءة الكاملة):
                </label>
                <textarea
                  rows={8}
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="اكتب تفاصيل المقال، النقاط الاستراتيجية، التحليلات، والتوصيات..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500 leading-relaxed"
                />
              </div>
            </div>

            {/* Right Column: Image & Featured Controls */}
            <div className="md:col-span-4 space-y-4">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
                <label className="text-xs font-bold text-white block">صورة المقال التعبيرية:</label>

                {/* Image Preview */}
                <div className="relative rounded-xl overflow-hidden aspect-video border border-slate-800 bg-slate-900 shadow-inner">
                  {formImageUrl ? (
                    <img
                      src={formImageUrl}
                      alt="معاينة"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs">
                      لا توجد صورة محددة
                    </div>
                  )}
                </div>

                {/* Direct URL Input */}
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 block">رابط الصورة المباشر (URL):</label>
                  <input
                    type="text"
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs font-mono text-white focus:outline-none"
                  />
                </div>

                {/* Image Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAiModalOpen(true)}
                    className="px-3 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-[11px] rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md shadow-purple-600/20 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>توليد بالذكاء الاصطناعي</span>
                  </button>

                  <label className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] rounded-xl flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700 transition-colors">
                    <Upload className="w-3.5 h-3.5 text-emerald-400" />
                    <span>رفع من جهازك</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file);
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Featured Toggle Card */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-400" />
                    <span>تثبيت كمقال مميز (Featured)</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    يمنح المقال أولوية الظهور في واجهات العرض
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formFeatured}
                  onChange={(e) => setFormFeatured(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
              </div>

              {/* Submit & Cancel in right bar */}
              <div className="space-y-2 pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>حفظ ونشر المقال الآن</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditorMode('list')}
                  className="w-full py-2.5 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white font-bold text-xs rounded-xl border border-slate-800 transition-colors"
                >
                  إلغاء والعودة للقائمة
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* AI Modal for Generating Article Image */}
      {isAiModalOpen && (
        <AIImageModal
          isOpen={true}
          onClose={() => setIsAiModalOpen(false)}
          onApplyImage={(url) => {
            setFormImageUrl(url);
            setIsAiModalOpen(false);
          }}
          title="توليد صورة المقال بالذكاء الاصطناعي"
          defaultPrompt={`Corporate editorial luxury photograph for an article titled "${formTitle || 'Artificial Intelligence and Enterprise Business'}" with elegant warm studio lighting`}
          aspectRatio="16:9"
        />
      )}
    </div>
  );
};

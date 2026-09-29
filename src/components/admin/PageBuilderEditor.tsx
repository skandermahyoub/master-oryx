import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { CustomPage, CustomPageBlock, PageBlockType, BlockItem } from '../../types/cms';
import {
  FileText,
  Plus,
  Trash2,
  Edit3,
  Eye,
  Copy,
  Check,
  Save,
  ArrowUp,
  ArrowDown,
  Globe,
  Sparkles,
  Layers,
  Heading,
  Type,
  AlignLeft,
  Quote,
  Video,
  Image as ImageIcon,
  Volume2,
  Table,
  MousePointerClick,
  Sliders,
  X,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Upload,
  Wand2,
  Loader2,
  Award,
  Users,
  HelpCircle,
  BarChart2,
  Clock,
  Layout,
  Link2,
} from 'lucide-react';

export const PageBuilderEditor: React.FC = () => {
  const {
    cmsData,
    addCustomPage,
    updateCustomPage,
    deleteCustomPage,
    navigateToCustomPage,
    generateAIImage,
    isGeneratingAI,
  } = useCMS();

  const pages = cmsData.customPages || [];

  // Currently Editing Page State
  const [editingPage, setEditingPage] = useState<CustomPage | null>(null);
  const [activeTab, setActiveTab] = useState<'blocks' | 'settings'>('blocks');

  // New Block Selector Modal
  const [showAddBlockModal, setShowAddBlockModal] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);
  const [aiLoadingBlockId, setAiLoadingBlockId] = useState<string | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // Helper to generate full direct URL from the active domain
  const getFullPageUrl = (slug: string) => {
    try {
      const origin = window.location.origin;
      return `${origin}/?page=${slug}`;
    } catch {
      return `/?page=${slug}`;
    }
  };

  // Helper to copy URL to clipboard with feedback
  const copyToClipboard = (text: string, identifier?: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    } else {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopiedSlug(identifier || text);
    setTimeout(() => setCopiedSlug(null), 2500);
  };

  // Initialize a blank page to start creating
  const handleCreateNewPage = () => {
    const newPage: CustomPage = {
      id: `page-${Date.now()}`,
      title: 'صفحة جديدة مخصصة',
      slug: `page-${pages.length + 1}`,
      description: 'وصف فرعي تعريفي لمحتوى هذه الصفحة المخصصة.',
      status: 'published',
      showInNavbar: true,
      showInFooter: true,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      blocks: [
        {
          id: `blk-${Date.now()}-1`,
          type: 'hero',
          badge: 'قسم تعريفي رئيسي',
          title: 'عنوان الصفحة الرئيسي البارز',
          subtitle: 'وصف فرعي توضيحي للرؤية والاستراتيجية.',
          imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
          buttonText: 'استكشف المزيد',
          buttonUrl: '#contact',
          secondaryButtonText: 'تواصل معنا',
          secondaryButtonUrl: '#contact',
          layoutStyle: 'split',
        },
        {
          id: `blk-${Date.now()}-2`,
          type: 'paragraph',
          content: 'اكتب تفاصيل المحتوى والفقرة هنا بحرية كاملة...',
        },
      ],
    };

    addCustomPage(newPage);
    setEditingPage(newPage);
  };

  // Handle Save changes to edited page
  const handleSavePage = () => {
    if (!editingPage) return;
    updateCustomPage(editingPage.id, editingPage);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  // Convert local file upload to Base64
  const handleFileUpload = (file: File, callback: (dataUrl: string) => void) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) callback(e.target.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Generate AI image for block
  const handleGenerateAIForBlock = async (blockId: string, promptText?: string) => {
    if (!editingPage) return;
    const block = editingPage.blocks.find((b) => b.id === blockId);
    const promptToUse =
      promptText ||
      `High-end corporate photo for ${block?.title || 'technology enterprise in Riyadh'}, 8k resolution, warm ambient lighting`;

    setAiLoadingBlockId(blockId);
    try {
      const url = await generateAIImage(promptToUse, '16:9');
      if (url) {
        handleUpdateBlock(blockId, { imageUrl: url });
      }
    } catch (e) {
      alert('فشل توليد الصورة بالذكاء الاصطناعي، يرجى إعادة المحاولة.');
    } finally {
      setAiLoadingBlockId(null);
    }
  };

  // Add block to editing page
  const handleAddBlock = (type: PageBlockType) => {
    if (!editingPage) return;

    let defaultBlock: CustomPageBlock = {
      id: `blk-${Date.now()}`,
      type,
    };

    switch (type) {
      case 'hero':
        defaultBlock.badge = 'عنوان البادج البارز';
        defaultBlock.title = 'عنوان الهيرو الرئيسي البارز';
        defaultBlock.subtitle = 'وصف فرعي توضيحي مفصل للخدمات أو الفكرة الأساسية.';
        defaultBlock.imageUrl = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80';
        defaultBlock.buttonText = 'الزر الرئيسي';
        defaultBlock.buttonUrl = '#contact';
        defaultBlock.secondaryButtonText = 'الزر الفرعي';
        defaultBlock.secondaryButtonUrl = '#about';
        defaultBlock.layoutStyle = 'split';
        break;
      case 'stats':
        defaultBlock.title = 'أرقام وإحصائيات النجاح';
        defaultBlock.subtitle = 'حقائق تدل على تميّز المؤسسة';
        defaultBlock.items = [
          { id: 'st-1', title: 'مشروع رقمي', value: '+100' },
          { id: 'st-2', title: 'عميل سعيد', value: '99%' },
          { id: 'st-3', title: 'فرع إقليمي', value: '5' },
        ];
        break;
      case 'features':
        defaultBlock.badge = 'المميزات الرئيسية';
        defaultBlock.title = 'لماذا تختار منظومتنا؟';
        defaultBlock.subtitle = 'مقومات الابتكار والجودة العالية';
        defaultBlock.items = [
          { id: 'ft-1', title: 'مرونة تامة', description: 'تعديل السحابات والموديولات بدون كود' },
          { id: 'ft-2', title: 'تشفير وأمان', description: 'حماية بيانات المؤسسة بأعلى معايير الأمان' },
        ];
        break;
      case 'team':
        defaultBlock.title = 'فريق العمل والقيادات';
        defaultBlock.subtitle = 'خبراء يقودون دفة النجاح والابتكار';
        defaultBlock.items = [
          { id: 'tm-1', title: 'د. خالد بن سلمان', subtitle: 'الرئيس التنفيذي', description: 'خبير التحول الرقمي', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80' },
        ];
        break;
      case 'timeline':
        defaultBlock.title = 'محطات القصة والتاريخ';
        defaultBlock.subtitle = 'مسيرة النمو والنجاح';
        defaultBlock.items = [
          { id: 'tl-1', date: '2022', title: 'التأسيس', description: 'إطلاق النواة الأولى للمشروع' },
          { id: 'tl-2', date: '2026', title: 'النمو الإقليمي', description: 'افتتاح المقرات الإقليمية' },
        ];
        break;
      case 'faq':
        defaultBlock.title = 'الأسئلة الشائعة';
        defaultBlock.subtitle = 'إجابات عن الاستفسارات الأكثر تكراراً';
        defaultBlock.items = [
          { id: 'fq-1', title: 'كيف يمكنني البدء مع المنظومة؟', description: 'تواصل مع فريق المبيعات للحصول على استشارة مجانية وسريعة.' },
        ];
        break;
      case 'heading':
        defaultBlock.title = 'عنوان جديد بارز';
        defaultBlock.subtitle = 'وصف تعريفي فرعي للعنوان';
        break;
      case 'paragraph':
        defaultBlock.content = 'نص فقرة جديدة توضيحية بداخل الصفحة المخصصة.';
        break;
      case 'quote':
        defaultBlock.content = 'اقتباس مميز يعبر عن الرؤية أو قيمة استراتيجية في مؤسستك.';
        defaultBlock.title = 'اسم القائل أو المصدر';
        break;
      case 'video':
        defaultBlock.title = 'شاهد العرض المرئي التفاعلي';
        defaultBlock.mediaUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ';
        break;
      case 'image':
        defaultBlock.title = 'صورة بارزة عالية الوضوح';
        defaultBlock.imageUrl = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80';
        break;
      case 'audio':
        defaultBlock.title = 'البودكاست والملخص الصوتي للخدمة';
        defaultBlock.subtitle = 'استمع إلى التسجيل الصوتي للخدمات في 3 دقائق';
        defaultBlock.mediaUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
        break;
      case 'pricing_table':
        defaultBlock.title = 'جدول الباقات والأسعار الاستثمارية';
        defaultBlock.subtitle = 'مقارنة شفافة ومفصلة لكافة الحزم';
        break;
      case 'cta_button':
        defaultBlock.title = 'تواصل معنا واستفد من حلول أوريكس الذكية';
        defaultBlock.buttonText = 'طلب استشارة فورية الآن';
        defaultBlock.buttonUrl = '#contact';
        break;
      default:
        break;
    }

    const updatedBlocks = [...editingPage.blocks, defaultBlock];
    const updatedPage = { ...editingPage, blocks: updatedBlocks };
    setEditingPage(updatedPage);
    updateCustomPage(editingPage.id, updatedPage);
    setShowAddBlockModal(false);
  };

  // Move block up or down
  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    if (!editingPage) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= editingPage.blocks.length) return;

    const newBlocks = [...editingPage.blocks];
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[targetIndex];
    newBlocks[targetIndex] = temp;

    const updatedPage = { ...editingPage, blocks: newBlocks };
    setEditingPage(updatedPage);
    updateCustomPage(editingPage.id, updatedPage);
  };

  // Remove block
  const handleRemoveBlock = (blockId: string) => {
    if (!editingPage) return;
    const updatedBlocks = editingPage.blocks.filter((b) => b.id !== blockId);
    const updatedPage = { ...editingPage, blocks: updatedBlocks };
    setEditingPage(updatedPage);
    updateCustomPage(editingPage.id, updatedPage);
  };

  // Update specific block
  const handleUpdateBlock = (blockId: string, updatedProps: Partial<CustomPageBlock>) => {
    if (!editingPage) return;
    const updatedBlocks = editingPage.blocks.map((b) =>
      b.id === blockId ? { ...b, ...updatedProps } : b
    );
    const updatedPage = { ...editingPage, blocks: updatedBlocks };
    setEditingPage(updatedPage);
    updateCustomPage(editingPage.id, updatedPage);
  };

  // Sub-item handlers for blocks with list items (stats, features, team, timeline, faq)
  const handleAddSubItem = (blockId: string) => {
    if (!editingPage) return;
    const block = editingPage.blocks.find((b) => b.id === blockId);
    if (!block) return;

    const newItem: BlockItem = {
      id: `sub-${Date.now()}`,
      title: 'عنصر جديد',
      subtitle: 'تفاصيل عنصر فرعي',
      description: 'وصف توضيحي مفصل',
      value: '100+',
      date: '2026',
    };

    const currentItems = block.items || [];
    handleUpdateBlock(blockId, { items: [...currentItems, newItem] });
  };

  const handleUpdateSubItem = (
    blockId: string,
    subItemId: string,
    updatedProps: Partial<BlockItem>
  ) => {
    if (!editingPage) return;
    const block = editingPage.blocks.find((b) => b.id === blockId);
    if (!block || !block.items) return;

    const updatedItems = block.items.map((it) =>
      it.id === subItemId ? { ...it, ...updatedProps } : it
    );
    handleUpdateBlock(blockId, { items: updatedItems });
  };

  const handleRemoveSubItem = (blockId: string, subItemId: string) => {
    if (!editingPage) return;
    const block = editingPage.blocks.find((b) => b.id === blockId);
    if (!block || !block.items) return;

    const updatedItems = block.items.filter((it) => it.id !== subItemId);
    handleUpdateBlock(blockId, { items: updatedItems });
  };

  return (
    <div className="space-y-8 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h3 className="text-xl font-black text-white flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-amber-400" />
            <span>منشئ ومحرر الصفحات الاحترافي الشامل (Page Builder)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            صمّم صفحات فرعية كـ (من نحن، الخدمات، الأسئلة) بموديولات سينمائية كاملة وتخصيص دقيق
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {editingPage ? (
            <button
              type="button"
              onClick={() => setEditingPage(null)}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl flex items-center gap-2 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
              <span>معرض الصفحات</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleCreateNewPage}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4 text-emerald-100" />
              <span>إضافة صفحة جديدة</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Mode: Pages Gallery (إذا لم نكن نعدل صفحة حالياً) */}
      {!editingPage ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-extrabold text-white">الصفحات المنشأة مسبقاً بالنظام ({pages.length}):</h4>
            <span className="text-xs text-amber-400 font-bold">جرب استكشاف صفحة "عن الشركة (about-us)" النموذجية</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {pages.map((page) => (
              <div
                key={page.id}
                className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-4 hover:border-amber-500/50 transition-all flex flex-col justify-between group shadow-xl"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <h5 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                        {page.title}
                      </h5>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-mono text-emerald-400">
                        <Globe className="w-3 h-3 text-emerald-400" />
                        <span>/{page.slug}</span>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 ${
                        page.status === 'published'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {page.status === 'published' ? 'منشورة' : 'مسودة'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {page.description || 'لا يوجد وصف فرعي محدد لهذه الصفحة بعد.'}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/80 text-[10px] text-slate-400">
                    <span className="px-2 py-0.5 bg-slate-900 rounded-md border border-slate-800 font-bold text-amber-400">
                      {page.blocks.length} موديولات وبلوكات
                    </span>
                    {page.showInNavbar && (
                      <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 rounded-md border border-amber-500/20">
                        بالهيدر
                      </span>
                    )}
                    {page.showInFooter && (
                      <span className="px-2 py-0.5 bg-slate-900 text-slate-300 rounded-md border border-slate-800">
                        بالفوتر
                      </span>
                    )}
                  </div>

                  {/* Direct Domain URL Box */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between gap-2 shadow-inner">
                    <div className="flex items-center gap-1.5 overflow-hidden text-emerald-400 font-mono text-[11px] truncate flex-1">
                      <Link2 className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                      <span className="truncate select-all">{getFullPageUrl(page.slug)}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(getFullPageUrl(page.slug), page.slug)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold rounded-lg flex items-center gap-1 shrink-0 transition-colors border border-slate-700"
                      title="نسخ الرابط المباشر لربطه بالأزرار"
                    >
                      {copiedSlug === page.slug ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">تم النسخ!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-amber-400" />
                          <span>نسخ الرابط</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Actions Toolbar */}
                <div className="grid grid-cols-4 gap-2 pt-3 border-t border-slate-800/80">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingPage(page);
                      setActiveTab('blocks');
                    }}
                    className="col-span-2 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-md"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>تعديل الصفحة</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigateToCustomPage(page.slug)}
                    className="py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs rounded-xl flex items-center justify-center border border-slate-700 transition-colors"
                    title="معاينة حية"
                  >
                    <Eye className="w-3.5 h-3.5 text-amber-400" />
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteCustomPage(page.id)}
                    className="py-2 bg-slate-900 hover:bg-red-500/20 text-slate-400 hover:text-red-400 font-bold text-xs rounded-xl flex items-center justify-center border border-slate-700 hover:border-red-500/30 transition-colors"
                    title="حذف"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Single Page Builder View (تعديل صفحة محددة) */
        <div className="space-y-6">
          {/* Top Bar for Editing Page */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-slate-950 border border-slate-800 rounded-2xl">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="text-lg font-black text-white">{editingPage.title}</h4>
                <span className="text-xs font-mono text-emerald-400">/{editingPage.slug}</span>
              </div>
              <p className="text-xs text-slate-400">تخصيص الموديولات، النصوص، الصور والذكاء الاصطناعي</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigateToCustomPage(editingPage.slug)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>معاينة خية</span>
              </button>

              <button
                type="button"
                onClick={handleSavePage}
                className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl flex items-center gap-2 transition-all shadow-md shadow-amber-500/20"
              >
                {savedNotice ? <Check className="w-4 h-4 text-slate-950" /> : <Save className="w-4 h-4" />}
                <span>{savedNotice ? 'تم حفظ التعديلات!' : 'حفظ الصفحة'}</span>
              </button>
            </div>
          </div>

          {/* Dedicated Direct Domain URL Banner */}
          <div className="p-4 bg-gradient-to-r from-amber-500/10 via-slate-900 to-emerald-500/10 border border-amber-500/30 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2 text-xs font-black text-amber-400">
                <Link2 className="w-4 h-4 text-amber-400" />
                <span>رابط الدومين المخصص المباشر لهذه الصفحة (Direct URL):</span>
              </div>
              <div className="text-xs font-mono text-emerald-300 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 select-all font-bold">
                {getFullPageUrl(editingPage.slug)}
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                💡 يمكنك نسخ هذا الرابط ووضعه في أي زر بالهيدر، السلايدر، العروض، أو إرساله للمستخدمين لفتح هذه الصفحة مباشرة!
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => copyToClipboard(getFullPageUrl(editingPage.slug), editingPage.slug)}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
              >
                {copiedSlug === editingPage.slug ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>تم النسخ بنجاح!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-emerald-200" />
                    <span>نسخ الرابط المباشر</span>
                  </>
                )}
              </button>

              <a
                href={getFullPageUrl(editingPage.slug)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors"
                title="فتح في تبويب مستقل"
              >
                <ExternalLink className="w-4 h-4 text-amber-400" />
                <span>زيارة</span>
              </a>
            </div>
          </div>

          {/* Builder Nav Tabs */}
          <div className="flex border-b border-slate-800 gap-4">
            <button
              type="button"
              onClick={() => setActiveTab('blocks')}
              className={`pb-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
                activeTab === 'blocks'
                  ? 'border-amber-400 text-amber-400 font-extrabold'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>١. الموديولات وبلوكات الصفحة ({editingPage.blocks.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className={`pb-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
                activeTab === 'settings'
                  ? 'border-amber-400 text-amber-400 font-extrabold'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>٢. إعدادات الرابط والملاحة (SEO & Nav)</span>
            </button>
          </div>

          {/* Tab 1: Blocks & Modules Composer */}
          {activeTab === 'blocks' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">
                  تحكّم بالترتيب والتخصيص الكامل لكل موديول وعنصر بداخل هذه الصفحة:
                </span>

                <button
                  type="button"
                  onClick={() => setShowAddBlockModal(true)}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة موديول / عنصر جديد</span>
                </button>
              </div>

              {/* Add Block Modal / Choices Panel */}
              {showAddBlockModal && (
                <div className="p-6 bg-slate-950 border-2 border-emerald-500/50 rounded-3xl space-y-6 animate-in fade-in shadow-2xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h5 className="text-sm font-black text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span>اختر الموديول المخصص أو البلوك المراد إضافته للصفحة:</span>
                    </h5>
                    <button
                      type="button"
                      onClick={() => setShowAddBlockModal(false)}
                      className="p-1 text-slate-400 hover:text-white rounded-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Group 1: Rich Customized Page Blocks */}
                  <div className="space-y-2">
                    <span className="text-xs font-extrabold text-amber-400 block">الموديولات المخصصة الغنية:</span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      {[
                        { id: 'hero', name: 'هيرو بريميوم (غلاف الصفحة)', icon: Layout },
                        { id: 'stats', name: 'عدادات الأرقام والإحصائيات', icon: BarChart2 },
                        { id: 'features', name: 'شبكة المميزات والركائز', icon: Award },
                        { id: 'team', name: 'شبكة فريق العمل والقيادات', icon: Users },
                        { id: 'timeline', name: 'تسلسل تاريخي (Timeline)', icon: Clock },
                        { id: 'faq', name: 'الأسئلة الشائعة (FAQ)', icon: HelpCircle },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleAddBlock(item.id as PageBlockType)}
                          className="p-3 bg-slate-900 border border-slate-800 hover:border-amber-400 rounded-2xl text-right transition-all group flex flex-col space-y-1"
                        >
                          <item.icon className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                          <span className="text-xs font-bold text-white group-hover:text-amber-300">
                            {item.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Group 2: Full Global Modules */}
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <span className="text-xs font-extrabold text-emerald-400 block">الموديولات العامة للرئيسية:</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { id: 'ticker', name: 'شريط متحرك', icon: Sliders },
                        { id: 'slider', name: 'سلايدر سينمائي', icon: Sliders },
                        { id: 'gallery', name: 'معرض صور وسائط', icon: ImageIcon },
                        { id: 'offers', name: 'عروض إعلانية', icon: Sparkles },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleAddBlock(item.id as PageBlockType)}
                          className="p-3 bg-slate-900 border border-slate-800 hover:border-emerald-400 rounded-2xl text-right transition-all group flex flex-col space-y-1"
                        >
                          <item.icon className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                          <span className="text-xs font-bold text-white group-hover:text-emerald-300">
                            {item.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Group 3: Free Content Blocks */}
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <span className="text-xs font-extrabold text-purple-400 block">عناصر المحتوى والنصوص والوسائط:</span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      {[
                        { id: 'heading', name: 'عنوان رئيسي', icon: Heading },
                        { id: 'subheading', name: 'عنوان فرعي', icon: Type },
                        { id: 'paragraph', name: 'فقرة نصية غنية', icon: AlignLeft },
                        { id: 'quote', name: 'اقتباس بارز', icon: Quote },
                        { id: 'video', name: 'مشغل فيديو', icon: Video },
                        { id: 'image', name: 'صورة بارزة', icon: ImageIcon },
                        { id: 'audio', name: 'بودكاست وصوت', icon: Volume2 },
                        { id: 'pricing_table', name: 'جدول أسعار', icon: Table },
                        { id: 'cta_button', name: 'زر دعوة لاتخاذ إجراء', icon: MousePointerClick },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleAddBlock(item.id as PageBlockType)}
                          className="p-3 bg-slate-900 border border-slate-800 hover:border-purple-400 rounded-2xl text-right transition-all group flex flex-col space-y-1"
                        >
                          <item.icon className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
                          <span className="text-xs font-bold text-white group-hover:text-purple-300">
                            {item.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Rendered Block List for Editing */}
              <div className="space-y-5">
                {editingPage.blocks.map((block, index) => {
                  const isAiLoading = aiLoadingBlockId === block.id;
                  return (
                    <div
                      key={block.id}
                      className="p-5 bg-slate-950 border border-slate-800 rounded-3xl space-y-5 relative group hover:border-slate-700 transition-colors shadow-2xl"
                    >
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="w-7 h-7 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-black flex items-center justify-center">
                            #{index + 1}
                          </span>
                          <span className="text-xs font-bold text-white flex items-center gap-1.5">
                            <span>موديول:</span>
                            <span className="px-2.5 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-amber-300 font-mono">
                              {block.type === 'hero' && 'غلاف هيرو بريميوم'}
                              {block.type === 'stats' && 'إحصائيات وأرقام'}
                              {block.type === 'features' && 'شبكة المميزات والركائز'}
                              {block.type === 'team' && 'فريق القيادات والعمل'}
                              {block.type === 'timeline' && 'تسلسل زمني (Timeline)'}
                              {block.type === 'faq' && 'أسئلة شائعة (FAQ)'}
                              {block.type === 'paragraph' && 'فقرة نصية'}
                              {block.type === 'heading' && 'عنوان بارز'}
                              {block.type === 'video' && 'مشغل فيديو'}
                              {block.type === 'image' && 'صورة بارزة'}
                              {block.type === 'audio' && 'تسجيل صوتي'}
                              {block.type === 'cta_button' && 'زر اتخاذ إجراء'}
                              {block.type === 'pricing_table' && 'جدول الباقات'}
                              {['ticker', 'slider', 'gallery', 'offers'].includes(block.type) &&
                                `موديول عام (${block.type})`}
                            </span>
                          </span>
                        </div>

                        {/* Controls Up / Down / Remove */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleMoveBlock(index, 'up')}
                            disabled={index === 0}
                            className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 hover:text-white disabled:opacity-30"
                            title="تحريك لأعلى"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveBlock(index, 'down')}
                            disabled={index === editingPage.blocks.length - 1}
                            className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 hover:text-white disabled:opacity-30"
                            title="تحريك لأسفل"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRemoveBlock(block.id)}
                            className="p-2 bg-slate-900 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-xl border border-slate-800 hover:border-red-500/30 transition-colors"
                            title="حذف الموديول"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Custom Fields per Block Type */}
                      <div className="space-y-4">
                        {/* HERO BLOCK SPECIFIC EDITOR */}
                        {block.type === 'hero' && (
                          <div className="space-y-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="text-[11px] font-bold text-slate-200">وسم البادج العلوي:</label>
                                <input
                                  type="text"
                                  value={block.badge || ''}
                                  onChange={(e) => handleUpdateBlock(block.id, { badge: e.target.value })}
                                  placeholder="مثال: منظومة أوريكس الذكية 2026"
                                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[11px] font-bold text-slate-200">نمط التنسيق:</label>
                                <select
                                  value={block.layoutStyle || 'split'}
                                  onChange={(e) => handleUpdateBlock(block.id, { layoutStyle: e.target.value as any })}
                                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                                >
                                  <option value="split">جانبي (نص يميناً + صورة يساراً)</option>
                                  <option value="centered">مركزي (نص بالمنتصف + غلاف خلفي)</option>
                                </select>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[11px] font-bold text-slate-200">عنوان الهيرو الرئيسي البارز:</label>
                              <input
                                type="text"
                                value={block.title || ''}
                                onChange={(e) => handleUpdateBlock(block.id, { title: e.target.value })}
                                placeholder="عنوان الصفحة الرئيسي..."
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs font-bold text-white focus:outline-none"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[11px] font-bold text-slate-200">الوصف الفرعي للهيرو:</label>
                              <textarea
                                rows={2}
                                value={block.subtitle || ''}
                                onChange={(e) => handleUpdateBlock(block.id, { subtitle: e.target.value })}
                                placeholder="وصف تفصيلي فرعي..."
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                              />
                            </div>

                            {/* Image Upload + AI for Hero */}
                            <div className="space-y-2">
                              <label className="text-[11px] font-bold text-slate-200">صورة غلاف الهيرو:</label>
                              <div className="flex flex-col sm:flex-row items-center gap-3">
                                {block.imageUrl && (
                                  <div className="w-24 h-16 rounded-xl overflow-hidden border border-slate-700 shrink-0 bg-slate-950 relative">
                                    <img src={block.imageUrl} alt="غلاف" className="w-full h-full object-cover" />
                                    {isAiLoading && (
                                      <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center">
                                        <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
                                      </div>
                                    )}
                                  </div>
                                )}

                                <input
                                  type="text"
                                  value={block.imageUrl || ''}
                                  onChange={(e) => handleUpdateBlock(block.id, { imageUrl: e.target.value })}
                                  placeholder="رابط الصورة المباشر URL..."
                                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs font-mono text-white focus:outline-none flex-1"
                                />

                                <div className="flex gap-2 shrink-0 w-full sm:w-auto">
                                  <label className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700">
                                    <Upload className="w-3.5 h-3.5 text-emerald-400" />
                                    <span>رفع ملف</span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleFileUpload(file, (url) => handleUpdateBlock(block.id, { imageUrl: url }));
                                      }}
                                      className="hidden"
                                    />
                                  </label>

                                  <button
                                    type="button"
                                    onClick={() => handleGenerateAIForBlock(block.id)}
                                    disabled={isGeneratingAI}
                                    className="px-3 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-purple-600/20 disabled:opacity-50"
                                  >
                                    <Wand2 className="w-3.5 h-3.5 text-amber-300" />
                                    <span>توليد AI</span>
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Buttons Editor */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
                              <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                  <label className="text-[11px] font-bold text-slate-200">الزر الرئيسي (نص + رابط):</label>
                                  <span className="text-[10px] text-amber-400 font-bold">ربط بصفحة</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  <input
                                    type="text"
                                    value={block.buttonText || ''}
                                    onChange={(e) => handleUpdateBlock(block.id, { buttonText: e.target.value })}
                                    placeholder="نص الزر..."
                                    className="bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none"
                                  />
                                  <div className="flex gap-1.5">
                                    <input
                                      type="text"
                                      value={block.buttonUrl || ''}
                                      onChange={(e) => handleUpdateBlock(block.id, { buttonUrl: e.target.value })}
                                      placeholder="الرابط URL..."
                                      className="bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs font-mono text-white focus:outline-none flex-1"
                                    />
                                    <select
                                      onChange={(e) => {
                                        if (e.target.value) handleUpdateBlock(block.id, { buttonUrl: e.target.value });
                                      }}
                                      defaultValue=""
                                      className="bg-slate-900 border border-slate-700 rounded-xl px-2 text-[10px] text-amber-300 font-bold focus:outline-none cursor-pointer"
                                      title="اختر صفحة للربط التلقائي"
                                    >
                                      <option value="" disabled>صفحة...</option>
                                      {pages.map((p) => (
                                        <option key={p.id} value={`/?page=${p.slug}`}>
                                          {p.title} (/{p.slug})
                                        </option>
                                      ))}
                                      <option value="#contact">تواصل معنا</option>
                                      <option value="#about">عن المنظومة</option>
                                    </select>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                  <label className="text-[11px] font-bold text-slate-200">الزر الفرعي (نص + رابط):</label>
                                  <span className="text-[10px] text-amber-400 font-bold">ربط بصفحة</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  <input
                                    type="text"
                                    value={block.secondaryButtonText || ''}
                                    onChange={(e) => handleUpdateBlock(block.id, { secondaryButtonText: e.target.value })}
                                    placeholder="نص الزر الفرعي..."
                                    className="bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none"
                                  />
                                  <div className="flex gap-1.5">
                                    <input
                                      type="text"
                                      value={block.secondaryButtonUrl || ''}
                                      onChange={(e) => handleUpdateBlock(block.id, { secondaryButtonUrl: e.target.value })}
                                      placeholder="الرابط URL..."
                                      className="bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs font-mono text-white focus:outline-none flex-1"
                                    />
                                    <select
                                      onChange={(e) => {
                                        if (e.target.value) handleUpdateBlock(block.id, { secondaryButtonUrl: e.target.value });
                                      }}
                                      defaultValue=""
                                      className="bg-slate-900 border border-slate-700 rounded-xl px-2 text-[10px] text-amber-300 font-bold focus:outline-none cursor-pointer"
                                      title="اختر صفحة للربط التلقائي"
                                    >
                                      <option value="" disabled>صفحة...</option>
                                      {pages.map((p) => (
                                        <option key={p.id} value={`/?page=${p.slug}`}>
                                          {p.title} (/{p.slug})
                                        </option>
                                      ))}
                                      <option value="#contact">تواصل معنا</option>
                                      <option value="#about">عن المنظومة</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* LIST ITEMS EDITOR FOR STATS, FEATURES, TEAM, TIMELINE, FAQ */}
                        {['stats', 'features', 'team', 'timeline', 'faq'].includes(block.type) && (
                          <div className="space-y-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="text-[11px] font-bold text-slate-200">عنوان القسم:</label>
                                <input
                                  type="text"
                                  value={block.title || ''}
                                  onChange={(e) => handleUpdateBlock(block.id, { title: e.target.value })}
                                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[11px] font-bold text-slate-200">الوصف الفرعي للقسم:</label>
                                <input
                                  type="text"
                                  value={block.subtitle || ''}
                                  onChange={(e) => handleUpdateBlock(block.id, { subtitle: e.target.value })}
                                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none"
                                />
                              </div>
                            </div>

                            {/* Sub-Items List */}
                            <div className="space-y-3 pt-2 border-t border-slate-800">
                              <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-amber-400">عناصر وحقول القائمة ({block.items?.length || 0}):</label>
                                <button
                                  type="button"
                                  onClick={() => handleAddSubItem(block.id)}
                                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] rounded-lg flex items-center gap-1"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>إضافة عنصر للقائمة</span>
                                </button>
                              </div>

                              <div className="space-y-2">
                                {(block.items || []).map((subItem, sIdx) => (
                                  <div key={subItem.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2 relative">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[10px] font-bold text-slate-400">عنصر #{sIdx + 1}</span>
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveSubItem(block.id, subItem.id)}
                                        className="text-red-400 hover:text-red-300 text-[10px]"
                                      >
                                        حذف
                                      </button>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                      <input
                                        type="text"
                                        value={subItem.title}
                                        onChange={(e) => handleUpdateSubItem(block.id, subItem.id, { title: e.target.value })}
                                        placeholder="العنوان / الاسم..."
                                        className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none"
                                      />

                                      {block.type === 'stats' && (
                                        <input
                                          type="text"
                                          value={subItem.value || ''}
                                          onChange={(e) => handleUpdateSubItem(block.id, subItem.id, { value: e.target.value })}
                                          placeholder="القيمة الرقمية (+150)..."
                                          className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-amber-400 font-bold focus:outline-none"
                                        />
                                      )}

                                      {block.type === 'timeline' && (
                                        <input
                                          type="text"
                                          value={subItem.date || ''}
                                          onChange={(e) => handleUpdateSubItem(block.id, subItem.id, { date: e.target.value })}
                                          placeholder="السنة / التاريخ (2026)..."
                                          className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-amber-400 font-mono focus:outline-none"
                                        />
                                      )}

                                      {block.type === 'team' && (
                                        <input
                                          type="text"
                                          value={subItem.subtitle || ''}
                                          onChange={(e) => handleUpdateSubItem(block.id, subItem.id, { subtitle: e.target.value })}
                                          placeholder="المسمى الوظيفي..."
                                          className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none"
                                        />
                                      )}

                                      <input
                                        type="text"
                                        value={subItem.description || ''}
                                        onChange={(e) => handleUpdateSubItem(block.id, subItem.id, { description: e.target.value })}
                                        placeholder="الوصف التوضيحي..."
                                        className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none sm:col-span-2"
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* GENERAL FREE BLOCKS (Heading, Paragraph, Video, Image, Quote, CTA, Audio, etc.) */}
                        {(block.type === 'heading' || block.type === 'subheading') && (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={block.title || ''}
                              onChange={(e) => handleUpdateBlock(block.id, { title: e.target.value })}
                              placeholder="اكتب العنوان..."
                              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-bold focus:outline-none"
                            />
                            <input
                              type="text"
                              value={block.subtitle || ''}
                              onChange={(e) => handleUpdateBlock(block.id, { subtitle: e.target.value })}
                              placeholder="وصف فرعي (اختياري)..."
                              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-300 focus:outline-none"
                            />
                          </div>
                        )}

                        {block.type === 'paragraph' && (
                          <textarea
                            rows={3}
                            value={block.content || ''}
                            onChange={(e) => handleUpdateBlock(block.id, { content: e.target.value })}
                            placeholder="اكتب الفقرة النصية الكاملة هنا..."
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                          />
                        )}

                        {block.type === 'video' && (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={block.title || ''}
                              onChange={(e) => handleUpdateBlock(block.id, { title: e.target.value })}
                              placeholder="عنوان الفيديو..."
                              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none"
                            />
                            <input
                              type="text"
                              value={block.mediaUrl || ''}
                              onChange={(e) => handleUpdateBlock(block.id, { mediaUrl: e.target.value })}
                              placeholder="رابط تضمين اليوتيوب (Embed URL)..."
                              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs font-mono text-white focus:outline-none"
                            />
                          </div>
                        )}

                        {block.type === 'cta_button' && (
                          <div className="space-y-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
                            <input
                              type="text"
                              value={block.title || ''}
                              onChange={(e) => handleUpdateBlock(block.id, { title: e.target.value })}
                              placeholder="عنوان دعوة اتخاذ الإجراء..."
                              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs font-bold text-white focus:outline-none"
                            />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <input
                                type="text"
                                value={block.buttonText || ''}
                                onChange={(e) => handleUpdateBlock(block.id, { buttonText: e.target.value })}
                                placeholder="نص الزر..."
                                className="bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none"
                              />
                              <div className="flex gap-1.5">
                                <input
                                  type="text"
                                  value={block.buttonUrl || ''}
                                  onChange={(e) => handleUpdateBlock(block.id, { buttonUrl: e.target.value })}
                                  placeholder="رابط الزر (#contact أو /?page=...)..."
                                  className="bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs font-mono text-white focus:outline-none flex-1"
                                />
                                <select
                                  onChange={(e) => {
                                    if (e.target.value) handleUpdateBlock(block.id, { buttonUrl: e.target.value });
                                  }}
                                  defaultValue=""
                                  className="bg-slate-900 border border-slate-700 rounded-xl px-2 text-[10px] text-amber-300 font-bold focus:outline-none cursor-pointer"
                                  title="اختر صفحة لربطها بهذا الزر"
                                >
                                  <option value="" disabled>صفحة...</option>
                                  {pages.map((p) => (
                                    <option key={p.id} value={`/?page=${p.slug}`}>
                                      {p.title} (/{p.slug})
                                    </option>
                                  ))}
                                  <option value="#contact">نموذج التواصل</option>
                                  <option value="#about">عن المنظومة</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 2: Settings & SEO */}
          {activeTab === 'settings' && (
            <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-200 block">عنوان الصفحة:</label>
                  <input
                    type="text"
                    value={editingPage.title}
                    onChange={(e) =>
                      setEditingPage({ ...editingPage, title: e.target.value })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-200 block">رابط الصفحة (Slug):</label>
                  <input
                    type="text"
                    value={editingPage.slug}
                    onChange={(e) =>
                      setEditingPage({
                        ...editingPage,
                        slug: e.target.value.toLowerCase().replace(/\s+/g, '-'),
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs font-mono text-emerald-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-200 block">وصف فرعي تعريفي (Meta Description):</label>
                <textarea
                  rows={2}
                  value={editingPage.description}
                  onChange={(e) =>
                    setEditingPage({ ...editingPage, description: e.target.value })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
                <label className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between cursor-pointer">
                  <span className="text-xs font-bold text-white">حالة النشر العامة</span>
                  <input
                    type="checkbox"
                    checked={editingPage.status === 'published'}
                    onChange={(e) =>
                      setEditingPage({
                        ...editingPage,
                        status: e.target.checked ? 'published' : 'draft',
                      })
                    }
                    className="w-4 h-4 accent-amber-500 cursor-pointer"
                  />
                </label>

                <label className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between cursor-pointer">
                  <span className="text-xs font-bold text-white">إظهار بالقائمة العلوية</span>
                  <input
                    type="checkbox"
                    checked={editingPage.showInNavbar}
                    onChange={(e) =>
                      setEditingPage({
                        ...editingPage,
                        showInNavbar: e.target.checked,
                      })
                    }
                    className="w-4 h-4 accent-amber-500 cursor-pointer"
                  />
                </label>

                <label className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between cursor-pointer">
                  <span className="text-xs font-bold text-white">إظهار بالفوتر</span>
                  <input
                    type="checkbox"
                    checked={editingPage.showInFooter}
                    onChange={(e) =>
                      setEditingPage({
                        ...editingPage,
                        showInFooter: e.target.checked,
                      })
                    }
                    className="w-4 h-4 accent-amber-500 cursor-pointer"
                  />
                </label>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

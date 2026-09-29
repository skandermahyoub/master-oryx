import React, { useState, useEffect } from 'react';
import { useCMS } from '../../context/CMSContext';
import { ModuleReorderList } from './ModuleReorderList';
import { HeaderEditor } from './HeaderEditor';
import { SliderEditor } from './SliderEditor';
import { TickerEditor } from './TickerEditor';
import { AboutEditor } from './AboutEditor';
import { StatsEditor } from './StatsEditor';
import { FeaturesEditor } from './FeaturesEditor';
import { TestimonialsEditor } from './TestimonialsEditor';
import { BrandsEditor } from './BrandsEditor';
import { GalleryEditor } from './GalleryEditor';
import { FAQEditor } from './FAQEditor';
import { OffersEditor } from './OffersEditor';
import { BlogEditor } from './BlogEditor';
import { ContactEditor } from './ContactEditor';
import { FooterEditor } from './FooterEditor';
import { InboxManager } from './InboxManager';
import { ThemePicker } from './ThemePicker';
import { PageBuilderEditor } from './PageBuilderEditor';
import { StoreAdminTab } from './StoreAdmin/StoreAdminTab';
import { useStore } from '../../context/StoreContext';

import {
  Settings,
  GripVertical,
  Palette,
  FileText,
  PanelTop,
  Sliders,
  Megaphone,
  UserCheck,
  Award,
  Sparkles,
  Star,
  Building2,
  Image as ImageIcon,
  BookOpen,
  PhoneCall,
  PanelBottom,
  Inbox,
  RotateCcw,
  Download,
  Upload,
  Eye,
  BarChart2,
  HelpCircle,
  Home,
  LayoutGrid,
  ChevronLeft,
  Layers,
  Sparkle,
  ShoppingBag,
} from 'lucide-react';

export type MainAdminCategory = 'theme' | 'home' | 'store' | 'blog' | 'pages' | 'inbox';

export const AdminLayout: React.FC = () => {
  const {
    adminSubSection,
    setAdminSubSection,
    setActiveView,
    resetToPresetDefault,
    exportCMSData,
    importCMSData,
    contactMessages,
    cmsData,
  } = useCMS();

  const { storeConfig, orders } = useStore();

  // Determine current active main category from adminSubSection
  const getCategoryFromSection = (sec: string): MainAdminCategory => {
    if (sec === 'theme') return 'theme';
    if (sec === 'store') return 'store';
    if (sec === 'blog') return 'blog';
    if (sec === 'pages') return 'pages';
    if (sec === 'inbox') return 'inbox';
    return 'home';
  };

  const [activeCategory, setActiveCategory] = useState<MainAdminCategory>(
    getCategoryFromSection(adminSubSection)
  );

  // Keep active category synced if subSection changed elsewhere
  useEffect(() => {
    setActiveCategory(getCategoryFromSection(adminSubSection));
  }, [adminSubSection]);

  const unreadMessagesCount = contactMessages.filter((m) => !m.isRead).length;
  const pendingReviewsCount = (cmsData.testimonials?.items || []).filter(
    (i) => i.status === 'pending'
  ).length;
  const totalCustomPagesCount = (cmsData.customPages || []).length;
  const totalArticlesCount = (cmsData.blog?.posts || []).length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'new').length;

  // 1. The 6 Main WordPress-Style Pillars
  const mainPillars: {
    id: MainAdminCategory;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    badge?: number;
    colorClass: string;
    defaultSubSection: string;
  }[] = [
    {
      id: 'theme',
      title: '١. الاستايل والمظهر',
      subtitle: 'الهوية والألوان والخطوط',
      icon: <Palette className="w-5 h-5 text-emerald-400" />,
      colorClass: 'from-emerald-500/20 via-emerald-500/5 to-transparent border-emerald-500/40 text-emerald-400',
      defaultSubSection: 'theme',
    },
    {
      id: 'home',
      title: '٢. الصفحة الرئيسية',
      subtitle: 'موديولات وترتيب الأقسام (15 قسم)',
      icon: <Home className="w-5 h-5 text-amber-400" />,
      colorClass: 'from-amber-500/20 via-amber-500/5 to-transparent border-amber-500/40 text-amber-400',
      defaultSubSection: 'reorder',
    },
    {
      id: 'store',
      title: '٣. المتجر والمبيعات',
      subtitle: `${storeConfig.products.length} منتجات | ${storeConfig.categories.length} أقسام | الولاء`,
      icon: <ShoppingBag className="w-5 h-5 text-amber-400" />,
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : storeConfig.products.length,
      colorClass: 'from-amber-500/20 via-amber-500/5 to-transparent border-amber-500/40 text-amber-400',
      defaultSubSection: 'store',
    },
    {
      id: 'blog',
      title: '٤. المدونة والمقالات',
      subtitle: `${totalArticlesCount} مقالات وأنشطة معرفية`,
      icon: <BookOpen className="w-5 h-5 text-pink-400" />,
      badge: totalArticlesCount,
      colorClass: 'from-pink-500/20 via-pink-500/5 to-transparent border-pink-500/40 text-pink-400',
      defaultSubSection: 'blog',
    },
    {
      id: 'pages',
      title: '٥. الصفحات والمحتوى',
      subtitle: `${totalCustomPagesCount} صفحات مستقلة مصممة`,
      icon: <FileText className="w-5 h-5 text-blue-400" />,
      badge: totalCustomPagesCount,
      colorClass: 'from-blue-500/20 via-blue-500/5 to-transparent border-blue-500/40 text-blue-400',
      defaultSubSection: 'pages',
    },
    {
      id: 'inbox',
      title: '٦. صندوق الوارد',
      subtitle: 'الرسائل والتقييمات الواردة',
      icon: <Inbox className="w-5 h-5 text-purple-400" />,
      badge: unreadMessagesCount + pendingReviewsCount,
      colorClass: 'from-purple-500/20 via-purple-500/5 to-transparent border-purple-500/40 text-purple-400',
      defaultSubSection: 'inbox',
    },
  ];

  // 2. Homepage Sub-Modules List
  const homeSubModules = [
    {
      id: 'reorder',
      label: 'ترتيب وإخفاء الأقسام (Drag & Drop)',
      icon: <GripVertical className="w-4 h-4 text-amber-400" />,
      highlight: true,
    },
    {
      id: 'header',
      label: '١. الهيدر والهيرو',
      icon: <PanelTop className="w-4 h-4 text-amber-400" />,
    },
    {
      id: 'slider',
      label: '٢. السلايدر السينمائي',
      icon: <Sliders className="w-4 h-4 text-blue-400" />,
    },
    {
      id: 'ticker',
      label: '٣. الشريط النصي المتحرك',
      icon: <Megaphone className="w-4 h-4 text-purple-400" />,
    },
    {
      id: 'about',
      label: '٤. من نحن والإدارة',
      icon: <UserCheck className="w-4 h-4 text-emerald-400" />,
    },
    {
      id: 'stats',
      label: '٥. الأرقام والإحصائيات',
      icon: <BarChart2 className="w-4 h-4 text-amber-400" />,
    },
    {
      id: 'features',
      label: '٦. ما يميزنا والبطاقات',
      icon: <Award className="w-4 h-4 text-amber-400" />,
    },
    {
      id: 'offers',
      label: '٧. العروض والإعلانات',
      icon: <Sparkles className="w-4 h-4 text-amber-400" />,
    },
    {
      id: 'testimonials',
      label: '٨. شهادات التقدير',
      icon: <Star className="w-4 h-4 text-yellow-400" />,
    },
    {
      id: 'brands',
      label: '٩. شركاء النجاح',
      icon: <Building2 className="w-4 h-4 text-indigo-400" />,
    },
    {
      id: 'store',
      label: '١٠. المتجر والمنتجات المميزة',
      icon: <ShoppingBag className="w-4 h-4 text-amber-400" />,
    },
    {
      id: 'gallery',
      label: '١١. معرض الصور والوسائط',
      icon: <ImageIcon className="w-4 h-4 text-cyan-400" />,
    },
    {
      id: 'faq',
      label: '١٢. الأسئلة الشائعة (FAQ)',
      icon: <HelpCircle className="w-4 h-4 text-cyan-400" />,
    },
    {
      id: 'contact',
      label: '١٣. تواصل معنا وخيارات الاتصال',
      icon: <PhoneCall className="w-4 h-4 text-emerald-400" />,
    },
    {
      id: 'footer',
      label: '١٤. الفوتر الشامل',
      icon: <PanelBottom className="w-4 h-4 text-slate-400" />,
    },
  ];

  const handleSelectPillar = (pillar: typeof mainPillars[0]) => {
    setActiveCategory(pillar.id);
    if (pillar.id === 'home') {
      // If switching to home and not already on a home sub-module, open reorder or header
      if (getCategoryFromSection(adminSubSection) !== 'home') {
        setAdminSubSection(pillar.defaultSubSection);
      }
    } else {
      setAdminSubSection(pillar.defaultSubSection);
    }
  };

  const handleExportJSON = () => {
    const jsonStr = exportCMSData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `oryx-cms-config-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const success = importCMSData(event.target.result as string);
          if (success) {
            alert('تم استيراد تهيئة CMS بنجاح!');
          } else {
            alert('ملف JSON غير صالح.');
          }
        }
      };
      reader.readAsText(file);
    }
  };

  const handleReset = () => {
    if (confirm('هل أنت متأكد من إعادة تعيين جميع إعدادات الموديولات للوضع الافتراضي لشركة أوريكس؟')) {
      resetToPresetDefault();
    }
  };

  // Breadcrumb current label
  const getBreadcrumbLabel = () => {
    if (activeCategory === 'theme') return 'الاستايل والمظهر والهوية البصرية';
    if (activeCategory === 'store') return 'إدارة المتجر الإلكتروني والمبيعات والولاء والمخزون';
    if (activeCategory === 'blog') return 'نظام المدونة والمقالات';
    if (activeCategory === 'pages') return 'محرر ومصمم الصفحات (Page Builder)';
    if (activeCategory === 'inbox') return 'صندوق البريد والرسائل الواردة';
    
    // Home sub-module
    const currentSub = homeSubModules.find((m) => m.id === adminSubSection);
    return currentSub ? currentSub.label : 'الصفحة الرئيسية وموديولاتها';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-24 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* TOP LEVEL CMS BAR */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-amber-500/5 to-transparent pointer-events-none" />

          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3.5 bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 rounded-2xl font-bold shadow-lg shadow-amber-500/20 shrink-0">
              <Settings className="w-6 h-6 animate-spin-slow" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  لوحة تحكم منظومة أوريكس
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold font-mono">
                  Modular CMS v3.0
                </span>
              </div>
              {/* Breadcrumbs */}
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="text-slate-500">لوحة التحكم</span>
                <ChevronLeft className="w-3.5 h-3.5 text-slate-600" />
                <span className="text-amber-400/90 font-bold">{getBreadcrumbLabel()}</span>
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-end relative z-10">
            <button
              onClick={() => setActiveView('public')}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20 hover:scale-102"
              title="الانتقال الفوري لمعاينة الموقع كما يراه الزوار"
            >
              <Eye className="w-4 h-4" />
              <span>معاينة بالموقع العام</span>
            </button>

            <button
              onClick={handleExportJSON}
              className="px-3.5 py-2.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors shadow-sm"
              title="تصدير نسخة احتياطية من كافة الموديولات كملف JSON"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>تصدير JSON</span>
            </button>

            <label className="px-3.5 py-2.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm">
              <Upload className="w-4 h-4 text-amber-400" />
              <span>استيراد JSON</span>
              <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
            </label>

            <button
              onClick={handleReset}
              className="px-3.5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold text-xs rounded-xl border border-red-500/30 flex items-center gap-1.5 transition-colors"
              title="إعادة تعيين المحتوى إلى نمط شركة أوريكس الافتراضي"
            >
              <RotateCcw className="w-4 h-4" />
              <span>إعادة للوضع الافتراضي</span>
            </button>
          </div>
        </div>

        {/* 1. MASTER 6-PILLAR SYSTEM MENU (WordPress-Style Main Sections) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {mainPillars.map((pillar) => {
            const isActive = activeCategory === pillar.id;
            return (
              <button
                key={pillar.id}
                type="button"
                onClick={() => handleSelectPillar(pillar)}
                className={`p-4 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden group shadow-lg ${
                  isActive
                    ? `bg-slate-900 border-amber-500 shadow-amber-500/10 ring-2 ring-amber-500/20`
                    : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700 text-slate-400'
                }`}
              >
                {/* Active Top Accent Line */}
                {isActive && (
                  <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600" />
                )}

                <div className="flex items-center justify-between w-full mb-3">
                  <div className={`p-2.5 rounded-xl border transition-all ${
                    isActive ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-slate-950 border-slate-800'
                  }`}>
                    {pillar.icon}
                  </div>

                  {pillar.badge !== undefined && pillar.badge > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      pillar.id === 'inbox' && unreadMessagesCount > 0
                        ? 'bg-red-500 text-white animate-pulse'
                        : 'bg-slate-800 border border-slate-700 text-slate-300'
                    }`}>
                      {pillar.badge}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className={`text-sm font-black transition-colors ${
                    isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'
                  }`}>
                    {pillar.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 line-clamp-1">
                    {pillar.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* 2. SECONDARY SUB-MENU (Appears only when "الصفحة الرئيسية" pillar is active) */}
        {activeCategory === 'home' && (
          <div className="p-4 bg-slate-900/70 border border-slate-800/80 rounded-3xl space-y-3 animate-in fade-in duration-300">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-slate-300">
                  اختر موديول الصفحة الرئيسية لتعديل محتواه وإعداداته:
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">
                ١٣ موديول + أداة الترتيب
              </span>
            </div>

            {/* Scrollable Sub-Modules Pills Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
              {homeSubModules.map((sub) => {
                const isSubActive = adminSubSection === sub.id;
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => setAdminSubSection(sub.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 flex items-center gap-2 border transition-all cursor-pointer ${
                      isSubActive
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20 font-black scale-102'
                        : sub.highlight
                        ? 'bg-slate-950 text-amber-300 border-amber-500/30 hover:bg-slate-800'
                        : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {sub.icon}
                    <span>{sub.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. ACTIVE SUB-SECTION WORKSPACE CONTAINER */}
        <div className="animate-in fade-in duration-300">
          {adminSubSection === 'theme' && <ThemePicker />}
          {adminSubSection === 'pages' && <PageBuilderEditor />}
          {adminSubSection === 'blog' && <BlogEditor />}
          {adminSubSection === 'inbox' && <InboxManager />}
          {adminSubSection === 'store' && <StoreAdminTab />}

          {/* Homepage Modules */}
          {adminSubSection === 'reorder' && <ModuleReorderList />}
          {adminSubSection === 'header' && <HeaderEditor />}
          {adminSubSection === 'slider' && <SliderEditor />}
          {adminSubSection === 'ticker' && <TickerEditor />}
          {adminSubSection === 'about' && <AboutEditor />}
          {adminSubSection === 'stats' && <StatsEditor />}
          {adminSubSection === 'features' && <FeaturesEditor />}
          {adminSubSection === 'offers' && <OffersEditor />}
          {adminSubSection === 'testimonials' && <TestimonialsEditor />}
          {adminSubSection === 'brands' && <BrandsEditor />}
          {adminSubSection === 'gallery' && <GalleryEditor />}
          {adminSubSection === 'faq' && <FAQEditor />}
          {adminSubSection === 'contact' && <ContactEditor />}
          {adminSubSection === 'footer' && <FooterEditor />}
        </div>
      </div>
    </div>
  );
};

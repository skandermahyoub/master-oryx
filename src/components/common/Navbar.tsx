import React, { useEffect, useState, useRef } from 'react';
import { useCMS } from '../../context/CMSContext';
import {
  Settings,
  Eye,
  Menu,
  X,
  MessageSquare,
  ChevronDown,
  Home,
  UserCheck,
  BarChart2,
  Award,
  Sparkles,
  Star,
  Building2,
  Image as ImageIcon,
  HelpCircle,
  BookOpen,
  PhoneCall,
  FileText,
  Sun,
  Moon,
  ShoppingBag,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    cmsData,
    activeView,
    setActiveView,
    setIsLiveChatOpen,
    navigateToCustomPage,
    colorMode,
    toggleColorMode,
  } = useCMS();
  const { header } = cmsData;
  const [isScrolled, setIsScrolled] = useState(false);

  // Separate states for Desktop dropdown and Mobile menu
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const desktopDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close desktop dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        desktopDropdownRef.current &&
        !desktopDropdownRef.current.contains(event.target as Node)
      ) {
        setDesktopDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Published custom pages
  const publishedCustomNavbarPages = (cmsData.customPages || []).filter(
    (p) => p.status === 'published' && p.showInNavbar
  );

  const navLinks = [
    { label: 'الرئيسية', href: '#hero', icon: <Home className="w-4 h-4 text-amber-400" />, show: true },
    { label: 'عن المنظومة', href: '#about', icon: <UserCheck className="w-4 h-4 text-emerald-400" />, show: cmsData.moduleVisibility.about ?? true },
    { label: 'الأرقام والإحصائيات', href: '#stats', icon: <BarChart2 className="w-4 h-4 text-amber-400" />, show: cmsData.moduleVisibility.stats ?? true },
    { label: 'ما يميزنا', href: '#features', icon: <Award className="w-4 h-4 text-amber-400" />, show: cmsData.moduleVisibility.features ?? true },
    { label: 'العروض والإعلانات', href: '#offers', icon: <Sparkles className="w-4 h-4 text-amber-400" />, show: cmsData.moduleVisibility.offers ?? true },
    { label: 'شهادات التقدير', href: '#testimonials', icon: <Star className="w-4 h-4 text-yellow-400" />, show: cmsData.moduleVisibility.testimonials ?? true },
    { label: 'شركاء النجاح', href: '#brands', icon: <Building2 className="w-4 h-4 text-indigo-400" />, show: cmsData.moduleVisibility.brands ?? true },
    { label: 'المتجر الرقمي والمنتجات', href: '#store-showcase', icon: <ShoppingBag className="w-4 h-4 text-amber-400" />, show: cmsData.moduleVisibility.store ?? true },
    { label: 'معرض الصور', href: '#gallery', icon: <ImageIcon className="w-4 h-4 text-cyan-400" />, show: cmsData.moduleVisibility.gallery ?? true },
    { label: 'الأسئلة الشائعة (FAQ)', href: '#faq', icon: <HelpCircle className="w-4 h-4 text-cyan-400" />, show: cmsData.moduleVisibility.faq ?? true },
    { label: 'المدونة والمقالات', href: '#blog', icon: <BookOpen className="w-4 h-4 text-pink-400" />, show: cmsData.moduleVisibility.blog ?? true },
    { label: 'تواصل معنا', href: '#contact', icon: <PhoneCall className="w-4 h-4 text-emerald-400" />, show: cmsData.moduleVisibility.contact ?? true },
  ].filter((link) => link.show);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 shadow-2xl py-3'
            : 'bg-gradient-to-b from-slate-950/90 via-slate-950/50 to-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Right Side: Logo & Enterprise Brand */}
          <a
            href="#hero"
            onClick={() => {
              navigateToCustomPage(null);
              setMobileMenuOpen(false);
              setDesktopDropdownOpen(false);
            }}
            className="flex items-center gap-3 group shrink-0"
          >
            {header.logoUrl ? (
              <img
                src={header.logoUrl}
                alt={header.appName}
                className="w-10 h-10 md:w-11 md:h-11 rounded-xl object-cover border border-amber-500/30 group-hover:border-amber-400 transition-all shadow-md shadow-amber-500/10"
              />
            ) : (
              <div className="w-10 h-10 bg-amber-500 text-slate-950 rounded-xl flex items-center justify-center font-black text-xl shadow-md">
                أ
              </div>
            )}
            <div className="flex flex-col text-right">
              <span className="text-base md:text-lg font-extrabold text-white tracking-wide group-hover:text-amber-400 transition-colors flex items-center gap-1.5">
                {header.appName}
              </span>
              <span className="text-[10px] md:text-xs text-amber-400/90 font-medium tracking-tight line-clamp-1 max-w-[170px] sm:max-w-none">
                {header.slogan}
              </span>
            </div>
          </a>

          {/* Center (DESKTOP ONLY): Clean Dropdown Menu Button instead of 12 horizontal links */}
          <div className="hidden lg:block relative" ref={desktopDropdownRef}>
            <button
              type="button"
              onClick={() => setDesktopDropdownOpen(!desktopDropdownOpen)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all cursor-pointer shadow-md ${
                desktopDropdownOpen
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-amber-500/20'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-200 border-slate-700/80 hover:text-white hover:border-amber-500/50'
              }`}
            >
              <Menu className="w-4 h-4 text-amber-400" />
              <span>أقسام وصفحات الموقع</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  desktopDropdownOpen ? 'rotate-180 text-slate-950' : 'text-slate-400'
                }`}
              />
            </button>

            {/* Desktop Dropdown Popover */}
            {desktopDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-slate-900 border border-slate-700/90 rounded-2xl p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1.5 max-h-[75vh] overflow-y-auto custom-scrollbar">
                <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 border-b border-slate-800 mb-1 flex items-center justify-between">
                  <span>أقسام الصفحة الرئيسية</span>
                  <span className="text-amber-400 font-mono text-[10px]">{navLinks.length}</span>
                </div>

                {navLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.href}
                    onClick={() => {
                      navigateToCustomPage(null);
                      setDesktopDropdownOpen(false);
                    }}
                    className="px-3 py-2 text-xs font-semibold text-slate-200 hover:text-amber-300 hover:bg-slate-800/90 rounded-xl transition-all flex items-center gap-2.5 group"
                  >
                    <span className="p-1 rounded-lg bg-slate-950 border border-slate-800 group-hover:border-amber-500/30">
                      {link.icon}
                    </span>
                    <span>{link.label}</span>
                  </a>
                ))}

                {/* Published Custom Pages inside Desktop Dropdown */}
                {publishedCustomNavbarPages.length > 0 && (
                  <>
                    <div className="px-3 py-1.5 text-[11px] font-bold text-blue-400 border-t border-slate-800 mt-2 pt-2 flex items-center justify-between">
                      <span>الصفحات المستقلة</span>
                      <span className="font-mono text-[10px]">{publishedCustomNavbarPages.length}</span>
                    </div>
                    {publishedCustomNavbarPages.map((page) => (
                      <button
                        key={page.id}
                        type="button"
                        onClick={() => {
                          navigateToCustomPage(page.slug);
                          setDesktopDropdownOpen(false);
                        }}
                        className="w-full text-right px-3 py-2 text-xs font-bold text-blue-300 hover:text-white hover:bg-blue-950/40 rounded-xl transition-all flex items-center gap-2.5"
                      >
                        <FileText className="w-3.5 h-3.5 text-blue-400" />
                        <span className="truncate">{page.title}</span>
                      </button>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Left Side: Actions & Mobile Hamburger */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Dark / Light Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleColorMode}
              title={colorMode === 'light' ? 'التحويل للوضع الداكن الفحمي' : 'التحويل للوضع الفاتح الكريستالي'}
              className="p-2 sm:px-2.5 sm:py-2 bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-amber-400 rounded-xl border border-slate-700/80 transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              {colorMode === 'light' ? (
                <>
                  <Moon className="w-4 h-4 text-indigo-500" />
                  <span className="hidden xl:inline text-xs font-bold text-slate-700">داكن</span>
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
                  <span className="hidden xl:inline text-xs font-bold text-amber-300">فاتح</span>
                </>
              )}
            </button>

            {/* Live Chat Button */}
            <button
              type="button"
              onClick={() => setIsLiveChatOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-slate-900/80 hover:bg-slate-800 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700/80 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
              <span>محادثة فورية</span>
            </button>

            {/* Direct Store View Button */}
            <button
              type="button"
              onClick={() => {
                setActiveView('store');
                setMobileMenuOpen(false);
                setDesktopDropdownOpen(false);
              }}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-bold rounded-xl border border-amber-500/30 transition-all cursor-pointer shadow-sm"
              title="دخول المتجر الرقمي الكامل"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>المتجر الرقمي</span>
            </button>

            {/* Switch view between Public & Admin */}
            <button
              type="button"
              onClick={() => {
                setActiveView(activeView === 'public' ? 'admin' : 'public');
                setMobileMenuOpen(false);
                setDesktopDropdownOpen(false);
              }}
              className={`px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 sm:gap-2 shadow-lg transition-all cursor-pointer ${
                activeView === 'admin'
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
              }`}
            >
              {activeView === 'public' ? (
                <>
                  <Settings className="w-4 h-4 animate-spin-slow" />
                  <span className="hidden sm:inline">لوحة تحكم CMS</span>
                  <span className="sm:hidden">التحكم</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  <span className="hidden sm:inline">معاينة الموقع</span>
                  <span className="sm:hidden">الموقع</span>
                </>
              )}
            </button>

            {/* Mobile Hamburger Button (Standard Mobile Only: lg:hidden) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-300 hover:text-white bg-slate-900/90 rounded-xl border border-slate-700/80 transition-colors cursor-pointer"
              aria-label="قائمة الملاحة"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-amber-400" />}
            </button>
          </div>
        </div>
      </header>

      {/* Standard Mobile Navigation Drawer (lg:hidden) */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-[65px] sm:top-[70px] z-30 bg-slate-950/95 backdrop-blur-2xl border-b border-slate-800 p-4 sm:p-5 shadow-2xl lg:hidden animate-in slide-in-from-top duration-200 max-h-[80vh] overflow-y-auto custom-scrollbar">
          <div className="flex flex-col gap-1.5">
            {/* Direct Store Button for Mobile */}
            <button
              type="button"
              onClick={() => {
                setActiveView('store');
                setMobileMenuOpen(false);
              }}
              className="w-full px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-between transition-all cursor-pointer mb-1"
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                <span>دخول المتجر الرقمي المتكامل</span>
              </div>
              <span className="text-xs">←</span>
            </button>

            {navLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                onClick={() => {
                  navigateToCustomPage(null);
                  setMobileMenuOpen(false);
                }}
                className="px-4 py-2.5 bg-slate-900/60 hover:bg-slate-800 text-slate-200 hover:text-amber-400 text-xs sm:text-sm font-bold rounded-xl border border-slate-800/80 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  {link.icon}
                  <span>{link.label}</span>
                </div>
                <span className="text-xs text-slate-500">←</span>
              </a>
            ))}

            {publishedCustomNavbarPages.map((page) => (
              <button
                key={page.id}
                type="button"
                onClick={() => {
                  navigateToCustomPage(page.slug);
                  setMobileMenuOpen(false);
                }}
                className="px-4 py-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs sm:text-sm font-bold rounded-xl border border-amber-500/30 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>{page.title}</span>
                </div>
                <span className="text-[10px] bg-amber-500/20 px-2 py-0.5 rounded-md">صفحة</span>
              </button>
            ))}

            <div className="pt-2 mt-1 border-t border-slate-800 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  toggleColorMode();
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold rounded-xl flex items-center justify-center gap-2 border border-slate-700"
              >
                {colorMode === 'light' ? (
                  <>
                    <Moon className="w-4 h-4 text-indigo-500" />
                    <span>الوضع الداكن الفحمي</span>
                  </>
                ) : (
                  <>
                    <Sun className="w-4 h-4 text-amber-400" />
                    <span>الوضع الفاتح الكريستالي</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsLiveChatOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-400 text-xs font-bold rounded-xl flex items-center justify-center gap-2 border border-slate-700"
              >
                <MessageSquare className="w-4 h-4" />
                <span>الدردشة</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

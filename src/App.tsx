import React from 'react';
import { CMSProvider, useCMS } from './context/CMSContext';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/common/Navbar';
import { ModuleReveal } from './components/common/ModuleReveal';
import { HeaderModule } from './components/modules/HeaderModule';
import { SliderModule } from './components/modules/SliderModule';
import { TickerModule } from './components/modules/TickerModule';
import { AboutModule } from './components/modules/AboutModule';
import { FeaturesModule } from './components/modules/FeaturesModule';
import { OffersModule } from './components/modules/OffersModule';
import { TestimonialsModule } from './components/modules/TestimonialsModule';
import { BrandsModule } from './components/modules/BrandsModule';
import { GalleryModule } from './components/modules/GalleryModule';
import { StatsModule } from './components/modules/StatsModule';
import { FAQModule } from './components/modules/FAQModule';
import { BlogModule } from './components/modules/BlogModule';
import { ContactModule } from './components/modules/ContactModule';
import { FooterModule } from './components/modules/FooterModule';
import { AdminLayout } from './components/admin/AdminLayout';
import { CustomPageRenderer } from './components/common/CustomPageRenderer';
import { PdfViewerModal } from './components/common/PdfViewerModal';
import { BlogArticleModal } from './components/common/BlogArticleModal';
import { LiveChatModal } from './components/common/LiveChatModal';

// Store Components
import { StoreModule } from './components/store/StoreModule';
import { StorePage } from './components/store/StorePage';
import { CartDrawer } from './components/store/CartDrawer';
import { WishlistDrawer } from './components/store/WishlistDrawer';
import { CompareModal } from './components/store/CompareModal';
import { POSCashierModal } from './components/store/POSCashierModal';
import { ProductDetailsModal } from './components/store/ProductDetailsModal';
import { StoreBottomDock } from './components/store/StoreBottomDock';

const MainAppContent: React.FC = () => {
  const { activeView, setActiveView, cmsData, activeCustomPageSlug, navigateToCustomPage } = useCMS();

  // Apply theme settings globally across the entire app
  React.useEffect(() => {
    const theme = cmsData.theme;
    if (!theme) return;

    const hexToRgb = (hex: string) => {
      let c = hex.replace('#', '');
      if (c.length === 3) c = c.split('').map((x) => x + x).join('');
      const num = parseInt(c, 16);
      if (isNaN(num)) return '245, 158, 11';
      return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
    };

    const root = document.documentElement;
    root.style.setProperty('--primary-color', theme.primaryColor);
    root.style.setProperty('--primary-hover', theme.primaryHover || theme.primaryColor);
    root.style.setProperty('--primary-light', theme.primaryColor);
    root.style.setProperty('--primary-rgb', hexToRgb(theme.primaryColor));
    root.style.setProperty('--secondary-color', theme.secondaryColor);
    root.style.setProperty('--secondary-rgb', hexToRgb(theme.secondaryColor));
    root.style.setProperty('--accent-color', theme.accentColor);
    root.style.setProperty('--accent-rgb', hexToRgb(theme.accentColor));
    root.style.setProperty('--card-bg-color', theme.cardBgColor || '#18181b');
    root.style.setProperty('--card-bg-rgb', hexToRgb(theme.cardBgColor || '#18181b'));
    root.style.setProperty('--glow-intensity', `${(theme.glowIntensity ?? 50) / 100}`);

    if (theme.fontFamily) {
      document.body.style.fontFamily = `'${theme.fontFamily}', sans-serif`;
    }
  }, [cmsData.theme]);

  // Global link handler for custom page URLs (e.g. ?page=about-us or /?page=about-us or full URLs)
  React.useEffect(() => {
    const handleGlobalLinkClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement)?.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (href && (href.includes('?page=') || href.includes('&page='))) {
        try {
          const url = new URL(href, window.location.href);
          const pageParam = url.searchParams.get('page');
          if (pageParam) {
            e.preventDefault();
            navigateToCustomPage(pageParam);
          }
        } catch {
          // fallback string extraction
          const match = href.match(/[?&]page=([^&#]+)/);
          if (match && match[1]) {
            e.preventDefault();
            navigateToCustomPage(match[1]);
          }
        }
      }
    };

    document.addEventListener('click', handleGlobalLinkClick);
    return () => document.removeEventListener('click', handleGlobalLinkClick);
  }, [navigateToCustomPage]);

  // If in Admin Dashboard
  if (activeView === 'admin') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-['Cairo',sans-serif]">
        <Navbar />
        <AdminLayout />
        <POSCashierModal />
      </div>
    );
  }

  // If in Dedicated Store Page
  if (activeView === 'store') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-['Cairo',sans-serif]">
        <StorePage onBackToHome={() => setActiveView('public')} />

        {/* Global Store Drawers & Modals */}
        <CartDrawer />
        <WishlistDrawer />
        <CompareModal />
        <POSCashierModal />
        <ProductDetailsModal />
        <StoreBottomDock onOpenStore={() => setActiveView('store')} isStoreView={true} />
      </div>
    );
  }

  // If viewing a dynamic custom page
  if (activeCustomPageSlug) {
    return (
      <>
        <CustomPageRenderer />
        <PdfViewerModal />
        <BlogArticleModal />
        <LiveChatModal />
        <CartDrawer />
        <WishlistDrawer />
        <CompareModal />
        <POSCashierModal />
        <ProductDetailsModal />
        <StoreBottomDock onOpenStore={() => setActiveView('store')} isStoreView={false} />
      </>
    );
  }

  // Render Public Landing Page dynamically according to `cmsData.modulesOrder` sequence
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-['Cairo',sans-serif] selection:bg-amber-500 selection:text-slate-950">
      <Navbar />

      <main className="relative">
        {cmsData.modulesOrder.map((moduleKey, index) => {
          const isVisible = cmsData.moduleVisibility[moduleKey] ?? true;
          if (!isVisible) return null;

          const renderModuleContent = () => {
            switch (moduleKey) {
              case 'header':
                return <HeaderModule />;
              case 'slider':
                return <SliderModule />;
              case 'ticker':
                return <TickerModule />;
              case 'about':
                return <AboutModule />;
              case 'stats':
                return <StatsModule />;
              case 'features':
                return <FeaturesModule />;
              case 'offers':
                return <OffersModule />;
              case 'testimonials':
                return <TestimonialsModule />;
              case 'brands':
                return <BrandsModule />;
              case 'store':
                return <StoreModule onNavigateToStore={() => setActiveView('store')} />;
              case 'gallery':
                return <GalleryModule />;
              case 'faq':
                return <FAQModule />;
              case 'blog':
                return <BlogModule />;
              case 'contact':
                return <ContactModule />;
              case 'footer':
                return <FooterModule />;
              default:
                return null;
            }
          };

          return (
            <ModuleReveal key={moduleKey} delay={0.05 * (index % 3)}>
              {renderModuleContent()}
            </ModuleReveal>
          );
        })}
      </main>

      {/* Global Modals & Store Drawers */}
      <PdfViewerModal />
      <BlogArticleModal />
      <LiveChatModal />

      <CartDrawer />
      <WishlistDrawer />
      <CompareModal />
      <POSCashierModal />
      <ProductDetailsModal />

      {/* Sleek Floating Bottom Dock Toolbar (Leaves Header 100% clean as requested) */}
      <StoreBottomDock onOpenStore={() => setActiveView('store')} isStoreView={false} />
    </div>
  );
};

export default function App() {
  return (
    <CMSProvider>
      <StoreProvider>
        <MainAppContent />
      </StoreProvider>
    </CMSProvider>
  );
}

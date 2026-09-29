import React, { createContext, useContext, useEffect, useState } from 'react';
import { DEFAULT_CMS_DATA } from '../data/defaultPreset';
import { CMSData, ContactMessage, CustomPage, ModuleKey, TestimonialItem, ThemeConfig } from '../types/cms';

interface CMSContextType {
  cmsData: CMSData;
  activeView: 'public' | 'admin' | 'store';
  setActiveView: (view: 'public' | 'admin' | 'store') => void;
  adminSubSection: string;
  setAdminSubSection: (section: string) => void;
  activeCustomPageSlug: string | null;
  navigateToCustomPage: (slug: string | null) => void;
  addCustomPage: (page: Omit<CustomPage, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCustomPage: (id: string, pageData: Partial<CustomPage>) => void;
  deleteCustomPage: (id: string) => void;
  updateTheme: (theme: Partial<ThemeConfig>) => void;
  updateModuleData: <K extends ModuleKey>(moduleKey: K, data: Partial<CMSData[K]>) => void;
  reorderModules: (newOrder: ModuleKey[]) => void;
  moveModule: (key: ModuleKey, direction: 'up' | 'down') => void;
  toggleModuleVisibility: (key: ModuleKey) => void;
  resetToPresetDefault: () => void;
  exportCMSData: () => string;
  importCMSData: (jsonString: string) => boolean;
  
  // Inbox & Submissions
  contactMessages: ContactMessage[];
  addContactMessage: (msg: Omit<ContactMessage, 'id' | 'date' | 'isRead'>) => void;
  markMessageRead: (id: string) => void;
  deleteMessage: (id: string) => void;
  
  // Testimonials inbox/approvals
  addTestimonialSubmission: (review: { clientName: string; clientRole: string; reviewText: string; rating: number }) => void;
  approveTestimonial: (id: string) => void;
  rejectTestimonial: (id: string) => void;
  deleteTestimonial: (id: string) => void;

  // AI helper
  generateAIImage: (prompt: string, aspectRatio?: string) => Promise<string>;
  isGeneratingAI: boolean;

  // Color Mode (Dark / Light / System)
  colorMode: 'dark' | 'light' | 'system';
  setColorMode: (mode: 'dark' | 'light' | 'system') => void;
  toggleColorMode: () => void;

  // Selected article for reader modal
  selectedArticleId: string | null;
  setSelectedArticleId: (id: string | null) => void;

  // PDF Modal
  isPdfModalOpen: boolean;
  setIsPdfModalOpen: (open: boolean) => void;

  // Live Chat Modal
  isLiveChatOpen: boolean;
  setIsLiveChatOpen: (open: boolean) => void;
}

const STORAGE_KEY = 'oryx_cms_data_v3';
const MESSAGES_KEY = 'oryx_cms_messages_v3';

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cmsData, setCmsData] = useState<CMSData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);

        // Safely merge any missing module keys (like 'stats', 'gallery', 'faq') into modulesOrder
        let mergedOrder: ModuleKey[] = parsed.modulesOrder
          ? [...parsed.modulesOrder]
          : [...DEFAULT_CMS_DATA.modulesOrder];

        DEFAULT_CMS_DATA.modulesOrder.forEach((key) => {
          if (!mergedOrder.includes(key)) {
            if (key === 'stats') {
              const aboutIdx = mergedOrder.indexOf('about');
              if (aboutIdx !== -1) {
                mergedOrder.splice(aboutIdx + 1, 0, 'stats');
              } else {
                mergedOrder.push('stats');
              }
            } else if (key === 'faq') {
              const galleryIdx = mergedOrder.indexOf('gallery');
              if (galleryIdx !== -1) {
                mergedOrder.splice(galleryIdx + 1, 0, 'faq');
              } else {
                mergedOrder.push('faq');
              }
            } else {
              const blogIdx = mergedOrder.indexOf('blog');
              if (blogIdx !== -1) {
                mergedOrder.splice(blogIdx, 0, key);
              } else {
                mergedOrder.push(key);
              }
            }
          }
        });

        // Safely merge missing default custom pages (e.g. 'about-us')
        let mergedPages: CustomPage[] = parsed.customPages
          ? [...parsed.customPages]
          : [...(DEFAULT_CMS_DATA.customPages || [])];

        (DEFAULT_CMS_DATA.customPages || []).forEach((defPage) => {
          if (!mergedPages.some((p) => p.slug === defPage.slug)) {
            mergedPages.push(defPage);
          }
        });

        // Sanitize theme to eliminate any legacy navy-blue (#0f172a) from previous sessions
        let sanitizedTheme = parsed.theme ? { ...parsed.theme } : { ...DEFAULT_CMS_DATA.theme };
        if (sanitizedTheme.secondaryColor === '#0f172a' || !sanitizedTheme.secondaryColor) {
          sanitizedTheme.secondaryColor = '#0a0a0a';
        }
        if (sanitizedTheme.cardBgColor === '#0f172a' || !sanitizedTheme.cardBgColor) {
          sanitizedTheme.cardBgColor = '#141415';
        }
        if (sanitizedTheme.presetName === 'amber') {
          sanitizedTheme.presetName = 'studio_dark';
        }

        return {
          ...DEFAULT_CMS_DATA,
          ...parsed,
          theme: sanitizedTheme,
          modulesOrder: mergedOrder,
          customPages: mergedPages,
          gallery: parsed.gallery || DEFAULT_CMS_DATA.gallery,
          stats: parsed.stats || DEFAULT_CMS_DATA.stats,
          faq: parsed.faq || DEFAULT_CMS_DATA.faq,
          moduleVisibility: {
            ...DEFAULT_CMS_DATA.moduleVisibility,
            ...(parsed.moduleVisibility || {}),
            gallery: parsed.moduleVisibility?.gallery ?? true,
            stats: parsed.moduleVisibility?.stats ?? true,
            faq: parsed.moduleVisibility?.faq ?? true,
          },
        };
      }
    } catch (e) {
      console.error('Failed to load CMS state from localStorage:', e);
    }
    return DEFAULT_CMS_DATA;
  });

  const [contactMessages, setContactMessages] = useState<ContactMessage[]>(() => {
    try {
      const saved = localStorage.getItem(MESSAGES_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load messages from localStorage:', e);
    }
    return [
      {
        id: 'msg-1',
        name: 'سليمان الفالح',
        email: 'sulaiman@investments.sa',
        phone: '+966551234567',
        subject: 'طلب استشارة حول التحول الرقمي وحزمة الموديولات',
        message: 'نود الاستفسار عن تفاصيل تطبيق نظام أوريكس CMS لشركة استثمارية تضم 4 فروع، وهل يمكن الربط مع برامج ERP الحالية لدينا؟',
        date: new Date().toISOString(),
        isRead: false,
      },
    ];
  });

  const [activeView, setActiveView] = useState<'public' | 'admin' | 'store'>('public');
  const [adminSubSection, setAdminSubSection] = useState<string>('reorder');
  const [activeCustomPageSlug, setActiveCustomPageSlug] = useState<string | null>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('page');
    } catch {
      return null;
    }
  });
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);
  const [isLiveChatOpen, setIsLiveChatOpen] = useState<boolean>(false);

  // Color Mode (Dark / Light / System)
  const [colorMode, setColorModeState] = useState<'dark' | 'light' | 'system'>(() => {
    try {
      const saved = localStorage.getItem('oryx_color_mode');
      if (saved === 'dark' || saved === 'light' || saved === 'system') return saved;
    } catch {}
    return (cmsData?.theme?.colorMode as 'dark' | 'light' | 'system') || 'dark';
  });

  const setColorMode = (mode: 'dark' | 'light' | 'system') => {
    setColorModeState(mode);
    updateTheme({ colorMode: mode });
  };

  const toggleColorMode = () => {
    const nextMode = colorMode === 'dark' ? 'light' : 'dark';
    setColorMode(nextMode);
  };

  // Synchronize <html> classes with colorMode and OS prefers-color-scheme
  useEffect(() => {
    const root = document.documentElement;
    const applyMode = (mode: 'dark' | 'light' | 'system') => {
      let resolved: 'dark' | 'light' = 'dark';
      if (mode === 'system') {
        resolved =
          typeof window !== 'undefined' &&
          window.matchMedia &&
          window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light';
      } else {
        resolved = mode;
      }

      if (resolved === 'light') {
        root.classList.add('light');
        root.classList.remove('dark');
      } else {
        root.classList.add('dark');
        root.classList.remove('light');
      }
    };

    applyMode(colorMode);
    try {
      localStorage.setItem('oryx_color_mode', colorMode);
    } catch {}

    if (colorMode === 'system' && typeof window !== 'undefined' && window.matchMedia) {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyMode('system');
      mq.addEventListener('change', listener);
      return () => mq.removeEventListener('change', listener);
    }
  }, [colorMode]);

  const navigateToCustomPage = (slug: string | null) => {
    setActiveCustomPageSlug(slug);
    try {
      const url = new URL(window.location.href);
      if (slug) {
        url.searchParams.set('page', slug);
      } else {
        url.searchParams.delete('page');
      }
      window.history.pushState({}, '', url.toString());
    } catch (e) {
      // fallback
    }

    if (slug) {
      setActiveView('public');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const addCustomPage = (page: Omit<CustomPage, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPage: CustomPage = {
      ...page,
      id: `page-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    const updated = [...(cmsData.customPages || []), newPage];
    setCmsData((prev) => {
      const next = { ...prev, customPages: updated };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const updateCustomPage = (id: string, pageData: Partial<CustomPage>) => {
    const updated = (cmsData.customPages || []).map((p) =>
      p.id === id
        ? { ...p, ...pageData, updatedAt: new Date().toISOString().split('T')[0] }
        : p
    );
    setCmsData((prev) => {
      const next = { ...prev, customPages: updated };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const deleteCustomPage = (id: string) => {
    const updated = (cmsData.customPages || []).filter((p) => p.id !== id);
    setCmsData((prev) => {
      const next = { ...prev, customPages: updated };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  // Sync CSS variables for Theme Colors
  useEffect(() => {
    const theme = cmsData?.theme || DEFAULT_CMS_DATA.theme;
    if (!theme) return;

    const hexToRgb = (hex: string) => {
      let c = hex.replace('#', '');
      if (c.length === 3) c = c.split('').map((x) => x + x).join('');
      const num = parseInt(c, 16);
      if (isNaN(num)) return '245, 158, 11';
      return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
    };

    const root = document.documentElement;
    root.style.setProperty('--primary-color', theme.primaryColor || '#f59e0b');
    root.style.setProperty('--primary-hover', theme.primaryHover || '#d97706');
    root.style.setProperty('--primary-rgb', hexToRgb(theme.primaryColor || '#f59e0b'));

    root.style.setProperty('--secondary-color', theme.secondaryColor || '#0f172a');
    root.style.setProperty('--secondary-rgb', hexToRgb(theme.secondaryColor || '#0f172a'));

    root.style.setProperty('--accent-color', theme.accentColor || '#10b981');
    root.style.setProperty('--accent-rgb', hexToRgb(theme.accentColor || '#10b981'));

    root.style.setProperty('--card-bg-color', theme.cardBgColor || '#0f172a');
    root.style.setProperty('--card-bg-rgb', hexToRgb(theme.cardBgColor || '#0f172a'));
    root.style.setProperty('--glow-intensity', `${(theme.glowIntensity ?? 50) / 100}`);

    if (theme.fontFamily) {
      document.body.style.fontFamily = `'${theme.fontFamily}', sans-serif`;
    }
  }, [cmsData?.theme]);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cmsData));
    } catch (e) {
      console.error('Failed to save CMS state to localStorage:', e);
    }
  }, [cmsData]);

  useEffect(() => {
    try {
      localStorage.setItem(MESSAGES_KEY, JSON.stringify(contactMessages));
    } catch (e) {
      console.error('Failed to save messages to localStorage:', e);
    }
  }, [contactMessages]);

  const updateTheme = (newTheme: Partial<ThemeConfig>) => {
    setCmsData((prev) => ({
      ...prev,
      theme: {
        ...(prev.theme || DEFAULT_CMS_DATA.theme!),
        ...newTheme,
      },
    }));
  };

  const updateModuleData = <K extends ModuleKey>(moduleKey: K, data: Partial<CMSData[K]>) => {
    setCmsData((prev) => ({
      ...prev,
      [moduleKey]: {
        ...prev[moduleKey],
        ...data,
      },
    }));
  };

  const reorderModules = (newOrder: ModuleKey[]) => {
    setCmsData((prev) => ({
      ...prev,
      modulesOrder: newOrder,
    }));
  };

  const moveModule = (key: ModuleKey, direction: 'up' | 'down') => {
    setCmsData((prev) => {
      const currentOrder = [...prev.modulesOrder];
      const index = currentOrder.indexOf(key);
      if (index === -1) return prev;

      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= currentOrder.length) return prev;

      // Swap
      const temp = currentOrder[index];
      currentOrder[index] = currentOrder[targetIndex];
      currentOrder[targetIndex] = temp;

      return {
        ...prev,
        modulesOrder: currentOrder,
      };
    });
  };

  const toggleModuleVisibility = (key: ModuleKey) => {
    setCmsData((prev) => ({
      ...prev,
      moduleVisibility: {
        ...prev.moduleVisibility,
        [key]: !prev.moduleVisibility[key],
      },
    }));
  };

  const resetToPresetDefault = () => {
    setCmsData(DEFAULT_CMS_DATA);
    localStorage.removeItem(STORAGE_KEY);
  };

  const exportCMSData = () => {
    return JSON.stringify(cmsData, null, 2);
  };

  const importCMSData = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && typeof parsed === 'object' && parsed.modulesOrder) {
        setCmsData(parsed);
        return true;
      }
    } catch (e) {
      console.error('Invalid JSON import:', e);
    }
    return false;
  };

  const addContactMessage = (msg: Omit<ContactMessage, 'id' | 'date' | 'isRead'>) => {
    const newMessage: ContactMessage = {
      ...msg,
      id: `msg-${Date.now()}`,
      date: new Date().toISOString(),
      isRead: false,
    };
    setContactMessages((prev) => [newMessage, ...prev]);
  };

  const markMessageRead = (id: string) => {
    setContactMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isRead: true } : m))
    );
  };

  const deleteMessage = (id: string) => {
    setContactMessages((prev) => prev.filter((m) => m.id !== id));
  };

  const addTestimonialSubmission = (review: {
    clientName: string;
    clientRole: string;
    reviewText: string;
    rating: number;
  }) => {
    const newTestimonial: TestimonialItem = {
      id: `test-${Date.now()}`,
      clientName: review.clientName,
      clientRole: review.clientRole || 'عميل محترم',
      clientPhoto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      reviewText: review.reviewText,
      rating: review.rating,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
    };

    // Append to testimonials items in CMS
    setCmsData((prev) => ({
      ...prev,
      testimonials: {
        ...prev.testimonials,
        items: [newTestimonial, ...prev.testimonials.items],
      },
    }));
  };

  const approveTestimonial = (id: string) => {
    setCmsData((prev) => ({
      ...prev,
      testimonials: {
        ...prev.testimonials,
        items: prev.testimonials.items.map((item) =>
          item.id === id ? { ...item, status: 'approved' } : item
        ),
      },
    }));
  };

  const rejectTestimonial = (id: string) => {
    setCmsData((prev) => ({
      ...prev,
      testimonials: {
        ...prev.testimonials,
        items: prev.testimonials.items.filter((item) => item.id !== id),
      },
    }));
  };

  const deleteTestimonial = (id: string) => {
    rejectTestimonial(id);
  };

  const generateAIImage = async (prompt: string, aspectRatio: string = '16:9'): Promise<string> => {
    setIsGeneratingAI(true);
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, aspectRatio }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'فشل في توليد الصورة');
      }

      return data.imageUrl;
    } catch (error: any) {
      console.error('AI Image Generation error:', error);
      throw error;
    } finally {
      setIsGeneratingAI(false);
    }
  };

  return (
    <CMSContext.Provider
      value={{
        cmsData,
        activeView,
        setActiveView,
        adminSubSection,
        setAdminSubSection,
        activeCustomPageSlug,
        navigateToCustomPage,
        addCustomPage,
        updateCustomPage,
        deleteCustomPage,
        updateTheme,
        updateModuleData,
        reorderModules,
        moveModule,
        toggleModuleVisibility,
        resetToPresetDefault,
        exportCMSData,
        importCMSData,
        contactMessages,
        addContactMessage,
        markMessageRead,
        deleteMessage,
        addTestimonialSubmission,
        approveTestimonial,
        rejectTestimonial,
        deleteTestimonial,
        generateAIImage,
        isGeneratingAI,
        colorMode,
        setColorMode,
        toggleColorMode,
        selectedArticleId,
        setSelectedArticleId,
        isPdfModalOpen,
        setIsPdfModalOpen,
        isLiveChatOpen,
        setIsLiveChatOpen,
      }}
    >
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
};

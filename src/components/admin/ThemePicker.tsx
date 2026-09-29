import React, { useState, useEffect } from 'react';
import { useCMS } from '../../context/CMSContext';
import {
  Palette,
  Check,
  Save,
  RotateCcw,
  Sparkles,
  Eye,
  Type,
  SunMedium,
  Code2,
  Copy,
  SlidersHorizontal,
  CheckCircle2,
  Layers,
  Grid,
  BookmarkPlus,
  Trash2,
  Sun,
  Moon,
  Monitor,
} from 'lucide-react';
import { ThemeConfig, CustomPaletteItem } from '../../types/cms';

export interface ThemePreset {
  id: string;
  nameAr: string;
  primaryColor: string;
  primaryHover: string;
  secondaryColor: string;
  accentColor: string;
  cardBgColor: string;
  glowIntensity?: number;
  cardStyle?: 'glass' | 'solid' | 'gradient' | 'bordered';
  bgPattern?: 'grid' | 'dots' | 'mesh' | 'none';
}

export const DEFAULT_THEME_CONFIG: ThemeConfig = {
  primaryColor: '#f59e0b',
  primaryHover: '#d97706',
  secondaryColor: '#09090b',
  accentColor: '#10b981',
  presetName: 'studio_dark',
  cardBgColor: '#18181b',
  glowIntensity: 50,
  fontFamily: 'Cairo',
  cardStyle: 'glass',
  bgPattern: 'grid',
  customPresets: [],
};

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'studio_dark',
    nameAr: 'جوجل AI ستوديو الداكن الطبيعي (Studio Charcoal & Gold)',
    primaryColor: '#f59e0b',
    primaryHover: '#d97706',
    secondaryColor: '#09090b',
    accentColor: '#10b981',
    cardBgColor: '#18181b',
    glowIntensity: 50,
    cardStyle: 'glass',
    bgPattern: 'grid',
  },
  {
    id: 'obsidian_gold',
    nameAr: 'أوبسيديان الفحمي والذهب (Obsidian Charcoal)',
    primaryColor: '#eab308',
    primaryHover: '#ca8a04',
    secondaryColor: '#0a0a0c',
    accentColor: '#38bdf8',
    cardBgColor: '#121214',
    glowIntensity: 60,
    cardStyle: 'solid',
    bgPattern: 'dots',
  },
  {
    id: 'carbon_black',
    nameAr: 'الكربون الأسود الملكي (Pure Carbon Black)',
    primaryColor: '#fbbf24',
    primaryHover: '#f59e0b',
    secondaryColor: '#000000',
    accentColor: '#10b981',
    cardBgColor: '#0d0d0f',
    glowIntensity: 45,
    cardStyle: 'bordered',
    bgPattern: 'grid',
  },
  {
    id: 'emerald',
    nameAr: 'الزمردي التكنولوجي الفحمي (Emerald Studio)',
    primaryColor: '#10b981',
    primaryHover: '#059669',
    secondaryColor: '#09090b',
    accentColor: '#3b82f6',
    cardBgColor: '#121214',
    glowIntensity: 60,
    cardStyle: 'gradient',
    bgPattern: 'mesh',
  },
  {
    id: 'sapphire',
    nameAr: 'السياني الرقمي الفحمي (Sapphire Dark)',
    primaryColor: '#3b82f6',
    primaryHover: '#2563eb',
    secondaryColor: '#09090b',
    accentColor: '#f59e0b',
    cardBgColor: '#18181b',
    glowIntensity: 50,
    cardStyle: 'glass',
    bgPattern: 'dots',
  },
  {
    id: 'ruby',
    nameAr: 'الرويال القرمزي الفحمي (Ruby Studio)',
    primaryColor: '#f43f5e',
    primaryHover: '#e11d48',
    secondaryColor: '#09090b',
    accentColor: '#f59e0b',
    cardBgColor: '#18181b',
    glowIntensity: 70,
    cardStyle: 'bordered',
    bgPattern: 'grid',
  },
  {
    id: 'purple',
    nameAr: 'الأرجواني الفاخر الفحمي (Amethyst Studio)',
    primaryColor: '#a855f7',
    primaryHover: '#9333ea',
    secondaryColor: '#09090b',
    accentColor: '#f43f5e',
    cardBgColor: '#18181b',
    glowIntensity: 60,
    cardStyle: 'glass',
    bgPattern: 'mesh',
  },
  {
    id: 'cyan',
    nameAr: 'السايبر الرقمي الفحمي (Cyan Studio Neon)',
    primaryColor: '#06b6d4',
    primaryHover: '#0891b2',
    secondaryColor: '#09090b',
    accentColor: '#a855f7',
    cardBgColor: '#121214',
    glowIntensity: 80,
    cardStyle: 'bordered',
    bgPattern: 'grid',
  },
];

export const ThemePicker: React.FC = () => {
  const { cmsData, updateTheme, colorMode, setColorMode } = useCMS();
  const savedTheme: ThemeConfig = cmsData.theme || DEFAULT_THEME_CONFIG;

  // Local draft state
  const [draftPrimary, setDraftPrimary] = useState(savedTheme.primaryColor);
  const [draftHover, setDraftHover] = useState(savedTheme.primaryHover);
  const [draftSecondary, setDraftSecondary] = useState(savedTheme.secondaryColor);
  const [draftAccent, setDraftAccent] = useState(savedTheme.accentColor);
  const [draftCardBg, setDraftCardBg] = useState(savedTheme.cardBgColor || '#0f172a');
  const [draftGlow, setDraftGlow] = useState(savedTheme.glowIntensity ?? 50);
  const [draftFont, setDraftFont] = useState<'Cairo' | 'Tajawal' | 'Readex Pro'>(savedTheme.fontFamily || 'Cairo');
  const [draftCardStyle, setDraftCardStyle] = useState<'glass' | 'solid' | 'gradient' | 'bordered'>(savedTheme.cardStyle || 'glass');
  const [draftBgPattern, setDraftBgPattern] = useState<'grid' | 'dots' | 'mesh' | 'none'>(savedTheme.bgPattern || 'grid');
  const [activePreset, setActivePreset] = useState(savedTheme.presetName || 'amber');

  // Custom User Presets Library
  const [customPresets, setCustomPresets] = useState<CustomPaletteItem[]>(savedTheme.customPresets || []);
  const [newPresetName, setNewPresetName] = useState('');
  const [showAddCustomModal, setShowAddCustomModal] = useState(false);

  const [savedNotice, setSavedNotice] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);

  // Sync draft if external savedTheme changes
  useEffect(() => {
    setDraftPrimary(savedTheme.primaryColor);
    setDraftHover(savedTheme.primaryHover);
    setDraftSecondary(savedTheme.secondaryColor);
    setDraftAccent(savedTheme.accentColor);
    setDraftCardBg(savedTheme.cardBgColor || '#0f172a');
    setDraftGlow(savedTheme.glowIntensity ?? 50);
    setDraftFont(savedTheme.fontFamily || 'Cairo');
    setDraftCardStyle(savedTheme.cardStyle || 'glass');
    setDraftBgPattern(savedTheme.bgPattern || 'grid');
    setActivePreset(savedTheme.presetName || 'amber');
    setCustomPresets(savedTheme.customPresets || []);
  }, [cmsData.theme]);

  // Live preview effect
  useEffect(() => {
    const hexToRgb = (hex: string) => {
      let c = hex.replace('#', '');
      if (c.length === 3) c = c.split('').map((x) => x + x).join('');
      const num = parseInt(c, 16);
      if (isNaN(num)) return '245, 158, 11';
      return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
    };

    const root = document.documentElement;
    root.style.setProperty('--primary-color', draftPrimary);
    root.style.setProperty('--primary-hover', draftHover);
    root.style.setProperty('--primary-rgb', hexToRgb(draftPrimary));
    root.style.setProperty('--secondary-color', draftSecondary);
    root.style.setProperty('--secondary-rgb', hexToRgb(draftSecondary));
    root.style.setProperty('--accent-color', draftAccent);
    root.style.setProperty('--accent-rgb', hexToRgb(draftAccent));
    root.style.setProperty('--card-bg-color', draftCardBg);
    root.style.setProperty('--card-bg-rgb', hexToRgb(draftCardBg));
    root.style.setProperty('--glow-intensity', `${draftGlow / 100}`);

    document.body.style.fontFamily = `'${draftFont}', sans-serif`;
  }, [draftPrimary, draftHover, draftSecondary, draftAccent, draftCardBg, draftGlow, draftFont]);

  // Handle Save
  const handleSaveChanges = () => {
    updateTheme({
      primaryColor: draftPrimary,
      primaryHover: draftHover,
      secondaryColor: draftSecondary,
      accentColor: draftAccent,
      cardBgColor: draftCardBg,
      glowIntensity: draftGlow,
      fontFamily: draftFont,
      cardStyle: draftCardStyle,
      bgPattern: draftBgPattern,
      presetName: activePreset,
      customPresets,
    });

    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  // Discard draft changes
  const handleDiscardChanges = () => {
    setDraftPrimary(savedTheme.primaryColor);
    setDraftHover(savedTheme.primaryHover);
    setDraftSecondary(savedTheme.secondaryColor);
    setDraftAccent(savedTheme.accentColor);
    setDraftCardBg(savedTheme.cardBgColor || '#0f172a');
    setDraftGlow(savedTheme.glowIntensity ?? 50);
    setDraftFont(savedTheme.fontFamily || 'Cairo');
    setDraftCardStyle(savedTheme.cardStyle || 'glass');
    setDraftBgPattern(savedTheme.bgPattern || 'grid');
    setActivePreset(savedTheme.presetName || 'amber');
  };

  // Apply preset with instant persistence
  const applyPreset = (preset: ThemePreset | CustomPaletteItem) => {
    setDraftPrimary(preset.primaryColor);
    setDraftHover(preset.primaryHover);
    setDraftSecondary(preset.secondaryColor);
    setDraftAccent(preset.accentColor);
    setDraftCardBg(preset.cardBgColor);
    if (preset.glowIntensity !== undefined) setDraftGlow(preset.glowIntensity);
    if ('cardStyle' in preset && preset.cardStyle) setDraftCardStyle(preset.cardStyle);
    if ('bgPattern' in preset && preset.bgPattern) setDraftBgPattern(preset.bgPattern);
    if ('fontFamily' in preset && preset.fontFamily) setDraftFont(preset.fontFamily);
    setActivePreset(preset.id);

    // Persist immediately so user sees real-time changes across the application
    updateTheme({
      primaryColor: preset.primaryColor,
      primaryHover: preset.primaryHover,
      secondaryColor: preset.secondaryColor,
      accentColor: preset.accentColor,
      cardBgColor: preset.cardBgColor,
      glowIntensity: preset.glowIntensity ?? 50,
      fontFamily: ('fontFamily' in preset && preset.fontFamily) ? preset.fontFamily : draftFont,
      cardStyle: ('cardStyle' in preset && preset.cardStyle) ? preset.cardStyle : draftCardStyle,
      bgPattern: ('bgPattern' in preset && preset.bgPattern) ? preset.bgPattern : draftBgPattern,
      presetName: preset.id,
      customPresets,
    });

    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  // Save current custom palette to user's library
  const handleSaveToCustomLibrary = () => {
    if (!newPresetName.trim()) return;

    const newPreset: CustomPaletteItem = {
      id: `custom-${Date.now()}`,
      nameAr: newPresetName.trim(),
      primaryColor: draftPrimary,
      primaryHover: draftHover,
      secondaryColor: draftSecondary,
      accentColor: draftAccent,
      cardBgColor: draftCardBg,
      glowIntensity: draftGlow,
      fontFamily: draftFont,
      cardStyle: draftCardStyle,
      bgPattern: draftBgPattern,
    };

    const updatedList = [newPreset, ...customPresets];
    setCustomPresets(updatedList);
    setNewPresetName('');
    setShowAddCustomModal(false);

    updateTheme({
      customPresets: updatedList,
    });
  };

  const handleDeleteCustomPreset = (id: string) => {
    const updated = customPresets.filter((p) => p.id !== id);
    setCustomPresets(updated);
    updateTheme({ customPresets: updated });
  };

  const cssCodeSnippet = `:root {
  --primary-color: ${draftPrimary};
  --primary-hover: ${draftHover};
  --secondary-color: ${draftSecondary};
  --accent-color: ${draftAccent};
  --card-bg-color: ${draftCardBg};
  --glow-intensity: ${draftGlow / 100};
  font-family: '${draftFont}', sans-serif;
}`;

  const copyCSSCode = () => {
    navigator.clipboard.writeText(cssCodeSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-8 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
      {/* Top Header & Save Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-slate-800 pb-6">
        <div>
          <h3 className="text-xl font-black text-white flex items-center gap-2.5">
            <Palette className="w-6 h-6 text-amber-400" />
            <span>نظام إدارة الهوية البصرية والألوان الشامل (Global Design System)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            تخصيص كامل للألوان الرئيسية والفرعية، نمط أسطح البطاقات الزجاجية، أنماط الخفيات، والخطوط العربية
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
          <button
            type="button"
            onClick={handleDiscardChanges}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl border border-slate-700 flex items-center gap-2 transition-all"
            title="إلغاء التعديلات المعاينة والعودة للنسخة المحفوظة"
          >
            <RotateCcw className="w-4 h-4 text-slate-400" />
            <span>تراجع عن المعاينة</span>
          </button>

          <button
            type="button"
            onClick={handleSaveChanges}
            className="px-6 py-2.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-xl shadow-amber-500/25 flex items-center gap-2.5 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            {savedNotice ? <CheckCircle2 className="w-4 h-4 text-slate-950" /> : <Save className="w-4 h-4" />}
            <span>{savedNotice ? 'تم حفظ الهوية البصرية بنجاح!' : 'حفظ تغييرات الألوان'}</span>
          </button>
        </div>
      </div>

      {/* Color Mode Switcher (Dark vs Light vs System) */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-black text-slate-200 flex items-center gap-2">
            <SunMedium className="w-4 h-4 text-amber-400" />
            <span>نظام إضاءة الواجهة العام (Color Theme Mode):</span>
          </label>
          <span className="text-[10px] text-slate-400 font-mono">
            الحالي: {colorMode === 'light' ? 'الوضع الفاتح' : colorMode === 'dark' ? 'الوضع الداكن' : 'تلقائي حسب النظام'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setColorMode('dark')}
            className={`p-4 rounded-xl border text-right transition-all flex items-center gap-3.5 cursor-pointer ${
              colorMode === 'dark'
                ? 'bg-slate-900 border-2 border-amber-400 shadow-lg shadow-amber-500/10'
                : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-amber-400 shrink-0">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-white">الوضع الداكن الفحمي (Studio Dark)</div>
              <div className="text-[11px] text-slate-400 mt-0.5">فحمي طبيعي مريح للعين وأسود محايد</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setColorMode('light')}
            className={`p-4 rounded-xl border text-right transition-all flex items-center gap-3.5 cursor-pointer ${
              colorMode === 'light'
                ? 'bg-slate-900 border-2 border-amber-400 shadow-lg shadow-amber-500/10'
                : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-amber-400 shrink-0">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-white">الوضع الفاتح الكريستالي (Crystal Light)</div>
              <div className="text-[11px] text-slate-400 mt-0.5">أبيض نقي ناصع وعالي التباين</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setColorMode('system')}
            className={`p-4 rounded-xl border text-right transition-all flex items-center gap-3.5 cursor-pointer ${
              colorMode === 'system'
                ? 'bg-slate-900 border-2 border-amber-400 shadow-lg shadow-amber-500/10'
                : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-blue-400 shrink-0">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-white">تلقائي حسب نظام جهازك (Auto OS)</div>
              <div className="text-[11px] text-slate-400 mt-0.5">يتوافق مع وضع هاتفك أو حاسوبك</div>
            </div>
          </button>
        </div>
      </div>

      {/* Preset Palettes Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-extrabold text-slate-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>١. لوحات الألوان الجاهزة والمعتمدة (Color Presets):</span>
          </label>
          <span className="text-[10px] text-slate-400">انقر لمعاينة اللوحة مسبقاً قبل الحفظ</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {THEME_PRESETS.map((preset) => {
            const isSelected = activePreset === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyPreset(preset)}
                className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between space-y-3 relative overflow-hidden group ${
                  isSelected
                    ? 'bg-slate-950 border-2 border-amber-400 shadow-xl shadow-amber-500/10'
                    : 'bg-slate-950/60 border-slate-800 hover:bg-slate-950 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                    {preset.nameAr}
                  </span>
                  {isSelected && (
                    <span className="p-1 bg-amber-400 text-slate-950 rounded-full">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <div
                    className="w-7 h-7 rounded-lg border border-white/20 shadow-inner flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ backgroundColor: preset.primaryColor }}
                    title={`الرئيسي: ${preset.primaryColor}`}
                  >
                    1
                  </div>
                  <div
                    className="w-7 h-7 rounded-lg border border-white/20 shadow-inner flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ backgroundColor: preset.primaryHover }}
                    title={`التحويم: ${preset.primaryHover}`}
                  >
                    H
                  </div>
                  <div
                    className="w-7 h-7 rounded-lg border border-white/20 shadow-inner flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ backgroundColor: preset.secondaryColor }}
                    title={`الخلفية: ${preset.secondaryColor}`}
                  >
                    2
                  </div>
                  <div
                    className="w-7 h-7 rounded-lg border border-white/20 shadow-inner flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ backgroundColor: preset.accentColor }}
                    title={`التمييز: ${preset.accentColor}`}
                  >
                    A
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* User Custom Saved Library */}
      <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-extrabold text-white flex items-center gap-2">
            <BookmarkPlus className="w-4 h-4 text-emerald-400" />
            <span>مكتبة اللوحات المخصصة المحفوظة الخاصة بك ({customPresets.length}):</span>
          </label>

          <button
            type="button"
            onClick={() => setShowAddCustomModal(true)}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-md shadow-emerald-600/20"
          >
            <BookmarkPlus className="w-3.5 h-3.5" />
            <span>حفظ الألوان الحالية كلوحة جديدة</span>
          </button>
        </div>

        {/* Modal/Input to name custom preset */}
        {showAddCustomModal && (
          <div className="p-4 bg-slate-900 border border-emerald-500/40 rounded-xl space-y-3 animate-in fade-in">
            <label className="text-xs font-bold text-slate-200">اكتب اسم اللوحة المخصصة الجديدة:</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newPresetName}
                onChange={(e) => setNewPresetName(e.target.value)}
                placeholder="مثال: لوحة الهوية الذهبية القرمذية"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={handleSaveToCustomLibrary}
                className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shrink-0 transition-colors"
              >
                تأكيد الحفظ
              </button>
              <button
                type="button"
                onClick={() => setShowAddCustomModal(false)}
                className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl shrink-0"
              >
                إلغاء
              </button>
            </div>
          </div>
        )}

        {/* Saved Custom Presets Horizontal Bar */}
        {customPresets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
            {customPresets.map((preset) => (
              <div
                key={preset.id}
                className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between gap-3 group hover:border-emerald-500/50 transition-colors"
              >
                <button
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className="flex items-center gap-2.5 text-right overflow-hidden flex-1"
                >
                  <div
                    className="w-6 h-6 rounded-md border border-white/20 shrink-0"
                    style={{ backgroundColor: preset.primaryColor }}
                  />
                  <span className="text-xs font-bold text-white truncate">{preset.nameAr}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteCustomPreset(preset.id)}
                  className="p-1 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="حذف اللوحة من المكتبة"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic">لا توجد لوحات مخصصة محفوظة بعد. يمكنك إنشاؤها وحفظها هنا.</p>
        )}
      </div>

      {/* Advanced Custom Editors */}
      <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <label className="text-xs font-extrabold text-white flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-amber-400" />
            <span>٢. التعديل الدقيق الدقيق للألوان ومكونات التصميم:</span>
          </label>

          <button
            type="button"
            onClick={() => setShowCodeModal(!showCodeModal)}
            className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-700 text-[11px] font-bold rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>كود CSS المتغيرات</span>
          </button>
        </div>

        {/* Color Hex Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2 p-3 bg-slate-900 border border-slate-800 rounded-xl">
            <label className="text-xs font-bold text-slate-200 block">اللون الرئيسي (Primary):</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={draftPrimary}
                onChange={(e) => {
                  setDraftPrimary(e.target.value);
                  setActivePreset('custom');
                }}
                className="w-10 h-10 rounded-lg border border-slate-700 bg-transparent cursor-pointer shrink-0"
              />
              <input
                type="text"
                value={draftPrimary}
                onChange={(e) => {
                  setDraftPrimary(e.target.value);
                  setActivePreset('custom');
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs font-mono text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-2 p-3 bg-slate-900 border border-slate-800 rounded-xl">
            <label className="text-xs font-bold text-slate-200 block">لون التحويم (Primary Hover):</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={draftHover}
                onChange={(e) => {
                  setDraftHover(e.target.value);
                  setActivePreset('custom');
                }}
                className="w-10 h-10 rounded-lg border border-slate-700 bg-transparent cursor-pointer shrink-0"
              />
              <input
                type="text"
                value={draftHover}
                onChange={(e) => {
                  setDraftHover(e.target.value);
                  setActivePreset('custom');
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs font-mono text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-2 p-3 bg-slate-900 border border-slate-800 rounded-xl">
            <label className="text-xs font-bold text-slate-200 block">نغمة خلفية الأقسام (Secondary):</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={draftSecondary}
                onChange={(e) => {
                  setDraftSecondary(e.target.value);
                  setActivePreset('custom');
                }}
                className="w-10 h-10 rounded-lg border border-slate-700 bg-transparent cursor-pointer shrink-0"
              />
              <input
                type="text"
                value={draftSecondary}
                onChange={(e) => {
                  setDraftSecondary(e.target.value);
                  setActivePreset('custom');
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs font-mono text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-2 p-3 bg-slate-900 border border-slate-800 rounded-xl">
            <label className="text-xs font-bold text-slate-200 block">لون التمييز الاستراتيجي (Accent):</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={draftAccent}
                onChange={(e) => {
                  setDraftAccent(e.target.value);
                  setActivePreset('custom');
                }}
                className="w-10 h-10 rounded-lg border border-slate-700 bg-transparent cursor-pointer shrink-0"
              />
              <input
                type="text"
                value={draftAccent}
                onChange={(e) => {
                  setDraftAccent(e.target.value);
                  setActivePreset('custom');
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs font-mono text-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Surface Card Styles & Pattern Overlays */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800/80">
          {/* Card Surface Style Choice */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>نمط أسطح البطاقات والكروت (Card Surface Style):</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'glass', label: 'زجاجي شفاف (Glass)' },
                { id: 'solid', label: 'كربون مصمت (Solid)' },
                { id: 'gradient', label: 'تدرج ضوئي (Gradient)' },
                { id: 'bordered', label: 'حدود نيون (Neon)' },
              ].map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setDraftCardStyle(style.id as any)}
                  className={`p-2.5 rounded-xl border text-[11px] font-bold transition-all ${
                    draftCardStyle === style.id
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          {/* Background Pattern Choice */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-white flex items-center gap-2">
              <Grid className="w-4 h-4 text-amber-400" />
              <span>نمط النقوش والأشكال بالخلفية (Pattern Overlays):</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'grid', label: 'شبكة رقمية (Cyber Grid)' },
                { id: 'dots', label: 'نقاط ناعمة (Dots)' },
                { id: 'mesh', label: 'خطوط مصفوفة (Mesh)' },
                { id: 'none', label: 'بدون نقوش (Clean)' },
              ].map((pattern) => (
                <button
                  key={pattern.id}
                  type="button"
                  onClick={() => setDraftBgPattern(pattern.id as any)}
                  className={`p-2.5 rounded-xl border text-[11px] font-bold transition-all ${
                    draftBgPattern === pattern.id
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {pattern.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Glow Intensity & Typography Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800/80">
          {/* Glow Intensity Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white flex items-center gap-2">
                <SunMedium className="w-4 h-4 text-amber-400" />
                <span>شدة السطوع والوهج الضوئي (Glow Intensity):</span>
              </label>
              <span className="text-xs font-mono font-bold text-amber-400">{draftGlow}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={10}
              value={draftGlow}
              onChange={(e) => setDraftGlow(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>خافت (0%)</span>
              <span>متوازن (50%)</span>
              <span>وهج قوي (100%)</span>
            </div>
          </div>

          {/* Typography Choice */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-white flex items-center gap-2">
              <Type className="w-4 h-4 text-amber-400" />
              <span>نوع الخط العربي الأساسي بالموقع (Arabic Typography):</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'Cairo', name: 'خط كايرو (Cairo)' },
                { id: 'Tajawal', name: 'خط تجوال (Tajawal)' },
                { id: 'Readex Pro', name: 'ريدكس برو (Readex)' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setDraftFont(f.id as any)}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    draftFont === f.id
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                  style={{ fontFamily: `'${f.id}', sans-serif` }}
                >
                  {f.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Code Snippet Modal */}
      {showCodeModal && (
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-mono font-bold text-amber-400">CSS Theme Variables Output</span>
            <button
              type="button"
              onClick={copyCSSCode}
              className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedCode ? 'تم النسخ!' : 'نسخ كود CSS'}</span>
            </button>
          </div>
          <pre className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-emerald-400 overflow-x-auto">
            {cssCodeSnippet}
          </pre>
        </div>
      )}

      {/* Live Preview Section */}
      <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
        <div className="text-xs font-bold text-slate-400 flex items-center gap-2">
          <Eye className="w-4 h-4 text-amber-400" />
          <span>معاينة حية فورية لكيفية انعكاس المسودّة الحالية على عناصر الموقع قبل الضغط على حفظ:</span>
        </div>

        <div
          className={`p-6 rounded-2xl transition-all space-y-5 card-surface-${draftCardStyle} bg-pattern-${draftBgPattern}`}
          style={{
            borderColor: `${draftPrimary}50`,
            boxShadow: `0 20px 25px -5px rgba(${draftPrimary}, ${draftGlow / 300})`,
          }}
        >
          <div className="flex flex-wrap items-center gap-3">
            <span
              className="px-4 py-2 rounded-xl text-xs font-black text-slate-950 shadow-lg transition-all"
              style={{ backgroundColor: draftPrimary }}
            >
              زر الحركة الرئيسي (Primary Button)
            </span>

            <span
              className="px-3.5 py-1.5 rounded-full text-xs font-bold border backdrop-blur-md"
              style={{
                color: draftPrimary,
                backgroundColor: `${draftPrimary}20`,
                borderColor: `${draftPrimary}50`,
              }}
            >
              شارة تميز الهوية (Glow Badge)
            </span>

            <span className="text-xs font-bold" style={{ color: draftAccent }}>
              مؤشر إنجاز أو حالة تفاعلية (Accent Highlight)
            </span>
          </div>

          <p
            className="text-xs text-slate-300 leading-relaxed font-normal"
            style={{ fontFamily: `'${draftFont}', sans-serif` }}
          >
            "تطوير أعمال المنظومة وحلول الذكاء الاصطناعي بخطوط وألوان وأنماط أسطح تتناسب تماماً مع هوية مؤسستك الاستراتيجية."
          </p>
        </div>
      </div>
    </div>
  );
};

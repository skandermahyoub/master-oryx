import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { TabItem } from '../../types/cms';
import { UserCheck, Save, Check, Upload, FileText, Sliders, LayoutList } from 'lucide-react';

export const AboutEditor: React.FC = () => {
  const { cmsData, updateModuleData } = useCMS();
  const { about } = cmsData;

  const [paragraph, setParagraph] = useState(about.paragraph);
  const [ceoName, setCeoName] = useState(about.ceoName);
  const [ceoTitle, setCeoTitle] = useState(about.ceoTitle);
  const [ceoPhotoUrl, setCeoPhotoUrl] = useState(about.ceoPhotoUrl);
  const [tabsLayoutMode, setTabsLayoutMode] = useState<'carousel' | 'accordion'>(about.tabsLayoutMode || 'carousel');
  const [tabs, setTabs] = useState<TabItem[]>(about.tabs || []);
  const [downloadPdfLabel, setDownloadPdfLabel] = useState(about.downloadPdfLabel);
  const [learnMoreLabel, setLearnMoreLabel] = useState(about.learnMoreLabel);

  const [savedNotice, setSavedNotice] = useState(false);

  // Sync state if about changes in context
  React.useEffect(() => {
    if (about) {
      setParagraph(about.paragraph);
      setCeoName(about.ceoName);
      setCeoTitle(about.ceoTitle);
      setCeoPhotoUrl(about.ceoPhotoUrl);
      setTabsLayoutMode(about.tabsLayoutMode || 'carousel');
      setTabs(about.tabs || []);
      setDownloadPdfLabel(about.downloadPdfLabel);
      setLearnMoreLabel(about.learnMoreLabel);
    }
  }, [about]);

  const handleSave = () => {
    updateModuleData('about', {
      paragraph,
      ceoName,
      ceoTitle,
      ceoPhotoUrl,
      tabsLayoutMode,
      tabs,
      downloadPdfLabel,
      learnMoreLabel,
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleCeoPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCeoPhotoUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateTab = (id: string, updated: Partial<TabItem>) => {
    setTabs(tabs.map((t) => (t.id === id ? { ...t, ...updated } : t)));
  };

  return (
    <div className="space-y-8 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8">
      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-amber-400" />
            <span>لوحة تحكم الموديول الرابع: من نحن والإدارة التنفيذية</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            تحرير الفقرة التعريفية، صورة واسم وصفة المدير، واختيار نمط العرض (كاروسال منزلق أو أكورديون)
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all"
        >
          {savedNotice ? <Check className="w-4 h-4 text-emerald-950" /> : <Save className="w-4 h-4" />}
          <span>{savedNotice ? 'تم الحفظ بنجاح!' : 'حفظ التعديلات'}</span>
        </button>
      </div>

      {/* Internal Display Mode Selector for Vision / Mission / Goal / Message */}
      <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
        <label className="text-xs font-bold text-white flex items-center gap-2">
          <Sliders className="w-4 h-4 text-amber-400" />
          <span>اختر نمط عرض فقرات الرؤية والرسالة والهدف والمهمة بالصفحة الرئيسية:</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setTabsLayoutMode('carousel')}
            className={`p-4 rounded-xl border text-right transition-all flex items-center gap-3 ${
              tabsLayoutMode === 'carousel'
                ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <div className={`p-2 rounded-xl ${tabsLayoutMode === 'carousel' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800'}`}>
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">كاروسال منزلق تفاعلي (Sliding Carousel)</div>
              <div className="text-[10px] text-slate-400">عرض البطاقات في مضمار منزلق بأسهم تنقل وسحب باللمس</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setTabsLayoutMode('accordion')}
            className={`p-4 rounded-xl border text-right transition-all flex items-center gap-3 ${
              tabsLayoutMode === 'accordion'
                ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <div className={`p-2 rounded-xl ${tabsLayoutMode === 'accordion' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800'}`}>
              <LayoutList className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">أكورديون / تبويبات تفاعلية (Accordion Tabs)</div>
              <div className="text-[10px] text-slate-400">عرض أزرار تبويبات للضغط بين الرؤية والرسالة والهدف والمهمة</div>
            </div>
          </button>
        </div>
      </div>

      {/* Paragraph & CEO Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-bold text-slate-200">الفقرة النصية التعريفية بالمؤسسة:</label>
          <textarea
            rows={4}
            value={paragraph}
            onChange={(e) => setParagraph(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-200">اسم المدير التنفيذي / المسؤول:</label>
          <input
            type="text"
            value={ceoName}
            onChange={(e) => setCeoName(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-200">الصفة أو المسمى الوظيفي للمدير:</label>
          <input
            type="text"
            value={ceoTitle}
            onChange={(e) => setCeoTitle(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* CEO Photo Box */}
        <div className="md:col-span-2 p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center gap-4">
          <img
            src={ceoPhotoUrl}
            alt="CEO photo"
            className="w-20 h-20 rounded-full object-cover border-2 border-amber-500 shrink-0"
          />
          <div className="flex-1 space-y-2 w-full">
            <label className="text-xs font-bold text-white">صورة المدير التنفيذي:</label>
            <input
              type="text"
              value={ceoPhotoUrl}
              onChange={(e) => setCeoPhotoUrl(e.target.value)}
              placeholder="https://..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
            />
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg cursor-pointer border border-slate-700">
              <Upload className="w-3.5 h-3.5 text-amber-400" />
              <span>رفع صورة المدير من الجهاز</span>
              <input type="file" accept="image/*" onChange={handleCeoPhotoUpload} className="hidden" />
            </label>
          </div>
        </div>
      </div>

      {/* Tabs Editor (الهدف، الرؤية، الرسالة، المهمة) */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <FileText className="w-4 h-4 text-amber-400" />
          <span>محتويات فقرات (الرؤية، الرسالة، الهدف، المهمة):</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tabs.map((tab) => (
            <div key={tab.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
              <div className="text-xs font-bold text-amber-400">{tab.title}</div>
              <textarea
                rows={3}
                value={tab.content}
                onChange={(e) => handleUpdateTab(tab.id, { content: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Button Labels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-200">نص زر تحميل الدليل التعريفي PDF:</label>
          <input
            type="text"
            value={downloadPdfLabel}
            onChange={(e) => setDownloadPdfLabel(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-200">نص زر "اعرف أكثر":</label>
          <input
            type="text"
            value={learnMoreLabel}
            onChange={(e) => setLearnMoreLabel(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};

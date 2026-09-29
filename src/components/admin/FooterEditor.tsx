import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { PanelBottom, Save, Check, Plus, Trash2 } from 'lucide-react';

export const FooterEditor: React.FC = () => {
  const { cmsData, updateModuleData } = useCMS();
  const { footer } = cmsData;

  const [aboutText, setAboutText] = useState(footer.aboutText);
  const [phone, setPhone] = useState(footer.phone);
  const [email, setEmail] = useState(footer.email);
  const [website, setWebsite] = useState(footer.website);
  const [location, setLocation] = useState(footer.location);
  const [copyrightText, setCopyrightText] = useState(footer.copyrightText);
  const [poweredByText, setPoweredByText] = useState(footer.poweredByText);

  const [socialLinks, setSocialLinks] = useState(footer.socialLinks || {});
  const [quickLinks, setQuickLinks] = useState(footer.quickLinks || []);
  const [policies, setPolicies] = useState(footer.policies || []);
  const [savedNotice, setSavedNotice] = useState(false);

  // Sync state if footer changes in context
  React.useEffect(() => {
    if (footer) {
      setAboutText(footer.aboutText);
      setPhone(footer.phone);
      setEmail(footer.email);
      setWebsite(footer.website);
      setLocation(footer.location);
      setCopyrightText(footer.copyrightText);
      setPoweredByText(footer.poweredByText);
      setSocialLinks(footer.socialLinks || {});
      setQuickLinks(footer.quickLinks || []);
      setPolicies(footer.policies || []);
    }
  }, [footer]);

  const handleSave = () => {
    updateModuleData('footer', {
      aboutText,
      phone,
      email,
      website,
      location,
      copyrightText,
      poweredByText,
      socialLinks,
      quickLinks,
      policies,
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="space-y-8 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8">
      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <PanelBottom className="w-5 h-5 text-slate-400" />
            <span>لوحة تحكم الموديول الحادي عشر: الفوتر العالمي الشامل</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            تخصيص محتوى الفوتر بالكامل بشكل مستقل، تحرير الحقول وإضافة وحذف الروابط وشبكات التواصل
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

      {/* Main Text Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="text-xs font-bold text-slate-200">الفقرة التوضيحية أسفل الشعار بالفوتر:</label>
          <textarea
            rows={3}
            value={aboutText}
            onChange={(e) => setAboutText(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-200">هاتف التواصل بالفوتر:</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-200">البريد الإلكتروني بالفوتر:</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-200">رابط الموقع الرسمي:</label>
          <input
            type="text"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-200">العنوان الجغرافي المقتضب:</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
          />
        </div>
      </div>

      {/* Social Links */}
      <div className="space-y-3 pt-4 border-t border-slate-800">
        <h4 className="text-sm font-bold text-white">روابط شبكات التواصل الاجتماعي الشهيرة:</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { key: 'tiktok', label: 'تيك توك (TikTok)' },
            { key: 'facebook', label: 'فيسبوك (Facebook)' },
            { key: 'youtube', label: 'يوتيوب (YouTube)' },
            { key: 'instagram', label: 'إنستغرام (Instagram)' },
            { key: 'whatsappChannel', label: 'قناة الواتساب (WhatsApp Channel)' },
            { key: 'telegram', label: 'تليجرام (Telegram)' },
            { key: 'snapchat', label: 'سناب شات (Snapchat)' },
          ].map((item) => (
            <div key={item.key} className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-300">{item.label}:</label>
              <input
                type="text"
                value={(socialLinks as any)[item.key] || ''}
                onChange={(e) =>
                  setSocialLinks({
                    ...socialLinks,
                    [item.key]: e.target.value,
                  })
                }
                placeholder="https://..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-200">شريط جميع الحقوق محفوظة:</label>
          <input
            type="text"
            value={copyrightText}
            onChange={(e) => setCopyrightText(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-200">نص "مدعوم بواسطة":</label>
          <input
            type="text"
            value={poweredByText}
            onChange={(e) => setPoweredByText(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};

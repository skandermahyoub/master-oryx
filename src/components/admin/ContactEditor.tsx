import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { PhoneCall, Save, Check, Plus, Trash2 } from 'lucide-react';

export const ContactEditor: React.FC = () => {
  const { cmsData, updateModuleData } = useCMS();
  const { contact } = cmsData;

  const [sectionTitle, setSectionTitle] = useState(contact.sectionTitle);
  const [sectionSubtitle, setSectionSubtitle] = useState(contact.sectionSubtitle);
  const [whatsappNumber, setWhatsappNumber] = useState(contact.whatsappNumber);
  const [messengerUrl, setMessengerUrl] = useState(contact.messengerUrl);
  const [directPhone, setDirectPhone] = useState(contact.directPhone);
  const [officialEmail, setOfficialEmail] = useState(contact.officialEmail);
  const [address, setAddress] = useState(contact.address);
  const [branches, setBranches] = useState<string[]>(contact.branches || []);
  const [bgImageUrl, setBgImageUrl] = useState(contact.bgImageUrl || '');
  const [savedNotice, setSavedNotice] = useState(false);

  // Sync state if contact changes in context
  React.useEffect(() => {
    if (contact) {
      setSectionTitle(contact.sectionTitle);
      setSectionSubtitle(contact.sectionSubtitle);
      setWhatsappNumber(contact.whatsappNumber);
      setMessengerUrl(contact.messengerUrl);
      setDirectPhone(contact.directPhone);
      setOfficialEmail(contact.officialEmail);
      setAddress(contact.address);
      setBranches(contact.branches || []);
      setBgImageUrl(contact.bgImageUrl || '');
    }
  }, [contact]);

  const handleSave = () => {
    updateModuleData('contact', {
      sectionTitle,
      sectionSubtitle,
      whatsappNumber,
      messengerUrl,
      directPhone,
      officialEmail,
      address,
      branches,
      bgImageUrl,
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleAddBranch = () => {
    setBranches([...branches, 'فرع جديد: المدينة - الشارع الرئيسي']);
  };

  const handleRemoveBranch = (index: number) => {
    setBranches(branches.filter((_, i) => i !== index));
  };

  const handleUpdateBranch = (index: number, val: string) => {
    const next = [...branches];
    next[index] = val;
    setBranches(next);
  };

  return (
    <div className="space-y-8 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8">
      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-emerald-400" />
            <span>لوحة تحكم الموديول العاشر: تواصل معنا والدردشة المباشرة</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            تخصيص جميع أزرار وقنوات التواصل وساعات العمل والفروع وصورة خلفية الموديول
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-slate-200">عنوان الموديول الرئيسي:</label>
          <input
            type="text"
            value={sectionTitle}
            onChange={(e) => setSectionTitle(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-200">العنوان الفرعي التوضيحي:</label>
          <input
            type="text"
            value={sectionSubtitle}
            onChange={(e) => setSectionSubtitle(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-200">رقم واتساب الأعمال (مع الرمز الدولي):</label>
          <input
            type="text"
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
            placeholder="+966500000000"
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-200">رابط ماسنجر فيسبوك (Messenger URL):</label>
          <input
            type="text"
            value={messengerUrl}
            onChange={(e) => setMessengerUrl(e.target.value)}
            placeholder="https://m.me/..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-200">رقم الاتصال الهاتفي المباشر:</label>
          <input
            type="text"
            value={directPhone}
            onChange={(e) => setDirectPhone(e.target.value)}
            placeholder="+966110000000"
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-200">البريد الإلكتروني الرسمي:</label>
          <input
            type="email"
            value={officialEmail}
            onChange={(e) => setOfficialEmail(e.target.value)}
            placeholder="info@domain.com"
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-xs font-bold text-slate-200">عنوان المقر الرئيسي والتفاصيل الجغرافية:</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-xs font-bold text-slate-200">صورة خلفية موديول التواصل (خلفية شفافة / فاخرة):</label>
          <input
            type="text"
            value={bgImageUrl}
            onChange={(e) => setBgImageUrl(e.target.value)}
            placeholder="https://..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
          />
        </div>
      </div>

      {/* Branches Editor */}
      <div className="space-y-3 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-white">فروع المنظومة المعتمدة ({branches.length}):</h4>
          <button
            type="button"
            onClick={handleAddBranch}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>إضافة فرع جديد</span>
          </button>
        </div>

        <div className="space-y-2">
          {branches.map((b, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="text"
                value={b}
                onChange={(e) => handleUpdateBranch(idx, e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleRemoveBranch(idx)}
                className="p-2 text-red-400 hover:bg-red-500/20 rounded-xl text-xs"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

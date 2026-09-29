import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import {
  PhoneCall,
  MessageCircle,
  Mail,
  MapPin,
  Send,
  MessageSquare,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const ContactModule: React.FC = () => {
  const { cmsData, addContactMessage, setIsLiveChatOpen } = useCMS();
  const { contact } = cmsData;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    addContactMessage({
      name,
      email,
      phone,
      subject: subject || 'رسالة استفسار جديدة من الموقع العام',
      message,
    });

    setSentSuccess(true);
    setName('');
    setEmail('');
    setPhone('');
    setSubject('');
    setMessage('');

    setTimeout(() => {
      setSentSuccess(false);
    }, 4000);
  };

  return (
    <section id="contact" className="py-20 bg-slate-950 relative overflow-hidden">
      {/* Background Graphic */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <img
          src={contact.bgImageUrl || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80'}
          alt="Contact background"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full text-xs font-bold">
            <PhoneCall className="w-4 h-4" />
            <span>قنوات التواصل المباشر</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">
            {contact.sectionTitle}
          </h2>
          <p className="text-sm sm:text-base text-slate-400 font-medium">
            {contact.sectionSubtitle}
          </p>
        </div>

        {/* Contact Channels Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {/* WhatsApp */}
          <a
            href={`https://wa.me/${contact.whatsappNumber.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 bg-slate-900/90 border border-emerald-500/30 hover:border-emerald-500 rounded-2xl flex flex-col items-center text-center space-y-2 transition-all hover:-translate-y-1 group shadow-lg"
          >
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl group-hover:scale-110 transition-transform">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div className="text-xs font-bold text-white">واتساب أعمال</div>
            <div className="text-[10px] text-emerald-400">مباشر 24/7</div>
          </a>

          {/* Messenger */}
          {contact.messengerUrl && (
            <a
              href={contact.messengerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-slate-900/90 border border-blue-500/30 hover:border-blue-500 rounded-2xl flex flex-col items-center text-center space-y-2 transition-all hover:-translate-y-1 group shadow-lg"
            >
              <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold text-white">ماسنجر فيسبوك</div>
              <div className="text-[10px] text-blue-400">رد خلال دقائق</div>
            </a>
          )}

          {/* Direct Phone */}
          <a
            href={`tel:${contact.directPhone}`}
            className="p-4 bg-slate-900/90 border border-amber-500/30 hover:border-amber-500 rounded-2xl flex flex-col items-center text-center space-y-2 transition-all hover:-translate-y-1 group shadow-lg"
          >
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl group-hover:scale-110 transition-transform">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div className="text-xs font-bold text-white">اتصال هاتف مباشر</div>
            <div className="text-[10px] text-amber-400">{contact.directPhone}</div>
          </a>

          {/* Instant Chat Modal Trigger */}
          <button
            type="button"
            onClick={() => setIsLiveChatOpen(true)}
            className="p-4 bg-slate-900/90 border border-purple-500/30 hover:border-purple-500 rounded-2xl flex flex-col items-center text-center space-y-2 transition-all hover:-translate-y-1 group shadow-lg"
          >
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="text-xs font-bold text-white">الدردشة الفورية</div>
            <div className="text-[10px] text-purple-400">مستشار ذكي</div>
          </button>

          {/* Official Email */}
          <a
            href={`mailto:${contact.officialEmail}`}
            className="p-4 bg-slate-900/90 border border-slate-700 hover:border-slate-500 rounded-2xl flex flex-col items-center text-center space-y-2 transition-all hover:-translate-y-1 group shadow-lg col-span-2 sm:col-span-1"
          >
            <div className="p-3 bg-slate-800 text-slate-300 rounded-xl group-hover:scale-110 transition-transform">
              <Mail className="w-6 h-6" />
            </div>
            <div className="text-xs font-bold text-white">البريد المعتمد</div>
            <div className="text-[10px] text-slate-400 truncate max-w-[120px]">
              {contact.officialEmail}
            </div>
          </a>
        </div>

        {/* Message Form & Address Column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Address Details */}
          <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-400" />
              <span>مقر ومقرات المنظومة</span>
            </h3>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
              <div className="text-xs font-bold text-amber-400 uppercase">المقر الرئيسي:</div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                {contact.address}
              </p>
            </div>

            {contact.branches && contact.branches.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400">الفروع المعتمدة:</h4>
                <div className="space-y-2">
                  {contact.branches.map((b, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl text-xs text-slate-300 flex items-center gap-2"
                    >
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Form sending to internal inbox */}
          <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">أرسل رسالة مباشرة لصندوق البريد الداخلي</h3>
              <p className="text-xs text-slate-400">
                سيتلقى قسم خدمة العملاء والاستشارات رسالتك فوراً للرد عليك في أقرب وقت.
              </p>
            </div>

            {sentSuccess && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs text-emerald-400 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>تم إرسال رسالتك بنجاح للبريد الداخلي! سيتواصل معك فريق الاستشارات فوراً.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">الاسم الكريم:</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="اسمك الكامل"
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">البريد الإلكتروني:</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">رقم الهاتف / الواتساب:</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+966 5x xxx xxxx"
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">موضوع الاستفسار:</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="مثال: طلب استشارة حزمة..."
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">تفاصيل الرسالة:</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="اكتب تفاصيل استفسارك أو مشروعك المطلوب..."
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>إرسال الرسالة للبريد الداخلي</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { Inbox, Mail, Star, CheckCircle2, XCircle, Trash2, ShieldCheck, Clock } from 'lucide-react';

export const InboxManager: React.FC = () => {
  const {
    contactMessages,
    markMessageRead,
    deleteMessage,
    cmsData,
    approveTestimonial,
    rejectTestimonial,
  } = useCMS();

  const [activeTab, setActiveTab] = useState<'messages' | 'testimonials'>('messages');

  const pendingTestimonials = (cmsData.testimonials.items || []).filter(
    (item) => item.status === 'pending'
  );
  const approvedTestimonials = (cmsData.testimonials.items || []).filter(
    (item) => item.status === 'approved'
  );

  return (
    <div className="space-y-8 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8">
      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Inbox className="w-5 h-5 text-amber-400" />
            <span>صندوق البريد الداخلي والموافقات</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            متابعة رسائل الزوار والاستفسارات القادمة واعتماد شهادات التقدير والتقييمات
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('messages')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'messages'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>الرسائل المباشرة ({contactMessages.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('testimonials')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'testimonials'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Star className="w-4 h-4" />
            <span>موافقات التقييمات ({pendingTestimonials.length})</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Messages List */}
      {activeTab === 'messages' && (
        <div className="space-y-4">
          {contactMessages.length === 0 ? (
            <div className="p-8 text-center bg-slate-950 border border-slate-800 rounded-2xl text-slate-500 text-xs">
              لا توجد رسائل قادمة حالياً في صندوق البريد الداخلي.
            </div>
          ) : (
            contactMessages.map((msg) => (
              <div
                key={msg.id}
                className={`p-5 rounded-2xl border transition-all ${
                  !msg.isRead
                    ? 'bg-slate-950 border-amber-500/40 shadow-lg'
                    : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    {!msg.isRead && (
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                    )}
                    <h4 className="text-sm font-bold text-white">{msg.name}</h4>
                    <span className="text-xs text-amber-400 font-semibold">{msg.subject}</span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(msg.date).toLocaleDateString('ar-SA')}</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => deleteMessage(msg.id)}
                      className="p-1.5 text-red-400 hover:text-white hover:bg-red-500/20 rounded-lg transition-colors"
                      title="حذف الرسالة"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="py-3 text-xs text-slate-300 leading-relaxed font-normal whitespace-pre-line">
                  {msg.message}
                </div>

                <div className="pt-3 border-t border-slate-800/60 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
                  <div className="flex items-center gap-3">
                    {msg.phone && <span>الهاتف: <strong className="text-white">{msg.phone}</strong></span>}
                    {msg.email && <span>البريد: <strong className="text-white">{msg.email}</strong></span>}
                  </div>

                  {!msg.isRead && (
                    <button
                      type="button"
                      onClick={() => markMessageRead(msg.id)}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold rounded-lg"
                    >
                      تحديد كمقروء
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Testimonials Approval Queue */}
      {activeTab === 'testimonials' && (
        <div className="space-y-6">
          {/* Pending Submissions */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>التقييمات القادمة بانتظار موافقة الإدارة ({pendingTestimonials.length}):</span>
            </h4>

            {pendingTestimonials.length === 0 ? (
              <div className="p-6 text-center bg-slate-950 border border-slate-800 rounded-2xl text-slate-500 text-xs">
                لا توجد تقييمات جديدة تنتظر الاعتماد حالياً.
              </div>
            ) : (
              pendingTestimonials.map((item) => (
                <div key={item.id} className="p-5 bg-amber-500/10 border border-amber-500/30 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
                    <div>
                      <h5 className="text-sm font-bold text-white">{item.clientName}</h5>
                      <span className="text-xs text-amber-300">{item.clientRole}</span>
                    </div>

                    <div className="flex items-center gap-1 text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < item.rating ? 'fill-amber-400' : 'text-slate-700'}`} />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-slate-200 italic leading-relaxed">
                    "{item.reviewText}"
                  </p>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => rejectTestimonial(item.id)}
                      className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 font-bold text-xs rounded-xl flex items-center gap-1"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>رفض/حذف</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => approveTestimonial(item.id)}
                      className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1 shadow-md shadow-emerald-500/20"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>موافقة ونشر بالصفحة الرئيسية</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Approved Items */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>التقييمات المعتمدة والمنشورة بالفعل ({approvedTestimonials.length}):</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {approvedTestimonials.map((item) => (
                <div key={item.id} className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white">{item.clientName}</div>
                      <div className="text-[10px] text-slate-400">{item.clientRole}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => rejectTestimonial(item.id)}
                      className="p-1 text-red-400 hover:text-white"
                      title="إلغاء النشر وحذف"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-300 line-clamp-2">"{item.reviewText}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

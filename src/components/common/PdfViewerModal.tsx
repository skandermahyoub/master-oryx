import React from 'react';
import { useCMS } from '../../context/CMSContext';
import { X, Download, FileText, CheckCircle2, ShieldCheck, ExternalLink } from 'lucide-react';

export const PdfViewerModal: React.FC = () => {
  const { isPdfModalOpen, setIsPdfModalOpen, cmsData } = useCMS();
  const { about } = cmsData;

  if (!isPdfModalOpen) return null;

  const handleDownloadPdf = () => {
    // Generate a downloadable text/HTML file or print view
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <title>${cmsData.header.appName} - الملف التعريفي الشامل</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1e293b; background: #fff; line-height: 1.8; }
            .header { border-bottom: 3px solid #d97706; padding-bottom: 20px; margin-bottom: 30px; text-align: center; }
            h1 { color: #0f172a; margin-bottom: 5px; }
            .slogan { color: #d97706; font-size: 18px; font-weight: bold; }
            .section { margin-bottom: 30px; }
            .section-title { font-size: 20px; color: #0f172a; border-right: 4px solid #d97706; padding-right: 12px; margin-bottom: 15px; }
            .box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; margin-bottom: 15px; }
            .footer { border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 40px; text-align: center; font-size: 12px; color: #64748b; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${cmsData.header.appName}</h1>
            <div class="slogan">${cmsData.header.slogan}</div>
          </div>

          <div class="section">
            <div class="section-title">عن المنظومة</div>
            <p>${about.paragraph}</p>
          </div>

          <div class="section">
            <div class="section-title">الإدارة التنفيذية</div>
            <p><strong>${about.ceoName}</strong> - ${about.ceoTitle}</p>
          </div>

          <div class="section">
            <div class="section-title">الرؤية والرسالة والأهداف</div>
            ${about.tabs.map(tab => `
              <div class="box">
                <h3 style="margin-top:0; color:#d97706;">${tab.title}</h3>
                <p style="margin-bottom:0;">${tab.content}</p>
              </div>
            `).join('')}
          </div>

          <div class="footer">
            <p>${cmsData.footer.copyrightText}</p>
            <p>العنوان: ${cmsData.contact.address} | الهاتف: ${cmsData.footer.phone}</p>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/10 text-red-400 rounded-xl border border-red-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">دليل المؤسسة التعريفي (Company Profile)</h3>
              <p className="text-xs text-slate-400">{cmsData.header.appName} {cmsData.header.slogan}</p>
            </div>
          </div>
          <button
            onClick={() => setIsPdfModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Preview */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar text-slate-200">
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">نسخة رسمية معتمدة 2026</span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> موثق رسمياً
              </span>
            </div>
            <h4 className="text-xl font-bold text-white">{cmsData.header.welcomeTitle}</h4>
            <p className="text-sm text-slate-300 leading-relaxed">{about.paragraph}</p>
          </div>

          <div className="space-y-3">
            <h5 className="text-sm font-bold text-slate-100">محتويات الملف التعريفي:</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                'الهيكل التنظيمي والإدارة التنفيذية',
                'الرؤية والرسالة والاستراتيجية المستدامة',
                'حزم حلول الذكاء الاصطناعي وتطوير الأعمال',
                'سجل الإنجازات وشركاء النجاح في الخليج',
                'معايير الأمان وشهادات الجودة العالمية',
                'الفروع المعتمدة وطرق التواصل المباشر',
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2.5 bg-slate-800/50 rounded-lg text-xs text-slate-300 border border-slate-700/50">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-4">
            <img
              src={about.ceoPhotoUrl}
              alt={about.ceoName}
              className="w-14 h-14 rounded-full object-cover border-2 border-amber-500/40"
            />
            <div>
              <h5 className="text-sm font-bold text-white">{about.ceoName}</h5>
              <p className="text-xs text-amber-300">{about.ceoTitle}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-900/90">
          <button
            onClick={() => setIsPdfModalOpen(false)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs rounded-xl transition-colors"
          >
            إغلاق
          </button>
          <button
            onClick={handleDownloadPdf}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>طباعة أو تحميل الملف (PDF)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

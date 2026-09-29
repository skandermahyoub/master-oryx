import React from 'react';
import { useCMS } from '../../context/CMSContext';
import {
  Phone,
  Mail,
  Globe,
  MapPin,
  Building2,
  ShieldCheck,
  Send,
  MessageCircle,
} from 'lucide-react';

export const FooterModule: React.FC = () => {
  const { cmsData, navigateToCustomPage } = useCMS();
  const { footer } = cmsData;

  if (!footer) return null;

  const publishedFooterPages = (cmsData.customPages || []).filter(
    (p) => p.status === 'published' && p.showInFooter
  );

  return (
    <footer id="footer" className="bg-slate-950 border-t border-slate-800 text-slate-300 pt-16 pb-8 relative overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        {/* Main Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 items-start">
          {/* Col 1: Brand & About (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              {footer.logoUrl ? (
                <img
                  src={footer.logoUrl}
                  alt={footer.appName}
                  className="w-12 h-12 rounded-xl object-cover border border-amber-500/30 shadow-md shadow-amber-500/10"
                />
              ) : (
                <div className="w-12 h-12 bg-amber-500 text-slate-950 font-black text-xl rounded-xl flex items-center justify-center">
                  أ
                </div>
              )}
              <div>
                <h3 className="text-lg font-black text-white">{footer.appName}</h3>
                <p className="text-xs text-amber-400 font-semibold">{footer.slogan}</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              {footer.aboutText}
            </p>

            {/* Social Media Links Badges */}
            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">شبكات التواصل الاجتماعي:</span>
              <div className="flex flex-wrap gap-2">
                {footer.socialLinks.tiktok && (
                  <a
                    href={footer.socialLinks.tiktok}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-800 transition-colors text-xs flex items-center gap-1"
                    title="TikTok"
                  >
                    🎵 TikTok
                  </a>
                )}
                {footer.socialLinks.facebook && (
                  <a
                    href={footer.socialLinks.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-blue-400 rounded-xl border border-slate-800 transition-colors text-xs flex items-center gap-1"
                    title="Facebook"
                  >
                    📘 فيسبوك
                  </a>
                )}
                {footer.socialLinks.youtube && (
                  <a
                    href={footer.socialLinks.youtube}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-red-400 rounded-xl border border-slate-800 transition-colors text-xs flex items-center gap-1"
                    title="YouTube"
                  >
                    ▶️ يوتيوب
                  </a>
                )}
                {footer.socialLinks.instagram && (
                  <a
                    href={footer.socialLinks.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-pink-400 rounded-xl border border-slate-800 transition-colors text-xs flex items-center gap-1"
                    title="Instagram"
                  >
                    📸 إنستغرام
                  </a>
                )}
                {footer.socialLinks.whatsappChannel && (
                  <a
                    href={footer.socialLinks.whatsappChannel}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-emerald-400 rounded-xl border border-slate-800 transition-colors text-xs flex items-center gap-1"
                    title="قناة الواتساب"
                  >
                    💬 واتساب
                  </a>
                )}
                {footer.socialLinks.telegram && (
                  <a
                    href={footer.socialLinks.telegram}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 rounded-xl border border-slate-800 transition-colors text-xs flex items-center gap-1"
                    title="Telegram"
                  >
                    ✈️ تليجرام
                  </a>
                )}
                {footer.socialLinks.snapchat && (
                  <a
                    href={footer.socialLinks.snapchat}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-yellow-400 rounded-xl border border-slate-800 transition-colors text-xs flex items-center gap-1"
                    title="Snapchat"
                  >
                    👻 سناب
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white border-r-2 border-amber-500 pr-2">
              أقسام الواجهة الرئيسية
            </h4>
            <ul className="space-y-2 text-xs">
              {footer.quickLinks.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.url}
                    className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                  >
                    <span className="text-amber-500/60">•</span>
                    <span>{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Policies & Conditions (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold text-white border-r-2 border-amber-500 pr-2">
              السياسات والصفحات المخصصة
            </h4>
            <ul className="space-y-2 text-xs">
              {footer.policies.map((pol, idx) => (
                <li key={idx}>
                  <a
                    href={pol.url}
                    onClick={() => navigateToCustomPage(null)}
                    className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                  >
                    <span className="text-amber-500/60">•</span>
                    <span>{pol.label}</span>
                  </a>
                </li>
              ))}

              {publishedFooterPages.map((page) => (
                <li key={page.id}>
                  <button
                    type="button"
                    onClick={() => navigateToCustomPage(page.slug)}
                    className="hover:text-amber-400 transition-colors flex items-center gap-1.5 text-right font-bold text-amber-400/90"
                  >
                    <span className="text-amber-500">•</span>
                    <span>{page.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact & Locations (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white border-r-2 border-amber-500 pr-2">
              عناوين وتواصل المنظومة
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{footer.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{footer.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{footer.website}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{footer.location}</span>
              </div>

              {footer.branches && footer.branches.length > 0 && (
                <div className="pt-2 border-t border-slate-900 space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold block">فروع الخدمة:</span>
                  <div className="flex flex-wrap gap-1">
                    {footer.branches.map((br, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-[10px]">
                        {br}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 text-center sm:text-right">
          <div>{footer.copyrightText}</div>
          <div className="flex items-center gap-2 text-slate-400 font-medium">
            <span>{footer.poweredByText}</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
        </div>
      </div>
    </footer>
  );
};

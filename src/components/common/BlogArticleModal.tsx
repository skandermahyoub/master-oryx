import React from 'react';
import { useCMS } from '../../context/CMSContext';
import { X, Calendar, User, Clock, Share2, BookOpen, Tag } from 'lucide-react';

export const BlogArticleModal: React.FC = () => {
  const { selectedArticleId, setSelectedArticleId, cmsData } = useCMS();

  if (!selectedArticleId) return null;

  const article = cmsData.blog.posts.find((p) => p.id === selectedArticleId);

  if (!article) return null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('تم نسخ رابط المقال بنجاح!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            <Tag className="w-3.5 h-3.5" />
            <span>{article.category}</span>
          </div>
          <button
            onClick={() => setSelectedArticleId(null)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1 custom-scrollbar text-slate-100">
          <div className="space-y-3">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
              {article.title}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 border-b border-slate-800 pb-4">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span>{article.author}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>{article.date}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>زمن القراءة: {article.readTime}</span>
              </span>
            </div>
          </div>

          {/* Article Image */}
          {article.imageUrl && (
            <div className="rounded-2xl overflow-hidden border border-slate-800 max-h-[360px]">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Excerpt callout */}
          <div className="p-4 bg-slate-950/80 border-r-4 border-amber-500 rounded-lg text-sm text-amber-200/90 italic">
            "{article.excerpt}"
          </div>

          {/* Content Body */}
          <div className="prose prose-invert max-w-none text-slate-200 text-sm md:text-base leading-relaxed whitespace-pre-line space-y-4">
            {article.content}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-900/90">
          <button
            onClick={handleShare}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors"
          >
            <Share2 className="w-4 h-4 text-amber-400" />
            <span>مشاركة المقال</span>
          </button>
          <button
            onClick={() => setSelectedArticleId(null)}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors"
          >
            إغلاق القارئ
          </button>
        </div>
      </div>
    </div>
  );
};

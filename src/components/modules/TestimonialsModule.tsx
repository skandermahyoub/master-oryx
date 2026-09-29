import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { CarouselSlider } from '../common/CarouselSlider';
import { Star, MessageSquarePlus, Send, CheckCircle2, ShieldCheck } from 'lucide-react';

export const TestimonialsModule: React.FC = () => {
  const { cmsData, addTestimonialSubmission } = useCMS();
  const { testimonials } = cmsData;

  const [formOpen, setFormOpen] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [submittedMessage, setSubmittedMessage] = useState(false);

  const approvedItems = (testimonials.items || []).filter((item) => item.status === 'approved' || !item.status);
  const isCarousel = (testimonials.layoutMode || 'carousel') === 'carousel';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !reviewText.trim()) return;

    addTestimonialSubmission({
      clientName: name,
      clientRole: role,
      reviewText,
      rating,
    });

    setSubmittedMessage(true);
    setName('');
    setRole('');
    setReviewText('');
    setRating(5);

    setTimeout(() => {
      setSubmittedMessage(false);
      setFormOpen(false);
    }, 3500);
  };

  const renderTestimonialCard = (item: any) => (
    <div
      key={item.id}
      className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-5 shadow-xl relative group hover:border-amber-500/40 transition-all min-h-[260px] h-full"
    >
      <div className="space-y-4">
        {/* Rating Stars */}
        {testimonials.layoutStyle !== 'photo_name_text' && (
          <div className="flex items-center gap-1 text-amber-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < item.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`}
              />
            ))}
          </div>
        )}

        {/* Review Text */}
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic">
          "{item.reviewText}"
        </p>
      </div>

      {/* Author Details */}
      <div className="pt-4 border-t border-slate-800/80 flex items-center gap-3">
        {testimonials.layoutStyle !== 'name_text_only' && item.clientPhoto && (
          <img
            src={item.clientPhoto}
            alt={item.clientName}
            className="w-11 h-11 rounded-full object-cover border-2 border-amber-500/30 shrink-0"
          />
        )}
        <div>
          <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
            <span>{item.clientName}</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          </h4>
          <p className="text-[11px] text-amber-400 font-medium">{item.clientRole}</p>
        </div>
      </div>
    </div>
  );

  return (
    <section id="testimonials" className="py-20 bg-slate-900/60 border-y border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full text-xs font-bold">
            <Star className="w-4 h-4 fill-amber-400" />
            <span>آراء وتقييمات العملاء</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">
            {testimonials.sectionTitle}
          </h2>
          <p className="text-sm sm:text-base text-slate-400 font-medium">
            {testimonials.sectionSubtitle}
          </p>
        </div>

        {/* Render Carousel or Grid based on Admin selection */}
        {isCarousel ? (
          <CarouselSlider itemsPerPageDesktop={3} itemsPerPageMobile={1} autoPlay={true} autoPlayInterval={5000}>
            {approvedItems.map((item) => renderTestimonialCard(item))}
          </CarouselSlider>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {approvedItems.map((item) => renderTestimonialCard(item))}
          </div>
        )}

        {/* Public Submission Form Section */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-6 max-w-3xl mx-auto text-center shadow-2xl">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white flex items-center justify-center gap-2">
              <MessageSquarePlus className="w-5 h-5 text-amber-400" />
              <span>هل تعاملت مع منظومة أوريكس؟ شاركنا رأيك وشهادتك</span>
            </h3>
            <p className="text-xs text-slate-400">
              تخضع جميع المشاركات لمراجعة واعتماد الإدارة قبل النشر بالموقع العام
            </p>
          </div>

          {!formOpen ? (
            <button
              onClick={() => setFormOpen(true)}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-colors"
            >
              أضف شهادتك وتقييمك الآن
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="text-right space-y-4 animate-in fade-in duration-200">
              {submittedMessage && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 font-bold flex items-center gap-2 justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>تم إرسال شهادتك وتقييمك بنجاح! سيتم نشرها عقب موافقة الإدارة.</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">الاسم الكامل:</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: م. أحمد الخالد"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">الصفة أو المسمى الوظيفي:</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="مثال: مدير عام شركة..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Rating Star Picker */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">تقييمك للمنظومة:</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs text-amber-400 font-bold pr-2">{rating} من 5 نجوم</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">نص الشهادة أو الانطباع:</label>
                <textarea
                  required
                  rows={3}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="اكتب انطباعك وشهادتك عن خدماتنا..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 text-xs rounded-xl"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>إرسال الشهادة للإدارة</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

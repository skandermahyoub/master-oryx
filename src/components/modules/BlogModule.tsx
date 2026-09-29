import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { CarouselSlider } from '../common/CarouselSlider';
import { BookOpen, Calendar, User, Clock, ArrowLeft, Tag } from 'lucide-react';

export const BlogModule: React.FC = () => {
  const { cmsData, setSelectedArticleId } = useCMS();
  const { blog } = cmsData;

  const [activeCategory, setActiveCategory] = useState<string>('الكل');

  const posts = blog.posts || [];
  if (posts.length === 0) return null;

  const filteredPosts =
    activeCategory === 'الكل'
      ? posts
      : posts.filter((p) => p.category === activeCategory);

  const displayPosts = filteredPosts.slice(0, blog.postsToShow || 6);
  const layoutMode = blog.layoutMode || 'carousel_horizontal';

  const renderPostCard = (post: any) => (
    <div
      key={post.id}
      onClick={() => setSelectedArticleId(post.id)}
      className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between group cursor-pointer hover:border-amber-500/50 hover:shadow-2xl transition-all h-full min-h-[360px]"
    >
      <div className="space-y-4">
        {/* Image */}
        <div className="relative h-48 overflow-hidden bg-slate-900">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 right-3 px-3 py-1 bg-slate-950/80 backdrop-blur-md border border-slate-700/80 rounded-full text-[10px] font-bold text-amber-400 flex items-center gap-1">
            <Tag className="w-3 h-3" />
            <span>{post.category}</span>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 space-y-2">
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <User className="w-3 h-3 text-amber-400 shrink-0" />
              <span>{post.author}</span>
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 shrink-0" />
              <span>{post.date}</span>
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 shrink-0" />
              <span>{post.readTime}</span>
            </span>
          </div>

          <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2">
            {post.title}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
            {post.excerpt}
          </p>
        </div>
      </div>

      {/* Action Link */}
      <div className="p-6 pt-4 border-t border-slate-900 flex items-center justify-between text-xs font-bold text-amber-400">
        <span>اقرأ المقال بالكامل</span>
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
      </div>
    </div>
  );

  return (
    <section id="blog" className="py-20 bg-slate-900/60 border-y border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full text-xs font-bold">
            <BookOpen className="w-4 h-4" />
            <span>مدونة الحلول والمعرفة</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">
            {blog.sectionTitle}
          </h2>
          <p className="text-sm sm:text-base text-slate-400 font-medium">
            {blog.sectionSubtitle}
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 pb-2 border-b border-slate-800/80">
          {(blog.categories || []).map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeCategory === cat
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Posts Rendering: Horizontal Carousel vs Vertical Carousel vs Grid */}
        {layoutMode === 'carousel_horizontal' ? (
          <CarouselSlider itemsPerPageDesktop={3} itemsPerPageMobile={1} autoPlay={true}>
            {displayPosts.map((post) => renderPostCard(post))}
          </CarouselSlider>
        ) : layoutMode === 'carousel_vertical' ? (
          <CarouselSlider itemsPerPageDesktop={2} itemsPerPageMobile={1} autoPlay={true} vertical={true}>
            {displayPosts.map((post) => renderPostCard(post))}
          </CarouselSlider>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayPosts.map((post) => renderPostCard(post))}
          </div>
        )}
      </div>
    </section>
  );
};

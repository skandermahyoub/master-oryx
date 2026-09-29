import React, { useEffect, useState, useRef } from 'react';
import { useCMS } from '../../context/CMSContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, ArrowLeft, Sparkles, Play, Pause } from 'lucide-react';

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.96,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.96,
  }),
};

export const SliderModule: React.FC = () => {
  const { cmsData } = useCMS();
  const { slider } = cmsData;
  const [[page, direction], setPage] = useState<[number, number]>([0, 0]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const touchStartX = useRef<number | null>(null);

  const slides = slider.slides || [];
  const totalSlides = slides.length;

  const currentIndex = Math.abs(page % totalSlides);

  useEffect(() => {
    if (totalSlides === 0 || !isPlaying) return;

    const intervalTime = 50;
    const totalSteps = (slider.autoPlayInterval || 5000) / intervalTime;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setPage(([p]) => [p + 1, 1]);
          return 0;
        }
        return prev + 100 / totalSteps;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [page, isPlaying, totalSlides, slider.autoPlayInterval]);

  if (totalSlides === 0) return null;

  const paginate = (newDirection: number) => {
    setPage(([p]) => [p + newDirection, newDirection]);
    setProgress(0);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;

    if (Math.abs(diffX) > 40) {
      if (diffX > 0) paginate(1);
      else paginate(-1);
    }
    touchStartX.current = null;
  };

  const currentSlide = slides[currentIndex] || slides[0];

  return (
    <section id="slider" className="py-8 bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cinematic Responsive Hero Slider Container */}
        <div
          className="relative rounded-3xl overflow-hidden border border-slate-800/80 shadow-2xl min-h-[520px] sm:min-h-[580px] bg-slate-900 group"
          onMouseEnter={() => setIsPlaying(false)}
          onMouseLeave={() => setIsPlaying(true)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Framer-Motion Animated Slide Transition */}
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={page}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'spring', stiffness: 280, damping: 30 },
                opacity: { duration: 0.35 },
                scale: { duration: 0.35 },
              }}
              className="absolute inset-0 w-full h-full flex items-center p-6 sm:p-12 md:p-16"
            >
              {/* Background Image with Gradient Overlays */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                  src={currentSlide.bgImageUrl}
                  alt={currentSlide.title}
                  className="w-full h-full object-cover object-center filter brightness-75 scale-100 group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-transparent" />
              </div>

              {/* Slide Content */}
              <div className="relative z-10 max-w-3xl space-y-5 text-right">
                {currentSlide.badge && (
                  <motion.span
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-xs font-bold backdrop-blur-md"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>{currentSlide.badge}</span>
                  </motion.span>
                )}

                <motion.h2
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight drop-shadow-md"
                >
                  {currentSlide.title}
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-sm sm:text-base md:text-lg text-slate-300 leading-relaxed font-medium drop-shadow"
                >
                  {currentSlide.subtitle}
                </motion.p>

                {currentSlide.ctaText && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="pt-2"
                  >
                    <a
                      href={currentSlide.ctaUrl || '#contact'}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-xl shadow-amber-500/20 transition-all transform hover:-translate-y-0.5"
                    >
                      <span>{currentSlide.ctaText}</span>
                      <ArrowLeft className="w-4 h-4" />
                    </a>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls Bar in Bottom Section */}
          <div className="absolute bottom-0 inset-x-0 z-20 p-4 sm:p-6 bg-gradient-to-t from-slate-950/95 via-slate-950/70 to-transparent flex flex-wrap items-center justify-between gap-4 border-t border-slate-800/40">
            {/* Slide Timer Progress Bar */}
            <div className="w-full h-1 bg-slate-800/80 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all ease-linear duration-75"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Slide Numbers & Dot Indicators */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold text-amber-400">
                0{currentIndex + 1} <span className="text-slate-600">/</span> 0{totalSlides}
              </span>

              <div className="flex items-center gap-1.5">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      const dir = idx > currentIndex ? 1 : -1;
                      setPage([idx, dir]);
                      setProgress(0);
                    }}
                    className={`h-2 rounded-full transition-all ${
                      currentIndex === idx ? 'w-6 bg-amber-400 shadow-md shadow-amber-400/30' : 'w-2 bg-slate-700 hover:bg-slate-500'
                    }`}
                    aria-label={`الشريحة ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Play/Pause & Arrows Navigation */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 text-slate-400 hover:text-white bg-slate-900/90 hover:bg-slate-800 rounded-xl border border-slate-700/80 transition-colors"
                title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-amber-400" />}
              </button>

              <button
                type="button"
                onClick={() => paginate(-1)}
                className="p-2 text-slate-300 hover:text-amber-400 bg-slate-900/90 hover:bg-slate-800 rounded-xl border border-slate-700/80 transition-colors"
                title="الشريحة السابقة"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => paginate(1)}
                className="p-2 text-slate-300 hover:text-amber-400 bg-slate-900/90 hover:bg-slate-800 rounded-xl border border-slate-700/80 transition-colors"
                title="الشريحة التالية"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

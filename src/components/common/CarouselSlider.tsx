import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, Pause, Play } from 'lucide-react';

interface CarouselSliderProps {
  children: React.ReactNode[];
  itemsPerPageDesktop?: number; // How many items visible at once on desktop (default 3 or 1)
  itemsPerPageMobile?: number;  // How many items visible on mobile (default 1)
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showNavButtons?: boolean;
  showDots?: boolean;
  className?: string;
  vertical?: boolean; // Support vertical carousel option
}

export const CarouselSlider: React.FC<CarouselSliderProps> = ({
  children,
  itemsPerPageDesktop = 3,
  itemsPerPageMobile = 1,
  autoPlay = true,
  autoPlayInterval = 5000,
  showNavButtons = true,
  showDots = true,
  className = '',
  vertical = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageDesktop);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const totalItems = React.Children.count(children);

  // Calculate maximum index
  const maxIndex = Math.max(0, totalItems - itemsPerPage);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(itemsPerPageMobile);
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(Math.min(2, itemsPerPageDesktop));
      } else {
        setItemsPerPage(itemsPerPageDesktop);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [itemsPerPageDesktop, itemsPerPageMobile]);

  // Reset index if out of bounds on resize
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [itemsPerPage, maxIndex, currentIndex]);

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying || totalItems <= itemsPerPage) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isPlaying, maxIndex, totalItems, itemsPerPage, autoPlayInterval]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  // Touch Swipe Handlers for mobile & drag
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;

    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    const diffY = touchStartY.current - e.changedTouches[0].clientY;

    if (vertical) {
      if (Math.abs(diffY) > 40) {
        if (diffY > 0) handleNext();
        else handlePrev();
      }
    } else {
      if (Math.abs(diffX) > 40) {
        // In RTL, swipe left means next item, swipe right means prev item
        if (diffX > 0) handleNext();
        else handlePrev();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  if (totalItems === 0) return null;

  return (
    <div
      className={`relative group ${className}`}
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(autoPlay)}
    >
      {/* Carousel Track Window */}
      <div
        className="overflow-hidden rounded-3xl"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className={`flex transition-transform duration-500 ease-out ${
            vertical ? 'flex-col' : 'flex-row'
          }`}
          style={
            vertical
              ? { transform: `translateY(-${currentIndex * (100 / itemsPerPage)}%)` }
              : { transform: `translateX(${currentIndex * (100 / itemsPerPage)}%)` } // RTL translation
          }
        >
          {React.Children.map(children, (child, idx) => (
            <div
              key={idx}
              className="shrink-0 p-3 transition-all duration-300"
              style={{
                width: vertical ? '100%' : `${100 / itemsPerPage}%`,
              }}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons and Dots Controls */}
      {(showNavButtons || showDots) && totalItems > itemsPerPage && (
        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 px-2">
          {/* Navigation Arrows */}
          {showNavButtons && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrev}
                className="p-2.5 bg-slate-900/90 hover:bg-amber-500 hover:text-slate-950 text-slate-200 rounded-2xl border border-slate-800 shadow-xl transition-all"
                title="الشريحة السابقة"
                aria-label="Previous Slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="p-2.5 bg-slate-900/90 hover:bg-amber-500 hover:text-slate-950 text-slate-200 rounded-2xl border border-slate-800 shadow-xl transition-all"
                title="الشريحة التالية"
                aria-label="Next Slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2.5 bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-amber-400 rounded-2xl border border-slate-800 transition-colors"
                title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل الكاروسال'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-amber-400" />}
              </button>
            </div>
          )}

          {/* Page Indicators / Dots */}
          {showDots && (
            <div className="flex items-center gap-2">
              {Array.from({ length: maxIndex + 1 }).map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={() => setCurrentIndex(dotIdx)}
                  className={`h-2.5 rounded-full transition-all ${
                    currentIndex === dotIdx
                      ? 'w-7 bg-amber-400 shadow-lg shadow-amber-400/30'
                      : 'w-2.5 bg-slate-700 hover:bg-slate-500'
                  }`}
                  aria-label={`الانتقال إلى الشريحة ${dotIdx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

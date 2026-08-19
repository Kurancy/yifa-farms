import React, { useState, useEffect, useRef } from 'react';
import { testimonialsData } from '../data/farmData';
import { TestimonialItem } from '../types';
import { Star, ChevronLeft, ChevronRight, Quote, CheckCircle2, Pause, Play, Utensils, Heart } from 'lucide-react';

export const TestimonialCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'caterer' | 'family'>('all');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const filteredTestimonials = activeFilter === 'all'
    ? testimonialsData
    : testimonialsData.filter(t => t.segment === activeFilter);

  const total = filteredTestimonials.length;

  // Auto-play logic
  useEffect(() => {
    if (isPlaying && total > 1) {
      timerRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % total);
      }, 5500);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, total, currentIndex]);

  // Reset index when filter changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeFilter]);

  const handlePrev = () => {
    setCurrentIndex(prev => (prev === 0 ? total - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % total);
  };

  const currentTestimonial: TestimonialItem = filteredTestimonials[currentIndex] || testimonialsData[0];

  return (
    <div
      className="mt-16 lg:mt-20 pt-14 border-t border-white/10"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      {/* Sub-section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="h-[1px] w-5 bg-[#D4AF37]"></span>
            <span className="text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase">
              Kaduna Customer Stories
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight uppercase">
            Trusted by Caterers, Bakers & Families
          </h3>
          <p className="text-xs sm:text-sm text-[#FDFBF5]/75 mt-1 max-w-xl">
            Real feedback from commercial kitchens and family breakfast tables across Kaduna Metropolis.
          </p>
        </div>

        {/* Filter Pills & Play/Pause Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center bg-[#071810] p-1 rounded-full border border-white/10">
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-[#D4AF37] text-[#0D2B1D] shadow-sm'
                  : 'text-[#FDFBF5]/70 hover:text-white'
              }`}
            >
              All Reviews ({testimonialsData.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('caterer')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeFilter === 'caterer'
                  ? 'bg-[#D4AF37] text-[#0D2B1D] shadow-sm'
                  : 'text-[#FDFBF5]/70 hover:text-white'
              }`}
            >
              <Utensils className="w-3 h-3" />
              <span>Caterers & Bakers</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('family')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeFilter === 'family'
                  ? 'bg-[#D4AF37] text-[#0D2B1D] shadow-sm'
                  : 'text-[#FDFBF5]/70 hover:text-white'
              }`}
            >
              <Heart className="w-3 h-3" />
              <span>Families</span>
            </button>
          </div>

          {/* Autoplay Pause/Play button */}
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? 'Pause Auto-play' : 'Resume Auto-play'}
            aria-label={isPlaying ? 'Pause Auto-play' : 'Resume Auto-play'}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-[#FDFBF5]/80 hover:text-[#D4AF37] border border-white/10 transition-colors"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Carousel Card Surface */}
      <div className="relative bg-[#0A2217] rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl overflow-hidden">
        {/* Ambient quote watermark */}
        <Quote className="absolute top-6 right-8 w-24 h-24 text-white/[0.03] pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Reviewer Profile & Verified Badge (4 cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 pb-6 lg:pb-0 lg:pr-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {/* Avatar Icon */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#8C6D1F] text-[#0D2B1D] flex items-center justify-center font-black text-lg shadow-lg border border-[#D4AF37]/50">
                  {currentTestimonial.avatarText}
                </div>
                <div>
                  <div className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-[#D4AF37] tracking-wider">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Verified Kaduna {currentTestimonial.segment === 'caterer' ? 'Caterer' : 'Customer'}</span>
                  </div>
                  <h4 className="text-lg font-bold text-white leading-tight">
                    {currentTestimonial.name}
                  </h4>
                  <p className="text-xs text-[#FDFBF5]/70">
                    {currentTestimonial.role}
                  </p>
                </div>
              </div>

              {currentTestimonial.organization && (
                <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-[#D4AF37]">
                  {currentTestimonial.organization}
                </div>
              )}

              <div className="text-xs text-[#FDFBF5]/60 flex items-center gap-1.5">
                <span>📍</span>
                <span>{currentTestimonial.location}</span>
              </div>
            </div>

            {/* Rating Stars */}
            <div className="pt-4 flex items-center gap-1">
              {[...Array(currentTestimonial.rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
              ))}
              <span className="text-xs font-bold text-[#FDFBF5]/80 ml-2">
                5.0 / 5.0 Rating
              </span>
            </div>
          </div>

          {/* Right Column: Highlight & Full Quote Text (8 cols) */}
          <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="inline-block px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold uppercase tracking-wider">
                &ldquo;{currentTestimonial.highlight}&rdquo;
              </div>

              <blockquote className="text-base sm:text-lg lg:text-xl text-[#FDFBF5] font-serif leading-relaxed italic">
                &ldquo;{currentTestimonial.content}&rdquo;
              </blockquote>
            </div>

            {/* Bottom Controls: Carousel Indicators & Arrows */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-4">
              {/* Pagination Dots */}
              <div className="flex items-center gap-2">
                {filteredTestimonials.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      currentIndex === idx
                        ? 'w-7 bg-[#D4AF37]'
                        : 'w-2 bg-white/20 hover:bg-white/40'
                    }`}
                  />
                ))}
                <span className="text-[11px] text-[#FDFBF5]/50 ml-2">
                  0{currentIndex + 1} / 0{total}
                </span>
              </div>

              {/* Navigation Arrow buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous testimonial"
                  className="p-2.5 rounded-full bg-white/5 hover:bg-white/15 text-white border border-white/10 transition-all cursor-pointer active:scale-95"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next testimonial"
                  className="p-2.5 rounded-full bg-[#D4AF37] hover:bg-[#E5C158] text-[#0D2B1D] transition-all cursor-pointer active:scale-95 shadow-md"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

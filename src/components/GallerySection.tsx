import React, { useState } from 'react';
import { galleryItems } from '../data/farmData';
import { GalleryItem } from '../types';
import { Image as ImageIcon, X, ChevronLeft, ChevronRight, Maximize2, Tag } from 'lucide-react';
import { ClientConfirmBadge } from './ClientConfirmBadge';

export const GallerySection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const filteredGallery = activeCategory === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeCategory);

  const handleOpenLightbox = (index: number) => {
    setSelectedPhotoIndex(index);
  };

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex((selectedPhotoIndex + 1) % filteredGallery.length);
    }
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex((selectedPhotoIndex - 1 + filteredGallery.length) % filteredGallery.length);
    }
  };

  return (
    <section id="gallery" className="pt-2 pb-20 sm:pt-4 sm:pb-24 bg-transparent text-[#FDFBF5] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="h-[1px] w-6 bg-[#D4AF37]"></span>
              <span className="text-[#D4AF37] text-xs font-bold tracking-[0.25em] uppercase">Visual Showcase</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#FDFBF5] tracking-tight uppercase">
              Farm Photo Gallery
            </h2>
            <p className="mt-3 text-base text-[#FDFBF5]/75 leading-relaxed">
              Explore authentic glimpses of our layer coops, broiler rearing, early morning egg sorting, and irrigated vegetable rows in Kaduna.
            </p>
          </div>

          {/* Gallery Filters */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-white/5 rounded-full border border-white/10 backdrop-blur-sm">
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-[#D4AF37] text-[#0D2B1D] shadow-md'
                  : 'text-[#FDFBF5]/70 hover:text-white hover:bg-white/5'
              }`}
            >
              All Photos
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory('eggs')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all cursor-pointer ${
                activeCategory === 'eggs'
                  ? 'bg-[#D4AF37] text-[#0D2B1D] shadow-md'
                  : 'text-[#FDFBF5]/70 hover:text-white hover:bg-white/5'
              }`}
            >
              Eggs
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory('poultry')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all cursor-pointer ${
                activeCategory === 'poultry'
                  ? 'bg-[#D4AF37] text-[#0D2B1D] shadow-md'
                  : 'text-[#FDFBF5]/70 hover:text-white hover:bg-white/5'
              }`}
            >
              Poultry Flock
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory('vegetables')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all cursor-pointer ${
                activeCategory === 'vegetables'
                  ? 'bg-[#D4AF37] text-[#0D2B1D] shadow-md'
                  : 'text-[#FDFBF5]/70 hover:text-white hover:bg-white/5'
              }`}
            >
              Vegetables
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory('facilities')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all cursor-pointer ${
                activeCategory === 'facilities'
                  ? 'bg-[#D4AF37] text-[#0D2B1D] shadow-md'
                  : 'text-[#FDFBF5]/70 hover:text-white hover:bg-white/5'
              }`}
            >
              Facilities
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredGallery.map((item, index) => (
            <div
              key={item.id}
              onClick={() => handleOpenLightbox(index)}
              className="group relative h-64 sm:h-72 rounded-2xl overflow-hidden cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/10 bg-black/40"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500 filter brightness-90 contrast-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity"></div>

              {/* Tag / Client Marker */}
              <div className="absolute top-3 right-3 flex items-center gap-1.5">
                <ClientConfirmBadge label="CLIENT PHOTO PLACEHOLDER" />
              </div>

              {/* Zoom icon on hover */}
              <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-black/60 text-[#D4AF37] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-4 h-4" />
              </div>

              {/* Caption */}
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37] block mb-0.5">
                  {item.category}
                </span>
                <h4 className="text-sm font-bold text-white leading-tight line-clamp-1">
                  {item.title}
                </h4>
                <p className="text-xs text-[#FDFBF5]/70 line-clamp-1 mt-0.5">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedPhotoIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in"
          onClick={() => setSelectedPhotoIndex(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedPhotoIndex(null)}
            aria-label="Close photo preview"
            className="absolute top-5 right-5 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev Button */}
          <button
            type="button"
            onClick={handlePrevPhoto}
            aria-label="Previous photo"
            className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next Button */}
          <button
            type="button"
            onClick={handleNextPhoto}
            aria-label="Next photo"
            className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Image & Caption Card */}
          <div
            className="max-w-4xl max-h-[85vh] w-full flex flex-col rounded-3xl overflow-hidden bg-[#0D2B1D] border border-white/10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative flex-1 overflow-hidden max-h-[65vh] flex items-center justify-center bg-black">
              <img
                src={filteredGallery[selectedPhotoIndex].image}
                alt={filteredGallery[selectedPhotoIndex].title}
                className="max-w-full max-h-[65vh] object-contain"
              />
            </div>
            <div className="p-6 bg-[#0A2217] text-white flex items-center justify-between border-t border-white/10">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#D4AF37]">
                  {filteredGallery[selectedPhotoIndex].category} • Photo {selectedPhotoIndex + 1} of {filteredGallery.length}
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  {filteredGallery[selectedPhotoIndex].title}
                </h3>
                <p className="text-xs text-[#FDFBF5]/75 mt-0.5">
                  {filteredGallery[selectedPhotoIndex].description}
                </p>
              </div>
              <ClientConfirmBadge label="REPLACE WITH REAL PHOTO" />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

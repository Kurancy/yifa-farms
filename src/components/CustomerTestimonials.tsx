import React, { useState, useMemo } from 'react';
import { useFarmConfig } from '../context/FarmConfigContext';
import { useToast } from '../context/ToastContext';
import {
  Star,
  Quote,
  CheckCircle2,
  ThumbsUp,
  MessageSquare,
  Plus,
  X,
  Filter,
  Camera,
  MapPin,
  Calendar,
  Sparkles,
  ShoppingBag
} from 'lucide-react';

export interface CustomerReview {
  id: string;
  name: string;
  role: string;
  location: string;
  rating: number;
  productPurchased: string;
  category: 'caterer' | 'family' | 'wholesaler' | 'restaurant';
  date: string;
  comment: string;
  photoUrl?: string;
  avatarText?: string;
  verified: boolean;
  helpfulCount: number;
}

const INITIAL_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    name: 'Hajiya Amina Bello',
    role: 'Lead Baker & Pastry Chef, HoneyCrust Kaduna',
    location: 'Barnawa, Kaduna',
    rating: 5,
    productPurchased: 'Fresh Farm Eggs (30-Egg Crate)',
    category: 'caterer',
    date: '2 days ago',
    comment: 'YIFA Farms eggs have the highest yolk firmness and vibrant golden color of any farm in Kaduna. We bake over 150 cakes weekly, and our sponge rise and emulsification have been consistent since switching suppliers.',
    photoUrl: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=400&q=80',
    avatarText: 'AB',
    verified: true,
    helpfulCount: 34
  },
  {
    id: 'rev-2',
    name: 'Dr. Ibrahim Garba',
    role: 'Family Household Head',
    location: 'Malali GRA, Kaduna',
    rating: 5,
    productPurchased: 'Dressed Whole Broiler Chicken',
    category: 'family',
    date: '5 days ago',
    comment: 'Clean packaging, zero chemical odor, and fresh delivery right to our gate in Malali. The meat texture is tender and healthy. We now place a bi-weekly subscription for 4 dressed chickens and 3 crates of eggs.',
    photoUrl: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=400&q=80',
    avatarText: 'IG',
    verified: true,
    helpfulCount: 19
  },
  {
    id: 'rev-3',
    name: 'Chef Emmanuel Okafor',
    role: 'Executive Chef, Savannah Crest Hotel',
    location: 'Independence Way, Kaduna',
    rating: 5,
    productPurchased: 'Fresh Pond Catfish & Vegetables',
    category: 'restaurant',
    date: '1 week ago',
    comment: 'Our weekend catfish pepper soup is famous in Kaduna Central because YIFA delivers table-size live catfish directly from the ponds with zero delays. The quality assurance makes my kitchen operation effortless.',
    photoUrl: 'https://images.unsplash.com/photo-1534043464124-3be32fe00099?auto=format&fit=crop&w=400&q=80',
    avatarText: 'EO',
    verified: true,
    helpfulCount: 28
  },
  {
    id: 'rev-4',
    name: 'Mallam Yakubu Danladi',
    role: 'Wholesale Depot Operator',
    location: 'Central Market, Kaduna',
    rating: 5,
    productPurchased: 'Commercial Egg Crates (Bulk Consignment)',
    category: 'wholesaler',
    date: '2 weeks ago',
    comment: 'We lift 200+ crates per week from YIFA farm gates. Zero breakages during transit due to their heavy-duty pulp cartons and careful handling by their dispatch unit. Highest integrity pricing in Kaduna state.',
    photoUrl: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=400&q=80',
    avatarText: 'YD',
    verified: true,
    helpfulCount: 42
  }
];

export const CustomerTestimonials: React.FC = () => {
  const toast = useToast();
  const [reviews, setReviews] = useState<CustomerReview[]>(() => {
    try {
      const saved = localStorage.getItem('yifa_customer_reviews');
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  const [selectedCategory, setSelectedCategory] = useState<'all' | 'caterer' | 'family' | 'restaurant' | 'wholesaler'>('all');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [helpfulLiked, setHelpfulLiked] = useState<Record<string, boolean>>({});

  // Review Form State
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('Kaduna, Nigeria');
  const [productPurchased, setProductPurchased] = useState('Fresh Farm Eggs (30-Egg Crate)');
  const [category, setCategory] = useState<CustomerReview['category']>('family');
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('');

  const filteredReviews = useMemo(() => {
    if (selectedCategory === 'all') return reviews;
    return reviews.filter(r => r.category === selectedCategory);
  }, [reviews, selectedCategory]);

  const handleToggleHelpful = (id: string) => {
    const isAlreadyLiked = helpfulLiked[id];
    setReviews(prev =>
      prev.map(r => {
        if (r.id === id) {
          return {
            ...r,
            helpfulCount: isAlreadyLiked ? r.helpfulCount - 1 : r.helpfulCount + 1
          };
        }
        return r;
      })
    );
    setHelpfulLiked(prev => ({ ...prev, [id]: !isAlreadyLiked }));
    if (!isAlreadyLiked) {
      toast.success('Thank you for your feedback on this customer review!', 'Feedback Recorded');
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) {
      toast.error('Please enter your name and review message.', 'Validation Error');
      return;
    }

    const newRev: CustomerReview = {
      id: `rev-${Date.now()}`,
      name: name.trim(),
      role: role.trim() || 'Kaduna Farm Customer',
      location: location.trim() || 'Kaduna, Nigeria',
      rating,
      productPurchased,
      category,
      date: 'Just now',
      comment: comment.trim(),
      avatarText: name
        .trim()
        .split(' ')
        .map(n => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
      verified: true,
      helpfulCount: 0
    };

    const updatedList = [newRev, ...reviews];
    setReviews(updatedList);
    try {
      localStorage.setItem('yifa_customer_reviews', JSON.stringify(updatedList));
    } catch {
      // ignore
    }

    toast.success('Your customer review has been published to YIFA Farms!', 'Review Submitted');
    setIsSubmitModalOpen(false);
    setName('');
    setRole('');
    setComment('');
  };

  return (
    <div className="mt-16 lg:mt-20 pt-12 border-t border-white/10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="h-[1px] w-6 bg-[#D4AF37]"></span>
            <span className="text-[#D4AF37] text-xs font-bold tracking-[0.25em] uppercase">
              Kaduna Customer Feedback & Reviews
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight uppercase">
            Real Reviews From Verified Buyers
          </h3>
          <p className="text-xs sm:text-sm text-[#FDFBF5]/75 mt-1 max-w-2xl">
            See unfiltered feedback and photos from local bakeries, caterers, hotel chefs, and Kaduna families who depend on our daily harvest.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setIsSubmitModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#0D2B1D] font-black text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg shadow-[#D4AF37]/15 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Write a Review</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
        {[
          { id: 'all', label: 'All Reviews' },
          { id: 'caterer', label: 'Bakeries & Caterers' },
          { id: 'family', label: 'Family Kitchens' },
          { id: 'restaurant', label: 'Hotels & Restaurants' },
          { id: 'wholesaler', label: 'Commercial Wholesalers' }
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSelectedCategory(tab.id as typeof selectedCategory)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
              selectedCategory === tab.id
                ? 'bg-[#D4AF37] text-[#0D2B1D] border-[#D4AF37]'
                : 'bg-white/5 text-[#FDFBF5]/70 border-white/10 hover:bg-white/10 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredReviews.map(rev => (
          <div
            key={rev.id}
            className="bg-[#0A2217] rounded-3xl p-6 sm:p-7 border border-white/10 hover:border-[#D4AF37]/40 transition-all shadow-xl flex flex-col justify-between group"
          >
            <div>
              {/* Card Top: Avatar, Name, Rating & Verified Badge */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  {rev.avatarText ? (
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#8C6D1F] text-[#0D2B1D] flex items-center justify-center font-black text-sm shadow-md border border-[#D4AF37]/50">
                      {rev.avatarText}
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center font-bold">
                      {rev.name[0]}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm sm:text-base font-bold text-white leading-tight">
                        {rev.name}
                      </h4>
                      {rev.verified && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Verified</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#FDFBF5]/60 mt-0.5">{rev.role}</p>
                  </div>
                </div>

                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-[#D4AF37] bg-white/5 px-2.5 py-1 rounded-full border border-white/10 shrink-0">
                  <Star className="w-3.5 h-3.5 fill-[#D4AF37]" />
                  <span className="text-xs font-bold text-white">{rev.rating}.0</span>
                </div>
              </div>

              {/* Product purchased tag & Location */}
              <div className="flex flex-wrap items-center gap-2 mb-3 text-[11px] text-[#FDFBF5]/70">
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[#D4AF37] font-semibold">
                  <ShoppingBag className="w-3 h-3" />
                  {rev.productPurchased}
                </span>
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[#FDFBF5]/60">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  {rev.location}
                </span>
              </div>

              {/* Review Comment Text */}
              <p className="text-xs sm:text-sm text-[#FDFBF5]/85 leading-relaxed italic">
                &ldquo;{rev.comment}&rdquo;
              </p>

              {/* Attached produce image preview if present */}
              {rev.photoUrl && (
                <div className="mt-4 rounded-2xl overflow-hidden border border-white/10 max-h-48 bg-black/40">
                  <img
                    src={rev.photoUrl}
                    alt={`${rev.productPurchased} photo`}
                    className="w-full h-40 object-cover hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              )}
            </div>

            {/* Bottom Meta & Helpful Button */}
            <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-[#FDFBF5]/50">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {rev.date}
              </span>

              <button
                type="button"
                onClick={() => handleToggleHelpful(rev.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                  helpfulLiked[rev.id]
                    ? 'bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/40'
                    : 'bg-white/5 hover:bg-white/10 text-[#FDFBF5]/70 border-white/10'
                }`}
              >
                <ThumbsUp className="w-3 h-3" />
                <span>Helpful ({rev.helpfulCount})</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* SUBMIT REVIEW MODAL */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0D2B1D] border border-white/15 rounded-3xl w-full max-w-lg shadow-2xl p-6 space-y-5 my-auto max-h-[92vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                <span>Share Your Experience With YIFA Farms</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(false)}
                className="p-2 text-[#FDFBF5]/60 hover:text-white rounded-xl hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#D4AF37] uppercase mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Hajia Zainab Sani"
                    className="w-full bg-[#071810] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#D4AF37] uppercase mb-1">Role / Business</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Caterer / Family Kitchen"
                    className="w-full bg-[#071810] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#D4AF37] uppercase mb-1">Customer Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CustomerReview['category'])}
                    className="w-full bg-[#071810] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4AF37] cursor-pointer"
                  >
                    <option value="caterer">Bakery / Caterer</option>
                    <option value="family">Family Kitchen</option>
                    <option value="restaurant">Hotel / Restaurant</option>
                    <option value="wholesaler">Commercial Wholesaler</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#D4AF37] uppercase mb-1">Location in Kaduna</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Barnawa / Malali GRA"
                    className="w-full bg-[#071810] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#D4AF37] uppercase mb-1">Product Purchased</label>
                <select
                  value={productPurchased}
                  onChange={(e) => setProductPurchased(e.target.value)}
                  className="w-full bg-[#071810] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4AF37] cursor-pointer"
                >
                  <option value="Fresh Farm Eggs (30-Egg Crate)">Fresh Farm Eggs (30-Egg Crate)</option>
                  <option value="Dressed Whole Frozen Chicken">Dressed Whole Frozen Chicken</option>
                  <option value="Live Healthy Broilers">Live Healthy Broilers</option>
                  <option value="Fresh Pond Catfish & Tilapia">Fresh Pond Catfish & Tilapia</option>
                  <option value="Fresh Field Tomatoes & Peppers">Fresh Field Tomatoes & Peppers</option>
                  <option value="Prime Northern Ram / Goat">Prime Northern Ram / Goat</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#D4AF37] uppercase mb-1">Rating *</label>
                <div className="flex items-center gap-2 bg-[#071810] p-3 rounded-xl border border-white/10">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 cursor-pointer hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-white/20'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-[#D4AF37] ml-2">{rating}.0 / 5.0 Stars</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#D4AF37] uppercase mb-1">Your Review *</label>
                <textarea
                  rows={3}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share details about egg yolk color, freshness, delivery promptness, or customer service..."
                  className="w-full bg-[#071810] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#0D2B1D] font-black uppercase tracking-wider cursor-pointer shadow-lg"
                >
                  Publish Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

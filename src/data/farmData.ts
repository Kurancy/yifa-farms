import { FarmConfig, ProductItem, GalleryItem, SupplyTarget } from '../types';

export const initialFarmConfig: FarmConfig = {
  farmName: "YIFA Farms",
  tagline: "Fresh From Our Farm. Trusted By Your Family.",
  foundedYear: 2018,
  founderName: "Abubakar Ibrahim",
  shopAddress: "College Road, adjacent Baba Marte Street, Ungwan Dosa, Kaduna",
  locationCity: "Kaduna",
  locationState: "Kaduna State",
  locationCountry: "Nigeria",
  exactAddress: "Dandami Road, Birnin Yero by Zaria Road, Kaduna State",
  isAddressConfirmed: false,
  phoneDisplay: "+234 803 580 3963",
  phoneRaw: "0818 606 2662",
  whatsappNumber: "0818 579 7931",
  whatsappDisplay: "+234 803 000 1234",
  email: "info@yifafarms.ng",
  openingHours: "Mon – Sat: 7:00 AM – 6:00 PM (Sunday Dispatch on Booking)",
  dispatchDays: "Daily early morning & afternoon dispatch runs across Kaduna metropolis & Abuja corridor",
  birdCapacityText: "15,000+ Layer & Broiler Birds Capacity",
  isBirdCapacityConfirmed: false,
  dailyEggProductionText: "Daily Morning Fresh Egg Grading",
  isDailyEggConfirmed: false,
  acreageText: "Integrated Multi-Unit Farm & Crop Fields",
  facebookUrl: "https://facebook.com/yifafarms",
  instagramUrl: "https://instagram.com/yifafarms",
  twitterUrl: "https://twitter.com/yifafarms",
  showClientBadges: true,
};

export const productsData: ProductItem[] = [
  {
    id: "fresh-eggs",
    name: "Fresh Farm Eggs",
    tagline: "High-grade table eggs with firm shells & rich golden yolks.",
    category: "eggs",
    badge: "Bestseller Daily Harvest",
    description: "Harvested fresh every morning and afternoon from our well-ventilated layer houses in Kaduna. Our eggs undergo strict visual inspection, sorting, and grading to ensure spotless cleanliness, intact shells, and unmatched freshness for family breakfast or bulk commercial pastry and catering.",
    features: [
      "Graded by size (Large & Jumbo crates available)",
      "Collected daily with zero chemical washing",
      "Sturdy shock-absorbent paper crates (30 eggs/crate)",
      "High yolk viscosity & rich natural color",
      "Bulk cartons (12 crates / 360 eggs) for wholesalers"
    ],
    specs: {
      unit: "Crate (30 Eggs) / Carton (12 Crates)",
      packaging: "Molded pulp eco-crates & reinforced master cartons",
      shelfLife: "3–4 weeks in cool storage",
      minOrder: "1 crate (Retail) | 10+ crates (Wholesale)",
      availability: "In Stock Daily",
      estimatedPrice: "Competitive wholesale & retail rates",
      isPriceConfirmed: false,
    },
    image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "frozen-chicken",
    name: "Dressed Frozen Chicken",
    tagline: "Hygienically dressed, blast-frozen whole chicken and cut portions.",
    category: "chicken",
    badge: "Clean & Ready-to-Cook",
    description: "Farm-raised broilers reared under strict sanitary conditions and balanced nutrition. Processed in a clean, temperature-controlled environment, thoroughly eviscerated, vacuum-sealed, and blast-frozen immediately to lock in natural moisture, tenderness, and succulent flavor.",
    features: [
      "100% properly bled and thoroughly cleaned",
      "Standard weights from 1.2kg, 1.5kg to 2.0kg+ whole birds",
      "Cut portions available: Wings, Drumsticks, Breast fillets, Gizzards",
      "Blast-frozen at sub-zero temperatures to preserve texture",
      "No added water weight or artificial preservatives"
    ],
    specs: {
      unit: "Whole bird (by weight) or Carton (10–12 birds)",
      packaging: "Food-grade airtight shrink poly-wrap & master freeze cartons",
      shelfLife: "6+ months at -18°C",
      minOrder: "3 birds (Household) | 1 carton (10kg+) for caterers",
      availability: "Freshly Processed & Frozen",
      estimatedPrice: "Per kg or per carton rate",
      isPriceConfirmed: false,
    },
    image: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "fresh-vegetables",
    name: "Fresh Field Vegetables",
    tagline: "Crisp, flavorful vegetables harvested from our Kaduna fertile soils.",
    category: "vegetables",
    badge: "Field-Fresh Harvest",
    description: "Sustainably grown seasonal vegetables cultivated with dedicated borehole irrigation in Kaduna. Picked at the crack of dawn to retain maximum crispness, vitamins, and natural crunch for household stews, salads, commercial food vendors, and supermarkets.",
    features: [
      "Tomatoes (firm, pulpy, ideal for Nigerian soups & sauces)",
      "Bell Peppers, Tatashe, Sombo, and Scotch Bonnet (Ata Rodo)",
      "Cabbage heads, crisp Cucumbers, Garden Greens & Ugwu",
      "Carefully crated and packed to prevent field bruising",
      "Harvest-to-dispatch within hours for zero spoilage"
    ],
    specs: {
      unit: "Baskets (Raffia), Crates, or 25kg / 50kg Bags",
      packaging: "Ventilated agro-crates and breathable mesh sacks",
      shelfLife: "Optimal freshness within 5–10 days",
      minOrder: "1 basket / 1 crate / Custom mixed vegetable bundle",
      availability: "Seasonal & Scheduled Weekly Harvests",
      estimatedPrice: "Market-indexed farm gate pricing",
      isPriceConfirmed: false,
    },
    image: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "live-birds-poultry",
    name: "Live Broilers & Layer Birds",
    tagline: "Vigorous, fully vaccinated mature birds for processors and festivals.",
    category: "poultry",
    badge: "Healthy & Active Flock",
    description: "Reared in biosecure, well-ventilated housing under veterinary oversight. Fed quality balanced grains to ensure robust muscular development, uniform flock weight, and active health. Ideal for live bird markets, celebration slaughter, or commercial abattoirs.",
    features: [
      "Comprehensive vaccination & brooding schedule maintained",
      "Heavy meat-type broilers & spent layers available",
      "Safe cage loading and stress-minimized transport support",
      "Point-of-lay pullets available on advance reservation",
      "Flock health documentation available for commercial off-takers"
    ],
    specs: {
      unit: "Per bird / Bulk coop batches (50–500+ birds)",
      packaging: "Standard transport plastic poultry crates",
      shelfLife: "Live healthy delivery",
      minOrder: "5 birds (Retail) | 50 birds (Commercial)",
      availability: "Batch cycles throughout the year",
      estimatedPrice: "Flock batch rates",
      isPriceConfirmed: false,
    },
    image: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "fresh-fish-aquaculture",
    name: "Fresh Catfish & Tilapia",
    tagline: "Pond-raised freshwater fish nurtured with clean water and nutrient-dense feeds.",
    category: "fish",
    badge: "Live & Oven-Dried Available",
    description: "Raised in structured aquaculture ponds with constant freshwater flow in Kaduna. Harvested live to order for peak sweetness, firm flaky meat, and wholesome nutrition. Available live in water containers or professionally wood-smoked and oven-dried.",
    features: [
      "Table-size live African Catfish (1.0kg – 2.5kg+)",
      "Freshwater Tilapia harvested fresh from clean ponds",
      "Traditional aromatic smoked and dried fish packages",
      "Supplied to peppersoup spots, restaurants, and family barbecues",
      "Hygienic pond-side gutting and filleting on request"
    ],
    specs: {
      unit: "Per kg (Live or Dressed) / Sacks / Smoked cartons",
      packaging: "Oxygenated water drums / Aerated crates / Vacuum seal",
      shelfLife: "Live on delivery / 3+ months for smoked",
      minOrder: "3kg (Household) | 25kg+ (Restaurants & Caterers)",
      availability: "Weekly pond harvests",
      estimatedPrice: "Farm-gate per kg rates",
      isPriceConfirmed: false,
    },
    image: "https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=1200&q=80" 
  },
  {
    id: "kaduna-rams-goats",
    name: "Northern Rams & Farm Goats",
    tagline: "Healthy, pasture-fed Northern livestock for festive celebrations and meat supply.",
    category: "livestock",
    badge: "Prime Northern Breeds",
    description: "Carefully selected and quarantine-checked Northern Nigerian rams with majestic horns and healthy farm goats. Fed wholesome grain supplements, grass forage, and mineral salt licks under veterinary monitoring for maximum meat yield and vigor.",
    features: [
      "Sturdy, healthy Northern rams (Medium, Large, Super-Giant)",
      "Healthy dairy and meat goats (Boer, Red Sokoto, West African Dwarf)",
      "Dewormed and fully vaccinated by licensed veterinarians",
      "Ideal for Eid-el-Kabir, weddings, naming ceremonies & abattoir off-takers",
      "Kaduna doorstep delivery and safe lairage handling"
    ],
    specs: {
      unit: "Per head / Batch orders for ceremonies",
      packaging: "Live supervised truck / trailer dispatch",
      shelfLife: "Live certified healthy animals",
      minOrder: "1 head (Family) | 5+ heads (Corporate / Events)",
      availability: "Year-round & Festive peak bookings",
      estimatedPrice: "Live weight inspection rates",
      isPriceConfirmed: false,
    },
    image: "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=1200&q=80"
  }
];

export const facilitiesData = [
  {
    id: "egg-grading",
    title: "Sanitary Egg Collection & Sorting",
    description: "Collected twice daily in clean trays. Eggs undergo visual quality checks, size sorting, and careful packing in sanitized crates to avoid hairline cracks.",
    metric: "Daily Fresh Collection",
    image: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "cold-storage",
    title: "Cold Chain & Blast Freezing Unit",
    description: "Equipped with cold storage and continuous power backup to ensure dressed chickens maintain sub-zero temperatures from processing to delivery vehicle.",
    metric: "Hygiene & Chill Maintained",
    image: "https://images.unsplash.com/photo-1584473457406-6240486418e9?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "crop-fields",
    title: "Irrigated Vegetable Cultivation",
    description: "Fertile Kaduna agricultural plots utilizing dedicated borehole drip irrigation, organic composting, and pest monitoring for vibrant, nutrient-rich crops.",
    metric: "Kaduna Farmland",
    image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1000&q=80"
  }
];

export const whyChooseUsData = [
  {
    iconName: "ShieldCheck",
    title: "Quality-Focused Production",
    description: "We enforce strict biosecurity, clean water systems, balanced grain nutrition, and rigorous grading across our poultry pens and crop fields."
  },
  {
    iconName: "MapPin",
    title: "Local Kaduna Agribusiness",
    description: "Proudly established in Kaduna State in 2018. We support the regional agricultural economy, create local jobs, and strengthen food supply across Northern Nigeria."
  },
  {
    iconName: "Truck",
    title: "Reliable & Predictable Supply",
    description: "Our structured flock rotation and harvest cycles mean restaurant owners, caterers, and retailers never face unexpected inventory shortages."
  },
  {
    iconName: "SunMedium",
    title: "Farm-Fresh Daily Harvest",
    description: "Zero weeks-old warehouse holding. Eggs are packaged fresh from the coops, and vegetables are dispatched within hours of harvest."
  },
  {
    iconName: "Users",
    title: "Customer & Wholesaler Support",
    description: "Direct relationship with our farm team. Flexible carton sizes, scheduled recurring weekly deliveries, and quick WhatsApp communication."
  },
  {
    iconName: "TrendingUp",
    title: "Growing Sustainable Enterprise",
    description: "Founded by Abubakar Ibrahim with a vision for modern, reliable farming infrastructure built on integrity, hygiene, and genuine customer trust."
  }
];

export const whoWeSupplyData: SupplyTarget[] = [
  {
    id: "households",
    title: "Households & Families",
    subtitle: "Nutritious, farm-fresh staples for your home dining table",
    iconName: "Home",
    description: "Feed your family with confidence. Get farm-fresh table eggs with golden yolks and cleanly dressed chicken delivered straight to your Kaduna doorstep.",
    typicalOrders: ["1–4 crates of fresh eggs per month", "Whole dressed chickens (1.5kg – 2.0kg)", "Weekly vegetable basket (Tomatoes, Pepper, Greens)"],
    benefits: ["Zero middlemen markup", "Always fresh & properly cleaned", "Convenient home dispatch in Kaduna"]
  },
  {
    id: "restaurants",
    title: "Restaurants & Caterers",
    subtitle: "High-volume consistency for Nigerian kitchens & event caterers",
    iconName: "Utensils",
    description: "From bustling Kaduna bukaterias to high-end catering outfits and event planners, we provide uniform broiler sizes, high-grade eggs, and fresh stew vegetables.",
    typicalOrders: ["10–50+ crates of eggs weekly", "Cartons of dressed chicken & wings", "Baskets of fresh tomatoes, rodo & tatashe"],
    benefits: ["Priority morning delivery slots", "Bulk volume pricing discounts", "Standardized poultry portion weights"]
  },
  {
    id: "hotels",
    title: "Hotels & Hospitality",
    subtitle: "Sanitary grade standards for breakfast buffets & dining rooms",
    iconName: "Building2",
    description: "Dependable daily deliveries of clean, spotless eggs and premium dressed poultry meeting strict culinary and hospitality hygiene requirements.",
    typicalOrders: ["Scheduled daily/weekly egg deliveries", "Prime chicken cuts & breast fillets", "Sorted salad cucumbers & tomatoes"],
    benefits: ["Consistent grading & intact shell quality", "Invoice & recurring supply contracts", "Guaranteed continuity of supply"]
  },
  {
    id: "retailers",
    title: "Supermarkets & Retailers",
    subtitle: "Display-ready packaged farm produce for grocery shelves",
    iconName: "Store",
    description: "Stock your retail shelves with high-turnover agricultural staples. Packaged in sturdy crates and clean vacuum bags ready for immediate customer pickup.",
    typicalOrders: ["Packaged 30-egg and 10-egg branded trays", "Frozen poly-wrapped whole birds", "Pre-packaged fresh produce trays"],
    benefits: ["Attractive, clean packaging", "Dependable restocking schedules", "Reliable sell-through margin"]
  },
  {
    id: "wholesalers",
    title: "Wholesalers & Distributors",
    subtitle: "Direct farm-gate volume allocations for regional trade",
    iconName: "Boxes",
    description: "Large volume egg crate cartons and live bird batch allocations for distribution throughout Kaduna, Abuja, Kano, and neighboring commercial markets.",
    typicalOrders: ["100–500+ crates per truck run", "Full flock batch allocations", "Bulk master cartons of frozen poultry"],
    benefits: ["Direct farm gate wholesale pricing", "Fast vehicle loading assistance", "Advance batch reservation priority"]
  }
];

export const galleryItems: GalleryItem[] = [
  {
    id: "gal-1",
    title: "Morning Fresh Egg Collection",
    category: "eggs",
    description: "Daily grading and sorting of spotless table eggs in our Kaduna packaging wing.",
    image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=1200&q=80",
    isClientPlaceholder: true
  },
  {
    id: "gal-2",
    title: "Modern Ventilated Poultry Pen",
    category: "poultry",
    description: "Well-aerated, biosecure poultry environment promoting active flock health.",
    image: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=1200&q=80",
    isClientPlaceholder: true
  },
  {
    id: "gal-3",
    title: "Dressed Poultry Cold Packaging",
    category: "facilities",
    description: "Hygienic processing line and instant blast freezing for lock-in freshness.",
    image: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=1200&q=80",
    isClientPlaceholder: true
  },
  {
    id: "gal-4",
    title: "Kaduna Farmland & Crop Rows",
    category: "vegetables",
    description: "Borehole-irrigated open crop fields cultivating fresh tomatoes and peppers.",
    image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80",
    isClientPlaceholder: true
  },
  {
    id: "gal-5",
    title: "Fresh Harvest Tomatoes & Tatashe",
    category: "vegetables",
    description: "Plump, vibrant vegetables harvested early morning before daytime sun.",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=1200&q=80",
    isClientPlaceholder: true
  },
  {
    id: "gal-6",
    title: "Carefully Stacked Egg Crates Ready for Dispatch",
    category: "eggs",
    description: "Eco-friendly pulp trays loaded for Kaduna metropolis delivery routes.",
    image: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=1200&q=80",
    isClientPlaceholder: true
  },
  {
    id: "gal-7",
    title: "Dedicated Farm Caretakers",
    category: "facilities",
    description: "Attentive feeding, poultry health monitoring, and sanitization routines.",
    image: "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1200&q=80",
    isClientPlaceholder: true
  },
  {
    id: "gal-8",
    title: "Vibrant Healthy Broiler Flock",
    category: "poultry",
    description: "Well-fed broilers achieving optimal meat ratio under vet supervision.",
    image: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=1200&q=80",
    isClientPlaceholder: true
  }
];

export const kadunaLocations = [
  "Kaduna Central / Town (Barnawa, Malali, Ungwan Rimi, Stadium)",
  "Kaduna North (Kawo, Rigachikun, Mando, Hayin Banki)",
  "Kaduna South (Sabon Tasha, Kakuri, Narayi, Gonin Gora)",
  "Zaria Road Corridor / Maraban Jos Axis",
  "Millennium City / Danbushiya Axis",
  "Abuja Dispatch & Logistics Hub",
  "Farm Gate Direct Pickup (Kaduna)",
  "Other Nigerian State (Interstate Freight)"
];

export const testimonialsData: import('../types').TestimonialItem[] = [
  {
    id: "test-1",
    name: "Hajiya Bilkisu Umar",
    role: "Head Chef & Managing Director",
    organization: "Al-Baraka Royal Catering Services",
    location: "Barnawa, Kaduna South",
    segment: "caterer",
    content: "We supply wedding receptions and government banquets across Kaduna. YIFA Farms eggs have the brightest golden yolks and zero breakage in transit. Their early morning 7:00 AM dispatch ensures our kitchen prep runs without a single hiccup.",
    rating: 5,
    highlight: "Zero transit breakage & vibrant golden yolks",
    verified: true,
    avatarText: "BU"
  },
  {
    id: "test-2",
    name: "Mallam Danladi Sani",
    role: "Procurement & Kitchen Head",
    organization: "Arewa Delight Bukateria & Grills",
    location: "Ungwan Rimi, Kaduna North",
    segment: "caterer",
    content: "Their dressed frozen broilers are thoroughly cleaned, cleanly bled, and packed with uniform weights. Abubakar Ibrahim and his farm team are dependable partners who understand the daily rhythm of Kaduna food businesses.",
    rating: 5,
    highlight: "Uniform broiler weights & thorough hygiene",
    verified: true,
    avatarText: "DS"
  },
  {
    id: "test-3",
    name: "Mrs. Grace Adebayo",
    role: "Family Home Subscriber",
    location: "Malali G.R.A., Kaduna",
    segment: "family",
    content: "I regularly order 3 crates of table eggs and a vegetable basket every two weeks for my household. The difference in freshness compared to open roadside markets is crystal clear. My kids love their scrambled eggs!",
    rating: 5,
    highlight: "Unmatched breakfast freshness for the family",
    verified: true,
    avatarText: "GA"
  },
  {
    id: "test-4",
    name: "Chef Emmanuel Kolawole",
    role: "Lead Pastry Chef & Baker",
    organization: "Savannah Crust & Cake Studio",
    location: "Sabon Tasha, Kaduna",
    segment: "caterer",
    content: "In baking, yolk viscosity and egg shell integrity are crucial for sponge volume and pastry texture. YIFA's farm-graded crates are the most consistent we've used in Kaduna, and their direct farm-gate pricing keeps our overhead lean.",
    rating: 5,
    highlight: "Perfect consistency for commercial baking",
    verified: true,
    avatarText: "EK"
  },
  {
    id: "test-5",
    name: "Dr. Farouq Mohammed",
    role: "Agro Consumer & Health Enthusiast",
    location: "Millennium City, Kaduna",
    segment: "family",
    content: "Knowing where your family's food comes from is invaluable. YIFA Farms practices honest, clean poultry husbandry without misleading buzzwords. Their scheduled delivery is prompt, and their team is always courteous.",
    rating: 5,
    highlight: "Transparent farm practices & timely deliveries",
    verified: true,
    avatarText: "FM"
  },
  {
    id: "test-6",
    name: "Amina Yusuf",
    role: "Event Planner & Caterer",
    organization: "Kaduna Grand Celebrations",
    location: "Kawo / Mando Corridor",
    segment: "caterer",
    content: "Whenever we manage weekend events with 500+ guests, YIFA Farms is our first call for bulk frozen chicken and fresh rodo/tomatoes. Their cold-chain packaging arrives intact even in peak afternoon heat.",
    rating: 5,
    highlight: "Cold-chain packaging preserves bulk meats perfectly",
    verified: true,
    avatarText: "AY"
  }
];

export const initialInventoryData: import('../types').InventoryItem[] = [
  {
    id: "inv-fresh-eggs",
    productId: "fresh-eggs",
    name: "Fresh Farm Eggs (30-Egg Crate)",
    category: "eggs",
    currentStock: 142,
    unit: "Crates",
    lowStockThreshold: 25,
    reorderLevel: 50,
    unitCost: 3400,
    unitPrice: 4200,
    wholesalePrice: 3850,
    lastRestocked: "Today, 06:00 AM",
    status: "in_stock",
    image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=400&q=80",
    batchNumber: "EGG-2024-0818-A",
    harvestDate: "Today (Morning Grading)",
    expiryDate: "30 Days (Best Before Sep 17)",
    shelfLifeDays: 28,
    freshnessStatus: "freshly_harvested"
  },
  {
    id: "inv-frozen-chicken",
    productId: "frozen-chicken",
    name: "Dressed Frozen Chicken (1.5kg–2.0kg)",
    category: "chicken",
    currentStock: 86,
    unit: "Birds",
    lowStockThreshold: 20,
    reorderLevel: 40,
    unitCost: 3500,
    unitPrice: 4600,
    wholesalePrice: 4200,
    lastRestocked: "Yesterday, 04:30 PM",
    status: "in_stock",
    image: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=400&q=80",
    batchNumber: "CHK-2024-0817-BF",
    harvestDate: "Yesterday (Blast-Frozen at -18°C)",
    expiryDate: "180 Days (Best Before Feb 2025)",
    shelfLifeDays: 178,
    freshnessStatus: "optimal"
  },
  {
    id: "inv-chicken-portions",
    productId: "frozen-chicken-wings",
    name: "Blast-Frozen Broiler Wings / Portions (10kg Carton)",
    category: "chicken",
    currentStock: 14,
    unit: "Cartons",
    lowStockThreshold: 15,
    reorderLevel: 30,
    unitCost: 28000,
    unitPrice: 36000,
    wholesalePrice: 33500,
    lastRestocked: "2 days ago",
    status: "low_stock",
    image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=400&q=80",
    batchNumber: "WNG-2024-0816-C",
    harvestDate: "2 days ago",
    expiryDate: "180 Days (Deep Freeze)",
    shelfLifeDays: 176,
    freshnessStatus: "optimal"
  },
  {
    id: "inv-live-broilers",
    productId: "live-birds-poultry",
    name: "Live Mature Broilers (2.2kg+ Average)",
    category: "poultry",
    currentStock: 320,
    unit: "Birds",
    lowStockThreshold: 50,
    reorderLevel: 100,
    unitCost: 3200,
    unitPrice: 4400,
    wholesalePrice: 3950,
    lastRestocked: "3 days ago",
    status: "in_stock",
    image: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=400&q=80",
    batchNumber: "PEN-03-BROILERS",
    harvestDate: "Active Pen (6-Week Mature Cycle)",
    expiryDate: "Ready for Farm-Gate Catch",
    shelfLifeDays: 14,
    freshnessStatus: "freshly_harvested"
  },
  {
    id: "inv-live-catfish",
    productId: "aquaculture-catfish",
    name: "Live Table-Size African Catfish (1kg–1.5kg)",
    category: "fish",
    currentStock: 210,
    unit: "kg",
    lowStockThreshold: 40,
    reorderLevel: 80,
    unitCost: 2400,
    unitPrice: 3400,
    wholesalePrice: 3050,
    lastRestocked: "Yesterday, 08:00 AM",
    status: "in_stock",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80",
    batchNumber: "POND-02-CATFISH",
    harvestDate: "Live Fish Flow-Through Pond #2",
    expiryDate: "Live Aerated Pond Stock",
    shelfLifeDays: 20,
    freshnessStatus: "freshly_harvested"
  },
  {
    id: "inv-fresh-tomatoes",
    productId: "fresh-vegetables",
    name: "Fresh Kaduna Tomatoes (Raffia Basket)",
    category: "vegetables",
    currentStock: 18,
    unit: "Baskets",
    lowStockThreshold: 10,
    reorderLevel: 25,
    unitCost: 6500,
    unitPrice: 8500,
    wholesalePrice: 7800,
    lastRestocked: "Today, 05:30 AM",
    status: "in_stock",
    image: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=400&q=80",
    batchNumber: "VEG-TOM-0818",
    harvestDate: "Today 05:30 AM (Borehole Field)",
    expiryDate: "7 Days (Best Before Aug 25)",
    shelfLifeDays: 6,
    freshnessStatus: "freshly_harvested"
  },
  {
    id: "inv-peppers-tatashe",
    productId: "fresh-vegetables",
    name: "Tatashe & Scotch Bonnet / Ata Rodo Bag",
    category: "vegetables",
    currentStock: 8,
    unit: "Bags",
    lowStockThreshold: 12,
    reorderLevel: 20,
    unitCost: 9500,
    unitPrice: 13500,
    wholesalePrice: 12000,
    lastRestocked: "Yesterday",
    status: "low_stock",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80",
    batchNumber: "VEG-PEP-0817",
    harvestDate: "Yesterday Morning",
    expiryDate: "5 Days (Best Before Aug 23)",
    shelfLifeDays: 4,
    freshnessStatus: "expiring_soon"
  },
  {
    id: "inv-northern-rams",
    productId: "northern-rams-goats",
    name: "Northern Fat-Tailed Rams (Mature Heavyweight)",
    category: "livestock",
    currentStock: 22,
    unit: "Head",
    lowStockThreshold: 5,
    reorderLevel: 15,
    unitCost: 95000,
    unitPrice: 130000,
    wholesalePrice: 120000,
    lastRestocked: "4 days ago",
    status: "in_stock",
    image: "https://images.unsplash.com/photo-1568644396922-5c3bfae12521?auto=format&fit=crop&w=400&q=80",
    batchNumber: "LIV-RAM-BATCH4",
    harvestDate: "Quarantined & Vet Certified",
    expiryDate: "Grazing Paddock Stock",
    shelfLifeDays: 60,
    freshnessStatus: "optimal"
  },
  {
    id: "inv-farm-goats",
    productId: "northern-rams-goats",
    name: "Red Sokoto & Sahel Farm Goats",
    category: "livestock",
    currentStock: 35,
    unit: "Head",
    lowStockThreshold: 8,
    reorderLevel: 20,
    unitCost: 34000,
    unitPrice: 48000,
    wholesalePrice: 43000,
    lastRestocked: "4 days ago",
    status: "in_stock",
    image: "https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&w=400&q=80",
    batchNumber: "LIV-GOAT-BATCH2",
    harvestDate: "Quarantined & Vet Certified",
    expiryDate: "Grazing Paddock Stock",
    shelfLifeDays: 60,
    freshnessStatus: "optimal"
  }
];

export const initialStaffAccounts: import('../types').StaffMember[] = [
  {
    id: "staff-1",
    fullName: "Abubakar Ibrahim",
    email: "admin@yifafarms.ng",
    role: "admin",
    title: "Farm Managing Director & Founder",
    status: "active",
    phone: "+234 803 000 1234",
    lastLogin: "Today, 08:30 AM",
    createdAt: "2018-05-10T08:00:00.000Z",
    permissions: {
      canManageOrders: true,
      canUpdateDispatch: true,
      canManageInventory: true,
      canViewFinancials: true,
      canManageStaff: true,
      canExportReports: true
    }
  },
  {
    id: "staff-2",
    fullName: "Sanusi Garba",
    email: "staff@yifafarms.ng",
    role: "staff",
    title: "Logistics & Sales Coordinator",
    status: "active",
    phone: "+234 802 111 5678",
    lastLogin: "Today, 07:15 AM",
    createdAt: "2021-03-15T09:30:00.000Z",
    permissions: {
      canManageOrders: true,
      canUpdateDispatch: true,
      canManageInventory: false,
      canViewFinancials: false,
      canManageStaff: false,
      canExportReports: false
    }
  },
  {
    id: "staff-3",
    fullName: "Hauwa Mohammed",
    email: "inventory@yifafarms.ng",
    role: "staff",
    title: "Farm Storekeeper & Quality Supervisor",
    status: "active",
    phone: "+234 809 333 7890",
    lastLogin: "Yesterday, 05:40 PM",
    createdAt: "2022-09-01T10:00:00.000Z",
    permissions: {
      canManageOrders: true,
      canUpdateDispatch: false,
      canManageInventory: true,
      canViewFinancials: false,
      canManageStaff: false,
      canExportReports: false
    }
  }
];

export const initialUnifiedOrders: import('../types').UnifiedOrder[] = [
  {
    id: "YIFA-8421",
    customerName: "Al-Baraka Catering (Hajiya Bilkisu)",
    phone: "+234 803 765 4321",
    whatsapp: "2348037654321",
    email: "bilkisu@albarakacatering.ng",
    customerType: "caterer",
    deliveryAddress: "Plot 14 Barnawa Commercial Hub, Kaduna South",
    items: [
      {
        productId: "fresh-eggs",
        name: "Fresh Farm Eggs (30-Egg Crate)",
        category: "eggs",
        quantity: 30,
        unit: "Crates",
        unitPrice: 3850,
        totalPrice: 115500
      },
      {
        productId: "frozen-chicken",
        name: "Dressed Frozen Chicken (1.8kg Whole Bird)",
        category: "chicken",
        quantity: 15,
        unit: "Birds",
        unitPrice: 4200,
        totalPrice: 63000
      }
    ],
    subtotal: 178500,
    discount: 5000,
    deliveryFee: 3500,
    totalAmount: 177000,
    status: "dispatched",
    paymentStatus: "Commercial Credit",
    paymentMethod: "Bank Transfer (Commercial Invoice Net-7)",
    orderDate: "Today, 06:15 AM",
    estimatedDelivery: "Today between 08:30 AM – 09:30 AM",
    dispatchDriver: "Driver Haruna (Farm Van KD-402-ABJ)",
    vehicleNote: "Insulated Dispatch Van #02 (Refrigerated Compartment Active)",
    stageDescription: "Consignment loaded in cold-insulated farm van. Driver is currently navigating through Kaduna South delivery run.",
    notes: "Requires delivery receipt stamped by Hajiya Bilkisu personally at kitchen bay.",
    source: "storefront",
    createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString()
  },
  {
    id: "YIFA-9304",
    customerName: "Mrs. Grace Adebayo",
    phone: "+234 805 222 9988",
    whatsapp: "2348052229988",
    email: "grace.adebayo@gmail.com",
    customerType: "household",
    deliveryAddress: "No. 8 Gidan Dan Asabe Street, Malali G.R.A., Kaduna North",
    items: [
      {
        productId: "fresh-eggs",
        name: "Fresh Farm Eggs (30-Egg Crate)",
        category: "eggs",
        quantity: 3,
        unit: "Crates",
        unitPrice: 4200,
        totalPrice: 12600
      },
      {
        productId: "fresh-vegetables",
        name: "Fresh Kaduna Tomatoes (Raffia Basket)",
        category: "vegetables",
        quantity: 1,
        unit: "Baskets",
        unitPrice: 8500,
        totalPrice: 8500
      }
    ],
    subtotal: 21100,
    discount: 0,
    deliveryFee: 2000,
    totalAmount: 23100,
    status: "delivered",
    paymentStatus: "Paid",
    paymentMethod: "Direct Bank Transfer",
    orderDate: "Yesterday, 02:40 PM",
    estimatedDelivery: "Delivered at 04:15 PM",
    dispatchDriver: "Courier Musa (Farm Logistics Bike KD-88)",
    vehicleNote: "Express Cold Box Bike #04",
    stageDescription: "Consignment safely handed over at customer gate in Malali. Customer signature recorded.",
    notes: "Call when at security checkpoint.",
    source: "whatsapp",
    createdAt: new Date(Date.now() - 26 * 3600 * 1000).toISOString()
  },
  {
    id: "YIFA-7712",
    customerName: "Savannah Crust & Cake Studio",
    phone: "+234 809 444 1122",
    whatsapp: "2348094441122",
    email: "orders@savannahcrust.ng",
    customerType: "caterer",
    deliveryAddress: "Suite 4, Savannah Plaza, Sabon Tasha High Street, Kaduna",
    items: [
      {
        productId: "fresh-eggs",
        name: "Fresh Farm Eggs (30-Egg Crate)",
        category: "eggs",
        quantity: 50,
        unit: "Crates",
        unitPrice: 3850,
        totalPrice: 192500
      },
      {
        productId: "frozen-chicken-wings",
        name: "Blast-Frozen Broiler Wings (10kg Carton)",
        category: "chicken",
        quantity: 2,
        unit: "Cartons",
        unitPrice: 33500,
        totalPrice: 67000
      }
    ],
    subtotal: 259500,
    discount: 7500,
    deliveryFee: 5000,
    totalAmount: 257000,
    status: "processing",
    paymentStatus: "Paid",
    paymentMethod: "Instant Paystack / Bank Transfer",
    orderDate: "Today, 07:10 AM",
    estimatedDelivery: "Today, Afternoon Run (01:30 PM – 03:00 PM)",
    dispatchDriver: "Assigned: Logistics Team Lead Sanusi",
    vehicleNote: "Medium Freight Truck #01",
    stageDescription: "Egg candling, size sorting, and crate shock-padding in progress at Rigachikun sorting wing.",
    notes: "Chef Kolawole inspecting delivery batch.",
    source: "storefront",
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
  },
  {
    id: "YIFA-6105",
    customerName: "Arewa Delight Bukateria",
    phone: "+234 802 888 3344",
    whatsapp: "2348028883344",
    customerType: "retailer",
    deliveryAddress: "Ungwan Rimi Market Road, Kaduna",
    items: [
      {
        productId: "live-birds-poultry",
        name: "Live Mature Broilers (2.2kg Average)",
        category: "poultry",
        quantity: 40,
        unit: "Birds",
        unitPrice: 3950,
        totalPrice: 158000
      },
      {
        productId: "frozen-chicken",
        name: "Dressed Frozen Chicken (1.5kg Whole Bird)",
        category: "chicken",
        quantity: 20,
        unit: "Birds",
        unitPrice: 4200,
        totalPrice: 84000
      }
    ],
    subtotal: 242000,
    discount: 4000,
    deliveryFee: 4500,
    totalAmount: 242500,
    status: "confirmed",
    paymentStatus: "Cash on Delivery",
    paymentMethod: "Cash on Delivery",
    orderDate: "Today, 08:00 AM",
    estimatedDelivery: "Tomorrow Morning Run (07:00 AM – 08:30 AM)",
    dispatchDriver: "Scheduled Dispatch Unit #03",
    vehicleNote: "Ventilated Coop Transport",
    stageDescription: "Order verified by farm sales desk. Flock allocation confirmed in Pen Unit 03.",
    notes: "Bring weigh scale for verification.",
    source: "storefront",
    createdAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString()
  },
  {
    id: "YIFA-5520",
    customerName: "Grand Central Hotel Kaduna",
    phone: "+234 803 111 7766",
    email: "purchasing@grandcentralhotelkd.com",
    customerType: "hotel",
    deliveryAddress: "Muhammadu Buhari Way, Central Business District, Kaduna",
    items: [
      {
        productId: "aquaculture-catfish",
        name: "Live Table-Size African Catfish",
        category: "fish",
        quantity: 50,
        unit: "kg",
        unitPrice: 3050,
        totalPrice: 152500
      },
      {
        productId: "fresh-eggs",
        name: "Fresh Farm Eggs (30-Egg Crate)",
        category: "eggs",
        quantity: 25,
        unit: "Crates",
        unitPrice: 3850,
        totalPrice: 96250
      }
    ],
    subtotal: 248750,
    discount: 6000,
    deliveryFee: 4000,
    totalAmount: 246750,
    status: "pending",
    paymentStatus: "Pending",
    paymentMethod: "Bank Transfer",
    orderDate: "Today, 09:45 AM",
    estimatedDelivery: "Pending Confirmation",
    stageDescription: "New incoming online order. Awaiting sales desk review.",
    notes: "Requires fresh live fish delivered in aerated tank.",
    source: "storefront",
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  },
  {
    id: "YIFA-4918",
    customerName: "Dr. Farouq Mohammed",
    phone: "+234 803 555 4411",
    customerType: "household",
    deliveryAddress: "House 24, Palm Heights Estate, Millennium City, Kaduna",
    items: [
      {
        productId: "northern-rams-goats",
        name: "Red Sokoto Farm Goat (Live)",
        category: "livestock",
        quantity: 1,
        unit: "Head",
        unitPrice: 48000,
        totalPrice: 48000
      },
      {
        productId: "fresh-eggs",
        name: "Fresh Farm Eggs (30-Egg Crate)",
        category: "eggs",
        quantity: 2,
        unit: "Crates",
        unitPrice: 4200,
        totalPrice: 8400
      }
    ],
    subtotal: 56400,
    discount: 0,
    deliveryFee: 3500,
    totalAmount: 59900,
    status: "delivered",
    paymentStatus: "Paid",
    paymentMethod: "Bank Transfer",
    orderDate: "3 days ago",
    estimatedDelivery: "Delivered",
    dispatchDriver: "Driver Haruna",
    vehicleNote: "Small Cargo Truck #02",
    stageDescription: "Livestock safely delivered and received by customer.",
    notes: "Repeat customer.",
    source: "whatsapp",
    createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString()
  }
];

export const initialNotifications: import('../types').AdminNotification[] = [
  {
    id: "notif-1",
    type: "new_order",
    title: "New Storefront Order Received",
    message: "Grand Central Hotel Kaduna placed an order for 50kg Catfish + 25 Crates Eggs (₦246,750).",
    timestamp: "30 mins ago",
    read: false,
    orderId: "YIFA-5520"
  },
  {
    id: "notif-2",
    type: "low_stock",
    title: "Low Stock Warning: Frozen Broiler Wings",
    message: "Current stock is 14 Cartons, below the 15 Carton minimum threshold.",
    timestamp: "2 hours ago",
    read: false,
    inventoryId: "inv-chicken-portions"
  },
  {
    id: "notif-3",
    type: "status_change",
    title: "Driver Dispatch Update",
    message: "Order YIFA-8421 (Al-Baraka Catering) dispatched with Driver Haruna.",
    timestamp: "3 hours ago",
    read: true,
    orderId: "YIFA-8421"
  }
];

export const initialCustomers: import('../types').CustomerAccount[] = [
  {
    id: "cust-01",
    name: "Hajiya Bilkisu Al-Baraka",
    phone: "+234 802 333 4455",
    email: "bilkisu@albarakacatering.ng",
    customerType: "caterer",
    address: "Plot 12, Sultan Road, Barnawa G.R.A., Kaduna South",
    savedAddresses: [
      "Plot 12, Sultan Road, Barnawa G.R.A., Kaduna South",
      "Barnawa Event Center Kitchen Dock, Kaduna"
    ],
    ordersCount: 8,
    totalSpent: 1845000,
    loyaltyTier: "Platinum",
    loyaltyPoints: 1845,
    notes: "High-volume commercial event caterer. Prefers morning 7:30 AM dispatch.",
    lastOrderDate: "Today",
    createdAt: "2024-03-15"
  },
  {
    id: "cust-02",
    name: "Grand Central Hotel Kaduna",
    phone: "+234 803 111 7766",
    email: "purchasing@grandcentralhotelkd.com",
    customerType: "hotel",
    address: "Muhammadu Buhari Way, Central Business District, Kaduna",
    savedAddresses: [
      "Muhammadu Buhari Way, Central Business District, Kaduna",
      "Grand Central Chef Receiving Bay 2, Kaduna"
    ],
    ordersCount: 12,
    totalSpent: 2650000,
    loyaltyTier: "Platinum",
    loyaltyPoints: 2650,
    notes: "Requires fresh live fish delivered in aerated tanks.",
    lastOrderDate: "Today",
    createdAt: "2024-01-10"
  },
  {
    id: "cust-03",
    name: "Mrs. Grace Adebayo",
    phone: "+234 805 222 9988",
    email: "grace.adebayo@gmail.com",
    customerType: "household",
    address: "No. 8 Gidan Dan Asabe Street, Malali G.R.A., Kaduna North",
    savedAddresses: [
      "No. 8 Gidan Dan Asabe Street, Malali G.R.A., Kaduna North"
    ],
    ordersCount: 5,
    totalSpent: 115000,
    loyaltyTier: "Silver",
    loyaltyPoints: 345,
    notes: "Family order. Prefers crate eggs and freshly harvested tomatoes.",
    lastOrderDate: "Yesterday",
    createdAt: "2024-06-20"
  },
  {
    id: "cust-04",
    name: "Savannah Crust & Cake Studio",
    phone: "+234 809 444 1122",
    email: "orders@savannahcrust.ng",
    customerType: "caterer",
    address: "Suite 4, Savannah Plaza, Sabon Tasha High Street, Kaduna",
    savedAddresses: [
      "Suite 4, Savannah Plaza, Sabon Tasha High Street, Kaduna"
    ],
    ordersCount: 9,
    totalSpent: 780000,
    loyaltyTier: "Gold",
    loyaltyPoints: 1120,
    notes: "Bakery with bi-weekly egg supply contract.",
    lastOrderDate: "Yesterday",
    createdAt: "2024-04-05"
  },
  {
    id: "cust-05",
    name: "Dr. Farouq Mohammed",
    phone: "+234 803 555 4411",
    email: "dr.farouq.m@yahoo.com",
    customerType: "household",
    address: "House 24, Palm Heights Estate, Millennium City, Kaduna",
    savedAddresses: [
      "House 24, Palm Heights Estate, Millennium City, Kaduna"
    ],
    ordersCount: 4,
    totalSpent: 290000,
    loyaltyTier: "Silver",
    loyaltyPoints: 580,
    notes: "Orders northern rams and layer eggs for home pantry.",
    lastOrderDate: "3 days ago",
    createdAt: "2024-07-01"
  }
];

export const initialSuppliers: import('../types').Supplier[] = [
  {
    id: "sup-01",
    name: "Grand Cereals & Feeds Kaduna Ltd",
    category: "Poultry & Fish Feeds",
    contactPerson: "Alhaji Lawal Danbaba",
    phone: "+234 803 700 8899",
    email: "sales.kaduna@grandcereals.com",
    address: "Kudenda Industrial Estate, Kaduna South, Kaduna State",
    itemsSupplied: ["Layer Mash (50kg)", "Broiler Starter & Finisher", "Floating Catfish Pellets 4mm/6mm"],
    status: "active",
    rating: 4.9
  },
  {
    id: "sup-02",
    name: "Northern Day-Old Chicks Hatchery",
    category: "Chicks & Genetics",
    contactPerson: "Dr. Joshua Auta",
    phone: "+234 806 333 1122",
    email: "orders@northernchicks.ng",
    address: "Zaria Agro-Hatchery Hub, Zaria Road, Kaduna State",
    itemsSupplied: ["Day-old Arbor Acres Broilers", "Black Harco & Isa Brown Layers"],
    status: "active",
    rating: 4.8
  },
  {
    id: "sup-03",
    name: "Kaduna Agro Packs & Egg Crates",
    category: "Packaging & Crates",
    contactPerson: "Mal. Usman Sani",
    phone: "+234 802 888 3344",
    email: "sales@kadunapackaging.com",
    address: "Nnamdi Azikiwe Bypass, Kakuri Industrial Area, Kaduna",
    itemsSupplied: ["Molded Pulp 30-Egg Paper Crates", "Master Carton Boxes", "Ventilated Raffia Sacks"],
    status: "active",
    rating: 4.7
  },
  {
    id: "sup-04",
    name: "Animal Care Vet Supplies & Vaccines",
    category: "Medication & Bio-Security",
    contactPerson: "Dr. Aisha Bello",
    phone: "+234 803 222 6677",
    email: "kaduna.branch@animalcarevet.com",
    address: "Ali Akilu Road, Kaduna North, Kaduna State",
    itemsSupplied: ["Newcastle & Gumboro Vaccines", "Electrolytes & Multivitamins", "Bio-degradable Sanitizers"],
    status: "active",
    rating: 5.0
  }
];

export const initialPurchaseOrders: import('../types').PurchaseOrder[] = [
  {
    id: "PO-2024-089",
    poNumber: "PO-2024-089",
    supplierId: "sup-01",
    supplierName: "Grand Cereals & Feeds Kaduna Ltd",
    items: [
      { name: "Layer Super Mash (50kg)", quantity: 60, unit: "Bags", unitCost: 18500, totalCost: 1110000, productId: "fresh-eggs" },
      { name: "Broiler Finisher Crumbles (50kg)", quantity: 40, unit: "Bags", unitCost: 19800, totalCost: 792000, productId: "live-birds-poultry" }
    ],
    totalCost: 1902000,
    status: "received",
    orderDate: "2024-08-12",
    expectedDeliveryDate: "2024-08-14",
    receivedDate: "2024-08-14",
    notes: "Delivered to Feed Barn Warehouse #1. Batch certified."
  },
  {
    id: "PO-2024-094",
    poNumber: "PO-2024-094",
    supplierId: "sup-03",
    supplierName: "Kaduna Agro Packs & Egg Crates",
    items: [
      { name: "Molded Pulp Paper Crates (30-Egg)", quantity: 2000, unit: "Pcs", unitCost: 120, totalCost: 240000, productId: "fresh-eggs" },
      { name: "Master 12-Crate Outer Cartons", quantity: 150, unit: "Pcs", unitCost: 950, totalCost: 142500 }
    ],
    totalCost: 382500,
    status: "ordered",
    orderDate: "2024-08-17",
    expectedDeliveryDate: "Tomorrow",
    notes: "Expected delivery via Kaduna South truck."
  }
];

export const initialActivityLogs: import('../types').ActivityLog[] = [
  {
    id: "act-01",
    actorName: "Abubakar Ibrahim",
    actorRole: "admin",
    actionType: "order_status",
    description: "Updated order #YIFA-8421 (Al-Baraka Catering) status to 'Dispatched & En Route' (Assigned Driver Haruna).",
    timestamp: "Today, 09:30 AM",
    orderId: "YIFA-8421"
  },
  {
    id: "act-02",
    actorName: "Fatima Aliyu",
    actorRole: "staff",
    actionType: "order_create",
    description: "Recorded new walk-in farm gate order #YIFA-9304 for Mrs. Grace Adebayo (₦23,100).",
    timestamp: "Yesterday, 02:40 PM",
    orderId: "YIFA-9304"
  },
  {
    id: "act-03",
    actorName: "Abubakar Ibrahim",
    actorRole: "admin",
    actionType: "inventory_update",
    description: "Received morning harvest batch: +150 Crates of Fresh Eggs into Warehouse A.",
    timestamp: "Today, 06:00 AM",
    targetId: "inv-fresh-eggs"
  },
  {
    id: "act-04",
    actorName: "Abubakar Ibrahim",
    actorRole: "admin",
    actionType: "supplier_po",
    description: "Issued Purchase Order PO-2024-094 to Kaduna Agro Packs & Egg Crates for ₦382,500.",
    timestamp: "Yesterday, 04:15 PM",
    targetId: "PO-2024-094"
  }
];

export const initialAutomatedNotifications: import('../types').AutomatedNotificationLog[] = [
  {
    id: "anotif-01",
    orderId: "YIFA-8421",
    customerName: "Hajiya Bilkisu Al-Baraka",
    channel: "sms",
    type: "dispatched",
    recipient: "+234 802 333 4455",
    message: "YIFA Farms Update: Your order #YIFA-8421 has been dispatched with Driver Haruna (Cold Van #01). Track delivery at https://yifafarms.ng/#track",
    sentAt: "Today, 09:31 AM",
    status: "delivered"
  },
  {
    id: "anotif-02",
    orderId: "YIFA-5520",
    customerName: "Grand Central Hotel Kaduna",
    channel: "email",
    type: "order_confirmed",
    recipient: "purchasing@grandcentralhotelkd.com",
    message: "Your purchase order #YIFA-5520 for 50kg Catfish and 25 Crates Eggs is confirmed. Expected delivery scheduled.",
    sentAt: "Today, 09:48 AM",
    status: "sent"
  }
];




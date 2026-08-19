import { useEffect } from 'react';
import { PageType } from '../types';
import { useFarmConfig } from '../context/FarmConfigContext';

interface PageMetaConfig {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
}

const PAGE_META_MAP: Record<PageType, PageMetaConfig> = {
  home: {
    title: 'YIFA Farms | Quality Food. Grown with Purpose. — Kaduna, Nigeria',
    description:
      'Fresh poultry, quality eggs, aquaculture fish, Northern rams, goats, and crisp vegetables directly from YIFA Farms in Kaduna, Nigeria. Founded by Abubakar Ibrahim.',
    ogTitle: 'YIFA Farms — Fresh From Our Farm. Trusted By Your Family.',
    ogDescription:
      'Leading agricultural brand in Kaduna, Nigeria. Farm-fresh eggs, poultry, catfish, livestock, and vegetables with dependable local supply.'
  },
  products: {
    title: 'Farm Products & Livestock Catalog | YIFA Farms Kaduna',
    description:
      'Browse our fresh 30-egg crates, dressed broilers, live catfish, Northern rams, farm goats, and field-fresh Kaduna vegetables with live specifications and pricing.',
    ogTitle: 'Farm Products & Live Catalog — YIFA Farms Kaduna',
    ogDescription:
      'Order fresh table eggs, blast-frozen chicken, live aquaculture fish, and healthy livestock directly from Kaduna farm gate.'
  },
  quote: {
    title: 'Instant Order & Quote Calculator | YIFA Farms Kaduna',
    description:
      'Configure custom produce orders, preview wholesale volume discounts, generate instant WhatsApp invoices, or secure commercial supply allocations in Kaduna.',
    ogTitle: 'Instant Quote & Order Builder — YIFA Farms Kaduna',
    ogDescription:
      'Calculate farm produce pricing in seconds with direct WhatsApp order routing and invoice generation.'
  },
  track: {
    title: 'Track Order & Delivery Status | YIFA Farms Logistics',
    description:
      'Track your Kaduna dispatch in real time. Enter your invoice number to check live order confirmation, quality batching, and driver delivery updates.',
    ogTitle: 'Live Order Tracking & Dispatch — YIFA Farms Kaduna',
    ogDescription:
      'Real-time delivery status lookup for Kaduna commercial customers, caterers, and families.'
  },
  facilities: {
    title: 'Farm Facilities & Agribusiness Heritage | YIFA Farms Kaduna',
    description:
      'Founded in 2018 by Abubakar Ibrahim. Explore our biosecure poultry housing, automated egg sorting, deep-well borehole irrigation, and Kaduna distribution network.',
    ogTitle: 'Farm Facilities & Infrastructure — YIFA Farms Kaduna',
    ogDescription:
      'Tour our modern agricultural infrastructure, biosecure pens, and sustainable farming systems in Kaduna.'
  },
  'why-us': {
    title: 'Why Choose Us & Customer Reviews | YIFA Farms Kaduna',
    description:
      'See why top Kaduna caterers, supermarkets, and families trust YIFA Farms. Zero hormonal additives, strict biosecurity, and verified customer testimonials.',
    ogTitle: 'Why Choose YIFA Farms — Verified Kaduna Reviews',
    ogDescription:
      'Read testimonials from local Kaduna restaurants, caterers, and households who rely on our weekly fresh supply.'
  },
  gallery: {
    title: 'Farm Visual Tour & Photo Album | YIFA Farms Kaduna',
    description:
      'Visual insights into daily farm operations, flock rearing, fresh harvests, and hygienic packaging at our Kaduna agricultural facility.',
    ogTitle: 'Farm Visual Tour — YIFA Farms Kaduna',
    ogDescription:
      'High-resolution photographic tour of YIFA Farms poultry, aquaculture, livestock, and crop operations.'
  },
  contact: {
    title: 'Contact Us & Farm Location | YIFA Farms Kaduna',
    description:
      'Visit our farm in Kaduna, Nigeria. Connect with our sales desk, chat on WhatsApp, check business hours, or request scheduled commercial delivery.',
    ogTitle: 'Contact YIFA Farms — Kaduna, Nigeria',
    ogDescription:
      'Get in touch with Abubakar Ibrahim and the YIFA Farms team for inquiries, bulk orders, and farm gate visits.'
  },
  admin: {
    title: 'Admin Management & Dispatch Dashboard | YIFA Farms Kaduna',
    description:
      'Secure operational hub for live order tracking, inventory management, sales reporting, and logistics dispatch at YIFA Farms Kaduna.',
    ogTitle: 'Operations & Dispatch Dashboard — YIFA Farms Kaduna',
    ogDescription:
      'Internal management portal for order fulfillment, real-time inventory levels, and logistics dispatch.'
  }
};

/**
 * Helper to update or create a meta tag by name or property attribute.
 */
function updateMetaTag(attributeName: 'name' | 'property', attributeValue: string, content: string) {
  let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attributeName, attributeValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

/**
 * Custom hook to dynamically update document title and meta tags based on active PageType.
 */
export function usePageMeta(currentPage: PageType, customOverrides?: Partial<PageMetaConfig>) {
  const { config } = useFarmConfig();

  useEffect(() => {
    const meta = {
      ...PAGE_META_MAP[currentPage],
      ...customOverrides
    };

    if (!meta) return;

    // 1. Update Document Title
    document.title = meta.title;

    // 2. Update Standard Meta Description
    updateMetaTag('name', 'description', meta.description);

    // 3. Update OpenGraph Meta Tags
    updateMetaTag('property', 'og:title', meta.ogTitle || meta.title);
    updateMetaTag('property', 'og:description', meta.ogDescription || meta.description);
    updateMetaTag('property', 'og:type', 'website');

    // 4. Update Twitter Card Meta Tags
    updateMetaTag('name', 'twitter:card', 'summary_large_image');
    updateMetaTag('name', 'twitter:title', meta.ogTitle || meta.title);
    updateMetaTag('name', 'twitter:description', meta.ogDescription || meta.description);
  }, [currentPage, customOverrides, config.farmName, config.founderName, config.locationCity]);
}

export default usePageMeta;

import React, { useState, useEffect } from 'react';
import { FarmConfigProvider, useFarmConfig } from './context/FarmConfigContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { HomeOverviewHub } from './components/HomeOverviewHub';
import { AboutSection } from './components/AboutSection';
import { ProductsSection } from './components/ProductsSection';
import { FarmFacilitiesSection } from './components/FarmFacilitiesSection';
import { WhyChooseUs } from './components/WhyChooseUs';
import { WhoWeSupply } from './components/WhoWeSupply';
import { GallerySection } from './components/GallerySection';
import { QuoteCalculator } from './components/QuoteCalculator';
import { OrderStatusSection } from './components/OrderStatusSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ClientConfigModal } from './components/ClientConfigModal';
import { StickyMobileBar } from './components/StickyMobileBar';
import { PageHeaderBanner } from './components/PageHeaderBanner';
import { LoyaltyModal } from './components/LoyaltyModal';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminLayout } from './components/admin/AdminLayout';
import { PageType, ProductItem } from './types';
import { usePageMeta } from './hooks/usePageMeta';

export function AppContent() {
  const { currentStaffUser } = useFarmConfig();
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [quoteInitialProduct, setQuoteInitialProduct] = useState<string>('Fresh Farm Eggs (30-Egg Crate)');
  const [quoteInitialCategory, setQuoteInitialCategory] = useState<string>('Eggs');
  const [isLoyaltyModalOpen, setIsLoyaltyModalOpen] = useState<boolean>(false);

  // Dynamically update document title and meta description tags based on currentPage
  usePageMeta(currentPage);

  // Sync with URL Hash on Mount and HashChange
  useEffect(() => {
    const parseHash = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (hash === 'products') setCurrentPage('products');
      else if (hash === 'quote' || hash === 'order' || hash === 'quote-section') setCurrentPage('quote');
      else if (hash === 'track' || hash === 'order-status' || hash === 'orders') setCurrentPage('track');
      else if (hash === 'facilities' || hash === 'about' || hash === 'farm') setCurrentPage('facilities');
      else if (hash === 'why-us' || hash === 'why' || hash === 'reviews') setCurrentPage('why-us');
      else if (hash === 'gallery' || hash === 'photos') setCurrentPage('gallery');
      else if (hash === 'contact' || hash === 'location') setCurrentPage('contact');
      else if (hash === 'admin' || hash === 'portal' || hash === 'staff' || hash === 'dashboard') setCurrentPage('admin');
      else if (hash === 'home' || hash === '') setCurrentPage('home');
    };

    parseHash();
    window.addEventListener('hashchange', parseHash);
    return () => window.removeEventListener('hashchange', parseHash);
  }, []);

  const navigateToPage = (page: PageType, optionalParams?: { category?: string; product?: string }) => {
    setCurrentPage(page);
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (optionalParams?.category) {
      setSelectedCategoryFilter(optionalParams.category);
    }
  };

  const handleOpenQuote = (productName?: string, categoryName?: string) => {
    if (productName) setQuoteInitialProduct(productName);
    if (categoryName) setQuoteInitialCategory(categoryName);
    navigateToPage('quote');
  };

  const handleHeroSelectCategory = (cat: string) => {
    setSelectedCategoryFilter(cat);
    navigateToPage('products', { category: cat });
  };

  const handleProductSelectForQuote = (product: ProductItem) => {
    let cat = 'Eggs';
    if (product.category === 'chicken') cat = 'Frozen Chicken';
    else if (product.category === 'vegetables') cat = 'Vegetables';
    else if (product.category === 'poultry') cat = 'Live Poultry';
    else if (product.category === 'fish') cat = 'Fish';
    else if (product.category === 'livestock') cat = 'Rams & Goats';

    handleOpenQuote(product.name, cat);
  };

  const handleSegmentQuote = (segmentTitle: string) => {
    handleOpenQuote(`Supply Contract for ${segmentTitle}`, 'Bulk Order');
  };

  const handleHarvestNoticeClick = () => {
    handleOpenQuote('Fresh Farm Eggs (30-Egg Crate)', 'Eggs');
  };

  // If viewing Admin Page, render dedicated Operations Portal
  if (currentPage === 'admin') {
    if (!currentStaffUser) {
      return <AdminLogin onBackToStorefront={() => navigateToPage('home')} />;
    }
    return <AdminLayout onBackToStorefront={() => navigateToPage('home')} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#071810] text-[#FDFBF5]">
      {/* Top Bar Navigation */}
      <Header
        currentPage={currentPage}
        onNavigate={navigateToPage}
        onOpenQuote={() => handleOpenQuote()}
        onOpenHarvestNotice={handleHarvestNoticeClick}
      />

      {/* Main Page Rendering Area */}
      <main className="flex-grow">
        {/* PAGE 1: HOME */}
        {currentPage === 'home' && (
          <div className="animate-fadeIn">
            <Hero
              onNavigate={navigateToPage}
              onOpenQuote={() => handleOpenQuote()}
              onSelectCategory={handleHeroSelectCategory}
            />
            <HomeOverviewHub
              onNavigate={navigateToPage}
              onOpenLoyalty={() => setIsLoyaltyModalOpen(true)}
            />
          </div>
        )}

        {/* PAGE 2: PRODUCTS */}
        {currentPage === 'products' && (
          <div className="animate-fadeIn">
            <PageHeaderBanner
              title="Farm Products & Livestock"
              subtitle="Browse our freshly gathered table eggs, dressed poultry, aquaculture catfish, Northern rams, and field vegetables with live specifications."
              badge="Our Catalog"
              currentPage={currentPage}
              onNavigate={navigateToPage}
            />
            <ProductsSection
              selectedCategoryFilter={selectedCategoryFilter}
              onSelectForQuote={handleProductSelectForQuote}
              onOpenBulkInquiry={() => handleOpenQuote('Commercial Wholesale Allocation', 'Bulk Order')}
            />
          </div>
        )}

        {/* PAGE 3: FACILITIES & HERITAGE */}
        {currentPage === 'facilities' && (
          <div className="animate-fadeIn">
            <PageHeaderBanner
              title="Farm Facilities & Agribusiness Heritage"
              subtitle="Founded in 2018 by Abubakar Ibrahim. Explore our biosecure poultry housing, egg grading station, borehole irrigation, and client supply distribution."
              badge="Our Infrastructure"
              currentPage={currentPage}
              onNavigate={navigateToPage}
            />
            <AboutSection />
            <FarmFacilitiesSection />
            <WhoWeSupply onSelectSegmentQuote={handleSegmentQuote} />
          </div>
        )}

        {/* PAGE 4: WHY CHOOSE US & REVIEWS */}
        {currentPage === 'why-us' && (
          <div className="animate-fadeIn">
            <PageHeaderBanner
              title="Why Choose YIFA Farms"
              subtitle="Strict sanitary management, zero hormonal additives, same-day Kaduna delivery, and reviews from local caterers and families."
              badge="Quality & Trust"
              currentPage={currentPage}
              onNavigate={navigateToPage}
            />
            <WhyChooseUs />
            <WhoWeSupply onSelectSegmentQuote={handleSegmentQuote} />
          </div>
        )}

        {/* PAGE 5: PHOTO GALLERY */}
        {currentPage === 'gallery' && (
          <div className="animate-fadeIn">
            <PageHeaderBanner
              title="Farm Visual Tour"
              subtitle="Visual insights into daily farm operations, flock rearing, fresh harvests, and hygienic packaging at our Kaduna facility."
              badge="Photo Album"
              currentPage={currentPage}
              onNavigate={navigateToPage}
            />
            <GallerySection />
          </div>
        )}

        {/* PAGE 6: ORDER / REQUEST QUOTE */}
        {currentPage === 'quote' && (
          <div className="animate-fadeIn">
            <PageHeaderBanner
              title="Instant Order & Quote Calculator"
              subtitle="Configure your farm produce order, preview volume rates, generate instant WhatsApp invoices, or request commercial wholesale allocations."
              badge="Order Direct"
              currentPage={currentPage}
              onNavigate={navigateToPage}
            />
            <QuoteCalculator
              initialProduct={quoteInitialProduct}
              initialCategory={quoteInitialCategory}
              onNavigate={navigateToPage}
            />
          </div>
        )}

        {/* PAGE 7: ORDER STATUS & TRACKING */}
        {currentPage === 'track' && (
          <div className="animate-fadeIn">
            <PageHeaderBanner
              title="Order Status & Delivery Lookup"
              subtitle="Track your Kaduna dispatch in real time. Enter your invoice number to check live order stages and driver dispatch updates."
              badge="Live Logistics"
              currentPage={currentPage}
              onNavigate={navigateToPage}
            />
            <OrderStatusSection />
          </div>
        )}

        {/* PAGE 8: CONTACT US */}
        {currentPage === 'contact' && (
          <div className="animate-fadeIn">
            <PageHeaderBanner
              title="Contact YIFA Farms"
              subtitle="Visit our farm in Kaduna, connect with our sales team, chat on WhatsApp, or send direct order inquiries."
              badge="Kaduna Office"
              currentPage={currentPage}
              onNavigate={navigateToPage}
            />
            <ContactSection onOpenQuote={() => handleOpenQuote()} />
          </div>
        )}
      </main>

      {/* Global Footer with Page Navigators */}
      <Footer
        currentPage={currentPage}
        onNavigate={navigateToPage}
      />

      {/* Sticky Mobile Bottom Navigation Bar */}
      <StickyMobileBar
        currentPage={currentPage}
        onNavigate={navigateToPage}
        onOpenQuote={() => handleOpenQuote()}
      />

      {/* Loyalty Rewards Modal */}
      <LoyaltyModal
        isOpen={isLoyaltyModalOpen}
        onClose={() => setIsLoyaltyModalOpen(false)}
        onOpenQuote={() => {
          setIsLoyaltyModalOpen(false);
          handleOpenQuote();
        }}
      />

      {/* Interactive Client Asset & Data Customizer */}
      <ClientConfigModal />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <FarmConfigProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </FarmConfigProvider>
    </ThemeProvider>
  );
}



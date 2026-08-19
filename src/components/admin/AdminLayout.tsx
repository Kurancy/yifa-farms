import React, { useState } from 'react';
import { useFarmConfig } from '../../context/FarmConfigContext';
import { UnifiedOrder } from '../../types';
import { YifaLogo } from '../YifaLogo';
import { AdminDashboardOverview } from './AdminDashboardOverview';
import { AdminOrdersPage } from './AdminOrdersPage';
import { AdminInventoryPage } from './AdminInventoryPage';
import { AdminCustomersPage } from './AdminCustomersPage';
import { AdminSuppliersPage } from './AdminSuppliersPage';
import { AdminReportsPage } from './AdminReportsPage';
import { AdminStaffPage } from './AdminStaffPage';
import { AdminActivityLogPage } from './AdminActivityLogPage';
import { AdminOrderModal } from './AdminOrderModal';
import { AdminOrderDetailModal } from './AdminOrderDetailModal';
import { AdminNotificationsPopover } from './AdminNotificationsPopover';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  TrendingUp,
  Users,
  LogOut,
  Bell,
  ExternalLink,
  ShieldCheck,
  Menu,
  X,
  Volume2,
  VolumeX,
  Truck,
  History,
  Plus
} from 'lucide-react';

interface AdminLayoutProps {
  onBackToStorefront: () => void;
}

export type AdminTab = 'overview' | 'orders' | 'inventory' | 'customers' | 'suppliers' | 'reports' | 'staff' | 'logs';

export const AdminLayout: React.FC<AdminLayoutProps> = ({ onBackToStorefront }) => {
  const {
    currentStaffUser,
    logoutStaff,
    unreadNotificationsCount,
    lowStockCount,
    soundEnabled,
    toggleSound
  } = useFarmConfig();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [selectedOrderForDetail, setSelectedOrderForDetail] = useState<UnifiedOrder | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const handleSelectOrder = (order: UnifiedOrder) => {
    setSelectedOrderForDetail(order);
  };

  const navItems = [
    { id: 'overview' as AdminTab, label: 'Overview', icon: LayoutDashboard },
    { id: 'orders' as AdminTab, label: 'Orders & Dispatch', icon: ShoppingBag, badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined },
    { id: 'inventory' as AdminTab, label: 'Inventory & Stock', icon: Package, badge: lowStockCount > 0 ? `${lowStockCount} Low` : undefined, badgeColor: 'bg-amber-500 text-black' },
    { id: 'customers' as AdminTab, label: 'Customers & Loyalty', icon: Users },
    { id: 'suppliers' as AdminTab, label: 'Suppliers & POs', icon: Truck },
    { id: 'reports' as AdminTab, label: 'Sales Reports', icon: TrendingUp },
    { id: 'staff' as AdminTab, label: 'Staff & Roles', icon: ShieldCheck },
    { id: 'logs' as AdminTab, label: 'Activity Logs', icon: History }
  ];

  return (
    <div className="min-h-screen bg-[#071810] text-[#FDFBF5] flex flex-col font-sans relative">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#0D2B1D] border-b border-white/10 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left: Brand & Portal Badge */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-xl text-[#FDFBF5]/70 hover:text-white hover:bg-white/5 lg:hidden cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('overview')}>
                <YifaLogo variant="icon" size="sm" />
                <div>
                  <div className="text-sm font-black text-white tracking-wider flex items-center gap-2">
                    <span>YIFA FARMS</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 uppercase font-mono font-bold hidden sm:inline-block">
                      Operations Admin
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer relative ${
                      isActive
                        ? 'bg-[#D4AF37] text-[#0D2B1D] shadow-md font-black'
                        : 'text-[#FDFBF5]/70 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                    {item.badge !== undefined && (
                      <span
                        className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono font-black ${
                          item.badgeColor || 'bg-rose-500 text-white animate-pulse'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right: Actions, Sound, Notifications, User */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Sound Notifications Toggle */}
              <button
                onClick={toggleSound}
                className={`p-2 rounded-xl border text-xs transition-colors cursor-pointer ${
                  soundEnabled
                    ? 'bg-white/5 border-white/10 text-emerald-400 hover:bg-white/10'
                    : 'bg-white/5 border-white/10 text-[#FDFBF5]/40 hover:bg-white/10'
                }`}
                title={soundEnabled ? 'Order Audio Chime Active' : 'Audio Chimes Muted'}
                aria-label={soundEnabled ? 'Mute sound alerts' : 'Enable sound alerts'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* Notifications Popover Trigger */}
              <div className="relative">
                <button
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="p-2 rounded-xl bg-white/5 border border-white/10 text-[#FDFBF5]/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer relative"
                  aria-label="Order notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-mono text-[9px] font-bold flex items-center justify-center animate-bounce">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </button>

                <AdminNotificationsPopover
                  isOpen={isNotificationsOpen}
                  onClose={() => setIsNotificationsOpen(false)}
                  onSelectOrder={(order) => {
                    setSelectedOrderForDetail(order);
                    setIsNotificationsOpen(false);
                  }}
                />
              </div>

              {/* Back to Public Storefront */}
              <button
                onClick={onBackToStorefront}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#FDFBF5]/80 hover:text-white text-xs font-semibold border border-white/10 transition-all cursor-pointer"
                title="View customer storefront"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Storefront</span>
              </button>

              {/* User Profile & Logout */}
              <div className="flex items-center gap-2 pl-2 border-l border-white/10">
                <div className="hidden md:block text-right">
                  <div className="text-xs font-bold text-white leading-tight">
                    {currentStaffUser?.fullName || 'Staff Member'}
                  </div>
                  <div className="text-[10px] text-[#D4AF37] uppercase font-mono tracking-wider">
                    {currentStaffUser?.role === 'admin' ? 'Administrator' : 'Fulfillment Officer'}
                  </div>
                </div>

                <button
                  onClick={logoutStaff}
                  className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-colors cursor-pointer"
                  title="Sign out of Operations Console"
                  aria-label="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Mobile Slide-down Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="xl:hidden bg-[#071810] border-b border-white/10 px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#D4AF37] text-[#0D2B1D] font-black'
                      : 'text-[#FDFBF5]/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-black ${
                        item.badgeColor || 'bg-rose-500 text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            <div className="pt-2 border-t border-white/10 flex justify-between items-center text-xs">
              <button
                onClick={onBackToStorefront}
                className="text-[#D4AF37] font-semibold flex items-center gap-1.5 py-1"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Return to Live Storefront</span>
              </button>
              <button
                onClick={logoutStaff}
                className="text-rose-400 font-semibold flex items-center gap-1.5 py-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'overview' && (
          <AdminDashboardOverview
            onNavigate={(tab) => setActiveTab(tab as AdminTab)}
            onSelectOrder={handleSelectOrder}
            onOpenNewOrderModal={() => setIsNewOrderModalOpen(true)}
          />
        )}

        {activeTab === 'orders' && (
          <AdminOrdersPage
            onOpenNewOrderModal={() => setIsNewOrderModalOpen(true)}
            onSelectOrder={handleSelectOrder}
          />
        )}

        {activeTab === 'inventory' && <AdminInventoryPage />}

        {activeTab === 'customers' && <AdminCustomersPage />}

        {activeTab === 'suppliers' && <AdminSuppliersPage />}

        {activeTab === 'reports' && <AdminReportsPage />}

        {activeTab === 'staff' && <AdminStaffPage />}

        {activeTab === 'logs' && <AdminActivityLogPage />}
      </main>

      {/* Modal: New Walk-in / Phone Order */}
      <AdminOrderModal
        isOpen={isNewOrderModalOpen}
        onClose={() => setIsNewOrderModalOpen(false)}
      />

      {/* Modal / Drawer: Order Dispatch & Invoice Details */}
      <AdminOrderDetailModal
        order={selectedOrderForDetail}
        isOpen={!!selectedOrderForDetail}
        onClose={() => setSelectedOrderForDetail(null)}
      />

    </div>
  );
};

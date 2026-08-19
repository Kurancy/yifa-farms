import React, { useState } from 'react';
import { useFarmConfig } from '../../context/FarmConfigContext';
import { UnifiedOrder } from '../../types';
import { YifaLogo } from '../YifaLogo';
import { AdminDashboardOverview } from './AdminDashboardOverview';
import { AdminOrdersPage } from './AdminOrdersPage';
import { AdminInventoryPage } from './AdminInventoryPage';
import { AdminInquiriesInbox } from './AdminInquiriesInbox';
import { AdminCustomersPage } from './AdminCustomersPage';
import { AdminSuppliersPage } from './AdminSuppliersPage';
import { AdminReportsPage } from './AdminReportsPage';
import { AdminStaffPage } from './AdminStaffPage';
import { AdminActivityLogPage } from './AdminActivityLogPage';
import { AdminOrderModal } from './AdminOrderModal';
import { AdminOrderDetailModal } from './AdminOrderDetailModal';
import { AdminNotificationsPopover } from './AdminNotificationsPopover';
import { ThemeToggle } from '../ThemeToggle';
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
  Plus,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Store,
  Sparkles,
  BarChart3,
  Calendar
} from 'lucide-react';

interface AdminLayoutProps {
  onBackToStorefront: () => void;
}

export type AdminTab =
  | 'overview'
  | 'orders'
  | 'inventory'
  | 'inquiries'
  | 'customers'
  | 'suppliers'
  | 'reports'
  | 'staff'
  | 'logs';

export const AdminLayout: React.FC<AdminLayoutProps> = ({ onBackToStorefront }) => {
  const {
    currentStaffUser,
    logoutStaff,
    unreadNotificationsCount,
    unreadInquiriesCount,
    lowStockCount,
    salesMetrics,
    soundEnabled,
    toggleSound
  } = useFarmConfig();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState<boolean>(false);
  const [selectedOrderForDetail, setSelectedOrderForDetail] = useState<UnifiedOrder | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);

  // Dynamic Page Meta Header based on activeTab
  const getTabHeaderInfo = (tab: AdminTab) => {
    switch (tab) {
      case 'overview':
        return {
          title: 'Farm Performance Overview',
          subtitle: 'Kaduna Operations Live Feed • Real-Time Metrics & Dispatch Activity'
        };
      case 'orders':
        return {
          title: 'Orders & Cold-Chain Dispatch',
          subtitle: 'Live Customer Consignments, Delivery Manifests & Waybills'
        };
      case 'inventory':
        return {
          title: 'Inventory & Cold Storage',
          subtitle: 'Real-Time Stock Levels, Batch Tracking & Restock Triggers'
        };
      case 'inquiries':
        return {
          title: 'Customer Inquiries & WhatsApp Leads',
          subtitle: 'Commercial Inquiries, Quote Requests & Direct Farm Chats'
        };
      case 'reports':
        return {
          title: 'Sales Analytics & Revenue Reports',
          subtitle: 'Period-over-Period Performance, Category Volume & Executive Exports'
        };
      case 'customers':
        return {
          title: 'Customers & Loyalty Hub',
          subtitle: 'Wholesale Accounts, Caterers & Farm Club Reward Points'
        };
      case 'suppliers':
        return {
          title: 'Suppliers & Purchase Orders',
          subtitle: 'Feed Millers, Hatcheries, Veterinary & Packaging Vendors'
        };
      case 'staff':
        return {
          title: 'Staff & Role-Based Access Control',
          subtitle: 'Personnel Permissions, Farm Roles & Security Audit'
        };
      case 'logs':
        return {
          title: 'System Activity Logs',
          subtitle: 'Immutable Operational Audit Trail & Verification Logs'
        };
      default:
        return {
          title: 'YIFA Operations Portal',
          subtitle: 'Kaduna Farm Logistics & Real-Time Sync'
        };
    }
  };

  const headerInfo = getTabHeaderInfo(activeTab);

  // Grouped Navigation Structure
  const navigationGroups = [
    {
      label: 'Overview',
      items: [
        {
          id: 'overview' as AdminTab,
          label: 'Dashboard Overview',
          shortLabel: 'Overview',
          icon: LayoutDashboard,
          badge: null
        }
      ]
    },
    {
      label: 'Sales & Logistics',
      items: [
        {
          id: 'orders' as AdminTab,
          label: 'Orders & Dispatch',
          shortLabel: 'Orders',
          icon: ShoppingBag,
          badge:
            salesMetrics.pendingOrders > 0 ? (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500 text-[#071810]">
                {salesMetrics.pendingOrders}
              </span>
            ) : null
        },
        {
          id: 'reports' as AdminTab,
          label: 'Sales Analytics',
          shortLabel: 'Analytics',
          icon: TrendingUp,
          badge: null
        }
      ]
    },
    {
      label: 'Produce & Supply',
      items: [
        {
          id: 'inventory' as AdminTab,
          label: 'Inventory & Stock',
          shortLabel: 'Inventory',
          icon: Package,
          badge:
            lowStockCount > 0 ? (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500 text-white">
                {lowStockCount} low
              </span>
            ) : null
        },
        {
          id: 'suppliers' as AdminTab,
          label: 'Suppliers & POs',
          shortLabel: 'Suppliers',
          icon: Truck,
          badge: null
        }
      ]
    },
    {
      label: 'People & Communication',
      items: [
        {
          id: 'customers' as AdminTab,
          label: 'Customers & Loyalty',
          shortLabel: 'Customers',
          icon: Users,
          badge: null
        },
        {
          id: 'inquiries' as AdminTab,
          label: 'Inquiries & Messages',
          shortLabel: 'Messages',
          icon: MessageSquare,
          badge:
            unreadInquiriesCount > 0 ? (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono font-black bg-rose-500 text-white">
                {unreadInquiriesCount}
              </span>
            ) : null
        },
        {
          id: 'staff' as AdminTab,
          label: 'Staff & Roles',
          shortLabel: 'Staff',
          icon: ShieldCheck,
          badge: null
        }
      ]
    },
    {
      label: 'System & Security',
      items: [
        {
          id: 'logs' as AdminTab,
          label: 'Activity Logs',
          shortLabel: 'Logs',
          icon: History,
          badge: null
        }
      ]
    }
  ];

  const handleSelectNavTab = (tab: AdminTab) => {
    setActiveTab(tab);
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#071810] text-[#FDFBF5] flex font-sans relative antialiased selection:bg-[#D4AF37] selection:text-[#0D2B1D]">
      
      {/* ------------------------------------------------------------- */}
      {/* LEFT SIDEBAR NAVIGATION (Desktop & Collapsible) */}
      {/* ------------------------------------------------------------- */}
      <aside
        className={`hidden lg:flex flex-col flex-shrink-0 z-30 bg-[#0D2B1D] border-r border-white/10 transition-all duration-300 relative select-none ${
          isSidebarCollapsed ? 'w-20' : 'w-64 xl:w-72'
        }`}
      >
        {/* Top of Sidebar: Yifa Farms Logo + Role Badge */}
        <div className="p-4 border-b border-white/10 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div
              onClick={() => setActiveTab('overview')}
              className="flex items-center gap-3 cursor-pointer group overflow-hidden"
              title="YIFA Farms Portal"
            >
              <div className="p-1 rounded-xl bg-white/5 border border-white/10 group-hover:border-[#D4AF37]/50 transition-all shrink-0">
                <YifaLogo variant="icon" size="sm" />
              </div>
              {!isSidebarCollapsed && (
                <div className="truncate">
                  <div className="text-sm font-black text-white tracking-wider group-hover:text-[#D4AF37] transition-colors truncate">
                    YIFA FARMS
                  </div>
                  <div className="text-[10px] text-[#D4AF37] font-mono font-bold uppercase tracking-wider truncate">
                    Operations Portal
                  </div>
                </div>
              )}
            </div>

            {/* Collapse / Expand Toggle Button */}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#FDFBF5]/60 hover:text-white border border-white/10 transition-all cursor-pointer"
              title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              aria-label={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isSidebarCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Role Badge Indicator */}
          {!isSidebarCollapsed ? (
            <div className="flex items-center justify-between bg-[#071810] px-3 py-2 rounded-xl border border-white/10">
              <div className="flex items-center gap-2 truncate">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
                <span className="text-[11px] font-bold text-white uppercase tracking-wider truncate">
                  {currentStaffUser?.role === 'admin'
                    ? 'Operations Admin'
                    : currentStaffUser?.title || 'Staff Manager'}
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
                Live
              </span>
            </div>
          ) : (
            <div className="flex justify-center">
              <span
                className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"
                title="Kaduna Operations Node Online"
              ></span>
            </div>
          )}
        </div>

        {/* Main Navigation Items (Grouped with Section Labels) */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-5 custom-scrollbar">
          {navigationGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1">
              {!isSidebarCollapsed ? (
                <div className="text-[10px] font-bold text-[#D4AF37]/90 uppercase tracking-widest px-3 py-1">
                  {group.label}
                </div>
              ) : (
                <div className="h-px bg-white/10 my-2 mx-1" />
              )}

              {group.items.map((item) => {
                const isActive = activeTab === item.id;
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectNavTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer relative group ${
                      isActive
                        ? 'bg-[#D4AF37] text-[#0D2B1D] font-black shadow-lg shadow-[#D4AF37]/20'
                        : 'text-[#FDFBF5]/75 hover:bg-white/5 hover:text-white'
                    } ${isSidebarCollapsed ? 'justify-center px-0' : 'justify-between'}`}
                    title={isSidebarCollapsed ? item.label : undefined}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                          isActive ? 'text-[#0D2B1D]' : 'text-[#D4AF37]'
                        }`}
                      />
                      {!isSidebarCollapsed && (
                        <span className="truncate">{item.label}</span>
                      )}
                    </div>

                    {!isSidebarCollapsed && item.badge && (
                      <div className="shrink-0">{item.badge}</div>
                    )}

                    {/* Floating badge for collapsed view */}
                    {isSidebarCollapsed && item.badge && (
                      <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-[#0D2B1D]"></span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Bottom of Sidebar: Utilities, Storefront link & Profile */}
        <div className="p-3 border-t border-white/10 bg-[#0A2217] space-y-2">
          {/* Quick Utility Row */}
          {!isSidebarCollapsed ? (
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#071810] rounded-xl border border-white/10">
              <button
                onClick={onBackToStorefront}
                className="flex items-center justify-center p-2 rounded-lg text-[#FDFBF5]/70 hover:text-white hover:bg-white/10 text-xs transition-colors"
                title="View Public Storefront"
              >
                <Store className="w-4 h-4 text-[#D4AF37]" />
              </button>

              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="flex items-center justify-center p-2 rounded-lg text-[#FDFBF5]/70 hover:text-white hover:bg-white/10 text-xs transition-colors relative"
                title="Notifications"
              >
                <Bell className="w-4 h-4 text-[#D4AF37]" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-rose-500 text-white font-mono text-[8px] font-bold flex items-center justify-center">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>

              <div className="flex items-center justify-center">
                <ThemeToggle variant="icon" />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={onBackToStorefront}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#D4AF37] border border-white/10 transition-colors"
                title="View Storefront"
              >
                <Store className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center">
                <ThemeToggle variant="icon" />
              </div>
            </div>
          )}

          {/* Admin Profile Card with Logout */}
          <div
            className={`flex items-center justify-between p-2 rounded-xl bg-[#071810] border border-white/10 ${
              isSidebarCollapsed ? 'flex-col gap-2' : ''
            }`}
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center font-bold text-xs text-[#D4AF37] shrink-0">
                {currentStaffUser?.fullName ? currentStaffUser.fullName.charAt(0) : 'A'}
              </div>
              {!isSidebarCollapsed && (
                <div className="truncate">
                  <div className="text-xs font-bold text-white truncate">
                    {currentStaffUser?.fullName || 'Staff Administrator'}
                  </div>
                  <div className="text-[10px] text-[#FDFBF5]/50 truncate">
                    {currentStaffUser?.email || 'admin@yifafarms.ng'}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={logoutStaff}
              className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer shrink-0"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ------------------------------------------------------------- */}
      {/* MOBILE DRAWER OVERLAY & SIDEBAR */}
      {/* ------------------------------------------------------------- */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
            onClick={() => setIsMobileSidebarOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-80 max-w-[85vw] bg-[#0D2B1D] border-r border-white/10 h-full flex flex-col z-10 shadow-2xl animate-in slide-in-from-left duration-200">
            {/* Drawer Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-1 rounded-xl bg-white/5 border border-white/10">
                  <YifaLogo variant="icon" size="sm" />
                </div>
                <div>
                  <div className="text-sm font-black text-white">YIFA FARMS</div>
                  <div className="text-[10px] text-[#D4AF37] font-mono font-bold uppercase">
                    Admin Portal
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="p-2 rounded-xl text-[#FDFBF5]/70 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Nav Links */}
            <div className="flex-1 overflow-y-auto py-4 px-3 space-y-4">
              {navigationGroups.map((group, groupIdx) => (
                <div key={groupIdx} className="space-y-1">
                  <div className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest px-3 py-1">
                    {group.label}
                  </div>
                  {group.items.map((item) => {
                    const isActive = activeTab === item.id;
                    const Icon = item.icon;

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelectNavTab(item.id)}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                          isActive
                            ? 'bg-[#D4AF37] text-[#0D2B1D] font-black'
                            : 'text-[#FDFBF5]/80 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </div>
                        {item.badge}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Mobile Drawer Footer */}
            <div className="p-4 border-t border-white/10 bg-[#0A2217] space-y-3">
              <ThemeToggle variant="expanded" />

              <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                <button
                  onClick={onBackToStorefront}
                  className="text-[#D4AF37] font-bold flex items-center gap-1.5"
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Return to Site</span>
                </button>
                <button
                  onClick={logoutStaff}
                  className="text-rose-400 font-bold flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* RIGHT MAIN AREA: SLIM TOP BAR + VIEWPORT */}
      {/* ------------------------------------------------------------- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Slim Top Bar (stays at top of content area) */}
        <header className="sticky top-0 z-20 h-16 bg-[#0D2B1D]/95 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-sm">
          {/* Left Zone: Mobile Trigger + Page Title & Live Breadcrumb */}
          <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
            {/* Mobile Sidebar Hamburger Trigger */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#FDFBF5]/80 hover:text-white border border-white/10 cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="overflow-hidden">
              <h1 className="text-sm sm:text-base font-black text-white uppercase tracking-wide truncate">
                {headerInfo.title}
              </h1>
              <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-[#FDFBF5]/60 font-medium truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
                <span className="truncate font-mono">{headerInfo.subtitle}</span>
              </div>
            </div>
          </div>

          {/* Right Zone: Quick Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Sound Notification Chime Toggle */}
            <button
              onClick={toggleSound}
              className={`p-2 sm:p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                soundEnabled
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 shadow-sm'
                  : 'bg-white/5 border-white/10 text-[#FDFBF5]/40 hover:bg-white/10'
              }`}
              title={soundEnabled ? 'Order Audio Chime Active' : 'Audio Chimes Muted'}
              aria-label={soundEnabled ? 'Mute sound alerts' : 'Enable sound alerts'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Notification Bell Popover */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2 sm:p-2.5 rounded-xl bg-white/5 border border-white/10 text-[#FDFBF5]/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer relative"
                aria-label="Order notifications"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-mono text-[9px] font-bold flex items-center justify-center animate-bounce shadow-md">
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

            {/* Theme Toggle Button */}
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>

            {/* Sales Analytics Quick Link Button (if not already on reports tab) */}
            {activeTab !== 'reports' && (
              <button
                onClick={() => setActiveTab('reports')}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold border border-white/10 transition-all cursor-pointer"
                title="Open Sales Reports & Analytics"
              >
                <BarChart3 className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Analytics</span>
              </button>
            )}

            {/* Primary Action Button: Record New Order */}
            <button
              onClick={() => setIsNewOrderModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#0D2B1D] font-black text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              title="Record a New Farm Order"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span className="hidden sm:inline">Record Order</span>
              <span className="sm:hidden">New</span>
            </button>
          </div>
        </header>

        {/* Main Content Viewport */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'overview' && (
              <AdminDashboardOverview
                onNavigateTab={(tab) => setActiveTab(tab as AdminTab)}
                onSelectOrder={setSelectedOrderForDetail}
                onOpenNewOrderModal={() => setIsNewOrderModalOpen(true)}
              />
            )}

            {activeTab === 'orders' && (
              <AdminOrdersPage onSelectOrder={setSelectedOrderForDetail} />
            )}

            {activeTab === 'inventory' && <AdminInventoryPage />}

            {activeTab === 'inquiries' && <AdminInquiriesInbox />}

            {activeTab === 'customers' && (
              <AdminCustomersPage onSelectOrder={setSelectedOrderForDetail} />
            )}

            {activeTab === 'suppliers' && <AdminSuppliersPage />}

            {activeTab === 'reports' && <AdminReportsPage />}

            {activeTab === 'staff' && <AdminStaffPage />}

            {activeTab === 'logs' && <AdminActivityLogPage />}
          </div>
        </main>
      </div>

      {/* Global Admin Modals */}
      <AdminOrderModal
        isOpen={isNewOrderModalOpen}
        onClose={() => setIsNewOrderModalOpen(false)}
      />

      <AdminOrderDetailModal
        order={selectedOrderForDetail}
        isOpen={!!selectedOrderForDetail}
        onClose={() => setSelectedOrderForDetail(null)}
      />
    </div>
  );
};

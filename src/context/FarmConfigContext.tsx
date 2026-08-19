import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  FarmConfig,
  QuoteRequest,
  UnifiedOrder,
  InventoryItem,
  ProductItem,
  CustomerInquiry,
  StaffMember,
  AdminNotification,
  OrderStatus,
  PaymentStatus,
  CustomerAccount,
  Supplier,
  PurchaseOrder,
  ActivityLog,
  AutomatedNotificationLog,
  ProductCategory
} from '../types';
import {
  initialFarmConfig,
  productsData,
  initialInventoryData,
  initialStaffAccounts,
  initialUnifiedOrders,
  initialNotifications,
  initialCustomers,
  initialSuppliers,
  initialPurchaseOrders,
  initialActivityLogs,
  initialAutomatedNotifications,
  initialCustomerInquiries
} from '../data/farmData';

interface SalesMetrics {
  todayRevenue: number;
  todayOrders: number;
  weekRevenue: number;
  weekOrders: number;
  monthRevenue: number;
  monthOrders: number;
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  activeDispatches: number;
  averageOrderValue: number;
}

export interface CreateItemPayload {
  name: string;
  category: ProductCategory;
  unitPrice: number;
  wholesalePrice?: number;
  unitCost?: number;
  unit: string;
  currentStock: number;
  lowStockThreshold: number;
  description: string;
  image: string;
  badge?: string;
  features?: string[];
  harvestDate?: string;
  shelfLifeDays?: number;
  packaging?: string;
  minOrder?: string;
}

interface FarmContextType {
  // Storefront Config
  config: FarmConfig;
  updateConfig: (newConfig: Partial<FarmConfig>) => void;
  resetConfig: () => void;
  isConfigModalOpen: boolean;
  setIsConfigModalOpen: (open: boolean) => void;
  toggleBadgeVisibility: () => void;

  // Unified Products Catalog (Storefront + Admin)
  products: ProductItem[];
  addProduct: (product: Omit<ProductItem, 'id'>) => ProductItem;
  updateProduct: (id: string, updates: Partial<ProductItem>) => void;
  deleteProduct: (id: string) => boolean;

  // Unified Inquiries & Customer Messages (Public Site + Admin Inbox)
  inquiries: CustomerInquiry[];
  unreadInquiriesCount: number;
  submitInquiry: (data: Omit<CustomerInquiry, 'id' | 'createdAt' | 'status'>) => Promise<CustomerInquiry>;
  updateInquiryStatus: (id: string, status: CustomerInquiry['status'], replyNotes?: string) => void;
  deleteInquiry: (id: string) => boolean;

  // Quotes (Storefront quote form integration)
  quotesList: QuoteRequest[];
  submitQuote: (quote: QuoteRequest) => Promise<{ success: boolean; id: string }>;

  // Unified Orders
  orders: UnifiedOrder[];
  addOrder: (orderData: Partial<UnifiedOrder>) => Promise<{ success: boolean; id: string; order: UnifiedOrder }>;
  updateOrderStatus: (
    orderId: string,
    status: OrderStatus,
    options?: {
      driver?: string;
      vehicleNote?: string;
      stageDescription?: string;
      paymentStatus?: PaymentStatus;
      notes?: string;
    }
  ) => void;
  deleteOrder: (orderId: string) => boolean;
  bulkUpdateOrderStatus: (orderIds: string[], newStatus: OrderStatus) => void;
  bulkDeleteOrders: (orderIds: string[]) => void;
  getOrderById: (orderId: string) => UnifiedOrder | undefined;

  // Unified Inventory & Perishables
  inventory: InventoryItem[];
  createInventoryAndProductItem: (payload: CreateItemPayload) => { inventoryItem: InventoryItem; productItem: ProductItem };
  updateInventoryStock: (inventoryId: string, deltaOrExact: number, isDelta?: boolean, reason?: string) => void;
  updateInventoryPricing: (inventoryId: string, unitPrice: number, wholesalePrice: number, unitCost?: number) => void;
  updateInventoryFreshness: (
    inventoryId: string,
    freshnessData: {
      harvestDate?: string;
      expiryDate?: string;
      shelfLifeDays?: number;
      batchNumber?: string;
      freshnessStatus?: 'freshly_harvested' | 'optimal' | 'expiring_soon' | 'expired';
    }
  ) => void;
  updateInventoryItemFull: (inventoryId: string, updates: Partial<InventoryItem>) => void;
  deleteInventoryItem: (inventoryId: string) => boolean;
  lowStockCount: number;

  // Customers & Loyalty
  customers: CustomerAccount[];
  addCustomer: (customerData: Omit<CustomerAccount, 'id' | 'createdAt'>) => CustomerAccount;
  updateCustomer: (id: string, updates: Partial<CustomerAccount>) => void;
  deleteCustomer: (id: string) => boolean;
  awardLoyaltyPoints: (customerId: string, pointsDelta: number, reason?: string) => void;

  // Suppliers & Purchase Orders
  suppliers: Supplier[];
  addSupplier: (supplierData: Omit<Supplier, 'id'>) => Supplier;
  updateSupplier: (id: string, updates: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => boolean;

  purchaseOrders: PurchaseOrder[];
  addPurchaseOrder: (poData: Omit<PurchaseOrder, 'id'>) => PurchaseOrder;
  updatePurchaseOrder: (id: string, updates: Partial<PurchaseOrder>) => void;
  receivePurchaseOrder: (poId: string) => void;
  deletePurchaseOrder: (id: string) => boolean;

  // Staff & RBAC
  staffAccounts: StaffMember[];
  currentStaffUser: StaffMember | null;
  loginStaff: (email: string, password?: string) => { success: boolean; message?: string; user?: StaffMember };
  logoutStaff: () => void;
  addStaffAccount: (staff: Omit<StaffMember, 'id' | 'createdAt'>) => void;
  updateStaffAccount: (id: string, updates: Partial<StaffMember>) => void;
  deleteStaffAccount: (id: string) => boolean;

  // Activity Logs & Audit Trail
  activityLogs: ActivityLog[];
  addActivityLog: (log: Omit<ActivityLog, 'id' | 'timestamp' | 'actorName' | 'actorRole'>) => void;

  // Automated Dispatch & Notification Logs
  automatedNotifications: AutomatedNotificationLog[];
  sendAutomatedNotification: (
    orderId: string,
    channel: 'sms' | 'email' | 'whatsapp',
    type: 'order_confirmed' | 'dispatched' | 'delivered',
    customMessage?: string
  ) => AutomatedNotificationLog;

  // Real-time Notifications & Sound
  notifications: AdminNotification[];
  unreadNotificationsCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (notif: Omit<AdminNotification, 'id' | 'timestamp' | 'read'>) => void;
  soundEnabled: boolean;
  toggleSound: () => void;

  // Real-time Sales Metrics
  salesMetrics: SalesMetrics;
}

const FarmConfigContext = createContext<FarmContextType | undefined>(undefined);

const STORAGE_KEY = 'yifa_farms_config_v3';
const PRODUCTS_STORAGE_KEY = 'yifa_farms_products_v3';
const QUOTES_STORAGE_KEY = 'yifa_farms_quotes_v3';
const INQUIRIES_STORAGE_KEY = 'yifa_farms_inquiries_v3';
const ORDERS_STORAGE_KEY = 'yifa_farms_orders_v3';
const INVENTORY_STORAGE_KEY = 'yifa_farms_inventory_v3';
const STAFF_STORAGE_KEY = 'yifa_farms_staff_v3';
const NOTIFICATIONS_STORAGE_KEY = 'yifa_farms_notifications_v3';
const SESSION_STORAGE_KEY = 'yifa_farms_staff_session_v3';
const SOUND_STORAGE_KEY = 'yifa_farms_sound_pref_v3';
const CUSTOMERS_STORAGE_KEY = 'yifa_farms_customers_v3';
const SUPPLIERS_STORAGE_KEY = 'yifa_farms_suppliers_v3';
const POS_STORAGE_KEY = 'yifa_farms_pos_v3';
const ACTIVITY_STORAGE_KEY = 'yifa_farms_activity_v3';
const AUTONOTIFS_STORAGE_KEY = 'yifa_farms_autonotifs_v3';

// Simple synthesized Web Audio chime for incoming orders and inquiries
function playAlertChime(isUrgent = false) {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    if (isUrgent) {
      osc.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
      osc.frequency.exponentialRampToValueAtTime(1046.5, ctx.currentTime + 0.15); // C6
    } else {
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
    }
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch {
    // ignore audio failure if browser autoplay policy blocks
  }
}

export const FarmConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Farm Configuration
  const [config, setConfig] = useState<FarmConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return { ...initialFarmConfig, ...JSON.parse(saved) };
    } catch {
      // Fallback
    }
    return initialFarmConfig;
  });

  // 2. Unified Products Catalog
  const [products, setProducts] = useState<ProductItem[]>(() => {
    try {
      const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback
    }
    return productsData;
  });

  // 3. Customer Inquiries & Messages
  const [inquiries, setInquiries] = useState<CustomerInquiry[]>(() => {
    try {
      const saved = localStorage.getItem(INQUIRIES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback
    }
    return initialCustomerInquiries;
  });

  // 4. Quotes List
  const [quotesList, setQuotesList] = useState<QuoteRequest[]>(() => {
    try {
      const savedQuotes = localStorage.getItem(QUOTES_STORAGE_KEY);
      if (savedQuotes) return JSON.parse(savedQuotes);
    } catch {
      // Fallback
    }
    return [];
  });

  // 5. Unified Orders
  const [orders, setOrders] = useState<UnifiedOrder[]>(() => {
    try {
      const savedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (savedOrders) {
        const parsed = JSON.parse(savedOrders);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback
    }
    return initialUnifiedOrders;
  });

  // 6. Unified Inventory
  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    try {
      const savedInv = localStorage.getItem(INVENTORY_STORAGE_KEY);
      if (savedInv) {
        const parsed = JSON.parse(savedInv);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback
    }
    return initialInventoryData;
  });

  // 7. Staff Accounts & Session
  const [staffAccounts, setStaffAccounts] = useState<StaffMember[]>(() => {
    try {
      const savedStaff = localStorage.getItem(STAFF_STORAGE_KEY);
      if (savedStaff) return JSON.parse(savedStaff);
    } catch {
      // Fallback
    }
    return initialStaffAccounts;
  });

  const [currentStaffUser, setCurrentStaffUser] = useState<StaffMember | null>(() => {
    try {
      const savedSession = localStorage.getItem(SESSION_STORAGE_KEY);
      if (savedSession) return JSON.parse(savedSession);
    } catch {
      // Fallback
    }
    return null;
  });

  // 8. Real-time Notifications
  const [notifications, setNotifications] = useState<AdminNotification[]>(() => {
    try {
      const savedNotifs = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      if (savedNotifs) return JSON.parse(savedNotifs);
    } catch {
      // Fallback
    }
    return initialNotifications;
  });

  // 9. Sound Preference
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      const savedSound = localStorage.getItem(SOUND_STORAGE_KEY);
      if (savedSound !== null) return JSON.parse(savedSound);
    } catch {
      // Fallback
    }
    return true;
  });

  // 10. Customers Directory
  const [customers, setCustomers] = useState<CustomerAccount[]>(() => {
    try {
      const savedCust = localStorage.getItem(CUSTOMERS_STORAGE_KEY);
      if (savedCust) return JSON.parse(savedCust);
    } catch {
      // Fallback
    }
    return initialCustomers;
  });

  // 11. Suppliers
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    try {
      const savedSup = localStorage.getItem(SUPPLIERS_STORAGE_KEY);
      if (savedSup) return JSON.parse(savedSup);
    } catch {
      // Fallback
    }
    return initialSuppliers;
  });

  // 12. Purchase Orders
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(() => {
    try {
      const savedPOs = localStorage.getItem(POS_STORAGE_KEY);
      if (savedPOs) return JSON.parse(savedPOs);
    } catch {
      // Fallback
    }
    return initialPurchaseOrders;
  });

  // 13. Activity Logs
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    try {
      const savedAct = localStorage.getItem(ACTIVITY_STORAGE_KEY);
      if (savedAct) return JSON.parse(savedAct);
    } catch {
      // Fallback
    }
    return initialActivityLogs;
  });

  // 14. Automated Notification Logs
  const [automatedNotifications, setAutomatedNotifications] = useState<AutomatedNotificationLog[]>(() => {
    try {
      const savedANotifs = localStorage.getItem(AUTONOTIFS_STORAGE_KEY);
      if (savedANotifs) return JSON.parse(savedANotifs);
    } catch {
      // Fallback
    }
    return initialAutomatedNotifications;
  });

  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  // Cross-tab real-time sync with Storage Events and BroadcastChannel
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (!e.newValue) return;
      try {
        if (e.key === ORDERS_STORAGE_KEY) setOrders(JSON.parse(e.newValue));
        if (e.key === PRODUCTS_STORAGE_KEY) setProducts(JSON.parse(e.newValue));
        if (e.key === INVENTORY_STORAGE_KEY) setInventory(JSON.parse(e.newValue));
        if (e.key === INQUIRIES_STORAGE_KEY) setInquiries(JSON.parse(e.newValue));
        if (e.key === NOTIFICATIONS_STORAGE_KEY) setNotifications(JSON.parse(e.newValue));
        if (e.key === CUSTOMERS_STORAGE_KEY) setCustomers(JSON.parse(e.newValue));
        if (e.key === STORAGE_KEY) setConfig(JSON.parse(e.newValue));
      } catch {
        // ignore parse error
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Persistence side-effects
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(inquiries));
  }, [inquiries]);

  useEffect(() => {
    localStorage.setItem(QUOTES_STORAGE_KEY, JSON.stringify(quotesList));
  }, [quotesList]);

  useEffect(() => {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(staffAccounts));
  }, [staffAccounts]);

  useEffect(() => {
    if (currentStaffUser) {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(currentStaffUser));
    } else {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }, [currentStaffUser]);

  useEffect(() => {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(SOUND_STORAGE_KEY, JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem(SUPPLIERS_STORAGE_KEY, JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem(POS_STORAGE_KEY, JSON.stringify(purchaseOrders));
  }, [purchaseOrders]);

  useEffect(() => {
    localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(activityLogs));
  }, [activityLogs]);

  useEffect(() => {
    localStorage.setItem(AUTONOTIFS_STORAGE_KEY, JSON.stringify(automatedNotifications));
  }, [automatedNotifications]);

  // Counts & Calculated fields
  const unreadNotificationsCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  const unreadInquiriesCount = useMemo(() => {
    return inquiries.filter((inq) => inq.status === 'new').length;
  }, [inquiries]);

  const lowStockCount = useMemo(() => {
    return inventory.filter((i) => i.currentStock <= i.lowStockThreshold).length;
  }, [inventory]);

  const toggleSound = () => setSoundEnabled((prev) => !prev);

  const addNotification = useCallback(
    (notif: Omit<AdminNotification, 'id' | 'timestamp' | 'read'>) => {
      const newNotif: AdminNotification = {
        id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        timestamp: 'Just now',
        read: false,
        ...notif
      };
      setNotifications((prev) => [newNotif, ...prev]);
      if (soundEnabled) {
        playAlertChime(notif.type === 'new_order' || notif.type === 'new_inquiry');
      }
    },
    [soundEnabled]
  );

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Activity Log helper
  const addActivityLog = useCallback(
    (log: Omit<ActivityLog, 'id' | 'timestamp' | 'actorName' | 'actorRole'>) => {
      const actorName = currentStaffUser?.fullName || 'Farm Sales Desk';
      const actorRole = currentStaffUser?.role || 'staff';
      const newLog: ActivityLog = {
        id: `act-${Date.now()}`,
        actorName,
        actorRole,
        timestamp: 'Just now',
        ...log
      };
      setActivityLogs((prev) => [newLog, ...prev]);
    },
    [currentStaffUser]
  );

  // Automated Notification Generator
  const sendAutomatedNotification = useCallback(
    (
      orderId: string,
      channel: 'sms' | 'email' | 'whatsapp',
      type: 'order_confirmed' | 'dispatched' | 'delivered',
      customMessage?: string
    ) => {
      const order = orders.find((o) => o.id === orderId);
      const recipient =
        channel === 'sms' || channel === 'whatsapp'
          ? order?.phone || '+234 800 000 0000'
          : order?.email || 'customer@gmail.com';

      const defaultMsg =
        type === 'order_confirmed'
          ? `YIFA Farms: Your farm order #${orderId} is confirmed and scheduled for quality batching. Thank you for choosing Kaduna's freshest produce!`
          : type === 'dispatched'
          ? `YIFA Farms Update: Order #${orderId} is en route with ${order?.dispatchDriver || 'Farm Logistics Unit'}. Delivery destination: ${order?.deliveryAddress || 'Kaduna'}.`
          : `YIFA Farms: Order #${orderId} has been successfully delivered. We hope you enjoy your farm-fresh produce!`;

      const notifLog: AutomatedNotificationLog = {
        id: `anotif-${Date.now()}`,
        orderId,
        customerName: order?.customerName || 'Valued Customer',
        channel,
        type,
        recipient,
        message: customMessage || defaultMsg,
        sentAt: 'Just now',
        status: 'delivered'
      };

      setAutomatedNotifications((prev) => [notifLog, ...prev]);

      addActivityLog({
        actionType: 'notification_sent',
        description: `Triggered automated ${channel.toUpperCase()} update (${type}) for order #${orderId} to ${recipient}.`,
        orderId
      });

      return notifLog;
    },
    [orders, addActivityLog]
  );

  // Products Management
  const addProduct = useCallback(
    (productData: Omit<ProductItem, 'id'>): ProductItem => {
      const slug = productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const id = `${slug}-${Date.now().toString().slice(-4)}`;
      const newProduct: ProductItem = {
        id,
        ...productData
      };
      setProducts((prev) => [newProduct, ...prev]);
      addActivityLog({
        actionType: 'product_created',
        description: `Added new product to catalog: "${newProduct.name}" (${newProduct.category}).`,
        targetId: id
      });
      addNotification({
        type: 'product_updated',
        title: `Product Added: ${newProduct.name}`,
        message: `New item is now active and live on the public storefront catalog.`
      });
      return newProduct;
    },
    [addActivityLog, addNotification]
  );

  const updateProduct = useCallback(
    (id: string, updates: Partial<ProductItem>) => {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
      );
      addActivityLog({
        actionType: 'product_updated',
        description: `Updated product specifications for ID #${id}.`,
        targetId: id
      });
    },
    [addActivityLog]
  );

  const deleteProduct = useCallback(
    (id: string): boolean => {
      const prod = products.find((p) => p.id === id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      addActivityLog({
        actionType: 'product_deleted',
        description: `Removed product "${prod?.name || id}" from storefront catalog.`,
        targetId: id
      });
      return true;
    },
    [products, addActivityLog]
  );

  // Unified Customer Inquiries Management
  const submitInquiry = useCallback(
    async (
      data: Omit<CustomerInquiry, 'id' | 'createdAt' | 'status'>
    ): Promise<CustomerInquiry> => {
      const generatedId = `INQ-${Math.floor(1000 + Math.random() * 9000)}`;
      const now = new Date();

      const newInquiry: CustomerInquiry = {
        id: generatedId,
        createdAt: now.toISOString(),
        status: 'new',
        ...data
      };

      setInquiries((prev) => [newInquiry, ...prev]);

      // Trigger admin notification & sound alert
      addNotification({
        type: 'new_inquiry',
        title: `New Customer Message: ${newInquiry.fullName}`,
        message: `${newInquiry.subject} (${newInquiry.channel.toUpperCase()}) - ${newInquiry.phone}`,
        inquiryId: generatedId
      });

      // Log in audit trail
      addActivityLog({
        actionType: 'inquiry_received',
        description: `Received customer message from ${newInquiry.fullName} (${newInquiry.channel}): "${newInquiry.subject}".`,
        targetId: generatedId
      });

      return newInquiry;
    },
    [addNotification, addActivityLog]
  );

  const updateInquiryStatus = useCallback(
    (id: string, status: CustomerInquiry['status'], replyNotes?: string) => {
      setInquiries((prev) =>
        prev.map((inq) => {
          if (inq.id === id) {
            return {
              ...inq,
              status,
              ...(replyNotes !== undefined && { replyNotes }),
              ...(status === 'replied' && { repliedAt: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) })
            };
          }
          return inq;
        })
      );

      addActivityLog({
        actionType: 'inquiry_replied',
        description: `Updated inquiry #${id} status to '${status.toUpperCase()}'.`,
        targetId: id
      });
    },
    [addActivityLog]
  );

  const deleteInquiry = useCallback(
    (id: string): boolean => {
      setInquiries((prev) => prev.filter((i) => i.id !== id));
      return true;
    },
    []
  );

  // Legacy Quote Submission
  const submitQuote = useCallback(
    async (quote: QuoteRequest): Promise<{ success: boolean; id: string }> => {
      const quoteId = `YIFA-QT-${Math.floor(1000 + Math.random() * 9000)}`;
      const now = new Date();
      const quoteWithMetadata: QuoteRequest = {
        ...quote,
        id: quoteId,
        createdAt: now.toISOString(),
        status: 'new'
      };

      setQuotesList((prev) => [quoteWithMetadata, ...prev]);

      // Also log inquiry into unified messages inbox
      await submitInquiry({
        fullName: quote.fullName,
        phone: quote.phoneOrWhatsapp,
        email: quote.email,
        channel: 'quote_request',
        subject: `Quote Request for ${quote.quantity} ${quote.unit} ${quote.specificItem || quote.productCategory}`,
        message: quote.message || `Customer requested quotation for ${quote.quantity} ${quote.unit} of ${quote.specificItem}. Delivery to: ${quote.deliveryLocation}. Frequency: ${quote.frequency}.`,
        productCategory: quote.productCategory,
        specificItem: quote.specificItem,
        quantity: quote.quantity,
        unit: quote.unit,
        location: quote.deliveryLocation,
        priority: 'high'
      });

      return { success: true, id: quoteId };
    },
    [submitInquiry]
  );

  // Customer Management
  const addCustomer = useCallback(
    (customerData: Omit<CustomerAccount, 'id' | 'createdAt'>): CustomerAccount => {
      const newCust: CustomerAccount = {
        id: `cust-${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0],
        ...customerData
      };
      setCustomers((prev) => [newCust, ...prev]);
      addActivityLog({
        actionType: 'customer_update',
        description: `Created customer profile for ${newCust.name} (${newCust.phone}).`
      });
      return newCust;
    },
    [addActivityLog]
  );

  const updateCustomer = useCallback(
    (id: string, updates: Partial<CustomerAccount>) => {
      setCustomers((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
      );
      addActivityLog({
        actionType: 'customer_update',
        description: `Updated customer profile #${id}.`,
        targetId: id
      });
    },
    [addActivityLog]
  );

  const deleteCustomer = useCallback(
    (id: string): boolean => {
      setCustomers((prev) => prev.filter((c) => c.id !== id));
      addActivityLog({
        actionType: 'customer_update',
        description: `Deleted customer record #${id}.`
      });
      return true;
    },
    [addActivityLog]
  );

  const awardLoyaltyPoints = useCallback(
    (customerId: string, pointsDelta: number, reason = 'Bonus allocation') => {
      setCustomers((prev) =>
        prev.map((c) => {
          if (c.id === customerId) {
            const nextPts = Math.max(0, c.loyaltyPoints + pointsDelta);
            let tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' = 'Bronze';
            if (nextPts >= 2000) tier = 'Platinum';
            else if (nextPts >= 1000) tier = 'Gold';
            else if (nextPts >= 500) tier = 'Silver';

            return {
              ...c,
              loyaltyPoints: nextPts,
              loyaltyTier: tier
            };
          }
          return c;
        })
      );
      addActivityLog({
        actionType: 'customer_update',
        description: `Awarded ${pointsDelta >= 0 ? `+${pointsDelta}` : pointsDelta} loyalty points to customer #${customerId} (${reason}).`,
        targetId: customerId
      });
    },
    [addActivityLog]
  );

  // Suppliers & Purchase Orders
  const addSupplier = useCallback(
    (supplierData: Omit<Supplier, 'id'>): Supplier => {
      const newSup: Supplier = {
        id: `sup-${Date.now()}`,
        ...supplierData
      };
      setSuppliers((prev) => [newSup, ...prev]);
      addActivityLog({
        actionType: 'supplier_po',
        description: `Registered new supplier: ${newSup.name} (${newSup.category}).`
      });
      return newSup;
    },
    [addActivityLog]
  );

  const updateSupplier = useCallback(
    (id: string, updates: Partial<Supplier>) => {
      setSuppliers((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
      );
      addActivityLog({
        actionType: 'supplier_po',
        description: `Updated supplier profile #${id}.`,
        targetId: id
      });
    },
    [addActivityLog]
  );

  const deleteSupplier = useCallback(
    (id: string): boolean => {
      setSuppliers((prev) => prev.filter((s) => s.id !== id));
      addActivityLog({
        actionType: 'supplier_po',
        description: `Deleted supplier record #${id}.`
      });
      return true;
    },
    [addActivityLog]
  );

  const addPurchaseOrder = useCallback(
    (poData: Omit<PurchaseOrder, 'id'>): PurchaseOrder => {
      const newPO: PurchaseOrder = {
        id: `PO-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        ...poData
      };
      setPurchaseOrders((prev) => [newPO, ...prev]);
      addActivityLog({
        actionType: 'supplier_po',
        description: `Created Purchase Order #${newPO.poNumber} for ${newPO.supplierName} (₦${newPO.totalCost.toLocaleString()}).`,
        targetId: newPO.id
      });
      return newPO;
    },
    [addActivityLog]
  );

  const updatePurchaseOrder = useCallback(
    (id: string, updates: Partial<PurchaseOrder>) => {
      setPurchaseOrders((prev) =>
        prev.map((po) => (po.id === id ? { ...po, ...updates } : po))
      );
      addActivityLog({
        actionType: 'supplier_po',
        description: `Updated Purchase Order #${id}.`,
        targetId: id
      });
    },
    [addActivityLog]
  );

  const receivePurchaseOrder = useCallback(
    (poId: string) => {
      const targetPO = purchaseOrders.find((p) => p.id === poId);
      if (!targetPO || targetPO.status === 'received') return;

      setPurchaseOrders((prev) =>
        prev.map((po) =>
          po.id === poId
            ? { ...po, status: 'received', receivedDate: 'Today' }
            : po
        )
      );

      targetPO.items.forEach((item) => {
        if (item.productId) {
          setInventory((prevInv) =>
            prevInv.map((inv) => {
              if (inv.productId === item.productId || inv.id === item.productId) {
                const updatedStock = inv.currentStock + item.quantity;
                return {
                  ...inv,
                  currentStock: updatedStock,
                  lastRestocked: 'Today (PO Delivery)',
                  status: updatedStock <= inv.lowStockThreshold ? 'low_stock' : 'in_stock'
                };
              }
              return inv;
            })
          );
        }
      });

      addActivityLog({
        actionType: 'supplier_po',
        description: `Received PO #${targetPO.poNumber} from ${targetPO.supplierName}. Stock replenished.`,
        targetId: targetPO.id
      });

      addNotification({
        type: 'status_change',
        title: `Purchase Order #${targetPO.poNumber} Received`,
        message: `Stock replenished from ${targetPO.supplierName} (${targetPO.items.length} items).`
      });
    },
    [purchaseOrders, addActivityLog, addNotification]
  );

  const deletePurchaseOrder = useCallback(
    (id: string) => {
      setPurchaseOrders((prev) => prev.filter((p) => p.id !== id));
      addActivityLog({
        actionType: 'supplier_po',
        description: `Cancelled/deleted Purchase Order #${id}.`
      });
      return true;
    },
    [addActivityLog]
  );

  // Unified 'Create New Item' in Inventory & Storefront Catalog
  const createInventoryAndProductItem = useCallback(
    (payload: CreateItemPayload): { inventoryItem: InventoryItem; productItem: ProductItem } => {
      const baseSlug = payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const uniqueSuffix = Date.now().toString().slice(-4);
      const productId = `prod-${baseSlug}-${uniqueSuffix}`;
      const inventoryId = `inv-${baseSlug}-${uniqueSuffix}`;

      // 1. Create Product Item for Storefront
      const newProduct: ProductItem = {
        id: productId,
        name: payload.name,
        tagline: `${payload.name} — Fresh farm harvest from Kaduna.`,
        category: payload.category,
        badge: payload.badge || (payload.currentStock > 50 ? 'In Stock Daily' : 'Fresh Harvest'),
        description: payload.description || `Freshly harvested ${payload.name} produced under strict quality and bio-sanitary standards at YIFA Farms in Kaduna.`,
        features: payload.features && payload.features.length > 0
          ? payload.features
          : [
              `Freshly harvested in Kaduna State`,
              `100% natural with rigorous quality inspection`,
              `Supplied per ${payload.unit} for retail & wholesale`,
              `Direct farm-gate dispatch to your location`
            ],
        specs: {
          unit: payload.unit,
          packaging: payload.packaging || `Ventilated agro-packaging / crates`,
          shelfLife: payload.shelfLifeDays ? `${payload.shelfLifeDays} days in optimal storage` : '1–2 weeks cool storage',
          minOrder: payload.minOrder || `1 ${payload.unit}`,
          availability: payload.currentStock > 0 ? 'In Stock' : 'Out of Stock (Restocking)',
          estimatedPrice: `₦${payload.unitPrice.toLocaleString()}`,
          isPriceConfirmed: true,
          unitPrice: payload.unitPrice,
          wholesalePrice: payload.wholesalePrice || payload.unitPrice
        },
        image: payload.image
      };

      // 2. Create Inventory Item for Operations
      const newInventory: InventoryItem = {
        id: inventoryId,
        productId: productId,
        name: payload.name,
        category: payload.category,
        currentStock: payload.currentStock,
        unit: payload.unit,
        lowStockThreshold: payload.lowStockThreshold || 10,
        reorderLevel: Math.round(payload.lowStockThreshold * 1.5),
        unitCost: payload.unitCost || Math.round(payload.unitPrice * 0.75),
        unitPrice: payload.unitPrice,
        wholesalePrice: payload.wholesalePrice || payload.unitPrice,
        lastRestocked: 'Just now (New Item)',
        status: payload.currentStock === 0 ? 'out_of_stock' : payload.currentStock <= payload.lowStockThreshold ? 'low_stock' : 'in_stock',
        image: payload.image,
        description: payload.description,
        batchNumber: `BATCH-${new Date().getFullYear()}-${uniqueSuffix}`,
        harvestDate: payload.harvestDate || 'Today',
        shelfLifeDays: payload.shelfLifeDays || 14,
        freshnessStatus: 'freshly_harvested'
      };

      // 3. Atomically update state
      setInventory((prev) => [newInventory, ...prev]);
      setProducts((prev) => [newProduct, ...prev]);

      // 4. Log and notify
      addActivityLog({
        actionType: 'product_created',
        description: `Created new item "${payload.name}" in Inventory (Stock: ${payload.currentStock} ${payload.unit}) and published to Storefront catalog (₦${payload.unitPrice.toLocaleString()}).`,
        targetId: inventoryId
      });

      addNotification({
        type: 'product_updated',
        title: `New Product Created: ${payload.name}`,
        message: `Item added to inventory with ${payload.currentStock} ${payload.unit} stock and published live to public catalog.`
      });

      return { inventoryItem: newInventory, productItem: newProduct };
    },
    [addActivityLog, addNotification]
  );

  // Unified Inventory Updates
  const updateInventoryStock = useCallback(
    (inventoryId: string, deltaOrExact: number, isDelta = false, reason = 'Manual Adjustment') => {
      let targetProdId = '';
      let targetName = '';

      setInventory((prev) =>
        prev.map((item) => {
          if (item.id === inventoryId) {
            targetProdId = item.productId;
            targetName = item.name;
            const nextStock = Math.max(0, isDelta ? item.currentStock + deltaOrExact : deltaOrExact);
            const status =
              nextStock === 0
                ? 'out_of_stock'
                : nextStock <= item.lowStockThreshold
                ? 'low_stock'
                : 'in_stock';

            if (nextStock <= item.lowStockThreshold && item.currentStock > item.lowStockThreshold) {
              addNotification({
                type: 'low_stock',
                title: `Low Stock Alert: ${item.name}`,
                message: `Remaining stock is ${nextStock} ${item.unit} (Below ${item.lowStockThreshold} threshold).`,
                inventoryId: item.id
              });
            }

            return {
              ...item,
              currentStock: nextStock,
              lastRestocked: isDelta && deltaOrExact > 0 ? 'Just now' : item.lastRestocked,
              status
            };
          }
          return item;
        })
      );

      // Sync storefront product availability
      if (targetProdId) {
        setProducts((prev) =>
          prev.map((p) => {
            if (p.id === targetProdId) {
              const currentInv = inventory.find((i) => i.id === inventoryId);
              const nextStock = Math.max(0, isDelta ? (currentInv?.currentStock || 0) + deltaOrExact : deltaOrExact);
              return {
                ...p,
                specs: {
                  ...p.specs,
                  availability: nextStock > 0 ? 'In Stock' : 'Out of Stock (Restocking)'
                }
              };
            }
            return p;
          })
        );
      }

      addActivityLog({
        actionType: 'inventory_update',
        description: `Adjusted stock for ${targetName || inventoryId}: ${isDelta ? (deltaOrExact >= 0 ? `+${deltaOrExact}` : deltaOrExact) : `Set to ${deltaOrExact}`} (${reason}).`,
        targetId: inventoryId
      });
    },
    [inventory, addNotification, addActivityLog]
  );

  const updateInventoryPricing = useCallback(
    (inventoryId: string, unitPrice: number, wholesalePrice: number, unitCost?: number) => {
      let targetProdId = '';

      setInventory((prev) =>
        prev.map((item) => {
          if (item.id === inventoryId) {
            targetProdId = item.productId;
            return {
              ...item,
              unitPrice,
              wholesalePrice,
              unitCost: unitCost !== undefined ? unitCost : item.unitCost
            };
          }
          return item;
        })
      );

      // Instantly reflect updated price on storefront catalog
      if (targetProdId) {
        setProducts((prev) =>
          prev.map((p) => {
            if (p.id === targetProdId) {
              return {
                ...p,
                specs: {
                  ...p.specs,
                  unitPrice,
                  wholesalePrice,
                  estimatedPrice: `₦${unitPrice.toLocaleString()}`,
                  isPriceConfirmed: true
                }
              };
            }
            return p;
          })
        );
      }

      addActivityLog({
        actionType: 'inventory_update',
        description: `Updated pricing for inventory #${inventoryId} (Retail: ₦${unitPrice.toLocaleString()}, Wholesale: ₦${wholesalePrice.toLocaleString()}).`,
        targetId: inventoryId
      });
    },
    [addActivityLog]
  );

  const updateInventoryItemFull = useCallback(
    (inventoryId: string, updates: Partial<InventoryItem>) => {
      let targetProdId = '';

      setInventory((prev) =>
        prev.map((item) => {
          if (item.id === inventoryId) {
            targetProdId = item.productId;
            return {
              ...item,
              ...updates,
              status: updates.currentStock !== undefined
                ? (updates.currentStock === 0 ? 'out_of_stock' : updates.currentStock <= (updates.lowStockThreshold || item.lowStockThreshold) ? 'low_stock' : 'in_stock')
                : item.status
            };
          }
          return item;
        })
      );

      // Sync storefront product details (image, name, description, category, unitPrice)
      if (targetProdId) {
        setProducts((prev) =>
          prev.map((p) => {
            if (p.id === targetProdId) {
              return {
                ...p,
                ...(updates.name && { name: updates.name }),
                ...(updates.category && { category: updates.category }),
                ...(updates.image && { image: updates.image }),
                ...(updates.description && { description: updates.description }),
                specs: {
                  ...p.specs,
                  ...(updates.unit && { unit: updates.unit }),
                  ...(updates.unitPrice && {
                    unitPrice: updates.unitPrice,
                    estimatedPrice: `₦${updates.unitPrice.toLocaleString()}`
                  }),
                  ...(updates.wholesalePrice && { wholesalePrice: updates.wholesalePrice }),
                  ...(updates.currentStock !== undefined && {
                    availability: updates.currentStock > 0 ? 'In Stock' : 'Out of Stock'
                  })
                }
              };
            }
            return p;
          })
        );
      }

      addActivityLog({
        actionType: 'inventory_update',
        description: `Updated full specifications and photo for item #${inventoryId}.`,
        targetId: inventoryId
      });
    },
    [addActivityLog]
  );

  const deleteInventoryItem = useCallback(
    (inventoryId: string): boolean => {
      const target = inventory.find((i) => i.id === inventoryId);
      if (target?.productId) {
        setProducts((prev) => prev.filter((p) => p.id !== target.productId));
      }
      setInventory((prev) => prev.filter((i) => i.id !== inventoryId));
      addActivityLog({
        actionType: 'inventory_update',
        description: `Deleted inventory item #${inventoryId}.`
      });
      return true;
    },
    [inventory, addActivityLog]
  );

  const updateInventoryFreshness = useCallback(
    (
      inventoryId: string,
      freshnessData: {
        harvestDate?: string;
        expiryDate?: string;
        shelfLifeDays?: number;
        batchNumber?: string;
        freshnessStatus?: 'freshly_harvested' | 'optimal' | 'expiring_soon' | 'expired';
      }
    ) => {
      setInventory((prev) =>
        prev.map((item) => {
          if (item.id === inventoryId) {
            return {
              ...item,
              ...freshnessData
            };
          }
          return item;
        })
      );
      addActivityLog({
        actionType: 'inventory_update',
        description: `Updated freshness & expiry log for inventory ID #${inventoryId}.`,
        targetId: inventoryId
      });
    },
    [addActivityLog]
  );

  // Auto-deduct inventory helper
  const deductInventoryForOrder = useCallback((order: UnifiedOrder) => {
    order.items.forEach((orderItem) => {
      setInventory((prevInv) =>
        prevInv.map((invItem) => {
          if (invItem.productId === orderItem.productId || invItem.id === orderItem.productId) {
            const nextStock = Math.max(0, invItem.currentStock - orderItem.quantity);
            const status =
              nextStock === 0
                ? 'out_of_stock'
                : nextStock <= invItem.lowStockThreshold
                ? 'low_stock'
                : 'in_stock';
            return {
              ...invItem,
              currentStock: nextStock,
              status
            };
          }
          return invItem;
        })
      );
    });
  }, []);

  // Unified Orders Management
  const addOrder = useCallback(
    async (orderData: Partial<UnifiedOrder>): Promise<{ success: boolean; id: string; order: UnifiedOrder }> => {
      const generatedId = `YIFA-${Math.floor(1000 + Math.random() * 9000)}`;
      const now = new Date();

      const newOrder: UnifiedOrder = {
        id: generatedId,
        customerName: orderData.customerName || 'Valued Customer',
        phone: orderData.phone || '+234 800 000 0000',
        whatsapp: orderData.whatsapp || orderData.phone || '2348000000000',
        email: orderData.email || '',
        customerType: orderData.customerType || 'household',
        deliveryAddress: orderData.deliveryAddress || 'Kaduna Central, Nigeria',
        items: orderData.items || [
          {
            productId: 'fresh-eggs',
            name: 'Fresh Farm Eggs (30-Egg Crate)',
            category: 'eggs',
            quantity: 5,
            unit: 'Crates',
            unitPrice: 4200,
            totalPrice: 21000
          }
        ],
        subtotal: orderData.subtotal || 21000,
        discount: orderData.discount || 0,
        deliveryFee: orderData.deliveryFee || 2000,
        totalAmount: orderData.totalAmount || 23000,
        status: orderData.status || 'pending',
        paymentStatus: orderData.paymentStatus || 'Pending',
        paymentMethod: orderData.paymentMethod || 'Bank Transfer',
        orderDate: 'Just now',
        estimatedDelivery: orderData.estimatedDelivery || 'Scheduled for Next Morning Dispatch',
        dispatchDriver: orderData.dispatchDriver || undefined,
        vehicleNote: orderData.vehicleNote || undefined,
        stageDescription: orderData.stageDescription || 'Order submitted. Awaiting sales desk confirmation.',
        notes: orderData.notes || '',
        source: orderData.source || 'storefront',
        createdAt: now.toISOString()
      };

      // 1. Add order to list
      setOrders((prev) => [newOrder, ...prev]);

      // 2. Automatically deduct inventory
      deductInventoryForOrder(newOrder);

      // 3. Auto sync Customer account & loyalty points
      setCustomers((prevCusts) => {
        const existingIndex = prevCusts.findIndex(
          (c) =>
            c.phone.replace(/\D/g, '') === newOrder.phone.replace(/\D/g, '') ||
            (newOrder.email && c.email === newOrder.email)
        );

        const earnedPoints = Math.round(newOrder.totalAmount / 1000);

        if (existingIndex >= 0) {
          const cust = prevCusts[existingIndex];
          const newTotalSpent = cust.totalSpent + newOrder.totalAmount;
          const newOrdersCount = cust.ordersCount + 1;
          const newPts = cust.loyaltyPoints + earnedPoints;
          let tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' = 'Bronze';
          if (newPts >= 2000) tier = 'Platinum';
          else if (newPts >= 1000) tier = 'Gold';
          else if (newPts >= 500) tier = 'Silver';

          const savedAddrs = cust.savedAddresses.includes(newOrder.deliveryAddress)
            ? cust.savedAddresses
            : [newOrder.deliveryAddress, ...cust.savedAddresses];

          const updatedCust: CustomerAccount = {
            ...cust,
            ordersCount: newOrdersCount,
            totalSpent: newTotalSpent,
            loyaltyPoints: newPts,
            loyaltyTier: tier,
            savedAddresses: savedAddrs,
            lastOrderDate: 'Today'
          };

          const newArr = [...prevCusts];
          newArr[existingIndex] = updatedCust;
          return newArr;
        } else {
          const newCust: CustomerAccount = {
            id: `cust-${Date.now()}`,
            name: newOrder.customerName,
            phone: newOrder.phone,
            email: newOrder.email,
            customerType: newOrder.customerType,
            address: newOrder.deliveryAddress,
            savedAddresses: [newOrder.deliveryAddress],
            ordersCount: 1,
            totalSpent: newOrder.totalAmount,
            loyaltyTier: earnedPoints >= 500 ? 'Silver' : 'Bronze',
            loyaltyPoints: earnedPoints,
            lastOrderDate: 'Today',
            createdAt: now.toISOString().split('T')[0]
          };
          return [newCust, ...prevCusts];
        }
      });

      // 4. Trigger Real-time Notification & Chime
      addNotification({
        type: 'new_order',
        title: `New Storefront Order: #${newOrder.id}`,
        message: `${newOrder.customerName} ordered ₦${newOrder.totalAmount.toLocaleString()} (${newOrder.items.length} items) for delivery to ${newOrder.deliveryAddress}.`,
        orderId: newOrder.id
      });

      // 5. Activity Log
      addActivityLog({
        actionType: 'order_create',
        description: `New order #${newOrder.id} placed by ${newOrder.customerName} (₦${newOrder.totalAmount.toLocaleString()}).`,
        orderId: newOrder.id
      });

      // 6. Automated confirmation notification
      sendAutomatedNotification(newOrder.id, 'sms', 'order_confirmed');

      return { success: true, id: generatedId, order: newOrder };
    },
    [deductInventoryForOrder, addNotification, addActivityLog, sendAutomatedNotification]
  );

  const updateOrderStatus = useCallback(
    (
      orderId: string,
      status: OrderStatus,
      options?: {
        driver?: string;
        vehicleNote?: string;
        stageDescription?: string;
        paymentStatus?: PaymentStatus;
        notes?: string;
      }
    ) => {
      setOrders((prev) =>
        prev.map((ord) => {
          if (ord.id === orderId) {
            const updated: UnifiedOrder = {
              ...ord,
              status,
              ...(options?.driver !== undefined && { dispatchDriver: options.driver }),
              ...(options?.vehicleNote !== undefined && { vehicleNote: options.vehicleNote }),
              ...(options?.stageDescription !== undefined && { stageDescription: options.stageDescription }),
              ...(options?.paymentStatus !== undefined && { paymentStatus: options.paymentStatus }),
              ...(options?.notes !== undefined && { notes: options.notes })
            };
            return updated;
          }
          return ord;
        })
      );

      const targetOrder = orders.find((o) => o.id === orderId);

      addActivityLog({
        actionType: 'order_status',
        description: `Changed order #${orderId} status to '${status.toUpperCase()}'${options?.driver ? ` (Driver: ${options.driver})` : ''}.`,
        orderId
      });

      addNotification({
        type: 'status_change',
        title: `Order #${orderId} Updated to ${status.toUpperCase()}`,
        message: `Order for ${targetOrder?.customerName || 'Customer'} marked as ${status.toUpperCase()}.`,
        orderId
      });

      if (status === 'dispatched') {
        sendAutomatedNotification(orderId, 'sms', 'dispatched');
      } else if (status === 'delivered') {
        sendAutomatedNotification(orderId, 'sms', 'delivered');
      }
    },
    [orders, addActivityLog, addNotification, sendAutomatedNotification]
  );

  const bulkUpdateOrderStatus = useCallback(
    (orderIds: string[], newStatus: OrderStatus) => {
      setOrders((prev) =>
        prev.map((ord) => {
          if (orderIds.includes(ord.id)) {
            return {
              ...ord,
              status: newStatus,
              stageDescription: `Bulk status update: Marked as ${newStatus.toUpperCase()}.`
            };
          }
          return ord;
        })
      );

      addActivityLog({
        actionType: 'bulk_action',
        description: `Bulk updated ${orderIds.length} orders to '${newStatus.toUpperCase()}'.`
      });

      addNotification({
        type: 'status_change',
        title: `Bulk Status: ${orderIds.length} Orders Updated`,
        message: `Selected orders moved to status ${newStatus.toUpperCase()}.`
      });
    },
    [addActivityLog, addNotification]
  );

  const bulkDeleteOrders = useCallback(
    (orderIds: string[]) => {
      setOrders((prev) => prev.filter((o) => !orderIds.includes(o.id)));
      addActivityLog({
        actionType: 'bulk_action',
        description: `Bulk deleted ${orderIds.length} orders.`
      });
    },
    [addActivityLog]
  );

  const deleteOrder = useCallback(
    (orderId: string): boolean => {
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      addActivityLog({
        actionType: 'order_status',
        description: `Deleted order record #${orderId}.`,
        orderId
      });
      return true;
    },
    [addActivityLog]
  );

  const getOrderById = useCallback(
    (orderId: string): UnifiedOrder | undefined => {
      return orders.find(
        (o) =>
          o.id.toUpperCase() === orderId.toUpperCase() ||
          o.id.replace('YIFA-', '').toUpperCase() === orderId.replace('YIFA-', '').toUpperCase()
      );
    },
    [orders]
  );

  // Staff & RBAC
  const loginStaff = useCallback(
    (email: string, password?: string): { success: boolean; message?: string; user?: StaffMember } => {
      const match = staffAccounts.find(
        (s) => s.email.toLowerCase() === email.toLowerCase().trim()
      );

      if (!match) {
        return { success: false, message: 'No staff account found with this email.' };
      }

      if (match.status === 'inactive') {
        return { success: false, message: 'This staff account has been deactivated.' };
      }

      const updatedUser: StaffMember = {
        ...match,
        lastLogin: 'Just now'
      };

      setCurrentStaffUser(updatedUser);
      setStaffAccounts((prev) =>
        prev.map((s) => (s.id === match.id ? updatedUser : s))
      );

      addActivityLog({
        actionType: 'staff_change',
        description: `${updatedUser.fullName} (${updatedUser.role}) logged in.`
      });

      return { success: true, user: updatedUser };
    },
    [staffAccounts, addActivityLog]
  );

  const logoutStaff = useCallback(() => {
    if (currentStaffUser) {
      addActivityLog({
        actionType: 'staff_change',
        description: `${currentStaffUser.fullName} logged out.`
      });
    }
    setCurrentStaffUser(null);
  }, [currentStaffUser, addActivityLog]);

  const addStaffAccount = useCallback(
    (staffData: Omit<StaffMember, 'id' | 'createdAt'>) => {
      const newStaff: StaffMember = {
        id: `staff-${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0],
        ...staffData
      };
      setStaffAccounts((prev) => [newStaff, ...prev]);
      addActivityLog({
        actionType: 'staff_change',
        description: `Created staff account for ${newStaff.fullName} (${newStaff.role}).`
      });
    },
    [addActivityLog]
  );

  const updateStaffAccount = useCallback(
    (id: string, updates: Partial<StaffMember>) => {
      setStaffAccounts((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
      );
      if (currentStaffUser && currentStaffUser.id === id) {
        setCurrentStaffUser((prev) => (prev ? { ...prev, ...updates } : null));
      }
      addActivityLog({
        actionType: 'staff_change',
        description: `Updated staff permissions for ID #${id}.`,
        targetId: id
      });
    },
    [currentStaffUser, addActivityLog]
  );

  const deleteStaffAccount = useCallback(
    (id: string): boolean => {
      setStaffAccounts((prev) => prev.filter((s) => s.id !== id));
      addActivityLog({
        actionType: 'staff_change',
        description: `Removed staff account #${id}.`
      });
      return true;
    },
    [addActivityLog]
  );

  // Storefront Config updates
  const updateConfig = (newConfig: Partial<FarmConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  };

  const resetConfig = () => {
    setConfig(initialFarmConfig);
  };

  const toggleBadgeVisibility = () => {
    setConfig((prev) => ({ ...prev, showClientBadges: !prev.showClientBadges }));
  };

  // Sales Metrics calculations
  const salesMetrics: SalesMetrics = useMemo(() => {
    const now = Date.now();
    const oneDay = 24 * 3600 * 1000;
    const sevenDays = 7 * oneDay;
    const thirtyDays = 30 * oneDay;

    let todayRevenue = 0;
    let todayOrders = 0;
    let weekRevenue = 0;
    let weekOrders = 0;
    let monthRevenue = 0;
    let monthOrders = 0;
    let totalRevenue = 0;
    let validOrderCount = 0;
    let pendingOrders = 0;
    let activeDispatches = 0;

    orders.forEach((order) => {
      if (order.status === 'cancelled') return;

      const orderTime = new Date(order.createdAt).getTime();
      const age = now - orderTime;

      totalRevenue += order.totalAmount;
      validOrderCount += 1;

      if (order.status === 'pending') pendingOrders += 1;
      if (order.status === 'dispatched' || order.status === 'confirmed') activeDispatches += 1;

      if (age <= oneDay) {
        todayRevenue += order.totalAmount;
        todayOrders += 1;
      }
      if (age <= sevenDays) {
        weekRevenue += order.totalAmount;
        weekOrders += 1;
      }
      if (age <= thirtyDays) {
        monthRevenue += order.totalAmount;
        monthOrders += 1;
      }
    });

    const averageOrderValue = validOrderCount > 0 ? Math.round(totalRevenue / validOrderCount) : 0;

    return {
      todayRevenue,
      todayOrders,
      weekRevenue,
      weekOrders,
      monthRevenue,
      monthOrders,
      totalRevenue,
      totalOrders: validOrderCount,
      pendingOrders,
      activeDispatches,
      averageOrderValue
    };
  }, [orders]);

  return (
    <FarmConfigContext.Provider
      value={{
        config,
        updateConfig,
        resetConfig,
        isConfigModalOpen,
        setIsConfigModalOpen,
        toggleBadgeVisibility,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        inquiries,
        unreadInquiriesCount,
        submitInquiry,
        updateInquiryStatus,
        deleteInquiry,
        quotesList,
        submitQuote,
        orders,
        addOrder,
        updateOrderStatus,
        deleteOrder,
        bulkUpdateOrderStatus,
        bulkDeleteOrders,
        getOrderById,
        inventory,
        createInventoryAndProductItem,
        updateInventoryStock,
        updateInventoryPricing,
        updateInventoryFreshness,
        updateInventoryItemFull,
        deleteInventoryItem,
        lowStockCount,
        customers,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        awardLoyaltyPoints,
        suppliers,
        addSupplier,
        updateSupplier,
        deleteSupplier,
        purchaseOrders,
        addPurchaseOrder,
        updatePurchaseOrder,
        receivePurchaseOrder,
        deletePurchaseOrder,
        staffAccounts,
        currentStaffUser,
        loginStaff,
        logoutStaff,
        addStaffAccount,
        updateStaffAccount,
        deleteStaffAccount,
        activityLogs,
        addActivityLog,
        automatedNotifications,
        sendAutomatedNotification,
        notifications,
        unreadNotificationsCount,
        markNotificationRead,
        markAllNotificationsRead,
        addNotification,
        soundEnabled,
        toggleSound,
        salesMetrics
      }}
    >
      {children}
    </FarmConfigContext.Provider>
  );
};

export const useFarmConfig = () => {
  const context = useContext(FarmConfigContext);
  if (!context) {
    throw new Error('useFarmConfig must be used within a FarmConfigProvider');
  }
  return context;
};

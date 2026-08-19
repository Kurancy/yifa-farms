import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  FarmConfig,
  QuoteRequest,
  UnifiedOrder,
  InventoryItem,
  StaffMember,
  AdminNotification,
  OrderStatus,
  PaymentStatus,
  CustomerAccount,
  Supplier,
  PurchaseOrder,
  ActivityLog,
  AutomatedNotificationLog
} from '../types';
import {
  initialFarmConfig,
  initialInventoryData,
  initialStaffAccounts,
  initialUnifiedOrders,
  initialNotifications,
  initialCustomers,
  initialSuppliers,
  initialPurchaseOrders,
  initialActivityLogs,
  initialAutomatedNotifications
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

interface FarmContextType {
  // Storefront Config
  config: FarmConfig;
  updateConfig: (newConfig: Partial<FarmConfig>) => void;
  resetConfig: () => void;
  isConfigModalOpen: boolean;
  setIsConfigModalOpen: (open: boolean) => void;
  toggleBadgeVisibility: () => void;

  // Quotes (Legacy compatibility)
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

const STORAGE_KEY = 'yifa_farms_config_v2';
const QUOTES_STORAGE_KEY = 'yifa_farms_quotes_v2';
const ORDERS_STORAGE_KEY = 'yifa_farms_orders_v2';
const INVENTORY_STORAGE_KEY = 'yifa_farms_inventory_v2';
const STAFF_STORAGE_KEY = 'yifa_farms_staff_v2';
const NOTIFICATIONS_STORAGE_KEY = 'yifa_farms_notifications_v2';
const SESSION_STORAGE_KEY = 'yifa_farms_staff_session_v2';
const SOUND_STORAGE_KEY = 'yifa_farms_sound_pref_v2';
const CUSTOMERS_STORAGE_KEY = 'yifa_farms_customers_v2';
const SUPPLIERS_STORAGE_KEY = 'yifa_farms_suppliers_v2';
const POS_STORAGE_KEY = 'yifa_farms_pos_v2';
const ACTIVITY_STORAGE_KEY = 'yifa_farms_activity_v2';
const AUTONOTIFS_STORAGE_KEY = 'yifa_farms_autonotifs_v2';

// Simple synthesized Web Audio chime for incoming orders
function playOrderChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch {
    // ignore audio failure if autoplay policy blocks
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

  // 2. Legacy Quotes List
  const [quotesList, setQuotesList] = useState<QuoteRequest[]>(() => {
    try {
      const savedQuotes = localStorage.getItem(QUOTES_STORAGE_KEY);
      if (savedQuotes) return JSON.parse(savedQuotes);
    } catch {
      // Fallback
    }
    return [];
  });

  // 3. Unified Orders
  const [orders, setOrders] = useState<UnifiedOrder[]>(() => {
    try {
      const savedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (savedOrders) return JSON.parse(savedOrders);
    } catch {
      // Fallback
    }
    return initialUnifiedOrders;
  });

  // 4. Unified Inventory
  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    try {
      const savedInv = localStorage.getItem(INVENTORY_STORAGE_KEY);
      if (savedInv) return JSON.parse(savedInv);
    } catch {
      // Fallback
    }
    return initialInventoryData;
  });

  // 5. Staff Accounts & Active Session
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

  // 6. Real-time Notifications
  const [notifications, setNotifications] = useState<AdminNotification[]>(() => {
    try {
      const savedNotifs = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      if (savedNotifs) return JSON.parse(savedNotifs);
    } catch {
      // Fallback
    }
    return initialNotifications;
  });

  // 7. Sound Preference
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      const savedSound = localStorage.getItem(SOUND_STORAGE_KEY);
      if (savedSound !== null) return JSON.parse(savedSound);
    } catch {
      // Fallback
    }
    return true;
  });

  // 8. Customers Directory
  const [customers, setCustomers] = useState<CustomerAccount[]>(() => {
    try {
      const savedCust = localStorage.getItem(CUSTOMERS_STORAGE_KEY);
      if (savedCust) return JSON.parse(savedCust);
    } catch {
      // Fallback
    }
    return initialCustomers;
  });

  // 9. Suppliers
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    try {
      const savedSup = localStorage.getItem(SUPPLIERS_STORAGE_KEY);
      if (savedSup) return JSON.parse(savedSup);
    } catch {
      // Fallback
    }
    return initialSuppliers;
  });

  // 10. Purchase Orders
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(() => {
    try {
      const savedPOs = localStorage.getItem(POS_STORAGE_KEY);
      if (savedPOs) return JSON.parse(savedPOs);
    } catch {
      // Fallback
    }
    return initialPurchaseOrders;
  });

  // 11. Activity Logs
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    try {
      const savedAct = localStorage.getItem(ACTIVITY_STORAGE_KEY);
      if (savedAct) return JSON.parse(savedAct);
    } catch {
      // Fallback
    }
    return initialActivityLogs;
  });

  // 12. Automated Notification Logs
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

  // Persistence side-effects
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }, [config]);

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

  // Notifications count
  const unreadNotificationsCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  const lowStockCount = useMemo(() => {
    return inventory.filter((i) => i.currentStock <= i.lowStockThreshold).length;
  }, [inventory]);

  const toggleSound = () => setSoundEnabled((prev) => !prev);

  const addNotification = useCallback((notif: Omit<AdminNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: AdminNotification = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: 'Just now',
      read: false,
      ...notif
    };
    setNotifications((prev) => [newNotif, ...prev]);
    if (soundEnabled) {
      playOrderChime();
    }
  }, [soundEnabled]);

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
        description: `Updated customer profile ID #${id}.`
      });
    },
    [addActivityLog]
  );

  const deleteCustomer = useCallback(
    (id: string) => {
      const toDelete = customers.find((c) => c.id === id);
      setCustomers((prev) => prev.filter((c) => c.id !== id));
      if (toDelete) {
        addActivityLog({
          actionType: 'customer_update',
          description: `Deleted customer profile for ${toDelete.name}.`
        });
      }
      return true;
    },
    [customers, addActivityLog]
  );

  const awardLoyaltyPoints = useCallback(
    (customerId: string, pointsDelta: number, reason?: string) => {
      setCustomers((prev) =>
        prev.map((c) => {
          if (c.id !== customerId) return c;
          const newPts = Math.max(0, c.loyaltyPoints + pointsDelta);
          let newTier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' = c.loyaltyTier;
          if (newPts >= 2000) newTier = 'Platinum';
          else if (newPts >= 1000) newTier = 'Gold';
          else if (newPts >= 500) newTier = 'Silver';
          else newTier = 'Bronze';

          return {
            ...c,
            loyaltyPoints: newPts,
            loyaltyTier: newTier
          };
        })
      );
      const cust = customers.find((c) => c.id === customerId);
      addActivityLog({
        actionType: 'customer_update',
        description: `Awarded ${pointsDelta >= 0 ? '+' : ''}${pointsDelta} loyalty points to ${cust?.name || customerId} (${reason || 'Manual Adjustment'}).`
      });
    },
    [customers, addActivityLog]
  );

  // Supplier & PO Management
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
        description: `Updated supplier details for ID #${id}.`
      });
    },
    [addActivityLog]
  );

  const deleteSupplier = useCallback(
    (id: string) => {
      const toDelete = suppliers.find((s) => s.id === id);
      setSuppliers((prev) => prev.filter((s) => s.id !== id));
      if (toDelete) {
        addActivityLog({
          actionType: 'supplier_po',
          description: `Deleted supplier entry: ${toDelete.name}.`
        });
      }
      return true;
    },
    [suppliers, addActivityLog]
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

      // Update PO status
      setPurchaseOrders((prev) =>
        prev.map((po) =>
          po.id === poId
            ? { ...po, status: 'received', receivedDate: 'Today' }
            : po
        )
      );

      // Auto-increment inventory stock if matched
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
        description: `Received PO #${targetPO.poNumber} from ${targetPO.supplierName}. Inventory replenished automatically.`,
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

  // Unified Inventory Updates
  const updateInventoryStock = useCallback(
    (inventoryId: string, deltaOrExact: number, isDelta = false, reason = 'Manual Adjustment') => {
      setInventory((prev) =>
        prev.map((item) => {
          if (item.id === inventoryId) {
            const nextStock = Math.max(0, isDelta ? item.currentStock + deltaOrExact : deltaOrExact);
            const status =
              nextStock === 0
                ? 'out_of_stock'
                : nextStock <= item.lowStockThreshold
                ? 'low_stock'
                : 'in_stock';

            // Check if this went low
            if (nextStock <= item.lowStockThreshold && item.currentStock > item.lowStockThreshold) {
              addNotification({
                type: 'low_stock',
                title: `Low Stock Alert: ${item.name}`,
                message: `Remaining stock is ${nextStock} ${item.unit} (Below ${item.lowStockThreshold} ${item.unit} threshold).`,
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

      const target = inventory.find((i) => i.id === inventoryId);
      addActivityLog({
        actionType: 'inventory_update',
        description: `Adjusted stock for ${target?.name || inventoryId}: ${isDelta ? (deltaOrExact >= 0 ? `+${deltaOrExact}` : deltaOrExact) : `Set to ${deltaOrExact}`} (${reason}).`,
        targetId: inventoryId
      });
    },
    [inventory, addNotification, addActivityLog]
  );

  const updateInventoryPricing = useCallback(
    (inventoryId: string, unitPrice: number, wholesalePrice: number, unitCost?: number) => {
      setInventory((prev) =>
        prev.map((item) => {
          if (item.id === inventoryId) {
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
      addActivityLog({
        actionType: 'inventory_update',
        description: `Updated pricing for inventory ID #${inventoryId} (Retail: ₦${unitPrice.toLocaleString()}, Wholesale: ₦${wholesalePrice.toLocaleString()}).`,
        targetId: inventoryId
      });
    },
    [addActivityLog]
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
          // match either by productId or by id
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

      // 3. Auto sync/update Customer account & loyalty points
      setCustomers((prevCusts) => {
        const existingIndex = prevCusts.findIndex(
          (c) => c.phone.replace(/\D/g, '') === newOrder.phone.replace(/\D/g, '') || (newOrder.email && c.email === newOrder.email)
        );

        const earnedPoints = Math.round(newOrder.totalAmount / 1000); // 1 point per ₦1,000

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
          // Create new customer record
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

      // 4. Trigger Real-time Notification
      addNotification({
        type: 'new_order',
        title: `New Order: #${newOrder.id}`,
        message: `${newOrder.customerName} placed an order for ₦${newOrder.totalAmount.toLocaleString()} (${newOrder.items.length} items).`,
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
        description: `Changed order #${orderId} status to '${status.toUpperCase()}'${options?.driver ? ` (Assigned: ${options.driver})` : ''}.`,
        orderId
      });

      addNotification({
        type: 'status_change',
        title: `Order #${orderId} Status Updated`,
        message: `Order for ${targetOrder?.customerName || 'Customer'} marked as ${status.toUpperCase()}.`,
        orderId
      });

      // Send automated notification on dispatch or delivery
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
        description: `Bulk updated ${orderIds.length} orders to status '${newStatus.toUpperCase()}'.`
      });

      addNotification({
        type: 'status_change',
        title: `Bulk Order Status Updated`,
        message: `${orderIds.length} orders were updated to ${newStatus.toUpperCase()}.`
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
          o.id.toLowerCase() === orderId.toLowerCase() ||
          o.id.replace(/\D/g, '') === orderId.replace(/\D/g, '')
      );
    },
    [orders]
  );

  // Legacy Quote Submission
  const submitQuote = async (quote: QuoteRequest): Promise<{ success: boolean; id: string }> => {
    const quoteId = `YIFA-${Math.floor(1000 + Math.random() * 9000)}`;
    const newQuoteRecord: QuoteRequest = {
      ...quote,
      id: quoteId,
      createdAt: new Date().toISOString(),
      status: 'new'
    };

    setQuotesList((prev) => [newQuoteRecord, ...prev]);

    // Also automatically create a UnifiedOrder
    let unitPrice = 4200;
    let prodId = 'fresh-eggs';
    if (quote.productCategory === 'Frozen Chicken') {
      unitPrice = 4200;
      prodId = 'frozen-chicken';
    } else if (quote.productCategory === 'Fish') {
      unitPrice = 3050;
      prodId = 'aquaculture-catfish';
    } else if (quote.productCategory === 'Rams & Goats') {
      unitPrice = 48000;
      prodId = 'northern-rams-goats';
    } else if (quote.productCategory === 'Vegetables') {
      unitPrice = 8500;
      prodId = 'fresh-vegetables';
    } else if (quote.productCategory === 'Live Poultry') {
      unitPrice = 3950;
      prodId = 'live-birds-poultry';
    }

    const subtotal = quote.quantity * unitPrice;
    const deliveryFee = 2500;
    const totalAmount = subtotal + deliveryFee;

    const mappedCustomerType: UnifiedOrder['customerType'] =
      quote.customerType.toLowerCase().includes('caterer')
        ? 'caterer'
        : quote.customerType.toLowerCase().includes('hotel')
        ? 'hotel'
        : quote.customerType.toLowerCase().includes('wholesaler')
        ? 'wholesaler'
        : 'household';

    await addOrder({
      customerName: quote.fullName,
      phone: quote.phoneOrWhatsapp,
      whatsapp: quote.phoneOrWhatsapp,
      email: quote.email || '',
      customerType: mappedCustomerType,
      deliveryAddress: quote.deliveryLocation,
      items: [
        {
          productId: prodId,
          name: `${quote.productCategory} (${quote.specificItem})`,
          category: prodId,
          quantity: quote.quantity,
          unit: quote.unit,
          unitPrice,
          totalPrice: subtotal
        }
      ],
      subtotal,
      discount: 0,
      deliveryFee,
      totalAmount,
      status: 'pending',
      paymentStatus: 'Pending',
      paymentMethod: 'Bank Transfer / WhatsApp Quote',
      notes: quote.message ? `Quote Note: ${quote.message} (Frequency: ${quote.frequency})` : `Frequency: ${quote.frequency}`,
      source: 'storefront'
    });

    return { success: true, id: quoteId };
  };

  // Staff & RBAC
  const loginStaff = (email: string, password = 'admin') => {
    const user = staffAccounts.find(
      (s) => s.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (!user) {
      return { success: false, message: 'Invalid credentials. Staff account not found.' };
    }
    if (user.status !== 'active') {
      return { success: false, message: 'This staff account is currently inactive.' };
    }
    // Update lastLogin
    const updatedUser = { ...user, lastLogin: 'Just now' };
    setCurrentStaffUser(updatedUser);
    setStaffAccounts((prev) =>
      prev.map((s) => (s.id === user.id ? updatedUser : s))
    );

    addActivityLog({
      actionType: 'staff_change',
      description: `${user.fullName} (${user.role.toUpperCase()}) signed in to the admin portal.`
    });

    return { success: true, user: updatedUser };
  };

  const logoutStaff = () => {
    if (currentStaffUser) {
      addActivityLog({
        actionType: 'staff_change',
        description: `${currentStaffUser.fullName} signed out.`
      });
    }
    setCurrentStaffUser(null);
  };

  const addStaffAccount = (staff: Omit<StaffMember, 'id' | 'createdAt'>) => {
    const newStaff: StaffMember = {
      ...staff,
      id: `staff-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setStaffAccounts((prev) => [newStaff, ...prev]);
    addActivityLog({
      actionType: 'staff_change',
      description: `Provisioned new staff account: ${newStaff.fullName} (${newStaff.role.toUpperCase()}).`
    });
  };

  const updateStaffAccount = (id: string, updates: Partial<StaffMember>) => {
    setStaffAccounts((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
    if (currentStaffUser?.id === id) {
      setCurrentStaffUser((prev) => (prev ? { ...prev, ...updates } : null));
    }
    addActivityLog({
      actionType: 'staff_change',
      description: `Updated staff profile ID #${id}.`
    });
  };

  const deleteStaffAccount = (id: string): boolean => {
    if (staffAccounts.length <= 1) return false;
    const toDelete = staffAccounts.find((s) => s.id === id);
    setStaffAccounts((prev) => prev.filter((s) => s.id !== id));
    if (toDelete) {
      addActivityLog({
        actionType: 'staff_change',
        description: `Deleted staff profile: ${toDelete.fullName}.`
      });
    }
    return true;
  };

  const updateConfig = (newConfig: Partial<FarmConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  };

  const resetConfig = () => {
    setConfig(initialFarmConfig);
    localStorage.removeItem(STORAGE_KEY);
  };

  const toggleBadgeVisibility = () => {
    setConfig((prev) => ({ ...prev, showClientBadges: !prev.showClientBadges }));
  };

  // Real-time Sales Metrics calculation
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
        updateInventoryStock,
        updateInventoryPricing,
        updateInventoryFreshness,
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

export interface FarmConfig {
  farmName: string;
  tagline: string;
  foundedYear: number;
  founderName: string;
  shopAddress?: string;
  locationCity?: string;
  locationState: string;
  locationCountry: string;
  exactAddress: string;
  isAddressConfirmed: boolean;
  phoneDisplay: string;
  phoneRaw: string;
  whatsappNumber: string;
  whatsappDisplay: string;
  email: string;
  openingHours: string;
  dispatchDays: string;
  birdCapacityText: string;
  isBirdCapacityConfirmed: boolean;
  dailyEggProductionText: string;
  isDailyEggConfirmed: boolean;
  acreageText: string;
  facebookUrl?: string;
  instagramUrl?: string;
  twitterUrl?: string;
  showClientBadges: boolean;
}

export interface ProductItem {
  id: string;
  name: string;
  tagline: string;
  category: 'eggs' | 'chicken' | 'vegetables' | 'poultry' | 'fish' | 'livestock';
  description: string;
  features: string[];
  specs: {
    unit: string;
    packaging: string;
    shelfLife?: string;
    minOrder: string;
    availability: string;
    estimatedPrice?: string;
    isPriceConfirmed?: boolean;
  };
  image: string;
  badge?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'poultry' | 'eggs' | 'vegetables' | 'facilities';
  description: string;
  image: string;
  isClientPlaceholder?: boolean;
}

export interface SupplyTarget {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  typicalOrders: string[];
  benefits: string[];
}

export interface QuoteRequest {
  id?: string;
  fullName: string;
  phoneOrWhatsapp: string;
  email?: string;
  productCategory: string;
  specificItem: string;
  quantity: number;
  unit: string;
  customerType: string;
  deliveryLocation: string;
  frequency: string;
  message: string;
  createdAt?: string;
  status?: 'new' | 'contacted' | 'fulfilled';
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  organization?: string;
  location: string;
  segment: 'caterer' | 'family' | 'retailer' | 'hotel';
  content: string;
  rating: number;
  highlight: string;
  verified: boolean;
  avatarText: string;
}

export interface OrderStatusRecord {
  invoiceNumber: string;
  customerName: string;
  items: string[];
  totalVolume: string;
  destination: string;
  currentStage: 1 | 2 | 3 | 4;
  stageName: 'Order Confirmed' | 'Quality Batching' | 'Dispatched & En Route' | 'Delivered';
  stageDescription: string;
  orderDate: string;
  estimatedDelivery: string;
  dispatchDriver?: string;
  vehicleNote?: string;
  paymentStatus: 'Paid' | 'Cash on Delivery' | 'Commercial Credit';
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'dispatched'
  | 'delivered'
  | 'cancelled';

export type PaymentStatus =
  | 'Paid'
  | 'Cash on Delivery'
  | 'Commercial Credit'
  | 'Pending';

export interface OrderItem {
  productId: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
}

export interface UnifiedOrder {
  id: string; // e.g. YIFA-8421
  customerName: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  customerType: 'household' | 'caterer' | 'wholesaler' | 'hotel' | 'retailer' | 'other';
  deliveryAddress: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  orderDate: string; // ISO or human-readable
  estimatedDelivery?: string;
  dispatchDriver?: string;
  vehicleNote?: string;
  stageDescription?: string;
  notes?: string;
  source: 'storefront' | 'admin_manual' | 'whatsapp';
  createdAt: string; // ISO string for precise date filtering & sorting
}

export interface InventoryItem {
  id: string;
  productId: string;
  name: string;
  category: 'eggs' | 'chicken' | 'vegetables' | 'poultry' | 'fish' | 'livestock';
  currentStock: number;
  unit: string;
  lowStockThreshold: number;
  reorderLevel: number;
  unitCost: number; // NGN
  unitPrice: number; // NGN
  wholesalePrice: number; // NGN
  lastRestocked: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  image?: string;
  // Perishables & Freshness Tracking
  batchNumber?: string;
  harvestDate?: string;
  expiryDate?: string;
  shelfLifeDays?: number;
  freshnessStatus?: 'freshly_harvested' | 'optimal' | 'expiring_soon' | 'expired';
}

export interface CustomerAccount {
  id: string;
  name: string;
  phone: string;
  email?: string;
  customerType: 'household' | 'caterer' | 'wholesaler' | 'hotel' | 'retailer' | 'other';
  address: string;
  savedAddresses: string[];
  ordersCount: number;
  totalSpent: number;
  loyaltyTier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  loyaltyPoints: number;
  notes?: string;
  lastOrderDate?: string;
  createdAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  category: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  itemsSupplied: string[];
  status: 'active' | 'inactive';
  rating: number;
}

export interface PurchaseOrderItem {
  name: string;
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
  productId?: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  items: PurchaseOrderItem[];
  totalCost: number;
  status: 'draft' | 'ordered' | 'received' | 'cancelled';
  orderDate: string;
  expectedDeliveryDate: string;
  receivedDate?: string;
  notes?: string;
}

export interface ActivityLog {
  id: string;
  actorName: string;
  actorRole: StaffRole;
  actionType:
    | 'order_status'
    | 'order_create'
    | 'inventory_update'
    | 'supplier_po'
    | 'staff_change'
    | 'customer_update'
    | 'bulk_action'
    | 'notification_sent';
  description: string;
  timestamp: string;
  orderId?: string;
  targetId?: string;
}

export interface AutomatedNotificationLog {
  id: string;
  orderId: string;
  customerName: string;
  channel: 'sms' | 'email' | 'whatsapp';
  type: 'order_confirmed' | 'dispatched' | 'delivered';
  recipient: string;
  message: string;
  sentAt: string;
  status: 'sent' | 'delivered';
}

export type StaffRole = 'admin' | 'staff';

export interface StaffMember {
  id: string;
  fullName: string;
  email: string;
  role: StaffRole;
  title: string;
  status: 'active' | 'inactive';
  phone: string;
  lastLogin?: string;
  createdAt: string;
  permissions: {
    canManageOrders: boolean;
    canUpdateDispatch: boolean;
    canManageInventory: boolean;
    canViewFinancials: boolean;
    canManageStaff: boolean;
    canExportReports: boolean;
  };
}

export interface AdminNotification {
  id: string;
  type: 'new_order' | 'low_stock' | 'status_change' | 'quote_request';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  orderId?: string;
  inventoryId?: string;
}

export type PageType =
  | 'home'
  | 'products'
  | 'quote'
  | 'track'
  | 'facilities'
  | 'why-us'
  | 'gallery'
  | 'contact'
  | 'admin';


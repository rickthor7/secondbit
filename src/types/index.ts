// Product Types
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  ratingCount: number;
  soldCount: number;
  umkmId: string;
  umkmName: string;
  type: "normal" | "flash-deal" | "surplus" | "bundle";
  isBestSeller?: boolean;
  pickupTime?: string;
  productionTime?: string;
  shelfLife?: string;
  stock: number;
  flashDealEndsAt?: string;
  // Limited Surplus & Margin Protection
  maxSurplusPerUser?: number;
  requiresRegularItem?: boolean;
  surplusPolicyNote?: string;
  // Surplus Bundle Fields
  isBundle?: boolean;
  bundleItems?: string[];
  bundleSavings?: number;
  bundleMarginNote?: string;
}

export interface SurplusBundle {
  id: string;
  name: string;
  regularItem: string;
  surplusItem: string;
  drinksItem?: string;
  bundlePrice: number;
  normalPrice: number;
  portions: number;
  status: "Aktif" | "Habis";
  marginProtectionRate: string;
}

export interface UMKM {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  coverImage: string;
  category: string;
  rating: number;
  ratingCount: number;
  address: string;
  distance?: string;
  operatingHours: string;
  isOpen: boolean;
  isMVP?: boolean;
  isHiddenGem?: boolean;
  totalProducts: number;
  totalSold: number;
  products?: Product[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  slug: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  products: OrderItem[];
  totalPrice: number;
  status: OrderStatus;
  paymentMethod: string;
  pickupTime: string;
  createdAt: string;
  umkmName: string;
  qrCode?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  image: string;
}

export type OrderStatus =
  | "pending_payment"
  | "paid"
  | "ready_for_pickup"
  | "picked_up"
  | "completed"
  | "cancelled"
  | "expired"
  | "refund_requested"
  | "refunded";

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
  productId?: string;
  umkmId?: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  bgColor: string;
}

export type UserRole = "buyer" | "seller" | "admin";

// Analytics Types
export interface DailySalesPoint {
  date: string;
  label: string;
  revenue: number;
  orders: number;
  portions: number;
  surplus: number;
}

export interface HourlyTrafficPoint {
  hour: string;
  orders: number;
}

// Seller Operational Types
export type SellerOrderStatus = "Baru Dibayar" | "Siap Pickup" | "Selesai" | "Dibatalkan";

export interface SellerOrder {
  id: string;
  customer: string;
  items: string;
  total: number;
  status: SellerOrderStatus;
  createdAt: string;
  pickupCode: string;
}

export interface Settlement {
  id: string;
  date: string;
  amount: number;
  status: "Dicairkan" | "Diproses" | "Menunggu";
  method: string;
}

export interface SurplusItem {
  id: string;
  name: string;
  portions: number;
  originalPrice: number;
  price: number;
  pickupWindow: string;
  status: "Aktif" | "Habis" | "Kedaluwarsa";
}

// Buyer Types
export interface Voucher {
  id: string;
  title: string;
  code: string;
  minSpend: number;
  discount: number;
  type: "nominal" | "percent";
  expiresAt: string;
}

// Admin Types
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "Aktif" | "Ditangguhkan";
  joinedAt: string;
  orders: number;
}

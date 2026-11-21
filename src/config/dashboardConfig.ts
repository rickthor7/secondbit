import {
  Activity,
  BarChart3,
  ClipboardList,
  Gem,
  Gift,
  Heart,
  LayoutDashboard,
  Leaf,
  Package,
  QrCode,
  ShoppingBag,
  Sparkles,
  Star,
  Store,
  Users,
  Wallet,
  Zap,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

export type DashboardRole = "buyer" | "seller" | "admin";

export interface DashboardNavItem {
  /** id unik; dipakai untuk menandai menu aktif */
  id: string;
  label: string;
  icon: LucideIcon;
  /** Selalu berupa path halaman, contoh "/buyer/orders" */
  target: string;
}

export interface DashboardNavGroup {
  label: string;
  items: DashboardNavItem[];
}

export interface DashboardRoleConfig {
  roleLabel: string;
  kicker: string;
  title: string;
  home: string;
  accent: string;
  quickAction: { label: string; icon: LucideIcon; target: string };
  notificationItems: string[];
  /** Palet sidebar */
  sidebar: {
    background: string;
    text: string;
    muted: string;
    border: string;
    activeBackground: string;
    activeText: string;
    cardBackground: string;
  };
  /** Palet navbar */
  navbar: {
    background: string;
    text: string;
    muted: string;
    border: string;
  };
  user: {
    name: string;
    meta: string;
    avatar: string;
  };
  nav: DashboardNavGroup[];
  notifications: number;
}

export const dashboardConfig: Record<DashboardRole, DashboardRoleConfig> = {
  buyer: {
    roleLabel: "Pembeli",
    kicker: "Akun Pembeli",
    title: "Dashboard Pembeli",
    home: "/buyer",
    accent: "var(--primary)",
    quickAction: { label: "Pesan Lagi", icon: ShoppingBag, target: "/explore" },
    notificationItems: [
      "Pesanan SB-20260922-001 siap diambil di Warung Bu Siti",
      "Voucher Rp5.000 kamu akan hangus besok",
      "Flash Deal baru: Nasi Ayam Penyet diskon 33%",
    ],
    sidebar: {
      background: "var(--background)",
      text: "var(--foreground)",
      muted: "var(--muted)",
      border: "var(--border)",
      activeBackground: "var(--primary-light)",
      activeText: "var(--primary)",
      cardBackground: "var(--surface)",
    },
    navbar: {
      background: "var(--background)",
      text: "var(--foreground)",
      muted: "var(--muted)",
      border: "var(--border)",
    },
    user: {
      name: "Ahmad Rizky",
      meta: "Pembeli · UNESA Ketintang",
      avatar: "A",
    },
    nav: [
      {
        label: "Akun Saya",
        items: [
          { id: "buyer-overview", label: "Ringkasan Akun", icon: LayoutDashboard, target: "/buyer" },
          { id: "buyer-orders", label: "Pesanan Saya", icon: ClipboardList, target: "/buyer/orders" },
          { id: "buyer-pickup", label: "Ambil Pesanan", icon: QrCode, target: "/buyer/pickup" },
          { id: "buyer-impact", label: "Impact Kamu", icon: Leaf, target: "/buyer/impact" },
          { id: "buyer-favorites", label: "Produk Favorit", icon: Heart, target: "/buyer/favorites" },
        ],
      },
      {
        label: "Promo & Ulasan",
        items: [
          { id: "buyer-vouchers", label: "Voucher Saya", icon: Gift, target: "/buyer/vouchers" },
          { id: "buyer-reviews", label: "Ulasan Saya", icon: Star, target: "/buyer/reviews" },
        ],
      },
      {
        label: "Jelajahi",
        items: [
          { id: "explore", label: "Kuliner", icon: ShoppingBag, target: "/explore" },
          { id: "flash-deals", label: "Flash Deal", icon: Zap, target: "/flash-deals" },
          { id: "hidden-gem", label: "Hidden Gem", icon: Gem, target: "/hidden-gem" },
        ],
      },
    ],
    notifications: 2,
  },
  seller: {
    roleLabel: "Mitra UMKM",
    kicker: "Portal Mitra",
    title: "Dashboard UMKM",
    home: "/seller",
    accent: "#FF8A6B",
    quickAction: { label: "Lihat Toko", icon: Store, target: "/umkm/warung-bu-siti" },
    notificationItems: [
      "3 pesanan baru menunggu konfirmasi",
      "Stok Nasi Pecel Komplit tersisa 50 porsi",
      "Saldo Rp1.250.000 siap dicairkan",
    ],
    sidebar: {
      background: "#1C1C1E",
      text: "#FFFFFF",
      muted: "rgba(255,255,255,0.62)",
      border: "rgba(255,255,255,0.09)",
      activeBackground: "rgba(238, 77, 45, 0.20)",
      activeText: "#FF9C82",
      cardBackground: "rgba(255,255,255,0.06)",
    },
    navbar: {
      background: "#232326",
      text: "#FFFFFF",
      muted: "rgba(255,255,255,0.62)",
      border: "rgba(255,255,255,0.09)",
    },
    user: {
      name: "Warung Bu Siti",
      meta: "Mitra MVP · ★ 4.8",
      avatar: "🏪",
    },
    nav: [
      {
        label: "Toko Saya",
        items: [
          { id: "seller-overview", label: "Ringkasan Toko", icon: LayoutDashboard, target: "/seller" },
          { id: "seller-analytics", label: "Analisis Penjualan", icon: Sparkles, target: "/seller/analytics" },
          { id: "seller-orders", label: "Pesanan Masuk", icon: ClipboardList, target: "/seller/orders" },
        ],
      },
      {
        label: "Kelola Toko",
        items: [
          { id: "seller-products", label: "Produk Saya", icon: Package, target: "/seller/products" },
          { id: "seller-surplus", label: "Surplus Rescue", icon: Leaf, target: "/seller/surplus" },
          { id: "seller-sop", label: "SOP & Mitigasi Risiko", icon: ShieldCheck, target: "/seller/sop-risk" },
          { id: "seller-scanner", label: "Scanner QR", icon: QrCode, target: "/seller/scanner" },
          { id: "seller-balance", label: "Saldo & Pencairan", icon: Wallet, target: "/seller/balance" },
        ],
      },
      {
        label: "Jelajahi",
        items: [
          { id: "store", label: "Halaman Toko", icon: Store, target: "/umkm/warung-bu-siti" },
          { id: "marketplace", label: "Marketplace", icon: ShoppingBag, target: "/" },
        ],
      },
    ],
    notifications: 3,
  },
  admin: {
    roleLabel: "Administrator",
    kicker: "Panel Admin",
    title: "Dashboard Admin",
    home: "/admin",
    accent: "#7FB2FF",
    quickAction: { label: "Lihat Situs", icon: Store, target: "/" },
    notificationItems: [
      "3 UMKM menunggu verifikasi",
      "1 permintaan refund perlu ditinjau",
      "GMV hari ini naik 22% dibanding kemarin",
    ],
    sidebar: {
      background: "#16213E",
      text: "#FFFFFF",
      muted: "rgba(255,255,255,0.60)",
      border: "rgba(255,255,255,0.10)",
      activeBackground: "rgba(127, 178, 255, 0.16)",
      activeText: "#9CC6FF",
      cardBackground: "rgba(255,255,255,0.06)",
    },
    navbar: {
      background: "#1B2A4A",
      text: "#FFFFFF",
      muted: "rgba(255,255,255,0.60)",
      border: "rgba(255,255,255,0.10)",
    },
    user: {
      name: "Admin SecondBit",
      meta: "Super Admin · Akses penuh",
      avatar: "SA",
    },
    nav: [
      {
        label: "Platform",
        items: [
          { id: "admin-overview", label: "Ringkasan Platform", icon: LayoutDashboard, target: "/admin" },
          { id: "admin-activity", label: "Aktivitas", icon: Activity, target: "/admin/activity" },
          { id: "admin-reports", label: "Laporan & Analitik", icon: BarChart3, target: "/admin/reports" },
        ],
      },
      {
        label: "Manajemen",
        items: [
          { id: "admin-users", label: "Kelola Pembeli", icon: Users, target: "/admin/users" },
          { id: "admin-umkm", label: "Kelola UMKM", icon: Store, target: "/admin/umkm" },
          { id: "admin-products", label: "Kelola Produk", icon: Package, target: "/admin/products" },
          { id: "admin-sop", label: "Audit SOP & Risiko", icon: ShieldCheck, target: "/seller/sop-risk" },
          { id: "admin-transactions", label: "Kelola Transaksi", icon: ShoppingBag, target: "/admin/transactions" },
        ],
      },
      {
        label: "Keuangan & Review",
        items: [
          { id: "admin-settlements", label: "Settlement", icon: Wallet, target: "/admin/settlements" },
          { id: "admin-reviews", label: "Rating & Review", icon: Star, target: "/admin/reviews" },
        ],
      },
      {
        label: "Pemantauan",
        items: [
          { id: "marketplace", label: "Marketplace", icon: Store, target: "/" },
          { id: "flash-deals", label: "Flash Deal", icon: Zap, target: "/flash-deals" },
          { id: "hidden-gem", label: "Hidden Gem", icon: Gem, target: "/hidden-gem" },
        ],
      },
    ],
    notifications: 5,
  },
};

export function isDashboardPath(pathname: string): boolean {
  return (["/buyer", "/seller", "/admin"] as const).some(
    (base) => pathname === base || pathname.startsWith(`${base}/`)
  );
}

export function getDashboardRole(pathname: string): DashboardRole | null {
  if (pathname === "/buyer" || pathname.startsWith("/buyer/")) return "buyer";
  if (pathname === "/seller" || pathname.startsWith("/seller/")) return "seller";
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return "admin";
  return null;
}

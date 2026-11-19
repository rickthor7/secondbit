import {
  CheckCircle2,
  Clock,
  Package,
  ShoppingBag,
  Star,
  Store,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import type { PillTone } from "@/components/dashboard/StatusPill";
import type { StatTone } from "@/components/dashboard/StatCard";
import {
  adminUsers,
  formatPrice,
  orders,
  products,
  reviews,
  sellerOrders,
  settlementHistory,
  umkmList,
} from "@/data/mockData";

export type AdminModuleKey =
  | "users"
  | "umkm"
  | "products"
  | "transactions"
  | "settlements"
  | "reviews";

export interface ModuleColumn {
  header: string;
  align?: "left" | "right" | "center";
}

export interface ModuleCell {
  text: string;
  sub?: string;
  tone?: PillTone;
  strong?: boolean;
}

export interface ModuleRow {
  id: string;
  cells: ModuleCell[];
}

export interface ModuleStat {
  label: string;
  value: string;
  hint?: string;
  tone: StatTone;
  icon: LucideIcon;
}

export interface AdminModuleConfig {
  kicker: string;
  title: string;
  description: string;
  stats: ModuleStat[];
  columns: ModuleColumn[];
  rows: ModuleRow[];
  note?: string;
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const ROLE_LABEL: Record<string, string> = {
  buyer: "Pembeli",
  seller: "UMKM",
  admin: "Admin",
};

const PRODUCT_TYPE_LABEL: Record<string, string> = {
  normal: "Reguler",
  "flash-deal": "Flash Deal",
  surplus: "Surplus",
};

const ORDER_STATUS_LABEL: Record<string, string> = {
  pending_payment: "Menunggu Bayar",
  paid: "Dibayar",
  ready_for_pickup: "Siap Pickup",
  picked_up: "Diambil",
  completed: "Selesai",
  cancelled: "Dibatalkan",
  expired: "Kedaluwarsa",
  refund_requested: "Refund Ditinjau",
  refunded: "Refund",
};

const ORDER_STATUS_TONE: Record<string, PillTone> = {
  pending_payment: "warning",
  paid: "info",
  ready_for_pickup: "success",
  picked_up: "success",
  completed: "success",
  cancelled: "danger",
  expired: "neutral",
  refund_requested: "warning",
  refunded: "info",
};

const totalProducts = products.length;
const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
const flashDealCount = products.filter((product) => product.type === "flash-deal").length;
const surplusCount = products.filter((product) => product.type === "surplus").length;

const gmv = orders.reduce((sum, order) => sum + order.totalPrice, 0);
const completedTransactions = orders.filter((order) => order.status === "completed").length;

const disbursed = settlementHistory
  .filter((item) => item.status === "Dicairkan")
  .reduce((sum, item) => sum + item.amount, 0);
const pendingSettlements = settlementHistory.filter((item) => item.status !== "Dicairkan").length;

const averageRating =
  reviews.length === 0
    ? 0
    : reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
const fiveStar = reviews.filter((review) => review.rating === 5).length;

export const adminModules: Record<AdminModuleKey, AdminModuleConfig> = {
  users: {
    kicker: "Manajemen",
    title: "Kelola Pembeli",
    description: "Data akun pembeli, status verifikasi, dan aktivitas transaksi mereka.",
    stats: [
      { label: "Total Pengguna", value: String(adminUsers.length), tone: "primary", icon: Users },
      {
        label: "Pembeli Aktif",
        value: String(adminUsers.filter((user) => user.role === "buyer" && user.status === "Aktif").length),
        tone: "success",
        icon: CheckCircle2,
      },
      {
        label: "UMKM Terdaftar",
        value: String(adminUsers.filter((user) => user.role === "seller").length),
        tone: "info",
        icon: Store,
      },
      {
        label: "Ditangguhkan",
        value: String(adminUsers.filter((user) => user.status === "Ditangguhkan").length),
        tone: "danger",
        icon: Clock,
      },
    ],
    columns: [
      { header: "Pengguna" },
      { header: "Peran" },
      { header: "Status" },
      { header: "Bergabung" },
      { header: "Pesanan", align: "right" },
    ],
    rows: adminUsers.map((user) => ({
      id: user.id,
      cells: [
        { text: user.name, sub: user.email, strong: true },
        { text: ROLE_LABEL[user.role] ?? user.role },
        { text: user.status, tone: user.status === "Aktif" ? "success" : "danger" },
        { text: formatDate(user.joinedAt) },
        { text: String(user.orders) },
      ],
    })),
  },
  umkm: {
    kicker: "Manajemen",
    title: "Kelola UMKM",
    description: "Verifikasi mitra, pantau performa toko, dan kelola status buka-tutup.",
    stats: [
      { label: "Total UMKM", value: String(umkmList.length), tone: "primary", icon: Store },
      {
        label: "Sedang Buka",
        value: String(umkmList.filter((umkm) => umkm.isOpen).length),
        tone: "success",
        icon: CheckCircle2,
      },
      {
        label: "Mitra MVP",
        value: String(umkmList.filter((umkm) => umkm.isMVP).length),
        tone: "warning",
        icon: Star,
      },
      {
        label: "Total Produk",
        value: String(totalProducts),
        tone: "info",
        icon: Package,
      },
    ],
    columns: [
      { header: "Toko" },
      { header: "Kategori" },
      { header: "Rating", align: "right" },
      { header: "Produk", align: "right" },
      { header: "Status" },
    ],
    rows: umkmList.map((umkm) => ({
      id: umkm.id,
      cells: [
        { text: umkm.name, sub: umkm.address, strong: true },
        { text: umkm.category },
        { text: `${umkm.rating} (${umkm.ratingCount})` },
        { text: String(umkm.totalProducts) },
        { text: umkm.isOpen ? "Buka" : "Tutup", tone: umkm.isOpen ? "success" : "neutral" },
      ],
    })),
  },
  products: {
    kicker: "Manajemen",
    title: "Kelola Produk",
    description: "Seluruh produk lintas UMKM, termasuk stok dan program diskon.",
    stats: [
      { label: "Total Produk", value: String(totalProducts), tone: "primary", icon: Package },
      { label: "Total Stok", value: `${totalStock} porsi`, tone: "info", icon: ShoppingBag },
      { label: "Flash Deal", value: String(flashDealCount), tone: "warning", icon: Clock },
      { label: "Surplus", value: String(surplusCount), tone: "success", icon: CheckCircle2 },
    ],
    columns: [
      { header: "Produk" },
      { header: "UMKM" },
      { header: "Harga", align: "right" },
      { header: "Stok", align: "right" },
      { header: "Tipe" },
    ],
    rows: products.map((product) => ({
      id: product.id,
      cells: [
        { text: product.name, sub: product.category, strong: true },
        { text: product.umkmName },
        { text: formatPrice(product.price) },
        {
          text: String(product.stock),
          tone: product.stock <= 5 ? "warning" : undefined,
        },
        {
          text: PRODUCT_TYPE_LABEL[product.type] ?? product.type,
          tone: product.type === "surplus" ? "success" : product.type === "flash-deal" ? "warning" : "neutral",
        },
      ],
    })),
  },
  transactions: {
    kicker: "Manajemen",
    title: "Kelola Transaksi",
    description: "Rekap pesanan pembeli beserta status pembayaran dan pickup.",
    stats: [
      { label: "Total Transaksi", value: String(orders.length), tone: "primary", icon: ShoppingBag },
      { label: "GMV", value: formatPrice(gmv), tone: "success", icon: Wallet },
      { label: "Selesai", value: String(completedTransactions), tone: "info", icon: CheckCircle2 },
      {
        label: "Pesanan Toko",
        value: String(sellerOrders.length),
        tone: "warning",
        icon: Clock,
      },
    ],
    columns: [
      { header: "Pesanan" },
      { header: "UMKM" },
      { header: "Total", align: "right" },
      { header: "Metode" },
      { header: "Status" },
    ],
    rows: orders.map((order) => ({
      id: order.id,
      cells: [
        { text: order.orderNumber, sub: formatDate(order.createdAt), strong: true },
        { text: order.umkmName },
        { text: formatPrice(order.totalPrice) },
        { text: order.paymentMethod },
        {
          text: ORDER_STATUS_LABEL[order.status] ?? order.status,
          tone: ORDER_STATUS_TONE[order.status] ?? "neutral",
        },
      ],
    })),
  },
  settlements: {
    kicker: "Keuangan",
    title: "Settlement Mitra",
    description: "Riwayat pencairan dana mitra UMKM dan status pemrosesannya.",
    stats: [
      { label: "Total Settlement", value: String(settlementHistory.length), tone: "primary", icon: Wallet },
      { label: "Total Dicairkan", value: formatPrice(disbursed), tone: "success", icon: CheckCircle2 },
      { label: "Dalam Proses", value: String(pendingSettlements), tone: "warning", icon: Clock },
      {
        label: "Rata-rata",
        value: formatPrice(Math.round(disbursed / Math.max(settlementHistory.filter((item) => item.status === "Dicairkan").length, 1))),
        tone: "info",
        icon: Store,
      },
    ],
    columns: [
      { header: "ID" },
      { header: "Tanggal" },
      { header: "Rekening" },
      { header: "Nominal", align: "right" },
      { header: "Status", align: "right" },
    ],
    rows: settlementHistory.map((item) => ({
      id: item.id,
      cells: [
        { text: item.id, strong: true },
        { text: formatDate(item.date) },
        { text: item.method },
        { text: formatPrice(item.amount) },
        {
          text: item.status,
          tone:
            item.status === "Dicairkan"
              ? "success"
              : item.status === "Diproses"
              ? "info"
              : "warning",
        },
      ],
    })),
  },
  reviews: {
    kicker: "Keuangan & Review",
    title: "Rating & Review",
    description: "Pantau kualitas layanan mitra lewat ulasan pembeli.",
    stats: [
      { label: "Total Ulasan", value: String(reviews.length), tone: "primary", icon: Star },
      { label: "Rata-rata", value: averageRating.toFixed(1), tone: "warning", icon: Star },
      { label: "Bintang 5", value: String(fiveStar), tone: "success", icon: CheckCircle2 },
      {
        label: "Perlu Respons",
        value: String(reviews.length - fiveStar),
        tone: "info",
        icon: Clock,
      },
    ],
    columns: [
      { header: "Pembeli" },
      { header: "Produk" },
      { header: "Rating", align: "center" },
      { header: "Ulasan" },
      { header: "Tanggal", align: "right" },
    ],
    rows: reviews.map((review) => {
      const product = products.find((item) => item.id === review.productId);
      return {
        id: review.id,
        cells: [
          { text: review.userName, strong: true },
          { text: product?.name ?? "—", sub: product?.umkmName },
          { text: `${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}` },
          { text: review.comment.length > 64 ? `${review.comment.slice(0, 61)}...` : review.comment },
          { text: formatDate(review.createdAt) },
        ],
      };
    }),
  },
};

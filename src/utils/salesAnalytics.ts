import type { DailySalesPoint, HourlyTrafficPoint, Product } from "@/types";
import { formatPrice } from "@/data/mockData";

/**
 * Mesin analisis penjualan untuk dashboard UMKM.
 *
 * Saat ini berjalan sepenuhnya di sisi klien memakai data 7 hari terakhir
 * (deterministik, tanpa panggilan jaringan). Ketika backend sudah tersedia,
 * cukup ganti pemanggilan `analyzeSales` dengan respons API dan UI tidak
 * perlu diubah.
 */

export type InsightTone = "positive" | "warning" | "neutral";
export type InsightIcon = "trend" | "cart" | "clock" | "package" | "leaf";
export type SurplusRisk = "rendah" | "sedang" | "tinggi";

export interface SalesInsight {
  id: string;
  tone: InsightTone;
  icon: InsightIcon;
  title: string;
  detail: string;
}

export interface ProductPerformance {
  id: string;
  name: string;
  price: number;
  soldCount: number;
  stock: number;
  type: Product["type"];
}

export interface SalesAnalysis {
  generatedAt: Date;
  /** Tingkat keyakinan model terhadap data historis yang tersedia (0-100). */
  confidence: number;
  totals: {
    revenue: number;
    orders: number;
    portions: number;
    surplus: number;
    avgDailyRevenue: number;
  };
  today: DailySalesPoint;
  yesterday: DailySalesPoint;
  growth: { revenue: number; orders: number; portions: number };
  avgTicket: number;
  peakWindow: { start: string; end: string; share: number };
  bestDay: DailySalesPoint;
  forecast: { revenue: number; surplus: number };
  surplusRisk: SurplusRisk;
  surplusRatio: number;
  potentialRescueValue: number;
  topProducts: ProductPerformance[];
  stockHeavyProduct?: ProductPerformance;
  insights: SalesInsight[];
}

interface AnalyzeParams {
  daily: DailySalesPoint[];
  hourly: HourlyTrafficPoint[];
  products: Product[];
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function percentChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

function roundTo(value: number, step: number): number {
  return Math.round(value / step) * step;
}

function formatAbsolutePercent(value: number): string {
  return `${Math.round(Math.abs(value))}%`;
}

function buildPeakWindow(hourly: HourlyTrafficPoint[]): { start: string; end: string; share: number } {
  if (hourly.length === 0) {
    return { start: "11", end: "13", share: 0 };
  }

  const totalOrders = hourly.reduce((sum, point) => sum + point.orders, 0);

  // Cari jendela 2 jam berurutan dengan pesanan terbanyak, bukan hanya jam puncak tunggal.
  let bestStart = 0;
  let bestSum = -1;

  hourly.forEach((point, index) => {
    const windowSum = point.orders + (hourly[index + 1]?.orders ?? 0);
    if (windowSum > bestSum) {
      bestSum = windowSum;
      bestStart = index;
    }
  });

  const firstHour = hourly[bestStart].hour;
  const lastHour = hourly[Math.min(bestStart + 1, hourly.length - 1)].hour;

  return {
    start: firstHour,
    end: String(Number(lastHour) + 1).padStart(2, "0"),
    share: totalOrders === 0 ? 0 : Math.round((bestSum / totalOrders) * 100),
  };
}

function buildConfidence(daily: DailySalesPoint[]): number {
  const revenues = daily.map((day) => day.revenue);
  const mean = average(revenues);
  if (mean === 0) return 60;

  const variance = average(revenues.map((value) => (value - mean) ** 2));
  const coefficient = Math.sqrt(variance) / mean;

  return Math.round(clamp(88 - coefficient * 50, 60, 94));
}

function toPerformance(product: Product): ProductPerformance {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    soldCount: product.soldCount,
    stock: product.stock,
    type: product.type,
  };
}

export function analyzeSales({ daily, hourly, products }: AnalyzeParams): SalesAnalysis {
  const totals = daily.reduce(
    (acc, day) => ({
      revenue: acc.revenue + day.revenue,
      orders: acc.orders + day.orders,
      portions: acc.portions + day.portions,
      surplus: acc.surplus + day.surplus,
    }),
    { revenue: 0, orders: 0, portions: 0, surplus: 0 }
  );

  const today = daily[daily.length - 1];
  const yesterday = daily[daily.length - 2] ?? today;

  const growth = {
    revenue: percentChange(today.revenue, yesterday.revenue),
    orders: percentChange(today.orders, yesterday.orders),
    portions: percentChange(today.portions, yesterday.portions),
  };

  const avgTicket = today.orders === 0 ? 0 : today.revenue / today.orders;
  const peakWindow = buildPeakWindow(hourly);

  const bestDay = daily.reduce(
    (best, day) => (day.revenue > best.revenue ? day : best),
    daily[0]
  );

  // Prediksi omzet: weighted moving average 3 hari terakhir + momentum harian.
  const recent = daily.slice(-3);
  const weights = [0.5, 0.3, 0.2];
  const weightOf = (index: number) => weights[recent.length - 1 - index] ?? 0;
  const weightSum = recent.reduce((sum, _day, index) => sum + weightOf(index), 0);
  const weightedSum = recent.reduce((sum, day, index) => sum + day.revenue * weightOf(index), 0);
  const weightedAverage = weightSum === 0 ? 0 : weightedSum / weightSum;
  const momentum = clamp((growth.revenue / 100) * 0.4, -0.08, 0.08);
  const forecastRevenue = roundTo(weightedAverage * (1 + momentum), 5000);

  const recentSurplus = average(daily.slice(-3).map((day) => day.surplus));
  const forecastSurplus = Math.max(Math.round(recentSurplus), 0);

  const surplusRatio = totals.portions === 0 ? 0 : (totals.surplus / totals.portions) * 100;
  const surplusRisk: SurplusRisk =
    surplusRatio < 15 ? "rendah" : surplusRatio <= 25 ? "sedang" : "tinggi";

  const sortedBySold = [...products].sort((a, b) => b.soldCount - a.soldCount);
  const topProducts = sortedBySold.slice(0, 3).map(toPerformance);
  const stockHeavy = [...products].sort((a, b) => b.stock - a.stock)[0];

  const surplusPrice = average(
    products.filter((product) => product.type === "surplus").map((product) => product.price)
  );
  const potentialRescueValue = Math.round(forecastSurplus * (surplusPrice || avgTicket));

  const confidence = buildConfidence(daily);

  const insights: SalesInsight[] = [];

  insights.push({
    id: "revenue",
    tone: growth.revenue >= 0 ? "positive" : "warning",
    icon: "trend",
    title: `Omzet ${growth.revenue >= 0 ? "naik" : "turun"} ${formatAbsolutePercent(growth.revenue)} dari kemarin`,
    detail: `Hari ini ${formatPrice(today.revenue)} dari ${today.orders} pesanan. Rata-rata belanja ${formatPrice(
      Math.round(avgTicket)
    )} per pesanan.`,
  });

  insights.push({
    id: "orders",
    tone: growth.orders >= 0 ? "neutral" : "warning",
    icon: "cart",
    title: `Volume pesanan ${growth.orders >= 0 ? "naik" : "turun"} ${formatAbsolutePercent(growth.orders)}`,
    detail:
      growth.orders < 0 && growth.revenue > 0
        ? "Omzet tetap naik karena nilai transaksi per pesanan ikut naik. Jaga volume dengan paket combo agar pendapatan tidak bergantung pada harga saja."
        : "Dorong menu pendamping dan paket hemat untuk menaikkan nilai transaksi berikutnya.",
  });

  insights.push({
    id: "peak",
    tone: "neutral",
    icon: "clock",
    title: `Jam ramai ${peakWindow.start}.00–${peakWindow.end}.00 (${peakWindow.share}% pesanan)`,
    detail: `Siapkan stok menu utama sebelum ${peakWindow.start}.00, lalu jadwalkan produksi surplus setelah jam ramai agar tidak menumpuk.`,
  });

  if (stockHeavy && stockHeavy.stock > 0) {
    const flashPrice = Math.round((stockHeavy.price * 0.75) / 250) * 250;
    insights.push({
      id: "stock",
      tone: "warning",
      icon: "package",
      title: `${stockHeavy.name} menyisakan ${stockHeavy.stock} porsi`,
      detail: `Stok tertinggi di menu kamu. Pertimbangkan Flash Deal pukul 15.00–17.00 dengan diskon ±25% (${formatPrice(
        flashPrice
      )}) agar habis sebelum tutup.`,
    });
  }

  insights.push({
    id: "surplus",
    tone: surplusRisk === "tinggi" ? "warning" : "neutral",
    icon: "leaf",
    title: `Prediksi surplus besok ${forecastSurplus} porsi (risiko ${surplusRisk})`,
    detail: `Rasio surplus 7 hari terakhir ${Math.round(surplusRatio)}%. Aktifkan Surplus Rescue mulai pukul 15.00 — potensi modal terselamatkan ±${formatPrice(
      potentialRescueValue
    )}.`,
  });

  return {
    generatedAt: new Date(),
    confidence,
    totals: {
      ...totals,
      avgDailyRevenue: Math.round(totals.revenue / Math.max(daily.length, 1)),
    },
    today,
    yesterday,
    growth,
    avgTicket,
    peakWindow,
    bestDay,
    forecast: {
      revenue: forecastRevenue,
      surplus: forecastSurplus,
    },
    surplusRisk,
    surplusRatio,
    potentialRescueValue,
    topProducts,
    stockHeavyProduct: stockHeavy ? toPerformance(stockHeavy) : undefined,
    insights,
  };
}

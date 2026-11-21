import type { DailySalesPoint, HourlyTrafficPoint, Product } from "@/types";
import { formatPrice } from "@/data/mockData";

/**
 * Mesin analisis penjualan & simulasi AI untuk dashboard UMKM.
 * Dilengkapi faktor eksternal kawasan kampus (Kalender Akademik UNESA & Cuaca Surabaya).
 */

export type InsightTone = "positive" | "warning" | "neutral";
export type InsightIcon = "trend" | "cart" | "clock" | "package" | "leaf";
export type SurplusRisk = "rendah" | "sedang" | "tinggi";

export type AcademicSeason = "regular" | "exam" | "graduation" | "vacation";
export type WeatherType = "sunny" | "heavy_rain" | "extreme_heat" | "cloudy";

export interface AcademicCalendarConfig {
  season: AcademicSeason;
  label: string;
  badge: string;
  campus: string;
  trafficMultiplier: number;
  surplusRiskMultiplier: number;
  description: string;
}

export interface WeatherConfig {
  type: WeatherType;
  label: string;
  icon: string;
  temp: string;
  trafficMultiplier: number;
  surplusRiskMultiplier: number;
  description: string;
}

export const ACADEMIC_SEASONS: Record<AcademicSeason, AcademicCalendarConfig> = {
  regular: {
    season: "regular",
    label: "Kuliah Reguler (Senin - Kamis)",
    badge: "Traffic Normal",
    campus: "UNESA Ketintang",
    trafficMultiplier: 1.0,
    surplusRiskMultiplier: 1.0,
    description: "Jadwal kuliah tatap muka normal. Puncak keramaian stabil di jam 11.30 - 13.30.",
  },
  exam: {
    season: "exam",
    label: "Pekan Ujian (UTS / UAS Kampus)",
    badge: "Aktivitas Malam (+25%)",
    campus: "UNESA Ketintang",
    trafficMultiplier: 1.25,
    surplusRiskMultiplier: 0.65,
    description: "Mahasiswa belajar di sekitar kampus hingga sore & malam. Permintaan makan dan camilan meningkat tajam.",
  },
  graduation: {
    season: "graduation",
    label: "Musim Wisuda & PKKMB UNESA",
    badge: "Lonjakan Tertinggi (+50%)",
    campus: "UNESA Ketintang",
    trafficMultiplier: 1.5,
    surplusRiskMultiplier: 0.35,
    description: "Ribuan wisudawan & keluarga memadati area kampus. Demand makan siang meledak drastis.",
  },
  vacation: {
    season: "vacation",
    label: "Libur Semester / Akhir Pekan",
    badge: "Kampus Lengang (-50%)",
    campus: "UNESA Ketintang",
    trafficMultiplier: 0.52,
    surplusRiskMultiplier: 2.2,
    description: "Mayoritas mahasiswa kos pulang kampung. Traffic anjlok drastis, risiko makanan berlebih sangat tinggi.",
  },
};

export const WEATHER_CONDITIONS: Record<WeatherType, WeatherConfig> = {
  sunny: {
    type: "sunny",
    label: "Cerah Bersahabat",
    icon: "☀️",
    temp: "31°C",
    trafficMultiplier: 1.0,
    surplusRiskMultiplier: 1.0,
    description: "Cuaca cerah, pejalan kaki dan mahasiswa leluasa membeli makanan langsung di warung.",
  },
  heavy_rain: {
    type: "heavy_rain",
    label: "Hujan Deras / Badai Sore",
    icon: "⛈️",
    temp: "26°C",
    trafficMultiplier: 0.72,
    surplusRiskMultiplier: 1.85,
    description: "Mahasiswa tertahan di gedung/kos. Dine-in turun drastis, risiko sisa makanan dingin melonjak.",
  },
  extreme_heat: {
    type: "extreme_heat",
    label: "Panas Terik Surabaya",
    icon: "🌡️",
    temp: "35°C",
    trafficMultiplier: 0.94,
    surplusRiskMultiplier: 1.15,
    description: "Suhu Surabaya panas menyengat. Minuman & es melonjak +50%, jam makan berat bergeser menjelang sore.",
  },
  cloudy: {
    type: "cloudy",
    label: "Mendung & Gerimis Sore",
    icon: "⛅",
    temp: "28°C",
    trafficMultiplier: 0.88,
    surplusRiskMultiplier: 1.3,
    description: "Cuaca mendung membuat mahasiswa cenderung makan di tempat terdekat atau takeaway lebih awal.",
  },
};

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
  // Simulasi Faktor Eksternal Lingkungan
  factors: {
    academic: AcademicSeason;
    weather: WeatherType;
    academicConfig: AcademicCalendarConfig;
    weatherConfig: WeatherConfig;
    combinedDemandMultiplier: number;
    combinedSurplusMultiplier: number;
    simulationNote: string;
  };
}

interface AnalyzeParams {
  daily: DailySalesPoint[];
  hourly: HourlyTrafficPoint[];
  products: Product[];
  factors?: {
    academic?: AcademicSeason;
    weather?: WeatherType;
  };
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

export function analyzeSales({ daily, hourly, products, factors }: AnalyzeParams): SalesAnalysis {
  const academicConfig = ACADEMIC_SEASONS[factors?.academic || "regular"];
  const weatherConfig = WEATHER_CONDITIONS[factors?.weather || "heavy_rain"];

  const combinedMultiplier = academicConfig.trafficMultiplier * weatherConfig.trafficMultiplier;
  const combinedSurplusMultiplier = academicConfig.surplusRiskMultiplier * weatherConfig.surplusRiskMultiplier;

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

  // Prediksi omzet dasar: weighted moving average 3 hari terakhir + momentum harian
  const recent = daily.slice(-3);
  const weights = [0.5, 0.3, 0.2];
  const weightOf = (index: number) => weights[recent.length - 1 - index] ?? 0;
  const weightSum = recent.reduce((sum, _day, index) => sum + weightOf(index), 0);
  const weightedSum = recent.reduce((sum, day, index) => sum + day.revenue * weightOf(index), 0);
  const weightedAverage = weightSum === 0 ? 0 : weightedSum / weightSum;
  const momentum = clamp((growth.revenue / 100) * 0.4, -0.08, 0.08);
  const baseForecastRevenue = weightedAverage * (1 + momentum);

  // Penyesuaian simulasi faktor cuaca & kalender akademik kampus
  const forecastRevenue = roundTo(baseForecastRevenue * combinedMultiplier, 5000);

  const baseSurplus = average(daily.slice(-3).map((day) => day.surplus));
  const forecastSurplus = Math.max(Math.round(baseSurplus * combinedSurplusMultiplier), 0);

  const surplusRatio = totals.portions === 0 ? 0 : (totals.surplus / totals.portions) * 100;
  const simulatedRatio = surplusRatio * combinedSurplusMultiplier;

  const surplusRisk: SurplusRisk =
    forecastSurplus >= 8 || simulatedRatio > 24
      ? "tinggi"
      : forecastSurplus >= 4 || simulatedRatio >= 14
      ? "sedang"
      : "rendah";

  const sortedBySold = [...products].sort((a, b) => b.soldCount - a.soldCount);
  const topProducts = sortedBySold.slice(0, 3).map(toPerformance);
  const stockHeavy = [...products].sort((a, b) => b.stock - a.stock)[0];

  const surplusPrice = average(
    products.filter((product) => product.type === "surplus").map((product) => product.price)
  );
  const potentialRescueValue = Math.round(forecastSurplus * (surplusPrice || avgTicket));

  const confidence = buildConfidence(daily);

  const insights: SalesInsight[] = [];

  // Insight 1: Dampak Simulasi Faktor Eksternal (Kalender Kampus & Cuaca Surabaya)
  let simulationTitle = "";
  let simulationDetail = "";
  let simulationTone: InsightTone = "neutral";

  if (academicConfig.season === "vacation" || weatherConfig.type === "heavy_rain") {
    simulationTone = "warning";
    const dropPct = Math.max(Math.round((1 - combinedMultiplier) * 100), 5);
    simulationTitle = `⚠️ Peringatan Faktor: ${academicConfig.label} & ${weatherConfig.label}`;
    simulationDetail = `Kombinasi cuaca ${weatherConfig.label} (${weatherConfig.icon}) dan kalender ${academicConfig.campus} diperkirakan menekan traffic pelanggan hingga -${dropPct}%. Risiko surplus membengkak ke ${forecastSurplus} porsi. Disarankan kurangi kuota masak lauk 20-30% atau pasang Surplus Bundle lebih awal.`;
  } else if (academicConfig.season === "graduation" || academicConfig.season === "exam") {
    simulationTone = "positive";
    const surgePct = Math.round((combinedMultiplier - 1) * 100);
    simulationTitle = `🔥 Lonjakan Permintaan: ${academicConfig.label} (+${surgePct}% Demand)`;
    simulationDetail = `Area ${academicConfig.campus} dipadati mahasiswa/wisudawan. Tingkatkan porsi masak menu utama sebesar +${Math.round(surgePct * 0.8)}%. Peluang surplus sangat minim (${forecastSurplus} porsi). Maksimalkan stok di jam 11.00–14.00.`;
  } else if (weatherConfig.type === "extreme_heat") {
    simulationTone = "neutral";
    simulationTitle = `🌡️ Cuaca Panas Surabaya (${weatherConfig.temp}): Minuman Melonjak!`;
    simulationDetail = `Suhu tinggi Ketintang mendorong peningkatan penjualan es & minuman hingga +50%. Sediakan stok es teh/es jeruk lebih banyak dan tawarkan paket combo minum untuk menaikkan rata-rata belanja.`;
  } else {
    simulationTone = "positive";
    simulationTitle = `☀️ Kondisi Stabil: ${academicConfig.label} & Cuaca Cerah`;
    simulationDetail = `Aktivitas di sekitar UNESA Ketintang berlangsung optimal. Pertahankan produksi normal ${today.portions} porsi dan jalankan penyelamatan surplus terjadwal pada pukul 16.30.`;
  }

  insights.push({
    id: "simulation-factor",
    tone: simulationTone,
    icon: "trend",
    title: simulationTitle,
    detail: simulationDetail,
  });

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
    detail: `Tingkat risiko surplus ${surplusRisk.toUpperCase()} berdasarkan faktor kalender & cuaca. Potensi modal tertahan ±${formatPrice(
      potentialRescueValue
    )}. Gunakan fitur Surplus Rescue & Bundling agar modal tetap berputar.`,
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
    factors: {
      academic: academicConfig.season,
      weather: weatherConfig.type,
      academicConfig,
      weatherConfig,
      combinedDemandMultiplier: combinedMultiplier,
      combinedSurplusMultiplier,
      simulationNote: simulationDetail,
    },
  };
}

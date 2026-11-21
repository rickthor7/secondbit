import { useCallback, useEffect, useRef, useState } from "react";
import {
  Sparkles,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Clock,
  Package,
  Leaf,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Calendar,
  CloudRain,
  Sun,
  GraduationCap,
  AlertTriangle,
  type LucideIcon,
} from "lucide-react";
import {
  formatPrice,
  getProductsByUMKM,
  sellerHourlyTraffic,
  sellerWeeklySales,
} from "@/data/mockData";
import {
  analyzeSales,
  ACADEMIC_SEASONS,
  WEATHER_CONDITIONS,
  type AcademicSeason,
  type WeatherType,
  type InsightIcon,
  type InsightTone,
  type SalesAnalysis,
  type SalesInsight,
} from "@/utils/salesAnalytics";

interface AISalesInsightProps {
  umkmId: string;
  defaultExpanded?: boolean;
}

const TONES: Record<InsightTone, { color: string; background: string }> = {
  positive: { color: "var(--success)", background: "var(--success-light)" },
  warning: { color: "var(--warning)", background: "var(--warning-light)" },
  neutral: { color: "var(--info)", background: "var(--info-light)" },
};

const ICONS: Record<InsightIcon, LucideIcon> = {
  trend: TrendingUp,
  cart: ShoppingBag,
  clock: Clock,
  package: Package,
  leaf: Leaf,
};

const RISK_COLOR: Record<SalesAnalysis["surplusRisk"], string> = {
  rendah: "var(--success)",
  sedang: "var(--warning)",
  tinggi: "var(--destructive)",
};

function formatRelativeTime(date: Date, now: number): string {
  const seconds = Math.max(Math.floor((now - date.getTime()) / 1000), 0);
  if (seconds < 15) return "baru saja";
  if (seconds < 60) return `${seconds} detik lalu`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} menit lalu`;

  return `${Math.floor(minutes / 60)} jam lalu`;
}

export default function AISalesInsight({ umkmId, defaultExpanded = false }: AISalesInsightProps) {
  const [analysis, setAnalysis] = useState<SalesAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [now, setNow] = useState(() => Date.now());
  const timerRef = useRef<number | null>(null);

  // Simulasi Faktor Eksternal Kampus
  const [academicSeason, setAcademicSeason] = useState<AcademicSeason>("regular");
  const [weatherType, setWeatherType] = useState<WeatherType>("heavy_rain");

  const runAnalysis = useCallback(
    (academic: AcademicSeason = academicSeason, weather: WeatherType = weatherType) => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);

      setLoading(true);
      timerRef.current = window.setTimeout(() => {
        setAnalysis(
          analyzeSales({
            daily: sellerWeeklySales,
            hourly: sellerHourlyTraffic,
            products: getProductsByUMKM(umkmId),
            factors: {
              academic,
              weather,
            },
          })
        );
        setLoading(false);
        setNow(Date.now());
        timerRef.current = null;
      }, 500);
    },
    [umkmId, academicSeason, weatherType]
  );

  useEffect(() => {
    runAnalysis();
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, [runAnalysis]);

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 30000);
    return () => window.clearInterval(interval);
  }, []);

  const handleAcademicChange = (newSeason: AcademicSeason) => {
    setAcademicSeason(newSeason);
    runAnalysis(newSeason, weatherType);
  };

  const handleWeatherChange = (newWeather: WeatherType) => {
    setWeatherType(newWeather);
    runAnalysis(academicSeason, newWeather);
  };

  const renderInsight = (insight: SalesInsight) => {
    const tone = TONES[insight.tone];
    const Icon =
      insight.icon === "trend" && analysis && analysis.growth.revenue < 0
        ? TrendingDown
        : ICONS[insight.icon];

    return (
      <div
        key={insight.id}
        style={{
          display: "flex",
          gap: 12,
          padding: "12px 14px",
          borderRadius: "var(--radius-lg)",
          backgroundColor: "var(--surface)",
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            flexShrink: 0,
            borderRadius: "var(--radius-md)",
            backgroundColor: tone.background,
            color: tone.color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={16} />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", marginBottom: 3 }}>
            {insight.title}
          </div>
          <div style={{ fontSize: 12, lineHeight: 1.55, color: "var(--muted)" }}>
            {insight.detail}
          </div>
        </div>
      </div>
    );
  };

  const academicConfig = ACADEMIC_SEASONS[academicSeason];
  const weatherConfig = WEATHER_CONDITIONS[weatherType];

  return (
    <section
      style={{
        backgroundColor: "var(--background)",
        borderRadius: "var(--radius-xl)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-sm)",
        marginBottom: 24,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
          padding: "16px 20px",
          background:
            "linear-gradient(135deg, rgba(109, 90, 230, 0.12) 0%, rgba(109, 90, 230, 0.02) 70%)",
          borderBottom: "1px solid var(--border-light)",
        }}
      >
        <div
          style={{
            width: 38,
            height: 38,
            flexShrink: 0,
            borderRadius: "var(--radius-md)",
            background: "linear-gradient(135deg, #7C5CFF 0%, #5B3FD1 100%)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Sparkles size={19} />
        </div>

        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--foreground)", margin: 0 }}>
              Simulasi AI Penjualan & Prediksi Stok
            </h3>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.4px",
                padding: "2px 7px",
                borderRadius: "var(--radius-full)",
                backgroundColor: "rgba(109, 90, 230, 0.14)",
                color: "#6D5AE6",
              }}
            >
              FAKTOR KAMPUS + CUACA
            </span>
          </div>
          <p style={{ fontSize: 12, color: "var(--muted)", margin: "3px 0 0" }}>
            {loading || !analysis
              ? "Menghitung proyeksi stok & risiko surplus…"
              : `Model prediktif kawasan UNESA Ketintang • diperbarui ${formatRelativeTime(analysis.generatedAt, now)}`}
          </p>
        </div>

        <button
          type="button"
          onClick={() => runAnalysis()}
          disabled={loading}
          aria-label="Analisis ulang penjualan"
          className="btn btn-sm btn-outline"
          style={{
            gap: 6,
            fontSize: 12,
            fontWeight: 600,
            cursor: loading ? "wait" : "pointer",
            opacity: loading ? 0.65 : 1,
            backgroundColor: "var(--background)",
          }}
        >
          <RefreshCw size={14} className={loading ? "spin" : undefined} />
          <span>{loading ? "Menghitung…" : "Simulasi Ulang"}</span>
        </button>
      </div>

      <div style={{ padding: "18px 20px 20px" }} aria-live="polite">
        {/* Simulator Factors Controls */}
        <div
          style={{
            backgroundColor: "var(--surface-sunken)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border)",
            padding: "14px 16px",
            marginBottom: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 8,
              marginBottom: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <GraduationCap size={16} style={{ color: "#7C5CFF" }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--foreground)" }}>
                Simulasi Faktor Eksternal Kampus (Ubah Faktor untuk Uji AI):
              </span>
            </div>
            <span style={{ fontSize: 11, color: "var(--muted)", fontWeight: 500 }}>
              📍 Kawasan UNESA Ketintang, Surabaya
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 12,
            }}
          >
            {/* Faktor 1: Kalender Akademik */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, fontWeight: 600, color: "var(--muted)", marginBottom: 6 }}>
                <Calendar size={13} />
                1. Kalender Akademik Kampus:
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {(Object.keys(ACADEMIC_SEASONS) as AcademicSeason[]).map((seasonKey) => {
                  const cfg = ACADEMIC_SEASONS[seasonKey];
                  const active = academicSeason === seasonKey;
                  return (
                    <button
                      key={seasonKey}
                      type="button"
                      onClick={() => handleAcademicChange(seasonKey)}
                      style={{
                        padding: "5px 10px",
                        borderRadius: "var(--radius-md)",
                        border: active ? "1.5px solid #7C5CFF" : "1px solid var(--border)",
                        backgroundColor: active ? "rgba(124, 92, 255, 0.12)" : "var(--surface)",
                        color: active ? "#7C5CFF" : "var(--foreground)",
                        fontSize: 11,
                        fontWeight: active ? 700 : 500,
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {cfg.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Faktor 2: Cuaca */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, fontWeight: 600, color: "var(--muted)", marginBottom: 6 }}>
                <CloudRain size={13} />
                2. Prakiraan Cuaca Surabaya:
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {(Object.keys(WEATHER_CONDITIONS) as WeatherType[]).map((wKey) => {
                  const cfg = WEATHER_CONDITIONS[wKey];
                  const active = weatherType === wKey;
                  return (
                    <button
                      key={wKey}
                      type="button"
                      onClick={() => handleWeatherChange(wKey)}
                      style={{
                        padding: "5px 10px",
                        borderRadius: "var(--radius-md)",
                        border: active ? "1.5px solid #EE4D2D" : "1px solid var(--border)",
                        backgroundColor: active ? "rgba(238, 77, 45, 0.1)" : "var(--surface)",
                        color: active ? "#EE4D2D" : "var(--foreground)",
                        fontSize: 11,
                        fontWeight: active ? 700 : 500,
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {cfg.icon} {cfg.label} ({cfg.temp})
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Current Impact Summary Pill */}
          {analysis && (
            <div
              style={{
                marginTop: 10,
                paddingTop: 8,
                borderTop: "1px dashed var(--border-light)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 8,
                fontSize: 11.5,
              }}
            >
              <span style={{ color: "var(--muted)" }}>
                ⚙️ <strong>Pengali Dampak AI:</strong> Traffic {(analysis.factors.combinedDemandMultiplier * 100).toFixed(0)}% • Risiko Surplus x{analysis.factors.combinedSurplusMultiplier.toFixed(1)}
              </span>
              <span
                style={{
                  fontWeight: 700,
                  color:
                    analysis.factors.combinedDemandMultiplier >= 1.2
                      ? "var(--success)"
                      : analysis.factors.combinedDemandMultiplier <= 0.75
                      ? "var(--destructive)"
                      : "var(--primary)",
                }}
              >
                {analysis.factors.combinedDemandMultiplier >= 1
                  ? `+${Math.round((analysis.factors.combinedDemandMultiplier - 1) * 100)}% Potensi Lonjakan`
                  : `-${Math.round((1 - analysis.factors.combinedDemandMultiplier) * 100)}% Penurunan Traffic Mahasiswa`}
              </span>
            </div>
          )}
        </div>

        {loading || !analysis ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10 }}>
              {[0, 1, 2].map((i) => (
                <div key={i} className="skeleton" style={{ height: 76 }} />
              ))}
            </div>
            {[0, 1, 2].map((i) => (
              <div key={i} className="skeleton" style={{ height: 58 }} />
            ))}
          </div>
        ) : (
          <>
            {/* Ringkasan metrik prediksi dengan faktor eksternal */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                gap: 10,
                marginBottom: 14,
              }}
            >
              {[
                {
                  label: "Omzet Historis 7 Hari",
                  value: formatPrice(analysis.totals.revenue),
                  sub: `Rata-rata ${formatPrice(analysis.totals.avgDailyRevenue)}/hari`,
                  valueColor: "var(--foreground)",
                },
                {
                  label: "Prediksi Omzet Besok",
                  value: formatPrice(analysis.forecast.revenue),
                  sub: `Tersimulasi Kalender & Cuaca`,
                  valueColor: "var(--primary)",
                },
                {
                  label: "Prediksi Surplus Besok",
                  value: `${analysis.forecast.surplus} Porsi`,
                  sub: `Risiko: ${analysis.surplusRisk.toUpperCase()}`,
                  valueColor: RISK_COLOR[analysis.surplusRisk],
                },
              ].map((metric) => (
                <div
                  key={metric.label}
                  style={{
                    padding: "12px 14px",
                    borderRadius: "var(--radius-lg)",
                    backgroundColor: "var(--surface)",
                  }}
                >
                  <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 500, marginBottom: 4 }}>
                    {metric.label}
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 800, color: metric.valueColor, lineHeight: 1.2 }}>
                    {metric.value}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 3 }}>{metric.sub}</div>
                </div>
              ))}
            </div>

            {/* Insight utama (termasuk rekomendasi simulasi) */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {analysis.insights.slice(0, 3).map(renderInsight)}
            </div>

            {/* Detail analisis */}
            {expanded && (
              <div
                style={{
                  marginTop: 16,
                  paddingTop: 16,
                  borderTop: "1px dashed var(--border)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {analysis.insights.slice(3).map(renderInsight)}
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                    gap: 16,
                  }}
                >
                  {/* Jam tersibuk */}
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", marginBottom: 10 }}>
                      <Clock size={14} style={{ verticalAlign: "middle", marginRight: 6, color: "var(--muted)" }} />
                      Jam Tersibuk Toko
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {[...sellerHourlyTraffic]
                        .sort((a, b) => b.orders - a.orders)
                        .slice(0, 4)
                        .map((slot) => {
                          const maxOrders = Math.max(...sellerHourlyTraffic.map((s) => s.orders));
                          return (
                            <div key={slot.hour} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <span
                                style={{
                                  fontSize: 11,
                                  color: "var(--muted)",
                                  width: 42,
                                  fontVariantNumeric: "tabular-nums",
                                }}
                              >
                                {slot.hour}.00
                              </span>
                              <div
                                style={{
                                  flex: 1,
                                  height: 6,
                                  borderRadius: "var(--radius-full)",
                                  backgroundColor: "var(--surface)",
                                  overflow: "hidden",
                                }}
                              >
                                <div
                                  style={{
                                    width: `${maxOrders === 0 ? 0 : (slot.orders / maxOrders) * 100}%`,
                                    height: "100%",
                                    borderRadius: "var(--radius-full)",
                                    backgroundColor: "var(--primary)",
                                  }}
                                />
                              </div>
                              <span style={{ fontSize: 11, color: "var(--muted)", width: 66, textAlign: "right" }}>
                                {slot.orders} pesanan
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  </div>

                  {/* Produk terlaris */}
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", marginBottom: 10 }}>
                      <Package size={14} style={{ verticalAlign: "middle", marginRight: 6, color: "var(--muted)" }} />
                      Menu Terlaris & Rekomendasi Stok
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {analysis.topProducts.map((product, index) => {
                        const maxSold = Math.max(...analysis.topProducts.map((p) => p.soldCount));
                        return (
                          <div key={product.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 11, color: "var(--muted)", width: 14 }}>{index + 1}</span>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div
                                style={{
                                  fontSize: 12,
                                  fontWeight: 500,
                                  color: "var(--foreground)",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {product.name}
                              </div>
                              <div
                                style={{
                                  height: 4,
                                  marginTop: 4,
                                  borderRadius: "var(--radius-full)",
                                  backgroundColor: "var(--surface)",
                                  overflow: "hidden",
                                }}
                              >
                                <div
                                  style={{
                                    width: `${maxSold === 0 ? 0 : (product.soldCount / maxSold) * 100}%`,
                                    height: "100%",
                                    borderRadius: "var(--radius-full)",
                                    backgroundColor: "var(--success)",
                                  }}
                                />
                              </div>
                            </div>
                            <span style={{ fontSize: 11, color: "var(--muted)", width: 62, textAlign: "right" }}>
                              {product.soldCount} terjual
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                flexWrap: "wrap",
                marginTop: 14,
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 11,
                  color: "var(--muted)",
                }}
              >
                <ShieldCheck size={13} style={{ color: "var(--success)" }} />
                Dihitung dari {sellerWeeklySales.length} hari historis + kalender akademik UNESA & cuaca Surabaya
              </span>

              <button
                type="button"
                onClick={() => setExpanded((value) => !value)}
                aria-expanded={expanded}
                className="btn btn-sm"
                style={{
                  gap: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  backgroundColor: "transparent",
                  color: "var(--primary)",
                  padding: "6px 4px",
                  cursor: "pointer",
                }}
              >
                {expanded ? "Sembunyikan detail" : "Lihat detail analisis"}
                {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

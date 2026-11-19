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
  BarChart3,
  ShieldCheck,
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

  const runAnalysis = useCallback(() => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);

    setLoading(true);
    // Jeda singkat agar transisi ke state hasil terasa jelas bagi pengguna.
    timerRef.current = window.setTimeout(() => {
      setAnalysis(
        analyzeSales({
          daily: sellerWeeklySales,
          hourly: sellerHourlyTraffic,
          products: getProductsByUMKM(umkmId),
        })
      );
      setLoading(false);
      setNow(Date.now());
      timerRef.current = null;
    }, 850);
  }, [umkmId]);

  useEffect(() => {
    runAnalysis();
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, [runAnalysis]);

  // Menjaga label "x menit lalu" tetap akurat tanpa perlu refresh manual.
  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 30000);
    return () => window.clearInterval(interval);
  }, []);

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
            "linear-gradient(135deg, rgba(109, 90, 230, 0.10) 0%, rgba(109, 90, 230, 0.02) 70%)",
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
              Analisis Penjualan AI
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
              BETA
            </span>
          </div>
          <p style={{ fontSize: 12, color: "var(--muted)", margin: "3px 0 0" }}>
            {loading || !analysis
              ? "Menganalisis 7 hari transaksi terakhir…"
              : `7 hari terakhir • diperbarui ${formatRelativeTime(analysis.generatedAt, now)}`}
          </p>
        </div>

        <button
          type="button"
          onClick={runAnalysis}
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
          <span>{loading ? "Menganalisis" : "Analisis ulang"}</span>
        </button>
      </div>

      <div style={{ padding: "18px 20px 20px" }} aria-live="polite">
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
            {/* Ringkasan metrik */}
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
                  label: "Omzet 7 Hari",
                  value: formatPrice(analysis.totals.revenue),
                  sub: `Rata-rata ${formatPrice(analysis.totals.avgDailyRevenue)}/hari`,
                  valueColor: "var(--foreground)",
                },
                {
                  label: "Prediksi Besok",
                  value: formatPrice(analysis.forecast.revenue),
                  sub: `Keyakinan ${analysis.confidence}%`,
                  valueColor: "var(--foreground)",
                },
                {
                  label: "Risiko Surplus",
                  value: analysis.surplusRisk.toUpperCase(),
                  sub: `${analysis.forecast.surplus} porsi diprediksi`,
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

            {/* Insight utama */}
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

                {/* Tren omzet 7 hari */}
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 10,
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)" }}>
                      <BarChart3 size={14} style={{ verticalAlign: "middle", marginRight: 6, color: "var(--muted)" }} />
                      Tren Omzet 7 Hari
                    </div>
                    <div style={{ fontSize: 11, color: "var(--muted)" }}>
                      Terbaik: {analysis.bestDay.label} · {formatPrice(analysis.bestDay.revenue)}
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120 }}>
                    {sellerWeeklySales.map((day) => {
                      const maxRevenue = Math.max(...sellerWeeklySales.map((d) => d.revenue));
                      const ratio = maxRevenue === 0 ? 0 : day.revenue / maxRevenue;
                      const isToday = day.date === analysis.today.date;

                      return (
                        <div
                          key={day.date}
                          style={{
                            flex: 1,
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "flex-end",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          <div
                            title={`${day.label}: ${formatPrice(day.revenue)}`}
                            style={{
                              width: "100%",
                              height: `calc((100% - 20px) * ${Math.max(ratio, 0.06)})`,
                              borderRadius: "6px 6px 2px 2px",
                              backgroundColor: isToday ? "var(--primary)" : "var(--primary-light)",
                              transition: "height var(--transition-slow)",
                            }}
                          />
                          <span
                            style={{
                              fontSize: 10,
                              color: isToday ? "var(--primary)" : "var(--muted)",
                              fontWeight: isToday ? 700 : 500,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {day.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
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
                      Jam Tersibuk
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
                      Produk Terlaris
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
                Dihitung dari {sellerWeeklySales.length} hari data transaksi toko
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

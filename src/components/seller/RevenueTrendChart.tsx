import { useMemo, useState, type PointerEvent } from "react";
import {
  BarChart3,
  Star,
  TrendingDown,
  TrendingUp,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { formatPrice } from "@/data/mockData";
import type { DailySalesPoint } from "@/types";

type RangeOption = 7 | 14 | 30;

interface RevenueTrendChartProps {
  data: DailySalesPoint[];
  defaultRange?: RangeOption;
}

const RANGE_OPTIONS: { value: RangeOption; label: string }[] = [
  { value: 7, label: "7 hari" },
  { value: 14, label: "14 hari" },
  { value: 30, label: "30 hari" },
];

const TICKS = [0, 0.25, 0.5, 0.75, 1];

function shortCurrency(value: number): string {
  if (value >= 1_000_000) {
    const millions = value / 1_000_000;
    return `${millions.toFixed(1).replace(".", ",").replace(",0", "")} jt`;
  }
  if (value >= 1_000) return `${Math.round(value / 1_000)} rb`;
  return String(value);
}

function toLocalDate(date: string): Date {
  return new Date(`${date}T00:00:00`);
}

function longDate(date: string): string {
  return toLocalDate(date).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function shortDate(date: string): string {
  return toLocalDate(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  });
}

function percentage(value: number): string {
  return `${Math.abs(value).toFixed(0)}%`;
}

export default function RevenueTrendChart({
  data,
  defaultRange = 7,
}: RevenueTrendChartProps) {
  const [range, setRange] = useState<RangeOption>(defaultRange);
  const [selectedDate, setSelectedDate] = useState(
    () => data[data.length - 1]?.date ?? ""
  );

  const windowData = useMemo(() => data.slice(-range), [data, range]);
  const previousWindow = useMemo(
    () => data.slice(-range * 2, -range),
    [data, range]
  );

  const total = windowData.reduce((sum, day) => sum + day.revenue, 0);
  const average = windowData.length === 0 ? 0 : Math.round(total / windowData.length);
  const previousTotal = previousWindow.reduce((sum, day) => sum + day.revenue, 0);
  const growth =
    previousTotal === 0 ? null : ((total - previousTotal) / previousTotal) * 100;
  const bestDay = windowData.reduce<DailySalesPoint | null>(
    (best, day) => (!best || day.revenue > best.revenue ? day : best),
    null
  );
  const maxRevenue = Math.max(...windowData.map((day) => day.revenue), 1);

  const activeIndex = windowData.findIndex((day) => day.date === selectedDate);
  const selectedIndex = activeIndex >= 0 ? activeIndex : windowData.length - 1;
  const selected = windowData[selectedIndex] ?? null;

  const fullIndex = selected
    ? data.findIndex((day) => day.date === selected.date)
    : -1;
  const previousDay = fullIndex > 0 ? data[fullIndex - 1] : null;
  const dailyGrowth =
    !selected || !previousDay || previousDay.revenue === 0
      ? null
      : ((selected.revenue - previousDay.revenue) / previousDay.revenue) * 100;

  if (windowData.length === 0 || !selected) return null;

  const handleRange = (next: RangeOption) => {
    setRange(next);
    const nextWindow = data.slice(-next);
    setSelectedDate(nextWindow[nextWindow.length - 1]?.date ?? "");
  };

  const handlePointer = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    if (rect.width === 0) return;
    const position = (event.clientX - rect.left) / rect.width;
    const index = Math.max(
      0,
      Math.min(windowData.length - 1, Math.floor(position * windowData.length))
    );
    setSelectedDate(windowData[index].date);
  };

  const showAxisLabel = (index: number) => {
    if (index === windowData.length - 1) return true;
    if (range === 7) return true;
    if (range === 14) return index % 2 === 0;
    return index % 5 === 0;
  };

  const axisLabel = (day: DailySalesPoint, index: number) => {
    const isToday = index === windowData.length - 1;
    if (isToday) return range === 7 ? "Hari ini" : "Kini";
    if (range === 7) return day.label;
    return `${toLocalDate(day.date).getDate()}/${toLocalDate(day.date).getMonth() + 1}`;
  };

  const summaryCards: {
    label: string;
    value: string;
    sub: string;
    icon: LucideIcon;
    color: string;
  }[] = [
    {
      label: `Omzet ${range} Hari`,
      value: formatPrice(total),
      sub: `${windowData.length} hari transaksi`,
      icon: Wallet,
      color: "var(--primary)",
    },
    {
      label: "Rata-rata / Hari",
      value: formatPrice(average),
      sub: "Dari periode terpilih",
      icon: BarChart3,
      color: "var(--info)",
    },
    {
      label: "vs Periode Lalu",
      value: growth === null ? "—" : `${growth >= 0 ? "+" : "-"}${percentage(growth)}`,
      sub:
        growth === null
          ? "Belum ada pembanding"
          : `Sebelumnya Rp ${shortCurrency(previousTotal)}`,
      icon: growth !== null && growth < 0 ? TrendingDown : TrendingUp,
      color:
        growth === null
          ? "var(--muted)"
          : growth >= 0
            ? "var(--success)"
            : "var(--destructive)",
    },
    {
      label: "Hari Terbaik",
      value: bestDay ? shortDate(bestDay.date) : "—",
      sub: bestDay
        ? `Rp ${shortCurrency(bestDay.revenue)} · ${bestDay.orders} pesanan`
        : "",
      icon: Star,
      color: "var(--warning)",
    },
  ];

  const detailMetrics = [
    { label: "Omzet", value: formatPrice(selected.revenue) },
    { label: "Pesanan", value: `${selected.orders} pesanan` },
    { label: "Porsi Terjual", value: `${selected.portions} porsi` },
    { label: "Surplus", value: `${selected.surplus} porsi` },
  ];

  return (
    <section
      style={{
        backgroundColor: "var(--background)",
        borderRadius: "var(--radius-xl)",
        boxShadow: "var(--shadow-sm)",
        padding: 20,
        minWidth: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
          marginBottom: 16,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <h2
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              fontSize: 15,
              fontWeight: 700,
              color: "var(--foreground)",
            }}
          >
            <TrendingUp size={17} style={{ color: "var(--primary)" }} />
            Tren Omzet
          </h2>
          <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 3 }}>
            Interaktif — ketuk, geser, atau arahkan kursor ke grafik untuk melihat rincian harian.
          </p>
        </div>

        <div
          role="group"
          aria-label="Pilih rentang tren omzet"
          style={{
            display: "inline-flex",
            gap: 3,
            padding: 3,
            borderRadius: "var(--radius-full)",
            backgroundColor: "var(--surface)",
          }}
        >
          {RANGE_OPTIONS.map((option) => {
            const active = option.value === range;
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={active}
                onClick={() => handleRange(option.value)}
                style={{
                  border: "none",
                  borderRadius: "var(--radius-full)",
                  padding: "6px 11px",
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: "pointer",
                  color: active ? "#fff" : "var(--muted)",
                  backgroundColor: active ? "var(--primary)" : "transparent",
                  transition: "background-color 160ms ease, color 160ms ease",
                }}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
          gap: 10,
          marginBottom: 18,
        }}
      >
        {summaryCards.map(({ label, value, sub, icon: Icon, color }) => (
          <div
            key={label}
            style={{
              minWidth: 0,
              padding: "12px 14px",
              borderRadius: "var(--radius-lg)",
              backgroundColor: "var(--surface)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
                marginBottom: 4,
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 500, color: "var(--muted)" }}>
                {label}
              </span>
              <Icon size={14} style={{ color, flexShrink: 0 }} />
            </div>
            <div
              style={{
                fontSize: 17,
                fontWeight: 800,
                lineHeight: 1.2,
                color: color === "var(--muted)" ? "var(--foreground)" : color,
              }}
            >
              {value}
            </div>
            <div
              style={{
                fontSize: 10,
                color: "var(--muted)",
                marginTop: 3,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {sub}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "42px minmax(0, 1fr)",
          columnGap: 8,
        }}
      >
        <div style={{ position: "relative", height: 170 }}>
          {TICKS.map((tick) => (
            <span
              key={tick}
              style={{
                position: "absolute",
                right: 0,
                top: `${(1 - tick) * 100}%`,
                transform: "translateY(-50%)",
                fontSize: 9,
                lineHeight: 1,
                color: "var(--muted-light)",
                fontVariantNumeric: "tabular-nums",
                whiteSpace: "nowrap",
              }}
            >
              {shortCurrency(maxRevenue * tick)}
            </span>
          ))}
        </div>

        <div style={{ minWidth: 0, marginTop: 34 }}>
          <div style={{ position: "relative", height: 170 }}>
            {TICKS.map((tick) => (
              <div
                key={tick}
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: `${tick * 100}%`,
                  borderTop:
                    tick === 0
                      ? "1px solid var(--border)"
                      : "1px dashed var(--border-light)",
                }}
              />
            ))}

            <div
              onPointerMove={handlePointer}
              onPointerDown={handlePointer}
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "flex-end",
                gap: range === 30 ? 3 : range === 14 ? 5 : 8,
              }}
            >
              {windowData.map((day, index) => {
                const ratio = day.revenue / maxRevenue;
                const isSelected = index === selectedIndex;
                const isLast = index === windowData.length - 1;
                const barHeight = `${Math.max(ratio * 100, 3)}%`;
                const label =
                  index === 0
                    ? { left: 0 }
                    : isLast
                      ? { right: 0 }
                      : { left: "50%", transform: "translateX(-50%)" };

                return (
                  <button
                    key={day.date}
                    type="button"
                    aria-label={`${longDate(day.date)}: ${formatPrice(day.revenue)}, ${day.orders} pesanan`}
                    aria-pressed={isSelected}
                    title={`${longDate(day.date)} · ${formatPrice(day.revenue)}`}
                    onClick={() => setSelectedDate(day.date)}
                    onMouseEnter={() => setSelectedDate(day.date)}
                    onFocus={() => setSelectedDate(day.date)}
                    style={{
                      position: "relative",
                      flex: 1,
                      height: "100%",
                      minWidth: 0,
                      border: "none",
                      padding: 0,
                      background: "transparent",
                      cursor: "pointer",
                      zIndex: isSelected ? 2 : 1,
                      borderRadius: 6,
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        bottom: 0,
                        height: barHeight,
                        borderRadius:
                          range === 7 ? "8px 8px 2px 2px" : "4px 4px 1px 1px",
                        background:
                          "linear-gradient(180deg, var(--primary) 0%, var(--primary-dark) 100%)",
                        opacity: isSelected ? 1 : isLast ? 0.55 : 0.34,
                        boxShadow: isSelected
                          ? "0 6px 14px rgba(238, 77, 45, 0.28)"
                          : "none",
                        transition:
                          "opacity 160ms ease, box-shadow 160ms ease, height 220ms ease",
                      }}
                    />

                    {isSelected && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: `calc(${barHeight} + 7px)`,
                          ...label,
                          zIndex: 3,
                          padding: "4px 7px",
                          borderRadius: 6,
                          backgroundColor: "var(--foreground)",
                          color: "var(--background)",
                          boxShadow: "var(--shadow-md)",
                          pointerEvents: "none",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <div style={{ fontSize: 10, fontWeight: 700, lineHeight: 1.2 }}>
                          {formatPrice(day.revenue)}
                        </div>
                        <div
                          style={{
                            fontSize: 9,
                            fontWeight: 500,
                            lineHeight: 1.2,
                            marginTop: 1,
                            opacity: 0.72,
                          }}
                        >
                          {longDate(day.date)}
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: range === 30 ? 3 : range === 14 ? 5 : 8,
              marginTop: 7,
            }}
          >
            {windowData.map((day, index) => {
              const isLast = index === windowData.length - 1;
              return (
                <div
                  key={day.date}
                  style={{
                    flex: 1,
                    minWidth: 0,
                    textAlign:
                      index === 0 ? "left" : isLast ? "right" : "center",
                    fontSize: range === 30 ? 9 : 10,
                    lineHeight: 1.2,
                    color: isLast ? "var(--primary)" : "var(--muted)",
                    fontWeight: isLast ? 700 : 500,
                    whiteSpace: "nowrap",
                  }}
                >
                  {showAxisLabel(index) ? axisLabel(day, index) : ""}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: 18,
          padding: "14px 16px",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border-light)",
          backgroundColor: "var(--surface)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 10,
            flexWrap: "wrap",
            marginBottom: 12,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.3px" }}>
              Rincian hari terpilih
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--foreground)", marginTop: 2 }}>
              {longDate(selected.date)}
            </div>
          </div>

          {dailyGrowth !== null && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                padding: "4px 8px",
                borderRadius: "var(--radius-full)",
                fontSize: 10,
                fontWeight: 700,
                color:
                  dailyGrowth >= 0 ? "var(--success)" : "var(--destructive)",
                backgroundColor:
                  dailyGrowth >= 0
                    ? "var(--success-light)"
                    : "var(--destructive-light)",
              }}
            >
              {dailyGrowth >= 0 ? (
                <TrendingUp size={11} />
              ) : (
                <TrendingDown size={11} />
              )}
              {dailyGrowth >= 0 ? "+" : "-"}
              {percentage(dailyGrowth)} vs hari sebelumnya
            </span>
          )}
        </div>

        <div
          className="trend-detail-grid"
          style={{
            gap: 10,
          }}
        >
          {detailMetrics.map((metric) => (
            <div
              key={metric.label}
              style={{
                padding: "10px 12px",
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--background)",
                minWidth: 0,
              }}
            >
              <div style={{ fontSize: 10, color: "var(--muted)", marginBottom: 3 }}>
                {metric.label}
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "var(--foreground)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {metric.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

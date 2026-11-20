import type { LucideIcon } from "lucide-react";

export type StatTone = "primary" | "success" | "warning" | "info" | "danger" | "neutral";

const TONES: Record<StatTone, { color: string; background: string }> = {
  primary: { color: "var(--primary)", background: "var(--primary-light)" },
  success: { color: "var(--success)", background: "var(--success-light)" },
  warning: { color: "var(--warning)", background: "var(--warning-light)" },
  info: { color: "var(--info)", background: "var(--info-light)" },
  danger: { color: "var(--destructive)", background: "var(--destructive-light)" },
  neutral: { color: "var(--muted)", background: "var(--surface)" },
};

interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  tone?: StatTone;
}

export default function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "primary",
}: StatCardProps) {
  const palette = TONES[tone];

  return (
    <div
      style={{
        backgroundColor: "var(--background)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-xl)",
        boxShadow: "var(--shadow-card)",
        padding: "18px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        minWidth: 0,
        transition: "all var(--transition-fast)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          marginBottom: 8,
        }}
      >
        <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500 }}>{label}</span>
        <span
          style={{
            width: 30,
            height: 30,
            borderRadius: "var(--radius-md)",
            backgroundColor: palette.background,
            color: palette.color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon size={16} />
        </span>
      </div>

      <div
        className="dash-stat-value"
        style={{
          color: "var(--foreground)",
        }}
      >
        {value}
      </div>

      {hint && (
        <div style={{ fontSize: 11, fontWeight: 500, color: palette.color }}>{hint}</div>
      )}
    </div>
  );
}

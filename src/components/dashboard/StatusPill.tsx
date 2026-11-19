export type PillTone = "success" | "warning" | "info" | "danger" | "neutral" | "primary";

const TONES: Record<PillTone, { color: string; background: string }> = {
  success: { color: "var(--success)", background: "var(--success-light)" },
  warning: { color: "var(--warning)", background: "var(--warning-light)" },
  info: { color: "var(--info)", background: "var(--info-light)" },
  danger: { color: "var(--destructive)", background: "var(--destructive-light)" },
  neutral: { color: "var(--muted)", background: "var(--surface)" },
  primary: { color: "var(--primary)", background: "var(--primary-light)" },
};

const STATUS_TONE: Record<string, PillTone> = {
  Aktif: "success",
  Siap: "success",
  "Siap Pickup": "success",
  Selesai: "success",
  Dicairkan: "success",
  Lunas: "success",
  Menunggu: "warning",
  "Baru Dibayar": "warning",
  Diproses: "info",
  Habis: "neutral",
  Kedaluwarsa: "danger",
  Dibatalkan: "danger",
  Ditangguhkan: "danger",
  Ditinjau: "warning",
};

export function statusTone(label: string): PillTone {
  return STATUS_TONE[label] ?? "neutral";
}

interface StatusPillProps {
  label: string;
  tone?: PillTone;
}

export default function StatusPill({ label, tone }: StatusPillProps) {
  const palette = TONES[tone ?? statusTone(label)];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "3px 9px",
        borderRadius: "var(--radius-full)",
        backgroundColor: palette.background,
        color: palette.color,
        fontSize: 11,
        fontWeight: 700,
        whiteSpace: "nowrap",
        lineHeight: 1.5,
      }}
    >
      <span
        aria-hidden
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          backgroundColor: palette.color,
          flexShrink: 0,
        }}
      />
      {label}
    </span>
  );
}

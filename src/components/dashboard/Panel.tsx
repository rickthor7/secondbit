import type { CSSProperties, ReactNode } from "react";

interface PanelProps {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  padded?: boolean;
  style?: CSSProperties;
}

export default function Panel({
  title,
  description,
  action,
  children,
  padded = true,
  style,
}: PanelProps) {
  return (
    <section
      style={{
        backgroundColor: "var(--background)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-xl)",
        boxShadow: "var(--shadow-card)",
        padding: padded ? 20 : 0,
        minWidth: 0,
        ...style,
      }}
    >
      {(title || action) && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 16,
            flexWrap: "wrap",
          }}
        >
          <div style={{ minWidth: 0 }}>
            {title && (
              <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--foreground)" }}>
                {title}
              </h2>
            )}
            {description && (
              <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 3 }}>{description}</p>
            )}
          </div>
          {action}
        </div>
      )}

      {children}
    </section>
  );
}

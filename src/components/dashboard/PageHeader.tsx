import type { ReactNode } from "react";

interface PageHeaderProps {
  kicker?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}

export default function PageHeader({
  kicker,
  title,
  description,
  actions,
}: PageHeaderProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        gap: 16,
        flexWrap: "wrap",
        marginBottom: 24,
      }}
    >
      <div style={{ minWidth: 0 }}>
        {kicker && (
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.9px",
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: 5,
            }}
          >
            {kicker}
          </div>
        )}
        <h1
          style={{
            fontSize: 24,
            fontWeight: 800,
            letterSpacing: "-0.4px",
            lineHeight: 1.2,
            color: "var(--foreground)",
          }}
        >
          {title}
        </h1>
        {description && (
          <p
            style={{
              fontSize: 13,
              color: "var(--muted)",
              marginTop: 6,
              maxWidth: 680,
              lineHeight: 1.6,
            }}
          >
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          {actions}
        </div>
      )}
    </div>
  );
}

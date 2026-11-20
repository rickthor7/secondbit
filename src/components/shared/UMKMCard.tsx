import { Link } from "react-router-dom";
import { Star, MapPin, Clock, Award } from "lucide-react";
import { UMKM } from "@/types";

interface UMKMCardProps {
  umkm: UMKM;
}

export default function UMKMCard({ umkm }: UMKMCardProps) {
  return (
    <Link
      to={`/umkm/${umkm.slug}`}
      className="card"
      style={{
        display: "flex",
        gap: 0,
        overflow: "hidden",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      {/* Image */}
      <div
        style={{
          width: 124,
          minHeight: 124,
          flexShrink: 0,
          overflow: "hidden",
          position: "relative",
          backgroundColor: "var(--surface)",
        }}
      >
        <img
          src={umkm.image}
          alt={umkm.name}
          loading="lazy"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform var(--transition-slow)",
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />
        {umkm.isMVP && (
          <div
            style={{
              position: "absolute",
              top: 8,
              left: 8,
            }}
          >
            <span className="badge badge-mvp" style={{ boxShadow: "0 2px 6px rgba(0,0,0,0.2)" }}>
              <Award size={10} /> MVP
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div
        style={{
          padding: "14px 16px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 6,
          minWidth: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <h3
            style={{
              fontSize: 15,
              fontWeight: 600,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {umkm.name}
          </h3>
          {umkm.isHiddenGem && (
            <span className="badge" style={{ backgroundColor: "var(--info-light)", color: "var(--info)", fontSize: 10 }}>
              💎 Hidden Gem
            </span>
          )}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            fontSize: 13,
            color: "var(--muted)",
          }}
        >
          <span
            style={{
              backgroundColor: umkm.category === "Nasi & Lauk" ? "var(--primary-light)" : "var(--surface)",
              color: umkm.category === "Nasi & Lauk" ? "var(--primary)" : "var(--foreground-secondary)",
              padding: "1px 8px",
              borderRadius: "var(--radius-full)",
              fontSize: 11,
              fontWeight: 500,
            }}
          >
            {umkm.category}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 12,
            color: "var(--muted)",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Star size={13} fill="var(--warning)" stroke="var(--warning)" />
            <span style={{ fontWeight: 600, color: "var(--foreground)" }}>
              {umkm.rating}
            </span>
            <span>({umkm.ratingCount})</span>
          </div>
          {umkm.distance && (
            <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
              <MapPin size={12} />
              <span>{umkm.distance}</span>
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 12,
            marginTop: "auto",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span className={umkm.isOpen ? "pulse-dot-green" : "pulse-dot-orange"} />
            <span
              style={{
                fontWeight: 700,
                color: umkm.isOpen ? "var(--success)" : "var(--destructive)",
              }}
            >
              {umkm.isOpen ? "Buka Sekarang" : "Tutup"}
            </span>
          </div>
          <span style={{ color: "var(--muted)" }}>•</span>
          <span style={{ color: "var(--muted)", fontWeight: 500 }}>{umkm.operatingHours}</span>
        </div>
      </div>
    </Link>
  );
}

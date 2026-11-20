import { useEffect } from "react";
import { Zap, Flame, ShieldCheck, Sparkles, Clock } from "lucide-react";
import AOS from "aos";

import ProductCard from "@/components/shared/ProductCard";
import CountdownTimer from "@/components/shared/CountdownTimer";
import { getFlashDealProducts } from "@/data/mockData";

export default function FlashDeals() {
  const flashDeals = getFlashDealProducts();

  useEffect(() => {
    AOS.refresh();
  }, []);

  return (
    <main style={{ minHeight: "80vh" }}>
      {/* Header Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #EE4D2D 0%, #FF6633 50%, #FFAA00 100%)",
          padding: "42px 0",
          color: "#fff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <div style={{ position: "absolute", top: -30, right: -30, width: 140, height: 140, borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.12)" }} />
        <div style={{ position: "absolute", bottom: -50, left: 20, width: 120, height: 120, borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.06)" }} />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginBottom: 10,
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "var(--radius-xl)",
                backgroundColor: "rgba(255,255,255,0.22)",
                backdropFilter: "blur(8px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
            >
              <Zap size={30} fill="#fff" />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    backgroundColor: "rgba(255,255,255,0.25)",
                    fontSize: 11,
                    fontWeight: 800,
                    padding: "2px 8px",
                    borderRadius: "var(--radius-full)",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  ⚡ Promo Terbatas
                </span>
              </div>
              <h1 style={{ fontSize: "clamp(24px, 3.5vw, 32px)", fontWeight: 900, lineHeight: 1.2, marginTop: 4 }}>
                Flash Deal Hari Ini
              </h1>
              <p style={{ fontSize: 14, opacity: 0.95, maxWidth: 540 }}>
                Diskon besar makanan lezat UMKM lokal di sekitar UNESA Ketintang sebelum kehabisan!
              </p>
            </div>
          </div>

          <div style={{ marginTop: 20 }}>
            {flashDeals[0]?.flashDealEndsAt && (
              <CountdownTimer
                targetDate={flashDeals[0].flashDealEndsAt}
                label="Promo Berakhir Dalam"
              />
            )}
          </div>
        </div>
      </div>

      {/* Products & Highlights */}
      <div className="container" style={{ padding: "32px 16px 50px" }}>
        {/* Stats */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 24,
            flexWrap: "wrap",
          }}
          data-aos="fade-up"
        >
          {[
            { icon: Zap, label: "Diskon s/d 50%", color: "var(--warning)", bg: "var(--warning-light)" },
            { icon: Flame, label: `${flashDeals.length} Menu Flash Deal`, color: "var(--primary)", bg: "var(--primary-light)" },
            { icon: ShieldCheck, label: "Jaminan Kualitas Fresh", color: "var(--success)", bg: "var(--success-light)" },
            { icon: Clock, label: "Pickup Hari Ini", color: "#6366F1", bg: "rgba(99, 102, 241, 0.1)" },
          ].map(({ icon: Icon, label, color, bg }) => (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 16px",
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-full)",
                fontSize: 12.5,
                fontWeight: 600,
                color: "var(--foreground)",
              }}
            >
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  backgroundColor: bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: color,
                }}
              >
                <Icon size={13} />
              </div>
              <span>{label}</span>
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="grid-products">
          {flashDeals.map((product, i) => (
            <div key={product.id} data-aos="fade-up" data-aos-delay={i * 60}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {flashDeals.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "70px 20px",
              backgroundColor: "var(--surface)",
              borderRadius: "var(--radius-xl)",
              border: "1px dashed var(--border)",
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 12 }}>⚡</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6, color: "var(--foreground)" }}>
              Belum ada Flash Deal aktif
            </h3>
            <p style={{ fontSize: 14, color: "var(--muted)" }}>Nantikan jadwal Flash Deal seru berikutnya!</p>
          </div>
        )}
      </div>
    </main>
  );
}

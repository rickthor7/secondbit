import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, MapPin, Clock, Award, ChevronLeft, Navigation, Leaf, Zap, Flag } from "lucide-react";
import { getUMKMBySlug, getProductsByUMKM } from "@/data/mockData";
import { showReportUMKMModal } from "@/utils/showReportUMKMModal";
import ProductCard from "@/components/shared/ProductCard";

export default function UMKMDetail() {
  const { slug } = useParams<{ slug: string }>();
  const umkm = getUMKMBySlug(slug || "");
  const [selectedTab, setSelectedTab] = useState<"all" | "surplus" | "flash" | "normal">("all");

  if (!umkm) {
    return (
      <div className="container" style={{ padding: "80px 16px", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🏪</div>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>UMKM tidak ditemukan</h2>
        <Link to="/hidden-gem" className="btn btn-primary" style={{ borderRadius: "var(--radius-full)" }}>
          Lihat Hidden Gem
        </Link>
      </div>
    );
  }

  const allProducts = getProductsByUMKM(umkm.id);
  const products = allProducts.filter((p) => {
    if (selectedTab === "surplus") return p.type === "surplus";
    if (selectedTab === "flash") return p.type === "flash-deal";
    if (selectedTab === "normal") return p.type === "normal";
    return true;
  });

  const surplusCount = allProducts.filter((p) => p.type === "surplus").length;
  const flashCount = allProducts.filter((p) => p.type === "flash-deal").length;

  return (
    <main style={{ minHeight: "80vh" }}>
      {/* Cover Image */}
      <div
        style={{
          height: 240,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <img
          src={umkm.coverImage}
          alt={umkm.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.65))",
          }}
        />
        <Link
          to="/hidden-gem"
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: "#fff",
            fontSize: 13,
            fontWeight: 600,
            backgroundColor: "rgba(0,0,0,0.45)",
            backdropFilter: "blur(6px)",
            padding: "6px 14px",
            borderRadius: "var(--radius-full)",
          }}
        >
          <ChevronLeft size={16} /> Kembali ke Direktori
        </Link>
      </div>

      <div className="container">
        {/* Profile Card */}
        <div
          style={{
            backgroundColor: "var(--background)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-xl)",
            boxShadow: "var(--shadow-lg)",
            padding: "24px",
            marginTop: -50,
            position: "relative",
            zIndex: 10,
            marginBottom: 32,
          }}
        >
          <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
            <img
              src={umkm.image}
              alt={umkm.name}
              style={{
                width: 90,
                height: 90,
                borderRadius: "var(--radius-xl)",
                objectFit: "cover",
                border: "3px solid var(--background)",
                boxShadow: "var(--shadow-md)",
              }}
            />
            <div style={{ flex: 1, minWidth: 220 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
                <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--foreground)" }}>{umkm.name}</h1>
                {umkm.isMVP && (
                  <span className="badge badge-mvp" style={{ boxShadow: "0 2px 6px rgba(0,0,0,0.2)" }}>
                    <Award size={11} /> Mitra Unggulan MVP
                  </span>
                )}
                {umkm.isHiddenGem && (
                  <span className="badge" style={{ backgroundColor: "var(--info-light)", color: "var(--info)", fontWeight: 700 }}>
                    💎 Hidden Gem
                  </span>
                )}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10, flexWrap: "wrap", fontSize: 13 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Star size={15} fill="var(--warning)" stroke="var(--warning)" />
                  <span style={{ fontWeight: 700, color: "var(--foreground)" }}>{umkm.rating}</span>
                  <span style={{ color: "var(--muted)" }}>({umkm.ratingCount} ulasan)</span>
                </div>
                <span style={{ color: "var(--border)" }}>|</span>
                <span style={{ color: "var(--muted)", fontWeight: 500 }}>{umkm.totalSold} porsi terjual</span>
                <span style={{ color: "var(--border)" }}>|</span>
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
              </div>

              <p style={{ fontSize: 14, color: "var(--foreground-secondary)", lineHeight: 1.6, marginBottom: 14 }}>
                {umkm.description}
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13, color: "var(--muted)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <MapPin size={15} style={{ color: "var(--primary)", flexShrink: 0 }} />
                  <span style={{ color: "var(--foreground)" }}>
                    {umkm.address} {umkm.distance && <strong>• {umkm.distance} dari Kampus Ketintang</strong>}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Clock size={15} style={{ color: "var(--muted)", flexShrink: 0 }} />
                  <span>Jam Buka: {umkm.operatingHours}</span>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 10,
                  marginTop: 14,
                  paddingTop: 12,
                  borderTop: "1px dashed var(--border)",
                }}
              >
                <div style={{ fontSize: 12, color: "var(--muted)" }}>
                  🛡️ Transaksi terlindungi Standar Higienitas 3T & Garansi 100% Refund
                </div>
                <button
                  type="button"
                  onClick={() => showReportUMKMModal({ umkmName: umkm.name, umkmId: umkm.id })}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 12,
                    fontWeight: 600,
                    color: "var(--muted)",
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: "4px 8px",
                    borderRadius: "var(--radius-sm)",
                  }}
                  title="Laporkan masalah toko ini ke Super Admin"
                >
                  <Flag size={13} style={{ color: "var(--destructive)" }} />
                  <span>Laporkan Toko Ini</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Tabs & Products */}
        <div style={{ paddingBottom: 50 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
              marginBottom: 20,
            }}
          >
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--foreground)" }}>
              Daftar Menu ({products.length})
            </h2>

            {/* Filter Tabs */}
            <div className="scroll-x" style={{ gap: 8 }}>
              <button
                type="button"
                onClick={() => setSelectedTab("all")}
                className="btn btn-sm"
                style={{
                  borderRadius: "var(--radius-full)",
                  backgroundColor: selectedTab === "all" ? "var(--primary)" : "var(--surface)",
                  color: selectedTab === "all" ? "#fff" : "var(--foreground)",
                  border: "1px solid var(--border)",
                  fontSize: 12,
                  fontWeight: 600,
                  padding: "6px 14px",
                }}
              >
                Semua ({allProducts.length})
              </button>

              {surplusCount > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedTab("surplus")}
                  className="btn btn-sm"
                  style={{
                    borderRadius: "var(--radius-full)",
                    backgroundColor: selectedTab === "surplus" ? "var(--success)" : "var(--surface)",
                    color: selectedTab === "surplus" ? "#fff" : "var(--foreground)",
                    border: "1px solid var(--border)",
                    fontSize: 12,
                    fontWeight: 600,
                    padding: "6px 14px",
                    gap: 5,
                  }}
                >
                  <Leaf size={13} />
                  <span>Surplus Rescue ({surplusCount})</span>
                </button>
              )}

              {flashCount > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedTab("flash")}
                  className="btn btn-sm"
                  style={{
                    borderRadius: "var(--radius-full)",
                    backgroundColor: selectedTab === "flash" ? "var(--warning)" : "var(--surface)",
                    color: selectedTab === "flash" ? "#fff" : "var(--foreground)",
                    border: "1px solid var(--border)",
                    fontSize: 12,
                    fontWeight: 600,
                    padding: "6px 14px",
                    gap: 5,
                  }}
                >
                  <Zap size={13} />
                  <span>Flash Deal ({flashCount})</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setSelectedTab("normal")}
                className="btn btn-sm"
                style={{
                  borderRadius: "var(--radius-full)",
                  backgroundColor: selectedTab === "normal" ? "var(--primary)" : "var(--surface)",
                  color: selectedTab === "normal" ? "#fff" : "var(--foreground)",
                  border: "1px solid var(--border)",
                  fontSize: 12,
                  fontWeight: 600,
                  padding: "6px 14px",
                }}
              >
                Menu Normal
              </button>
            </div>
          </div>

          {products.length > 0 ? (
            <div className="grid-products">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} showUMKM={false} />
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "50px 20px",
                backgroundColor: "var(--surface)",
                borderRadius: "var(--radius-xl)",
                border: "1px dashed var(--border)",
              }}
            >
              <p style={{ color: "var(--muted)", fontSize: 14 }}>
                Tidak ada menu dalam kategori ini.
              </p>
              <button
                type="button"
                className="btn btn-sm btn-outline"
                onClick={() => setSelectedTab("all")}
                style={{ marginTop: 12, borderRadius: "var(--radius-full)" }}
              >
                Tampilkan Semua Menu
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

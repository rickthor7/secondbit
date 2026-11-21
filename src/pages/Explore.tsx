import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, SlidersHorizontal, X, RotateCcw, Sparkles, Star, Zap, Leaf, Flame, Gift, ShieldCheck, Lock } from "lucide-react";
import AOS from "aos";

import ProductCard from "@/components/shared/ProductCard";
import CategoryPills from "@/components/shared/CategoryPills";
import { products, categories } from "@/data/mockData";

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFilter = searchParams.get("category") || "";
  const typeFilter = searchParams.get("type") || "";
  const qParam = searchParams.get("q") || "";
  const sortParam = searchParams.get("sort") || "popular";

  const [searchQuery, setSearchQuery] = useState(qParam);
  const [sortBy, setSortBy] = useState(sortParam);
  const [minRating, setMinRating] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    AOS.refresh();
  }, []);

  useEffect(() => {
    setSearchQuery(qParam);
  }, [qParam]);

  let filtered = [...products];

  // Filter by search query
  if (searchQuery) {
    const q = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.umkmName.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }

  // Filter by category
  if (categoryFilter) {
    const cat = categories.find((c) => c.slug === categoryFilter);
    if (cat) {
      filtered = filtered.filter((p) => p.category === cat.name);
    }
  }

  // Filter by type
  if (typeFilter) {
    filtered = filtered.filter((p) => p.type === typeFilter);
  }

  // Filter by min rating 4.5+
  if (minRating) {
    filtered = filtered.filter((p) => p.rating >= 4.5);
  }

  // Sort
  switch (sortBy) {
    case "price-low":
      filtered.sort((a, b) => a.price - b.price);
      break;
    case "price-high":
      filtered.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      filtered.sort((a, b) => b.rating - a.rating);
      break;
    case "best-seller":
      filtered.sort((a, b) => b.soldCount - a.soldCount);
      break;
    default:
      filtered.sort((a, b) => b.soldCount - a.soldCount);
  }

  const hasActiveFilters = Boolean(searchQuery || categoryFilter || typeFilter || minRating || sortBy !== "popular");

  const resetAllFilters = () => {
    setSearchQuery("");
    setMinRating(false);
    setSortBy("popular");
    setSearchParams({});
  };

  return (
    <main style={{ minHeight: "80vh" }}>
      <div className="container" style={{ paddingTop: 20, paddingBottom: 50 }}>
        {/* Header */}
        <div data-aos="fade-up">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span
              style={{
                backgroundColor: "var(--primary-light)",
                color: "var(--primary)",
                fontSize: 11,
                fontWeight: 700,
                padding: "3px 10px",
                borderRadius: "var(--radius-full)",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Katalog Lengkap
            </span>
          </div>
          <h1
            style={{
              fontSize: "clamp(22px, 3vw, 28px)",
              fontWeight: 800,
              marginBottom: 6,
              color: "var(--foreground)",
            }}
          >
            {typeFilter === "surplus"
              ? "🌿 Surplus Food Rescue (Limited)"
              : typeFilter === "flash-deal"
              ? "⚡ Flash Deal Spesial"
              : typeFilter === "bundle"
              ? "🎁 Paket Surplus Bundle"
              : "Jelajahi Makanan Sekitar UNESA"}
          </h1>
          <p style={{ fontSize: 14, color: "var(--muted)", marginBottom: 20 }}>
            {typeFilter === "bundle"
              ? "Paket bundling cerdas memadukan menu reguler segar + surplus hemat. Kenyang puas, dompet aman, sekaligus menjaga margin UMKM tetap sehat!"
              : typeFilter === "surplus"
              ? "Makanan berkualitas dengan potongan hingga 70%. Dibatasi maks 2 porsi/user demi melindungi margin dan kelangsungan warung mitra."
              : "Temukan kuliner UMKM lokal legendaris dan promo hemat di sekitar Ketintang, Surabaya."}
          </p>
        </div>

        {/* Search Bar */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 16,
          }}
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <div style={{ flex: 1, position: "relative" }}>
            <Search
              size={18}
              style={{
                position: "absolute",
                left: 14,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--muted-light)",
                pointerEvents: "none",
              }}
            />
            <input
              className="input"
              type="text"
              placeholder="Cari makanan, nasi pecel, bakso, atau nama UMKM..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                paddingLeft: 42,
                paddingRight: 40,
                borderRadius: "var(--radius-full)",
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "var(--muted)",
                  padding: 4,
                  cursor: "pointer",
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button
            className="btn btn-outline"
            onClick={() => setShowFilters(!showFilters)}
            style={{
              flexShrink: 0,
              borderRadius: "var(--radius-full)",
              gap: 6,
              backgroundColor: showFilters ? "var(--primary-light)" : "transparent",
            }}
          >
            <SlidersHorizontal size={16} />
            <span style={{ fontSize: 13 }}>Filter & Urutkan</span>
          </button>
        </div>

        {/* Quick Filter Badges */}
        <div
          className="scroll-x"
          style={{ gap: 8, marginBottom: 14, paddingBottom: 4 }}
          data-aos="fade-up"
          data-aos-delay="120"
        >
          <Link
            to="/explore"
            className="btn btn-sm"
            style={{
              borderRadius: "var(--radius-full)",
              backgroundColor: !typeFilter && !minRating ? "var(--primary)" : "var(--surface)",
              color: !typeFilter && !minRating ? "#fff" : "var(--foreground)",
              border: "1px solid var(--border)",
              fontSize: 12,
              fontWeight: 600,
              padding: "5px 14px",
            }}
          >
            Semua Tipe
          </Link>
          <Link
            to="/explore?type=bundle"
            className="btn btn-sm"
            style={{
              borderRadius: "var(--radius-full)",
              backgroundColor: typeFilter === "bundle" ? "#8B5CF6" : "var(--surface)",
              color: typeFilter === "bundle" ? "#fff" : "var(--foreground)",
              border: "1px solid var(--border)",
              fontSize: 12,
              fontWeight: 600,
              padding: "5px 14px",
              gap: 4,
            }}
          >
            <Gift size={13} />
            <span>Surplus Bundle</span>
          </Link>
          <Link
            to="/explore?type=surplus"
            className="btn btn-sm"
            style={{
              borderRadius: "var(--radius-full)",
              backgroundColor: typeFilter === "surplus" ? "var(--success)" : "var(--surface)",
              color: typeFilter === "surplus" ? "#fff" : "var(--foreground)",
              border: "1px solid var(--border)",
              fontSize: 12,
              fontWeight: 600,
              padding: "5px 14px",
              gap: 4,
            }}
          >
            <Leaf size={13} />
            <span>Surplus (Maks 2)</span>
          </Link>
          <Link
            to="/explore?type=flash-deal"
            className="btn btn-sm"
            style={{
              borderRadius: "var(--radius-full)",
              backgroundColor: typeFilter === "flash-deal" ? "var(--warning)" : "var(--surface)",
              color: typeFilter === "flash-deal" ? "#fff" : "var(--foreground)",
              border: "1px solid var(--border)",
              fontSize: 12,
              fontWeight: 600,
              padding: "5px 14px",
              gap: 4,
            }}
          >
            <Zap size={13} />
            <span>Flash Deal</span>
          </Link>
          <button
            type="button"
            onClick={() => setMinRating(!minRating)}
            className="btn btn-sm"
            style={{
              borderRadius: "var(--radius-full)",
              backgroundColor: minRating ? "#6366F1" : "var(--surface)",
              color: minRating ? "#fff" : "var(--foreground)",
              border: "1px solid var(--border)",
              fontSize: 12,
              fontWeight: 600,
              padding: "5px 14px",
              gap: 4,
            }}
          >
            <Star size={13} fill={minRating ? "#fff" : "var(--warning)"} stroke={minRating ? "#fff" : "var(--warning)"} />
            <span>Rating 4.5+</span>
          </button>
        </div>

        {/* Categories */}
        <div style={{ marginBottom: 16 }} data-aos="fade-up" data-aos-delay="150">
          <CategoryPills categories={categories} activeSlug={categoryFilter} />
        </div>

        {/* Filter/Sort Dropdown Bar */}
        {showFilters && (
          <div
            style={{
              display: "flex",
              gap: 16,
              marginBottom: 20,
              flexWrap: "wrap",
              padding: "16px 20px",
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-xl)",
              animation: "fadeInUp 0.3s ease",
            }}
          >
            <div style={{ flex: 1, minWidth: 200 }}>
              <label
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "var(--foreground)",
                  display: "block",
                  marginBottom: 6,
                }}
              >
                Urutkan Berdasarkan
              </label>
              <select
                className="input"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ fontSize: 13, borderRadius: "var(--radius-md)" }}
              >
                <option value="popular">🔥 Paling Laris & Populer</option>
                <option value="rating">⭐ Rating Tertinggi (4.5 ke atas)</option>
                <option value="price-low">💰 Harga Terendah ke Tertinggi</option>
                <option value="price-high">💎 Harga Tertinggi ke Terendah</option>
              </select>
            </div>

            {hasActiveFilters && (
              <div style={{ display: "flex", alignItems: "flex-end" }}>
                <button
                  type="button"
                  className="btn btn-sm btn-ghost"
                  onClick={resetAllFilters}
                  style={{ gap: 6, color: "var(--destructive)", fontWeight: 600 }}
                >
                  <RotateCcw size={14} />
                  <span>Reset Semua Filter</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Results Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <span style={{ fontSize: 13, color: "var(--muted)", fontWeight: 500 }}>
            Menampilkan <strong style={{ color: "var(--foreground)" }}>{filtered.length}</strong> menu kuliner
          </span>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetAllFilters}
              style={{
                background: "none",
                border: "none",
                color: "var(--primary)",
                fontSize: 12,
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                cursor: "pointer",
              }}
            >
              <RotateCcw size={13} />
              <span>Bersihkan filter</span>
            </button>
          )}
        </div>

        {/* Contextual Banner for Limited Surplus */}
        {typeFilter === "surplus" && (
          <div
            style={{
              backgroundColor: "#F0F9FF",
              border: "1px solid #BAE6FD",
              borderRadius: "var(--radius-lg)",
              padding: "14px 18px",
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Lock size={18} style={{ color: "#0284C7", flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#0369A1" }}>
                  Kebijakan Limited Surplus (Fair Share & Anti-Kanibalisasi)
                </div>
                <div style={{ fontSize: 12, color: "#0C4A6E" }}>
                  Maksimal pembelian 2 porsi/user untuk menjaga kestabilan harga dan melindungi margin UMKM mitra.
                </div>
              </div>
            </div>
            <Link
              to="/explore?type=bundle"
              className="btn btn-sm"
              style={{
                backgroundColor: "#8B5CF6",
                color: "#fff",
                fontSize: 12,
                fontWeight: 700,
                borderRadius: "var(--radius-full)",
                whiteSpace: "nowrap",
              }}
            >
              Coba Surplus Bundle (Tanpa Kuota) →
            </Link>
          </div>
        )}

        {/* Contextual Banner for Surplus Bundle */}
        {typeFilter === "bundle" && (
          <div
            style={{
              background: "linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 100%)",
              border: "1px solid #E9D5FF",
              borderRadius: "var(--radius-lg)",
              padding: "14px 18px",
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <Gift size={20} style={{ color: "#7C3AED", flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 800, color: "#6D28D9" }}>
                Solusi Win-Win: Paket Kombinasi Menu Reguler + Surplus
              </div>
              <div style={{ fontSize: 12, color: "#4B5563" }}>
                Nikmati paket makan lengkap hemat hingga 45%! Menu reguler menjaga omzet mitra UMKM, sementara porsi surplus diselamatkan dari pemborosan.
              </div>
            </div>
          </div>
        )}

        {/* Products Grid or Empty State */}
        {filtered.length > 0 ? (
          <div className="grid-products">
            {filtered.map((product, i) => (
              <div key={product.id} data-aos="fade-up" data-aos-delay={i * 40}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "70px 20px",
              backgroundColor: "var(--surface)",
              borderRadius: "var(--radius-xl)",
              border: "1px dashed var(--border)",
              marginTop: 10,
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 14 }}>🔍</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6, color: "var(--foreground)" }}>
              Menu makanan tidak ditemukan
            </h3>
            <p style={{ fontSize: 14, color: "var(--muted)", maxWidth: 400, margin: "0 auto 20px" }}>
              Tidak ada hasil yang sesuai dengan kata kunci atau filter yang Anda pilih. Coba bersihkan filter pencarian.
            </p>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={resetAllFilters}
              style={{ borderRadius: "var(--radius-full)", gap: 6 }}
            >
              <RotateCcw size={14} />
              <span>Reset Semua Filter</span>
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  Zap,
  Leaf,
  TrendingUp,
  Gem,
  ShieldCheck,
  Clock,
  Star,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  QrCode,
  CheckCircle2,
  Users,
  Coins,
} from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

import ProductCard from "@/components/shared/ProductCard";
import UMKMCard from "@/components/shared/UMKMCard";
import CountdownTimer from "@/components/shared/CountdownTimer";
import { showSecondBitIntroModal } from "@/utils/showSecondBitIntroModal";
import {
  categories,
  banners,
  getFlashDealProducts,
  getBestSellerProducts,
  getSurplusProducts,
  getHiddenGemUMKM,
} from "@/data/mockData";

export default function Home() {
  useEffect(() => {
    AOS.init({ duration: 600, once: true, offset: 60 });
  }, []);

  const flashDeals = getFlashDealProducts();
  const bestSellers = getBestSellerProducts();
  const surplusProducts = getSurplusProducts();
  const hiddenGems = getHiddenGemUMKM();

  return (
    <main>
      {/* ===== Platform Tagline & Welcome Card ===== */}
      <section style={{ padding: "16px 0 0" }}>
        <div className="container">
          <div
            data-aos="fade-down"
            style={{
              background: "linear-gradient(135deg, rgba(238, 77, 45, 0.07) 0%, rgba(38, 170, 108, 0.07) 50%, rgba(99, 102, 241, 0.07) 100%)",
              borderRadius: "var(--radius-xl)",
              border: "1px solid var(--border)",
              padding: "20px 24px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <span
                  style={{
                    backgroundColor: "var(--primary)",
                    color: "#fff",
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: "var(--radius-full)",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                  }}
                >
                  🌱 Food Rescue & Hidden Gem
                </span>
                <span style={{ fontSize: 13, color: "var(--muted)", fontWeight: 500 }}>
                  Sekitar UNESA Ketintang, Surabaya
                </span>
              </div>

              <button
                type="button"
                onClick={() => showSecondBitIntroModal(true)}
                className="btn btn-sm btn-outline"
                style={{
                  gap: 6,
                  borderRadius: "var(--radius-full)",
                  fontSize: 12,
                  fontWeight: 600,
                  backgroundColor: "var(--surface)",
                  cursor: "pointer",
                }}
              >
                <Sparkles size={14} style={{ color: "var(--primary)" }} />
                <span>Apa itu SecondBit? (Info Platform)</span>
              </button>
            </div>

            <div>
              <h1
                style={{
                  fontSize: "clamp(20px, 3.2vw, 26px)",
                  fontWeight: 800,
                  lineHeight: 1.25,
                  marginBottom: 6,
                  color: "var(--foreground)",
                }}
              >
                Selamatkan Makanan Lezat, Hemat Budget, Dukung UMKM Lokal!
              </h1>
              <p
                style={{
                  fontSize: 14,
                  color: "var(--foreground-secondary)",
                  lineHeight: 1.5,
                  maxWidth: 780,
                }}
              >
                Platform pelopor penyelamatan surplus makanan dan direktori kuliner hidden gem di sekitar kampus. Dapatkan diskon hingga 70% untuk makanan fresh berkualitas sebelum toko tutup, nikmati promo Flash Deal harian, dan bantu kurangi food waste!
              </p>
            </div>

            {/* Quick value badges */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                paddingTop: 2,
              }}
            >
              <Link
                to="/explore?type=surplus"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--success)",
                  background: "var(--success-light)",
                  padding: "4px 12px",
                  borderRadius: "var(--radius-full)",
                  textDecoration: "none",
                }}
              >
                <span>🌿</span> Surplus Rescue s/d 70%
              </Link>
              <Link
                to="/flash-deals"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--primary)",
                  background: "var(--primary-light)",
                  padding: "4px 12px",
                  borderRadius: "var(--radius-full)",
                  textDecoration: "none",
                }}
              >
                <span>⚡</span> Flash Deal Tiap Hari
              </Link>
              <Link
                to="/hidden-gem"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#6366F1",
                  background: "rgba(99, 102, 241, 0.1)",
                  padding: "4px 12px",
                  borderRadius: "var(--radius-full)",
                  textDecoration: "none",
                }}
              >
                <span>💎</span> Direktori Hidden Gem
              </Link>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#D97706",
                  background: "rgba(245, 158, 11, 0.1)",
                  padding: "4px 12px",
                  borderRadius: "var(--radius-full)",
                }}
              >
                <span>📱</span> Ambil Pesanan via QRIS
              </div>
            </div>
          </div>

          {/* ===== Live Platform Highlights ===== */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 12,
              marginTop: 14,
            }}
            data-aos="fade-up"
          >
            {[
              {
                icon: Leaf,
                val: "1.420+ Porsi",
                label: "Makanan Diselamatkan",
                color: "var(--success)",
                bg: "var(--success-light)",
              },
              {
                icon: Coins,
                val: "Rp 18,2 Juta",
                label: "Hemat Uang Saku Mahasiswa",
                color: "var(--primary)",
                bg: "var(--primary-light)",
              },
              {
                icon: Users,
                val: "28 Mitra UMKM",
                label: "Sekitar UNESA Ketintang",
                color: "#6366F1",
                bg: "rgba(99, 102, 241, 0.1)",
              },
              {
                icon: QrCode,
                val: "100% Closed-Loop",
                label: "Tiket QR Pickup Terverifikasi",
                color: "#D97706",
                bg: "rgba(245, 158, 11, 0.1)",
              },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={i}
                  style={{
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-lg)",
                    padding: "12px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    boxShadow: "var(--shadow-sm)",
                  }}
                >
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: "var(--radius-md)",
                      backgroundColor: stat.bg,
                      color: stat.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={18} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: "var(--foreground)", lineHeight: 1.2 }}>
                      {stat.val}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {stat.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== Hero Banner Carousel ===== */}
      <section style={{ padding: "16px 0 0" }}>
        <div className="container">
          <div
            className="scroll-x"
            style={{ gap: 16, paddingBottom: 8 }}
          >
            {banners.map((banner) => (
              <Link
                key={banner.id}
                to={banner.link}
                style={{
                  display: "block",
                  minWidth: "min(85vw, 560px)",
                  borderRadius: "var(--radius-xl)",
                  overflow: "hidden",
                  position: "relative",
                  height: 180,
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: banner.bgColor,
                    zIndex: 1,
                  }}
                />
                <img
                  src={banner.image}
                  alt={banner.title}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    opacity: 0.2,
                    zIndex: 2,
                  }}
                />
                <div
                  style={{
                    position: "relative",
                    zIndex: 3,
                    padding: "28px 32px",
                    color: "#fff",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <h2
                    style={{
                      fontSize: 24,
                      fontWeight: 800,
                      marginBottom: 6,
                      lineHeight: 1.2,
                    }}
                  >
                    {banner.title}
                  </h2>
                  <p
                    style={{
                      fontSize: 14,
                      opacity: 0.9,
                      maxWidth: 320,
                    }}
                  >
                    {banner.subtitle}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Categories ===== */}
      <section style={{ padding: "24px 0 8px" }}>
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: 8,
            }}
            className="category-grid"
          >
            {categories.slice(0, 10).map((cat, i) => (
              <Link
                key={cat.id}
                to={`/explore?category=${cat.slug}`}
                data-aos="fade-up"
                data-aos-delay={i * 50}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  padding: "14px 8px",
                  borderRadius: "var(--radius-lg)",
                  backgroundColor: "var(--surface)",
                  transition: "all var(--transition-fast)",
                  textDecoration: "none",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--primary-light)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--surface)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <span style={{ fontSize: 28 }}>{cat.icon}</span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    color: "var(--foreground)",
                    textAlign: "center",
                    lineHeight: 1.3,
                  }}
                >
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Flash Deal ===== */}
      <section className="section" data-aos="fade-up">
        <div className="container">
          <div className="section-header">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "var(--radius-md)",
                    backgroundColor: "var(--warning-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Zap size={20} style={{ color: "var(--warning)" }} fill="var(--warning)" />
                </div>
                <h2 className="section-title">Flash Deal</h2>
              </div>
              {flashDeals[0]?.flashDealEndsAt && (
                <CountdownTimer targetDate={flashDeals[0].flashDealEndsAt} />
              )}
            </div>
            <Link to="/flash-deals" className="section-link">
              Lihat Semua <ChevronRight size={16} />
            </Link>
          </div>
          <div className="scroll-x" style={{ gap: 16 }}>
            {flashDeals.map((product) => (
              <div key={product.id} style={{ minWidth: 180, maxWidth: 200 }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Best Seller ===== */}
      <section className="section" style={{ backgroundColor: "var(--surface)", padding: "40px 0" }} data-aos="fade-up">
        <div className="container">
          <div className="section-header">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--primary-light)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TrendingUp size={20} style={{ color: "var(--primary)" }} />
              </div>
              <h2 className="section-title">Best Seller</h2>
            </div>
            <Link to="/explore?sort=best-seller" className="section-link">
              Lihat Semua <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid-products">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== Surplus Rescue ===== */}
      <section className="section" data-aos="fade-up">
        <div className="container">
          <div className="section-header">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--success-light)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Leaf size={20} style={{ color: "var(--success)" }} />
              </div>
              <div>
                <h2 className="section-title">Surplus Rescue</h2>
                <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>
                  Selamatkan makanan, hemat kantong!
                </p>
              </div>
            </div>
            <Link to="/explore?type=surplus" className="section-link">
              Lihat Semua <ChevronRight size={16} />
            </Link>
          </div>

          {/* Surplus Info Banner */}
          <div
            style={{
              background: "linear-gradient(135deg, #E8F8F0 0%, #D4EDDA 100%)",
              borderRadius: "var(--radius-lg)",
              padding: "16px 20px",
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", gap: 20, flex: 1, flexWrap: "wrap" }}>
              {[
                { icon: ShieldCheck, label: "Masih Layak Konsumsi", color: "var(--success)" },
                { icon: Clock, label: "Pickup Terbatas", color: "var(--warning)" },
                { icon: Star, label: "Harga Spesial", color: "var(--primary)" },
              ].map(({ icon: Icon, label, color }) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 13,
                    fontWeight: 500,
                    color: "var(--foreground-secondary)",
                  }}
                >
                  <Icon size={16} style={{ color }} />
                  {label}
                </div>
              ))}
            </div>
          </div>

          <div className="scroll-x" style={{ gap: 16 }}>
            {surplusProducts.map((product) => (
              <div key={product.id} style={{ minWidth: 180, maxWidth: 200 }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Hidden Gem ===== */}
      <section
        className="section"
        style={{
          backgroundColor: "var(--surface)",
          padding: "40px 0",
        }}
        data-aos="fade-up"
      >
        <div className="container">
          <div className="section-header">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--info-light)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Gem size={20} style={{ color: "var(--info)" }} />
              </div>
              <div>
                <h2 className="section-title">Hidden Gem Ketintang</h2>
                <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>
                  UMKM tersembunyi yang wajib kamu coba!
                </p>
              </div>
            </div>
            <Link to="/hidden-gem" className="section-link">
              Lihat Semua <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid-umkm">
            {hiddenGems.slice(0, 3).map((umkm) => (
              <UMKMCard key={umkm.id} umkm={umkm} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== Cara Kerja (How It Works) ===== */}
      <section className="section" data-aos="fade-up">
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto 32px" }}>
            <span
              style={{
                backgroundColor: "var(--primary-light)",
                color: "var(--primary)",
                fontSize: 11,
                fontWeight: 700,
                padding: "4px 12px",
                borderRadius: "var(--radius-full)",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Mudah & Cepat
            </span>
            <h2 style={{ fontSize: 24, fontWeight: 800, marginTop: 8, marginBottom: 8, color: "var(--foreground)" }}>
              Cara Kerja SecondBit
            </h2>
            <p style={{ fontSize: 14, color: "var(--muted)" }}>
              Hanya butuh 3 langkah sederhana untuk menikmati kuliner hemat sekaligus kurangi food waste di sekitar kampus.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 20,
            }}
          >
            {[
              {
                step: "01",
                icon: ShoppingBag,
                title: "1. Temukan Makanan & Surplus",
                desc: "Pilih menu normal, Flash Deal harian, atau Surplus Rescue dengan potongan harga hingga 70% dari UMKM Ketintang.",
                color: "var(--primary)",
                bg: "var(--primary-light)",
              },
              {
                step: "02",
                icon: Coins,
                title: "2. Bayar Digital & Terima Tiket",
                desc: "Bayar otomatis via simulasi QRIS closed-loop dan langsung dapatkan Tiket QR Pickup dinamis tanpa repot screenshot.",
                color: "#6366F1",
                bg: "rgba(99, 102, 241, 0.1)",
              },
              {
                step: "03",
                icon: QrCode,
                title: "3. Ambil Pesanan di UMKM",
                desc: "Kunjungi warung pada rentang waktu pickup, tunjukkan kode QR untuk discan oleh penjual, dan bawa pulang makanan lezatmu!",
                color: "var(--success)",
                bg: "var(--success-light)",
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-xl)",
                    padding: "24px 20px",
                    position: "relative",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    boxShadow: "var(--shadow-sm)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: "var(--radius-lg)",
                        backgroundColor: item.bg,
                        color: item.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Icon size={22} />
                    </div>
                    <span
                      style={{
                        fontSize: 22,
                        fontWeight: 900,
                        color: "var(--border)",
                        fontFamily: "monospace",
                      }}
                    >
                      {item.step}
                    </span>
                  </div>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6, color: "var(--foreground)" }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: 13, color: "var(--foreground-secondary)", lineHeight: 1.5 }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== Testimonials (Mahasiswa UNESA) ===== */}
      <section
        className="section"
        style={{
          backgroundColor: "var(--surface)",
          padding: "40px 0",
        }}
        data-aos="fade-up"
      >
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto 32px" }}>
            <span
              style={{
                backgroundColor: "var(--success-light)",
                color: "var(--success)",
                fontSize: 11,
                fontWeight: 700,
                padding: "4px 12px",
                borderRadius: "var(--radius-full)",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Komunitas Peduli
            </span>
            <h2 style={{ fontSize: 24, fontWeight: 800, marginTop: 8, marginBottom: 8, color: "var(--foreground)" }}>
              Apa Kata Mahasiswa UNESA?
            </h2>
            <p style={{ fontSize: 14, color: "var(--muted)" }}>
              Cerita nyata mereka yang hemat budget dan bantu selamatkan makanan lezat setiap hari.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 20,
            }}
          >
            {[
              {
                name: "Bayu Pratama",
                role: "Mahasiswa FT UNESA (Ketintang)",
                comment: "Nasi pecel Bu Siti jam 8 malam dapat harga Rp 8.000, porsi kenyang dan rasanya tetap mantap. Uang bulanan terselamatkan!",
                stars: 5,
                food: "Pecel Bu Siti • Surplus Rescue",
              },
              {
                name: "Dinda Ayu",
                role: "Mahasiswa FBS UNESA",
                comment: "Suka banget sama konsep Food Rescue-nya. Sambil jajan hemat di akhir bulan, kita ikut andil nyata mengurangi food waste di Surabaya.",
                stars: 5,
                food: "Bakso Pak Darmo • Flash Deal",
              },
              {
                name: "Farhan Maulana",
                role: "Mahasiswa FEB UNESA",
                comment: "Sistem QR Pickup-nya cepat banget, tinggal tunjukin QR ke kasir langsung dapat makanan tanpa antre lama. Top markotop!",
                stars: 5,
                food: "Ayam Geprek Mas Eko • Best Seller",
              },
            ].map((review, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: "var(--background)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-xl)",
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  boxShadow: "var(--shadow-card)",
                }}
              >
                <div style={{ display: "flex", gap: 3 }}>
                  {Array.from({ length: review.stars }).map((_, s) => (
                    <Star key={s} size={14} fill="var(--warning)" stroke="var(--warning)" />
                  ))}
                </div>
                <p style={{ fontSize: 13.5, fontStyle: "italic", color: "var(--foreground)", lineHeight: 1.5, flex: 1 }}>
                  "{review.comment}"
                </p>
                <div style={{ paddingTop: 8, borderTop: "1px solid var(--border-light)" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--foreground)" }}>
                    {review.name}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 500 }}>
                    {review.role}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--primary)", fontWeight: 600, marginTop: 4 }}>
                    🛒 {review.food}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA Section ===== */}
      <section className="section" data-aos="fade-up">
        <div className="container">
          <div
            style={{
              background: "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)",
              borderRadius: "var(--radius-xl)",
              padding: "48px 32px",
              textAlign: "center",
              color: "#fff",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -40,
                right: -40,
                width: 200,
                height: 200,
                borderRadius: "50%",
                backgroundColor: "rgba(255,255,255,0.1)",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: -60,
                left: -30,
                width: 160,
                height: 160,
                borderRadius: "50%",
                backgroundColor: "rgba(255,255,255,0.05)",
              }}
            />
            <div style={{ position: "relative", zIndex: 1 }}>
              <h2
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  marginBottom: 12,
                  lineHeight: 1.3,
                }}
              >
                Punya UMKM Makanan?
              </h2>
              <p
                style={{
                  fontSize: 16,
                  opacity: 0.9,
                  maxWidth: 480,
                  margin: "0 auto 24px",
                  lineHeight: 1.6,
                }}
              >
                Gabung jadi Mitra SecondBit! Dapatkan pembeli baru, kurangi food waste,
                dan kelola bisnis lebih mudah.
              </p>
              <Link
                to="/register"
                className="btn btn-lg"
                style={{
                  backgroundColor: "#fff",
                  color: "var(--primary)",
                  fontWeight: 700,
                  gap: 8,
                }}
              >
                Daftar Jadi Mitra <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .category-grid {
          grid-template-columns: repeat(5, 1fr) !important;
        }
        @media (min-width: 768px) {
          .category-grid {
            grid-template-columns: repeat(10, 1fr) !important;
          }
        }
      `}</style>
    </main>
  );
}

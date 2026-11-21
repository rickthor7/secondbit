import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Star,
  MapPin,
  Clock,
  ShieldCheck,
  Minus,
  Plus,
  ShoppingCart,
  ChevronLeft,
  Share2,
  Heart,
  Info,
  CheckCircle2,
  Sparkles,
  QrCode,
  Lock,
  Gift,
  AlertCircle,
  HelpCircle,
  Flag,
} from "lucide-react";
import { useState } from "react";
import Swal from "sweetalert2";
import { getProductBySlug, getProductsByUMKM, formatPrice, getDiscountPercent, reviews, umkmList } from "@/data/mockData";
import { showReportUMKMModal } from "@/utils/showReportUMKMModal";
import ProductCard from "@/components/shared/ProductCard";

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const product = getProductBySlug(slug || "");
  const [qty, setQty] = useState(1);
  const [isFav, setIsFav] = useState(false);

  if (!product) {
    return (
      <div className="container" style={{ padding: "80px 16px", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🍽️</div>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Produk tidak ditemukan</h2>
        <Link to="/explore" className="btn btn-primary" style={{ borderRadius: "var(--radius-full)" }}>
          Kembali ke Jelajahi
        </Link>
      </div>
    );
  }

  const umkm = umkmList.find((u) => u.id === product.umkmId || u.name === product.umkmName);
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount ? getDiscountPercent(product.originalPrice!, product.price) : 0;
  const relatedProducts = getProductsByUMKM(product.umkmId).filter((p) => p.id !== product.id);
  const productReviews = reviews.filter((r) => r.productId === product.id);

  const handleAddToCart = () => {
    Swal.fire({
      icon: "success",
      title: "Berhasil Ditambahkan!",
      text: `${qty}x ${product.name} telah masuk ke keranjang belanja Anda.`,
      confirmButtonColor: "#EE4D2D",
      confirmButtonText: "Lihat Keranjang",
      showCancelButton: true,
      cancelButtonText: "Lanjut Belanja",
    }).then((res) => {
      if (res.isConfirmed) {
        navigate("/buyer/orders");
      }
    });
  };

  const handleBuyNow = () => {
    Swal.fire({
      title: "Konfirmasi Pesanan Pickup",
      html: `
        <div style="text-align: left; font-size: 14px;">
          <p><strong>Item:</strong> ${qty}x ${product.name}</p>
          <p><strong>Total:</strong> <span style="color: #EE4D2D; font-weight: 700;">${formatPrice(product.price * qty)}</span></p>
          <p><strong>Metode:</strong> QRIS Closed-Loop</p>
          <p><strong>Lokasi Pickup:</strong> ${product.umkmName}</p>
          <p style="font-size: 12px; color: #757575; margin-top: 8px;">Tiket QR Pickup unik akan otomatis dibuat untuk ditunjukkan ke penjual.</p>
        </div>
      `,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Bayar & Dapatkan Tiket QR",
      cancelButtonText: "Batal",
      confirmButtonColor: "#EE4D2D",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: "success",
          title: "Pembayaran Berhasil!",
          text: "Tiket QR Pickup Anda telah diterbitkan.",
          confirmButtonColor: "#EE4D2D",
          confirmButtonText: "Buka Tiket Pickup",
        }).then(() => {
          navigate("/buyer/pickup");
        });
      }
    });
  };

  return (
    <main style={{ minHeight: "80vh", paddingBottom: 100 }}>
      <div className="container" style={{ paddingTop: 16 }}>
        {/* Back Button */}
        <Link
          to="/explore"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            fontSize: 14,
            color: "var(--muted)",
            marginBottom: 16,
          }}
        >
          <ChevronLeft size={18} /> Kembali
        </Link>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 32,
          }}
          className="product-detail-grid"
        >
          {/* Image */}
          <div>
            <div
              style={{
                borderRadius: "var(--radius-xl)",
                overflow: "hidden",
                position: "relative",
                paddingTop: "75%",
              }}
            >
              <img
                src={product.image}
                alt={product.name}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              {/* Badges */}
              <div style={{ position: "absolute", top: 16, left: 16, display: "flex", gap: 6 }}>
                {product.type === "flash-deal" && <span className="badge badge-flash">⚡ Flash Deal</span>}
                {product.type === "surplus" && <span className="badge badge-surplus">🌿 Surplus</span>}
                {product.isBestSeller && <span className="badge badge-bestseller">🔥 Best Seller</span>}
              </div>
              {/* Actions */}
              <div style={{ position: "absolute", top: 16, right: 16, display: "flex", gap: 8 }}>
                <button
                  className="btn btn-icon"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.9)",
                    borderRadius: "var(--radius-full)",
                    width: 40,
                    height: 40,
                  }}
                  onClick={() => setIsFav(!isFav)}
                >
                  <Heart size={20} fill={isFav ? "var(--primary)" : "none"} stroke={isFav ? "var(--primary)" : "var(--foreground)"} />
                </button>
                <button
                  className="btn btn-icon"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.9)",
                    borderRadius: "var(--radius-full)",
                    width: 40,
                    height: 40,
                  }}
                >
                  <Share2 size={20} />
                </button>
              </div>
              {hasDiscount && (
                <div
                  className="badge badge-discount"
                  style={{
                    position: "absolute",
                    bottom: 16,
                    right: 16,
                    fontSize: 16,
                    padding: "6px 14px",
                  }}
                >
                  -{discountPercent}%
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, lineHeight: 1.3 }}>
              {product.name}
            </h1>

            {/* Rating */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={16} fill={s <= product.rating ? "var(--warning)" : "var(--border)"} stroke={s <= product.rating ? "var(--warning)" : "var(--border)"} />
                ))}
                <span style={{ fontSize: 14, fontWeight: 600, marginLeft: 4 }}>{product.rating}</span>
                <span style={{ fontSize: 13, color: "var(--muted)" }}>({product.ratingCount})</span>
              </div>
              <span style={{ color: "var(--border)" }}>|</span>
              <span style={{ fontSize: 13, color: "var(--muted)" }}>Terjual {product.soldCount}</span>
            </div>

            {/* Price */}
            <div
              style={{
                backgroundColor: "var(--primary-lighter)",
                padding: "16px 20px",
                borderRadius: "var(--radius-lg)",
                marginBottom: 20,
              }}
            >
              <div className="price" style={{ gap: 12 }}>
                <span className="price-current" style={{ fontSize: 28 }}>
                  {formatPrice(product.price)}
                </span>
                {hasDiscount && (
                  <span className="price-original" style={{ fontSize: 16 }}>
                    {formatPrice(product.originalPrice!)}
                  </span>
                )}
              </div>
            </div>

            {/* UMKM Info */}
            <Link
              to={`/umkm/${umkm?.slug || product.umkmId}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "14px 16px",
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                marginBottom: 20,
                transition: "all var(--transition-fast)",
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "var(--surface-hover)")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "var(--surface)")}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--primary-light)",
                  color: "var(--primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <MapPin size={20} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--foreground)" }}>{product.umkmName}</div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>{umkm?.address || "Sekitar UNESA Ketintang"} • Lihat toko & menu →</div>
              </div>
            </Link>

            {/* Merchant report link */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: -14, marginBottom: 16 }}>
              <button
                type="button"
                onClick={() =>
                  showReportUMKMModal({
                    umkmName: product.umkmName,
                    umkmId: product.umkmId,
                  })
                }
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 11.5,
                  fontWeight: 600,
                  color: "var(--muted)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: "2px 6px",
                }}
                title="Laporkan toko atau produk ini ke Super Admin"
              >
                <Flag size={11} style={{ color: "var(--destructive)" }} />
                <span>Laporkan Masalah Toko</span>
              </button>
            </div>

            {/* Description */}
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, color: "var(--foreground)" }}>Deskripsi Makanan</h3>
              <p style={{ fontSize: 14, color: "var(--foreground-secondary)", lineHeight: 1.7 }}>
                {product.description}
              </p>
            </div>

            {/* Food Safety Info */}
            {(product.productionTime || product.shelfLife || product.pickupTime) && (
              <div
                style={{
                  backgroundColor: "var(--success-light)",
                  border: "1px solid rgba(38, 170, 108, 0.2)",
                  borderRadius: "var(--radius-lg)",
                  padding: "16px 20px",
                  marginBottom: 20,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <ShieldCheck size={18} style={{ color: "var(--success)" }} />
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--success)" }}>Transparansi Ketahanan Pangan</h3>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {product.productionTime && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--foreground)" }}>
                      <Clock size={14} style={{ color: "var(--muted)" }} />
                      <span>Waktu Produksi: <strong>{product.productionTime}</strong></span>
                    </div>
                  )}
                  {product.shelfLife && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--foreground)" }}>
                      <Info size={14} style={{ color: "var(--muted)" }} />
                      <span>Estimasi Layak Konsumsi: <strong>{product.shelfLife}</strong></span>
                    </div>
                  )}
                  {product.pickupTime && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--foreground)" }}>
                      <Clock size={14} style={{ color: "var(--warning)" }} />
                      <span>Waktu Pickup di Lokasi: <strong style={{ color: "var(--warning)" }}>{product.pickupTime}</strong></span>
                    </div>
                  )}
                </div>

                <div
                  onClick={() => {
                    Swal.fire({
                      title: "Jaminan SOP & Mitigasi Risiko SecondBit",
                      html: `
                        <div style="text-align: left; font-size: 13px; line-height: 1.6; color: #475569;">
                          <p>Setiap makanan surplus di platform SecondBit dilindungi standar operasional ketat:</p>
                          <ul style="padding-left: 20px; margin: 8px 0;">
                            <li><strong>✓ Uji Organoleptik 3T:</strong> Tidak berbau asam, tidak berlendir, tidak berubah rasa saat disiapkan.</li>
                            <li><strong>✓ Batas Waktu Masak (Holding Time):</strong> Maksimal 4 jam untuk kuah santan, 8 jam untuk lauk kering.</li>
                            <li><strong>✓ Kemasan Food-Grade:</strong> Tersegel rapi dan higienis.</li>
                            <li><strong>✓ Garansi 100% Refund:</strong> Uang kembali jika makanan terbukti tidak layak konsumsi saat diambil.</li>
                          </ul>
                          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 8px 12px; border-radius: 6px; font-size: 12px; color: #16a34a; margin-top: 6px;">
                            🛡️ <em>Verifikasi closed-loop dengan tiket QR memastikan pesanan aman, higienis, dan tepat sasaran.</em>
                          </div>
                        </div>
                      `,
                      confirmButtonText: "Paham, Terima Kasih",
                      confirmButtonColor: "#EE4D2D",
                    });
                  }}
                  style={{
                    marginTop: 10,
                    paddingTop: 10,
                    borderTop: "1px dashed rgba(38, 170, 108, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "var(--success)",
                  }}
                >
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                    <ShieldCheck size={14} /> Terlindungi Standar SOP 3T & Garansi 100% Refund
                  </span>
                  <span style={{ fontSize: 11, textDecoration: "underline" }}>Pelajari SOP →</span>
                </div>
              </div>
            )}

            {/* Limited Surplus Protection Notice */}
            {product.type === "surplus" && (
              <div
                style={{
                  backgroundColor: "#F0F9FF",
                  border: "1.5px solid #BAE6FD",
                  borderRadius: "var(--radius-lg)",
                  padding: "16px 18px",
                  marginBottom: 20,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Lock size={16} style={{ color: "#0284C7" }} />
                    <h3 style={{ fontSize: 14, fontWeight: 800, color: "#0369A1" }}>
                      Kebijakan Limited Surplus Aktif
                    </h3>
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      backgroundColor: "#0284C7",
                      color: "#fff",
                      padding: "2px 8px",
                      borderRadius: "var(--radius-full)",
                    }}
                  >
                    Maks {product.maxSurplusPerUser || 2} Porsi/User
                  </span>
                </div>

                <p style={{ fontSize: 12.5, color: "#0C4A6E", lineHeight: 1.6, marginBottom: 10 }}>
                  Demi menjaga kelangsungan UMKM mitra & mencegah kanibalisasi omzet menu reguler, pembelian makanan surplus dibatasi maksimal <strong>{product.maxSurplusPerUser || 2} porsi per pelanggan</strong>.
                </p>

                <div
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: "var(--radius-md)",
                    padding: "10px 12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 10,
                    border: "1px dashed #7DD3FC",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Gift size={15} style={{ color: "#7C3AED", flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: "#475569" }}>
                      Butuh porsi lebih banyak? Pilih <strong>Surplus Bundle</strong> (Reguler + Surplus hemat).
                    </span>
                  </div>
                  <Link
                    to="/explore?type=bundle"
                    className="btn btn-sm"
                    style={{
                      backgroundColor: "#8B5CF6",
                      color: "#fff",
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "4px 10px",
                      borderRadius: "var(--radius-full)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Lihat Bundle →
                  </Link>
                </div>
              </div>
            )}

            {/* Surplus Bundle Showcase Card */}
            {(product.type === "bundle" || product.isBundle) && (
              <div
                style={{
                  backgroundColor: "#FAF5FF",
                  border: "1.5px solid #E9D5FF",
                  borderRadius: "var(--radius-lg)",
                  padding: "18px 20px",
                  marginBottom: 20,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Gift size={18} style={{ color: "#7C3AED" }} />
                    <h3 style={{ fontSize: 15, fontWeight: 800, color: "#6D28D9" }}>
                      Isi Paket Surplus Bundle
                    </h3>
                  </div>
                  {product.bundleSavings && (
                    <span
                      style={{
                        fontSize: 11.5,
                        fontWeight: 800,
                        backgroundColor: "#7C3AED",
                        color: "#fff",
                        padding: "3px 10px",
                        borderRadius: "var(--radius-full)",
                      }}
                    >
                      🎉 Hemat {formatPrice(product.bundleSavings)}
                    </span>
                  )}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
                  {product.bundleItems?.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "8px 12px",
                        backgroundColor: "#fff",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid #F3E8FF",
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#374151",
                      }}
                    >
                      <CheckCircle2 size={16} style={{ color: "#7C3AED", flexShrink: 0 }} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    fontSize: 11.5,
                    color: "#6B7280",
                    lineHeight: 1.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    paddingTop: 8,
                    borderTop: "1px dashed #DDD6FE",
                  }}
                >
                  <Sparkles size={14} style={{ color: "#7C3AED", flexShrink: 0 }} />
                  <span>
                    <strong>Margin-Friendly:</strong> Bundle ini mengombinasikan menu reguler (menjaga omzet warung) dengan surplus makanan (mencegah food waste).
                  </span>
                </div>
              </div>
            )}

            {/* Stock */}
            <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>
              Ketersediaan: <strong style={{ color: product.stock <= 5 ? "var(--destructive)" : "var(--foreground)" }}>{product.stock} porsi tersedia</strong>
              {product.type === "surplus" && (
                <span style={{ marginLeft: 8, color: "#0284C7", fontWeight: 600 }}>
                  (Dibatasi maks {product.maxSurplusPerUser || 2} porsi/akun)
                </span>
              )}
            </div>

            {/* Quantity + Actions */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)" }}>Jumlah:</span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    border: "1.5px solid var(--border)",
                    borderRadius: "var(--radius-md)",
                    overflow: "hidden",
                    backgroundColor: "var(--surface)",
                  }}
                >
                  <button
                    className="btn btn-icon btn-ghost"
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    style={{ borderRadius: 0, width: 36, height: 36 }}
                    aria-label="Kurangi"
                  >
                    <Minus size={15} />
                  </button>
                  <span
                    style={{
                      width: 44,
                      textAlign: "center",
                      fontWeight: 700,
                      fontSize: 15,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {qty}
                  </span>
                  <button
                    className="btn btn-icon btn-ghost"
                    onClick={() => {
                      if (product.type === "surplus") {
                        const limit = product.maxSurplusPerUser || 2;
                        if (qty >= limit) {
                          Swal.fire({
                            icon: "warning",
                            title: "Batas Maksimal Surplus Tercapai",
                            html: `
                              <div style="text-align: left; font-size: 13.5px; line-height: 1.6;">
                                <p>Demi melindungi keberlanjutan UMKM mitra & mencegah kanibalisasi menu reguler, pembelian makanan surplus dibatasi maksimal <strong>${limit} porsi per pelanggan</strong> per hari.</p>
                                <p style="margin-top: 10px; color: #7C3AED; font-weight: 600;">💡 Mau porsi lebih banyak? Pilih <strong>Surplus Bundle</strong> yang mengombinasikan menu reguler & surplus dengan harga hemat!</p>
                              </div>
                            `,
                            confirmButtonText: "Lihat Surplus Bundle",
                            showCancelButton: true,
                            cancelButtonText: "Tetap 2 Porsi",
                            confirmButtonColor: "#8B5CF6",
                          }).then((res) => {
                            if (res.isConfirmed) {
                              navigate("/explore?type=bundle");
                            }
                          });
                          return;
                        }
                      }
                      setQty(Math.min(product.stock, qty + 1));
                    }}
                    style={{ borderRadius: 0, width: 36, height: 36 }}
                    aria-label="Tambah"
                  >
                    <Plus size={15} />
                  </button>
                </div>
                <div style={{ fontSize: 13, color: "var(--muted)" }}>
                  Subtotal: <strong style={{ color: "var(--primary)" }}>{formatPrice(product.price * qty)}</strong>
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button
                  className="btn btn-secondary btn-lg"
                  onClick={handleAddToCart}
                  style={{ flex: 1, minWidth: 180, borderRadius: "var(--radius-lg)" }}
                >
                  <ShoppingCart size={18} />
                  <span>+ Keranjang</span>
                </button>
                <button
                  className="btn btn-primary btn-lg"
                  onClick={handleBuyNow}
                  style={{ flex: 1.2, minWidth: 200, borderRadius: "var(--radius-lg)" }}
                >
                  <QrCode size={18} />
                  <span>Beli Langsung (Tiket QR)</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        {productReviews.length > 0 && (
          <div style={{ marginTop: 48 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>
              Ulasan ({productReviews.length})
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {productReviews.map((review) => (
                <div
                  key={review.id}
                  style={{
                    padding: "16px 20px",
                    backgroundColor: "var(--surface)",
                    borderRadius: "var(--radius-lg)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "var(--radius-full)",
                        backgroundColor: "var(--primary-light)",
                        color: "var(--primary)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 600,
                        fontSize: 13,
                      }}
                    >
                      {review.userName.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{review.userName}</div>
                      <div style={{ display: "flex", gap: 2 }}>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} size={11} fill={s <= review.rating ? "var(--warning)" : "var(--border)"} stroke={s <= review.rating ? "var(--warning)" : "var(--border)"} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: "var(--foreground-secondary)", lineHeight: 1.6 }}>
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div style={{ marginTop: 48 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>
              Produk Lainnya dari {product.umkmName}
            </h2>
            <div className="scroll-x" style={{ gap: 16 }}>
              {relatedProducts.map((p) => (
                <div key={p.id} style={{ minWidth: 180, maxWidth: 200 }}>
                  <ProductCard product={p} showUMKM={false} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (min-width: 768px) {
          .product-detail-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}

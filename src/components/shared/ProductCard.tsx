import { Link } from "react-router-dom";
import { Star, Clock, MapPin, Plus, Flame } from "lucide-react";
import Swal from "sweetalert2";
import type { Product } from "@/types";
import { formatPrice, getDiscountPercent } from "@/data/mockData";

interface ProductCardProps {
  product: Product;
  showUMKM?: boolean;
}

export default function ProductCard({ product, showUMKM = true }: ProductCardProps) {
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? getDiscountPercent(product.originalPrice!, product.price)
    : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    Swal.fire({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      icon: "success",
      title: `${product.name} ditambahkan ke keranjang!`,
      background: "var(--background)",
      color: "var(--foreground)",
    });
  };

  return (
    <Link
      to={`/product/${product.slug}`}
      className="card"
      style={{
        display: "flex",
        flexDirection: "column",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      {/* Image */}
      <div
        style={{
          position: "relative",
          paddingTop: "100%",
          overflow: "hidden",
          backgroundColor: "var(--surface)",
        }}
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform var(--transition-slow)",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.transform = "scale(1.06)")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.transform = "scale(1)")
          }
        />

        {/* Badges */}
        <div
          style={{
            position: "absolute",
            top: 8,
            left: 8,
            display: "flex",
            flexDirection: "column",
            gap: 4,
            zIndex: 2,
          }}
        >
          {product.type === "flash-deal" && (
            <span className="badge badge-flash" style={{ boxShadow: "0 2px 6px rgba(0,0,0,0.15)" }}>
              ⚡ Flash Deal
            </span>
          )}
          {product.type === "surplus" && (
            <span className="badge badge-surplus" style={{ boxShadow: "0 2px 6px rgba(0,0,0,0.15)" }}>
              🌿 Surplus Rescue
            </span>
          )}
          {product.isBestSeller && (
            <span className="badge badge-bestseller" style={{ boxShadow: "0 2px 6px rgba(0,0,0,0.15)" }}>
              🔥 Best Seller
            </span>
          )}
        </div>

        {/* Discount Badge */}
        {hasDiscount && (
          <div
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: "var(--destructive)",
              color: "#fff",
              padding: "2px 8px",
              borderRadius: "var(--radius-sm)",
              fontSize: 11,
              fontWeight: 800,
              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
              zIndex: 2,
            }}
          >
            -{discountPercent}%
          </div>
        )}

        {/* Stock indicator badge at bottom of image */}
        {product.stock <= 5 && (
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              background: "linear-gradient(to top, rgba(220, 53, 69, 0.95), rgba(220, 53, 69, 0.8))",
              color: "#fff",
              textAlign: "center",
              fontSize: 10.5,
              fontWeight: 700,
              padding: "4px 8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              letterSpacing: "0.2px",
            }}
          >
            <Flame size={12} />
            <span>Sisa {product.stock} porsi • Segera amankan!</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: "12px 14px", flex: 1, display: "flex", flexDirection: "column" }}>
        <h3
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: "var(--foreground)",
            marginBottom: 4,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            lineHeight: 1.35,
            minHeight: "2.7em",
          }}
        >
          {product.name}
        </h3>

        {showUMKM && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              marginBottom: 8,
            }}
          >
            <MapPin size={12} style={{ color: "var(--muted)", flexShrink: 0 }} />
            <span
              style={{
                fontSize: 12,
                color: "var(--muted)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontWeight: 500,
              }}
            >
              {product.umkmName}
            </span>
          </div>
        )}

        {/* Price & Quick Add */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginTop: "auto",
            marginBottom: 8,
          }}
        >
          <div className="price" style={{ margin: 0 }}>
            <span className="price-current" style={{ fontSize: 16 }}>
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="price-original" style={{ fontSize: 12 }}>
                {formatPrice(product.originalPrice!)}
              </span>
            )}
          </div>

          <button
            type="button"
            className="quick-add-btn"
            onClick={handleQuickAdd}
            title="Tambah ke Keranjang"
            aria-label="Tambah ke Keranjang"
          >
            <Plus size={16} strokeWidth={2.5} />
          </button>
        </div>

        {/* Rating & Sold */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 6,
            borderTop: "1px solid var(--border-light)",
            fontSize: 11.5,
            color: "var(--muted)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Star
              size={12}
              fill="var(--warning)"
              stroke="var(--warning)"
            />
            <span style={{ fontWeight: 700, color: "var(--foreground)" }}>
              {product.rating}
            </span>
            <span>({product.ratingCount})</span>
          </div>
          <span>Terjual {product.soldCount > 999 ? `${(product.soldCount / 1000).toFixed(1)}rb` : product.soldCount}</span>
        </div>

        {/* Pickup time for surplus/flash-deal */}
        {product.pickupTime && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              marginTop: 6,
              fontSize: 11,
              color: "var(--success)",
              fontWeight: 600,
              backgroundColor: "var(--success-light)",
              padding: "2px 6px",
              borderRadius: "var(--radius-sm)",
              width: "fit-content",
            }}
          >
            <Clock size={11} />
            <span>Pickup: {product.pickupTime}</span>
          </div>
        )}
      </div>
    </Link>
  );
}

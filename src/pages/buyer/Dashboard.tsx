import { Link } from "react-router-dom";
import {
  ShoppingBag,
  QrCode,
  Clock,
  Heart,
  Star,
  Zap,
  Gift,
  ChevronRight,
  TrendingUp,
  Leaf,
} from "lucide-react";
import { orders, formatPrice, getProductById } from "@/data/mockData";

export default function BuyerDashboard() {
  const activeOrders = orders.filter((o) => o.status !== "completed" && o.status !== "cancelled");
  const completedOrders = orders.filter((o) => o.status === "completed");

  const rescuedPortions = completedOrders.reduce(
    (sum, order) => sum + order.products.reduce((qty, item) => qty + item.quantity, 0),
    0
  );

  const savedAmount = completedOrders.reduce((sum, order) => {
    const orderSaving = order.products.reduce((total, item) => {
      const product = getProductById(item.productId);
      if (!product?.originalPrice) return total;
      return total + (product.originalPrice - item.price) * item.quantity;
    }, 0);
    return sum + orderSaving;
  }, 0);

  return (
    <main style={{ minHeight: "80vh", backgroundColor: "var(--surface)" }}>
      {/* Profile Header */}
      <div
        id="buyer-overview"
        className="dash-section"
        style={{
          background: "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)",
          padding: "32px 0 48px",
          color: "#fff",
        }}
      >
        <div className="container">
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "var(--radius-full)",
                backgroundColor: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                fontWeight: 700,
              }}
            >
              A
            </div>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 700 }}>Halo, Ahmad! 👋</h1>
              <p style={{ fontSize: 13, opacity: 0.8 }}>Mau makan apa hari ini?</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: -24, paddingBottom: 40 }}>
        {/* Quick Actions */}
        <div
          style={{
            backgroundColor: "var(--background)",
            borderRadius: "var(--radius-xl)",
            boxShadow: "var(--shadow-md)",
            padding: "20px",
            marginBottom: 24,
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 12,
          }}
        >
          {[
            { icon: ShoppingBag, label: "Pesanan", path: "/buyer/orders", color: "var(--primary)" },
            { icon: Heart, label: "Favorit", path: "/buyer/favorites", color: "#E91E63" },
            { icon: QrCode, label: "Pickup", path: "/buyer/pickup", color: "var(--success)" },
            { icon: Gift, label: "Voucher", path: "/buyer/vouchers", color: "var(--warning)" },
          ].map(({ icon: Icon, label, path, color }) => (
            <Link
              key={label}
              to={path}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                padding: "8px",
                borderRadius: "var(--radius-md)",
                textDecoration: "none",
                transition: "background var(--transition-fast)",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "var(--radius-md)",
                  backgroundColor: `${color}15`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon size={20} style={{ color }} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 500, color: "var(--foreground)" }}>{label}</span>
            </Link>
          ))}
        </div>

        {/* Saving Stats */}
        <div
          id="buyer-impact"
          className="dash-section"
          style={{
            background: "linear-gradient(135deg, #E8F8F0 0%, #D4EDDA 100%)",
            borderRadius: "var(--radius-xl)",
            padding: "20px 24px",
            marginBottom: 24,
            display: "flex",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <Leaf size={28} style={{ color: "var(--success)" }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: "var(--success)", fontWeight: 600, marginBottom: 2 }}>
              🌿 Impact Kamu
            </div>
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "var(--foreground)" }}>{rescuedPortions}</div>
                <div style={{ fontSize: 11, color: "var(--muted)" }}>Porsi Diselamatkan</div>
              </div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "var(--foreground)" }}>{formatPrice(savedAmount)}</div>
                <div style={{ fontSize: 11, color: "var(--muted)" }}>Total Hemat</div>
              </div>
            </div>
          </div>
          <Link
            to="/buyer/impact"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 2,
              fontSize: 12,
              fontWeight: 700,
              color: "var(--success)",
              whiteSpace: "nowrap",
            }}
          >
            Detail <ChevronRight size={15} />
          </Link>
        </div>

        {/* Active Orders */}
        <div id="buyer-orders" className="dash-section" style={{ marginBottom: 32 }}>
          <div className="section-header">
            <h2 className="section-title" style={{ fontSize: 17 }}>
              <Clock size={18} style={{ color: "var(--primary)", verticalAlign: "middle", marginRight: 6 }} />
              Pesanan Aktif
            </h2>
            <Link to="/buyer/orders" className="section-link">
              Lihat Semua <ChevronRight size={16} />
            </Link>
          </div>
          {activeOrders.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {activeOrders.map((order) => (
                <div
                  key={order.id}
                  className="card"
                  style={{
                    padding: "16px 20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>
                      {order.orderNumber}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                      {order.products.map((p) => p.productName).join(", ")}
                    </div>
                    <div style={{ fontSize: 13, color: "var(--muted)" }}>{order.umkmName}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span
                      className="badge"
                      style={{
                        backgroundColor:
                          order.status === "ready_for_pickup"
                            ? "var(--success-light)"
                            : "var(--info-light)",
                        color:
                          order.status === "ready_for_pickup"
                            ? "var(--success)"
                            : "var(--info)",
                        marginBottom: 6,
                      }}
                    >
                      {order.status === "ready_for_pickup" ? "Siap Pickup" : "Dibayar"}
                    </span>
                    <div className="price-current" style={{ fontSize: 14 }}>
                      {formatPrice(order.totalPrice)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "32px", color: "var(--muted)", fontSize: 14 }}>
              Tidak ada pesanan aktif
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { icon: Zap, label: "Flash Deal Hari Ini", path: "/flash-deals", color: "var(--warning)" },
            { icon: TrendingUp, label: "Best Seller Minggu Ini", path: "/explore?sort=best-seller", color: "var(--primary)" },
            { icon: Star, label: "Ulasan Saya", path: "/buyer/reviews", color: "#FFB300" },
          ].map(({ icon: Icon, label, path, color }) => (
            <Link
              key={label}
              to={path}
              className="card"
              style={{
                padding: "14px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Icon size={20} style={{ color }} />
                <span style={{ fontSize: 14, fontWeight: 500 }}>{label}</span>
              </div>
              <ChevronRight size={18} style={{ color: "var(--muted-light)" }} />
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

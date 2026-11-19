import { Link } from "react-router-dom";
import { Leaf, Package, Wallet, Droplets, Award, ArrowRight } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import StatCard from "@/components/dashboard/StatCard";
import Panel from "@/components/dashboard/Panel";
import { orders, formatPrice, getProductById } from "@/data/mockData";

const NEXT_BADGE = 10;

export default function BuyerImpact() {
  const completed = orders.filter((order) => order.status === "completed");

  const portions = completed.reduce(
    (sum, order) => sum + order.products.reduce((qty, p) => qty + p.quantity, 0),
    0
  );

  const saved = completed.reduce((sum, order) => {
    const orderSaving = order.products.reduce((total, item) => {
      const product = getProductById(item.productId);
      if (!product?.originalPrice) return total;
      return total + (product.originalPrice - item.price) * item.quantity;
    }, 0);
    return sum + orderSaving;
  }, 0);

  const progress = Math.min(Math.round((portions / NEXT_BADGE) * 100), 100);
  const co2 = (portions * 0.64).toFixed(1);
  const water = (portions * 250).toLocaleString("id-ID");

  return (
    <main style={{ minHeight: "80vh", backgroundColor: "var(--surface)", paddingBottom: 40 }}>
      <div className="container" style={{ paddingTop: 24 }}>
        <PageHeader
          kicker="Akun Pembeli"
          title="Impact Kamu"
          description="Setiap porsi yang kamu selamatkan mengurangi food waste dan menghemat pengeluaran."
          actions={
            <Link to="/explore" className="btn btn-primary">
              Selamatkan Lagi
            </Link>
          }
        />

        <div
          style={{
            background: "linear-gradient(135deg, #E8F8F0 0%, #D4EDDA 100%)",
            borderRadius: "var(--radius-xl)",
            padding: "22px 24px",
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "var(--radius-lg)",
              backgroundColor: "rgba(38, 170, 108, 0.16)",
              color: "var(--success)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Leaf size={26} />
          </div>
          <div style={{ flex: "1 1 240px", minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--success)", marginBottom: 2 }}>
              🌿 Kontribusi Food Rescue
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.3px" }}>
              {portions} porsi berhasil diselamatkan
            </div>
            <div style={{ fontSize: 12, color: "var(--foreground-secondary)", marginTop: 2 }}>
              Setara {co2} kg CO₂ dan {water} liter air yang tidak terbuang.
            </div>
          </div>
          <Award size={40} style={{ color: "var(--success)", opacity: 0.5 }} />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: 12,
            marginBottom: 20,
          }}
        >
          <StatCard label="Porsi Diselamatkan" value={String(portions)} icon={Package} tone="success" hint="dari pesanan selesai" />
          <StatCard label="Total Hemat" value={formatPrice(saved)} icon={Wallet} tone="primary" hint="dibanding harga normal" />
          <StatCard label="CO₂ Dihindari" value={`${co2} kg`} icon={Leaf} tone="success" />
          <StatCard label="Air Dihemat" value={`${water} L`} icon={Droplets} tone="info" />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 16,
            alignItems: "start",
          }}
        >
          <Panel title="Riwayat Penyelamatan" description="Pesanan selesai yang berkontribusi pada impact kamu.">
            {completed.length === 0 ? (
              <div style={{ textAlign: "center", padding: "28px 12px", color: "var(--muted)", fontSize: 13 }}>
                Belum ada riwayat penyelamatan.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {completed.map((order) => {
                  const orderPortions = order.products.reduce((sum, p) => sum + p.quantity, 0);
                  return (
                    <div
                      key={order.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        paddingBottom: 12,
                        borderBottom: "1px solid var(--border-light)",
                      }}
                    >
                      <img
                        src={order.products[0]?.image}
                        alt={order.products[0]?.productName}
                        loading="lazy"
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: "var(--radius-md)",
                          objectFit: "cover",
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>
                          {order.products.map((p) => p.productName).join(", ")}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--muted)" }}>{order.umkmName}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--success)" }}>
                          +{orderPortions} porsi
                        </div>
                        <div style={{ fontSize: 11, color: "var(--muted)" }}>
                          {formatPrice(order.totalPrice)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Panel>

          <Panel title="Target Berikutnya">
            <div style={{ fontSize: 13, color: "var(--foreground-secondary)", marginBottom: 6 }}>
              Kumpulkan <strong>{NEXT_BADGE} porsi</strong> untuk membuka badge{" "}
              <strong>Food Saver</strong>.
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 10 }}>
              {portions} dari {NEXT_BADGE} porsi ({progress}%)
            </div>

            <div
              style={{
                height: 10,
                borderRadius: "var(--radius-full)",
                backgroundColor: "var(--success-light)",
                overflow: "hidden",
                marginBottom: 18,
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  borderRadius: "var(--radius-full)",
                  background: "linear-gradient(90deg, #26AA6C 0%, #4CD990 100%)",
                  transition: "width var(--transition-slow)",
                }}
              />
            </div>

            <Link
              to="/buyer/orders"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                fontWeight: 700,
                color: "var(--primary)",
              }}
            >
              Lihat semua pesanan <ArrowRight size={14} />
            </Link>
          </Panel>
        </div>
      </div>
    </main>
  );
}

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  Wallet,
  ChevronRight,
  QrCode,
  RotateCcw,
} from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import StatCard from "@/components/dashboard/StatCard";
import Panel from "@/components/dashboard/Panel";
import StatusPill, { type PillTone } from "@/components/dashboard/StatusPill";
import { orders, formatPrice } from "@/data/mockData";
import type { OrderStatus } from "@/types";

const STATUS_META: Record<OrderStatus, { label: string; tone: PillTone }> = {
  pending_payment: { label: "Menunggu Pembayaran", tone: "warning" },
  paid: { label: "Dibayar", tone: "info" },
  ready_for_pickup: { label: "Siap Pickup", tone: "success" },
  picked_up: { label: "Sudah Diambil", tone: "success" },
  completed: { label: "Selesai", tone: "success" },
  cancelled: { label: "Dibatalkan", tone: "danger" },
  expired: { label: "Kedaluwarsa", tone: "neutral" },
  refund_requested: { label: "Refund Ditinjau", tone: "warning" },
  refunded: { label: "Dana Dikembalikan", tone: "info" },
};

type Filter = "all" | "active" | "done";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "Semua" },
  { id: "active", label: "Berlangsung" },
  { id: "done", label: "Riwayat" },
];

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function BuyerOrders() {
  const [filter, setFilter] = useState<Filter>("all");

  const visibleOrders = useMemo(() => {
    const sorted = [...orders].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    if (filter === "active") {
      return sorted.filter((o) => !["completed", "cancelled", "refunded"].includes(o.status));
    }
    if (filter === "done") {
      return sorted.filter((o) => ["completed", "cancelled", "refunded"].includes(o.status));
    }
    return sorted;
  }, [filter]);

  const activeCount = orders.filter(
    (o) => !["completed", "cancelled", "refunded"].includes(o.status)
  ).length;
  const completedCount = orders.filter((o) => o.status === "completed").length;
  const totalSpent = orders
    .filter((o) => o.status === "completed")
    .reduce((sum, o) => sum + o.totalPrice, 0);

  return (
    <main style={{ minHeight: "80vh", backgroundColor: "var(--surface)", paddingBottom: 40 }}>
      <div className="container" style={{ paddingTop: 24 }}>
        <PageHeader
          kicker="Akun Pembeli"
          title="Pesanan Saya"
          description="Semua pesanan, status pickup, dan riwayat belanja kamu ada di sini."
          actions={
            <Link to="/explore" className="btn btn-primary">
              Cari Makanan
            </Link>
          }
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: 12,
            marginBottom: 20,
          }}
        >
          <StatCard label="Total Pesanan" value={String(orders.length)} icon={ClipboardList} />
          <StatCard label="Berlangsung" value={String(activeCount)} icon={Clock} tone="warning" hint="Menunggu pickup" />
          <StatCard label="Selesai" value={String(completedCount)} icon={CheckCircle2} tone="success" />
          <StatCard label="Total Belanja" value={formatPrice(totalSpent)} icon={Wallet} tone="info" />
        </div>

        <Panel
          title="Daftar Pesanan"
          action={
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {FILTERS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFilter(item.id)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "var(--radius-full)",
                    border: "1px solid",
                    borderColor: filter === item.id ? "var(--primary)" : "var(--border)",
                    backgroundColor: filter === item.id ? "var(--primary-light)" : "transparent",
                    color: filter === item.id ? "var(--primary)" : "var(--muted)",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          }
        >
          {visibleOrders.length === 0 ? (
            <div style={{ textAlign: "center", padding: "36px 16px", color: "var(--muted)", fontSize: 13 }}>
              Tidak ada pesanan di kategori ini.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {visibleOrders.map((order) => {
                const meta = STATUS_META[order.status];
                const isPickup = order.status === "ready_for_pickup";

                return (
                  <div
                    key={order.id}
                    style={{
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-lg)",
                      padding: "14px 16px",
                      display: "flex",
                      gap: 14,
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ display: "flex", gap: 10, flex: "1 1 260px", minWidth: 0 }}>
                      {order.products.slice(0, 2).map((product) => (
                        <img
                          key={product.productId}
                          src={product.image}
                          alt={product.productName}
                          loading="lazy"
                          style={{
                            width: 54,
                            height: 54,
                            borderRadius: "var(--radius-md)",
                            objectFit: "cover",
                            flexShrink: 0,
                          }}
                        />
                      ))}

                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            flexWrap: "wrap",
                            marginBottom: 3,
                          }}
                        >
                          <StatusPill label={meta.label} tone={meta.tone} />
                          <span style={{ fontSize: 11, color: "var(--muted)" }}>
                            {order.orderNumber} · {formatDate(order.createdAt)}
                          </span>
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>
                          {order.products.map((p) => `${p.quantity}x ${p.productName}`).join(", ")}
                        </div>
                        <div style={{ fontSize: 12, color: "var(--muted)" }}>
                          {order.umkmName} · Pickup {order.pickupTime}
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        marginLeft: "auto",
                      }}
                    >
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 11, color: "var(--muted)" }}>Total</div>
                        <div style={{ fontSize: 15, fontWeight: 800 }}>
                          {formatPrice(order.totalPrice)}
                        </div>
                      </div>

                      {isPickup ? (
                        <Link
                          to="/buyer/pickup"
                          className="btn"
                          style={{
                            backgroundColor: "var(--primary)",
                            color: "#fff",
                            fontSize: 12,
                            padding: "8px 12px",
                          }}
                        >
                          <QrCode size={14} /> QR Pickup
                        </Link>
                      ) : order.status === "completed" ? (
                        <Link
                          to="/explore"
                          className="btn"
                          style={{
                            backgroundColor: "var(--surface)",
                            color: "var(--foreground)",
                            fontSize: 12,
                            padding: "8px 12px",
                          }}
                        >
                          <RotateCcw size={14} /> Beli Lagi
                        </Link>
                      ) : (
                        <ChevronRight size={18} style={{ color: "var(--muted-light)" }} />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Panel>
      </div>
    </main>
  );
}

import { Link } from "react-router-dom";
import { MapPin, Clock, CheckCircle2, QrCode, Info } from "lucide-react";
import Swal from "sweetalert2";
import PageHeader from "@/components/dashboard/PageHeader";
import Panel from "@/components/dashboard/Panel";
import QrTicket from "@/components/dashboard/QrTicket";
import StatusPill from "@/components/dashboard/StatusPill";
import { orders, formatPrice } from "@/data/mockData";

const PICKUP_STEPS = [
  "Datang ke outlet sesuai jam pickup yang tertera.",
  "Tunjukkan QR code ke kasir atau penjual.",
  "Pesanan diserahkan, status otomatis menjadi selesai.",
];

export default function BuyerPickup() {
  const pickupOrders = orders.filter((order) =>
    ["ready_for_pickup", "paid"].includes(order.status)
  );

  const handleConfirm = async (orderNumber: string) => {
    const result = await Swal.fire({
      icon: "question",
      title: "Konfirmasi pickup?",
      text: `Pesanan ${orderNumber} sudah kamu terima di outlet?`,
      showCancelButton: true,
      confirmButtonText: "Ya, sudah",
      cancelButtonText: "Belum",
      confirmButtonColor: "#EE4D2D",
      cancelButtonColor: "#757575",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      await Swal.fire({
        icon: "success",
        title: "Terima kasih!",
        text: "Pesanan ditandai selesai. Selamat menikmati makananmu 🍽️",
        confirmButtonColor: "#EE4D2D",
      });
    }
  };

  return (
    <main style={{ minHeight: "80vh", backgroundColor: "var(--surface)", paddingBottom: 40 }}>
      <div className="container" style={{ paddingTop: 24 }}>
        <PageHeader
          kicker="Akun Pembeli"
          title="Ambil Pesanan"
          description="Tunjukkan QR code di bawah ke penjual saat mengambil pesananmu."
          actions={
            <Link to="/buyer/orders" className="btn btn-outline">
              Lihat Semua Pesanan
            </Link>
          }
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 16,
            alignItems: "start",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {pickupOrders.length === 0 ? (
              <Panel>
                <div style={{ textAlign: "center", padding: "28px 12px" }}>
                  <QrCode size={34} style={{ color: "var(--muted-light)", marginBottom: 10 }} />
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                    Belum ada pesanan untuk diambil
                  </div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 16 }}>
                    QR pickup akan muncul otomatis setelah pembayaran berhasil.
                  </div>
                  <Link to="/explore" className="btn btn-primary">
                    Cari Makanan
                  </Link>
                </div>
              </Panel>
            ) : (
              pickupOrders.map((order) => {
                const qrCode =
                  order.qrCode ??
                  `PKP-${order.orderNumber.replace(/\D/g, "").slice(-4) || "0001"}`;

                return (
                  <Panel key={order.id}>
                    <div
                      style={{
                        display: "flex",
                        gap: 18,
                        alignItems: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      <QrTicket code={qrCode} caption="Tunjukkan ke penjual" />

                      <div style={{ flex: "1 1 200px", minWidth: 0 }}>
                        <div style={{ marginBottom: 8 }}>
                          <StatusPill
                            label={order.status === "ready_for_pickup" ? "Siap Pickup" : "Dibayar"}
                            tone={order.status === "ready_for_pickup" ? "success" : "info"}
                          />
                        </div>

                        <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 2 }}>
                          {order.orderNumber}
                        </div>
                        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>
                          {order.umkmName}
                        </div>

                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 6,
                            fontSize: 12,
                            color: "var(--foreground-secondary)",
                            marginBottom: 12,
                          }}
                        >
                          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <Clock size={14} style={{ color: "var(--primary)" }} />
                            Pickup {order.pickupTime}
                          </span>
                          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <MapPin size={14} style={{ color: "var(--primary)" }} />
                            {order.umkmName} · Ketintang, Surabaya
                          </span>
                        </div>

                        <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 2 }}>
                          {order.products.map((p) => `${p.quantity}x ${p.productName}`).join(", ")}
                        </div>
                        <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 12 }}>
                          {formatPrice(order.totalPrice)}
                        </div>

                        <button
                          type="button"
                          className="btn btn-primary"
                          style={{ fontSize: 12, padding: "8px 14px" }}
                          onClick={() => handleConfirm(order.orderNumber)}
                        >
                          <CheckCircle2 size={15} /> Konfirmasi Sudah Diambil
                        </button>
                      </div>
                    </div>
                  </Panel>
                );
              })
            )}
          </div>

          <Panel title="Cara Ambil Pesanan">
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {PICKUP_STEPS.map((step, index) => (
                <div key={step} style={{ display: "flex", gap: 12 }}>
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      backgroundColor: "var(--primary-light)",
                      color: "var(--primary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontWeight: 800,
                      flexShrink: 0,
                    }}
                  >
                    {index + 1}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--foreground-secondary)", lineHeight: 1.55 }}>
                    {step}
                  </div>
                </div>
              ))}

              <div
                style={{
                  display: "flex",
                  gap: 8,
                  padding: "12px",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--info-light)",
                  color: "var(--info)",
                  fontSize: 12,
                  lineHeight: 1.55,
                }}
              >
                <Info size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                QR ini hanya contoh visual untuk demo. Di versi produksi, kode akan dibuat unik per
                pesanan dan diverifikasi oleh sistem kasir.
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </main>
  );
}

import { Link } from "react-router-dom";
import {
  Activity,
  Store,
  ShoppingBag,
  Star,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import StatCard from "@/components/dashboard/StatCard";
import Panel from "@/components/dashboard/Panel";
import StatusPill from "@/components/dashboard/StatusPill";

const ACTIVITIES = [
  {
    action: "UMKM baru mendaftar",
    detail: "Nasi Goreng Pak Min — menunggu verifikasi dokumen",
    time: "5 menit lalu",
    tone: "#2196F3",
    tag: "Pendaftaran",
  },
  {
    action: "Transaksi selesai",
    detail: "Order SB-127 — Rp45.000 di Warung Bu Siti",
    time: "12 menit lalu",
    tone: "#26AA6C",
    tag: "Transaksi",
  },
  {
    action: "Review baru",
    detail: "Rating 5 untuk Bakso Pak Darmo",
    time: "30 menit lalu",
    tone: "#FFAA00",
    tag: "Ulasan",
  },
  {
    action: "Refund request",
    detail: "Order SB-098 — Rp15.000, alasan pesanan tidak sesuai",
    time: "1 jam lalu",
    tone: "#E53935",
    tag: "Refund",
  },
  {
    action: "Settlement dicairkan",
    detail: "STL-0915 — Rp2.140.000 ke BCA •••• 8821",
    time: "3 jam lalu",
    tone: "#26AA6C",
    tag: "Keuangan",
  },
  {
    action: "Produk surplus habis",
    detail: "Nasi Campur Bali — 4 porsi terselamatkan",
    time: "5 jam lalu",
    tone: "#26AA6C",
    tag: "Surplus",
  },
];

const QUEUE = [
  { name: "Nasi Goreng Pak Min", category: "Nasi & Lauk", submitted: "Hari ini, 08:12" },
  { name: "Kopi Kenangan Ketintang", category: "Minuman", submitted: "Hari ini, 07:40" },
  { name: "Martabak Bangka Mas Budi", category: "Jajanan", submitted: "Kemarin, 19:25" },
];

export default function AdminActivity() {
  return (
    <main style={{ minHeight: "80vh", backgroundColor: "var(--surface)", paddingBottom: 40 }}>
      <div className="container" style={{ paddingTop: 24 }}>
        <PageHeader
          kicker="Panel Admin"
          title="Aktivitas Platform"
          description="Pantau kejadian terbaru di seluruh platform dalam satu linimasa."
          actions={
            <Link to="/admin/reports" className="btn btn-outline">
              Buka Laporan
            </Link>
          }
        />

        <div className="admin-stats-4-grid">
          <StatCard label="Event Hari Ini" value="24" icon={Activity} tone="primary" hint="+8 vs kemarin" />
          <StatCard label="Transaksi" value="127" icon={ShoppingBag} tone="success" hint="+15%" />
          <StatCard label="Ulasan Baru" value="18" icon={Star} tone="warning" />
          <StatCard label="Perlu Tindakan" value="3" icon={AlertTriangle} tone="danger" hint="verifikasi UMKM" />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 16,
            alignItems: "start",
          }}
        >
          <Panel title="Linimasa Terbaru" description="Enam aktivitas terakhir lintas modul.">
            <div style={{ display: "flex", flexDirection: "column" }}>
              {ACTIVITIES.map((item, index) => (
                <div
                  key={`${item.action}-${item.time}`}
                  style={{
                    display: "flex",
                    gap: 12,
                    paddingBottom: 14,
                    marginBottom: 14,
                    borderBottom:
                      index < ACTIVITIES.length - 1 ? "1px solid var(--border-light)" : "none",
                  }}
                >
                  <div
                    aria-hidden
                    style={{
                      width: 9,
                      height: 9,
                      borderRadius: "50%",
                      backgroundColor: item.tone,
                      marginTop: 5,
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        flexWrap: "wrap",
                        marginBottom: 2,
                      }}
                    >
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{item.action}</span>
                      <span
                        style={{
                          fontSize: 9.5,
                          fontWeight: 700,
                          letterSpacing: "0.3px",
                          textTransform: "uppercase",
                          color: "var(--muted)",
                          backgroundColor: "var(--surface)",
                          borderRadius: "var(--radius-full)",
                          padding: "2px 7px",
                        }}
                      >
                        {item.tag}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5 }}>
                      {item.detail}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--muted-light)", marginTop: 3 }}>
                      {item.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Panel
              title="Antrian Verifikasi"
              description="UMKM yang menunggu persetujuan admin."
              action={
                <Link
                  to="/admin/umkm"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#4C7FD1",
                  }}
                >
                  Kelola <ArrowRight size={13} />
                </Link>
              }
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {QUEUE.map((item) => (
                  <div
                    key={item.name}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 12px",
                      borderRadius: "var(--radius-md)",
                      backgroundColor: "var(--surface)",
                    }}
                  >
                    <Store size={17} style={{ color: "var(--muted)" }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 600 }}>{item.name}</div>
                      <div style={{ fontSize: 11, color: "var(--muted)" }}>
                        {item.category} · {item.submitted}
                      </div>
                    </div>
                    <StatusPill label="Menunggu" />
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="Kesehatan Platform">
              {[
                { label: "Uptime layanan", value: "99,98%", width: 99.98, color: "var(--success)" },
                { label: "Penyelesaian pesanan", value: "96%", width: 96, color: "var(--success)" },
                { label: "Respons admin < 1 jam", value: "88%", width: 88, color: "var(--warning)" },
              ].map((item) => (
                <div key={item.label} style={{ marginBottom: 12 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 12,
                      marginBottom: 5,
                    }}
                  >
                    <span style={{ color: "var(--foreground-secondary)" }}>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                  <div
                    style={{
                      height: 7,
                      borderRadius: "var(--radius-full)",
                      backgroundColor: "var(--surface)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${item.width}%`,
                        height: "100%",
                        borderRadius: "var(--radius-full)",
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              ))}

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 11.5,
                  color: "var(--success)",
                  fontWeight: 600,
                  marginTop: 4,
                }}
              >
                <CheckCircle2 size={14} /> Semua sistem berjalan normal
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </main>
  );
}

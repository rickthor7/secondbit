import { Link } from "react-router-dom";
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Package,
  Download,
  Store,
  ArrowUpRight,
} from "lucide-react";
import Swal from "sweetalert2";
import PageHeader from "@/components/dashboard/PageHeader";
import StatCard from "@/components/dashboard/StatCard";
import Panel from "@/components/dashboard/Panel";
import DataTable, { type DataColumn } from "@/components/dashboard/DataTable";
import { umkmList, formatPrice } from "@/data/mockData";
import type { UMKM } from "@/types";

const PLATFORM_WEEKLY = [
  { label: "Sen", value: 4900000 },
  { label: "Sel", value: 5250000 },
  { label: "Rab", value: 4700000 },
  { label: "Kam", value: 6100000 },
  { label: "Jum", value: 7350000 },
  { label: "Sab", value: 8200000 },
  { label: "Min", value: 5800000 },
];

const CATEGORY_BREAKDOWN = [
  { label: "Nasi & Lauk", share: 42, color: "var(--primary)" },
  { label: "Mie & Bakso", share: 21, color: "var(--warning)" },
  { label: "Minuman", share: 18, color: "var(--info)" },
  { label: "Jajanan", share: 12, color: "var(--success)" },
  { label: "Sate & Bakar", share: 7, color: "#9C6ADE" },
];

const topUmkm = [...umkmList].sort((a, b) => b.totalSold - a.totalSold).slice(0, 5);

const umkmColumns: DataColumn<UMKM>[] = [
  {
    key: "name",
    header: "UMKM",
    render: (row) => (
      <div>
        <div style={{ fontWeight: 600 }}>{row.name}</div>
        <div style={{ fontSize: 11, color: "var(--muted)" }}>{row.category}</div>
      </div>
    ),
  },
  {
    key: "rating",
    header: "Rating",
    align: "right",
    render: (row) => `${row.rating} (${row.ratingCount})`,
  },
  { key: "products", header: "Produk", align: "right", render: (row) => row.totalProducts },
  {
    key: "sold",
    header: "Terjual",
    align: "right",
    render: (row) => <strong>{row.totalSold} porsi</strong>,
  },
];

export default function AdminReports() {
  const max = Math.max(...PLATFORM_WEEKLY.map((day) => day.value));
  const weekTotal = PLATFORM_WEEKLY.reduce((sum, day) => sum + day.value, 0);

  const handleDownload = () => {
    Swal.fire({
      icon: "info",
      title: "Unduh laporan",
      text: "Laporan PDF/CSV akan tersedia setelah modul export backend aktif.",
      confirmButtonText: "Mengerti",
      confirmButtonColor: "#4C7FD1",
    });
  };

  return (
    <main style={{ minHeight: "80vh", backgroundColor: "var(--surface)", paddingBottom: 40 }}>
      <div className="container" style={{ paddingTop: 24 }}>
        <PageHeader
          kicker="Panel Admin"
          title="Laporan & Analitik"
          description="Performa platform minggu ini, kontribusi kategori, dan UMKM teratas."
          actions={
            <>
              <Link to="/admin/activity" className="btn btn-outline">
                Aktivitas
              </Link>
              <button type="button" className="btn btn-primary" onClick={handleDownload}>
                <Download size={15} /> Unduh Laporan
              </button>
            </>
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
          <StatCard label="GMV Bulan Ini" value={formatPrice(42500000)} icon={DollarSign} tone="success" hint="+22% vs bulan lalu" />
          <StatCard label="Pendapatan Platform" value={formatPrice(3400000)} icon={TrendingUp} tone="primary" hint="fee 8%" />
          <StatCard label="Transaksi Hari Ini" value="127" icon={ShoppingBag} tone="info" hint="+15% vs kemarin" />
          <StatCard label="Food Rescued" value="856 porsi" icon={Package} tone="warning" hint="bulan ini" />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 16,
            marginBottom: 16,
            alignItems: "start",
          }}
        >
          <Panel
            title="GMV 7 Hari Terakhir"
            description={`Total ${formatPrice(weekTotal)} dari ${PLATFORM_WEEKLY.length} hari.`}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: 8,
                height: 190,
                paddingTop: 12,
              }}
            >
              {PLATFORM_WEEKLY.map((day) => {
                const height = Math.max((day.value / max) * 150, 12);
                return (
                  <div
                    key={day.label}
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 6,
                      minWidth: 0,
                    }}
                    title={`${day.label}: ${formatPrice(day.value)}`}
                  >
                    <div
                      style={{
                        width: "100%",
                        maxWidth: 42,
                        height,
                        borderRadius: "6px 6px 3px 3px",
                        background:
                          day.label === "Sab"
                            ? "linear-gradient(180deg, #7FB2FF 0%, #4C7FD1 100%)"
                            : "linear-gradient(180deg, #A9C8F5 0%, #6E97CC 100%)",
                      }}
                    />
                    <span style={{ fontSize: 10.5, color: "var(--muted)", fontWeight: 600 }}>
                      {day.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </Panel>

          <Panel title="Kontribusi Kategori" description="Porsi dari total transaksi bulan ini.">
            {CATEGORY_BREAKDOWN.map((item) => (
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
                  <strong>{item.share}%</strong>
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
                      width: `${item.share}%`,
                      height: "100%",
                      borderRadius: "var(--radius-full)",
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </Panel>
        </div>

        <Panel
          title="UMKM Teratas"
          description="Berdasarkan total porsi terjual."
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
              Kelola UMKM <ArrowUpRight size={13} />
            </Link>
          }
        >
          <DataTable columns={umkmColumns} rows={topUmkm} minWidth={560} />

          <div
            style={{
              display: "flex",
              gap: 8,
              marginTop: 16,
              padding: "12px 14px",
              borderRadius: "var(--radius-md)",
              backgroundColor: "var(--info-light)",
              color: "var(--info)",
              fontSize: 12,
              lineHeight: 1.6,
            }}
          >
            <Store size={16} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>
              Warung Bu Siti konsisten masuk 3 besar. Pertimbangkan program spotlight untuk mitra
              dengan pertumbuhan positif dua pekan berturut-turut.
            </span>
          </div>
        </Panel>
      </div>
    </main>
  );
}

import { Link } from "react-router-dom";
import { DollarSign, ShoppingBag, Package, TrendingUp, ArrowRight } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import StatCard from "@/components/dashboard/StatCard";
import Panel from "@/components/dashboard/Panel";
import DataTable, { type DataColumn } from "@/components/dashboard/DataTable";
import AISalesInsight from "@/components/seller/AISalesInsight";
import RevenueTrendChart from "@/components/seller/RevenueTrendChart";
import {
  sellerWeeklySales,
  sellerSalesHistory,
  formatPrice,
} from "@/data/mockData";
import type { DailySalesPoint } from "@/types";

type SalesRow = DailySalesPoint & { id: string };

const columns: DataColumn<SalesRow>[] = [
  {
    key: "day",
    header: "Hari",
    render: (row) => (
      <div>
        <div style={{ fontWeight: 600 }}>{row.label}</div>
        <div style={{ fontSize: 11, color: "var(--muted)" }}>
          {new Date(row.date).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
        </div>
      </div>
    ),
  },
  {
    key: "revenue",
    header: "Omzet",
    align: "right",
    render: (row) => <strong>{formatPrice(row.revenue)}</strong>,
  },
  { key: "orders", header: "Pesanan", align: "right", render: (row) => row.orders },
  { key: "portions", header: "Porsi", align: "right", render: (row) => row.portions },
  {
    key: "surplus",
    header: "Surplus",
    align: "right",
    render: (row) => (
      <span style={{ color: row.surplus > 6 ? "var(--warning)" : "var(--muted)" }}>
        {row.surplus} porsi
      </span>
    ),
  },
];

export default function SellerAnalytics() {
  const revenue = sellerWeeklySales.reduce((sum, day) => sum + day.revenue, 0);
  const orderCount = sellerWeeklySales.reduce((sum, day) => sum + day.orders, 0);
  const portions = sellerWeeklySales.reduce((sum, day) => sum + day.portions, 0);
  const average = Math.round(revenue / sellerWeeklySales.length);

  const rows: SalesRow[] = sellerWeeklySales.map((day) => ({ ...day, id: day.date }));

  return (
    <main style={{ minHeight: "80vh", backgroundColor: "var(--surface)", paddingBottom: 40 }}>
      <div className="container" style={{ paddingTop: 24 }}>
        <PageHeader
          kicker="Portal Mitra"
          title="Analisis Penjualan"
          description="Ringkasan performa toko, tren omzet interaktif, prediksi omzet, dan rekomendasi stok dari mesin analisis SecondBit."
          actions={
            <Link to="/seller/orders" className="btn btn-outline">
              Pesanan Masuk
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
          <StatCard label="Omzet 7 Hari" value={formatPrice(revenue)} icon={DollarSign} tone="success" hint="+12% vs pekan lalu" />
          <StatCard label="Rata-rata / Hari" value={formatPrice(average)} icon={TrendingUp} tone="primary" />
          <StatCard label="Total Pesanan" value={String(orderCount)} icon={ShoppingBag} tone="info" />
          <StatCard label="Porsi Terjual" value={String(portions)} icon={Package} tone="warning" />
        </div>

        <div style={{ marginBottom: 20 }}>
          <RevenueTrendChart data={sellerSalesHistory} />
        </div>

        <div style={{ marginBottom: 20 }}>
          <AISalesInsight umkmId="u1" defaultExpanded />
        </div>

        <Panel
          title="Rincian Harian"
          description="Tujuh hari terakhir, dari yang paling lama sampai hari ini."
          action={
            <Link
              to="/seller/products"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                fontSize: 12,
                fontWeight: 700,
                color: "var(--primary)",
              }}
            >
              Kelola Produk <ArrowRight size={13} />
            </Link>
          }
        >
          <DataTable columns={columns} rows={rows} minWidth={560} />
        </Panel>
      </div>
    </main>
  );
}

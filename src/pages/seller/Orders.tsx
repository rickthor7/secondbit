import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ClipboardList, Clock, CheckCircle2, Wallet, ArrowRight } from "lucide-react";
import Swal from "sweetalert2";
import PageHeader from "@/components/dashboard/PageHeader";
import StatCard from "@/components/dashboard/StatCard";
import Panel from "@/components/dashboard/Panel";
import DataTable, { type DataColumn } from "@/components/dashboard/DataTable";
import StatusPill from "@/components/dashboard/StatusPill";
import { sellerOrders as initialOrders, formatPrice } from "@/data/mockData";
import type { SellerOrder, SellerOrderStatus } from "@/types";

type Filter = "Semua" | SellerOrderStatus;

const FILTERS: Filter[] = ["Semua", "Baru Dibayar", "Siap Pickup", "Selesai", "Dibatalkan"];

export default function SellerOrders() {
  const [items, setItems] = useState<SellerOrder[]>(initialOrders);
  const [filter, setFilter] = useState<Filter>("Semua");

  const visible = useMemo(
    () => (filter === "Semua" ? items : items.filter((order) => order.status === filter)),
    [filter, items]
  );

  const revenue = items
    .filter((order) => order.status !== "Dibatalkan")
    .reduce((sum, order) => sum + order.total, 0);
  const newCount = items.filter((order) => order.status === "Baru Dibayar").length;
  const readyCount = items.filter((order) => order.status === "Siap Pickup").length;

  const advance = async (order: SellerOrder) => {
    const nextStatus: SellerOrderStatus =
      order.status === "Baru Dibayar" ? "Siap Pickup" : "Selesai";

    const result = await Swal.fire({
      icon: "question",
      title:
        nextStatus === "Siap Pickup" ? "Terima pesanan?" : "Selesaikan pesanan?",
      html: `<div style="font-size:13px;color:#555;">${order.id} — ${order.items}<br/><strong>${order.customer}</strong> · ${formatPrice(order.total)}</div>`,
      showCancelButton: true,
      confirmButtonText: nextStatus === "Siap Pickup" ? "Ya, siapkan" : "Ya, selesai",
      cancelButtonText: "Batal",
      confirmButtonColor: "#EE4D2D",
      cancelButtonColor: "#757575",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    setItems((current) =>
      current.map((item) => (item.id === order.id ? { ...item, status: nextStatus } : item))
    );

    await Swal.fire({
      icon: "success",
      title: nextStatus === "Siap Pickup" ? "Pesanan siap diambil" : "Pesanan selesai",
      text:
        nextStatus === "Siap Pickup"
          ? `Kode pickup ${order.pickupCode} siap ditunjukkan pembeli.`
          : `Pesanan ${order.id} sudah diserahkan.`,
      confirmButtonColor: "#EE4D2D",
      timer: 2000,
    });
  };

  const columns: DataColumn<SellerOrder>[] = [
    {
      key: "id",
      header: "Pesanan",
      render: (row) => (
        <div>
          <div style={{ fontWeight: 700 }}>{row.id}</div>
          <div style={{ fontSize: 11, color: "var(--muted)" }}>{row.createdAt} WIB</div>
        </div>
      ),
    },
    {
      key: "customer",
      header: "Pembeli & Item",
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{row.customer}</div>
          <div style={{ fontSize: 11.5, color: "var(--muted)" }}>{row.items}</div>
        </div>
      ),
    },
    {
      key: "total",
      header: "Total",
      align: "right",
      render: (row) => <strong>{formatPrice(row.total)}</strong>,
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <StatusPill label={row.status} />,
    },
    {
      key: "code",
      header: "Kode Pickup",
      render: (row) => (
        <span
          style={{
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            fontSize: 11.5,
            fontWeight: 700,
            color: "var(--muted)",
          }}
        >
          {row.pickupCode}
        </span>
      ),
    },
    {
      key: "action",
      header: "Aksi",
      align: "right",
      render: (row) =>
        row.status === "Baru Dibayar" || row.status === "Siap Pickup" ? (
          <button
            type="button"
            onClick={() => advance(row)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              padding: "6px 10px",
              borderRadius: "var(--radius-full)",
              border: "1px solid var(--primary)",
              backgroundColor: "transparent",
              color: "var(--primary)",
              fontSize: 11,
              fontWeight: 700,
              whiteSpace: "nowrap",
            }}
          >
            {row.status === "Baru Dibayar" ? "Terima" : "Selesai"}
            <ArrowRight size={12} />
          </button>
        ) : (
          <span style={{ fontSize: 11, color: "var(--muted-light)" }}>—</span>
        ),
    },
  ];

  return (
    <main style={{ minHeight: "80vh", backgroundColor: "var(--surface)", paddingBottom: 40 }}>
      <div className="container" style={{ paddingTop: 24 }}>
        <PageHeader
          kicker="Portal Mitra"
          title="Pesanan Masuk"
          description="Konfirmasi pesanan, siapkan makanan, dan selesaikan serah terima ke pembeli."
          actions={
            <Link to="/seller/scanner" className="btn btn-primary">
              Buka Scanner QR
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
          <StatCard label="Total Pesanan" value={String(items.length)} icon={ClipboardList} tone="primary" />
          <StatCard label="Baru Dibayar" value={String(newCount)} icon={Clock} tone="warning" hint="perlu diterima" />
          <StatCard label="Siap Pickup" value={String(readyCount)} icon={CheckCircle2} tone="success" />
          <StatCard label="Nilai Pesanan" value={formatPrice(revenue)} icon={Wallet} tone="info" />
        </div>

        <Panel
          title="Daftar Pesanan"
          action={
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {FILTERS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFilter(item)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "var(--radius-full)",
                    border: "1px solid",
                    borderColor: filter === item ? "#FF8A6B" : "var(--border)",
                    backgroundColor: filter === item ? "rgba(238,77,45,0.08)" : "transparent",
                    color: filter === item ? "var(--primary)" : "var(--muted)",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          }
        >
          <DataTable
            columns={columns}
            rows={visible}
            minWidth={820}
            emptyText="Tidak ada pesanan dengan status ini."
          />
        </Panel>
      </div>
    </main>
  );
}

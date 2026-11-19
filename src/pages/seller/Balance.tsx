import { useState } from "react";
import { Link } from "react-router-dom";
import { Wallet, ArrowDownToLine, Clock, CheckCircle2, CreditCard, Info } from "lucide-react";
import Swal from "sweetalert2";
import PageHeader from "@/components/dashboard/PageHeader";
import StatCard from "@/components/dashboard/StatCard";
import Panel from "@/components/dashboard/Panel";
import DataTable, { type DataColumn } from "@/components/dashboard/DataTable";
import StatusPill from "@/components/dashboard/StatusPill";
import { settlementHistory as initialSettlements, formatPrice } from "@/data/mockData";
import type { Settlement } from "@/types";

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const columns: DataColumn<Settlement>[] = [
  {
    key: "id",
    header: "ID",
    render: (row) => (
      <div>
        <div style={{ fontWeight: 700 }}>{row.id}</div>
        <div style={{ fontSize: 11, color: "var(--muted)" }}>{formatDate(row.date)}</div>
      </div>
    ),
  },
  {
    key: "method",
    header: "Rekening",
    render: (row) => <span style={{ fontSize: 12 }}>{row.method}</span>,
  },
  {
    key: "amount",
    header: "Nominal",
    align: "right",
    render: (row) => <strong>{formatPrice(row.amount)}</strong>,
  },
  {
    key: "status",
    header: "Status",
    align: "right",
    render: (row) => <StatusPill label={row.status} />,
  },
];

export default function SellerBalance() {
  const [balance, setBalance] = useState(1250000);
  const [settlements, setSettlements] = useState<Settlement[]>(initialSettlements);

  const withdrawn = settlements
    .filter((item) => item.status === "Dicairkan")
    .reduce((sum, item) => sum + item.amount, 0);
  const pending = settlements
    .filter((item) => item.status !== "Dicairkan")
    .reduce((sum, item) => sum + item.amount, 0);

  const withdraw = async () => {
    if (balance <= 0) {
      await Swal.fire({
        icon: "info",
        title: "Saldo kosong",
        text: "Belum ada saldo yang bisa dicairkan saat ini.",
        confirmButtonColor: "#EE4D2D",
      });
      return;
    }

    const result = await Swal.fire({
      icon: "question",
      title: "Cairkan saldo?",
      html: `<div style="font-size:13px;color:#555;line-height:1.7;">
        Nominal: <strong>${formatPrice(balance)}</strong><br/>
        Tujuan: <strong>BCA •••• 8821</strong><br/>
        Estimasi masuk: 1×24 jam kerja
      </div>`,
      showCancelButton: true,
      confirmButtonText: "Ya, cairkan",
      cancelButtonText: "Batal",
      confirmButtonColor: "#EE4D2D",
      cancelButtonColor: "#757575",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    const newSettlement: Settlement = {
      id: `STL-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().slice(0, 10),
      amount: balance,
      status: "Diproses",
      method: "BCA •••• 8821",
    };

    setSettlements((current) => [newSettlement, ...current]);
    setBalance(0);

    await Swal.fire({
      icon: "success",
      title: "Pencairan diajukan",
      text: `${formatPrice(newSettlement.amount)} sedang diproses ke rekening BCA •••• 8821.`,
      confirmButtonColor: "#EE4D2D",
    });
  };

  return (
    <main style={{ minHeight: "80vh", backgroundColor: "var(--surface)", paddingBottom: 40 }}>
      <div className="container" style={{ paddingTop: 24 }}>
        <PageHeader
          kicker="Kelola Toko"
          title="Saldo & Pencairan"
          description="Pantau pendapatan, ajukan pencairan, dan lihat riwayat settlement."
          actions={
            <Link to="/seller/analytics" className="btn btn-outline">
              Analisis Penjualan
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
          <StatCard label="Saldo Tersedia" value={formatPrice(balance)} icon={Wallet} tone="success" hint="siap dicairkan" />
          <StatCard label="Total Dicairkan" value={formatPrice(withdrawn)} icon={CheckCircle2} tone="info" />
          <StatCard label="Dalam Proses" value={formatPrice(pending)} icon={Clock} tone="warning" />
          <StatCard label="Rekening Utama" value="BCA 8821" icon={CreditCard} tone="neutral" hint="a.n. Siti Aminah" />
        </div>

        <div
          style={{
            background: "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)",
            borderRadius: "var(--radius-xl)",
            padding: "24px",
            color: "#fff",
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 18,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div style={{ fontSize: 12.5, opacity: 0.85, marginBottom: 4 }}>Saldo Tersedia</div>
            <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.6px", lineHeight: 1.1 }}>
              {formatPrice(balance)}
            </div>
            <div style={{ fontSize: 12, opacity: 0.85, marginTop: 6 }}>
              Pendapatan otomatis masuk H+1 setelah pesanan selesai.
            </div>
          </div>
          <button
            type="button"
            onClick={withdraw}
            className="btn"
            disabled={balance <= 0}
            style={{
              backgroundColor: "rgba(255,255,255,0.2)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.3)",
              opacity: balance <= 0 ? 0.55 : 1,
              cursor: balance <= 0 ? "not-allowed" : "pointer",
            }}
          >
            <ArrowDownToLine size={16} /> Cairkan Dana
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 16,
            alignItems: "start",
          }}
        >
          <Panel title="Riwayat Settlement" description={`${settlements.length} transaksi pencairan tercatat.`}>
            <DataTable columns={columns} rows={settlements} minWidth={560} />
          </Panel>

          <Panel title="Rekening Pencairan">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "14px",
                borderRadius: "var(--radius-lg)",
                backgroundColor: "var(--surface)",
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--info-light)",
                  color: "var(--info)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <CreditCard size={20} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>BCA •••• 8821</div>
                <div style={{ fontSize: 11.5, color: "var(--muted)" }}>a.n. Siti Aminah</div>
              </div>
              <button
                type="button"
                className="btn btn-outline"
                style={{ marginLeft: "auto", fontSize: 11, padding: "6px 10px" }}
                onClick={() =>
                  Swal.fire({
                    icon: "info",
                    title: "Ubah rekening",
                    text: "Fitur ubah rekening akan tersedia setelah verifikasi KYC selesai.",
                    confirmButtonColor: "#EE4D2D",
                  })
                }
              >
                Ubah
              </button>
            </div>

            <div
              style={{
                display: "flex",
                gap: 8,
                fontSize: 12,
                color: "var(--foreground-secondary)",
                lineHeight: 1.6,
              }}
            >
              <Info size={16} style={{ color: "var(--info)", flexShrink: 0, marginTop: 1 }} />
              <span>
                Pencairan minimum Rp50.000. Biaya transfer ditanggung SecondBit untuk mitra MVP.
              </span>
            </div>
          </Panel>
        </div>
      </div>
    </main>
  );
}

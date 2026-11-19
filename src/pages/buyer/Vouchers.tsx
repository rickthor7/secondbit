import { Link } from "react-router-dom";
import { Gift, Clock, Wallet, Copy, ArrowRight } from "lucide-react";
import Swal from "sweetalert2";
import PageHeader from "@/components/dashboard/PageHeader";
import StatCard from "@/components/dashboard/StatCard";
import { vouchers, formatPrice } from "@/data/mockData";

export default function BuyerVouchers() {
  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      await Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: `Kode ${code} disalin`,
        showConfirmButton: false,
        timer: 1600,
        timerProgressBar: true,
      });
    } catch {
      await Swal.fire({
        icon: "info",
        title: "Kode voucher",
        html: `<strong style="font-size:18px;letter-spacing:1px;">${code}</strong>`,
        confirmButtonText: "Tutup",
        confirmButtonColor: "#EE4D2D",
      });
    }
  };

  const maxDiscount = vouchers.reduce(
    (max, voucher) => (voucher.type === "nominal" ? Math.max(max, voucher.discount) : max),
    0
  );

  return (
    <main style={{ minHeight: "80vh", backgroundColor: "var(--surface)", paddingBottom: 40 }}>
      <div className="container" style={{ paddingTop: 24 }}>
        <PageHeader
          kicker="Akun Pembeli"
          title="Voucher Saya"
          description="Pakai voucher sebelum kedaluwarsa dan hemat lebih banyak saat menyelamatkan makanan."
          actions={
            <Link to="/explore" className="btn btn-primary">
              Pakai Voucher
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
          <StatCard label="Voucher Tersedia" value={String(vouchers.length)} icon={Gift} tone="warning" />
          <StatCard label="Diskon Terbesar" value={formatPrice(maxDiscount)} icon={Wallet} tone="primary" />
          <StatCard label="Segera Hangus" value="1 voucher" icon={Clock} tone="danger" hint="PICKUPFREE · 21 Sep" />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
          {vouchers.map((voucher) => (
            <div
              key={voucher.id}
              style={{
                display: "flex",
                backgroundColor: "var(--background)",
                borderRadius: "var(--radius-xl)",
                boxShadow: "var(--shadow-sm)",
                overflow: "hidden",
                border: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  width: 96,
                  flexShrink: 0,
                  background: "linear-gradient(160deg, var(--primary) 0%, var(--secondary) 100%)",
                  color: "#fff",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "16px 8px",
                  textAlign: "center",
                }}
              >
                <Gift size={20} style={{ marginBottom: 6, opacity: 0.9 }} />
                <div style={{ fontSize: 15, fontWeight: 800, lineHeight: 1.15 }}>
                  {voucher.type === "percent" ? `${voucher.discount}%` : formatPrice(voucher.discount)}
                </div>
                <div style={{ fontSize: 9.5, opacity: 0.85, marginTop: 3 }}>OFF</div>
              </div>

              <div style={{ flex: 1, minWidth: 0, padding: "14px 16px" }}>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>{voucher.title}</div>
                <div style={{ fontSize: 11.5, color: "var(--muted)", marginBottom: 8 }}>
                  {voucher.minSpend > 0
                    ? `Min. belanja ${formatPrice(voucher.minSpend)}`
                    : "Tanpa minimum belanja"}
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    flexWrap: "wrap",
                    marginBottom: 10,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                      fontSize: 12,
                      fontWeight: 800,
                      letterSpacing: "0.8px",
                      padding: "4px 8px",
                      borderRadius: "var(--radius-sm)",
                      border: "1px dashed var(--primary)",
                      backgroundColor: "var(--primary-lighter)",
                      color: "var(--primary)",
                    }}
                  >
                    {voucher.code}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyCode(voucher.code)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 11,
                      fontWeight: 700,
                      color: "var(--primary)",
                      backgroundColor: "transparent",
                      border: "none",
                      padding: 0,
                    }}
                  >
                    <Copy size={13} /> Salin
                  </button>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 8,
                    flexWrap: "wrap",
                  }}
                >
                  <span style={{ fontSize: 11, color: "var(--muted)", display: "inline-flex", alignItems: "center", gap: 4 }}>
                    <Clock size={12} /> Berlaku s/d {voucher.expiresAt}
                  </span>
                  <Link
                    to="/explore"
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "var(--primary)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 3,
                    }}
                  >
                    Pakai <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ScanLine,
  QrCode,
  CheckCircle2,
  XCircle,
  Keyboard,
  ArrowRight,
  Info,
} from "lucide-react";
import Swal from "sweetalert2";
import PageHeader from "@/components/dashboard/PageHeader";
import Panel from "@/components/dashboard/Panel";
import StatusPill from "@/components/dashboard/StatusPill";
import { sellerOrders, formatPrice } from "@/data/mockData";
import type { SellerOrder } from "@/types";

type ScanResult =
  | { state: "idle" }
  | { state: "notfound"; code: string }
  | { state: "found"; order: SellerOrder };

const SAMPLE_CODES = ["PKP-4821", "PKP-4824", "PKP-4822"];

export default function SellerScanner() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<ScanResult>({ state: "idle" });
  const navigate = useNavigate();

  const checkCode = (value: string) => {
    const normalized = value.trim().toLowerCase();
    const found = sellerOrders.find(
      (order) =>
        order.pickupCode.toLowerCase() === normalized ||
        order.id.toLowerCase() === normalized
    );

    if (!found) {
      setResult({ state: "notfound", code: value.trim() || "—" });
      return;
    }

    setResult({ state: "found", order: found });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    checkCode(code);
  };

  const handleHandover = async (order: SellerOrder) => {
    if (order.status !== "Siap Pickup") {
      const info = await Swal.fire({
        icon: "info",
        title: "Pesanan belum siap",
        text: `Status pesanan ${order.id} masih "${order.status}". Terima dan siapkan dulu di halaman Pesanan Masuk.`,
        confirmButtonText: "Buka Pesanan Masuk",
        confirmButtonColor: "#EE4D2D",
      });
      if (info.isConfirmed) navigate("/seller/orders");
      return;
    }

    const confirm = await Swal.fire({
      icon: "question",
      title: "Serahkan pesanan?",
      html: `<div style="font-size:13px;color:#555;line-height:1.7;">
        <strong>${order.id}</strong><br/>
        ${order.customer} — ${order.items}<br/>
        ${formatPrice(order.total)}
      </div>`,
      showCancelButton: true,
      confirmButtonText: "Ya, serahkan",
      cancelButtonText: "Batal",
      confirmButtonColor: "#EE4D2D",
      cancelButtonColor: "#757575",
      reverseButtons: true,
    });

    if (!confirm.isConfirmed) return;

    await Swal.fire({
      icon: "success",
      title: "Serah terima berhasil",
      text: `Pesanan ${order.id} sudah diserahkan ke ${order.customer}.`,
      confirmButtonColor: "#EE4D2D",
    });
  };

  return (
    <main style={{ minHeight: "80vh", backgroundColor: "var(--surface)", paddingBottom: 40 }}>
      <div className="container" style={{ paddingTop: 24 }}>
        <PageHeader
          kicker="Kelola Toko"
          title="Scanner QR Pickup"
          description="Validasi kode pickup pembeli sebelum menyerahkan pesanan."
          actions={
            <Link to="/seller/orders" className="btn btn-outline">
              Pesanan Masuk
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
          <Panel title="Pindai / Masukkan Kode" description="Arahkan kamera ke QR pembeli, atau ketik kodenya manual.">
            <div
              style={{
                position: "relative",
                height: 200,
                borderRadius: "var(--radius-lg)",
                background: "linear-gradient(150deg, #1C1C1E 0%, #3A3A3E 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
                overflow: "hidden",
              }}
            >
              <div
                aria-hidden
                style={{
                  width: 132,
                  height: 132,
                  border: "2px solid rgba(255,140,107,0.85)",
                  borderRadius: "var(--radius-lg)",
                  boxShadow: "0 0 0 9999px rgba(0,0,0,0.28)",
                }}
              />
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  left: "50%",
                  width: 132,
                  height: 2,
                  background: "linear-gradient(90deg, transparent, #FF8A6B, transparent)",
                  transform: "translateX(-50%)",
                  top: "50%",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 12,
                  left: 0,
                  right: 0,
                  textAlign: "center",
                  fontSize: 11,
                  color: "rgba(255,255,255,0.75)",
                }}
              >
                <ScanLine size={14} style={{ verticalAlign: "middle", marginRight: 4 }} />
                Kamera demo — gunakan input manual di bawah
              </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <div style={{ position: "relative", flex: 1 }}>
                <Keyboard
                  size={15}
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--muted-light)",
                  }}
                />
                <input
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  placeholder="Contoh: PKP-4821"
                  aria-label="Kode pickup"
                  style={{
                    width: "100%",
                    padding: "11px 12px 11px 34px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
                    fontSize: 13,
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                  }}
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ padding: "10px 16px" }}>
                Periksa
              </button>
            </form>

            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              <span style={{ fontSize: 11, color: "var(--muted)" }}>Coba kode:</span>
              {SAMPLE_CODES.map((sample) => (
                <button
                  key={sample}
                  type="button"
                  onClick={() => {
                    setCode(sample);
                    checkCode(sample);
                  }}
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                    padding: "3px 8px",
                    borderRadius: "var(--radius-full)",
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--surface)",
                    color: "var(--foreground-secondary)",
                  }}
                >
                  {sample}
                </button>
              ))}
            </div>
          </Panel>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {result.state === "idle" && (
              <Panel title="Hasil Pemeriksaan">
                <div style={{ textAlign: "center", padding: "26px 8px" }}>
                  <QrCode size={36} style={{ color: "var(--muted-light)", marginBottom: 10 }} />
                  <div style={{ fontSize: 13, color: "var(--muted)" }}>
                    Hasil scan atau input kode akan muncul di sini.
                  </div>
                </div>
              </Panel>
            )}

            {result.state === "notfound" && (
              <Panel>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <XCircle size={22} style={{ color: "var(--destructive)", flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 3 }}>
                      Kode tidak dikenali
                    </div>
                    <div style={{ fontSize: 12.5, color: "var(--muted)", lineHeight: 1.6 }}>
                      Kode <strong>{result.code}</strong> tidak cocok dengan pesanan mana pun.
                      Periksa kembali atau minta pembeli membuka halaman Ambil Pesanan.
                    </div>
                  </div>
                </div>
              </Panel>
            )}

            {result.state === "found" && (
              <Panel title="Pesanan Ditemukan">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 10,
                    marginBottom: 10,
                  }}
                >
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 800 }}>{result.order.id}</div>
                    <div style={{ fontSize: 11.5, color: "var(--muted)" }}>
                      {result.order.createdAt} WIB · {result.order.pickupCode}
                    </div>
                  </div>
                  <StatusPill label={result.order.status} />
                </div>

                <div
                  style={{
                    padding: "12px 14px",
                    borderRadius: "var(--radius-md)",
                    backgroundColor: "var(--surface)",
                    marginBottom: 14,
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>
                    {result.order.customer}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>
                    {result.order.items}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "var(--primary)" }}>
                    {formatPrice(result.order.total)}
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ width: "100%" }}
                  onClick={() => handleHandover(result.order)}
                >
                  <CheckCircle2 size={15} /> Konfirmasi Serah Terima
                </button>
              </Panel>
            )}

            <Panel>
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
                  Scanner kamera dan validasi kode masih simulasi di sisi klien. Kode contoh di
                  atas diambil dari data pesanan demo.
                </span>
              </div>
              <Link
                to="/seller/orders"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  marginTop: 12,
                  fontSize: 12,
                  fontWeight: 700,
                  color: "var(--primary)",
                }}
              >
                Buka daftar pesanan <ArrowRight size={13} />
              </Link>
            </Panel>
          </div>
        </div>
      </div>
    </main>
  );
}

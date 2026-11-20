import { useState } from "react";
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

  const [activeHoverBar, setActiveHoverBar] = useState<string | null>(null);

  const generatePdfReport = () => {
    const printIframe = document.createElement("iframe");
    printIframe.style.position = "fixed";
    printIframe.style.right = "0";
    printIframe.style.bottom = "0";
    printIframe.style.width = "0";
    printIframe.style.height = "0";
    printIframe.style.border = "none";
    document.body.appendChild(printIframe);

    const doc = printIframe.contentWindow?.document;
    if (!doc) return;

    const todayDate = new Date().toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8">
        <title>Laporan Analitik Platform - SecondBit</title>
        <style>
          * { box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #1A1D20;
            padding: 32px;
            margin: 0;
            background: #fff;
            line-height: 1.5;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2px solid #EE4D2D;
            padding-bottom: 16px;
            margin-bottom: 24px;
          }
          .brand-title {
            font-size: 24px;
            font-weight: 800;
            color: #EE4D2D;
            letter-spacing: -0.5px;
          }
          .brand-subtitle {
            font-size: 13px;
            color: #4B5563;
            margin-top: 2px;
          }
          .meta-box {
            text-align: right;
            font-size: 12px;
            color: #4B5563;
            line-height: 1.6;
          }
          h2 {
            font-size: 15px;
            font-weight: 700;
            margin: 22px 0 10px;
            color: #111827;
            border-left: 4px solid #EE4D2D;
            padding-left: 8px;
          }
          .kpi-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 12px;
            margin-bottom: 24px;
          }
          .kpi-card {
            border: 1px solid #E5E7EB;
            border-radius: 8px;
            padding: 12px 14px;
            background: #F9FAFB;
          }
          .kpi-label {
            font-size: 11px;
            color: #6B7280;
            font-weight: 600;
            text-transform: uppercase;
          }
          .kpi-value {
            font-size: 17px;
            font-weight: 800;
            color: #111827;
            margin-top: 4px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            font-size: 12.5px;
          }
          th, td {
            border: 1px solid #E5E7EB;
            padding: 8px 10px;
            text-align: left;
          }
          th {
            background-color: #F3F4F6;
            font-weight: 700;
            color: #374151;
          }
          .text-right {
            text-align: right;
          }
          .total-row {
            font-weight: 700;
            background-color: #F9FAFB;
          }
          .footer {
            margin-top: 36px;
            border-top: 1px solid #E5E7EB;
            padding-top: 12px;
            font-size: 11px;
            color: #9CA3AF;
            display: flex;
            justify-content: space-between;
          }
          @page {
            size: A4 portrait;
            margin: 15mm;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="brand-title">🌱 SecondBit Platform</div>
            <div class="brand-subtitle">Solusi Pengurangan Food Waste & Marketplace UMKM — UNESA Ketintang, Surabaya</div>
          </div>
          <div class="meta-box">
            <div><strong>LAPORAN ANALITIK RESMI</strong></div>
            <div>Tanggal: ${todayDate}</div>
            <div>Otoritas: Super Administrator</div>
          </div>
        </div>

        <div class="kpi-grid">
          <div class="kpi-card">
            <div class="kpi-label">GMV Platform</div>
            <div class="kpi-value">Rp 42.500.000</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">Komisi Platform (8%)</div>
            <div class="kpi-value">Rp 3.400.000</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">Total Transaksi</div>
            <div class="kpi-value">127 Pesanan</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">Food Rescued</div>
            <div class="kpi-value">856 Porsi</div>
          </div>
        </div>

        <h2>Rincian Tren Penjualan Harian (7 Hari Terakhir)</h2>
        <table>
          <thead>
            <tr>
              <th>Hari</th>
              <th class="text-right">GMV Harian (Rp)</th>
              <th class="text-right">Potongan Komisi 8% (Rp)</th>
              <th class="text-right">Pendapatan Bersih Mitra (Rp)</th>
              <th class="text-right">Status Settlement</th>
            </tr>
          </thead>
          <tbody>
            ${PLATFORM_WEEKLY.map(
              (d) => `
              <tr>
                <td><strong>${d.label}</strong></td>
                <td class="text-right">${formatPrice(d.value)}</td>
                <td class="text-right">${formatPrice(Math.round(d.value * 0.08))}</td>
                <td class="text-right">${formatPrice(Math.round(d.value * 0.92))}</td>
                <td class="text-right" style="color: #059669; font-weight: 600;">Terselesaikan</td>
              </tr>
            `
            ).join("")}
            <tr class="total-row">
              <td>Total 7 Hari</td>
              <td class="text-right">${formatPrice(weekTotal)}</td>
              <td class="text-right">${formatPrice(Math.round(weekTotal * 0.08))}</td>
              <td class="text-right">${formatPrice(Math.round(weekTotal * 0.92))}</td>
              <td class="text-right">100% Closed</td>
            </tr>
          </tbody>
        </table>

        <h2>Top 5 Mitra UMKM Terlaris</h2>
        <table>
          <thead>
            <tr>
              <th style="width: 50px;">Rank</th>
              <th>Nama Mitra UMKM</th>
              <th>Kategori Makanan</th>
              <th class="text-right">Rating Pelanggan</th>
              <th class="text-right">Surplus Terjual</th>
            </tr>
          </thead>
          <tbody>
            ${topUmkm
              .map(
                (u, idx) => `
              <tr>
                <td>#${idx + 1}</td>
                <td><strong>${u.name}</strong></td>
                <td>${u.category}</td>
                <td class="text-right">${u.rating} ⭐ (${u.ratingCount})</td>
                <td class="text-right"><strong>${u.totalSold} porsi</strong></td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>

        <h2>Kontribusi Berdasarkan Kategori Makanan</h2>
        <table>
          <thead>
            <tr>
              <th>Kategori</th>
              <th class="text-right">Porsi Terjual</th>
              <th class="text-right">Persentase Kontribusi</th>
            </tr>
          </thead>
          <tbody>
            ${CATEGORY_BREAKDOWN.map(
              (c) => `
              <tr>
                <td><strong>${c.label}</strong></td>
                <td class="text-right">${Math.round((856 * c.share) / 100)} porsi</td>
                <td class="text-right"><strong>${c.share}%</strong></td>
              </tr>
            `
            ).join("")}
          </tbody>
        </table>

        <div class="footer">
          <span>SecondBit Platform — Berdayakan UMKM & Kurangi Pemborosan Pangan</span>
          <span>Dokumen Resmi Digenerate Secara Otomatis</span>
        </div>
      </body>
      </html>
    `;

    doc.open();
    doc.write(htmlContent);
    doc.close();

    setTimeout(() => {
      printIframe.contentWindow?.focus();
      printIframe.contentWindow?.print();

      setTimeout(() => {
        if (document.body.contains(printIframe)) {
          document.body.removeChild(printIframe);
        }
      }, 4000);
    }, 300);
  };

  const handleDownload = () => {
    Swal.fire({
      title: "Pilih Format Laporan",
      text: "Unduh ringkasan data analitik dan performa platform:",
      icon: "question",
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: "Unduh CSV",
      denyButtonText: "Simpan sebagai PDF",
      cancelButtonText: "Batal",
      confirmButtonColor: "var(--primary)",
      denyButtonColor: "#4C7FD1",
    }).then((res) => {
      if (res.isConfirmed) {
        const csvContent =
          "Hari,GMV (Rp)\n" +
          PLATFORM_WEEKLY.map((d) => `"${d.label}",${d.value}`).join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `laporan_platform_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        Swal.fire({
          icon: "success",
          title: "File CSV Berhasil Diunduh!",
          timer: 1800,
          confirmButtonColor: "var(--primary)",
        });
      } else if (res.isDenied) {
        generatePdfReport();
      }
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

        <div className="admin-stats-4-grid">
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

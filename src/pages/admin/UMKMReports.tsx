import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Eye,
  RotateCcw,
  DollarSign,
  AlertOctagon,
  Store,
  ChevronRight,
  FileText,
  UserCheck,
} from "lucide-react";
import Swal from "sweetalert2";
import PageHeader from "@/components/dashboard/PageHeader";
import StatCard from "@/components/dashboard/StatCard";
import Panel from "@/components/dashboard/Panel";
import StatusPill from "@/components/dashboard/StatusPill";
import {
  getStoredReports,
  saveReports,
  type UMKMReportData,
} from "@/utils/showReportUMKMModal";

export default function AdminUMKMReports() {
  const [reports, setReports] = useState<UMKMReportData[]>(() => getStoredReports());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredReports = useMemo(() => {
    return reports.filter((rep) => {
      const matchSearch =
        searchQuery === "" ||
        rep.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rep.umkmName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rep.reporterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rep.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus =
        statusFilter === "all" || rep.status === statusFilter;

      const matchCategory =
        selectedCategory === "all" || rep.category.includes(selectedCategory);

      return matchSearch && matchStatus && matchCategory;
    });
  }, [reports, searchQuery, statusFilter, selectedCategory]);

  const pendingCount = reports.filter((r) => r.status === "Perlu Investigasi").length;
  const inMediationCount = reports.filter((r) => r.status === "Dalam Mediasi").length;
  const refundedCount = reports.filter((r) => r.status === "Selesai - Refund").length;
  const sanctionedCount = reports.filter((r) => r.status === "Sanksi Diberikan").length;

  const handleMediate = (report: UMKMReportData) => {
    Swal.fire({
      title: `<span style="font-size:17px;font-weight:800;color:#1E293B;">Pusat Mediasi: ${report.id}</span>`,
      html: `
        <div style="text-align: left; font-size: 13px; line-height: 1.55; color: #334155;">
          <div style="background:#F8FAFC; border:1px solid #E2E8F0; padding:12px; border-radius:8px; margin-bottom:12px;">
            <div><strong>Toko Terlapor:</strong> <span style="color:#EE4D2D; font-weight:700;">${report.umkmName}</span></div>
            <div><strong>Pelapor:</strong> ${report.reporterName}</div>
            <div><strong>Waktu Lapor:</strong> ${report.createdAt}</div>
            ${report.orderNumber ? `<div><strong>ID Pesanan:</strong> ${report.orderNumber}</div>` : ""}
            <div><strong>Kategori Masalah:</strong> <span style="font-weight:700; color:#EF4444;">${report.category}</span></div>
          </div>

          <div style="margin-bottom:12px;">
            <strong>Kronologi Keluhan:</strong>
            <p style="margin:4px 0 0; background:#FFF; border:1px solid #CBD5E1; padding:8px 10px; border-radius:6px; font-size:12.5px; color:#475569;">
              "${report.description}"
            </p>
          </div>

          ${
            report.photoProofUrl
              ? `
            <div style="margin-bottom:12px;">
              <strong>Bukti Foto Konsumen:</strong>
              <div style="margin-top:6px; border-radius:8px; overflow:hidden; border:1px solid #E2E8F0; width:100%; height:140px;">
                <img src="${report.photoProofUrl}" alt="Bukti Pelanggaran" style="width:100%; height:100%; object-fit:cover;" />
              </div>
            </div>
            `
              : `<div style="font-size:12px; color:#94A3B8; margin-bottom:12px;">(Tanpa lampiran foto)</div>`
          }

          <div style="margin-bottom:8px; font-weight:700; color:#0F172A;">
            Pilih Keputusan / Tindakan Super Admin:
          </div>
          <div style="display:flex; flex-direction:column; gap:8px;">
            <button id="btn-refund" class="swal2-confirm swal2-styled" style="background:#16a34a; margin:0; width:100%; font-size:12.5px; padding:9px;">
              ✓ Setujui Pengembalian Dana 100% (Refund)
            </button>
            <button id="btn-sp" class="swal2-confirm swal2-styled" style="background:#F59E0B; margin:0; width:100%; font-size:12.5px; padding:9px;">
              ⚠️ Terbitkan Surat Peringatan Toko (SP-1)
            </button>
            <button id="btn-suspend" class="swal2-confirm swal2-styled" style="background:#DC2626; margin:0; width:100%; font-size:12.5px; padding:9px;">
              🚫 Bekukan Sementara Listing Surplus Toko
            </button>
            <button id="btn-reject" class="swal2-cancel swal2-styled" style="background:#64748B; margin:0; width:100%; font-size:12.5px; padding:9px;">
              ✕ Tolak Laporan (Tidak Terbukti)
            </button>
          </div>
        </div>
      `,
      showConfirmButton: false,
      showCloseButton: true,
      didOpen: () => {
        const btnRefund = document.getElementById("btn-refund");
        const btnSp = document.getElementById("btn-sp");
        const btnSuspend = document.getElementById("btn-suspend");
        const btnReject = document.getElementById("btn-reject");

        btnRefund?.addEventListener("click", () => updateReportStatus(report.id, "Selesai - Refund", "Refund 100% telah disetujui admin dan ditransfer ke saldo pembeli. Warung diwajibkan evaluasi penyiapan makanan."));
        btnSp?.addEventListener("click", () => updateReportStatus(report.id, "Sanksi Diberikan", "Surat Peringatan (SP-1) resmi diterbitkan ke toko terkait pelanggaran SOP. Toko wajib setor bukti foto checklist 3T selama 7 hari."));
        btnSuspend?.addEventListener("click", () => updateReportStatus(report.id, "Sanksi Diberikan", "Listing Surplus toko DIBEKUKAN SEMENTARA selama 3 hari kerja sampai audit higienitas diselesaikan."));
        btnReject?.addEventListener("click", () => updateReportStatus(report.id, "Ditolak", "Laporan ditolak setelah klarifikasi dengan pihak penjual karena tidak ditemukan bukti pelanggaran SOP."));
      },
    });
  };

  const updateReportStatus = (reportId: string, newStatus: UMKMReportData["status"], note: string) => {
    const updated = reports.map((r) =>
      r.id === reportId
        ? {
            ...r,
            status: newStatus,
            resolutionNote: note,
          }
        : r
    );
    setReports(updated);
    saveReports(updated);

    Swal.fire({
      icon: "success",
      title: "Keputusan Berhasil Ditetapkan!",
      html: `
        <div style="font-size:13.5px; text-align:left; line-height:1.6; color:#475569;">
          <p>Status tiket <strong>${reportId}</strong> kini diubah menjadi: <strong>${newStatus}</strong>.</p>
          <div style="background:#F8FAFC; border:1px solid #E2E8F0; padding:10px; border-radius:6px;">
            <strong>Catatan Mediasi Admin:</strong><br/>
            ${note}
          </div>
          <p style="font-size:12px; color:#64748B; margin-top:8px;">
            ✓ Notifikasi telah otomatis dikirimkan ke pembeli dan pihak UMKM.
          </p>
        </div>
      `,
      confirmButtonColor: "#EE4D2D",
    });
  };

  return (
    <main style={{ minHeight: "80vh", backgroundColor: "var(--surface)", paddingBottom: 40 }}>
      <div className="container" style={{ paddingTop: 24 }}>
        <PageHeader
          kicker="Panel Kontrol Super Admin"
          title="Pusat Pelaporan & Mediasi UMKM"
          description="Pantau keluhan pembeli terkait higienitas pangan surplus, kepatuhan jam pickup, transparansi porsi, serta eksekusi sanksi platform."
          actions={
            <Link to="/admin/umkm" className="btn btn-outline">
              <Store size={15} /> Direktori UMKM
            </Link>
          }
        />

        {/* Stats Overview */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 12,
            marginBottom: 20,
          }}
        >
          <StatCard
            label="Total Laporan Masuk"
            value={String(reports.length)}
            icon={FileText}
            tone="primary"
          />
          <StatCard
            label="Perlu Investigasi"
            value={String(pendingCount)}
            icon={AlertTriangle}
            tone="danger"
            hint="SLA Respon < 15 Menit"
          />
          <StatCard
            label="Dalam Mediasi"
            value={String(inMediationCount)}
            icon={Clock}
            tone="warning"
            hint="Klarifikasi Penjual"
          />
          <StatCard
            label="Selesai - Refund"
            value={String(refundedCount)}
            icon={DollarSign}
            tone="success"
            hint="Uang Kembali ke Pembeli"
          />
          <StatCard
            label="Sanksi Diberikan"
            value={String(sanctionedCount)}
            icon={ShieldAlert}
            tone="info"
            hint="SP-1 / Suspensi Toko"
          />
        </div>

        {/* Filters & Search Panel */}
        <Panel>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
              marginBottom: 16,
            }}
          >
            {/* Search */}
            <div style={{ position: "relative", flex: 1, minWidth: 240 }}>
              <Search
                size={16}
                style={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--muted)",
                }}
              />
              <input
                type="text"
                placeholder="Cari ID tiket, nama toko, pembeli, atau kronologi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input"
                style={{ paddingLeft: 36, width: "100%", fontSize: 13 }}
              />
            </div>

            {/* Status Filter */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input"
                style={{ fontSize: 12.5, padding: "6px 12px" }}
              >
                <option value="all">Semua Status</option>
                <option value="Perlu Investigasi">🔴 Perlu Investigasi</option>
                <option value="Dalam Mediasi">🟡 Dalam Mediasi</option>
                <option value="Selesai - Refund">🟢 Selesai - Refund</option>
                <option value="Sanksi Diberikan">🔵 Sanksi Diberikan</option>
                <option value="Ditolak">⚪ Ditolak</option>
              </select>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input"
                style={{ fontSize: 12.5, padding: "6px 12px" }}
              >
                <option value="all">Semua Kategori</option>
                <option value="Kualitas Makanan">Kualitas Makanan (SOP 3T)</option>
                <option value="Toko Tutup">Toko Tutup saat Pickup</option>
                <option value="Porsi">Porsi / Menu Tidak Sesuai</option>
                <option value="Kebersihan">Pelanggaran SOP Kebersihan</option>
              </select>
            </div>
          </div>

          {/* List of Reports */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filteredReports.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 16px", color: "var(--muted)" }}>
                <CheckCircle2 size={36} style={{ color: "var(--success)", marginBottom: 8 }} />
                <div style={{ fontSize: 15, fontWeight: 700, color: "var(--foreground)" }}>
                  Tidak ada laporan yang sesuai kriteria
                </div>
                <div style={{ fontSize: 13 }}>Semua keluhan telah terselesaikan atau tidak ada data yang cocok.</div>
              </div>
            ) : (
              filteredReports.map((report) => (
                <div
                  key={report.id}
                  style={{
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-lg)",
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    transition: "all 0.15s ease",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: 12,
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 3 }}>
                        <span style={{ fontSize: 13, fontWeight: 800, color: "var(--foreground)" }}>
                          {report.id}
                        </span>
                        <span style={{ color: "var(--border)" }}>•</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--primary)" }}>
                          {report.umkmName}
                        </span>
                        {report.orderNumber && (
                          <span
                            style={{
                              fontSize: 11,
                              backgroundColor: "var(--surface-sunken)",
                              padding: "2px 6px",
                              borderRadius: "var(--radius-sm)",
                              color: "var(--muted)",
                            }}
                          >
                            Pesanan: {report.orderNumber}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 11.5, color: "var(--muted)" }}>
                        Dilaporkan oleh <strong>{report.reporterName}</strong> • {report.createdAt}
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span
                        style={{
                          fontSize: 11.5,
                          fontWeight: 700,
                          padding: "3px 10px",
                          borderRadius: "var(--radius-full)",
                          backgroundColor:
                            report.status === "Perlu Investigasi"
                              ? "rgba(239, 68, 68, 0.12)"
                              : report.status === "Dalam Mediasi"
                              ? "rgba(245, 158, 11, 0.12)"
                              : report.status === "Selesai - Refund"
                              ? "rgba(34, 197, 94, 0.12)"
                              : "rgba(99, 102, 241, 0.12)",
                          color:
                            report.status === "Perlu Investigasi"
                              ? "#EF4444"
                              : report.status === "Dalam Mediasi"
                              ? "#D97706"
                              : report.status === "Selesai - Refund"
                              ? "var(--success)"
                              : "#6366F1",
                        }}
                      >
                        {report.status}
                      </span>
                    </div>
                  </div>

                  {/* Category & Description */}
                  <div
                    style={{
                      backgroundColor: "var(--surface-sunken)",
                      padding: "10px 12px",
                      borderRadius: "var(--radius-md)",
                      fontSize: 12.5,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 700, color: "var(--foreground)", marginBottom: 4 }}>
                      <AlertTriangle size={14} style={{ color: "#EF4444" }} />
                      Kategori: {report.category}
                    </div>
                    <div style={{ color: "var(--muted)", lineHeight: 1.5 }}>
                      "{report.description}"
                    </div>
                  </div>

                  {/* Resolution note if available */}
                  {report.resolutionNote && (
                    <div
                      style={{
                        backgroundColor: "rgba(34, 197, 94, 0.08)",
                        border: "1px solid rgba(34, 197, 94, 0.2)",
                        padding: "8px 12px",
                        borderRadius: "var(--radius-md)",
                        fontSize: 12,
                        color: "var(--success)",
                        lineHeight: 1.4,
                      }}
                    >
                      <strong>Keputusan Admin:</strong> {report.resolutionNote}
                    </div>
                  )}

                  {/* Action Bar */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingTop: 8,
                      borderTop: "1px dashed var(--border-light)",
                      flexWrap: "wrap",
                      gap: 8,
                    }}
                  >
                    <span style={{ fontSize: 11.5, color: "var(--muted)" }}>
                      {report.hasPhotoProof ? "📷 Lampiran foto tersedia" : "📄 Tanpa lampiran foto"}
                      {report.requestRefund ? " • Minta Refund 100%" : ""}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleMediate(report)}
                      className="btn btn-sm btn-primary"
                      style={{
                        gap: 6,
                        fontSize: 12,
                        fontWeight: 700,
                        padding: "6px 14px",
                        borderRadius: "var(--radius-md)",
                        cursor: "pointer",
                      }}
                    >
                      <UserCheck size={14} /> Tindak Lanjuti & Mediasi
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </Panel>
      </div>
    </main>
  );
}

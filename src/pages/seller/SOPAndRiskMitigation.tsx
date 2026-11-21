import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Package,
  QrCode,
  DollarSign,
  HeartHandshake,
  FileText,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Flame,
  CheckSquare,
  Square,
  AlertCircle,
  PhoneCall,
  RotateCcw,
} from "lucide-react";
import Swal from "sweetalert2";
import PageHeader from "@/components/dashboard/PageHeader";
import StatCard from "@/components/dashboard/StatCard";
import Panel from "@/components/dashboard/Panel";

export default function SOPAndRiskMitigation() {
  const [activeTab, setActiveTab] = useState<"sop" | "mitigasi" | "audit" | "insiden">("sop");

  // State untuk Checklist Uji Kelayakan Mandiri (Interactive Self-Audit)
  const [checklist, setChecklist] = useState({
    ujiBau: false,
    ujiTekstur: false,
    ujiWaktu: false,
    kemasanFoodGrade: false,
    labelPickup: false,
  });
  const [verifiedDate, setVerifiedDate] = useState<string | null>(() => {
    return localStorage.getItem("secondbit_sop_verified_date");
  });

  const allChecked = Object.values(checklist).every(Boolean);

  const toggleCheck = (key: keyof typeof checklist) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleVerify = async () => {
    if (!allChecked) {
      await Swal.fire({
        icon: "warning",
        title: "Checklist Belum Lengkap",
        text: "Pastikan semua poin kelayakan organoleptik & pengemasan sudah terpenuhi sebelum verifikasi.",
        confirmButtonColor: "#EE4D2D",
      });
      return;
    }

    const todayStr = new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    setVerifiedDate(todayStr);
    localStorage.setItem("secondbit_sop_verified_date", todayStr);

    await Swal.fire({
      icon: "success",
      title: "Verifikasi SOP Berhasil!",
      html: `
        <div style="font-size: 13.5px; text-align: left; line-height: 1.6; color: #475569;">
          <p>Warung Anda telah dinyatakan <strong>LOLOS UJI KELAYAKAN SOP</strong> untuk batch hari ini (${todayStr}).</p>
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 10px; border-radius: 8px; margin-top: 10px;">
            <strong style="color: #16a34a;">✓ Badge "Terverifikasi SOP Food Safety" Aktif</strong><br/>
            Pembeli di marketplace dapat melihat badge ini di profil warung Anda untuk meningkatkan kepercayaan.
          </div>
        </div>
      `,
      confirmButtonColor: "#16a34a",
    });
  };

  const showIncidentGuide = (type: string) => {
    let title = "";
    let html = "";

    if (type === "asam") {
      title = "Prosedur Komplain Makanan Asam / Basi";
      html = `
        <div style="text-align: left; font-size: 13px; line-height: 1.6; color: #334155;">
          <p><strong>Langkah Penanganan Cepat (< 15 Menit):</strong></p>
          <ol style="padding-left: 20px;">
            <li><strong>Minta Bukti Foto / Video:</strong> Minta pembeli memfoto kondisi makanan via chat aplikasi.</li>
            <li><strong>Keluarkan Refund 100% Instan:</strong> Klik opsi <em>Refund</em> di detail pesanan atau arahkan ke garansi platform. Uang pembeli kembali utuh.</li>
            <li><strong>Tarik Batch Serupa di Dapur:</strong> Periksa sisa porsi yang ada di etalase, segera buang jika berisiko sama.</li>
            <li><strong>Log Evaluasi Dapur:</strong> Catat penyebab (cth: santan terlalu lama di suhu ruang) agar tidak terulang.</li>
          </ol>
        </div>
      `;
    } else if (type === "terlambat") {
      title = "Prosedur Pembeli Terlambat Ambil (>30 Menit)";
      html = `
        <div style="text-align: left; font-size: 13px; line-height: 1.6; color: #334155;">
          <p><strong>Ketentuan Sesuai SOP SecondBit:</strong></p>
          <ul style="padding-left: 20px;">
            <li>Pembayaran sudah 100% lunas via QRIS, <strong>dana tetap masuk ke saldo merchant</strong>.</li>
            <li>Toleransi maksimal keterlambatan adalah 30 menit setelah jam tutup pickup.</li>
            <li>Jika warung sudah tutup, makanan dapat dialihkan ke <strong>Program Donasi Bank Pangan Kampus</strong> atau disimpan di pendingin higienis jika pembeli sudah konfirmasi via chat.</li>
          </ul>
        </div>
      `;
    } else {
      title = "Prosedur QR Scanner Pembeli Rusak / HP Mati";
      html = `
        <div style="text-align: left; font-size: 13px; line-height: 1.6; color: #334155;">
          <p><strong>Alternatif Verifikasi Aman:</strong></p>
          <ol style="padding-left: 20px;">
            <li>Minta pembeli menyebutkan <strong>Kode ID Pesanan</strong> (cth: SB-20260922-001) dan nama lengkap akun.</li>
            <li>Cocokkan dengan daftar pesanan di menu <em>Pesanan Masuk</em> aplikasi seller Anda.</li>
            <li>Klik tombol <em>Verifikasi Manual via ID</em> dan minta pembeli tanda tangan pada nota digital.</li>
          </ol>
        </div>
      `;
    }

    Swal.fire({
      title,
      html,
      confirmButtonText: "Paham, Tutup",
      confirmButtonColor: "#EE4D2D",
    });
  };

  return (
    <main style={{ minHeight: "80vh", backgroundColor: "var(--surface)", paddingBottom: 40 }}>
      <div className="container" style={{ paddingTop: 24 }}>
        <PageHeader
          kicker="Standar Mutu & Perlindungan Platform"
          title="SOP & Mitigasi Risiko Platform"
          description="Panduan standar operasional higienitas pangan surplus, kepatuhan batas simpan, serta kerangka mitigasi risiko untuk melindungi UMKM dan konsumen."
          actions={
            <>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setActiveTab("audit")}
              >
                <CheckCircle2 size={15} /> Uji Kelayakan Mandiri
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => showIncidentGuide("asam")}
              >
                <AlertTriangle size={15} /> Panduan Insiden
              </button>
            </>
          }
        />

        {/* Stats Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 12,
            marginBottom: 20,
          }}
        >
          <StatCard
            label="Kepatuhan SOP"
            value="98.5%"
            icon={ShieldCheck}
            tone="success"
            hint="Audit higienitas toko aktif"
          />
          <StatCard
            label="Insiden Kualitas"
            value="0 Kasus"
            icon={CheckCircle2}
            tone="success"
            hint="Bulan ini aman 100%"
          />
          <StatCard
            label="Proteksi Margin"
            value="Maks 2 Porsi"
            icon={DollarSign}
            tone="primary"
            hint="Anti-kanibalisasi aktif"
          />
          <StatCard
            label="Jaminan Konsumen"
            value="100% Refund"
            icon={HeartHandshake}
            tone="info"
            hint="Garansi kelayakan makan"
          />
        </div>

        {/* Navigation Tabs */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 20,
            borderBottom: "1px solid var(--border)",
            paddingBottom: 4,
            overflowX: "auto",
          }}
        >
          {[
            { id: "sop", label: "📋 SOP Operasional Pangan", icon: FileText },
            { id: "mitigasi", label: "🛡️ Matriks Mitigasi Risiko", icon: ShieldAlert },
            { id: "audit", label: "✅ Checklist Uji Mandiri", icon: CheckCircle2 },
            { id: "insiden", label: "🚨 Tanggap Insiden Darurat", icon: AlertTriangle },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 16px",
                  borderRadius: "var(--radius-md)",
                  fontSize: 13,
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.2s ease",
                  backgroundColor: active ? "var(--primary)" : "transparent",
                  color: active ? "#fff" : "var(--muted)",
                }}
              >
                <Icon size={15} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: SOP OPERASIONAL LENGKAP */}
        {activeTab === "sop" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* SOP 1 */}
            <Panel>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "var(--radius-md)",
                    backgroundColor: "rgba(34, 197, 94, 0.12)",
                    color: "var(--success)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <ShieldCheck size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "var(--foreground)" }}>
                      SOP 1: Uji Kelayakan 3T & Masa Simpan Makanan Surplus
                    </h3>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        backgroundColor: "var(--success-light)",
                        color: "var(--success)",
                        padding: "2px 8px",
                        borderRadius: "var(--radius-full)",
                      }}
                    >
                      Mandatori Food Safety
                    </span>
                  </div>
                  <p style={{ margin: "0 0 12px", fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>
                    Setiap makanan yang akan didaftarkan sebagai Surplus Rescue wajib lolos uji organoleptik 3T sebelum dipublikasikan ke marketplace.
                  </p>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                      gap: 12,
                      backgroundColor: "var(--surface-sunken)",
                      padding: "14px",
                      borderRadius: "var(--radius-lg)",
                      fontSize: 12.5,
                      lineHeight: 1.5,
                    }}
                  >
                    <div>
                      <strong style={{ color: "var(--foreground)" }}>1. Tidak Berbau Asam/Tengik:</strong>
                      <p style={{ margin: "4px 0 0", color: "var(--muted)" }}>
                        Aroma harus segar khas masakan baru. Makanan berkuah santan tidak boleh ada jejak fermentasi asam.
                      </p>
                    </div>
                    <div>
                      <strong style={{ color: "var(--foreground)" }}>2. Tidak Berlendir / Menggumpal:</strong>
                      <p style={{ margin: "4px 0 0", color: "var(--muted)" }}>
                        Tekstur kuah, nasi, atau lauk tidak berlendir, tidak berubah warna, dan tidak berserabut bakteri.
                      </p>
                    </div>
                    <div>
                      <strong style={{ color: "var(--foreground)" }}>3. Tidak Berubah Rasa:</strong>
                      <p style={{ margin: "4px 0 0", color: "var(--muted)" }}>
                        Cicipi sendok uji terpisah. Rasa gurih dan bumbu tetap prima layaknya porsi reguler.
                      </p>
                    </div>
                  </div>

                  {/* Batas Holding Time */}
                  <div style={{ marginTop: 14 }}>
                    <h4 style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 700, color: "var(--foreground)" }}>
                      ⏱️ Batas Waktu Simpan Maksimal (Holding Time):
                    </h4>
                    <ul style={{ margin: 0, paddingLeft: 20, fontSize: 12.5, color: "var(--muted)", lineHeight: 1.6 }}>
                      <li><strong>Makanan Berkuah Santan / Sup:</strong> Maksimal 4 jam setelah matang pada suhu ruang, atau wajib dipanaskan ulang di atas 65°C.</li>
                      <li><strong>Lauk Gorengan & Tumisan:</strong> Maksimal 6–8 jam dalam etalase bersih tertutup.</li>
                      <li><strong>Roti, Pastry & Makanan Kering:</strong> Maksimal 24 jam dalam wadah kedap udara.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Panel>

            {/* SOP 2 */}
            <Panel>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "var(--radius-md)",
                    backgroundColor: "rgba(238, 77, 45, 0.12)",
                    color: "var(--primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Package size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "var(--foreground)" }}>
                      SOP 2: Pengemasan Higienis & Pelabelan Konsumsi
                    </h3>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        backgroundColor: "var(--primary-light)",
                        color: "var(--primary)",
                        padding: "2px 8px",
                        borderRadius: "var(--radius-full)",
                      }}
                    >
                      Standar Kemasan
                    </span>
                  </div>
                  <p style={{ margin: "0 0 10px", fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>
                    Mencegah kontaminasi silang dan menjaga makanan tetap higienis selama proses penjemputan oleh mahasiswa/pelanggan.
                  </p>
                  <ul style={{ margin: 0, paddingLeft: 20, fontSize: 12.5, color: "var(--muted)", lineHeight: 1.6 }}>
                    <li>Wajib menggunakan wadah <em>Food-Grade</em> (Paper bowl/box atau kotak PP tertutup rapat). Dilarang memakai kantong kresek daur ulang langsung menempel ke makanan.</li>
                    <li>Kemasan wajib diberi segel (stiker SecondBit / isolasi pengaman) agar tidak mudah terbuka di jalan.</li>
                    <li>Cantumkan anjuran konsumsi: <em>"Sebaiknya dikonsumsi dalam waktu 2 jam setelah diambil"</em>.</li>
                    <li>Alat bantu capit makanan / sarung tangan plastik wajib dipakai saat membagi porsi surplus.</li>
                  </ul>
                </div>
              </div>
            </Panel>

            {/* SOP 3 */}
            <Panel>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "var(--radius-md)",
                    backgroundColor: "rgba(99, 102, 241, 0.12)",
                    color: "#6366F1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <QrCode size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "var(--foreground)" }}>
                      SOP 3: Verifikasi Closed-Loop QR Pickup
                    </h3>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        backgroundColor: "rgba(99, 102, 241, 0.15)",
                        color: "#6366F1",
                        padding: "2px 8px",
                        borderRadius: "var(--radius-full)",
                      }}
                    >
                      Anti-Fraud Handover
                    </span>
                  </div>
                  <p style={{ margin: "0 0 10px", fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>
                    Memastikan pesanan diserahkan kepada pemilik yang sah tanpa kemungkinan salah ambil atau penipuan.
                  </p>
                  <ul style={{ margin: 0, paddingLeft: 20, fontSize: 12.5, color: "var(--muted)", lineHeight: 1.6 }}>
                    <li>Pembeli <strong>wajib menunjukkan QR Tiket aktif</strong> dari aplikasi SecondBit mereka.</li>
                    <li>Merchant memindai QR lewat menu <em>Scanner QR</em> di dashboard. Jangan menyerahkan makanan sebelum status scanner berbunyi sukses / centang hijau.</li>
                    <li>Sistem secara otomatis mencatat waktu detik pengambilan dan menandai pesanan selesai secara permanen.</li>
                  </ul>
                </div>
              </div>
            </Panel>

            {/* SOP 4 */}
            <Panel>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "var(--radius-md)",
                    backgroundColor: "rgba(245, 158, 11, 0.12)",
                    color: "#D97706",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Clock size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "var(--foreground)" }}>
                      SOP 4: Batas Akhir Penarikan (Cut-off Time & Zero Storage)
                    </h3>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        backgroundColor: "rgba(245, 158, 11, 0.15)",
                        color: "#D97706",
                        padding: "2px 8px",
                        borderRadius: "var(--radius-full)",
                      }}
                    >
                      Kebijakan Dilarang Jual Kembali
                    </span>
                  </div>
                  <p style={{ margin: "0 0 10px", fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>
                    Menjaga integritas platform bahwa makanan surplus tidak boleh dibiarkan melewati batas aman.
                  </p>
                  <ul style={{ margin: 0, paddingLeft: 20, fontSize: 12.5, color: "var(--muted)", lineHeight: 1.6 }}>
                    <li>Makanan surplus yang tidak terjual hingga jam penutupan toko <strong>otomatis ditarik dari marketplace</strong>.</li>
                    <li><strong>DILARANG KERAS</strong> menyimpan sisa makanan surplus untuk dijual kembali keesokan harinya di SecondBit. Pelanggaran mengakibatkan pembekuan akun toko permanen.</li>
                    <li>Sisa makanan yang masih layak dapat disalurkan ke Bank Pangan Mahasiswa / donasi sosial sekitar UNESA.</li>
                  </ul>
                </div>
              </div>
            </Panel>
          </div>
        )}

        {/* TAB 2: MATRIKS MITIGASI RISIKO */}
        {activeTab === "mitigasi" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Risk 1 */}
            <Panel>
              <div style={{ borderLeft: "4px solid #EF4444", paddingLeft: 12 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
                  <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#EF4444" }}>
                    🔴 Risiko 1: Makanan Rusak / Komplain Keracunan Konsumen
                  </h3>
                  <span style={{ fontSize: 11, fontWeight: 700, backgroundColor: "rgba(239, 68, 68, 0.12)", color: "#EF4444", padding: "2px 8px", borderRadius: "var(--radius-full)" }}>
                    Probabilitas: Rendah • Dampak: Kritis
                  </span>
                </div>
                <p style={{ margin: "0 0 10px", fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>
                  <strong>Potensi Bahaya:</strong> Makanan mengalami penurunan kualitas saat dikonsumsi mahasiswa, merusak reputasi warung dan platform SecondBit.
                </p>
                <div style={{ backgroundColor: "var(--surface-sunken)", padding: "12px", borderRadius: "var(--radius-md)", fontSize: 12.5 }}>
                  <strong style={{ color: "var(--foreground)" }}>🛡️ Paket Mitigasi Platform:</strong>
                  <ul style={{ margin: "6px 0 0", paddingLeft: 20, color: "var(--muted)", lineHeight: 1.6 }}>
                    <li><strong>Mandatory Self-Audit 3T:</strong> Merchant wajib melakukan checklist organoleptik harian sebelum listing surplus.</li>
                    <li><strong>Garansi 100% Refund Konsumen:</strong> Pembeli terlindungi jaminan uang kembali jika makanan tidak layak saat unboxing. Platform menangani mediasi cepat dalam 15 menit.</li>
                    <li><strong>Pemberian Sanksi Bertahap:</strong> 1x teguran evaluasi dapur, 2x laporan valid berakibat penonaktifan toko sementara demi keselamatan publik.</li>
                  </ul>
                </div>
              </div>
            </Panel>

            {/* Risk 2 */}
            <Panel>
              <div style={{ borderLeft: "4px solid #F59E0B", paddingLeft: 12 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
                  <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#D97706" }}>
                    🟡 Risiko 2: Kanibalisasi Menu Reguler & Kerusakan Margin Toko
                  </h3>
                  <span style={{ fontSize: 11, fontWeight: 700, backgroundColor: "rgba(245, 158, 11, 0.12)", color: "#D97706", padding: "2px 8px", borderRadius: "var(--radius-full)" }}>
                    Probabilitas: Tinggi (Tanpa Aturan) • Dampak: Signifikan
                  </span>
                </div>
                <p style={{ margin: "0 0 10px", fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>
                  <strong>Potensi Bahaya:</strong> Pembeli hanya berburu makanan diskon besar, menolak membeli menu normal, sehingga omzet pedagang tergerus.
                </p>
                <div style={{ backgroundColor: "var(--surface-sunken)", padding: "12px", borderRadius: "var(--radius-md)", fontSize: 12.5 }}>
                  <strong style={{ color: "var(--foreground)" }}>🛡️ Paket Mitigasi Platform:</strong>
                  <ul style={{ margin: "6px 0 0", paddingLeft: 20, color: "var(--muted)", lineHeight: 1.6 }}>
                    <li><strong>Kuota Limited Surplus (Maks 2 Porsi/User):</strong> Sistem mengunci pesanan surplus mandiri maksimal 2 porsi per user per hari agar pembeli tidak menimbun.</li>
                    <li><strong>Surplus Bundling Shield:</strong> Mendorong UMKM memaketkan surplus dengan menu reguler ber-margin tebal (+minuman) untuk mendongkrak rata-rata nilai transaksi (basket size).</li>
                    <li><strong>Pembatasan Jam Publish:</strong> Surplus baru dibuka pukul 15.30 ke atas menjelang warung tutup, dilarang dijual pada jam makan siang (11.00–13.00).</li>
                  </ul>
                </div>
              </div>
            </Panel>

            {/* Risk 3 */}
            <Panel>
              <div style={{ borderLeft: "4px solid #3B82F6", paddingLeft: 12 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
                  <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "var(--info)" }}>
                    🔵 Risiko 3: Pembeli Tidak Datang Mengambil (No-Show Customer)
                  </h3>
                  <span style={{ fontSize: 11, fontWeight: 700, backgroundColor: "rgba(59, 130, 246, 0.12)", color: "var(--info)", padding: "2px 8px", borderRadius: "var(--radius-full)" }}>
                    Probabilitas: Sedang • Dampak: Rendah-Sedang
                  </span>
                </div>
                <p style={{ margin: "0 0 10px", fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>
                  <strong>Potensi Bahaya:</strong> Mahasiswa sudah memesan namun ketiduran, hujan lebat, atau lupa mengambil hingga warung tutup.
                </p>
                <div style={{ backgroundColor: "var(--surface-sunken)", padding: "12px", borderRadius: "var(--radius-md)", fontSize: 12.5 }}>
                  <strong style={{ color: "var(--foreground)" }}>🛡️ Paket Mitigasi Platform:</strong>
                  <ul style={{ margin: "6px 0 0", paddingLeft: 20, color: "var(--muted)", lineHeight: 1.6 }}>
                    <li><strong>Pembayaran Wajib 100% Upfront (QRIS):</strong> Tidak ada opsi bayar di tempat (COD). Modal merchant aman dan dana tetap dicairkan ke saldo merchant.</li>
                    <li><strong>Notifikasi Otomatis Pengingat:</strong> Aplikasi mengirimkan push notification dan pesan pengingat 30 menit sebelum batas waktu pickup berakhir.</li>
                    <li><strong>Opsi Donasi Otomatis:</strong> Makanan yang tidak diambil dapat dialihkan ke program sosial mahasiswa, mewujudkan komitmen <em>Zero Food Waste</em>.</li>
                  </ul>
                </div>
              </div>
            </Panel>

            {/* Risk 4 */}
            <Panel>
              <div style={{ borderLeft: "4px solid #8B5CF6", paddingLeft: 12 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
                  <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#8B5CF6" }}>
                    🟣 Risiko 4: Penipuan Klaim & Salah Ambil Pesanan
                  </h3>
                  <span style={{ fontSize: 11, fontWeight: 700, backgroundColor: "rgba(139, 92, 246, 0.12)", color: "#8B5CF6", padding: "2px 8px", borderRadius: "var(--radius-full)" }}>
                    Probabilitas: Rendah • Dampak: Sedang
                  </span>
                </div>
                <p style={{ margin: "0 0 10px", fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>
                  <strong>Potensi Bahaya:</strong> Orang lain mengaku-ngaku pembeli atau pembeli mengklaim belum menerima pesanan padahal sudah diambil.
                </p>
                <div style={{ backgroundColor: "var(--surface-sunken)", padding: "12px", borderRadius: "var(--radius-md)", fontSize: 12.5 }}>
                  <strong style={{ color: "var(--foreground)" }}>🛡️ Paket Mitigasi Platform:</strong>
                  <ul style={{ margin: "6px 0 0", paddingLeft: 20, color: "var(--muted)", lineHeight: 1.6 }}>
                    <li><strong>Closed-Loop QR Scanning:</strong> Tiket QR bersifat dinamis dan hanya bisa diverifikasi satu kali oleh kamera scanner merchant.</li>
                    <li><strong>Digital Timestamp Logging:</strong> Waktu verifikasi tercatat ke detik terkecil sebagai bukti tak terbantahkan.</li>
                    <li><strong>Mediasi Admin 24/7:</strong> Riwayat status transaksi dapat diaudit admin secara transparan jika ada sanggahan.</li>
                  </ul>
                </div>
              </div>
            </Panel>
          </div>
        )}

        {/* TAB 3: CHECKLIST UJI MANDIRI (INTERACTIVE) */}
        {activeTab === "audit" && (
          <Panel>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "var(--foreground)" }}>
                  Checklist Uji Kelayakan Mandiri (Self-Audit Harian)
                </h3>
                {verifiedDate ? (
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: "var(--success)", backgroundColor: "var(--success-light)", padding: "3px 10px", borderRadius: "var(--radius-full)" }}>
                    ✓ Lolos Verifikasi: {verifiedDate}
                  </span>
                ) : (
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: "var(--warning)", backgroundColor: "var(--warning-light)", padding: "3px 10px", borderRadius: "var(--radius-full)" }}>
                    ⚠️ Belum Verifikasi Hari Ini
                  </span>
                )}
              </div>
              <p style={{ margin: "4px 0 0", fontSize: 12.5, color: "var(--muted)" }}>
                Centang 5 poin standar higienitas di bawah ini sebelum mempublikasikan porsi makanan surplus ke marketplace.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
              {[
                {
                  key: "ujiBau" as const,
                  title: "1. Uji Bau Organoleptik (Aroma Segar)",
                  desc: "Aroma makanan masih sedap khas bumbu baru matang, bebas bau asam, kecut, atau tengik.",
                },
                {
                  key: "ujiTekstur" as const,
                  title: "2. Uji Tekstur & Fisik (Bebas Lendir)",
                  desc: "Kuah, nasi, atau lauk tidak berlendir, tidak ada perubahan warna menjadi keabu-abuan/pucat.",
                },
                {
                  key: "ujiWaktu" as const,
                  title: "3. Uji Waktu Simpan (Holding Time)",
                  desc: "Makanan berkuah santan tidak lebih dari 4 jam, gorengan/kering tidak lebih dari 8 jam sejak matang.",
                },
                {
                  key: "kemasanFoodGrade" as const,
                  title: "4. Kemasan Food-Grade & Rapat",
                  desc: "Wadah bersih baru (bukan kresek bekas), tertutup rapat dengan penutup/stapler/stiker pengaman.",
                },
                {
                  key: "labelPickup" as const,
                  title: "5. Batas Jendela Pickup Maksimal 2 Jam",
                  desc: "Waktu pengambilan di aplikasi diatur maksimal 2 jam ke depan sebelum warung tutup.",
                },
              ].map((item) => {
                const checked = checklist[item.key];
                return (
                  <div
                    key={item.key}
                    onClick={() => toggleCheck(item.key)}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 12,
                      padding: "12px 14px",
                      borderRadius: "var(--radius-md)",
                      border: checked ? "1px solid var(--success)" : "1px solid var(--border)",
                      backgroundColor: checked ? "rgba(34, 197, 94, 0.06)" : "var(--surface)",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div style={{ marginTop: 2, color: checked ? "var(--success)" : "var(--muted)" }}>
                      {checked ? <CheckSquare size={19} /> : <Square size={19} />}
                    </div>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--foreground)" }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
                        {item.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
              <div style={{ fontSize: 12.5, color: "var(--muted)" }}>
                Status Checklist: <strong>{Object.values(checklist).filter(Boolean).length} / 5 Poin Terpenuhi</strong>
              </div>
              <button
                type="button"
                onClick={handleVerify}
                className="btn btn-primary"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 20px",
                  borderRadius: "var(--radius-md)",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                <CheckCircle2 size={16} />
                Verifikasi & Aktifkan Status Higienis Hari Ini
              </button>
            </div>
          </Panel>
        )}

        {/* TAB 4: PANDUAN TANGGAP INSIDEN DARURAT */}
        {activeTab === "insiden" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            <Panel>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: "var(--radius-md)", backgroundColor: "rgba(239, 68, 68, 0.12)", color: "#EF4444", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <AlertCircle size={18} />
                </div>
                <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>Kasus 1: Komplain Makanan Asam</h4>
              </div>
              <p style={{ fontSize: 12.5, color: "var(--muted)", lineHeight: 1.5, marginBottom: 14 }}>
                Pelanggan membuka makanan dan mendapati rasa/aroma tidak layak konsumsi saat tiba di kos.
              </p>
              <button
                type="button"
                onClick={() => showIncidentGuide("asam")}
                className="btn btn-outline"
                style={{ width: "100%", fontSize: 12, borderRadius: "var(--radius-md)", gap: 6 }}
              >
                Buka Prosedur Penanganan <ArrowRight size={13} />
              </button>
            </Panel>

            <Panel>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: "var(--radius-md)", backgroundColor: "rgba(245, 158, 11, 0.12)", color: "#D97706", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Clock size={18} />
                </div>
                <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>Kasus 2: Pembeli Telat Ambil</h4>
              </div>
              <p style={{ fontSize: 12.5, color: "var(--muted)", lineHeight: 1.5, marginBottom: 14 }}>
                Waktu pickup sudah lewat lebih dari 30 menit dan warung Anda sudah harus tutup.
              </p>
              <button
                type="button"
                onClick={() => showIncidentGuide("terlambat")}
                className="btn btn-outline"
                style={{ width: "100%", fontSize: 12, borderRadius: "var(--radius-md)", gap: 6 }}
              >
                Buka Prosedur Penanganan <ArrowRight size={13} />
              </button>
            </Panel>

            <Panel>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: "var(--radius-md)", backgroundColor: "rgba(99, 102, 241, 0.12)", color: "#6366F1", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <QrCode size={18} />
                </div>
                <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>Kasus 3: HP Pembeli Mati</h4>
              </div>
              <p style={{ fontSize: 12.5, color: "var(--muted)", lineHeight: 1.5, marginBottom: 14 }}>
                Pembeli sudah datang di warung tetapi HP kehabisan baterai dan tidak bisa buka QR.
              </p>
              <button
                type="button"
                onClick={() => showIncidentGuide("scanner")}
                className="btn btn-outline"
                style={{ width: "100%", fontSize: 12, borderRadius: "var(--radius-md)", gap: 6 }}
              >
                Buka Prosedur Penanganan <ArrowRight size={13} />
              </button>
            </Panel>
          </div>
        )}
      </div>
    </main>
  );
}

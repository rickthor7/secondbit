import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Store,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  Settings,
  ChevronRight,
  Activity,
  Package,
  Star,
  CheckCircle2,
  XCircle,
  Eye,
  RefreshCw,
  Bell,
  Sparkles,
  Percent,
  ShieldCheck,
  Check,
  Calendar,
  Layers,
} from "lucide-react";
import Swal from "sweetalert2";
import { formatPrice } from "@/data/mockData";

type TimeRange = "today" | "7d" | "30d" | "month";
type ChartMetric = "gmv" | "revenue" | "rescue";

interface PendingUMKM {
  id: string;
  name: string;
  category: string;
  owner: string;
  phone: string;
  address: string;
  submittedAt: string;
  nib: string;
  docs: string;
  estSurplus: string;
}

const INITIAL_PENDING_UMKM: PendingUMKM[] = [
  {
    id: "umkm-req-1",
    name: "Warung Nasi Gandul Bu Endang",
    category: "Nasi & Lauk",
    owner: "Endang Sulastri",
    phone: "0812-3456-7890",
    address: "Jl. Ketintang Madya No. 4A, Surabaya",
    submittedAt: "10 menit lalu",
    nib: "0220108761234",
    docs: "KTP & NIB Valid",
    estSurplus: "5-10 porsi/hari",
  },
  {
    id: "umkm-req-2",
    name: "Geprek Sambal Korek Mas Dwi",
    category: "Ayam & Bebek",
    owner: "Dwi Prasetyo",
    phone: "0813-9876-5432",
    address: "Jl. Ketintang Baru VI/12, Surabaya",
    submittedAt: "35 menit lalu",
    nib: "0220104459871",
    docs: "KTP & Foto Dapur Higienis",
    estSurplus: "8-15 porsi/hari",
  },
  {
    id: "umkm-req-3",
    name: "Es Cincau Hijau Organik",
    category: "Minuman",
    owner: "Siti Aminah",
    phone: "0857-1122-3344",
    address: "Depan Kampus UNESA Ketintang, Surabaya",
    submittedAt: "2 jam lalu",
    nib: "0220107761122",
    docs: "KTP & Sertifikasi Halal",
    estSurplus: "10 cup/hari",
  },
];

interface ActivityEvent {
  id: string;
  action: string;
  detail: string;
  time: string;
  color: string;
  tag: string;
}

const INITIAL_ACTIVITIES: ActivityEvent[] = [
  { id: "1", action: "UMKM baru mendaftar", detail: "Warung Nasi Gandul Bu Endang", time: "10 menit lalu", color: "var(--info)", tag: "Pendaftaran" },
  { id: "2", action: "Transaksi QR Pickup Selesai", detail: "Order SB-127 — Rp45.000 di Warung Bu Siti", time: "14 menit lalu", color: "var(--success)", tag: "Transaksi" },
  { id: "3", action: "Review Bintang 5 Masuk", detail: "Mahasiswa memberi rating 5 untuk Bakso Pak Darmo", time: "30 menit lalu", color: "var(--warning)", tag: "Ulasan" },
  { id: "4", action: "Surplus Food Diselamatkan", detail: "4 porsi Nasi Pecel terjual sebelum warung tutup", time: "45 menit lalu", color: "var(--success)", tag: "Surplus" },
  { id: "5", action: "Pengajuan Refund", detail: "Order SB-098 — Rp15.000 (menunggu review admin)", time: "1 jam lalu", color: "var(--destructive)", tag: "Refund" },
];

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState<TimeRange>("month");
  const [chartMetric, setChartMetric] = useState<ChartMetric>("gmv");
  const [platformFee, setPlatformFee] = useState<number>(8); // 8% fee
  const [totalUmkmCount, setTotalUmkmCount] = useState<number>(20);
  const [pendingUmkmList, setPendingUmkmList] = useState<PendingUMKM[]>(INITIAL_PENDING_UMKM);
  const [activities, setActivities] = useState<ActivityEvent[]>(INITIAL_ACTIVITIES);
  const [activityFilter, setActivityFilter] = useState<string>("all");
  const [isRefreshingFeed, setIsRefreshingFeed] = useState<boolean>(false);
  const [activeHoverBar, setActiveHoverBar] = useState<number | null>(null);

  // Time-range dependent metrics
  const getMetrics = () => {
    switch (timeRange) {
      case "today":
        return {
          gmv: 2850000,
          orders: 127,
          rescued: 68,
          activeBuyers: 94,
          gmvChange: "+14% vs kemarin",
          orderChange: "+15% vs kemarin",
          rescuedChange: "Hari ini",
        };
      case "7d":
        return {
          gmv: 18620000,
          orders: 842,
          rescued: 412,
          activeBuyers: 320,
          gmvChange: "+18% vs minggu lalu",
          orderChange: "+12% vs minggu lalu",
          rescuedChange: "7 hari terakhir",
        };
      case "30d":
        return {
          gmv: 64800000,
          orders: 3140,
          rescued: 1540,
          activeBuyers: 510,
          gmvChange: "+24% vs 30 hari lalu",
          orderChange: "+21% vs 30 hari lalu",
          rescuedChange: "30 hari terakhir",
        };
      default: // month
        return {
          gmv: 42500000,
          orders: 1890,
          rescued: 856,
          activeBuyers: 450,
          gmvChange: "+22% vs bulan lalu",
          orderChange: "+19% vs bulan lalu",
          rescuedChange: "Bulan ini",
        };
    }
  };

  const metrics = getMetrics();
  const platformRevenue = Math.round((metrics.gmv * platformFee) / 100);

  // Chart data per day
  const weeklyData = [
    { day: "Sen", gmv: 4900000, rescue: 82 },
    { day: "Sel", gmv: 5250000, rescue: 95 },
    { day: "Rab", gmv: 4700000, rescue: 78 },
    { day: "Kam", gmv: 6100000, rescue: 110 },
    { day: "Jum", gmv: 7350000, rescue: 145 },
    { day: "Sab", gmv: 8200000, rescue: 180 },
    { day: "Min", gmv: 5800000, rescue: 126 },
  ];

  const maxGmv = Math.max(...weeklyData.map((d) => d.gmv));
  const maxRescue = Math.max(...weeklyData.map((d) => d.rescue));

  // Handle Approve UMKM
  const handleApproveUMKM = (item: PendingUMKM) => {
    Swal.fire({
      icon: "question",
      title: "Setujui Pendaftaran UMKM?",
      html: `
        <div style="text-align: left; font-size: 13.5px; line-height: 1.6;">
          <p><strong>Nama Toko:</strong> ${item.name}</p>
          <p><strong>Pemilik:</strong> ${item.owner} (${item.phone})</p>
          <p><strong>Alamat:</strong> ${item.address}</p>
          <p><strong>Kelayakan:</strong> Dokumen NIB & Standar Food Rescue terpenuhi.</p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Ya, Setujui Mitra",
      cancelButtonText: "Batal",
      confirmButtonColor: "var(--success)",
    }).then((res) => {
      if (res.isConfirmed) {
        setPendingUmkmList((prev) => prev.filter((u) => u.id !== item.id));
        setTotalUmkmCount((prev) => prev + 1);

        // Add to activity
        const newAct: ActivityEvent = {
          id: String(Date.now()),
          action: "Mitra UMKM Disetujui",
          detail: `${item.name} resmi diverifikasi oleh Admin`,
          time: "Baru saja",
          color: "var(--success)",
          tag: "Pendaftaran",
        };
        setActivities((prev) => [newAct, ...prev]);

        Swal.fire({
          icon: "success",
          title: "Mitra Berhasil Disetujui!",
          text: `${item.name} sekarang aktif di marketplace SecondBit.`,
          timer: 2200,
          confirmButtonColor: "var(--primary)",
        });
      }
    });
  };

  // Handle Reject UMKM
  const handleRejectUMKM = (item: PendingUMKM) => {
    Swal.fire({
      title: `Tolak Pendaftaran ${item.name}?`,
      text: "Tuliskan alasan penolakan untuk dikirimkan kepada calon mitra:",
      input: "textarea",
      inputPlaceholder: "Contoh: Foto tempat produksi belum memenuhi standar higienis...",
      showCancelButton: true,
      confirmButtonText: "Kirim Penolakan",
      cancelButtonText: "Batal",
      confirmButtonColor: "var(--destructive)",
      inputValidator: (val) => {
        if (!val) return "Alasan penolakan wajib diisi!";
      },
    }).then((res) => {
      if (res.isConfirmed) {
        setPendingUmkmList((prev) => prev.filter((u) => u.id !== item.id));
        Swal.fire({
          icon: "info",
          title: "Pengajuan Ditolak",
          text: `Notifikasi penolakan telah dikirim ke nomor ${item.phone}.`,
          confirmButtonColor: "var(--primary)",
        });
      }
    });
  };

  // Handle View Details Modal
  const handleViewDetails = (item: PendingUMKM) => {
    Swal.fire({
      title: "Detail Pengajuan Mitra UMKM",
      html: `
        <div style="text-align: left; font-size: 13.5px; line-height: 1.7; padding: 4px;">
          <p><strong>Nama Usaha:</strong> ${item.name}</p>
          <p><strong>Kategori Kuliner:</strong> ${item.category}</p>
          <p><strong>Penanggung Jawab:</strong> ${item.owner}</p>
          <p><strong>WhatsApp / Telp:</strong> ${item.phone}</p>
          <p><strong>Alamat Gerai:</strong> ${item.address}</p>
          <p><strong>Nomor Induk Berusaha (NIB):</strong> <code>${item.nib}</code></p>
          <p><strong>Status Dokumen:</strong> <span style="color: var(--success); font-weight: 600;">${item.docs}</span></p>
          <p><strong>Estimasi Surplus Harian:</strong> ${item.estSurplus}</p>
          <div style="margin-top: 10px; padding: 10px; background: rgba(38,170,108,0.08); border-radius: 8px;">
            <p style="font-size: 12px; color: var(--success); margin: 0;">
              🌱 UMKM telah menyetujui SOP Food Rescue & penyediaan tiket QR pickup.
            </p>
          </div>
        </div>
      `,
      confirmButtonText: "Tutup",
      confirmButtonColor: "var(--primary)",
      showDenyButton: true,
      denyButtonText: "Setujui Sekarang",
      denyButtonColor: "var(--success)",
    }).then((res) => {
      if (res.isDenied) {
        handleApproveUMKM(item);
      }
    });
  };

  // Adjust Platform Fee
  const handleAdjustFee = () => {
    Swal.fire({
      title: "Atur Komisi Platform",
      text: "Tentukan persentase potongan komisi platform per transaksi selesai (%):",
      input: "number",
      inputValue: platformFee,
      inputAttributes: {
        min: "0",
        max: "25",
        step: "1",
      },
      showCancelButton: true,
      confirmButtonText: "Simpan Perubahan",
      cancelButtonText: "Batal",
      confirmButtonColor: "var(--primary)",
      inputValidator: (val) => {
        const num = Number(val);
        if (isNaN(num) || num < 0 || num > 30) {
          return "Masukkan angka komisi antara 0% hingga 30%";
        }
      },
    }).then((res) => {
      if (res.isConfirmed) {
        const newFee = Number(res.value);
        setPlatformFee(newFee);
        Swal.fire({
          icon: "success",
          title: `Komisi Diubah ke ${newFee}%`,
          text: `Revenue platform akan otomatis dihitung berdasarkan tarif ${newFee}%.`,
          timer: 2000,
          confirmButtonColor: "var(--primary)",
        });
      }
    });
  };

  // Campus Broadcast
  const handleCampusBroadcast = () => {
    Swal.fire({
      title: "Kirim Broadcast Notifikasi Kampus",
      html: `
        <div style="text-align: left; font-size: 13px; margin-bottom: 8px;">
          Kirim notifikasi instan ke seluruh pembeli di kawasan UNESA Ketintang:
        </div>
      `,
      input: "text",
      inputPlaceholder: "Contoh: Flash Deal Malam Ini: Nasi Pecel Bu Siti Diskon 50% Mulai 19.30!",
      showCancelButton: true,
      confirmButtonText: "Kirim Sekarang",
      cancelButtonText: "Batal",
      confirmButtonColor: "var(--primary)",
      inputValidator: (val) => {
        if (!val?.trim()) return "Pesan broadcast tidak boleh kosong!";
      },
    }).then((res) => {
      if (res.isConfirmed) {
        const newAct: ActivityEvent = {
          id: String(Date.now()),
          action: "Broadcast Kampus Terkirim",
          detail: `"${res.value}" terkirim ke 450+ mahasiswa`,
          time: "Baru saja",
          color: "#6366F1",
          tag: "Sistem",
        };
        setActivities((prev) => [newAct, ...prev]);

        Swal.fire({
          icon: "success",
          title: "Broadcast Berhasil Terkirim!",
          text: "Pesan telah diteruskan ke seluruh pengguna aktif di Ketintang.",
          confirmButtonColor: "var(--primary)",
        });
      }
    });
  };

  // Trigger Flash Deal Booster
  const handleFlashDealBooster = () => {
    Swal.fire({
      icon: "question",
      title: "Aktifkan Booster Flash Deal?",
      text: "Sistem akan menandai produk surplus malam hari dengan badge diskon ekstra 10% selama 60 menit.",
      showCancelButton: true,
      confirmButtonText: "Aktifkan Booster",
      cancelButtonText: "Batal",
      confirmButtonColor: "var(--warning)",
    }).then((res) => {
      if (res.isConfirmed) {
        Swal.fire({
          icon: "success",
          title: "Booster Flash Deal Aktif!",
          text: "Notifikasi otomatis telah disiarkan ke aplikasi pembeli.",
          timer: 2000,
          confirmButtonColor: "var(--primary)",
        });
      }
    });
  };

  // Refresh Feed
  const handleRefreshFeed = () => {
    setIsRefreshingFeed(true);
    setTimeout(() => {
      setIsRefreshingFeed(false);
      const newItems: ActivityEvent[] = [
        {
          id: String(Date.now()),
          action: "Tiket Pickup Terverifikasi",
          detail: "Order SB-134 di Ayam Geprek Mas Eko",
          time: "Baru saja",
          color: "var(--success)",
          tag: "Transaksi",
        },
        ...activities,
      ];
      setActivities(newItems);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Linimasa berhasil diperbarui!",
        showConfirmButton: false,
        timer: 1800,
      });
    }, 600);
  };

  const filteredActivities = activityFilter === "all"
    ? activities
    : activities.filter((a) => a.tag.toLowerCase() === activityFilter.toLowerCase());

  return (
    <main style={{ minHeight: "80vh", backgroundColor: "var(--surface)", paddingBottom: 50 }}>
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #111827 0%, #1F2937 50%, #1E1B4B 100%)",
          padding: "28px 0 32px",
          color: "#fff",
          position: "relative",
        }}
      >
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
                <span
                  style={{
                    backgroundColor: "rgba(99, 102, 241, 0.25)",
                    border: "1px solid rgba(99, 102, 241, 0.5)",
                    fontSize: 10.5,
                    fontWeight: 800,
                    padding: "2px 8px",
                    borderRadius: "var(--radius-full)",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    color: "#A5B4FC",
                  }}
                >
                  🛡️ Super Admin Control
                </span>
                <span style={{ fontSize: 12, opacity: 0.8 }}>
                  Kawasan UNESA Ketintang, Surabaya
                </span>
              </div>
              <h1 style={{ fontSize: "clamp(20px, 3.2vw, 28px)", fontWeight: 800, lineHeight: 1.25 }}>
                Dashboard Manajemen Platform
              </h1>
              <p style={{ fontSize: 13.5, opacity: 0.85, marginTop: 6, maxWidth: 650, lineHeight: 1.5 }}>
                Pantau metrik GMV, transaksi, penyelamatan makanan surplus, serta verifikasi mitra secara langsung.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={handleCampusBroadcast}
                className="btn btn-sm"
                style={{
                  backgroundColor: "rgba(255,255,255,0.15)",
                  backdropFilter: "blur(8px)",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.25)",
                  borderRadius: "var(--radius-full)",
                  gap: 6,
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                <Bell size={14} />
                <span>Broadcast Kampus</span>
              </button>

              <button
                type="button"
                onClick={handleAdjustFee}
                className="btn btn-sm"
                style={{
                  backgroundColor: "rgba(238, 77, 45, 0.9)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "var(--radius-full)",
                  gap: 6,
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                <Percent size={14} />
                <span>Atur Komisi ({platformFee}%)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 20 }}>
        {/* Time Filter Bar */}
        <div
          style={{
            backgroundColor: "var(--background)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-xl)",
            padding: "10px 16px",
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
            boxShadow: "var(--shadow-card)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--muted)", fontWeight: 600 }}>
            <Calendar size={15} style={{ color: "var(--primary)" }} />
            <span>Rentang Waktu Laporan:</span>
          </div>

          <div className="scroll-x" style={{ gap: 6, maxWidth: "100%", paddingBottom: 2 }}>
            {[
              { id: "today", label: "Hari Ini" },
              { id: "7d", label: "7 Hari Terakhir" },
              { id: "30d", label: "30 Hari Terakhir" },
              { id: "month", label: "Bulan Ini" },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTimeRange(t.id as TimeRange)}
                className="btn btn-sm"
                style={{
                  borderRadius: "var(--radius-full)",
                  backgroundColor: timeRange === t.id ? "var(--primary)" : "var(--surface)",
                  color: timeRange === t.id ? "#fff" : "var(--foreground)",
                  border: "1px solid var(--border)",
                  fontSize: 12,
                  fontWeight: 600,
                  padding: "5px 14px",
                  whiteSpace: "nowrap",
                  transition: "all var(--transition-fast)",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic KPI Cards */}
        <div
          id="admin-overview"
          className="dash-section admin-kpi-grid"
        >
          {[
            {
              label: "GMV Transaksi",
              value: formatPrice(metrics.gmv),
              icon: DollarSign,
              color: "#F59E0B",
              bg: "rgba(245, 158, 11, 0.12)",
              change: metrics.gmvChange,
              badge: "Total Omzet",
            },
            {
              label: `Revenue Platform (${platformFee}%)`,
              value: formatPrice(platformRevenue),
              icon: TrendingUp,
              color: "var(--success)",
              bg: "var(--success-light)",
              change: `Tarif Komisi ${platformFee}%`,
              badge: "Pendapatan Bersih",
            },
            {
              label: "Total Pesanan",
              value: `${metrics.orders} Transaksi`,
              icon: ShoppingBag,
              color: "var(--primary)",
              bg: "var(--primary-light)",
              change: metrics.orderChange,
              badge: "100% Closed-Loop",
            },
            {
              label: "Makanan Diselamatkan",
              value: `${metrics.rescued} Porsi`,
              icon: Package,
              color: "#10B981",
              bg: "rgba(16, 185, 129, 0.12)",
              change: `~${metrics.rescued * 2} kg CO₂ terselamatkan`,
              badge: "Food Rescue",
            },
            {
              label: "Mitra UMKM Aktif",
              value: `${totalUmkmCount} Toko`,
              icon: Store,
              color: "#6366F1",
              bg: "rgba(99, 102, 241, 0.12)",
              change: "Area UNESA Ketintang",
              badge: "Verified Merchant",
            },
            {
              label: "Pembeli Terdaftar",
              value: `${metrics.activeBuyers} Akun`,
              icon: Users,
              color: "var(--info)",
              bg: "var(--info-light)",
              change: "+38 bulan ini",
              badge: "Mahasiswa & Umum",
            },
          ].map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <div
                key={idx}
                style={{
                  backgroundColor: "var(--background)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-xl)",
                  boxShadow: "var(--shadow-card)",
                  padding: "16px 16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  minWidth: 0,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 11.5, color: "var(--muted)", fontWeight: 600 }}>{kpi.label}</span>
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: "var(--radius-md)",
                      backgroundColor: kpi.bg,
                      color: kpi.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={15} />
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      fontSize: "clamp(16px, 1.6vw, 20px)",
                      fontWeight: 900,
                      color: "var(--foreground)",
                      letterSpacing: "-0.4px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {kpi.value}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4, flexWrap: "wrap", gap: 4 }}>
                    <span style={{ fontSize: 10.5, color: "var(--muted)", fontWeight: 500 }}>{kpi.change}</span>
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        backgroundColor: "var(--surface)",
                        border: "1px solid var(--border)",
                        padding: "1px 6px",
                        borderRadius: "var(--radius-full)",
                        color: "var(--muted)",
                      }}
                    >
                      {kpi.badge}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Verification Alert & Pending UMKM Queue */}
        <div
          style={{
            backgroundColor: "var(--background)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-xl)",
            boxShadow: "var(--shadow-card)",
            padding: "20px 24px",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "var(--radius-md)",
                  backgroundColor: pendingUmkmList.length > 0 ? "var(--warning-light)" : "var(--success-light)",
                  color: pendingUmkmList.length > 0 ? "var(--warning)" : "var(--success)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {pendingUmkmList.length > 0 ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
              </div>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 800, color: "var(--foreground)" }}>
                  Antrean Verifikasi Mitra UMKM ({pendingUmkmList.length})
                </h2>
                <p style={{ fontSize: 12.5, color: "var(--muted)" }}>
                  {pendingUmkmList.length > 0
                    ? "Periksa dan setujui pendaftaran warung baru agar bisa mulai menjual makanan."
                    : "Semua pendaftaran mitra telah diproses dan disetujui."}
                </p>
              </div>
            </div>

            <Link
              to="/admin/umkm"
              className="btn btn-sm btn-outline"
              style={{ borderRadius: "var(--radius-full)", gap: 6, fontSize: 12 }}
            >
              <span>Kelola Seluruh UMKM</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          {pendingUmkmList.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {pendingUmkmList.map((item) => (
                <div
                  key={item.id}
                  style={{
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-lg)",
                    padding: "14px 18px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 12,
                    transition: "all var(--transition-fast)",
                  }}
                >
                  <div style={{ minWidth: 200, flex: "1 1 240px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <h4 style={{ fontSize: 14, fontWeight: 700, color: "var(--foreground)" }}>
                        {item.name}
                      </h4>
                      <span
                        style={{
                          fontSize: 10.5,
                          fontWeight: 700,
                          backgroundColor: "var(--primary-light)",
                          color: "var(--primary)",
                          padding: "2px 8px",
                          borderRadius: "var(--radius-full)",
                        }}
                      >
                        {item.category}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4, lineHeight: 1.5, wordBreak: "break-word" }}>
                      Pemilik: <strong>{item.owner}</strong> • {item.address} • NIB: <code>{item.nib}</code>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <button
                      type="button"
                      onClick={() => handleViewDetails(item)}
                      className="btn btn-sm btn-ghost"
                      style={{ fontSize: 12, gap: 5, borderRadius: "var(--radius-md)" }}
                    >
                      <Eye size={14} />
                      <span>Detail</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRejectUMKM(item)}
                      className="btn btn-sm"
                      style={{
                        backgroundColor: "var(--surface)",
                        color: "var(--destructive)",
                        border: "1px solid var(--border)",
                        fontSize: 12,
                        gap: 4,
                        borderRadius: "var(--radius-md)",
                      }}
                    >
                      <XCircle size={14} />
                      <span>Tolak</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleApproveUMKM(item)}
                      className="btn btn-sm btn-primary"
                      style={{
                        backgroundColor: "var(--success)",
                        borderColor: "var(--success)",
                        fontSize: 12,
                        gap: 4,
                        borderRadius: "var(--radius-md)",
                      }}
                    >
                      <CheckCircle2 size={14} />
                      <span>Setujui</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "28px 16px",
                backgroundColor: "var(--surface)",
                borderRadius: "var(--radius-lg)",
                color: "var(--muted)",
                fontSize: 13,
              }}
            >
              🎉 Tidak ada antrean verifikasi yang tertunda saat ini.
            </div>
          )}
        </div>

        {/* Interactive Chart + Quick Controls Section */}
        <div className="admin-two-col-grid">
          {/* Interactive Chart */}
          <div
            style={{
              backgroundColor: "var(--background)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-xl)",
              boxShadow: "var(--shadow-card)",
              padding: "22px 24px",
              display: "flex",
              flexDirection: "column",
              minWidth: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 20,
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--foreground)" }}>
                  Tren Mingguan Platform
                </h3>
                <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
                  Arahkan kursor pada batang grafik untuk melihat angka per hari
                </p>
              </div>

              {/* Chart Metric Selector */}
              <div className="scroll-x" style={{ gap: 4 }}>
                <button
                  type="button"
                  onClick={() => setChartMetric("gmv")}
                  className="btn btn-sm"
                  style={{
                    borderRadius: "var(--radius-full)",
                    backgroundColor: chartMetric === "gmv" ? "var(--primary)" : "var(--surface)",
                    color: chartMetric === "gmv" ? "#fff" : "var(--foreground)",
                    border: "1px solid var(--border)",
                    fontSize: 11.5,
                    padding: "4px 12px",
                  }}
                >
                  GMV
                </button>
                <button
                  type="button"
                  onClick={() => setChartMetric("revenue")}
                  className="btn btn-sm"
                  style={{
                    borderRadius: "var(--radius-full)",
                    backgroundColor: chartMetric === "revenue" ? "var(--success)" : "var(--surface)",
                    color: chartMetric === "revenue" ? "#fff" : "var(--foreground)",
                    border: "1px solid var(--border)",
                    fontSize: 11.5,
                    padding: "4px 12px",
                  }}
                >
                  Komisi ({platformFee}%)
                </button>
                <button
                  type="button"
                  onClick={() => setChartMetric("rescue")}
                  className="btn btn-sm"
                  style={{
                    borderRadius: "var(--radius-full)",
                    backgroundColor: chartMetric === "rescue" ? "#10B981" : "var(--surface)",
                    color: chartMetric === "rescue" ? "#fff" : "var(--foreground)",
                    border: "1px solid var(--border)",
                    fontSize: 11.5,
                    padding: "4px 12px",
                  }}
                >
                  Porsi Rescue
                </button>
              </div>
            </div>

            {/* Visual Bar Chart */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                height: 190,
                paddingTop: 20,
                borderBottom: "1px solid var(--border)",
                gap: 8,
              }}
            >
              {weeklyData.map((item, i) => {
                const rawVal = chartMetric === "rescue"
                  ? item.rescue
                  : chartMetric === "revenue"
                  ? Math.round((item.gmv * platformFee) / 100)
                  : item.gmv;

                const max = chartMetric === "rescue"
                  ? maxRescue
                  : chartMetric === "revenue"
                  ? Math.round((maxGmv * platformFee) / 100)
                  : maxGmv;

                const heightPct = Math.max(14, Math.round((rawVal / max) * 100));
                const isHovered = activeHoverBar === i;

                const barColor = chartMetric === "rescue"
                  ? (isHovered ? "#059669" : "#10B981")
                  : chartMetric === "revenue"
                  ? (isHovered ? "var(--primary-dark)" : "var(--success)")
                  : (isHovered ? "var(--primary-dark)" : "var(--primary)");

                return (
                  <div
                    key={item.day}
                    style={{
                      flex: 1,
                      minWidth: 0,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      height: "100%",
                      justifyContent: "flex-end",
                      cursor: "pointer",
                      position: "relative",
                    }}
                    onMouseEnter={() => setActiveHoverBar(i)}
                    onMouseLeave={() => setActiveHoverBar(null)}
                  >
                    {/* Tooltip on Hover */}
                    {isHovered && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: `${heightPct + 8}%`,
                          backgroundColor: "#111827",
                          color: "#fff",
                          padding: "4px 8px",
                          borderRadius: "var(--radius-sm)",
                          fontSize: 11,
                          fontWeight: 700,
                          whiteSpace: "nowrap",
                          boxShadow: "var(--shadow-md)",
                          zIndex: 10,
                        }}
                      >
                        {chartMetric === "rescue" ? `${rawVal} porsi` : formatPrice(rawVal)}
                      </div>
                    )}

                    <div
                      style={{
                        width: "70%",
                        maxWidth: 36,
                        height: `${heightPct}%`,
                        backgroundColor: barColor,
                        borderRadius: "6px 6px 0 0",
                        transition: "all var(--transition-fast)",
                        transform: isHovered ? "scaleY(1.05)" : "scaleY(1)",
                      }}
                    />
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: isHovered ? 700 : 500,
                        color: isHovered ? "var(--foreground)" : "var(--muted)",
                        marginTop: 8,
                      }}
                    >
                      {item.day}
                    </span>
                  </div>
                );
              })}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontSize: 12, color: "var(--muted)", flexWrap: "wrap", gap: 8 }}>
              <span>Total 7 Hari: <strong>{chartMetric === "rescue" ? "816 porsi" : formatPrice(weeklyData.reduce((a, b) => a + (chartMetric === "revenue" ? Math.round((b.gmv * platformFee) / 100) : b.gmv), 0))}</strong></span>
              <span>Rata-rata/hari: <strong>{chartMetric === "rescue" ? "116 porsi" : formatPrice(Math.round(weeklyData.reduce((a, b) => a + (chartMetric === "revenue" ? Math.round((b.gmv * platformFee) / 100) : b.gmv), 0) / 7))}</strong></span>
            </div>
          </div>

          {/* Quick Controls & System Settings */}
          <div
            style={{
              backgroundColor: "var(--background)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-xl)",
              boxShadow: "var(--shadow-card)",
              padding: "22px 24px",
              display: "flex",
              flexDirection: "column",
              gap: 16,
              minWidth: 0,
            }}
          >
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--foreground)" }}>
                Aksi Cepat & Konfigurasi Sistem
              </h3>
              <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
                Kontrol operasional platform secara interaktif dan real-time
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {/* Adjust Fee Action */}
              <div
                style={{
                  padding: "12px 14px",
                  borderRadius: "var(--radius-lg)",
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Percent size={18} style={{ color: "var(--primary)" }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>Tarif Komisi Platform</div>
                    <div style={{ fontSize: 11, color: "var(--muted)" }}>Saat ini aktif: {platformFee}%</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleAdjustFee}
                  className="btn btn-sm btn-outline"
                  style={{ borderRadius: "var(--radius-full)", fontSize: 11.5 }}
                >
                  Ubah
                </button>
              </div>

              {/* Flash Deal Booster Action */}
              <div
                style={{
                  padding: "12px 14px",
                  borderRadius: "var(--radius-lg)",
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Sparkles size={18} style={{ color: "#F59E0B" }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>Booster Flash Deal</div>
                    <div style={{ fontSize: 11, color: "var(--muted)" }}>Tingkatkan eksposur diskon 50%</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleFlashDealBooster}
                  className="btn btn-sm btn-outline"
                  style={{ borderRadius: "var(--radius-full)", fontSize: 11.5 }}
                >
                  Picukan
                </button>
              </div>

              {/* Campus Broadcast Action */}
              <div
                style={{
                  padding: "12px 14px",
                  borderRadius: "var(--radius-lg)",
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Bell size={18} style={{ color: "#6366F1" }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>Notifikasi Kampus UNESA</div>
                    <div style={{ fontSize: 11, color: "var(--muted)" }}>Broadcast pesan ke mahasiswa</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCampusBroadcast}
                  className="btn btn-sm btn-outline"
                  style={{ borderRadius: "var(--radius-full)", fontSize: 11.5 }}
                >
                  Kirim
                </button>
              </div>
            </div>

            {/* Quick Links */}
            <div style={{ paddingTop: 8, borderTop: "1px solid var(--border-light)" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", marginBottom: 8 }}>
                PINTASAN MODUL DATA
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 8 }}>
                {[
                  { label: "Kelola Pembeli", path: "/admin/users" },
                  { label: "Kelola UMKM", path: "/admin/umkm" },
                  { label: "Kelola Produk", path: "/admin/products" },
                  { label: "Settlement Dana", path: "/admin/settlements" },
                ].map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "var(--foreground)",
                      padding: "6px 10px",
                      borderRadius: "var(--radius-md)",
                      backgroundColor: "var(--surface)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>{item.label}</span>
                    <ChevronRight size={13} style={{ color: "var(--muted)" }} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Live Activity Feed with Category Filter */}
        <div
          id="admin-activity"
          className="dash-section"
          style={{
            backgroundColor: "var(--background)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-xl)",
            boxShadow: "var(--shadow-card)",
            padding: "22px 24px",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Activity size={18} style={{ color: "var(--primary)" }} />
              <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--foreground)" }}>
                Linimasa Aktivitas Platform Real-Time
              </h3>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {/* Activity Filter Tabs */}
              <div className="scroll-x" style={{ gap: 4 }}>
                {["all", "transaksi", "pendaftaran", "surplus", "refund"].map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActivityFilter(filter)}
                    className="btn btn-sm"
                    style={{
                      borderRadius: "var(--radius-full)",
                      backgroundColor: activityFilter === filter ? "var(--primary)" : "var(--surface)",
                      color: activityFilter === filter ? "#fff" : "var(--foreground)",
                      border: "1px solid var(--border)",
                      fontSize: 11,
                      padding: "3px 10px",
                      textTransform: "capitalize",
                    }}
                  >
                    {filter === "all" ? "Semua" : filter}
                  </button>
                ))}
              </div>

              {/* Refresh button */}
              <button
                type="button"
                onClick={handleRefreshFeed}
                className="btn btn-sm btn-ghost"
                style={{ gap: 4, borderRadius: "var(--radius-full)" }}
                title="Perbarui linimasa"
              >
                <RefreshCw size={13} className={isRefreshingFeed ? "spin" : ""} />
                <span style={{ fontSize: 12 }}>Refresh</span>
              </button>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {filteredActivities.map((item, idx) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  padding: "12px 0",
                  borderBottom: idx < filteredActivities.length - 1 ? "1px solid var(--border-light)" : "none",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    backgroundColor: item.color,
                    marginTop: 6,
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: "var(--foreground)" }}>
                      {item.action}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        backgroundColor: "var(--surface)",
                        padding: "1px 6px",
                        borderRadius: "var(--radius-full)",
                        color: "var(--muted)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      {item.tag}
                    </span>
                  </div>
                  <div style={{ fontSize: 12.5, color: "var(--foreground-secondary)", marginTop: 2, wordBreak: "break-word" }}>
                    {item.detail}
                  </div>
                </div>
                <span style={{ fontSize: 11, color: "var(--muted)", whiteSpace: "nowrap", flexShrink: 0 }}>
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

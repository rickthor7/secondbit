import Swal from "sweetalert2";

export interface UMKMReportData {
  id: string;
  createdAt: string;
  reporterName: string;
  reporterRole: string;
  umkmName: string;
  umkmId?: string;
  orderNumber?: string;
  category: string;
  description: string;
  hasPhotoProof: boolean;
  photoProofUrl?: string;
  requestRefund: boolean;
  status: "Perlu Investigasi" | "Dalam Mediasi" | "Selesai - Refund" | "Sanksi Diberikan" | "Ditolak";
  resolutionNote?: string;
}

export const INITIAL_MOCK_REPORTS: UMKMReportData[] = [
  {
    id: "REP-2026-001",
    createdAt: "Hari ini, 15:42 WIB",
    reporterName: "Dimas Anggara (Mahasiswa FEB UNESA)",
    reporterRole: "Pembeli",
    umkmName: "Warung Bu Siti",
    umkmId: "u1",
    orderNumber: "SB-20260922-001",
    category: "Kualitas Makanan (Asam / Basi)",
    description: "Sayur lodeh terasa asam dan kuahnya agak berlendir saat dibuka di kos. Diduga sudah melewati holding time 4 jam.",
    hasPhotoProof: true,
    photoProofUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300",
    requestRefund: true,
    status: "Perlu Investigasi",
  },
  {
    id: "REP-2026-002",
    createdAt: "Kemarin, 19:10 WIB",
    reporterName: "Siti Nurhaliza (Mahasiswa FBS UNESA)",
    reporterRole: "Pembeli",
    umkmName: "Ayam Geprek Sambal Korek",
    umkmId: "u3",
    orderNumber: "SB-20260921-042",
    category: "Toko Tutup Saat Jam Pickup",
    description: "Datang ke lokasi jam 18.30 (sesuai jam pickup 18.00-19.00), tapi toko sudah tutup dan rolling door digembok. Penjual tidak angkat telepon.",
    hasPhotoProof: true,
    photoProofUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300",
    requestRefund: true,
    status: "Dalam Mediasi",
  },
  {
    id: "REP-2026-003",
    createdAt: "2 hari lalu, 17:05 WIB",
    reporterName: "Budi Santoso",
    reporterRole: "Pembeli",
    umkmName: "Nasi Bebek Madura Barokah",
    umkmId: "u5",
    orderNumber: "SB-20260920-019",
    category: "Porsi / Menu Tidak Sesuai",
    description: "Di foto surplus tertera bebek goreng paha utuh + nasi, tetapi yang diberikan hanya potongan leher dan tulang saja.",
    hasPhotoProof: true,
    photoProofUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300",
    requestRefund: true,
    status: "Selesai - Refund",
    resolutionNote: "Refund 100% Rp 12.000 telah dikembalikan ke saldo pembeli. UMKM diberikan Surat Peringatan (SP-1).",
  },
  {
    id: "REP-2026-004",
    createdAt: "4 hari lalu, 16:30 WIB",
    reporterName: "Rian Pratama (Mahasiswa FT UNESA)",
    reporterRole: "Pembeli",
    umkmName: "Depot Pangsit Mie Gajah Mada",
    umkmId: "u2",
    orderNumber: "SB-20260918-088",
    category: "Pelanggaran SOP Kebersihan",
    description: "Penjual tidak menggunakan sarung tangan / penjepit saat membungkus porsi surplus dan wadah tidak tersegel.",
    hasPhotoProof: false,
    requestRefund: false,
    status: "Sanksi Diberikan",
    resolutionNote: "Teguran pembinaan SOP higienitas telah disampaikan. Toko wajib setor foto checklist 3T selama 7 hari berturut-turut.",
  },
];

export function getStoredReports(): UMKMReportData[] {
  const saved = localStorage.getItem("secondbit_umkm_reports");
  if (!saved) {
    localStorage.setItem("secondbit_umkm_reports", JSON.stringify(INITIAL_MOCK_REPORTS));
    return INITIAL_MOCK_REPORTS;
  }
  try {
    return JSON.parse(saved);
  } catch {
    return INITIAL_MOCK_REPORTS;
  }
}

export function saveReports(reports: UMKMReportData[]) {
  localStorage.setItem("secondbit_umkm_reports", JSON.stringify(reports));
}

interface OpenReportModalOptions {
  umkmName: string;
  umkmId?: string;
  orderNumber?: string;
  onSuccess?: (newReport: UMKMReportData) => void;
}

export async function showReportUMKMModal({
  umkmName,
  umkmId,
  orderNumber,
  onSuccess,
}: OpenReportModalOptions) {
  const result = await Swal.fire({
    title: `<span style="font-size:18px; font-weight:800; color:#EF4444;">🚩 Laporkan UMKM / Masalah Pelayanan</span>`,
    html: `
      <div style="text-align: left; font-size: 13px; color: #475569; line-height: 1.5; margin-bottom: 12px;">
        SecondBit berkomitmen menjaga standar kualitas makanan & kenyamanan berbelanja. Setiap laporan akan dimediasi oleh tim Super Admin dalam <strong style="color:#EF4444;">< 15 menit</strong>.
      </div>

      <div style="text-align: left; margin-bottom: 10px;">
        <label style="display:block; font-size:12px; font-weight:700; margin-bottom:4px; color:#1E293B;">
          Nama Toko Terlapor:
        </label>
        <input id="report-umkm" class="swal2-input" value="${umkmName}" readonly style="margin:0; width:100%; background:#F1F5F9; font-weight:700;" />
      </div>

      <div style="text-align: left; margin-bottom: 10px;">
        <label style="display:block; font-size:12px; font-weight:700; margin-bottom:4px; color:#1E293B;">
          ID Pesanan Terkait (Opsional / Jika Ada):
        </label>
        <input id="report-order" class="swal2-input" value="${orderNumber || ""}" placeholder="Cth: SB-20260922-001" style="margin:0; width:100%;" />
      </div>

      <div style="text-align: left; margin-bottom: 10px;">
        <label style="display:block; font-size:12px; font-weight:700; margin-bottom:4px; color:#1E293B;">
          Kategori Pelanggaran / Masalah:
        </label>
        <select id="report-category" class="swal2-select" style="margin:0; width:100%; font-size:13px; display:block;">
          <option value="Kualitas Makanan (Asam / Basi / Berbau)">🍲 Kualitas Makanan (Asam / Basi / Bau / SOP 3T)</option>
          <option value="Porsi / Menu Tidak Sesuai">⚖️ Porsi / Isi Tidak Sesuai Foto & Deskripsi</option>
          <option value="Toko Tutup Saat Jam Pickup">⏱️ Toko Tutup / Penjual Tidak Ada saat Jam Pickup</option>
          <option value="Penolakan Tiket QR / Biaya Tambahan Ilegal">❌ Penolakan Tiket QR / Minta Biaya Tambahan</option>
          <option value="Pelanggaran SOP Kebersihan">🧹 Pelanggaran SOP Higienitas & Pengemasan</option>
          <option value="Pelayanan Kasar / Perilaku Buruk">💬 Pelayanan Kasar / Perilaku Tidak Pantas</option>
          <option value="Lainnya">⚠️ Masalah Lainnya</option>
        </select>
      </div>

      <div style="text-align: left; margin-bottom: 10px;">
        <label style="display:block; font-size:12px; font-weight:700; margin-bottom:4px; color:#1E293B;">
          Kronologi Detail Kejadian:
        </label>
        <textarea id="report-desc" class="swal2-textarea" placeholder="Jelaskan secara rinci apa yang terjadi (misal: jam berapa tiba di warung, kondisi makanan, tanggapan penjual)..." style="margin:0; width:100%; height:80px; font-size:12.5px;"></textarea>
      </div>

      <div style="text-align: left; margin-bottom: 12px; background:#F8FAFC; border:1px dashed #CBD5E1; padding:10px; border-radius:8px;">
        <label style="display:flex; align-items:center; gap:8px; font-size:12.5px; font-weight:600; cursor:pointer;">
          <input type="checkbox" id="report-photo" checked style="width:16px; height:16px; accent-color:#EF4444;" />
          <span>Lampirkan Bukti Foto Makanan / Lokasi (Rekomendasi Cepat Lolos)</span>
        </label>
      </div>

      <div style="text-align: left; background:rgba(238, 77, 45, 0.08); border:1px solid rgba(238, 77, 45, 0.2); padding:10px; border-radius:8px;">
        <label style="display:flex; align-items:center; gap:8px; font-size:12.5px; font-weight:700; color:#EE4D2D; cursor:pointer;">
          <input type="checkbox" id="report-refund" checked style="width:16px; height:16px; accent-color:#EE4D2D;" />
          <span>Ajukan Pengembalian Dana 100% (Garansi Uang Kembali)</span>
        </label>
      </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Kirim Laporan Resmi",
    cancelButtonText: "Batal",
    confirmButtonColor: "#EF4444",
    cancelButtonColor: "#64748B",
    reverseButtons: true,
    preConfirm: () => {
      const category = (document.getElementById("report-category") as HTMLSelectElement)?.value;
      const order = (document.getElementById("report-order") as HTMLInputElement)?.value.trim();
      const desc = (document.getElementById("report-desc") as HTMLTextAreaElement)?.value.trim();
      const photo = (document.getElementById("report-photo") as HTMLInputElement)?.checked;
      const refund = (document.getElementById("report-refund") as HTMLInputElement)?.checked;

      if (!desc || desc.length < 10) {
        Swal.showValidationMessage("Harap tuliskan kronologi kejadian minimal 10 karakter!");
        return false;
      }

      return {
        category,
        order,
        desc,
        photo,
        refund,
      };
    },
  });

  if (!result.isConfirmed || !result.value) return;

  const data = result.value as {
    category: string;
    order: string;
    desc: string;
    photo: boolean;
    refund: boolean;
  };

  const newTicketId = `REP-2026-${String(Math.floor(100 + Math.random() * 900))}`;
  const nowStr = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }) + " WIB";

  const newReport: UMKMReportData = {
    id: newTicketId,
    createdAt: nowStr,
    reporterName: "Ahmad Rizky (Pembeli Terverifikasi)",
    reporterRole: "Pembeli",
    umkmName,
    umkmId: umkmId || "u1",
    orderNumber: data.order || undefined,
    category: data.category,
    description: data.desc,
    hasPhotoProof: data.photo,
    photoProofUrl: data.photo ? "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300" : undefined,
    requestRefund: data.refund,
    status: "Perlu Investigasi",
  };

  const currentReports = getStoredReports();
  const updated = [newReport, ...currentReports];
  saveReports(updated);

  if (onSuccess) {
    onSuccess(newReport);
  }

  await Swal.fire({
    icon: "success",
    title: "Laporan Berhasil Terkirim!",
    html: `
      <div style="font-size: 13.5px; text-align: left; line-height: 1.6; color: #475569;">
        <p>Terima kasih atas laporan Anda. Laporan telah masuk ke <strong>Pusat Resolusi Super Admin SecondBit</strong>.</p>
        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 12px; border-radius: 8px; margin: 10px 0;">
          <div><strong>Nomor Tiket:</strong> <span style="color:#EF4444; font-weight:800;">${newTicketId}</span></div>
          <div><strong>Toko Terlapor:</strong> ${umkmName}</div>
          <div><strong>Kategori:</strong> ${data.category}</div>
          <div><strong>Status Refund:</strong> ${data.refund ? '<span style="color:#16a34a; font-weight:700;">Dalam Peninjauan Mediasi 100%</span>' : 'Hanya Laporan Evaluasi Toko'}</div>
        </div>
        <p style="font-size: 12px; color: #64748B;">
          ⏱️ Tim Admin SecondBit menjamin mediasi dan evaluasi dalam <strong>< 15 menit</strong>. Pembaruan status akan dikirimkan ke notifikasi akun Anda.
        </p>
      </div>
    `,
    confirmButtonText: "Selesai",
    confirmButtonColor: "#EE4D2D",
  });
}

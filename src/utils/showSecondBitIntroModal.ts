import Swal from "sweetalert2";

export function showSecondBitIntroModal(force = false) {
  if (!force) {
    const hasSeen = localStorage.getItem("secondbit_intro_seen");
    if (hasSeen) return;
  }

  const isDark = document.documentElement.getAttribute("data-theme") === "dark";

  const bgModal = isDark ? "#181824" : "#ffffff";
  const textColor = isDark ? "#f3f4f6" : "#1f2937";
  const subTextColor = isDark ? "#9ca3af" : "#4b5563";
  const cardBg = isDark ? "#222332" : "#f8fafc";
  const cardBorder = isDark ? "rgba(255, 255, 255, 0.08)" : "#e2e8f0";

  Swal.fire({
    title: "",
    html: `
      <div style="text-align: center; font-family: 'Inter', system-ui, sans-serif; padding: 4px 0;">
        <!-- Header Badge & Logo -->
        <div style="display: inline-flex; align-items: center; gap: 8px; background: rgba(238, 77, 45, 0.1); color: #EE4D2D; padding: 6px 14px; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;">
          🌱 Food Rescue & Hidden Gem UMKM
        </div>

        <h2 style="font-size: 24px; font-weight: 800; color: ${textColor}; line-height: 1.25; margin-bottom: 8px;">
          Selamat Datang di <span style="background: linear-gradient(135deg, #EE4D2D 0%, #FF6633 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">SecondBit</span>! 👋
        </h2>

        <!-- Tagline Banner -->
        <div style="background: linear-gradient(135deg, rgba(238,77,45,0.08) 0%, rgba(38,170,108,0.08) 100%); border-left: 4px solid #EE4D2D; border-radius: 8px; padding: 12px 14px; margin-bottom: 18px; text-align: left;">
          <div style="font-size: 14px; font-weight: 700; color: #EE4D2D; margin-bottom: 2px;">
            ✨ Tagline Kami:
          </div>
          <div style="font-size: 13.5px; font-weight: 600; color: ${textColor}; line-height: 1.4;">
            "Selamatkan Makanan Lezat, Hemat Budget, Dukung UMKM Lokal!"
          </div>
          <div style="font-size: 12px; color: ${subTextColor}; margin-top: 4px;">
            Platform pelopor food rescue & eksplorasi kuliner hidden gem di sekitar kampus UNESA Ketintang, Surabaya.
          </div>
        </div>

        <!-- 4 Key Pillars Grid -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 18px; text-align: left;">
          <div style="background: ${cardBg}; border: 1px solid ${cardBorder}; border-radius: 12px; padding: 12px;">
            <div style="font-size: 20px; margin-bottom: 4px;">🌿</div>
            <div style="font-size: 13px; font-weight: 700; color: #26AA6C; margin-bottom: 3px;">Surplus Rescue</div>
            <div style="font-size: 11.5px; color: ${subTextColor}; line-height: 1.35;">
              Selamatkan makanan fresh berlebih sebelum UMKM tutup dengan diskon hingga <strong>70%</strong>. Kurangi food waste!
            </div>
          </div>

          <div style="background: ${cardBg}; border: 1px solid ${cardBorder}; border-radius: 12px; padding: 12px;">
            <div style="font-size: 20px; margin-bottom: 4px;">⚡</div>
            <div style="font-size: 13px; font-weight: 700; color: #EE4D2D; margin-bottom: 3px;">Flash Deals Harian</div>
            <div style="font-size: 11.5px; color: ${subTextColor}; line-height: 1.35;">
              Promo kilat menu favorit mahasiswa dengan kuota terbatas setiap hari. Makan enak tetap hemat!
            </div>
          </div>

          <div style="background: ${cardBg}; border: 1px solid ${cardBorder}; border-radius: 12px; padding: 12px;">
            <div style="font-size: 20px; margin-bottom: 4px;">💎</div>
            <div style="font-size: 13px; font-weight: 700; color: #6366F1; margin-bottom: 3px;">Hidden Gem UMKM</div>
            <div style="font-size: 11.5px; color: ${subTextColor}; line-height: 1.35;">
              Temukan warung legendaris dan kuliner autentik tersembunyi yang mungkin belum kamu tahu.
            </div>
          </div>

          <div style="background: ${cardBg}; border: 1px solid ${cardBorder}; border-radius: 12px; padding: 12px;">
            <div style="font-size: 20px; margin-bottom: 4px;">📱</div>
            <div style="font-size: 13px; font-weight: 700; color: #F59E0B; margin-bottom: 3px;">QR Pick-Up Instan</div>
            <div style="font-size: 11.5px; color: ${subTextColor}; line-height: 1.35;">
              Pesan & bayar praktis via QRIS tanpa antre. Cukup tunjukkan tiket QR saat mengambil pesanan di gerai.
            </div>
          </div>
        </div>

        <!-- Location Footer -->
        <div style="display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 12px; color: ${subTextColor};">
          <span>📍 Lokasi Operasional: <strong>Sekitar Kampus UNESA Ketintang, Surabaya</strong></span>
        </div>
      </div>
    `,
    width: "min(92vw, 540px)",
    background: bgModal,
    showCloseButton: true,
    showConfirmButton: true,
    confirmButtonText: "Mulai Jelajahi Makanan 🚀",
    confirmButtonColor: "#EE4D2D",
    buttonsStyling: true,
    customClass: {
      popup: "secondbit-intro-popup",
      confirmButton: "btn btn-primary",
    },
    didClose: () => {
      localStorage.setItem("secondbit_intro_seen", "true");
    },
  });
}

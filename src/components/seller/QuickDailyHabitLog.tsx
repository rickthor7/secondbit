import { useState, useEffect } from "react";
import {
  Flame,
  Award,
  Mic,
  CheckCircle2,
  Clock,
  Sparkles,
  Leaf,
  Plus,
  Minus,
  AlertCircle,
  HelpCircle,
  ArrowRight,
} from "lucide-react";
import Swal from "sweetalert2";
import { formatPrice } from "@/data/mockData";

export interface HabitLogEntry {
  id: string;
  date: string;
  dayLabel: string;
  portions: number;
  tag: string;
  convertedToSurplus: boolean;
  notes?: string;
  rescueStatus: "Terdaftar Surplus" | "Tercatat di Dapur" | "Habis Bersih";
}

const INITIAL_LOGS: HabitLogEntry[] = [
  {
    id: "log-1",
    date: "Kemarin",
    dayLabel: "Jumat",
    portions: 0,
    tag: "🎉 Habis Bersih",
    convertedToSurplus: false,
    rescueStatus: "Habis Bersih",
    notes: "Laris manis diborong mahasiswa setelah jumatan.",
  },
  {
    id: "log-2",
    date: "2 hari lalu",
    dayLabel: "Kamis",
    portions: 3,
    tag: "⛈️ Hujan Sore",
    convertedToSurplus: true,
    rescueStatus: "Terdaftar Surplus",
    notes: "Hujan deras jam 16.00, langsung terbit surplus rescue dan laku 3 porsi.",
  },
  {
    id: "log-3",
    date: "3 hari lalu",
    dayLabel: "Rabu",
    portions: 2,
    tag: "📚 Kuliah Reguler",
    convertedToSurplus: true,
    rescueStatus: "Terdaftar Surplus",
    notes: "Tersisa 2 porsi telur balado, diselamatkan mahasiswa FEB.",
  },
  {
    id: "log-4",
    date: "4 hari lalu",
    dayLabel: "Selasa",
    portions: 0,
    tag: "🎉 Habis Bersih",
    convertedToSurplus: false,
    rescueStatus: "Habis Bersih",
  },
  {
    id: "log-5",
    date: "5 hari lalu",
    dayLabel: "Senin",
    portions: 4,
    tag: "📝 Pekan Kuis",
    convertedToSurplus: true,
    rescueStatus: "Terdaftar Surplus",
    notes: "Porsi sengaja dilebihkan, 4 porsi surplus langsung laku via tiket QR.",
  },
];

const QUICK_TAGS = [
  "⛈️ Hujan Deras Sore",
  "📝 Pekan UTS/UAS",
  "🎓 Wisuda UNESA",
  "☀️ Cuaca Panas",
  "🍗 Ayam Geprek Laris",
  "🏖️ Mahasiswa Libur",
];

const PRESETS = [
  { label: "🎉 Habis Bersih", count: 0, desc: "0 porsi sisa" },
  { label: "🥗 Sedikit", count: 2, desc: "1 - 3 porsi" },
  { label: "🍱 Sedang", count: 5, desc: "4 - 7 porsi" },
  { label: "📦 Banyak", count: 9, desc: "8+ porsi" },
];

export default function QuickDailyHabitLog() {
  const [streak, setStreak] = useState<number>(() => {
    const saved = localStorage.getItem("secondbit_seller_streak");
    return saved ? Number(saved) : 5;
  });
  const [logs, setLogs] = useState<HabitLogEntry[]>(() => {
    const saved = localStorage.getItem("secondbit_seller_habit_logs");
    return saved ? JSON.parse(saved) : INITIAL_LOGS;
  });
  const [hasLoggedToday, setHasLoggedToday] = useState<boolean>(() => {
    return localStorage.getItem("secondbit_seller_logged_today") === "true";
  });

  const [portions, setPortions] = useState<number>(3);
  const [autoSurplus, setAutoSurplus] = useState<boolean>(true);
  const [selectedTag, setSelectedTag] = useState<string>("⛈️ Hujan Deras Sore");
  const [quickNote, setQuickNote] = useState<string>("");
  const [isListening, setIsListening] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem("secondbit_seller_streak", String(streak));
  }, [streak]);

  useEffect(() => {
    localStorage.setItem("secondbit_seller_habit_logs", JSON.stringify(logs));
  }, [logs]);

  // Simulasi Voice Note (Fitur pembiasaan UMKM yang malas ngetik)
  const handleVoiceInput = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      setQuickNote(
        "Alhamdulillah geprek laris, tersisa 3 porsi lauk telur dan sayur campur karena hujan lebat sore tadi di Ketintang."
      );
      Swal.fire({
        icon: "success",
        title: "Suara Berhasil Dikonversi!",
        text: "Catatan suara Anda telah diubah menjadi teks catatan otomatis.",
        timer: 1800,
        showConfirmButton: false,
      });
    }, 1200);
  };

  const handleSubmit = async () => {
    const newStreak = hasLoggedToday ? streak : streak + 1;
    setStreak(newStreak);
    setHasLoggedToday(true);
    localStorage.setItem("secondbit_seller_logged_today", "true");

    const newLog: HabitLogEntry = {
      id: `log-${Date.now()}`,
      date: "Hari Ini",
      dayLabel: new Date().toLocaleDateString("id-ID", { weekday: "long" }),
      portions,
      tag: selectedTag,
      convertedToSurplus: portions > 0 && autoSurplus,
      rescueStatus:
        portions === 0
          ? "Habis Bersih"
          : autoSurplus
          ? "Terdaftar Surplus"
          : "Tercatat di Dapur",
      notes: quickNote || (portions === 0 ? "Alhamdulillah warung habis bersih!" : `${portions} porsi sisa hari ini.`),
    };

    setLogs((prev) => [newLog, ...prev.filter((l) => l.date !== "Hari Ini")]);

    await Swal.fire({
      icon: "success",
      title: `🔥 Streak ${newStreak} Hari Berturut-turut!`,
      html: `
        <div style="font-size: 14px; text-align: left; line-height: 1.6; color: #475569;">
          <p>Terima kasih Bu Siti! Jurnal kilat 30 detik Anda berhasil disimpan.</p>
          <ul style="padding-left: 20px; margin: 10px 0;">
            <li><strong>Sisa Stok:</strong> ${portions} porsi (${selectedTag})</li>
            <li><strong>Status Surplus:</strong> ${
              portions > 0 && autoSurplus
                ? '<span style="color:#16a34a; font-weight:700;">✓ Otomatis Tayang di Surplus Rescue (Diskon 40%)</span>'
                : portions === 0
                ? '<span style="color:#16a34a; font-weight:700;">🎉 Zero Waste Hari Ini!</span>'
                : '<span>Tercatat internal dapur</span>'
            }</li>
            <li><strong>Dampak AI:</strong> Akurasi rekomendasi kalender & cuaca toko Anda kini mencapai <strong>96%</strong>!</li>
          </ul>
        </div>
      `,
      confirmButtonText: "Mantap, Lanjutkan",
      confirmButtonColor: "#EE4D2D",
    });
  };

  return (
    <div
      style={{
        backgroundColor: "var(--background)",
        borderRadius: "var(--radius-xl)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-sm)",
        marginBottom: 24,
        overflow: "hidden",
      }}
    >
      {/* Header Widget */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 20px",
          background: "linear-gradient(135deg, rgba(238, 77, 45, 0.09) 0%, rgba(245, 158, 11, 0.09) 100%)",
          borderBottom: "1px solid var(--border-light)",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "var(--radius-md)",
              background: "linear-gradient(135deg, #EE4D2D 0%, #F59E0B 100%)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Clock size={20} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: "var(--foreground)" }}>
                Jurnal Kilat 30 Detik UMKM
              </h3>
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
                Pembiasaan Input Ringan
              </span>
            </div>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--muted)" }}>
              Anti-ribet, tanpa ketik panjang. Cukup 30 detik tiap sore untuk melatih AI toko & selamatkan modal!
            </p>
          </div>
        </div>

        {/* Streak Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
            padding: "6px 14px",
            borderRadius: "var(--radius-full)",
          }}
        >
          <Flame size={18} style={{ color: "#EE4D2D", fill: "#EE4D2D" }} />
          <div style={{ fontSize: 12.5, fontWeight: 800, color: "var(--foreground)" }}>
            Streak {streak} Hari!
          </div>
          <span
            style={{
              fontSize: 10,
              backgroundColor: "rgba(34, 197, 94, 0.12)",
              color: "var(--success)",
              fontWeight: 700,
              padding: "1px 6px",
              borderRadius: "var(--radius-full)",
            }}
          >
            Level 2: Mitra Teladan
          </span>
        </div>
      </div>

      <div style={{ padding: "20px" }}>
        {/* Streak Progress & Motivation */}
        <div
          style={{
            backgroundColor: "var(--surface-sunken)",
            borderRadius: "var(--radius-lg)",
            padding: "12px 16px",
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
              <span>Target Rutin 7 Hari (Buka Bonus Akurasi AI 98%)</span>
              <span style={{ color: "var(--primary)" }}>{Math.min(streak, 7)}/7 Hari</span>
            </div>
            <div
              style={{
                height: 8,
                borderRadius: "var(--radius-full)",
                backgroundColor: "var(--border)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${Math.min((streak / 7) * 100, 100)}%`,
                  background: "linear-gradient(90deg, #EE4D2D 0%, #22C55E 100%)",
                  borderRadius: "var(--radius-full)",
                  transition: "width 0.4s ease",
                }}
              />
            </div>
          </div>
          <div style={{ fontSize: 11.5, color: "var(--muted)", maxWidth: 360, lineHeight: 1.4 }}>
            💡 <strong>Mengapa Input Ringan Penting?</strong> Warung yang rutin mencatat 30 detik terbukti mengurangi kerugian bahan terbuang hingga Rp 420.000/minggu.
          </div>
        </div>

        {/* Input Step 1: Porsi Sisa */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "var(--foreground)", marginBottom: 8 }}>
            1. Berapa porsi makanan/lauk yang tersisa sore ini?
          </label>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
              gap: 8,
              marginBottom: 12,
            }}
          >
            {PRESETS.map((preset) => {
              const active = portions === preset.count;
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setPortions(preset.count)}
                  style={{
                    padding: "10px 12px",
                    borderRadius: "var(--radius-md)",
                    border: active ? "2px solid var(--primary)" : "1px solid var(--border)",
                    backgroundColor: active ? "rgba(238, 77, 45, 0.08)" : "var(--surface)",
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 700, color: active ? "var(--primary)" : "var(--foreground)" }}>
                    {preset.label}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>
                    {preset.desc}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Stepper manual jika ingin custom */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              padding: "6px 12px",
            }}
          >
            <span style={{ fontSize: 12, color: "var(--muted)" }}>Atur Jumlah Porsi:</span>
            <button
              type="button"
              onClick={() => setPortions((p) => Math.max(0, p - 1))}
              style={{
                width: 28,
                height: 28,
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border)",
                backgroundColor: "var(--background)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Minus size={14} />
            </button>
            <span style={{ fontSize: 16, fontWeight: 800, minWidth: 40, textAlign: "center" }}>
              {portions} Porsi
            </span>
            <button
              type="button"
              onClick={() => setPortions((p) => p + 1)}
              style={{
                width: 28,
                height: 28,
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border)",
                backgroundColor: "var(--background)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        {/* Input Step 2: Aksi Otomatis Rescue */}
        {portions > 0 && (
          <div
            style={{
              backgroundColor: "rgba(34, 197, 94, 0.08)",
              border: "1px solid rgba(34, 197, 94, 0.25)",
              borderRadius: "var(--radius-lg)",
              padding: "12px 16px",
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Leaf size={20} style={{ color: "var(--success)" }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--foreground)" }}>
                  Otomatis Tayangkan ke Surplus Rescue (Diskon 40%)
                </div>
                <div style={{ fontSize: 11.5, color: "var(--muted)" }}>
                  Potensi omzet terselamatkan: ±{formatPrice(portions * 9500)} daripada basi.
                </div>
              </div>
            </div>

            <label
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                color: "var(--success)",
              }}
            >
              <input
                type="checkbox"
                checked={autoSurplus}
                onChange={(e) => setAutoSurplus(e.target.checked)}
                style={{ width: 18, height: 18, accentColor: "var(--success)", cursor: "pointer" }}
              />
              Aktifkan Rescue
            </label>
          </div>
        )}

        {/* Input Step 3: Faktor Hari Ini (1-Tap Chip) */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "var(--foreground)", marginBottom: 8 }}>
            2. Kondisi utama yang paling terasa hari ini:
          </label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {QUICK_TAGS.map((tag) => {
              const active = selectedTag === tag;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(tag)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "var(--radius-full)",
                    border: active ? "1px solid var(--primary)" : "1px solid var(--border)",
                    backgroundColor: active ? "var(--primary)" : "var(--surface)",
                    color: active ? "#fff" : "var(--foreground)",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Input Step 4: Voice-to-Text / Catatan Suara Cepat */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: "var(--foreground)" }}>
              3. Catatan Kilat Dapur (Opsional / Bisa Pakai Suara):
            </label>
            <button
              type="button"
              onClick={handleVoiceInput}
              disabled={isListening}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 11.5,
                fontWeight: 700,
                color: isListening ? "#fff" : "var(--primary)",
                backgroundColor: isListening ? "var(--primary)" : "rgba(238, 77, 45, 0.1)",
                border: "none",
                borderRadius: "var(--radius-full)",
                padding: "4px 10px",
                cursor: isListening ? "wait" : "pointer",
              }}
            >
              <Mic size={13} className={isListening ? "spin" : undefined} />
              {isListening ? "Mendengarkan suara…" : "🎙️ Rekam Suara (Simulasi)"}
            </button>
          </div>
          <input
            type="text"
            className="input"
            value={quickNote}
            onChange={(e) => setQuickNote(e.target.value)}
            placeholder="Cth: Nasi habis duluan, sisa 3 porsi ayam geprek karena hujan jam 4 sore..."
            style={{ width: "100%", fontSize: 13 }}
          />
        </div>

        {/* Submit Button */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <button
            type="button"
            onClick={handleSubmit}
            className="btn btn-primary"
            style={{
              padding: "10px 24px",
              borderRadius: "var(--radius-md)",
              fontSize: 13,
              fontWeight: 700,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
            }}
          >
            <CheckCircle2 size={16} />
            Simpan Jurnal Hari Ini (30 Detik Selesai!)
          </button>

          {hasLoggedToday && (
            <span style={{ fontSize: 12, color: "var(--success)", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 5 }}>
              <CheckCircle2 size={14} /> Jurnal hari ini sudah tercatat.
            </span>
          )}
        </div>

        {/* Riwayat Mini Log 5 Hari Terakhir */}
        <div style={{ marginTop: 24, paddingTop: 18, borderTop: "1px dashed var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--foreground)" }}>
              📋 Riwayat 5 Catatan Terakhir Anda
            </span>
            <span style={{ fontSize: 11, color: "var(--muted)" }}>Konsistensi Input Membangun Reputasi Toko</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {logs.slice(0, 4).map((entry) => (
              <div
                key={entry.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 12px",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border-light)",
                  fontSize: 12,
                  gap: 10,
                  flexWrap: "wrap",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontWeight: 700, color: "var(--foreground)", width: 70 }}>
                    {entry.date}
                  </span>
                  <span
                    style={{
                      padding: "2px 8px",
                      borderRadius: "var(--radius-full)",
                      fontSize: 11,
                      fontWeight: 600,
                      backgroundColor: "var(--surface-sunken)",
                      color: "var(--muted)",
                    }}
                  >
                    {entry.tag}
                  </span>
                  {entry.notes && (
                    <span style={{ color: "var(--muted)", fontSize: 11.5, maxWidth: 320, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      "{entry.notes}"
                    </span>
                  )}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{
                      fontWeight: 700,
                      color: entry.portions === 0 ? "var(--success)" : "var(--primary)",
                    }}
                  >
                    {entry.portions === 0 ? "Habis Bersih" : `${entry.portions} Porsi Sisa`}
                  </span>
                  <span
                    style={{
                      fontSize: 10.5,
                      fontWeight: 600,
                      padding: "2px 7px",
                      borderRadius: "var(--radius-full)",
                      backgroundColor:
                        entry.rescueStatus === "Terdaftar Surplus"
                          ? "rgba(34, 197, 94, 0.12)"
                          : entry.rescueStatus === "Habis Bersih"
                          ? "rgba(59, 130, 246, 0.12)"
                          : "var(--surface-sunken)",
                      color:
                        entry.rescueStatus === "Terdaftar Surplus"
                          ? "var(--success)"
                          : entry.rescueStatus === "Habis Bersih"
                          ? "var(--info)"
                          : "var(--muted)",
                    }}
                  >
                    {entry.rescueStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

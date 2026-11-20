import { useState, useEffect } from "react";
import { Gem, MapPin, Award, Star, Compass } from "lucide-react";
import AOS from "aos";

import UMKMCard from "@/components/shared/UMKMCard";
import { getHiddenGemUMKM } from "@/data/mockData";

export default function HiddenGem() {
  const allHiddenGems = getHiddenGemUMKM();
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    AOS.refresh();
  }, []);

  const categories = ["all", ...Array.from(new Set(allHiddenGems.map((u) => u.category)))];

  const filtered = selectedCategory === "all"
    ? allHiddenGems
    : allHiddenGems.filter((u) => u.category === selectedCategory);

  return (
    <main style={{ minHeight: "80vh" }}>
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #A855F7 100%)",
          padding: "42px 0",
          color: "#fff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", top: -20, right: -20, width: 160, height: 160, borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.1)" }} />
        <div style={{ position: "absolute", bottom: -40, left: 40, width: 100, height: 100, borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.06)" }} />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "var(--radius-xl)",
                backgroundColor: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(8px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
            >
              <Gem size={30} />
            </div>
            <div>
              <span
                style={{
                  backgroundColor: "rgba(255,255,255,0.22)",
                  fontSize: 11,
                  fontWeight: 800,
                  padding: "2px 8px",
                  borderRadius: "var(--radius-full)",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                💎 Kurasi Eksklusif
              </span>
              <h1 style={{ fontSize: "clamp(24px, 3.5vw, 32px)", fontWeight: 900, lineHeight: 1.2, marginTop: 4 }}>
                Hidden Gem Kuliner Ketintang
              </h1>
              <p style={{ fontSize: 14, opacity: 0.95, maxWidth: 560 }}>
                Daftar warung dan UMKM legendaris tersembunyi dengan cita rasa juara di sekitar kawasan UNESA Ketintang, Surabaya.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container" style={{ padding: "32px 16px 50px" }}>
        {/* Filter Pills */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
            marginBottom: 24,
          }}
          data-aos="fade-up"
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--muted)" }}>
            <Compass size={16} style={{ color: "var(--primary)" }} />
            <span>
              Menampilkan <strong style={{ color: "var(--foreground)" }}>{filtered.length}</strong> UMKM Hidden Gem
            </span>
          </div>

          <div className="scroll-x" style={{ gap: 8 }}>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className="btn btn-sm"
                style={{
                  borderRadius: "var(--radius-full)",
                  backgroundColor: selectedCategory === cat ? "var(--primary)" : "var(--surface)",
                  color: selectedCategory === cat ? "#fff" : "var(--foreground)",
                  border: "1px solid var(--border)",
                  fontSize: 12,
                  fontWeight: 600,
                  padding: "5px 14px",
                }}
              >
                {cat === "all" ? "Semua Kategori" : cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid-umkm">
          {filtered.map((umkm, i) => (
            <div key={umkm.id} data-aos="fade-up" data-aos-delay={i * 60}>
              <UMKMCard umkm={umkm} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

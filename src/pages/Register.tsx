import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, User, Store, Phone, Sparkles, CheckCircle2 } from "lucide-react";
import Swal from "sweetalert2";
import logoImg from "@/assets/images/logo.jpg";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [shopName, setShopName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"buyer" | "seller">("buyer");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    localStorage.setItem(
      "secondbit-auth",
      JSON.stringify({
        role,
        name: role === "seller" ? shopName || name : name,
        email,
      })
    );

    Swal.fire({
      icon: "success",
      title: role === "seller" ? "Kemitraan UMKM Berhasil Didaftarkan!" : "Registrasi Berhasil!",
      html: `
        <div style="font-size:13.5px; text-align:left; line-height:1.6; color:#475569;">
          ${
            role === "seller"
              ? `<p>Selamat datang di keluarga Mitra SecondBit! Toko <strong>${shopName || name}</strong> langsung siap diverifikasi dan dapat mulai menjual surplus.</p>
                 <div style="background:#F0FDF4; border:1px solid #BBF7D0; padding:10px; border-radius:8px; color:#16A34A; font-size:12.5px;">
                   ✓ Gratis biaya daftar (Rp 0)<br/>
                   ✓ Akses instan ke Dashboard UMKM & Fitur Jurnal 30 Detik
                 </div>`
              : `<p>Selamat bergabung di SecondBit! Selamatkan makanan lezat dan nikmati diskon surplus hingga 70% di sekitar kampus.</p>`
          }
        </div>
      `,
      confirmButtonColor: "#EE4D2D",
      confirmButtonText: role === "seller" ? "Buka Dashboard Toko" : "Mulai Belanja",
    }).then(() => {
      if (role === "seller") {
        navigate("/seller");
      } else {
        navigate("/buyer");
      }
    });
  };

  return (
    <main
      style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 16px",
        backgroundColor: "var(--surface)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          backgroundColor: "var(--background)",
          borderRadius: "var(--radius-xl)",
          boxShadow: "var(--shadow-lg)",
          padding: "40px 32px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <img
            src={logoImg}
            alt="SecondBit"
            style={{ height: 44, margin: "0 auto 16px", objectFit: "contain" }}
          />
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>Buat Akun Baru</h1>
          <p style={{ fontSize: 14, color: "var(--muted)", marginTop: 4 }}>
            Gabung dan nikmati kuliner UMKM lokal
          </p>
        </div>

        {/* Role Selector */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            marginBottom: 20,
          }}
        >
          {[
            { value: "buyer" as const, label: "Pembeli", icon: User, desc: "Cari & beli makanan" },
            { value: "seller" as const, label: "Mitra UMKM", icon: Store, desc: "Jual makananmu" },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setRole(opt.value)}
              style={{
                padding: "16px 12px",
                borderRadius: "var(--radius-lg)",
                border: `2px solid ${role === opt.value ? "var(--primary)" : "var(--border)"}`,
                backgroundColor: role === opt.value ? "var(--primary-light)" : "transparent",
                cursor: "pointer",
                textAlign: "center",
                transition: "all var(--transition-fast)",
              }}
            >
              <opt.icon
                size={24}
                style={{
                  color: role === opt.value ? "var(--primary)" : "var(--muted)",
                  margin: "0 auto 6px",
                }}
              />
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: role === opt.value ? "var(--primary)" : "var(--foreground)",
                }}
              >
                {opt.label}
              </div>
              <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>
                {opt.desc}
              </div>
            </button>
          ))}
        </div>

        {/* Value Proposition Box for UMKM */}
        {role === "seller" && (
          <div
            style={{
              backgroundColor: "rgba(238, 77, 45, 0.07)",
              border: "1px solid rgba(238, 77, 45, 0.2)",
              borderRadius: "var(--radius-lg)",
              padding: "14px 16px",
              marginBottom: 20,
              fontSize: 12.5,
              color: "var(--foreground)",
            }}
          >
            <div
              style={{
                fontWeight: 800,
                color: "var(--primary)",
                marginBottom: 6,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Sparkles size={14} /> Keuntungan Mitra UMKM SecondBit:
            </div>
            <ul style={{ margin: 0, paddingLeft: 18, color: "var(--foreground-secondary)", lineHeight: 1.6 }}>
              <li><strong>Rp 0 Biaya Pendaftaran:</strong> 100% Gratis tanpa biaya langganan bulanan.</li>
              <li><strong>Balikkan Modal Sisa:</strong> Tambahan omzet ±Rp 1,5–2 Juta/bln dari makanan yang biasanya terbuang.</li>
              <li><strong>Margin Terlindungi:</strong> Kuota fair maks 2 porsi/user & proteksi bundling menu reguler.</li>
              <li><strong>Pendampingan Tim Duta:</strong> Tim mahasiswa siap datang bantu foto menu & setup toko langsung di lokasi!</li>
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>
              {role === "seller" ? "Nama Pemilik / Pengelola" : "Nama Lengkap"}
            </label>
            <div style={{ position: "relative" }}>
              <User
                size={18}
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--muted-light)",
                }}
              />
              <input
                className="input"
                type="text"
                placeholder={role === "seller" ? "Cth: Ibu Siti Aminah" : "Masukkan nama lengkap"}
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ paddingLeft: 42 }}
                required
              />
            </div>
          </div>

          {/* Extra input for UMKM Shop Name */}
          {role === "seller" && (
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>
                Nama Warung / Usaha Kuliner
              </label>
              <div style={{ position: "relative" }}>
                <Store
                  size={18}
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--muted-light)",
                  }}
                />
                <input
                  className="input"
                  type="text"
                  placeholder="Cth: Warung Bu Siti Ketintang"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  style={{ paddingLeft: 42 }}
                  required
                />
              </div>
            </div>
          )}

          {/* Extra input for WhatsApp */}
          {role === "seller" && (
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>
                Nomor WhatsApp Aktif (Untuk Notifikasi Pesanan)
              </label>
              <div style={{ position: "relative" }}>
                <Phone
                  size={18}
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--muted-light)",
                  }}
                />
                <input
                  className="input"
                  type="tel"
                  placeholder="Cth: 081234567890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ paddingLeft: 42 }}
                  required
                />
              </div>
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>
              Email
            </label>
            <div style={{ position: "relative" }}>
              <Mail
                size={18}
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--muted-light)",
                }}
              />
              <input
                className="input"
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: 42 }}
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <Lock
                size={18}
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--muted-light)",
                }}
              />
              <input
                className="input"
                type={showPassword ? "text" : "password"}
                placeholder="Minimal 8 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: 42, paddingRight: 42 }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "var(--muted)",
                  padding: 4,
                  cursor: "pointer",
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button className="btn btn-primary btn-lg" type="submit" style={{ width: "100%" }}>
            Daftar Sekarang
          </button>
        </form>

        <div
          style={{
            textAlign: "center",
            marginTop: 24,
            fontSize: 14,
            color: "var(--muted)",
          }}
        >
          Sudah punya akun?{" "}
          <Link to="/login" style={{ color: "var(--primary)", fontWeight: 600 }}>
            Masuk
          </Link>
        </div>
      </div>
    </main>
  );
}

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  MapPin,
  ChevronDown,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import logoImg from "@/assets/images/logo.jpg";
import { showSecondBitIntroModal } from "@/utils/showSecondBitIntroModal";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Show intro modal on first visit
  useEffect(() => {
    const timer = setTimeout(() => {
      showSecondBitIntroModal(false);
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  const [auth, setAuth] = useState<{ role?: string; name?: string; isLoggedIn?: boolean } | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("secondbit-auth");
      if (stored) {
        setAuth(JSON.parse(stored));
      } else {
        setAuth(null);
      }
    } catch {
      setAuth(null);
    }
  }, [location]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { label: "Beranda", path: "/" },
    { label: "Jelajahi", path: "/explore" },
    { label: "Flash Deal", path: "/flash-deals" },
    { label: "Hidden Gem", path: "/hidden-gem" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header
        className="navbar"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 200,
          backgroundColor: isScrolled
            ? (theme === "dark" ? "rgba(18,18,18,0.97)" : "rgba(255,255,255,0.97)")
            : (theme === "dark" ? "var(--background)" : "#fff"),
          backdropFilter: isScrolled ? "blur(10px)" : "none",
          boxShadow: isScrolled ? "var(--shadow-sm)" : "none",
          transition: "all var(--transition-normal)",
        }}
      >
        {/* Top Bar with Tagline & Intro Trigger */}
        <div
          style={{
            background: "linear-gradient(90deg, #EE4D2D 0%, #D73211 100%)",
            color: "#fff",
            fontSize: 12,
            padding: "6px 0",
            fontWeight: 500,
          }}
        >
          <div
            className="container"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            {/* Tagline */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span
                style={{
                  backgroundColor: "rgba(255,255,255,0.22)",
                  padding: "2px 8px",
                  borderRadius: "var(--radius-full)",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.4px",
                }}
              >
                🌱 FOOD RESCUE & UMKM
              </span>
              <span style={{ fontSize: 12, fontWeight: 500, opacity: 0.95 }}>
                Selamatkan Makanan Lezat, Hemat Budget, Dukung UMKM Lokal!
              </span>
            </div>

            {/* Right section: Location + Apa itu SecondBit Button */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4, opacity: 0.9 }}>
                <MapPin size={13} />
                <span>UNESA Ketintang, Surabaya</span>
              </div>
              <button
                type="button"
                onClick={() => showSecondBitIntroModal(true)}
                style={{
                  backgroundColor: "#ffffff",
                  color: "var(--primary)",
                  border: "none",
                  borderRadius: "var(--radius-full)",
                  padding: "3px 12px",
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                  transition: "transform 150ms ease",
                }}
                onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
                onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                title="Pelajari apa itu SecondBit"
              >
                <span>✨</span>
                <span>Apa itu SecondBit?</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Nav */}
        <div className="container">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
              padding: "12px 0",
            }}
          >
            {/* Logo + Tagline */}
            <Link
              to="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                flexShrink: 0,
                textDecoration: "none",
              }}
            >
              <img
                src={logoImg}
                alt="SecondBit"
                style={{
                  height: 38,
                  width: "auto",
                  objectFit: "contain",
                }}
              />
              <div
                style={{
                  display: "none",
                  flexDirection: "column",
                  lineHeight: 1.2,
                }}
                className="logo-sub-tagline"
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: "var(--primary)",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                  }}
                >
                  Food Rescue & UMKM
                </span>
                <span
                  style={{
                    fontSize: 11,
                    color: "var(--muted)",
                    fontWeight: 500,
                  }}
                >
                  Ketintang • Surabaya
                </span>
              </div>
            </Link>

            {/* Search Bar - Desktop */}
            <div
              style={{
                flex: 1,
                display: "none",
                position: "relative",
              }}
              className="search-desktop"
            >
              <Search
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
                placeholder="Cari makanan, UMKM, atau kategori..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  paddingLeft: 42,
                  borderRadius: "var(--radius-full)",
                  backgroundColor: "var(--surface)",
                  border: "none",
                }}
              />
            </div>

            {/* Nav Links - Desktop */}
            <nav
              style={{ display: "none", gap: 4 }}
              className="nav-desktop"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  style={{
                    padding: "8px 14px",
                    fontSize: 14,
                    fontWeight: isActive(link.path) ? 600 : 500,
                    color: isActive(link.path)
                      ? "var(--primary)"
                      : "var(--foreground)",
                    borderRadius: "var(--radius-md)",
                    transition: "all var(--transition-fast)",
                    whiteSpace: "nowrap",
                    backgroundColor: isActive(link.path)
                      ? "var(--primary-light)"
                      : "transparent",
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                marginLeft: "auto",
              }}
            >
              {/* Theme Toggle */}
              <button
                className="btn btn-icon btn-ghost"
                onClick={toggleTheme}
                aria-label="Toggle theme"
                title={theme === "dark" ? "Light Mode" : "Dark Mode"}
                style={{
                  display: "flex",
                  width: 36,
                  height: 36,
                  borderRadius: "var(--radius-full)",
                  transition: "all var(--transition-fast)",
                }}
              >
                {theme === "dark" ? (
                  <Sun size={19} style={{ color: "var(--warning)" }} />
                ) : (
                  <Moon size={19} style={{ color: "var(--muted)" }} />
                )}
              </button>

              {/* Search icon - Mobile */}
              <Link
                to="/explore"
                className="btn btn-icon btn-ghost mobile-only"
                style={{ display: "flex" }}
              >
                <Search size={20} />
              </Link>
              <Link to="/buyer" className="btn btn-icon btn-ghost" aria-label="Cart">
                <ShoppingCart size={20} />
              </Link>
              {auth?.isLoggedIn ? (
                <Link
                  to={auth.role === "seller" ? "/seller" : auth.role === "admin" ? "/admin" : "/buyer"}
                  className="btn btn-primary btn-sm desktop-only"
                  style={{ gap: 6 }}
                >
                  <User size={15} />
                  <span>Dashboard {auth.role === "seller" ? "UMKM" : auth.role === "admin" ? "Admin" : "Saya"}</span>
                </Link>
              ) : (
                <Link to="/login" className="btn btn-primary btn-sm desktop-only">
                  <User size={16} />
                  Masuk
                </Link>
              )}
              <button
                className="btn btn-icon btn-ghost mobile-only"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Menu"
                style={{ display: "flex" }}
              >
                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              backgroundColor: "var(--background)",
              boxShadow: "var(--shadow-lg)",
              padding: "16px",
              animation: "fadeIn 0.2s ease",
              zIndex: 100,
            }}
          >
            {/* Mobile Search */}
            <div style={{ position: "relative", marginBottom: 16 }}>
              <Search
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
                placeholder="Cari makanan, UMKM..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  paddingLeft: 42,
                  borderRadius: "var(--radius-full)",
                  backgroundColor: "var(--surface)",
                  border: "none",
                }}
              />
            </div>
            <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  style={{
                    padding: "12px 16px",
                    fontSize: 15,
                    fontWeight: isActive(link.path) ? 600 : 400,
                    color: isActive(link.path)
                      ? "var(--primary)"
                      : "var(--foreground)",
                    borderRadius: "var(--radius-md)",
                    backgroundColor: isActive(link.path)
                      ? "var(--primary-light)"
                      : "transparent",
                  }}
                >
                  {link.label}
                </Link>
              ))}
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  showSecondBitIntroModal(true);
                }}
                style={{
                  padding: "12px 16px",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#EE4D2D",
                  backgroundColor: "var(--primary-light)",
                  borderRadius: "var(--radius-md)",
                  border: "none",
                  textAlign: "left",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginTop: 4,
                }}
              >
                <span>✨</span>
                <span>Apa itu SecondBit? (Info Platform)</span>
              </button>
              <hr
                style={{
                  border: "none",
                  borderTop: "1px solid var(--border-light)",
                  margin: "8px 0",
                }}
              />
              {auth?.isLoggedIn ? (
                <Link
                  to={auth.role === "seller" ? "/seller" : auth.role === "admin" ? "/admin" : "/buyer"}
                  style={{
                    padding: "12px 16px",
                    fontSize: 15,
                    fontWeight: 600,
                    color: "var(--primary)",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <User size={16} />
                  Dashboard {auth.role === "seller" ? "Mitra UMKM" : auth.role === "admin" ? "Admin" : "Pembeli"}
                </Link>
              ) : (
                <Link
                  to="/login"
                  style={{
                    padding: "12px 16px",
                    fontSize: 15,
                    fontWeight: 500,
                    color: "var(--primary)",
                  }}
                >
                  Masuk / Daftar
                </Link>
              )}
            </nav>
          </div>
        )}
      </header>

      <style>{`
        @media (min-width: 640px) {
          .logo-sub-tagline { display: flex !important; }
        }
        @media (min-width: 768px) {
          .search-desktop { display: flex !important; }
          .mobile-only { display: none !important; }
        }
        @media (min-width: 1024px) {
          .nav-desktop { display: flex !important; }
        }
        @media (max-width: 767px) {
          .desktop-only { display: none !important; }
        }
      `}</style>
    </>
  );
}

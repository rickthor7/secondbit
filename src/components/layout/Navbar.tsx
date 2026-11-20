import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  const [isTopBannerVisible, setIsTopBannerVisible] = useState(() => {
    try {
      return sessionStorage.getItem("secondbit-hide-top-banner") !== "true";
    } catch {
      return true;
    }
  });
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleCloseTopBanner = () => {
    setIsTopBannerVisible(false);
    try {
      sessionStorage.setItem("secondbit-hide-top-banner", "true");
    } catch {
      // ignore
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

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
        {/* Top Notification Bar with Close Button */}
        {isTopBannerVisible && (
          <div
            className="top-notification-bar"
            style={{
              background: "linear-gradient(90deg, #EE4D2D 0%, #D73211 100%)",
              color: "#fff",
              position: "relative",
              zIndex: 205,
              transition: "all var(--transition-fast)",
            }}
          >
            <div
              className="container"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
              }}
            >
              {/* Left / Main text */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  minWidth: 0,
                  flex: 1,
                  overflow: "hidden",
                }}
              >
                <span
                  className="top-bar-badge"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.24)",
                    borderRadius: "var(--radius-full)",
                    fontWeight: 800,
                    letterSpacing: "0.4px",
                    flexShrink: 0,
                  }}
                >
                  🌱 FOOD RESCUE
                </span>

                {/* Desktop text */}
                <span
                  className="top-bar-text-desktop"
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    opacity: 0.95,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  Selamatkan Makanan Lezat, Hemat Budget, Dukung UMKM Sekitar UNESA Ketintang!
                </span>

                {/* Mobile text (short & compact) */}
                <span
                  className="top-bar-text-mobile"
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    opacity: 0.95,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  Diskon s/d 70% di Ketintang!
                </span>
              </div>

              {/* Right actions: Location + Info trigger + Close Button */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  flexShrink: 0,
                }}
              >
                <div
                  className="top-bar-location"
                  style={{
                    alignItems: "center",
                    gap: 4,
                    opacity: 0.9,
                    fontSize: 11.5,
                  }}
                >
                  <MapPin size={12} />
                  <span>UNESA Ketintang</span>
                </div>

                <button
                  type="button"
                  onClick={() => showSecondBitIntroModal(true)}
                  className="top-bar-btn-info"
                  style={{
                    backgroundColor: "#ffffff",
                    color: "var(--primary)",
                    border: "none",
                    borderRadius: "var(--radius-full)",
                    padding: "2px 10px",
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: "pointer",
                    alignItems: "center",
                    gap: 3,
                    boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
                    transition: "transform 150ms ease",
                    whiteSpace: "nowrap",
                  }}
                  title="Pelajari apa itu SecondBit"
                >
                  <span>✨ Info</span>
                </button>

                {/* Close Button X */}
                <button
                  type="button"
                  onClick={handleCloseTopBanner}
                  aria-label="Tutup notifikasi"
                  title="Tutup notifikasi"
                  style={{
                    background: "rgba(0, 0, 0, 0.2)",
                    border: "none",
                    color: "#ffffff",
                    width: 20,
                    height: 20,
                    borderRadius: "var(--radius-full)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    padding: 0,
                    transition: "background 150ms ease, transform 150ms ease",
                    flexShrink: 0,
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.4)")}
                  onMouseOut={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.2)")}
                >
                  <X size={12} strokeWidth={2.8} />
                </button>
              </div>
            </div>
          </div>
        )}

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
            <form
              onSubmit={handleSearchSubmit}
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
                  pointerEvents: "none",
                }}
              />
              <input
                className="input"
                type="text"
                placeholder="Cari nasi pecel, bakso, geprek, atau warung sekitar UNESA..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  paddingLeft: 42,
                  paddingRight: 40,
                  borderRadius: "var(--radius-full)",
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                  fontSize: 13,
                  transition: "all var(--transition-fast)",
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "var(--muted)",
                    cursor: "pointer",
                    padding: 4,
                  }}
                >
                  <X size={14} />
                </button>
              )}
            </form>

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
                    fontWeight: isActive(link.path) ? 700 : 500,
                    color: isActive(link.path)
                      ? "var(--primary)"
                      : "var(--foreground)",
                    borderRadius: "var(--radius-full)",
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
                gap: 6,
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

              {/* Shopping Cart with dynamic badge */}
              <Link
                to="/buyer"
                className="btn btn-icon btn-ghost"
                aria-label="Cart"
                style={{ position: "relative" }}
                title="Keranjang & Pesanan Aktif"
              >
                <ShoppingCart size={20} />
                <span
                  style={{
                    position: "absolute",
                    top: 2,
                    right: 2,
                    backgroundColor: "var(--primary)",
                    color: "#fff",
                    fontSize: 10,
                    fontWeight: 700,
                    width: 16,
                    height: 16,
                    borderRadius: "var(--radius-full)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 2px 4px rgba(238, 77, 45, 0.4)",
                  }}
                >
                  2
                </span>
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
            <form onSubmit={handleSearchSubmit} style={{ position: "relative", marginBottom: 16 }}>
              <Search
                size={18}
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--muted-light)",
                  pointerEvents: "none",
                }}
              />
              <input
                className="input"
                type="text"
                placeholder="Cari makanan atau UMKM..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  paddingLeft: 42,
                  borderRadius: "var(--radius-full)",
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                }}
              />
            </form>
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
        .top-notification-bar {
          padding: 6px 0;
        }
        .top-bar-badge {
          padding: 2px 8px;
          font-size: 11px;
        }
        .top-bar-text-desktop { display: inline !important; }
        .top-bar-text-mobile { display: none !important; }
        .top-bar-location { display: flex !important; }
        .top-bar-btn-info { display: inline-flex !important; }

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
          .top-notification-bar {
            padding: 4px 0 !important;
          }
          .top-bar-badge {
            padding: 1px 6px !important;
            font-size: 9.5px !important;
          }
          .top-bar-text-desktop { display: none !important; }
          .top-bar-text-mobile { display: inline !important; }
          .top-bar-location { display: none !important; }
          .top-bar-btn-info { display: none !important; }
        }
      `}</style>
    </>
  );
}

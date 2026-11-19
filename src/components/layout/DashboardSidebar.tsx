import { Link, useLocation, useNavigate } from "react-router-dom";
import type { CSSProperties } from "react";
import { LogOut, Moon, Sun, X, ArrowLeft } from "lucide-react";
import Swal from "sweetalert2";
import { useTheme } from "@/hooks/useTheme";
import logoImg from "@/assets/images/logo.jpg";
import type { DashboardRoleConfig } from "@/config/dashboardConfig";

interface DashboardSidebarProps {
  config: DashboardRoleConfig;
  open: boolean;
  onClose: () => void;
}

export default function DashboardSidebar({ config, open, onClose }: DashboardSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const palette = config.sidebar;

  const handleLogout = async () => {
    const result = await Swal.fire({
      icon: "question",
      title: "Keluar dari akun?",
      text: `Kamu akan keluar dari ${config.user.name}.`,
      showCancelButton: true,
      confirmButtonText: "Ya, keluar",
      cancelButtonText: "Batal",
      confirmButtonColor: "#EE4D2D",
      cancelButtonColor: "#757575",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      localStorage.removeItem("secondbit-auth");
      navigate("/login");
    }
  };

  const linkStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "9px 10px",
    borderRadius: "var(--radius-md)",
    color: palette.muted,
    fontSize: 12,
    fontWeight: 500,
    textDecoration: "none",
    border: "none",
    backgroundColor: "transparent",
    textAlign: "left",
    width: "100%",
    cursor: "pointer",
  };

  return (
    <aside
      className="dash-sidebar"
      data-open={open ? "true" : "false"}
      style={{
        backgroundColor: palette.background,
        color: palette.text,
        borderRight: `1px solid ${palette.border}`,
      }}
      aria-label={`Navigasi ${config.roleLabel}`}
    >
      {/* Brand */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "16px 16px 14px",
          borderBottom: `1px solid ${palette.border}`,
        }}
      >
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
          <img src={logoImg} alt="SecondBit" style={{ height: 26, width: "auto", borderRadius: 6 }} />
        </Link>

        <span
          style={{
            fontSize: 8.5,
            fontWeight: 700,
            letterSpacing: "0.35px",
            textTransform: "uppercase",
            padding: "3px 6px",
            borderRadius: "var(--radius-full)",
            backgroundColor: palette.activeBackground,
            color: palette.activeText,
            whiteSpace: "nowrap",
          }}
        >
          {config.roleLabel}
        </span>

        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup menu"
          className="dash-sidebar-close"
          style={{
            marginLeft: "auto",
            display: "none",
            alignItems: "center",
            justifyContent: "center",
            width: 30,
            height: 30,
            borderRadius: "var(--radius-md)",
            border: "none",
            backgroundColor: "transparent",
            color: palette.text,
          }}
        >
          <X size={18} />
        </button>
      </div>

      {/* Profil */}
      <div
        style={{
          margin: "14px 12px 6px",
          padding: "12px",
          borderRadius: "var(--radius-lg)",
          backgroundColor: palette.cardBackground,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 38,
            height: 38,
            flexShrink: 0,
            borderRadius: "var(--radius-md)",
            backgroundColor: palette.activeBackground,
            color: palette.activeText,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 15,
            fontWeight: 800,
          }}
        >
          {config.user.avatar}
        </div>
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {config.user.name}
          </div>
          <div
            style={{
              fontSize: 11,
              color: palette.muted,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {config.user.meta}
          </div>
        </div>
      </div>

      {/* Navigasi — setiap item adalah halaman sendiri */}
      <nav style={{ flex: 1, overflowY: "auto", padding: "8px 12px 12px" }}>
        {config.nav.map((group) => (
          <div key={group.label} style={{ marginTop: 10 }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.8px",
                textTransform: "uppercase",
                color: palette.muted,
                padding: "0 10px 6px",
              }}
            >
              {group.label}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {group.items.map((item) => {
                const Icon = item.icon;
                const itemActive = location.pathname === item.target;

                return (
                  <Link
                    key={item.id}
                    to={item.target}
                    onClick={onClose}
                    aria-current={itemActive ? "page" : undefined}
                    style={{
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "9px 10px 9px 12px",
                      borderRadius: "var(--radius-md)",
                      color: itemActive ? palette.activeText : palette.text,
                      backgroundColor: itemActive ? palette.activeBackground : "transparent",
                      textDecoration: "none",
                      width: "100%",
                      transition: "background var(--transition-fast), color var(--transition-fast)",
                    }}
                  >
                    <span
                      aria-hidden
                      style={{
                        position: "absolute",
                        left: 0,
                        top: 8,
                        bottom: 8,
                        width: 3,
                        borderRadius: "var(--radius-full)",
                        backgroundColor: itemActive ? palette.activeText : "transparent",
                      }}
                    />
                    <Icon size={17} strokeWidth={itemActive ? 2.4 : 1.9} />
                    <span style={{ fontSize: 13, fontWeight: itemActive ? 600 : 500 }}>
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div
        style={{
          padding: "12px",
          borderTop: `1px solid ${palette.border}`,
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <Link to="/" style={linkStyle}>
          <ArrowLeft size={15} />
          Kembali ke Marketplace
        </Link>

        <button type="button" onClick={toggleTheme} style={linkStyle}>
          {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          {theme === "dark" ? "Mode Terang" : "Mode Gelap"}
        </button>

        <button type="button" onClick={handleLogout} style={linkStyle}>
          <LogOut size={15} />
          Keluar
        </button>
      </div>
    </aside>
  );
}

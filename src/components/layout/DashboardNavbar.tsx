import { Link } from "react-router-dom";
import { Bell, Moon, Sun, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import Swal from "sweetalert2";
import { useTheme } from "@/hooks/useTheme";
import type { DashboardRoleConfig } from "@/config/dashboardConfig";

interface DashboardNavbarProps {
  config: DashboardRoleConfig;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export default function DashboardNavbar({
  config,
  isSidebarOpen,
  onToggleSidebar,
}: DashboardNavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const palette = config.navbar;

  const showNotifications = () => {
    const list = config.notificationItems
      .map(
        (item) =>
          `<li style="display:flex;gap:8px;align-items:flex-start;text-align:left;font-size:13px;line-height:1.5;color:#444;margin-bottom:10px;">
             <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:${config.accent};margin-top:7px;flex-shrink:0;"></span>
             <span>${item}</span>
           </li>`
      )
      .join("");

    Swal.fire({
      title: "Notifikasi",
      html: `<ul style="margin:0;padding:0;list-style:none;">${list}</ul>`,
      confirmButtonText: "Tutup",
      confirmButtonColor: "#EE4D2D",
    });
  };

  const QuickIcon = config.quickAction.icon;

  return (
    <header
      className="dash-navbar"
      style={{
        backgroundColor: palette.background,
        color: palette.text,
        borderBottom: `1px solid ${palette.border}`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 16px",
          minHeight: 62,
        }}
      >
        <button
          type="button"
          onClick={onToggleSidebar}
          className="dash-menu-btn"
          aria-label={isSidebarOpen ? "Sembunyikan sidebar (Ctrl+B)" : "Tampilkan sidebar (Ctrl+B)"}
          title={isSidebarOpen ? "Sembunyikan sidebar (Ctrl+B)" : "Tampilkan sidebar (Ctrl+B)"}
          style={{
            width: 36,
            height: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "var(--radius-md)",
            border: `1px solid ${palette.border}`,
            backgroundColor: "transparent",
            color: palette.text,
            flexShrink: 0,
            cursor: "pointer",
            transition: "all var(--transition-fast)",
          }}
        >
          {isSidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
        </button>

        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: 9.5,
              fontWeight: 700,
              letterSpacing: "0.9px",
              textTransform: "uppercase",
              color: palette.muted,
              lineHeight: 1.2,
            }}
          >
            {config.kicker}
          </div>
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: "-0.2px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {config.title}
          </div>
        </div>

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4 }}>
          <Link
            to={config.quickAction.target}
            className="dash-quick-action"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 12px",
              borderRadius: "var(--radius-full)",
              backgroundColor: config.accent,
              color: config.roleLabel === "Administrator" ? "#0F1B33" : "#fff",
              fontSize: 12,
              fontWeight: 700,
              whiteSpace: "nowrap",
            }}
          >
            <QuickIcon size={14} />
            <span>{config.quickAction.label}</span>
          </Link>

          <button
            type="button"
            onClick={showNotifications}
            aria-label={`Notifikasi (${config.notifications} baru)`}
            style={{
              position: "relative",
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "var(--radius-md)",
              border: "none",
              backgroundColor: "transparent",
              color: palette.text,
            }}
          >
            <Bell size={18} />
            {config.notifications > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  minWidth: 16,
                  height: 16,
                  padding: "0 4px",
                  borderRadius: "var(--radius-full)",
                  backgroundColor: "#EE4D2D",
                  color: "#fff",
                  fontSize: 9.5,
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  lineHeight: 1,
                }}
              >
                {config.notifications}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Ganti tema"
            title={theme === "dark" ? "Mode Terang" : "Mode Gelap"}
            style={{
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "var(--radius-md)",
              border: "none",
              backgroundColor: "transparent",
              color: palette.text,
            }}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <Link
            to={config.home}
            aria-label={`Profil ${config.user.name}`}
            style={{
              width: 34,
              height: 34,
              marginLeft: 4,
              borderRadius: "var(--radius-full)",
              backgroundColor: config.accent,
              color: config.roleLabel === "Administrator" ? "#0F1B33" : "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 800,
              flexShrink: 0,
            }}
          >
            {config.user.avatar}
          </Link>
        </div>
      </div>

      {/* Garis aksen identitas role */}
      <div
        aria-hidden
        style={{
          height: 2,
          background:
            config.roleLabel === "Mitra UMKM"
              ? "linear-gradient(90deg, #EE4D2D 0%, #FF9C82 55%, transparent 100%)"
              : config.roleLabel === "Administrator"
              ? "linear-gradient(90deg, #7FB2FF 0%, #4C7FD1 55%, transparent 100%)"
              : "linear-gradient(90deg, #EE4D2D 0%, #FFAA00 55%, transparent 100%)",
        }}
      />
    </header>
  );
}

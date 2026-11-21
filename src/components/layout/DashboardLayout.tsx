import { useEffect, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import DashboardNavbar from "@/components/layout/DashboardNavbar";
import DashboardBottomNav from "@/components/layout/DashboardBottomNav";
import { dashboardConfig, type DashboardRole } from "@/config/dashboardConfig";

interface DashboardLayoutProps {
  role: DashboardRole;
  children: ReactNode;
}

export default function DashboardLayout({ role, children }: DashboardLayoutProps) {
  const config = dashboardConfig[role];
  const location = useLocation();

  // Desktop sidebar: default open, remembered in localStorage
  const [desktopOpen, setDesktopOpen] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("secondbit_sidebar_desktop");
      if (saved !== null) return saved === "true";
      return window.innerWidth >= 1024;
    }
    return true;
  });

  // Mobile drawer: closed by default
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  // Keyboard shortcut Ctrl+B or Cmd+B to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const isDesktop = () => typeof window !== "undefined" && window.innerWidth >= 1024;

  const toggleSidebar = () => {
    if (isDesktop()) {
      setDesktopOpen((prev) => {
        const next = !prev;
        localStorage.setItem("secondbit_sidebar_desktop", String(next));
        return next;
      });
    } else {
      setMobileOpen((prev) => !prev);
    }
  };

  const closeSidebar = () => {
    if (isDesktop()) {
      setDesktopOpen(false);
      localStorage.setItem("secondbit_sidebar_desktop", "false");
    } else {
      setMobileOpen(false);
    }
  };

  const isSidebarOpen = isDesktop() ? desktopOpen : mobileOpen;

  return (
    <div className="dash-shell" data-role={role}>
      <DashboardSidebar
        config={config}
        desktopOpen={desktopOpen}
        mobileOpen={mobileOpen}
        onClose={closeSidebar}
      />

      {mobileOpen && (
        <button
          type="button"
          className="dash-overlay"
          aria-label="Tutup menu navigasi"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className="dash-main">
        <DashboardNavbar
          config={config}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={toggleSidebar}
        />

        <div className="dash-content">{children}</div>

        <DashboardBottomNav config={config} onOpenMenu={toggleSidebar} />
      </div>
    </div>
  );
}

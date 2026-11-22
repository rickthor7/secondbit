import { useEffect, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { PanelLeftOpen } from "lucide-react";
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

  // Reactive breakpoint detection (1024px)
  const [isDesktop, setIsDesktop] = useState<boolean>(() => {
    if (typeof window !== "undefined") return window.innerWidth >= 1024;
    return true;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    if (!mobileOpen || isDesktop) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen, isDesktop]);

  const toggleSidebar = () => {
    if (isDesktop) {
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
    if (isDesktop) {
      setDesktopOpen(false);
      localStorage.setItem("secondbit_sidebar_desktop", "false");
    } else {
      setMobileOpen(false);
    }
  };

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
  }, [isDesktop]);

  const isSidebarOpen = isDesktop ? desktopOpen : mobileOpen;

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

      {/* Floating quick restore handle on desktop when sidebar is hidden */}
      {isDesktop && !desktopOpen && (
        <button
          type="button"
          onClick={toggleSidebar}
          className="dash-quick-restore-btn"
          aria-label="Tampilkan sidebar (Ctrl+B)"
          title="Tampilkan sidebar (Ctrl+B)"
        >
          <PanelLeftOpen size={15} />
          <span>Buka Menu</span>
        </button>
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

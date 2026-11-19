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
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Tutup drawer setiap kali pindah halaman.
  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  // Kunci scroll halaman saat drawer mobile terbuka.
  useEffect(() => {
    if (!drawerOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [drawerOpen]);

  return (
    <div className="dash-shell" data-role={role}>
      <DashboardSidebar config={config} open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {drawerOpen && (
        <button
          type="button"
          className="dash-overlay"
          aria-label="Tutup menu"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      <div className="dash-main">
        <DashboardNavbar config={config} onOpenMenu={() => setDrawerOpen(true)} />

        <div className="dash-content">{children}</div>

        <DashboardBottomNav config={config} onOpenMenu={() => setDrawerOpen(true)} />
      </div>
    </div>
  );
}

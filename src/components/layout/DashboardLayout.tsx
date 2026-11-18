import { useEffect, useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import DashboardNavbar from "@/components/layout/DashboardNavbar";
import DashboardBottomNav from "@/components/layout/DashboardBottomNav";
import {
  dashboardConfig,
  type DashboardNavItem,
  type DashboardRole,
} from "@/config/dashboardConfig";

interface DashboardLayoutProps {
  role: DashboardRole;
  children: ReactNode;
}

export default function DashboardLayout({ role, children }: DashboardLayoutProps) {
  const config = dashboardConfig[role];
  const location = useLocation();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [active, setActive] = useState(config.nav[0].items[0].id);

  const sectionIds = config.nav
    .flatMap((group) => group.items)
    .filter((item) => item.target.startsWith("#"))
    .map((item) => item.target.slice(1));

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

  // Scroll spy sederhana: menu aktif mengikuti posisi baca.
  useEffect(() => {
    if (sectionIds.length === 0) return;

    const handleScroll = () => {
      const atBottom =
        window.scrollY > 0 &&
        window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 200;

      let current = sectionIds[0];

      if (atBottom) {
        // Section terakhir tidak akan pernah menyentuh ambang atas, jadi aktifkan
        // saat halaman sudah mencapai dasar.
        current = sectionIds[sectionIds.length - 1];
      } else {
        sectionIds.forEach((id) => {
          const element = document.getElementById(id);
          if (element && element.getBoundingClientRect().top <= 150) {
            current = id;
          }
        });
      }

      setActive(current);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  const handleSelect = (item: DashboardNavItem) => {
    if (item.target.startsWith("/")) {
      navigate(item.target);
      return;
    }

    const element = document.getElementById(item.target.slice(1));
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setActive(item.id);
    }
  };

  return (
    <div className="dash-shell" data-role={role}>
      <DashboardSidebar
        config={config}
        active={active}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSelect={handleSelect}
      />

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

        <DashboardBottomNav
          config={config}
          active={active}
          onSelect={handleSelect}
          onOpenMenu={() => setDrawerOpen(true)}
        />
      </div>
    </div>
  );
}

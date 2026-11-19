import { Link, useLocation } from "react-router-dom";
import { LayoutGrid } from "lucide-react";
import type { DashboardRoleConfig } from "@/config/dashboardConfig";

interface DashboardBottomNavProps {
  config: DashboardRoleConfig;
  onOpenMenu: () => void;
}

export default function DashboardBottomNav({
  config,
  onOpenMenu,
}: DashboardBottomNavProps) {
  const location = useLocation();
  const items = config.nav[0].items.slice(0, 3);

  return (
    <nav
      className="dash-bottom-nav"
      aria-label={`Navigasi cepat ${config.roleLabel}`}
      style={{
        backgroundColor: "var(--background)",
        borderTop: "1px solid var(--border)",
      }}
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.target;

        return (
          <Link
            key={item.id}
            to={item.target}
            className={`bottom-nav-item ${isActive ? "active" : ""}`}
            aria-current={isActive ? "page" : undefined}
          >
            <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
            <span>{item.label.split(" ")[0]}</span>
          </Link>
        );
      })}

      <button type="button" onClick={onOpenMenu} className="bottom-nav-item">
        <LayoutGrid size={22} strokeWidth={1.8} />
        <span>Menu</span>
      </button>
    </nav>
  );
}

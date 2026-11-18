import { LayoutGrid } from "lucide-react";
import type { DashboardNavItem, DashboardRoleConfig } from "@/config/dashboardConfig";

interface DashboardBottomNavProps {
  config: DashboardRoleConfig;
  active: string;
  onSelect: (item: DashboardNavItem) => void;
  onOpenMenu: () => void;
}

export default function DashboardBottomNav({
  config,
  active,
  onSelect,
  onOpenMenu,
}: DashboardBottomNavProps) {
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
        const isActive = active === item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item)}
            className={`bottom-nav-item ${isActive ? "active" : ""}`}
            aria-current={isActive ? "true" : undefined}
          >
            <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
            <span>{item.label.split(" ")[0]}</span>
          </button>
        );
      })}

      <button type="button" onClick={onOpenMenu} className="bottom-nav-item">
        <LayoutGrid size={22} strokeWidth={1.8} />
        <span>Menu</span>
      </button>
    </nav>
  );
}

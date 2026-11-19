import { Download, Info } from "lucide-react";
import Swal from "sweetalert2";
import PageHeader from "@/components/dashboard/PageHeader";
import StatCard from "@/components/dashboard/StatCard";
import Panel from "@/components/dashboard/Panel";
import DataTable, { type DataColumn } from "@/components/dashboard/DataTable";
import StatusPill from "@/components/dashboard/StatusPill";
import { adminModules, type AdminModuleKey, type ModuleRow } from "@/data/adminModules";

interface AdminModulePageProps {
  moduleKey: AdminModuleKey;
}

export default function AdminModulePage({ moduleKey }: AdminModulePageProps) {
  const config = adminModules[moduleKey];

  const columns: DataColumn<ModuleRow>[] = config.columns.map((column, index) => ({
    key: `col-${index}`,
    header: column.header,
    align: column.align,
    render: (row) => {
      const cell = row.cells[index] ?? { text: "—" };

      if (cell.tone) {
        return <StatusPill label={cell.text} tone={cell.tone} />;
      }

      return (
        <div>
          <div
            style={{
              fontSize: 13,
              fontWeight: cell.strong ? 600 : 400,
              color: cell.strong ? "var(--foreground)" : "var(--foreground-secondary)",
            }}
          >
            {cell.text}
          </div>
          {cell.sub && (
            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 1 }}>{cell.sub}</div>
          )}
        </div>
      );
    },
  }));

  const handleExport = () => {
    Swal.fire({
      icon: "info",
      title: "Ekspor data",
      text: `Ekspor ${config.title} ke CSV akan tersedia setelah endpoint admin terhubung.`,
      confirmButtonText: "Mengerti",
      confirmButtonColor: "#4C7FD1",
    });
  };

  return (
    <main style={{ minHeight: "80vh", backgroundColor: "var(--surface)", paddingBottom: 40 }}>
      <div className="container" style={{ paddingTop: 24 }}>
        <PageHeader
          kicker={config.kicker}
          title={config.title}
          description={config.description}
          actions={
            <button type="button" className="btn btn-outline" onClick={handleExport}>
              <Download size={15} /> Ekspor CSV
            </button>
          }
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: 12,
            marginBottom: 20,
          }}
        >
          {config.stats.map((stat) => (
            <StatCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              hint={stat.hint}
              icon={stat.icon}
              tone={stat.tone}
            />
          ))}
        </div>

        <Panel
          title={config.title}
          description={`${config.rows.length} baris data demo ditampilkan.`}
        >
          <DataTable
            columns={columns}
            rows={config.rows}
            minWidth={720}
            emptyText="Belum ada data untuk modul ini."
          />

          <div
            style={{
              display: "flex",
              gap: 8,
              marginTop: 16,
              paddingTop: 14,
              borderTop: "1px solid var(--border-light)",
              fontSize: 11.5,
              color: "var(--muted)",
              lineHeight: 1.6,
            }}
          >
            <Info size={15} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>
              Data pada panel admin ini masih mock dari `mockData.ts`. Aksi edit, verifikasi, dan
              ekspor akan aktif setelah API backend terhubung.
            </span>
          </div>
        </Panel>
      </div>
    </main>
  );
}

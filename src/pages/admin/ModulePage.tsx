import { useState } from "react";
import { Download, Info, Search, Plus, Filter, MoreHorizontal, Eye, Edit3, Trash2, CheckCircle2, RotateCcw } from "lucide-react";
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
  const [rows, setRows] = useState<ModuleRow[]>(config.rows);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Filter rows by search and status
  const filteredRows = rows.filter((row) => {
    // Search match in any cell text
    const matchesSearch = searchQuery
      ? row.cells.some(
          (c) =>
            c.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (c.sub && c.sub.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      : true;

    // Status filter match (usually cell 2 or cell with tone)
    const statusCell = row.cells.find((c) => c.tone !== undefined);
    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusCell
        ? statusCell.text.toLowerCase().includes(statusFilter.toLowerCase())
        : true;

    return matchesSearch && matchesStatus;
  });

  // Action column definition
  const columns: DataColumn<ModuleRow>[] = [
    ...config.columns.map((column, index) => ({
      key: `col-${index}`,
      header: column.header,
      align: column.align,
      render: (row: ModuleRow) => {
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
    })),
    {
      key: "actions",
      header: "Aksi",
      align: "center",
      render: (row: ModuleRow) => (
        <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
          <button
            type="button"
            onClick={() => handleRowAction(row)}
            className="btn btn-sm btn-ghost"
            style={{ padding: "4px 8px", fontSize: 12, borderRadius: "var(--radius-md)" }}
            title="Kelola data ini"
          >
            <MoreHorizontal size={15} />
          </button>
        </div>
      ),
    },
  ];

  // Handle row actions popup
  const handleRowAction = (row: ModuleRow) => {
    const title = row.cells[0]?.text || "Detail Baris";
    const sub = row.cells[0]?.sub || "";

    Swal.fire({
      title: `${title}`,
      html: `
        <div style="text-align: left; font-size: 13.5px; line-height: 1.8;">
          <p style="color: var(--muted);">${sub}</p>
          <hr style="margin: 8px 0; border: none; border-top: 1px solid var(--border);" />
          ${row.cells
            .map((c, i) => `<p><strong>${config.columns[i]?.header || "Item"}:</strong> ${c.text}</p>`)
            .join("")}
        </div>
      `,
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: "Ubah Status",
      denyButtonText: "Hapus",
      cancelButtonText: "Tutup",
      confirmButtonColor: "var(--primary)",
      denyButtonColor: "var(--destructive)",
    }).then((res) => {
      if (res.isConfirmed) {
        // Toggle status of row
        setRows((prev) =>
          prev.map((r) => {
            if (r.id === row.id) {
              const updatedCells = [...r.cells];
              const toneIndex = updatedCells.findIndex((c) => c.tone !== undefined);
              if (toneIndex !== -1) {
                const current = updatedCells[toneIndex].text;
                const newText = current === "Aktif" ? "Ditangguhkan" : current === "Buka" ? "Tutup" : "Aktif";
                updatedCells[toneIndex] = {
                  ...updatedCells[toneIndex],
                  text: newText,
                  tone: newText === "Aktif" ? "success" : "danger",
                };
              }
              return { ...r, cells: updatedCells };
            }
            return r;
          })
        );

        Swal.fire({
          icon: "success",
          title: "Status Berhasil Diperbarui!",
          timer: 1800,
          confirmButtonColor: "var(--primary)",
        });
      } else if (res.isDenied) {
        // Delete row
        setRows((prev) => prev.filter((r) => r.id !== row.id));
        Swal.fire({
          icon: "info",
          title: "Data Dihapus",
          text: `Item "${title}" telah dihapus dari database dummy.`,
          timer: 1800,
          confirmButtonColor: "var(--primary)",
        });
      }
    });
  };

  // Add new item
  const handleAddNew = () => {
    Swal.fire({
      title: `Tambah ${config.title} Baru`,
      html: `
        <div style="text-align: left; font-size: 13px; display: flex; flex-direction: column; gap: 10px;">
          <label><strong>Nama / Judul:</strong></label>
          <input id="swal-input1" class="swal2-input" placeholder="Masukkan nama..." style="margin: 0; width: 100%;" />
          <label><strong>Keterangan / Kategori:</strong></label>
          <input id="swal-input2" class="swal2-input" placeholder="Masukkan detail..." style="margin: 0; width: 100%;" />
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Simpan Data",
      cancelButtonText: "Batal",
      confirmButtonColor: "var(--primary)",
      preConfirm: () => {
        const in1 = (document.getElementById("swal-input1") as HTMLInputElement)?.value;
        const in2 = (document.getElementById("swal-input2") as HTMLInputElement)?.value;
        if (!in1) {
          Swal.showValidationMessage("Nama wajib diisi!");
          return false;
        }
        return { name: in1, detail: in2 };
      },
    }).then((res) => {
      if (res.isConfirmed && res.value) {
        const newRow: ModuleRow = {
          id: `new-${Date.now()}`,
          cells: [
            { text: res.value.name, sub: res.value.detail || "Baru ditambahkan", strong: true },
            { text: "Reguler" },
            { text: "Aktif", tone: "success" },
            { text: "Hari ini" },
            { text: "0" },
          ],
        };
        setRows([newRow, ...rows]);
        Swal.fire({
          icon: "success",
          title: "Data Berhasil Ditambahkan!",
          timer: 1800,
          confirmButtonColor: "var(--primary)",
        });
      }
    });
  };

  // Export CSV generator
  const handleExport = () => {
    const headers = config.columns.map((c) => `"${c.header}"`).join(",");
    const csvContent = filteredRows
      .map((r) => r.cells.map((c) => `"${c.text.replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([`${headers}\n${csvContent}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${moduleKey}_secondbit_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    Swal.fire({
      icon: "success",
      title: "File CSV Berhasil Diunduh!",
      text: `${filteredRows.length} baris data diekspor ke file CSV.`,
      timer: 2000,
      confirmButtonColor: "var(--primary)",
    });
  };

  return (
    <main style={{ minHeight: "80vh", backgroundColor: "var(--surface)", paddingBottom: 50 }}>
      <div className="container" style={{ paddingTop: 24 }}>
        <PageHeader
          kicker={config.kicker}
          title={config.title}
          description={config.description}
          actions={
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleExport}
                style={{ borderRadius: "var(--radius-full)", gap: 6, fontSize: 13 }}
              >
                <Download size={14} /> Ekspor CSV
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAddNew}
                style={{ borderRadius: "var(--radius-full)", gap: 6, fontSize: 13 }}
              >
                <Plus size={15} /> Tambah Data
              </button>
            </div>
          }
        />

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
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

        {/* Search & Filter Bar */}
        <div
          style={{
            backgroundColor: "var(--background)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-xl)",
            padding: "14px 18px",
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
            boxShadow: "var(--shadow-sm)",
          }}
        >
          {/* Search Box */}
          <div style={{ position: "relative", flex: 1, minWidth: 220, maxWidth: 400 }}>
            <Search
              size={16}
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--muted)",
                pointerEvents: "none",
              }}
            />
            <input
              type="text"
              className="input"
              placeholder={`Cari di ${config.title}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                paddingLeft: 36,
                paddingRight: 12,
                borderRadius: "var(--radius-full)",
                fontSize: 12.5,
              }}
            />
          </div>

          {/* Status Filters */}
          <div className="scroll-x" style={{ gap: 6 }}>
            {["all", "aktif", "buka", "selesai", "ditangguhkan"].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className="btn btn-sm"
                style={{
                  borderRadius: "var(--radius-full)",
                  backgroundColor: statusFilter === status ? "var(--primary)" : "var(--surface)",
                  color: statusFilter === status ? "#fff" : "var(--foreground)",
                  border: "1px solid var(--border)",
                  fontSize: 11.5,
                  padding: "4px 12px",
                  textTransform: "capitalize",
                }}
              >
                {status === "all" ? "Semua Status" : status}
              </button>
            ))}

            {(searchQuery || statusFilter !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                }}
                className="btn btn-sm btn-ghost"
                style={{ fontSize: 11.5, gap: 4, color: "var(--destructive)" }}
              >
                <RotateCcw size={12} />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Panel with DataTable */}
        <Panel
          title={config.title}
          description={`Menampilkan ${filteredRows.length} dari total ${rows.length} entri data.`}
        >
          <DataTable
            columns={columns}
            rows={filteredRows}
            minWidth={720}
            emptyText="Tidak ada data yang cocok dengan pencarian atau filter Anda."
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
            <Info size={15} style={{ flexShrink: 0, marginTop: 1, color: "var(--primary)" }} />
            <span>
              Tabel ini interaktif: gunakan fitur pencarian, filter status, tombol aksi baris untuk
              mengubah status/menghapus, tombol tambah data, serta ekspor ke file CSV langsung.
            </span>
          </div>
        </Panel>
      </div>
    </main>
  );
}

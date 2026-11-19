import type { ReactNode } from "react";

export interface DataColumn<T> {
  key: string;
  header: string;
  align?: "left" | "right" | "center";
  width?: string | number;
  render: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: DataColumn<T>[];
  rows: T[];
  minWidth?: number;
  emptyText?: string;
}

export default function DataTable<T extends { id: string }>({
  columns,
  rows,
  minWidth = 720,
  emptyText = "Belum ada data.",
}: DataTableProps<T>) {
  if (rows.length === 0) {
    return (
      <div
        style={{
          padding: "36px 16px",
          textAlign: "center",
          fontSize: 13,
          color: "var(--muted)",
        }}
      >
        {emptyText}
      </div>
    );
  }

  return (
    <div style={{ overflowX: "auto", margin: "0 -4px" }}>
      <table
        style={{
          width: "100%",
          minWidth,
          borderCollapse: "collapse",
          fontSize: 13,
        }}
      >
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                style={{
                  textAlign: column.align ?? "left",
                  width: column.width,
                  padding: "9px 12px",
                  fontSize: 10.5,
                  fontWeight: 700,
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                  backgroundColor: "var(--surface)",
                  whiteSpace: "nowrap",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              {columns.map((column) => (
                <td
                  key={column.key}
                  style={{
                    textAlign: column.align ?? "left",
                    padding: "12px",
                    borderBottom: "1px solid var(--border-light)",
                    color: "var(--foreground)",
                    verticalAlign: "middle",
                  }}
                >
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

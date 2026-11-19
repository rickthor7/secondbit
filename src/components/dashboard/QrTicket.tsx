interface QrTicketProps {
  code: string;
  size?: number;
  caption?: string;
}

// QR dekoratif deterministik: kode yang sama selalu menghasilkan pola yang sama.
// Bukan QR asli yang bisa dipindai — hanya representasi visual untuk demo.
function buildMatrix(code: string, size = 15): boolean[][] {
  let state = 2166136261;
  for (let i = 0; i < code.length; i += 1) {
    state ^= code.charCodeAt(i);
    state = Math.imul(state, 16777619) >>> 0;
  }

  const random = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };

  const grid = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => random() > 0.52)
  );

  const drawFinder = (top: number, left: number) => {
    for (let r = 0; r < 7; r += 1) {
      for (let c = 0; c < 7; c += 1) {
        const edge = r === 0 || r === 6 || c === 0 || c === 6;
        const core = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        grid[top + r][left + c] = edge || core;
      }
    }
  };

  drawFinder(0, 0);
  drawFinder(0, size - 7);
  drawFinder(size - 7, 0);

  return grid;
}

export default function QrTicket({ code, size = 168, caption }: QrTicketProps) {
  const matrix = buildMatrix(code);
  const dimension = matrix.length;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <div
        style={{
          width: size,
          height: size,
          padding: 10,
          borderRadius: "var(--radius-md)",
          backgroundColor: "#FFFFFF",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-sm)",
          display: "grid",
          gridTemplateColumns: `repeat(${dimension}, 1fr)`,
          gridTemplateRows: `repeat(${dimension}, 1fr)`,
          gap: 1,
        }}
        aria-label={`Kode pickup ${code}`}
        role="img"
      >
        {matrix.flatMap((row, rowIndex) =>
          row.map((filled, columnIndex) => (
            <span
              key={`${rowIndex}-${columnIndex}`}
              style={{
                backgroundColor: filled ? "#111111" : "#FFFFFF",
                borderRadius: 1,
              }}
            />
          ))
        )}
      </div>

      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            fontSize: 15,
            fontWeight: 800,
            letterSpacing: "1.4px",
            color: "var(--foreground)",
          }}
        >
          {code}
        </div>
        {caption && (
          <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{caption}</div>
        )}
      </div>
    </div>
  );
}

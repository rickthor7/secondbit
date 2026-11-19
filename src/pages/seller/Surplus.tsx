import { useState } from "react";
import { Link } from "react-router-dom";
import { Leaf, Package, Wallet, TrendingUp, Plus, CheckCircle2 } from "lucide-react";
import Swal from "sweetalert2";
import PageHeader from "@/components/dashboard/PageHeader";
import StatCard from "@/components/dashboard/StatCard";
import Panel from "@/components/dashboard/Panel";
import StatusPill from "@/components/dashboard/StatusPill";
import {
  sellerSurplus as initialSurplus,
  formatPrice,
  getDiscountPercent,
} from "@/data/mockData";
import type { SurplusItem } from "@/types";

export default function SellerSurplus() {
  const [items, setItems] = useState<SurplusItem[]>(initialSurplus);

  const active = items.filter((item) => item.status === "Aktif");
  const activePortions = active.reduce((sum, item) => sum + item.portions, 0);
  const potential = active.reduce((sum, item) => sum + item.price * item.portions, 0);
  const rescued = items
    .filter((item) => item.status === "Habis")
    .reduce((sum, item) => sum + item.portions, 0);

  const addSurplus = async () => {
    const result = await Swal.fire({
      title: "Tambah Surplus",
      html: `
        <input id="name" class="swal2-input" placeholder="Nama makanan" />
        <input id="portions" class="swal2-input" type="number" placeholder="Jumlah porsi" />
        <input id="original" class="swal2-input" type="number" placeholder="Harga normal (Rp)" />
        <input id="price" class="swal2-input" type="number" placeholder="Harga surplus (Rp)" />
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Publikasikan",
      cancelButtonText: "Batal",
      confirmButtonColor: "#EE4D2D",
      cancelButtonColor: "#757575",
      reverseButtons: true,
      preConfirm: () => {
        const name = (document.getElementById("name") as HTMLInputElement | null)?.value.trim();
        const portions = Number((document.getElementById("portions") as HTMLInputElement | null)?.value);
        const original = Number((document.getElementById("original") as HTMLInputElement | null)?.value);
        const price = Number((document.getElementById("price") as HTMLInputElement | null)?.value);

        if (!name) {
          Swal.showValidationMessage("Nama makanan wajib diisi");
          return false;
        }
        if (!portions || portions <= 0) {
          Swal.showValidationMessage("Jumlah porsi harus lebih dari 0");
          return false;
        }
        if (!original || !price || price >= original) {
          Swal.showValidationMessage("Harga surplus harus lebih murah dari harga normal");
          return false;
        }
        return { name, portions, original, price };
      },
    });

    if (!result.isConfirmed || !result.value) return;

    const data = result.value as {
      name: string;
      portions: number;
      original: number;
      price: number;
    };

    const newItem: SurplusItem = {
      id: `SRP-${String(items.length + 1).padStart(3, "0")}`,
      name: data.name,
      portions: data.portions,
      originalPrice: data.original,
      price: data.price,
      pickupWindow: "Hari ini 17:00 - 19:00",
      status: "Aktif",
    };

    setItems((current) => [newItem, ...current]);

    await Swal.fire({
      icon: "success",
      title: "Surplus dipublikasikan",
      text: `${data.name} (${data.portions} porsi) sekarang tampil di marketplace.`,
      confirmButtonColor: "#EE4D2D",
    });
  };

  const markSoldOut = async (item: SurplusItem) => {
    const result = await Swal.fire({
      icon: "question",
      title: "Tandai habis?",
      text: `${item.name} akan ditandai habis dan tidak bisa dipesan lagi.`,
      showCancelButton: true,
      confirmButtonText: "Ya, habis",
      cancelButtonText: "Batal",
      confirmButtonColor: "#EE4D2D",
      cancelButtonColor: "#757575",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    setItems((current) =>
      current.map((row) => (row.id === item.id ? { ...row, status: "Habis" } : row))
    );
  };

  return (
    <main style={{ minHeight: "80vh", backgroundColor: "var(--surface)", paddingBottom: 40 }}>
      <div className="container" style={{ paddingTop: 24 }}>
        <PageHeader
          kicker="Kelola Toko"
          title="Surplus Rescue"
          description="Ubah stok berlebih menjadi pendapatan tambahan sebelum kedaluwarsa."
          actions={
            <>
              <Link to="/seller/products" className="btn btn-outline">
                Produk Saya
              </Link>
              <button type="button" className="btn btn-primary" onClick={addSurplus}>
                <Plus size={15} /> Tambah Surplus
              </button>
            </>
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
          <StatCard label="Surplus Aktif" value={`${activePortions} porsi`} icon={Package} tone="success" />
          <StatCard label="Potensi Omzet" value={formatPrice(potential)} icon={Wallet} tone="primary" />
          <StatCard label="Porsi Terselamatkan" value={`${rescued} porsi`} icon={Leaf} tone="info" hint="dari surplus habis" />
          <StatCard label="Program Rescue" value="Aktif" icon={TrendingUp} tone="success" hint="diskon 40-45%" />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
          {items.map((item) => {
            const discount = getDiscountPercent(item.originalPrice, item.price);

            return (
              <Panel key={item.id}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 10,
                    marginBottom: 10,
                  }}
                >
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 2 }}>{item.name}</div>
                    <div style={{ fontSize: 11.5, color: "var(--muted)" }}>{item.pickupWindow}</div>
                  </div>
                  <StatusPill label={item.status} />
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 8,
                    marginBottom: 12,
                  }}
                >
                  <span style={{ fontSize: 20, fontWeight: 800, color: "var(--primary)" }}>
                    {formatPrice(item.price)}
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      color: "var(--muted)",
                      textDecoration: "line-through",
                    }}
                  >
                    {formatPrice(item.originalPrice)}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      color: "var(--primary)",
                      backgroundColor: "var(--primary-light)",
                      borderRadius: "var(--radius-full)",
                      padding: "2px 7px",
                    }}
                  >
                    -{discount}%
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 10,
                    paddingTop: 12,
                    borderTop: "1px solid var(--border-light)",
                  }}
                >
                  <span style={{ fontSize: 12, color: "var(--muted)" }}>
                    {item.portions} porsi tersedia
                  </span>

                  {item.status === "Aktif" ? (
                    <button
                      type="button"
                      onClick={() => markSoldOut(item)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: 11,
                        fontWeight: 700,
                        color: "var(--success)",
                        border: "1px solid var(--success)",
                        backgroundColor: "transparent",
                        borderRadius: "var(--radius-full)",
                        padding: "5px 10px",
                      }}
                    >
                      <CheckCircle2 size={12} /> Tandai Habis
                    </button>
                  ) : (
                    <span style={{ fontSize: 11, color: "var(--muted-light)" }}>Tidak aktif</span>
                  )}
                </div>
              </Panel>
            );
          })}
        </div>
      </div>
    </main>
  );
}

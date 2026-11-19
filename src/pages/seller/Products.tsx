import { useState } from "react";
import { Link } from "react-router-dom";
import { Package, Boxes, Star, TrendingUp, Plus, Pencil } from "lucide-react";
import Swal from "sweetalert2";
import PageHeader from "@/components/dashboard/PageHeader";
import StatCard from "@/components/dashboard/StatCard";
import Panel from "@/components/dashboard/Panel";
import StatusPill from "@/components/dashboard/StatusPill";
import { getProductsByUMKM, formatPrice } from "@/data/mockData";
import type { Product } from "@/types";

export default function SellerProducts() {
  const [items, setItems] = useState<Product[]>(() => getProductsByUMKM("u1"));

  const totalStock = items.reduce((sum, product) => sum + product.stock, 0);
  const averageRating = items.length
    ? items.reduce((sum, product) => sum + product.rating, 0) / items.length
    : 0;
  const totalSold = items.reduce((sum, product) => sum + product.soldCount, 0);

  const addProduct = async () => {
    const result = await Swal.fire({
      title: "Tambah Produk",
      html: `
        <input id="name" class="swal2-input" placeholder="Nama produk" />
        <input id="price" class="swal2-input" type="number" placeholder="Harga (Rp)" />
        <input id="stock" class="swal2-input" type="number" placeholder="Stok porsi" />
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Simpan",
      cancelButtonText: "Batal",
      confirmButtonColor: "#EE4D2D",
      cancelButtonColor: "#757575",
      reverseButtons: true,
      preConfirm: () => {
        const name = (document.getElementById("name") as HTMLInputElement | null)?.value.trim();
        const price = Number((document.getElementById("price") as HTMLInputElement | null)?.value);
        const stock = Number((document.getElementById("stock") as HTMLInputElement | null)?.value);

        if (!name) {
          Swal.showValidationMessage("Nama produk wajib diisi");
          return false;
        }
        if (!price || price <= 0) {
          Swal.showValidationMessage("Harga harus lebih dari 0");
          return false;
        }
        return { name, price, stock: stock > 0 ? stock : 1 };
      },
    });

    if (!result.isConfirmed || !result.value) return;

    const { name, price, stock } = result.value as {
      name: string;
      price: number;
      stock: number;
    };

    const newProduct: Product = {
      id: `local-${Date.now()}`,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description: "Produk baru Warung Bu Siti.",
      price,
      image: "/images/foods/nasi_pecel.jpg",
      category: "Nasi & Lauk",
      rating: 0,
      ratingCount: 0,
      soldCount: 0,
      umkmId: "u1",
      umkmName: "Warung Bu Siti",
      type: "normal",
      stock,
      shelfLife: "6 jam",
    };

    setItems((current) => [newProduct, ...current]);

    await Swal.fire({
      icon: "success",
      title: "Produk ditambahkan",
      text: `${name} sudah tampil di halaman toko (data demo di sesi ini).`,
      confirmButtonColor: "#EE4D2D",
    });
  };

  const editProduct = async (product: Product) => {
    await Swal.fire({
      icon: "info",
      title: product.name,
      html: `
        <div style="text-align:left;font-size:13px;color:#555;line-height:1.7;">
          <div><strong>Harga:</strong> ${formatPrice(product.price)}</div>
          <div><strong>Stok:</strong> ${product.stock} porsi</div>
          <div><strong>Terjual:</strong> ${product.soldCount} porsi</div>
          <div><strong>Rating:</strong> ${product.rating || "-"} (${product.ratingCount} ulasan)</div>
        </div>
      `,
      confirmButtonText: "Tutup",
      confirmButtonColor: "#EE4D2D",
    });
  };

  return (
    <main style={{ minHeight: "80vh", backgroundColor: "var(--surface)", paddingBottom: 40 }}>
      <div className="container" style={{ paddingTop: 24 }}>
        <PageHeader
          kicker="Kelola Toko"
          title="Produk Saya"
          description="Atur harga, stok, dan ketersediaan menu Warung Bu Siti."
          actions={
            <>
              <Link to="/seller/surplus" className="btn btn-outline">
                Buat Surplus
              </Link>
              <button type="button" className="btn btn-primary" onClick={addProduct}>
                <Plus size={15} /> Tambah Produk
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
          <StatCard label="Produk Aktif" value={String(items.length)} icon={Package} tone="primary" />
          <StatCard label="Total Stok" value={`${totalStock} porsi`} icon={Boxes} tone="info" />
          <StatCard label="Rata-rata Rating" value={averageRating.toFixed(1)} icon={Star} tone="warning" />
          <StatCard label="Total Terjual" value={`${totalSold} porsi`} icon={TrendingUp} tone="success" />
        </div>

        <Panel title="Daftar Produk" description="Ketuk edit untuk melihat detail performa produk.">
          <div style={{ display: "flex", flexDirection: "column" }}>
            {items.map((product, index) => {
              const status = product.stock === 0 ? "Habis" : product.stock <= 10 ? "Menipis" : "Aktif";
              const stockRatio = Math.min((product.stock / 60) * 100, 100);

              return (
                <div
                  key={product.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "14px 0",
                    borderBottom:
                      index < items.length - 1 ? "1px solid var(--border-light)" : "none",
                    flexWrap: "wrap",
                  }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: "var(--radius-md)",
                      objectFit: "cover",
                      flexShrink: 0,
                    }}
                  />

                  <div style={{ flex: "1 1 220px", minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        flexWrap: "wrap",
                        marginBottom: 2,
                      }}
                    >
                      <span style={{ fontSize: 14, fontWeight: 700 }}>{product.name}</span>
                      <StatusPill
                        label={status}
                        tone={status === "Aktif" ? "success" : status === "Menipis" ? "warning" : "neutral"}
                      />
                    </div>
                    <div style={{ fontSize: 11.5, color: "var(--muted)", marginBottom: 6 }}>
                      {product.category} · Rating {product.rating || "-"} ({product.ratingCount}) ·{" "}
                      {product.soldCount} terjual
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div
                        style={{
                          flex: 1,
                          maxWidth: 220,
                          height: 6,
                          borderRadius: "var(--radius-full)",
                          backgroundColor: "var(--surface)",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${stockRatio}%`,
                            height: "100%",
                            borderRadius: "var(--radius-full)",
                            backgroundColor:
                              product.stock <= 10 ? "var(--warning)" : "var(--success)",
                          }}
                        />
                      </div>
                      <span style={{ fontSize: 11, color: "var(--muted)" }}>
                        {product.stock} porsi
                      </span>
                    </div>
                  </div>

                  <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 15, fontWeight: 800 }}>{formatPrice(product.price)}</div>
                      {product.originalPrice && (
                        <div
                          style={{
                            fontSize: 11,
                            color: "var(--muted)",
                            textDecoration: "line-through",
                          }}
                        >
                          {formatPrice(product.originalPrice)}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => editProduct(product)}
                      aria-label={`Edit ${product.name}`}
                      className="btn btn-outline"
                      style={{ padding: "7px 10px", fontSize: 12 }}
                    >
                      <Pencil size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>
    </main>
  );
}

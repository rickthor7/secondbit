import { Link } from "react-router-dom";
import { Heart, Package, Wallet, ArrowRight } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import StatCard from "@/components/dashboard/StatCard";
import ProductCard from "@/components/shared/ProductCard";
import { products, favoriteProductIds, formatPrice } from "@/data/mockData";

export default function BuyerFavorites() {
  const favorites = products.filter((product) => favoriteProductIds.includes(product.id));
  const cheapest = favorites.reduce(
    (min, product) => (product.price < min ? product.price : min),
    favorites[0]?.price ?? 0
  );

  return (
    <main style={{ minHeight: "80vh", backgroundColor: "var(--surface)", paddingBottom: 40 }}>
      <div className="container" style={{ paddingTop: 24 }}>
        <PageHeader
          kicker="Akun Pembeli"
          title="Produk Favorit"
          description="Simpan makanan yang kamu suka supaya cepat dipesan lagi saat lapar."
          actions={
            <Link to="/explore" className="btn btn-outline">
              Jelajahi Kuliner
            </Link>
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
          <StatCard label="Produk Favorit" value={String(favorites.length)} icon={Heart} tone="danger" />
          <StatCard label="Total Produk" value={String(products.length)} icon={Package} tone="info" />
          <StatCard
            label="Mulai Dari"
            value={favorites.length ? formatPrice(cheapest) : "—"}
            icon={Wallet}
            tone="primary"
            hint="harga favorit termurah"
          />
        </div>

        {favorites.length === 0 ? (
          <div
            style={{
              backgroundColor: "var(--background)",
              borderRadius: "var(--radius-xl)",
              boxShadow: "var(--shadow-sm)",
              padding: "48px 20px",
              textAlign: "center",
            }}
          >
            <Heart size={36} style={{ color: "var(--muted-light)", marginBottom: 10 }} />
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>
              Belum ada produk favorit
            </div>
            <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 18 }}>
              Tekan ikon hati pada produk untuk menyimpannya di sini.
            </div>
            <Link to="/explore" className="btn btn-primary">
              Mulai Jelajahi <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          <div className="grid-products">
            {favorites.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

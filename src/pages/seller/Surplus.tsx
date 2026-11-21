import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Leaf,
  Package,
  Wallet,
  TrendingUp,
  Plus,
  CheckCircle2,
  Gift,
  ShieldCheck,
  Sparkles,
  Info,
} from "lucide-react";
import Swal from "sweetalert2";
import PageHeader from "@/components/dashboard/PageHeader";
import StatCard from "@/components/dashboard/StatCard";
import Panel from "@/components/dashboard/Panel";
import StatusPill from "@/components/dashboard/StatusPill";
import {
  sellerSurplus as initialSurplus,
  sellerSurplusBundles as initialBundles,
  formatPrice,
  getDiscountPercent,
} from "@/data/mockData";
import type { SurplusItem, SurplusBundle } from "@/types";

export default function SellerSurplus() {
  const [activeTab, setActiveTab] = useState<"standalone" | "bundle">("standalone");
  const [items, setItems] = useState<SurplusItem[]>(initialSurplus);
  const [bundles, setBundles] = useState<SurplusBundle[]>(initialBundles);

  const active = items.filter((item) => item.status === "Aktif");
  const activePortions = active.reduce((sum, item) => sum + item.portions, 0);
  const potential = active.reduce((sum, item) => sum + item.price * item.portions, 0);
  const rescued = items
    .filter((item) => item.status === "Habis")
    .reduce((sum, item) => sum + item.portions, 0);

  const activeBundles = bundles.filter((b) => b.status === "Aktif");
  const bundlePortions = activeBundles.reduce((sum, b) => sum + b.portions, 0);

  const addSurplus = async () => {
    const result = await Swal.fire({
      title: "Tambah Surplus Makanan",
      html: `
        <div style="text-align: left; font-size: 13px; color: #64748B; margin-bottom: 12px;">
          🔒 <strong>Kebijakan Limited Surplus:</strong> Sistem secara otomatis membatasi pesanan maks 2 porsi per user untuk melindungi margin menu reguler toko Anda.
        </div>
        <input id="name" class="swal2-input" placeholder="Nama makanan surplus" />
        <input id="portions" class="swal2-input" type="number" placeholder="Jumlah porsi (misal 5)" />
        <input id="original" class="swal2-input" type="number" placeholder="Harga normal (Rp)" />
        <input id="price" class="swal2-input" type="number" placeholder="Harga surplus rescue (Rp)" />
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Publikasikan Surplus",
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
      title: "Surplus Dipublikasikan!",
      html: `<strong>${data.name}</strong> (${data.portions} porsi) sekarang tayang.<br/><span style="font-size:12px;color:#16a34a">✓ Kuota maks 2 porsi/user aktif melindungi margin Anda.</span>`,
      confirmButtonColor: "#EE4D2D",
    });
  };

  const addSurplusBundle = async () => {
    const result = await Swal.fire({
      title: "Buat Surplus Bundle & Combo",
      html: `
        <div style="text-align: left; font-size: 13px; color: #64748B; margin-bottom: 12px; line-height: 1.5;">
          💡 <strong>Solusi Pelindung Margin:</strong> Gabungkan 1 menu reguler ber-margin baik dengan porsi surplus untuk mendongkrak omzet tanpa merusak harga pasar.
        </div>
        <input id="bname" class="swal2-input" placeholder="Nama Paket Bundle (cth: Paket Kenyang Double Berkah)" />
        <input id="regItem" class="swal2-input" placeholder="Menu Reguler (cth: 1x Nasi Bebek Goreng Spesial)" />
        <input id="surpItem" class="swal2-input" placeholder="Menu Surplus (cth: 1x Tahu Tempe & Sayur Asem)" />
        <input id="drinkItem" class="swal2-input" placeholder="Minuman Pendamping (cth: 1x Es Teh Manis)" />
        <input id="bportions" class="swal2-input" type="number" placeholder="Jumlah Paket Bundle Tersedia" />
        <input id="bnormal" class="swal2-input" type="number" placeholder="Total Harga Normal Kombo (Rp)" />
        <input id="bprice" class="swal2-input" type="number" placeholder="Harga Promo Bundle (Rp)" />
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Aktifkan Bundle",
      cancelButtonText: "Batal",
      confirmButtonColor: "#EE4D2D",
      cancelButtonColor: "#757575",
      reverseButtons: true,
      preConfirm: () => {
        const name = (document.getElementById("bname") as HTMLInputElement | null)?.value.trim();
        const regularItem = (document.getElementById("regItem") as HTMLInputElement | null)?.value.trim();
        const surplusItem = (document.getElementById("surpItem") as HTMLInputElement | null)?.value.trim();
        const drinksItem = (document.getElementById("drinkItem") as HTMLInputElement | null)?.value.trim();
        const portions = Number((document.getElementById("bportions") as HTMLInputElement | null)?.value);
        const normalPrice = Number((document.getElementById("bnormal") as HTMLInputElement | null)?.value);
        const bundlePrice = Number((document.getElementById("bprice") as HTMLInputElement | null)?.value);

        if (!name || !regularItem || !surplusItem) {
          Swal.showValidationMessage("Nama paket, menu reguler, dan menu surplus wajib diisi!");
          return false;
        }
        if (!portions || portions <= 0) {
          Swal.showValidationMessage("Jumlah paket harus lebih dari 0!");
          return false;
        }
        if (!normalPrice || !bundlePrice || bundlePrice >= normalPrice) {
          Swal.showValidationMessage("Harga promo bundle harus lebih hemat dari total harga normal!");
          return false;
        }
        return { name, regularItem, surplusItem, drinksItem, portions, normalPrice, bundlePrice };
      },
    });

    if (!result.isConfirmed || !result.value) return;

    const data = result.value as {
      name: string;
      regularItem: string;
      surplusItem: string;
      drinksItem: string;
      portions: number;
      normalPrice: number;
      bundlePrice: number;
    };

    const marginRate = Math.round((data.bundlePrice / data.normalPrice) * 100);

    const newBundle: SurplusBundle = {
      id: `BND-${String(bundles.length + 1).padStart(3, "0")}`,
      name: data.name,
      regularItem: data.regularItem,
      surplusItem: data.surplusItem,
      drinksItem: data.drinksItem || undefined,
      bundlePrice: data.bundlePrice,
      normalPrice: data.normalPrice,
      portions: data.portions,
      status: "Aktif",
      marginProtectionRate: `~${marginRate}% Margin Terlindungi`,
    };

    setBundles((curr) => [newBundle, ...curr]);

    await Swal.fire({
      icon: "success",
      title: "Surplus Bundle Berhasil Dibuat!",
      html: `Paket <strong>${data.name}</strong> kini aktif di marketplace.<br/><span style="font-size:12px;color:#16a34a">✓ Margin terjaga aman dengan bundling menu reguler + rescue.</span>`,
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

  const markBundleSoldOut = async (bundle: SurplusBundle) => {
    const result = await Swal.fire({
      icon: "question",
      title: "Tandai bundle habis?",
      text: `Paket ${bundle.name} akan ditandai habis.`,
      showCancelButton: true,
      confirmButtonText: "Ya, tandai habis",
      cancelButtonText: "Batal",
      confirmButtonColor: "#EE4D2D",
      cancelButtonColor: "#757575",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    setBundles((current) =>
      current.map((row) => (row.id === bundle.id ? { ...row, status: "Habis" } : row))
    );
  };

  return (
    <main style={{ minHeight: "80vh", backgroundColor: "var(--surface)", paddingBottom: 40 }}>
      <div className="container" style={{ paddingTop: 24 }}>
        <PageHeader
          kicker="Kelola Toko & Perlindungan Margin"
          title="Surplus Rescue & Bundling Hub"
          description="Monetisasi stok berlebih tanpa mengorbankan margin menu reguler melalui kuota fair rescue dan paket bundle."
          actions={
            <>
              <Link to="/seller/products" className="btn btn-outline">
                Produk Reguler
              </Link>
              {activeTab === "bundle" ? (
                <button type="button" className="btn btn-primary" onClick={addSurplusBundle}>
                  <Gift size={15} /> Buat Surplus Bundle
                </button>
              ) : (
                <button type="button" className="btn btn-primary" onClick={addSurplus}>
                  <Plus size={15} /> Tambah Surplus
                </button>
              )}
            </>
          }
        />

        {/* Stats Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: 12,
            marginBottom: 20,
          }}
        >
          <StatCard
            label="Surplus Satuan Aktif"
            value={`${activePortions} porsi`}
            icon={Package}
            tone="success"
            hint="Maks 2 porsi/user"
          />
          <StatCard
            label="Surplus Bundle Aktif"
            value={`${bundlePortions} paket`}
            icon={Gift}
            tone="primary"
            hint="Kombinasi reguler + rescue"
          />
          <StatCard
            label="Potensi Omzet"
            value={formatPrice(potential)}
            icon={Wallet}
            tone="primary"
          />
          <StatCard
            label="Porsi Diselamatkan"
            value={`${rescued} porsi`}
            icon={Leaf}
            tone="info"
            hint="Zero food waste"
          />
        </div>

        {/* Anti-Cannibalization Margin Policy Banner */}
        <div
          style={{
            backgroundColor: "var(--surface-sunken)",
            border: "1px solid var(--border)",
            borderLeft: "4px solid var(--primary)",
            borderRadius: "var(--radius-lg)",
            padding: "16px 20px",
            marginBottom: 24,
            display: "flex",
            alignItems: "flex-start",
            gap: 14,
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: "var(--radius-md)",
              backgroundColor: "rgba(238, 77, 45, 0.12)",
              color: "var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <ShieldCheck size={20} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
              <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "var(--foreground)" }}>
                Kebijakan Limited Surplus & Proteksi Margin UMKM Aktif
              </h4>
              <span
                style={{
                  fontSize: 10.5,
                  fontWeight: 700,
                  backgroundColor: "var(--success-light)",
                  color: "var(--success)",
                  padding: "2px 8px",
                  borderRadius: "var(--radius-full)",
                }}
              >
                ✓ Fair Rescue Rule
              </span>
            </div>
            <p style={{ margin: 0, fontSize: 12.5, color: "var(--muted)", lineHeight: 1.55 }}>
              Agar customer tidak hanya berburu makanan murah dan merusak penjualan menu reguler Anda, sistem menerapkan:
              <br />
              <strong>1. Kuota Limited Surplus:</strong> Pembeli dibatasi maks 2 porsi surplus per hari.
              <br />
              <strong>2. Surplus Bundle & Combo:</strong> Anda dapat menggabungkan 1 porsi menu ber-margin tinggi (cth: Ayam Geprek Reguler + Minuman) dengan 1 porsi surplus untuk menjaga rata-rata nilai transaksi (basket size) tetap menguntungkan.
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 20,
            borderBottom: "1px solid var(--border)",
            paddingBottom: 4,
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab("standalone")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 16px",
              borderRadius: "var(--radius-md)",
              fontSize: 13,
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s ease",
              backgroundColor: activeTab === "standalone" ? "var(--primary)" : "transparent",
              color: activeTab === "standalone" ? "#fff" : "var(--muted)",
            }}
          >
            <Package size={15} />
            Surplus Satuan (Limited)
            <span
              style={{
                fontSize: 11,
                padding: "1px 6px",
                borderRadius: "var(--radius-full)",
                backgroundColor: activeTab === "standalone" ? "rgba(255,255,255,0.25)" : "var(--surface-sunken)",
              }}
            >
              {items.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("bundle")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 16px",
              borderRadius: "var(--radius-md)",
              fontSize: 13,
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s ease",
              backgroundColor: activeTab === "bundle" ? "var(--primary)" : "transparent",
              color: activeTab === "bundle" ? "#fff" : "var(--muted)",
            }}
          >
            <Gift size={15} />
            Surplus Bundle & Combo
            <span
              style={{
                fontSize: 11,
                padding: "1px 6px",
                borderRadius: "var(--radius-full)",
                backgroundColor: activeTab === "bundle" ? "rgba(255,255,255,0.25)" : "var(--surface-sunken)",
              }}
            >
              {bundles.length}
            </span>
          </button>
        </div>

        {/* Tab 1: Standalone Surplus */}
        {activeTab === "standalone" && (
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

                  {/* Policy Tag */}
                  <div style={{ marginBottom: 10 }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: 10.5,
                        fontWeight: 700,
                        backgroundColor: "rgba(238, 77, 45, 0.1)",
                        color: "var(--primary)",
                        padding: "2px 7px",
                        borderRadius: "var(--radius-full)",
                      }}
                    >
                      🔒 Kuota: Maks 2 Porsi/User
                    </span>
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
                          cursor: "pointer",
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
        )}

        {/* Tab 2: Surplus Bundle & Combo */}
        {activeTab === "bundle" && (
          <div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: 16,
              }}
            >
              {bundles.map((bundle) => {
                const discount = getDiscountPercent(bundle.normalPrice, bundle.bundlePrice);

                return (
                  <Panel key={bundle.id}>
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
                        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 2 }}>{bundle.name}</div>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: "var(--success)",
                            backgroundColor: "var(--success-light)",
                            padding: "2px 8px",
                            borderRadius: "var(--radius-full)",
                          }}
                        >
                          🛡️ {bundle.marginProtectionRate}
                        </span>
                      </div>
                      <StatusPill label={bundle.status} />
                    </div>

                    {/* Bundle items list */}
                    <div
                      style={{
                        backgroundColor: "var(--surface-sunken)",
                        borderRadius: "var(--radius-md)",
                        padding: "10px 12px",
                        fontSize: 12,
                        marginBottom: 14,
                        display: "flex",
                        flexDirection: "column",
                        gap: 5,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ color: "var(--primary)", fontWeight: 700 }}>[Reguler]</span>
                        <span style={{ color: "var(--foreground)" }}>{bundle.regularItem}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ color: "var(--success)", fontWeight: 700 }}>[Surplus]</span>
                        <span style={{ color: "var(--foreground)" }}>{bundle.surplusItem}</span>
                      </div>
                      {bundle.drinksItem && (
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ color: "#6366F1", fontWeight: 700 }}>[Minuman]</span>
                          <span style={{ color: "var(--foreground)" }}>{bundle.drinksItem}</span>
                        </div>
                      )}
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
                        {formatPrice(bundle.bundlePrice)}
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                          color: "var(--muted)",
                          textDecoration: "line-through",
                        }}
                      >
                        {formatPrice(bundle.normalPrice)}
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
                        Hemat {discount}%
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
                        {bundle.portions} paket tersedia
                      </span>

                      {bundle.status === "Aktif" ? (
                        <button
                          type="button"
                          onClick={() => markBundleSoldOut(bundle)}
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
                            cursor: "pointer",
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
        )}
      </div>
    </main>
  );
}

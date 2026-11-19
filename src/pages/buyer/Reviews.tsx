import { Link } from "react-router-dom";
import { Star, MessageSquare, Clock, ArrowRight } from "lucide-react";
import Swal from "sweetalert2";
import PageHeader from "@/components/dashboard/PageHeader";
import StatCard from "@/components/dashboard/StatCard";
import Panel from "@/components/dashboard/Panel";
import { orders, reviews, getProductById } from "@/data/mockData";

function Stars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <div style={{ display: "flex", gap: 2 }} aria-label={`${value} dari 5 bintang`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          fill={star <= value ? "#FFB300" : "none"}
          stroke={star <= value ? "#FFB300" : "var(--muted-light)"}
        />
      ))}
    </div>
  );
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BuyerReviews() {
  const myReviews = reviews.filter((review) => review.userId === "buyer1");
  const reviewedProductIds = new Set(myReviews.map((review) => review.productId));

  const pendingOrders = orders.filter(
    (order) =>
      order.status === "completed" &&
      order.products.some((product) => !reviewedProductIds.has(product.productId))
  );

  const average =
    myReviews.length === 0
      ? 0
      : myReviews.reduce((sum, review) => sum + review.rating, 0) / myReviews.length;

  const writeReview = async (orderNumber: string, productName: string) => {
    const result = await Swal.fire({
      title: "Tulis Ulasan",
      html: `
        <div style="text-align:left;font-size:13px;color:#555;margin-bottom:10px;">${productName}</div>
        <select id="rating" class="swal2-select" style="width:100%;margin:0 0 10px;">
          <option value="5">★★★★★ — Sangat puas</option>
          <option value="4">★★★★☆ — Puas</option>
          <option value="3">★★★☆☆ — Cukup</option>
          <option value="2">★★☆☆☆ — Kurang</option>
          <option value="1">★☆☆☆☆ — Buruk</option>
        </select>
        <textarea id="comment" class="swal2-textarea" placeholder="Ceritakan pengalamanmu..." style="width:100%;margin:0;"></textarea>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Kirim Ulasan",
      cancelButtonText: "Batal",
      confirmButtonColor: "#EE4D2D",
      cancelButtonColor: "#757575",
      reverseButtons: true,
      preConfirm: () => {
        const rating = (document.getElementById("rating") as HTMLSelectElement | null)?.value;
        const comment = (document.getElementById("comment") as HTMLTextAreaElement | null)?.value;
        if (!comment?.trim()) {
          Swal.showValidationMessage("Ulasan tidak boleh kosong");
          return false;
        }
        return { rating, comment };
      },
    });

    if (result.isConfirmed) {
      await Swal.fire({
        icon: "success",
        title: "Ulasan terkirim",
        text: `Terima kasih! Ulasan untuk ${orderNumber} sudah kami terima.`,
        confirmButtonColor: "#EE4D2D",
      });
    }
  };

  return (
    <main style={{ minHeight: "80vh", backgroundColor: "var(--surface)", paddingBottom: 40 }}>
      <div className="container" style={{ paddingTop: 24 }}>
        <PageHeader
          kicker="Akun Pembeli"
          title="Ulasan Saya"
          description="Bantu pembeli lain dengan menceritakan pengalamanmu setelah pickup."
          actions={
            <Link to="/buyer/orders" className="btn btn-outline">
              Lihat Pesanan
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
          <StatCard label="Ulasan Ditulis" value={String(myReviews.length)} icon={MessageSquare} tone="info" />
          <StatCard label="Rata-rata Rating" value={average.toFixed(1)} icon={Star} tone="warning" hint="dari 5 bintang" />
          <StatCard label="Menunggu Ulasan" value={String(pendingOrders.length)} icon={Clock} tone="primary" hint="pesanan selesai" />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 16,
            alignItems: "start",
          }}
        >
          <Panel title="Ulasan yang Sudah Kamu Tulis">
            {myReviews.length === 0 ? (
              <div style={{ textAlign: "center", padding: "28px 12px", color: "var(--muted)", fontSize: 13 }}>
                Kamu belum menulis ulasan.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {myReviews.map((review) => {
                  const product = review.productId ? getProductById(review.productId) : undefined;
                  return (
                    <div
                      key={review.id}
                      style={{
                        padding: "14px 16px",
                        borderRadius: "var(--radius-lg)",
                        backgroundColor: "var(--surface)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 8,
                          flexWrap: "wrap",
                          marginBottom: 6,
                        }}
                      >
                        <Stars value={review.rating} />
                        <span style={{ fontSize: 11, color: "var(--muted)" }}>
                          {formatDate(review.createdAt)}
                        </span>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>
                        {product?.name ?? "Produk SecondBit"}
                      </div>
                      <div style={{ fontSize: 13, color: "var(--foreground-secondary)", lineHeight: 1.6 }}>
                        {review.comment}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Panel>

          <Panel title="Menunggu Ulasan" description="Pesanan selesai yang belum kamu beri rating.">
            {pendingOrders.length === 0 ? (
              <div style={{ textAlign: "center", padding: "28px 12px" }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>🎉</div>
                <div style={{ fontSize: 13, color: "var(--muted)" }}>
                  Semua pesanan selesai sudah kamu ulas. Mantap!
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {pendingOrders.map((order) => {
                  const product = order.products.find(
                    (item) => !reviewedProductIds.has(item.productId)
                  );
                  return (
                    <div
                      key={order.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        paddingBottom: 10,
                        borderBottom: "1px solid var(--border-light)",
                      }}
                    >
                      <img
                        src={product?.image}
                        alt={product?.productName}
                        loading="lazy"
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: "var(--radius-md)",
                          objectFit: "cover",
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12.5, fontWeight: 600 }}>
                          {product?.productName ?? "Produk"}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--muted)" }}>{order.umkmName}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          writeReview(order.orderNumber, product?.productName ?? "Produk")
                        }
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          fontSize: 11,
                          fontWeight: 700,
                          color: "var(--primary)",
                          border: "1px solid var(--primary)",
                          borderRadius: "var(--radius-full)",
                          padding: "5px 10px",
                          backgroundColor: "transparent",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Tulis <ArrowRight size={12} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </Panel>
        </div>
      </div>
    </main>
  );
}

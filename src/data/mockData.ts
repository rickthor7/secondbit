import type {
  Product,
  UMKM,
  Category,
  Banner,
  Review,
  Order,
  DailySalesPoint,
  HourlyTrafficPoint,
  SellerOrder,
  Settlement,
  SurplusItem,
  SurplusBundle,
  Voucher,
  AdminUser,
} from "@/types";

// ===== Categories =====
export const categories: Category[] = [
  { id: "1", name: "Nasi & Lauk", icon: "🍚", slug: "nasi-lauk" },
  { id: "2", name: "Mie & Bakso", icon: "🍜", slug: "mie-bakso" },
  { id: "3", name: "Ayam & Bebek", icon: "🍗", slug: "ayam-bebek" },
  { id: "4", name: "Jajanan", icon: "🧁", slug: "jajanan" },
  { id: "5", name: "Minuman", icon: "🥤", slug: "minuman" },
  { id: "6", name: "Roti & Kue", icon: "🍞", slug: "roti-kue" },
  { id: "7", name: "Seafood", icon: "🦐", slug: "seafood" },
  { id: "8", name: "Sate & Bakar", icon: "🍢", slug: "sate-bakar" },
  { id: "9", name: "Dessert", icon: "🍰", slug: "dessert" },
  { id: "10", name: "Tradisional", icon: "🥘", slug: "tradisional" },
];

// ===== UMKM =====
export const umkmList: UMKM[] = [
  {
    id: "u1",
    name: "Warung Bu Siti",
    slug: "warung-bu-siti",
    description: "Warung nasi legendaris di Ketintang yang sudah berdiri sejak 2005. Terkenal dengan nasi pecel dan rawon autentik Surabaya.",
    image: "/images/foods/nasi_pecel.jpg",
    coverImage: "/images/foods/rawon_surabaya.jpg",
    category: "Nasi & Lauk",
    rating: 4.8,
    ratingCount: 324,
    address: "Jl. Ketintang No. 45, Surabaya",
    distance: "0.3 km",
    operatingHours: "06:00 - 21:00",
    isOpen: true,
    isMVP: true,
    isHiddenGem: true,
    totalProducts: 15,
    totalSold: 2840,
  },
  {
    id: "u2",
    name: "Bakso Pak Darmo",
    slug: "bakso-pak-darmo",
    description: "Bakso urat jumbo dengan kuah kaldu sapi yang gurih. Favorit mahasiswa UNESA sejak 2010.",
    image: "/images/foods/bakso_urat.jpg",
    coverImage: "/images/foods/paket_bakso_esteh.jpg",
    category: "Mie & Bakso",
    rating: 4.6,
    ratingCount: 256,
    address: "Jl. Ketintang Baru III/5, Surabaya",
    distance: "0.5 km",
    operatingHours: "10:00 - 22:00",
    isOpen: true,
    isMVP: false,
    isHiddenGem: true,
    totalProducts: 8,
    totalSold: 1920,
  },
  {
    id: "u3",
    name: "Ayam Geprek Mas Eko",
    slug: "ayam-geprek-mas-eko",
    description: "Ayam geprek dengan sambal bawang level 1-10. Dijamin nendang!",
    image: "/images/foods/ayam_geprek.jpg",
    coverImage: "/images/foods/ayam_penyet.jpg",
    category: "Ayam & Bebek",
    rating: 4.5,
    ratingCount: 189,
    address: "Jl. Ketintang Madya No. 12, Surabaya",
    distance: "0.8 km",
    operatingHours: "10:00 - 21:00",
    isOpen: true,
    isMVP: true,
    isHiddenGem: false,
    totalProducts: 12,
    totalSold: 3120,
  },
  {
    id: "u4",
    name: "Es Teh Solo Mbak Ani",
    slug: "es-teh-solo-mbak-ani",
    description: "Es teh manis khas Solo dengan rempah spesial. Segar di cuaca panas Surabaya!",
    image: "/images/foods/es_teh_solo.jpg",
    coverImage: "/images/foods/es_jeruk.jpg",
    category: "Minuman",
    rating: 4.7,
    ratingCount: 412,
    address: "Jl. Ketintang Permai No. 8, Surabaya",
    distance: "0.2 km",
    operatingHours: "08:00 - 22:00",
    isOpen: true,
    isMVP: false,
    isHiddenGem: true,
    totalProducts: 10,
    totalSold: 5200,
  },
  {
    id: "u5",
    name: "Jajanan Ibu Lestari",
    slug: "jajanan-ibu-lestari",
    description: "Aneka jajanan pasar tradisional — klepon, onde-onde, lemper, dan kue lapis. Dibuat fresh setiap pagi!",
    image: "/images/foods/klepon_onde_onde.jpg",
    coverImage: "/images/foods/lemper_ayam.jpg",
    category: "Jajanan",
    rating: 4.9,
    ratingCount: 567,
    address: "Jl. Ketintang Barat No. 20, Surabaya",
    distance: "0.6 km",
    operatingHours: "05:00 - 14:00",
    isOpen: true,
    isMVP: true,
    isHiddenGem: true,
    totalProducts: 20,
    totalSold: 8450,
  },
  {
    id: "u6",
    name: "Sate Madura Haji Ridwan",
    slug: "sate-madura-haji-ridwan",
    description: "Sate ayam dan kambing khas Madura dengan bumbu kacang rahasia turun-temurun.",
    image: "/images/foods/sate_ayam.jpg",
    coverImage: "/images/foods/sate_ayam.jpg",
    category: "Sate & Bakar",
    rating: 4.7,
    ratingCount: 298,
    address: "Jl. Ketintang Timur No. 33, Surabaya",
    distance: "1.0 km",
    operatingHours: "15:00 - 23:00",
    isOpen: false,
    isMVP: false,
    isHiddenGem: true,
    totalProducts: 6,
    totalSold: 4200,
  },
];

// ===== Products =====
export const products: Product[] = [
  // Normal products
  {
    id: "p1", name: "Nasi Pecel Komplit", slug: "nasi-pecel-komplit",
    description: "Nasi pecel dengan sayur, tempe, tahu, dan rempeyek. Sambal pecel khas Madiun.",
    price: 15000, image: "/images/foods/nasi_pecel.jpg",
    category: "Nasi & Lauk", rating: 4.8, ratingCount: 152, soldCount: 890,
    umkmId: "u1", umkmName: "Warung Bu Siti", type: "normal", isBestSeller: true,
    stock: 50, productionTime: "06:00", shelfLife: "6 jam",
  },
  {
    id: "p2", name: "Rawon Surabaya", slug: "rawon-surabaya",
    description: "Rawon daging sapi asli Surabaya dengan kuah hitam kluwek. Disajikan dengan nasi, tauge, dan telur asin.",
    price: 25000, image: "/images/foods/rawon_surabaya.jpg",
    category: "Nasi & Lauk", rating: 4.9, ratingCount: 210, soldCount: 1200,
    umkmId: "u1", umkmName: "Warung Bu Siti", type: "normal", isBestSeller: true,
    stock: 30, productionTime: "05:00", shelfLife: "8 jam",
  },
  {
    id: "p3", name: "Bakso Urat Jumbo", slug: "bakso-urat-jumbo",
    description: "Bakso urat jumbo berisi daging sapi pilihan. Kuah kaldu sapi gurih.",
    price: 20000, image: "/images/foods/bakso_urat.jpg",
    category: "Mie & Bakso", rating: 4.6, ratingCount: 180, soldCount: 760,
    umkmId: "u2", umkmName: "Bakso Pak Darmo", type: "normal", isBestSeller: true,
    stock: 40, productionTime: "09:00", shelfLife: "6 jam",
  },
  {
    id: "p4", name: "Ayam Geprek Level 5", slug: "ayam-geprek-level-5",
    description: "Ayam geprek crispy dengan sambal bawang level 5. Pedas mantap!",
    price: 18000, image: "/images/foods/ayam_geprek.jpg",
    category: "Ayam & Bebek", rating: 4.5, ratingCount: 142, soldCount: 920,
    umkmId: "u3", umkmName: "Ayam Geprek Mas Eko", type: "normal", isBestSeller: false,
    stock: 60, productionTime: "10:00", shelfLife: "4 jam",
  },
  {
    id: "p5", name: "Es Teh Solo Spesial", slug: "es-teh-solo-spesial",
    description: "Es teh manis khas Solo dengan rempah jahe, sereh, dan kayu manis.",
    price: 8000, image: "/images/foods/es_teh_solo.jpg",
    category: "Minuman", rating: 4.7, ratingCount: 320, soldCount: 4500,
    umkmId: "u4", umkmName: "Es Teh Solo Mbak Ani", type: "normal", isBestSeller: true,
    stock: 100, productionTime: "07:00", shelfLife: "12 jam",
  },
  // Flash Deal products
  {
    id: "p6", name: "Nasi Ayam Penyet", slug: "nasi-ayam-penyet",
    description: "Nasi ayam penyet dengan sambal terasi dan lalapan segar.",
    price: 12000, originalPrice: 18000, image: "/images/foods/ayam_penyet.jpg",
    category: "Ayam & Bebek", rating: 4.4, ratingCount: 98, soldCount: 340,
    umkmId: "u3", umkmName: "Ayam Geprek Mas Eko", type: "flash-deal",
    stock: 15, flashDealEndsAt: new Date(Date.now() + 3 * 3600000).toISOString(),
    pickupTime: "Pickup sebelum 14:00",
  },
  {
    id: "p7", name: "Paket Bakso + Es Teh", slug: "paket-bakso-es-teh",
    description: "1 porsi bakso urat + 1 es teh manis. Combo hemat!",
    price: 18000, originalPrice: 28000, image: "/images/foods/paket_bakso_esteh.jpg",
    category: "Mie & Bakso", rating: 4.5, ratingCount: 67, soldCount: 180,
    umkmId: "u2", umkmName: "Bakso Pak Darmo", type: "flash-deal",
    stock: 10, flashDealEndsAt: new Date(Date.now() + 5 * 3600000).toISOString(),
    pickupTime: "Pickup sebelum 15:00",
  },
  {
    id: "p8", name: "Sate Ayam 10 Tusuk", slug: "sate-ayam-10-tusuk",
    description: "Sate ayam Madura 10 tusuk dengan bumbu kacang dan lontong.",
    price: 15000, originalPrice: 22000, image: "/images/foods/sate_ayam.jpg",
    category: "Sate & Bakar", rating: 4.8, ratingCount: 145, soldCount: 520,
    umkmId: "u6", umkmName: "Sate Madura Haji Ridwan", type: "flash-deal",
    stock: 8, flashDealEndsAt: new Date(Date.now() + 2 * 3600000).toISOString(),
    pickupTime: "Pickup sebelum 20:00",
  },
  {
    id: "p9", name: "Es Jeruk Segar", slug: "es-jeruk-segar",
    description: "Es jeruk peras segar tanpa pengawet. Vitamin C tinggi!",
    price: 5000, originalPrice: 10000, image: "/images/foods/es_jeruk.jpg",
    category: "Minuman", rating: 4.3, ratingCount: 89, soldCount: 290,
    umkmId: "u4", umkmName: "Es Teh Solo Mbak Ani", type: "flash-deal",
    stock: 20, flashDealEndsAt: new Date(Date.now() + 4 * 3600000).toISOString(),
    pickupTime: "Pickup sebelum 16:00",
  },
  // Surplus products (Limited Surplus with Anti-Cannibalization Protection)
  {
    id: "p10", name: "Klepon & Onde-Onde (5pcs)", slug: "klepon-onde-onde-5pcs",
    description: "Paket klepon 3 + onde-onde 2. Masih fresh, dibuat pagi ini! Dibatasi maks 2 porsi/user untuk menjaga margin warung.",
    price: 5000, originalPrice: 12000, image: "/images/foods/klepon_onde_onde.jpg",
    category: "Jajanan", rating: 4.9, ratingCount: 210, soldCount: 1500,
    umkmId: "u5", umkmName: "Jajanan Ibu Lestari", type: "surplus",
    stock: 6, pickupTime: "Pickup sebelum 12:00", productionTime: "05:00", shelfLife: "8 jam",
    maxSurplusPerUser: 2,
    surplusPolicyNote: "Fair Rescue: Maksimal 2 porsi per user per hari demi melindungi margin warung mitra.",
  },
  {
    id: "p11", name: "Nasi Campur Bali", slug: "nasi-campur-bali",
    description: "Nasi campur khas Bali dengan ayam suwir, sate lilit, dan lawar. Porsi surplus terbatas demi menjaga kestabilan harga menu reguler.",
    price: 12000, originalPrice: 22000, image: "/images/foods/nasi_campur_bali.jpg",
    category: "Nasi & Lauk", rating: 4.6, ratingCount: 78, soldCount: 340,
    umkmId: "u1", umkmName: "Warung Bu Siti", type: "surplus",
    stock: 4, pickupTime: "Pickup sebelum 13:00", productionTime: "06:00", shelfLife: "6 jam",
    maxSurplusPerUser: 2,
    surplusPolicyNote: "Fair Rescue: Maksimal 2 porsi per user per hari demi melindungi margin warung mitra.",
  },
  {
    id: "p12", name: "Lemper Ayam (4pcs)", slug: "lemper-ayam-4pcs",
    description: "Lemper isi ayam suwir dibungkus daun pisang. Gurih dan kenyal! Porsi penyelamat terbatas.",
    price: 6000, originalPrice: 14000, image: "/images/foods/lemper_ayam.jpg",
    category: "Jajanan", rating: 4.8, ratingCount: 156, soldCount: 980,
    umkmId: "u5", umkmName: "Jajanan Ibu Lestari", type: "surplus",
    stock: 3, pickupTime: "Pickup sebelum 11:00", productionTime: "05:00", shelfLife: "6 jam",
    maxSurplusPerUser: 2,
    surplusPolicyNote: "Fair Rescue: Maksimal 2 porsi per user per hari demi melindungi margin warung mitra.",
  },
  // Surplus Bundles (Kombinasi Reguler + Surplus untuk Lindungi Margin Warung)
  {
    id: "p13", name: "Paket Combo Rescue: Nasi Geprek + Lauk Surplus + Es Teh", slug: "paket-combo-rescue-geprek",
    description: "Paket cerdas lindungi UMKM! Mengombinasikan 1x Nasi Ayam Geprek Sambal Korek segar (reguler) + 1x Lauk Tambahan Telur Balado (surplus) + 1x Es Teh Jumbo. Kenyang hemat tanpa merusak margin warung!",
    price: 19000, originalPrice: 32000, image: "/images/foods/ayam_geprek.jpg",
    category: "Nasi & Lauk", rating: 4.9, ratingCount: 184, soldCount: 420,
    umkmId: "u3", umkmName: "Ayam Geprek Mas Eko", type: "bundle",
    stock: 7, isBundle: true, bundleSavings: 13000,
    bundleItems: [
      "1x Nasi Ayam Geprek Sambal Korek (Menu Reguler Segar)",
      "1x Telur Balado & Tempe Orek (Surplus Food Rescue)",
      "1x Es Teh Manis Jumbo Segar",
    ],
    bundleMarginNote: "Melindungi margin UMKM dengan kombinasi menu reguler + surplus pendamping",
    pickupTime: "Pickup sebelum 15:00",
  },
  {
    id: "p14", name: "Mystery Rescue Bag: Aneka Kue Subuh & Jajanan Pasar", slug: "mystery-rescue-bag-jajanan",
    description: "Mystery bag berkonsep zero-waste berisi 6-8 potong aneka jajanan pasar pilihan dapur (lemper, onde-onde, klepon, pastel). Surprise hemat bermutu!",
    price: 14000, originalPrice: 30000, image: "/images/foods/klepon_onde_onde.jpg",
    category: "Jajanan", rating: 4.9, ratingCount: 312, soldCount: 890,
    umkmId: "u5", umkmName: "Jajanan Ibu Lestari", type: "bundle",
    stock: 5, isBundle: true, bundleSavings: 16000,
    bundleItems: [
      "3x Lemper Ayam Daun Pisang",
      "3x Kue Klepon Gula Merah",
      "2x Onde-Onde Wijen Gurih",
    ],
    bundleMarginNote: "Paket kejutan selamatkan stok berlebih pagi hari tanpa merusak harga satuan",
    pickupTime: "Pickup sebelum 12:30",
  },
  {
    id: "p15", name: "Paket Mahasiswa Hemat: Bakso Urat + Tahu Bakso Surplus + Es Jeruk", slug: "paket-mahasiswa-hemat-bakso",
    description: "1 porsi Bakso Urat Asli kuah kaldu sapi (reguler) dipadu 2 pcs Tahu Bakso Goreng (surplus hari ini) + 1 gelas Es Jeruk Peras Segar.",
    price: 21000, originalPrice: 35000, image: "/images/foods/paket_bakso_esteh.jpg",
    category: "Mie & Bakso", rating: 4.8, ratingCount: 142, soldCount: 510,
    umkmId: "u2", umkmName: "Bakso Pak Darmo", type: "bundle",
    stock: 8, isBundle: true, bundleSavings: 14000,
    bundleItems: [
      "1x Bakso Urat Kuah Sapi Panas (Reguler)",
      "2x Tahu Bakso Goreng Renyah (Surplus)",
      "1x Es Jeruk Peras Asli",
    ],
    bundleMarginNote: "Kombinasi menu utama reguler + menu surplus pendamping",
    pickupTime: "Pickup sebelum 16:00",
  },
  {
    id: "p16", name: "Duo Nasi Campur Berkah (Family / Kosan Rescue)", slug: "duo-nasi-campur-berkah",
    description: "Paket porsi berdua hemat maksimal! 2 porsi Nasi Campur Komplit siap santap sebelum gerai tutup, lengkap dengan kerupuk dan sambal khas Bu Siti.",
    price: 25000, originalPrice: 44000, image: "/images/foods/nasi_campur_bali.jpg",
    category: "Nasi & Lauk", rating: 4.7, ratingCount: 95, soldCount: 230,
    umkmId: "u1", umkmName: "Warung Bu Siti", type: "bundle",
    stock: 4, isBundle: true, bundleSavings: 19000,
    bundleItems: [
      "2x Nasi Campur Komplit Lauk Pilihan",
      "2x Kerupuk Kaleng Renyah",
      "2x Sambal Bajak Khas Bu Siti",
    ],
    bundleMarginNote: "Paket bundling rombongan mahasiswa kosan, hemat & aman margin",
    pickupTime: "Pickup sebelum 14:00",
  },
];

// ===== Banners =====
export const banners: Banner[] = [
  {
    id: "b1",
    title: "Flash Deal Setiap Hari!",
    subtitle: "Diskon hingga 50% untuk makanan UMKM favoritmu",
    image: "/images/foods/paket_bakso_esteh.jpg",
    link: "/flash-deals",
    bgColor: "linear-gradient(135deg, #EE4D2D 0%, #FF6633 100%)",
  },
  {
    id: "b2",
    title: "Surplus Rescue 🌿",
    subtitle: "Selamatkan makanan, hemat kantong! Mulai dari Rp5.000",
    image: "/images/foods/klepon_onde_onde.jpg",
    link: "/explore?type=surplus",
    bgColor: "linear-gradient(135deg, #26AA6C 0%, #2ECC71 100%)",
  },
  {
    id: "b3",
    title: "Hidden Gem Ketintang",
    subtitle: "Temukan UMKM tersembunyi di sekitar kampus UNESA",
    image: "/images/foods/rawon_surabaya.jpg",
    link: "/hidden-gem",
    bgColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
];

// ===== Reviews =====
export const reviews: Review[] = [
  {
    id: "r1", userId: "buyer1", userName: "Ahmad F.", rating: 5,
    comment: "Rawon-nya enak banget! Kuahnya gurih, dagingnya empuk. Pasti beli lagi.",
    createdAt: "2026-09-20T10:00:00Z", productId: "p2", umkmId: "u1",
  },
  {
    id: "r2", userId: "buyer2", userName: "Dina S.", rating: 4,
    comment: "Bakso uratnya besar banget, kuahnya kaldu banget. Recommended!",
    createdAt: "2026-09-19T14:30:00Z", productId: "p3", umkmId: "u2",
  },
  {
    id: "r3", userId: "buyer3", userName: "Rizki A.", rating: 5,
    comment: "Es tehnya segar, rempahnya berasa. Harga mahasiswa banget.",
    createdAt: "2026-09-18T09:15:00Z", productId: "p5", umkmId: "u4",
  },
  {
    id: "r4", userId: "buyer4", userName: "Putri N.", rating: 5,
    comment: "Klepon dan onde-ondenya fresh banget, beli surplus tapi rasanya tetap juara!",
    createdAt: "2026-09-21T07:45:00Z", productId: "p10", umkmId: "u5",
  },
];

// ===== Orders =====
export const orders: Order[] = [
  {
    id: "o1", orderNumber: "SB-20260922-001",
    products: [
      { productId: "p1", productName: "Nasi Pecel Komplit", quantity: 2, price: 15000, image: "/images/foods/nasi_pecel.jpg" },
    ],
    totalPrice: 30000, status: "ready_for_pickup", paymentMethod: "QRIS",
    pickupTime: "12:00 - 13:00", createdAt: "2026-09-22T08:00:00Z", umkmName: "Warung Bu Siti",
  },
  {
    id: "o2", orderNumber: "SB-20260921-042",
    products: [
      { productId: "p3", productName: "Bakso Urat Jumbo", quantity: 1, price: 20000, image: "/images/foods/bakso_urat.jpg" },
      { productId: "p5", productName: "Es Teh Solo Spesial", quantity: 1, price: 8000, image: "/images/foods/es_teh_solo.jpg" },
    ],
    totalPrice: 28000, status: "completed", paymentMethod: "QRIS",
    pickupTime: "Selesai", createdAt: "2026-09-21T12:00:00Z", umkmName: "Bakso Pak Darmo",
  },
  {
    id: "o3", orderNumber: "SB-20260920-017",
    products: [
      { productId: "p2", productName: "Rawon Surabaya", quantity: 1, price: 25000, image: "/images/foods/rawon_surabaya.jpg" },
    ],
    totalPrice: 25000, status: "paid", paymentMethod: "QRIS",
    pickupTime: "11:00 - 12:00", createdAt: "2026-09-20T09:10:00Z", umkmName: "Warung Bu Siti",
  },
  {
    id: "o4", orderNumber: "SB-20260919-088",
    products: [
      { productId: "p10", productName: "Klepon & Onde-Onde (5pcs)", quantity: 2, price: 5000, image: "/images/foods/klepon_onde_onde.jpg" },
    ],
    totalPrice: 10000, status: "completed", paymentMethod: "GoPay",
    pickupTime: "Selesai", createdAt: "2026-09-19T07:20:00Z", umkmName: "Jajanan Ibu Lestari",
  },
  {
    id: "o5", orderNumber: "SB-20260918-054",
    products: [
      { productId: "p6", productName: "Nasi Ayam Penyet", quantity: 1, price: 12000, image: "/images/foods/ayam_penyet.jpg" },
    ],
    totalPrice: 12000, status: "completed", paymentMethod: "QRIS",
    pickupTime: "Selesai", createdAt: "2026-09-18T11:45:00Z", umkmName: "Ayam Geprek Mas Eko",
  },
  {
    id: "o6", orderNumber: "SB-20260917-009",
    products: [
      { productId: "p7", productName: "Paket Bakso + Es Teh", quantity: 1, price: 18000, image: "/images/foods/paket_bakso_esteh.jpg" },
    ],
    totalPrice: 18000, status: "cancelled", paymentMethod: "COD",
    pickupTime: "Dibatalkan", createdAt: "2026-09-17T10:05:00Z", umkmName: "Bakso Pak Darmo",
  },
];

// ===== Seller Analytics (Warung Bu Siti) =====
// Data 7 hari terakhir untuk mesin analisis penjualan di dashboard UMKM.
// Urutan: paling lama → hari ini.

const DAY_LABELS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

function buildRecentDates(count: number): { date: string; label: string }[] {
  const today = new Date();
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (count - 1 - i));
    return {
      date: d.toISOString().slice(0, 10),
      label: i === count - 1 ? "Hari ini" : DAY_LABELS[d.getDay()],
    };
  });
}

const SELLER_DAILY_RAW = [
  { revenue: 310000, orders: 6, portions: 24, surplus: 7 },
  { revenue: 365000, orders: 9, portions: 28, surplus: 6 },
  { revenue: 298000, orders: 7, portions: 22, surplus: 8 },
  { revenue: 412000, orders: 10, portions: 30, surplus: 6 },
  { revenue: 385000, orders: 9, portions: 27, surplus: 5 },
  { revenue: 402000, orders: 9, portions: 28, surplus: 6 },
  { revenue: 450000, orders: 8, portions: 32, surplus: 5 },
];

// Riwayat 30 hari untuk grafik tren omzet yang interaktif.
// Tujuh data terakhir sengaja sama persis dengan SELLER_DAILY_RAW
// agar angka analisis, prediksi, dan dashboard tetap konsisten.
const SELLER_HISTORY_RAW = [
  { revenue: 256000, orders: 6, portions: 20, surplus: 9 },
  { revenue: 284000, orders: 6, portions: 22, surplus: 8 },
  { revenue: 312000, orders: 7, portions: 24, surplus: 8 },
  { revenue: 298000, orders: 7, portions: 23, surplus: 7 },
  { revenue: 336000, orders: 8, portions: 26, surplus: 7 },
  { revenue: 352000, orders: 8, portions: 27, surplus: 6 },
  { revenue: 274000, orders: 6, portions: 21, surplus: 9 },
  { revenue: 288000, orders: 7, portions: 22, surplus: 8 },
  { revenue: 304000, orders: 7, portions: 23, surplus: 8 },
  { revenue: 326000, orders: 8, portions: 25, surplus: 7 },
  { revenue: 318000, orders: 7, portions: 24, surplus: 7 },
  { revenue: 368000, orders: 9, portions: 28, surplus: 6 },
  { revenue: 384000, orders: 9, portions: 29, surplus: 6 },
  { revenue: 296000, orders: 7, portions: 23, surplus: 8 },
  { revenue: 322000, orders: 8, portions: 25, surplus: 7 },
  { revenue: 340000, orders: 8, portions: 26, surplus: 7 },
  { revenue: 358000, orders: 9, portions: 27, surplus: 6 },
  { revenue: 346000, orders: 8, portions: 26, surplus: 6 },
  { revenue: 390000, orders: 10, portions: 30, surplus: 5 },
  { revenue: 404000, orders: 10, portions: 31, surplus: 5 },
  { revenue: 318000, orders: 7, portions: 24, surplus: 7 },
  { revenue: 336000, orders: 8, portions: 26, surplus: 6 },
  { revenue: 354000, orders: 9, portions: 27, surplus: 6 },
  ...SELLER_DAILY_RAW,
];

export const sellerSalesHistory: DailySalesPoint[] = buildRecentDates(
  SELLER_HISTORY_RAW.length
).map((day, i) => ({ ...day, ...SELLER_HISTORY_RAW[i] }));

export const sellerWeeklySales: DailySalesPoint[] = sellerSalesHistory.slice(
  -SELLER_DAILY_RAW.length
);

export const sellerHourlyTraffic: HourlyTrafficPoint[] = [
  { hour: "07", orders: 1 },
  { hour: "08", orders: 3 },
  { hour: "09", orders: 4 },
  { hour: "10", orders: 7 },
  { hour: "11", orders: 12 },
  { hour: "12", orders: 13 },
  { hour: "13", orders: 8 },
  { hour: "14", orders: 4 },
  { hour: "15", orders: 3 },
  { hour: "16", orders: 2 },
  { hour: "17", orders: 1 },
];

// ===== Seller Orders (Warung Bu Siti) =====
export const sellerOrders: SellerOrder[] = [
  {
    id: "SB-001", customer: "Ahmad F.", items: "2x Nasi Pecel Komplit",
    total: 30000, status: "Siap Pickup", createdAt: "08:10", pickupCode: "PKP-4821",
  },
  {
    id: "SB-002", customer: "Dina S.", items: "1x Rawon Surabaya",
    total: 25000, status: "Baru Dibayar", createdAt: "08:25", pickupCode: "PKP-4822",
  },
  {
    id: "SB-003", customer: "Rizki A.", items: "3x Nasi Campur Bali",
    total: 36000, status: "Baru Dibayar", createdAt: "08:42", pickupCode: "PKP-4823",
  },
  {
    id: "SB-004", customer: "Putri N.", items: "2x Nasi Pecel Komplit + 2x Rawon Surabaya",
    total: 80000, status: "Siap Pickup", createdAt: "09:05", pickupCode: "PKP-4824",
  },
  {
    id: "SB-005", customer: "Bagas P.", items: "1x Nasi Pecel Komplit",
    total: 15000, status: "Baru Dibayar", createdAt: "09:18", pickupCode: "PKP-4825",
  },
  {
    id: "SB-006", customer: "Sinta M.", items: "2x Rawon Surabaya",
    total: 50000, status: "Selesai", createdAt: "07:30", pickupCode: "PKP-4826",
  },
  {
    id: "SB-007", customer: "Yoga A.", items: "1x Nasi Campur Bali + 1x Nasi Pecel Komplit",
    total: 27000, status: "Selesai", createdAt: "07:55", pickupCode: "PKP-4827",
  },
  {
    id: "SB-008", customer: "Nadia K.", items: "1x Nasi Pecel Komplit",
    total: 15000, status: "Selesai", createdAt: "08:05", pickupCode: "PKP-4828",
  },
  {
    id: "SB-009", customer: "Fajar R.", items: "1x Rawon Surabaya",
    total: 25000, status: "Dibatalkan", createdAt: "09:32", pickupCode: "PKP-4829",
  },
];

// ===== Settlement History =====
export const settlementHistory: Settlement[] = [
  { id: "STL-0922", date: "2026-09-22", amount: 1250000, status: "Menunggu", method: "BCA •••• 8821" },
  { id: "STL-0915", date: "2026-09-15", amount: 2140000, status: "Dicairkan", method: "BCA •••• 8821" },
  { id: "STL-0908", date: "2026-09-08", amount: 1890000, status: "Dicairkan", method: "BCA •••• 8821" },
  { id: "STL-0901", date: "2026-09-01", amount: 1640000, status: "Dicairkan", method: "BCA •••• 8821" },
  { id: "STL-0825", date: "2026-08-25", amount: 1420000, status: "Diproses", method: "BCA •••• 8821" },
  { id: "STL-0818", date: "2026-08-18", amount: 1725000, status: "Dicairkan", method: "BCA •••• 8821" },
];

// ===== Seller Surplus =====
export const sellerSurplus: SurplusItem[] = [
  {
    id: "SRP-001", name: "Nasi Pecel Komplit", portions: 12,
    originalPrice: 15000, price: 9000, pickupWindow: "Hari ini 17:00 - 19:00", status: "Aktif",
  },
  {
    id: "SRP-002", name: "Nasi Campur Bali", portions: 4,
    originalPrice: 12000, price: 7000, pickupWindow: "Hari ini 16:00 - 18:00", status: "Aktif",
  },
  {
    id: "SRP-003", name: "Rawon Surabaya", portions: 6,
    originalPrice: 25000, price: 15000, pickupWindow: "Kemarin 17:00 - 19:00", status: "Habis",
  },
  {
    id: "SRP-004", name: "Nasi Pecel Komplit", portions: 3,
    originalPrice: 15000, price: 9000, pickupWindow: "Kemarin 17:00 - 19:00", status: "Kedaluwarsa",
  },
];

// ===== Seller Surplus Bundles (Kombinasi Reguler + Surplus Pelindung Margin) =====
export const sellerSurplusBundles: SurplusBundle[] = [
  {
    id: "BND-001",
    name: "Paket Combo Penyelamat: Nasi Pecel + Telur Bali + Es Teh",
    regularItem: "1x Nasi Pecel Komplit (Menu Reguler)",
    surplusItem: "1x Telur Balado & Tempe Orek (Surplus)",
    drinksItem: "1x Es Teh Manis Jumbo",
    bundlePrice: 19000,
    normalPrice: 29000,
    portions: 5,
    status: "Aktif",
    marginProtectionRate: "68% Margin Terlindungi",
  },
  {
    id: "BND-002",
    name: "Mystery Bag Warung Bu Siti: 2 Porsi Surprise Campur",
    regularItem: "1x Nasi Campur Bali Reguler",
    surplusItem: "1x Porsi Lauk Harian Dapur (Surplus)",
    drinksItem: "1x Kerupuk Kaleng",
    bundlePrice: 22000,
    normalPrice: 35000,
    portions: 3,
    status: "Aktif",
    marginProtectionRate: "72% Margin Terlindungi",
  },
];

// ===== Buyer Vouchers =====
export const vouchers: Voucher[] = [
  {
    id: "v1", title: "Diskon Rp5.000", code: "HEMAT5RB", minSpend: 25000,
    discount: 5000, type: "nominal", expiresAt: "23 Sep 2026",
  },
  {
    id: "v2", title: "Diskon 20% (maks Rp10.000)", code: "RESCUE20", minSpend: 30000,
    discount: 20, type: "percent", expiresAt: "30 Sep 2026",
  },
  {
    id: "v3", title: "Gratis Ongkir Pickup", code: "PICKUPFREE", minSpend: 0,
    discount: 4000, type: "nominal", expiresAt: "21 Sep 2026",
  },
  {
    id: "v4", title: "Diskon Rp10.000", code: "SURPLUS10", minSpend: 50000,
    discount: 10000, type: "nominal", expiresAt: "15 Okt 2026",
  },
];

export const favoriteProductIds = ["p2", "p5", "p10", "p11"];

// ===== Admin Users =====
export const adminUsers: AdminUser[] = [
  { id: "buyer1", name: "Ahmad Rizky", email: "ahmad@student.unesa.ac.id", role: "buyer", status: "Aktif", joinedAt: "2026-02-14", orders: 27 },
  { id: "buyer2", name: "Dina Salsabila", email: "dina@student.unesa.ac.id", role: "buyer", status: "Aktif", joinedAt: "2026-03-02", orders: 18 },
  { id: "buyer3", name: "Rizki Ardiansyah", email: "rizki@student.unesa.ac.id", role: "buyer", status: "Aktif", joinedAt: "2026-04-21", orders: 12 },
  { id: "seller1", name: "Siti Aminah", email: "bu.siti@secondbit.id", role: "seller", status: "Aktif", joinedAt: "2025-11-08", orders: 0 },
  { id: "seller2", name: "Darmo Wijaya", email: "pak.darmo@secondbit.id", role: "seller", status: "Aktif", joinedAt: "2026-01-19", orders: 0 },
  { id: "buyer4", name: "Putri Nabila", email: "putri@student.unesa.ac.id", role: "buyer", status: "Ditangguhkan", joinedAt: "2026-05-30", orders: 6 },
  { id: "admin1", name: "Admin SecondBit", email: "admin@secondbit.id", role: "admin", status: "Aktif", joinedAt: "2025-10-01", orders: 0 },
];

// ===== Helper Functions =====
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function getDiscountPercent(original: number, current: number): number {
  return Math.round(((original - current) / original) * 100);
}

export function getFlashDealProducts(): Product[] {
  return products.filter((p) => p.type === "flash-deal");
}

export function getSurplusProducts(): Product[] {
  return products.filter((p) => p.type === "surplus");
}

export function getBundleProducts(): Product[] {
  return products.filter((p) => p.type === "bundle" || p.isBundle);
}

export function getBestSellerProducts(): Product[] {
  return products.filter((p) => p.isBestSeller);
}

export function getHiddenGemUMKM(): UMKM[] {
  return umkmList.filter((u) => u.isHiddenGem);
}

export function getProductsByUMKM(umkmId: string): Product[] {
  return products.filter((p) => p.umkmId === umkmId);
}

export function getUMKMById(id: string): UMKM | undefined {
  return umkmList.find((u) => u.id === id);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug || p.id === slug);
}

export function getUMKMBySlug(slug: string): UMKM | undefined {
  return umkmList.find((u) => u.slug === slug || u.id === slug);
}

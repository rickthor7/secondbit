import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { ThemeProvider } from "@/hooks/useTheme";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { isDashboardPath, type DashboardRole } from "@/config/dashboardConfig";

// Public pages
import Home from "@/pages/Home";
import Explore from "@/pages/Explore";
import FlashDeals from "@/pages/FlashDeals";
import HiddenGem from "@/pages/HiddenGem";
import ProductDetail from "@/pages/ProductDetail";
import UMKMDetail from "@/pages/UMKMDetail";
import Login from "@/pages/Login";
import Register from "@/pages/Register";

// Buyer pages
import BuyerDashboard from "@/pages/buyer/Dashboard";
import BuyerOrders from "@/pages/buyer/Orders";
import BuyerPickup from "@/pages/buyer/Pickup";
import BuyerImpact from "@/pages/buyer/Impact";
import BuyerFavorites from "@/pages/buyer/Favorites";
import BuyerVouchers from "@/pages/buyer/Vouchers";
import BuyerReviews from "@/pages/buyer/Reviews";

// Seller pages
import SellerDashboard from "@/pages/seller/Dashboard";
import SellerAnalytics from "@/pages/seller/Analytics";
import SellerProducts from "@/pages/seller/Products";
import SellerOrders from "@/pages/seller/Orders";
import SellerSurplus from "@/pages/seller/Surplus";
import SellerScanner from "@/pages/seller/Scanner";
import SellerBalance from "@/pages/seller/Balance";
import SOPAndRiskMitigation from "@/pages/seller/SOPAndRiskMitigation";

// Admin pages
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminActivity from "@/pages/admin/Activity";
import AdminReports from "@/pages/admin/Reports";
import AdminModulePage from "@/pages/admin/ModulePage";

function withLayout(role: DashboardRole, page: ReactNode) {
  return <DashboardLayout role={role}>{page}</DashboardLayout>;
}

function AppShell() {
  const location = useLocation();
  const inDashboard = isDashboardPath(location.pathname);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      {!inDashboard && <Navbar />}

      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/flash-deals" element={<FlashDeals />} />
          <Route path="/hidden-gem" element={<HiddenGem />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/umkm/:slug" element={<UMKMDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Buyer */}
          <Route path="/buyer" element={withLayout("buyer", <BuyerDashboard />)} />
          <Route path="/buyer/dashboard" element={<Navigate to="/buyer" replace />} />
          <Route path="/buyer/orders" element={withLayout("buyer", <BuyerOrders />)} />
          <Route path="/buyer/pickup" element={withLayout("buyer", <BuyerPickup />)} />
          <Route path="/buyer/impact" element={withLayout("buyer", <BuyerImpact />)} />
          <Route path="/buyer/favorites" element={withLayout("buyer", <BuyerFavorites />)} />
          <Route path="/buyer/vouchers" element={withLayout("buyer", <BuyerVouchers />)} />
          <Route path="/buyer/reviews" element={withLayout("buyer", <BuyerReviews />)} />

          {/* Seller */}
          <Route path="/seller" element={withLayout("seller", <SellerDashboard />)} />
          <Route path="/seller/dashboard" element={<Navigate to="/seller" replace />} />
          <Route path="/seller/analytics" element={withLayout("seller", <SellerAnalytics />)} />
          <Route path="/seller/products" element={withLayout("seller", <SellerProducts />)} />
          <Route path="/seller/orders" element={withLayout("seller", <SellerOrders />)} />
          <Route path="/seller/surplus" element={withLayout("seller", <SellerSurplus />)} />
          <Route path="/seller/sop-risk" element={withLayout("seller", <SOPAndRiskMitigation />)} />
          <Route path="/seller/scanner" element={withLayout("seller", <SellerScanner />)} />
          <Route path="/seller/balance" element={withLayout("seller", <SellerBalance />)} />

          {/* Admin */}
          <Route path="/admin" element={withLayout("admin", <AdminDashboard />)} />
          <Route path="/admin/dashboard" element={<Navigate to="/admin" replace />} />
          <Route path="/admin/activity" element={withLayout("admin", <AdminActivity />)} />
          <Route path="/admin/reports" element={withLayout("admin", <AdminReports />)} />
          <Route path="/admin/users" element={withLayout("admin", <AdminModulePage moduleKey="users" />)} />
          <Route path="/admin/umkm" element={withLayout("admin", <AdminModulePage moduleKey="umkm" />)} />
          <Route path="/admin/products" element={withLayout("admin", <AdminModulePage moduleKey="products" />)} />
          <Route path="/admin/transactions" element={withLayout("admin", <AdminModulePage moduleKey="transactions" />)} />
          <Route path="/admin/settlements" element={withLayout("admin", <AdminModulePage moduleKey="settlements" />)} />
          <Route path="/admin/reviews" element={withLayout("admin", <AdminModulePage moduleKey="reviews" />)} />

          {/* Catch-all redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {!inDashboard && <Footer />}
      {!inDashboard && <BottomNav />}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </ThemeProvider>
  );
}

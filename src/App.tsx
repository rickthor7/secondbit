import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/hooks/useTheme";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { isDashboardPath } from "@/config/dashboardConfig";

// Pages
import Home from "@/pages/Home";
import Explore from "@/pages/Explore";
import FlashDeals from "@/pages/FlashDeals";
import HiddenGem from "@/pages/HiddenGem";
import ProductDetail from "@/pages/ProductDetail";
import UMKMDetail from "@/pages/UMKMDetail";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import BuyerDashboard from "@/pages/buyer/Dashboard";
import SellerDashboard from "@/pages/seller/Dashboard";
import AdminDashboard from "@/pages/admin/Dashboard";

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
          <Route
            path="/buyer"
            element={
              <DashboardLayout role="buyer">
                <BuyerDashboard />
              </DashboardLayout>
            }
          />
          <Route
            path="/buyer/dashboard"
            element={
              <DashboardLayout role="buyer">
                <BuyerDashboard />
              </DashboardLayout>
            }
          />

          {/* Seller */}
          <Route
            path="/seller"
            element={
              <DashboardLayout role="seller">
                <SellerDashboard />
              </DashboardLayout>
            }
          />
          <Route
            path="/seller/dashboard"
            element={
              <DashboardLayout role="seller">
                <SellerDashboard />
              </DashboardLayout>
            }
          />

          {/* Admin */}
          <Route
            path="/admin"
            element={
              <DashboardLayout role="admin">
                <AdminDashboard />
              </DashboardLayout>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <DashboardLayout role="admin">
                <AdminDashboard />
              </DashboardLayout>
            }
          />
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

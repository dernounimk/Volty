import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import "./i18n/i18n";
import { useTranslation } from 'react-i18next';

import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage";
import CategoryPage from "./pages/CategoryPage";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import { useAdminAuthStore } from "./stores/useAdminAuthStore";
import { useCartStore } from "./stores/useCartStore";
import CartPage from "./pages/CartPage";
import PurchaseSuccessPage from "./pages/PurchaseSuccessPage";
import ShippingInfoPage from "./pages/ShippingInfoPage";
import AdminLogin from "./pages/AdminLogin";
import ProductPage from "./pages/ProductPage";
import Contact from "./pages/Contact";
import Footer from "./components/Footer";
import Faq from "./pages/Faq";
import Confidentiality from "./pages/Confidentiality";
import Terms from "./pages/Terms";
import ScrollToTop from "./components/ScrollToTop";
import NotFoundPage from "./pages/NotFoundPage";
import FavoritesPage from "./pages/FavoritesPage";
import ScrollToTopButton from "./components/ScrollToTopButton";
import Background from "./components/Background";
import SearchResultsPage from "./pages/SearchResultsPage";
import AppPage from "./pages/AppPage";

// 🆕 Offline support
import useOnlineStatus from "./hooks/useOnlineStatus";
import OfflinePage from "./pages/OfflinePage";

function App() {
  const { i18n } = useTranslation();
  const calculateTotals = useCartStore((state) => state.calculateTotals);
  const checkAuth = useAdminAuthStore((state) => state.checkAuth);

  const isOnline = useOnlineStatus();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    calculateTotals();
  }, []);

  // 🔴 إذا لا يوجد إنترنت
  if (!isOnline) {
    return <OfflinePage />;
  }

  return (
    <div
      className="min-h-screen bg-transparent text-gray-900 dark:text-white relative"
      dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* الخلفية الثابتة */}
      <Background />

      <ScrollToTop />

      <div className="relative z-50">
        <Navbar />

        <main className="pt-24 pb-8 md:pb-0 min-h-screen">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/dash" element={<AdminPage />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/app" element={<AppPage />} />
            <Route path="/purchase-success" element={<PurchaseSuccessPage />} />
            <Route path="/shipping-info" element={<ShippingInfoPage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/privacy-policy" element={<Confidentiality />} />
            <Route path="/terms-of-use" element={<Terms />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        <Footer />
        <ScrollToTopButton />
      </div>

      <Toaster
        containerStyle={{ zIndex: 11000 }}
        toastOptions={{
          className: "dark:bg-gray-800 dark:text-white",
        }}
      />
    </div>
  );
}

export default App;

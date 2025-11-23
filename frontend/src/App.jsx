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

function App() {
  const { i18n } = useTranslation();
  const calculateTotals = useCartStore((state) => state.calculateTotals);
  const checkAuth = useAdminAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    calculateTotals();
  }, []);

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 text-gray-900 dark:text-white relative' dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-800 dark:to-purple-800 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-green-200 to-cyan-200 dark:from-green-800 dark:to-cyan-800 rounded-full blur-3xl opacity-30"></div>
      </div>

      <ScrollToTop/>
      <div className='relative z-50'>
        <Navbar />
        {/* إضافة pb-8 للهواتف لتعويض مساحة البحث */}
        <main className="pt-20 pb-8 md:pb-0 min-h-screen">
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/dash' element={<AdminPage />} />
            <Route path='/category/:category' element={<CategoryPage />} />
            <Route path='/cart' element={<CartPage />} />
            <Route path='/purchase-success' element={<PurchaseSuccessPage />} />
            <Route path='/shipping-info' element={<ShippingInfoPage />} />
            <Route path='/admin/login' element={<AdminLogin/>} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/faq" element={<Faq/>} />
            <Route path="/privacy-policy" element={<Confidentiality/>} />
            <Route path="/terms-of-use" element={<Terms/>} />
            <Route path="*" element={<NotFoundPage/>} />
            <Route path="/favorites" element={<FavoritesPage/>} />
          </Routes>
        </main>
        <Footer/>
        <ScrollToTopButton />
      </div>
      <Toaster 
        containerStyle={{ zIndex: 11000 }} 
        toastOptions={{
          className: 'dark:bg-gray-800 dark:text-white',
        }}
      />
    </div>
  );
}

export default App;
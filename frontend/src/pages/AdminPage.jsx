import { BarChart, PlusCircle, ShoppingBasket, ClipboardList, TicketPercent, Settings, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AnalyticsTab from "../components/AnalyticsTab";
import CreateProductForm from "../components/CreateProductForm";
import ProductsList from "../components/ProductsList";
import { useProductStore } from "../stores/useProductStore";
import { useAdminAuthStore } from "../stores/useAdminAuthStore";
import OrdersList from "../components/OrderList";
import CouponManager from "../components/CouponManager";
import LoadingSpinner from "../components/LoadingSpinner";
import SettingsManager from "../components/SettingsManager";
import { toast } from "react-hot-toast";

const tabs = [
  { id: "analytics", labelKey: "adminPage.tabs.analytics", icon: BarChart },
  { id: "create", labelKey: "adminPage.tabs.create", icon: PlusCircle },
  { id: "products", labelKey: "adminPage.tabs.products", icon: ShoppingBasket },
  { id: "orders", labelKey: "adminPage.tabs.orders", icon: ClipboardList },
  { id: "coupons", labelKey: "adminPage.tabs.coupons", icon: TicketPercent },
  { id: "settings", labelKey: "adminPage.tabs.settings", icon: Settings },
];

const AdminPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [activeTab, setActiveTab] = useState("analytics");
  const { fetchAllProducts } = useProductStore();
  const { admin, checkAuth, checkingAuth, logout } = useAdminAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (!checkingAuth && !admin) {
      navigate("/admin/login");
    }
  }, [admin, checkingAuth, navigate]);

  useEffect(() => {
    if (!checkingAuth && admin?.role === "admin") {
      fetchAllProducts();
    }
  }, [fetchAllProducts, admin, checkingAuth]);

  const handleLogout = () => {
    logout();
    toast.success(t("logout.success"));
    navigate("/");
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (!admin) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-md opacity-75"></div>
              <div className="relative bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-lg">
                <BarChart className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                {t("adminPage.title")}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                {t("adminPage.welcome", { name: admin.name || admin.email })}
              </p>
            </div>
          </div>

          <motion.button
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <LogOut className="w-5 h-5" />
            {t("adminPage.logout")}
          </motion.button>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          className="flex flex-nowrap gap-3 mb-8 overflow-x-auto scrollbar-x-hide"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-6 py-4 rounded-2xl whitespace-nowrap transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <tab.icon className="w-5 h-5" />
              {t(tab.labelKey)}
            </motion.button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          {activeTab === "create" && <CreateProductForm />}
          {activeTab === "products" && <ProductsList />}
          {activeTab === "analytics" && <AnalyticsTab />}
          {activeTab === "orders" && <OrdersList />}
          {activeTab === "coupons" && <CouponManager />}
          {activeTab === "settings" && <SettingsManager />}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminPage;
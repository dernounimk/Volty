import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "../lib/axios";
import { createPortal } from "react-dom";
import { 
  Package, ShoppingCart, Star, CheckCircle, Clock, Ticket,
  Zap, ZapOff, TrendingUp, TicketPercent, List, X,
  Home, BarChart3, DollarSign
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import LoadingSpinner from "./LoadingSpinner";
import { useTranslation } from "react-i18next";

export const AnalyticsTab = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const [analyticsData, setAnalyticsData] = useState({
    products: { total: 0, featured: 0, regular: 0 },
    orders: { total: 0, confirmed: 0, pending: 0 },
    coupons: { total: 0, active: 0, inactive: 0 },
    revenue: { 
      withDelivery: 0, 
      withoutDelivery: 0,
      totalDiscounts: 0,
      netWithDelivery: 0,
      netWithoutDelivery: 0
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [dailyOrdersData, setDailyOrdersData] = useState([]);
  const [revenueMode, setRevenueMode] = useState("withoutDelivery");
  const [showRevenuePopup, setShowRevenuePopup] = useState(false);
  const [selectedRange, setSelectedRange] = useState(30);
  const [selectedDate, setSelectedDate] = useState("");

  const formatNumber = (value) => value?.toLocaleString("en-US") || "0";

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const response = await axios.get("/analytics");
        
        const defaultData = {
          analyticsData: {
            products: { total: 0, featured: 0, regular: 0 },
            orders: { total: 0, confirmed: 0, pending: 0 },
            coupons: { total: 0, active: 0, inactive: 0 },
            revenue: { 
              withDelivery: 0, 
              withoutDelivery: 0,
              totalDiscounts: 0,
              netWithDelivery: 0,
              netWithoutDelivery: 0
            }
          },
          dailySalesData: []
        };

        const data = response.data || defaultData;
        
        setAnalyticsData(data.analyticsData || defaultData.analyticsData);
        setDailyOrdersData(Array.isArray(data.dailySalesData) ? data.dailySalesData : []);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
        setAnalyticsData({
          products: { total: 0, featured: 0, regular: 0 },
          orders: { total: 0, confirmed: 0, pending: 0 },
          coupons: { total: 0, active: 0, inactive: 0 },
          revenue: { 
            withDelivery: 0, 
            withoutDelivery: 0,
            totalDiscounts: 0,
            netWithDelivery: 0,
            netWithoutDelivery: 0
          }
        });
        setDailyOrdersData([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalyticsData();
  }, []);

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <LoadingSpinner />
    </div>
  );

  // توليد بيانات الأيام
  const generateLastDaysData = (daysCount = 30) => {
    const today = new Date();
    const daysArray = [];

    for (let i = daysCount - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const isoDate = date.toISOString().split("T")[0];
      const existing = dailyOrdersData.find(
        (d) => new Date(d.date).toISOString().split("T")[0] === isoDate
      );

      daysArray.push(
        existing || {
          date: isoDate,
          orders: 0,
          netRevenueWithoutDelivery: 0,
          netRevenueWithDelivery: 0,
        }
      );
    }

    return daysArray;
  };

  // عرض آخر 7 أيام فقط في المنحنى
  const filteredData = (() => {
    if (dailyOrdersData.length <= 7) return generateLastDaysData(7);

    const sorted = [...dailyOrdersData].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    const lastSeven = sorted.slice(-7);

    return generateLastDaysData(7).map((day) => {
      const existing = lastSeven.find(
        (d) => new Date(d.date).toISOString().split("T")[0] === day.date
      );
      return (
        existing || {
          date: day.date,
          orders: 0,
          netRevenueWithoutDelivery: 0,
          netRevenueWithDelivery: 0,
        }
      );
    });
  })();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <motion.div
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <motion.h1 
            className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {t("analytics.dashboard")}
          </motion.h1>
          <motion.p 
            className="text-gray-600 dark:text-gray-300 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {t("analytics.overview")}
          </motion.p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <AnalyticsCard 
            title={t("analytics.totalProducts")} 
            value={analyticsData.products.total} 
            icon={Package} 
            color="blue"
            formatNumber={formatNumber}
          />
          <AnalyticsCard 
            title={t("analytics.featuredProducts")} 
            value={analyticsData.products.featured} 
            icon={Star} 
            color="purple"
            formatNumber={formatNumber}
          />
          <AnalyticsCard 
            title={t("analytics.regularProducts")} 
            value={analyticsData.products.regular} 
            icon={Package} 
            color="green"
            formatNumber={formatNumber}
          />
          <AnalyticsCard 
            title={t("analytics.totalOrders")} 
            value={analyticsData.orders.total} 
            icon={ShoppingCart} 
            color="orange"
            formatNumber={formatNumber}
          />
          <AnalyticsCard 
            title={t("analytics.confirmedOrders")} 
            value={analyticsData.orders.confirmed} 
            icon={CheckCircle} 
            color="green"
            formatNumber={formatNumber}
          />
          <AnalyticsCard 
            title={t("analytics.pendingOrders")} 
            value={analyticsData.orders.pending} 
            icon={Clock} 
            color="yellow"
            formatNumber={formatNumber}
          />
        </div>

        {/* Second Row Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <AnalyticsCard 
            title={t("analytics.totalCoupons")} 
            value={analyticsData.coupons.total} 
            icon={Ticket} 
            color="pink"
            formatNumber={formatNumber}
          />
          <AnalyticsCard 
            title={t("analytics.activeCoupons")} 
            value={analyticsData.coupons.active} 
            icon={Zap} 
            color="green"
            formatNumber={formatNumber}
          />
          <AnalyticsCard 
            title={t("analytics.inactiveCoupons")} 
            value={analyticsData.coupons.inactive} 
            icon={ZapOff} 
            color="red"
            formatNumber={formatNumber}
          />
        </div>

        {/* Revenue Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <AnalyticsCard
            title={t("analytics.totalDiscounts")}
            value={analyticsData.revenue.totalDiscounts}
            icon={TicketPercent}
            unit={t("analytics.revenueUnit")}
            color="red"
            formatNumber={formatNumber}
          />
          <RevenueCard 
            revenueMode={revenueMode}
            setRevenueMode={setRevenueMode}
            analyticsData={analyticsData}
            t={t}
            formatNumber={formatNumber}
            onShowPopup={() => setShowRevenuePopup(true)}
          />
        </div>

        {/* Chart Section */}
        <motion.div
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg mb-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-blue-600" />
              {t("analytics.salesOverview")}
            </h2>
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
              <button
                onClick={() => setRevenueMode("withoutDelivery")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  revenueMode === "withoutDelivery"
                    ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-gray-600 dark:text-gray-300 hover:text-blue-600"
                }`}
              >
                {t("analytics.withoutDelivery")}
              </button>
              <button
                onClick={() => setRevenueMode("withDelivery")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  revenueMode === "withDelivery"
                    ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-gray-600 dark:text-gray-300 hover:text-blue-600"
                }`}
              >
                {t("analytics.withDelivery")}
              </button>
            </div>
          </div>

          <div dir="ltr" className="min-w-0">
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  stroke="#6b7280"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    const isArabic = i18n.language === "ar";
                    const monthName = date.toLocaleDateString(
                      isArabic ? "ar-EG" : "en-US",
                      { month: "short" }
                    );
                    const day = date.getDate();
                    return `${day} ${monthName}`;
                  }}
                />
                <YAxis
                  stroke="#6b7280"
                  tick={{ fontSize: 12 }}
                  width={50}
                  tickFormatter={(value) => formatNumber(value)}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    backdropFilter: "blur(16px)",
                    fontSize: "14px",
                  }}
                  formatter={(value) => [formatNumber(value), ""]}
                />
                <Legend 
                  wrapperStyle={{ 
                    fontSize: "14px",
                    paddingTop: "10px"
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#f59e0b"
                  name={t("analytics.ordersLabel")}
                  strokeWidth={3}
                  dot={{ fill: "#f59e0b", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: "#f59e0b" }}
                />
                <Line
                  type="monotone"
                  dataKey={
                    revenueMode === "withDelivery"
                      ? "netRevenueWithDelivery"
                      : "netRevenueWithoutDelivery"
                  }
                  stroke="#8b5cf6"
                  name={t("analytics.revenueLabel")}
                  strokeWidth={3}
                  dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: "#8b5cf6" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Revenue History Popup */}
        {showRevenuePopup &&
          createPortal(
            <motion.div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-gray-200 dark:border-gray-700"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
              >
                {/* Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-700 rounded-t-2xl">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    <DollarSign className="w-6 h-6 text-green-500" />
                    {t("analytics.revenueHistory")}
                  </h3>
                  <button
                    onClick={() => setShowRevenuePopup(false)}
                    className="p-2 rounded-xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                    aria-label="close"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1 space-y-4">
                  {/* Filters */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <select
                      value={selectedRange}
                      onChange={(e) => {
                        setSelectedRange(Number(e.target.value));
                        setSelectedDate("");
                      }}
                      className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value={7}>{t("analytics.last7Days")}</option>
                      <option value={14}>{t("analytics.last14Days")}</option>
                      <option value={30}>{t("analytics.last30Days")}</option>
                    </select>

                    <select
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="">{t("analytics.allDates")}</option>
                      {dailyOrdersData.map((entry, idx) => {
                        const date = new Date(entry.date);
                        const formattedDate = date.toLocaleDateString(
                          "en-US",
                          { day: "numeric", month: "short", year: "numeric" }
                        );
                        const value = date.toISOString().split("T")[0];
                        return (
                          <option key={idx} value={value}>
                            {formattedDate}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  {/* Table */}
                  <div className="overflow-y-auto max-h-[400px] border border-gray-200 dark:border-gray-700 rounded-xl">
                    <table className="min-w-full text-sm">
                      <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
                        <tr>
                          <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-300 font-semibold border-b border-gray-200 dark:border-gray-600">
                            {t("analytics.date")}
                          </th>
                          <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-300 font-semibold border-b border-gray-200 dark:border-gray-600">
                            {t("analytics.numberOfOrders")}
                          </th>
                          <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-300 font-semibold border-b border-gray-200 dark:border-gray-600">
                            {t("analytics.revenueLabel")}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {generateLastDaysData(selectedRange)
                          .filter((entry) => {
                            if (!selectedDate) return true;
                            const day = new Date(entry.date).toISOString().split("T")[0];
                            return day === selectedDate;
                          })
                          .map((entry, idx) => {
                            const date = new Date(entry.date);
                            const formattedDate = date.toLocaleDateString("en-US", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            });
                            const revenueValue =
                              revenueMode === "withDelivery"
                                ? entry.netRevenueWithDelivery
                                : entry.netRevenueWithoutDelivery;
                            return (
                              <tr 
                                key={idx} 
                                className="border-b border-gray-100 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700 transition-all"
                              >
                                <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{formattedDate}</td>
                                <td className="py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">
                                  {formatNumber(entry.orders)}
                                </td>
                                <td className="py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">
                                  {formatNumber(revenueValue)} {t("analytics.revenueUnit")}
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            </motion.div>,
            document.body
          )}
      </motion.div>
    </div>
  );
};

/* بطاقة عامة */
const AnalyticsCard = ({ title, value, icon: Icon, unit, color = "blue", formatNumber }) => {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    purple: "from-purple-500 to-purple-600",
    green: "from-green-500 to-green-600",
    orange: "from-orange-500 to-orange-600",
    yellow: "from-yellow-500 to-yellow-600",
    pink: "from-pink-500 to-pink-600",
    red: "from-red-500 to-red-600"
  };

  return (
    <motion.div
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center">
        <div className="flex-1 min-w-0">
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1 truncate">
            {title}
          </p>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white truncate">
            {formatNumber(value)} {unit && <span className="text-sm">{unit}</span>}
          </h3>
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-r ${colorClasses[color]} text-white shadow-lg flex-shrink-0 ml-4`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  );
};

/* بطاقة الإيرادات */
const RevenueCard = ({ revenueMode, setRevenueMode, analyticsData, t, formatNumber, onShowPopup }) => (
  <motion.div
    className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ scale: 1.02 }}
    transition={{ duration: 0.3 }}
  >
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-blue-100 text-sm font-medium mb-1">
          {revenueMode === "withDelivery"
            ? t("analytics.netRevenueWithDelivery")
            : t("analytics.netRevenueWithoutDelivery")}
        </p>
        <h3 className="text-3xl font-bold">
          {revenueMode === "withDelivery"
            ? formatNumber(analyticsData.revenue.netWithDelivery)
            : formatNumber(analyticsData.revenue.netWithoutDelivery)}{" "}
          <span className="text-lg">{t("analytics.revenueUnit")}</span>
        </h3>
      </div>
      <TrendingUp className="w-10 h-10 text-white opacity-80 flex-shrink-0" />
    </div>

    <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
      <div className="flex rounded-lg overflow-hidden border border-white/20 bg-white/10 backdrop-blur-sm">
        <button
          onClick={() => setRevenueMode("withoutDelivery")}
          className={`px-4 py-2 text-sm font-medium transition-all ${
            revenueMode === "withoutDelivery"
              ? "bg-white text-blue-600"
              : "text-blue-100 hover:bg-white/20"
          }`}
        >
          {t("analytics.withoutDelivery")}
        </button>
        <button
          onClick={() => setRevenueMode("withDelivery")}
          className={`px-4 py-2 text-sm font-medium transition-all ${
            revenueMode === "withDelivery"
              ? "bg-white text-blue-600"
              : "text-blue-100 hover:bg-white/20"
          }`}
        >
          {t("analytics.withDelivery")}
        </button>
      </div>

      <button
        onClick={onShowPopup}
        className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 border border-white/30 text-white hover:bg-white/20 transition-all backdrop-blur-sm"
      >
        <List className="w-4 h-4" />
        {t("analytics.revenueHistory")}
      </button>
    </div>
  </motion.div>
);

export default AnalyticsTab;
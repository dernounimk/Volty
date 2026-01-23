import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "../lib/axios";
import { createPortal } from "react-dom";
import { 
  Package, ShoppingCart, Star, CheckCircle, Clock, Ticket,
  Zap, ZapOff, TrendingUp, TicketPercent, List, X,
  Home, BarChart3, DollarSign, TrendingDown, Users, CreditCard
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from "recharts";
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
  const [viewMode, setViewMode] = useState("chart"); // 'chart' or 'table'

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--color-bg-gradient-start)] to-[var(--color-bg-gradient-end)] dark:from-gray-900 dark:to-gray-800">
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

  // حساب النسبة المئوية للتغيير
  const calculateChangePercentage = () => {
    if (filteredData.length < 2) return 0;
    const current = filteredData[filteredData.length - 1];
    const previous = filteredData[filteredData.length - 2];
    const currentValue = revenueMode === "withDelivery" 
      ? current.netRevenueWithDelivery 
      : current.netRevenueWithoutDelivery;
    const previousValue = revenueMode === "withDelivery"
      ? previous.netRevenueWithDelivery
      : previous.netRevenueWithoutDelivery;
    
    if (previousValue === 0) return 100;
    return ((currentValue - previousValue) / previousValue) * 100;
  };

  const changePercentage = calculateChangePercentage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-bg-gradient-start)] to-[var(--color-bg-gradient-end)] py-8 px-4">
      <motion.div
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <motion.h1 
            className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[var(--color-electric)] to-[var(--color-accent)] bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {t("analytics.dashboard")}
          </motion.h1>
          <motion.p 
            className="text-[var(--color-text-secondary)] mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {t("analytics.overview")}
          </motion.p>
        </div>

        {/* Stats Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-[var(--color-bg)] backdrop-blur-xl rounded-2xl p-6 border border-[var(--color-border)] shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[var(--color-text-secondary)] text-sm font-medium mb-1">
                  {t("analytics.totalRevenue")}
                </p>
                <h3 className="text-2xl font-bold text-[var(--color-text)]">
                  {formatNumber(revenueMode === "withDelivery" 
                    ? analyticsData.revenue.netWithDelivery 
                    : analyticsData.revenue.netWithoutDelivery
                  )} DA
                </h3>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-r ${changePercentage >= 0 ? 'from-green-500 to-emerald-600' : 'from-red-500 to-rose-600'} text-white`}>
                {changePercentage >= 0 ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className={`flex items-center ${changePercentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {changePercentage >= 0 ? '↗' : '↘'} {Math.abs(changePercentage).toFixed(1)}%
              </span>
              <span className="text-[var(--color-text-secondary)] ml-2">
                {changePercentage >= 0 ? t("analytics.increase") : t("analytics.decrease")}
              </span>
            </div>
          </div>

          <div className="bg-[var(--color-bg)] backdrop-blur-xl rounded-2xl p-6 border border-[var(--color-border)] shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[var(--color-text-secondary)] text-sm font-medium mb-1">
                  {t("analytics.totalOrders")}
                </p>
                <h3 className="text-2xl font-bold text-[var(--color-text)]">
                  {formatNumber(analyticsData.orders.total)}
                </h3>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 text-white">
                <ShoppingCart className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm text-[var(--color-text-secondary)]">
                <span>{t("analytics.confirmed")}</span>
                <span className="font-medium text-[var(--color-text)]">{analyticsData.orders.confirmed}</span>
              </div>
              <div className="flex justify-between text-sm text-[var(--color-text-secondary)] mt-1">
                <span>{t("analytics.pending")}</span>
                <span className="font-medium text-[var(--color-text)]">{analyticsData.orders.pending}</span>
              </div>
            </div>
          </div>

          <div className="bg-[var(--color-bg)] backdrop-blur-xl rounded-2xl p-6 border border-[var(--color-border)] shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[var(--color-text-secondary)] text-sm font-medium mb-1">
                  {t("analytics.totalProducts")}
                </p>
                <h3 className="text-2xl font-bold text-[var(--color-text)]">
                  {formatNumber(analyticsData.products.total)}
                </h3>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600 text-white">
                <Package className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm text-[var(--color-text-secondary)]">
                <span>{t("analytics.featured")}</span>
                <span className="font-medium text-[var(--color-text)]">{analyticsData.products.featured}</span>
              </div>
              <div className="flex justify-between text-sm text-[var(--color-text-secondary)] mt-1">
                <span>{t("analytics.regular")}</span>
                <span className="font-medium text-[var(--color-text)]">{analyticsData.products.regular}</span>
              </div>
            </div>
          </div>

          <div className="bg-[var(--color-bg)] backdrop-blur-xl rounded-2xl p-6 border border-[var(--color-border)] shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[var(--color-text-secondary)] text-sm font-medium mb-1">
                  {t("analytics.coupons")}
                </p>
                <h3 className="text-2xl font-bold text-[var(--color-text)]">
                  {formatNumber(analyticsData.coupons.total)}
                </h3>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-violet-600 text-white">
                <TicketPercent className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm text-[var(--color-text-secondary)]">
                <span>{t("analytics.active")}</span>
                <span className="font-medium text-green-500">{analyticsData.coupons.active}</span>
              </div>
              <div className="flex justify-between text-sm text-[var(--color-text-secondary)] mt-1">
                <span>{t("analytics.inactive")}</span>
                <span className="font-medium text-red-500">{analyticsData.coupons.inactive}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Summary */}
        <div className="mb-8">
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
          className="bg-[var(--color-bg)] backdrop-blur-xl rounded-2xl p-6 border border-[var(--color-border)] shadow-lg mb-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h2 className="text-xl font-bold text-[var(--color-text)] flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-[var(--color-accent)]" />
                {t("analytics.salesOverview")}
              </h2>
              <p className="text-[var(--color-text-secondary)] text-sm mt-1">
                {t("analytics.last7Days")}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-[var(--color-bg-gray)] rounded-xl p-1">
                <button
                  onClick={() => setViewMode("chart")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    viewMode === "chart"
                      ? "bg-[var(--color-bg)] text-[var(--color-accent)] shadow-sm"
                      : "text-[var(--color-text-secondary)] hover:text-[var(--color-accent)]"
                  }`}
                >
                  {t("analytics.chart")}
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    viewMode === "table"
                      ? "bg-[var(--color-bg)] text-[var(--color-accent)] shadow-sm"
                      : "text-[var(--color-text-secondary)] hover:text-[var(--color-accent)]"
                  }`}
                >
                  {t("analytics.table")}
                </button>
              </div>
              <div className="flex items-center gap-2 bg-[var(--color-bg-gray)] rounded-xl p-1">
                <button
                  onClick={() => setRevenueMode("withoutDelivery")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    revenueMode === "withoutDelivery"
                      ? "bg-[var(--color-bg)] text-[var(--color-accent)] shadow-sm"
                      : "text-[var(--color-text-secondary)] hover:text-[var(--color-accent)]"
                  }`}
                >
                  {t("analytics.withoutDelivery")}
                </button>
                <button
                  onClick={() => setRevenueMode("withDelivery")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    revenueMode === "withDelivery"
                      ? "bg-[var(--color-bg)] text-[var(--color-accent)] shadow-sm"
                      : "text-[var(--color-text-secondary)] hover:text-[var(--color-accent)]"
                  }`}
                >
                  {t("analytics.withDelivery")}
                </button>
              </div>
            </div>
          </div>

          {viewMode === "chart" ? (
            <div dir="ltr" className="min-w-0">
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={filteredData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis
                    dataKey="date"
                    stroke="var(--color-text-secondary)"
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
                    stroke="var(--color-text-secondary)"
                    tick={{ fontSize: 12 }}
                    width={50}
                    tickFormatter={(value) => formatNumber(value)}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-bg)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "12px",
                      backdropFilter: "blur(16px)",
                      fontSize: "14px",
                      color: "var(--color-text)"
                    }}
                    formatter={(value, name) => {
                      if (name === t("analytics.revenueLabel")) {
                        return [formatNumber(value) + " DA", name];
                      }
                      return [formatNumber(value), name];
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ 
                      fontSize: "14px",
                      paddingTop: "10px",
                      color: "var(--color-text)"
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="orders"
                    stroke="#f59e0b"
                    fillOpacity={1}
                    fill="url(#colorOrders)"
                    name={t("analytics.ordersLabel")}
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey={
                      revenueMode === "withDelivery"
                        ? "netRevenueWithDelivery"
                        : "netRevenueWithoutDelivery"
                    }
                    stroke="var(--color-accent)"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    name={t("analytics.revenueLabel")}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--color-border)]">
                    <th className="py-3 px-4 text-left text-[var(--color-text-secondary)] font-semibold">
                      {t("analytics.date")}
                    </th>
                    <th className="py-3 px-4 text-left text-[var(--color-text-secondary)] font-semibold">
                      {t("analytics.orders")}
                    </th>
                    <th className="py-3 px-4 text-left text-[var(--color-text-secondary)] font-semibold">
                      {t("analytics.revenueLabel")}
                    </th>
                    <th className="py-3 px-4 text-left text-[var(--color-text-secondary)] font-semibold">
                      {t("analytics.trend")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((entry, index) => {
                    const date = new Date(entry.date);
                    const formattedDate = date.toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                    });
                    const revenueValue =
                      revenueMode === "withDelivery"
                        ? entry.netRevenueWithDelivery
                        : entry.netRevenueWithoutDelivery;
                    
                    // حساب الاتجاه
                    const prevEntry = index > 0 ? filteredData[index - 1] : null;
                    const prevRevenue = prevEntry 
                      ? revenueMode === "withDelivery"
                        ? prevEntry.netRevenueWithDelivery
                        : prevEntry.netRevenueWithoutDelivery
                      : null;
                    const trend = prevRevenue ? revenueValue > prevRevenue ? 'up' : 'down' : 'stable';

                    return (
                      <tr 
                        key={index} 
                        className="border-b border-[var(--color-border)] hover:bg-[var(--color-bg-gray)] transition-all"
                      >
                        <td className="py-3 px-4 text-[var(--color-text)]">{formattedDate}</td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-[var(--color-text)]">
                            {formatNumber(entry.orders)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-[var(--color-accent)]">
                            {formatNumber(revenueValue)} DA
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
                            {trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500" />}
                            <span className={`text-sm ${trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-[var(--color-text-secondary)]'}`}>
                              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[var(--color-bg)] backdrop-blur-xl rounded-2xl p-6 border border-[var(--color-border)]">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[var(--color-text-secondary)] text-sm">{t("analytics.confirmationRate")}</p>
                <h4 className="text-2xl font-bold text-[var(--color-text)]">
                  {analyticsData.orders.total > 0 
                    ? ((analyticsData.orders.confirmed / analyticsData.orders.total) * 100).toFixed(1)
                    : 0
                  }%
                </h4>
              </div>
            </div>
          </div>

          <div className="bg-[var(--color-bg)] backdrop-blur-xl rounded-2xl p-6 border border-[var(--color-border)]">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white">
                <TicketPercent className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[var(--color-text-secondary)] text-sm">{t("analytics.totalDiscounts")}</p>
                <h4 className="text-2xl font-bold text-[var(--color-text)]">
                  {formatNumber(analyticsData.revenue.totalDiscounts)} DA
                </h4>
              </div>
            </div>
          </div>

          <div className="bg-[var(--color-bg)] backdrop-blur-xl rounded-2xl p-6 border border-[var(--color-border)]">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-violet-600 text-white">
                <Star className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[var(--color-text-secondary)] text-sm">{t("analytics.featuredRatio")}</p>
                <h4 className="text-2xl font-bold text-[var(--color-text)]">
                  {analyticsData.products.total > 0 
                    ? ((analyticsData.products.featured / analyticsData.products.total) * 100).toFixed(1)
                    : 0
                  }%
                </h4>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue History Popup */}
        {showRevenuePopup &&
          createPortal(
            <motion.div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className="bg-[var(--color-bg)] rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-[var(--color-border)]"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
              >
                {/* Header */}
                <div className="p-6 border-b border-[var(--color-border)] flex justify-between items-center bg-gradient-to-r from-[var(--color-bg-gradient-start)] to-[var(--color-bg-gradient-end)] rounded-t-2xl">
                  <h3 className="text-xl font-bold text-[var(--color-text)] flex items-center gap-2">
                    <DollarSign className="w-6 h-6 text-[var(--color-accent)]" />
                    {t("analytics.revenueHistory")}
                  </h3>
                  <button
                    onClick={() => setShowRevenuePopup(false)}
                    className="p-2 rounded-xl text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-gray)] transition-all"
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
                      className="bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text)] rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-all"
                    >
                      <option value={7}>{t("analytics.last7Days")}</option>
                      <option value={14}>{t("analytics.last14Days")}</option>
                      <option value={30}>{t("analytics.last30Days")}</option>
                    </select>

                    <select
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text)] rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-all"
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
                  <div className="overflow-y-auto max-h-[400px] border border-[var(--color-border)] rounded-xl">
                    <table className="min-w-full text-sm">
                      <thead className="bg-[var(--color-bg-gray)] sticky top-0">
                        <tr>
                          <th className="py-3 px-4 text-left text-[var(--color-text-secondary)] font-semibold border-b border-[var(--color-border)]">
                            {t("analytics.date")}
                          </th>
                          <th className="py-3 px-4 text-left text-[var(--color-text-secondary)] font-semibold border-b border-[var(--color-border)]">
                            {t("analytics.numberOfOrders")}
                          </th>
                          <th className="py-3 px-4 text-left text-[var(--color-text-secondary)] font-semibold border-b border-[var(--color-border)]">
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
                                className="border-b border-[var(--color-border)] hover:bg-[var(--color-bg-gray)] transition-all"
                              >
                                <td className="py-3 px-4 text-[var(--color-text)]">{formattedDate}</td>
                                <td className="py-3 px-4 text-[var(--color-text)] font-medium">
                                  {formatNumber(entry.orders)}
                                </td>
                                <td className="py-3 px-4">
                                  <span className="font-bold text-[var(--color-accent)]">
                                    {formatNumber(revenueValue)} DA
                                  </span>
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

/* بطاقة الإيرادات */
const RevenueCard = ({ revenueMode, setRevenueMode, analyticsData, t, formatNumber, onShowPopup }) => (
  <motion.div
    className="bg-gradient-to-br from-[var(--color-electric)] to-[var(--color-accent)] rounded-2xl p-6 text-[var(--color-on-accent)] shadow-lg"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ scale: 1.02 }}
    transition={{ duration: 0.3 }}
  >
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-[var(--color-on-accent)]/80 text-sm font-medium mb-1">
          {revenueMode === "withDelivery"
            ? t("analytics.netRevenueWithDelivery")
            : t("analytics.netRevenueWithoutDelivery")}
        </p>
        <h3 className="text-3xl font-bold">
          {revenueMode === "withDelivery"
            ? formatNumber(analyticsData.revenue.netWithDelivery)
            : formatNumber(analyticsData.revenue.netWithoutDelivery)}{" "}
          <span className="text-lg">DA</span>
        </h3>
      </div>
      <TrendingUp className="w-10 h-10 text-[var(--color-on-accent)]/80 flex-shrink-0" />
    </div>

    <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
      <div className="flex rounded-lg overflow-hidden border border-[var(--color-on-accent)]/20 bg-[var(--color-on-accent)]/10 backdrop-blur-sm">
        <button
          onClick={() => setRevenueMode("withoutDelivery")}
          className={`px-4 py-2 text-sm font-medium transition-all ${
            revenueMode === "withoutDelivery"
              ? "bg-[var(--color-on-accent)] text-[var(--color-accent)]"
              : "text-[var(--color-on-accent)]/80 hover:bg-[var(--color-on-accent)]/20"
          }`}
        >
          {t("analytics.withoutDelivery")}
        </button>
        <button
          onClick={() => setRevenueMode("withDelivery")}
          className={`px-4 py-2 text-sm font-medium transition-all ${
            revenueMode === "withDelivery"
              ? "bg-[var(--color-on-accent)] text-[var(--color-accent)]"
              : "text-[var(--color-on-accent)]/80 hover:bg-[var(--color-on-accent)]/20"
          }`}
        >
          {t("analytics.withDelivery")}
        </button>
      </div>

      <button
        onClick={onShowPopup}
        className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 border border-[var(--color-on-accent)]/30 text-[var(--color-on-accent)] hover:bg-[var(--color-on-accent)]/20 transition-all backdrop-blur-sm"
      >
        <List className="w-4 h-4" />
        {t("analytics.revenueHistory")}
      </button>
    </div>
  </motion.div>
);

export default AnalyticsTab;
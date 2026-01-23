import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, Loader, EyeOff, Eye, Trash2, Copy, Gift, Percent, Calendar, Zap, ZapOff, DollarSign, Key, Clock, Users, Ticket } from "lucide-react";
import toast from "react-hot-toast";
import axios from "../lib/axios";
import LoadingSpinner from "./LoadingSpinner";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { createPortal } from "react-dom";

const CouponManager = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [coupons, setCoupons] = useState([]);
  const [newCoupon, setNewCoupon] = useState({ discountAmount: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedCouponId, setSelectedCouponId] = useState(null);
  const [stats, setStats] = useState({
    totalDiscounts: 0,
    totalActiveDiscounts: 0,
    mostUsedCoupon: null
  });

  const openPopup = (id) => {
    setSelectedCouponId(id);
    setShowPopup(true);
  };

  const fetchCoupons = async () => {
    try {
      console.log("🔄 جلب الكوبونات...");
      const res = await axios.get("/coupons/all");
      
      const couponsData = Array.isArray(res.data) ? res.data : [];
      
      console.log("✅ الكوبونات المستلمة:", couponsData);
      setCoupons(couponsData);
      
      // حساب الإحصائيات
      const totalDiscounts = couponsData.reduce((sum, coupon) => sum + coupon.discountAmount, 0);
      const activeCoupons = couponsData.filter(c => c.isActive);
      const totalActiveDiscounts = activeCoupons.reduce((sum, coupon) => sum + coupon.discountAmount, 0);
      const mostUsedCoupon = couponsData.reduce((max, coupon) => 
        (coupon.usageCount || 0) > (max?.usageCount || 0) ? coupon : max, null
      );
      
      setStats({
        totalDiscounts,
        totalActiveDiscounts,
        mostUsedCoupon
      });
    } catch (err) {
      console.error("❌ خطأ في جلب الكوبونات:", err);
      toast.error(t("coupon.fetchError"));
      setCoupons([]);
    } finally {
      setIsLoading(false);
    }
  };

  const createCoupon = async (e) => {
    e.preventDefault();
    
    if (!newCoupon.discountAmount || isNaN(newCoupon.discountAmount) || Number(newCoupon.discountAmount) <= 0) {
      toast.error(t("coupon.invalidAmount"));
      return;
    }

    try {
      setCreating(true);
      console.log("🔄 إنشاء كوبون جديد:", newCoupon);
      
      const res = await axios.post("/coupons/create", {
        discountAmount: Number(newCoupon.discountAmount)
      });
      
      console.log("✅ استجابة إنشاء الكوبون:", res.data);
      
      const newCouponData = res.data?.coupon || res.data;
      
      if (newCouponData) {
        setNewCoupon({ discountAmount: "" });
        toast.success(t("coupon.created"));
        setCoupons((prev) => [newCouponData, ...prev]);
        // تحديث الإحصائيات
        fetchCoupons();
      } else {
        toast.error(t("coupon.createError"));
      }
    } catch (err) {
      console.error("❌ خطأ في إنشاء الكوبون:", err);
      console.error("تفاصيل الخطأ:", err.response?.data);
      
      if (err.response?.status === 401) {
        toast.error(t("coupon.unauthorized"));
      } else if (err.response?.status === 403) {
        toast.error(t("coupon.forbidden"));
      } else if (err.response?.status === 405) {
        toast.error("خطأ في السيرفر: الطريقة غير مسموحة. تأكد من إعدادات الـ API");
      } else {
        toast.error(err.response?.data?.message || t("coupon.createError"));
      }
    } finally {
      setCreating(false);
    }
  };

  const toggleCoupon = async (id) => {
    if (!id) return;
    
    try {
      console.log("🔄 تبديل حالة الكوبون:", id);
      await axios.patch(`/coupons/toggle/${id}`);
      
      const currentCoupon = coupons.find((c) => c._id === id);
      const isActive = currentCoupon?.isActive;
      
      toast.success(isActive ? t("coupon.toggleDisable") : t("coupon.toggleEnable"));

      setCoupons((prevCoupons) =>
        prevCoupons.map((coupon) =>
          coupon._id === id ? { ...coupon, isActive: !coupon.isActive } : coupon
        )
      );
      
      // تحديث الإحصائيات
      fetchCoupons();
    } catch (error) {
      console.error("❌ خطأ في تبديل حالة الكوبون:", error);
      toast.error(t("coupon.toggleError"));
    }
  };

  const deleteCoupon = async (id) => {
    if (!id) return;
    
    try {
      console.log("🔄 حذف الكوبون:", id);
      await axios.delete(`/coupons/${id}`);
      
      toast.success(t("coupon.deleted"));
      setCoupons((prev) => prev.filter((c) => c._id !== id));
      setShowPopup(false);
      setSelectedCouponId(null);
      // تحديث الإحصائيات
      fetchCoupons();
    } catch (err) {
      console.error("❌ خطأ في حذف الكوبون:", err);
      toast.error(t("coupon.deleteError"));
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  return (
    <div className="min-h-screen py-8 px-4">
      <motion.div
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <motion.h1 
            className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[var(--color-electric)] to-[var(--color-accent)] bg-clip-text text-transparent mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {t("coupon.title")}
          </motion.h1>
          <motion.p 
            className="text-[var(--color-text-secondary)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {t("coupon.subtitle")}
          </motion.p>
        </div>

        {/* Statistics Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="bg-[var(--color-bg-opacity)] backdrop-blur-xl rounded-2xl p-6 border border-[var(--color-border)] shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[var(--color-text-secondary)] text-sm font-medium mb-1">
                  {t("coupon.totalCoupons")}
                </p>
                <h3 className="text-2xl font-bold text-[var(--color-text)]">
                  {coupons.length}
                </h3>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg">
                <Ticket className="w-6 h-6" />
              </div>
            </div>
          </div>
          
          <div className="bg-[var(--color-bg-opacity)] backdrop-blur-xl rounded-2xl p-6 border border-[var(--color-border)] shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[var(--color-text-secondary)] text-sm font-medium mb-1">
                  {t("coupon.activeCoupons")}
                </p>
                <h3 className="text-2xl font-bold text-[var(--color-text)]">
                  {coupons.filter(c => c.isActive).length}
                </h3>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg">
                <Zap className="w-6 h-6" />
              </div>
            </div>
          </div>
          
          <div className="bg-[var(--color-bg-opacity)] backdrop-blur-xl rounded-2xl p-6 border border-[var(--color-border)] shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[var(--color-text-secondary)] text-sm font-medium mb-1">
                  {t("coupon.totalDiscountValue")}
                </p>
                <h3 className="text-2xl font-bold text-[var(--color-text)]">
                  {stats.totalDiscounts.toLocaleString()} DA
                </h3>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-lg">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-[var(--color-bg-opacity)] backdrop-blur-xl rounded-2xl p-6 border border-[var(--color-border)] shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[var(--color-text-secondary)] text-sm font-medium mb-1">
                  {t("coupon.activeDiscountValue")}
                </p>
                <h3 className="text-2xl font-bold text-[var(--color-text)]">
                  {stats.totalActiveDiscounts.toLocaleString()} DA
                </h3>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg">
                <Gift className="w-6 h-6" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Create Coupon Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <motion.div
            className="lg:col-span-2 bg-[var(--color-bg-opacity)] backdrop-blur-xl rounded-2xl shadow-lg border border-[var(--color-border)] p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-xl font-bold text-[var(--color-text)] mb-6 flex items-center gap-2">
              <Key className="w-6 h-6 text-[var(--color-accent)]" />
              {t("coupon.createNew")}
            </h2>

            <form onSubmit={createCoupon} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[var(--color-text)] mb-2 flex items-center gap-2">
                  <Percent className="w-4 h-4 text-[var(--color-accent)]" />
                  {t("coupon.discountLabel")}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={newCoupon.discountAmount}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discountAmount: e.target.value })}
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl py-3 px-4 pr-12 text-[var(--color-text)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-all duration-200"
                    placeholder="0"
                    min="1"
                    step="1"
                    required
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[var(--color-text-secondary)]">DA</span>
                </div>
              </div>

              <motion.button
                type='submit'
                disabled={creating || !newCoupon.discountAmount}
                className="w-full bg-gradient-to-r from-[var(--color-electric)] to-[var(--color-accent)] hover:opacity-90 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center justify-center"
                whileHover={{ scale: creating ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {creating ? (
                  <>
                    <Loader className={`h-5 w-5 animate-spin ${isRTL ? "ml-3" : "mr-3"}`} />
                    {t("coupon.creating")}
                  </>
                ) : (
                  <>
                    <PlusCircle className={`h-5 w-5 ${isRTL ? "ml-3" : "mr-3"}`} />
                    {t("coupon.createButton")}
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Usage Tips */}
          <motion.div
            className="bg-gradient-to-br from-[var(--color-electric)] to-[var(--color-accent)] rounded-2xl p-6 text-white shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Gift className="w-6 h-6" />
              {t("coupon.tipsTitle")}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold">1</span>
                </div>
                <span className="text-white/90 text-sm">{t("coupon.tip1")}</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold">2</span>
                </div>
                <span className="text-white/90 text-sm">{t("coupon.tip2")}</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold">3</span>
                </div>
                <span className="text-white/90 text-sm">{t("coupon.tip3")}</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Coupons List */}
        <motion.div
          className="bg-[var(--color-bg-opacity)] backdrop-blur-xl rounded-2xl shadow-lg border border-[var(--color-border)] overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="p-6 border-b border-[var(--color-border)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-[var(--color-text)] flex items-center gap-2">
                <Ticket className="w-6 h-6 text-[var(--color-accent)]" />
                {t("coupon.existingCoupons")}
              </h2>
              <p className="text-[var(--color-text-secondary)] text-sm mt-1">
                {t("coupon.couponsCount", { count: coupons.length })}
              </p>
            </div>
            
            {stats.mostUsedCoupon && (
              <div className="flex items-center gap-2 bg-[var(--color-bg-gray)] rounded-xl px-4 py-2">
                <Users className="w-4 h-4 text-[var(--color-accent)]" />
                <span className="text-sm text-[var(--color-text)]">
                  الأكثر استخدامًا: <span className="font-bold">{stats.mostUsedCoupon.code}</span>
                </span>
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="py-12">
              <LoadingSpinner />
            </div>
          ) : !Array.isArray(coupons) || coupons.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-[var(--color-electric)]/10 to-[var(--color-accent)]/10 rounded-2xl flex items-center justify-center">
                <Ticket className="w-10 h-10 text-[var(--color-text-secondary)]" />
              </div>
              <p className="text-[var(--color-text-secondary)] text-lg mb-2">{t("coupon.noCoupons")}</p>
              <p className="text-[var(--color-text-secondary)] text-sm">{t("coupon.createFirst")}</p>
            </div>
          ) : (
            <div className="divide-y divide-[var(--color-border)]">
              {coupons.map((coupon, index) => (
                <motion.div
                  key={coupon._id}
                  className="p-6 hover:bg-[var(--color-bg-gray)] transition-colors duration-200"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Coupon Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <div className={`p-3 rounded-xl border ${
                          coupon.isActive 
                            ? "border-green-500/30 bg-green-500/10" 
                            : "border-red-500/30 bg-red-500/10"
                        }`}>
                          {coupon.isActive ? 
                            <Zap className="w-5 h-5 text-green-500" /> : 
                            <ZapOff className="w-5 h-5 text-red-500" />
                          }
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-2xl font-bold bg-gradient-to-r from-[var(--color-electric)] to-[var(--color-accent)] bg-clip-text text-transparent">
                              {coupon.code}
                            </span>
                            <motion.button
                              onClick={() => {
                                navigator.clipboard.writeText(coupon.code)
                                  .then(() => toast.success(t("coupon.copySuccess")))
                                  .catch(() => toast.error(t("coupon.copyError")));
                              }}
                              className="p-1 text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors duration-200 rounded-lg"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              title={t('coupon.copySuccess')}
                            >
                              <Copy className="w-4 h-4" />
                            </motion.button>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-3 text-sm">
                            <span className="flex items-center gap-1 text-[var(--color-text)] bg-[var(--color-bg-gray)] px-3 py-1 rounded-lg">
                              <Percent className="w-4 h-4 text-[var(--color-accent)]" />
                              خصم: <span className="font-bold">{coupon.discountAmount.toLocaleString()} DA</span>
                            </span>
                            <span className="flex items-center gap-1 text-[var(--color-text-secondary)]">
                              <Calendar className="w-4 h-4" />
                              {dayjs(coupon.createdAt).format("DD/MM/YYYY")}
                            </span>
                            {coupon.usageCount !== undefined && (
                              <span className="flex items-center gap-1 text-[var(--color-text-secondary)]">
                                <Users className="w-4 h-4" />
                                استخدم {coupon.usageCount} مرة
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <motion.button
                        onClick={() => toggleCoupon(coupon._id)}
                        className={`px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all duration-200 border ${
                          coupon.isActive
                            ? "border-red-500 text-red-500 hover:bg-red-500/10"
                            : "border-green-500 text-green-500 hover:bg-green-500/10"
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {coupon.isActive ? (
                          <>
                            <EyeOff className="w-4 h-4" />
                            <span className="hidden sm:inline">{t("coupon.toggleDisable")}</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4" />
                            <span className="hidden sm:inline">{t("coupon.toggleEnable")}</span>
                          </>
                        )}
                      </motion.button>

                      <motion.button
                        onClick={() => openPopup(coupon._id)}
                        className="px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl font-medium flex items-center gap-2 transition-all duration-200 shadow-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="hidden sm:inline">{t("coupon.delete")}</span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        showPopup={showPopup}
        setShowPopup={setShowPopup}
        selectedCouponId={selectedCouponId}
        deleteCoupon={deleteCoupon}
        t={t}
      />
    </div>
  );
};

// Delete Confirmation Modal Component
const DeleteConfirmationModal = ({ showPopup, setShowPopup, selectedCouponId, deleteCoupon, t }) => {
  if (!showPopup) return null;

  return createPortal(
    <AnimatePresence>
      {showPopup && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-[var(--color-bg)] rounded-2xl shadow-2xl p-6 w-full max-w-md border border-[var(--color-border)]"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-red-500 to-rose-600 rounded-full flex items-center justify-center">
                <Trash2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[var(--color-text)] mb-2">
                {t("coupon.confirmDeleteTitle")}
              </h3>
              <p className="text-[var(--color-text-secondary)]">
                {t("coupon.confirmDeleteMessage")}
              </p>
            </div>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => deleteCoupon(selectedCouponId)}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 hover:opacity-90 text-white rounded-xl font-medium transition-all duration-200 shadow-md"
              >
                {t("coupon.confirmDeleteYes")}
              </button>
              <button
                onClick={() => setShowPopup(false)}
                className="px-6 py-3 bg-[var(--color-bg-gray)] hover:bg-[var(--color-border)] text-[var(--color-text)] rounded-xl font-medium transition-all duration-200 border border-[var(--color-border)]"
              >
                {t("coupon.confirmDeleteCancel")}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default CouponManager;
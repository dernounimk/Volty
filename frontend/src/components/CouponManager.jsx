import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, Loader, EyeOff, Eye, Trash2, Copy, Gift, Percent, Calendar, Zap, ZapOff } from "lucide-react";
import toast from "react-hot-toast";
import axios from "../lib/axios";
import LoadingSpinner from "./LoadingSpinner";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

const CouponManager = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [coupons, setCoupons] = useState([]);
  const [newCoupon, setNewCoupon] = useState({ discountAmount: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedCouponId, setSelectedCouponId] = useState(null);

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
    } catch (err) {
      console.error("❌ خطأ في حذف الكوبون:", err);
      toast.error(t("coupon.deleteError"));
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <motion.h1 
            className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {t("coupon.title")}
          </motion.h1>
          <motion.p 
            className="text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {t("coupon.subtitle")}
          </motion.p>
        </div>

        {/* Create Coupon Form */}
        <motion.div
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
            <Gift className="w-6 h-6 text-purple-500" />
            {t("coupon.createNew")}
          </h2>

          <form onSubmit={createCoupon} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Percent className="w-4 h-4" />
                {t("coupon.discountLabel")}
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={newCoupon.discountAmount}
                  onChange={(e) => setNewCoupon({ ...newCoupon, discountAmount: e.target.value })}
                  className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl py-3 px-4 pr-12 text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="0"
                  min="1"
                  step="1"
                  required
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">DA</span>
              </div>
            </div>

            <motion.button
              type='submit'
              disabled={creating || !newCoupon.discountAmount}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center justify-center"
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

        {/* Statistics */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              {coupons.length}
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-sm">
              إجمالي الكوبونات
            </div>
          </div>
          
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              {coupons.filter(c => c.isActive).length}
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-sm">
              الكوبونات النشطة
            </div>
          </div>
          
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              {coupons.filter(c => !c.isActive).length}
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-sm">
              الكوبونات المعطلة
            </div>
          </div>
        </motion.div>

        {/* Coupons List */}
        <motion.div
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <Gift className="w-6 h-6 text-purple-500" />
              {t("coupon.existingCoupons")}
            </h2>
          </div>

          {isLoading ? (
            <div className="py-12">
              <LoadingSpinner />
            </div>
          ) : !Array.isArray(coupons) || coupons.length === 0 ? (
            <div className="text-center py-12">
              <Gift className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg">{t("coupon.noCoupons")}</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {coupons.map((coupon, index) => (
                <motion.div
                  key={coupon._id}
                  className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Coupon Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2 rounded-xl ${
                          coupon.isActive 
                            ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" 
                            : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                        }`}>
                          {coupon.isActive ? <Zap className="w-5 h-5" /> : <ZapOff className="w-5 h-5" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-2xl font-bold text-gray-800 dark:text-white">
                              {coupon.code}
                            </span>
                            <motion.button
                              onClick={() => {
                                navigator.clipboard.writeText(coupon.code)
                                  .then(() => toast.success(t("coupon.copySuccess")))
                                  .catch(() => toast.error(t("coupon.copyError")));
                              }}
                              className="p-1 text-gray-400 hover:text-blue-500 transition-colors duration-200 rounded-lg"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              title={t('coupon.copySuccess')}
                            >
                              <Copy className="w-4 h-4" />
                            </motion.button>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <Percent className="w-4 h-4" />
                              خصم: {coupon.discountAmount} دج
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {dayjs(coupon.createdAt).format("DD/MM/YYYY")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <motion.button
                        onClick={() => toggleCoupon(coupon._id)}
                        className={`px-4 py-2 rounded-xl font-medium text-white flex items-center gap-2 transition-all duration-200 ${
                          coupon.isActive
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-green-500 hover:bg-green-600"
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
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium flex items-center gap-2 transition-all duration-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="hidden sm:inline">{t("coupon.delete")}</span>
                      </motion.button>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="mt-3">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                      coupon.isActive 
                        ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300" 
                        : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        coupon.isActive ? "bg-green-500" : "bg-red-500"
                      }`}></div>
                      {coupon.isActive ? t("coupon.active") : t("coupon.inactive")}
                    </span>
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
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-96 border border-gray-200 dark:border-gray-700"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
          >
            <div className="text-center mb-4">
              <Trash2 className="w-12 h-12 text-red-500 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                {t("coupon.confirmDeleteTitle")}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t("coupon.confirmDeleteMessage")}
              </p>
            </div>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => deleteCoupon(selectedCouponId)}
                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-all duration-200 shadow-md"
              >
                {t("coupon.confirmDeleteYes")}
              </button>
              <button
                onClick={() => setShowPopup(false)}
                className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-xl font-medium transition-all duration-200"
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
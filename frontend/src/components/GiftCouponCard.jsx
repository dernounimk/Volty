import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useCartStore } from "../stores/useCartStore";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { Gift, Tag, CheckCircle, XCircle, Loader, Sparkles } from "lucide-react";

const GiftCouponCard = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [userInputCode, setUserInputCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const {
    coupon,
    isCouponApplied,
    applyCoupon,
    getMyCoupon,
    removeCoupon,
  } = useCartStore();

  useEffect(() => {
    getMyCoupon();
  }, [getMyCoupon]);

  useEffect(() => {
    if (coupon) {
      setUserInputCode(coupon.code || "");
    }
  }, [coupon, isCouponApplied]);

  const handleApplyCoupon = async () => {
    if (!userInputCode.trim()) {
      toast.error(t("giftCoupon.notValidCode"));
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await applyCoupon(userInputCode.trim());
      
      if (result.success) {
        toast.success(t("giftCoupon.appliedSuccess"));
      }
    } catch (error) {
      toast.error(t("giftCoupon.applyError"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveCoupon = async () => {
    await removeCoupon();
    setUserInputCode("");
    toast.success(t("giftCoupon.removedSuccess"));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isCouponApplied) {
      handleApplyCoupon();
    }
  };

  return (
    <motion.div
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      whileHover={{ y: -2 }}
    >
      {/* Header */}
      <motion.div 
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl shadow-md">
          <Gift className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">
            {t("giftCoupon.title")}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t("giftCoupon.subtitle")}
          </p>
        </div>
      </motion.div>

      {/* Coupon Input Section */}
      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <label htmlFor='voucher' className='block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2'>
            <Tag className="w-4 h-4 text-blue-500" />
            {t("giftCoupon.label")}
          </label>
          
          <div className="relative">
            <motion.input
              type='text'
              id='voucher'
              name='code'
              className={`block w-full rounded-xl bg-white dark:bg-gray-700 border-2 p-4 text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none transition-all duration-300 ${
                isFocused 
                  ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              } ${isCouponApplied ? 'bg-green-50 dark:bg-green-900/20 border-green-500' : ''}`}
              placeholder={t("giftCoupon.placeholder")}
              value={userInputCode}
              onChange={(e) => setUserInputCode(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyPress={handleKeyPress}
              disabled={isCouponApplied || isLoading}
              whileFocus={{ scale: 1.02 }}
            />
            
            <AnimatePresence>
              {isCouponApplied && (
                <motion.div
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                >
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <AnimatePresence mode="wait">
          {!isCouponApplied ? (
            <motion.button
              key="apply-button"
              type='button'
              className={`flex w-full items-center justify-center gap-3 rounded-xl px-6 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:ring-4 focus:ring-blue-500/50'
              }`}
              whileHover={!isLoading ? { scale: 1.02, y: -1 } : {}}
              whileTap={!isLoading ? { scale: 0.98 } : {}}
              onClick={handleApplyCoupon}
              disabled={isLoading}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  {t("giftCoupon.applying")}
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  {t("giftCoupon.apply")}
                </>
              )}
            </motion.button>
          ) : (
            <motion.button
              key="remove-button"
              type='button'
              className='flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 px-6 py-4 text-lg font-semibold text-white shadow-lg hover:from-red-600 hover:to-pink-700 focus:ring-4 focus:ring-red-500/50 transition-all duration-300'
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRemoveCoupon}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <XCircle className="w-5 h-5" />
              {t("giftCoupon.remove")}
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Applied Coupon Details */}
      <AnimatePresence>
        {coupon && isCouponApplied && (
          <motion.div
            className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-700"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold text-green-800 dark:text-green-400 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  {t("giftCoupon.applied")}
                </h4>
                <p className="text-green-700 dark:text-green-300 text-sm mt-1">
                  {coupon.code} - {t("giftCoupon.discount", { amount: coupon.discountAmount })}
                </p>
              </div>
              <motion.div
                className="px-3 py-1 bg-green-500 text-white rounded-full text-sm font-medium"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                {t("giftCoupon.active")}
              </motion.div>
            </div>
            
            {/* Savings Amount */}
            <motion.div
              className="mt-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-green-300 dark:border-green-600"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <p className="text-center text-green-700 dark:text-green-400 font-semibold">
                {t("giftCoupon.youSave")} {coupon.discountAmount} {t("analytics.revenueUnit")}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help Text */}
      <motion.div
        className="mt-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {t("giftCoupon.helpText")}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default GiftCouponCard;
import { ArrowRight, CheckCircle, HandHeart, Truck, Copy, ShoppingBag } from "lucide-react";
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import Confetti from "react-confetti";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import NotFoundPage from "./NotFoundPage";
import { motion } from "framer-motion";

const PurchaseSuccessPage = () => {
  const { clearCart } = useCartStore();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const location = useLocation();
  const { orderNumber, deliveryDays } = location.state || {};

  useEffect(() => {
    if (!orderNumber) return;

    clearCart();

    const storedOrders = JSON.parse(localStorage.getItem("userOrders") || "[]");
    const now = Date.now();
    const maxAge = 4 * 24 * 60 * 60 * 1000; // 4 أيام

    const filteredOrders = storedOrders.filter(
      (order) => order.orderNumber && now - order.timestamp < maxAge
    );
    const isOrderExists = filteredOrders.some(
      (order) => order.orderNumber === orderNumber
    );

    if (!isOrderExists) {
      filteredOrders.push({ orderNumber, timestamp: now });
    }

    localStorage.setItem("userOrders", JSON.stringify(filteredOrders));
  }, [clearCart, orderNumber]);

  if (!orderNumber) return <NotFoundPage />;

  const handleCopy = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(orderNumber)
        .then(() => toast.success(t("purchaseSuccess.copyNumberSuccess")))
        .catch(() => toast.error("Clipboard not supported"));
    } else {
      const tempInput = document.createElement("input");
      tempInput.value = orderNumber;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);
      toast.success(t("purchaseSuccess.copyNumberSuccess"));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-emerald-900 relative overflow-hidden">
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        gravity={0.1}
        style={{ zIndex: 10 }}
        numberOfPieces={700}
        recycle={false}
      />
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-green-200 dark:bg-green-800 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-emerald-200 dark:bg-emerald-800 rounded-full blur-3xl opacity-30"></div>
      </div>

      <motion.div
        className="max-w-md w-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden relative z-20 border border-green-200 dark:border-green-800"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        <div className="p-8">
          {/* Success Icon */}
          <motion.div
            className="flex justify-center mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-green-500 rounded-full blur-lg opacity-75 animate-pulse"></div>
              <CheckCircle className="relative w-20 h-20 text-green-500" />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-3"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {t("purchaseSuccess.orderConfirmed")}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-gray-600 dark:text-gray-300 text-center mb-4 text-lg"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {t("purchaseSuccess.orderPlaced")}
          </motion.p>

          {/* Thanks Message */}
          <motion.p
            className="text-green-600 dark:text-green-400 text-center mb-8 flex items-center justify-center font-semibold"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {t("purchaseSuccess.thanks")}
            <HandHeart className={isRTL ? "mr-2" : "ml-2"} size={20} />
          </motion.p>

          {/* Order Details Card */}
          <motion.div
            className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-emerald-900/20 rounded-2xl p-6 mb-8 border border-green-200 dark:border-green-800"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="space-y-4">
              {/* Order Number */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <ShoppingBag className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {t("purchaseSuccess.orderNumber")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-green-600 dark:text-green-400">
                    {orderNumber}
                  </span>
                  <motion.button
                    onClick={handleCopy}
                    className="text-gray-400 hover:text-green-500 transition-colors p-1 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20"
                    title={t("purchaseSuccess.copyNumber")}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Copy className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {/* Payment Method */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium">
                    {t("purchaseSuccess.paymentMethod")}
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {t("purchaseSuccess.cashOnDelivery")}
                </span>
              </div>

              {/* Estimated Delivery */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Truck className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {t("purchaseSuccess.estimatedDelivery")}
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {deliveryDays
                    ? `${deliveryDays} ${t("purchaseSuccess.days")}`
                    : t("purchaseSuccess.deliveryTime")}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Continue Shopping Button */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <Link
              to={"/"}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
            >
              {t("purchaseSuccess.continueShopping")}
              <ArrowRight className={isRTL ? "mr-2" : "ml-2"} size={20} />
            </Link>
          </motion.div>

          {/* Additional Info */}
          <motion.p
            className="text-center text-gray-500 dark:text-gray-400 text-sm mt-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            {t("purchaseSuccess.additionalInfo")}
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

export default PurchaseSuccessPage;
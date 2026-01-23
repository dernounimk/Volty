import { Link } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, ArrowRight, Trash2, Plus, Minus, Heart, ShieldCheck } from "lucide-react";
import CartItem from "../components/CartItem";
import OrderSummary from "../components/OrderSummary";
import GiftCouponCard from "../components/GiftCouponCard";
import { useTranslation } from "react-i18next";
import axios from "../lib/axios";
import { useEffect, useState } from "react";

const CartPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { cart, removeFromCart, calculateTotals, updateQuantity } = useCartStore();
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    const validateCartProducts = async () => {
      setIsValidating(true);
      for (const item of cart) {
        try {
          await axios.get(`/products/${item._id}`);
        } catch {
          removeFromCart(item._id, item.selectedColor, item.selectedSize);
        }
      }
      calculateTotals();
      setIsValidating(false);
    };

    if (cart.length > 0) {
      validateCartProducts();
    }
  }, [cart, removeFromCart, calculateTotals]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-electric)] to-[var(--color-accent)] rounded-2xl blur-md opacity-75"></div>
              <div className="relative bg-[var(--color-bg)] p-3 rounded-2xl shadow-lg border border-[var(--color-border)]">
                <ShoppingCart className="w-8 h-8 text-[var(--color-electric)]" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-text)]">
                {t("cartPage.title")}
              </h1>
              <p className="text-[var(--color-text-secondary)] mt-1">
                {t("cartPage.subtitle", { count: cart.length })}
              </p>
            </div>
          </div>

          {cart.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-bg)] text-[var(--color-text)] border border-[var(--color-border)] rounded-2xl font-semibold hover:bg-[var(--color-bg-gray)] transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {t("cartPage.continueShopping")}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          )}
        </motion.div>

        {/* Loading State */}
        {isValidating && (
          <motion.div
            className="flex items-center justify-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-[var(--color-text-secondary)]">{t("cartPage.validating")}</p>
            </div>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <motion.div
            className="lg:col-span-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {cart.length === 0 ? (
                <EmptyCartUI t={t} />
              ) : (
                <motion.div className="space-y-4">
                  {cart.map((item, index) => (
                    <motion.div
                      key={`${item._id}-${item.selectedColor}-${item.selectedSize}`}
                      variants={itemVariants}
                      layout
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CartItem item={item} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Sidebar */}
          {cart.length > 0 && (
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <OrderSummary />
              <GiftCouponCard />
              
              {/* Quick Actions */}
              <motion.div
                className="bg-[var(--color-bg)] rounded-2xl shadow-lg border border-[var(--color-border)] p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">
                  {t("cartPage.quickActions")}
                </h3>
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[var(--color-accent)] text-[var(--color-on-accent)] rounded-xl font-semibold hover:bg-[var(--color-accent-hover)] hover:shadow-lg transition-all duration-300"
                  >
                    <Heart className="w-5 h-5" />
                    {t("cartPage.saveForLater")}
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      cart.forEach(item => {
                        removeFromCart(item._id, item.selectedColor, item.selectedSize);
                      });
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[var(--color-bg-gray)] text-[var(--color-text)] rounded-xl font-semibold hover:bg-[var(--color-bg)] transition-all duration-300"
                  >
                    <Trash2 className="w-5 h-5" />
                    {t("cartPage.clearCart")}
                  </motion.button>
                </div>
              </motion.div>

              {/* Security Badge */}
              <motion.div
                className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-[var(--color-bg-gray)] dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-[var(--color-electric)] to-[var(--color-accent)] rounded-full flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-[var(--color-on-accent)]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[var(--color-text)]">
                      {t("cartPage.secureCheckout")}
                    </h4>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      {t("cartPage.securityDescription")}
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;

const EmptyCartUI = ({ t }) => (
  <motion.div
    className="flex flex-col items-center justify-center space-y-6 py-16 text-center"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-electric)] to-[var(--color-accent)] rounded-2xl blur-2xl opacity-20 animate-pulse"></div>
      <ShoppingCart className="relative h-32 w-32 text-[var(--color-text-secondary)]" />
    </div>
    
    <div className="space-y-4 max-w-md">
      <h3 className="text-3xl font-bold text-[var(--color-text)]">
        {t("cartPage.empty.title")}
      </h3>
      <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed">
        {t("cartPage.empty.description")}
      </p>
    </div>

    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Link
        to="/"
        className="inline-flex items-center gap-3 mt-6 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-[var(--color-on-accent)] font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <ShoppingCart className="w-5 h-5" />
        {t("cartPage.empty.startShopping")}
        <ArrowRight className="w-5 h-5" />
      </Link>
    </motion.div>

    {/* Popular Categories */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="mt-8 bg-[var(--color-bg)] rounded-2xl p-6 shadow-lg border border-[var(--color-border)] max-w-md"
    >
      <h4 className="font-semibold text-[var(--color-text)] mb-4">
        {t("cartPage.popularCategories")}
      </h4>
      <div className="grid grid-cols-2 gap-3">
        {[
          { name: "Electronics", path: "/category/electronics" },
          { name: "Fashion", path: "/category/fashion" },
          { name: "Home", path: "/category/home" },
          { name: "Sports", path: "/category/sports" }
        ].map((category, index) => (
          <motion.div
            key={category.name}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to={category.path}
              className="block px-4 py-2 bg-[var(--color-bg-gray)] text-[var(--color-text)] rounded-xl text-sm font-medium hover:bg-[var(--color-bg)] transition-colors text-center"
            >
              {category.name}
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  </motion.div>
);
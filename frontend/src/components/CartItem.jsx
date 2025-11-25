import { Minus, Plus, Trash, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import useSettingStore from "../stores/useSettingStore";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const CartItem = ({ item, index }) => {
  const { removeFromCart, updateQuantity } = useCartStore();
  const { colorsList, sizesLetters, sizesNumbers } = useSettingStore();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const isSelectedSizeValid = sizesNumbers.some(size => size.name === item.selectedSize) 
  || sizesLetters.some(size => size.name === item.selectedSize);

  const selectedColorObj = colorsList.find(c => c._id === item.selectedColor) || null;

  const handleRemove = () => {
    removeFromCart(item._id, item.selectedColor, item.selectedSize);
  };

  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity(
        item._id,
        item.selectedColor,
        item.selectedSize,
        item.quantity - 1
      );
    }
  };

  const handleIncrease = () => {
    updateQuantity(
      item._id,
      item.selectedColor,
      item.selectedSize,
      item.quantity + 1
    );
  };

  const unitPrice = item.priceAfterDiscount ?? item.priceBeforeDiscount;
  const totalPrice = unitPrice * item.quantity;
  const hasDiscount = item.priceBeforeDiscount && item.priceBeforeDiscount > unitPrice;

  return (
    <motion.div
      className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      layout
    >
      {/* Delete Button */}
      <motion.button
        className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} p-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200 z-10`}
        onClick={handleRemove}
        aria-label={t("cart.deleteItem")}
        title={t("cart.deleteItem")}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Trash size={20} />
      </motion.button>

      <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-8">
        {/* Product Image */}
        <motion.div 
          className="shrink-0 self-center"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <Link to={`/product/${item._id}`} className="block">
            <div className="relative">
              <img
                className="h-28 w-28 md:h-32 md:w-32 rounded-2xl object-cover cursor-pointer border-2 border-gray-200 dark:border-gray-600 shadow-md"
                src={Array.isArray(item.images) ? item.images[0] : item.image}
                alt={item.name}
              />
              {hasDiscount && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                  {t("cart.discount")}
                </div>
              )}
            </div>
          </Link>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Product Title */}
          <div>
            <Link
              to={`/product/${item._id}`}
              className="block group"
            >
              <h3 className="text-xl font-bold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-2">
                {item.name}
              </h3>
            </Link>
          </div>

          {/* Color and Size */}
          <div className="flex items-center gap-4 flex-wrap">
            {isSelectedSizeValid && (
              <motion.span 
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl shadow-md min-w-[50px] text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                {item.selectedSize}
              </motion.span>
            )}
                      
            {selectedColorObj && (
              <motion.div 
                className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div
                  className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-500 shadow-sm"
                  style={{ backgroundColor: selectedColorObj.hex }}
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {selectedColorObj.name}
                </span>
              </motion.div>
            )}
          </div>

          {/* Mobile Layout - Quantity and Price */}
          <div className="flex items-center justify-between pt-4 md:hidden">
            {/* Quantity Controls */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700 rounded-xl px-4 py-2 border border-gray-200 dark:border-gray-600">
                <motion.button
                  className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleDecrease}
                  disabled={item.quantity <= 1}
                  aria-label={t("cart.decreaseQuantity")}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Minus size={16} />
                </motion.button>
                
                <span className="min-w-[30px] text-center font-bold text-lg text-gray-800 dark:text-white">
                  {item.quantity}
                </span>
                
                <motion.button
                  className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 transition-all duration-200"
                  onClick={handleIncrease}
                  aria-label={t("cart.increaseQuantity")}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Plus size={16} />
                </motion.button>
              </div>
            </div>

            {/* Price for Mobile */}
            <div className="text-end">
              <p className="text-xl font-bold text-gray-800 dark:text-white">
                {totalPrice.toLocaleString()} DA
              </p>
              {hasDiscount && (
                <p className="text-sm line-through text-gray-400">
                  {(item.priceBeforeDiscount * item.quantity).toLocaleString()} DA
                </p>
              )}
            </div>
          </div>

          {/* Desktop Layout - Quantity and Price */}
          <div className="hidden md:flex md:items-center md:justify-between md:pt-6">
            <div className="flex items-center gap-6">
              {/* Quantity Controls */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {t("cart.quantity")}:
                </span>
                <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-700 rounded-xl px-5 py-3 border border-gray-200 dark:border-gray-600">
                  <motion.button
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleDecrease}
                    disabled={item.quantity <= 1}
                    aria-label={t("cart.decreaseQuantity")}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Minus size={20} />
                  </motion.button>
                  
                  <span className="min-w-[40px] text-center font-bold text-xl text-gray-800 dark:text-white">
                    {item.quantity}
                  </span>
                  
                  <motion.button
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 transition-all duration-200"
                    onClick={handleIncrease}
                    aria-label={t("cart.increaseQuantity")}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Plus size={20} />
                  </motion.button>
                </div>
              </div>

              {/* Unit Price */}
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {t("cart.unitPrice")}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-semibold text-gray-800 dark:text-white">
                    {unitPrice.toLocaleString()} DA
                  </p>
                  {hasDiscount && (
                    <p className="text-sm line-through text-gray-400">
                      {item.priceBeforeDiscount.toLocaleString()} DA
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Total Price for Desktop */}
            <div className="text-end">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {t("cart.total")}
              </p>
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    {totalPrice.toLocaleString()} DA
                  </p>
                  {hasDiscount && (
                    <p className="text-sm line-through text-gray-400">
                      {(item.priceBeforeDiscount * item.quantity).toLocaleString()} DA
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Savings Badge */}
      {hasDiscount && (
        <motion.div
          className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          {t("cart.youSave")} {((item.priceBeforeDiscount - unitPrice) * item.quantity).toLocaleString()} DA
        </motion.div>
      )}
    </motion.div>
  );
};

export default CartItem;
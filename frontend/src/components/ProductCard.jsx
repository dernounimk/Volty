import { useEffect, useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Star, Heart, ShoppingBag, Eye, Zap, Clock, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const ProductCard = ({ product, onFavoriteToggle, viewMode = 'grid', categoryName }) => {
  const { t, i18n } = useTranslation();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const isRTL = i18n.dir() === 'rtl';

  // التحقق من المفضلة عند التحميل
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setIsFavorite(storedFavorites.some((item) => item._id === product._id));
  }, [product._id]);

  // التحقق من وجود المنتج في السلة
  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    setIsInCart(cartItems.some((item) => item._id === product._id));
  }, [product._id]);

  const toggleFavorite = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    let storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (isFavorite) {
      storedFavorites = storedFavorites.filter((item) => item._id !== product._id);
      toast.success(t("removedFromFavorites"), {
        icon: '❤️',
        style: {
          background: 'var(--color-bg-gray)',
          color: 'var(--color-accent)',
        },
      });
    } else {
      storedFavorites.push(product);
      toast.success(t("addedToFavorites"), {
        icon: '❤️',
        style: {
          background: 'var(--color-bg-gray)',
          color: 'var(--color-accent)',
        },
      });
    }

    localStorage.setItem("favorites", JSON.stringify(storedFavorites));
    setIsFavorite(!isFavorite);

    if (onFavoriteToggle) {
      onFavoriteToggle();
    }
  }, [isFavorite, product, t, onFavoriteToggle]);

  // حساب نسبة الخصم
  const discountPercentage = useMemo(() => {
    if (product.priceBeforeDiscount > (product.priceAfterDiscount ?? product.priceBeforeDiscount)) {
      return Math.round(
        100 - ((product.priceAfterDiscount ?? product.priceBeforeDiscount) / product.priceBeforeDiscount) * 100
      );
    }
    return 0;
  }, [product.priceBeforeDiscount, product.priceAfterDiscount]);

  // الحصول على الصورة الرئيسية
  const mainImage = useMemo(() => {
    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images[0];
    }
    return product.image || 'https://via.placeholder.com/300x300?text=No+Image';
  }, [product.images, product.image]);

  // الحصول على تقييم المنتج
  const rating = useMemo(() => {
    return product.averageRating || 0;
  }, [product.averageRating]);

  // السعر النهائي
  const finalPrice = useMemo(() => {
    return product.priceAfterDiscount ?? product.priceBeforeDiscount;
  }, [product.priceAfterDiscount, product.priceBeforeDiscount]);

  // Grid View Layout
  if (viewMode === 'grid') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="h-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link
          to={`/product/${product._id}`}
          className="group flex flex-col bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-[var(--color-accent)] h-full relative"
          dir={isRTL ? "rtl" : "ltr"}
        >
          {/* Badges Container */}
          <div className="absolute top-2 left-2 z-10 flex flex-col gap-1 sm:gap-2">
            {/* Discount Badge */}
            {discountPercentage > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-gradient-to-r from-[var(--color-electric)] to-[var(--color-accent)] text-[var(--color-on-accent)] px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs sm:text-sm font-bold shadow-lg"
              >
                {discountPercentage}% OFF
              </motion.div>
            )}
            
            {/* Stock Status */}
            {product.stock <= 5 && product.stock > 0 && (
              <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-lg">
                {t('lowStock')}
              </div>
            )}
            
            {/* Fast Shipping */}
            {product.fastShipping && (
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-lg">
                <Zap className="w-3 h-3 inline mr-1" />
                {t('fastShipping')}
              </div>
            )}
          </div>

          {/* Image Container */}
          <div className="relative w-full h-48 sm:h-56 md:h-60 overflow-hidden bg-[var(--color-bg-gray)]">
            <motion.img
              className="w-full h-full object-cover"
              src={mainImage}
              alt={product.name}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Favorite Button */}
            <motion.button
              onClick={toggleFavorite}
              whileTap={{ scale: 0.9 }}
              className={`absolute top-2 right-2 rounded-xl p-2 flex items-center justify-center transition-all duration-200 backdrop-blur-sm ${
                isFavorite
                  ? "bg-gradient-to-r from-[var(--color-electric)] to-[var(--color-accent)] text-[var(--color-on-accent)] shadow-lg"
                  : "bg-white/90 dark:bg-gray-800/90 text-[var(--color-text-secondary)] hover:bg-white dark:hover:bg-gray-700"
              }`}
            >
              <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
            </motion.button>

            {/* Quick Actions - Appear on Hover */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-2 right-2 flex gap-2"
                >
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`rounded-xl p-2.5 flex items-center justify-center transition-all duration-200 ${
                      isInCart
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg"
                        : "bg-gradient-to-r from-[var(--color-electric)] to-[var(--color-accent)] text-[var(--color-on-accent)] hover:shadow-lg"
                    }`}
                  >
                    {isInCart ? <Check size={18} /> : <ShoppingBag size={18} />}
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="rounded-xl p-2.5 bg-white/90 dark:bg-gray-800/90 text-[var(--color-text-secondary)] hover:bg-white dark:hover:bg-gray-700 backdrop-blur-sm"
                  >
                    <Eye size={18} />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Product Details */}
          <div className="flex flex-col flex-grow p-3 sm:p-4 md:p-5">
            {/* Category & Name */}
            <div className="mb-3 flex-grow">
              {categoryName && (
                <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mb-1 truncate">
                  {categoryName}
                </p>
              )}
              <h5 className="text-sm sm:text-base font-semibold text-[var(--color-text)] mb-2 line-clamp-2 group-hover:text-[var(--color-accent)] transition-colors leading-tight">
                {product.name}
              </h5>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => {
                  const full = i + 1 <= Math.floor(rating);
                  const half = i < rating && i + 1 > rating;
                  return (
                    <Star
                      key={i}
                      size={12}
                      className={`${
                        full 
                          ? "text-amber-400 fill-amber-400" 
                          : half 
                            ? "text-amber-400 fill-amber-400 fill-opacity-50" 
                            : "text-gray-300 dark:text-gray-600"
                      }`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Price & Actions */}
            <div className="flex items-center justify-between">
              {/* Price */}
              <div className="flex flex-col">
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="text-lg sm:text-xl font-bold text-[var(--color-text)]">
                    {finalPrice?.toLocaleString()} DA
                  </span>
                  {discountPercentage > 0 && (
                    <span className="text-xs sm:text-sm text-[var(--color-text-secondary)] line-through opacity-70">
                      {product.priceBeforeDiscount?.toLocaleString()} DA
                    </span>
                  )}
                </div>
                {product.originalPrice && product.originalPrice > finalPrice && (
                  <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                    {t('youSave')} {(product.originalPrice - finalPrice)?.toLocaleString()} DA
                  </p>
                )}
              </div>

              {/* Quick Add to Cart Button (Mobile) */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                className={`lg:hidden rounded-xl p-2 flex items-center justify-center transition-all duration-200 ${
                  isInCart
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg"
                    : "bg-gradient-to-r from-[var(--color-electric)] to-[var(--color-accent)] text-[var(--color-on-accent)] hover:shadow-lg"
                }`}
              >
                {isInCart ? <Check size={16} /> : <ShoppingCart size={16} />}
              </motion.button>
            </div>

            {/* Stock Indicator */}
            {product.stock !== undefined && (
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-[var(--color-text-secondary)] mb-1">
                  <span>{t('stock')}:</span>
                  <span className={`font-medium ${
                    product.stock > 10 ? 'text-green-600' : 
                    product.stock > 0 ? 'text-amber-600' : 
                    'text-red-600'
                  }`}>
                    {product.stock > 0 ? `${product.stock} ${t('inStock')}` : t('outOfStock')}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      product.stock > 10 ? 'bg-green-500' : 
                      product.stock > 0 ? 'bg-amber-500' : 
                      'bg-red-500'
                    }`}
                    style={{ 
                      width: `${Math.min((product.stock / 50) * 100, 100)}%` 
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </Link>
      </motion.div>
    );
  }

  // List View Layout
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        to={`/product/${product._id}`}
        className="group flex flex-col sm:flex-row bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-[var(--color-accent)] h-full"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Image Container */}
        <div className="relative w-full sm:w-48 md:w-56 h-48 sm:h-auto overflow-hidden bg-[var(--color-bg-gray)] flex-shrink-0">
          <motion.img
            className="w-full h-full object-cover"
            src={mainImage}
            alt={product.name}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-2 left-2 bg-gradient-to-r from-[var(--color-electric)] to-[var(--color-accent)] text-[var(--color-on-accent)] px-3 py-1.5 rounded-lg text-sm font-bold shadow-lg"
            >
              {discountPercentage}% OFF
            </motion.div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex flex-col flex-grow p-4 sm:p-5 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3">
            <div className="flex-grow">
              {/* Category */}
              {categoryName && (
                <p className="text-sm text-[var(--color-text-secondary)] mb-1">
                  {categoryName}
                </p>
              )}
              
              {/* Product Name */}
              <h5 className="text-lg sm:text-xl font-semibold text-[var(--color-text)] mb-2 group-hover:text-[var(--color-accent)] transition-colors">
                {product.name}
              </h5>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => {
                    const full = i + 1 <= Math.floor(rating);
                    const half = i < rating && i + 1 > rating;
                    return (
                      <Star
                        key={i}
                        size={14}
                        className={`${
                          full 
                            ? "text-amber-400 fill-amber-400" 
                            : half 
                              ? "text-amber-400 fill-amber-400 fill-opacity-50" 
                              : "text-gray-300 dark:text-gray-600"
                        }`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Favorite Button */}
            <motion.button
              onClick={toggleFavorite}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`self-start rounded-xl p-2.5 flex items-center justify-center transition-all duration-200 ${
                isFavorite
                  ? "bg-gradient-to-r from-[var(--color-electric)] to-[var(--color-accent)] text-[var(--color-on-accent)] shadow-lg"
                  : "bg-[var(--color-bg-gray)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]"
              }`}
            >
              <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
            </motion.button>
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-[var(--color-text-secondary)] mb-4 line-clamp-2 flex-grow text-sm sm:text-base">
              {product.description}
            </p>
          )}

          {/* Additional Info */}
          <div className="flex flex-wrap gap-2 mb-4">
            {product.fastShipping && (
              <span className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs px-2 py-1 rounded-md">
                <Zap size={12} />
                {t('fastShipping')}
              </span>
            )}
            {product.isNew && (
              <span className="inline-flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs px-2 py-1 rounded-md">
                <Clock size={12} />
                {t('newArrival')}
              </span>
            )}
          </div>

          {/* Price & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-auto">
            {/* Price */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-bold text-[var(--color-text)]">
                  {finalPrice?.toLocaleString()} DA
                </span>
                {discountPercentage > 0 && (
                  <span className="text-base sm:text-lg text-[var(--color-text-secondary)] line-through opacity-70">
                    {product.priceBeforeDiscount?.toLocaleString()} DA
                  </span>
                )}
              </div>
              {product.originalPrice && product.originalPrice > finalPrice && (
                <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                  {t('youSave')} {(product.originalPrice - finalPrice)?.toLocaleString()} DA
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl px-4 sm:px-6 py-3 font-semibold transition-all duration-200 ${
                  isInCart
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg"
                    : "bg-gradient-to-r from-[var(--color-electric)] to-[var(--color-accent)] text-[var(--color-on-accent)] hover:shadow-lg"
                }`}
              >
                {isInCart ? (
                  <>
                    <Check size={18} />
                    <span>{t('addedToCart')}</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} />
                    <span>{t('addToCart')}</span>
                  </>
                )}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden sm:flex items-center justify-center p-3 rounded-xl bg-[var(--color-bg-gray)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]"
              >
                <Eye size={18} />
              </motion.button>
            </div>
          </div>

          {/* Stock Info */}
          {product.stock !== undefined && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-[var(--color-text-secondary)] mb-1">
                <span>{t('availability')}:</span>
                <span className={`font-medium ${
                  product.stock > 10 ? 'text-green-600' : 
                  product.stock > 0 ? 'text-amber-600' : 
                  'text-red-600'
                }`}>
                  {product.stock > 0 ? `${product.stock} ${t('inStock')}` : t('outOfStock')}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    product.stock > 10 ? 'bg-green-500' : 
                    product.stock > 0 ? 'bg-amber-500' : 
                    'bg-red-500'
                  }`}
                  style={{ 
                    width: `${Math.min((product.stock / 50) * 100, 100)}%` 
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
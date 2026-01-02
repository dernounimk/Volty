import { useEffect, useState, useMemo, useCallback } from "react";
import { useProductStore } from "../stores/useProductStore";
import useSettingStore from "../stores/useSettingStore";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingBag, Grid, List, Home, Sparkles, Filter, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "../components/ProductCard";
import { useTranslation } from "react-i18next";
import LoadingSpinner from "../components/LoadingSpinner";

const CategoryPage = () => {
  const { 
    fetchProductsByCategory, 
    products = [], 
    isLoading: productsLoading,
    filteredProducts = [],
    setFilter
  } = useProductStore();
  
  const { 
    categories = [],
    loadingMeta: categoriesLoading,
    fetchMetaData
  } = useSettingStore();
  
  const { category } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [categoryNotFound, setCategoryNotFound] = useState(false);
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('productViewMode') || 'grid';
  });
  const [hasFetched, setHasFetched] = useState(false);
  const [sortBy, setSortBy] = useState("default");
  const [showFilter, setShowFilter] = useState(false);
  const [localError, setLocalError] = useState(null);
  const isRTL = i18n.dir() === 'rtl';

  useEffect(() => {
    if (categories.length === 0 && !categoriesLoading) {
      fetchMetaData().catch(error => {
        console.error("Error fetching meta data:", error);
        setLocalError(error.message);
      });
    }
  }, [categories.length, categoriesLoading, fetchMetaData]);

  useEffect(() => {
    if (viewMode) {
      localStorage.setItem('productViewMode', viewMode);
    }
  }, [viewMode]);

  useEffect(() => {
    if (category && categories.length > 0 && !hasFetched) {
      const foundCategory = categories.find(c => {
        if (!c) return false;
        return (
          c._id === category || 
          c.slug === category || 
          c.name?.toLowerCase() === category?.toLowerCase()
        );
      });

      if (foundCategory) {
        fetchProductsByCategory(foundCategory._id).catch(error => {
          console.error("Error fetching products:", error);
          setLocalError(error.message);
        });
        setCategoryNotFound(false);
        setHasFetched(true);
        if (setFilter) {
          setFilter({});
        }
      } else {
        setCategoryNotFound(true);
        setHasFetched(true);
      }
    }
  }, [category, categories, fetchProductsByCategory, hasFetched, setFilter]);

  const currentCategory = useMemo(() => {
    return categories.find(c => {
      if (!c) return false;
      return (
        c._id === category || 
        c.slug === category || 
        c.name?.toLowerCase() === category?.toLowerCase()
      );
    });
  }, [category, categories]);

  const translatedCategoryName = useMemo(() => {
    if (!category) return t('categoryPage.unknownCategory', 'Unknown Category');
    
    return currentCategory 
      ? t(`categories.${currentCategory.name}`, currentCategory.name)
      : t(`categories.${category}`, category?.charAt(0)?.toUpperCase() + category?.slice(1));
  }, [currentCategory, category, t]);

  const displayedProducts = useMemo(() => {
    try {
      const availableProducts = Array.isArray(filteredProducts) && filteredProducts.length > 0 
        ? filteredProducts 
        : products;
      
      if (!Array.isArray(availableProducts)) {
        console.warn("availableProducts is not an array:", availableProducts);
        return [];
      }
      
      let result = [...availableProducts];
      
      switch(sortBy) {
        case "price-low":
          result = result.sort((a, b) => {
            const priceA = a.priceAfterDiscount ?? a.priceBeforeDiscount ?? 0;
            const priceB = b.priceAfterDiscount ?? b.priceBeforeDiscount ?? 0;
            return priceA - priceB;
          });
          break;
        case "price-high":
          result = result.sort((a, b) => {
            const priceA = a.priceAfterDiscount ?? a.priceBeforeDiscount ?? 0;
            const priceB = b.priceAfterDiscount ?? b.priceBeforeDiscount ?? 0;
            return priceB - priceA;
          });
          break;
        case "rating":
          result = result.sort((a, b) => 
            (b.averageRating || 0) - (a.averageRating || 0)
          );
          break;
        case "newest":
          result = result.sort((a, b) => 
            new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
          );
          break;
        default:
          break;
      }
      
      return result;
    } catch (error) {
      console.error("Error in displayedProducts calculation:", error);
      setLocalError(error.message);
      return [];
    }
  }, [products, filteredProducts, sortBy]);

  const handleViewModeChange = useCallback((mode) => {
    setViewMode(mode);
    if ('vibrate' in navigator) {
      navigator.vibrate(20);
    }
  }, []);

  const handleBackClick = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleRetry = useCallback(() => {
    setLocalError(null);
    setHasFetched(false);
    if (category && categories.length > 0) {
      const foundCategory = categories.find(c => 
        c._id === category || 
        c.slug === category || 
        c.name?.toLowerCase() === category?.toLowerCase()
      );
      
      if (foundCategory) {
        fetchProductsByCategory(foundCategory._id).catch(error => {
          console.error("Error retrying fetch:", error);
          setLocalError(error.message);
        });
      }
    }
  }, [category, categories, fetchProductsByCategory]);

  // Mobile Filter Modal
  const MobileFilterModal = () => (
    <AnimatePresence>
      {showFilter && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowFilter(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          />
          <motion.div
            initial={{ x: isRTL ? '100%' : '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: isRTL ? '100%' : '-100%' }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed top-0 left-0 h-full w-80 max-w-full bg-white dark:bg-gray-900 shadow-2xl z-50 lg:hidden"
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {t('filterAndSort')}
              </h2>
              <button
                onClick={() => setShowFilter(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 space-y-6 overflow-y-auto h-[calc(100vh-4rem)]">
              {/* View Mode */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  {t('categoryPage.viewMode')}
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleViewModeChange('grid')}
                    className={`p-3 rounded-xl flex flex-col items-center gap-2 ${
                      viewMode === 'grid' 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                    <span className="text-sm">{t('categoryPage.gridView')}</span>
                  </button>
                  <button
                    onClick={() => handleViewModeChange('list')}
                    className={`p-3 rounded-xl flex flex-col items-center gap-2 ${
                      viewMode === 'list' 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <List className="w-5 h-5" />
                    <span className="text-sm">{t('categoryPage.listView')}</span>
                  </button>
                </div>
              </div>

              {/* Sorting */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  {t('sort.sortBy')}
                </h3>
                <div className="space-y-2">
                  {[
                    { value: "default", label: t("sort.default") },
                    { value: "price-low", label: t("sort.priceLow") },
                    { value: "price-high", label: t("sort.priceHigh") },
                    { value: "rating", label: t("sort.rating") },
                    { value: "newest", label: t("sort.newest") }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value);
                        setShowFilter(false);
                      }}
                      className={`w-full text-left p-3 rounded-xl ${
                        sortBy === option.value
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  // عرض حالة التحميل
  if (categoriesLoading || (!hasFetched && !categoryNotFound)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <LoadingSpinner size="xl" />
        <p className="mt-4 text-gray-600 dark:text-gray-300 animate-pulse">
          {t('loading')}...
        </p>
      </div>
    );
  }

  // عرض خطأ إذا كان هناك مشكلة
  if (localError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-32 h-32 bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
            <ShoppingBag className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {t('errorOccurred')}
          </h1>
          <p className="text-red-600 dark:text-red-400 mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            {localError}
          </p>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {t('pleaseTryAgain')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleRetry}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              {t('retry')}
            </button>
            <button
              onClick={handleBackClick}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <ArrowLeft size={20} />
              {t("back")}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (categoryNotFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="w-32 h-32 bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl"
          >
            <ShoppingBag className="w-12 h-12 text-red-500" />
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('categoryPage.notFound')}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            {t('categoryPage.notFoundMessage', { category: translatedCategoryName })}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleBackClick}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <ArrowLeft size={20} />
              {t("back")}
            </button>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <Home size={20} />
              {t("categoryPage.backToHome")}
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        {/* زر العودة للأجهزة المحمولة */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden mb-4"
        >
          <button
            onClick={handleBackClick}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>{t("back")}</span>
          </button>
        </motion.div>

        {/* Category Header with Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl overflow-hidden shadow-xl mb-6"
          style={{
            backgroundImage: currentCategory?.imageUrl 
              ? `linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.5) 100%), url(${currentCategory.imageUrl})`
              : 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '200px'
          }}
        >
          <div className="absolute inset-0" />
          
          <div className="relative z-10 p-6 md:p-8 h-full">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Category Info */}
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                  <Link 
                    to="/" 
                    className="text-white/90 hover:text-white transition-colors text-sm"
                  >
                    {t("home")}
                  </Link>
                  <ChevronRight className="w-4 h-4 text-white/70" />
                  <span className="text-white font-medium">
                    {translatedCategoryName}
                  </span>
                </div>
                
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
                  {translatedCategoryName}
                </h1>
                
                {currentCategory?.description && (
                  <p className="text-white/90 text-sm md:text-base max-w-2xl mb-3 line-clamp-2">
                    {currentCategory.description}
                  </p>
                )}
              </div>

              {/* Integrated Controls - Desktop */}
              <div className="hidden lg:flex items-center gap-4">
                {/* Products Count */}
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-white border border-white/30">
                  <div className="flex items-center gap-2 mb-1">
                    <ShoppingBag className="w-5 h-5" />
                    <span className="text-sm font-medium">{t('products')}</span>
                  </div>
                  <div className="text-2xl font-bold">{displayedProducts.length}</div>
                </div>

                {/* View Mode */}
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
                  <div className="flex items-center gap-3 mb-2">
                    <Grid className="w-4 h-4 text-white" />
                    <span className="text-sm font-medium text-white">{t('categoryPage.viewMode')}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewModeChange('grid')}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        viewMode === 'grid' 
                          ? 'bg-white text-blue-600 shadow-md' 
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      {t('categoryPage.gridView')}
                    </button>
                    <button
                      onClick={() => handleViewModeChange('list')}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        viewMode === 'list' 
                          ? 'bg-white text-blue-600 shadow-md' 
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      {t('categoryPage.listView')}
                    </button>
                  </div>
                </div>

                {/* Sorting */}
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Filter className="w-4 h-4 text-white" />
                    <span className="text-sm font-medium text-white">{t('sort.sortBy')}</span>
                  </div>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-white/50 focus:border-transparent appearance-none"
                  >
                    <option value="default" className="bg-gray-800 text-white">
                      {t("sort.default")}
                    </option>
                    <option value="price-low" className="bg-gray-800 text-white">
                      {t("sort.priceLow")}
                    </option>
                    <option value="price-high" className="bg-gray-800 text-white">
                      {t("sort.priceHigh")}
                    </option>
                    <option value="rating" className="bg-gray-800 text-white">
                      {t("sort.rating")}
                    </option>
                    <option value="newest" className="bg-gray-800 text-white">
                      {t("sort.newest")}
                    </option>
                  </select>
                </div>
              </div>

              {/* Mobile Controls Summary */}
              <div className="lg:hidden flex items-center justify-between bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
                <div className="flex items-center gap-4">
                  <div className="text-white">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4" />
                      <span className="text-sm font-medium">{t('products')}</span>
                    </div>
                    <div className="text-xl font-bold">{displayedProducts.length}</div>
                  </div>
                  <div className="text-white">
                    <div className="flex items-center gap-2 mb-1">
                      <Grid className="w-4 h-4" />
                      <span className="text-sm font-medium">{t('view')}</span>
                    </div>
                    <span className="text-sm">
                      {viewMode === 'grid' ? t('categoryPage.gridView') : t('categoryPage.listView')}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowFilter(true)}
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                >
                  {t('filter')}
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Products Grid */}
        {productsLoading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="xl" />
          </div>
        ) : (
          <>
            <AnimatePresence>
              {(displayedProducts.length === 0) && (
                <motion.div 
                  className="text-center py-8 sm:py-16 px-4"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <motion.div
                    className="relative mb-6 sm:mb-8"
                    animate={{ 
                      y: [0, -8, 0],
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto">
                      <motion.div
                        className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full flex items-center justify-center shadow-2xl border border-purple-200/50 dark:border-purple-700/30"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <ShoppingBag className="w-12 h-12 sm:w-16 sm:h-16 text-purple-500 dark:text-purple-400" />
                      </motion.div>
                      
                      <motion.div
                        className="absolute -top-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg"
                        animate={{ 
                          scale: [1, 1.2, 1],
                          rotate: [0, 180, 360]
                        }}
                        transition={{ 
                          duration: 4,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      >
                        <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      </motion.div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-purple-600 dark:from-white dark:to-purple-400 bg-clip-text text-transparent mb-3 sm:mb-4">
                      {t('categoryPage.noProducts')}
                    </h2>
                    <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-2 max-w-md mx-auto leading-relaxed">
                      {t('categoryPage.noProductsDescription')}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 sm:mb-8">
                      {t('categoryPage.noProductsHint')}
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                    className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"
                  >
                    <button
                      onClick={handleBackClick}
                      className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      <ArrowLeft size={20} />
                      <span>{t("back")}</span>
                    </button>
                    <Link
                      to='/'
                      className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      <Home size={20} />
                      <span>{t("categoryPage.exploreOtherCategories")}</span>
                    </Link>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {displayedProducts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className={viewMode === 'grid' 
                  ? 'grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6' 
                  : 'space-y-4 sm:space-y-6'
                }>
                  {displayedProducts.map((product, index) => (
                    <motion.div
                      key={product._id || index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        duration: 0.5, 
                        delay: Math.min(index * 0.05, 0.5)
                      }}
                      whileHover={{ 
                        y: -4,
                        transition: { duration: 0.2 }
                      }}
                      className={viewMode === 'list' 
                        ? 'bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow' 
                        : ''
                      }
                    >
                      <ProductCard 
                        product={product} 
                        categoryName={currentCategory?.name}
                        viewMode={viewMode}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Mobile Filter Modal */}
      <MobileFilterModal />
    </div>
  );
};

export default CategoryPage;
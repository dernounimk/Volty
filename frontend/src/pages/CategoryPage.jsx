import { useEffect, useState, useMemo, useCallback } from "react";
import { useProductStore } from "../stores/useProductStore";
import useSettingStore from "../stores/useSettingStore";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Grid, List, Home, Sparkles, Filter, ChevronRight } from "lucide-react";
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
  const [localError, setLocalError] = useState(null);

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

  // عرض حالة التحميل
  if (categoriesLoading || (!hasFetched && !categoryNotFound)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <LoadingSpinner size="xl" />
        <p className="mt-4 text-[var(--color-text-secondary)] animate-pulse">
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
            <ArrowLeft className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text)] mb-4">
            {t('errorOccurred')}
          </h1>
          <p className="text-red-600 dark:text-red-400 mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            {localError}
          </p>
          <p className="text-[var(--color-text-secondary)] mb-6">
            {t('pleaseTryAgain')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleRetry}
              className="inline-flex items-center justify-center gap-2 bg-[var(--color-accent)] text-[var(--color-on-accent)] px-6 py-3 rounded-xl font-semibold hover:bg-[var(--color-accent-hover)] hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              {t('retry')}
            </button>
            <button
              onClick={handleBackClick}
              className="inline-flex items-center justify-center gap-2 bg-[var(--color-bg-gray)] text-[var(--color-text)] px-6 py-3 rounded-xl font-semibold hover:bg-[var(--color-bg)] hover:shadow-lg transition-all duration-300 hover:scale-105"
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
            <ArrowLeft className="w-12 h-12 text-red-500" />
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-4">
            {t('categoryPage.notFound')}
          </h1>
          <p className="text-lg md:text-xl text-[var(--color-text-secondary)] mb-8 leading-relaxed">
            {t('categoryPage.notFoundMessage', { category: translatedCategoryName })}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleBackClick}
              className="inline-flex items-center justify-center gap-2 bg-[var(--color-bg-gray)] text-[var(--color-text)] px-6 py-3 rounded-xl font-semibold hover:bg-[var(--color-bg)] hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <ArrowLeft size={20} />
              {t("back")}
            </button>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 bg-[var(--color-accent)] text-[var(--color-on-accent)] px-6 py-3 rounded-xl font-semibold hover:bg-[var(--color-accent-hover)] hover:shadow-lg transition-all duration-300 hover:scale-105"
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
            className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors"
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
              : `linear-gradient(135deg, var(--color-electric) 0%, var(--color-accent) 100%)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '200px'
          }}
        >
          <div className="absolute inset-0" />
          
          <div className="relative z-10 p-6 md:p-8">
            {/* Category Info */}
            <div className="mb-8">
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
                {translatedCategoryName}
              </h1>
              
              {currentCategory?.description && (
                <p className="text-white/90 text-sm md:text-base max-w-2xl mb-3">
                  {currentCategory.description}
                </p>
              )}
            </div>

            {/* Controls - جميعها في نفس السطر تحت الهيدر */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 p-4"
            >
              {/* View Mode Toggle - أيقونات فقط */}
              <div className="flex items-center gap-2">
                <div className="flex bg-white/20 backdrop-blur-sm rounded-xl p-1 border border-white/30">
                  <button
                    onClick={() => handleViewModeChange('grid')}
                    className={`p-2.5 rounded-lg transition-all ${
                      viewMode === 'grid' 
                        ? 'bg-white text-[var(--color-accent)] shadow-md' 
                        : 'text-white hover:bg-white/20'
                    }`}
                    title={t('categoryPage.gridView')}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleViewModeChange('list')}
                    className={`p-2.5 rounded-lg transition-all ${
                      viewMode === 'list' 
                        ? 'bg-white text-[var(--color-accent)] shadow-md' 
                        : 'text-white hover:bg-white/20'
                    }`}
                    title={t('categoryPage.listView')}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Sorting Dropdown */}
              <div className="relative flex items-center gap-3 w-full sm:w-auto">
                <div className="absolute left-3 z-10 pointer-events-none">
                  <Filter className="w-4 h-4 text-white" />
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex-1 sm:w-48 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-white/50 focus:border-transparent appearance-none cursor-pointer"
                >
                  <option value="default" className="bg-[var(--color-bg)] text-[var(--color-text)]">
                    {t("sort.default")}
                  </option>
                  <option value="price-low" className="bg-[var(--color-bg)] text-[var(--color-text)]">
                    {t("sort.priceLow")}
                  </option>
                  <option value="price-high" className="bg-[var(--color-bg)] text-[var(--color-text)]">
                    {t("sort.priceHigh")}
                  </option>
                  <option value="rating" className="bg-[var(--color-bg)] text-[var(--color-text)]">
                    {t("sort.rating")}
                  </option>
                  <option value="newest" className="bg-[var(--color-bg)] text-[var(--color-text)]">
                    {t("sort.newest")}
                  </option>
                </select>
              </div>
            </motion.div>
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
                        className="w-full h-full bg-gradient-to-br from-[var(--color-bg-gray)] to-[var(--color-bg)] rounded-full flex items-center justify-center shadow-2xl border border-[var(--color-border)]"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Grid className="w-12 h-12 sm:w-16 sm:h-16 text-[var(--color-accent)]" />
                      </motion.div>
                      
                      <motion.div
                        className="absolute -top-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 bg-[var(--color-accent)] rounded-full flex items-center justify-center shadow-lg"
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
                        <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-[var(--color-on-accent)]" />
                      </motion.div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-[var(--color-text)] to-[var(--color-accent)] bg-clip-text text-transparent mb-3 sm:mb-4">
                      {t('categoryPage.noProducts')}
                    </h2>
                    <p className="text-base sm:text-lg text-[var(--color-text-secondary)] mb-2 max-w-md mx-auto leading-relaxed">
                      {t('categoryPage.noProductsDescription')}
                    </p>
                    <p className="text-sm text-[var(--color-text-secondary)] mb-6 sm:mb-8">
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
                      className="group inline-flex items-center justify-center gap-2 bg-[var(--color-bg-gray)] text-[var(--color-text)] px-6 py-3 rounded-xl font-semibold hover:bg-[var(--color-bg)] hover:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      <ArrowLeft size={20} />
                      <span>{t("back")}</span>
                    </button>
                    <Link
                      to='/'
                      className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[var(--color-electric)] via-[var(--color-accent)] to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
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
                        ? 'bg-[var(--color-bg)] rounded-xl sm:rounded-2xl shadow-lg border border-[var(--color-border)] hover:shadow-xl transition-shadow' 
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
    </div>
  );
};

export default CategoryPage;
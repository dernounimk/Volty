import { useEffect, useState } from "react";
import { useProductStore } from "../stores/useProductStore";
import useSettingStore from "../stores/useSettingStore";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ShoppingBag, Filter, Grid, List, Home, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "../components/ProductCard";
import { useTranslation } from "react-i18next";
import LoadingSpinner from "../components/LoadingSpinner";

const CategoryPage = () => {
  const { 
    fetchProductsByCategory, 
    products, 
    isLoading: productsLoading 
  } = useProductStore();
  
  const { 
    categories,
    loadingMeta: categoriesLoading,
    fetchMetaData
  } = useSettingStore();
  
  const { category } = useParams();
  const { t } = useTranslation();
  const [categoryNotFound, setCategoryNotFound] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('popular');

  useEffect(() => {
    if (categories.length === 0) {
      fetchMetaData();
    }
  }, [categories.length, fetchMetaData]);

  useEffect(() => {
    if (category) {
      const foundCategory = categories.find(c => 
        c._id === category || 
        c.slug === category || 
        c.name?.toLowerCase() === category.toLowerCase()
      );

      if (foundCategory) {
        fetchProductsByCategory(foundCategory._id);
        setCategoryNotFound(false);
      } else {
        setCategoryNotFound(true);
      }
    }
  }, [category, categories, fetchProductsByCategory]);

  const currentCategory = categories.find(c => 
    c._id === category || 
    c.slug === category || 
    c.name?.toLowerCase() === category.toLowerCase()
  );

  const translatedCategoryName = currentCategory 
    ? t(`categories.${currentCategory.name}`, currentCategory.name)
    : t(`categories.${category}`, category?.charAt(0)?.toUpperCase() + category?.slice(1));

  if (categoriesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (categoryNotFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="w-32 h-32 bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('categoryPage.notFound')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            {t('categoryPage.notFoundMessage', { category: translatedCategoryName })}
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300"
          >
            <ArrowLeft size={20} />
            {t("categoryPage.backToHome")}
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-8">
          <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            {t("breadcrumb.home")}
          </Link>
          <span>/</span>
          <span className="text-blue-600 dark:text-blue-400 font-medium">
            {translatedCategoryName}
          </span>
        </nav>

        {/* Category Header */}
        {currentCategory?.imageUrl && (
          <motion.div
            className="relative h-80 w-full mb-12 rounded-3xl overflow-hidden shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <img
              src={currentCategory.imageUrl}
              alt={currentCategory.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-8">
              <div className="text-white">
                <motion.h1
                  className="text-5xl sm:text-6xl font-bold mb-4"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  {translatedCategoryName}
                </motion.h1>
                {currentCategory.description && (
                  <motion.p
                    className="text-xl text-gray-200 max-w-2xl"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    {currentCategory.description}
                  </motion.p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {!currentCategory?.imageUrl && (
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              {translatedCategoryName}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {t('categoryPage.subtitle')}
            </p>
          </motion.div>
        )}

        {/* Products Grid */}
        {productsLoading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="xl" />
          </div>
        ) : (
          <>
            <AnimatePresence>
              {(!products || products.length === 0) && (
                <motion.div 
                  className="text-center py-16"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  {/* Floating Animation Container */}
                  <motion.div
                    className="relative mb-8"
                    animate={{ 
                      y: [0, -10, 0],
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <div className="relative w-32 h-32 mx-auto">
                      {/* Main Icon */}
                      <motion.div
                        className="w-32 h-32 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full flex items-center justify-center shadow-2xl border border-purple-200/50 dark:border-purple-700/30"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <ShoppingBag className="w-16 h-16 text-purple-500 dark:text-purple-400" />
                      </motion.div>
                      
                      {/* Floating Particles */}
                      <motion.div
                        className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg"
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
                        <Sparkles className="w-4 h-4 text-white" />
                      </motion.div>
                      
                      <motion.div
                        className="absolute -bottom-2 -left-2 w-6 h-6 bg-blue-400 rounded-full shadow-lg"
                        animate={{ 
                          scale: [1, 1.3, 1],
                          y: [0, -5, 0]
                        }}
                        transition={{ 
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 0.5
                        }}
                      />
                    </div>
                  </motion.div>

                  {/* Text Content */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-purple-600 dark:from-white dark:to-purple-400 bg-clip-text text-transparent mb-4">
                      {t('categoryPage.noProducts')}
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-2 max-w-md mx-auto leading-relaxed">
                      {t('categoryPage.noProductsDescription')}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
                      {t('categoryPage.noProductsHint')}
                    </p>
                  </motion.div>

                  {/* Animated Back to Home Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                  >
                    <Link
                      to='/'
                      className="group inline-flex items-center gap-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-2xl transition-all duration-500 relative overflow-hidden"
                    >
                      {/* Background Shine Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                      
                      {/* Icon with Animation */}
                      <motion.div
                        className="flex items-center justify-center"
                        whileHover={{ 
                          scale: 1.1,
                          rotate: -5
                        }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <Home className="w-6 h-6" />
                      </motion.div>
                      
                      {/* Text */}
                      <span className="relative z-10 text-lg">
                        {t("categoryPage.exploreOtherCategories")}
                      </span>
                      
                      {/* Arrow with Animation */}
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ 
                          duration: 1.5, 
                          repeat: Infinity,
                          repeatType: "reverse"
                        }}
                      >
                        <ArrowLeft className="w-5 h-5 transform rotate-180" />
                      </motion.div>
                    </Link>
                  </motion.div>

                  {/* Additional Options */}
                  <motion.div
                    className="flex flex-wrap justify-center gap-4 mt-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    <Link
                      to="/categories"
                      className="inline-flex items-center gap-2 px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 border border-gray-300 dark:border-gray-600 rounded-xl hover:border-blue-300 dark:hover:border-blue-500"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {t("categoryPage.browseAllCategories")}
                      </span>
                    </Link>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {products?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {/* Controls Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-4">
                    <p className="text-gray-600 dark:text-gray-300">
                      {t('categoryPage.productsCount', { count: products.length })}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {/* View Mode Toggle */}
                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-2xl p-1">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-xl transition-all ${
                          viewMode === 'grid' 
                            ? 'bg-white dark:bg-gray-600 shadow-sm' 
                            : 'text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        <Grid className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-xl transition-all ${
                          viewMode === 'list' 
                            ? 'bg-white dark:bg-gray-600 shadow-sm' 
                            : 'text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        <List className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Sort Dropdown */}
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-gray-500" />
                      <select 
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                      >
                        <option value="popular">{t('categoryPage.sortOptions.popular')}</option>
                        <option value="newest">{t('categoryPage.sortOptions.newest')}</option>
                        <option value="priceLow">{t('categoryPage.sortOptions.priceLow')}</option>
                        <option value="priceHigh">{t('categoryPage.sortOptions.priceHigh')}</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Products Grid/List */}
                <div className={`
                  ${viewMode === 'grid' 
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
                    : 'space-y-4'
                  }
                `}>
                  {products.map((product, index) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className={viewMode === 'list' ? 'bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700' : ''}
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
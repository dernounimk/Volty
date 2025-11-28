import { useEffect, useState } from "react";
import { useProductStore } from "../stores/useProductStore";
import useSettingStore from "../stores/useSettingStore";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ShoppingBag, Filter, Grid, List, Home } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { useTranslation } from "react-i18next";
import LoadingSpinner from "../components/LoadingSpinner";

const CategoryPage = () => {
  const productStore = useProductStore();
  const settingStore = useSettingStore();
  
  const { category } = useParams();
  const { t } = useTranslation();
  
  // إصلاح: استخدام useState بشكل منفصل
  const [categoryNotFound, setCategoryNotFound] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("popular");
  const [hasFetched, setHasFetched] = useState(false);

  // الحصول على البيانات بشكل آمن
  const products = Array.isArray(productStore.products) ? productStore.products : [];
  const categories = Array.isArray(settingStore.categories) ? settingStore.categories : [];
  const productsLoading = Boolean(productStore.isLoading);
  const categoriesLoading = Boolean(settingStore.loadingMeta);

  // تحميل التصنيفات
  useEffect(() => {
    if (categories.length === 0 && !categoriesLoading) {
      settingStore.fetchMetaData?.();
    }
  }, [categories.length, categoriesLoading, settingStore]);

  // البحث عن التصنيف
  useEffect(() => {
    if (!category || categories.length === 0 || hasFetched || categoryNotFound) {
      return;
    }

    const categoryParam = String(category).toLowerCase().trim();
    
    const foundCategory = categories.find(cat => {
      if (!cat || !cat._id) return false;
      
      const catId = String(cat._id).toLowerCase().trim();
      const catName = String(cat.name || "").toLowerCase().trim();
      const catSlug = String(cat.slug || "").toLowerCase().trim();
      
      return catId === categoryParam || 
             catName === categoryParam || 
             catSlug === categoryParam;
    });

    if (foundCategory) {
      productStore.fetchProductsByCategory?.(foundCategory._id);
      setCategoryNotFound(false);
      setHasFetched(true);
    } else {
      setCategoryNotFound(true);
      setHasFetched(true);
    }
  }, [category, categories, hasFetched, categoryNotFound, productStore]);

  // إعادة التعيين عند تغيير المعلمة
  useEffect(() => {
    setHasFetched(false);
    setCategoryNotFound(false);
  }, [category]);

  // البحث عن التصنيف الحالي
  const currentCategory = categories.find(cat => {
    if (!cat || !cat._id) return false;
    const categoryParam = String(category || "").toLowerCase().trim();
    const catId = String(cat._id).toLowerCase().trim();
    const catName = String(cat.name || "").toLowerCase().trim();
    const catSlug = String(cat.slug || "").toLowerCase().trim();
    
    return catId === categoryParam || 
           catName === categoryParam || 
           catSlug === categoryParam;
  });

  const translatedCategoryName = currentCategory 
    ? t(`categories.${currentCategory.name}`, currentCategory.name)
    : category
    ? t(`categories.${category}`, category)
    : t("categoryPage.unknownCategory");

  // شروط التحميل
  const isLoading = (categoriesLoading && categories.length === 0) || 
                   (productsLoading && !hasFetched);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (categoryNotFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
        <div className="text-center">
          <div className="w-32 h-32 bg-gradient-to-r from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
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
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft size={20} />
            {t("categoryPage.backToHome")}
          </Link>
        </div>
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
        {currentCategory?.imageUrl ? (
          <div className="relative h-64 w-full mb-8 rounded-xl overflow-hidden shadow-lg">
            <img
              src={currentCategory.imageUrl}
              alt={currentCategory.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  {translatedCategoryName}
                </h1>
                {currentCategory.description && (
                  <p className="text-gray-200">
                    {currentCategory.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {translatedCategoryName}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {t('categoryPage.subtitle')}
            </p>
          </div>
        )}

        {/* Products Section */}
        {productsLoading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="xl" />
          </div>
        ) : products.length > 0 ? (
          <div>
            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
              <p className="text-gray-600 dark:text-gray-300">
                {t('categoryPage.productsCount', { count: products.length })}
              </p>
              
              <div className="flex items-center gap-4">
                {/* View Toggle */}
                <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded ${viewMode === "grid" ? "bg-white dark:bg-gray-600 text-blue-600 shadow" : "text-gray-500"}`}
                  >
                    <Grid size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded ${viewMode === "list" ? "bg-white dark:bg-gray-600 text-blue-600 shadow" : "text-gray-500"}`}
                  >
                    <List size={16} />
                  </button>
                </div>

                {/* Sort */}
                <div className="flex items-center gap-2">
                  <Filter size={16} className="text-gray-500" />
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="popular">{t('categoryPage.sortOptions.popular')}</option>
                    <option value="newest">{t('categoryPage.sortOptions.newest')}</option>
                    <option value="priceLow">{t('categoryPage.sortOptions.priceLow')}</option>
                    <option value="priceHigh">{t('categoryPage.sortOptions.priceHigh')}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className={viewMode === "grid" 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
              : "space-y-4"
            }>
              {products.map((product, index) => (
                <div
                  key={product._id || `product-${index}`}
                  className={viewMode === "list" ? "bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700" : ""}
                >
                  <ProductCard 
                    product={product} 
                    viewMode={viewMode}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t('categoryPage.noProducts')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
              {t('categoryPage.noProductsDescription')}
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <Home size={20} />
              {t("categoryPage.backToHome")}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProductStore } from "../stores/useProductStore";
import useSettingStore from "../stores/useSettingStore";
import ProductCard from "../components/ProductCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Filter, Grid, List } from "lucide-react";

const CategoryPage = () => {
  const { t, i18n } = useTranslation();
  const { category } = useParams();
  const navigate = useNavigate();
  
  const { 
    products = [], 
    fetchProductsByCategory, 
    loading 
  } = useProductStore();
  
  const { categories = [] } = useSettingStore();
  
  const [categoryInfo, setCategoryInfo] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');

  // تحقق من وجود category
  useEffect(() => {
    console.log("Category parameter:", category);
    
    if (!category) {
      console.error("No category parameter found in URL");
      navigate("/");
      return;
    }
  }, [category, navigate]);

  useEffect(() => {
    const loadCategoryData = async () => {
      if (category) {
        try {
          console.log("Fetching products for category:", category);
          await fetchProductsByCategory(category);
          
          // البحث عن معلومات التصنيف
          const foundCategory = categories.find(cat => 
            cat._id === category || 
            cat.slug === category ||
            (cat.name && typeof cat.name === 'object' && cat.name[i18n.language] === category)
          );
          
          console.log("Found category info:", foundCategory);
          setCategoryInfo(foundCategory || null);
        } catch (error) {
          console.error("Error loading category data:", error);
        }
      }
    };
    
    loadCategoryData();
  }, [category, fetchProductsByCategory, categories, i18n.language]);

  // تحقق من أن products مصفوفة
  const safeProducts = Array.isArray(products) ? products : [];
  
  // فرز المنتجات
  const sortedProducts = [...safeProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return (a.priceAfterDiscount || a.price) - (b.priceAfterDiscount || b.price);
      case 'price-high':
        return (b.priceAfterDiscount || b.price) - (a.priceAfterDiscount || a.price);
      case 'name':
      default:
        return (a.name || '').localeCompare(b.name || '');
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* رأس الصفحة */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            {t('common.back')}
          </button>
          
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {categoryInfo ? 
              (categoryInfo.name?.[i18n.language] || categoryInfo.name || category) 
              : category
            }
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {t('category.showingProducts', { count: safeProducts.length })}
          </p>
        </motion.div>

        {/* أدوات التحكم */}
        {safeProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
          >
            <div className="flex items-center gap-4">
              {/* تغيير طريقة العرض */}
              <div className="flex bg-white dark:bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-600 dark:text-gray-300'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-600 dark:text-gray-300'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>

              {/* الفرز */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm"
              >
                <option value="name">{t('category.sortByName')}</option>
                <option value="price-low">{t('category.sortByPriceLow')}</option>
                <option value="price-high">{t('category.sortByPriceHigh')}</option>
              </select>
            </div>
          </motion.div>
        )}

        {/* شبكة المنتجات */}
        {safeProducts.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={`
              ${viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
                : 'space-y-4'
              }
            `}
          >
            {sortedProducts.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={viewMode === 'list' ? 'max-w-4xl mx-auto' : ''}
              >
                <ProductCard 
                  product={product} 
                  viewMode={viewMode}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          // حالة عدم وجود منتجات
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <Filter className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {t('category.noProducts')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {t('category.noProductsDescription')}
              </p>
              <button
                onClick={() => navigate('/')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                {t('category.continueShopping')}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
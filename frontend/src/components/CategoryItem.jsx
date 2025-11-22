import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import useSettingStore from "../stores/useSettingStore";
import { ArrowRight, ShoppingBag } from "lucide-react";

const CategoryItem = ({ category, href }) => {
  const { t, i18n } = useTranslation();
  const { categories } = useSettingStore();

  // البحث عن التصنيف الكامل إذا تم تمرير ID فقط
  const fullCategory = typeof category === 'string' ? 
    categories.find(c => c._id === category) : 
    category;

  // معالجة الترجمة المتعددة للاسم
  const translatedName = fullCategory?.name?.[i18n.language] || 
                       fullCategory?.name ||
                       t('category.unknown');

  // صورة افتراضية إذا لم توجد صورة
  const imageUrl = fullCategory?.imageUrl || '/default-category.jpg';

  // رابط افتراضي إذا لم يتم توفيره
  const categoryHref = href || `/category/${fullCategory?.slug || fullCategory?._id}`;

  return (
    <motion.div
      className="group relative overflow-hidden rounded-3xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200 dark:border-gray-700"
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <Link to={categoryHref} className="block h-full">
        <div className="relative h-64 w-full cursor-pointer overflow-hidden">
          {/* طبقة تدرج لوني */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
          
          {/* تأثير إشعاعي */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
          
          {/* صورة التصنيف */}
          <img
            src={imageUrl}
            alt={translatedName}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            loading="lazy"
            onError={(e) => {
              e.target.src = '/default-category.jpg';
            }}
          />
          
          {/* محتوى التصنيف */}
          <div className="absolute bottom-0 left-0 right-0 p-6 z-20 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-white text-2xl font-bold drop-shadow-lg">
                {translatedName}
              </h3>
              
              {/* أيقونة متحركة */}
              <motion.div
                className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <ArrowRight className="w-5 h-5 text-white" />
              </motion.div>
            </div>
            
            {/* عدد المنتجات (اختياري) */}
            {fullCategory?.productCount && (
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-white/80" />
                <span className="text-white/80 text-sm font-medium">
                  {t("category.productsCount", { count: fullCategory.productCount })}
                </span>
              </div>
            )}
            
            {/* وصف التصنيف (إذا وجد) */}
            {fullCategory?.description && (
              <p className="text-white/80 text-sm leading-relaxed line-clamp-2">
                {fullCategory.description}
              </p>
            )}
          </div>

          {/* تأثير hover إضافي */}
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/30 rounded-3xl transition-all duration-300 z-10" />
        </div>
      </Link>
    </motion.div>
  );
};

export default CategoryItem;
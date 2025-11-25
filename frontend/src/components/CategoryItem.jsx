import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import useSettingStore from "../stores/useSettingStore";
import { ArrowRight, ShoppingBag, Star, Clock, TrendingUp } from "lucide-react";

const CategoryItem = ({ category, href, index = 0 }) => {
  const { t, i18n } = useTranslation();
  const { categories } = useSettingStore();
  const isRTL = i18n.language === 'ar';

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

  // ألوان متدرجة مختلفة لكل بطاقة
  const gradientColors = [
    'from-blue-500/20 to-purple-600/20',
    'from-green-500/20 to-teal-600/20', 
    'from-orange-500/20 to-red-600/20',
    'from-purple-500/20 to-pink-600/20',
    'from-teal-500/20 to-blue-600/20',
    'from-amber-500/20 to-orange-600/20'
  ];
  
  const selectedGradient = gradientColors[index % gradientColors.length];

  return (
    <motion.div
      className="group relative overflow-hidden rounded-3xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-200/50 dark:border-gray-700/50"
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ 
        scale: 1.03, 
        y: -8,
        transition: { type: "spring", stiffness: 400, damping: 25 }
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        type: "spring", 
        stiffness: 300, 
        damping: 25 
      }}
    >
      <Link to={categoryHref} className="block h-full">
        <div className="relative h-72 w-full cursor-pointer overflow-hidden rounded-3xl">
          {/* طبقة تدرج لوني رئيسية */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10 opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
          
          {/* تأثير تدرج لوني تفاعلي */}
          <div className={`absolute inset-0 bg-gradient-to-r ${selectedGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-5`} />
          
          {/* تأثير وميض */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 z-10" />
          
          {/* صورة التصنيف */}
          <motion.img
            src={imageUrl}
            alt={translatedName}
            className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110"
            loading="lazy"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8 }}
            onError={(e) => {
              e.target.src = '/default-category.jpg';
            }}
          />
          
          {/* محتوى التصنيف */}
          <div className="absolute inset-0 p-6 z-20 flex flex-col justify-end space-y-4">
            {/* العنوان والأيقونة */}
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-2">
                <motion.h3 
                  className="text-white text-2xl lg:text-3xl font-bold drop-shadow-2xl leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                >
                  {translatedName}
                </motion.h3>
                
                {/* وصف التصنيف (إذا وجد) */}
                {fullCategory?.description && (
                  <motion.p 
                    className="text-white/80 text-sm leading-relaxed line-clamp-2 drop-shadow-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                  >
                    {fullCategory.description}
                  </motion.p>
                )}
              </div>
              
              {/* أيقونة متحركة */}
              <motion.div
                className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg ml-4 flex-shrink-0"
                whileHover={{ 
                  scale: 1.15, 
                  rotate: isRTL ? -5 : 5,
                  transition: { type: "spring", stiffness: 500 }
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 + 0.4 }}
              >
                <ArrowRight className={`w-6 h-6 text-white ${isRTL ? 'rotate-180' : ''}`} />
              </motion.div>
            </div>
            
            {/* معلومات إضافية */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-4">
                {/* عدد المنتجات */}
                {fullCategory?.productCount !== undefined && (
                  <motion.div 
                    className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                  >
                    <ShoppingBag className="w-4 h-4 text-white" />
                    <span className="text-white text-sm font-medium">
                      {t("category.productsCount", { count: fullCategory.productCount })}
                    </span>
                  </motion.div>
                )}
                
                {/* التصنيف المميز */}
                {fullCategory?.featured && (
                  <motion.div 
                    className="flex items-center gap-2 bg-amber-500/20 backdrop-blur-sm rounded-full px-3 py-1.5"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.6 }}
                  >
                    <Star className="w-4 h-4 text-amber-400" />
                    <span className="text-amber-400 text-sm font-medium">
                      {t("category.featured")}
                    </span>
                  </motion.div>
                )}
              </div>
              
              {/* مؤشر النشاط */}
              <motion.div 
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.7 }}
              >
                {fullCategory?.trending && (
                  <TrendingUp className="w-4 h-4 text-green-400" />
                )}
                {fullCategory?.recent && (
                  <Clock className="w-4 h-4 text-blue-400" />
                )}
              </motion.div>
            </div>
          </div>

          {/* تأثير حدود تفاعلية */}
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/40 rounded-3xl transition-all duration-500 z-15" />
          
          {/* تأثير ضوء عند hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl z-5" />
        </div>
      </Link>

      {/* تأثير ظل متحرك */}
      <motion.div 
        className="absolute inset-0 rounded-3xl shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.3) 0%, transparent 70%)'
        }}
      />
    </motion.div>
  );
};

export default CategoryItem;
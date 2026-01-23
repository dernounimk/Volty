import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import useSettingStore from "../stores/useSettingStore";
import { ArrowRight, ShoppingBag, Star, Clock, TrendingUp, Zap } from "lucide-react";

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

  // ألوان متدرجة متوافقة مع الهوية البصرية
  const gradientColors = [
    'from-[var(--color-electric)]/20 to-[var(--color-accent)]/30',
    'from-[var(--color-electric)]/30 to-blue-600/30', 
    'from-purple-600/20 to-[var(--color-accent)]/30',
    'from-[var(--color-electric)]/20 to-purple-600/30',
    'from-blue-600/20 to-[var(--color-accent)]/30',
    'from-[var(--color-accent)]/20 to-purple-600/30'
  ];
  
  const selectedGradient = gradientColors[index % gradientColors.length];

  return (
    <motion.div
      className="group relative overflow-hidden rounded-3xl bg-[var(--color-bg-opacity)] backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-[var(--color-border)]"
      whileHover={{ 
        scale: 1.03, 
        y: -8,
        transition: { type: "spring", stiffness: 400, damping: 25 }
      }}
      whileTap={{ scale: 0.98 }}
    >
      <Link to={categoryHref} className="block h-full">
        <div className="relative h-72 w-full cursor-pointer overflow-hidden rounded-3xl">
          {/* طبقة تدرج لوني رئيسية */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10 opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
          
          {/* تأثير تدرج لوني تفاعلي باستخدام ألوان الهوية */}
          <div className={`absolute inset-0 bg-gradient-to-r ${selectedGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-5`} />
          
          {/* تأثير وميض كهربائي */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--color-electric)]/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 z-10" />
          
          {/* صورة التصنيف */}
          <img
            src={imageUrl}
            alt={translatedName}
            className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110"
            loading="lazy"
            onError={(e) => {
              e.target.src = '/default-category.jpg';
            }}
          />
          
          {/* محتوى التصنيف */}
          <div className="absolute inset-0 p-6 z-20 flex flex-col justify-end space-y-4">
            {/* العنوان والأيقونة */}
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-2">
                <h3 className="text-white text-2xl lg:text-3xl font-bold drop-shadow-2xl leading-tight">
                  {translatedName}
                </h3>
                
                {/* وصف التصنيف (إذا وجد) */}
                {fullCategory?.description && (
                  <p className="text-white/80 text-sm leading-relaxed line-clamp-2 drop-shadow-lg">
                    {fullCategory.description}
                  </p>
                )}
              </div>
              
              {/* أيقونة متحركة بتدرج الهوية */}
              <motion.div
                className="w-12 h-12 bg-gradient-to-r from-[var(--color-electric)] to-[var(--color-accent)] backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg ml-4 flex-shrink-0 border border-white/20"
                whileHover={{ 
                  scale: 1.15, 
                  rotate: isRTL ? -5 : 5,
                  transition: { type: "spring", stiffness: 500 }
                }}
              >
                <ArrowRight className={`w-6 h-6 text-white ${isRTL ? 'rotate-180' : ''}`} />
              </motion.div>
            </div>
            
            {/* معلومات إضافية */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-4">
                {/* عدد المنتجات */}
                {fullCategory?.productCount !== undefined && (
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/10">
                    <ShoppingBag className="w-4 h-4 text-white" />
                    <span className="text-white text-sm font-medium">
                      {t("category.productsCount", { count: fullCategory.productCount })}
                    </span>
                  </div>
                )}
                
                {/* التصنيف المميز */}
                {fullCategory?.featured && (
                  <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500/30 to-yellow-500/30 backdrop-blur-sm rounded-full px-3 py-1.5 border border-amber-400/20">
                    <Star className="w-4 h-4 text-amber-300" />
                    <span className="text-amber-300 text-sm font-medium">
                      {t("category.featured")}
                    </span>
                  </div>
                )}

                {/* تصنيف نشط/سريع */}
                {fullCategory?.isFast && (
                  <div className="flex items-center gap-2 bg-gradient-to-r from-green-500/30 to-emerald-600/30 backdrop-blur-sm rounded-full px-3 py-1.5 border border-green-400/20">
                    <Zap className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-sm font-medium">
                      {t("category.fastDelivery")}
                    </span>
                  </div>
                )}
              </div>
              
              {/* مؤشر النشاط */}
              <div className="flex items-center gap-2">
                {fullCategory?.trending && (
                  <TrendingUp className="w-4 h-4 text-green-400" />
                )}
                {fullCategory?.recent && (
                  <Clock className="w-4 h-4 text-blue-400" />
                )}
              </div>
            </div>
          </div>

          {/* تأثير حدود تفاعلية */}
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-[var(--color-electric)]/40 rounded-3xl transition-all duration-500 z-15" />
          
          {/* تأثير ضوء عند hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-electric)]/0 via-[var(--color-accent)]/10 to-[var(--color-electric)]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl z-5" />
        </div>
      </Link>

      {/* تأثير ظل متحرك */}
      <div 
        className="absolute inset-0 rounded-3xl shadow-2xl opacity-0 group-hover:opacity-70 transition-opacity duration-500 -z-10"
        style={{
          background: `radial-gradient(ellipse at center, var(--color-electric)/20 0%, transparent 70%)`
        }}
      />

      {/* نقاط مضيئة متحركة */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[var(--color-electric)] rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 2 + Math.random(),
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default CategoryItem;
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Star, Sparkles, Award, Zap } from "lucide-react";
import ProductCard from "./ProductCard";
import LoadingSpinner from "./LoadingSpinner";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

const FeaturedProducts = ({ featured }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [isLoading, setIsLoading] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerPage(1);
      else if (window.innerWidth < 768) setItemsPerPage(2);
      else if (window.innerWidth < 1024) setItemsPerPage(3);
      else setItemsPerPage(4);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || featured?.length <= itemsPerPage) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= featured.length - itemsPerPage) {
          return 0;
        }
        return prev + 1;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [currentIndex, featured?.length, itemsPerPage, isAutoPlaying]);

  if (isLoading) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!featured || featured.length === 0) {
    return (
      <motion.div
        className="text-center py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20 rounded-3xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
          {t("featured.noProducts")}
        </p>
        <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
          {t("featured.checkBackLater")}
        </p>
      </motion.div>
    );
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => {
      if (prev >= featured.length - itemsPerPage) {
        return 0;
      }
      return prev + 1;
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => {
      if (prev === 0) {
        return featured.length - itemsPerPage;
      }
      return prev - 1;
    });
  };

  const goToSlide = (index) => {
    setCurrentIndex(index * itemsPerPage);
  };

  const isStartDisabled = featured.length <= itemsPerPage;
  const totalSlides = Math.ceil(featured.length / itemsPerPage);
  const currentSlide = Math.floor(currentIndex / itemsPerPage);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { 
      y: 30, 
      opacity: 0,
      scale: 0.9
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  };

  return (
    <motion.section
      className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20 rounded-3xl p-6 md:p-8 lg:p-12 shadow-2xl border border-gray-200/50 dark:border-gray-700/50"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={containerVariants}
    >
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-200/30 dark:bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-200/30 dark:bg-purple-400/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <motion.div
        className="text-center mb-12 relative z-10"
        variants={itemVariants}
      >
        <motion.div
          className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white px-6 py-3 rounded-full mb-6 shadow-lg"
          whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }}
          transition={{ duration: 0.3 }}
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-sm font-bold tracking-wide">
            {t("featured.badge")}
          </span>
          <Zap className="w-5 h-5" />
        </motion.div>
        
        <motion.h2 
          className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 dark:from-white dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-6"
          whileInView={{ scale: [0.9, 1] }}
          transition={{ duration: 0.5 }}
        >
          {t("featured.title")}
        </motion.h2>
        
        <motion.p 
          className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
          variants={itemVariants}
        >
          {t("featured.subtitle")}
        </motion.p>
      </motion.div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Navigation Buttons */}
        {!isStartDisabled && (
          <>
            <motion.button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-300/50 dark:border-gray-600/50 rounded-2xl shadow-2xl flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 z-20"
              whileHover={{ 
                scale: 1.15,
                x: -2
              }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <ChevronLeft className="w-7 h-7 text-gray-700 dark:text-gray-300" />
            </motion.button>

            <motion.button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-300/50 dark:border-gray-600/50 rounded-2xl shadow-2xl flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 z-20"
              whileHover={{ 
                scale: 1.15,
                x: 2
              }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <ChevronRight className="w-7 h-7 text-gray-700 dark:text-gray-300" />
            </motion.button>
          </>
        )}

        {/* Carousel */}
        <div className="overflow-hidden px-2">
          <motion.div
            className="flex"
            animate={{ 
              x: isRTL ? `+${currentIndex * (100 / itemsPerPage)}%` : `-${currentIndex * (100 / itemsPerPage)}%`
            }}
            transition={{ 
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
          >
            {featured.map((product, index) => (
              <motion.div
                key={product._id}
                className={`flex-shrink-0 px-3`}
                style={{ width: `${100 / itemsPerPage}%` }}
                custom={index}
                variants={itemVariants}
              >
                <ProductCard 
                  product={product} 
                  featured={true}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Auto-play Toggle */}
        {!isStartDisabled && (
          <motion.div 
            className="flex justify-center mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                isAutoPlaying 
                  ? 'bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/30' 
                  : 'bg-gray-500/20 text-gray-600 dark:text-gray-400 border border-gray-500/30'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${isAutoPlaying ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
              {isAutoPlaying ? t("featured.autoPlaying") : t("featured.autoPlayStopped")}
            </button>
          </motion.div>
        )}
      </div>

      {/* Dots Indicator */}
      {totalSlides > 1 && (
        <motion.div 
          className="flex justify-center gap-3 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {Array.from({ length: totalSlides }).map((_, index) => (
            <motion.button
              key={index}
              onClick={() => goToSlide(index)}
              className={`relative rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 w-10'
                  : 'bg-gray-300 dark:bg-gray-600 w-3 hover:bg-gray-400 dark:hover:bg-gray-500'
              } h-3`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              {index === currentSlide && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-white/20"
                  layoutId="activeDot"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* Progress Bar */}
      {!isStartDisabled && isAutoPlaying && (
        <motion.div 
          className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 mt-6 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ 
              duration: 4,
              ease: "linear",
              repeat: Infinity,
              repeatType: "loop"
            }}
          />
        </motion.div>
      )}
    </motion.section>
  );
};

export default FeaturedProducts;
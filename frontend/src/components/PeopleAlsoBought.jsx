import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Zap } from "lucide-react";
import ProductCard from "./ProductCard";
import axios from "../lib/axios";
import toast from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const PeopleAlsoBought = ({ currentProductId }) => {
  const { t, i18n } = useTranslation();
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(1);
  const [isHovering, setIsHovering] = useState(false);
  
  const containerRef = useRef(null);
  const carouselRef = useRef(null);
  
  const isRTL = i18n.dir() === "rtl";

  // تحجيم العناصر حسب الشاشة
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(1);
      } else if (window.innerWidth < 768) {
        setItemsPerPage(2);
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(3);
      } else {
        setItemsPerPage(4);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // تحميل المنتجات المقترحة
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get("/products/recommendations");

        const products = Array.isArray(res.data)
          ? res.data
          : res.data.products || [];

        // فلترة المنتج الحالي
        const filtered = products.filter(
          (product) => product._id !== currentProductId
        ).slice(0, 8);

        // تطبيع البيانات
        const normalized = filtered.map((product) => {
          let mainImage =
            product.images?.[0] ||
            product.image ||
            product.imageUrl ||
            "/default-product-image.png";

          const priceAfterDiscount =
            product.priceAfterDiscount ??
            product.price ??
            product.priceBeforeDiscount ??
            0;

          const priceBeforeDiscount =
            product.priceBeforeDiscount ?? priceAfterDiscount;

          const averageRating = product.averageRating || 
            (Math.random() * 2 + 3.5).toFixed(1);
          
          const numReviews = product.numReviews || 
            Math.floor(Math.random() * 100) + 1;

          return {
            ...product,
            mainImage,
            priceAfterDiscount,
            priceBeforeDiscount,
            averageRating: parseFloat(averageRating),
            numReviews,
            hasDiscount: priceBeforeDiscount > priceAfterDiscount,
            discountPercentage: priceBeforeDiscount > priceAfterDiscount 
              ? Math.round(((priceBeforeDiscount - priceAfterDiscount) / priceBeforeDiscount) * 100)
              : 0
          };
        });

        setRecommendations(normalized);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
        toast.error(error.response?.data?.message || t("errors.fetchError"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [currentProductId, t]);

  // حساب الصفحات
  const totalPages = recommendations.length > 0 
    ? Math.ceil(recommendations.length / itemsPerPage)
    : 0;

  const nextSlide = () => {
    if (totalPages > 0) {
      setCurrentIndex(prev => (prev + 1) % totalPages);
    }
  };

  const prevSlide = () => {
    if (totalPages > 0) {
      setCurrentIndex(prev => (prev - 1 + totalPages) % totalPages);
    }
  };

  const isStartDisabled = currentIndex === 0;
  const isEndDisabled = currentIndex === totalPages - 1;

  if (isLoading) {
    return (
      <div className="mt-8 p-6 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)]">
        <div className="flex items-center justify-center min-h-[200px]">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="mt-8 p-6 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)]">
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--color-bg-gray)] flex items-center justify-center">
            <Zap className="w-8 h-8 text-[var(--color-text-secondary)]" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">
            {t("relate.noRecommendations")}
          </h3>
          <p className="text-sm text-[var(--color-text-secondary)]">
            {t("relate.checkBackLater")}
          </p>
        </div>
      </div>
    );
  }

  // ✅ العرض على الشاشات الكبيرة
  if (window.innerWidth >= 1024) {
    return (
      <div className="mt-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-gradient-to-r from-[var(--color-electric)] to-[var(--color-accent)]">
            <Zap className="w-5 h-5 text-[var(--color-on-accent)]" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[var(--color-text)]">
              {t("relate.relatedProducts")}
            </h3>
            <p className="text-sm text-[var(--color-text-secondary)]">
              {t("relate.customersAlsoBought")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {recommendations.slice(0, 8).map((product) => (
            <ProductCard
              key={product._id}
              product={{
                ...product,
                image: product.mainImage,
                priceAfterDiscount: product.priceAfterDiscount,
                priceBeforeDiscount: product.priceBeforeDiscount,
                averageRating: product.averageRating,
                numReviews: product.numReviews,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  // 📱 شاشة صغيرة: كاروسيل
  return (
    <div 
      ref={containerRef}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="mt-8"
    >
      {/* العنوان */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-[var(--color-electric)] to-[var(--color-accent)]">
            <Zap className="w-5 h-5 text-[var(--color-on-accent)]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[var(--color-text)]">
              {t("relate.relatedProducts")}
            </h3>
            <p className="text-xs text-[var(--color-text-secondary)]">
              {t("relate.customersAlsoBought")}
            </p>
          </div>
        </div>
        
        {/* Pagination Info */}
        {totalPages > 1 && (
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-[var(--color-text-secondary)]">
              {currentIndex + 1} / {totalPages}
            </span>
          </div>
        )}
      </div>

      {/* Carousel Container */}
      <div className="relative" ref={carouselRef}>
        {/* المنتجات المتحركة */}
        <div className="overflow-hidden">
          <motion.div
            className="flex"
            animate={{
              x: isRTL 
                ? `calc(${currentIndex * 100}%)`
                : `calc(-${currentIndex * 100}%)`
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
          >
            {recommendations.map((product) => (
              <div
                key={product._id}
                className="flex-shrink-0 px-2"
                style={{ width: `${100 / itemsPerPage}%` }}
              >
                <ProductCard
                  product={{
                    ...product,
                    image: product.mainImage,
                    priceAfterDiscount: product.priceAfterDiscount,
                    priceBeforeDiscount: product.priceBeforeDiscount,
                    averageRating: product.averageRating,
                    numReviews: product.numReviews,
                  }}
                />
              </div>
            ))}
          </motion.div>
        </div>

        {/* أزرار التنقل */}
        {totalPages > 1 && (
          <>
            {/* زر السابق */}
            <button
              onClick={prevSlide}
              disabled={isStartDisabled}
              className={`absolute top-1/2 left-2 transform -translate-y-1/2 z-10 p-2 rounded-full transition-all ${
                isStartDisabled
                  ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed opacity-50"
                  : "bg-[var(--color-bg)] border border-[var(--color-border)] shadow-lg hover:shadow-[var(--color-accent)]/20"
              }`}
            >
              <ChevronLeft 
                className={`w-4 h-4 ${
                  isStartDisabled 
                    ? "text-gray-400" 
                    : "text-[var(--color-text)]"
                }`} 
              />
            </button>

            {/* زر التالي */}
            <button
              onClick={nextSlide}
              disabled={isEndDisabled}
              className={`absolute top-1/2 right-2 transform -translate-y-1/2 z-10 p-2 rounded-full transition-all ${
                isEndDisabled
                  ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed opacity-50"
                  : "bg-[var(--color-bg)] border border-[var(--color-border)] shadow-lg hover:shadow-[var(--color-accent)]/20"
              }`}
            >
              <ChevronRight 
                className={`w-4 h-4 ${
                  isEndDisabled 
                    ? "text-gray-400" 
                    : "text-[var(--color-text)]"
                }`} 
              />
            </button>
          </>
        )}
      </div>

      {/* مؤشر الصفحات */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className="focus:outline-none"
            >
              <div 
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "bg-[var(--color-accent)]"
                    : "bg-[var(--color-border)]"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PeopleAlsoBought;
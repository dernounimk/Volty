import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";
import axios from "../lib/axios";
import toast from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";
import { useTranslation } from "react-i18next";

const PeopleAlsoBought = ({ currentProductId }) => {
  const { t, i18n } = useTranslation();
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(1);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);

  const isRTL = i18n.dir() === "rtl";

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerPage(1);
      else if (window.innerWidth < 1024) setItemsPerPage(2);
      else if (window.innerWidth < 1280) setItemsPerPage(3);
      else setItemsPerPage(4);
      setIsLargeScreen(window.innerWidth >= 1280);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await axios.get("/products/recommendations");

        const products = Array.isArray(res.data)
          ? res.data
          : res.data.products || [];

        const filtered = products.filter(
          (product) => product._id !== currentProductId
        );

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

          return {
            ...product,
            mainImage,
            priceAfterDiscount,
            priceBeforeDiscount,
            averageRating: product.averageRating || 0,
            numReviews: product.numReviews || 0,
          };
        });

        setRecommendations(normalized);
      } catch (error) {
        toast.error(error.response?.data?.message || "Error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [currentProductId, t]);

  if (isLoading) return <LoadingSpinner />;
  if (recommendations.length === 0) return null;

  // ✅ شاشة كبيرة: عرض منتجين ثابتين
  if (isLargeScreen) {
    return (
      <div className="mt-8 p-6 rounded-2xl backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-800 shadow-lg">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {t("relate.relatedProducts")}
        </h3>
        <div className="grid grid-cols-2 gap-6">
          {recommendations.slice(0, 2).map((product) => (
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

  // 📱 شاشة صغيرة: كاروسيل بالصفحات
  const totalPages = Math.ceil(recommendations.length / itemsPerPage);

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, totalPages - 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const isStartDisabled = currentIndex === 0;
  const isEndDisabled = currentIndex === totalPages - 1;

  return (
    <div className="mt-8 p-6 rounded-2xl backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-800 shadow-lg">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        {t("relate.relatedProducts")}
      </h3>

      <div className="relative">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{
              transform: `translateX(${
                isRTL
                  ? currentIndex * 100
                  : -currentIndex * 100
              }%)`,
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
          </div>
        </div>

        {/* زر السابق */}
        <button
          onClick={prevSlide}
          disabled={isStartDisabled}
          className={`absolute top-1/2 left-2 sm:-left-4 transform -translate-y-1/2 p-3 rounded-2xl backdrop-blur-xl transition-all duration-200 ${
            isStartDisabled
              ? "bg-gray-400 cursor-not-allowed opacity-50"
              : "bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 hover:shadow-lg"
          }`}
        >
          <ChevronLeft 
            className={`w-6 h-6 ${
              isStartDisabled 
                ? "text-gray-300" 
                : "text-gray-700 dark:text-gray-300"
            }`} 
          />
        </button>

        {/* زر التالي */}
        <button
          onClick={nextSlide}
          disabled={isEndDisabled}
          className={`absolute top-1/2 right-2 sm:-right-4 transform -translate-y-1/2 p-3 rounded-2xl backdrop-blur-xl transition-all duration-200 ${
            isEndDisabled
              ? "bg-gray-400 cursor-not-allowed opacity-50"
              : "bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 hover:shadow-lg"
          }`}
        >
          <ChevronRight 
            className={`w-6 h-6 ${
              isEndDisabled 
                ? "text-gray-300" 
                : "text-gray-700 dark:text-gray-300"
            }`} 
          />
        </button>

        {/* مؤشر الصفحات */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? "bg-gradient-to-r from-blue-600 to-purple-600"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PeopleAlsoBought;
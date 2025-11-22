import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useProductStore } from '../stores/useProductStore';
import { useCartStore } from '../stores/useCartStore';
import useSettingStore from '../stores/useSettingStore';
import { ShoppingCart, Minus, Plus, Star, Heart, Share2, Truck, Shield, ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import { Swiper, SwiperSlide } from "swiper/react";
import LoadingSpinner from "../components/LoadingSpinner";
import PeopleAlsoBought from "../components/PeopleAlsoBought";
import { Navigation, Autoplay, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { useTranslation } from "react-i18next";
import StarRating from "../components/StarRating";
import axios from "../lib/axios";
import ReviewsSection from "../components/ReviewsSection";
import { Link } from "react-router-dom";

const ProductPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { fetchProductById } = useProductStore();
  const { colorsList } = useSettingStore();
  const { addToCart } = useCartStore();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [reviews, setReviews] = useState([]);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const [reviewForm, setReviewForm] = useState({
    name: "",
    comment: "",
    rating: 0,
    instagram: ""
  });

  useEffect(() => {
    const loadProduct = async () => {
      setIsLoading(true);
      try {
        const data = await fetchProductById(id);
        
        const productWithFullColors = {
          ...data,
          colors: data.colors?.map(colorId => {
            return colorsList.find(c => c._id === colorId) || 
                   { _id: colorId, name: colorId, hex: '#cccccc' };
          }) || []
        };
 
        setProduct(productWithFullColors);

        if (productWithFullColors.colors?.length > 0) {
          setSelectedColor(productWithFullColors.colors[0]);
        }

        if (productWithFullColors.sizes?.length > 0) {
          setSelectedSize(productWithFullColors.sizes[0]);
        }
      } catch (error) {
        console.error("Error loading product:", error);
        toast.error(t("product.loadError"));
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [id, fetchProductById, colorsList]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`/reviews/${id}`);
        const data = res.data;
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.reviews)
          ? data.reviews
          : Array.isArray(data?.data)
          ? data.data
          : [];

        setReviews(list);

        if (list.length > 0) {
          const avg =
            list.reduce((sum, r) => sum + (r.rating || 0), 0) / list.length;
          setProduct((prev) => ({
            ...prev,
            averageRating: avg,
            numReviews: list.length,
          }));
        } else {
          setProduct((prev) => ({
            ...prev,
            averageRating: 0,
            numReviews: 0,
          }));
        }
      } catch (err) {
        console.error("Error fetching reviews", err);
        setReviews([]);
        setProduct((prev) => ({
          ...prev,
          averageRating: 0,
          numReviews: 0,
        }));
      }
    };
    fetchReviews();
  }, [id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewForm.name.trim()) {
      toast.error(t("product.enterName"));
      return;
    }

    if (!reviewForm.instagram.trim()) {
      toast.error(t("product.enterInstagram"));
      return;
    }

    if (!reviewForm.comment.trim()) {
      toast.error(t("product.enterComment"));
      return;
    }

    if (!reviewForm.rating) {
      toast.error(t("product.selectStars"));
      return;
    }

    const igRegex = /^(?!.*\.\.)(?!\.)(?!.*\.$)[a-zA-Z0-9._]{2,30}$/;
    if (reviewForm.instagram && !igRegex.test(reviewForm.instagram)) {
      toast.error(t("product.invalidInstagram"));
      return;
    }

    try {
      const res = await axios.post(`/reviews/${id}`, reviewForm);
      const newReview = res.data.review || res.data;
      setReviews([newReview, ...reviews]);
      setReviewForm({ name: "", instagram: "", comment: "", rating: 0 });
      toast.success(t("product.reviewAdded"));
    } catch (err) {
      console.error("Add review error:", err);
      toast.error(err.response?.data?.message || t("product.reviewAddFailed"));
    }
  };

  if (isLoading) return <LoadingSpinner />;

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
        <div className="text-center">
          <div className="text-6xl mb-4">😔</div>
          <p className="text-xl text-gray-600 dark:text-gray-300">{t("product.notFound")}</p>
        </div>
      </div>
    );
  }

  const priceAfterDiscount = product.priceAfterDiscount ?? product.priceBeforeDiscount;
  const hasDiscount = product.priceBeforeDiscount && product.priceBeforeDiscount > priceAfterDiscount;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.priceBeforeDiscount - priceAfterDiscount) / product.priceBeforeDiscount) * 100)
    : 0;

  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : product.image ? [product.image] : [];

  const handleAddToCart = () => {
    if (!selectedColor && product.colors?.length > 0) {
      toast.error(t("product.selectColor"));
      return;
    }

    if (!selectedSize && product.sizes?.length > 0) {
      toast.error(t("product.selectSize"));
      return;
    }

    addToCart({
      ...product,
      quantity,
      selectedColor: selectedColor?._id || selectedColor,
      selectedSize,
    });
    
    toast.success(`${product.name} ${t("product.addedToCart")}`);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success(t("product.linkCopied"));
    }
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(!isFavorite ? t("product.addedToFavorites") : t("product.removedFromFavorites"));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 py-8 px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            {t("breadcrumb.home")}
          </Link>
          <span>/</span>
          <span className="text-blue-600 dark:text-blue-400 font-medium">
            {product.name}
          </span>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* معرض الصور */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          {/* الصورة الرئيسية */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <Swiper
              modules={[Navigation, Autoplay, Thumbs]}
              navigation
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              spaceBetween={10}
              slidesPerView={1}
              className="w-full rounded-3xl"
              loop={true}
              thumbs={{ swiper: thumbsSwiper }}
              onSlideChange={(swiper) => setActiveImageIndex(swiper.activeIndex)}
              style={{ height: "500px" }}
            >
              {images.map((img, idx) => (
                <SwiperSlide key={idx} className="w-full h-full">
                  <div className="w-full h-full flex justify-center items-center p-8">
                    <img
                      src={img}
                      className="w-full h-full object-contain rounded-2xl"
                      alt={`${product.name} - ${idx + 1}`}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* الصور المصغرة */}
          {images.length > 1 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
              <Swiper
                modules={[Thumbs]}
                watchSlidesProgress
                onSwiper={setThumbsSwiper}
                spaceBetween={12}
                slidesPerView={4}
                className="thumbs-swiper"
              >
                {images.map((img, idx) => (
                  <SwiperSlide key={idx}>
                    <div 
                      className={`cursor-pointer rounded-xl border-2 transition-all duration-200 ${
                        activeImageIndex === idx 
                          ? 'border-blue-500 shadow-md' 
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={img}
                        className="w-20 h-20 object-cover rounded-lg"
                        alt={`${product.name} thumbnail ${idx + 1}`}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
        </motion.div>

        {/* تفاصيل المنتج */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col justify-center space-y-6"
        >
          {/* العنوان والتقييم */}
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              {product.name}
            </h1>
            <div className="flex items-center gap-4 mb-4">
              <StarRating rating={product.averageRating || 0} />
              <span className="text-gray-600 dark:text-gray-300">
                ({product.numReviews || 0} {t("product.reviews")})
              </span>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* الأسعار */}
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              {hasDiscount && (
                <span className="text-2xl line-through text-gray-500">
                  {product.priceBeforeDiscount} DA
                </span>
              )}
              <span className="text-4xl font-bold text-gray-900 dark:text-white">
                {priceAfterDiscount} DA
              </span>
              {hasDiscount && (
                <span className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full">
                  -{discountPercentage}%
                </span>
              )}
            </div>
          </div>

          {/* الألوان */}
          {product?.colors?.length > 0 && (
            <div className="space-y-3">
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {t("product.color")}
              </p>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => (
                  <motion.button
                    key={color._id}
                    onClick={() => setSelectedColor(color)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all ${
                      selectedColor?._id === color._id
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg"
                        : "border-gray-200 dark:border-gray-600 hover:border-gray-300"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span 
                      className="w-8 h-8 rounded-full shadow-md border-2 border-white dark:border-gray-700"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="font-medium text-gray-900 dark:text-white">
                      {color.name}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* المقاسات */}
          {product.sizes?.length > 0 && (
            <div className="space-y-3">
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {t("product.size")}
              </p>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <motion.button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-6 py-3 rounded-2xl border-2 font-medium transition-all ${
                      selectedSize === size
                        ? "border-blue-500 bg-blue-500 text-white shadow-lg"
                        : "border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white hover:border-gray-300"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {size}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* الكمية والإجراءات */}
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {t("product.quantity")}
              </p>
              <div className="flex items-center gap-4">
                <motion.button
                  className="w-12 h-12 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-2xl flex items-center justify-center text-gray-700 dark:text-gray-300 hover:border-blue-500 transition-all"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Minus className="w-5 h-5" />
                </motion.button>
                <div className="px-6 py-3 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-2xl">
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{quantity}</p>
                </div>
                <motion.button
                  className="w-12 h-12 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-2xl flex items-center justify-center text-gray-700 dark:text-gray-300 hover:border-blue-500 transition-all"
                  onClick={() => setQuantity(quantity + 1)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Plus className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* أزرار الإجراءات */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.button
                className="flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleAddToCart}
                disabled={
                  (product.colors?.length > 0 && !selectedColor) ||
                  (product.sizes?.length > 0 && !selectedSize)
                }
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ShoppingCart className="w-6 h-6" />
                {t("product.addToCart")}
              </motion.button>

              <div className="flex gap-2">
                <motion.button
                  className="flex-1 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-2xl flex items-center justify-center text-gray-700 dark:text-gray-300 hover:border-blue-500 transition-all"
                  onClick={handleToggleFavorite}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Heart className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                </motion.button>
                <motion.button
                  className="flex-1 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-2xl flex items-center justify-center text-gray-700 dark:text-gray-300 hover:border-blue-500 transition-all"
                  onClick={handleShare}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Share2 className="w-6 h-6" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* معلومات إضافية */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
              <Truck className="w-6 h-6 text-blue-500" />
              <div>
                <p className="font-semibold">{t("product.freeShipping")}</p>
                <p className="text-sm">{t("product.shippingInfo")}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
              <Shield className="w-6 h-6 text-green-500" />
              <div>
                <p className="font-semibold">{t("product.securePayment")}</p>
                <p className="text-sm">{t("product.paymentInfo")}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
              <Star className="w-6 h-6 text-yellow-500" />
              <div>
                <p className="font-semibold">{t("product.quality")}</p>
                <p className="text-sm">{t("product.qualityInfo")}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* التقييمات والمراجعات */}
      <div className="max-w-7xl mx-auto mt-16">
        <ReviewsSection
          product={product}
          reviews={reviews}
          reviewForm={reviewForm}
          setReviewForm={setReviewForm}
          handleSubmitReview={handleSubmitReview}
        />
      </div>

      {/* منتجات قد تعجبك */}
      <div className="max-w-7xl mx-auto mt-16">
        <PeopleAlsoBought currentProductId={product._id} category={product.category} />
      </div>
    </div>
  );
};

export default ProductPage;
import { Link } from "react-router-dom";
import { ShoppingCart, Star, Heart, ShoppingBag } from "lucide-react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

const ProductCard = ({ product, onFavoriteToggle }) => {
  const { t } = useTranslation();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setIsFavorite(storedFavorites.some((item) => item._id === product._id));
  }, [product._id]);

  const toggleFavorite = (e) => {
    e.preventDefault();
    let storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (isFavorite) {
      storedFavorites = storedFavorites.filter((item) => item._id !== product._id);
      toast.success(t("removedFromFavorites"));
    } else {
      storedFavorites.push(product);
      toast.success(t("addedToFavorites"));
    }

    localStorage.setItem("favorites", JSON.stringify(storedFavorites));
    setIsFavorite(!isFavorite);

    if (onFavoriteToggle) {
      onFavoriteToggle();
    }
  };

  const addToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // هنا يمكنك إضافة منطق إضافة المنتج للسلة
    toast.success(t("addedToCart"));
  };
  
  return (
    <div dir="ltr" className="h-full flex">
      <Link
        to={`/product/${product._id}`}
        className="group flex flex-col bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-700 h-full w-full max-w-[340px] mx-auto backdrop-blur-sm"
      >
        {/* صورة المنتج مع العلامات */}
        <div className="relative w-full h-60 overflow-hidden">
          <img
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            src={
              Array.isArray(product.images) && product.images.length > 0
                ? product.images[0]
                : product.image
            }
            alt={product.name}
          />

          {/* طبقة تدرج على الصورة */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* علامة التخفيض */}
          {product.priceBeforeDiscount &&
            product.priceBeforeDiscount > (product.priceAfterDiscount ?? product.priceBeforeDiscount) && (
              <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 rounded-xl text-sm font-bold shadow-lg">
                {Math.round(
                  100 -
                    ((product.priceAfterDiscount ?? product.priceBeforeDiscount) /
                      product.priceBeforeDiscount) *
                      100
                )}
                % OFF
              </div>
            )}

          {/* زر المفضلة */}
          <button
            onClick={toggleFavorite}
            className={`absolute top-3 right-3 rounded-xl p-2.5 flex items-center justify-center transition-all duration-200 backdrop-blur-sm ${
              isFavorite
                ? "bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg scale-110"
                : "bg-black/40 text-white hover:bg-black/60 hover:scale-110"
            }`}
          >
            <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
          </button>

          {/* زر إضافة إلى السلة */}
          <button
            onClick={addToCart}
            className="absolute bottom-3 right-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-2.5 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:shadow-lg hover:scale-110"
          >
            <ShoppingBag size={20} />
          </button>
        </div>

        {/* تفاصيل المنتج */}
        <div className="flex flex-col flex-grow p-5">
          <div className="mb-4 flex-grow">
            <h5 className="text-gray-900 dark:text-white text-lg font-semibold mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {product.name}
            </h5>

            {/* تقييم المنتج */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => {
                  const rating = product.averageRating || 0;
                  const full = i + 1 <= Math.floor(rating);
                  const half = i < rating && i + 1 > rating;
                  return (
                    <Star
                      key={i}
                      size={16}
                      className={`${
                        full 
                          ? "text-yellow-400 fill-yellow-400" 
                          : half 
                            ? "text-yellow-400 fill-yellow-400 fill-opacity-50" 
                            : "text-gray-300 dark:text-gray-600"
                      }`}
                      fill="currentColor"
                    />
                  );
                })}
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ({product.reviewCount || 0})
              </span>
            </div>
          </div>

          {/* سعر المنتج */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-gray-900 dark:text-white text-xl font-bold">
                {product.priceAfterDiscount ?? product.priceBeforeDiscount} DA
              </span>

              {product.priceBeforeDiscount &&
                product.priceBeforeDiscount >
                  (product.priceAfterDiscount ?? product.priceBeforeDiscount) && (
                  <span className="text-gray-500 dark:text-gray-400 text-sm line-through opacity-70">
                    {product.priceBeforeDiscount} DA
                  </span>
                )}
            </div>

            {/* زر سريع للإضافة إلى السلة (للشاشات الصغيرة) */}
            <button
              onClick={addToCart}
              className="lg:hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-2.5 hover:shadow-lg transition-all duration-200"
            >
              <ShoppingCart size={18} />
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
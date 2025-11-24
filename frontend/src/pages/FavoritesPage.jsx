import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Info, X, ShoppingBag, ArrowRight } from "lucide-react";
import axios from "../lib/axios";
import ProductCard from "../components/ProductCard";
import { useTranslation } from "react-i18next";

const FavoritesPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [favorites, setFavorites] = useState([]);
  const [showInfo, setShowInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const hasFavorites = favorites.length > 0;

  useEffect(() => {
    const fetchFavoritesDetails = async () => {
      setIsLoading(true);
      const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
      
      if (storedFavorites.length === 0) {
        setIsLoading(false);
        return;
      }

      try {
        const requests = storedFavorites.map((item) =>
          axios
            .get(`/products/${item._id}`)
            .then((res) => res.data)
            .catch(() => null)
        );

        const results = await Promise.all(requests);
        const validProducts = results.filter((p) => p !== null);

        setFavorites(validProducts);
        localStorage.setItem("favorites", JSON.stringify(validProducts));
      } catch (error) {
        console.error("Error fetching favorite products", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavoritesDetails();
  }, []);

  const handleFavoriteToggle = () => {
    const updated = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(updated);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">{t("favoritesPage.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 py-8 px-4 sm:px-6 lg:px-8 pt-24">
      <div className="max-w-7xl mx-auto">
        {/* العنوان وزر المعلومات */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-center mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-red-500 rounded-2xl blur-md opacity-75"></div>
              <div className="relative bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-lg">
                <Heart className="w-8 h-8 text-pink-500" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                {t("favoritesPage.title")}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                {t("favoritesPage.subtitle", { count: favorites.length })}
              </p>
            </div>
          </div>

          {hasFavorites && (
            <div className="relative">
              <motion.button
                onClick={() => setShowInfo(!showInfo)}
                className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Info className="w-6 h-6" />
              </motion.button>

              {showInfo && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`absolute top-full mt-2 z-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-2xl shadow-2xl w-80 ${
                    isRTL ? "left-0" : "right-0"
                  }`}
                >
                  <div className="flex justify-between items-start gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {t("favoritesPage.infoTitle")}
                    </h3>
                    <button 
                      onClick={() => setShowInfo(false)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {t("favoritesPage.info")}
                  </p>
                </motion.div>
              )}
            </div>
          )}
        </motion.div>

        {/* محتوى الصفحة */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {favorites.length === 0 ? (
            <EmptyFavoritesUI />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {favorites.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <ProductCard
                    product={product}
                    onFavoriteToggle={handleFavoriteToggle}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default FavoritesPage;

const EmptyFavoritesUI = () => {
  const { t } = useTranslation();

  return (
    <motion.div
      className="flex flex-col items-center justify-center space-y-6 py-16 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-red-500 rounded-2xl blur-2xl opacity-20 animate-pulse"></div>
        <Heart className="relative h-32 w-32 text-pink-400 dark:text-pink-500" />
      </div>
      
      <div className="space-y-4 max-w-md">
        <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t("favoritesPage.emptyTitle")}
        </h3>
        <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
          {t("favoritesPage.emptySubtitle")}
        </p>
      </div>

      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Link
          to="/"
          className="inline-flex items-center gap-3 mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <ShoppingBag className="w-5 h-5" />
          {t("favoritesPage.startShopping")}
          <ArrowRight className="w-5 h-5" />
        </Link>
      </motion.div>

      {/* نصائح إضافية */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="mt-8 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 max-w-md"
      >
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
          {t("favoritesPage.tipsTitle")}
        </h4>
        <ul className="text-gray-600 dark:text-gray-300 text-left space-y-2 text-sm">
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            {t("favoritesPage.tip1")}
          </li>
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            {t("favoritesPage.tip2")}
          </li>
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            {t("favoritesPage.tip3")}
          </li>
        </ul>
      </motion.div>
    </motion.div>
  );
};
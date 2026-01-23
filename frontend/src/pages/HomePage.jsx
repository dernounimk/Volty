import { useEffect } from "react";
import { motion } from "framer-motion";
import { useProductStore } from "../stores/useProductStore";
import CategoryItem from "../components/CategoryItem";
import useSettingStore from "../stores/useSettingStore";
import FeaturedProducts from "../components/FeaturedProducts";
import LoadingSpinner from "../components/LoadingSpinner";
import { useTranslation } from "react-i18next";
import { Sparkles, Star } from "lucide-react";

const HomePage = () => {
  const { t } = useTranslation();
  
  const { 
    fetchFeaturedProducts, 
    featuredProducts = [], 
    isLoading: productsLoading 
  } = useProductStore();

  const {
    categories,
    fetchMetaData,
    loadingMeta: categoriesLoading
  } = useSettingStore();

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      if (isMounted) {
        try {
          await Promise.all([
            fetchFeaturedProducts(),
            fetchMetaData()
          ]);
        } catch (error) {
          console.error("Error fetching homepage data:", error);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [fetchFeaturedProducts, fetchMetaData]);
  
  return (
    <div className="min-h-screen relative overflow-hidden">

      {/* Content */}
      <div className="relative z-10">
        
        {/* Categories Section */}
        <section className="">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <motion.div
                className="inline-flex items-center gap-2 bg-[var(--color-accent)] text-[var(--color-on-accent)] px-6 py-3 rounded-full shadow-lg"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-semibold">
                  {t("homepage.categoriesBadge")}
                </span>
              </motion.div>
            </div>

            {categoriesLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categories.map((category, index) => (
                  <motion.div
                    key={category._id}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: index * 0.1,
                      ease: "easeOut"
                    }}
                    whileHover={{ y: -5 }}
                  >
                    <CategoryItem 
                      category={{
                        ...category,
                        href: `/category/${category._id}`,
                        imageUdrl: category.imageUrl || '/default-category.jpg'
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Featured Products Section */}
        {!productsLoading && featuredProducts?.length > 0 && (
          <section className="py-12 lg:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <FeaturedProducts featured={featuredProducts} />
            </div>
          </section>
        )}

      </div>
    </div>
  );
};

export default HomePage;
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Filter, X, ChevronDown, ShoppingBag, Star, Sparkles } from "lucide-react";
import axios from "../lib/axios";
import { useTranslation } from "react-i18next";
import LoadingSpinner from "../components/LoadingSpinner";

const SearchResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const searchParams = new URLSearchParams(location.search);
  const initialQuery = searchParams.get('q') || '';

  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState("relevance");
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [debouncedTerm, setDebouncedTerm] = useState(initialQuery);

  const searchInputRef = useRef(null);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
      // Update URL without page reload
      const params = new URLSearchParams();
      if (searchTerm.trim()) {
        params.set('q', searchTerm);
        navigate(`/search?${params.toString()}`, { replace: true });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, navigate]);

  // Fetch products based on search term
  useEffect(() => {
    const fetchProducts = async () => {
      if (!debouncedTerm.trim()) {
        setProducts([]);
        setFilteredProducts([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const { data } = await axios.get(`/products/search?q=${encodeURIComponent(debouncedTerm)}`);
        setProducts(data);
        setFilteredProducts(data);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(data.map(p => p.category?.name).filter(Boolean))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [debouncedTerm]);

  // Fetch categories if needed
  useEffect(() => {
    if (!initialQuery.trim()) {
      // Fetch all products or recent products for empty search
      const fetchAllProducts = async () => {
        setIsLoading(true);
        try {
          const { data } = await axios.get('/products');
          setProducts(data);
          setFilteredProducts(data);
          
          const uniqueCategories = [...new Set(data.map(p => p.category?.name).filter(Boolean))];
          setCategories(uniqueCategories);
        } catch (error) {
          console.error("Error fetching products:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchAllProducts();
    }
  }, [initialQuery]);

  // Apply filters
  useEffect(() => {
    let result = [...products];

    // Apply price filter
    result = result.filter(p => 
      p.priceAfterDiscount >= priceRange[0] && 
      p.priceAfterDiscount <= priceRange[1]
    );

    // Apply category filter
    if (selectedCategories.length > 0) {
      result = result.filter(p => 
        selectedCategories.includes(p.category?.name)
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      switch(sortBy) {
        case 'price-low':
          return a.priceAfterDiscount - b.priceAfterDiscount;
        case 'price-high':
          return b.priceAfterDiscount - a.priceAfterDiscount;
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'rating':
          return (b.averageRating || 0) - (a.averageRating || 0);
        default:
          return 0;
      }
    });

    setFilteredProducts(result);
  }, [products, priceRange, selectedCategories, sortBy]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setPriceRange([0, 1000000]);
    setSelectedCategories([]);
    setSortBy("relevance");
  };

  const maxPrice = Math.max(...products.map(p => p.priceAfterDiscount), 1000000);

  const ProductCard = ({ product }) => {
    const hasDiscount = product.priceBeforeDiscount && product.priceAfterDiscount < product.priceBeforeDiscount;
    const discountPercentage = hasDiscount 
      ? Math.round(((product.priceBeforeDiscount - product.priceAfterDiscount) / product.priceBeforeDiscount) * 100)
      : 0;

    return (
      <Link to={`/product/${product._id}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -5 }}
          className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300"
        >
          {/* Product Image */}
          <div className="relative h-48 md:h-56 overflow-hidden">
            <img
              src={product.image || product.images?.[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            />
            
            {/* Discount Badge */}
            {hasDiscount && (
              <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                -{discountPercentage}%
              </div>
            )}

            {/* Rating Badge */}
            {product.averageRating > 0 && (
              <div className="absolute top-3 left-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                <span className="text-xs font-bold">{product.averageRating.toFixed(1)}</span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-gray-900 dark:text-white line-clamp-1 flex-1">
                {product.name}
              </h3>
              <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full whitespace-nowrap">
                {product.category?.name || t("search.uncategorized")}
              </span>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
              {product.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {hasDiscount && (
                  <span className="text-sm line-through text-gray-500">
                    {product.priceBeforeDiscount} DA
                  </span>
                )}
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {product.priceAfterDiscount} DA
                </span>
              </div>
              <button className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all">
                <ShoppingBag className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </Link>
    );
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Search Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {t("search.resultsFor")} "{debouncedTerm}"
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {isLoading ? t("search.loading") : `${filteredProducts.length} ${t("search.productsFound")}`}
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-2xl pl-4 pr-10 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="relevance">{t("search.sort.relevance")}</option>
                  <option value="price-low">{t("search.sort.priceLow")}</option>
                  <option value="price-high">{t("search.sort.priceHigh")}</option>
                  <option value="newest">{t("search.sort.newest")}</option>
                  <option value="rating">{t("search.sort.rating")}</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 pointer-events-none" />
              </div>

              {/* Filter Toggle Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all ${
                  showFilters 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                <Filter className="w-5 h-5" />
                <span className="hidden md:inline">{t("search.filters")}</span>
              </button>
            </div>
          </motion.div>

          {/* Search Input */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="relative"
          >
            <form onSubmit={handleSearch}>
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-12 py-3 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all duration-300 shadow-sm"
                placeholder={t("search.placeholder")}
                autoFocus
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    searchInputRef.current?.focus();
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </form>
          </motion.div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`lg:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}
          >
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">{t("search.filters")}</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  {t("search.clearAll")}
                </button>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  {t("search.priceRange")}
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">{priceRange[0]} DA</span>
                    <span className="text-gray-600 dark:text-gray-300">{priceRange[1]} DA</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={maxPrice}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
                  />
                </div>
              </div>

              {/* Categories */}
              {categories.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    {t("search.categories")}
                  </h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <label key={category} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category)}
                          onChange={() => handleCategoryToggle(category)}
                          className="hidden"
                        />
                        <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center transition-all ${
                          selectedCategories.includes(category)
                            ? 'bg-blue-500 border-blue-500'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}>
                          {selectedCategories.includes(category) && (
                            <div className="w-2 h-2 bg-white rounded-sm" />
                          )}
                        </div>
                        <span className="text-gray-700 dark:text-gray-300">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Active Filters */}
              {(priceRange[1] < maxPrice || selectedCategories.length > 0) && (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {t("search.activeFilters")}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {priceRange[1] < maxPrice && (
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                        Up to {priceRange[1]} DA
                      </span>
                    )}
                    {selectedCategories.map(category => (
                      <span key={category} className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm">
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Products Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <LoadingSpinner size="lg" />
              </div>
            ) : filteredProducts.length > 0 ? (
              <>
                {/* Results Info */}
                <div className="mb-6">
                  <p className="text-gray-600 dark:text-gray-300">
                    {t("search.showing")} <span className="font-bold text-gray-900 dark:text-white">{filteredProducts.length}</span> {t("search.of")} <span className="font-bold text-gray-900 dark:text-white">{products.length}</span> {t("search.products")}
                  </p>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </div>

                {/* No more results message */}
                {filteredProducts.length === products.length && products.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <Sparkles className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-300">
                      {t("search.allResultsShown")}
                    </p>
                  </motion.div>
                )}
              </>
            ) : (
              /* No Results */
              <div className="text-center py-20">
                <div className="inline-block p-6 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-gray-800 dark:to-gray-700 rounded-3xl mb-6">
                  <Search className="w-16 h-16 text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {t("search.noResults")}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
                  {t("search.noResultsDescription")}
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold hover:shadow-lg transition-all duration-300"
                >
                  {t("search.clearFilters")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;
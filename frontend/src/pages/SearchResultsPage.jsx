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
          className="bg-[var(--color-bg)] rounded-3xl overflow-hidden border border-[var(--color-border)] shadow-lg hover:shadow-2xl transition-all duration-300"
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
              <div className="absolute top-3 right-3 bg-[var(--color-accent)] text-[var(--color-on-accent)] px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                -{discountPercentage}%
              </div>
            )}

            {/* Rating Badge */}
            {product.averageRating > 0 && (
              <div className="absolute top-3 left-3 bg-[var(--color-bg-opacity)] backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                <span className="text-xs font-bold">{product.averageRating.toFixed(1)}</span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-[var(--color-text)] line-clamp-1 flex-1">
                {product.name}
              </h3>
              <span className="text-xs text-[var(--color-text-secondary)] bg-[var(--color-bg-gray)] px-2 py-1 rounded-full whitespace-nowrap">
                {product.category?.name || t("search.uncategorized")}
              </span>
            </div>

            <p className="text-sm text-[var(--color-text-secondary)] mb-3 line-clamp-2">
              {product.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {hasDiscount && (
                  <span className="text-sm line-through text-[var(--color-text-secondary)]">
                    {product.priceBeforeDiscount} DA
                  </span>
                )}
                <span className="text-xl font-bold text-[var(--color-accent)]">
                  {product.priceAfterDiscount} DA
                </span>
              </div>
              <button className="p-2 bg-[var(--color-accent)] text-[var(--color-on-accent)] rounded-xl hover:shadow-lg transition-all">
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
              <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-2">
                {t("search.resultsFor")} "{debouncedTerm}"
              </h1>
              <p className="text-[var(--color-text-secondary)]">
                {isLoading ? t("search.loading") : `${filteredProducts.length} ${t("search.productsFound")}`}
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-[var(--color-bg)] border border-[var(--color-border)] rounded-2xl pl-4 pr-10 py-2.5 text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
                >
                  <option value="relevance">{t("search.sort.relevance")}</option>
                  <option value="price-low">{t("search.sort.priceLow")}</option>
                  <option value="price-high">{t("search.sort.priceHigh")}</option>
                  <option value="newest">{t("search.sort.newest")}</option>
                  <option value="rating">{t("search.sort.rating")}</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-secondary)] w-5 h-5 pointer-events-none" />
              </div>

              {/* Filter Toggle Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all ${
                  showFilters 
                    ? 'bg-[var(--color-accent)] text-[var(--color-on-accent)]' 
                    : 'bg-[var(--color-bg-gray)] text-[var(--color-text)]'
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
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--color-text-secondary)] w-5 h-5" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-12 py-3 bg-[var(--color-bg)] border-2 border-[var(--color-border)] rounded-2xl text-[var(--color-text)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:border-[var(--color-accent)] transition-all duration-300 shadow-sm"
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
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors duration-200"
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
            <div className="bg-[var(--color-bg)] rounded-3xl p-6 shadow-lg border border-[var(--color-border)] sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-[var(--color-text)]">{t("search.filters")}</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors"
                >
                  {t("search.clearAll")}
                </button>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-semibold text-[var(--color-text)] mb-3">
                  {t("search.priceRange")}
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--color-text-secondary)]">{priceRange[0]} DA</span>
                    <span className="text-[var(--color-text-secondary)]">{priceRange[1]} DA</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={maxPrice}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-2 bg-[var(--color-bg-gray)] rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--color-accent)]"
                  />
                </div>
              </div>

              {/* Categories */}
              {categories.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-[var(--color-text)] mb-3">
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
                            ? 'bg-[var(--color-accent)] border-[var(--color-accent)]'
                            : 'border-[var(--color-border)]'
                        }`}>
                          {selectedCategories.includes(category) && (
                            <div className="w-2 h-2 bg-[var(--color-on-accent)] rounded-sm" />
                          )}
                        </div>
                        <span className="text-[var(--color-text)]">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Active Filters */}
              {(priceRange[1] < maxPrice || selectedCategories.length > 0) && (
                <div className="pt-4 border-t border-[var(--color-border)]">
                  <h3 className="font-semibold text-[var(--color-text)] mb-2">
                    {t("search.activeFilters")}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {priceRange[1] < maxPrice && (
                      <span className="px-3 py-1 bg-[var(--color-bg-gray)] text-[var(--color-text)] rounded-full text-sm">
                        Up to {priceRange[1]} DA
                      </span>
                    )}
                    {selectedCategories.map(category => (
                      <span key={category} className="px-3 py-1 bg-[var(--color-bg-gray)] text-[var(--color-text)] rounded-full text-sm">
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
                  <p className="text-[var(--color-text-secondary)]">
                    {t("search.showing")} <span className="font-bold text-[var(--color-text)]">{filteredProducts.length}</span> {t("search.of")} <span className="font-bold text-[var(--color-text)]">{products.length}</span> {t("search.products")}
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
                    <Sparkles className="w-12 h-12 text-[var(--color-accent)] mx-auto mb-4" />
                    <p className="text-[var(--color-text-secondary)]">
                      {t("search.allResultsShown")}
                    </p>
                  </motion.div>
                )}
              </>
            ) : (
              /* No Results */
              <div className="text-center py-20">
                <div className="inline-block p-6 bg-[var(--color-bg-gray)] rounded-3xl mb-6">
                  <Search className="w-16 h-16 text-[var(--color-text-secondary)]" />
                </div>
                <h2 className="text-2xl font-bold text-[var(--color-text)] mb-3">
                  {t("search.noResults")}
                </h2>
                <p className="text-[var(--color-text-secondary)] mb-6 max-w-md mx-auto">
                  {t("search.noResultsDescription")}
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-[var(--color-accent)] text-[var(--color-on-accent)] rounded-2xl font-semibold hover:shadow-lg transition-all duration-300"
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
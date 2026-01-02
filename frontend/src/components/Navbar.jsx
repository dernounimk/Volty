import { 
  ShoppingCart, 
  LogOut, 
  Lock, 
  Menu, 
  Search, 
  XCircle, 
  KeyRound, 
  Globe, 
  Moon, 
  Sun, 
  Home, 
  Phone, 
  Heart, 
  User, 
  ChevronDown,
  ShoppingBag,
  HelpCircle,
  Shield,
  FileText,
  Star,
  ArrowRight,
  Loader2,
  X,
  X as CloseIcon
} from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAdminAuthStore } from "../stores/useAdminAuthStore";
import { useTranslation } from "react-i18next";
import { useCartStore } from "../stores/useCartStore";
import { useState, useEffect, useRef } from "react";
import { useNavbar } from "../context/NavbarContext";
import logoLight from "../../public/logo-light.png";
import logoDark from "../../public/logo-dark.png";
import toast from "react-hot-toast";
import axios from "../lib/axios";
import { motion, AnimatePresence } from "framer-motion";

const languages = [
  { code: "ar", label: "العربية" },
  { code: "en", label: "English" },
  { code: "fr", label: "Français" }
];

const Navbar = () => {
  const { admin, logout, checkingAuth } = useAdminAuthStore();
  const isAdmin = admin?.role === "admin";
  const { cart } = useCartStore();
  const navigate = useNavigate();

  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const { isNavbarOpen: isMenuOpen, setIsNavbarOpen: setIsMenuOpen, searchInputRef } = useNavbar();
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true' || false;
  });
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [favorites] = useState([]);

  const searchContainerRef = useRef(null);
  const searchInputRefLocal = useRef(null);
  const langMenuRef = useRef(null);
  const adminMenuRef = useRef(null);
  const langButtonRef = useRef(null);
  const adminButtonRef = useRef(null);
  const resultsRef = useRef(null);

  const currentLogo = isDarkMode ? logoDark : logoLight;

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', isDarkMode);
  }, [isDarkMode]);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
    setIsLangMenuOpen(false);
  };

  // البحث الفوري عن المنتجات
  useEffect(() => {
    const fetchProducts = async () => {
      const query = searchTerm.trim();
      if (!query) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }
      
      setIsSearching(true);
      try {
        const { data } = await axios.get(`/products/search?q=${encodeURIComponent(query)}&limit=5`);
        setSearchResults(data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setSearchResults([]);
        toast.error(t("navbar.searchError"));
      } finally {
        setIsSearching(false);
      }
    };

    const delay = setTimeout(fetchProducts, 300);
    return () => clearTimeout(delay);
  }, [searchTerm, t]);

  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
    // في الشاشات الصغيرة نغلق البحث عند مسح النص
    if (window.innerWidth < 768) {
      setIsSearchOpen(false);
    }
  };

  const handleResultClick = (id) => {
    setSearchTerm("");
    setSearchResults([]);
    setIsMenuOpen(false);
    setIsSearchOpen(false); // إغلاق البحث بعد اختيار نتيجة
    navigate(`/product/${id}`);
  };

  const handleViewAllResults = () => {
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
      setSearchResults([]);
      setIsSearchOpen(false); // إغلاق البحث
    }
  };

  const handleSearchToggle = () => {
    const isMobile = window.innerWidth < 768;
    if (!isMobile) return;
    
    const newSearchOpen = !isSearchOpen;
    setIsSearchOpen(newSearchOpen);
    
    if (newSearchOpen) {
      // تركيز على حقل البحث بعد فتحه
      setTimeout(() => {
        searchInputRefLocal.current?.focus();
      }, 100);
    } else {
      setSearchTerm("");
      setSearchResults([]);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = searchTerm.trim();
    if (query) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setSearchTerm("");
      setSearchResults([]);
      setIsSearchOpen(false); // إغلاق البحث بعد الإرسال
    }
  };

  // إغلاق القوائم المنسدلة عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isMobile = window.innerWidth < 768;
      
      // إغلاق نتائج البحث في الجوال عند النقر خارج
      if (isMobile && isSearchOpen) {
        const isSearchButton = event.target.closest('[data-search-button]');
        const isSearchInput = searchInputRefLocal.current?.contains(event.target);
        const isSearchResults = resultsRef.current?.contains(event.target);
        
        if (!isSearchButton && !isSearchInput && !isSearchResults) {
          setIsSearchOpen(false);
          setSearchTerm("");
          setSearchResults([]);
        }
      }

      // قائمة اللغة
      if (isLangMenuOpen && 
          langMenuRef.current && 
          !langMenuRef.current.contains(event.target) &&
          langButtonRef.current &&
          !langButtonRef.current.contains(event.target)) {
        setIsLangMenuOpen(false);
      }

      // قائمة الأدمن
      if (isAdminMenuOpen && 
          adminMenuRef.current && 
          !adminMenuRef.current.contains(event.target) &&
          adminButtonRef.current &&
          !adminButtonRef.current.contains(event.target)) {
        setIsAdminMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isLangMenuOpen, isAdminMenuOpen, isSearchOpen]);

  // إغلاق البحث عند الضغط على زر الهروب
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
        setSearchTerm("");
        setSearchResults([]);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isSearchOpen]);

  // تعريف روابط التنقل
  const navLinks = [
    { path: "/", label: t("navbar.home"), icon: <Home size={20} /> },
    { path: "/contact", label: t("navbar.contact"), icon: <Phone size={20} /> },
  ];

  const mobileNavLinks = [
    { path: "/", label: t("navbar.home"), icon: <Home size={24} /> },
    { path: "/contact", label: t("navbar.contact"), icon: <Phone size={24} /> },
    { path: "/faq", label: t("navbar.faq"), icon: <HelpCircle size={24} /> },
  ];

  const renderSearchResults = () => {
    // لا نعرض النتائج إذا لم يكن هناك نص في البحث
    if (!searchTerm.trim()) return null;

    // في الجوال، نظهر النتائج فقط إذا كان البحث مفتوحاً
    const isMobile = window.innerWidth < 768;
    if (isMobile && !isSearchOpen) return null;

    return (
      <AnimatePresence>
        <motion.div
          ref={resultsRef}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 ${
            isMobile ? 'max-h-[70vh] overflow-y-auto' : ''
          }`}
          style={{ 
            // تأكد من أن النتائج فوق كل شيء في الجوال
            zIndex: 9999
          }}
        >
          {isSearching ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
              <span className="ml-3 text-gray-600 dark:text-gray-300">
                {t("navbar.searching")}
              </span>
            </div>
          ) : searchResults.length > 0 ? (
            <>
              <div className="max-h-80 overflow-y-auto">
                {searchResults.map((item, index) => (
                  <motion.div
                    key={item.id || item._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3 px-4 py-3 text-gray-900 dark:text-white hover:bg-blue-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-600 transition-all cursor-pointer active:bg-blue-100 dark:active:bg-gray-600"
                    onClick={() => handleResultClick(item.id || item._id)}
                  >
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                      <img 
                        src={item.image || item.images?.[0] || '/default-product.jpg'} 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex justify-between flex-1 items-center min-w-0">
                      <div className="min-w-0">
                        <p className="font-medium truncate">{item.name}</p>
                        {item.category?.name && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {item.category.name}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end ml-2">
                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                          {item.priceAfterDiscount || item.price} DA
                        </span>
                        {item.priceBeforeDiscount && item.priceAfterDiscount < item.priceBeforeDiscount && (
                          <span className="text-xs text-gray-500 line-through">
                            {item.priceBeforeDiscount} DA
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* زر عرض جميع النتائج */}
              <div className="border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleViewAllResults}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 transition-all font-semibold active:bg-blue-100 dark:active:bg-gray-600"
                >
                  <span>{t("navbar.viewAllResults")}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </>
          ) : searchTerm.trim() && !isSearching ? (
            <div className="px-4 py-6 text-center">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                {t("navbar.noResults")} "{searchTerm}"
              </p>
              <button
                onClick={handleViewAllResults}
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
              >
                {t("navbar.searchAllProducts")}
              </button>
            </div>
          ) : null}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      {/* الشريط العلوي الرئيسي */}
      <div className="backdrop-blur-xl bg-white/95 dark:bg-gray-900/95 border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm transition-all duration-300">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Left Section - Menu & Logo */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {/* Menu Button */}
              <button
                className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 lg:hidden flex-shrink-0 relative w-10 h-10"
                onClick={() => setIsMenuOpen((prev) => !prev)}
                aria-label="Toggle menu"
              >
                <motion.div
                  initial={false}
                  animate={{ rotate: isMenuOpen ? 90 : 0, opacity: isMenuOpen ? 0 : 1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Menu size={24} />
                </motion.div>
                <motion.div
                  initial={false}
                  animate={{ rotate: isMenuOpen ? 0 : -90, opacity: isMenuOpen ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <CloseIcon size={24} />
                </motion.div>
              </button>

              {/* Logo */}
              <Link to="/" className="flex items-center gap-3 flex-shrink-0 min-w-0">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-sm opacity-75"></div>
                  <img
                    src={currentLogo}
                    alt="Volty"
                    className="relative h-10 w-28 md:h-12 md:w-32 rounded-2xl object-cover border-2 border-white dark:border-gray-800 shadow-lg max-w-[100px] md:max-w-none transition-all duration-300"
                  />
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-2 flex-shrink-0">
              {navLinks.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-2 font-medium transition-all duration-200 px-4 py-2 rounded-xl whitespace-nowrap ${
                      isActive
                        ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                        : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`
                  }
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>

            {/* Right Section - Actions */}
            <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
              {/* Search Button for Mobile */}
              <div className="md:hidden">
                <button
                  data-search-button
                  onClick={handleSearchToggle}
                  className={`p-2 rounded-xl transition-all duration-300 flex-shrink-0 ${
                    isSearchOpen 
                      ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20" 
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                  title={isSearchOpen ? t("navbar.closeSearch") : t("navbar.search")}
                  aria-label={isSearchOpen ? t("navbar.closeSearch") : t("navbar.search")}
                >
                  <motion.div
                    animate={{ rotate: isSearchOpen ? 90 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {isSearchOpen ? <XCircle size={20} /> : <Search size={20} />}
                  </motion.div>
                </button>
              </div>

              {/* Desktop Search Input */}
              <div ref={searchContainerRef} className="hidden md:block relative">
                <form onSubmit={handleSearchSubmit}>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      ref={searchInputRefLocal}
                      type="text"
                      className="w-64 lg:w-80 pl-10 pr-10 py-2.5 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all duration-300 shadow-sm"
                      placeholder={t("navbar.searchPlaceholder")}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      aria-label={t("navbar.searchPlaceholder")}
                    />
                    {searchTerm && (
                      <button
                        type="button"
                        onClick={clearSearch}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
                        title={t("navbar.clearSearch")}
                        aria-label={t("navbar.clearSearch")}
                      >
                        <X size={20} strokeWidth={2.5} />
                      </button>
                    )}
                  </div>
                </form>
                {renderSearchResults()}
              </div>

              {/* Favorites */}
              <Link
                to="/favorites"
                className="relative p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 flex-shrink-0"
                title={t("navbar.favorites")}
              >
                <Heart size={20} className="md:w-6 md:h-6" />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full px-1.5 py-0.5 text-xs font-bold min-w-[18px] text-center">
                    {favorites.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 flex-shrink-0"
                title={t("navbar.cart")}
              >
                <ShoppingCart size={20} className="md:w-6 md:h-6" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full px-1.5 py-0.5 text-xs font-bold min-w-[18px] text-center">
                    {cart.length}
                  </span>
                )}
              </Link>

              {/* Language Selector */}
              <div className="hidden sm:relative sm:block">
                <button
                  ref={langButtonRef}
                  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                  className="flex items-center gap-2 p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                  aria-label={t("navbar.language")}
                >
                  <Globe size={18} className="md:w-5 md:h-5" />
                  <span className="text-sm font-medium hidden md:block">
                    {languages.find(l => l.code === i18n.language)?.label}
                  </span>
                  <ChevronDown size={14} className={`transition-transform duration-300 hidden md:block ${isLangMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isLangMenuOpen && (
                  <div 
                    ref={langMenuRef}
                    className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                  >
                    {languages.map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-all ${
                          i18n.language === lang.code 
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <Globe size={16} />
                        <span>{lang.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 flex-shrink-0"
                title={isDarkMode ? t("navbar.lightMode") : t("navbar.darkMode")}
                aria-label={isDarkMode ? t("navbar.lightMode") : t("navbar.darkMode")}
              >
                <motion.div
                  animate={{ rotate: isDarkMode ? 180 : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {isDarkMode ? <Sun size={20} className="md:w-6 md:h-6" /> : <Moon size={20} className="md:w-6 md:h-6" />}
                </motion.div>
              </button>

              {/* Admin Menu */}
              {!checkingAuth && isAdmin && (
                <div className="relative hidden sm:block">
                  <button
                    ref={adminButtonRef}
                    onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
                    className="flex items-center gap-2 p-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transition-all duration-200"
                    aria-label={t("navbar.admin")}
                  >
                    <Lock size={16} className="md:w-5 md:h-5" />
                    <span className="font-medium hidden md:block">{t("navbar.dashboard")}</span>
                    <ChevronDown size={14} className={`transition-transform duration-300 hidden md:block ${isAdminMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isAdminMenuOpen && (
                    <div 
                      ref={adminMenuRef}
                      className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                    >
                      <Link
                        to="/dash"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-gray-700 dark:text-gray-300"
                        onClick={() => setIsAdminMenuOpen(false)}
                      >
                        <KeyRound size={18} />
                        <span className="font-medium">{t("navbar.admin")}</span>
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          toast.success(t("logout.success"));
                          setIsAdminMenuOpen(false);
                        }}
                        className="flex items-center gap-3 w-full px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-all font-medium"
                      >
                        <LogOut size={18} />
                        <span>{t("navbar.logout")}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Search Input - يظهر فقط عند فتح البحث في الجوال */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div 
                className="md:hidden"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <div className="relative pt-4">
                  <form onSubmit={handleSearchSubmit}>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        ref={searchInputRefLocal}
                        type="text"
                        className="w-full pl-12 pr-12 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all duration-300 shadow-sm text-base"
                        placeholder={t("navbar.searchPlaceholder")}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoFocus
                        aria-label={t("navbar.searchPlaceholder")}
                      />
                      {searchTerm && (
                        <button
                          type="button"
                          onClick={clearSearch}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
                          title={t("navbar.clearSearch")}
                          aria-label={t("navbar.clearSearch")}
                        >
                          <X size={20} strokeWidth={2.5} />
                        </button>
                      )}
                    </div>
                  </form>
                  
                  {/* عرض نتائج البحث في الجوال */}
                  {renderSearchResults()}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="lg:hidden w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden"
          >
            <div className="container mx-auto px-4 py-6">
              {/* Mobile Navigation */}
              <nav className="grid grid-cols-3 gap-3 mb-6">
                {mobileNavLinks.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex flex-col items-center gap-2 p-3 rounded-2xl transition-all ${
                        isActive
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`
                    }
                  >
                    {item.icon}
                    <span className="text-xs font-medium text-center">{item.label}</span>
                  </NavLink>
                ))}
              </nav>

              {/* Language Selector in Mobile Menu */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                  <Globe size={16} />
                  {t("navbar.language")}
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`flex items-center justify-center gap-1 p-2 rounded-xl text-center transition-all ${
                        i18n.language === lang.code 
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800' 
                          : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Globe size={14} />
                      <span className="text-xs font-medium">{lang.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Admin Menu in Mobile Menu */}
              {!checkingAuth && isAdmin && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4"
                >
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                    <Lock size={16} />
                    {t("navbar.admin")}
                  </h3>
                  <div className="space-y-2">
                    <Link
                      to="/dash"
                      className="flex items-center gap-3 px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <KeyRound size={18} />
                      <span className="font-medium">{t("navbar.dashboard")}</span>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        toast.success(t("logout.success"));
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center gap-3 w-full px-3 py-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all font-medium"
                    >
                      <LogOut size={18} />
                      <span>{t("navbar.logout")}</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
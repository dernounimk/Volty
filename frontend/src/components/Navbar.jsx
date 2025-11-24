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
  Star
} from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAdminAuthStore } from "../stores/useAdminAuthStore";
import { useTranslation } from "react-i18next";
import { useCartStore } from "../stores/useCartStore";
import { useState, useEffect, useRef } from "react";
import { useNavbar } from "../context/NavbarContext";
import logo from "../../public/logo.png";
import toast from "react-hot-toast";
import axios from "../lib/axios";

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

  const searchContainerRef = useRef(null);
  const searchInputRefLocal = useRef(null);

  // افترض أن لديك store للمفضلة
  const [favorites] = useState([]); // استبدل هذا بـ useFavoritesStore إذا كان لديك

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

  useEffect(() => {
    const fetchProducts = async () => {
      if (!searchTerm.trim()) {
        setSearchResults([]);
        return;
      }
      try {
        const { data } = await axios.get(`/products/search?q=${encodeURIComponent(searchTerm)}`);
        setSearchResults(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    const delay = setTimeout(fetchProducts, 400);
    return () => clearTimeout(delay);
  }, [searchTerm]);

  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
  };

  const handleResultClick = (id) => {
    setSearchTerm("");
    setSearchResults([]);
    setIsMenuOpen(false);
    setIsSearchOpen(false);
    navigate(`/product/${id}`);
  };

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setTimeout(() => {
        searchInputRefLocal.current?.focus();
      }, 300);
    } else {
      clearSearch();
    }
  };

  // إغلاق القوائم المنسدلة عند النقر خارجها - تم إزالة الإغلاق التلقائي للبحث
  useEffect(() => {
    const handleClickOutside = (event) => {
      // فقط إغلاق قوائم اللغة والإدارة عند النقر خارجها
      if (isLangMenuOpen || isAdminMenuOpen) {
        setIsLangMenuOpen(false);
        setIsAdminMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLangMenuOpen, isAdminMenuOpen]);

  const renderSearchResults = () =>
    searchResults.length > 0 && (
      <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden z-50 border border-gray-200 dark:border-gray-700">
        {searchResults.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 px-4 py-3 text-gray-900 dark:text-white hover:bg-blue-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-600 transition-all cursor-pointer group"
            onClick={() => handleResultClick(item.id)}
          >
            <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover group-hover:scale-110 transition-transform" />
            <div className="flex justify-between flex-1 items-center">
              <span className="font-medium">{item.name}</span>
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{item.price} DA</span>
            </div>
          </div>
        ))}
      </div>
    );

  // تعريف روابط التنقل مع الأيقونات
  const navLinks = [
    { path: "/", label: t("navbar.home"), icon: <Home size={20} /> },
    { path: "/contact", label: t("navbar.contact"), icon: <Phone size={20} /> },
  ];

  // تعريف روابط الموبايل مع الأيقونات (تم إزالة السلة والمفضلة)
  const mobileNavLinks = [
    { path: "/", label: t("navbar.home"), icon: <Home size={24} /> },
    { path: "/contact", label: t("navbar.contact"), icon: <Phone size={24} /> },
    { path: "/faq", label: t("navbar.faq"), icon: <HelpCircle size={24} /> },
  ];

  return (
    <header className="fixed top-0 left-0 w-full backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800 shadow-sm z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Left Section - Menu & Logo */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {/* Menu Button - Hidden on large screens */}
            <button
              className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 lg:hidden flex-shrink-0"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              <Menu size={24} />
            </button>

{/* Logo */}
<Link to="/" className="flex items-center gap-3 flex-shrink-0 min-w-0">
  <div className="relative">
    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-sm opacity-75"></div>
    <img
      src={logo}
      alt="Zoubir"
      className="relative h-10 w-28 md:h-12 md:w-32 rounded-2xl object-cover border-2 border-white dark:border-gray-800 shadow-lg max-w-[100px] md:max-w-none"
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
            {/* Search Button - Visible on all screens */}
            <button
              onClick={handleSearchToggle}
              className={`p-2 rounded-xl transition-all duration-300 flex-shrink-0 ${
                isSearchOpen 
                  ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20" 
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
              title={isSearchOpen ? t("navbar.closeSearch") : t("navbar.search")}
            >
              {isSearchOpen ? <XCircle size={20} className="md:w-6 md:h-6" /> : <Search size={20} className="md:w-6 md:h-6" />}
            </button>

            {/* Desktop Search Input */}
            <div ref={searchContainerRef} className="hidden md:flex items-center gap-2">
              <div className={`relative transition-all duration-500 ease-in-out overflow-hidden ${
                isSearchOpen ? 'w-48 lg:w-64 opacity-100' : 'w-0 opacity-0'
              }`}>
                <div className="relative min-w-[192px] lg:min-w-[256px]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    ref={searchInputRefLocal}
                    type="text"
                    className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all duration-300 shadow-sm"
                    placeholder={t("navbar.searchPlaceholder")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors duration-200"
                    >
                      <XCircle size={20} />
                    </button>
                  )}
                </div>
                {renderSearchResults()}
              </div>
            </div>

            {/* Favorites with counter */}
            <Link
              to="/favorites"
              className="relative p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 flex-shrink-0"
              title={t("navbar.favorites")}
            >
              <Heart size={20} className="md:w-6 md:h-6" />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full px-1.5 py-0.5 text-xs font-bold min-w-[18px] text-center animate-bounce">
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
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full px-1.5 py-0.5 text-xs font-bold min-w-[18px] text-center animate-bounce">
                  {cart.length}
                </span>
              )}
            </Link>

            {/* Language Selector - Hidden on small screens */}
            <div className="hidden sm:relative sm:block">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-2 p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
              >
                <Globe size={18} className="md:w-5 md:h-5" />
                <span className="text-sm font-medium hidden md:block">
                  {languages.find(l => l.code === i18n.language)?.label}
                </span>
                <ChevronDown size={14} className={`transition-transform hidden md:block ${isLangMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isLangMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
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
            >
              {isDarkMode ? <Sun size={20} className="md:w-6 md:h-6" /> : <Moon size={20} className="md:w-6 md:h-6" />}
            </button>

            {/* Admin Menu */}
            {!checkingAuth && isAdmin && (
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
                  className="flex items-center gap-2 p-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transition-all duration-200"
                >
                  <Lock size={16} className="md:w-5 md:h-5" />
                  <span className="font-medium hidden md:block">{t("navbar.dashboard")}</span>
                  <ChevronDown size={14} className={`transition-transform hidden md:block ${isAdminMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isAdminMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
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

        {/* Mobile Search Input - يظهر في الأسفل مع أنيميشن */}
        <div className={`md:hidden transition-all duration-500 ease-in-out overflow-hidden ${
          isSearchOpen ? 'max-h-32 opacity-100 mt-4' : 'max-h-0 opacity-0'
        }`}>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              className="w-full pl-12 pr-12 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 shadow-sm"
              placeholder={t("navbar.searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors duration-200"
              >
                <XCircle size={20} />
              </button>
            )}
          </div>
          {renderSearchResults()}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-2xl">
          <div className="container mx-auto px-4 py-6">
            {/* Mobile Navigation - روابط أساسية فقط */}
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
                        : "text-gray-600 dark:text-gray-300"
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
                        : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
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
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                  <Lock size={16} />
                  {t("navbar.admin")}
                </h3>
                <div className="space-y-2">
                  <Link
                    to="/dash"
                    className="flex items-center gap-3 px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 transition-all"
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
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 transition-all font-medium"
                  >
                    <LogOut size={18} />
                    <span>{t("navbar.logout")}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
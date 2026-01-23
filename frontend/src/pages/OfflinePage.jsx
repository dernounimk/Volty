import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  WifiOff,
  RefreshCw,
  Home,
  ShoppingBag,
  Package,
  Truck,
  Clock,
  AlertCircle,
  Smartphone,
  Wifi,
  CloudOff,
  Download,
  Zap,
  Battery,
  Signal,
  CheckCircle,
  XCircle,
  Info,
  ArrowLeft,
  ShoppingCart,
  Search,
  User,
  Settings,
  Bell,
  Heart,
  Star,
  MapPin,
  CreditCard,
  Shield,
  Headphones,
  Globe,
  Calendar,
  Filter,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  Plus,
  Minus,
  Trash2,
  Share2,
  Bookmark,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Mail,
  Phone,
  MessageCircle,
  HelpCircle,
  ExternalLink,
  Award,
  Users,
  TrendingUp,
  BarChart,
  PieChart,
  DollarSign,
  Percent,
  Tag,
  Gift,
  Camera,
  Image,
  Video,
  Music,
  FileText,
  Paperclip,
  Printer,
  Download as DownloadIcon,
  Upload,
  Folder,
  FolderOpen,
  HardDrive,
  Database,
  Server,
  Cpu,
  MemoryStick,
  BatteryCharging,
  Thermometer,
  Power,
  PowerOff,
  RotateCcw,
  RotateCw,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  PhoneCall,
  PhoneMissed,
  PhoneOff,
  MessageSquare,
  Send,
  Edit,
  Copy,
  Save,
  Archive,
  Inbox,
  Key,
  QrCode,
  Radio,
  Tv,
  Watch,
  Headphones as HeadphonesIcon,
  Speaker,
  Gamepad,
  Mouse,
  Keyboard,
  Monitor,
  Laptop,
  Tablet,
  Smartphone as SmartphoneIcon,
  Watch as WatchIcon,
  Camera as CameraIcon,
  Printer as PrinterIcon,
  Router,
  Bluetooth,
  Wifi as WifiIcon,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Sun,
  Moon,
  Cloudy,
  Wind,
  Umbrella,
  Droplets,
  ThermometerSun,
  ThermometerSnowflake,
  Compass,
  Navigation,
  Map,
  Globe as GlobeIcon,
  Flag,
  Navigation2,
  MapPin as MapPinIcon
} from "lucide-react";
import { Link } from "react-router-dom";

const OfflinePage = () => {
  const { t } = useTranslation();
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [offlineTime, setOfflineTime] = useState(0);
  const [showOfflineFeatures, setShowOfflineFeatures] = useState(false);

  // ألوان هوية Volty
  const brandColors = {
    // ألوان الخلفية
    bg: "bg-[#0f0f0f]",
    bgGray: "bg-[#1a1a1a]",
    bgOpacity: "bg-[#0f0f0fee]",
    
    // ألوان النص
    text: "text-[#f0f0f0]",
    textSecondary: "text-[#cccccc]",
    
    // الألوان الأساسية للبراند
    primary: "#ff7a1a", // البرتقالي
    electric: "#00a9e0", // الأزرق الكهربائي
    
    // التدرجات
    primaryGradient: "bg-gradient-to-r from-[#ff7a1a] to-[#e96a13]",
    electricGradient: "bg-gradient-to-r from-[#00a9e0] to-[#0088b8]",
    accentGradient: "bg-gradient-to-r from-[#ff7a1a] via-[#00a9e0] to-[#ff7a1a]",
    
    // الظلال
    glow: "shadow-[0_0_30px_rgba(255,122,26,0.3)]",
    electricGlow: "shadow-[0_0_30px_rgba(0,169,224,0.3)]",
    
    // للحالة عند المرور
    hover: "hover:from-[#e96a13] hover:to-[#d8590c]",
    electricHover: "hover:from-[#0088b8] hover:to-[#0077a7]",
    
    // الحدود
    border: "border-[#ffaa7a]",
    electricBorder: "border-[#66d1ff]"
  };

  const offlineFeatures = [
    {
      icon: <ShoppingBag className="w-8 h-8" />,
      title: t("offline.features.browse.title"),
      description: t("offline.features.browse.description"),
      color: "from-[#ff7a1a] to-[#ff9a4a]"
    },
    {
      icon: <ShoppingCart className="w-8 h-8" />,
      title: t("offline.features.cart.title"),
      description: t("offline.features.cart.description"),
      color: "from-[#00a9e0] to-[#66d1ff]"
    },
    {
      icon: <Package className="w-8 h-8" />,
      title: t("offline.features.orders.title"),
      description: t("offline.features.orders.description"),
      color: "from-[#ff7a1a] to-[#ffb074]"
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: t("offline.features.address.title"),
      description: t("offline.features.address.description"),
      color: "from-[#00a9e0] to-[#00c8ff]"
    }
  ];

  const tips = [
    {
      icon: <Wifi className="w-5 h-5" />,
      text: t("offline.tips.wifi"),
      color: "text-[#00a9e0]"
    },
    {
      icon: <RefreshCw className="w-5 h-5" />,
      text: t("offline.tips.refresh"),
      color: "text-[#ff7a1a]"
    },
    {
      icon: <Smartphone className="w-5 h-5" />,
      text: t("offline.tips.mobile"),
      color: "text-[#66d1ff]"
    },
    {
      icon: <Battery className="w-5 h-5" />,
      text: t("offline.tips.battery"),
      color: "text-[#ff9a4a]"
    }
  ];

  // محاكاة مؤقت للوقت بدون إنترنت
  useEffect(() => {
    const timer = setInterval(() => {
      setOfflineTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleReconnect = () => {
    setIsReconnecting(true);
    setRetryCount(prev => prev + 1);

    // محاكاة محاولة إعادة الاتصال
    setTimeout(() => {
      setIsReconnecting(false);
      
      // في تطبيق حقيقي، هنا نفحص حالة الاتصال
      if (retryCount >= 3) {
        // محاكاة نجاح الاتصال بعد 3 محاولات
        window.location.reload();
      }
    }, 2000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`min-h-screen ${brandColors.bg} ${brandColors.text} overflow-hidden relative`}>
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 30%, rgba(255, 122, 26, 0.1) 0%, transparent 40%),
                           radial-gradient(circle at 80% 70%, rgba(0, 169, 224, 0.1) 0%, transparent 40%)`,
          backgroundSize: '200px 200px, 300px 300px'
        }}></div>
      </div>

      {/* Floating Elements */}
      <motion.div
        className="absolute top-1/4 left-10 w-32 h-32 bg-[#ff7a1a]/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-1/3 right-10 w-40 h-40 bg-[#00a9e0]/5 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.15, 0.1, 0.15]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Animated Disconnected Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
              rotate: [0, 360]
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 3
            }}
          >
            <WifiOff className="w-8 h-8 text-[#ff7a1a]/20" />
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-3">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#ff7a1a] to-[#00a9e0] rounded-xl blur-lg opacity-50"></div>
              <div className="relative w-10 h-10 bg-gradient-to-r from-[#ff7a1a] to-[#00a9e0] rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#ff7a1a] to-[#00a9e0] bg-clip-text text-transparent">
                Volty
              </h1>
              <p className="text-sm text-[#cccccc]">Shopping App</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3">
              <motion.div
                className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full"
                animate={{
                  scale: [1, 1.05, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity
                }}
              >
                <Clock className="w-4 h-4 text-[#ff7a1a]" />
                <span className="text-sm font-medium">{formatTime(offlineTime)}</span>
              </motion.div>
              
              <div className="flex items-center gap-1">
                {[1, 2, 3].map((bar) => (
                  <motion.div
                    key={bar}
                    className="w-1 bg-[#ff7a1a] rounded-full"
                    style={{ height: `${Math.random() * 15 + 5}px` }}
                    animate={{
                      height: [`${Math.random() * 15 + 5}px`, `${Math.random() * 20 + 10}px`, `${Math.random() * 15 + 5}px`]
                    }}
                    transition={{
                      duration: 1 + Math.random(),
                      repeat: Infinity,
                      delay: bar * 0.2
                    }}
                  />
                ))}
              </div>
            </div>
            
            <Link to="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/15 transition-colors"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">{t("offline.buttons.home")}</span>
              </motion.button>
            </Link>
          </div>
        </motion.header>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 mt-12">
          {/* Left Column - Error Message */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="relative">
              {/* Glow Effect */}
              <motion.div
                className="absolute -inset-4 bg-gradient-to-r from-[#ff7a1a]/20 to-[#00a9e0]/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity
                }}
              />
              
              <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl">
                <div className="flex flex-col items-center text-center mb-6">
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      y: [0, -10, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                    className="relative mb-6"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#ff7a1a] to-[#00a9e0] rounded-full blur-xl opacity-50"></div>
                    <WifiOff className="relative w-20 h-20 text-[#ff7a1a]" />
                  </motion.div>
                  
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    <span className="bg-gradient-to-r from-[#ff7a1a] via-[#00a9e0] to-[#ff7a1a] bg-clip-text text-transparent">
                      {t("offline.title")}
                    </span>
                  </h1>
                  
                  <p className="text-xl text-[#cccccc] mb-6 max-w-md">
                    {t("offline.subtitle")}
                  </p>
                  
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#ff7a1a]/10 rounded-full mb-6">
                    <Clock className="w-4 h-4 text-[#ff7a1a]" />
                    <span className="text-sm font-medium">
                      {t("offline.timeOffline")}: {formatTime(offlineTime)}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleReconnect}
                    disabled={isReconnecting}
                    className={`w-full flex items-center justify-center gap-3 ${
                      isReconnecting
                        ? 'bg-gradient-to-r from-[#e96a13] to-[#d8590c]'
                        : 'bg-gradient-to-r from-[#ff7a1a] to-[#00a9e0] hover:shadow-[0_0_30px_rgba(255,122,26,0.4)]'
                    } text-white px-6 py-4 rounded-xl text-lg font-bold transition-all duration-300`}
                  >
                    {isReconnecting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                        />
                        <span>{t("offline.buttons.reconnecting")}...</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-6 h-6" />
                        <span>{t("offline.buttons.reconnect")}</span>
                        <span className="text-sm opacity-75">({retryCount} {t("offline.buttons.attempts")})</span>
                      </>
                    )}
                  </motion.button>
                  
                  <button
                    onClick={() => setShowOfflineFeatures(!showOfflineFeatures)}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors group"
                  >
                    <Info className="w-5 h-5 text-[#00a9e0] group-hover:text-[#66d1ff]" />
                    <span className="text-[#cccccc] group-hover:text-white">
                      {showOfflineFeatures
                        ? t("offline.buttons.hideFeatures")
                        : t("offline.buttons.showFeatures")}
                    </span>
                    <ChevronRight className={`w-4 h-4 text-[#cccccc] transition-transform ${showOfflineFeatures ? 'rotate-90' : ''}`} />
                  </button>
                </div>
                
                {/* Connection Status Indicator */}
                <div className="mt-8 pt-8 border-t border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[#cccccc]">{t("offline.connectionStatus")}</span>
                    <div className="flex items-center gap-2">
                      <motion.div
                        className="w-2 h-2 bg-[#ff3b30] rounded-full"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [1, 0.5, 1]
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity
                        }}
                      />
                      <span className="text-[#ff3b30] font-medium">{t("offline.disconnected")}</span>
                    </div>
                  </div>
                  
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#ff3b30] to-[#ff7a1a]"
                      initial={{ width: "0%" }}
                      animate={{ width: `${Math.min(retryCount * 30, 100)}%` }}
                      transition={{ type: "spring" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Tips Section */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-bold mb-4 text-[#f0f0f0]">
                {t("offline.tips.title")}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {tips.map((tip, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                    className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <div className={`p-2 rounded-lg ${tip.color} bg-opacity-20`}>
                      {tip.icon}
                    </div>
                    <span className="text-sm text-[#cccccc]">{tip.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column - Offline Features */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-8"
          >
            {/* App Preview */}
            <div className="relative">
              <motion.div
                className="absolute -inset-4 bg-gradient-to-br from-[#ff7a1a]/10 via-[#00a9e0]/10 to-[#ff7a1a]/10 rounded-3xl blur-xl"
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity
                }}
              />
              
              <div className="relative bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] rounded-2xl p-6 border border-white/10 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-[#f0f0f0]">
                    {t("offline.appPreview")}
                  </h3>
                  <div className="flex items-center gap-2">
                    <motion.div
                      className="w-2 h-2 bg-[#ff7a1a] rounded-full"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                    <span className="text-sm text-[#cccccc]">Volty v2.1</span>
                  </div>
                </div>
                
                {/* Simulated App Interface */}
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-[#ff7a1a] to-[#00a9e0] rounded-xl"></div>
                      <div>
                        <div className="h-3 w-24 bg-[#ff7a1a]/30 rounded"></div>
                        <div className="h-2 w-16 bg-[#00a9e0]/20 rounded mt-1"></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-white/10 rounded-lg"></div>
                      <div className="w-8 h-8 bg-white/10 rounded-lg"></div>
                    </div>
                  </div>
                  
                  {/* Search Bar */}
                  <div className="p-4 bg-white/5 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-[#00a9e0]/20 rounded"></div>
                      <div className="h-4 flex-1 bg-white/10 rounded"></div>
                    </div>
                  </div>
                  
                  {/* Categories */}
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map((item) => (
                      <motion.div
                        key={item}
                        className="aspect-square bg-gradient-to-br from-[#ff7a1a]/10 to-[#00a9e0]/10 rounded-lg"
                        animate={{
                          y: [0, -5, 0]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: item * 0.2
                        }}
                      >
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-6 h-6 bg-white/20 rounded"></div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Products */}
                  <div className="grid grid-cols-2 gap-3">
                    {[1, 2, 3, 4].map((item) => (
                      <motion.div
                        key={item}
                        className="bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] rounded-xl p-3 border border-white/5"
                        animate={{
                          scale: [1, 1.02, 1]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          delay: item * 0.3
                        }}
                      >
                        <div className="aspect-video bg-gradient-to-r from-[#ff7a1a]/20 to-[#00a9e0]/20 rounded-lg mb-2"></div>
                        <div className="h-3 w-3/4 bg-white/20 rounded mb-1"></div>
                        <div className="h-2 w-1/2 bg-white/10 rounded"></div>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Status Bar */}
                  <div className="flex items-center justify-between px-4 py-2 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-1">
                      <WifiOff className="w-4 h-4 text-[#ff7a1a]" />
                      <span className="text-xs text-[#cccccc]">Offline Mode</span>
                    </div>
                    <div className="text-xs text-[#cccccc]">
                      {formatTime(offlineTime)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Offline Features */}
            <AnimatePresence>
              {showOfflineFeatures && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                    <h3 className="text-xl font-bold mb-6 text-[#f0f0f0]">
                      {t("offline.availableFeatures")}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {offlineFeatures.map((feature, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ y: -5 }}
                          className="group cursor-pointer"
                        >
                          <div className="relative p-4 bg-gradient-to-br from-white/5 to-transparent rounded-xl border border-white/10 group-hover:border-[#ff7a1a]/30 transition-all duration-300">
                            <motion.div
                              className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-xl opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500`}
                              animate={{
                                scale: [1, 1.1, 1],
                                opacity: [0.1, 0.2, 0.1]
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity
                              }}
                            />
                            
                            <div className="relative z-10">
                              <div className={`inline-flex p-3 rounded-lg mb-4 bg-gradient-to-br ${feature.color} text-white shadow-lg`}>
                                {feature.icon}
                              </div>
                              <h4 className="text-lg font-semibold mb-2 text-[#f0f0f0] group-hover:text-[#ff7a1a] transition-colors">
                                {feature.title}
                              </h4>
                              <p className="text-sm text-[#cccccc]">
                                {feature.description}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-[#ff7a1a]/5 via-[#00a9e0]/5 to-[#ff7a1a]/5 rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-bold mb-6 text-[#f0f0f0]">
                {t("offline.quickActions")}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group"
                >
                  <div className="p-3 rounded-lg bg-gradient-to-r from-[#ff7a1a] to-[#ff9a4a] mb-2 group-hover:shadow-[0_0_20px_rgba(255,122,26,0.3)] transition-shadow">
                    <ShoppingBag className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm text-[#cccccc] group-hover:text-white transition-colors">
                    {t("offline.actions.browse")}
                  </span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group"
                >
                  <div className="p-3 rounded-lg bg-gradient-to-r from-[#00a9e0] to-[#66d1ff] mb-2 group-hover:shadow-[0_0_20px_rgba(0,169,224,0.3)] transition-shadow">
                    <ShoppingCart className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm text-[#cccccc] group-hover:text-white transition-colors">
                    {t("offline.actions.cart")}
                  </span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group"
                >
                  <div className="p-3 rounded-lg bg-gradient-to-r from-[#ff7a1a] to-[#ffb074] mb-2 group-hover:shadow-[0_0_20px_rgba(255,122,26,0.3)] transition-shadow">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm text-[#cccccc] group-hover:text-white transition-colors">
                    {t("offline.actions.orders")}
                  </span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group"
                >
                  <div className="p-3 rounded-lg bg-gradient-to-r from-[#00a9e0] to-[#00c8ff] mb-2 group-hover:shadow-[0_0_20px_rgba(0,169,224,0.3)] transition-shadow">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm text-[#cccccc] group-hover:text-white transition-colors">
                    {t("offline.actions.address")}
                  </span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12"
        >
          <div className="bg-gradient-to-r from-[#ff7a1a]/10 via-[#00a9e0]/10 to-[#ff7a1a]/10 rounded-2xl p-8 border border-white/10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold mb-2 text-[#f0f0f0]">
                  {t("offline.support.title")}
                </h3>
                <p className="text-[#cccccc] max-w-lg">
                  {t("offline.support.description")}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#ff7a1a] to-[#e96a13] text-white rounded-xl font-medium hover:shadow-[0_0_20px_rgba(255,122,26,0.3)] transition-shadow"
                >
                  <Headphones className="w-5 h-5" />
                  {t("offline.buttons.help")}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/15 rounded-xl font-medium transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  {t("offline.buttons.contact")}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 pt-8 border-t border-white/10 text-center"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-[#ff7a1a] to-[#00a9e0] rounded-lg"></div>
              <span className="text-lg font-bold bg-gradient-to-r from-[#ff7a1a] to-[#00a9e0] bg-clip-text text-transparent">
                Volty Shopping
              </span>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-[#cccccc]">
              <span>© 2024 Volty Inc.</span>
              <span className="hidden sm:inline">•</span>
              <span>{t("offline.footer.rights")}</span>
              <span className="hidden sm:inline">•</span>
              <div className="flex items-center gap-1">
                <WifiOff className="w-4 h-4 text-[#ff7a1a]" />
                <span>{t("offline.footer.offline")}</span>
              </div>
            </div>
            
            <motion.div
              className="flex items-center gap-2"
              animate={{
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity
              }}
            >
              <div className="w-2 h-2 bg-[#ff7a1a] rounded-full animate-pulse"></div>
              <span className="text-sm text-[#ff7a1a]">{t("offline.footer.autoReconnect")}</span>
            </motion.div>
          </div>
        </motion.footer>
      </div>

      {/* Connection Animation Overlay */}
      <AnimatePresence>
        {isReconnecting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <div className="bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] rounded-2xl p-8 shadow-2xl border border-white/10 max-w-md w-full mx-4">
              <div className="text-center">
                <motion.div
                  animate={{
                    rotate: 360,
                    scale: [1, 1.2, 1]
                  }}
                  transition={{
                    rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                    scale: { duration: 1, repeat: Infinity, repeatType: "reverse" }
                  }}
                  className="inline-block mb-6"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#ff7a1a] to-[#00a9e0] rounded-full blur-lg opacity-50"></div>
                    <Wifi className="w-16 h-16 text-white relative" />
                  </div>
                </motion.div>
                
                <h3 className="text-2xl font-bold mb-2 text-[#f0f0f0]">
                  {t("offline.reconnecting.title")}
                </h3>
                <p className="text-[#cccccc] mb-6">
                  {t("offline.reconnecting.description")}
                </p>
                
                <div className="space-y-4">
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#ff7a1a] to-[#00a9e0]"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-center gap-4">
                    <div className="flex items-center gap-2">
                      {[1, 2, 3].map((dot) => (
                        <motion.div
                          key={dot}
                          className="w-2 h-2 bg-[#ff7a1a] rounded-full"
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 1, 0.5]
                          }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: dot * 0.2
                          }}
                        />
                      ))}
                    </div>
                    
                    <span className="text-sm text-[#cccccc]">
                      {t("offline.reconnecting.attempt")} {retryCount}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated Signal Waves */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 border border-[#ff7a1a] rounded-full"
            style={{
              left: `calc(50% - ${200 + i * 100}px)`,
              top: `calc(50% - ${200 + i * 100}px)`,
              width: `${400 + i * 200}px`,
              height: `${400 + i * 200}px`
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.1, 0.05, 0.1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.5
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default OfflinePage;
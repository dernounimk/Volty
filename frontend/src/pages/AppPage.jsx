import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { 
  Download, 
  Smartphone, 
  QrCode,
  Clock,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";

const AppPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const appStats = [
    {
      icon: <Download className="w-4 h-4" />,
      value: `${isRTL ? "100+" : "+100"}`,
      label: "التنزيلات",
      color: "text-blue-400"
    },
    {
      icon: <ShieldCheck className="w-4 h-4" />,
      value: "100%",
      label: "آمن",
      color: "text-green-400"
    },
    {
      icon: <Clock className="w-4 h-4" />,
      value: "v2.1.0",
      label: "أحدث إصدار",
      color: "text-purple-400"
    }
  ];

  const handleDirectDownload = () => {
    setIsDownloading(true);
    setDownloadProgress(0);
    
    // محاكاة عملية التحميل مع تفاصيل أكثر
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + Math.random() * 8 + 2;
      });
    }, 200);

    const apkUrl = "https://your-domain.com/app/volty-app.apk";
    
    toast.success(t("appPage.downloadStarted"));
    
    setTimeout(() => {
      clearInterval(interval);
      setDownloadProgress(100);
      setShowConfetti(true);
      
      const link = document.createElement('a');
      link.href = apkUrl;
      link.download = 'Volty-Shopping-App.apk';
      link.click();
      
      setTimeout(() => setShowConfetti(false), 5000);
      
      toast.success(t("appPage.downloadComplete"));
      setIsDownloading(false);
      
      setTimeout(() => {
        setDownloadProgress(0);
      }, 3000);
    }, 3000);
  };

  return (
    <div className="min-h-screen text-white overflow-hidden">

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative pb-20 px-4 overflow-hidden">
        <div className="container mx-auto max-w-6xl relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center justify-center gap-3 mb-6 bg-[var(--color-accent)] text-[var(--color-on-accent)] px-6 py-3 rounded-full shadow-lg backdrop-blur-sm"
            >
              <Smartphone className="w-6 h-6" />
              <span className="text-lg font-bold">Volty Android App</span>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="w-2 h-2 bg-[var(--color-on-accent)] rounded-full"
              />
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-[var(--color-text-secondary)] mb-10 max-w-3xl mx-auto leading-relaxed"
            >
              {t("appPage.hero.subtitle")}
            </motion.p>
            
            {/* Download Button with Progress */}
            <div className="max-w-lg mx-auto mb-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="relative"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDirectDownload}
                  disabled={isDownloading}
                  className={`relative w-full flex items-center justify-center gap-3 ${
                    isDownloading 
                      ? 'bg-[var(--color-accent-hover)]' 
                      : 'bg-[var(--color-accent)] hover:shadow-[0_0_50px_rgba(255,122,26,0.5)]'
                  } text-[var(--color-on-accent)] px-8 py-6 rounded-2xl text-xl font-bold shadow-2xl transition-all duration-300 overflow-hidden group`}
                >
                  {/* Animated background */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-[var(--color-electric)] via-[var(--color-accent)] to-pink-400 opacity-0 group-hover:opacity-20"
                    animate={{ 
                      x: ['-100%', '100%']
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                  
                  {/* Shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--color-on-accent)]/20 to-transparent"
                    animate={{ 
                      x: ['-100%', '100%']
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                      delay: 0.5
                    }}
                  />
                  
                  {isDownloading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-7 h-7 border-2 border-[var(--color-on-accent)] border-t-transparent rounded-full"
                      />
                      <div className="flex flex-col items-start">
                        <span>{t("appPage.downloading")} {downloadProgress}%</span>
                        <span className="text-sm font-normal opacity-75">
                          {downloadProgress < 30 ? t("appPage.preparing") :
                           downloadProgress < 70 ? t("appPage.downloading") :
                           t("appPage.installing")}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <Download className="w-7 h-7 group-hover:scale-110 transition-transform" />
                      <div className="flex flex-col items-start">
                        <span>{t("appPage.downloadNow")}</span>
                        <span className="text-sm font-normal opacity-90">APK • 65 MB</span>
                      </div>
                    </>
                  )}
                  
                  {/* Progress Bar */}
                  {isDownloading && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--color-accent-hover)]/50 rounded-b-2xl overflow-hidden">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-[var(--color-electric)] to-[var(--color-accent)]"
                        initial={{ width: 0 }}
                        animate={{ width: `${downloadProgress}%` }}
                        transition={{ type: "spring", stiffness: 100 }}
                      />
                    </div>
                  )}
                </motion.button>
                
                {/* Floating Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="flex flex-wrap items-center justify-center gap-4 mt-6"
                >
                  {appStats.map((stat, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ y: -5 }}
                      className="flex items-center gap-2 bg-[var(--color-bg-opacity)] backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium shadow-lg border border-[var(--color-border)]"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.5 }}
                    >
                      <div className={stat.color}>
                        {stat.icon}
                      </div>
                      <span className="font-bold">{stat.value}</span>
                      <span className="text-[var(--color-text-secondary)]">{stat.label}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </div>

            {/* QR Code Section */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              className="inline-block"
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-electric)] to-[var(--color-accent)] rounded-3xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                <div className="relative bg-[var(--color-bg-opacity)] backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-[var(--color-border)]">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.02, 1],
                      rotate: [0, 1, 0, -1, 0]
                    }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity,
                      repeatType: "reverse" 
                    }}
                    className="text-center"
                  >
                    <div className="relative inline-block">
                      <QrCode className="relative w-40 h-40 text-[var(--color-text)] z-10" />
                      <motion.div
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 0.8, 0.5]
                        }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity 
                        }}
                        className="absolute inset-4 bg-gradient-to-r from-[var(--color-electric)]/20 to-[var(--color-accent)]/20 rounded-2xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-[var(--color-text)] font-medium">
                        {t("appPage.scanQR")}
                      </p>
                      <p className="text-sm text-[var(--color-text-secondary)]">
                        {t("appPage.scanToDownload")}
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AppPage;
import { Phone, MapPin, Instagram, Mail, Heart, ArrowUpRight, ShoppingBag, Shield, Clock, HeadphonesIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Footer = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const staggerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white relative overflow-hidden">
      {/* Enhanced Background Patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)`,
          backgroundSize: '100px 100px, 150px 150px'
        }}></div>
      </div>

      {/* Animated Background Elements */}
      <motion.div 
        className="absolute top-10 left-10 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"
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
        className="absolute bottom-10 right-10 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl"
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

      <motion.div 
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-16">
          {/* Brand Section */}
          <motion.div 
            className="lg:col-span-1"
            variants={staggerVariants}
          >
            <motion.div 
              className="flex items-center gap-4 mb-6"
              variants={itemVariants}
            >
              <motion.div 
                className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg"
                whileHover={{ 
                  scale: 1.05,
                  rotate: [0, -5, 5, 0]
                }}
                transition={{ duration: 0.3 }}
              >
                <ShoppingBag className="w-7 h-7 text-white" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Zoubir Shop
                </h2>
                <p className="text-blue-200 text-sm">{t("footer.tagline")}</p>
              </div>
            </motion.div>
            
            <motion.p 
              className="text-blue-100 leading-relaxed mb-8 text-lg"
              variants={itemVariants}
            >
              {t("footer.description")}
            </motion.p>
            
            <motion.div 
              className="flex gap-3"
              variants={itemVariants}
            >
              {[
                { 
                  icon: Instagram, 
                  href: "https://instagram.com/zoubir__trends", 
                  label: "Instagram", 
                  color: "hover:bg-pink-500/20 hover:text-pink-400",
                  bgColor: "bg-pink-500/10"
                },
                { 
                  icon: Phone, 
                  href: "tel:0656768448", 
                  label: "Phone", 
                  color: "hover:bg-green-500/20 hover:text-green-400",
                  bgColor: "bg-green-500/10"
                },
                { 
                  icon: Mail, 
                  href: "mailto:contact@zoubirshop.dz", 
                  label: "Email", 
                  color: "hover:bg-blue-500/20 hover:text-blue-400",
                  bgColor: "bg-blue-500/10"
                }
              ].map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  className={`w-12 h-12 ${social.bgColor} backdrop-blur-sm rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${social.color}`}
                  aria-label={social.label}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                >
                  <social.icon size={22} />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={staggerVariants}>
            <motion.h3 
              className="text-xl font-semibold mb-8 text-white flex items-center gap-3"
              variants={itemVariants}
            >
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              {t("footer.quickLinks")}
            </motion.h3>
            <motion.ul 
              className="space-y-4"
              variants={staggerVariants}
            >
              {[
                { path: "/", label: t("navbar.home"), icon: ArrowUpRight },
                { path: "/products", label: t("footer.products"), icon: ArrowUpRight },
                { path: "/contact", label: t("navbar.contact"), icon: ArrowUpRight },
                { path: "/favorites", label: t("navbar.favorites"), icon: ArrowUpRight }
              ].map((link, index) => (
                <motion.li key={link.path} variants={itemVariants}>
                  <Link
                    to={link.path}
                    className="text-blue-100 hover:text-white transition-all duration-300 flex items-center gap-3 group py-2"
                  >
                    <motion.div
                      className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-blue-500/20 transition-colors"
                      whileHover={{ scale: 1.1 }}
                    >
                      <link.icon size={16} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                    <span className="group-hover:translate-x-2 transform transition-transform">
                      {link.label}
                    </span>
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Customer Service */}
          <motion.div variants={staggerVariants}>
            <motion.h3 
              className="text-xl font-semibold mb-8 text-white flex items-center gap-3"
              variants={itemVariants}
            >
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              {t("footer.customerService")}
            </motion.h3>
            <motion.ul 
              className="space-y-4"
              variants={staggerVariants}
            >
              {[
                { path: "/shipping-info", label: t("footer.shipping"), icon: Clock },
                { path: "/terms-of-use", label: t("footer.terms"), icon: Shield },
                { path: "/privacy-policy", label: t("footer.privacy"), icon: Shield },
                { path: "/contact", label: t("footer.contactSupport"), icon: HeadphonesIcon }
              ].map((link, index) => (
                <motion.li key={link.path} variants={itemVariants}>
                  <Link
                    to={link.path}
                    className="text-blue-100 hover:text-white transition-all duration-300 flex items-center gap-3 group py-2"
                  >
                    <motion.div
                      className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-green-500/20 transition-colors"
                      whileHover={{ scale: 1.1 }}
                    >
                      <link.icon size={16} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                    <span className="group-hover:translate-x-2 transform transition-transform">
                      {link.label}
                    </span>
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={staggerVariants}>
            <motion.h3 
              className="text-xl font-semibold mb-8 text-white flex items-center gap-3"
              variants={itemVariants}
            >
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              {t("footer.contactUs")}
            </motion.h3>
            <motion.div 
              className="space-y-6"
              variants={staggerVariants}
            >
              {[
                {
                  icon: Phone,
                  title: "0656768448",
                  subtitle: t("footer.phone"),
                  color: "text-green-400",
                  bgColor: "bg-green-500/20",
                  href: "tel:0656768448"
                },
                {
                  icon: Instagram,
                  title: "zoubir__trends",
                  subtitle: "Instagram",
                  color: "text-pink-400",
                  bgColor: "bg-pink-500/20",
                  href: "https://instagram.com/zoubir__trends"
                },
                {
                  icon: MapPin,
                  title: t("footer.address"),
                  subtitle: "بن رمضان بسكرة",
                  color: "text-blue-400",
                  bgColor: "bg-blue-500/20",
                  href: "#"
                }
              ].map((contact, index) => (
                <motion.a
                  key={contact.title}
                  href={contact.href}
                  className="flex items-center gap-4 text-blue-100 group hover:text-white transition-all duration-300 p-3 rounded-2xl hover:bg-white/5"
                  variants={itemVariants}
                  whileHover={{ x: 5 }}
                >
                  <div className={`w-12 h-12 ${contact.bgColor} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <contact.icon size={20} className={contact.color} />
                  </div>
                  <div>
                    <span className="font-semibold block group-hover:text-white transition-colors">
                      {contact.title}
                    </span>
                    <span className="text-sm text-blue-200 group-hover:text-blue-100 transition-colors">
                      {contact.subtitle}
                    </span>
                  </div>
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
          variants={itemVariants}
        >
          <motion.p 
            className="text-blue-200 text-sm flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
          >
            <span>© 2024 Zoubir Shop. {t("footer.allRightsReserved")}</span>
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Heart size={16} className="text-red-400 fill-current" />
            </motion.span>
          </motion.p>
          
          <motion.div 
            className="text-blue-200 text-sm flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
          >
            <span>{t("footer.developedBy")}</span>
            <a
              href="https://dernounimk.github.io/dernounimk/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-blue-300 font-semibold transition-colors inline-flex items-center gap-1 hover:gap-2"
            >
              Dernouni MK
              <ArrowUpRight size={14} />
            </a>
          </motion.div>
        </motion.div>
      </motion.div>
    </footer>
  );
};

// Add missing icon component
const HeadphonesIcon = ({ size = 24, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    className={className}
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h2m0 0h2m-2 0v6m0-6v6m0 0h2m-2 0H3m16-6h-2m0 0h-2m2 0v6m0-6v6m0 0h-2m2 0h2M9 8h6m-6 0v8m6-8v8" />
  </svg>
);

export default Footer;
import { Phone, MapPin, Instagram, Mail, Heart, ArrowUpRight, ShoppingBag, Shield, Clock, HeadphonesIcon, Zap, Globe, Users, Package, Target, Sparkles } from "lucide-react";
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
    <footer className="bg-gradient-to-b from-[var(--color-bg)] to-gray-950 text-[var(--color-text)] relative overflow-hidden border-t border-[var(--color-border)]">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        {/* Electric gradient background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 20%, var(--color-electric) 0%, transparent 40%),
                             radial-gradient(circle at 80% 80%, var(--color-accent) 0%, transparent 40%)`,
            backgroundSize: '300px 300px, 400px 400px'
          }}></div>
        </div>

        {/* Animated electric pulses */}
        <motion.div 
          className="absolute top-20 left-1/4 w-96 h-96 bg-[var(--color-electric)]/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-20 right-1/4 w-96 h-96 bg-[var(--color-accent)]/5 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.08, 0.05, 0.08]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />

        {/* Circuit lines pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="circuit" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M 0 40 L 40 40 L 40 0" 
                      stroke="var(--color-electric)" 
                      strokeWidth="1" 
                      fill="none"
                      opacity="0.3"/>
                <path d="M 80 40 L 40 40 L 40 80" 
                      stroke="var(--color-accent)" 
                      strokeWidth="1" 
                      fill="none"
                      opacity="0.3"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#circuit)" />
          </svg>
        </div>

        {/* Floating electric particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-[var(--color-electric)] rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, Math.random() * 20 - 10, 0],
                opacity: [0, 0.8, 0]
              }}
              transition={{
                duration: 4 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 3
              }}
            />
          ))}
        </div>
      </div>

      <motion.div 
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-16">
          {/* Brand Section - متوافق مع شعار النافبار */}
          <motion.div 
            className="lg:col-span-1"
            variants={staggerVariants}
          >
            <motion.div 
              className="flex items-center gap-4 mb-6"
              variants={itemVariants}
            >
              <motion.div 
                className="w-14 h-14 bg-gradient-to-r from-[var(--color-electric)] to-[var(--color-accent)] rounded-2xl flex items-center justify-center shadow-lg shadow-[var(--color-accent)]/20"
                whileHover={{ 
                  scale: 1.05,
                  rotate: [0, -5, 5, 0]
                }}
                transition={{ duration: 0.3 }}
              >
                <Zap className="w-7 h-7 text-white" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-[var(--color-electric)] to-[var(--color-accent)] bg-clip-text text-transparent">
                  Volty Store
                </h2>
                <p className="text-[var(--color-text-secondary)] text-sm mt-1">
                  {t("footer.tagline")}
                </p>
              </div>
            </motion.div>
            
            <motion.p 
              className="text-[var(--color-text-secondary)] leading-relaxed mb-8 text-base"
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
                  href: "https://instagram.com/volty_store_dz", 
                  label: "Instagram",
                  gradient: "from-pink-500 to-rose-600",
                  hover: "hover:shadow-pink-500/30"
                },
                { 
                  icon: Phone, 
                  href: "tel:0656768448", 
                  label: "Phone",
                  gradient: "from-green-500 to-emerald-600",
                  hover: "hover:shadow-green-500/30"
                },
                { 
                  icon: Mail, 
                  href: "mailto:contact@volty.dz", 
                  label: "Email",
                  gradient: "from-blue-500 to-cyan-600",
                  hover: "hover:shadow-blue-500/30"
                },
                { 
                  icon: Globe, 
                  href: "#", 
                  label: "Website",
                  gradient: "from-[var(--color-electric)] to-[var(--color-accent)]",
                  hover: "hover:shadow-[var(--color-accent)]/30"
                }
              ].map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  className={`w-12 h-12 bg-gradient-to-r ${social.gradient} backdrop-blur-sm rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg hover:scale-110 hover:shadow-xl ${social.hover} border border-white/10`}
                  aria-label={social.label}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                >
                  <social.icon size={22} className="text-white" />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {/* Quick Links - بنفس أسلوب النافبار */}
          <motion.div variants={staggerVariants}>
            <motion.h3 
              className="text-xl font-semibold mb-8 text-[var(--color-text)] flex items-center gap-3"
              variants={itemVariants}
            >
              <Sparkles className="w-5 h-5 text-[var(--color-accent)]" />
              {t("footer.quickLinks")}
            </motion.h3>
            <motion.ul 
              className="space-y-4"
              variants={staggerVariants}
            >
              {[
                { path: "/", label: t("navbar.home"), icon: ArrowUpRight },
                { path: "/products", label: t("footer.products"), icon: ShoppingBag },
                { path: "/categories", label: t("footer.categories"), icon: Package },
                { path: "/contact", label: t("navbar.contact"), icon: Phone },
                { path: "/favorites", label: t("navbar.favorites"), icon: Heart }
              ].map((link, index) => (
                <motion.li key={link.path} variants={itemVariants}>
                  <Link
                    to={link.path}
                    className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-all duration-300 flex items-center gap-3 group py-2"
                  >
                    <motion.div
                      className="w-10 h-10 bg-[var(--color-bg-gray)] rounded-xl flex items-center justify-center group-hover:bg-[var(--color-accent)]/10 transition-colors border border-[var(--color-border)]"
                      whileHover={{ scale: 1.1 }}
                    >
                      <link.icon size={18} className="text-[var(--color-text-secondary)] group-hover:text-[var(--color-accent)] transition-colors" />
                    </motion.div>
                    <span className="group-hover:translate-x-2 transform transition-transform font-medium">
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
              className="text-xl font-semibold mb-8 text-[var(--color-text)] flex items-center gap-3"
              variants={itemVariants}
            >
              <Shield className="w-5 h-5 text-[var(--color-electric)]" />
              {t("footer.customerService")}
            </motion.h3>
            <motion.ul 
              className="space-y-4"
              variants={staggerVariants}
            >
              {[
                { path: "/shipping-info", label: t("footer.shipping"), icon: Clock },
                { path: "/returns", label: t("footer.returns"), icon: ArrowUpRight },
                { path: "/terms-of-use", label: t("footer.terms"), icon: Shield },
                { path: "/privacy-policy", label: t("footer.privacy"), icon: Shield },
                { path: "/contact", label: t("footer.contactSupport"), icon: HeadphonesIcon }
              ].map((link, index) => (
                <motion.li key={link.path} variants={itemVariants}>
                  <Link
                    to={link.path}
                    className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-all duration-300 flex items-center gap-3 group py-2"
                  >
                    <motion.div
                      className="w-10 h-10 bg-[var(--color-bg-gray)] rounded-xl flex items-center justify-center group-hover:bg-[var(--color-electric)]/10 transition-colors border border-[var(--color-border)]"
                      whileHover={{ scale: 1.1 }}
                    >
                      <link.icon size={18} className="text-[var(--color-text-secondary)] group-hover:text-[var(--color-electric)] transition-colors" />
                    </motion.div>
                    <span className="group-hover:translate-x-2 transform transition-transform font-medium">
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
              className="text-xl font-semibold mb-8 text-[var(--color-text)] flex items-center gap-3"
              variants={itemVariants}
            >
              <Target className="w-5 h-5 text-[var(--color-accent)]" />
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
                  gradient: "from-green-500 to-emerald-600",
                  href: "tel:0656768448"
                },
                {
                  icon: Instagram,
                  title: "volty_store_dz",
                  subtitle: "Instagram",
                  gradient: "from-pink-500 to-rose-600",
                  href: "https://instagram.com/volty_store_dz"
                },
                {
                  icon: MapPin,
                  title: t("footer.address"),
                  subtitle: "بن رمضان بسكرة",
                  gradient: "from-blue-500 to-cyan-600",
                  href: "#"
                },
                {
                  icon: Users,
                  title: "24/7",
                  subtitle: t("footer.support"),
                  gradient: "from-[var(--color-electric)] to-[var(--color-accent)]",
                  href: "/contact"
                }
              ].map((contact, index) => (
                <motion.a
                  key={contact.title}
                  href={contact.href}
                  className="flex items-center gap-4 text-[var(--color-text-secondary)] group hover:text-[var(--color-text)] transition-all duration-300 p-3 rounded-2xl hover:bg-[var(--color-bg-gray)] border border-transparent hover:border-[var(--color-border)]"
                  variants={itemVariants}
                  whileHover={{ x: 5 }}
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${contact.gradient} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-md`}>
                    <contact.icon size={20} className="text-white" />
                  </div>
                  <div>
                    <span className="font-semibold block group-hover:text-[var(--color-text)] transition-colors">
                      {contact.title}
                    </span>
                    <span className="text-sm text-[var(--color-text-secondary)] group-hover:text-[var(--color-text)]/80 transition-colors">
                      {contact.subtitle}
                    </span>
                  </div>
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Features Banner - بنفس أسلوب النافبار */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          variants={itemVariants}
        >
          {[
            { 
              icon: Zap, 
              title: t("footer.fastDelivery"), 
              desc: t("footer.fastDeliveryDesc"), 
              gradient: "from-[var(--color-electric)] to-[var(--color-accent)]",
              bg: "bg-gradient-to-r from-[var(--color-electric)]/10 to-[var(--color-accent)]/10"
            },
            { 
              icon: Shield, 
              title: t("footer.securePayment"), 
              desc: t("footer.securePaymentDesc"), 
              gradient: "from-green-500 to-emerald-600",
              bg: "bg-green-500/10"
            },
            { 
              icon: HeadphonesIcon, 
              title: t("footer.support24"), 
              desc: t("footer.support24Desc"), 
              gradient: "from-blue-500 to-cyan-600",
              bg: "bg-blue-500/10"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              className={`${feature.bg} backdrop-blur-sm rounded-2xl p-6 border border-[var(--color-border)] hover:border-transparent hover:shadow-lg hover:shadow-current/20 transition-all duration-300`}
              whileHover={{ y: -5 }}
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-4 shadow-md`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-[var(--color-text)] mb-2">{feature.title}</h4>
              <p className="text-[var(--color-text-secondary)] text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Bar - متوافق مع النافبار */}
        <motion.div 
          className="border-t border-[var(--color-border)] pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
          variants={itemVariants}
        >
          <motion.p 
            className="text-[var(--color-text-secondary)] text-sm flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
          >
            <span>© {new Date().getFullYear()} Volty Store. {t("footer.allRightsReserved")}</span>
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Heart size={16} className="text-[var(--color-accent)] fill-current" />
            </motion.span>
          </motion.p>
          
          <motion.div 
            className="text-[var(--color-text-secondary)] text-sm flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
          >
            <span>{t("footer.developedBy")}</span>
            <a
              href="https://dernounimk.github.io/dernounimk/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-text)] hover:text-[var(--color-accent)] font-semibold transition-colors inline-flex items-center gap-1 hover:gap-2"
            >
              Dernouni MK
              <ArrowUpRight size={14} className="text-[var(--color-accent)]" />
            </a>
          </motion.div>
        </motion.div>

        {/* Language Selector - مثل النافبار */}
        <motion.div 
          className="mt-6 flex justify-center"
          variants={itemVariants}
        >
          <div className="flex items-center gap-2 bg-[var(--color-bg-gray)] backdrop-blur-sm rounded-full px-4 py-2 border border-[var(--color-border)]">
            <Globe className="w-4 h-4 text-[var(--color-text-secondary)]" />
            <select 
              className="bg-transparent text-[var(--color-text-secondary)] text-sm focus:outline-none cursor-pointer"
              value={i18n.language}
              onChange={(e) => i18n.changeLanguage(e.target.value)}
            >
              <option value="ar">العربية</option>
              <option value="en">English</option>
              <option value="fr">Français</option>
            </select>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default Footer;
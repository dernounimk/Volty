import { Phone, MapPin, Instagram, Mail, Heart, ArrowUpRight } from "lucide-react";
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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-blue-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-600/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>

      <motion.div 
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <motion.div 
            className="lg:col-span-1"
            variants={itemVariants}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">Z</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Zoubir Shop
              </span>
            </div>
            <p className="text-blue-100 leading-relaxed mb-6 text-lg">
              {t("footer.description")}
            </p>
            <div className="flex gap-4">
              {[
                { icon: Instagram, href: "#", label: "Instagram", color: "hover:text-pink-400" },
                { icon: Phone, href: "tel:0656768448", label: "Phone", color: "hover:text-green-400" },
                { icon: Mail, href: "mailto:contact@zoubirshop.dz", label: "Email", color: "hover:text-blue-400" }
              ].map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  className={`w-12 h-12 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center transition-all duration-300 hover:bg-white/20 ${social.color} hover:scale-110`}
                  aria-label={social.label}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <social.icon size={20} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-semibold mb-6 text-white">
              {t("footer.quickLinks")}
            </h3>
            <ul className="space-y-4">
              {[
                { path: "/", label: t("navbar.home") },
                { path: "/contact", label: t("navbar.contact") },
                { path: "/favorites", label: t("navbar.favorites") },
                { path: "/faq", label: t("footer.faq") }
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-blue-100 hover:text-white transition-all duration-300 hover:translate-x-2 transform flex items-center gap-2 group"
                  >
                    <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Customer Service */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-semibold mb-6 text-white">
              {t("footer.customerService")}
            </h3>
            <ul className="space-y-4">
              {[
                { path: "/shipping-info", label: t("footer.shipping") },
                { path: "/terms-of-use", label: t("footer.terms") },
                { path: "/privacy-policy", label: t("footer.privacy") },
                { path: "/contact", label: t("footer.contactSupport") }
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-blue-100 hover:text-white transition-all duration-300 hover:translate-x-2 transform flex items-center gap-2 group"
                  >
                    <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-semibold mb-6 text-white">
              {t("footer.contactUs")}
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-blue-100 group hover:text-white transition-colors">
                <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                  <Phone size={18} className="text-green-400" />
                </div>
                <div>
                  <span className="font-medium block">0656768448</span>
                  <span className="text-sm text-blue-200">{t("footer.phone")}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-blue-100 group hover:text-white transition-colors">
                <div className="w-10 h-10 bg-pink-500/20 rounded-xl flex items-center justify-center group-hover:bg-pink-500/30 transition-colors">
                  <Instagram size={18} className="text-pink-400" />
                </div>
                <div>
                  <span className="font-medium block">zoubir__trends</span>
                  <span className="text-sm text-blue-200">Instagram</span>
                </div>
              </div>
              
              <div className="flex items-start gap-3 text-blue-100 group hover:text-white transition-colors">
                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:bg-blue-500/30 transition-colors mt-1">
                  <MapPin size={18} className="text-blue-400" />
                </div>
                <div>
                  <span className="font-medium block">{t("footer.address")}</span>
                  <span className="text-sm text-blue-200"> بن رمضان بسكرة</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          className="border-t border-white/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center"
          variants={itemVariants}
        >
          <p className="text-blue-200 text-sm flex items-center gap-1 mb-4 md:mb-0">
            © 2024 Zoubir Shop. {t("footer.allRightsReserved")}
            <Heart size={14} className="text-red-400 fill-current animate-pulse" />
          </p>
          <div className="text-blue-200 text-sm text-center md:text-right">
            <span>{t("footer.developedBy")} </span>
            <a
              href="https://dernounimk.github.io/dernounimk/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-blue-300 font-semibold transition-colors inline-flex items-center gap-1"
            >
              Dernouni MK
              <ArrowUpRight size={14} />
            </a>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default Footer;
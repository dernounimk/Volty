import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ShoppingBag, Home, Search, ArrowRight, Ghost } from "lucide-react";
import { motion } from "framer-motion";
import { useNavbar } from "../context/NavbarContext";

const NotFoundPage = () => {
  const { t } = useTranslation();
  const { openNavbarAndFocusSearch } = useNavbar(); 

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <motion.div
        className="max-w-2xl w-full text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* الرمز الرئيسي */}
        <motion.div
          variants={itemVariants}
          className="mb-8 relative"
        >
          <div className="relative inline-block">
            {/* تأثير الخلفية */}
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-electric)] to-[var(--color-accent)] rounded-full blur-3xl opacity-20 animate-pulse"></div>
            
            {/* الرمز الرئيسي */}
            <div className="relative bg-[var(--color-bg)] p-8 rounded-3xl shadow-2xl border border-[var(--color-border)]">
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="text-8xl mb-4"
              >
                <Ghost className="w-6 h-6 text-[var(--color-accent)]" />
              </motion.div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5, type: "spring" }}
                className="text-9xl font-bold bg-gradient-to-r from-[var(--color-electric)] to-[var(--color-accent)] bg-clip-text text-transparent"
              >
                404
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* العنوان والرسالة */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text)] mb-4">
            {t("notFound.title")}
          </h1>
          <p className="text-xl text-[var(--color-text-secondary)] leading-relaxed max-w-md mx-auto">
            {t("notFound.message")}
          </p>
        </motion.div>

        {/* أزرار الإجراءات */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row justify-center gap-4 mb-12"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/"
              className="flex items-center justify-center gap-3 px-8 py-4 bg-[var(--color-accent)] text-[var(--color-on-accent)] rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Home className="w-5 h-5" />
              {t("notFound.homeButton")}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <button
              onClick={openNavbarAndFocusSearch}
              className="flex items-center justify-center gap-3 px-8 py-4 bg-[var(--color-bg)] text-[var(--color-text)] border-2 border-[var(--color-border)] rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:border-[var(--color-accent)]"
            >
              <Search className="w-5 h-5" />
              {t("notFound.searchButton")}
            </button>
          </motion.div>
        </motion.div>

        {/* معلومات إضافية */}
        <motion.div
          variants={itemVariants}
          className="bg-[var(--color-bg)] rounded-2xl p-6 shadow-lg border border-[var(--color-border)] max-w-md mx-auto"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <Ghost className="w-6 h-6 text-[var(--color-accent)]" />
            <h3 className="text-lg font-semibold text-[var(--color-text)]">
              {t("notFound.tipsTitle")}
            </h3>
          </div>
          <ul className="text-[var(--color-text-secondary)] text-left space-y-2">
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[var(--color-electric)] rounded-full"></div>
              {t("notFound.tip1")}
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[var(--color-accent)] rounded-full"></div>
              {t("notFound.tip2")}
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              {t("notFound.tip3")}
            </li>
          </ul>
        </motion.div>

        {/* رسوم متحركة إضافية */}
        <motion.div
          className="mt-12 opacity-60"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "loop",
          }}
        >
          <div className="w-20 h-20 mx-auto border-4 border-dashed border-[var(--color-accent)] rounded-full"></div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
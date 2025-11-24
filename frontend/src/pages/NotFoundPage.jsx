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
    <div className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 pt-24">
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
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
            
            {/* الرمز الرئيسي */}
            <div className="relative bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700">
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
                👻
              </motion.div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5, type: "spring" }}
                className="text-9xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              >
                404
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* العنوان والرسالة */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t("notFound.title")}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-md mx-auto">
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
              className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Home className="w-5 h-5" />
              {t("notFound.homeButton")}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <button
              onClick={openNavbarAndFocusSearch}
              className="flex items-center justify-center gap-3 px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:border-blue-500"
            >
              <Search className="w-5 h-5" />
              {t("notFound.searchButton")}
            </button>
          </motion.div>
        </motion.div>

        {/* معلومات إضافية */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 max-w-md mx-auto"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <Ghost className="w-6 h-6 text-purple-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t("notFound.tipsTitle")}
            </h3>
          </div>
          <ul className="text-gray-600 dark:text-gray-300 text-left space-y-2">
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              {t("notFound.tip1")}
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
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
          <div className="w-20 h-20 mx-auto border-4 border-dashed border-blue-500 rounded-full"></div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
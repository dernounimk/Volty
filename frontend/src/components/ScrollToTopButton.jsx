import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [rotate, setRotate] = useState(0);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    setRotate((prev) => prev + 360);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          key="scroll-to-top"
          initial={{ opacity: 0, scale: 0, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0, y: 50 }}
          transition={{ 
            duration: 0.3, 
            ease: "easeOut",
            type: "spring",
            stiffness: 200,
            damping: 15
          }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-[9999] p-3 rounded-2xl
            backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 
            border border-gray-200 dark:border-gray-700
            shadow-lg hover:shadow-xl
            transition-all duration-300
            group"
          aria-label="Scroll to top"
        >
          <motion.div
            animate={{ rotate }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="relative"
          >
            {/* الخلفية المتدرجة */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
            
            {/* الأيقونة */}
            <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-xl group-hover:from-blue-700 group-hover:to-purple-700 transition-all duration-300">
              <ArrowUp size={20} className="group-hover:scale-110 transition-transform" />
            </div>
          </motion.div>

          {/* تأثير glow عند hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300 -z-10" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTopButton;
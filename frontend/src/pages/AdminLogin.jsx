import { useState } from "react";
import { motion } from "framer-motion";
import { LogIn, Mail, Lock, Loader, Eye, EyeOff, Shield, ArrowLeft } from "lucide-react";
import { useAdminAuthStore } from "../stores/useAdminAuthStore";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

const AdminLogin = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login, loading } = useAdminAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password, navigate);
      toast.success(t("login.success"));
    } catch (error) {
      toast.error(t("login.error"));
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-md w-full space-y-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="text-center">
          <motion.div
            className="flex justify-center mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-electric)] to-[var(--color-accent)] rounded-2xl blur-2xl opacity-75"></div>
              <div className="relative bg-[var(--color-bg)] p-4 rounded-2xl shadow-2xl border border-[var(--color-border)]">
                <Shield className="w-12 h-12 text-[var(--color-electric)]" />
              </div>
            </div>
          </motion.div>
          
          <motion.h2
            className="text-3xl font-bold text-[var(--color-text)] mb-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {t("adminLogin.title")}
          </motion.h2>
          <motion.p
            className="text-[var(--color-text-secondary)]"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {t("adminLogin.subtitle")}
          </motion.p>
        </div>

        {/* Login Form */}
        <motion.div
          className="bg-[var(--color-bg)] rounded-3xl shadow-2xl border border-[var(--color-border)] p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-[var(--color-text)]">
                {t("adminLogin.emailLabel")}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-[var(--color-text-secondary)]" />
                </div>
                <input 
                  id="email" 
                  type="email" 
                  required 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="block w-full pl-10 pr-3 py-3 bg-[var(--color-bg-gray)] border border-[var(--color-border)] rounded-2xl text-[var(--color-text)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-all duration-200"
                  placeholder={t("adminLogin.emailPlaceholder")} 
                  dir="ltr"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-[var(--color-text)]">
                {t("adminLogin.passwordLabel")}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[var(--color-text-secondary)]" />
                </div>
                <input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  required 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="block w-full pl-10 pr-12 py-3 bg-[var(--color-bg-gray)] border border-[var(--color-border)] rounded-2xl text-[var(--color-text)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-all duration-200"
                  placeholder={t("adminLogin.passwordPlaceholder")} 
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-3 py-4 px-6 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-[var(--color-on-accent)] font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  {t("adminLogin.loading")}
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  {t("adminLogin.loginButton")}
                </>
              )}
            </motion.button>
          </form>

          {/* Back to Home Link */}
          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("adminLogin.backToHome")}
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
import { useState, useEffect } from "react";
import { Star, Instagram, ChevronDown, ChevronUp, Sparkles, Send, ThumbsUp, MessageCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import StarRating from "./StarRating";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const ReviewsSection = ({
  product,
  reviews,
  reviewForm,
  setReviewForm,
  handleSubmitReview,
}) => {
  const { t, i18n } = useTranslation();
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localReviews, setLocalReviews] = useState(reviews);
  
  const reviewsRef = useRef(null);
  const isInView = useInView(reviewsRef, { once: true, amount: 0.1 });
  
  const isRTL = i18n.language === "ar";

  // Calculate review stats
  const reviewStats = {
    average: reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length || 0,
    distribution: Array(5).fill(0).map((_, i) => 
      reviews.filter(rev => rev.rating === 5 - i).length
    ),
    total: reviews.length
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await handleSubmitReview(e);
      // Add animation for new review
      const newReview = {
        ...reviewForm,
        _id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      setLocalReviews([newReview, ...localReviews]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mx-auto mt-16 w-full"
    >
      {/* Review Stats Card */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-6 text-white shadow-2xl"
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <Sparkles className="w-8 h-8" />
              <span className="text-2xl font-bold">⭐</span>
            </div>
            <h3 className="text-2xl font-bold mb-2">{reviewStats.average.toFixed(1)}</h3>
            <p className="text-blue-100">{t("reviews.averageRating")}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 p-6 text-white shadow-2xl"
        >
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <MessageCircle className="w-8 h-8" />
              <span className="text-2xl font-bold">💬</span>
            </div>
            <h3 className="text-2xl font-bold mb-2">{reviewStats.total}</h3>
            <p className="text-gray-300">{t("reviews.totalReviews")}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-white shadow-2xl"
        >
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <ThumbsUp className="w-8 h-8" />
              <span className="text-2xl font-bold">👍</span>
            </div>
            <h3 className="text-2xl font-bold mb-2">
              {Math.round((reviews.filter(r => r.rating >= 4).length / reviews.length) * 100) || 0}%
            </h3>
            <p className="text-emerald-100">{t("reviews.positive")}</p>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" ref={reviewsRef}>
        {/* Review Form Section */}
        <motion.div
          initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="sticky top-6">
            <div className="rounded-3xl backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 border border-white/20 dark:border-gray-700/50 shadow-2xl shadow-blue-500/10 dark:shadow-purple-500/10 p-8">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-3 mb-8"
              >
                <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500">
                  <Send className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t("reviews.shareExperience")}
                </h2>
              </motion.div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name and Instagram */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="block mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {t("reviews.name")}
                    </label>
                    <input
                      type="text"
                      value={reviewForm.name}
                      onChange={(e) =>
                        setReviewForm({ ...reviewForm, name: e.target.value })
                      }
                      className="w-full rounded-2xl px-5 py-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300"
                      placeholder={t("reviews.namePlaceholder")}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.4 }}
                  >
                    <label className="block mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {t("reviews.instagram")}
                    </label>
                    <div className="relative">
                      <Instagram className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={reviewForm.instagram}
                        onChange={(e) =>
                          setReviewForm({
                            ...reviewForm,
                            instagram: e.target.value.trim(),
                          })
                        }
                        className="w-full rounded-2xl pl-12 pr-5 py-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20 transition-all duration-300"
                        placeholder="@username"
                      />
                    </div>
                  </motion.div>
                </div>

                {/* Comment */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.5 }}
                >
                  <label className="block mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {t("reviews.comment")}
                  </label>
                  <textarea
                    value={reviewForm.comment}
                    onChange={(e) =>
                      setReviewForm({ ...reviewForm, comment: e.target.value })
                    }
                    className="w-full rounded-2xl px-5 py-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 resize-none"
                    rows="4"
                    placeholder={t("reviews.commentPlaceholder")}
                  />
                </motion.div>

                {/* Rating and Submit */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.6 }}
                  className={`flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-2xl bg-gradient-to-r from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900/50 ${
                    isRTL ? "md:flex-row-reverse" : ""
                  }`}
                >
                  <div className="flex-1">
                    <label className="block mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {t("reviews.rating")}
                    </label>
                    <StarRating
                      rating={reviewForm.rating}
                      setRating={(val) =>
                        setReviewForm({ ...reviewForm, rating: val })
                      }
                      size="lg"
                      animated={true}
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:shadow-2xl shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          {t("reviews.submitting")}
                        </>
                      ) : (
                        <>
                          {t("reviews.submit")}
                          <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </motion.button>
                </motion.div>
              </form>
            </div>
          </div>
        </motion.div>

        {/* Reviews List Section */}
        <motion.div
          initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <div className="rounded-3xl backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 border border-white/20 dark:border-gray-700/50 shadow-2xl shadow-purple-500/10 dark:shadow-blue-500/10 p-8">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t("reviews.customerReviews")} ({reviews.length})
              </h2>
            </motion.div>

            <AnimatePresence>
              {localReviews.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
                    <Star className="w-12 h-12 text-gray-400" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                    {t("reviews.noReviews")}
                  </p>
                  <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                    {t("reviews.beFirst")}
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {(showAllReviews ? localReviews : localReviews.slice(0, 3)).map((rev, index) => (
                      <motion.div
                        key={rev._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        exit={{ opacity: 0, y: -20 }}
                        whileHover={{ scale: 1.01 }}
                        className="group relative overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-800/50 dark:to-gray-900/50 border border-gray-100 dark:border-gray-700/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-500/30"
                      >
                        {/* Review Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className={`flex items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              className="relative"
                            >
                              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                                {rev.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
                                <Star className="w-3 h-3 text-white fill-white" />
                              </div>
                            </motion.div>
                            
                            <div>
                              <h4 className="font-bold text-gray-900 dark:text-white">
                                {rev.name}
                              </h4>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <motion.div
                                      key={i}
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      transition={{ delay: i * 0.05 }}
                                    >
                                      <Star
                                        size={16}
                                        className={`${
                                          i < rev.rating
                                            ? "text-yellow-400 fill-yellow-400"
                                            : "text-gray-300 dark:text-gray-600"
                                        } transition-colors duration-300`}
                                      />
                                    </motion.div>
                                  ))}
                                </div>
                                <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                                  {rev.rating}.0
                                </span>
                              </div>
                            </div>
                          </div>

                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap"
                          >
                            {new Date(rev.createdAt).toLocaleDateString(isRTL ? "ar" : "en", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </motion.span>
                        </div>

                        {/* Review Content */}
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                          {rev.comment}
                        </p>

                        {/* Instagram */}
                        {rev.instagram && (
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700/50"
                          >
                            <a
                              href={`https://instagram.com/${rev.instagram.replace("@", "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group/insta flex items-center gap-2 text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 transition-all duration-300 text-sm font-semibold"
                            >
                              <div className="p-2 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 group-hover/insta:from-pink-600 group-hover/insta:to-rose-600 transition-all duration-300">
                                <Instagram size={16} className="text-white" />
                              </div>
                              @{rev.instagram.replace("@", "")}
                            </a>

                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            >
                              <ThumbsUp size={16} />
                            </motion.button>
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </AnimatePresence>

            {/* Show More/Less Button */}
            {localReviews.length > 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8"
              >
                <button
                  onClick={() => setShowAllReviews(!showAllReviews)}
                  className="group w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <span>
                    {showAllReviews ? t("reviews.hide") : t("reviews.showMore")}
                  </span>
                  <motion.div
                    animate={{ rotate: showAllReviews ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {showAllReviews ? (
                      <ChevronUp className="w-5 h-5 group-hover:text-blue-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 group-hover:text-blue-600" />
                    )}
                  </motion.div>
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ReviewsSection;
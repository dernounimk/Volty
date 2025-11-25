import { useState } from "react";
import { Star, Instagram, ChevronDown, ChevronUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import StarRating from "./StarRating";
import PeopleAlsoBought from "./PeopleAlsoBought";

const ReviewsSection = ({
  product,
  reviews,
  reviewForm,
  setReviewForm,
  handleSubmitReview,
}) => {
  const { t, i18n } = useTranslation();
  const [showAllReviews, setShowAllReviews] = useState(false);

  const isRTL = i18n.language === "ar";

  return (
    <div
      className={`mx-auto mt-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-8`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* قسم التقييمات */}
      <div className="mx-auto mt-12 p-8 rounded-2xl backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-800 shadow-lg w-full">
        <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">
          {t("reviews.title")}
        </h2>

        {/* فورم التقييم */}
        {product.reviewsEnabled && (
          <form onSubmit={handleSubmitReview} className="mb-8 p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* الاسم */}
              <div>
                <label className="block mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("reviews.name")}
                </label>
                <input
                  type="text"
                  value={reviewForm.name}
                  onChange={(e) =>
                    setReviewForm({ ...reviewForm, name: e.target.value })
                  }
                  className="w-full rounded-xl px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder={t("reviews.namePlaceholder")}
                />
              </div>

              {/* Instagram */}
              <div>
                <label className="block mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("reviews.instagram")}
                </label>
                <input
                  type="text"
                  value={reviewForm.instagram}
                  onChange={(e) =>
                    setReviewForm({
                      ...reviewForm,
                      instagram: e.target.value.trim(),
                    })
                  }
                  className="w-full rounded-xl px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="@username"
                />
              </div>
            </div>

            {/* التعليق */}
            <div className="mb-6">
              <label className="block mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("reviews.comment")}
              </label>
              <textarea
                value={reviewForm.comment}
                onChange={(e) =>
                  setReviewForm({ ...reviewForm, comment: e.target.value })
                }
                className="w-full rounded-xl px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                rows="4"
                placeholder={t("reviews.commentPlaceholder")}
              />
            </div>

            {/* التقييم + زر الإرسال */}
            <div
              className={`flex items-center justify-between gap-6 ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              {/* النجوم */}
              <div className="flex-1">
                <label className="block mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("reviews.rating")}
                </label>
                <StarRating
                  rating={reviewForm.rating}
                  setRating={(val) =>
                    setReviewForm({ ...reviewForm, rating: val })
                  }
                />
              </div>

              {/* زر الإرسال */}
              <button
                type="submit"
                className="self-end bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500/20"
              >
                {t("reviews.submit")}
              </button>
            </div>
          </form>
        )}

        {/* عرض التقييمات */}
        <div className="mt-6 space-y-4">
          {reviews.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                {t("reviews.noReviews")}
              </p>
            </div>
          )}

          {(showAllReviews ? reviews : reviews.slice(0, 3)).map((rev) => (
            <div
              key={rev._id}
              className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 transition-all duration-200 hover:shadow-md"
            >
              {/* الصف العلوي */}
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  {/* اسم المقيم */}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {rev.name}
                  </span>
                  
                  {/* النجوم */}
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={`${
                          i < rev.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300 dark:text-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* التاريخ */}
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(rev.createdAt).toLocaleDateString(isRTL ? "ar" : "en", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>

              {/* نص التعليق */}
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                {rev.comment}
              </p>

              {/* Instagram */}
              {rev.instagram && (
                <div className="flex items-center justify-between">
                  <a
                    href={`https://instagram.com/${rev.instagram.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 transition-colors text-sm font-medium"
                  >
                    <Instagram size={16} />
                    @{rev.instagram.replace("@", "")}
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* زر عرض المزيد */}
        {reviews.length > 3 && (
          <button
            onClick={() => setShowAllReviews(!showAllReviews)}
            className="mt-6 flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 font-medium"
          >
            {showAllReviews ? (
              <>
                {t("reviews.hide")}
                <ChevronUp size={16} />
              </>
            ) : (
              <>
                {t("reviews.showMore")}
                <ChevronDown size={16} />
              </>
            )}
          </button>
        )}
      </div>

      {/* منتجات قد تعجبك */}
      {product && <PeopleAlsoBought currentProductId={product._id} />}
    </div>
  );
};

export default ReviewsSection;
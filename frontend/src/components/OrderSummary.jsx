import { motion } from "framer-motion";
import { useCartStore } from "../stores/useCartStore";
import { Link, useNavigate } from "react-router-dom";
import { MoveRight, ShoppingBag, Receipt } from "lucide-react";
import { useTranslation } from "react-i18next";

const OrderSummary = () => {
	const { t, i18n } = useTranslation();
	const isRTL = i18n.language === 'ar';
	const { subtotal, total, coupon, isCouponApplied } = useCartStore();
	const navigate = useNavigate();

	const finalTotal = total;

	const handleGoToShipping = () => {
		navigate("/shipping-info");
	};

	return (
		<motion.div
			className="space-y-6 rounded-2xl backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-800 shadow-lg p-6"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			{/* Header */}
			<div className="flex items-center gap-3">
				<div className="p-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white">
					<Receipt size={24} />
				</div>
				<h2 className="text-xl font-bold text-gray-900 dark:text-white">
					{t("orderSummary.title")}
				</h2>
			</div>

			<div className="space-y-4">
				{/* Price Breakdown */}
				<div className="space-y-3">
					{/* Subtotal */}
					<div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
						<span className="text-base font-medium text-gray-600 dark:text-gray-300">
							{t("orderSummary.originalPrice")}
						</span>
						<span className="text-base font-semibold text-gray-900 dark:text-white">
							{subtotal} DA
						</span>
					</div>

					{/* Coupon Discount */}
					{coupon && isCouponApplied && (
						<div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
							<span className="text-base font-medium text-green-600 dark:text-green-400">
								{t("orderSummary.coupon")} ({coupon.code})
							</span>
							<span className="text-base font-semibold text-green-600 dark:text-green-400">
								-{coupon.discountAmount} DA
							</span>
						</div>
					)}

					{/* Total */}
					<div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800">
						<span className="text-lg font-bold text-gray-900 dark:text-white">
							{t("orderSummary.total")}
						</span>
						<span className="text-lg font-bold text-blue-600 dark:text-blue-400">
							{finalTotal} DA
						</span>
					</div>
				</div>

				{/* Confirm Order Button */}
				<motion.button
					className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3.5 text-base font-semibold text-white hover:shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					onClick={handleGoToShipping}
				>
					<ShoppingBag size={20} />
					{t("orderSummary.confirmOrder")}
				</motion.button>

				{/* Continue Shopping */}
				<div className="flex items-center justify-center gap-3 pt-2">
					<span className="text-sm font-medium text-gray-500 dark:text-gray-400">
						{t("orderSummary.or")}
					</span>
					<Link
						to="/"
						className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:gap-3 transition-all duration-200"
					>
						{t("orderSummary.continueShopping")}
						<MoveRight size={16} className={isRTL ? "rotate-180" : ""} />
					</Link>
				</div>
			</div>
		</motion.div>
	);
};

export default OrderSummary;
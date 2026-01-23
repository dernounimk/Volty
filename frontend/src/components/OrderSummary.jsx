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
			className="space-y-6 rounded-2xl backdrop-blur-xl bg-[var(--color-bg-opacity)] border border-[var(--color-border)] shadow-lg p-6"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			{/* Header */}
			<div className="flex items-center gap-3">
				<div className="p-2 rounded-xl bg-gradient-to-r from-[var(--color-electric)] to-[var(--color-accent)] text-[var(--color-on-accent)]">
					<Receipt size={24} />
				</div>
				<h2 className="text-xl font-bold text-[var(--color-text)]">
					{t("orderSummary.title")}
				</h2>
			</div>

			<div className="space-y-4">
				{/* Price Breakdown */}
				<div className="space-y-3">
					{/* Subtotal */}
					<div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-[var(--color-bg-gray)]">
						<span className="text-base font-medium text-[var(--color-text-secondary)]">
							{t("orderSummary.originalPrice")}
						</span>
						<span className="text-base font-semibold text-[var(--color-text)]">
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
					<div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-[var(--color-bg-gray)] to-[var(--color-bg-gray)] border border-[var(--color-border)]">
						<span className="text-lg font-bold text-[var(--color-text)]">
							{t("orderSummary.total")}
						</span>
						<span className="text-lg font-bold text-[var(--color-accent)]">
							{finalTotal} DA
						</span>
					</div>
				</div>

				{/* Confirm Order Button */}
				<motion.button
					className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[var(--color-electric)] to-[var(--color-accent)] px-6 py-3.5 text-base font-semibold text-[var(--color-on-accent)] hover:shadow-lg transition-all duration-200 hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-[var(--color-accent)]/20"
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					onClick={handleGoToShipping}
				>
					<ShoppingBag size={20} />
					{t("orderSummary.confirmOrder")}
				</motion.button>

				{/* Continue Shopping */}
				<div className="flex items-center justify-center gap-3 pt-2">
					<span className="text-sm font-medium text-[var(--color-text-secondary)]">
						{t("orderSummary.or")}
					</span>
					<Link
						to="/"
						className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] hover:gap-3 transition-all duration-200"
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
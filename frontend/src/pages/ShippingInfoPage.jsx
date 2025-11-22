import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Truck, MapPin, User, Phone, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import WilayaSelector from "../components/WilayaSelector";
import OrderSummaryOnly from "../components/OrderSummaryOnly";
import CartItem from "../components/CartItem";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import axios from "../lib/axios.js";
import { useTranslation } from "react-i18next";
import useSettingStore from "../stores/useSettingStore.js";

const ShippingInfoPage = () => {
  const { t } = useTranslation();

  const {
    cart,
    setDeliveryPrice,
    setShippingInfo,
    total,
    deliveryPrice,
    coupon,
    isCouponApplied,
    calculateTotals,
    removeFromCart
  } = useCartStore();

  const { deliverySettings, fetchMetaData } = useSettingStore();

  useEffect(() => {
    fetchMetaData();
  }, []);

  useEffect(() => {
    const validateCartProducts = async () => {
      for (const item of cart) {
        try {
          await axios.get(`/products/${item._id}`);
        } catch {
          removeFromCart(item._id, item.selectedColor, item.selectedSize);
        }
      }
      calculateTotals();
    };

    if (cart.length > 0) validateCartProducts();
  }, [cart, removeFromCart, calculateTotals]);

  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    phoneNumber: "",
    wilaya: "",
    baladia: "",
    deliveryPlace: "office",
    note: "",
  });
  const [selectedWilaya, setSelectedWilaya] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const generateOrderNumber = () => {
    let num = "";
    const chars = "0123456789";
    for (let i = 0; i < 5; i++) {
      num += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return num;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    const deliveryKey = form.deliveryPlace === "office" ? "officePrice" : "homePrice";
    const selectedDelivery = deliverySettings.find(d => d.state === selectedWilaya);
    const price = selectedDelivery ? selectedDelivery[deliveryKey] || 0 : 0;
    setDeliveryPrice(price);
  };

  useEffect(() => {
    if (selectedWilaya) {
      const deliveryKey = form.deliveryPlace === "office" ? "officePrice" : "homePrice";
      const selectedDelivery = deliverySettings.find(d => d.state === selectedWilaya);
      const price = selectedDelivery ? selectedDelivery[deliveryKey] || 0 : 0;
      setDeliveryPrice(price);
    }
  }, [selectedWilaya, form.deliveryPlace, setDeliveryPrice]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!form.fullName.trim() || form.fullName.trim().length < 3) {
      toast.error(t("shippingInfo.errors.invalidFullName"));
      setIsSubmitting(false);
      return;
    }

    const phoneRegex = /^(05|06|07)\d{8}$/;
    if (!phoneRegex.test(form.phoneNumber.trim())) {
      toast.error(t("shippingInfo.errors.invalidPhone"));
      setIsSubmitting(false);
      return;
    }

    if (!selectedWilaya) {
      toast.error(t("shippingInfo.errors.selectWilaya"));
      setIsSubmitting(false);
      return;
    }

    if (!form.baladia.trim() || form.baladia.trim().length < 3) {
      toast.error(t("shippingInfo.errors.invalidBaladia"));
      setIsSubmitting(false);
      return;
    }

    setShippingInfo({ ...form, wilaya: selectedWilaya });

    const orderNumber = generateOrderNumber();
    const selectedDelivery = deliverySettings.find(d => d.state === selectedWilaya);
    const deliveryDays = selectedDelivery ? selectedDelivery.deliveryDays : null;

    const orderData = {
      orderNumber,
      fullName: form.fullName,
      phoneNumber: form.phoneNumber,
      wilaya: selectedWilaya,
      baladia: form.baladia,
      deliveryPlace: form.deliveryPlace,
      deliveryPrice: deliveryPrice,
      note: form.note,
      products: cart.map((item) => ({
        product: item._id,
        quantity: item.quantity,
        price: item.priceAfterDiscount ?? item.priceBeforeDiscount,
        selectedColor: item.selectedColor || null,
        selectedSize: item.selectedSize || null,
      })),
      totalAmount: total + (deliveryPrice || 0),
      couponCode: isCouponApplied ? coupon.code : null,
    };

    try {
      const response = await axios.post("/orders", orderData);
      toast.success(t("shippingInfo.success.orderSent"));
      navigate("/purchase-success", { state: { orderNumber, deliveryDays } });
    } catch (error) {
      console.error("Order creation error:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(t("shippingInfo.errors.orderError"));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const shippingCost =
    selectedWilaya && deliverySettings[selectedWilaya]
      ? deliverySettings[selectedWilaya][form.deliveryPlace]
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 py-8 px-4 sm:px-6 lg:px-8">
      {cart.length === 0 ? (
        <EmptyCartUI t={t} />
      ) : (
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-3 bg-white dark:bg-gray-800 px-6 py-3 rounded-2xl shadow-lg mb-6">
              <Truck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t("shippingInfo.title")}
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              {t("shippingInfo.subtitle")}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <motion.div
              className="w-full bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Full Name */}
                  <InputField
                    label={t("shippingInfo.fullName")}
                    id="fullName"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    icon={User}
                    placeholder={t("shippingInfo.placeholders.fullName")}
                  />

                  {/* Phone Number */}
                  <InputField
                    label={t("shippingInfo.phoneNumber")}
                    id="phoneNumber"
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    icon={Phone}
                    placeholder={t("shippingInfo.placeholders.phone")}
                  />

                  {/* Wilaya Selector */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {t("shippingInfo.wilaya")}
                    </label>
                    <WilayaSelector 
                      selectedWilaya={selectedWilaya} 
                      setSelectedWilaya={setSelectedWilaya} 
                    />
                  </div>

                  {/* Baladia */}
                  <InputField
                    label={t("shippingInfo.baladia")}
                    id="baladia"
                    name="baladia"
                    value={form.baladia}
                    onChange={handleChange}
                    icon={MapPin}
                    placeholder={t("shippingInfo.placeholders.baladia")}
                  />

                  {/* Delivery Place */}
                  <DeliveryPlaceSelector form={form} handleChange={handleChange} t={t} />

                  {/* Note */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      {t("shippingInfo.note")}
                    </label>
                    <textarea
                      name="note"
                      value={form.note}
                      onChange={handleChange}
                      rows="3"
                      placeholder={t("shippingInfo.placeholders.note")}
                      className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl py-3 px-4 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 rounded-2xl shadow-lg transition-all duration-300 text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        {t("shippingInfo.processing")}
                      </>
                    ) : (
                      <>
                        <Truck className="w-5 h-5" />
                        {t("shippingInfo.confirmOrder")}
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  {t("shippingInfo.orderSummary")}
                </h3>
                <OrderSummaryOnly shippingCost={shippingCost} />
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {t("shippingInfo.cartItems")}
                </h3>
                <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                  {cart.map((item, index) => (
                    <motion.div
                      key={`${item._id}-${item.selectedColor}-${item.selectedSize}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <CartItem item={item} />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

/** Input Field Component */
const InputField = ({ label, id, name, value, onChange, icon: Icon, placeholder }) => (
  <div className="space-y-2">
    <label htmlFor={id} className="block text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
      <Icon className="w-4 h-4" />
      {label}
    </label>
    <input
      type="text"
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl py-3 px-4 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
    />
  </div>
);

/** Delivery Place Radio Selector */
const DeliveryPlaceSelector = ({ form, handleChange, t }) => (
  <div className="space-y-3">
    <span className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
      {t("shippingInfo.deliveryPlace")}
    </span>
    <div className="grid grid-cols-2 gap-4">
      <label className={`relative cursor-pointer ${form.deliveryPlace === "office" ? "ring-2 ring-blue-500" : ""}`}>
        <input
          type="radio"
          name="deliveryPlace"
          value="office"
          checked={form.deliveryPlace === "office"}
          onChange={handleChange}
          className="sr-only"
        />
        <div className={`p-4 rounded-2xl border-2 transition-all duration-200 ${
          form.deliveryPlace === "office" 
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" 
            : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
        }`}>
          <div className="text-center">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <span className="font-medium text-gray-900 dark:text-white">
              {t("shippingInfo.office")}
            </span>
          </div>
        </div>
      </label>
      
      <label className={`relative cursor-pointer ${form.deliveryPlace === "home" ? "ring-2 ring-purple-500" : ""}`}>
        <input
          type="radio"
          name="deliveryPlace"
          value="home"
          checked={form.deliveryPlace === "home"}
          onChange={handleChange}
          className="sr-only"
        />
        <div className={`p-4 rounded-2xl border-2 transition-all duration-200 ${
          form.deliveryPlace === "home" 
            ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20" 
            : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
        }`}>
          <div className="text-center">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <Truck className="w-4 h-4 text-white" />
            </div>
            <span className="font-medium text-gray-900 dark:text-white">
              {t("shippingInfo.home")}
            </span>
          </div>
        </div>
      </label>
    </div>
  </div>
);

const EmptyCartUI = ({ t }) => (
  <motion.div
    className="flex flex-col items-center justify-center space-y-6 py-20"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-md opacity-75"></div>
      <ShoppingCart className="relative h-24 w-24 text-white p-4 bg-gray-900 rounded-2xl" />
    </div>
    <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
      {t("shippingInfo.emptyCart.title")}
    </h3>
    <p className="text-gray-600 dark:text-gray-300 text-center max-w-md text-lg">
      {t("shippingInfo.emptyCart.subtitle")}
    </p>
    <Link
      className="mt-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-white font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105"
      to="/"
    >
      {t("shippingInfo.emptyCart.startShopping")}
    </Link>
  </motion.div>
);

export default ShippingInfoPage;
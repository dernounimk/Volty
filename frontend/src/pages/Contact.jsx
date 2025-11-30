import { Instagram, Phone, MapPin, Mail, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const Contact = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const contactItems = [
    {
      icon: Instagram,
      title: t("contact.instagram"),
      value: "@volty_store",
      href: "https://instagram.com/volty",
      color: "from-pink-500 to-purple-500",
      bgColor: "bg-gradient-to-br from-pink-500 to-purple-500"
    },
    {
      icon: Phone,
      title: t("contact.phone"),
      value: "0553512070",
      href: "tel:0553512070",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-gradient-to-br from-green-500 to-emerald-500"
    },
    {
      icon: MapPin,
      title: t("contact.location"),
      value: "زقاق بن رمضان بسكرة",
      href: "https://www.google.com/maps?q=زقاق+بن+رمضان+بسكرة",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-gradient-to-br from-blue-500 to-cyan-500"
    },
    {
      icon: MessageCircle,
      title: t("contact.telegram"),
      value: "volty_store",
      href: "https://t.me/volty_store",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-gradient-to-br from-orange-500 to-red-500"
    }
  ];

  return (
    <div className="min-h-screen relative py-12 px-4 sm:px-6 lg:px-8">
      {/* إزالة الخلفية القديمة وإضافة محتوى شفاف */}
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* العنوان الرئيسي */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-md opacity-75"></div>
              <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-white/20">
                <MessageCircle className="w-12 h-12 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 dark:from-white dark:to-blue-400 bg-clip-text text-transparent mb-4">
            {t("contact.title")}
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {t("contact.subtitle")}
          </p>
        </motion.div>

        {/* بطاقات الاتصال */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {contactItems.map((item, index) => (
            <motion.a
              key={index}
              href={item.href}
              target={item.href.startsWith('http') ? '_blank' : '_self'}
              rel={item.href.startsWith('http') ? 'noopener noreferrer' : ''}
              className="group relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/20"
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* تأثير الخلفية */}
              <div className={`absolute inset-0 ${item.bgColor} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
              
              {/* المحتوى */}
              <div className="relative p-6 text-center">
                {/* الأيقونة */}
                <div className={`inline-flex p-4 rounded-2xl ${item.bgColor} text-white shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className="w-8 h-8" />
                </div>

                {/* النص */}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  {item.value}
                </p>

                {/* تأثير hover */}
                <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 ${item.bgColor} group-hover:w-4/5 transition-all duration-500 rounded-t-full`}></div>
              </div>

              {/* تأثير إضافي */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/20 rounded-3xl transition-all duration-300"></div>
            </motion.a>
          ))}
        </motion.div>

        {/* معلومات إضافية */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/20 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t("contact.availability")}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">
              {t("contact.availabilityText")}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                {t("contact.responseTime")}
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                {t("contact.supportHours")}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
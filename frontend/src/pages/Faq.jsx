import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import useSettingStore from '../stores/useSettingStore';
import { motion } from 'framer-motion';

function Faq() {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(null);
  const { deliverySettings } = useSettingStore();

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqItems = [
    { question: t("faq.q1"), answer: t("faq.a1") },
    { question: t("faq.q2"), answer: t("faq.a2") },
    { question: t("faq.q3"), answer: t("faq.a3") },
    { question: t("faq.q4"), answer: t("faq.a4") },
    {
      question: t("faq.q5"),
      answerComponent: (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <table className="min-w-full text-right text-gray-600 dark:text-gray-300 text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="border border-gray-200 dark:border-gray-600 px-4 py-3 font-semibold">
                  {t("faq.state")}
                </th>
                <th className="border border-gray-200 dark:border-gray-600 px-4 py-3 font-semibold">
                  {t("faq.officePrice")}
                </th>
                <th className="border border-gray-200 dark:border-gray-600 px-4 py-3 font-semibold">
                  {t("faq.homePrice")}
                </th>
                <th className="border border-gray-200 dark:border-gray-600 px-4 py-3 font-semibold">
                  {t("faq.deliveryDays")}
                </th>
              </tr>
            </thead>
            <tbody>
              {deliverySettings.map((d, index) => (
                <motion.tr 
                  key={d._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 font-medium">
                    {d.state}
                  </td>
                  <td className="border border-gray-200 dark:border-gray-600 px-4 py-3">
                    {d.officePrice} {t("revenueUnit")}
                  </td>
                  <td className="border border-gray-200 dark:border-gray-600 px-4 py-3">
                    {d.homePrice} {t("revenueUnit")}
                  </td>
                  <td className="border border-gray-200 dark:border-gray-600 px-4 py-3">
                    {d.deliveryDays === 1 ? t("day") : d.deliveryDays === 2 ? t("twoDays") : `${d.deliveryDays} ${t("days")}`}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      ),
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 py-12 px-4 sm:px-6 lg:px-8 pt-24">
      <div className="max-w-4xl mx-auto">
        {/* العنوان الرئيسي */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-md opacity-75"></div>
              <div className="relative bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg">
                <HelpCircle className="w-12 h-12 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 dark:from-white dark:to-blue-400 bg-clip-text text-transparent mb-4">
            {t("faq.title")}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {t("faq.subtitle")}
          </p>
        </motion.div>

        {/* الأسئلة الشائعة */}
        <motion.div
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {faqItems.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              <motion.button
                className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                onClick={() => toggleAccordion(index)}
                whileHover={{ scale: 1.005 }}
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-4">
                  {item.question}
                </h3>
                <div className="flex-shrink-0">
                  {activeIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-blue-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </motion.button>
              
              <motion.div
                initial={false}
                animate={{ 
                  height: activeIndex === index ? 'auto' : 0,
                  opacity: activeIndex === index ? 1 : 0
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-5 pt-2">
                  {item.answerComponent ? (
                    item.answerComponent
                  ) : (
                    <p className="leading-relaxed whitespace-pre-line text-gray-600 dark:text-gray-300 text-lg">
                      {item.answer}
                    </p>
                  )}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* قسم المساعدة */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-8 text-center text-white shadow-2xl"
        >
          <div className="max-w-2xl mx-auto">
            <MessageCircle className="w-16 h-16 mx-auto mb-4 text-white opacity-90" />
            <h3 className="text-2xl sm:text-3xl font-bold mb-4">
              {t("faq.needHelp")}
            </h3>
            <p className="text-blue-100 text-lg mb-6 leading-relaxed">
              {t("faq.contactText")}
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <MessageCircle className="w-5 h-5" />
                {t("faq.contactButton")}
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Faq;
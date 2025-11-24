import React from 'react';
import { FileText, Shield, Globe, ShoppingBag, Scale } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

function Terms() {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

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

    const sections = [
        {
            icon: ShoppingBag,
            title: "terms.introduction.title",
            content: "terms.introduction.content"
        },
        {
            icon: Globe,
            title: "terms.siteUsage.title",
            content: "terms.siteUsage.content"
        },
        {
            icon: Scale,
            title: "terms.ordersPricing.title",
            content: "terms.ordersPricing.content",
            isList: true
        },
        {
            icon: Shield,
            title: "terms.trademarks.title",
            content: "terms.trademarks.content"
        },
        {
            icon: FileText,
            title: "terms.jurisdiction.title",
            content: "terms.jurisdiction.content"
        }
    ];

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
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-md opacity-75"></div>
                            <div className="relative bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg">
                                <FileText className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 dark:from-white dark:to-blue-400 bg-clip-text text-transparent mb-4">
                        {t("terms.title")}
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        {t("terms.subtitle")}
                    </p>
                </motion.div>

                {/* محتوى شروط الاستخدام */}
                <motion.div 
                    className="space-y-8"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {sections.map((section, index) => (
                        <motion.div
                            key={section.title}
                            variants={itemVariants}
                            className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700"
                        >
                            <div className="p-8">
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                                        <section.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white pt-1">
                                        {t(section.title)}
                                    </h2>
                                </div>
                                
                                <div className="space-y-4 leading-relaxed text-gray-600 dark:text-gray-300 text-lg">
                                    {section.isList ? (
                                        t(section.content, { returnObjects: true }).map((paragraph, idx) => (
                                            <motion.p 
                                                key={idx}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.5, delay: index * 0.1 + idx * 0.1 }}
                                                className="flex items-start gap-3"
                                            >
                                                <span className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></span>
                                                <span>{paragraph}</span>
                                            </motion.p>
                                        ))
                                    ) : (
                                        <motion.p
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.5, delay: index * 0.1 }}
                                        >
                                            {t(section.content)}
                                        </motion.p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* ملاحظة ختامية */}
                <motion.div 
                    className="mt-12 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                >
                    <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 px-6 py-4 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <p className="text-gray-700 dark:text-gray-300 font-semibold">
                            {t("terms.lastUpdated")}
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default Terms;
import React from 'react';
import { ShieldCheck, Lock, Eye, UserCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

function Confidentiality() {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    const sections = [
        {
            icon: UserCheck,
            title: "privacy.introduction.title",
            content: "privacy.introduction.content"
        },
        {
            icon: Eye,
            title: "privacy.dataCollection.title",
            content: "privacy.dataCollection.content"
        },
        {
            icon: Lock,
            title: "privacy.thirdParties.title",
            content: "privacy.thirdParties.content"
        }
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
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
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
                            <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-electric)] to-[var(--color-accent)] rounded-2xl blur-md opacity-75"></div>
                            <div className="relative bg-[var(--color-bg)] p-4 rounded-2xl shadow-lg border border-[var(--color-border)]">
                                <ShieldCheck className="w-12 h-12 text-[var(--color-electric)]" />
                            </div>
                        </div>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-[var(--color-text)] to-[var(--color-accent)] bg-clip-text text-transparent mb-4">
                        {t("privacy.title")}
                    </h1>
                    <p className="text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto leading-relaxed">
                        {t("privacy.subtitle")}
                    </p>
                </motion.div>

                {/* محتوى سياسة الخصوصية */}
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
                            className="bg-[var(--color-bg)] rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-[var(--color-border)]"
                        >
                            <div className="p-8">
                                <div className="flex items-start gap-6 mb-6">
                                    <div className="w-14 h-14 bg-gradient-to-r from-[var(--color-electric)] to-[var(--color-accent)] rounded-2xl flex items-center justify-center flex-shrink-0">
                                        <section.icon className="w-7 h-7 text-[var(--color-on-accent)]" />
                                    </div>
                                    <h2 className="text-2xl font-semibold text-[var(--color-text)] pt-1">
                                        {t(section.title)}
                                    </h2>
                                </div>
                                
                                <div className="space-y-4 leading-relaxed text-[var(--color-text-secondary)] text-lg">
                                    {t(section.content, { returnObjects: true }).map((paragraph, idx) => (
                                        <motion.p 
                                            key={idx}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.5, delay: index * 0.1 + idx * 0.1 }}
                                            className="flex items-start gap-3"
                                        >
                                            <span className="w-2 h-2 bg-[var(--color-accent)] rounded-full mt-3 flex-shrink-0"></span>
                                            <span>{paragraph}</span>
                                        </motion.p>
                                    ))}
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
                    <div className="inline-flex items-center gap-3 bg-[var(--color-bg)] px-6 py-4 rounded-2xl shadow-lg border border-[var(--color-border)]">
                        <div className="w-3 h-3 bg-[var(--color-accent)] rounded-full animate-pulse"></div>
                        <p className="text-[var(--color-text)] font-semibold">
                            {t("terms.lastUpdated")}
                        </p>
                    </div>
                </motion.div>

                {/* معلومات إضافية */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1 }}
                    className="mt-12 bg-gradient-to-r from-[var(--color-bg-gray)] to-emerald-50 dark:from-[var(--color-bg-gray)] dark:to-emerald-900/20 rounded-3xl p-8 border border-[var(--color-border)]"
                >
                    <h3 className="text-xl font-bold text-[var(--color-text)] mb-4 text-center">
                        {t("privacy.commitment")}
                    </h3>
                    <p className="text-[var(--color-text-secondary)] text-center leading-relaxed">
                        {t("privacy.commitmentText")}
                    </p>
                </motion.div>
            </div>
        </div>
    );
}

export default Confidentiality;
// src/components/sections/FAQ.tsx
"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const FAQ = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <section id="faq" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t("faq.title") || "FAQ"}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            {t("faq.birthdayMessage") || "🎉 Happy Nutty Birthday! 🎉\n\nLet’s make it EPIC! 🎂🥳 Send us a WhatsApp message, and we’ll share all our crazy fun birthday packages to give your little scientist a celebration to remember! 🎈🧪✨"}
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow">
            <h3 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-white">
              {t("faq.whatsappLabel") || "WhatsApp"}
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              {t("faq.whatsappNumber") || "011 56 72 72 12"}
            </p>
          </div>
          <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow">
            <h3 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-white">
              {t("faq.callLabel") || "Call"}
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              {t("faq.callNumber") || "011 45 33 22 88"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;

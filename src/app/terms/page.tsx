"use client";
import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FileText, Scale, Shield, AlertCircle } from 'lucide-react';

export default function TermsPage() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const sections = t('termsConditions.sections', { returnObjects: true }) as Record<string, { title: string; content: string }>;

  if (!mounted) return null;

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-gray-900 pt-32 pb-20 ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12 shadow-sm mb-8 border border-slate-100 dark:border-gray-700 relative overflow-hidden"
        >
          <Scale className="absolute -right-8 -top-8 w-64 h-64 text-slate-50 dark:text-gray-700/50 -z-0 rotate-12" />
          
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6">
              {t('termsConditions.title')}
            </h1>
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <AlertCircle className="w-5 h-5" />
              <p>
                {t('termsConditions.lastUpdated')}: {new Date('2025-01-04').toLocaleDateString(i18n.language === 'ar' ? 'ar-EG' : 'en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </motion.div>

        <div className="space-y-6">
          {Object.entries(sections).map(([key, section], index) => (
            <motion.section
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-gray-700"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 pb-2 border-b border-slate-100 dark:border-gray-700 flex items-center gap-3">
                <span className="w-2 h-8 bg-nutty-orange rounded-full hidden md:block"></span>
                {section.title}
              </h2>
              <div 
                className="prose prose-slate dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed faq-answer-content"
                dangerouslySetInnerHTML={{ __html: section.content }}
              />
            </motion.section>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-12 bg-nutty-cyan/10 dark:bg-nutty-cyan/5 rounded-3xl p-8 border-2 border-dashed border-nutty-cyan/30 text-center"
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            {isRTL ? 'هل لديك أي استفسار حول الشروط؟' : 'Have any questions about the terms?'}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {isRTL ? 'نحن نهتم بتوضيح كافة التفاصيل لضمان راحتكم.' : 'We care about clarifying all details to ensure your comfort.'}
          </p>
          <a 
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-nutty-cyan text-white rounded-2xl font-bold hover:bg-nutty-cyan-dark transition-all transform hover:-translate-y-1 shadow-lg shadow-nutty-cyan/20"
          >
            {t('contact')}
          </a>
        </motion.div>
      </div>
    </div>
  );
}
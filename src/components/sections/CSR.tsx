"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Heart, Globe, Users, Handshake, ArrowRight, Star, Target } from 'lucide-react';
import Link from 'next/link';

const CSR = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const [csrData, setCsrData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchCSR() {
      try {
        const res = await fetch(`/api/site-content?t=${Date.now()}`);
        if (res.ok) {
          const data = await res.json();
          if (data?.csr) {
            setCsrData(data.csr);
          }
        }
      } catch (err) {
        console.error("Error fetching CSR content:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCSR();
  }, []);

  const iconMap: Record<string, any> = {
    Globe, Heart, Users, Star, Target
  };

  const initiatives = csrData?.initiatives?.length > 0
    ? csrData.initiatives.map((item: any) => ({
        icon: iconMap[item.icon] || Globe,
        title: isRTL ? item.title_ar : item.title_en,
        description: isRTL ? item.description_ar : item.description_en,
        color: item.color || "text-blue-500",
        bg: item.bg || "bg-blue-50 dark:bg-blue-900/20"
      }))
    : [
    {
      icon: Globe,
      title: t("csr.initiative1Title"),
      description: t("csr.initiative1Desc"),
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      icon: Heart,
      title: t("csr.initiative2Title"),
      description: t("csr.initiative2Desc"),
      color: "text-green-500",
      bg: "bg-green-50 dark:bg-green-900/20"
    },
    {
      icon: Users,
      title: t("csr.initiative3Title"),
      description: t("csr.initiative3Desc"),
      color: "text-purple-500",
      bg: "bg-purple-50 dark:bg-purple-900/20"
    }
  ];

  if (loading) {
    return (
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-12 w-64 bg-gray-200 dark:bg-gray-800 mx-auto rounded-full" />
            <div className="h-20 w-3/4 bg-gray-200 dark:bg-gray-800 mx-auto rounded-2xl" />
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-64 bg-gray-100 dark:bg-gray-800 rounded-3xl" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="csr" className="py-24 bg-white dark:bg-gray-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-nutty-cyan/5 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-nutty-orange/5 rounded-full blur-3xl opacity-50" />

        <div className="text-center mb-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-nutty-cyan/10 text-nutty-cyan-dark dark:text-nutty-cyan mb-6"
          >
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm font-black uppercase tracking-wider">
              {(isRTL ? csrData?.title_ar : csrData?.title_en) || t("csr.title")}
            </span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-6 leading-tight"
          >
            {(isRTL ? csrData?.subtitle_ar : csrData?.subtitle_en) || t("csr.subtitle")}
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed font-bold"
          >
            {(isRTL ? csrData?.lead_ar : csrData?.lead_en) || t("csr.lead")}
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {initiatives.map((item: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 + 0.3 }}
              whileHover={{ y: -10 }}
              className={`${item.bg} p-8 rounded-3xl border border-transparent hover:border-nutty-cyan/20 transition-all duration-300 group shadow-sm hover:shadow-xl`}
            >
              <div className={`w-14 h-14 ${item.color} mb-6 transform group-hover:scale-110 transition-transform`}>
                <item.icon className="w-full h-full" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4 leading-snug">
                {item.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 font-bold leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-nutty-blue to-nutty-cyan-dark p-1 rounded-[2.5rem] relative group"
        >
          <div className="bg-white dark:bg-gray-800 rounded-[2.3rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-xl">
              <div className="flex items-center gap-3 text-nutty-blue dark:text-nutty-cyan mb-4">
                <Handshake className="w-8 h-8" />
                <h3 className="text-3xl font-black">
                  {(isRTL ? csrData?.partnership?.title_ar : csrData?.partnership?.title_en) || t("csr.partnershipTitle")}
                </h3>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-400 font-bold leading-relaxed">
                {(isRTL ? csrData?.partnership?.description_ar : csrData?.partnership?.description_en) || t("csr.partnershipDesc")}
              </p>
            </div>
            
            <Link
              href="#contact"
              className="inline-flex items-center gap-3 px-10 py-5 bg-nutty-blue hover:bg-nutty-cyan-dark text-white rounded-2xl font-black text-xl transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-nutty-blue/20 whitespace-nowrap group"
            >
              {(isRTL ? csrData?.partnership?.cta_ar : csrData?.partnership?.cta_en) || t("csr.cta")}
              <ArrowRight className={`w-6 h-6 transition-transform duration-300 ${isRTL ? "rotate-180 group-hover:-translate-x-2" : "group-hover:translate-x-2"}`} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CSR;

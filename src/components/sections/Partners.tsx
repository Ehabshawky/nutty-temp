"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/autoplay';

interface Partner {
  id: string;
  logo: string;
  name?: string;
}

interface PartnersData {
  global: Partner[];
  egypt: Partner[];
  schools: Partner[];
}

const Partners = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [data, setData] = useState<PartnersData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPartners() {
      try {
        const res = await fetch(`/api/site-content?t=${Date.now()}`);
        if (res.ok) {
          const siteData = await res.json();
          if (siteData.partners) {
            setData(siteData.partners);
          }
        }
      } catch (err) {
        console.error("Error fetching partners:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPartners();
  }, []);

  if (loading) return null; // Or a skeleton if preferred

  const LogoCarousel = ({ title, items, bgColor }: { title: string, items: Partner[], bgColor: string }) => {
    if (!items || items.length === 0) return null;

    return (
      <div className={`py-12 ${bgColor} overflow-hidden`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <motion.h3 
            initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white uppercase tracking-wider"
          >
            {title}
          </motion.h3>
          <div className="h-1.5 w-20 bg-nutty-orange mt-2 rounded-full" />
        </div>

        <Swiper
          modules={[Autoplay, FreeMode]}
          spaceBetween={20}
          slidesPerView={3}
          loop={items.length > 5}
          freeMode={true}
          speed={5000}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: { slidesPerView: 4 },
            768: { slidesPerView: 5 },
            1024: { slidesPerView: 7 },
          }}
          className="logo-swiper"
        >
          {items.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="h-20 flex items-center justify-center p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow group">
                <img 
                  src={item.logo} 
                  alt={item.name || "Partner Logo"} 
                  className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-110"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    );
  };

  return (
    <section id="partners" className="bg-white dark:bg-gray-950">
      <LogoCarousel 
        title={isRTL ? "شركاؤنا حول العالم" : "PARTNERS AROUND THE WORLD"} 
        items={data?.global || []} 
        bgColor="bg-gray-50/50 dark:bg-gray-900/20"
      />
      
      <LogoCarousel 
        title={isRTL ? "شركاء مصر" : "EGYPT PARTNERS"} 
        items={data?.egypt || []} 
        bgColor="bg-white dark:bg-gray-950"
      />

      <LogoCarousel 
        title={isRTL ? "بعض عملائنا من المدارس في مصر" : "SOME OF OUR SCHOOL CLIENTS in EGYPT"} 
        items={data?.schools || []} 
        bgColor="bg-nutty-lime/5 dark:bg-nutty-lime/5"
      />

      <style jsx global>{`
        .logo-swiper .swiper-wrapper {
          transition-timing-function: linear !important;
        }
      `}</style>
    </section>
  );
};

export default Partners;

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { motion } from "framer-motion";
import Services from "@/components/sections/Services";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function ServiceDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchService() {
      try {
        const res = await fetch("/api/services");
        if (res.ok) {
          const data = await res.json();
          const found = data.find((s: any) => s.id === id);
          if (found) {
            setService(found);
          }
        }
      } catch (err) {
        console.error("Error fetching service detail:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchService();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="text-xl text-gray-900 dark:text-white">
          {isRTL ? "جاري التحميل..." : "Loading..."}
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 pt-20">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {isRTL ? "الخدمة غير موجودة" : "Service Not Found"}
        </h2>
        <button 
          onClick={() => router.push("/services")}
          className="px-6 py-2 bg-nutty-blue text-white rounded-full"
        >
          {isRTL ? "العودة للخدمات" : "Back to Services"}
        </button>
      </div>
    );
  }

  const title = isRTL ? service.title_ar : service.title_en;
  const description = isRTL ? service.description_ar : service.description_en;
  const longDescription = isRTL ? service.long_description_ar : service.long_description_en;

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      {/* Hero-like Title Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-nutty-blue/10 to-purple-600/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button 
            onClick={() => router.back()}
            className="flex items-center text-nutty-blue dark:text-nutty-yellow font-semibold mb-8 hover:underline"
          >
            {isRTL ? <ArrowRight className="w-4 h-4 ml-2" /> : <ArrowLeft className="w-4 h-4 mr-2" />}
            {isRTL ? "العودة" : "Back"}
          </button>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                {title}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
                {description}
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800"
            >
              {service.image && (
                <Image
                  src={service.image}
                  alt={title}
                  fill
                  className="object-cover"
                />
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            {longDescription ? (
              <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                {longDescription}
              </div>
            ) : (
              <p className="text-gray-500 italic">
                {isRTL ? "لا يوجد وصف تفصيلي متاح حالياً." : "No detailed description available yet."}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Discover Other Services */}
      <div className="bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                {isRTL ? "اكتشف خدماتنا الأخرى" : "Discover Our Other Services"}
            </h2>
        </div>
        <Services />
      </div>
    </div>
  );
}

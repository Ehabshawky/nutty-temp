// src/app/services/[id]/ServiceDetailClient.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Calendar, Clock, Users, MapPin, ChevronRight, Award } from "lucide-react";
import { ServiceDetailSkeleton } from "@/components/skeletons/ServiceDetailSkeleton";

export default function ServiceDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [relatedServices, setRelatedServices] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    async function fetchData() {
      try {
        const [serviceRes, settingsRes] = await Promise.all([
          fetch(`/api/services/${id}`),
          fetch(`/api/site-content?t=${Date.now()}`)
        ]);

        if (serviceRes.ok) {
          const data = await serviceRes.json();
          setService(data);
          
          // جلب خدمات ذات صلة (نفس الفئة الرئيسية)
          const primaryCategory = data.category ? data.category.split(',')[0].trim() : 'families';
          const relatedRes = await fetch(`/api/services?category=${primaryCategory}&limit=4`);
          if (relatedRes.ok) {
            const relatedData = await relatedRes.json();
            // استبعاد الخدمة الحالية
            setRelatedServices(relatedData.filter((s: any) => s.id !== id));
          }
        }

        if (settingsRes.ok) {
          const data = await settingsRes.json();
          if (data.settings) setSettings(data.settings);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) {
    return <ServiceDetailSkeleton />;
  }

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 pt-20 px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {isRTL ? "البرنامج غير موجود" : "Program Not Found"}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
            {isRTL ? "عذراً، لم نتمكن من العثور على البرنامج المطلوب." : "Sorry, we couldn't find the requested program."}
          </p>
          <button 
            onClick={() => router.push("/services")}
            className="px-8 py-3 bg-nutty-blue text-white rounded-full font-semibold hover:bg-nutty-blue/90 transition-colors flex items-center gap-2"
          >
            {isRTL ? (
              <>
                <ArrowRight className="w-5 h-5" />
                العودة إلى البرامج
              </>
            ) : (
              <>
                <ArrowLeft className="w-5 h-5" />
                Back to Programs
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  const title = isRTL ? service.title_ar || service.title_en : service.title_en || service.title_ar;
  const description = isRTL ? service.description_ar || service.description_en : service.description_en || service.description_ar;
  const longDescription = isRTL ? service.long_description_ar || service.long_description_en : service.long_description_en || service.long_description_ar;

  // معلومات إضافية (يمكن تكوينها من قاعدة البيانات)
const serviceFeatures = [
  { 
    icon: Clock, 
    text: service.duration || (isRTL ? "٢-٣ ساعات" : "2-3 hours"), 
    label: isRTL ? "المدة" : "Duration" 
  },
  { 
    icon: Users, 
    text: service.participants_display || `${service.participants_min || 10}-${service.participants_max || 30}`, 
    label: isRTL ? "المشاركون" : "Participants" 
  },
  { 
    icon: Calendar, 
    text: isRTL ? (service.schedule_type_ar || "مرنة") : (service.schedule_type_en || "Flexible"), 
    label: isRTL ? "الجدول" : "Schedule" 
  },
  { 
    icon: MapPin, 
    text: isRTL ? (service.location_type_ar || "في الموقع / أونلاين") : (service.location_type_en || "On-site / Online"), 
    label: isRTL ? "الموقع" : "Location" 
  },
];

// يمكنك إضافة features إضافية إذا كانت موجودة
if (service.age_group) {
  serviceFeatures.push({
    icon: Calendar, // أو أيقونة مناسبة
    text: service.age_group,
    label: isRTL ? "الفئة العمرية" : "Age Group"
  });
}

if (service.price_range) {
  serviceFeatures.push({
    icon: Award, // أو أيقونة سعر
    text: service.price_range,
    label: isRTL ? "السعر" : "Price"
  });
}

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      {/* Hero Section */}
      <section className="pt-24 pb-12 md:pt-32 md:pb-16 bg-gradient-to-br from-nutty-blue/5 via-white to-purple-600/5 dark:from-gray-900 dark:via-gray-900 dark:to-purple-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button 
            onClick={() => router.back()}
            className="flex items-center text-nutty-blue dark:text-nutty-yellow font-semibold mb-8 hover:underline group"
          >
            {isRTL ? (
              <>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                {t("buttons.back") || "العودة"}
              </>
            ) : (
              <>
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                {t("buttons.back") || "Back"}
              </>
            )}
          </button>
          
          {/* Hero Content */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Category Badge */}
              {/* Category Badges */}
              <div className="flex flex-wrap gap-3 mb-6">
                {(service.category ? service.category.split(',') : ['families']).map((cat: string) => {
                  const category = cat.trim();
                  return (
                    <div key={category} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-800 dark:text-purple-300 font-medium">
                      <span className={`w-2 h-2 rounded-full ${
                        category === 'families' ? 'bg-purple-500' :
                        category === 'schools' ? 'bg-green-500' :
                        category === 'corporate' ? 'bg-blue-500' : 'bg-gray-500'
                      }`}></span>
                      {category === 'families' ? t("services.categories.families") :
                       category === 'schools' ? t("services.categories.schools") :
                       category === 'corporate' ? t("services.categories.corporate") : "General"}
                    </div>
                  );
                })}
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                {title}
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
                {description}
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => {
                    if (settings.phone) {
                       window.location.href = `tel:${settings.phone}`;
                    } else {
                        const contactSection = document.getElementById("contact");
                        if (contactSection) {
                          contactSection.scrollIntoView({ behavior: "smooth" });
                        } else {
                          router.push("/#contact");
                        }
                    }
                  }}
                  className="px-8 py-3 bg-nutty-blue text-white rounded-full font-semibold hover:bg-nutty-blue/90 transition-colors flex items-center gap-2"
                >
                  {t("bookNow") || "Book Now"}
                  <ChevronRight className="w-5 h-5" />
                </button>
                
                <button 
                  onClick={() => router.push("/services")}
                  className="px-8 py-3 border-2 border-nutty-blue text-nutty-blue rounded-full font-semibold hover:bg-nutty-blue/5 transition-colors"
                >
                  {t("services.viewAll") || "View All Programs"}
                </button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
                {service.image ? (
                  <Image
                    src={service.image}
                    alt={title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                    <div className="text-white text-6xl">
                      {service.icon === 'Beaker' && '🧪'}
                      {service.icon === 'FlaskRound' && '⚗️'}
                      {service.icon === 'Atom' && '⚛️'}
                      {service.icon === 'Rocket' && '🚀'}
                      {service.icon === 'Brain' && '🧠'}
                      {service.icon === 'Microscope' && '🔬'}
                      {service.icon === 'Target' && '🎯'}
                      {service.icon === 'Eye' && '👁️'}
                      {!service.icon && '🔬'}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-yellow-400/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-purple-400/20 rounded-full blur-xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {serviceFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-nutty-blue/10 to-purple-600/10 mb-4">
                  <feature.icon className="w-6 h-6 text-nutty-blue dark:text-nutty-yellow" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {feature.text}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {feature.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Description */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              {isRTL ? "تفاصيل البرنامج" : "Program Details"}
            </h2>
            
            {longDescription ? (
              <div className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed space-y-6">
                {longDescription.split('\n').map((paragraph: string, index: number) => (
                  paragraph.trim() && (
                    <p key={index} className="mb-4 last:mb-0">
                      {paragraph}
                    </p>
                  )
                ))}
              </div>
            ) : (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
                <p className="text-yellow-800 dark:text-yellow-300">
                  {isRTL 
                    ? "تفاصيل هذه الخدمة قيد التحديث. تواصل معنا لمعرفة المزيد." 
                    : "Detailed description for this service is being updated. Contact us to learn more."}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {isRTL ? "برامج ذات صلة" : "Related Programs"}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {isRTL ? "اكتشف برامج مشابهة قد تعجبك" : "Discover similar programs you might like"}
                </p>
              </div>
              <button 
                onClick={() => router.push("/services")}
                className="px-6 py-2 border border-nutty-blue text-nutty-blue rounded-full hover:bg-nutty-blue/5 transition-colors"
              >
                {isRTL ? "عرض الكل" : "View All"}
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedServices.slice(0, 4).map((related, index) => (
                <motion.div
                  key={related.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => router.push(`/services/${related.id}`)}
                  className="group cursor-pointer"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full">
                    <div className="relative h-48 overflow-hidden">
                      {related.image ? (
                        <Image
                          src={related.image}
                          alt={isRTL ? related.title_ar : related.title_en}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500"></div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-1">
                        {isRTL ? related.title_ar : related.title_en}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">
                        {isRTL ? related.description_ar : related.description_en}
                      </p>
                      <span className="inline-flex items-center text-nutty-blue dark:text-nutty-yellow font-medium text-sm">
                        {isRTL ? (
                          <>
                            اكتشف المزيد
                            <ArrowRight className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                          </>
                        ) : (
                          <>
                            Learn More
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-nutty-blue to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            {isRTL ? "جاهز للبدء؟" : "Ready to Get Started?"}
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            {isRTL 
              ? "احجز برنامجك اليوم واختبر متعة التعلم التفاعلي!" 
              : "Book your program today and experience the joy of interactive learning!"}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => router.push("/contact")}
              className="px-8 py-3 bg-white text-nutty-blue rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors transform hover:scale-105 shadow-lg"
            >
              {t("contact") || "Contact Us"}
            </button>
            <button 
              onClick={() => router.push("/services")}
              className="px-8 py-3 border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white/10 transition-colors"
            >
              {isRTL ? "اكتشف المزيد" : "Explore More"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
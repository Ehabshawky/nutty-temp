"use client";

import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Target, Eye, Heart, Users, Award, Sparkles } from "lucide-react";
import Partners from "@/components/sections/Partners";

export default function AboutPage() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadContent() {
      try {
        const res = await fetch("/api/site-content");
        if (res.ok) {
          const data = await res.json();
          setContent(data.about);
        }
      } catch (error) {
        console.error("Error loading content:", error);
      } finally {
        setLoading(false);
      }
    }
    loadContent();
  }, []);

  const values = [
    {
      icon: Sparkles,
      title: { en: "Innovation", ar: "الابتكار" },
      description: {
        en: "We bring creativity and innovation to science education",
        ar: "نقدم الإبداع والابتكار في تعليم العلوم"
      }
    },
    {
      icon: Users,
      title: { en: "Engagement", ar: "التفاعل" },
      description: {
        en: "Making science fun and accessible for all children",
        ar: "جعل العلوم ممتعة ومتاحة لجميع الأطفال"
      }
    },
    {
      icon: Heart,
      title: { en: "Passion", ar: "الشغف" },
      description: {
        en: "We're passionate about inspiring the next generation",
        ar: "نحن شغوفون بإلهام الجيل القادم"
      }
    },
    {
      icon: Award,
      title: { en: "Excellence", ar: "التميز" },
      description: {
        en: "Delivering high-quality educational experiences",
        ar: "تقديم تجارب تعليمية عالية الجودة"
      }
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">
          {isRTL ? "جاري التحميل..." : "Loading..."}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-nutty-orange to-yellow-500 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {isRTL ? content?.hero?.title_ar || "من نحن" : content?.hero?.title_en || "About Us"}
            </h1>
            <p className="text-xl md:text-2xl opacity-95">
              {isRTL ? content?.hero?.subtitle_ar : content?.hero?.subtitle_en}
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  {isRTL ? content?.story?.title_ar : content?.story?.title_en}
                </h2>
                <div className="space-y-4 text-gray-600 dark:text-gray-300 whitespace-pre-line">
                  {isRTL ? content?.story?.description_ar : content?.story?.description_en}
                </div>
              </div>
              <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl bg-black">
                {content?.story?.video ? (
                  <video
                    src={content.story.video}
                    controls
                    autoPlay
                    muted
                    loop
                    className="w-full h-full object-cover"
                  />
                ) : content?.story?.image ? (
                  <Image
                    src={content.story.image}
                    alt={isRTL ? content?.story?.title_ar : content?.story?.title_en}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-nutty-orange to-yellow-500 flex items-center justify-center">
                    <div className="text-white text-center p-8">
                      <Sparkles className="w-20 h-20 mx-auto mb-4" />
                      <p className="text-2xl font-bold">{isRTL ? "ناتي ساينتستس" : "Nutty Scientists"}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Mission */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                <div className="flex items-center mb-6">
                  <div className={`w-12 h-12 bg-nutty-orange rounded-lg flex items-center justify-center ${isRTL ? 'ml-4' : 'mr-4'}`}>
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {isRTL ? content?.mission?.title_ar : content?.mission?.title_en}
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {isRTL ? content?.mission?.description_ar : content?.mission?.description_en}
                </p>
              </div>

              {/* Vision */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                <div className="flex items-center mb-6">
                  <div className={`w-12 h-12 bg-nutty-blue rounded-lg flex items-center justify-center ${isRTL ? 'ml-4' : 'mr-4'}`}>
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {isRTL ? content?.vision?.title_ar : content?.vision?.title_en}
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {isRTL ? content?.vision?.description_ar : content?.vision?.description_en}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {isRTL ? "قيمنا" : "Our Values"}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {isRTL 
                  ? "المبادئ التي توجه عملنا وتلهم نجاحنا"
                  : "The principles that guide our work and inspire our success"}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <div 
                    key={index}
                    className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-nutty-orange to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {isRTL ? value.title.ar : value.title.en}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {isRTL ? value.description.ar : value.description.en}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-nutty-orange to-yellow-500">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">50+</div>
                <div className="text-lg opacity-90">
                  {isRTL ? "دولة" : "Countries"}
                </div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">20M+</div>
                <div className="text-lg opacity-90">
                  {isRTL ? "طفل" : "Children"}
                </div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">25+</div>
                <div className="text-lg opacity-90">
                  {isRTL ? "سنة" : "Years"}
                </div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">1000+</div>
                <div className="text-lg opacity-90">
                  {isRTL ? "برنامج" : "Programs"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              {isRTL ? "هل أنت جاهز لبدء المغامرة؟" : "Ready to Start the Adventure?"}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              {isRTL
                ? "انضم إلى ملايين الأطفال الذين يكتشفون متعة العلوم معنا"
                : "Join millions of children discovering the joy of science with us"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/#contact">
                <button className="w-full sm:w-auto px-8 py-3 bg-nutty-orange text-white rounded-lg font-semibold hover:bg-nutty-orange/90 transition-colors shadow-lg">
                  {isRTL ? "تواصل معنا" : "Contact Us"}
                </button>
              </Link>
              <Link href="/services">
                <button className="w-full sm:w-auto px-8 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                  {isRTL ? "استكشف برامجنا" : "Explore Our Programs"}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Partners />
    </div>
  );
}

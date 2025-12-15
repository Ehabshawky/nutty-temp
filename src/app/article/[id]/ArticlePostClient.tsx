"use client";

import React from "react";
// @ts-ignore
import { articles } from "@/data/articles";
import { useTranslation } from "react-i18next";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Calendar, User, Clock, ArrowLeft, ArrowRight, Share2, Bookmark } from "lucide-react";

const ArticlePostClient = () => {
  const params = useParams();
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const isArabic = i18n.language === "ar";

  const id = params?.id;
  const article = articles.find((a: any) => a.id.toString() === id);

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Article Not Found
          </h1>
          <button
            onClick={() => router.push("/")}
            className="text-nutty-blue hover:underline"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  // Localized content
  const title = isArabic ? article.title_ar : article.title_en;
  const content = isArabic ? article.excerpt_ar : article.excerpt_en;
  const author = isArabic ? article.author_ar : article.author_en;
  const date = isArabic ? article.date_ar : article.date_en;
  const readTime = isArabic ? article.readTime_ar : article.readTime_en;

  return (
    <article className="min-h-screen pt-24 pb-16 bg-white dark:bg-gray-900" dir={isArabic ? "rtl" : "ltr"}>
      {/* Scroll Progress Bar could go here */}
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
         {/* Navigation Bar */}
        <div className="flex justify-between items-center mb-10">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-nutty-blue transition-colors group"
          >
            {isArabic ? (
              <ArrowRight className="w-5 h-5 ml-2 group-hover:-translate-x-1 transition-transform" />
            ) : (
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            )}
            {isArabic ? "العودة" : "Back"}
          </button>

          <div className="flex items-center space-x-4 rtl:space-x-reverse">
             <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-nutty-blue transition-colors">
                 <Bookmark className="w-5 h-5" />
             </button>
             <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-nutty-blue transition-colors">
                 <Share2 className="w-5 h-5" />
             </button>
          </div>
        </div>

        {/* Header */}
        <header className="mb-10 text-center">
          <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse text-sm text-nutty-blue font-semibold tracking-wide uppercase mb-4">
              <span>{t(`articlesSection.categories.${article.category}`) || article.category}</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
            {title}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-6 text-gray-500 dark:text-gray-400 text-sm">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3 rtl:ml-3 rtl:mr-0">
                 <User className="w-5 h-5" />
              </div>
              <div className="text-left rtl:text-right">
                  <p className="text-gray-900 dark:text-white font-semibold">{author}</p>
                  <p className="text-xs">Author</p>
              </div>
            </div>
            <div className="hidden md:block w-px h-10 bg-gray-200 dark:bg-gray-800"></div>
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" />
              <span>{date}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" />
              <span>{readTime}</span>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-xl mb-12">
          <Image
            src={article.image}
            alt={title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Content Body */}
        <div className="prose prose-lg dark:prose-invert max-w-none mx-auto">
          <p className="lead text-2xl text-gray-600 dark:text-gray-300 mb-8">
            {content}
          </p>
          
          <p>
            {isArabic 
                ? "لوريم إيبسوم دولار سيت أميت، كونسيكتيتور أديبايسينغ إليت. نولام أكتور، نيسل سيد تينسيدونت ألتريشيس، نونك سابيان تينسيدونت ليغولا، إت ساجيتيس إيروس ماغنا فيل إيروس. سيد كوية، فيليس إت أولتريشيس تينسيدونت، سابيان إيروس بيبيندم نولاً، فيل فينيتيس جوستو ماغنا فيل نيسل."
                : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl sed tincidunt ultricies, nunc sapien tincidunt ligula, et sagittis eros magna vel eros. Sed quia, felis et ultricies tincidunt, sapien eros bibendum nulla, vel venenatis justo magna vel nisl."}
          </p>

           <h2 className="text-2xl font-bold mt-8 mb-4">
              {isArabic ? "نظرة متعمقة" : "In-Depth Analysis"}
           </h2>
           
           <p>
               {isArabic 
                ? "هذا نص عنصر نائب إضافي لمحاكاة مقال أطول. نحن ملتزمون بتقديم أفضل المحتوى التعليمي. استكشف المزيد من المقالات لمعرفة كيف نغير مستقبل العلوم."
                : "This is additional placeholder text to simulate a longer article. We are committed to providing the best educational content. Explore more articles to see how we are changing the future of science."}
           </p>

          <div className="bg-blue-50 dark:bg-blue-900/30 p-8 rounded-xl my-8">
             <h3 className="text-nutty-blue font-bold text-xl mb-2">{isArabic ? "نقاط رئيسية" : "Key Takeaways"}</h3>
             <ul className="list-disc list-inside space-y-2">
                 <li>{isArabic ? "النقطة المهمة الأولى حول الموضوع" : "First important point about the topic"}</li>
                 <li>{isArabic ? "رؤية بحثية رئيسية ثانية" : "Second key research insight"}</li>
                 <li>{isArabic ? "خاتمة عملية للقراء" : "Actionable conclusion for readers"}</li>
             </ul>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ArticlePostClient;

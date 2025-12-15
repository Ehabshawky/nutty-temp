"use client";

import React from "react";
// @ts-ignore
import { blogPosts } from "@/data/blogs";
import { useTranslation } from "react-i18next";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Calendar, User, Clock, ArrowLeft, ArrowRight } from "lucide-react";

const BlogPostClient = () => {
  const params = useParams();
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const isArabic = i18n.language === "ar";

  const id = params?.id;
  const post = blogPosts.find((p: any) => p.id.toString() === id);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Blog Post Not Found
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
  const title = isArabic ? post.title_ar : post.title_en;
  const content = isArabic ? post.excerpt_ar : post.excerpt_en; // Using excerpt as content for now
  const author = isArabic ? post.author_ar : post.author_en;
  const date = isArabic ? post.date_ar : post.date_en;
  const readTime = isArabic ? post.readTime_ar : post.readTime_en;

  return (
    <article className="min-h-screen pt-24 pb-16 bg-white dark:bg-gray-900" dir={isArabic ? "rtl" : "ltr"}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 dark:text-gray-400 hover:text-nutty-blue mb-8 transition-colors group"
        >
          {isArabic ? (
            <ArrowRight className="w-5 h-5 ml-2 group-hover:-translate-x-1 transition-transform" />
          ) : (
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          )}
          {isArabic ? "العودة" : "Back"}
        </button>

        {/* Header */}
        <header className="mb-10 text-center">
          <div className="flex items-center justify-center space-x-6 rtl:space-x-reverse text-sm text-gray-500 mb-6">
            <span className="px-3 py-1 bg-nutty-blue/10 text-nutty-blue rounded-full capitalize font-medium">
              {t(`blogsSection.categories.${post.category}`) || post.category}
            </span>
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
              {readTime}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            {title}
          </h1>
          <div className="flex items-center justify-center space-x-8 rtl:space-x-reverse text-gray-600 dark:text-gray-400">
            <div className="flex items-center">
              <User className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0 text-nutty-blue" />
              <span className="font-medium">{author}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0 text-nutty-blue" />
              <span>{date}</span>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="relative w-full h-64 md:h-96 rounded-3xl overflow-hidden shadow-2xl mb-12">
          <Image
            src={post.image}
            alt={title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Content Body */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8 font-serif">
            {content}
          </p>
          <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl border-l-4 border-nutty-blue my-8">
            <p className="italic text-gray-700 dark:text-gray-300 m-0">
              {isArabic 
                ? "هذا نص عنصر نائب للمقال الكامل. في التطبيق الحقيقي، سيكون هذا المحتوى قادمًا من CMS أو ملفات Markdown."
                : "This is a placeholder text for the full article content. In a real application, this would be populated with rich text content from a CMS or Markdown files."}
            </p>
          </div>
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
             {((isArabic ? post.tags_ar : post.tags_en) || []).map((tag: string, index: number) => (
              <span 
                key={index}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-nutty-blue hover:text-white transition-colors cursor-default"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogPostClient;

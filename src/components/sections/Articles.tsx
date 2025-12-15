"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Calendar, 
  User, 
  Clock, 
  Bookmark, 
  Share2,
  Eye,
  MessageCircle,
  TrendingUp,
  Filter
} from 'lucide-react';
import { useRouter } from 'next/navigation';

// Import articles from shared data
// @ts-ignore
import { articles as originalArticles } from '@/data/articles';

interface Article {
  id: string | number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  featured: boolean;
  trending: boolean;
  views: number;
  comments: number;
}

const Articles = () => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('all');
  const dir = i18n.language === 'ar' ? 'rtl' : 'ltr';

  const articles: Article[] = originalArticles.map((article: any) => ({
    ...article,
    title: i18n.language === 'ar' ? article.title_ar : article.title_en,
    excerpt: i18n.language === 'ar' ? article.excerpt_ar : article.excerpt_en,
    author: i18n.language === 'ar' ? article.author_ar : article.author_en,
    date: i18n.language === 'ar' ? article.date_ar : article.date_en,
    readTime: i18n.language === 'ar' ? article.readTime_ar : article.readTime_en,
  }));

  const categories = [
    { id: 'all', label: t('articlesSection.categories.all'), count: articles.length },
    { id: 'education', label: t('articlesSection.categories.education'), count: 1 },
    { id: 'technology', label: t('articlesSection.categories.technology'), count: 2 },
    { id: 'chemistry', label: t('articlesSection.categories.chemistry'), count: 1 },
    { id: 'environment', label: t('articlesSection.categories.environment'), count: 1 },
    { id: 'robotics', label: t('articlesSection.categories.robotics'), count: 1 },
    { id: 'psychology', label: t('articlesSection.categories.psychology'), count: 1 },
    { id: 'diversity', label: t('articlesSection.categories.diversity'), count: 1 }
  ];

  const filteredArticles = activeCategory === 'all' 
    ? articles 
    : articles.filter(article => article.category === activeCategory);

  const featuredArticles = articles.filter(article => article.featured);
  const trendingArticles = articles.filter(article => article.trending);

  return (
    <section id="articles" className="py-20 bg-gray-50 dark:bg-gray-900" dir={dir}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t("articlesSection.title")}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            {t("articlesSection.lead")}
          </p>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          <button className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-400">
            <Filter className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
            {t("articlesSection.filter")}
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-full transition-all ${
                activeCategory === category.id
                  ? 'bg-nutty-blue text-white'
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <span>{category.label}</span>
              <span className="ml-2 rtl:mr-2 rtl:ml-0 text-xs bg-white/20 px-2 py-1 rounded-full">
                {category.count}
              </span>
            </button>
          ))}
        </motion.div>

        {/* Featured Articles */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {featuredArticles.map((article, index) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group cursor-pointer"
              onClick={() => router.push(`/article/${article.id}`)}
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4">
                    <span className="px-3 py-1 bg-nutty-yellow text-gray-900 rounded-full text-sm font-semibold">
                      {t("articlesSection.featured")}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm capitalize">
                      {t(`articlesSection.categories.${article.category}`)}
                    </span>
                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                      <button className="text-gray-400 hover:text-nutty-blue transition-colors">
                        <Bookmark className="w-5 h-5" />
                      </button>
                      <button className="text-gray-400 hover:text-nutty-blue transition-colors">
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-nutty-blue transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {article.excerpt}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4 rtl:space-x-reverse text-sm text-gray-500">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1 rtl:ml-1 rtl:mr-0" />
                        {article.author}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1 rtl:ml-1 rtl:mr-0" />
                        {article.date}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1 rtl:ml-1 rtl:mr-0" />
                        {article.readTime}
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center space-x-6 rtl:space-x-reverse text-sm text-gray-500">
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                      {article.views.toLocaleString()} {t("articlesSection.views")}
                    </div>
                    <div className="flex items-center">
                      <MessageCircle className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                      {article.comments} {t("articlesSection.comments")}
                    </div>
                  </div>

                  {/* Read More */}
                  <button className="mt-6 text-nutty-blue font-semibold hover:text-blue-700 transition-colors flex items-center">
                    {t("articlesSection.readMore")} 
                    <span className="mx-1 rtl:rotate-180">→</span>
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Trending Section */}
        {trendingArticles.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="flex items-center mb-8">
              <TrendingUp className="w-6 h-6 text-nutty-yellow mr-3 rtl:ml-3 rtl:mr-0" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t("articlesSection.trending")}
              </h3>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {trendingArticles.map((article, index) => (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group cursor-pointer"
                  onClick={() => router.push(`/article/${article.id}`)}
                >
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                    <div className="flex items-center mb-4">
                      <TrendingUp className="w-4 h-4 text-nutty-yellow mr-2 rtl:ml-2 rtl:mr-0" />
                      <span className="text-sm font-semibold text-gray-500">{t("articlesSection.trendingLabel")}</span>
                    </div>
                    
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3 group-hover:text-nutty-blue transition-colors line-clamp-2">
                      {article.title}
                    </h4>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>{article.author}</span>
                      <span>{article.date}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm capitalize">
                        {t(`articlesSection.categories.${article.category}`)}
                      </span>
                      <button className="text-nutty-blue hover:text-blue-700 text-sm font-semibold">
                        {t("articlesSection.read")}
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.div>
        )}

        {/* All Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredArticles
            .filter(article => !article.featured)
            .map((article, index) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                className="group cursor-pointer"
                onClick={() => router.push(`/article/${article.id}`)}
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                  {/* Image */}
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm capitalize">
                        {t(`articlesSection.categories.${article.category}`)}
                      </span>
                      <button className="text-gray-400 hover:text-nutty-blue">
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>

                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-nutty-blue transition-colors line-clamp-2">
                      {article.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                      {article.excerpt}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1 rtl:ml-1 rtl:mr-0" />
                        {article.date}
                      </div>
                      <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <span className="flex items-center">
                          <Eye className="w-3 h-3 mr-1 rtl:ml-1 rtl:mr-0" />
                          {Math.floor(article.views / 1000)}k
                        </span>
                        <span className="flex items-center">
                          <MessageCircle className="w-3 h-3 mr-1 rtl:ml-1 rtl:mr-0" />
                          {article.comments}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
        </div>

        {/* Newsletter CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-nutty-blue to-purple-600 rounded-2xl p-8 md:p-12">
            <h3 className="text-3xl font-bold text-white mb-4">
              {t("articlesSection.newsletter.title")}
            </h3>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              {t("articlesSection.newsletter.desc")}
            </p>
            <div className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder={t("articlesSection.newsletter.placeholder")}
                  className="flex-1 px-6 py-3 rounded-full bg-white/20 backdrop-blur-sm text-white placeholder-blue-200 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button className="px-8 py-3 bg-white text-nutty-blue rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors transform hover:scale-105">
                  {t("articlesSection.newsletter.button")}
                </button>
              </div>
              <p className="text-sm text-blue-200 mt-4">
                {t("articlesSection.newsletter.note")}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Articles;
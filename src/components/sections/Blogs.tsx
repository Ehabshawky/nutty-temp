'use client'

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Calendar, 
  User, 
  Tag, 
  Clock,
  Eye,
  MessageCircle,
  Search,
  TrendingUp,
  BookOpen
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Skeleton } from "@/components/ui/Skeleton";
import { BlogCardSkeleton } from "@/components/skeletons/BlogCardSkeleton";
import { FeaturedBlogSkeleton } from "@/components/skeletons/FeaturedBlogSkeleton";

interface BlogPost {
  id: string | number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  featured: boolean;
  views: number;
  comments: number;
  tags: string[];
}

const Blogs = () => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [blogsData, setBlogsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [subscribeMsg, setSubscribeMsg] = useState('');
  
  const dir = i18n.language === 'ar' ? 'rtl' : 'ltr';

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscribeEmail) return;
    
    setSubscribing(true);
    setSubscribeMsg('');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: subscribeEmail })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setSubscribeMsg(i18n.language === 'ar' ? 'تم الاشتراك بنجاح!' : 'Subscribed successfully!');
        setSubscribeEmail('');
      } else {
        setSubscribeMsg(data.message || data.error || 'Error subscribing');
      }
    } catch (err) {
      setSubscribeMsg('Error connecting to server');
    } finally {
      setSubscribing(false);
    }
  };

  React.useEffect(() => {
    fetch('/api/blogs')
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data)) setBlogsData(data);
            setLoading(false);
        })
        .catch(err => {
            console.error(err);
            setLoading(false);
        });
  }, []);

  const blogPosts: BlogPost[] = blogsData.map((post: any) => ({
    ...post,
    title: i18n.language === 'ar' ? post.title_ar : post.title_en,
    excerpt: i18n.language === 'ar' ? post.excerpt_ar : post.excerpt_en,
    author: i18n.language === 'ar' ? post.author_ar : post.author_en,
    date: new Date(post.created_at).toLocaleDateString(), 
    readTime: i18n.language === 'ar' ? post.read_time_ar : post.read_time_en,
    tags: i18n.language === 'ar' ? post.tags_ar : post.tags_en,
    comments: post.comments_count || 0
  }));

  // Calculate category counts
  const categoryCounts = blogPosts.reduce((acc: any, blog: BlogPost) => {
    acc[blog.category] = (acc[blog.category] || 0) + 1;
    return acc;
  }, {});

  const categories = [
    { id: 'all', label: t('blogsSection.categories.all'), count: blogPosts.length },
    ...Object.keys(categoryCounts).map(cat => ({
      id: cat,
      label: t(`blogsSection.categories.${cat}`) || cat,
      count: categoryCounts[cat]
    }))
  ];

  const popularTags = i18n.language === 'ar' 
    ? ['STEM', 'تجارب', 'اصنعها بنفسك', 'تعلم', 'تعليم', 'علوم ممتعة', 'أنشطة أطفال', 'ابتكار', 'تكنولوجيا', 'اكتشاف']
    : ['STEM', 'Experiments', 'DIY', 'Learning', 'Education', 'Science Fun', 'Kids Activities', 'Innovation', 'Technology', 'Discovery'];

  const filteredBlogs = blogPosts.filter(blog => {
    const matchesCategory = activeCategory === 'all' || blog.category === activeCategory;
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredBlogs = blogPosts.filter(blog => blog.featured);
  const recentPosts = [...blogPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3);

  if (loading) {
    return (
      <section id="blogs" className="py-20 bg-gray-50 dark:bg-gray-900" dir={dir}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Skeleton */}
          <div className="text-center mb-16 space-y-4">
            <Skeleton className="h-10 w-48 mx-auto rounded-lg" />
            <Skeleton className="h-6 w-96 mx-auto rounded-lg" />
          </div>

          {/* Search Skeleton */}
          <div className="max-w-2xl mx-auto mb-16">
            <Skeleton className="h-14 w-full rounded-full" />
          </div>

          {/* Featured Skeleton */}
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            <FeaturedBlogSkeleton />
            <FeaturedBlogSkeleton />
          </div>

          {/* Grid Skeleton */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {[...Array(6)].map((_, i) => (
              <BlogCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="blogs" className="py-20 bg-gray-50 dark:bg-gray-900" dir={dir}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t("blogsSection.title")}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            {t("blogsSection.lead")}
          </p>
        </motion.div>

        {/* Search and Filter */}
        <div className="mb-12">
          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto mb-8"
          >
            <div className="relative">
              <Search className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t("blogsSection.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 rtl:pr-12 rtl:pl-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full focus:ring-2 focus:ring-nutty-cyan focus:border-transparent"
              />
            </div>
          </motion.div>

          {/* Category Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-3 mb-6"
          >
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full transition-all ${
                  activeCategory === category.id
                    ? 'bg-nutty-cyan text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <span>{category.label}</span>
                <span className="ml-2 rtl:mr-2 rtl:ml-0 text-xs bg-white/20 px-2 py-1 rounded-full">
                  {category.count}
                </span>
              </button>
            ))}
          </motion.div>

          {/* Popular Tags */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="flex flex-wrap justify-center gap-2">
              {popularTags.map((tag, index) => (
                <button
                  key={index}
                  onClick={() => setSearchTerm(tag)}
                  className="px-3 py-1 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-nutty-cyan hover:text-white transition-colors"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Featured Blogs */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {featuredBlogs.map((blog, index) => (
            <motion.article
              key={blog.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onClick={() => router.push(`/blog/${blog.id}`)}
              className="group cursor-pointer"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                {/* Image */}
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4">
                    <span className="px-3 py-1 bg-nutty-lime text-gray-900 rounded-full text-sm font-semibold">
                      {t("articlesSection.featured")}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm capitalize">
                      {t(`blogsSection.categories.${blog.category}`)}
                    </span>
                    <div className="flex items-center space-x-4 rtl:space-x-reverse text-sm text-gray-500">
                      <span className="flex items-center">
                        <Eye className="w-4 h-4 mr-1 rtl:ml-1 rtl:mr-0" />
                        {blog.views.toLocaleString()}
                      </span>
                      <span className="flex items-center">
                        <MessageCircle className="w-4 h-4 mr-1 rtl:ml-1 rtl:mr-0" />
                        {blog.comments}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-nutty-cyan transition-colors">
                    {blog.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {blog.excerpt}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4 rtl:space-x-reverse text-sm text-gray-500">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1 rtl:ml-1 rtl:mr-0" />
                        {blog.author}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1 rtl:ml-1 rtl:mr-0" />
                        {blog.date}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1 rtl:ml-1 rtl:mr-0" />
                        {blog.readTime}
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {blog.tags.map((tag: string, i: number) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
        
        {/* All Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredBlogs
            .filter(blog => !blog.featured)
            .map((blog, index) => (
              <motion.article
                key={blog.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                onClick={() => router.push(`/blog/${blog.id}`)}
                whileHover={{ y: -5 }}
                className="group cursor-pointer"
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                  {/* Image */}
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm capitalize">
                        {t(`blogsSection.categories.${blog.category}`)}
                      </span>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-gray-500">
                        <span className="flex items-center">
                          <Eye className="w-3 h-3 mr-1 rtl:ml-1 rtl:mr-0" />
                          {Math.floor(blog.views / 1000)}k
                        </span>
                      </div>
                    </div>

                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-nutty-cyan transition-colors line-clamp-2">
                      {blog.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                      {blog.excerpt}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1 rtl:ml-1 rtl:mr-0" />
                        {blog.date}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1 rtl:ml-1 rtl:mr-0" />
                        {blog.readTime}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
        </div>

        {/* Newsletter Subscription */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-nutty-cyan to-nutty-cyan-dark rounded-2xl p-8 md:p-12">
            <BookOpen className="w-16 h-16 mx-auto mb-6 text-white" />
            <h3 className="text-3xl font-bold text-white mb-4">
              {t("blogsSection.newsletter.title")}
            </h3>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              {t("blogsSection.newsletter.desc")}
            </p>
            <div className="max-w-md mx-auto">
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder={t("articlesSection.newsletter.placeholder")}
                  className="flex-1 px-6 py-3 rounded-full bg-white/20 backdrop-blur-sm text-white placeholder-blue-200 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white"
                  value={subscribeEmail}
                  onChange={(e) => setSubscribeEmail(e.target.value)}
                  required
                  disabled={subscribing}
                />
                <button 
                  type="submit" 
                  disabled={subscribing}
                  className="px-8 py-3 bg-white text-nutty-cyan rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors transform hover:scale-105 disabled:opacity-75"
                >
                  {subscribing ? "..." : t("articlesSection.newsletter.button")}
                </button>
              </form>
              {subscribeMsg && (
                <p className={`text-sm mt-4 font-semibold ${subscribeMsg.includes('Error') ? 'text-red-200' : 'text-green-200'}`}>
                  {subscribeMsg}
                </p>
              )}
              <p className="text-sm text-blue-200 mt-4">
                {t("blogsSection.newsletter.note")}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Blogs;

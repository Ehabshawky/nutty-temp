"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import AdminLayout from "@/components/admin/AdminLayout";
import Link from "next/link";
import {
  Image,
  FileText,
  Users,
  MessageSquare,
  Settings,
  ArrowRight,
  Briefcase,
  PenTool,
  Clock,
  AlertCircle
} from "lucide-react";

interface DashboardStats {
  programs: number;
  team: number;
  testimonials: number;
  pendingTestimonials: number;
  jobs: number;
  blogs: number;
  messages: number;
  unreadMessages: number;
}

export default function AdminPage() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [stats, setStats] = useState<DashboardStats>({ 
    programs: 0, 
    team: 0, 
    testimonials: 0,
    pendingTestimonials: 0,
    jobs: 0,
    blogs: 0,
    messages: 0,
    unreadMessages: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/admin/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 animate-in fade-in duration-500">
          <div className="mb-10 space-y-2">
            <div className="h-12 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
            <div className="h-6 w-96 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 h-32 animate-pulse">
                <div className="flex justify-between mb-4">
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700" />
                </div>
                <div className="h-10 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="h-8 w-40 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 h-48 animate-pulse">
                  <div className="flex justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gray-200 dark:bg-gray-700" />
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />
                  </div>
                  <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                  <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const sections = [
    {
      id: "hero",
      title: isRTL ? "شرائح البطل" : "Hero Slides",
      description: isRTL ? "إدارة شرائح الصفحة الرئيسية" : "Manage homepage slideshow",
      icon: Image,
      href: "/admin/hero",
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "about",
      title: isRTL ? "من نحن" : "About Us",
      description: isRTL ? "تحرير صفحة من نحن" : "Edit About page content",
      icon: FileText,
      href: "/admin/about",
      color: "from-indigo-500 to-purple-500",
    },
    {
      id: "content",
      title: isRTL ? "المحتوى" : "Content",
      description: isRTL ? "تحرير محتوى الموقع" : "Edit website content",
      icon: FileText,
      href: "/admin/content",
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "team",
      title: isRTL ? "الفريق" : "Team",
      description: isRTL ? "إدارة أعضاء الفريق" : "Manage team members",
      icon: Users,
      href: "/admin/team",
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "careers",
      title: isRTL ? "الوظائف" : "Careers",
      description: isRTL ? "إدارة الوظائف وفرص العمل" : "Manage job listings",
      icon: Briefcase,
      href: "/admin/careers",
      color: "from-yellow-500 to-orange-500",
    },
    {
      id: "blogs",
      title: isRTL ? "المدونة" : "Blog",
      description: isRTL ? "إدارة المقالات والأخبار" : "Manage blog posts",
      icon: PenTool,
      href: "/admin/blogs",
      color: "from-pink-500 to-rose-500",
    },
    {
      id: "testimonials",
      title: isRTL ? "الشهادات" : "Testimonials",
      description: isRTL ? "إدارة آراء العملاء" : "Manage customer reviews",
      icon: MessageSquare,
      href: "/admin/testimonials",
      color: "from-orange-500 to-red-500",
    },
    {
      id: "settings",
      title: isRTL ? "الإعدادات" : "Settings",
      description: isRTL ? "إعدادات الموقع والإشعارات" : "Site & Notification settings",
      icon: Settings,
      href: "/admin/settings",
      color: "from-gray-500 to-slate-500",
    },
  ];

  const StatCard = ({ title, count, icon: Icon, color, subCount, subLabel }: any) => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 relative overflow-hidden group">
      <div className={`absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br ${color} opacity-10 rounded-full group-hover:scale-110 transition-transform`} />
      
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</p>
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} opacity-80 flex items-center justify-center text-white shadow-sm`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      
      <div className="flex items-end gap-2">
        <h3 className="text-4xl font-black text-gray-900 dark:text-white">{loading ? "-" : count}</h3>
        {subCount > 0 && (
          <span className="mb-1 text-xs font-bold text-red-500 bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded-full flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {subCount} {subLabel}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8" dir={isRTL ? "rtl" : "ltr"}>
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">
            {isRTL ? "لوحة التحكم" : "Dashboard"}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            {isRTL 
              ? "نظرة عامة على أداء موقعك ومحتواه" 
              : "Overview of your website performance and content"}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard 
            title={isRTL ? "البرامج" : "Programs"} 
            count={stats.programs} 
            icon={FileText} 
            color="from-blue-500 to-cyan-500" 
          />
          <StatCard 
            title={isRTL ? "الوظائف النشطة" : "Active Jobs"} 
            count={stats.jobs} 
            icon={Briefcase} 
            color="from-yellow-500 to-orange-500" 
          />
          <StatCard 
            title={isRTL ? "أعضاء الفريق" : "Team Members"} 
            count={stats.team} 
            icon={Users} 
            color="from-green-500 to-emerald-500" 
          />
           <StatCard 
            title={isRTL ? "المدونة" : "Blog Posts"} 
            count={stats.blogs} 
            icon={PenTool} 
            color="from-pink-500 to-rose-500" 
          />
          <StatCard 
            title={isRTL ? "الرسائل" : "Messages"} 
            count={stats.messages} 
            subCount={stats.unreadMessages}
            subLabel={isRTL ? "جديد" : "New"}
            icon={MessageSquare} 
            color="from-purple-500 to-violet-500" 
          />
          <StatCard 
            title={isRTL ? "الشهادات" : "Testimonials"} 
            count={stats.testimonials} 
            subCount={stats.pendingTestimonials}
            subLabel={isRTL ? "قيد الانتظار" : "Pending"}
            icon={MessageSquare} 
            color="from-orange-500 to-red-500" 
          />
        </div>

        {/* Management Sections */}
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Settings className="w-6 h-6 text-nutty-orange" />
            {isRTL ? "الوصول السريع" : "Quick Access"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <Link
                  key={section.id}
                  href={section.href}
                  className="block group h-full"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 dark:border-gray-700 hover:border-nutty-blue h-full flex flex-col relative overflow-hidden">
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${section.color} opacity-5 -mr-10 -mt-10 rounded-full group-hover:scale-150 transition-transform duration-500`} />
                    
                    <div className="flex items-start justify-between mb-4 relative z-10">
                      <div className={`w-14 h-14 bg-gradient-to-br ${section.color} rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded-full group-hover:bg-nutty-blue group-hover:text-white transition-colors">
                        <ArrowRight className={`w-5 h-5 text-gray-400 group-hover:text-white transition-colors ${isRTL ? 'rotate-180' : ''}`} />
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-nutty-blue transition-colors">
                      {section.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                      {section.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

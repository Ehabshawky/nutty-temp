"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import AdminLayout from "@/components/admin/AdminLayout";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Image,
  FileText,
  Users,
  MessageSquare,
  Settings,
  LayoutDashboard,
  ArrowRight,
  Globe,
} from "lucide-react";

export default function AdminPage() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

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
      description: isRTL ? "إعدادات الموقع" : "Site settings",
      icon: Settings,
      href: "/admin/settings",
      color: "from-gray-500 to-slate-500",
    },
  ];

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {isRTL ? "مرحباً في لوحة التحكم" : "Welcome to Dashboard"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isRTL 
              ? "قم بإدارة محتوى موقعك من هنا" 
              : "Manage your website content from here"}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isRTL ? "إجمالي الصفحات" : "Total Pages"}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  12
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isRTL ? "أعضاء الفريق" : "Team Members"}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  8
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isRTL ? "الشهادات" : "Testimonials"}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  15
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Management Sections */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            {isRTL ? "إدارة المحتوى" : "Content Management"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <Link
                  key={section.id}
                  href={section.href}
                  className="block group"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-200 p-6 border-2 border-transparent hover:border-nutty-orange">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${section.color} rounded-lg flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <ArrowRight className={`w-5 h-5 text-gray-400 group-hover:text-nutty-orange transition-colors ${isRTL ? 'rotate-180' : ''}`} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {section.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {section.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-gradient-to-r from-nutty-orange to-yellow-500 rounded-lg shadow-md p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">
                {isRTL ? "هل تحتاج مساعدة؟" : "Need Help?"}
              </h3>
              <p className="text-sm opacity-90">
                {isRTL 
                  ? "تحقق من الدليل أو اتصل بالدعم" 
                  : "Check out the guide or contact support"}
              </p>
            </div>
            <button className="px-6 py-2 bg-white text-nutty-orange rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              {isRTL ? "المساعدة" : "Get Help"}
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

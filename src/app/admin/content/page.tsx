"use client";

import React from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { 
  LayoutDashboard,
  ImageIcon,
  FileText,
  Target,
  Users,
  MessageSquare,
  Briefcase,
  HelpCircle,
  Handshake
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { AdminGridSkeleton } from "@/components/skeletons/AdminGridSkeleton";
import { useState, useEffect } from "react";


export default function AdminContent() {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const contentSections = [
    { 
      title: isRTL ? 'القسم الرئيسي' : 'Hero Section', 
      desc: isRTL ? 'إدارة الشرائح والصور الرئيسية' : 'Manage main slides and hero images',
      icon: ImageIcon,
      href: '/admin/hero',
      color: 'bg-blue-500'
    },
    { 
      title: isRTL ? 'من نحن' : 'About Us', 
      desc: isRTL ? 'إدارة قصة الشركة والرؤية' : 'Manage company story and vision',
      icon: FileText,
      href: '/admin/about',
      color: 'bg-green-500'
    },
    { 
      title: isRTL ? 'الخدمات' : 'Services', 
      desc: isRTL ? 'إدارة قائمة الخدمات' : 'Manage services list',
      icon: Briefcase,
      href: '/admin/services',
      color: 'bg-purple-500'
    },
    { 
      title: isRTL ? 'المشاريع' : 'Projects', 
      desc: isRTL ? 'إدارة معرض المشاريع' : 'Manage projects portfolio',
      icon: Target,
      href: '/admin/projects',
      color: 'bg-orange-500'
    },
    { 
      title: isRTL ? 'الفريق' : 'Team Members', 
      desc: isRTL ? 'إدارة أعضاء الفريق' : 'Manage team members',
      icon: Users,
      href: '/admin/team',
      color: 'bg-indigo-500'
    },
    { 
      title: isRTL ? 'المقالات' : 'Articles', 
      desc: isRTL ? 'إدارة المقالات والأخبار' : 'Manage articles and news',
      icon: FileText,
      href: '/admin/articles',
      color: 'bg-pink-500'
    },
    { 
      title: isRTL ? 'المدونة' : 'Blogs', 
      desc: isRTL ? 'إدارة تدوينات الموقع' : 'Manage blog posts',
      icon: FileText,
      href: '/admin/blogs',
      color: 'bg-teal-500'
    },
    { 
      title: isRTL ? 'الشهادات' : 'Testimonials', 
      desc: isRTL ? 'إدارة آراء العملاء' : 'Manage customer testimonials',
      icon: MessageSquare,
      href: '/admin/testimonials',
      color: 'bg-yellow-500'
    },
    { 
      title: isRTL ? 'الأسئلة الشائعة' : 'FAQ', 
      desc: isRTL ? 'إدارة الأسئلة الشائعة للموقع' : 'Manage site frequently asked questions',
      icon: HelpCircle,
      href: '/admin/faq',
      color: 'bg-blue-400'
    },
    { 
      title: isRTL ? 'الشركاء والعملاء' : 'Partners & Clients', 
      desc: isRTL ? 'إدارة شركاء النجاح وعملاء المدارس' : 'Manage success partners and school clients',
      icon: Handshake,
      href: '/admin/partners',
      color: 'bg-nutty-orange'
    },
    { 
      title: isRTL ? 'الرد الآلي' : 'Chatbot', 
      desc: isRTL ? 'إدارة الأسئلة والردود الآلية' : 'Manage automated questions and responses',
      icon: MessageSquare,
      href: '/admin/chatbot',
      color: 'bg-nutty-blue'
    }
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8 py-20">
          <AdminGridSkeleton count={6} cardsPerRow={3} />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
            <LayoutDashboard className="w-8 h-8 text-nutty-blue" />
            {isRTL ? 'إدارة المحتوى' : 'Content Management'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isRTL ? 'اختر القسم الذي تريد تعديله' : 'Select a section to edit'}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contentSections.map((section, index) => {
            const Icon = section.icon;
            return (
              <Link 
                key={index} 
                href={section.href}
                className="group block bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${section.color} bg-opacity-10 text-opacity-100`}>
                    <Icon className={`w-6 h-6 ${section.color.replace('bg-', 'text-')}`} />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-nutty-blue transition-colors">
                  {section.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {section.desc}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
}

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  FileText,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  Globe,
  ImageIcon,
  Target,
  Briefcase,
  Mail,
  HelpCircle,
  Handshake
} from "lucide-react";

import { AdminLayoutSkeleton } from "../skeletons/AdminLayoutSkeleton";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { i18n } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [logoUrl, setLogoUrl] = useState("/Nutt Logo.png");
  const isRTL = i18n.language === "ar";

  // Check auth on mount
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }

    async function fetchSettings() {
      try {
        const res = await fetch("/api/site-content?t=" + Date.now());
        if (res.ok) {
          const data = await res.json();
          if (data.settings?.logo_url) {
            setLogoUrl(data.settings.logo_url);
          }
        }
      } catch (e) {
        console.error("Error fetching settings:", e);
      }
    }
    fetchSettings();
  }, [status, router]);

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/auth/login" });
  };

  if (status === "loading") {
    return <AdminLayoutSkeleton />;
  }

  if (!session) return null;

  const username = session?.user?.name || "Admin";

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", labelAr: "لوحة التحكم", href: "/admin" },
    { icon: FileText, label: "Content", labelAr: "المحتوى", href: "/admin/content" },
    { icon: ImageIcon, label: "Hero Slides", labelAr: "شرائح ", href: "/admin/hero" },
    { icon: FileText, label: "Programs", labelAr: "برامج", href: "/admin/services" },  
    { icon: FileText, label: "About", labelAr: "عننا", href: "/admin/about" },
    { icon: Target, label: "CSR", labelAr: "المسؤولية المجتمعية", href: "/admin/csr" },
    // { icon: Target, label: "Projects", labelAr: "المشاريع", href: "/admin/projects" },
    { icon: Users, label: "Team", labelAr: "الفريق", href: "/admin/team" },
    { icon: Briefcase, label: "Careers", labelAr: "الوظائف", href: "/admin/careers" },
    // { icon: FileText, label: "Articles", labelAr: "المقالات", href: "/admin/articles" },
    { icon: FileText, label: "Comments", labelAr: "التعليقات", href: "/admin/comments" },
    { icon: Mail, label: "Subscribers", labelAr: "المشتركين", href: "/admin/subscribers" },
    { icon: HelpCircle, label: "FAQ", labelAr: "الأسئلة الشائعة", href: "/admin/faq" },
    { icon: Handshake, label: "Partners", labelAr: "الشركاء", href: "/admin/partners" },
    { icon: MessageSquare, label: "Testimonials", labelAr: "الشهادات", href: "/admin/testimonials" },
    { icon: FileText, label: "Blogs", labelAr: "المدونة", href: "/admin/blogs" },
    { icon: FileText, label: "Chatbot", labelAr: "المحادثة", href: "/admin/chatbot" },
    { icon: FileText, label: "Messages", labelAr: "الرسائل", href: "/admin/messages" },
    { icon: Users, label: "Admins", labelAr: "المسؤولون", href: "/admin/users" },
    { icon: Settings, label: "Settings", labelAr: "الإعدادات", href: "/admin/settings" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir={isRTL ? "rtl" : "ltr"} suppressHydrationWarning>
      {/* Sidebar */}
      <aside
        className={`fixed ${isRTL ? 'right-0' : 'left-0'} h-screen bg-white dark:bg-gray-800 border-${isRTL ? 'l' : 'r'} border-gray-200 dark:border-gray-700 transition-all duration-300 z-50 shadow-sm flex flex-col ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        {/* Logo/Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className=" shadow-sm flex items-center justify-center">
                  <div className="relative w-10 h-10">
                    <Image
                      src={logoUrl}
                      alt="Nutty Scientists Logo"
                      fill
                      sizes="48px"
                      className="object-contain"
                    />
                  </div>
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {isRTL ? "لوحة التحكم" : "Admin Panel"}
              </span>
              
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            )}
          </button>
        </div>
        {/* Navigation */}
        <nav className="p-4 flex-1 overflow-y-auto bg-white dark:bg-gray-800 min-h-0">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              const label = isRTL ? item.labelAr : item.label;
              
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? "bg-nutty-orange text-white shadow-sm"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-sm"
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {sidebarOpen && (
                      <span className="font-medium">{label}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        {/* User Info & Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-6 pb-20 mt-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-nutty-orange to-nutty-lime shadow-sm flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {username}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {isRTL ? "مدير النظام" : "Administrator"}
                </p>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border border-red-200 dark:border-red-900/30"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && (
              <span className="font-medium">{isRTL ? "تسجيل الخروج" : "Logout"}</span>
            )}
          </button>
          
          {sidebarOpen && (
            <div className="mt-4 text-center text-xs">
              <p className="text-gray-600 dark:text-gray-400 font-medium">
                {isRTL ? "ناتي ساينتستس" : "Nutty Scientists"}
              </p>
              <p className="text-gray-500 dark:text-gray-500 text-[10px]">
                {isRTL ? "نظام إدارة المحتوى" : "CMS"}
              </p>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`transition-all duration-300 ${
          isRTL 
            ? (sidebarOpen ? "mr-64" : "mr-20")
            : (sidebarOpen ? "ml-64" : "ml-20")
        }`}
      >
        {/* Top Bar */}
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 flex items-center justify-between sticky top-0 z-40 shadow-sm">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {isRTL 
                ? (menuItems.find(item => item.href === pathname)?.labelAr || "لوحة التحكم")
                : (menuItems.find(item => item.href === pathname)?.label || "Admin")}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="px-4 py-2 text-sm bg-nutty-orange text-white rounded-lg hover:bg-nutty-orange/90 transition-colors flex items-center gap-2 shadow-sm"
            >
              <Globe className="w-4 h-4" />
              {isRTL ? "عرض الموقع" : "View Site"}
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 min-h-[calc(100vh-4rem)]">
          {children}
        </div>
      </main>
    </div>
  );
}

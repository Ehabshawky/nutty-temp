import React from "react";
import { Skeleton } from "../ui/Skeleton";
import { useTranslation } from "react-i18next";

export function AdminLayoutSkeleton() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex" dir={isRTL ? "rtl" : "ltr"}>
      {/* Sidebar Skeleton */}
      <aside className={`w-64 border-${isRTL ? 'l' : 'r'} border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col h-screen fixed top-0 ${isRTL ? 'right-0' : 'left-0'} z-50`}>
        {/* Header */}
        <div className="h-16 flex items-center px-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <Skeleton className="w-10 h-10 rounded-full" />
          <Skeleton className={`h-6 w-32 ${isRTL ? 'mr-2' : 'ml-2'}`} />
        </div>

        {/* Navigation */}
        <nav className="p-4 flex-1 space-y-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3">
              <Skeleton className="w-5 h-5 rounded" />
              <Skeleton className="h-4 w-24 rounded" />
            </div>
          ))}
        </nav>

        {/* User Info & Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-6 pb-20">
          <div className="flex items-center gap-3 mb-6">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <Skeleton className="h-12 w-full rounded-lg" />
          <div className="mt-4 flex flex-col items-center gap-2">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-2 w-12" />
          </div>
        </div>
      </aside>

      {/* Main Content Skeleton */}
      <main className={`flex-1 ${isRTL ? 'mr-64' : 'ml-64'} min-h-screen`}>
        {/* Top Bar */}
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 flex items-center justify-between sticky top-0 z-40">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-10 w-28 rounded-lg" />
        </header>

        {/* Page Content */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
          <Skeleton className="h-96 w-full rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        </div>
      </main>
    </div>
  );
}

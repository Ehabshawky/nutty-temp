import React from "react";
import { Skeleton } from "../ui/Skeleton";

export function AdminGridSkeleton({ count = 6, cardsPerRow = 3 }: { count?: number; cardsPerRow?: number }) {
  const gridCols = cardsPerRow === 2 ? 'md:grid-cols-2' : cardsPerRow === 4 ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-2 lg:grid-cols-3';
  
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <Skeleton className="h-10 w-64 rounded-lg" />
        <div className="flex gap-3">
          <Skeleton className="h-10 w-32 rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
      </div>
      
      <div className={`grid grid-cols-1 ${gridCols} gap-6`}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 flex flex-col gap-4 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <Skeleton className="w-16 h-16 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
            <Skeleton className="h-20 w-full rounded-lg" />
            <div className="flex gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
              <Skeleton className="h-9 flex-1 rounded-lg" />
              <Skeleton className="h-9 w-10 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

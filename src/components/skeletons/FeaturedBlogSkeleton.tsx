import { Skeleton } from "@/components/ui/Skeleton";

export function FeaturedBlogSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg">
      {/* Image */}
      <div className="relative h-80 bg-gray-200 dark:bg-gray-700">
        <Skeleton className="h-full w-full" />
      </div>

      {/* Content */}
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>

        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />

        {/* Meta Info */}
        <div className="flex items-center justify-between mt-6">
           <div className="flex space-x-4">
             <Skeleton className="h-4 w-24" />
             <Skeleton className="h-4 w-24" />
             <Skeleton className="h-4 w-24" />
           </div>
        </div>

        {/* Tags */}
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </div>
    </div>
  );
}

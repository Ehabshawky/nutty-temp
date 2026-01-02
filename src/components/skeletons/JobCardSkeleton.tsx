import { Skeleton } from "@/components/ui/Skeleton";

export function JobCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-gray-100 dark:border-gray-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex-1">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Skeleton className="h-6 w-24 rounded-lg" />
            <Skeleton className="h-6 w-24 rounded-lg" />
            <Skeleton className="h-6 w-24 rounded-lg" />
          </div>

          {/* Title */}
          <Skeleton className="h-10 w-3/4 mb-4" />

          {/* Description */}
          <div className="mb-8 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>

          {/* Requirements */}
          <div className="mb-4">
            <Skeleton className="h-4 w-32 mb-4" />
            <div className="space-y-3">
               <Skeleton className="h-4 w-full" />
               <Skeleton className="h-4 w-full" />
               <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </div>

        {/* Button */}
        <div className="flex-shrink-0">
           <Skeleton className="h-16 w-40 rounded-3xl" />
        </div>
      </div>
    </div>
  );
}

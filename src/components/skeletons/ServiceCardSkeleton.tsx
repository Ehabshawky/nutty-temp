import { Skeleton } from "@/components/ui/Skeleton";

export function ServiceCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col h-full">
      {/* Image Container */}
      <div className="relative h-48 w-full bg-gray-200 dark:bg-gray-700">
        <Skeleton className="h-full w-full" />
      </div>

      {/* Content Container */}
      <div className="p-6 flex flex-col flex-grow space-y-4">
        {/* Title */}
        <Skeleton className="h-8 w-3/4 rounded-lg" />

        {/* Description */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        {/* Footer info (duration/age) */}
        <div className="flex gap-4 mt-auto pt-4">
           <Skeleton className="h-4 w-20" />
           <Skeleton className="h-4 w-20" />
        </div>
        
        {/* Button */}
        <Skeleton className="h-6 w-24 mt-2 rounded-full" />
      </div>
    </div>
  );
}

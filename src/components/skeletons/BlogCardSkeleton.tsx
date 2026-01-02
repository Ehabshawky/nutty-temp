import { Skeleton } from "@/components/ui/Skeleton";

export function BlogCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg h-full">
      {/* Image */}
      <div className="relative h-40 bg-gray-200 dark:bg-gray-700">
        <Skeleton className="h-full w-full" />
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start mb-3">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-4 w-12" />
        </div>

        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />

        {/* Meta */}
        <div className="flex items-center justify-between mt-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
}

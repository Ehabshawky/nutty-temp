import { Skeleton } from "@/components/ui/Skeleton";

export function FeaturedProjectSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg h-full flex flex-col">
      {/* Image */}
      <div className="relative h-64 bg-gray-200 dark:bg-gray-700">
        <Skeleton className="h-full w-full" />
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-4">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>

        <div className="mb-6 flex-grow space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>

        {/* Meta */}
        <div className="flex items-center justify-between mb-6">
           <Skeleton className="h-4 w-24" />
           <Skeleton className="h-4 w-24" />
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-auto">
          <Skeleton className="h-10 flex-1 rounded-lg" />
          <Skeleton className="h-10 w-12 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

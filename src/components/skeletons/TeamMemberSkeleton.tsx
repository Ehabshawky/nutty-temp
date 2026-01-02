import { Skeleton } from "@/components/ui/Skeleton";

export function MemberCardSkeleton() {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col h-full">
      {/* Image */}
      <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
        <Skeleton className="h-full w-full" />
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <div className="mb-4">
          <Skeleton className="h-6 w-1/2 mb-2" />
          <Skeleton className="h-4 w-1/3" />
        </div>

        <div className="flex-1 space-y-2 mb-4">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
        </div>
        
        {/* Skills */}
        <div className="mb-6 pt-4 border-t border-gray-100 dark:border-gray-700 flex gap-2">
            <Skeleton className="h-5 w-12 rounded" />
            <Skeleton className="h-5 w-12 rounded" />
            <Skeleton className="h-5 w-12 rounded" />
        </div>

        {/* Social Links */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex space-x-3">
             <Skeleton className="h-5 w-5 rounded-full" />
             <Skeleton className="h-5 w-5 rounded-full" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
}

export function FeaturedMemberSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 h-full">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Member Image */}
        <div className="flex-shrink-0">
          <Skeleton className="w-48 h-48 rounded-2xl" />
        </div>

        {/* Member Info */}
        <div className="flex-1 min-w-0 space-y-4">
          <div className="mb-4">
            <Skeleton className="h-8 w-1/2 mb-2" />
            <Skeleton className="h-4 w-1/3" />
          </div>

          <div className="space-y-2 mb-6">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          {/* Education */}
          <div className="flex items-center mb-4 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
             <Skeleton className="h-5 w-5 mr-3" />
             <Skeleton className="h-4 w-2/3" />
          </div>

          {/* Skills */}
          <div className="mb-6">
            <Skeleton className="h-3 w-20 mb-2" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-6 w-16 rounded" />
              <Skeleton className="h-6 w-16 rounded" />
              <Skeleton className="h-6 w-16 rounded" />
            </div>
          </div>

          {/* Social Links */}
          <div className="flex space-x-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <Skeleton className="h-10 w-10 rounded-xl" />
            <Skeleton className="h-10 w-24 rounded-xl ml-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}

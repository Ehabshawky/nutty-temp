import { Skeleton } from "@/components/ui/Skeleton";

export function TestimonialCardSkeleton() {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow-lg h-full">
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-2/3 mb-6" />
      
      <div className="flex mb-6 space-x-1">
        {[1, 2, 3, 4, 5].map((i) => (
           <Skeleton key={i} className="w-4 h-4 rounded-full" />
        ))}
      </div>
      
      <div className="flex items-center">
        <Skeleton className="w-10 h-10 rounded-full mr-3" />
        <div>
           <Skeleton className="h-4 w-24 mb-1" />
           <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  );
}

export function FeaturedTestimonialSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg h-full">
      <Skeleton className="w-12 h-12 rounded-full mb-6" />
      <Skeleton className="h-6 w-full mb-4" />
      <Skeleton className="h-6 w-full mb-4" />
      <Skeleton className="h-6 w-3/4 mb-8" />
      
      <div className="flex mb-6 space-x-1">
        {[1, 2, 3, 4, 5].map((i) => (
           <Skeleton key={i} className="w-5 h-5 rounded-full" />
        ))}
      </div>
      
      <div className="flex items-center">
        <Skeleton className="w-12 h-12 rounded-full mr-4" />
        <div>
           <Skeleton className="h-5 w-32 mb-1" />
           <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  );
}

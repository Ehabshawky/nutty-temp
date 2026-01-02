import { Skeleton } from "@/components/ui/Skeleton";

export function AboutSkeleton() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <Skeleton className="h-10 w-64 mx-auto rounded-lg" />
          <Skeleton className="h-6 w-1/2 mx-auto rounded-lg" />
        </div>

        {/* Mission / Vision */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>

        {/* Values */}
        <div className="mb-20">
           <Skeleton className="h-8 w-48 mx-auto mb-12" />
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                 <Skeleton key={i} className="h-48 w-full rounded-xl" />
              ))}
           </div>
        </div>

        {/* Timeline */}
        <div className="mb-20">
           <Skeleton className="h-8 w-32 mx-auto mb-12" />
           <div className="space-y-8">
              {[...Array(4)].map((_, i) => (
                 <div key={i} className="flex items-center justify-between">
                    <Skeleton className="h-24 w-5/12 rounded-lg" />
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-24 w-5/12 rounded-lg" />
                 </div>
              ))}
           </div>
        </div>
      </div>
    </section>
  );
}

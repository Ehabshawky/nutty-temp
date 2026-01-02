import { Skeleton } from "@/components/ui/Skeleton";

export function ContactSkeleton() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <Skeleton className="h-10 w-64 mx-auto rounded-lg" />
          <Skeleton className="h-6 w-1/2 mx-auto rounded-lg" />
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left Column - Contact Info */}
          <div className="lg:col-span-1 space-y-6">
             {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 shadow-lg h-40">
                   <Skeleton className="w-14 h-14 rounded-xl mb-4" />
                   <Skeleton className="h-6 w-32 mb-3" />
                   <Skeleton className="h-4 w-48" />
                </div>
             ))}
             
             {/* Departments */}
             <div className="space-y-4 mt-12">
                <Skeleton className="h-8 w-48 mb-6" />
                {[1, 2, 3].map((i) => (
                   <Skeleton key={i} className="h-20 w-full rounded-xl" />
                ))}
             </div>
          </div>

          {/* Right Column - Form */}
          <div className="lg:col-span-2">
             <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg h-full">
                <Skeleton className="h-8 w-48 mb-8" />
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                   <Skeleton className="h-12 w-full rounded-lg" />
                   <Skeleton className="h-12 w-full rounded-lg" />
                </div>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                   <Skeleton className="h-12 w-full rounded-lg" />
                   <Skeleton className="h-12 w-full rounded-lg" />
                </div>
                <Skeleton className="h-32 w-full rounded-lg mb-6" />
                <Skeleton className="h-12 w-32 rounded-lg ml-auto" />
             </div>

             {/* FAQ */}
             <div className="mt-12 space-y-4">
                <Skeleton className="h-8 w-32 mb-6" />
                {[1, 2, 3, 4].map((i) => (
                   <Skeleton key={i} className="h-24 w-full rounded-xl" />
                ))}
             </div>
          </div>
        </div>

        {/* Map */}
        <div className="mt-16">
           <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      </div>
    </section>
  );
}

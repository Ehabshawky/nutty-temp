import { Skeleton } from "@/components/ui/Skeleton";

export function ServiceDetailSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      {/* Hero Section */}
      <section className="pt-24 pb-12 md:pt-32 md:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           {/* Back Button */}
           <Skeleton className="h-6 w-24 mb-8" />
           
           <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Text Content */}
              <div>
                 <Skeleton className="h-8 w-32 rounded-full mb-6" />
                 <Skeleton className="h-16 w-3/4 mb-6" />
                 <Skeleton className="h-4 w-full mb-2" />
                 <Skeleton className="h-4 w-full mb-2" />
                 <Skeleton className="h-4 w-2/3 mb-8" />
                 
                 <div className="flex gap-4">
                    <Skeleton className="h-12 w-40 rounded-full" />
                    <Skeleton className="h-12 w-40 rounded-full" />
                 </div>
              </div>
              
              {/* Image */}
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-gray-200 dark:bg-gray-800">
                 <Skeleton className="h-full w-full" />
              </div>
           </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                 <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-lg h-40 flex flex-col items-center justify-center">
                    <Skeleton className="w-12 h-12 rounded-full mb-4" />
                    <Skeleton className="h-6 w-24 mb-2" />
                    <Skeleton className="h-4 w-16" />
                 </div>
              ))}
           </div>
        </div>
      </section>
      
      {/* Detailed Description */}
      <section className="py-20">
         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Skeleton className="h-10 w-64 mb-8" />
            <div className="space-y-4">
               <Skeleton className="h-4 w-full" />
               <Skeleton className="h-4 w-full" />
               <Skeleton className="h-4 w-full" />
               <Skeleton className="h-4 w-5/6" />
               <br />
               <Skeleton className="h-4 w-full" />
               <Skeleton className="h-4 w-full" />
               <Skeleton className="h-4 w-4/5" />
            </div>
         </div>
      </section>
    </div>
  );
}

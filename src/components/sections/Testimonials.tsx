"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Star, 
  Quote, 
  Award,
  Users,
  School,
  Building,
  Upload
} from 'lucide-react';
import { Skeleton } from "@/components/ui/Skeleton";
import { TestimonialCardSkeleton, FeaturedTestimonialSkeleton } from "@/components/skeletons/TestimonialSkeleton";

const Testimonials = () => {
  const { t, i18n } = useTranslation();
  const dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  const [testimonialsData, setTestimonialsData] = useState<any[]>([]);
  const [formData, setFormData] = useState({ name: '', role: '', content: '', rating: 5, organization: '', image: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState('');
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetch('/api/testimonials')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setTestimonialsData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitMsg('');

    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setSubmitMsg(i18n.language === 'ar' ? 'تم إرسال تقييمك بنجاح! سيتم نشره بعد المراجعة.' : 'Review submitted for moderation!');
        setFormData({ name: '', role: '', content: '', rating: 5, organization: '', image: '' });
      } else {
        setSubmitMsg(i18n.language === 'ar' ? 'فشل الإرسال' : 'Submission failed');
      }
    } catch (err) {
      setSubmitMsg('Error');
    } finally {
      setSubmitting(false);
    }
  };

  const categories = [
    { id: 'all', label: t('testimonialsSection.categories.all'), icon: Users, count: testimonialsData.length },
    // Static categories for filtering if data allows, or simplify
  ];

  // Filter and split testimonials
  const textReviews = testimonialsData.filter(t => !t.screenshot_url);
  const screenshotReviews = testimonialsData.filter(t => t.screenshot_url);

  // Take first 3 text reviews as "featured"
  const featuredTestimonials = textReviews.slice(0, 3); 
  const gridTestimonials = textReviews.slice(3);

  if (loading) {
     return (
       <section id="testimonials" className="py-20 bg-white dark:bg-gray-900" dir={dir}>
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header Skeleton */}
            <div className="text-center mb-16 space-y-4">
               <Skeleton className="h-10 w-64 mx-auto rounded-lg" />
               <Skeleton className="h-6 w-96 mx-auto rounded-lg" />
            </div>

            {/* Featured Skeleton */}
            <div className="grid lg:grid-cols-3 gap-8 mb-16">
               <FeaturedTestimonialSkeleton />
               <FeaturedTestimonialSkeleton />
               <FeaturedTestimonialSkeleton />
            </div>

            {/* Grid Skeleton */}
            <div className="grid md:grid-cols-2 gap-6 mb-16">
               {[...Array(4)].map((_, i) => <TestimonialCardSkeleton key={i} />)}
            </div>
         </div>
       </section>
     );
  }

  return (
    <section id="testimonials" className="py-20 bg-white dark:bg-gray-900" dir={dir}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t("testimonialsSection.title")}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            {t("testimonialsSection.lead")}
          </p>
        </motion.div>

        {/* Featured Text Testimonials */}
        {featuredTestimonials.length > 0 && (
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {featuredTestimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                <Quote className="w-12 h-12 text-nutty-cyan/30 mb-6" />
                <p className="text-gray-700 dark:text-gray-300 text-lg italic mb-8">
                  "{testimonial.content}"
                </p>
                <div className="flex mb-6">
                  {[...Array(testimonial.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <div className="flex items-center">
                  {testimonial.image ? (
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4 rtl:mr-0 rtl:ml-4"
                  />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-4 rtl:ml-4 rtl:mr-0">
                        <Users className="w-6 h-6 text-gray-500" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {testimonial.role || 'Customer'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        )}

        {/* Remaining Text Testimonials */}
        {gridTestimonials.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {gridTestimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                  <p className="text-gray-700 dark:text-gray-300 mb-6 line-clamp-4">
                    "{testimonial.content}"
                  </p>
                  <div className="flex mb-6">
                    {[...Array(testimonial.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <div className="flex items-center">
                    {testimonial.image ? (
                        <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-10 h-10 rounded-full object-cover mr-3 rtl:mr-0 rtl:ml-3"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3 rtl:ml-3 rtl:mr-0">
                            <Users className="w-5 h-5 text-gray-500" />
                        </div>
                    )}
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-sm">
                        {testimonial.name}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 text-xs">
                        {testimonial.role || 'Customer'}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
        </div>
        )}

        {/* Screenshot Reviews Section */}
        {screenshotReviews.length > 0 && (
          <div className="mb-20">
            <h3 className="text-3xl font-bold text-center mb-10 text-gray-900 dark:text-white">
              {i18n.language === 'ar' ? 'من وسائل التواصل الاجتماعي' : 'From Social Media'}
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {screenshotReviews.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative cursor-pointer"
                  onClick={() => window.open(testimonial.screenshot_url, '_blank')}
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-nutty-orange to-nutty-lime rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-xl ring-1 ring-gray-900/5">
                    <img 
                      src={testimonial.screenshot_url} 
                      alt="Social Proof" 
                      className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-colors">
                        {/* Overlay effect */}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Submit Form */}
        <div className="max-w-3xl mx-auto bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl shadow-sm">
             <h3 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white">
                {i18n.language === 'ar' ? 'شاركنا تجربتك' : 'Share Your Experience'}
             </h3>
             {submitMsg && (
                 <div className={`p-4 mb-6 rounded-lg text-center ${submitMsg.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                     {submitMsg}
                 </div>
             )}
             <form onSubmit={handleSubmit} className="space-y-6">
                 <div className="grid md:grid-cols-2 gap-6">
                     <input 
                         type="text" 
                         placeholder={i18n.language === 'ar' ? 'الاسم' : 'Name'}
                         required
                         value={formData.name}
                         onChange={e => setFormData({...formData, name: e.target.value})}
                         className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                     />
                     <input 
                         type="text" 
                         placeholder={i18n.language === 'ar' ? 'الصفة (مثال: ولي أمر)' : 'Role (e.g. Parent)'}
                         value={formData.role}
                         onChange={e => setFormData({...formData, role: e.target.value})}
                         className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                     />
                 </div>

                 <div className="flex items-center gap-4">
                    <label className="flex-1 cursor-pointer">
                        <div className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex items-center gap-2 text-gray-500 hover:bg-gray-50 transition-colors">
                            <Upload className="w-5 h-5" />
                            <span className="truncate">
                                {formData.image 
                                  ? (i18n.language === 'ar' ? 'تم اختيار الصورة' : 'Image Selected') 
                                  : (i18n.language === 'ar' ? 'إضافة صورة شخصية (اختياري)' : 'Add Profile Photo (Optional)')}
                            </span>
                            <input 
                                type="file" 
                                hidden 
                                accept="image/*"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    setSubmitMsg(i18n.language === 'ar' ? 'جاري رفع الصورة...' : 'Uploading image...');
                                    const uploadData = new FormData();
                                    uploadData.append('file', file);
                                    try {
                                        const res = await fetch('/api/upload-image/public', { method: 'POST', body: uploadData });
                                        const data = await res.json();
                                        if (res.ok) {
                                            setFormData(prev => ({ ...prev, image: data.url }));
                                            setSubmitMsg(i18n.language === 'ar' ? 'تم رفع الصورة' : 'Image uploaded');
                                        } else {
                                            throw new Error(data.error || 'Upload failed');
                                        }
                                    } catch (err: any) {
                                        setSubmitMsg(err.message || (i18n.language === 'ar' ? 'فشل رفع الصورة' : 'Image upload failed'));
                                    }
                                }}
                            />
                        </div>
                    </label>
                 </div>
                 <textarea 
                     placeholder={i18n.language === 'ar' ? 'تجربتك معنا...' : 'Your experience...'}
                     required
                     rows={4}
                     value={formData.content}
                     onChange={e => setFormData({...formData, content: e.target.value})}
                     className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                 ></textarea>
                 <div className="flex items-center gap-2">
                     <span className="text-gray-600 dark:text-gray-400">{i18n.language === 'ar' ? 'التقييم:' : 'Rating:'}</span>
                     {[1, 2, 3, 4, 5].map(star => (
                         <button 
                             key={star} 
                             type="button"
                             onClick={() => setFormData({...formData, rating: star})}
                             className="focus:outline-none transition-transform hover:scale-110"
                         >
                             <Star className={`w-6 h-6 ${formData.rating >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                         </button>
                     ))}
                 </div>
                 <button 
                     type="submit" 
                     disabled={submitting}
                     className="w-full py-4 bg-nutty-orange text-white rounded-xl font-bold hover:bg-orange-600 transition-colors disabled:opacity-50"
                 >
                     {submitting ? '...' : (i18n.language === 'ar' ? 'إرسال التقييم' : 'Submit Review')}
                 </button>
             </form>
        </div>

      </div>
    </section>
  );
};

export default Testimonials;

"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Briefcase, MapPin, Clock, ChevronRight, ChevronLeft, ArrowRight, ArrowLeft, Mail, AlertCircle, Search, Filter, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const CareersPage = () => {
  const { t, i18n } = useTranslation();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");
  const [settings, setSettings] = useState<any>({});
  const isRTL = i18n.language === 'ar';
  const currentLanguage = (i18n.language || 'en') as 'en' | 'ar';

  useEffect(() => {
    async function fetchData() {
      try {
        const [jobsRes, settingsRes] = await Promise.all([
          fetch(`/api/jobs?t=${Date.now()}`),
          fetch(`/api/site-content?t=${Date.now()}`)
        ]);

        if (jobsRes.ok) setJobs(await jobsRes.json());
        if (settingsRes.ok) {
          const data = await settingsRes.json();
          if (data.settings) setSettings(data.settings);
        }
      } catch (e) {
        console.error("Error fetching data:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const departments = ["all", ...new Set(jobs.map(j => j.department.en))];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.title[currentLanguage].toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description[currentLanguage].toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === "all" || job.department.en === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${isRTL ? 'font-cairo' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>

      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-nutty-blue/5 -z-10"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-nutty-orange/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-nutty-blue/10 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-2 bg-nutty-blue/10 text-nutty-blue rounded-full text-sm font-black uppercase tracking-widest mb-6"
          >
            {isRTL ? 'انضم إلى فريقنا' : 'Join Our Team'}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white mb-8 tracking-tight"
          >
            {isRTL ? 'وظائف شاغرة' : 'Current Openings'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-medium"
          >
            {isRTL 
              ? 'هل أنت شغوف بالعلوم والتعليم؟ نحن نبحث عن أشخاص ملهمين للانضمام إلينا في بناء مستقبل الابتكار.'
              : 'Are you passionate about science and education? We\'re looking for inspiring people to join us in building the future of innovation.'
            }
          </motion.p>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="py-12 bg-white dark:bg-gray-800 shadow-sm sticky top-0 md:top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="relative flex-1 w-full">
              <Search className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5`} />
              <input
                type="text"
                placeholder={isRTL ? 'ابحث عن وظيفة...' : 'Search for a position...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full ${isRTL ? 'pr-12' : 'pl-12'} py-4 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl focus:ring-2 focus:ring-nutty-blue text-gray-900 dark:text-white font-bold transition-all`}
              />
            </div>
            <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
              {departments.map(dept => (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`px-6 py-4 rounded-2xl font-black text-sm whitespace-nowrap transition-all ${
                    selectedDept === dept
                      ? 'bg-nutty-orange text-white shadow-lg shadow-nutty-orange/20'
                      : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  {dept === 'all' ? (isRTL ? 'الكل' : 'All') : dept}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Jobs Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-nutty-orange mb-4"></div>
              <p className="text-gray-500 font-bold">{isRTL ? 'جاري البحث عن الفرص...' : 'Searching for opportunities...'}</p>
            </div>
          ) : filteredJobs.length > 0 ? (
            <div className="grid grid-cols-1 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredJobs.map((job, index) => (
                  <motion.div
                    key={job.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 md:p-12 shadow-xl hover:shadow-2xl transition-all border border-gray-100 dark:border-gray-700 group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-nutty-blue/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                      <div className="flex-1">
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="px-3 py-1 bg-nutty-blue/10 text-nutty-blue rounded-lg text-xs font-black uppercase tracking-widest">
                            {job.department[currentLanguage]}
                          </span>
                          <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg text-xs font-black uppercase tracking-widest flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {job.type[currentLanguage]}
                          </span>
                          <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg text-xs font-black uppercase tracking-widest flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {job.location[currentLanguage]}
                          </span>
                        </div>
                        <h3 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4 group-hover:text-nutty-blue transition-colors">
                          {job.title[currentLanguage]}
                        </h3>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-3xl leading-relaxed">
                          {job.description[currentLanguage]}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
                          <div>
                            <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-nutty-orange" />
                              {isRTL ? 'المتطلبات الأساسية' : 'Key Requirements'}
                            </h4>
                            <ul className="space-y-3">
                              {job.requirements[currentLanguage].map((req: string, i: number) => (
                                <li key={i} className="flex items-start gap-3 text-gray-700 dark:text-gray-300 font-bold text-sm">
                                  <div className="w-1.5 h-1.5 rounded-full bg-nutty-blue mt-2 flex-shrink-0"></div>
                                  {req}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="flex-shrink-0">
                        <Link
                          href={`mailto:${settings.career_email || 'careers@nuttyscientists.com'}?subject=Application for ${job.title[currentLanguage]}`}
                          className="inline-flex items-center gap-3 px-10 py-5 bg-gray-900 text-white rounded-3xl font-black text-lg hover:bg-black transition-all transform hover:-translate-y-1 shadow-xl shadow-black/20 group-hover:bg-nutty-blue group-hover:shadow-nutty-blue/20"
                        >
                          {isRTL ? 'قدم الآن' : 'Apply Now'}
                          {isRTL ? <ArrowLeft className="w-6 h-6" /> : <ArrowRight className="w-6 h-6" />}
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-24 bg-gray-50 dark:bg-gray-800/50 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-gray-700">
              <AlertCircle className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">
                {isRTL ? 'لا توجد وظائف حالياً تتوافق مع بحثك' : 'No matching positions found'}
              </h3>
              <p className="text-gray-500 font-medium mb-8">
                {isRTL 
                  ? 'جرب البحث بكلمات أخرى أو اختر قسماً مختلفاً.' 
                  : 'Try adjusting your search terms or filters to see more opportunities.'
                }
              </p>
              <button 
                onClick={() => {setSearchTerm(""); setSelectedDept("all");}}
                className="px-8 py-3 bg-nutty-blue text-white rounded-2xl font-black"
              >
                {isRTL ? 'عرض كل الوظائف' : 'Show All Positions'}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#1a2333] to-[#0b0f1a] rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-3xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-nutty-blue/10 rounded-full blur-[120px] -mr-48 -mt-48"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-nutty-orange/5 rounded-full blur-[120px] -ml-48 -mb-48"></div>

            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight">
                {isRTL ? 'لم تجد ما تبحث عنه؟' : 'Didn\'t find what you\'re looking for?'}
              </h2>
              <p className="text-xl text-gray-400 mb-12 font-medium">
                {isRTL 
                  ? 'أرسل سيرتك الذاتية إلينا وسنقوم بالتواصل معك عند توفر فرصة مناسبة.' 
                  : 'Send us your CV and we\'ll get in touch when a suitable position becomes available.'
                }
              </p>
              <a 
                href={`mailto:${settings.career_email || 'careers@nuttyscientists.com'}`} 
                className="inline-flex items-center gap-4 px-12 py-6 bg-nutty-orange text-white rounded-[2rem] font-black text-xl hover:bg-orange-600 transition-all transform hover:-translate-y-1 shadow-2xl shadow-orange-600/20 active:scale-95"
              >
                <Mail className="w-6 h-6" />
                {isRTL ? 'أرسل سيرتك الذاتية' : 'Submit Your CV'}
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default CareersPage;

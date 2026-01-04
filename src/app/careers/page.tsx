"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Briefcase, MapPin, Clock, ChevronRight, ChevronLeft, ArrowRight, ArrowLeft, Mail, AlertCircle, Search, Filter, CheckCircle, X, Upload, Paperclip, Send, Loader2 } from 'lucide-react';
import { JobCardSkeleton } from "@/components/skeletons/JobCardSkeleton";
import Link from 'next/link';

const CareersPage = () => {
  const { t, i18n } = useTranslation();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");
  const [settings, setSettings] = useState<any>({});
  const isRTL = i18n.language === 'ar';
  const currentLanguage = (i18n.language || 'en') as 'en' | 'ar';

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [cvFile, setCvFile] = useState<File | null>(null);

  useEffect(() => {
    setMounted(true);
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

  if (!mounted) {
    return <div className="min-h-screen bg-gray-50 dark:bg-gray-900" />;
  }

  const departments = ["all", ...new Set(jobs.map(j => j.department.en))];

  const filteredJobs = jobs.filter(job => {
    const titleMatch = job.title[currentLanguage]?.toLowerCase().includes(searchTerm.toLowerCase());
    const descMatch = job.description[currentLanguage]?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSearch = titleMatch || descMatch;
    const matchesDept = selectedDept === "all" || job.department.en === selectedDept;
    return matchesSearch && matchesDept;
  });

  const handleApplyClick = (job: any) => {
    setSelectedJob(job);
    setIsModalOpen(true);
    setSubmitted(false);
    setError("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError(isRTL ? "حجم الملف كبير جداً (الحد الأقصى 10 ميجابايت)" : "File is too large (max 10MB)");
        return;
      }
      setCvFile(file);
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cvFile) {
      setError(isRTL ? "يرجى تحميل سيرتك الذاتية" : "Please upload your CV");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const data = new FormData();
      data.append("jobId", selectedJob?.id || "general");
      data.append("jobTitle", selectedJob ? selectedJob.title[currentLanguage] : "General Application");
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("message", formData.message);
      data.append("cv", cvFile);

      const res = await fetch("/api/jobs/apply", {
        method: "POST",
        body: data
      });

      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: "", email: "", phone: "", message: "" });
        setCvFile(null);
      } else {
        const err = await res.json();
        setError(err.error || (isRTL ? "فشل تقديم الطلب" : "Failed to submit application"));
      }
    } catch (e) {
      setError(isRTL ? "حدث خطأ ما" : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div 
      className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${isRTL ? 'font-cairo' : ''}`} 
      dir={isRTL ? 'rtl' : 'ltr'}
      suppressHydrationWarning
    >

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
      <section className="py-12 bg-white dark:bg-gray-800 shadow-sm sticky top-0 md:top-20 z-30 border-b border-gray-100 dark:border-gray-700">
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
            <div className="space-y-8">
               <JobCardSkeleton />
               <JobCardSkeleton />
               <JobCardSkeleton />
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
                        <h3 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4 group-hover:text-nutty-blue transition-colors text-gradient">
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
                        <button
                          onClick={() => handleApplyClick(job)}
                          className="inline-flex items-center gap-3 px-10 py-5 bg-gray-900 text-white rounded-3xl font-black text-lg hover:bg-black transition-all transform hover:-translate-y-1 shadow-xl shadow-black/20 group-hover:bg-nutty-blue group-hover:shadow-nutty-blue/20"
                        >
                          {isRTL ? 'قدم الآن' : 'Apply Now'}
                          {isRTL ? <ArrowLeft className="w-6 h-6" /> : <ArrowRight className="w-6 h-6" />}
                        </button>
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
              <button 
                onClick={() => handleApplyClick(null)} 
                className="inline-flex items-center gap-4 px-12 py-6 bg-nutty-orange text-white rounded-[2rem] font-black text-xl hover:bg-orange-600 transition-all transform hover:-translate-y-1 shadow-2xl shadow-orange-600/20 active:scale-95"
              >
                <Upload className="w-6 h-6" />
                {isRTL ? 'أرسل سيرتك الذاتية' : 'Submit Your CV'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Application Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl overflow-hidden overflow-y-auto max-h-[90vh]"
            >
              <div className="p-8 md:p-12">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className={`absolute ${isRTL ? 'left-6' : 'right-6'} top-6 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>

                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-10 h-10" />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">
                      {isRTL ? 'تم استلام طلبك!' : 'Application Received!'}
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 font-medium">
                      {isRTL 
                        ? 'شكراً لاهتمامك بالانضمام إلينا. سيقوم فريقنا بمراجعة ملفك والتواصل معك قريباً.'
                        : 'Thank you for your interest in joining us. Our team will review your application and get in touch with you soon.'
                      }
                    </p>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="px-10 py-4 bg-nutty-blue text-white rounded-2xl font-black text-lg shadow-xl shadow-nutty-blue/20"
                    >
                      {isRTL ? 'إغلاق' : 'Close'}
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="mb-10">
                      <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-2">
                        {isRTL ? 'نموذج التقديم' : 'Application Form'}
                      </h2>
                      <p className="text-lg text-gray-500 dark:text-gray-400 font-bold">
                        {selectedJob 
                          ? (isRTL ? `للتقديم على وظيفة: ${selectedJob.title[currentLanguage]}` : `Applying for: ${selectedJob.title[currentLanguage]}`)
                          : (isRTL ? 'تقديم طلب عام' : 'General Application')
                        }
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-black text-gray-700 dark:text-gray-300 uppercase tracking-widest pl-1">
                            {isRTL ? 'الاسم الكامل' : 'Full Name'} *
                          </label>
                          <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl focus:ring-2 focus:ring-nutty-blue transition-all font-bold text-gray-900 dark:text-white placeholder-gray-400"
                            placeholder={isRTL ? 'أدخل اسمك بالكامل' : 'Enter your full name'}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-black text-gray-700 dark:text-gray-300 uppercase tracking-widest pl-1">
                            {isRTL ? 'البريد الإلكتروني' : 'Email Address'} *
                          </label>
                          <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl focus:ring-2 focus:ring-nutty-blue transition-all font-bold text-gray-900 dark:text-white placeholder-gray-400"
                            placeholder="example@mail.com"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-black text-gray-700 dark:text-gray-300 uppercase tracking-widest pl-1">
                          {isRTL ? 'رقم الهاتف' : 'Phone Number'}
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl focus:ring-2 focus:ring-nutty-blue transition-all font-bold text-gray-900 dark:text-white placeholder-gray-400"
                          placeholder="+20 1XX XXX XXXX"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-black text-gray-700 dark:text-gray-300 uppercase tracking-widest pl-1">
                          {isRTL ? 'لماذا تريد الانضمام إلينا؟' : 'Why do you want to join us?'}
                        </label>
                        <textarea
                          name="message"
                          rows={4}
                          value={formData.message}
                          onChange={handleInputChange}
                          className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl focus:ring-2 focus:ring-nutty-blue transition-all font-bold text-gray-900 dark:text-white placeholder-gray-400 resize-none"
                          placeholder={isRTL ? 'أخبرنا قليلاً عن شغفك...' : 'Tell us a bit about your passion...'}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-black text-gray-700 dark:text-gray-300 uppercase tracking-widest pl-1">
                          {isRTL ? 'السيرة الذاتية (CV)' : 'Resume / CV'} *
                        </label>
                        <div className={`relative border-2 border-dashed rounded-[2rem] p-8 text-center transition-all ${cvFile ? 'border-nutty-blue bg-nutty-blue/5' : 'border-gray-200 dark:border-gray-700 hover:border-nutty-blue/50'}`}>
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          {cvFile ? (
                            <div className="flex flex-col items-center">
                              <Paperclip className="w-12 h-12 text-nutty-blue mb-2" />
                              <p className="font-bold text-gray-900 dark:text-white">{cvFile.name}</p>
                              <p className="text-xs text-gray-500 mt-1">{(cvFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                              <button 
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setCvFile(null); }}
                                className="mt-4 text-sm text-red-500 hover:text-red-600 font-black uppercase tracking-widest"
                              >
                                {isRTL ? 'إزالة' : 'Remove'}
                              </button>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center">
                              <Upload className="w-12 h-12 text-gray-300 mb-4" />
                              <p className="font-black text-gray-700 dark:text-gray-300 mb-1">
                                {isRTL ? 'انقر أو اسحب الملف هنا' : 'Click or drag file here'}
                              </p>
                              <p className="text-sm text-gray-500">
                                PDF, DOC, DOCX ({isRTL ? 'بحد أقصى 10 ميجابايت' : 'Max 10MB'})
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {error && (
                        <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl animate-shake">
                          <AlertCircle className="w-5 h-5 flex-shrink-0" />
                          <p className="text-sm font-bold">{error}</p>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full flex items-center justify-center gap-3 px-10 py-5 bg-nutty-blue text-white rounded-3xl font-black text-xl hover:bg-nutty-blue-dark transition-all transform hover:-translate-y-1 shadow-xl shadow-nutty-blue/20 disabled:opacity-50 disabled:transform-none"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-6 h-6 animate-spin" />
                            {isRTL ? 'جاري التقديم...' : 'Submitting...'}
                          </>
                        ) : (
                          <>
                            <Send className="w-6 h-6" />
                            {isRTL ? 'إرسال الطلب' : 'Submit Application'}
                          </>
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default CareersPage;

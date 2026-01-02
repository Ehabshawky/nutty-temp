"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import Link from "next/link";
import {
  Beaker,
  FlaskRound,
  Atom,
  Rocket,
  Brain,
  Microscope,
  Users,
  Calendar,
  Heart,
  Shield,
  Globe,
  Clock,
  Award,
  Target,
  Eye,
  Filter,
} from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import { ServiceCardSkeleton } from "@/components/skeletons/ServiceCardSkeleton";

interface ServiceItem {
  id?: string;
  icon?: any;
  title?: string;
  title_en?: string;
  title_ar?: string;
  description?: string;
  description_en?: string;
  description_ar?: string;
  image?: string;
  color?: string;
  delay?: number;
  category?: "families" | "schools" | "corporate";
}

const Services = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [dynamicServices, setDynamicServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<any>({});
  const [activeCategory, setActiveCategory] = useState<"all" | "families" | "schools" | "corporate">("all");
  const [showFilters, setShowFilters] = useState(false);

  // ألوان مخصصة لكل فئة
  const categoryColors = {
    families: "from-purple-500 to-pink-500",
    schools: "from-green-500 to-teal-500",
    corporate: "from-blue-500 to-cyan-500",
    all: "from-nutty-cyan to-nutty-cyan/80"
  };

  const staticServices = [
    {
      icon: Beaker,
      title: t("workshops"),
      description: t("workshopsDesc"),
      color: "from-yellow-400 to-orange-500",
      delay: 0.1,
      category: "families" as const,
    },
    {
      icon: FlaskRound,
      title: t("camps"),
      description: t("campsDesc"),
      color: "from-blue-400 to-cyan-500",
      delay: 0.2,
      category: "families" as const,
    },
    {
      icon: Users,
      title: t("parties"),
      description: t("partiesDesc"),
      color: "from-green-400 to-emerald-500",
      delay: 0.3,
      category: "families" as const,
    },
    {
      icon: Calendar,
      title: t("corporate"),
      description: t("corporateDesc"),
      color: "from-purple-400 to-pink-500",
      delay: 0.4,
      category: "corporate" as const,
    },
    {
      icon: Microscope,
      title: t("services.schoolProgramsTitle"),
      description: t("services.schoolProgramsDesc"),
      color: "from-red-400 to-rose-500",
      delay: 0.5,
      category: "schools" as const,
    },
    {
      icon: Brain,
      title: t("services.stemTitle"),
      description: t("services.stemDesc"),
      color: "from-indigo-400 to-violet-500",
      delay: 0.6,
      category: "schools" as const,
    },
    {
      icon: Atom,
      title: t("services.onlineTitle"),
      description: t("services.onlineDesc"),
      color: "from-teal-400 to-blue-500",
      delay: 0.7,
      category: "families" as const,
    },
    {
      icon: Rocket,
      title: t("services.competitionsTitle"),
      description: t("services.competitionsDesc"),
      color: "from-orange-400 to-red-500",
      delay: 0.8,
      category: "schools" as const,
    },
  ];

  useEffect(() => {
    async function fetchServices() {
      try {
        const [servicesRes, settingsRes] = await Promise.all([
           fetch(`/api/services?t=${Date.now()}`),
           fetch(`/api/site-content?t=${Date.now()}`)
        ]);

        if (servicesRes.ok) {
          const data = await servicesRes.json();
          if (Array.isArray(data) && data.length > 0) {
            // تأكد من وجود حقل category في البيانات
            const servicesWithCategory = data.map((service: any) => ({
              ...service,
              category: service.category || "families", // قيمة افتراضية إذا لم تكن موجودة
            }));
            setDynamicServices(servicesWithCategory);
          }
        } else {
          console.error("Failed to fetch services");
        }

        if (settingsRes.ok) {
           const data = await settingsRes.json();
           if (data.settings) setSettings(data.settings);
        }
      } catch (err) {
        console.error("Error fetching services:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  const iconMap: Record<string, any> = {
    Beaker, FlaskRound, Atom, Rocket, Brain, Microscope, Users, Calendar, 
    Heart, Shield, Globe, Clock, Award, Target, Eye
  };

  const displayServices = dynamicServices.length > 0 
    ? dynamicServices.map((s, i) => ({
        ...s,
        title: isRTL ? s.title_ar : s.title_en,
        description: isRTL ? s.description_ar : s.description_en,
        icon: iconMap[s.icon as string] || staticServices[i % staticServices.length].icon || Beaker,
        delay: (i % 4) * 0.1 + 0.1,
        color: staticServices[i % staticServices.length].color,
        category: s.category || staticServices[i % staticServices.length].category
      }))
    : staticServices;

  const filteredServices = activeCategory === "all" 
    ? displayServices 
    : displayServices.filter(service => service.category && service.category.includes(activeCategory));

  const getCategoryCount = (category: "all" | "families" | "schools" | "corporate") => {
    if (category === "all") return displayServices.length;
    return displayServices.filter(service => service.category && service.category.includes(category)).length;
  };

  if (loading) {
    return (
      <section id="services" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Skeleton */}
          <div className="text-center mb-12 space-y-4">
            <Skeleton className="h-10 w-64 mx-auto rounded-lg" />
            <Skeleton className="h-6 w-1/2 mx-auto rounded-lg" />
          </div>

          <div className="flex justify-center gap-3 mb-12">
            {[1, 2, 3, 4].map((i) => (
               <Skeleton key={i} className="h-10 w-24 rounded-full" />
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-full">
                <ServiceCardSkeleton />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t("servicesTitle")}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-10">
            {t("services.lead")}
          </p>

          {/* Filter Toggle for Mobile */}
          <div className="lg:hidden mb-6">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow hover:shadow-md transition-shadow"
            >
              <Filter className="w-5 h-5" />
              <span>{t("services.filter") || "Filter Programs"}</span>
              <span className={`transform transition-transform ${showFilters ? "rotate-180" : ""}`}>
                ▼
              </span>
            </button>
          </div>

          {/* Category Filter Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`${showFilters ? "block" : "hidden lg:block"}`}
          >
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              <button
                onClick={() => setActiveCategory("all")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
                  activeCategory === "all"
                    ? `bg-gradient-to-r ${categoryColors.all} text-white shadow-lg`
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Globe className="w-4 h-4" />
                {t("services.categories.all") || "All"}
                <span className={`ml-1 px-2 py-0.5 text-xs rounded-full ${
                  activeCategory === "all" 
                    ? "bg-white/20" 
                    : "bg-gray-100 dark:bg-gray-700"
                }`}>
                  {getCategoryCount("all")}
                </span>
              </button>

              <button
                onClick={() => setActiveCategory("families")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
                  activeCategory === "families"
                    ? `bg-gradient-to-r ${categoryColors.families} text-white shadow-lg`
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Heart className="w-4 h-4" />
                {t("services.categories.families") || "Families"}
                <span className={`ml-1 px-2 py-0.5 text-xs rounded-full ${
                  activeCategory === "families" 
                    ? "bg-white/20" 
                    : "bg-gray-100 dark:bg-gray-700"
                }`}>
                  {getCategoryCount("families")}
                </span>
              </button>

              <button
                onClick={() => setActiveCategory("schools")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
                  activeCategory === "schools"
                    ? `bg-gradient-to-r ${categoryColors.schools} text-white shadow-lg`
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Microscope className="w-4 h-4" />
                {t("services.categories.schools") || "Schools"}
                <span className={`ml-1 px-2 py-0.5 text-xs rounded-full ${
                  activeCategory === "schools" 
                    ? "bg-white/20" 
                    : "bg-gray-100 dark:bg-gray-700"
                }`}>
                  {getCategoryCount("schools")}
                </span>
              </button>

              <button
                onClick={() => setActiveCategory("corporate")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
                  activeCategory === "corporate"
                    ? `bg-gradient-to-r ${categoryColors.corporate} text-white shadow-lg`
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Users className="w-4 h-4" />
                {t("services.categories.corporate") || "Corporate"}
                <span className={`ml-1 px-2 py-0.5 text-xs rounded-full ${
                  activeCategory === "corporate" 
                    ? "bg-white/20" 
                    : "bg-gray-100 dark:bg-gray-700"
                }`}>
                  {getCategoryCount("corporate")}
                </span>
              </button>
            </div>

            {/* Active Filter Indicator */}
            <div className="text-center mb-6">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-nutty-cyan/10 text-nutty-cyan dark:text-nutty-lime rounded-full text-sm">
                <Filter className="w-3 h-3" />
                {activeCategory === "all" 
                  ? t("services.showingAll") || "Showing all services" 
                  : `${t("services.showingCategory") || "Showing"} ${getCategoryCount(activeCategory)} ${t(`services.categories.${activeCategory}`) || activeCategory} ${t("services.services") || "programs"}`}
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Services Grid */}
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredServices.map((service, index) => {
              const svc = service as any;
              return (
                <motion.div
                  key={svc.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: svc.delay }}
                  whileHover={{ y: -10 }}
                  className="group h-full"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 h-full border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col">
                    {/* Image/Header Container */}
                    <Link href={svc.id ? `/services/${svc.id}` : "#services"} className="relative h-48 w-full overflow-hidden block cursor-pointer">
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${svc.color} opacity-90 group-hover:scale-110 transition-transform duration-700`}
                      />
                      {svc.image ? (
                        <Image
                          src={svc.image}
                          alt={svc.title || ""}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                          priority={index < 4}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center p-12">
                          {svc.icon && <svc.icon className="w-full h-full text-white/90" />}
                        </div>
                      )}
                      
                      {/* Category Badge */}
                      <div className="absolute top-4 left-4">
                        <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                          {svc.icon ? <svc.icon className="w-5 h-5 text-white" /> : <Beaker className="w-5 h-5 text-white" />}
                        </div>
                      </div>
                      
                      {/* Category Label */}
                      <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
                        {(svc.category ? svc.category.split(',') : ['families']).map((cat: string) => {
                          const category = cat.trim();
                          return (
                            <div key={category} className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
                              category === 'families' ? 'bg-purple-500/80' :
                              category === 'schools' ? 'bg-green-500/80' :
                              category === 'corporate' ? 'bg-blue-500/80' :
                              'bg-gray-500/80'
                            }`}>
                              {category === 'families' ? t("services.categories.families") :
                               category === 'schools' ? t("services.categories.schools") :
                               category === 'corporate' ? t("services.categories.corporate") :
                               'General'}
                            </div>
                          );
                        })}
                      </div>
                      
                    </Link>

                    {/* Content Container */}
                    <div className="p-6 flex flex-col flex-grow">
                      {/* Title */}
                      <Link href={svc.id ? `/services/${svc.id}` : "#services"}>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-nutty-cyan transition-colors duration-300">
                          {svc.title}
                        </h3>
                      </Link>

                      {/* Description - Truncated to 3 lines */}
                      <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-3 leading-relaxed flex-grow">
                        {svc.description}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mt-2">
                        {svc.duration && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{svc.duration}</span>
                          </div>
                        )}
                        {svc.age_group && (
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>{svc.age_group}</span>
                          </div>
                        )}
                      </div>

                      {/* Learn More Button */}
                      <Link 
                        href={svc.id ? `/services/${svc.id}` : "#services"}
                        className="inline-flex items-center gap-2 text-nutty-cyan dark:text-nutty-lime font-bold group/btn"
                      >
                        <span className="relative">
                          {t("buttons.learnMore")}
                          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-current group-hover/btn:w-full transition-all duration-300" />
                        </span>
                        <svg
                          className={`w-5 h-5 transition-transform duration-300 ${isRTL ? "group-hover/btn:-translate-x-2" : "group-hover/btn:translate-x-2"}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d={isRTL ? "M10 19l-7-7m0 0l7-7m-7 7h18" : "M14 5l7 7m0 0l-7 7m7-7H3"}
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-5xl mb-6">🔍</div>
            <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-3">
              {t("services.noServices") || "No programs found"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
              {t("services.tryDifferentCategory") || "Try selecting a different category or check back later."}
            </p>
            <button
              onClick={() => setActiveCategory("all")}
              className="px-6 py-3 bg-nutty-cyan text-white rounded-full hover:bg-nutty-cyan/90 transition-colors"
            >
              {t("services.viewAllServices") || "View All Programs"}
            </button>
          </motion.div>
        )}

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {[
            {
              value: "98%",
              label: t("services.stats.satisfactionRate") || "Satisfaction Rate",
              icon: "😊",
            },
            {
              value: "5K+",
              label: t("services.stats.happyStudents") || "Happy Students",
              icon: "👨‍🎓",
            },
            {
              value: "200+",
              label: t("services.stats.schoolsPartnered") || "Schools Partnered",
              icon: "🏫",
            },
            {
              value: "24/7",
              label: t("services.stats.supportAvailable") || "Support Available",
              icon: "🕒",
            },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-5xl font-bold text-nutty-cyan dark:text-nutty-lime mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600 dark:text-gray-400 mb-2 text-2xl">
                {stat.icon}
              </div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-nutty-cyan to-nutty-cyan-dark rounded-2xl p-8 md:p-12 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
            </div>
            
            <div className="relative z-10">
              <h3 className="text-3xl font-bold text-white mb-4">
                {t("services.cta.title") || "Ready to Get Started?"}
              </h3>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                {t("services.cta.desc") || "Book your first scientific adventure today and experience the magic of hands-on learning!"}
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button 
                  onClick={() => {
                    const phone = settings?.phone;
                    if (phone) {
                        window.location.href = `tel:${phone}`;
                    } else {
                        const contactSection = document.getElementById("contact");
                        if (contactSection) {
                          contactSection.scrollIntoView({ behavior: "smooth" });
                        }
                    }
                  }}
                  className="px-8 py-3 bg-white text-nutty-cyan rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors transform hover:scale-105 shadow-lg"
                >
                  {t("bookNow") || "Book Now"}
                </button>
                <button 
                  onClick={() => {
                    const contactSection = document.getElementById("contact");
                    if (contactSection) {
                      contactSection.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="px-8 py-3 border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white/10 transition-colors shadow-lg"
                >
                  {t("contact") || "Contact Us"}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;

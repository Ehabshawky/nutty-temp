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
} from "lucide-react";

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
}

const Services = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [dynamicServices, setDynamicServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  const staticServices = [
    {
      icon: Beaker,
      title: t("workshops"),
      description: t("workshopsDesc"),
      color: "from-yellow-400 to-orange-500",
      delay: 0.1,
    },
    {
      icon: FlaskRound,
      title: t("camps"),
      description: t("campsDesc"),
      color: "from-blue-400 to-cyan-500",
      delay: 0.2,
    },
    {
      icon: Users,
      title: t("parties"),
      description: t("partiesDesc"),
      color: "from-green-400 to-emerald-500",
      delay: 0.3,
    },
    {
      icon: Calendar,
      title: t("corporate"),
      description: t("corporateDesc"),
      color: "from-purple-400 to-pink-500",
      delay: 0.4,
    },
    {
      icon: Microscope,
      title: t("services.schoolProgramsTitle"),
      description: t("services.schoolProgramsDesc"),
      color: "from-red-400 to-rose-500",
      delay: 0.5,
    },
    {
      icon: Brain,
      title: t("services.stemTitle"),
      description: t("services.stemDesc"),
      color: "from-indigo-400 to-violet-500",
      delay: 0.6,
    },
    {
      icon: Atom,
      title: t("services.onlineTitle"),
      description: t("services.onlineDesc"),
      color: "from-teal-400 to-blue-500",
      delay: 0.7,
    },
    {
      icon: Rocket,
      title: t("services.competitionsTitle"),
      description: t("services.competitionsDesc"),
      color: "from-orange-400 to-red-500",
      delay: 0.8,
    },
  ];

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch(`/api/services?t=${Date.now()}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setDynamicServices(data);
          }
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
    Beaker, FlaskRound, Atom, Rocket, Brain, Microscope, Users, Calendar, Heart, Shield, Globe, Clock, Award, Target, Eye
  };

  const displayServices = dynamicServices.length > 0 
    ? dynamicServices.map((s, i) => ({
        ...s,
        title: isRTL ? s.title_ar : s.title_en,
        description: isRTL ? s.description_ar : s.description_en,
        icon: iconMap[s.icon as string] || staticServices[i % staticServices.length].icon || Beaker,
        delay: (i % 4) * 0.1 + 0.1,
        color: staticServices[i % staticServices.length].color // Reuse colors
      }))
    : staticServices;

  return (
    <section id="services" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t("servicesTitle")}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            {t("services.lead")}
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayServices.map((service, index) => {
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
                  <div className="relative h-48 w-full overflow-hidden">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${svc.color} opacity-90 group-hover:scale-110 transition-transform duration-700`}
                    />
                    {svc.image ? (
                      <Image
                        src={svc.image}
                        alt={svc.title || ""}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center p-12">
                        {svc.icon && <svc.icon className="w-full h-full text-white/90" />}
                      </div>
                    )}
                    
                    {/* Floating Badge (optional aesthetic) */}
                    <div className="absolute top-4 left-4">
                      <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                        {svc.icon ? <svc.icon className="w-5 h-5 text-white" /> : <Beaker className="w-5 h-5 text-white" />}
                      </div>
                    </div>
                  </div>

                  {/* Content Container */}
                  <div className="p-6 flex flex-col flex-grow">
                    {/* Title */}
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-nutty-blue transition-colors duration-300">
                      {svc.title}
                    </h3>

                    {/* Description - Truncated to 3 lines */}
                    <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-3 leading-relaxed flex-grow">
                      {svc.description}
                    </p>

                    {/* Learn More Button */}
                    <Link 
                      href={svc.id ? `/services/${svc.id}` : "#services"}
                      className="inline-flex items-center gap-2 text-nutty-blue dark:text-nutty-yellow font-bold group/btn"
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
              label: t("services.stats.satisfactionRate"),
              icon: "😊",
            },
            {
              value: "5K+",
              label: t("services.stats.happyStudents"),
              icon: "👨‍🎓",
            },
            {
              value: "200+",
              label: t("services.stats.schoolsPartnered"),
              icon: "🏫",
            },
            {
              value: "24/7",
              label: t("services.stats.supportAvailable"),
              icon: "🕒",
            },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-5xl font-bold text-nutty-blue dark:text-nutty-yellow mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600 dark:text-gray-400 mb-2">
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
          <div className="bg-gradient-to-r from-nutty-blue to-purple-600 rounded-2xl p-8 md:p-12">
            <h3 className="text-3xl font-bold text-white mb-4">
              {t("services.cta.title")}
            </h3>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              {t("services.cta.desc")}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={() => {
                  const contactSection = document.getElementById("contact");
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="px-8 py-3 bg-white text-nutty-blue rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors transform hover:scale-105"
              >
                {t("bookNow")}
              </button>
              <button 
                onClick={() => {
                  const contactSection = document.getElementById("contact");
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="px-8 py-3 border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white/10 transition-colors"
              >
                {t("contact")}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;

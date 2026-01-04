"use client";
import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import {
  Users,
  Target,
  Eye,
  Award,
  Clock,
  Globe,
  Shield,
  Heart,
  ArrowRight,
  Beaker,
  FlaskRound,
  Atom,
  Rocket,
  Brain,
  Microscope,
} from "lucide-react";
import { AboutSkeleton } from "@/components/skeletons/AboutSkeleton";

const About = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [aboutData, setAboutData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchAbout() {
      try {
        const res = await fetch(`/api/site-content?t=${Date.now()}`);
        if (res.ok) {
          const data = await res.json();
          if (data?.about) {
            setAboutData(data.about);
          }
        }
      } catch (err) {
        console.error("Error fetching about content:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAbout();
  }, []);

  const milestones = aboutData?.milestones?.length > 0
    ? aboutData.milestones.map((m: any) => ({
        year: m.year,
        event: isRTL ? m.event_ar : m.event_en
      }))
    : [
        { year: "2010", event: t("about.milestones.2010") },
        { year: "2012", event: t("about.milestones.2012") },
        { year: "2015", event: t("about.milestones.2015") },
        { year: "2018", event: t("about.milestones.2018") },
        { year: "2020", event: t("about.milestones.2020") },
        { year: "2023", event: t("about.milestones.2023") },
        { year: "2025", event: t("about.milestones.2025") },
      ];

  const iconMap: Record<string, any> = {
    Heart, Users, Shield, Globe, Clock, Award, Beaker, FlaskRound, Atom, Rocket, Brain, Microscope, Target, Eye
  };

  const displayValues = aboutData?.values?.length > 0
    ? aboutData.values.map((v: any) => ({
        icon: iconMap[v.icon] || Heart,
        title: isRTL ? v.title_ar : v.title_en,
        description: isRTL ? v.description_ar : v.description_en
      }))
    : [
        {
          icon: Heart,
          title: t("about.value1Title"),
          description: t("about.value1Desc"),
        },
        {
          icon: Users,
          title: t("about.value2Title"),
          description: t("about.value2Desc"),
        },
        {
          icon: Shield,
          title: t("about.value3Title"),
          description: t("about.value3Desc"),
        },
        {
          icon: Globe,
          title: t("about.value4Title"),
          description: t("about.value4Desc"),
        },
        {
          icon: Clock,
          title: t("about.value5Title"),
          description: t("about.value5Desc"),
        },
        {
          icon: Award,
          title: t("about.value6Title"),
          description: t("about.value6Desc"),
        },
      ];

  if (loading) {
     return <AboutSkeleton />;
  }

  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {(isRTL ? aboutData?.hero?.title_ar : aboutData?.hero?.title_en) || t("aboutTitle")}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            {(isRTL ? aboutData?.hero?.subtitle_ar : aboutData?.hero?.subtitle_en) || t("about.lead")}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl p-8"
          >
            <div className="flex items-center mb-6">
              <Target className="w-12 h-12 text-nutty-cyan mr-4" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {(isRTL ? aboutData?.mission?.title_ar : aboutData?.mission?.title_en) || t("mission")}
              </h3>
            </div>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              {(isRTL ? aboutData?.mission?.description_ar : aboutData?.mission?.description_en) || t("missionText")}
            </p>
          </motion.div>

          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl p-8"
          >
            <div className="flex items-center mb-6">
              <Eye className="w-12 h-12 text-nutty-lime mr-4" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {(isRTL ? aboutData?.vision?.title_ar : aboutData?.vision?.title_en) || t("vision")}
              </h3>
            </div>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              {(isRTL ? aboutData?.vision?.description_ar : aboutData?.vision?.description_en) || t("visionText")}
            </p>
          </motion.div>
        </div>

        {/* Our Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h3 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            {t("about.coreValues")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayValues.map((value: any, index: number) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center hover:shadow-xl transition-all"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-nutty-cyan/10 rounded-full flex items-center justify-center">
                  <value.icon className="w-8 h-8 text-nutty-cyan" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {value.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h3 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            {t("about.journey")}
          </h3>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-nutty-cyan to-nutty-lime"></div>

            {milestones.map((milestone: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative flex items-center mb-12 ${
                  index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                }`}
              >
                {/* Content */}
                <div
                  className={`w-5/12 ${
                    index % 2 === 0 ? "text-right pr-8" : "text-left pl-8"
                  }`}
                >
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                    <div className="text-2xl font-bold text-nutty-cyan-dark dark:text-nutty-lime mb-2">
                      {milestone.year}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">
                      {milestone.event}
                    </p>
                  </div>
                </div>

                {/* Dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white border-4 border-nutty-cyan rounded-full"></div>

                {/* Empty space for alignment */}
                <div className="w-5/12"></div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-nutty-cyan to-nutty-cyan-dark rounded-2xl p-8 md:p-12"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
                { value: "98%", label: t("about.stats.satisfactionRate") },
                { value: "5K+", label: t("about.stats.happyStudents") },
                { value: "200+", label: t("about.stats.schoolsPartnered") },
                { value: "12/7", label: t("about.stats.supportAvailable") },
              ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-lg text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* More About Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Link
            href="/about"
            className="inline-flex items-center gap-2 px-8 py-4 bg-nutty-cyan text-white rounded-full font-bold text-lg hover:bg-nutty-cyan/90 transition-all transform hover:scale-105 shadow-lg group"
          >
            {isRTL ? "المزيد عنا" : "More About Us"}
            <ArrowRight className={`w-5 h-5 transition-transform duration-300 ${isRTL ? "rotate-180 group-hover:-translate-x-2" : "group-hover:translate-x-2"}`} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default About;

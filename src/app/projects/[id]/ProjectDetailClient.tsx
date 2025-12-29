"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  ArrowLeft, 
  Calendar, 
  Users, 
  ExternalLink, 
  Github, 
  Target,
  Sparkles
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Projects from "@/components/sections/Projects";

interface Project {
  id: string;
  title: string;
  category: string;
  description_en: string;
  description_ar: string;
  image: string;
  technologies: string[];
  date: string;
  team: number;
  link: string;
  github: string;
  featured: boolean;
}

export default function ProjectDetailClient({ id }: { id: string }) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await fetch(`/api/projects?id=${id}`);
        if (res.ok) {
          const data = await res.json();
          // The public API returns an array or we might need to filter
          const found = data.find((p: any) => p.id === id);
          setProject(found || null);
        }
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-nutty-orange"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <Target className="w-20 h-20 text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {isRTL ? "المشروع غير موجود" : "Project Not Found"}
        </h1>
        <button
          onClick={() => router.push("/#projects")}
          className="px-6 py-2 bg-nutty-orange text-white rounded-lg hover:bg-nutty-orange/90 transition-colors"
        >
          {isRTL ? "العودة للمشاريع" : "Back to Projects"}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir={isRTL ? "rtl" : "ltr"}>
      
      <main className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button
            onClick={() => router.push("/#projects")}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-nutty-orange transition-colors mb-8"
          >
            <ArrowLeft className={`w-5 h-5 ${isRTL ? 'rotate-180 ml-2' : 'mr-2'}`} />
            {isRTL ? "العودة إلى المشاريع" : "Back to Projects"}
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Project Image */}
            <div className="relative h-[400px] md:h-[600px] rounded-3xl overflow-hidden shadow-2xl group">
              <Image
                src={project.image || "/About.jpg"}
                alt={project.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                priority
              />
              {project.featured && (
                <div className="absolute top-6 left-6">
                  <span className="px-4 py-2 bg-nutty-yellow text-gray-900 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    {isRTL ? "مشروع مميز" : "Featured Project"}
                  </span>
                </div>
              )}
            </div>

            {/* Project Info */}
            <div className="flex flex-col">
              <div className="mb-6">
                <span className="px-4 py-1.5 bg-nutty-blue/10 text-nutty-blue rounded-full text-sm font-bold uppercase tracking-wider">
                  {project.category}
                </span>
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mt-4 mb-6 leading-tight">
                  {project.title}
                </h1>
              </div>

              <div className="prose prose-lg dark:prose-invert max-w-none mb-10">
                <div className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {isRTL ? (project.description_ar || project.description_en) : project.description_en}
                </div>
              </div>

              {/* Meta Stats */}
              <div className="grid grid-cols-2 gap-6 mb-10">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
                  <div className="w-12 h-12 bg-nutty-orange/10 rounded-xl flex items-center justify-center text-nutty-orange">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">{isRTL ? "السنة" : "Year"}</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{project.date}</p>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
                  <div className="w-12 h-12 bg-nutty-blue/10 rounded-xl flex items-center justify-center text-nutty-blue">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">{isRTL ? "الفريق" : "Team"}</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{project.team} {isRTL ? "أفراد" : "Members"}</p>
                  </div>
                </div>
              </div>

              {/* Technologies */}
              <div className="mb-10">
                <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4">
                  {isRTL ? "التقنيات المستخدمة" : "Technologies Used"}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-xl text-sm font-semibold border border-gray-200 dark:border-gray-700 hover:bg-nutty-orange hover:text-white hover:border-nutty-orange transition-all duration-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 mt-auto">
                <a
                  href={project.link}
                  className="flex-1 flex items-center justify-center px-8 py-4 bg-nutty-orange text-white rounded-2xl font-bold text-lg hover:bg-nutty-orange/90 transition-all shadow-lg hover:shadow-nutty-orange/20 transform hover:-translate-y-1"
                >
                  <ExternalLink className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {isRTL ? "عرض المشروع" : "View Live Project"}
                </a>
                {project.github && (
                  <a
                    href={project.github}
                    className="flex items-center justify-center px-8 py-4 bg-gray-900 dark:bg-gray-700 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-lg hover:shadow-black/20 transform hover:-translate-y-1"
                  >
                    <Github className="w-6 h-6" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    <Projects/>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  ExternalLink, 
  Github, 
  Filter,
  Calendar,
  Users,
  Target
} from 'lucide-react';
import i18n from '@/utils/i18n';
import { Skeleton } from "@/components/ui/Skeleton";
import { ProjectCardSkeleton } from "@/components/skeletons/ProjectCardSkeleton";
import { FeaturedProjectSkeleton } from "@/components/skeletons/FeaturedProjectSkeleton";

const FeaturedProjectCard = ({ 
  project, 
  index, 
  t, 
  currentLanguage, 
  getCategoryTranslation, 
  formatProjectLink 
}: any) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const description = project.description[currentLanguage] || project.description.en;
  const shouldTruncate = description.length > 150;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.1 }}
      className="group h-full"
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
        {/* Project Image */}
        <div className="relative h-64 overflow-hidden flex-shrink-0">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 bg-nutty-lime text-gray-900 rounded-full text-sm font-semibold">
              {t('projects.featured')}
            </span>
          </div>
        </div>

        {/* Project Content */}
        <div className="p-6 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {project.title}
            </h3>
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
              {getCategoryTranslation(project.category)}
            </span>
          </div>

          <div className="mb-6 flex-grow">
            <p className={`text-gray-600 dark:text-gray-400 ${!isExpanded ? 'line-clamp-3' : ''}`}>
              {description}
            </p>
            {shouldTruncate && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-nutty-cyan hover:text-blue-700 text-sm font-medium mt-2 inline-flex items-center"
              >
                {isExpanded ? (currentLanguage === 'ar' ? 'عرض أقل' : 'Show Less') : (currentLanguage === 'ar' ? 'المزيد' : 'Read More')}
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {project.technologies.map((tech: string, i: number) => (
              <span
                key={i}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Project Meta */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4 mr-2" />
                {project.date}
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Users className="w-4 h-4 mr-2" />
                {project.team} {t('projects.meta.members')}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 rtl:space-x-reverse mt-auto">
            <a
              href={formatProjectLink(project.id)}
              className="flex-1 flex items-center justify-center px-4 py-2 bg-nutty-cyan text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              {t('projects.action.viewProject')}
            </a>
            {project.github && (
              <a
                href={project.github}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Projects = () => {
  const { t, i18n } = useTranslation();
  const [filter, setFilter] = useState('all');
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load projects
  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await fetch(`/api/projects?t=${Date.now()}`);
        if (res.ok) {
          const data = await res.json();
          setProjects(data);
        }
      } catch (error) {
        console.error("Error loading projects:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, []);

  // Update links to point to detail pages
  const formatProjectLink = (id: string) => `/projects/${id}`;

  // Get all unique categories from projects
  const projectCategories = ['all', ...new Set(projects.map(project => project.category))];

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(project => project.category === filter);

  // Get translation for category
  const getCategoryTranslation = (category: string) => {
    if (category === 'all') return t('projects.categories.all');
    return t(`projects.categories.${category}`);
  };

  // Get current language
  const currentLanguage = (i18n.language || 'en') as 'en' | 'ar';

  if (loading) {
     return (
       <section id="projects" className="py-20 bg-gray-50 dark:bg-gray-900">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header Skeleton */}
            <div className="text-center mb-12 space-y-4">
              <Skeleton className="h-10 w-48 mx-auto rounded-lg" />
              <Skeleton className="h-6 w-96 mx-auto rounded-lg" />
            </div>
            
            {/* Filter Skeleton */}
            <div className="flex justify-center gap-4 mb-12">
               {[1,2,3].map(i => <Skeleton key={i} className="h-12 w-32 rounded-full" />)}
            </div>

            {/* Featured Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
               <FeaturedProjectSkeleton />
               <FeaturedProjectSkeleton />
            </div>

            {/* Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {[...Array(6)].map((_, i) => <ProjectCardSkeleton key={i} />)}
            </div>
         </div>
       </section>
     );
  }

  return (
    <section id="projects" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t('projects.title')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            {t('projects.lead')}
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {projectCategories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-6 py-3 rounded-full transition-all ${
                filter === category
                  ? 'bg-nutty-cyan text-white'
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {category === 'all' && <Filter className="w-4 h-4 inline mr-2" />}
              {getCategoryTranslation(category)}
            </button>
          ))}
        </motion.div>

        {/* Featured Projects */}
        <AnimatePresence>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {filteredProjects
              .filter(project => project.featured)
              .map((project, index) => (
                <FeaturedProjectCard 
                  key={project.id} 
                  project={project} 
                  index={index} 
                  t={t} 
                  currentLanguage={currentLanguage} 
                  getCategoryTranslation={getCategoryTranslation} 
                  formatProjectLink={formatProjectLink}
                />
              ))}
          </div>
        </AnimatePresence>

        {/* All Projects Grid */}
        <AnimatePresence>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects
              .filter(project => !project.featured)
              .map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-nutty-cyan transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                        {project.description[currentLanguage] || project.description.en}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                          {getCategoryTranslation(project.category)}
                        </span>
                        <a
                          href={formatProjectLink(project.id)}
                          className="text-nutty-cyan hover:text-blue-700 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        </AnimatePresence>

        {/* Show message when no projects found */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {currentLanguage === 'ar' ? 'لم يتم العثور على مشاريع في هذا القسم.' : 'No projects found in this category.'}
            </p>
          </motion.div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-nutty-lime to-orange-500 rounded-2xl p-8 md:p-12">
            <Target className="w-16 h-16 mx-auto mb-6 text-white" />
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              {t('projects.cta.title')}
            </h3>
            <p className="text-xl text-gray-800 mb-8 max-w-2xl mx-auto">
              {t('projects.cta.desc')}
            </p>
            <button className="px-8 py-3 bg-gray-900 text-white rounded-full font-semibold text-lg hover:bg-gray-800 transition-colors transform hover:scale-105">
              {t('projects.cta.button')}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;

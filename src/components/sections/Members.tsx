"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { 
  Mail, 
  Linkedin, 
  Twitter, 
  Github,
  Award,
  BookOpen,
  Briefcase,
  GraduationCap
} from 'lucide-react';
import { Skeleton } from "@/components/ui/Skeleton";
import { MemberCardSkeleton, FeaturedMemberSkeleton } from "@/components/skeletons/TeamMemberSkeleton";

const Members = () => {
  const { t, i18n } = useTranslation();
  const [activeFilter, setActiveFilter] = useState('all');
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedBios, setExpandedBios] = useState<Record<string, boolean>>({});
  const [selectedMember, setSelectedMember] = useState<any>(null);

  // Load team members
  useEffect(() => {
    async function loadTeam() {
      try {
        const res = await fetch(`/api/team?t=${Date.now()}`);
        if (res.ok) {
          const data = await res.json();
          setTeamMembers(data);
        }
      } catch (error) {
        console.error("Error loading team members:", error);
      } finally {
        setLoading(false);
      }
    }
    loadTeam();
  }, []);

  const toggleBio = (id: string) => {
    setExpandedBios(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const departments = [
    { id: 'all', label: { en: 'All Team', ar: 'الفريق كامل' }, count: teamMembers.length },
    { id: 'ceo', label: { en: 'CEO', ar: 'الإدارة' }, count: teamMembers.filter(m => m.department === 'ceo').length },
    { id: 'marketing', label: { en: 'Marketing', ar: 'التسويق' }, count: teamMembers.filter(m => m.department === 'marketing').length },
    { id: 'technology', label: { en: 'Technology', ar: 'التكنولوجيا' }, count: teamMembers.filter(m => m.department === 'technology').length },
    { id: 'operations', label: { en: 'Operations', ar: 'العمليات' }, count: teamMembers.filter(m => m.department === 'operations').length }
  ];

  const filteredMembers = activeFilter === 'all' 
    ? teamMembers 
    : teamMembers.filter(member => member.department === activeFilter);

  // Get current language
  const currentLanguage = (i18n.language || 'en') as 'en' | 'ar';
  const isRTL = i18n.language === 'ar';

  if (loading) {
     return (
       <section id="members" className="py-20 bg-white dark:bg-gray-900">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 space-y-4">
               <Skeleton className="h-10 w-64 mx-auto rounded-lg" />
               <Skeleton className="h-6 w-1/2 mx-auto rounded-lg" />
            </div>

            <div className="flex justify-center gap-4 mb-12">
               {[1,2,3,4].map(i => <Skeleton key={i} className="h-12 w-32 rounded-full" />)}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
               <FeaturedMemberSkeleton />
               <FeaturedMemberSkeleton />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
               {[...Array(6)].map((_, i) => <MemberCardSkeleton key={i} />)}
            </div>
         </div>
       </section>
     );
  }

  return (
    <section id="members" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t('teamMembers')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            {currentLanguage === 'ar' 
              ? 'علماء ومعلمون ومبتكرون شغوفون مكرسون لإلهام الجيل القادم'
              : 'Passionate scientists, educators, and innovators dedicated to inspiring the next generation'
            }
          </p>
        </motion.div>

        {/* Department Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {departments.map((dept) => (
            <button
              key={dept.id}
              onClick={() => setActiveFilter(dept.id)}
              className={`px-6 py-3 rounded-full transition-all flex items-center space-x-2 rtl:space-x-reverse ${
                activeFilter === dept.id
                  ? 'bg-nutty-cyan text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <span className="font-semibold">{dept.label[currentLanguage]}</span>
              <span className="px-2 py-0.5 text-xs bg-black/10 dark:bg-white/10 rounded-full">
                {dept.count}
              </span>
            </button>
          ))}
        </motion.div>

        {/* Featured Members */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {filteredMembers
            .filter(member => member.featured)
            .map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <div className="bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-gray-800/50 dark:to-gray-800/50 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 h-full">
                  <div className="flex flex-col md:flex-row gap-8">
                    {/* Member Image */}
                    <div className="flex-shrink-0 cursor-pointer" onClick={() => setSelectedMember(member)}>
                      <div className="relative w-48 h-48 mx-auto md:mx-0">
                        <div className="absolute inset-0 bg-gradient-to-br from-nutty-cyan to-nutty-cyan-dark rounded-2xl transform rotate-3 group-hover:rotate-6 transition-transform"></div>
                        <img
                          src={member.image || '/default-avatar.avif'}
                          alt={member.name}
                          className="relative w-full h-full object-cover rounded-2xl shadow-lg"
                        />
                      </div>
                    </div>

                    {/* Member Info */}
                    <div className="flex-1 min-w-0">
                      <div className="mb-4">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white cursor-pointer hover:text-nutty-cyan transition-colors" onClick={() => setSelectedMember(member)}>
                          {member.name}
                        </h3>
                        <p className="text-nutty-cyan dark:text-nutty-lime font-bold uppercase tracking-wider text-sm">
                          {member.position[currentLanguage]}
                        </p>
                      </div>

                      <div className="mb-6">
                        <p className={`text-gray-600 dark:text-gray-400 leading-relaxed ${expandedBios[member.id] ? '' : 'line-clamp-4'}`}>
                          {member.bio[currentLanguage]}
                        </p>
                        {member.bio[currentLanguage]?.length > 180 && (
                          <button 
                            onClick={() => toggleBio(member.id)}
                            className="text-nutty-orange font-bold text-sm mt-2 hover:underline"
                          >
                            {expandedBios[member.id] ? (isRTL ? 'عرض أقل' : 'Show Less') : (isRTL ? 'إقرأ المزيد...' : 'Read More...')}
                          </button>
                        )}
                      </div>

                      {/* Education */}
                      <div className="flex items-start mb-4 bg-white/50 dark:bg-black/20 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                        <GraduationCap className="w-5 h-5 text-nutty-orange mt-0.5 mr-3 rtl:ml-3 flex-shrink-0" />
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {member.education[currentLanguage]}
                        </p>
                      </div>

                      {/* Expertise */}
                      <div className="mb-6">
                        <div className="flex items-center mb-2">
                          <Award className="w-4 h-4 text-gray-500 mr-2 rtl:ml-2" />
                          <span className="text-xs font-black text-gray-500 uppercase tracking-widest">
                            {currentLanguage === 'ar' ? 'الخبرات والتخصص' : 'Expertise'}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {member.skills.map((skill: string, i: number) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-bold border border-gray-100 dark:border-gray-600 shadow-sm"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Social Links */}
                      <div className="flex space-x-4 rtl:space-x-reverse pt-4 border-t border-gray-100 dark:border-gray-700">
                        <a
                          href={`mailto:${member.email}`}
                          className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-nutty-cyan hover:text-white transition-all transform hover:-translate-y-1 shadow-sm"
                          title="Email"
                        >
                          <Mail className="w-5 h-5" />
                        </a>
                        {member.social?.linkedin && (
                          <a
                            href={member.social.linkedin}
                            className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-1 shadow-sm"
                            title="LinkedIn"
                          >
                            <Linkedin className="w-5 h-5" />
                          </a>
                        )}
                        {member.social?.twitter && (
                          <a
                            href={member.social.twitter}
                            className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-sky-500 hover:text-white transition-all transform hover:-translate-y-1 shadow-sm"
                            title="Twitter"
                          >
                            <Twitter className="w-5 h-5" />
                          </a>
                        )}
                        <button 
                          onClick={() => setSelectedMember(member)}
                          className="px-6 py-2 bg-nutty-cyan text-white rounded-xl font-bold text-xs hover:bg-nutty-cyan/90 transition-all transform hover:-translate-y-1 shadow-md shadow-nutty-cyan/20 uppercase tracking-wider h-10 ml-auto rtl:ml-0 rtl:mr-auto"
                        >
                          {currentLanguage === 'ar' ? 'عرض الملف' : 'Profile'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
        </div>

        {/* Regular Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredMembers
            .filter(member => !member.featured)
            .map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                className="group h-full"
              >
                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700 flex flex-col h-full">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden cursor-pointer" onClick={() => setSelectedMember(member)}>
                    <img
                      src={member.image || '/default-avatar.avif'}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 rtl:left-auto rtl:right-4">
                      <span className="px-3 py-1 bg-nutty-cyan/90 text-white rounded-full text-xs font-bold uppercase tracking-wider">
                        {departments.find(d => d.id === member.department)?.label[currentLanguage] || member.department}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 cursor-pointer hover:text-nutty-cyan transition-colors" onClick={() => setSelectedMember(member)}>
                        {member.name}
                      </h3>
                      <p className="text-nutty-cyan dark:text-nutty-lime text-sm font-bold uppercase tracking-wide">
                        {member.position[currentLanguage]}
                      </p>
                    </div>

                    <div className="flex-1">
                      <p className={`text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4 ${expandedBios[member.id] ? '' : 'line-clamp-3'}`}>
                        {member.bio[currentLanguage]}
                      </p>
                      {member.bio[currentLanguage]?.length > 100 && (
                        <button 
                          onClick={() => toggleBio(member.id)}
                          className="text-nutty-orange font-bold text-xs mb-4 hover:underline block"
                        >
                          {expandedBios[member.id] ? (isRTL ? 'إخفاء' : 'Show Less') : (isRTL ? 'اقرأ المزيد' : 'Read More')}
                        </button>
                      )}
                    </div>
                    
                    {/* Expertise */}
                    <div className="mb-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex flex-wrap gap-1.5">
                        {member.skills.slice(0, 3).map((skill: string, i: number) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-[10px] font-bold border border-gray-100 dark:border-gray-600 shadow-sm"
                          >
                            {skill}
                          </span>
                        ))}
                        {member.skills.length > 3 && (
                          <span className="px-2 py-1 text-gray-500 text-[10px] font-bold">
                            +{member.skills.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Social Links */}
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex space-x-3 rtl:space-x-reverse">
                        <a
                          href={`mailto:${member.email}`}
                          className="text-gray-400 hover:text-nutty-cyan transition-colors"
                          title="Email"
                        >
                          <Mail className="w-5 h-5" />
                        </a>
                        {member.social?.linkedin && (
                          <a
                            href={member.social.linkedin}
                            className="text-gray-400 hover:text-blue-600 transition-colors"
                            title="LinkedIn"
                          >
                            <Linkedin className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                      <button 
                        onClick={() => setSelectedMember(member)}
                        className="text-xs font-bold text-nutty-cyan hover:text-blue-700 transition-colors uppercase tracking-wider"
                      >
                        {currentLanguage === 'ar' ? 'عرض الملف' : 'Profile'}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
        </div>

        {/* Join Team CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-nutty-lime to-nutty-orange rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-nutty-orange/20">
            <Briefcase className="w-16 h-16 mx-auto mb-6 text-white" />
            <h3 className="text-3xl font-bold text-white mb-4">
              {currentLanguage === 'ar' ? 'هل تريد الانضمام إلى فريقنا؟' : 'Want to Join Our Team?'}
            </h3>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto font-medium">
              {currentLanguage === 'ar' 
                ? 'نحن نبحث دائمًا عن أفراد شغوفين يريدون إحداث فرق في التعليم العلمي.'
                : "We're always looking for passionate individuals who want to make a difference in science education."
              }
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href="/careers" 
                className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold text-lg hover:bg-black transition-all transform hover:-translate-y-1 shadow-lg shadow-black/20 flex items-center justify-center gap-2"
              >
                {currentLanguage === 'ar' ? 'عرض الوظائف المتاحة' : 'View Open Positions'}
              </Link>
              <Link 
                href="/#contact" 
                className="px-8 py-4 border-2 border-white text-white rounded-2xl font-bold text-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
              >
                {currentLanguage === 'ar' ? 'تقديم السيرة الذاتية' : 'Submit Your CV'}
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Member Modal */}
        {selectedMember && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedMember(null)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden w-full max-w-4xl max-h-[90vh] shadow-2xl relative flex flex-col md:flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedMember(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors backdrop-blur-sm"
              >
                <span className="text-2xl leading-none">&times;</span>
              </button>

              <div className="flex flex-col md:flex-row h-full overflow-y-auto w-full">
                {/* Left Side - Image */}
                <div className="md:w-5/12 relative h-64 sm:h-72 md:h-auto flex-shrink-0">
                  <img 
                    src={selectedMember.image || '/default-avatar.avif'} 
                    alt={selectedMember.name} 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/10"></div>
                  <div className="absolute bottom-6 left-6 md:hidden text-white z-10">
                    <h2 className="text-2xl sm:text-3xl font-black mb-1 drop-shadow-md">{selectedMember.name}</h2>
                    <p className="text-nutty-lime font-bold uppercase tracking-widest text-xs sm:text-sm drop-shadow-md">{selectedMember.position[currentLanguage]}</p>
                  </div>
                </div>

                {/* Right Side - Content */}
                <div className="md:w-7/12 p-6 md:p-10 flex flex-col">
                  {/* Desktop Header */}
                  <div className="hidden md:block mb-6">
                    <h2 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white mb-2 leading-tight">{selectedMember.name}</h2>
                    <p className="text-nutty-cyan dark:text-nutty-lime font-black uppercase tracking-[0.2em] text-sm">
                      {selectedMember.position[currentLanguage]}
                    </p>
                  </div>

                  <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic text-lg">
                      "{selectedMember.bio[currentLanguage]}"
                    </p>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 gap-6 mb-8">
                    {/* Education */}
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-nutty-orange/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="w-5 h-5 text-nutty-orange" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{isRTL ? 'التعليم' : 'Education'}</h4>
                        <p className="text-gray-800 dark:text-white font-bold">{selectedMember.education[currentLanguage]}</p>
                      </div>
                    </div>

                    {/* Department */}
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-nutty-cyan/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-5 h-5 text-nutty-cyan" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{isRTL ? 'القسم' : 'Department'}</h4>
                        <p className="text-gray-800 dark:text-white font-bold">
                          {departments.find(d => d.id === selectedMember.department)?.label[currentLanguage] || selectedMember.department}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="mb-10">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      {isRTL ? 'التخصصات والمهارات' : 'Expertise & Skills'}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedMember.skills.map((skill: string, i: number) => (
                        <span 
                          key={i}
                          className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-600 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 shadow-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Social & Contact */}
                  <div className="flex items-center gap-4 pt-8 border-t border-gray-100 dark:border-gray-700">
                    <a 
                      href={`mailto:${selectedMember.email}`}
                      className="flex items-center gap-2 px-6 py-3 bg-nutty-cyan text-white rounded-xl font-bold hover:bg-nutty-cyan/90 transition-all transform hover:-translate-y-1 shadow-lg shadow-nutty-cyan/20"
                    >
                      <Mail className="w-4 h-4" />
                      {isRTL ? 'تواصل' : 'Contact'}
                    </a>
                    {selectedMember.social?.linkedin && (
                      <a 
                        href={selectedMember.social.linkedin}
                        className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-1"
                      >
                        <Linkedin className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Members;

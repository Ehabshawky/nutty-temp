"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Beaker,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Send,
} from "lucide-react";
import Link from "next/link";

const Footer = () => {
  const { t, i18n } = useTranslation();
  const [editableFooter, setEditableFooter] = useState<any>(null);
  const [settings, setSettings] = useState<any>({
    logo_url: "/Nutt Logo.png",
    contact_email: "info@nuttyscientists-egypt.com",
    career_email: "careers@nuttyscientists.com",
    phone: "01222668543",
    address_en: "Garden 8 mall, New Cairo, 1st Settlement",
    address_ar: "مول جاردن 8، القاهرة الجديدة، الحي الأول"
  });
  const [services, setServices] = useState<any[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    async function load() {
      try {
        // تحميل إعدادات الموقع
        const res = await fetch("/api/site-content?t=" + Date.now());
        if (!res.ok) return;
        const data = await res.json();
        if (!mounted) return;
        if (data?.footer) setEditableFooter(data.footer);
        if (data?.settings) setSettings(data.settings);
      } catch (e) {
        console.error("Error loading site content:", e);
      }
    }
    
    load();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    
    async function loadServices() {
      try {
        setLoadingServices(true);
        const res = await fetch("/api/services?limit=8");
        if (!res.ok) {
          console.error("Failed to fetch services");
          return;
        }
        
        const data = await res.json();
        if (!mounted) return;
        
        if (Array.isArray(data) && data.length > 0) {
          setServices(data);
        }
      } catch (e) {
        console.error("Error loading services:", e);
      } finally {
        if (mounted) setLoadingServices(false);
      }
    }
    
    loadServices();
    return () => {
      mounted = false;
    };
  }, []);

  const currentLanguage = (i18n.language || 'en') as 'en' | 'ar';
  const isArabic = currentLanguage === 'ar';

  const quickLinks = [
    { label: t("home"), href: "#home" },
    { label: t("servicesNav"), href: "#services" },
    { label: t("aboutNav"), href: "#about" },
    { label: t("members"), href: "#members" },
    // { label: t("articles"), href: "#articles" },
    // { label: t("testimonials"), href: "#testimonials" },
    { label: t("blogs"), href: "#blogs" },
    { label: t("contact"), href: "#contact" },
  ];

  // دالة لتصفية الخدمات وحذف التكرارات
  const getUniqueServices = (servicesArray: any[]) => {
    const seenTitles = new Set();
    return servicesArray.filter(service => {
      const title = isArabic ? service.title_ar : service.title_en;
      if (!title || seenTitles.has(title)) return false;
      seenTitles.add(title);
      return true;
    });
  };

  const socialLinks = [
    { icon: Facebook, href: "https://www.facebook.com/NS.Egypt", label: "Facebook" },
    // { icon: Twitter, href: "https://x.com/NuttyWexford", label: "Twitter" },
    { icon: Instagram, href: "https://www.instagram.com/nuttyscientistsegy", label: "Instagram" },
    { icon: Youtube, href: "https://www.youtube.com/@nuttyscientistsegypt30", label: "YouTube" },
    { icon: Linkedin, href: "https://www.linkedin.com/company/2860329", label: "LinkedIn" },
    
  ];

  const footerTexts = {
    quickLinks: isArabic ? "روابط سريعة" : "Quick Links",
    ourServices: isArabic ? "برامجنا" : "Our Programs",
    contactInfo: isArabic ? "معلومات الاتصال" : "Contact Info",
    newsletterTitle: isArabic ? "اشترك في النشرة البريدية" : "Subscribe to Newsletter",
    newsletterPlaceholder: isArabic ? "بريدك الإلكتروني" : "Your email",
    privacyPolicy: isArabic ? "سياسة الخصوصية" : "Privacy Policy",
    termsOfService: isArabic ? "شروط الخدمة" : "Terms of Service",
    cookiePolicy: isArabic ? "سياسة الكوكيز" : "Cookie Policy",
    careers: isArabic ? "الوظائف" : "Careers",
    backToTop: isArabic ? "العودة للأعلى" : "Back to top",
    addressLine1: isArabic ? "مول جاردن 8" : "Garden 8 mall",
    addressLine2: isArabic ? "القاهرة الجديدة، الحي الأول" : "New Cairo , 1st Settlement",
    loadingServices: isArabic ? "جاري تحميل البرامج..." : "Loading programs...",
    noServices: isArabic ? "لا توجد برامج متاحة حالياً" : "No programs available",
    viewAllServices: isArabic ? "عرض جميع البرامج" : "View All Programs",
  };

  // خدمات افتراضية للنسخة الاحتياطية إذا فشل تحميل البيانات
  const fallbackServices = {
    en: [
      "Interactive Workshops",
      "Science Camps",
      "School Programs",
      "Corporate Events",
      "Science Parties",
      "Online Courses",
      "Teacher Training",
      "Curriculum Development",
    ],
    ar: [
      "ورش عمل تفاعلية",
      "معسكرات علمية",
      "برامج مدرسية",
      "فعاليات الشركات",
      "حفلات علمية",
      "دورات أونلاين",
      "تدريب المعلمين",
      "تطوير المناهج",
    ]
  };
  
  return (
    <footer className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white pt-16 pb-8 relative overflow-hidden">
      {/* SVG Wave Decoration - Top */}
      <div className="absolute top-0 left-0 w-[100%] h-[100%] pointer-events-none overflow-hidden z-0">
        <svg viewBox="0 0 1440 120" className="w-full h-full" preserveAspectRatio="none">
           {/* Cyan Wave */}
           <path
            d="M0,0 L1440,0 L1440,120 L0,120 Z"
             fill="#00BCD4" // Nutty Cyan
             opacity="0.6"
           />
           {/* Lime Strip at top edge to inverse the navbar? No, let's keep it consistent pattern */}
           {/* Actually image 3 shows Cyan curve then white. The bottom bar is Lime. */}
           {/* Let's try: Top of footer is the Cyan curve coming down? */}
           {/* If we want to match Image 3 'Bottom' style: Blue Curve then Green Bar. */}
           {/* Since this is the footer TOP, maybe we just do the decoration. */}
           
           <path
             d="M0,0 L1440,0 L1440,20 Q720,60 0,20 Z"
             fill="#C4D600"
             opacity="0.6"
           />
        </svg>
      </div>
      
      {/* SVG Wave Decoration - Bottom Right */}
      <div className="absolute bottom-0 right-0 w-[100%] h-[100%] opacity-10 pointer-events-none">
        <svg viewBox="0 0 1440 120" className="w-full h-full" preserveAspectRatio="none">
          <path
            d="M300,200 L300,100 Q200,80 100,100 T0,100 L0,200 Z"
            fill="#00BCD4"
            opacity="0.6"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 ${isArabic ? 'rtl-container text-right' : 'text-left'}`}>
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`${isArabic ? "arabic-text" : ""} w-full`}
          >
            <div className="flex items-center mb-6 justify-center md:justify-start">
              <img
                src={settings.logo_url || "/Nutt Logo.png"}
                alt="Nutty Scientists Logo"
                className="w-40 h-auto md:w-48 lg:w-56 object-contain"
              />
            </div>
            <p className="text-gray-900 dark:text-gray-300 mb-6">
              {editableFooter?.description_ar || t("heroDescription")}
            </p>
            <div className={`flex ${isArabic ? 'space-x-reverse' : ''} space-x-4`}>
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-nutty-yellow hover:text-white transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className={isArabic ? "arabic-text" : ""}
          >
            <h3 className="text-xl font-bold mb-6">{footerTexts.quickLinks}</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-900 dark:text-gray-300 hover:text-nutty-yellow transition-colors block py-1"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services - Dynamic from Database */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className={isArabic ? "arabic-text" : ""}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">{footerTexts.ourServices}</h3>
              <Link 
                href="/services" 
                className="text-sm text-nutty-yellow hover:text-yellow-400 transition-colors font-medium"
              >
              </Link>
            </div>
            
            {loadingServices ? (
              <div className="py-4">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-nutty-yellow"></div>
                  <span className="text-gray-400 text-sm">{footerTexts.loadingServices}</span>
                </div>
              </div>
            ) : services.length > 0 ? (
              <ul className="space-y-3">
                {getUniqueServices(services).slice(0, 8).map((service, index) => (
                  <li key={service.id || index}>
                    <Link
                      href={`/services/${service.id}`}
                      className="text-gray-900 dark:text-gray-300 hover:text-nutty-yellow transition-colors block py-1 hover:translate-x-2 transition-transform duration-300"
                    >
                      {isArabic ? service.title_ar || service.title_en : service.title_en || service.title_ar}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <>
                <p className="text-gray-900 dark:text-gray-200 mb-3">{footerTexts.noServices}</p>
                <ul className="space-y-3">
                  {fallbackServices[currentLanguage].slice(0, 8).map((service, index) => (
                    <li key={index}>
                      <a
                        href="#services"
                        className="text-gray-900 dark:text-gray-300 hover:text-nutty-yellow transition-colors block py-1"
                      >
                        {service}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className={isArabic ? "arabic-text" : ""}
          >
            <h3 className="text-xl font-bold mb-6">{footerTexts.contactInfo}</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className={`w-5 h-5 text-nutty-yellow ${isArabic ? 'ml-3 mr-0' : 'mr-3'} mt-1 flex-shrink-0`} />
                <span className="text-gray-900 dark:text-gray-300 hover:text-nutty-yellow">
                  {isArabic ? settings.address_ar : settings.address_en}
                </span>
              </li>
              <li className="flex items-center">
                <Phone className={`w-5 h-5 text-nutty-yellow ${isArabic ? 'ml-3 mr-0' : 'mr-3'} flex-shrink-0`} />
                <a
                  href={`tel:${settings.phone}`}
                  className="text-gray-900 dark:text-gray-300 hover:text-nutty-yellow"
                  dir="ltr"
                >
                  {settings.phone}
                </a>
              </li>
              <li className="flex items-center">
                <Mail className={`w-5 h-5 text-nutty-yellow ${isArabic ? 'ml-3 mr-0' : 'mr-3'} flex-shrink-0`} />
                <a
                  href={`mailto:${settings.contact_email}`}
                  className="text-gray-900 dark:text-gray-300 hover:text-nutty-yellow"
                >
                  {settings.contact_email}
                </a>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="mt-8">
              <h4 className="font-semibold mb-4">{footerTexts.newsletterTitle}</h4>
              <div className={`flex ${isArabic ? 'flex-row-reverse' : ''}`}>
                <input
                  suppressHydrationWarning
                  type="email"
                  placeholder={footerTexts.newsletterPlaceholder}
                  className={`flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-nutty-yellow ${
                    isArabic ? 'rounded-r-lg' : 'rounded-l-lg'
                  }`}
                />
                <button className={`px-4 py-2 bg-nutty-lime text-white hover:bg-nutty-lime-dark transition-colors font-bold ${
                  isArabic ? 'rounded-l-lg' : 'rounded-r-lg'
                }`}>
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          <div className={`flex flex-col md:flex-row justify-between items-center ${isArabic ? 'rtl-container' : ''}`}>
            <div className="text-gray-900 dark:text-gray-200 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} {isArabic ? "ناتي ساينتستس" : "Nutty Scientists"}.{" "}
              {editableFooter?.rights_ar || t("rights")}
            </div>

            <div className={`flex flex-wrap ${isArabic ? 'space-x-reverse' : ''} gap-6 text-sm`}>
              <Link
                href="/privacy-policy"
                className="text-gray-900 dark:text-gray-200 hover:text-nutty-yellow transition-colors"
              >
                {footerTexts.privacyPolicy}
              </Link>
              <Link
                href="/terms"
                className="text-gray-900 dark:text-gray-200 hover:text-nutty-yellow transition-colors"
              >
                {footerTexts.termsOfService}
              </Link>
              <Link
                href="/cookie-policy"
                className="text-gray-900 dark:text-gray-200 hover:text-nutty-yellow transition-colors"
              >
                {footerTexts.cookiePolicy}
              </Link>
              <Link
                href="/careers"
                className="text-gray-900 dark:text-gray-200 hover:text-nutty-yellow transition-colors"
              >
                {footerTexts.careers}
              </Link>
            </div>
          </div>
        </div>

        {/* Back to Top */}
        {/* <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          whileHover={{ y: -5 }}
          className="fixed bottom-24 md:bottom-24 right-6 md:right-8 w-12 h-12 bg-nutty-cyan/80 hover:bg-nutty-cyan text-white rounded-full shadow-lg flex items-center justify-center transition-colors z-40 backdrop-blur-sm"
          aria-label={footerTexts.backToTop}
          title={footerTexts.backToTop}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </motion.button> */}
      </div>
    </footer>
  );
};

export default Footer;
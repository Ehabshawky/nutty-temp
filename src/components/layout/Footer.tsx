"use client";
import React from "react";
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

const Footer = () => {
  const { t, i18n } = useTranslation();
  const [editableFooter, setEditableFooter] = React.useState<any>(null);
  const [settings, setSettings] = React.useState<any>({
    logo_url: "/Nutt Logo.png",
    contact_email: "info@nuttyscientists-egypt.com",
    career_email: "careers@nuttyscientists.com",
    phone: "01222668543",
    address_en: "Garden 8 mall, New Cairo, 1st Settlement",
    address_ar: "مول جاردن 8، القاهرة الجديدة، الحي الأول"
  });

  React.useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch("/api/site-content?t=" + Date.now());
        if (!res.ok) return;
        const data = await res.json();
        if (!mounted) return;
        if (data?.footer) setEditableFooter(data.footer);
        if (data?.settings) setSettings(data.settings);
      } catch (e) {
        // ignore
      }
    }
    load();
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
    { label: t("projectsNav"), href: "#projects" },
    { label: t("members"), href: "#members" },
    { label: t("articles"), href: "#articles" },
    { label: t("testimonials"), href: "#testimonials" },
    { label: t("blogs"), href: "#blogs" },
    { label: t("contact"), href: "#contact" },
  ];

  const services = {
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

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ];

  const footerTexts = {
    quickLinks: isArabic ? "روابط سريعة" : "Quick Links",
    ourServices: isArabic ? "خدماتنا" : "Our Services",
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
  };

  return (
       <footer className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <p className="text-gray-400 mb-6">
              {editableFooter?.description_ar || t("heroDescription")}
            </p>
            <div className={`flex ${isArabic ? 'space-x-reverse' : ''} space-x-4`}>
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-nutty-blue transition-colors"
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
                  className="text-gray-600 dark:text-gray-400 hover:text-nutty-yellow transition-colors block py-1"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className={isArabic ? "arabic-text" : ""}
          >
            <h3 className="text-xl font-bold mb-6">{footerTexts.ourServices}</h3>
            <ul className="space-y-3">
              {services[currentLanguage].map((service, index) => (
                <li key={index}>
                  <a
                    href="#services"
                    className="text-gray-400 hover:text-nutty-yellow transition-colors block py-1"
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
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
                <span className="text-gray-400">
                  {isArabic ? settings.address_ar : settings.address_en}
                </span>
              </li>
              <li className="flex items-center">
                <Phone className={`w-5 h-5 text-nutty-yellow ${isArabic ? 'ml-3 mr-0' : 'mr-3'} flex-shrink-0`} />
                <a
                  href={`tel:${settings.phone}`}
                  className="text-gray-400 hover:text-nutty-yellow font-sans"
                  dir="ltr"
                >
                  {settings.phone}
                </a>
              </li>
              <li className="flex items-center">
                <Mail className={`w-5 h-5 text-nutty-yellow ${isArabic ? 'ml-3 mr-0' : 'mr-3'} flex-shrink-0`} />
                <a
                  href={`mailto:${settings.contact_email}`}
                  className="text-gray-400 hover:text-nutty-yellow"
                >
                  {settings.contact_email}
                </a>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="mt-8 ">
              <h4 className="font-semibold mb-4">{footerTexts.newsletterTitle}</h4>
              <div className={`flex ${isArabic ? 'flex-row-reverse' : ''}`}>
                <input
                  type="email"
                  placeholder={footerTexts.newsletterPlaceholder}
                  className={`flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-nutty-yellow ${
                    isArabic ? 'rounded-r-lg' : 'rounded-l-lg'
                  }`}
                />
                <button className={`px-4 py-2 bg-nutty-yellow text-gray-900 hover:bg-yellow-400 transition-colors ${
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
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} {isArabic ? "ناتي ساينتستس" : "Nutty Scientists"}.{" "}
              {editableFooter?.rights_ar || t("rights")}
            </div>

            <div className={`flex flex-wrap ${isArabic ? 'space-x-reverse' : ''} gap-6 text-sm`}>
              <a
                href="#"
                className="text-gray-400 hover:text-nutty-yellow transition-colors"
              >
                {footerTexts.privacyPolicy}
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-nutty-yellow transition-colors"
              >
                {footerTexts.termsOfService}
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-nutty-yellow transition-colors"
              >
                {footerTexts.cookiePolicy}
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-nutty-yellow transition-colors"
              >
                {footerTexts.careers}
              </a>
            </div>
          </div>
        </div>

        {/* Back to Top */}
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          whileHover={{ y: -5 }}
          className="fixed bottom-8 right-8 w-12 h-12 bg-nutty-blue rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors z-40"
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
        </motion.button>
      </div>
    </footer>
  );
};

export default Footer;
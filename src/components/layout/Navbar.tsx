"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, Briefcase, Phone, Mail } from "lucide-react";
import Image from "next/image";
import ThemeToggle from "./ui/ThemeToggle";
import LanguageToggle from "./ui/LanguageToggle";

const Navbar = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [logoUrl, setLogoUrl] = useState("/Nutt Logo.png");
  const [contactInfo, setContactInfo] = useState({
    phone: "+20 122 266 8543",
    email: "info@nuttyscientists-egypt.com"
  });
  const [loadingContact, setLoadingContact] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/site-content?t=" + Date.now());
        if (res.ok) {
          const data = await res.json();
          if (data.settings?.logo_url) {
            setLogoUrl(data.settings.logo_url);
          }
          if (data.settings?.phone) {
            setContactInfo(prev => ({
              ...prev,
              phone: data.settings.phone
            }));
          }
          if (data.settings?.contact_email) {
            setContactInfo(prev => ({
              ...prev,
              email: data.settings.contact_email
            }));
          }
        }
      } catch (e) {
        console.error("Error fetching site settings:", e);
      } finally {
        setLoadingContact(false);
      }
    }
    
    fetchSettings();

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Scroll Spy Logic - يعمل فقط في الصفحة الرئيسية
      if (pathname === "/") {
        const sections = ['home', 'services', 'about', 'members', 'articles', 'testimonials', 'blogs', 'contact'];
        const scrollPosition = window.scrollY + 150;

        for (const section of sections) {
          const element = document.getElementById(section);
          if (element) {
            const { offsetTop, offsetHeight } = element;
            if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
              setActiveSection(section);
              break;
            }
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  // تحديد إذا كنا في الصفحة الرئيسية
  const isHomePage = pathname === "/";

  const navItems = [
    { name: t("home"), href: "/", section: "home", external: false },
    { name: t("servicesNav"), href: isHomePage ? "#services" : "/#services", section: "services", external: false },
    { name: t("aboutNav"), href: isHomePage ? "#about" : "/#about", section: "about", external: false },
    { name: t("members"), href: isHomePage ? "#members" : "/#members", section: "members", external: false },
    { name: t("articles"), href: isHomePage ? "#articles" : "/#articles", section: "articles", external: false },
    { name: t("testimonials"), href: isHomePage ? "#testimonials" : "/#testimonials", section: "testimonials", external: false },
    { name: t("blogs"), href: isHomePage ? "#blogs" : "/#blogs", section: "blogs", external: false },
    { name: t("contact"), href: isHomePage ? "#contact" : "/#contact", section: "contact", external: false },
  ];

  // روابط الصفحات الكاملة
  const pageLinks = [
    { 
      name: t("careers"), 
      href: "/careers", 
      icon: Briefcase,
      external: false,
      badge: true 
    },
    // { 
    //   name: t("privacyPolicy"), 
    //   href: "/privacy-policy", 
    //   external: false 
    // },
    // { 
    //   name: t("termsOfService"), 
    //   href: "/terms", 
    //   external: false 
    // },
    // { 
    //   name: t("cookiePolicy"), 
    //   href: "/cookie-policy", 
    //   external: false 
    // },
  ];

  // ✅ دالة موحدة تتعامل مع جميع أنواع الروابط
  const handleNavClick = useCallback((item: { href: string; section?: string; external?: boolean }) => {
    const currentPath = window.location.pathname;
    
    // إذا كان الرابط يبدأ بـ #
    if (item.href.startsWith('#')) {
      if (isHomePage) {
        // في الصفحة الرئيسية، قم بالتمرير السلس
        const targetId = item.href.substring(1);
        const element = document.getElementById(targetId);
        if (element) {
          const offset = 80; // Navbar height offset
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
          setActiveSection(targetId);
          window.history.pushState(null, "", `#${targetId}`);
        }
      } else {
        // إذا كنا في صفحة أخرى، انتقل إلى الصفحة الرئيسية مع الهاش
        router.push(`/${item.href}`);
      }
    } else {
      // روابط الصفحات الكاملة
      if (item.external) {
        window.open(item.href, '_blank');
      } else {
        router.push(item.href);
      }
    }
    
    setIsOpen(false);
  }, [router, isHomePage]);

  // Handle hash scroll on page load or navigation
  useEffect(() => {
    if (isHomePage && window.location.hash) {
      const targetId = window.location.hash.substring(1);
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          const offset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
          setActiveSection(targetId);
        }
      }, 500);
    }
  }, [isHomePage]);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-xl"
          : "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center cursor-pointer group"
            onClick={() => router.push("/")}
          >
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center overflow-hidden">
              <Image
                src={logoUrl}
                alt="Nutty Scientists Logo"
                fill
                sizes="64px"
                className="object-contain"
              />
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8 rtl:space-x-reverse">
            {/* Navigation Items */}
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <button
                  onClick={() => handleNavClick(item)} 
                  className={`group relative px-1 py-2 transition-colors ${
                    (isHomePage && activeSection === item.section)
                      ? "text-nutty-blue dark:text-nutty-yellow font-semibold"
                      : "text-gray-700 dark:text-gray-300 hover:text-nutty-blue dark:hover:text-nutty-yellow"
                  }`}
                >
                  {item.name}
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-nutty-blue dark:bg-nutty-yellow transition-all duration-300 ${
                      (isHomePage && activeSection === item.section)
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }`}
                  ></span>
                </button>
              </motion.div>
            ))}

            {/* Separator */}
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-700"></div>

            {/* Page Links (Careers فقط في Navigation) */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: navItems.length * 0.1 }}
            >
              <button
                onClick={() => handleNavClick(pageLinks[0])}
                className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-nutty-blue to-purple-600 text-white rounded-full hover:opacity-90 transition-opacity group"
              >
                <Briefcase className="w-4 h-4" />
                <span className="font-medium">{pageLinks[0].name}</span>
                {pageLinks[0].badge && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                )}
              </button>
            </motion.div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3 sm:space-x-4 rtl:space-x-reverse">
            <ThemeToggle />
            <LanguageToggle />

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-nutty-blue hover:text-white transition-colors"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden mt-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            <div className="p-6">
              <div className="flex justify-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="w-14 h-14 bg-gradient-to-br from-nutty-blue/10 to-nutty-purple/10 rounded-xl flex items-center justify-center">
                  <div className="relative w-12 h-12">
                    <Image
                      src={logoUrl}
                      alt="Nutty Scientists Logo"
                      fill
                      sizes="48px"
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>

              {/* Navigation Sections */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  {t("navigation") || "Navigation"}
                </h3>
                <div className="space-y-1">
                  {navItems.map((item) => (
                    <motion.button
                      key={item.name}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleNavClick(item)} 
                      className={`flex items-center w-full text-left px-4 py-3 rounded-xl transition-colors ${
                        (isHomePage && activeSection === item.section)
                          ? "bg-nutty-blue/10 text-nutty-blue dark:text-nutty-yellow"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {item.name}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Page Links Section */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  {t("pages") || "Pages"}
                </h3>
                <div className="space-y-1">
                  {pageLinks.map((item) => (
                    <motion.button
                      key={item.name}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleNavClick(item)}
                      className={`flex items-center w-full text-left px-4 py-3 rounded-xl transition-colors ${
                        item.badge
                          ? "bg-gradient-to-r from-nutty-blue/10 to-purple-600/10 text-nutty-blue dark:text-purple-300 border border-nutty-blue/20"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {item.icon && <item.icon className="w-4 h-4 mr-3" />}
                      {item.name}
                      {item.badge && (
                        <span className="ml-auto w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Contact Info in Mobile */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Phone className="w-4 h-4 mr-2" />
                    {loadingContact ? (
                      <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    ) : (
                      <a href={`tel:${contactInfo.phone}`} className="hover:text-nutty-blue transition-colors">
                        {contactInfo.phone}
                      </a>
                    )}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Mail className="w-4 h-4 mr-2" />
                    {loadingContact ? (
                      <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    ) : (
                      <a href={`mailto:${contactInfo.email}`} className="hover:text-nutty-blue transition-colors truncate">
                        {contactInfo.email}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
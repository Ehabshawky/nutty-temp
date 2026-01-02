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

  const isHomePage = pathname === "/";

  const navItems = [
    { name: t("home"), href: "/", section: "home", external: false },
    { name: t("servicesNav"), href: isHomePage ? "#services" : "/#services", section: "services", external: false },
    { name: t("aboutNav"), href: isHomePage ? "#about" : "/#about", section: "about", external: false },
    { name: t("members"), href: isHomePage ? "#members" : "/#members", section: "members", external: false },
    { name: t("blogs"), href: isHomePage ? "#blogs" : "/#blogs", section: "blogs", external: false },
    { name: t("contact"), href: isHomePage ? "#contact" : "/#contact", section: "contact", external: false },
  ];

  const pageLinks = [
    { 
      name: t("careers"), 
      href: "/careers", 
      icon: Briefcase,
      external: false,
      badge: true 
    },
  ];

  const handleNavClick = useCallback((item: { href: string; section?: string; external?: boolean }) => {
    const currentPath = window.location.pathname;
    
    if (item.href.startsWith('#')) {
      if (isHomePage) {
        const targetId = item.href.substring(1);
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
          window.history.pushState(null, "", `#${targetId}`);
        }
      } else {
        router.push(`/${item.href}`);
      }
    } else {
      if (item.external) {
        window.open(item.href, '_blank');
      } else {
        router.push(item.href);
      }
    }
    
    setIsOpen(false);
  }, [router, isHomePage]);

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
      className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 overflow-hidden ${
        scrolled
          ? "bg-gradient-to-b from-white/95 to-white/85 dark:from-gray-900/95 dark:to-gray-900/85 backdrop-blur-lg shadow-lg"
          : "bg-gradient-to-b from-white/90 to-white/80 dark:from-gray-900/90 dark:to-gray-900/80 backdrop-blur-md"
      }`}
    >
      {/* Enhanced Wave Decoration with Gradient */}
      <div className="absolute top-0 left-0 right-0 w-full h-[200px] pointer-events-none overflow-hidden z-0">
        <svg viewBox="0 0 1440 60" className="w-full h-full" preserveAspectRatio="none">
          {/* Top Lime Strip - Thinner */}
          <path
            d="M0,0 L1440,0 L1440,10 Q720,20 0,10 Z"
            fill="#C4D600" // Nutty Lime
            opacity="0.6"
          />
          {/* Cyan Wave below - Very subtle and high up */}
          <path
            d="M0,10 Q720,20 1440,10 L1440,25 Q720,35 0,25 Z"
            fill="#00BCD4" // Nutty Cyan
            opacity="0.6"
          />
          
          <defs>
            <linearGradient id="lime-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#C4D600" />
              <stop offset="50%" stopColor="#A5B800" />
              <stop offset="100%" stopColor="#8CA000" />
            </linearGradient>
            <linearGradient id="cyan-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00BCD4" />
              <stop offset="50%" stopColor="#0097A7" />
              <stop offset="100%" stopColor="#00838F" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
                  className={`group relative px-1 py-2 transition-all duration-300 font-semibold ${
                    (isHomePage && activeSection === item.section)
                      ? "text-transparent bg-clip-text bg-gradient-to-r from-nutty-cyan to-nutty-lime"
                      : "text-gray-700 dark:text-gray-300 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-nutty-cyan hover:to-nutty-lime"
                  }`}
                >
                  {item.name}
                  <span
                    className={`absolute bottom-0 left-0 h-[3px] rounded-full transition-all duration-500 ${
                      (isHomePage && activeSection === item.section)
                        ? "w-full bg-gradient-to-r from-nutty-cyan to-nutty-lime"
                        : "w-0 group-hover:w-full bg-gradient-to-r from-nutty-purple to-nutty-cyan"
                    }`}
                  ></span>
                </button>
              </motion.div>
            ))}

            {/* Colorful Separator */}
            <div className="w-[2px] h-8 bg-gradient-to-b from-nutty-cyan via-nutty-lime to-nutty-purple rounded-full"></div>

            {/* Careers Button with Gradient */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: navItems.length * 0.1 }}
            >
              <button
                onClick={() => handleNavClick(pageLinks[0])}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-nutty-cyan via-nutty-lime to-nutty-cyan text-white rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-nutty-purple via-nutty-cyan to-nutty-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Briefcase className="w-4 h-4 relative z-10" />
                <span className="font-semibold relative z-10">{pageLinks[0].name}</span>
                {pageLinks[0].badge && (
                  <span className="relative z-10 ml-2 w-2 h-2 bg-white rounded-full animate-ping opacity-75"></span>
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
              className="lg:hidden p-2 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-br hover:from-nutty-cyan hover:to-nutty-lime hover:text-white transition-all duration-300 shadow-sm"
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
                <div className="w-14 h-14 rounded-xl flex items-center justify-center">
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
                <h3 className="text-sm font-semibold text-nutty-cyan uppercase tracking-wider mb-3 px-4">
                  {t("navigation") || "Navigation"}
                </h3>
                <div className="space-y-2">
                  {navItems.map((item) => (
                    <motion.button
                      key={item.name}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleNavClick(item)} 
                      className={`flex items-center w-full text-left px-4 py-3.5 rounded-xl transition-all font-semibold group ${
                        (isHomePage && activeSection === item.section)
                          ? "bg-gradient-to-r from-nutty-cyan to-nutty-yellow text-transparent bg-clip-text bg-gradient-to-r from-nutty-cyan to-nutty-yellow border-l-4 border-nutty-cyan"
                          : "hover:bg-gradient-to-r hover:from-nutty-cyan hover:to-nutty-yellow text-gray-700 dark:text-gray-200 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-nutty-cyan hover:to-nutty-yellow"
                      }`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full mr-3 transition-all ${
                        (isHomePage && activeSection === item.section)
                          ? "bg-gradient-to-r from-nutty-cyan to-nutty-yellow"
                          : "bg-gray-300 dark:bg-gray-600 group-hover:bg-gradient-to-r group-hover:from-nutty-cyan group-hover:to-nutty-yellow"
                      }`} />
                      {item.name}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Page Links Section */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-nutty-purple uppercase tracking-wider mb-3">
                  {t("pages") || "Pages"}
                </h3>
                <div className="space-y-2">
                  {pageLinks.map((item) => (
                    <motion.button
                      key={item.name}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleNavClick(item)}
                      className="flex items-center w-full text-left px-4 py-3.5 rounded-xl bg-gradient-to-r from-nutty-cyan via-nutty-lime to-nutty-cyan hover:from-nutty-cyan/20 hover:via-nutty-lime/10 hover:to-nutty-cyan/10 transition-all group border border-nutty-cyan/20"
                    >
                      {item.icon && (
                        <item.icon className="w-4 h-4 mr-3 text-nutty-yellow group-hover:text-nutty-lime transition-colors" />
                      )}
                      <span className="font-semibold text-nutty-yellow">
                        {item.name}
                      </span>
                      {item.badge && (
                        <span className="ml-auto w-2 h-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse"></span>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Contact Info in Mobile */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center text-sm group">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3">
                      <Phone className="w-4 h-4 text-nutty-cyan" />
                    </div>
                    {loadingContact ? (
                      <div className="h-4 w-32 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded animate-pulse"></div>
                    ) : (
                      <a href={`tel:${contactInfo.phone}`} className="font-medium text-nutty-cyan hover:text-nutty-lime transition-colors">
                        {contactInfo.phone}
                      </a>
                    )}
                  </div>
                  <div className="flex items-center text-sm group">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3">
                      <Mail className="w-4 h-4 text-nutty-cyan" />
                    </div>
                    {loadingContact ? (
                      <div className="h-4 w-40 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded animate-pulse"></div>
                    ) : (
                      <a href={`mailto:${contactInfo.email}`} className="font-medium text-nutty-cyan hover:text-nutty-lime transition-colors">
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
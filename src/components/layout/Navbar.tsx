"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import ThemeToggle from "./ui/ThemeToggle";
import LanguageToggle from "./ui/LanguageToggle";

const Navbar = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [logoUrl, setLogoUrl] = useState("/Nutt Logo.png");

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/site-content?t=" + Date.now());
        if (res.ok) {
          const data = await res.json();
          if (data.settings?.logo_url) {
            setLogoUrl(data.settings.logo_url);
          }
        }
      } catch (e) {
        console.error("Error fetching logo:", e);
      }
    }
    fetchSettings();

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Scroll Spy Logic
      const sections = ['home', 'services', 'about', 'projects', 'members', 'articles', 'testimonials', 'blogs', 'contact'];
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
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: t("home"), href: "#home"},
    { name: t("servicesNav"), href: "#services" },
    { name: t("aboutNav"), href: "#about" },
    { name: t("projectsNav"), href: "#projects" },
    { name: t("members"), href: "#members" },
    { name: t("articles"), href: "#articles" },
    { name: t("testimonials"), href: "#testimonials" },
    { name: t("blogs"), href: "#blogs" },
    { name: t("contact"), href: "#contact" },
  ];

  // ✅ دالة موحدة تتعامل مع النوعين
  const handleNavClick = useCallback((item: typeof navItems[0]) => {
    const currentPath = window.location.pathname;
    const targetId = item.href.substring(1);

    if (currentPath === "/" || currentPath === "") {
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
      router.push("/" + item.href);
    }
    setIsOpen(false);
  }, [router]);

  // Handle hash scroll on page load or navigation
  useEffect(() => {
    if (window.location.hash) {
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
      }, 500); // Slight delay to ensure content is loaded
    }
  }, [router]);

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
                    activeSection === item.href.substring(1)
                      ? "text-nutty-blue dark:text-nutty-yellow font-semibold"
                      : "text-gray-700 dark:text-gray-300 hover:text-nutty-blue dark:hover:text-nutty-yellow"
                  }`}
                >
                  {item.name}
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-nutty-blue dark:bg-nutty-yellow transition-all duration-300 ${
                      activeSection === item.href.substring(1)
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }`}
                  ></span>
                </button>
              </motion.div>
            ))}
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

              <div className="space-y-1">
                {navItems.map((item) => (
                  <motion.button
                    key={item.name}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleNavClick(item)} 
                    className={`block w-full text-left px-4 py-3 rounded-xl transition-colors ${
                      activeSection === item.href.substring(1)
                        ? "bg-nutty-blue/10 text-nutty-blue dark:text-nutty-yellow"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {item.name}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
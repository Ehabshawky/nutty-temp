"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Beaker,
  FlaskConical,
  Atom,
  Rocket,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type HeroSlide = {
  id: number;
  image?: string;
  video?: string;
  title_ar?: string;
  title_en?: string;
  subtitle_ar?: string;
  subtitle_en?: string;
  description_ar?: string;
  description_en?: string;
};

const HeroSection = () => {
  const { t, i18n } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const isRTL = i18n.language === "ar";

  const icons = [
    { Icon: Beaker, color: "text-yellow-500" },
    { Icon: FlaskConical, color: "text-blue-500" },
    { Icon: Atom, color: "text-green-500" },
    { Icon: Rocket, color: "text-purple-500" },
  ];

  const heroSlides = [
    {
      id: 1,
      image: "/hero1.jpg",
      title: isRTL ? "التعلم العملي" : "Hands-On Learning",
      description: isRTL
        ? "ورش عمل علمية تفاعلية للعقول الصغيرة"
        : "Interactive science workshops for young minds",
    },
    {
      id: 2,
      image: "/hero2.webp",
      title: isRTL ? "تجارب حقيقية" : "Real Experiments",
      description: isRTL
        ? "عروض كيمياء آمنة وممتعة"
        : "Safe and fun chemistry demonstrations",
    },
    {
      id: 3,
      image: "/hero3.jpg",
      title: isRTL ? "تعليم STEM" : "STEM Education",
      description: isRTL
        ? "تعلم الروبوتات والبرمجة"
        : "Learning robotics and programming",
    },
    {
      id: 4,
      image: "/hero1.jpg",
      title: isRTL ? "التعلم العملي" : "Hands-On Learning",
      description: isRTL
        ? "ورش عمل علمية تفاعلية للعقول الصغيرة"
        : "Interactive science workshops for young minds",
    },
  ];

  const statsData = [
    {
      value: isRTL ? "١٠ آلاف+" : "10K+",
      label: t("studentsTrained"),
    },
    {
      value: isRTL ? "٥٠٠+" : "500+",
      label: t("workshops"),
    },
    {
      value: isRTL ? "٥٠+" : "50+",
      label: t("schools"),
    },
    {
      value: isRTL ? "١٠٠٪" : "100%",
      label: t("satisfaction"),
    },
  ];

  // Load editable hero content from API (if present)
  const [editableHero, setEditableHero] = useState<any>(null);

  // Auto slide change with dynamic duration
  useEffect(() => {
    const slides = (editableHero?.slides && editableHero.slides.length > 0) 
      ? editableHero.slides 
      : heroSlides;
    
    if (slides.length <= 1) return;

    const currentSlideData = slides[currentSlide % slides.length];
    // Set 20 seconds for video, 8 seconds for images
    const duration = currentSlideData?.video ? 40000 : 8000;

    const timeout = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, duration);

    return () => clearTimeout(timeout);
  }, [currentSlide, editableHero?.slides, heroSlides]);
  
  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch(`/api/site-content?t=${Date.now()}`);
        if (!res.ok) return;
        const data = await res.json();
        if (!mounted) return;
        if (data?.hero) setEditableHero(data.hero);
      } catch (e) {
        // ignore
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const nextSlide = () => {
    const slides = (editableHero?.slides && editableHero.slides.length > 0) 
      ? editableHero.slides 
      : heroSlides;
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    const slides = (editableHero?.slides && editableHero.slides.length > 0) 
      ? editableHero.slides 
      : heroSlides;
    setCurrentSlide(
      (prev) => (prev - 1 + slides.length) % slides.length
    );
  };

  // Get current slides array
  const getCurrentSlides = () => {
    return (editableHero?.slides && editableHero.slides.length > 0) 
      ? editableHero.slides 
      : heroSlides;
  };

  return (
    <section id="home" className="relative pt-16 md:pt-20 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        {editableHero?.slides && editableHero.slides.length > 0 ? (
          // Use editable hero slides
          <>
            {editableHero.slides.map((slide: any, index: number) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-[1500ms] ${
                  index === currentSlide % editableHero.slides.length
                    ? "opacity-100"
                    : "opacity-0 pointer-events-none"
                }`}
              >
                {slide.video ? (
                  <video
                    src={slide.video}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="absolute inset-0 bg-cover bg-no-repeat bg-center"
                    style={{ backgroundImage: `url(${slide.image})` }}
                  />
                )}
                <div className="absolute inset-0 bg-black/50 md:bg-black/60" />
              </div>
            ))}
          </>
        ) : (
          // Fallback to hardcoded slides
          <>
            {heroSlides.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-[1500ms] ${
                  index === currentSlide
                    ? "opacity-100"
                    : "opacity-0 pointer-events-none"
                }`}
              >
                <div
                  className="absolute inset-0 bg-cover bg-no-repeat bg-center"
                  style={{ backgroundImage: `url(${slide.image})` }}
                />
                <div className="absolute inset-0 bg-black/60 md:bg-black/70" />
              </div>
            ))}
          </>
        )}
      </div>

      {/* Navigation Buttons - Show if we have multiple slides */}
      {getCurrentSlides().length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full p-2 md:p-3 transition-all duration-300"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5 md:h-6 md:w-6 text-white" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full p-2 md:p-3 transition-all duration-300"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5 md:h-6 md:w-6 text-white" />
          </button>
        </>
      )}

      {/* Main Content */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-32 md:pt-20 md:pb-32 lg:py-32">
          <div className="text-center">
            {/* Animated Icons */}
            <div className="flex justify-center gap-4 md:gap-6 mb-6 md:mb-8 flex-wrap">
              {icons.map(({ Icon, color }, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 0 }}
                  animate={{ y: [0, -12, 0] }}
                  transition={{
                    duration: 2.5,
                    delay: index * 0.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="bg-white/10 backdrop-blur-sm rounded-full p-3 md:p-4 shadow-lg"
                >
                  <Icon className={`h-6 w-6 md:h-8 md:w-8 ${color}`} />
                </motion.div>
              ))}
            </div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-6 px-2 drop-shadow-lg"
            >
              {editableHero?.slides && editableHero.slides.length > 0
                ? (isRTL 
                    ? editableHero.slides[currentSlide % editableHero.slides.length]?.title_ar 
                    : editableHero.slides[currentSlide % editableHero.slides.length]?.title_en) || t("heroTitle")
                : t("heroTitle")}
            </motion.h1>

            {/* Subtitle */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-yellow-400 mb-6 md:mb-8 px-4 font-semibold drop-shadow-md"
            >
              {editableHero?.slides && editableHero.slides.length > 0
                ? (isRTL
                    ? editableHero.slides[currentSlide % editableHero.slides.length]?.subtitle_ar
                    : editableHero.slides[currentSlide % editableHero.slides.length]?.subtitle_en) || t("heroSubtitle")
                : t("heroSubtitle")}
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-base sm:text-lg md:text-xl text-white/95 max-w-3xl mx-auto mb-8 md:mb-12 px-4 md:px-0 drop-shadow"
            >
              {editableHero?.slides && editableHero.slides.length > 0
                ? (isRTL
                    ? editableHero.slides[currentSlide % editableHero.slides.length]?.description_ar
                    : editableHero.slides[currentSlide % editableHero.slides.length]?.description_en) || t("heroDescription")
                : t("heroDescription")}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-10 md:mb-16 px-4"
            >
              <button
                className="px-6 py-3 md:px-8 md:py-3 bg-nutty-lime text-white rounded-full font-semibold text-base md:text-lg hover:bg-nutty-lime-dark transition-colors transform hover:scale-105 shadow-lg w-full sm:w-auto"
                onClick={() => {
                  const contactSection = document.getElementById("contact");
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                {t("getStarted")}
              </button>
              <button
                className="px-6 py-3 md:px-8 md:py-3 border-2 border-white text-white rounded-full font-semibold text-base md:text-lg hover:bg-white hover:text-gray-900 transition-colors shadow-lg w-full sm:w-auto"
                onClick={() => {
                  const servicesSection = document.getElementById("services");
                  if (servicesSection) {
                    servicesSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                {t("learnMore")}
              </button>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 lg:gap-6 max-w-4xl mx-auto px-4">
              {statsData.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-3 md:p-4 lg:p-6 bg-black/40 backdrop-blur-md rounded-xl border border-white/20 shadow-lg"
                >
                  <div className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-1 drop-shadow-md">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm md:text-base text-white/90 leading-tight">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

    {/* Navigation Controls */}
    <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4">
      
      {/* Slide Indicators */}
      <div className="flex gap-2">
        {getCurrentSlides().map((slide: any, index: number) => {
          const slides = getCurrentSlides();
          const slidesLength = slides.length;
          
          // Consider moving this calculation outside the map for better performance
          const activeIndex = slidesLength > 0 
            ? ((currentSlide % slidesLength) + slidesLength) % slidesLength 
            : 0;
          
          const isActive = index === activeIndex;
          
          return (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`
                h-3 md:h-4 rounded-full transition-all duration-300 
                focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-gray-900
                ${isActive 
                  ? "bg-yellow-500 w-6 md:w-8" 
                  : "bg-white/60 w-3 md:w-4 hover:bg-white/80"
                }
              `}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={isActive ? "true" : "false"}
            />
          );
        })}
      </div>

      {/* Scroll/Next Section Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="flex items-center cursor-pointer"
        onClick={() => {
          // Optional: Add functionality to scroll to next section
          // window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
        }}
        aria-label="Scroll to next section"
        role="button"
        tabIndex={0}
      >
        <div className="w-5 h-8 md:w-6 md:h-10 border-2 border-white/60 rounded-full flex justify-center hover:border-white/90 transition-colors">
          <div className="w-1 h-2 md:h-3 bg-white/80 rounded-full mt-2"></div>
        </div>
      </motion.div>
    </div>  
    </section>
  );
};

export default HeroSection;
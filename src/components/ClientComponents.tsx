// app/components/ClientComponents.tsx
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Chatbot from "./ui/Chatbot";


interface ClientComponentsProps {
  language: string;
}

export default function ClientComponents({ language }: ClientComponentsProps) {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');


  // التحكم في زر العودة للأعلى
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // التحقق عند التحميل

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* زر العودة للأعلى */}
      <button
        id="back-to-top"
        className={`fixed bottom-8 right-8 w-12 h-12 bg-nutty-blue rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-all duration-300 z-40 ${
          isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10 pointer-events-none"
        }`}
        aria-label={language === "ar" ? "العودة للأعلى" : "Back to top"}
        title={language === "ar" ? "العودة للأعلى" : "Back to top"}
        onClick={scrollToTop}
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </button>

      {/* Chatbot - Only on public pages */}
      {!isAdmin && <Chatbot />}
    </>
  );
}
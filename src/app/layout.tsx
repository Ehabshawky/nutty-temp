// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import Providers from "./providers";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { getFontForLanguage, getFontClasses, type FontLanguage, PRIMARY_FONTS, SECONDARY_FONTS } from './fonts';

import ClientComponents from "@/components/ClientComponents";
import LoadingOverlay from "@/components/LoadingOverlay";
import ClientScripts from "@/components/ClientScripts";
import { SpeedInsights } from "@vercel/speed-insights/next";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

export const metadata: Metadata = {
  metadataBase: new URL("https://nuttyscientists-egypt.com"),
  title: {
    default: "Nutty Scientists Egypt - Where Science Meets Fun!",
    template: "%s | Nutty Scientists Egypt"
  },
  description: "Nutty Scientists is the global leader in interactive science programs for children. From workshops and camps to corporate events, we make science fun and engaging in Egypt.",
  keywords: [
    "Science for kids Egypt", 
    "Educational entertainment Cairo", 
    "STEM workshops Egypt", 
    "Nutty Scientists Egypt", 
    "Kids science camps", 
    "School science programs", 
    "Corporate CSR science",
    "تجارب علمية للأطفال مصر",
    "ورش عمل تعليمية",
    "برامج ترفيهية للأطفال"
  ],
  authors: [{ name: "Nutty Scientists Egypt" }],
  creator: "Nutty Scientists",
  publisher: "Nutty Scientists Egypt",
  robots: "index, follow",
  alternates: {
    canonical: "https://nuttyscientists-egypt.com",
    languages: {
      'en-US': 'https://nuttyscientists-egypt.com/en',
      'ar-EG': 'https://nuttyscientists-egypt.com/ar',
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nuttyscientists-egypt.com",
    title: "Nutty Scientists Egypt - Interactive Science for Kids",
    description: "The world's leading science education program for children. Workshops, camps, and events that inspire curiosity and fun!",
    siteName: "Nutty Scientists Egypt",
    images: [
      {
        url: "/Nutty-Scientists.webp",
        width: 1200,
        height: 630,
        alt: "Nutty Scientists Egypt",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nutty Scientists Egypt",
    description: "Transforming young minds through innovative science education. Where Science Meets Fun!",
    images: ["/Nutty-Scientists.webp"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Static export cannot use cookies() at build time
  const language: FontLanguage = 'en';
  const htmlLang = language;
  const htmlDir = "ltr";
  
  /* Removed dynamic fontSettings and fontClasses to allow CSS-based switching */

  return (
    <html 
      lang={htmlLang} 
      dir={htmlDir} 
      suppressHydrationWarning
      className={`scroll-smooth`}
      data-language={language}
      data-direction={htmlDir}
    >
      <head>
        {/* Font preconnects */}
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        
        {/* Font Face Definitions */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              @font-face {
                font-family: 'Arabic Font Fallback';
                size-adjust: 105%;
                ascent-override: 95%;
                descent-override: 25%;
                line-gap-override: 0%;
                src: local('Segoe UI'), local('Tahoma'), local('Arial');
              }
              
              @font-face {
                font-family: 'English Font Fallback';
                size-adjust: 98%;
                ascent-override: 100%;
                descent-override: 20%;
                line-gap-override: 0%;
                src: local('Segoe UI'), local('Arial'), local('Helvetica');
              }
              
              /* CSS Custom Properties */
              :root {
                --vh: 1vh;
              }
            `
          }}
        />
      </head>
      
      <body 
        className={`
          ${PRIMARY_FONTS.english.variable}
          ${PRIMARY_FONTS.arabic.variable}
          ${SECONDARY_FONTS.english.variable}
          ${SECONDARY_FONTS.arabic.variable}
          antialiased 
          bg-white 
          dark:bg-gray-900
          text-gray-900 
          dark:text-gray-100
          transition-colors 
          duration-300
          min-h-screen
          relative
          min-h-[calc(var(--vh,1vh)*100)]
        `}
        suppressHydrationWarning
      >
        {/* إضافة المكونات العميلية */}
        <ClientScripts />
        <LoadingOverlay />
        
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            
            <main 
              id="main-content"
              className="flex-grow pt-16 md:pt-20"
              role="main"
              aria-label="Main content"
            >
              {children}
            </main>
            
            <Footer />
          </div>
          
          <ClientComponents language={language} />
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  );
}
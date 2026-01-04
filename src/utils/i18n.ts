import i18n from "i18next";
import { initReactI18next } from "react-i18next";
// Load language detector only on the client to avoid SSR issues.
let LanguageDetector: any = undefined;
try {
  if (typeof window !== "undefined") {
    // require so bundlers don't try to include this on server
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    LanguageDetector = require("i18next-browser-languagedetector").default;
  }
} catch (e) {
  LanguageDetector = undefined;
}

const resources = {
  en: {
    translation: {
      // Navigation
      home: "Home",
      servicesNav: "Our Programs",
      aboutNav: "About Us",
      contact: "Contact Us",
      projectsNav: "Projects",
      members: "Our Team",
      articles: "Articles",
      testimonials: "Testimonials",
      blogs: "Blog",
      admin: "Admin",
      careers: "Careers",
      navigation: "Navigation",
      pages: "Pages",
      searchPlaceholder: "Search articles, projects, scientists...",

      // Hero Section
      heroTitle: "Nutty Scientists",
      heroSubtitle: "Where Science Meets Fun!",
      heroDescription:
        "Transforming young minds through innovative science education and interactive experiments.",
      getStarted: "Get Started",
      learnMore: "Learn More",
      studentsTrained: "Students Trained",
      workshops: "Workshops",
      schools: "Schools",
      satisfaction: "Satisfaction",
      workshopsCount: "Workshops",
      schoolsCount: "Schools",
      satisfactionRate: "Satisfaction",

      // Services
      servicesTitle: "Our Programs",
      workshopsDesc: "Hands-on science experiments for all ages",
      camps: "Science Camps",
      campsDesc: "Summer and winter science adventure programs",
      parties: "Science Parties",
      partiesDesc: "Fun and educational birthday celebrations",
      corporate: "Corporate Events",
      corporateDesc: "Team building with scientific twist",

      // About
      aboutTitle: "About Nutty Scientists",
      mission: "Our Mission",
      missionText:
        "To inspire curiosity and foster a love for science through interactive learning experiences. We combine hands-on experiments with cutting-edge technology to create unforgettable learning moments that spark curiosity and foster critical thinking skills.",
      vision: "Our Vision",
      visionText:
        "A world where every child has access to engaging scientific education. We envision creating a generation of problem-solvers and innovators who will use scientific thinking to address global challenges and build a better future.",
      // About extra
      about: {
        lead: "Pioneering science education since 2010 with innovative approaches and passionate educators",
        journey: "Our Journey",
        value1Title: "Passion for Science",
        value1Desc:
          "We believe in making science exciting and accessible to everyone.",
        value2Title: "Collaboration",
        value2Desc:
          "Working together to create memorable learning experiences.",
        value3Title: "Safety First",
        value3Desc:
          "All experiments are conducted with utmost safety precautions.",
        value4Title: "Global Perspective",
        value4Desc:
          "Bringing international science education standards to local communities.",
        value5Title: "Continuous Learning",
        value5Desc:
          "We stay updated with the latest scientific discoveries and teaching methods.",
        value6Title: "Excellence",
        value6Desc:
          "Committed to delivering the highest quality educational experiences.",
        coreValues: "Our Core Values",
        milestones: {
          2010: "Founded by Dr. Akram Farid",
          2012: "First International Workshop",
          2015: "Reached 1,000 Students",
          2018: "Mobile Science Lab Launched",
          2020: "Virtual Learning Platform",
          2023: "10,000+ Students Trained",
          2025: "20,000+ Students Trained",
        },
        stats: {
          satisfactionRate: "Satisfaction Rate 😊",
          happyStudents: "Happy Students 👨‍🎓",
          schoolsPartnered: "Schools Partnered 🏫",
          supportAvailable: "Support Available 🕒",
        },
      },

      // Contact
      contactTitle: "Contact Us",
      name: "Name",
      email: "Email",
      message: "Message",
      send: "Send Message",
      phone: "Phone",
      address: "Address",
      subject: "Subject",

      // Footer
      rights: "All rights reserved",
      quickLinks: "Quick Links",
      contactInfo: "Contact Information",
      followUs: "Follow Us",
      newsletter: "Subscribe to our newsletter",
      subscribe: "Subscribe",

      // Theme
      lightMode: "Light Mode",
      darkMode: "Dark Mode",
      themeToggle: "Toggle theme",

      // Buttons
      readMore: "Read More",
      viewAll: "View All",
      bookNow: "Book Now",
      download: "Download",
      buttons: {
        learnMore: "Learn More",
        back: "Back",
        viewAll: "View All",
        related: "Related"
      },
      // Sections
      latestArticles: "Latest Articles",
      featuredProjects: "Featured Projects",
      teamMembers: "Our Team",
      testimonialsSections: "What People Say",
      
      // Projects
      projects: {
        title: "Our Projects",
        lead: "Innovative initiatives transforming science education globally",
        categories: {
          all: "All Projects",
          education: "Education",
          technology: "Technology",
          personalized: "Personalized STEM",
          media: "Media",
          product: "Product",
        },
        featured: "Featured",
        meta: {
          members: "Members",
        },
        action: {
          viewProject: "View Project",
        },
        cta: {
          title: "Have a Project Idea?",
          desc: "We are always looking for innovative partnerships and collaborations.",
          button: "Propose a Project",
        },
      },

      // Services Extra
      services: {
        lead: "Explore our comprehensive range of science education programs designed to inspire and educate",
        schoolProgramsTitle: "School Programs",
        schoolProgramsDesc: "Curriculum-aligned science programs for schools",
        stemTitle: "STEM Education",
        stemDesc: "Comprehensive STEM learning pathways",
        onlineTitle: "Online Courses",
        onlineDesc: "Virtual science learning experiences",
        competitionsTitle: "Science Competitions",
        competitionsDesc: "Annual science fairs and hackathons",
        viewAll: "View All Programs",
        related: "Related Programs",
        showingAll: "Showing all programs",
        showingCategory: "Showing category",
        showingCategoryServices: "programs",
        tryDifferentCategory: "Try a different category",
        noServices: "No Programs Found",
        corporateServices: "Corporate services",
        services: "Programs",
        filter: "Filter",

        stats: {
          satisfactionRate: "Satisfaction Rate",
          happyStudents: "Happy Students",
          schoolsPartnered: "Schools Partnered",
          supportAvailable: "Support Available",
        },
        categories: {
          all: "All Programs",
          families: "Families",
          schools: "Schools",
          corporate: "Corporate",
          organizations: "Organizations",
        },
        cta: {
          title: "Ready to Start Your Science Journey?",
          desc: "Book a workshop or consultation with our expert scientists today!",
        },
      },
      // CSR Section
      csr: {
        title: "Corporate Social Responsibility (CSR)",
        subtitle: "Making Science Accessible to Every Child",
        lead: "Nutty Scientists Egypt is committed to creating a positive impact on society by empowering the next generation of thinkers and innovators.",
        initiative1Title: "Science for All",
        initiative1Desc: "Providing free scientific workshops to children in underprivileged areas and rural communities.",
        initiative2Title: "Eco-Curiosity",
        initiative2Desc: "Raising environmental awareness through hands-on experiments about sustainability and renewable energy.",
        initiative3Title: "Inclusion in STEM",
        initiative3Desc: "Tailored programs for children with special needs, ensuring that science is a fun experience for everyone.",
        partnershipTitle: "Partner for Impact",
        partnershipDesc: "We collaborate with companies and NGOs to sponsor educational programs that reach thousands of students across Egypt.",
        cta: "Partner with Us"
      },
      // Articles
      articlesSection: {
        title: "Science Articles & Insights",
        lead: "Expert perspectives, research findings, and thought leadership in science education",
        filter: "Filter:",
        readMore: "Read Full Article",
        read: "Read",
        trending: "Trending Now",
        trendingLabel: "TRENDING",
        featured: "Featured",
        views: "views",
        comments: "comments",
        newsletter: {
          title: "Stay Updated with Science Insights",
          desc: "Subscribe to our newsletter for the latest articles, research, and educational resources.",
          placeholder: "Enter your email",
          button: "Subscribe",
          note: "No spam. Unsubscribe anytime."
        },
        categories: {
          all: "All Articles",
          education: "Education",
          technology: "Technology",
          chemistry: "Chemistry",
          environment: "Environment",
          robotics: "Robotics",
          psychology: "Psychology",
          diversity: "Diversity"
        }
      },

      // Blogs
      blogsSection: {
        title: "Science Blog",
        lead: "Insights, guides, and inspiration for science enthusiasts of all ages",
        searchPlaceholder: "Search blog posts...",
        recentPosts: "Recent Posts",
        newsletter: {
          title: "Never Miss a Science Update",
          desc: "Subscribe to our weekly newsletter for the latest blog posts, science news, and educational resources.",
          note: "Join 10,000+ subscribers. No spam, ever."
        },
        categories: {
          all: "All Posts",
          science: "Science",
          education: "Education",
          parenting: "Parenting",
          neuroscience: "Neuroscience",
          sustainability: "Sustainability",
          technology: "Technology",
          chemistry: "Chemistry",
          psychology: "Psychology",
          astronomy: "Astronomy"
        }
      },

      // Testimonials
      testimonialsSection: {
        title: "What People Say",
        lead: "Hear from parents, students, educators, and partners about their experiences",
        averageRating: "Average Rating",
        schoolsServed: "Schools Served",
        happyStudents: "Happy Students",
        wouldRecommend: "Would Recommend",
        cta: {
          title: "Ready to Experience Nutty Scientists?",
          desc: "Join thousands of satisfied parents, schools, and organizations who have transformed their approach to science education.",
          bookBtn: "Book a Workshop",
          contactBtn: "Contact Sales"
        },
        categories: {
          all: "All Testimonials",
          parents: "Parents",
          students: "Students",
          teachers: "Teachers",
          schools: "Schools",
          corporate: "Corporate",
          organizations: "Organizations"
        }
      },

      // Chatbot
      chatbot: {
        title: "Nutty Bot",
        online: "Online",
        welcome: "Hello! I'm Nutty Bot. How can I help you today?",
        placeholder: "Type your message...",
        helpText: "Nutty Bot is here to assist with your science questions!",
        responses: [
          "That's fascinating! Tell me more.",
          "I see. Let me check that for you.",
          "Great question! Our science workshops are available every weekend.",
          "You can book a workshop through our website or by contacting us.",
        ],
      },
      
      // Contact Section Extra
      contactSection: {
        lead: "Get in touch with our team of science enthusiasts. We're here to answer your questions and help you get started.",
        cards: {
          emailUs: "Email Us",
          callUs: "Call Us",
          phone1: "01222668543",
          phone2: "01123239999",
          visitUs: "Visit Us",
          workingHours: "Working Hours",
          workingDaily: "Everyday : 9:00 AM - 9:00 PM"
        },
        departments: {
          title: "Contact Specific Departments",
          general: "General Inquiries",
          school: "School Programs",
          corporate: "Corporate Events"
        },
        form: {
          title: "Send Us a Message",
          successTitle: "Message Sent Successfully!",
          successDesc: "Thank you for contacting us. We'll get back to you within 24 hours.",
          sending: "Sending...",
          required: "* Required fields",
          placeholders: {
            name: "Your name",
            email: "your@email.com",
            phone: "01234567890",
            subject: "What is this regarding?",
            message: "Tell us about your inquiry..."
          }
        },
        faq: {
          title: "Frequently Asked Questions",
          q1: "How quickly do you respond to inquiries?",
          a1: "We typically respond within business days.",
          q2: "Do you offer virtual workshops?",
          a2: "Yes! We offer both in-person and virtual workshops for schools and organizations.",
          q3: "What age groups do you work with?",
          a3: "We work with children aged 4-16, with programs tailored to each age group.",
          q4: "Can you customize programs for our needs?",
          a4: "Absolutely! We create custom programs based on your specific requirements and goals."
        },
        location: {
          title: "Visit Our Science Center",
          desc: "Come explore our interactive science exhibits, hands-on labs, and discovery zones.",
          address: "Garden 8 Mall, New Cairo, 1st Settlement",
          hours: "Open Everyday, 9 AM - 9 PM",
          getDirections: "Get Directions"
        }

      },
      privacyPolicy: {
        title: "Privacy Policy",
        lastUpdated: "Last updated",
        sections: {
          s1: {
            title: "1. Information We Collect",
            content: "We may collect the following types of information:<br/><br/><strong>Personal Information</strong><ul class='list-disc pl-6 mt-2 mb-4'><li>Parent/guardian name</li><li>Email address</li><li>Phone number</li><li>Child’s age (for program suitability only)</li><li>Event registrations and inquiries</li></ul><strong>Non-Personal Information</strong><ul class='list-disc pl-6 mt-2'><li>Browser type and device information</li><li>Pages visited on our website</li><li>General location data (city/region)</li><li>Website usage data via cookies or analytics tools</li></ul>"
          },
          s2: {
            title: "2. How We Use Your Information",
            content: "We use your information to:<ul class='list-disc pl-6 mt-2'><li>Process registrations for programs, camps, events, and workshops</li><li>Respond to inquiries and customer support requests</li><li>Communicate updates, schedules, and important announcements</li><li>Improve our website, services, and user experience</li><li>Send marketing or promotional messages (only if you opt in)</li></ul>"
          },
          s3: {
            title: "3. Children’s Privacy",
            content: "Protecting children’s privacy is extremely important to us.<ul class='list-disc pl-6 mt-2'><li>We do not knowingly collect personal data directly from children without parental consent</li><li>Any information related to children is provided by parents or guardians for registration and program purposes only</li><li>We do not sell, share, or misuse children’s personal information</li></ul>"
          },
          s4: {
            title: "4. Sharing of Information",
            content: "Nutty Scientists does not sell or rent your personal data. We may share information only with:<ul class='list-disc pl-6 mt-2 mb-4'><li>Trusted service providers (e.g., booking systems, payment processors)</li><li>Event partners or schools, strictly for event coordination</li><li>Legal authorities if required by law</li></ul>All partners are required to keep your information confidential.<br/><br/><strong>Photos & Media Usage</strong><br/>During our programs, events, camps, and activities, Nutty Scientists may take photos or short videos of children for educational, promotional, and marketing purposes, including use on our website and official social media channels.<ul class='list-disc pl-6 mt-2 mb-4'><li>Photos and videos are taken in a safe, respectful, and appropriate manner</li><li>We do not include children’s full names or personal details when sharing media</li><li>Media content is used solely to showcase activities and experiences</li></ul>By enrolling a child in our programs or attending our events, parents or guardians consent to the use of such photos or videos, unless they inform us otherwise in writing. Parents or guardians may request at any time:<ul class='list-disc pl-6 mt-2'><li>That their child not be photographed</li><li>Removal of specific images from our platforms</li></ul>Requests can be sent to us using the contact details below."
          },
          s5: {
            title: "5. Cookies & Analytics",
            content: "Our website may use cookies and analytics tools to:<ul class='list-disc pl-6 mt-2'><li>Understand how visitors use our website</li><li>Improve website performance and content</li></ul>You may disable cookies in your browser settings, but some features may not function properly."
          },
          s6: {
            title: "6. Data Security",
            content: "We take reasonable technical and organizational measures to protect your personal information against:<ul class='list-disc pl-6 mt-2'><li>Unauthorized access</li><li>Loss or misuse</li><li>Alteration or disclosure</li></ul>However, no online system can be 100% secure."
          },
          s7: {
            title: "7. Your Rights",
            content: "You have the right to:<ul class='list-disc pl-6 mt-2'><li>Request access to your personal data</li><li>Request correction or deletion of your information</li><li>Opt out of marketing communications at any time</li></ul>To exercise these rights, please contact us using the details below."
          },
          s8: {
            title: "8. Third-Party Links",
            content: "Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of those sites."
          },
          s9: {
            title: "9. Updates to This Policy",
            content: "We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date."
          },
          s10: {
            title: "10. Contact Us",
            content: "If you have any questions about this Privacy Policy or how we handle your data, please contact us:<br/><br/>📧 <strong>Email:</strong> info@nuttyscientists-egypt.com<br/>📞 <strong>Phone:</strong> 01222668543<br/>📍 <strong>Location:</strong> Garden 8 mall, 1st settlement, New Cairo, Egypt"
          }
        }
      },
      cookiePolicy: {
        title: "Cookie Policy",
        lastUpdated: "Last updated",
        sections: {
          s1: {
            title: "1. What Are Cookies?",
            content: "Cookies are small text files that are stored on your device when you visit a website. They help us provide a better experience by remembering your preferences and understanding how you use our site."
          },
          s2: {
            title: "2. How We Use Cookies",
            content: "We use cookies to improve our services, analyze website traffic, and for marketing purposes. This includes understanding which pages are most popular and ensuring the site functions correctly."
          },
          s3: {
            title: "3. Types of Cookies We Use",
            content: "<strong>Essential Cookies:</strong> Necessary for the website to function properly.<br/><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our site.<br/><strong>Marketing Cookies:</strong> Used to track visitors across websites to display relevant ads."
          },
          s4: {
            title: "4. Managing Cookies",
            content: "You can choose to disable cookies through your browser settings. However, please note that some parts of our website may not function correctly if cookies are disabled."
          }
        }
      },
      termsConditions: {
        title: "Terms & Conditions",
        lastUpdated: "Last updated",
        sections: {
          s1: {
            title: "1. Introduction",
            content: "By accessing and using this website, you agree to comply with and be bound by the following terms and conditions. If you do not agree with any part of these terms, please do not use our website."
          },
          s2: {
            title: "2. Intellectual Property",
            content: "All content on this website, including text, graphics, logos, and images, is the property of Nutty Scientists and is protected by copyright laws. You may not reproduce or distribute any content without our prior written consent."
          },
          s3: {
            title: "3. User Responsibilities",
            content: "Users agree to use the website for lawful purposes only and not to engage in any activity that could damage or disrupt the site's functionality."
          },
          s4: {
            title: "4. Program Enrolment & Payment",
            content: "Enrolment in our programs is subject to availability and payment of the required fees. Cancellation and refund policies apply as specified during the booking process."
          },
          s5: {
            title: "5. Limitation of Liability",
            content: "Nutty Scientists will not be liable for any direct, indirect, or consequential damages arising from the use of our website or participation in our programs."
          },
          s6: {
            title: "6. Governing Law",
            content: "These terms and conditions are governed by and construed in accordance with the laws of Egypt. Any disputes will be subject to the exclusive jurisdiction of the Egyptian courts."
          }
        }
      }
    },
  },
  ar: {
    translation: {
      // Navigation
      home: "الرئيسية",
      servicesNav: "برامجنا",
      aboutNav: "من نحن",
      contact: "اتصل بنا",
      projectsNav: "المشاريع",
      members: "فريقنا",
      articles: "المقالات",
      testimonials: "شهادات العملاء",
      blogs: "المدونة",
      admin: "لوحة التحكم",
      careers: "الوظائف",
      navigation: "الأساسي",
      pages: "الصفحات",
      searchPlaceholder: "ابحث في المقالات، المشاريع، العلماء...",

      // Hero Section
      heroTitle: "ناتى ساينتست",
      heroSubtitle: "حيث يلتقي العلم بالمرح!",
      heroDescription:
        "نحول عقول الشباب من خلال التعليم العلمي المبتكر والتجارب التفاعلية.",
      getStarted: "ابدأ الآن",
      learnMore: "تعرف أكثر",
      studentsTrained: "طالب متدرب",
      workshops: "ورشة عمل",
      schools: "مدرسة",
      satisfaction: "رضا العملاء",
      workshopsCount: "ورشة عمل",
      schoolsCount: "مدرسة",
      satisfactionRate: "رضا العملاء",

      // Services
      servicesTitle: "برامجنا",
      workshopsDesc: "تجارب علمية عملية لجميع الأعمار",
      camps: "معسكرات علمية",
      campsDesc: "برامج مغامرات علمية صيفية وشتوية",
      parties: "حفلات علمية",
      partiesDesc: "احتفالات عيد ميلاد ممتعة وتعليمية",
      corporate: "فعاليات الشركات",
      corporateDesc: "بناء فريق بلمسة علمية",


      // About
      aboutTitle: "عنناتى ساينتست",
      mission: "مهمتنا",
      missionText:
        "إلهام الفضول وتعزيز حب العلوم من خلال تجارب التعلم التفاعلية. ندمج التجارب العملية مع أحدث التقنيات لخلق لحظات تعلم لا تُنسى تثير الفضول وتعزز مهارات التفكير النقدي.",
      vision: "رؤيتنا",
      visionText:
        "عالم حيث لكل طفل إمكانية الوصول إلى تعليم علمي جذاب. نهدف إلى خلق جيل من المحلّلين والمبدعين الذين سيستخدمون التفكير العلمي لمواجهة التحديات العالمية وبناء مستقبل أفضل.",
      // About extra (Arabic)
      about: {
        lead: "ريادة تعليم العلوم منذ 2010 من خلال نهج مبتكرة ومدرسين شغوفين",
        journey: "رحلتنا",
        value1Title: "شغف بالعلم",
        value1Desc: "نؤمن بجعل العلم ممتعًا وفي متناول الجميع.",
        value2Title: "التعاون",
        value2Desc: "العمل معًا لخلق تجارب تعلم لا تُنسى.",
        value3Title: "السلامة أولاً",
        value3Desc: "تُجرى جميع التجارب مع أقصى معايير السلامة.",
        value4Title: "منظور عالمي",
        value4Desc: "نقل معايير التعليم العلمي الدولية إلى المجتمعات المحلية.",
        value5Title: "التعلم المستمر",
        value5Desc: "نواكب أحدث الاكتشافات والأساليب التعليمية.",
        value6Title: "التميز",
        value6Desc: "ملتزمون بتقديم تجارب تعليمية عالية الجودة.",
        coreValues: "قيمنا الأساسية",

        milestones: {
          2010: "تأسست على يد د. أكرم فريد",
          2012: "أول ورشة عمل دولية",
          2015: "وصلنا إلى 1,000 طالب",
          2018: "إطلاق مختبر العلوم المتنقل",
          2020: "منصة التعلم الافتراضية",
          2023: "تدريب أكثر من 10,000 طالب",
          2025: "تدريب أكثر من 20,000 طالب",
        },
        stats: {
          satisfactionRate: "نسبة الرضا 😊",
          happyStudents: "طلاب سعداء 👨‍🎓",
          schoolsPartnered: "مدارس شريكة 🏫",
          supportAvailable: "دعم متاح 🕒",
          expertScientists: "علماء خبراء",
          phdHolders: "حملة دكتوراه",
          certifiedEducators: "معلمون معتمدون",
          languagesSpoken: "اللغات التي نتحدثها",
          experiences: "تجارب علمية عملية",
          availability: "7 أيام في الأسبوع",
          schools: "300+ مدارس",
          experienceYears: "30+ سنة خبرة عالمية",
        },
      },

      // Contact
      contactTitle: "اتصل بنا",
      name: "الاسم",
      email: "البريد الإلكتروني",
      message: "الرسالة",
      send: "إرسال الرسالة",
      phone: "الهاتف",
      address: "العنوان",
      subject: "الموضوع",

      // Footer
      rights: "جميع الحقوق محفوظة",
      quickLinks: "روابط سريعة",
      contactInfo: "معلومات الاتصال",
      followUs: "تابعنا",
      newsletter: "اشترك في النشرة البريدية",
      subscribe: "اشتراك",

      // Theme
      lightMode: "الوضع النهاري",
      darkMode: "الوضع الليلي",
      themeToggle: "تبديل الوضع",

      // Buttons
      readMore: "اقرأ المزيد",
      viewAll: "عرض الكل",
      bookNow: "احجز الآن",
      download: "تحميل",
      buttons: {
        learnMore: "تعرف أكثر",
        back: "العودة",
        viewAll: "عرض جميع البرامج",
        related: "برامج ذات صلة"
      },
      // Sections
      latestArticles: "أحدث المقالات",
      featuredProjects: "المشاريع المميزة",
      teamMembers: "فريقنا",
      testimonialsSections: "ماذا يقول الناس",

      // Projects (Arabic)
      projects: {
        title: "مشاريعنا",
        lead: "مبادرات مبتكرة تعمل على تحويل التعليم العلمي على مستوى العالم",
        categories: {
          all: "كل المشاريع",
          education: "التعليم",
          technology: "التكنولوجيا",
          personalized: "تعليم STEM مخصص",
          media: "وسائل الإعلام",
          product: "منتج",
        },
        featured: "مميز",
        meta: {
          members: "أعضاء",
        },
        action: {
          viewProject: "عرض المشروع",
        },
        cta: {
          title: "هل لديك فكرة لمشروع؟",
          desc: "نحن دائمًا نبحث عن شراكات وتعاونات مبتكرة.",
          button: "اقترح مشروعًا",
        },
      },

      // Services extra (Arabic)
      services: {
        lead: "اكتشف مجموعتنا الشاملة من برامج التعليم العلمي المصممة لإلهام وتثقيف",
        schoolProgramsTitle: "برامج مدرسية",
        schoolProgramsDesc: "برامج علمية مناهجية للمدارس",
        stemTitle: "تعليم STEM",
        stemDesc: "مسارات تعلم STEM شاملة",
        onlineTitle: "دورات أونلاين",
        onlineDesc: "تجارب تعلم علمية افتراضية",
        competitionsTitle: "مسابقات علمية",
        competitionsDesc: "معارض ومسابقات علمية سنوية",
        showingAll: "عرض جميع البرامج",
        showingCategory: "عرض",
        showingCategoryServices: "برامج",
        tryDifferentCategory: "حاول فئة مختلفة",
        noServices: "لا يوجد برامج",
        corporateServices: "خدمات الشركات",
        services: "برامج",
        filter: "تصفية",

        stats: {
          satisfactionRate: "معدل الرضا",
          happyStudents: "طلاب سعداء",
          schoolsPartnered: "مدارس شريكة",
          supportAvailable: "دعم متاح",
        },
        categories: {
          all: "الكل",
          families: "العائلات",
          schools: "المدارس",
          corporate: "الشركات",
          organizations: "المنظمات",
        },
        cta: {
          title: "هل أنت جاهز لبدء رحلة علومك؟",
          desc: "احجز ورشة عمل أو استشارة مع علماءنا الخبراء اليوم!",
        },
        viewAll: "عرض جميع البرامج",
        related: "برامج ذات صلة"
      },
      // CSR Section (Arabic)
      csr: {
        title: "المسؤولية المجتمعية للشركات (CSR)",
        subtitle: "جعل العلوم في متناول كل طفل",
        lead: "يلتزم ناتي ساينتستس مصر بخلق أثر إيجابي في المجتمع من خلال تمكين الجيل القادم من المفكرين والمبتكرين.",
        initiative1Title: "العلوم للجميع",
        initiative1Desc: "تقديم ورش عمل علمية مجانية للأطفال في المناطق الأقل حظاً والمجتمعات الريفية.",
        initiative2Title: "الفضول البيئي",
        initiative2Desc: "رفع الوعي البيئي من خلال تجارب عملية حول الاستدامة والطاقة المتجددة.",
        initiative3Title: "الدمج في STEM",
        initiative3Desc: "برامج مخصصة للأطفال من ذوي الاحتياجات الخاصة، لضمان أن يكون العلم تجربة ممتعة للجميع.",
        partnershipTitle: "شراكة من أجل الأثر",
        partnershipDesc: "نتعاون مع الشركات والمنظمات غير الحكومية لرعاية البرامج التعليمية التي تصل إلى آلاف الطلاب في جميع أنحاء مصر.",
        cta: "شاركنا الأثر"
      },
      // Articles (Arabic)
      articlesSection: {
        title: "المقالات العلمية والرؤى",
        lead: "وجهات نظر الخبراء ونتائج الأبحاث والقيادة الفكرية في تعليم العلوم",
        filter: "تصفية:",
        readMore: "اقرأ المقال كاملاً",
        read: "اقرأ",
        trending: "الرائج الآن",
        trendingLabel: "رائج",
        featured: "مميز",
        views: "مشاهدة",
        comments: "تعليق",
        newsletter: {
          title: "ابق على اطلاع بأحدث الرؤى العلمية",
          desc: "اشترك في نشرتنا الإخبارية للحصول على أحدث المقالات والأبحاث والموارد التعليمية.",
          placeholder: "أدخل بريدك الإلكتروني",
          button: "اشترك",
          note: "لا رسائل مزعجة. يمكنك إلغاء الاشتراك في أي وقت."
        },
        categories: {
          all: "كل المقالات",
          education: "التعليم",
          technology: "التكنولوجيا",
          chemistry: "الكيمياء",
          environment: "البيئة",
          robotics: "الروبوتات",
          psychology: "علم النفس",
          diversity: "التنوع"
        }
      },

      // Blogs (Arabic)
      blogsSection: {
        title: "المدونة العلمية",
        lead: "رؤى وأدلة وإلهام لعشاق العلوم من جميع الأعمار",
        searchPlaceholder: "ابحث في منشورات المدونة...",
        recentPosts: "أحدث المنشورات",
        newsletter: {
          title: "لا تفوت أي تحديث علمي",
          desc: "اشترك في نشرتنا الأسبوعية للحصول على أحدث منشورات المدونة وأخبار العلوم والموارد التعليمية.",
          note: "انضم إلى أكثر من 10,000 مشترك. لا رسائل مزعجة أبدًا."
        },
        categories: {
          all: "كل المنشورات",
          science: "العلوم",
          education: "التعليم",
          parenting: "الأبوة والأمومة",
          neuroscience: "علم الأعصاب",
          sustainability: "الاستدامة",
          technology: "التكنولوجيا",
          chemistry: "الكيمياء",
          psychology: "علم النفس",
          astronomy: "علم الفلك"
        }
      },

      // Testimonials (Arabic)
      testimonialsSection: {
        title: "ماذا يقول الناس",
        lead: "استمع إلى الآباء والطلاب والمعلمين والشركاء حول تجاربهم",
        averageRating: "متوسط التقييم",
        schoolsServed: "المدارس المخدمة",
        happyStudents: "طلاب سعداء",
        wouldRecommend: "يوصون بنا",
        cta: {
          title: "هل أنت مستعد لتجربةناتى ساينتست؟",
          desc: "انضم إلى الآلاف من الآباء والمدارس والمنظمات الراضين الذين غيروا نهجهم في تعليم العلوم.",
          bookBtn: "احجز ورشة عمل",
          contactBtn: "تواصل مع المبيعات"
        },
        categories: {
          all: "كل التوصيات",
          parents: "الآباء",
          students: "الطلاب",
          teachers: "المعلمين",
          schools: "المدارس",
          corporate: "الشركات",
          organizations: "المنظمات"
        }
      },

      // Forms
      requiredField: "هذا الحقل مطلوب",
      invalidEmail: "بريد إلكتروني غير صالح",
      successMessage: "تم إرسال الرسالة بنجاح!",
      errorMessage: "حدث خطأ. يرجى المحاولة مرة أخرى.",

      // Chatbot
      chatbot: {
        title: "بوت نتي",
        online: "متصل",
        welcome: "مرحبًا! أنا بوت نتي. كيف يمكنني مساعدتك اليوم؟",
        placeholder: "اكتب رسالتك...",
        helpText: "بوت نتي هنا لمساعدتك في أسئلتك العلمية!",
        responses: [
          "هذا مثير للاهتمام! هل يمكنك إخباري بالمزيد؟",
          "أفهم. دعني أتحقق من ذلك لك.",
          "سؤال رائع! ورش العمل العلمية لدينا متاحة كل عطلة نهاية الأسبوع.",
          "يمكنك حجز ورشة عمل من خلال موقعنا أو بالاتصال بنا.",
        ],
      },
      
      // Contact Section Extra (Arabic)
      contactSection: {
        lead: "تواصل مع فريقنا من عشاق العلوم. نحن هنا للإجابة على أسئلتك ومساعدتك في البدء.",
        cards: {
          emailUs: "راسلنا",
          callUs: "اتصل بنا",
          phone1: "٠١٢٢٢٦٦٨٥٤٣",
          phone2: "٠١١٢٣٢٣٩٩٩٩",
          visitUs: "زرنا",
          workingHours: "ساعات العمل",
          workingDaily: "يوميًا: 9:00 ص - 9:00 م"
        },
        departments: {
          title: "اتصل بأقسام محددة",
          general: "استفسارات عامة",
          school: "برامج مدرسية",
          corporate: "فعاليات شركات"
        },
        form: {
          title: "أرسل لنا رسالة",
          successTitle: "تم إرسال الرسالة بنجاح!",
          successDesc: "شكرًا لتواصلك معنا. سنعود إليك في غضون 24 ساعة.",
          sending: "جاري الإرسال...",
          required: "* حقول مطلوبة",
          placeholders: {
            name: "اسمل",
            email: "البريد الإلكتروني",
            phone: "01234567890",
            subject: "ما هو موضوع رسالتك؟",
            message: "أخبرنا عن استفسارك..."
          }
        },
        faq: {
          title: "الأسئلة الشائعة",
          q1: "ما هي سرعة ردكم على الاستفسارات؟",
          a1: "نحن عادة نرد خلال أيام العمل.",
          q2: "هل تقدمون ورش عمل افتراضية؟",
          a2: "نعم! نقدم ورش عمل شخصية وافتراضية للمدارس والمنظمات.",
          q3: "ما هي الفئات العمرية التي تعملون معها؟",
          a3: "نعمل مع الأطفال من سن 4 إلى 16 عامًا، ببرامج مصممة لكل فئة عمرية.",
          q4: "هل يمكنكم تخصيص برامج لاحتياجاتنا؟",
          a4: "بالتأكيد! نقوم بإنشاء برامج مخصصة بناءً على متطلباتك وأهدافك المحددة."
        },
        location: {
          title: "زر مركزنا العلمي",
          desc: "تعال واستكشف معروضاتنا العلمية التفاعلية، والمختبرات العملية، ومناطق الاكتشاف.",
          address: "جاردن 8 مول، القاهرة الجديدة، التجمع الأول",
          hours: "مفتوح يوميًا، 9 ص - 9 م",
          getDirections: "احصل على الاتجاهات"
        }

      },

      // Dates
      january: "يناير",
      february: "فبراير",
      march: "مارس",
      april: "أبريل",
      may: "مايو",
      june: "يونيو",
      july: "يوليو",
      august: "أغسطس",
      september: "سبتمبر",
      october: "أكتوبر",
      november: "نوفمبر",
      december: "ديسمبر",
      privacyPolicy: {
        title: "سياسة الخصوصية",
        lastUpdated: "آخر تحديث",
        sections: {
          s1: {
            title: "1. المعلومات التي نجمعها",
            content: "قد نجمع الأنواع التالية من المعلومات:<br/><br/><strong>المعلومات الشخصية</strong><ul class='list-disc pr-6 mt-2 mb-4'><li>اسم ولي الأمر/الوصي</li><li>عنوان البريد الإلكتروني</li><li>رقم الهاتف</li><li>عمر الطفل (لأغراض ملاءمة البرنامج فقط)</li><li>تسجيلات الفعاليات والاستفسارات</li></ul><strong>المعلومات غير الشخصية</strong><ul class='list-disc pr-6 mt-2'><li>نوع المتاصفح ومعلومات الجهاز</li><li>الصفحات التي تمت زيارتها على موقعنا</li><li>بيانات الموقع العامة (المدينة/المنطقة)</li><li>بيانات استخدام الموقع عبر ملفات تعريف الارتباط أو أدوات التحليل</li></ul>"
          },
          s2: {
            title: "2. كيف نستخدم معلوماتك",
            content: "نستخدم معلوماتك من أجل:<ul class='list-disc pr-6 mt-2'><li>معالجة التسجيلات للبرامج والمعسكرات والفعاليات وورش العمل</li><li>الرد على الاستفسارات وطلبات دعم العملاء</li><li>التواصل بشأن التحديثات والجداول الزمنية والإعلانات الهامة</li><li>تحسين موقعنا وخدماتنا وتجربة المستخدم</li><li>إرسال رسائل تسويقية أو ترويجية (فقط إذا اخترت الاشتراك)</li></ul>"
          },
          s3: {
            title: "3. خصوصية الأطفال",
            content: "حماية خصوصية الأطفال أمر بالغ الأهمية بالنسبة لنا.<ul class='list-disc pr-6 mt-2'><li>نحن لا نجمع بيانات شخصية مباشرة من الأطفال عن عمد دون موافقة الوالدين</li><li>يتم تقديم أي معلومات تتعلق بالأطفال من قبل الآباء أو الأوصياء لأغراض التسجيل والبرامج فقط</li><li>نحن لا نبيع أو نشارك أو نسيء استخدام المعلومات الشخصية للأطفال</li></ul>"
          },
          s4: {
            title: "4. مشاركة المعلومات",
            content: "لا تقوم ناتي ساينتستس ببيع أو تأجير بياناتك الشخصية. قد نشارك المعلومات فقط مع:<ul class='list-disc pr-6 mt-2 mb-4'><li>مزودي الخدمة الموثوقين (مثل أنظمة الحجز ومعالجي الدفع)</li><li>شركاء الفعاليات أو المدارس، بدقة لتنسيق الفعاليات</li><li>السلطات القانونية إذا لزم الأمر بموجب القانون</li></ul>يُطلب من جميع الشركاء الحفاظ على سرية معلوماتك.<br/><br/><strong>استخدام الصور والوسائط</strong><br/>خلال برامجنا وفعالياتنا ومعسكراتنا وأنشطتنا، قد تلتقط ناتي ساينتستس صوراً أو مقاطع فيديو قصيرة للأطفال لأغراض تعليمية وترويجية وتسويقية، بما في ذلك الاستخدام على موقعنا وقنوات التواصل الاجتماعي الرسمية لدينا.<ul class='list-disc pr-6 mt-2 mb-4'><li>يتم التقاط الصور ومقاطع الفيديو بطريقة آمنة ومحترمة ومناسبة</li><li>نحن لا ندرج أسماء الأطفال الكاملة أو تفاصيلهم الشخصية عند مشاركة الوسائط</li><li>يتم استخدام محتوى الوسائط فقط لعرض الأنشطة والتجارب</li></ul>من خلال تسجيل الطفل في برامجنا أو حضور فعالياتنا، يوافق الآباء أو الأوصياء على استخدام هذه الصور أو مقاطع الفيديو، ما لم يبلغونا بخلاف ذلك كتابةً. يجوز للوالدين أو الأوصياء طلب ما يلي في أي وقت:<ul class='list-disc pr-6 mt-2'><li>عدم تصوير طفلهم</li><li>إزالة صور معينة من منصاتنا</li></ul>يمكن إرسال الطلبات إلينا باستخدام تفاصيل الاتصال أدناه."
          },
          s5: {
            title: "5. ملفات تعريف الارتباط والتحليلات",
            content: "قد يستخدم موقعنا ملفات تعريف الارتباط وأدوات التحليل من أجل:<ul class='list-disc pr-6 mt-2'><li>فهم كيفية استخدام الزوار لموقعنا</li><li>تحسين أداء الموقع ومحتواه</li></ul>يمكنك تعطيل ملفات تعريف الارتباط في إعدادات متصفحك، ولكن قد لا تعمل بعض الميزات بشكل صحيح."
          },
          s6: {
            title: "6. أمن البيانات",
            content: "نتخذ تدابير فنية وتنظيمية معقولة لحماية معلوماتك الشخصية من:<ul class='list-disc pr-6 mt-2'><li>الوصول غير المصرح به</li><li>الفقدان أو سوء الاستخدام</li><li>التعديل أو الإفصاح</li></ul>ومع ذلك، لا يمكن لأي نظام عبر الإنترنت أن يكون آمناً بنسبة 100٪."
          },
          s7: {
            title: "7. حقوقك",
            content: "لديك الحق في:<ul class='list-disc pr-6 mt-2'><li>طلب الوصول إلى بياناتك الشخصية</li><li>طلب تصحيح أو حذف معلوماتك</li><li>إلغاء الاشتراك في الاتصالات التسويقية في أي وقت</li></ul>لممارسة هذه الحقوق، يرجى الاتصال بنا باستخدام التفاصيل أدناه."
          },
          s8: {
            title: "8. روابط الطرف الثالث",
            content: "قد يحتوي موقعنا على روابط لم مواقع طرف ثالث. نحن لسنا مسؤولين عن ممارسات الخصوصية أو محتوى تلك المواقع."
          },
          s9: {
            title: "9. تحديثات هذه السياسة",
            content: "قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. سيتم نشر أي تغييرات على هذه الصفحة مع تاريخ مراجعة محدث."
          },
          s10: {
            title: "10. اتصل بنا",
            content: "إذا كان لديك أي أسئلة حول سياسة الخصوصية هذه أو كيفية تعاملنا مع بياناتك، يرجى الاتصال بنا:<br/><br/>📧 <strong>البريد الإلكتروني:</strong> info@nuttyscientists-egypt.com<br/>📞 <strong>الهاتف:</strong> 01222668543<br/>📍 <strong>الموقع:</strong> جاردن 8 مول، التجمع الأول، القاهرة الجديدة، مصر"
          }
        }
      },
      cookiePolicy: {
        title: "سياسة ملفات تعريف الارتباط",
        lastUpdated: "آخر تحديث",
        sections: {
          s1: {
            title: "1. ما هي ملفات تعريف الارتباط؟",
            content: "ملفات تعريف الارتباط هي ملفات نصية صغيرة يتم تخزينها على جهازك عند زيارة موقع ويب. تساعدنا في تقديم تجربة أفضل من خلال تذكر تفضيلاتك وفهم كيفية استخدامك لموقعنا."
          },
          s2: {
            title: "2. كيف نستخدم ملفات تعريف الارتباط",
            content: "نستخدم ملفات تعريف الارتباط لتحسين خدماتنا وتحليل حركة المرور على الموقع ولأغراض التسويق. يتضمن ذلك فهم الصفحات الأكثر شيوعًا والتأكد من عمل الموقع بشكل صحيح."
          },
          s3: {
            title: "3. أنواع ملفات تعريف الارتباط التي نستخدمها",
            content: "<strong>الملفات الضرورية:</strong> ضرورية لعمل الموقع بشكل صحيح.<br/><strong>ملفات التحليل:</strong> تساعدنا في فهم كيفية تفاعل الزوار مع موقعنا.<br/><strong>ملفات التسويق:</strong> تُستخدم لتتبع الزوار عبر المواقع لعرض إعلانات ذات صلة."
          },
          s4: {
            title: "4. إدارة ملفات تعريف الارتباط",
            content: "يمكنك اختيار تعطيل ملفات تعريف الارتباط من خلال إعدادات متصفحك. ومع ذلك، يرجى ملاحظة أن بعض أجزاء موقعنا قد لا تعمل بشكل صحيح إذا تم تعطيل ملفات تعريف الارتباط."
          }
        }
      },
      termsConditions: {
        title: "الشروط والأحكام",
        lastUpdated: "آخر تحديث",
        sections: {
          s1: {
            title: "1. مقدمة",
            content: "دخولك واستخدامك لهذا الموقع يعني موافقتك على الالتزام بالشروط والأحكام التالية. إذا كنت لا توافق على أي جزء من هذه الشروط، يرجى عدم استخدام موقعنا."
          },
          s2: {
            title: "2. الملكية الفكرية",
            content: "جميع المحتويات على هذا الموقع، بما في ذلك النصوص والرسومات والشعارات والصور، هي ملك لشركة ناتي ساينتستس ومحمية بموجب قوانين حقوق النشر. لا يجوز لك إعادة إنتاج أو توزيع أي محتوى دون موافقة خطية مسبقة منا."
          },
          s3: {
            title: "3. مسؤوليات المستخدم",
            content: "يوافق المستخدمون على استخدام الموقع لأغراض قانونية فقط وعدم الانخراط في أي نشاط قد يضر أو يعطل وظائف الموقع."
          },
          s4: {
            title: "4. التسجيل في البرامج والدفع",
            content: "يخضع التسجيل في برامجنا للتوافر ودفع الرسوم المطلوبة. تنطبق سياسات الإلغاء والاسترداد كما هو محدد أثناء عملية الحجز."
          },
          s5: {
            title: "5. تحديد المسؤولية",
            content: "لن تكون ناتي ساينتستس مسؤولة عن أي أضرار مباشرة أو غير مباشرة أو تبعية ناتجة عن استخدام موقعنا أو المشاركة في برامجنا."
          },
          s6: {
            title: "6. القانون المعمول به",
            content: "تخضع هذه الشروط والأحكام وتفسر وفقًا لقوانين جمهورية مصر العربية. وأي نزاعات ستخضع للولاية القضائية الحصرية للمحاكم المصرية."
          }
        }
      }
    },
  },
};

// Only use the browser language detector on the client
if (LanguageDetector) {
  i18n.use(LanguageDetector as any);
}

i18n.use(initReactI18next).init({
  resources,
  fallbackLng: "en",
  lng: "en",
  interpolation: {
    escapeValue: false,
  },
  detection: {
    order: ["localStorage"],
    caches: ["localStorage"],
  },
});

export default i18n;

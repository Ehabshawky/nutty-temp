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
      servicesNav: "Services",
      aboutNav: "About Us",
      contact: "Contact Us",
      projectsNav: "Projects",
      members: "Our Team",
      articles: "Articles",
      testimonials: "Testimonials",
      blogs: "Blog",
      admin: "Admin",
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
      servicesTitle: "Our Services",
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
          expertScientists: "Expert Scientists",
          phdHolders: "PhD Holders",
          certifiedEducators: "Certified Educators",
          languagesSpoken: "Languages Spoken",
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
        lead: "Explore our comprehensive range of science education services designed to inspire and educate",
        schoolProgramsTitle: "School Programs",
        schoolProgramsDesc: "Curriculum-aligned science programs for schools",
        stemTitle: "STEM Education",
        stemDesc: "Comprehensive STEM learning pathways",
        onlineTitle: "Online Courses",
        onlineDesc: "Virtual science learning experiences",
        competitionsTitle: "Science Competitions",
        competitionsDesc: "Annual science fairs and hackathons",
        stats: {
          satisfactionRate: "Satisfaction Rate",
          happyStudents: "Happy Students",
          schoolsPartnered: "Schools Partnered",
          supportAvailable: "Support Available",
        },
        cta: {
          title: "Ready to Start Your Science Journey?",
          desc: "Book a workshop or consultation with our expert scientists today!",
        },
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
    },
  },
  ar: {
    translation: {
      // Navigation
      home: "الرئيسية",
      servicesNav: "الخدمات",
      aboutNav: "من نحن",
      contact: "اتصل بنا",
      projectsNav: "المشاريع",
      members: "فريقنا",
      articles: "المقالات",
      testimonials: "التوصيات",
      blogs: "المدونة",
      admin: "لوحة التحكم",
      searchPlaceholder: "ابحث في المقالات، المشاريع، العلماء...",

      // Hero Section
      heroTitle: "ناتي ساينتستس",
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
      servicesTitle: "خدماتنا",
      workshopsDesc: "تجارب علمية عملية لجميع الأعمار",
      camps: "معسكرات علمية",
      campsDesc: "برامج مغامرات علمية صيفية وشتوية",
      parties: "حفلات علمية",
      partiesDesc: "احتفالات عيد ميلاد ممتعة وتعليمية",
      corporate: "فعاليات الشركات",
      corporateDesc: "بناء فريق بلمسة علمية",

      // About
      aboutTitle: "عن ناتي ساينتستس",
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
          expertScientists: "علماء خبراء",
          phdHolders: "حملة دكتوراه",
          certifiedEducators: "معلمون معتمدون",
          languagesSpoken: "اللغات التي نتحدثها",
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
        lead: "اكتشف مجموعتنا الشاملة من خدمات التعليم العلمي المصممة لإلهام وتثقيف",
        schoolProgramsTitle: "برامج مدرسية",
        schoolProgramsDesc: "برامج علمية مناهجية للمدارس",
        stemTitle: "تعليم STEM",
        stemDesc: "مسارات تعلم STEM شاملة",
        onlineTitle: "دورات أونلاين",
        onlineDesc: "تجارب تعلم علمية افتراضية",
        competitionsTitle: "مسابقات علمية",
        competitionsDesc: "معارض ومسابقات علمية سنوية",
        stats: {
          satisfactionRate: "معدل الرضا",
          happyStudents: "طلاب سعداء",
          schoolsPartnered: "مدارس شريكة",
          supportAvailable: "دعم متاح",
        },
        cta: {
          title: "هل أنت جاهز لبدء رحلة علومك؟",
          desc: "احجز ورشة عمل أو استشارة مع علماءنا الخبراء اليوم!",
        },
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
          title: "هل أنت مستعد لتجربة ناتي ساينتستس؟",
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

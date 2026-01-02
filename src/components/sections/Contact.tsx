"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle,
  MessageSquare,
  Globe,
  Users,
  ChevronRight,
  HelpCircle
} from 'lucide-react';
import { ContactSkeleton } from "@/components/skeletons/ContactSkeleton";

const Contact = () => {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [settings, setSettings] = useState<any>({
    contact_email: 'info@nuttyscientists-egypt.com',
    phone: '01222668543',
    address_en: 'Garden 8 mall, New Cairo, 1st Settlement',
    address_ar: 'مول جاردن 8، القاهرة الجديدة، الحي الأول',
    working_hours_en: 'Mon-Sun: 9:00 AM - 9:00 PM',
    working_hours_ar: 'نعمل يومياً على مدار الأسبوع',
    dept_general_email: 'info@nuttyscientists-egypt.com',
    dept_general_phone: '01222668543',
    dept_school_email: 'info@nuttyscientists-egypt.com',
    dept_school_phone: '01123239999',
    dept_corporate_email: 'info@nuttyscientists-egypt.com',
    dept_corporate_phone: '01222668543',
  });
  const [faqs, setFaqs] = useState<any[]>([]);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const isRTL = i18n.language === 'ar';
  const dir = isRTL ? 'rtl' : 'ltr';

  React.useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/site-content?t=" + Date.now());
        if (res.ok) {
          const data = await res.json();
          if (data.settings) setSettings(data.settings);
          if (data.faq && data.faq.questions) {
            setFaqs(data.faq.questions);
          }
        }
      } catch (e) {
        console.error("Error fetching content:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const contactInfo = [
    {
      icon: Mail,
      title: t('contactSection.cards.emailUs'),
      details: [settings.contact_email],
      color: 'from-blue-400 to-cyan-500'
    },
    {
      icon: Phone,
      title: t('contactSection.cards.callUs'),
      details: [settings.phone],
      color: 'from-green-400 to-emerald-500'
    },
    {
      icon: MapPin,
      title: t('contactSection.cards.visitUs'),
      details: [i18n.language === 'ar' ? settings.address_ar : settings.address_en],
      color: 'from-purple-400 to-pink-500'
    },
    {
      icon: Clock,
      title: t('contactSection.cards.workingHours'),
      details: [i18n.language === 'ar' ? settings.working_hours_ar : settings.working_hours_en],
      color: 'from-orange-400 to-red-500'
    }
  ];

  const departments = [
    {
      name: t('contactSection.departments.general'),
      email: settings.dept_general_email,
      phone: settings.dept_general_phone,
      icon: MessageSquare
    },
    {
      name: t('contactSection.departments.school'),
      email: settings.dept_school_email,
      phone: settings.dept_school_phone,
      icon: Users
    },
    {
      name: t('contactSection.departments.corporate'),
      email: settings.dept_corporate_email,
      phone: settings.dept_corporate_phone,
      icon: Globe
    }
  ];

  const [submitMessage, setSubmitMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');
    
    try {
        const res = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (res.ok) {
            setIsSubmitted(true);
            setTimeout(() => {
                setIsSubmitted(false);
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    subject: '',
                    message: ''
                });
            }, 3000);
        } else {
            setSubmitMessage(i18n.language === 'ar' ? 'فشل الإرسال' : 'Failed to send');
        }
    } catch (e) {
        console.error(e);
        setSubmitMessage(i18n.language === 'ar' ? 'حدث خطأ' : 'Error occurred');
    } finally {
        setIsSubmitting(false);
    }
  };

  if (loading) {
    return <ContactSkeleton />;
  }

  return (
    <section id="contact" className="py-20 bg-white dark:bg-gray-900" dir={dir}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t('contactTitle')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            {t('contactSection.lead')}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            {/* Contact Cards */}
            <div className="space-y-6 mb-12">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 shadow-lg"
                  >
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${info.color} p-3 mb-4`}>
                      <Icon className="w-full h-full text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {info.title}
                    </h3>
                    {info.details.map((detail, i) => (
                      <p 
                        key={i} 
                        className={`text-gray-600 dark:text-gray-400 ${info.icon === Phone ? 'font-sans' : ''}`}
                        dir={info.icon === Phone ? "ltr" : undefined}
                        style={info.icon === Phone && dir === 'rtl' ? { textAlign: 'right' } : undefined}
                      >
                        {detail}
                      </p>
                    ))}
                  </motion.div>
                );
              })}
            </div>

            {/* Departments */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                {t('contactSection.departments.title')}
              </h3>
              <div className="space-y-4">
                {departments.map((dept, index) => {
                  const Icon = dept.icon;
                  return (
                    <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                      <div className="flex items-start">
                        <Icon className="w-5 h-5 text-nutty-cyan mt-1 mr-3 rtl:mr-0 rtl:ml-3 flex-shrink-0" />
                        <div>
                          <h4 className="font-bold text-gray-900 dark:text-white">
                            {dept.name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {dept.email}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {dept.phone}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 shadow-lg">
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {t('contactSection.form.successTitle')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('contactSection.form.successDesc')}
                  </p>
                </motion.div>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                    {t('contactSection.form.title')}
                  </h3>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('name')} *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-nutty-cyan focus:border-transparent transition-all"
                          placeholder={t('contactSection.form.placeholders.name')}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('email')} *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-nutty-cyan focus:border-transparent transition-all"
                          placeholder={t('contactSection.form.placeholders.email')}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('phone')}
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-nutty-cyan focus:border-transparent transition-all"
                          placeholder={t('contactSection.form.placeholders.phone')}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('subject')} *
                        </label>
                        <input
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-nutty-cyan focus:border-transparent transition-all"
                          placeholder={t('contactSection.form.placeholders.subject')}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('message')} *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-nutty-cyan focus:border-transparent transition-all resize-none"
                        placeholder={t('contactSection.form.placeholders.message')}
                      />
                    </div>

                      <div className="flex flex-col items-end">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex items-center px-8 py-3 bg-nutty-cyan text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2 rtl:ml-2 rtl:mr-0"></div>
                              {t('contactSection.form.sending')}
                            </>
                          ) : (
                            <>
                              <Send className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" />
                              {t('send')}
                            </>
                          )}
                        </button>
                        {submitMessage && (
                          <p className="mt-2 text-sm text-red-500 font-medium">{submitMessage}</p>
                        )}
                      </div>
                  </form>
                </>
              )}
            </div>

            {/* FAQ Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12"
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                <HelpCircle className="w-8 h-8 text-nutty-orange" />
                {t('contactSection.faq.title')}
              </h3>
              
              <div className="space-y-4">
                {faqs.length > 0 ? (
                  faqs.map((faq, index) => (
                    <div 
                      key={index} 
                      className={`bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                        activeFaq === index 
                          ? 'border-nutty-cyan shadow-lg shadow-nutty-cyan/5' 
                          : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700'
                      }`}
                    >
                      <button
                        onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                        className="w-full px-6 py-5 flex items-center justify-between text-left rtl:text-right transition-colors"
                      >
                        <h4 className="font-black text-gray-900 dark:text-white text-lg pr-4 rtl:pr-0 rtl:pl-4 transition-colors">
                          {i18n.language === 'ar' ? faq.question_ar : faq.question_en}
                        </h4>
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                          activeFaq === index 
                            ? 'bg-nutty-cyan text-white shadow-lg' 
                            : 'bg-white dark:bg-gray-700 text-gray-400'
                        }`}>
                          <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${
                            activeFaq === index ? 'rotate-90' : (isRTL ? 'rotate-180' : '')
                          }`} />
                        </div>
                      </button>
                      
                      <motion.div
                        initial={false}
                        animate={{ height: activeFaq === index ? 'auto' : 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 text-gray-600 dark:text-gray-400 font-bold border-t border-gray-100 dark:border-gray-700 pt-4 bg-white/50 dark:bg-gray-900/50">
                          {i18n.language === 'ar' ? faq.answer_ar : faq.answer_en}
                        </div>
                      </motion.div>
                    </div>
                  ))
                ) : (
                   <p className="text-gray-500 italic">{isRTL ? "لا توجد أسئلة شائعة حالياً" : "No FAQs available at the moment."}</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Map and Location */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="bg-gradient-to-r from-nutty-lime to-orange-500 rounded-2xl p-8 md:p-12">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  {t('contactSection.location.title')}
                </h3>

                <p className="text-xl text-gray-800 mb-6">
                  {t('contactSection.location.desc')}
                </p>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-gray-900 mr-3 rtl:ml-3 rtl:mr-0" />
                    <span className="text-gray-800">
                      {i18n.language === 'ar' ? settings.address_ar : settings.address_en}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-gray-900 mr-3 rtl:ml-3 rtl:mr-0" />
                    <span className="text-gray-800">
                      {i18n.language === 'ar' ? settings.working_hours_ar : settings.working_hours_en}
                    </span>
                  </div>

                  {/* Get Directions Button */}
                  <a
                    href="https://www.google.com/maps/place/Nuttyscientists+egypt/@30.046041,31.484228,19z/data=!4m6!3m5!1s0x145823df76b10511:0x3c0863ebcdd54a90!8m2!3d30.0460413!4d31.4842277!16s%2Fg%2F11h2fg23rs?hl=ar&entry=ttu&g_ep=EgoyMDI1MTIwNy4wIKXMDSoASAFQAw%3D%3D"
                    target="_blank"
                    rel="noopener noreferrer"
                    >
                    <button className="mt-4 px-6 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                      {t('contactSection.location.getDirections')}
                    </button>
                  </a>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-lg">
                <div className="h-64 bg-gray-200 rounded-lg overflow-hidden">
                  <iframe
                    title="Nutty Scientists Egypt Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d215.854942114124!2d31.484534143653725!3d30.046063641548486!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145823df76b10511%3A0x3c0863ebcdd54a90!2sNuttyscientists%20egypt!5e0!3m2!1sar!2seg!4v1765395168065!5m2!1sar!2seg"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;

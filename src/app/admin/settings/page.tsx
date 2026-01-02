"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Save, Globe, Mail, Image as ImageIcon, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { AdminFormSkeleton } from "@/components/skeletons/AdminFormSkeleton";

import { supabase } from "@/lib/supabase";

export default function AdminSettingsPage() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [settings, setSettings] = useState({
    career_email: "",
    contact_email: "",
    whatsapp_number: "",
    logo_url: "",
    phone: "",
    address_en: "",
    address_ar: "",
    working_hours_en: "",
    working_hours_ar: "",
    dept_general_email: "",
    dept_general_phone: "",
    dept_school_email: "",
    dept_school_phone: "",
    dept_corporate_email: "",
    dept_corporate_phone: "",
    notification_emails: [] as string[],
    working_hour_start: 10,
    working_hour_end: 22,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/site-content?t=" + Date.now());
        if (res.ok) {
          const data = await res.json();
          if (data.settings) {
            setSettings({
              ...data.settings,
              notification_emails: data.settings.notification_emails || [],
              working_hour_start: data.settings.working_hour_start ?? 10,
              working_hour_end: data.settings.working_hour_end ?? 22,
            });
          }
        }
      } catch (e) {
        console.error("Error loading settings:", e);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      const res = await fetch("/api/site-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "settings",
          data: settings
        }),
      });

      if (res.ok) {
        setMessage({ 
          type: "success", 
          text: isRTL ? "تم حفظ الإعدادات بنجاح" : "Settings saved successfully" 
        });
      } else {
        throw new Error("Failed to save");
      }
    } catch (e) {
      setMessage({ 
        type: "error", 
        text: isRTL ? "فشل حفظ الإعدادات" : "Failed to save settings" 
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("bucket", "site-assets");

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Upload failed");
      }

      const { url } = await res.json();
      setSettings(prev => ({ ...prev, logo_url: url }));
      setMessage({ type: "success", text: isRTL ? "تم رفع الشعار بنجاح" : "Logo uploaded successfully" });
    } catch (error: any) {
      console.error("Upload error:", error);
      setMessage({ type: "error", text: isRTL ? "فشل رفع الشعار: " + error.message : "Failed to upload logo: " + error.message });
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="max-w-4xl mx-auto p-4 md:p-8 py-20">
          <AdminFormSkeleton sections={3} />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <Globe className="w-8 h-8 text-nutty-blue" />
            {isRTL ? "إعدادات الموقع" : "Site Settings"}
          </h2>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-3 bg-nutty-orange text-white rounded-2xl font-black shadow-lg shadow-orange-500/20 active:scale-95 transition-all flex items-center gap-2"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {isRTL ? "حفظ التغييرات" : "Save Changes"}
          </button>
        </div>

        {message.text && (
          <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 shadow-sm ${
            message.type === "success" 
              ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-100 dark:border-green-800"
              : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-100 dark:border-red-800"
          }`}>
            {message.type === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="font-bold">{message.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8">
          {/* Logo Section */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-xl">
            <h3 className="text-lg font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              {isRTL ? "شعار الموقع" : "Site Logo"}
            </h3>
            
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-48 h-48 bg-gray-50 dark:bg-gray-900 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-center overflow-hidden relative group">
                {settings.logo_url ? (
                  <img src={settings.logo_url} alt="Logo Preview" className="max-w-full max-h-full object-contain p-4" />
                ) : (
                  <div className="text-center p-4">
                    <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-xs text-gray-400 font-bold">{isRTL ? "لا يوجد شعار" : "No Logo"}</p>
                  </div>
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Loader2 className="w-10 h-10 text-white animate-spin" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 space-y-4 text-center md:text-left rtl:md:text-right">
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  {isRTL 
                    ? "يفضل استخدام متوفر بصيغة PNG أو SVG ذات خلفية شفافة." 
                    : "Preferred format: PNG or SVG with transparent background."}
                </p>
                <div className="relative inline-block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    {isRTL ? "تغيير الشعار" : "Change Logo"}
                  </div>
                </div>
                {settings.logo_url && (
                  <button 
                    onClick={() => setSettings(prev => ({ ...prev, logo_url: "" }))}
                    className="block text-xs text-red-500 font-bold hover:underline mx-auto md:mx-0"
                  >
                    {isRTL ? "إزالة الشعار" : "Remove Logo"}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Contact Emails Section */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-xl">
            <h3 className="text-lg font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Mail className="w-5 h-5" />
              {isRTL ? "البريد الإلكتروني للتواصل" : "Contact Emails"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="block text-sm font-black text-gray-400 uppercase tracking-widest">
                  {isRTL ? "بريد التواصل العام" : "General Contact Email"}
                </label>
                <input
                  type="email"
                  value={settings.contact_email}
                  onChange={(e) => setSettings(prev => ({ ...prev, contact_email: e.target.value }))}
                  placeholder="contact@nuttyscientists.com"
                  className="w-full p-4 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl focus:ring-2 focus:ring-nutty-blue transition-all"
                />
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-black text-gray-400 uppercase tracking-widest">
                  {isRTL ? "بريد التوظيف (CVs)" : "Careers Email (CVs)"}
                </label>
                <input
                  type="email"
                  value={settings.career_email}
                  onChange={(e) => setSettings(prev => ({ ...prev, career_email: e.target.value }))}
                  placeholder="careers@nuttyscientists.com"
                  className="w-full p-4 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl focus:ring-2 focus:ring-nutty-blue transition-all"
                />
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-black text-gray-400 uppercase tracking-widest">
                  {isRTL ? "رقم الواتساب" : "WhatsApp Number"}
                </label>
                <input
                  type="text"
                  value={settings.whatsapp_number}
                  onChange={(e) => setSettings(prev => ({ ...prev, whatsapp_number: e.target.value }))}
                  placeholder="201234567890"
                  className="w-full p-4 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl focus:ring-2 focus:ring-nutty-blue transition-all"
                />
                <p className="text-xs text-gray-400 mt-1">
                  {isRTL ? "أدخل الرقم كما هو (مثال: 201000000000) بدون علامة +" : "Enter number in international format (e.g., 201000000000) without + sign"}
                </p>
              </div>
            </div>
          </div>

          {/* Notification Emails Section */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-xl">
            <h3 className="text-lg font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Mail className="w-5 h-5" />
              {isRTL ? "إشعارات البريد الإلكتروني" : "Email Notifications"}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              {isRTL 
                ? "أضف رسائل البريد الإلكتروني التي ستتلقى إشعارات عند تلقي رسائل أو محتوى جديد." 
                : "Add emails that will receive notifications when new messages or content are submitted."}
            </p>

            <div className="space-y-4">
               {settings.notification_emails.map((email, i) => (
                 <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <span className="font-medium text-gray-700 dark:text-gray-300">{email}</span>
                    <button 
                      onClick={() => setSettings(prev => ({
                        ...prev,
                        notification_emails: prev.notification_emails.filter((_, idx) => idx !== i)
                      }))}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      <AlertCircle className="w-5 h-5" />
                    </button>
                 </div>
               ))}
               
               <div className="flex gap-2">
                 <input 
                   type="email" 
                   placeholder={isRTL ? "أدخل البريد الإلكتروني..." : "Enter email address..."}
                   className="flex-1 p-3 bg-gray-50 dark:bg-gray-700 border-none rounded-xl focus:ring-2 focus:ring-nutty-blue"
                   onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const val = e.currentTarget.value.trim();
                        if (val && !settings.notification_emails.includes(val)) {
                           setSettings(prev => ({ ...prev, notification_emails: [...prev.notification_emails, val] }));
                           e.currentTarget.value = '';
                        }
                      }
                   }}
                 />
                 <button 
                   onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                      const val = input.value.trim();
                      if (val && !settings.notification_emails.includes(val)) {
                         setSettings(prev => ({ ...prev, notification_emails: [...prev.notification_emails, val] }));
                         input.value = '';
                      }
                   }}
                   className="px-6 py-3 bg-nutty-blue text-white rounded-xl font-bold"
                 >
                   {isRTL ? "إضافة" : "Add"}
                 </button>
               </div>
            </div>
          </div>

          {/* Contact Details Section */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-xl">
            <h3 className="text-lg font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Globe className="w-5 h-5" />
              {isRTL ? "تفاصيل التواصل الأخرى" : "Other Contact Details"}
            </h3>

            <div className="space-y-6">
              <div className="space-y-4">
                <label className="block text-sm font-black text-gray-400 uppercase tracking-widest">
                  {isRTL ? "رقم الهاتف" : "Phone Number"}
                </label>
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) => setSettings(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full p-4 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl focus:ring-2 focus:ring-nutty-blue"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="block text-sm font-black text-gray-400 uppercase tracking-widest">
                    {isRTL ? "العنوان (EN)" : "Address (EN)"}
                  </label>
                  <input
                    type="text"
                    value={settings.address_en}
                    onChange={(e) => setSettings(prev => ({ ...prev, address_en: e.target.value }))}
                    className="w-full p-4 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl focus:ring-2 focus:ring-nutty-blue"
                  />
                </div>
                <div className="space-y-4">
                  <label className="block text-sm font-black text-gray-400 uppercase tracking-widest">
                    {isRTL ? "العنوان (AR)" : "Address (AR)"}
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    value={settings.address_ar}
                    onChange={(e) => setSettings(prev => ({ ...prev, address_ar: e.target.value }))}
                    className="w-full p-4 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl focus:ring-2 focus:ring-nutty-blue"
                  />
                </div>
                <div className="space-y-4">
                  <label className="block text-sm font-black text-gray-400 uppercase tracking-widest">
                    {isRTL ? "مواعيد العمل (EN)" : "Working Hours (EN)"}
                  </label>
                  <input
                    type="text"
                    value={settings.working_hours_en}
                    onChange={(e) => setSettings(prev => ({ ...prev, working_hours_en: e.target.value }))}
                    className="w-full p-4 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl focus:ring-2 focus:ring-nutty-blue"
                    placeholder="Mon-Sun: 9:00 AM - 9:00 PM"
                  />
                </div>
                <div className="space-y-4">
                  <label className="block text-sm font-black text-gray-400 uppercase tracking-widest">
                    {isRTL ? "مواعيد العمل (AR)" : "Working Hours (AR)"}
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    value={settings.working_hours_ar}
                    onChange={(e) => setSettings(prev => ({ ...prev, working_hours_ar: e.target.value }))}
                    className="w-full p-4 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl focus:ring-2 focus:ring-nutty-blue"
                    placeholder="نعمل يومياً على مدار الأسبوع"
                  />
                </div>
                {/* Structured Working Hours for Bot */}
                <div className="space-y-4">
                  <label className="block text-sm font-black text-gray-400 uppercase tracking-widest">
                    {isRTL ? "بداية وقت العمل (0-23)" : "Work Hour Start (0-23)"}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="23"
                    value={settings.working_hour_start}
                    onChange={(e) => setSettings(prev => ({ ...prev, working_hour_start: parseInt(e.target.value) || 0 }))}
                    className="w-full p-4 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl focus:ring-2 focus:ring-nutty-blue"
                  />
                </div>
                <div className="space-y-4">
                  <label className="block text-sm font-black text-gray-400 uppercase tracking-widest">
                    {isRTL ? "نهاية وقت العمل (0-23)" : "Work Hour End (0-23)"}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="23"
                    value={settings.working_hour_end}
                    onChange={(e) => setSettings(prev => ({ ...prev, working_hour_end: parseInt(e.target.value) || 0 }))}
                    className="w-full p-4 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl focus:ring-2 focus:ring-nutty-blue"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Departmental Contact Info Section */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-xl">
            <h3 className="text-lg font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Mail className="w-5 h-5" />
              {isRTL ? "معلومات التواصل للأقسام" : "Departmental Contact Info"}
            </h3>

            <div className="space-y-8">
              {/* General Inquiries */}
              <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                <h4 className="font-black text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-nutty-blue"></div>
                  {isRTL ? "الاستفسارات العامة (General Inquiries)" : "General Inquiries"}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">{isRTL ? "البريد الإلكتروني" : "Email"}</label>
                    <input type="email" value={settings.dept_general_email} onChange={(e) => setSettings(prev => ({ ...prev, dept_general_email: e.target.value }))} className="w-full p-4 bg-white dark:bg-gray-800 border-none rounded-2xl" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">{isRTL ? "رقم الهاتف" : "Phone"}</label>
                    <input type="text" value={settings.dept_general_phone} onChange={(e) => setSettings(prev => ({ ...prev, dept_general_phone: e.target.value }))} className="w-full p-4 bg-white dark:bg-gray-800 border-none rounded-2xl" />
                  </div>
                </div>
              </div>

              {/* School Programs */}
              <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                <h4 className="font-black text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-nutty-orange"></div>
                  {isRTL ? "البرامج المدرسية (School Programs)" : "School Programs"}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">{isRTL ? "البريد الإلكتروني" : "Email"}</label>
                    <input type="email" value={settings.dept_school_email} onChange={(e) => setSettings(prev => ({ ...prev, dept_school_email: e.target.value }))} className="w-full p-4 bg-white dark:bg-gray-800 border-none rounded-2xl" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">{isRTL ? "رقم الهاتف" : "Phone"}</label>
                    <input type="text" value={settings.dept_school_phone} onChange={(e) => setSettings(prev => ({ ...prev, dept_school_phone: e.target.value }))} className="w-full p-4 bg-white dark:bg-gray-800 border-none rounded-2xl" />
                  </div>
                </div>
              </div>

              {/* Corporate Events */}
              <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                <h4 className="font-black text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-nutty-blue"></div>
                  {isRTL ? "فعاليات الشركات (Corporate Events)" : "Corporate Events"}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">{isRTL ? "البريد الإلكتروني" : "Email"}</label>
                    <input type="email" value={settings.dept_corporate_email} onChange={(e) => setSettings(prev => ({ ...prev, dept_corporate_email: e.target.value }))} className="w-full p-4 bg-white dark:bg-gray-800 border-none rounded-2xl" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">{isRTL ? "رقم الهاتف" : "Phone"}</label>
                    <input type="text" value={settings.dept_corporate_phone} onChange={(e) => setSettings(prev => ({ ...prev, dept_corporate_phone: e.target.value }))} className="w-full p-4 bg-white dark:bg-gray-800 border-none rounded-2xl" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

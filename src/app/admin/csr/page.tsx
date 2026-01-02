"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import { AdminFormSkeleton } from "@/components/skeletons/AdminFormSkeleton";
import { Save, Globe, FileText, Trash, Plus, Star, Heart, Users, Handshake } from "lucide-react";

export default function AdminCSRPage() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [csrContent, setCsrContent] = useState({
    title_en: "Corporate Social Responsibility (CSR)",
    title_ar: "المسؤولية المجتمعية للشركات (CSR)",
    subtitle_en: "Making Science Accessible to Every Child",
    subtitle_ar: "جعل العلوم في متناول كل طفل",
    lead_en: "Nutty Scientists Egypt is committed to creating a positive impact on society by empowering the next generation of thinkers and innovators.",
    lead_ar: "يلتزم ناتي ساينتستس مصر بخلق أثر إيجابي في المجتمع من خلال تمكين الجيل القادم من المفكرين والمبتكرين.",
    initiatives: [
      {
        id: 1,
        title_en: "Science for All",
        title_ar: "العلوم للجميع",
        description_en: "Providing free scientific workshops to children in underprivileged areas and rural communities.",
        description_ar: "تقديم ورش عمل علمية مجانية للأطفال في المناطق الأقل حظاً والمجتمعات الريفية.",
        icon: "Globe",
        color: "text-blue-500",
        bg: "bg-blue-50 dark:bg-blue-900/20"
      },
      {
        id: 2,
        title_en: "Eco-Curiosity",
        title_ar: "الفضول البيئي",
        description_en: "Raising environmental awareness through hands-on experiments about sustainability and renewable energy.",
        description_ar: "رفع الوعي البيئي من خلال تجارب عملية حول الاستدامة والطاقة المتجددة.",
        icon: "Heart",
        color: "text-green-500",
        bg: "bg-green-50 dark:bg-green-900/20"
      },
      {
        id: 3,
        title_en: "Inclusion in STEM",
        title_ar: "الدمج في STEM",
        description_en: "Tailored programs for children with special needs, ensuring that science is a fun experience for everyone.",
        description_ar: "برامج مخصصة للأطفال من ذوي الاحتياجات الخاصة، لضمان أن يكون العلم تجربة ممتعة للجميع.",
        icon: "Users",
        color: "text-purple-500",
        bg: "bg-purple-50 dark:bg-purple-900/20"
      }
    ],
    partnership: {
      title_en: "Partner for Impact",
      title_ar: "شراكة من أجل الأثر",
      description_en: "We collaborate with companies and NGOs to sponsor educational programs that reach thousands of students across Egypt.",
      description_ar: "نتعاون مع الشركات والمنظمات غير الحكومية لرعاية البرامج التعليمية التي تصل إلى آلاف الطلاب في جميع أنحاء مصر.",
      cta_en: "Partner with Us",
      cta_ar: "شاركنا الأثر"
    }
  });

  // Load content
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`/api/site-content?t=${Date.now()}`);
        if (res.ok) {
          const data = await res.json();
          if (data.csr) {
            setCsrContent(data.csr);
          }
        }
      } catch (error) {
        setMessage(isRTL ? "خطأ في تحميل البيانات" : "Error loading data");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [isRTL]);

  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/site-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "csr",
          data: csrContent,
        }),
      });

      if (res.ok) {
        setMessage(isRTL ? "تم الحفظ بنجاح!" : "Saved successfully!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(isRTL ? "فشل الحفظ" : "Failed to save");
      }
    } catch (error) {
      setMessage(isRTL ? "خطأ في الحفظ" : "Error saving");
    } finally {
      setSaving(false);
    }
  };

  const updateHeader = (field: string, value: string) => {
    setCsrContent(prev => ({ ...prev, [field]: value }));
  };

  const updatePartnership = (field: string, value: string) => {
    setCsrContent(prev => ({
      ...prev,
      partnership: { ...prev.partnership, [field]: value }
    }));
  };

  const addInitiative = () => {
    setCsrContent(prev => ({
      ...prev,
      initiatives: [...prev.initiatives, {
        id: Date.now(),
        title_en: "", title_ar: "",
        description_en: "", description_ar: "",
        icon: "Globe", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20"
      }]
    }));
  };

  const removeInitiative = (id: number) => {
    setCsrContent(prev => ({
      ...prev,
      initiatives: prev.initiatives.filter(i => i.id !== id)
    }));
  };

  const updateInitiative = (id: number, field: string, value: string) => {
    setCsrContent(prev => ({
      ...prev,
      initiatives: prev.initiatives.map(i => i.id === id ? { ...i, [field]: value } : i)
    }));
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="max-w-5xl mx-auto py-20">
          <AdminFormSkeleton sections={3} />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header Control */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {isRTL ? "إدارة المسؤولية المجتمعية" : "CSR Management"}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {isRTL ? "تعديل محتوى قسم المسؤولية المجتمعية" : "Edit CSR section content"}
              </p>
            </div>
            <button
              onClick={() => router.push("/#csr")}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {isRTL ? "معاينة القسم" : "Preview Section"}
            </button>
          </div>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg shadow-sm font-bold ${
            message.includes("success") || message.includes("نجاح")
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200 border border-green-200"
              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200 border border-red-200"
          }`}>
            {message}
          </div>
        )}

        {/* Main Header Logic */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Star className="w-6 h-6 text-nutty-cyan" />
            {isRTL ? "ترويسة القسم" : "Section Header"}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="block text-sm font-black text-gray-700 dark:text-gray-300">Title (EN)</label>
              <input
                type="text"
                value={csrContent.title_en}
                onChange={(e) => updateHeader('title_en', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 font-bold"
              />
              <label className="block text-sm font-black text-gray-700 dark:text-gray-300">Subtitle (EN)</label>
              <input
                type="text"
                value={csrContent.subtitle_en}
                onChange={(e) => updateHeader('subtitle_en', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 font-bold"
              />
              <label className="block text-sm font-black text-gray-700 dark:text-gray-300">Lead Text (EN)</label>
              <textarea
                value={csrContent.lead_en}
                onChange={(e) => updateHeader('lead_en', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 font-bold"
                rows={3}
              />
            </div>
            <div className="space-y-4" dir="rtl">
              <label className="block text-sm font-black text-gray-700 dark:text-gray-300">العنوان (عربي)</label>
              <input
                type="text"
                value={csrContent.title_ar}
                onChange={(e) => updateHeader('title_ar', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 font-bold"
              />
              <label className="block text-sm font-black text-gray-700 dark:text-gray-300">العنوان الفرعي (عربي)</label>
              <input
                type="text"
                value={csrContent.subtitle_ar}
                onChange={(e) => updateHeader('subtitle_ar', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 font-bold"
              />
              <label className="block text-sm font-black text-gray-700 dark:text-gray-300">النص التعريفي (عربي)</label>
              <textarea
                value={csrContent.lead_ar}
                onChange={(e) => updateHeader('lead_ar', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 font-bold"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Initiatives */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Heart className="w-6 h-6 text-red-500" />
              {isRTL ? "المبادرات" : "Initiatives"}
            </h2>
            <button
              onClick={addInitiative}
              className="px-4 py-2 bg-nutty-cyan text-white rounded-lg flex items-center gap-2 font-bold hover:bg-nutty-cyan-dark transition-all"
            >
              <Plus className="w-4 h-4" />
              {isRTL ? "إضافة مبادرة" : "Add Initiative"}
            </button>
          </div>

          <div className="space-y-6">
            {csrContent.initiatives.map((item, idx) => (
              <div key={item.id} className="p-6 border border-gray-200 dark:border-gray-700 rounded-2xl relative bg-gray-50/50 dark:bg-gray-900/30 group">
                <button
                  onClick={() => removeInitiative(item.id)}
                  className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 rounded-full transition-opacity opacity-0 group-hover:opacity-100"
                >
                  <Trash className="w-5 h-5" />
                </button>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="block text-xs font-black text-gray-500">Initiative Title (EN)</label>
                    <input
                      type="text"
                      value={item.title_en}
                      onChange={(e) => updateInitiative(item.id, 'title_en', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg font-bold"
                    />
                    <label className="block text-xs font-black text-gray-500">Description (EN)</label>
                    <textarea
                      value={item.description_en}
                      onChange={(e) => updateInitiative(item.id, 'description_en', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg font-bold"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-4" dir="rtl">
                    <label className="block text-xs font-black text-gray-500">عنوان المبادرة (عربي)</label>
                    <input
                      type="text"
                      value={item.title_ar}
                      onChange={(e) => updateInitiative(item.id, 'title_ar', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg font-bold"
                    />
                    <label className="block text-xs font-black text-gray-500">الوصف (عربي)</label>
                    <textarea
                      value={item.description_ar}
                      onChange={(e) => updateInitiative(item.id, 'description_ar', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg font-bold"
                      rows={2}
                    />
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-gray-500">Icon Type</label>
                    <select
                      value={item.icon || "Globe"}
                      onChange={(e) => updateInitiative(item.id, 'icon', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                    >
                      <option value="Globe">Globe 🌐</option>
                      <option value="Heart">Heart ❤️</option>
                      <option value="Users">Users 👥</option>
                      <option value="Star">Star ⭐</option>
                      <option value="Target">Target 🎯</option>
                    </select>
                  </div>
                  <div className="flex items-end gap-3">
                    <div className={`w-10 h-10 rounded-lg ${item.bg || 'bg-gray-100'} flex items-center justify-center`}>
                      <Star className={`w-5 h-5 ${item.color || 'text-gray-500'}`} />
                    </div>
                    <span className="text-xs font-bold text-gray-500 italic">Preview styling</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Partnership Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Handshake className="w-6 h-6 text-nutty-blue" />
            {isRTL ? "قسم الشراكات" : "Partnership Section"}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="block text-sm font-black text-gray-700 dark:text-gray-300">Partner Title (EN)</label>
              <input
                type="text"
                value={csrContent.partnership.title_en}
                onChange={(e) => updatePartnership('title_en', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl font-bold"
              />
              <label className="block text-sm font-black text-gray-700 dark:text-gray-300">Description (EN)</label>
              <textarea
                value={csrContent.partnership.description_en}
                onChange={(e) => updatePartnership('description_en', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl font-bold"
                rows={3}
              />
              <label className="block text-sm font-black text-gray-700 dark:text-gray-300">CTA Label (EN)</label>
              <input
                type="text"
                value={csrContent.partnership.cta_en}
                onChange={(e) => updatePartnership('cta_en', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl font-bold"
              />
            </div>
            <div className="space-y-4" dir="rtl">
              <label className="block text-sm font-black text-gray-700 dark:text-gray-300">عنوان الشراكة (عربي)</label>
              <input
                type="text"
                value={csrContent.partnership.title_ar}
                onChange={(e) => updatePartnership('title_ar', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl font-bold"
              />
              <label className="block text-sm font-black text-gray-700 dark:text-gray-300">الوصف (عربي)</label>
              <textarea
                value={csrContent.partnership.description_ar}
                onChange={(e) => updatePartnership('description_ar', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl font-bold"
                rows={3}
              />
              <label className="block text-sm font-black text-gray-700 dark:text-gray-300">نص الزر (عربي)</label>
              <input
                type="text"
                value={csrContent.partnership.cta_ar}
                onChange={(e) => updatePartnership('cta_ar', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl font-bold"
              />
            </div>
          </div>
        </div>

        {/* Final Save */}
        <div className="flex justify-end sticky bottom-6 z-30">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-3 px-8 py-4 bg-nutty-orange text-white rounded-2xl font-black text-xl hover:bg-nutty-orange-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
          >
            <Save className="w-6 h-6" />
            {saving 
              ? (isRTL ? "جاري الحفظ..." : "Saving...")
              : (isRTL ? "حفظ التغييرات" : "Save Changes")}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}

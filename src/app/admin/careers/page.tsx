"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Save, Trash2, Plus, X, Briefcase, MapPin, Clock, CheckCircle, AlertCircle } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";

export default function AdminCareersPage() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title_en: "",
    title_ar: "",
    department_en: "",
    department_ar: "",
    location_en: "Cairo, Egypt",
    location_ar: "القاهرة، مصر",
    type_en: "Full-time",
    type_ar: "دوام كامل",
    description_en: "",
    description_ar: "",
    requirements_en: [] as string[],
    requirements_ar: [] as string[],
    active: true,
  });

  const [newReqEn, setNewReqEn] = useState("");
  const [newReqAr, setNewReqAr] = useState("");

  useEffect(() => {
    async function loadJobs() {
      try {
        const res = await fetch("/api/admin/jobs");
        if (res.ok) {
          const data = await res.json();
          setJobs(data);
        } else {
          setMessage(isRTL ? "فشل تحميل الوظائف" : "Failed to load jobs");
        }
      } catch (e) {
        setMessage(isRTL ? "خطأ في الاتصال" : "Connection error");
      } finally {
        setLoading(false);
      }
    }
    loadJobs();
  }, [isRTL]);

  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addRequirement = (lang: 'en' | 'ar') => {
    const val = lang === 'en' ? newReqEn : newReqAr;
    const field = lang === 'en' ? 'requirements_en' : 'requirements_ar';
    if (val.trim()) {
      handleFieldChange(field, [...formData[field], val.trim()]);
      if (lang === 'en') setNewReqEn(""); else setNewReqAr("");
    }
  };

  const removeRequirement = (lang: 'en' | 'ar', index: number) => {
    const field = lang === 'en' ? 'requirements_en' : 'requirements_ar';
    handleFieldChange(field, formData[field].filter((_: any, i: number) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = "/api/admin/jobs";
      const method = editId ? "PUT" : "POST";
      const body = editId ? { ...formData, id: editId } : formData;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        if (editId) {
          setJobs((prev) => prev.map((j) => (j.id === editId ? { ...j, ...formData } : j)));
          setMessage(isRTL ? "تم التحديث بنجاح" : "Updated successfully");
        } else {
          const result = await res.json();
          setJobs((prev) => [result.job, ...prev]);
          setMessage(isRTL ? "تمت الإضافة بنجاح" : "Added successfully");
        }
        handleCancel();
      } else {
        setMessage(isRTL ? "فشل الحفظ" : "Save failed");
      }
    } catch (e) {
      setMessage(isRTL ? "خطأ في الحفظ" : "Save error");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (job: any) => {
    setEditId(job.id);
    setFormData({
      title_en: job.title_en || "",
      title_ar: job.title_ar || "",
      department_en: job.department_en || "",
      department_ar: job.department_ar || "",
      location_en: job.location_en || "Cairo, Egypt",
      location_ar: job.location_ar || "القاهرة، مصر",
      type_en: job.type_en || "Full-time",
      type_ar: job.type_ar || "دوام كامل",
      description_en: job.description_en || "",
      description_ar: job.description_ar || "",
      requirements_en: job.requirements_en || [],
      requirements_ar: job.requirements_ar || [],
      active: job.active ?? true,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditId(null);
    setFormData({
      title_en: "",
      title_ar: "",
      department_en: "",
      department_ar: "",
      location_en: "Cairo, Egypt",
      location_ar: "القاهرة، مصر",
      type_en: "Full-time",
      type_ar: "دوام كامل",
      description_en: "",
      description_ar: "",
      requirements_en: [],
      requirements_ar: [],
      active: true,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm(isRTL ? "حذف هذه الوظيفة؟" : "Delete this job?")) return;
    try {
      const res = await fetch(`/api/admin/jobs?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setJobs((prev) => prev.filter((j) => j.id !== id));
        setMessage(isRTL ? "تم الحذف" : "Deleted");
      }
    } catch (e) {
      setMessage("Error");
    }
  };

  if (loading) return <div className="p-10">{isRTL ? "جاري التحميل..." : "Loading..."}</div>;

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-3">
          <Briefcase className="w-8 h-8 text-nutty-orange" />
          {isRTL ? "إدارة الوظائف" : "Manage Careers"}
        </h2>

        {message && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-xl flex justify-between items-center shadow-sm">
            <span>{message}</span>
            <button onClick={() => setMessage("")}><X className="w-5 h-5" /></button>
          </div>
        )}

        {/* Job Form */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-xl mb-12">
          <h3 className="text-xl font-bold mb-8 text-gray-800 dark:text-gray-200 uppercase tracking-widest">
            {editId ? (isRTL ? "تعديل وظيفة" : "Edit Job Position") : (isRTL ? "إضافة وظيفة جديدة" : "Post New Position")}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Titles */}
            <div className="space-y-4">
              <label className="block text-sm font-black text-gray-400 uppercase tracking-widest">{isRTL ? "المسمى الوظيفي (EN)" : "Job Title (EN)"}</label>
              <input type="text" value={formData.title_en} onChange={e => handleFieldChange("title_en", e.target.value)} className="w-full p-4 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl focus:ring-2 focus:ring-nutty-blue transition-all" />
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-black text-gray-400 uppercase tracking-widest">{isRTL ? "المسمى الوظيفي (AR)" : "Job Title (AR)"}</label>
              <input type="text" dir="rtl" value={formData.title_ar} onChange={e => handleFieldChange("title_ar", e.target.value)} className="w-full p-4 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl focus:ring-2 focus:ring-nutty-blue transition-all" />
            </div>

            {/* Department */}
            <div className="space-y-4">
              <label className="block text-sm font-black text-gray-400 uppercase tracking-widest">{isRTL ? "القسم (EN)" : "Department (EN)"}</label>
              <input type="text" value={formData.department_en} onChange={e => handleFieldChange("department_en", e.target.value)} className="w-full p-4 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl focus:ring-2 focus:ring-nutty-blue transition-all" />
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-black text-gray-400 uppercase tracking-widest">{isRTL ? "القسم (AR)" : "Department (AR)"}</label>
              <input type="text" dir="rtl" value={formData.department_ar} onChange={e => handleFieldChange("department_ar", e.target.value)} className="w-full p-4 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl focus:ring-2 focus:ring-nutty-blue transition-all" />
            </div>

            {/* Location & Type */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <label className="block text-sm font-black text-gray-400 uppercase tracking-widest">{isRTL ? "الموقع (EN)" : "Location (EN)"}</label>
                <input type="text" value={formData.location_en} onChange={e => handleFieldChange("location_en", e.target.value)} className="w-full p-4 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl" />
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-black text-gray-400 uppercase tracking-widest">{isRTL ? "النوع (EN)" : "Type (EN)"}</label>
                <input type="text" value={formData.type_en} onChange={e => handleFieldChange("type_en", e.target.value)} className="w-full p-4 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4" dir="rtl">
              <div className="space-y-4">
                <label className="block text-sm font-black text-gray-400 uppercase tracking-widest">{isRTL ? "الموقع (AR)" : "Location (AR)"}</label>
                <input type="text" value={formData.location_ar} onChange={e => handleFieldChange("location_ar", e.target.value)} className="w-full p-4 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl" />
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-black text-gray-400 uppercase tracking-widest">{isRTL ? "النوع (AR)" : "Type (AR)"}</label>
                <input type="text" value={formData.type_ar} onChange={e => handleFieldChange("type_ar", e.target.value)} className="w-full p-4 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl" />
              </div>
            </div>

            {/* Descriptions */}
            <div className="space-y-4">
              <label className="block text-sm font-black text-gray-400 uppercase tracking-widest">{isRTL ? "الوصف (EN)" : "Description (EN)"}</label>
              <textarea rows={4} value={formData.description_en} onChange={e => handleFieldChange("description_en", e.target.value)} className="w-full p-4 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl" />
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-black text-gray-400 uppercase tracking-widest">{isRTL ? "الوصف (AR)" : "Description (AR)"}</label>
              <textarea rows={4} dir="rtl" value={formData.description_ar} onChange={e => handleFieldChange("description_ar", e.target.value)} className="w-full p-4 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl" />
            </div>

            {/* Requirements EN */}
            <div className="space-y-4">
              <label className="block text-sm font-black text-gray-400 uppercase tracking-widest">{isRTL ? "المتطلبات (EN)" : "Requirements (EN)"}</label>
              <div className="flex gap-2">
                <input type="text" value={newReqEn} onChange={e => setNewReqEn(e.target.value)} className="flex-1 p-4 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl" placeholder="Add requirement..." />
                <button onClick={() => addRequirement('en')} className="p-4 bg-nutty-blue text-white rounded-2xl"><Plus /></button>
              </div>
              <div className="space-y-2">
                {formData.requirements_en.map((req, i) => (
                  <div key={i} className="flex justify-between items-center bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl">
                    <span className="text-sm">{req}</span>
                    <button onClick={() => removeRequirement('en', i)} className="text-red-500"><X className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements AR */}
            <div className="space-y-4">
              <label className="block text-sm font-black text-gray-400 uppercase tracking-widest">{isRTL ? "المتطلبات (AR)" : "Requirements (AR)"}</label>
              <div className="flex gap-2" dir="rtl">
                <input type="text" value={newReqAr} onChange={e => setNewReqAr(e.target.value)} className="flex-1 p-4 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl" placeholder="أضف شرطاً..." />
                <button onClick={() => addRequirement('ar')} className="p-4 bg-nutty-blue text-white rounded-2xl"><Plus /></button>
              </div>
              <div className="space-y-2" dir="rtl">
                {formData.requirements_ar.map((req, i) => (
                  <div key={i} className="flex justify-between items-center bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl text-right">
                    <span className="text-sm">{req}</span>
                    <button onClick={() => removeRequirement('ar', i)} className="text-red-500"><X className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-2 flex items-center gap-4 py-4 border-t border-gray-100 dark:border-gray-700 mt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={formData.active} onChange={e => handleFieldChange("active", e.target.checked)} className="w-5 h-5 rounded text-nutty-orange" />
                <span className="font-bold text-gray-700 dark:text-gray-300">{isRTL ? "وظيفة مفعلة (تظهر في الموقع)" : "Active Position (Publicly Visible)"}</span>
              </label>
            </div>
          </div>

          <div className="mt-10 flex gap-4">
            <button onClick={handleSave} disabled={saving} className="px-10 py-4 bg-nutty-orange text-white rounded-2xl font-black shadow-lg shadow-orange-500/20 active:scale-95 transition-all">
              {saving ? "..." : (isRTL ? "حفظ الوظيفة" : "Save Job")}
            </button>
            {editId && <button onClick={handleCancel} className="px-10 py-4 border border-gray-200 dark:border-gray-700 rounded-2xl font-bold">{isRTL ? "إلغاء" : "Cancel"}</button>}
          </div>
        </div>

        {/* Jobs List */}
        <div className="space-y-6">
          <h3 className="text-xl font-black text-gray-900 dark:text-white mb-6 uppercase tracking-widest">{isRTL ? "قائمة الوظائف" : "Job List"}</h3>
          {jobs.length === 0 ? (
            <div className="bg-gray-50 dark:bg-gray-800/50 p-12 text-center rounded-3xl border border-dashed border-gray-200">{isRTL ? "لا توجد وظائف حالياً" : "No jobs posted yet."}</div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {jobs.map(job => (
                <div key={job.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${job.active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                      {job.active ? <CheckCircle className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">{isRTL ? job.title_ar : job.title_en}</h4>
                      <div className="flex gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {isRTL ? job.location_ar : job.location_en}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {isRTL ? job.type_ar : job.type_en}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(job)} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"><Plus className="w-5 h-5 text-nutty-blue rotate-45" /></button>
                    <button onClick={() => handleDelete(job.id)} className="p-3 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"><Trash2 className="w-5 h-5 text-red-500" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Save, Trash2, Upload, Image as ImageIcon, Plus, X, Star } from "lucide-react";
import Image from "next/image";
import AdminLayout from "@/components/admin/AdminLayout";

export default function AdminProjectsPage() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const router = useRouter();

  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "education",
    description_en: "",
    description_ar: "",
    image: "",
    technologies: [] as string[],
    date: new Date().getFullYear().toString(),
    team: 1,
    link: "#",
    github: "",
    featured: false,
  });
  const [newTech, setNewTech] = useState("");

  // Load existing projects
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/projects");
        if (res.ok) {
          const data = await res.json();
          setProjects(data);
        } else {
          setMessage(isRTL ? "فشل تحميل المشاريع" : "Failed to load projects");
        }
      } catch (e) {
        setMessage(isRTL ? "خطأ في تحميل المشاريع" : "Error loading projects");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [isRTL]);

  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const data = new FormData();
    data.append("file", file);
    try {
      const res = await fetch("/api/upload-image", {
        method: "POST",
        body: data,
      });
      if (res.ok) {
        const result = await res.json();
        handleFieldChange("image", result.url);
        setMessage(isRTL ? "تم رفع الصورة بنجاح!" : "Image uploaded successfully!");
      } else {
        const err = await res.json();
        setMessage(err.error || (isRTL ? "فشل رفع الصورة" : "Image upload failed"));
      }
    } catch (e) {
      setMessage(isRTL ? "خطأ في رفع الصورة" : "Error uploading image");
    } finally {
      setUploading(false);
    }
  };

  const addTech = () => {
    if (newTech.trim()) {
      handleFieldChange("technologies", [...formData.technologies, newTech.trim()]);
      setNewTech("");
    }
  };

  const removeTech = (index: number) => {
    handleFieldChange("technologies", formData.technologies.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = "/api/admin/projects";
      const method = editId ? "PUT" : "POST";
      const body = editId ? { ...formData, id: editId } : formData;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        if (editId) {
          setProjects((prev) => prev.map((p) => (p.id === editId ? { ...p, ...formData } : p)));
          setMessage(isRTL ? "تم تحديث المشروع!" : "Project updated!");
        } else {
          const result = await res.json();
          setProjects((prev) => [result.project, ...prev]);
          setMessage(isRTL ? "تم إضافة المشروع!" : "Project added!");
        }
        handleCancel();
      } else {
        setMessage(isRTL ? "فشل الحفظ" : "Failed to save");
      }
    } catch (e) {
      setMessage(isRTL ? "خطأ في الحفظ" : "Error saving");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (project: any) => {
    setEditId(project.id);
    setFormData({
      title: project.title,
      category: project.category || "education",
      description_en: project.description_en || "",
      description_ar: project.description_ar || "",
      image: project.image || "",
      technologies: project.technologies || [],
      date: project.date || "",
      team: project.team || 1,
      link: project.link || "#",
      github: project.github || "",
      featured: project.featured || false,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditId(null);
    setFormData({
      title: "",
      category: "education",
      description_en: "",
      description_ar: "",
      image: "",
      technologies: [],
      date: new Date().getFullYear().toString(),
      team: 1,
      link: "#",
      github: "",
      featured: false,
    });
    setNewTech("");
  };

  const handleDelete = async (id: string) => {
    if (!confirm(isRTL ? "هل تريد حذف المشروع؟" : "Delete this project?")) return;
    try {
      const res = await fetch(`/api/admin/projects?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
        setMessage(isRTL ? "تم حذف المشروع" : "Project deleted");
      } else {
        setMessage(isRTL ? "فشل حذف المشروع" : "Failed to delete project");
      }
    } catch (e) {
      setMessage(isRTL ? "خطأ في حذف المشروع" : "Error deleting project");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-xl text-gray-900 dark:text-white">
          {isRTL ? "جاري التحميل..." : "Loading..."}
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <section className="py-20 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {isRTL ? "إدارة المشاريع" : "Manage Projects"}
            </h2>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${message.includes("success") || message.includes("تم") ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200"}`}>
              <span className="flex-1">{message}</span>
              <button onClick={() => setMessage("")}><X className="w-4 h-4" /></button>
            </div>
          )}

          {/* Form */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8 border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
              {editId ? <Plus className="w-5 h-5 rotate-45 text-nutty-orange" /> : <Plus className="w-5 h-5 text-nutty-orange" />}
              {editId ? (isRTL ? "تعديل مشروع" : "Edit Project") : (isRTL ? "إضافة مشروع جديد" : "Add New Project")}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {isRTL ? "العنوان" : "Title"}
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleFieldChange("title", e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-nutty-orange"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {isRTL ? "القسم" : "Category"}
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleFieldChange("category", e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                  >
                    <option value="education">Education</option>
                    <option value="technology">Technology</option>
                    <option value="product">Product</option>
                    <option value="media">Media</option>
                    <option value="personalized">Personalized</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {isRTL ? "التاريخ" : "Date"}
                    </label>
                    <input
                      type="text"
                      value={formData.date}
                      onChange={(e) => handleFieldChange("date", e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {isRTL ? "عدد الفريق" : "Team Size"}
                    </label>
                    <input
                      type="number"
                      value={formData.team}
                      onChange={(e) => handleFieldChange("team", parseInt(e.target.value))}
                      className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => handleFieldChange("featured", e.target.checked)}
                    className="w-4 h-4 text-nutty-orange rounded border-gray-300 focus:ring-nutty-orange"
                  />
                  <label htmlFor="featured" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                    <Star className={`w-4 h-4 ${formData.featured ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
                    {isRTL ? "مشروع مميز (Featured)" : "Featured Project"}
                  </label>
                </div>
              </div>

              {/* Descriptions */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {isRTL ? "الوصف (English)" : "Description (English)"}
                  </label>
                  <textarea
                    rows={4}
                    value={formData.description_en}
                    onChange={(e) => handleFieldChange("description_en", e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {isRTL ? "الوصف (عربي)" : "Description (Arabic)"}
                  </label>
                  <textarea
                    rows={4}
                    dir="rtl"
                    value={formData.description_ar}
                    onChange={(e) => handleFieldChange("description_ar", e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                  />
                </div>
              </div>

              {/* Image & Technologies */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {isRTL ? "صورة المشروع" : "Project Image"}
                </label>
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="hidden"
                      id="project-image-upload"
                    />
                    <label
                      htmlFor="project-image-upload"
                      className="flex items-center justify-center px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg cursor-pointer hover:bg-gray-200"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {uploading ? (isRTL ? "جاري الرفع..." : "Uploading...") : (isRTL ? "رفع صورة" : "Upload Image")}
                    </label>
                  </div>
                  {formData.image && (
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                      <Image src={formData.image} alt="Preview" fill className="object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {isRTL ? "التقنيات / الأدوات" : "Technologies / Tools"}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTech}
                    onChange={(e) => setNewTech(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addTech()}
                    placeholder={isRTL ? "أضف تقنية..." : "Add tech..."}
                    className="flex-1 px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                  />
                  <button onClick={addTech} className="p-2 bg-nutty-blue text-white rounded-lg"><Plus className="w-5 h-5" /></button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.technologies.map((tech, i) => (
                    <span key={i} className="px-3 py-1 bg-nutty-orange/10 text-nutty-orange rounded-full text-xs font-semibold flex items-center gap-1">
                      {tech}
                      <button onClick={() => removeTech(i)}><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {isRTL ? "رابط المشروع" : "Project Link"}
                  </label>
                  <input
                    type="text"
                    value={formData.link}
                    onChange={(e) => handleFieldChange("link", e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {isRTL ? "رابط GitHub (اختياري)" : "GitHub Link (Optional)"}
                  </label>
                  <input
                    type="text"
                    value={formData.github}
                    onChange={(e) => handleFieldChange("github", e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
              <button
                onClick={handleSave}
                disabled={saving || !formData.title}
                className="flex items-center px-8 py-3 bg-nutty-orange text-white rounded-lg hover:bg-nutty-orange/90 transition shadow-lg disabled:opacity-50"
              >
                <Save className="w-5 h-5 mr-2" />
                {saving ? (isRTL ? "جاري الحفظ..." : "Saving...") : (isRTL ? "حفظ التغييرات" : "Save Changes")}
              </button>
              {editId && (
                <button onClick={handleCancel} className="px-8 py-3 bg-gray-200 dark:bg-gray-700 rounded-lg">
                  {isRTL ? "إلغاء" : "Cancel"}
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              {isRTL ? "المشاريع المضافة" : "Added Projects"}
            </h3>
            {projects.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm text-gray-500">
                {isRTL ? "لا توجد مشاريع مضافة" : "No projects found"}
              </div>
            ) : (
              projects.map((p) => (
                <div key={p.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 flex items-center gap-4 transition-hover hover:shadow-md border border-gray-50 dark:border-gray-700">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <Image src={p.image || "/About.jpg"} alt={p.title} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                       <h4 className="font-bold text-lg text-gray-900 dark:text-white truncate">{p.title}</h4>
                       {p.featured && <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />}
                    </div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">{p.category}</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 truncate">{p.description_en}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(p)}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Plus className="w-5 h-5 rotate-45" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}

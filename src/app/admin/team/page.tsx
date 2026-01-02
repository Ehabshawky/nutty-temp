"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Save, Trash2, Upload, Image as ImageIcon, Plus, X, Star, Users } from "lucide-react";
import Image from "next/image";
import AdminLayout from "@/components/admin/AdminLayout";

import { AdminGridSkeleton } from "@/components/skeletons/AdminGridSkeleton";

export default function AdminTeamPage() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const router = useRouter();

  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const formRef = React.useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    position_en: "",
    position_ar: "",
    bio_en: "",
    bio_ar: "",
    image: "",
    department: "operations",
    email: "",
    linkedin: "",
    twitter: "",
    github: "",
    skills: [] as string[],
    education_en: "",
    education_ar: "",
    featured: false,
  });
  
  const [newSkill, setNewSkill] = useState("");

  // Load existing team members
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/team");
        if (res.ok) {
          const data = await res.json();
          setMembers(data);
        } else {
          setMessage(isRTL ? "فشل تحميل الفريق" : "Failed to load team");
        }
      } catch (e) {
        setMessage(isRTL ? "خطأ في تحميل الفريق" : "Error loading team");
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

  const addSkill = () => {
    if (newSkill.trim()) {
      handleFieldChange("skills", [...formData.skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (index: number) => {
    handleFieldChange("skills", formData.skills.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = "/api/admin/team";
      const method = editId ? "PUT" : "POST";
      const body = editId ? { ...formData, id: editId } : formData;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        if (editId) {
          setMembers((prev) => prev.map((m) => (m.id === editId ? { ...m, ...formData } : m)));
          setMessage(isRTL ? "تم تحديث بيانات العضو!" : "Member updated!");
        } else {
          const result = await res.json();
          setMembers((prev) => [...prev, result.member]);
          setMessage(isRTL ? "تم إضافة العضو!" : "Member added!");
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

  const handleAddNew = () => {
    handleCancel();
    setShowForm(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleEdit = (member: any) => {
    setEditId(member.id);
    setFormData({
      name: member.name,
      position_en: member.position_en || "",
      position_ar: member.position_ar || "",
      bio_en: member.bio_en || "",
      bio_ar: member.bio_ar || "",
      image: member.image || "",
      department: member.department || "operations",
      email: member.email || "",
      linkedin: member.linkedin || "",
      twitter: member.twitter || "",
      github: member.github || "",
      skills: member.skills || [],
      education_en: member.education_en || "",
      education_ar: member.education_ar || "",
      featured: member.featured || false,
    });
    setShowForm(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleCancel = () => {
    setEditId(null);
    setFormData({
      name: "",
      position_en: "",
      position_ar: "",
      bio_en: "",
      bio_ar: "",
      image: "",
      department: "operations",
      email: "",
      linkedin: "",
      twitter: "",
      github: "",
      skills: [],
      education_en: "",
      education_ar: "",
      featured: false,
    });
    setNewSkill("");
  };

  const handleDelete = async (id: string) => {
    if (!confirm(isRTL ? "هل تريد حذف هذا العضو؟" : "Delete this member?")) return;
    try {
      const res = await fetch(`/api/admin/team?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setMembers((prev) => prev.filter((m) => m.id !== id));
        setMessage(isRTL ? "تم حذف العضو" : "Member deleted");
      } else {
        setMessage(isRTL ? "فشل الحذف" : "Failed to delete member");
      }
    } catch (e) {
      setMessage(isRTL ? "خطأ في حذف العضو" : "Error deleting member");
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <AdminGridSkeleton count={6} cardsPerRow={3} />
        </div>
      </AdminLayout>
    );
  }


  return (
    <AdminLayout>
      <section className="py-20 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Users className="w-8 h-8 text-nutty-orange" />
              {isRTL ? "إدارة الفريق" : "Manage Team"}
            </h2>
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/team")}
                className="px-4 py-2 bg-nutty-blue text-white rounded-lg hover:bg-nutty-blue/90 transition-colors"
              >
                {isRTL ? "معاينة الصفحة العامة" : "Preview Public Page"}
              </button>
              <button
                onClick={handleAddNew}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 shadow-sm"
              >
                <Plus className="w-5 h-5" />
                {isRTL ? "إضافة عضو جديد" : "Add New Member"}
              </button>
            </div>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${message.includes("success") || message.includes("تم") ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200"}`}>
              <span className="flex-1">{message}</span>
              <button onClick={() => setMessage("")}><X className="w-4 h-4" /></button>
            </div>
          )}

          
          {/* Form */}
          {showForm && (
            <div ref={formRef} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8 border border-gray-100 dark:border-gray-700 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
                {editId ? (isRTL ? "تعديل بيانات عضو" : "Edit Team Member") : (isRTL ? "إضافة عضو جديد" : "Add New Team Member")}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {isRTL ? "الاسم" : "Full Name"}
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleFieldChange("name", e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {isRTL ? "القسم" : "Department"}
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) => handleFieldChange("department", e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                    >
                      <option value="ceo">Management / CEO</option>
                      <option value="marketing">Marketing</option>
                      <option value="technology">Technology</option>
                      <option value="operations">Operations / Science Communicator</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) => handleFieldChange("featured", e.target.checked)}
                      className="w-4 h-4 text-nutty-orange rounded border-gray-300"
                    />
                    <label htmlFor="featured" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                      <Star className={`w-4 h-4 ${formData.featured ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
                      {isRTL ? "عضو رئيسي (Featured)" : "Featured Member"}
                    </label>
                  </div>
                </div>

                {/* Position */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {isRTL ? "المنصب (English)" : "Position (English)"}
                    </label>
                    <input
                      type="text"
                      value={formData.position_en}
                      onChange={(e) => handleFieldChange("position_en", e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {isRTL ? "المنصب (عربي)" : "Position (Arabic)"}
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      value={formData.position_ar}
                      onChange={(e) => handleFieldChange("position_ar", e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {isRTL ? "النبذة (English)" : "Bio (English)"}
                    </label>
                    <textarea
                      rows={4}
                      value={formData.bio_en}
                      onChange={(e) => handleFieldChange("bio_en", e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {isRTL ? "النبذة (عربي)" : "Bio (Arabic)"}
                    </label>
                    <textarea
                      rows={4}
                      dir="rtl"
                      value={formData.bio_ar}
                      onChange={(e) => handleFieldChange("bio_ar", e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                    />
                  </div>
                </div>

                {/* Education */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {isRTL ? "التعليم (English)" : "Education (English)"}
                    </label>
                    <input
                      type="text"
                      value={formData.education_en}
                      onChange={(e) => handleFieldChange("education_en", e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {isRTL ? "التعليم (عربي)" : "Education (Arabic)"}
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      value={formData.education_ar}
                      onChange={(e) => handleFieldChange("education_ar", e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                    />
                  </div>
                </div>

                {/* Image & Skills */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {isRTL ? "صورة العضو" : "Member Image"}
                  </label>
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="hidden"
                        id="member-image-upload"
                      />
                      <label
                        htmlFor="member-image-upload"
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
                    {isRTL ? "المهارات" : "Skills"}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                      placeholder={isRTL ? "أضف مهارة..." : "Add skill..."}
                      className="flex-1 px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                    />
                    <button onClick={addSkill} className="p-2 bg-nutty-blue text-white rounded-lg"><Plus className="w-5 h-5" /></button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, i) => (
                      <span key={i} className="px-3 py-1 bg-nutty-orange/10 text-nutty-orange rounded-full text-xs font-semibold flex items-center gap-1">
                        {skill}
                        <button onClick={() => removeSkill(i)}><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Social Links & Email */}
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleFieldChange("email", e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">LinkedIn URL</label>
                    <input
                      type="text"
                      value={formData.linkedin}
                      onChange={(e) => handleFieldChange("linkedin", e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Twitter URL</label>
                    <input
                      type="text"
                      value={formData.twitter}
                      onChange={(e) => handleFieldChange("twitter", e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">GitHub URL</label>
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
                  disabled={saving || !formData.name}
                  className="flex items-center px-8 py-3 bg-nutty-orange text-white rounded-lg hover:bg-nutty-orange/90 transition shadow-lg disabled:opacity-50 font-bold"
                >
                  <Save className="w-5 h-5 mr-2" />
                  {saving ? (isRTL ? "جاري الحفظ..." : "Saving...") : (isRTL ? "حفظ التغييرات" : "Save Changes")}
                </button>
                <button onClick={handleCancel} className="px-8 py-3 bg-gray-200 dark:bg-gray-700 rounded-lg font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                  {isRTL ? "إلغاء" : "Cancel"}
                </button>
              </div>
            </div>
          )}

            {members.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 text-gray-500">
                {isRTL ? "لا يوجد أعضاء مضافون" : "No team members found"}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {members.map((m) => (
                  <div key={m.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 flex flex-col gap-4 border border-gray-50 dark:border-gray-700 hover:shadow-md transition-shadow relative">
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border-2 border-nutty-blue/20">
                        <Image src={m.image || "/default-avatar.avif"} alt={m.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-gray-900 dark:text-white truncate" title={m.name}>{m.name}</h4>
                          {m.featured && <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />}
                        </div>
                        <p className="text-xs font-bold text-nutty-blue uppercase tracking-wider truncate" title={m.position_en}>{m.position_en}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 uppercase truncate">{m.department}</p>
                      </div>
                    </div>
                    
                    {/* Bio Preview */}
                    <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg flex-1">
                       {m.bio_en || "No bio available."}
                    </div>

                    <div className="flex items-center gap-2 mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                      <button
                        onClick={() => handleEdit(m)}
                        className="flex-1 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition flex items-center justify-center gap-2 text-sm font-medium"
                      >
                        <ImageIcon className="w-4 h-4" />
                        {isRTL ? "تعديل" : "Edit"}
                      </button>
                      <button
                        onClick={() => handleDelete(m.id)}
                        className="px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition"
                        title={isRTL ? "حذف" : "Delete"}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                 {!showForm && (
                   <button 
                      onClick={handleAddNew}
                      className="min-h-[250px] rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center text-gray-400 hover:text-nutty-blue hover:border-nutty-blue hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all gap-4 group"
                   >
                      <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                        <Plus className="w-6 h-6" />
                      </div>
                      <span className="font-bold text-lg">{isRTL ? 'إضافة عضو جديد' : 'Add New Member'}</span>
                   </button>
                 )}
              </div>
            )}
          </div>
      </section>
    </AdminLayout>
  );
}

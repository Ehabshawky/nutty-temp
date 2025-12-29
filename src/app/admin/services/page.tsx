// src/app/admin/services/page.tsx
"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Save, Trash2, Upload, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import AdminLayout from "@/components/admin/AdminLayout";

export default function AdminServicesPage() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const router = useRouter();

  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [newService, setNewService] = useState({
    title_en: "",
    title_ar: "",
    description_en: "",
    description_ar: "",
    long_description_en: "",
    long_description_ar: "",
    image: "",
    icon: "Beaker",
  });

  // Load existing services
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/services");
        if (res.ok) {
          const data = await res.json();
          setServices(data);
        } else {
          setMessage(isRTL ? "فشل تحميل الخدمات" : "Failed to load services");
        }
      } catch (e) {
        setMessage(isRTL ? "خطأ في تحميل الخدمات" : "Error loading services");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleFieldChange = (field: string, value: string) => {
    setNewService((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        handleFieldChange("image", data.url);
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

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = "/api/admin/services";
      const method = editId ? "PUT" : "POST";
      const body = editId ? { ...newService, id: editId } : newService;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        if (editId) {
          setServices((prev) => prev.map((s) => (s.id === editId ? { ...s, ...newService } : s)));
          setMessage(isRTL ? "تم تحديث الخدمة!" : "Service updated!");
        } else {
          const data = await res.json();
          setServices((prev) => [...prev, data.service]);
          setMessage(isRTL ? "تم إضافة الخدمة!" : "Service added!");
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

  const handleEdit = (svc: any) => {
    setEditId(svc.id);
    setNewService({
      title_en: svc.title_en,
      title_ar: svc.title_ar,
      description_en: svc.description_en,
      description_ar: svc.description_ar,
      long_description_en: svc.long_description_en || "",
      long_description_ar: svc.long_description_ar || "",
      image: svc.image,
      icon: svc.icon || "Beaker",
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditId(null);
    setNewService({ 
      title_en: "", 
      title_ar: "", 
      description_en: "", 
      description_ar: "", 
      long_description_en: "",
      long_description_ar: "",
      image: "",
      icon: "Beaker"
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm(isRTL ? "هل تريد حذف الخدمة؟" : "Delete this service?")) return;
    try {
      const res = await fetch(`/api/admin/services?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setServices((prev) => prev.filter((s) => s.id !== id));
        setMessage(isRTL ? "تم حذف الخدمة" : "Service deleted");
      } else {
        setMessage(isRTL ? "فشل حذف الخدمة" : "Failed to delete service");
      }
    } catch (e) {
      setMessage(isRTL ? "خطأ في حذف الخدمة" : "Error deleting service");
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
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {isRTL ? "إدارة الخدمات" : "Manage Services"}
            </h2>
            <button
              onClick={() => router.push("/services")}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {isRTL ? "معاينة الصفحة العامة" : "Preview Public Page"}
            </button>
          </div>

          {/* Message */}
          {message && (
            <div className={`mb-6 p-3 rounded ${message.includes("success") || message.includes("نجاح") || message.includes("تم") ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"}`}>
              {message}
            </div>
          )}

          {/* Services List */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              {isRTL ? "الخدمات الحالية" : "Current Services"}
            </h3>
            <div className="space-y-4">
              {services.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center text-gray-500 dark:text-gray-400">
                  {isRTL ? "لا توجد خدمات مضافة بعد" : "No services added yet"}
                </div>
              ) : (
                services.map((svc) => (
                  <div key={svc.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      {svc.image && (
                        <div className="relative w-20 h-20 flex-shrink-0">
                          <Image 
                            src={svc.image} 
                            alt="Service" 
                            fill
                            className="object-cover rounded" 
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 dark:text-white">{svc.title_en}</h4>
                        <p className="text-gray-600 dark:text-gray-400 line-clamp-1 text-sm mt-1">{svc.description_en}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => handleEdit(svc)}
                        className="px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm"
                      >
                        {isRTL ? "تعديل" : "Edit"}
                      </button>
                      <button
                        onClick={() => handleDelete(svc.id)}
                        className="flex items-center px-3 py-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        {isRTL ? "حذف" : "Delete"}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* New/Edit Service Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              {editId 
                ? (isRTL ? "تعديل الخدمة" : "Edit Service") 
                : (isRTL ? "إضافة خدمة جديدة" : "Add New Service")}
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder={isRTL ? "العنوان (English)" : "Title (English)"}
                value={newService.title_en}
                onChange={(e) => handleFieldChange("title_en", e.target.value)}
                className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
              />
              <input
                type="text"
                dir="rtl"
                placeholder={isRTL ? "العنوان (Arabic)" : "Title (Arabic)"}
                value={newService.title_ar}
                onChange={(e) => handleFieldChange("title_ar", e.target.value)}
                className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
              />
              <textarea
                rows={3}
                placeholder={isRTL ? "الوصف المختصر (English)" : "Short Description (English)"}
                value={newService.description_en}
                onChange={(e) => handleFieldChange("description_en", e.target.value)}
                className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
              />
              <textarea
                rows={3}
                dir="rtl"
                placeholder={isRTL ? "الوصف المختصر (Arabic)" : "Short Description (Arabic)"}
                value={newService.description_ar}
                onChange={(e) => handleFieldChange("description_ar", e.target.value)}
                className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
              />
              <textarea
                rows={6}
                placeholder={isRTL ? "الوصف التفصيلي (English)" : "Detailed Description (English)"}
                value={newService.long_description_en}
                onChange={(e) => handleFieldChange("long_description_en", e.target.value)}
                className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 md:col-span-2"
              />
              <textarea
                rows={6}
                dir="rtl"
                placeholder={isRTL ? "الوصف التفصيلي (Arabic)" : "Detailed Description (Arabic)"}
                value={newService.long_description_ar}
                onChange={(e) => handleFieldChange("long_description_ar", e.target.value)}
                className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 md:col-span-2"
              />
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {isRTL ? "أيقونة الخدمة" : "Service Icon"}
                </label>
                <select
                  value={newService.icon}
                  onChange={(e) => handleFieldChange("icon", e.target.value)}
                  className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-nutty-orange outline-none"
                >
                  <option value="Beaker">Beaker 🧪</option>
                  <option value="FlaskRound">Flask ⚗️</option>
                  <option value="Atom">Atom ⚛️</option>
                  <option value="Rocket">Rocket 🚀</option>
                  <option value="Brain">Brain 🧠</option>
                  <option value="Microscope">Microscope 🔬</option>
                  <option value="Target">Target 🎯</option>
                  <option value="Eye">Eye 👁️</option>
                  <option value="Heart">Heart ❤️</option>
                  <option value="Users">Users 👥</option>
                  <option value="Shield">Shield 🛡️</option>
                  <option value="Globe">Globe 🌐</option>
                  <option value="Clock">Clock 🕒</option>
                  <option value="Award">Award 🏆</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {isRTL ? "صورة الخدمة" : "Service Image"}
                </label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="hidden"
                      id="service-image-upload"
                    />
                    <label
                      htmlFor="service-image-upload"
                      className={`flex items-center justify-center px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {uploading 
                        ? (isRTL ? "جاري الرفع..." : "Uploading...") 
                        : (isRTL ? "رفع صورة الخدمة" : "Upload Service Image")}
                    </label>
                  </div>
                  {newService.image && (
                    <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
                      <Image
                        src={newService.image}
                        alt="Service Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-6">
              <button
                onClick={handleSave}
                disabled={saving || !newService.title_en || !newService.title_ar}
                className={`flex items-center px-6 py-2.5 text-white rounded-lg transition ${saving || !newService.title_en || !newService.title_ar ? "bg-gray-400 cursor-not-allowed" : "bg-nutty-orange hover:bg-nutty-orange/90"}`}
              >
                <Save className="w-4 h-4 mr-2" />
                {saving 
                  ? (isRTL ? "جاري الحفظ..." : "Saving...")
                  : (isRTL ? (editId ? "تحديث التغييرات" : "حفظ الخدمة") : (editId ? "Update Changes" : "Save Service"))}
              </button>
              {editId && (
                <button
                  onClick={handleCancel}
                  className="px-6 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                >
                  {isRTL ? "إلغاء" : "Cancel"}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}
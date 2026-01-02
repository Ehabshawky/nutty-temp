"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Save, Trash2, Upload, Image as ImageIcon, Tag, Clock, Users, MapPin, Calendar } from "lucide-react";
import Image from "next/image";
import AdminLayout from "@/components/admin/AdminLayout";
import { AdminGridSkeleton } from "@/components/skeletons/AdminGridSkeleton";

export default function AdminServicesPage() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const router = useRouter();
  const formRef = React.useRef<HTMLDivElement>(null);

  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
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
    category: "families",
    duration: "2-3 hours",
    participants_min: 10,
    participants_max: 30,
    schedule_type: "flexible",
    location_type: "on-site,online",
    age_group: "",
    price_range: "",
    features: [],
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

  // تحسين handleFieldChange للتعامل مع أنواع مختلفة
  const handleFieldChange = (field: string, value: string | number | any[]) => {
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
        const errorData = await res.json().catch(() => ({}));
        setMessage(errorData.error || (isRTL ? "فشل الحفظ" : "Failed to save"));
      }
    } catch (e) {
      console.error("Save error:", e);
      setMessage(isRTL ? "خطأ في الحفظ" : "Error saving");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (svc: any) => {
    setEditId(svc.id);
    setNewService({
      title_en: svc.title_en || "",
      title_ar: svc.title_ar || "",
      description_en: svc.description_en || "",
      description_ar: svc.description_ar || "",
      long_description_en: svc.long_description_en || "",
      long_description_ar: svc.long_description_ar || "",
      image: svc.image || "",
      icon: svc.icon || "Beaker",
      category: svc.category || "families",
      duration: svc.duration || "2-3 hours",
      participants_min: svc.participants_min || 10,
      participants_max: svc.participants_max || 30,
      schedule_type: svc.schedule_type || "flexible",
      location_type: svc.location_type || "on-site,online",
      age_group: svc.age_group || "",
      price_range: svc.price_range || "",
      features: Array.isArray(svc.features) ? svc.features : [],
    });
    setShowForm(true);
    setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const scrollToForm = () => {
    handleCancel(); // Reset form
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
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
      icon: "Beaker",
      category: "families", 
      duration: "2-3 hours",
      participants_min: 10,
      participants_max: 30,
      schedule_type: "flexible",
      location_type: "on-site,online",
      age_group: "",
      price_range: "",
      features: [],
    });
    setShowForm(false);
  };

  const handleAddNew = () => {
    handleCancel(); // Reset form first
    setShowForm(true);
    setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
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

  // دالة لإرجاع اسم الفئة بلغة مقروءة
  const getCategoryLabel = (category: string) => {
    const categories = {
      families: isRTL ? "عائلات" : "Families",
      schools: isRTL ? "مدارس" : "Schools",
      corporate: isRTL ? "شركات" : "Corporate",
    };
    return categories[category as keyof typeof categories] || category;
  };

  // دالة لإرجاع لون الفئة
  const getCategoryColor = (category: string) => {
    const colors = {
      families: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      schools: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      corporate: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  // دالة للتعامل مع checkbox location_type
  const handleLocationTypeChange = (type: string, checked: boolean) => {
    const types = newService.location_type.split(',').filter(t => t.trim());
    
    if (checked) {
      if (!types.includes(type)) {
        types.push(type);
      }
    } else {
      const index = types.indexOf(type);
      if (index > -1) {
        types.splice(index, 1);
      }
    }
    
    handleFieldChange("location_type", types.join(','));
  };

  // دالة للتعامل مع checkbox category
  const handleCategoryChange = (cat: string, checked: boolean) => {
    // التعامل مع الحالة القديمة (قيمة واحدة) أو الجديدة (مفصولة بفاصلة)
    const currentCats = newService.category ? newService.category.split(',').map(c => c.trim()) : [];
    
    if (checked) {
      if (!currentCats.includes(cat)) {
        currentCats.push(cat);
      }
    } else {
      const index = currentCats.indexOf(cat);
      if (index > -1) {
        currentCats.splice(index, 1);
      }
    }
    
    // إذا لم يتم اختيار أي فئة، نعود للفئة الافتراضية
    if (currentCats.length === 0) {
        handleFieldChange("category", "families");
    } else {
        handleFieldChange("category", currentCats.join(','));
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
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                {isRTL ? "إدارة البرامج" : "Manage Programs"}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {isRTL ? "أضف وعدل برامجك المصنفة حسب الفئات" : "Add and manage your programs categorized by type"}
              </p>
            </div>
            <button
              onClick={() => router.push("/services")}
              className="px-4 py-2 bg-nutty-blue text-white rounded-lg hover:bg-nutty-blue/90 transition-colors"
            >
              {isRTL ? "معاينة الصفحة العامة" : "Preview Public Page"}
            </button>
            <button
              onClick={handleAddNew}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {isRTL ? "إضافة برنامج جديد" : "Add New Program"}
            </button>
          </div>

          {/* Message */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg ${message.includes("success") || message.includes("نجاح") || message.includes("تم") ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"}`}>
              {message}
            </div>
          )}

          {/* Services List */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {isRTL ? "البرامج الحالية" : "Current Programs"}
              </h3>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {services.length} {isRTL ? "برنامج" : "programs"}
              </div>
            </div>
            
            {services.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-8 text-center text-gray-500 dark:text-gray-400">
                <div className="text-5xl mb-4">📋</div>
                <p className="text-lg mb-2">
                  {isRTL ? "لا توجد برامج مضافة بعد" : "No programs added yet"}
                </p>
                <p className="text-sm">
                  {isRTL ? "ابدأ بإضافة برنامجك الأول أدناه" : "Start by adding your first program below"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((svc) => (
                  <div key={svc.id} className="bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-xl transition-shadow overflow-hidden flex flex-col h-full border border-gray-100 dark:border-gray-700">
                    
                    {/* Card Image */}
                    <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-700">
                      {svc.image ? (
                        <Image 
                          src={svc.image} 
                          alt="Service" 
                          fill
                          className="object-cover" 
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">
                           {svc.icon === "Beaker" && "🧪"}
                           {svc.icon === "FlaskRound" && "⚗️"}
                           {svc.icon === "Atom" && "⚛️"}
                           {svc.icon === "Rocket" && "🚀"}
                           {svc.icon === "Brain" && "🧠"}
                           {svc.icon === "Microscope" && "🔬"}
                           {svc.icon === "Target" && "🎯"}
                           {svc.icon === "Eye" && "👁️"}
                           {!svc.icon && "🧪"}
                        </div>
                      )}
                      <div className="absolute top-3 right-3 flex gap-2">
                        <span className={`px-2 py-1 text-xs font-bold rounded-full shadow-sm ${getCategoryColor(svc.category)}`}>
                          {getCategoryLabel(svc.category)}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-1" title={svc.title_en}>
                          {svc.title_en}
                        </h4>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-400 line-clamp-3 text-sm mb-4 flex-1">
                        {svc.description_en}
                      </p>
                      
                      {/* Meta Info */}
                      <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <span title="ID" className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                          #{svc.id?.substring(0, 6)}
                        </span>
                        {svc.duration && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {svc.duration}
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 mt-auto">
                        <button
                          onClick={() => handleEdit(svc)}
                          className="flex-1 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition flex items-center justify-center gap-2 text-sm font-medium"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          {isRTL ? "تعديل" : "Edit"}
                        </button>
                        <button
                          onClick={() => handleDelete(svc.id)}
                          className="px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition flex items-center justify-center"
                          title={isRTL ? "حذف" : "Delete"}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* New/Edit Service Form */}
          {showForm && (
            <div ref={formRef} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-nutty-orange/10 rounded-lg">
                <Tag className="w-6 h-6 text-nutty-orange" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {editId 
                  ? (isRTL ? "تعديل البرنامج" : "Edit Program") 
                  : (isRTL ? "إضافة برنامج جديد" : "Add New Program")}
              </h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {isRTL ? "العنوان (English)" : "Title (English)"} *
                  </label>
                  <input
                    type="text"
                    placeholder={isRTL ? "مثال: Science Workshops" : "e.g., Science Workshops"}
                    value={newService.title_en}
                    onChange={(e) => handleFieldChange("title_en", e.target.value)}
                    className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-nutty-orange focus:border-transparent outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {isRTL ? "العنوان (Arabic)" : "Title (Arabic)"} *
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    placeholder={isRTL ? "مثال: ورش العمل العلمية" : "e.g., ورش العمل العلمية"}
                    value={newService.title_ar}
                    onChange={(e) => handleFieldChange("title_ar", e.target.value)}
                    className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-nutty-orange focus:border-transparent outline-none transition"
                  />
                </div>
              </div>

              {/* Category and Icon */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {isRTL ? "فئة البرنامج" : "Program Category"} *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["families", "schools", "corporate"].map((cat) => {
                      const isSelected = newService.category.split(',').map(c => c.trim()).includes(cat);
                      return (
                        <label
                          key={cat}
                          className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                            isSelected
                              ? cat === "families"
                                ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300"
                                : cat === "schools"
                                ? "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                                : "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                              : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => handleCategoryChange(cat, e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 text-nutty-blue focus:ring-nutty-blue"
                          />
                          <span className="text-sm font-medium capitalize">
                            {getCategoryLabel(cat)}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {isRTL ? "أيقونة البرنامج" : "Program Icon"}
                  </label>
                  <select
                    value={newService.icon}
                    onChange={(e) => handleFieldChange("icon", e.target.value)}
                    className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-nutty-orange focus:border-transparent outline-none transition"
                  >
                    <option value="Beaker">🧪 Beaker</option>
                    <option value="FlaskRound">⚗️ Flask</option>
                    <option value="Atom">⚛️ Atom</option>
                    <option value="Rocket">🚀 Rocket</option>
                    <option value="Brain">🧠 Brain</option>
                    <option value="Microscope">🔬 Microscope</option>
                    <option value="Target">🎯 Target</option>
                    <option value="Eye">👁️ Eye</option>
                    <option value="Heart">❤️ Heart</option>
                    <option value="Users">👥 Users</option>
                    <option value="Shield">🛡️ Shield</option>
                    <option value="Globe">🌐 Globe</option>
                    <option value="Clock">🕒 Clock</option>
                    <option value="Award">🏆 Award</option>
                  </select>
                </div>
              </div>

              {/* Descriptions */}
              <div className="md:col-span-2 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {isRTL ? "الوصف المختصر (English)" : "Short Description (English)"} *
                  </label>
                  <textarea
                    rows={3}
                    placeholder={isRTL ? "وصف قصير يظهر في بطاقة الخدمة..." : "Short description that appears on service card..."}
                    value={newService.description_en}
                    onChange={(e) => handleFieldChange("description_en", e.target.value)}
                    className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-nutty-orange focus:border-transparent outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {isRTL ? "الوصف المختصر (Arabic)" : "Short Description (Arabic)"} *
                  </label>
                  <textarea
                    rows={3}
                    dir="rtl"
                    placeholder={isRTL ? "وصف قصير يظهر في بطاقة الخدمة..." : "وصف قصير يظهر في بطاقة الخدمة..."}
                    value={newService.description_ar}
                    onChange={(e) => handleFieldChange("description_ar", e.target.value)}
                    className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-nutty-orange focus:border-transparent outline-none transition"
                  />
                </div>
              </div>

              {/* Detailed Descriptions */}
              <div className="md:col-span-2 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {isRTL ? "الوصف التفصيلي (English)" : "Detailed Description (English)"}
                  </label>
                  <textarea
                    rows={4}
                    placeholder={isRTL ? "وصف مفصل يظهر في صفحة الخدمة التفصيلية..." : "Detailed description that appears on service detail page..."}
                    value={newService.long_description_en}
                    onChange={(e) => handleFieldChange("long_description_en", e.target.value)}
                    className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-nutty-orange focus:border-transparent outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {isRTL ? "الوصف التفصيلي (Arabic)" : "Detailed Description (Arabic)"}
                  </label>
                  <textarea
                    rows={4}
                    dir="rtl"
                    placeholder={isRTL ? "وصف مفصل يظهر في صفحة الخدمة التفصيلية..." : "وصف مفصل يظهر في صفحة الخدمة التفصيلية..."}
                    value={newService.long_description_ar}
                    onChange={(e) => handleFieldChange("long_description_ar", e.target.value)}
                    className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-nutty-orange focus:border-transparent outline-none transition"
                  />
                </div>
              </div>

              {/* Additional Fields Grid */}
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {isRTL ? "المدة" : "Duration"}
                  </label>
                  <input
                    type="text"
                    placeholder={isRTL ? "مثال: ٢-٣ ساعات" : "e.g., 2-3 hours"}
                    value={newService.duration}
                    onChange={(e) => handleFieldChange("duration", e.target.value)}
                    className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-nutty-orange focus:border-transparent outline-none transition"
                  />
                </div>

                {/* Participants Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {isRTL ? "عدد المشاركين" : "Participants"}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="1"
                      placeholder={isRTL ? "أدنى" : "Min"}
                      value={newService.participants_min}
                      onChange={(e) => handleFieldChange("participants_min", parseInt(e.target.value) || 1)}
                      className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-nutty-orange focus:border-transparent outline-none transition"
                    />
                    <input
                      type="number"
                      min={newService.participants_min || 1}
                      placeholder={isRTL ? "أقصى" : "Max"}
                      value={newService.participants_max}
                      onChange={(e) => handleFieldChange("participants_max", parseInt(e.target.value) || newService.participants_min)}
                      className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-nutty-orange focus:border-transparent outline-none transition"
                    />
                  </div>
                </div>

                {/* Schedule Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {isRTL ? "نوع الجدول" : "Schedule Type"}
                  </label>
                  <select
                    value={newService.schedule_type}
                    onChange={(e) => handleFieldChange("schedule_type", e.target.value)}
                    className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-nutty-orange focus:border-transparent outline-none transition"
                  >
                    <option value="flexible">{isRTL ? "مرنة" : "Flexible"}</option>
                    <option value="fixed">{isRTL ? "ثابت" : "Fixed"}</option>
                    <option value="customizable">{isRTL ? "قابلة للتخصيص" : "Customizable"}</option>
                    <option value="weekdays">{isRTL ? "أيام الأسبوع" : "Weekdays"}</option>
                    <option value="weekends">{isRTL ? "عطلات نهاية الأسبوع" : "Weekends"}</option>
                  </select>
                </div>

                {/* Location Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {isRTL ? "نوع الموقع" : "Location Type"}
                  </label>
                  <div className="space-y-2">
                    {['on-site', 'online', 'hybrid', 'mobile'].map((type) => (
                      <label key={type} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={newService.location_type.includes(type)}
                          onChange={(e) => handleLocationTypeChange(type, e.target.checked)}
                          className="rounded border-gray-300 text-nutty-blue focus:ring-nutty-blue"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {isRTL ? 
                            (type === 'on-site' ? 'في الموقع' : 
                            type === 'online' ? 'أونلاين' : 
                            type === 'hybrid' ? 'مختلط' : 'متنقل') :
                            type.charAt(0).toUpperCase() + type.slice(1)
                          }
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Age Group and Price Range */}
              <div className="grid md:grid-cols-2 gap-4 md:col-span-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {isRTL ? "الفئة العمرية" : "Age Group"}
                  </label>
                  <input
                    type="text"
                    placeholder={isRTL ? "مثال: ٨-١٦ سنة" : "e.g., 8-16 years"}
                    value={newService.age_group}
                    onChange={(e) => handleFieldChange("age_group", e.target.value)}
                    className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-nutty-orange focus:border-transparent outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {isRTL ? "نطاق السعر" : "Price Range"}
                  </label>
                  <input
                    type="text"
                    placeholder={isRTL ? "مثال: ١٠٠-٣٠٠ جنيه" : "e.g., 100-300 EGP"}
                    value={newService.price_range}
                    onChange={(e) => handleFieldChange("price_range", e.target.value)}
                    className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-nutty-orange focus:border-transparent outline-none transition"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {isRTL ? "صورة البرنامج" : "Program Image"}
                </label>
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
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
                      className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl cursor-pointer transition ${uploading 
                        ? "border-gray-400 bg-gray-50 dark:bg-gray-700/50 opacity-50 cursor-not-allowed" 
                        : "border-gray-300 dark:border-gray-600 hover:border-nutty-orange hover:bg-nutty-orange/5"}`}
                    >
                      <Upload className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-4" />
                      <span className="text-gray-700 dark:text-gray-300 font-medium mb-2">
                        {uploading 
                          ? (isRTL ? "جاري رفع الصورة..." : "Uploading image...") 
                          : (isRTL ? "انقر لرفع صورة البرنامج" : "Click to upload program image")}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {isRTL ? "JPG, PNG أو WebP (حتى 5MB)" : "JPG, PNG or WebP (up to 5MB)"}
                      </span>
                    </label>
                  </div>
                  {newService.image && (
                    <div className="lg:w-64">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {isRTL ? "معاينة الصورة" : "Image Preview"}
                      </p>
                      <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
                        <Image
                          src={newService.image}
                          alt="Service Preview"
                          fill
                          className="object-cover"
                          sizes="256px"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 mt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {editId ? (
                  <span>
                    {isRTL ? "جاري تعديل خدمة ID: " : "Editing service ID: "}
                    <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{editId?.substring(0, 8)}...</code>
                  </span>
                ) : (
                  <span>{isRTL ? "إضافة خدمة جديدة" : "Adding new service"}</span>
                )}
              </div>
              <div className="flex items-center gap-4">
                {editId && (
                  <button
                    onClick={handleCancel}
                    className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    {isRTL ? "إلغاء التعديل" : "Cancel Edit"}
                  </button>
                )}
                <button
                  onClick={handleSave}
                  disabled={saving || !newService.title_en || !newService.title_ar || !newService.description_en || !newService.description_ar}
                  className={`flex items-center gap-2 px-8 py-3 rounded-lg font-medium transition ${saving || !newService.title_en || !newService.title_ar || !newService.description_en || !newService.description_ar 
                    ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed" 
                    : "bg-nutty-orange text-white hover:bg-nutty-orange/90"}`}
                >
                  <Save className="w-5 h-5" />
                  {saving 
                    ? (isRTL ? "جاري الحفظ..." : "Saving...")
                    : (editId 
                      ? (isRTL ? "تحديث البرنامج" : "Update Program") 
                      : (isRTL ? "إضافة البرنامج" : "Add Program"))}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-semibold"
                >
                  {isRTL ? "إلغاء" : "Cancel"}
                </button>
              </div>
            </div>
          </div>
          )}

          {/* Help Section */}
          <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-6">
            <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-2">
              {isRTL ? "💡 تلميحات مهمة:" : "💡 Important Tips:"}
            </h4>
            <ul className="text-blue-700 dark:text-blue-400 text-sm space-y-2 list-disc list-inside">
              <li>{isRTL ? "اختر الفئة المناسبة لكل خدمة لتظهر في الفلتر في الصفحة العامة" : "Choose the appropriate category for each service to appear in the filter on the public page"}</li>
              <li>{isRTL ? "العنوان والوصف المختصر مطلوبين باللغتين الإنجليزية والعربية" : "Title and short description are required in both English and Arabic"}</li>
              <li>{isRTL ? "الفئات المتاحة: عائلات، مدارس، شركات" : "Available categories: Families, Schools, Corporate"}</li>
              <li>{isRTL ? "يمكنك اختيار أكثر من نوع موقع للخدمة الواحدة" : "You can select multiple location types for a single service"}</li>
              <li>{isRTL ? "حقل عدد المشاركين: أدخل الحد الأدنى ثم الحد الأقصى" : "Participants field: Enter minimum then maximum number"}</li>
            </ul>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import AdminLayout from "@/components/admin/AdminLayout";
import { AdminGridSkeleton } from "@/components/skeletons/AdminGridSkeleton";

import { Upload, Save, Image as ImageIcon, Globe, Plus, Trash2, Edit } from "lucide-react";

interface HeroSlide {
  id: number;
  image: string;
  video?: string; // Optional video URL
  title_en: string;
  title_ar: string;
  subtitle_en: string;
  subtitle_ar: string;
  description_en: string;
  description_ar: string;
}

export default function HeroMultipleAdminPage() {
  const router = useRouter();
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Load current hero slides
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/site-content");
        if (res.ok) {
          const data = await res.json();
          if (data.hero?.slides) {
            setSlides(data.hero.slides);
          }
        }
      } catch (error) {
        setMessage("Error loading data");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Add new slide
  const handleAddSlide = () => {
    const newSlide: HeroSlide = {
      id: Date.now(),
      image: "",
      title_en: "",
      title_ar: "",
      subtitle_en: "",
      subtitle_ar: "",
      description_en: "",
      description_ar: ""
    };
    setSlides([...slides, newSlide]);
    setEditingIndex(slides.length);
  };

  // Delete slide
  const handleDeleteSlide = (index: number) => {
    if (confirm("هل تريد حذف هذا الـ slide؟")) {
      const newSlides = slides.filter((_, i) => i !== index);
      setSlides(newSlides);
      if (editingIndex === index) {
        setEditingIndex(null);
      }
    }
  };

  // Handle image upload for specific slide
  const handleImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMessage("Uploading image...");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        const newSlides = [...slides];
        newSlides[index] = { ...newSlides[index], image: data.url };
        setSlides(newSlides);
        setMessage("Image uploaded successfully!");
      } else {
        const error = await res.json();
        setMessage(error.error || "Upload failed");
      }
    } catch (error) {
      setMessage("Error uploading image");
    }
  };

  // Handle video upload for specific slide
  const handleVideoUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMessage("Uploading video...");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload-video", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        const newSlides = [...slides];
        newSlides[index] = { ...newSlides[index], video: data.url };
        setSlides(newSlides);
        setMessage("Video uploaded successfully!");
      } else {
        const error = await res.json();
        setMessage(error.error || "Upload failed");
      }
    } catch (error) {
      setMessage("Error uploading video");
    }
  };

  // Update slide field
  const updateSlide = (index: number, field: keyof HeroSlide, value: string) => {
    const newSlides = [...slides];
    newSlides[index] = { ...newSlides[index], [field]: value };
    setSlides(newSlides);
  };

  // Save all slides
  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/site-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "hero",
          data: { slides },
        }),
      });

      if (res.ok) {
        setMessage("Hero slides updated successfully!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("Failed to save changes");
      }
    } catch (error) {
      setMessage("Error saving data");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="max-w-7xl mx-auto py-20">
          <AdminGridSkeleton count={3} cardsPerRow={3} />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {isRTL ? "إدارة شرائح البطل" : "Hero Slides Manager"}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {isRTL 
                  ? "إضافة، تعديل، أو حذف الشرائح" 
                  : "Add, edit, or delete slides"}
              </p>
            </div>
            <button
              onClick={handleAddSlide}
              className="flex items-center px-4 py-2 bg-nutty-orange text-white rounded-lg hover:bg-nutty-orange/90 transition-colors shadow-sm"
            >
              <Plus className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {isRTL ? "إضافة شريحة" : "Add Slide"}
            </button>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes("success") || message.includes("نجاح")
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
          }`}>
            {message}
          </div>
        )}

        {/* Slides List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border-2 ${
                editingIndex === index 
                  ? "border-nutty-orange" 
                  : "border-transparent"
              }`}
            >
              {/* Slide Preview */}
              <div className="relative h-48 bg-black">
                {slide.video ? (
                  <video
                    src={slide.video}
                    className="w-full h-full object-cover"
                    muted
                    loop
                  />
                ) : slide.image ? (
                  <img
                    src={slide.image}
                    alt={slide.title_en || "Hero slide"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                {slide.video && (
                  <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded">
                    VIDEO
                  </div>
                )}
              </div>

              {/* Slide Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1 truncate">
                  {isRTL ? (slide.title_ar || slide.title_en) : slide.title_en}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {isRTL ? (slide.subtitle_ar || slide.subtitle_en) : slide.subtitle_en}
                </p>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingIndex(index)}
                    className="flex-1 flex items-center justify-center px-3 py-2 bg-nutty-orange text-white rounded-lg hover:bg-nutty-orange/90 transition-colors text-sm"
                  >
                    <Edit className={`w-4 h-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                    {isRTL ? "تعديل" : "Edit"}
                  </button>
                  <button
                    onClick={() => handleDeleteSlide(index)}
                    className="flex items-center justify-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Edit Form */}
        {editingIndex !== null && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {isRTL ? `تعديل الشريحة ${editingIndex + 1}` : `Edit Slide ${editingIndex + 1}`}
              </h2>
              <button
                onClick={() => setEditingIndex(null)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                {isRTL ? "إلغاء" : "Cancel"}
              </button>
            </div>

            <div className="space-y-6">
              {/* Image & Video Upload */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <ImageIcon className={`w-4 h-4 inline ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {isRTL ? "صورة الخلفية" : "Background Image"}
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(editingIndex, e)}
                      className="hidden"
                      id={`image-upload-${editingIndex}`}
                    />
                    <label
                      htmlFor={`image-upload-${editingIndex}`}
                      className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer transition-colors"
                    >
                      <Upload className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {isRTL ? "رفع صورة" : "Upload Image"}
                    </label>
                    {slides[editingIndex]?.image && (
                      <div className="w-24 h-16 rounded overflow-hidden border border-gray-300 dark:border-gray-600">
                        <img
                          src={slides[editingIndex].image}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Upload className={`w-4 h-4 inline ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {isRTL ? "فيديو الخلفية (اختياري)" : "Background Video (Optional)"}
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => handleVideoUpload(editingIndex, e)}
                      className="hidden"
                      id={`video-upload-${editingIndex}`}
                    />
                    <label
                      htmlFor={`video-upload-${editingIndex}`}
                      className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer transition-colors"
                    >
                      <Upload className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {isRTL ? "رفع فيديو" : "Upload Video"}
                    </label>
                    {slides[editingIndex]?.video && (
                      <div className="relative w-24 h-16 rounded overflow-hidden border border-gray-300 dark:border-gray-600 bg-black">
                        <video
                          src={slides[editingIndex].video}
                          className="w-full h-full object-cover"
                          muted
                        />
                        <button
                          onClick={() => {
                            const newSlides = [...slides];
                            delete newSlides[editingIndex].video;
                            setSlides(newSlides);
                          }}
                          className="absolute top-0 right-0 bg-red-600 text-white p-0.5 rounded-bl hover:bg-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* English Fields */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Globe className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {isRTL ? "المحتوى الإنجليزي" : "English Content"}
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {isRTL ? "العنوان (English)" : "Title (English)"}
                    </label>
                    <input
                      type="text"
                      value={slides[editingIndex]?.title_en || ""}
                      onChange={(e) => {
                        const newSlides = [...slides];
                        newSlides[editingIndex] = { ...newSlides[editingIndex], title_en: e.target.value };
                        setSlides(newSlides);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-nutty-orange focus:border-transparent"
                      placeholder="Enter title in English"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {isRTL ? "العنوان الفرعي (English)" : "Subtitle (English)"}
                    </label>
                    <input
                      type="text"
                      value={slides[editingIndex]?.subtitle_en || ""}
                      onChange={(e) => {
                        const newSlides = [...slides];
                        newSlides[editingIndex] = { ...newSlides[editingIndex], subtitle_en: e.target.value };
                        setSlides(newSlides);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-nutty-orange focus:border-transparent"
                      placeholder="Enter subtitle in English"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {isRTL ? "الوصف (English)" : "Description (English)"}
                    </label>
                    <textarea
                      value={slides[editingIndex]?.description_en || ""}
                      onChange={(e) => {
                        const newSlides = [...slides];
                        newSlides[editingIndex] = { ...newSlides[editingIndex], description_en: e.target.value };
                        setSlides(newSlides);
                      }}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-nutty-orange focus:border-transparent"
                      placeholder="Enter description in English"
                    />
                  </div>
                </div>
              </div>

              {/* Arabic Fields */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Globe className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {isRTL ? "المحتوى العربي" : "Arabic Content"}
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {isRTL ? "العنوان (عربي)" : "Title (Arabic)"}
                    </label>
                    <input
                      type="text"
                      value={slides[editingIndex]?.title_ar || ""}
                      onChange={(e) => {
                        const newSlides = [...slides];
                        newSlides[editingIndex] = { ...newSlides[editingIndex], title_ar: e.target.value };
                        setSlides(newSlides);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-nutty-orange focus:border-transparent"
                      placeholder="أدخل العنوان بالعربية"
                      dir="rtl"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {isRTL ? "العنوان الفرعي (عربي)" : "Subtitle (Arabic)"}
                    </label>
                    <input
                      type="text"
                      value={slides[editingIndex]?.subtitle_ar || ""}
                      onChange={(e) => {
                        const newSlides = [...slides];
                        newSlides[editingIndex] = { ...newSlides[editingIndex], subtitle_ar: e.target.value };
                        setSlides(newSlides);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-nutty-orange focus:border-transparent"
                      placeholder="أدخل العنوان الفرعي بالعربية"
                      dir="rtl"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {isRTL ? "الوصف (عربي)" : "Description (Arabic)"}
                    </label>
                    <textarea
                      value={slides[editingIndex]?.description_ar || ""}
                      onChange={(e) => {
                        const newSlides = [...slides];
                        newSlides[editingIndex] = { ...newSlides[editingIndex], description_ar: e.target.value };
                        setSlides(newSlides);
                      }}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-nutty-orange focus:border-transparent"
                      placeholder="أدخل الوصف بالعربية"
                      dir="rtl"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center px-6 py-3 bg-nutty-orange text-white rounded-lg hover:bg-nutty-orange/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            <Save className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {saving 
              ? (isRTL ? "جاري الحفظ..." : "Saving...")
              : (isRTL ? "حفظ التغييرات" : "Save All Changes")}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}



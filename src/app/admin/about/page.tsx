"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import { Save, Globe, FileText, Upload, Image as ImageIcon, Trash } from "lucide-react";
import Image from "next/image";

export default function AdminAboutPage() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [aboutContent, setAboutContent] = useState({
    hero: {
      title_en: "",
      title_ar: "",
      image: "",
      subtitle_en: "",
      subtitle_ar: ""
    },
    story: {
      title_en: "",
      title_ar: "",
      image: "",
      video: "",
      description_en: "",
      description_ar: ""
    },
    mission: {
      title_en: "",
      title_ar: "",
      image: "",
      description_en: "",
      description_ar: ""
    },
    vision: {
      title_en: "",
      title_ar: "",
      image: "",
      description_en: "",
      description_ar: ""
    },
    values: [] as any[],
    milestones: [] as any[]
  });

  // Load content
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`/api/site-content?t=${Date.now()}`);
        if (res.ok) {
          const data = await res.json();
          if (data.about) {
            setAboutContent(prev => ({
              ...prev,
              ...data.about,
              hero: { ...prev.hero, ...data.about.hero },
              story: { ...prev.story, ...data.about.story },
              mission: { ...prev.mission, ...data.about.mission },
              vision: { ...prev.vision, ...data.about.vision },
              values: data.about.values || [],
              milestones: data.about.milestones || []
            }));
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

  // Save content
  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/site-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "about",
          data: aboutContent,
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

  const updateField = (section: string, field: string, value: string) => {
    setAboutContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };

  // Image upload handler
const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setUploading(true);
  const formData = new FormData();
  
  // التصحيح هنا: استخدم "file" بدلاً من "image"
  formData.append("file", file);

  try {
    const res = await fetch("/api/upload-image", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      updateField('story', 'image', data.url);
      setMessage(isRTL ? "تم رفع الصورة بنجاح!" : "Image uploaded successfully!");
      setTimeout(() => setMessage(""), 3000);
    } else {
      const error = await res.json();
      setMessage(error.error || (isRTL ? "فشل رفع الصورة" : "Image upload failed"));
    }
  } catch (error) {
    setMessage(isRTL ? "خطأ في رفع الصورة" : "Error uploading image");
  } finally {
    setUploading(false);
  }
};

const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setUploading(true);
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch("/api/upload-video", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      updateField('story', 'video', data.url);
      setMessage(isRTL ? "تم رفع الفيديو بنجاح!" : "Video uploaded successfully!");
      setTimeout(() => setMessage(""), 3000);
    } else {
      const error = await res.json();
      setMessage(error.error || (isRTL ? "فشل رفع الفيديو" : "Video upload failed"));
    }
  } catch (error) {
    setMessage(isRTL ? "خطأ في رفع الفيديو" : "Error uploading video");
  } finally {
    setUploading(false);
  }
};

  const addValue = () => {
    setAboutContent(prev => ({
      ...prev,
      values: [...(prev.values || []), { 
        id: Date.now(), 
        title_en: "", title_ar: "", 
        description_en: "", description_ar: "",
        icon: "Heart"
      }]
    }));
  };

  const removeValue = (id: number) => {
    setAboutContent(prev => ({
      ...prev,
      values: prev.values.filter((v: any) => v.id !== id)
    }));
  };

  const updateValue = (id: number, field: string, value: string) => {
    setAboutContent(prev => ({
      ...prev,
      values: prev.values.map((v: any) => v.id === id ? { ...v, [field]: value } : v)
    }));
  };

  const addMilestone = () => {
    setAboutContent(prev => ({
      ...prev,
      milestones: [...(prev.milestones || []), { 
        id: Date.now(), 
        year: "", 
        event_en: "", 
        event_ar: "" 
      }]
    }));
  };

  const removeMilestone = (id: number) => {
    setAboutContent(prev => ({
      ...prev,
      milestones: prev.milestones.filter((m: any) => m.id !== id)
    }));
  };

  const updateMilestone = (id: number, field: string, value: string) => {
    setAboutContent(prev => ({
      ...prev,
      milestones: prev.milestones.map((m: any) => m.id === id ? { ...m, [field]: value } : m)
    }));
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
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {isRTL ? "تعديل صفحة من نحن" : "Edit About Page"}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {isRTL 
                  ? "قم بتعديل محتوى صفحة About Us" 
                  : "Edit the About Us page content"}
              </p>
            </div>
            <button
              onClick={() => router.push("/about")}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {isRTL ? "معاينة الصفحة" : "Preview Page"}
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

        {/* Hero Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center mb-6">
            <FileText className={`w-6 h-6 text-nutty-orange ${isRTL ? 'ml-3' : 'mr-3'}`} />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isRTL ? "قسم البطل" : "Hero Section"}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {isRTL ? "العنوان (English)" : "Title (English)"}
              </label>
              <input
                type="text"
                value={aboutContent.hero.title_en}
                onChange={(e) => updateField('hero', 'title_en', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-nutty-orange focus:border-transparent"
                placeholder="About Us"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {isRTL ? "العنوان (عربي)" : "Title (Arabic)"}
              </label>
              <input
                type="text"
                dir="rtl"
                value={aboutContent.hero.title_ar}
                onChange={(e) => updateField('hero', 'title_ar', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-nutty-orange focus:border-transparent"
                placeholder="من نحن"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {isRTL ? "العنوان الفرعي (English)" : "Subtitle (English)"}
              </label>
              <input
                type="text"
                value={aboutContent.hero.subtitle_en}
                onChange={(e) => updateField('hero', 'subtitle_en', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-nutty-orange focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {isRTL ? "العنوان الفرعي (عربي)" : "Subtitle (Arabic)"}
              </label>
              <input
                type="text"
                dir="rtl"
                value={aboutContent.hero.subtitle_ar}
                onChange={(e) => updateField('hero', 'subtitle_ar', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-nutty-orange focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {isRTL ? "قصتنا" : "Our Story"}
          </h2>

          <div className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <ImageIcon className={`w-4 h-4 inline ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {isRTL ? "صورة القسم" : "Section Image"}
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="story-image-upload"
                  disabled={uploading}
                />
                <label
                  htmlFor="story-image-upload"
                  className={`flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer transition-colors ${
                    uploading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <Upload className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {uploading 
                    ? (isRTL ? "جاري الرفع..." : "Uploading...")
                    : (isRTL ? "رفع صورة" : "Upload Image")}
                </label>
                {aboutContent.story.image && (
                  <div className="relative w-32 h-24 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
                    <Image
                      src={aboutContent.story.image}
                      alt="Story"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {isRTL 
                  ? "JPG, PNG, WebP (حد أقصى 5 ميجابايت)"
                  : "JPG, PNG, WebP (Max 5MB)"}
              </p>
            </div>

            {/* Video Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Upload className={`w-4 h-4 inline ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {isRTL ? "فيديو القسم (اختياري)" : "Section Video (Optional)"}
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                  id="story-video-upload"
                  disabled={uploading}
                />
                <label
                  htmlFor="story-video-upload"
                  className={`flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer transition-colors ${
                    uploading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <Upload className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {uploading 
                    ? (isRTL ? "جاري الرفع..." : "Uploading...")
                    : (isRTL ? "رفع فيديو" : "Upload Video")}
                </label>
                {aboutContent.story.video && (
                  <div className="relative w-32 h-24 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 bg-black">
                    <video
                      src={aboutContent.story.video}
                      className="w-full h-full object-cover"
                      muted
                    />
                    <button
                      onClick={() => updateField('story', 'video', '')}
                      className="absolute top-0 right-0 bg-red-600 text-white p-1 hover:bg-red-700 transition-colors"
                      title={isRTL ? "حذف الفيديو" : "Remove Video"}
                    >
                      <Trash className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {isRTL 
                  ? "MP4, WebM (حد أقصى 100 ميجابايت)"
                  : "MP4, WebM (Max 100MB)"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {isRTL ? "الوصف (English)" : "Description (English)"}
              </label>
              <textarea
                value={aboutContent.story.description_en}
                onChange={(e) => updateField('story', 'description_en', e.target.value)}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-nutty-orange focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {isRTL ? "الوصف (عربي)" : "Description (Arabic)"}
              </label>
              <textarea
                dir="rtl"
                value={aboutContent.story.description_ar}
                onChange={(e) => updateField('story', 'description_ar', e.target.value)}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-nutty-orange focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Mission */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {isRTL ? "المهمة" : "Mission"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {isRTL ? "الوصف (English)" : "Description (English)"}
                </label>
                <textarea
                  value={aboutContent.mission.description_en}
                  onChange={(e) => updateField('mission', 'description_en', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-nutty-orange focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {isRTL ? "الوصف (عربي)" : "Description (Arabic)"}
                </label>
                <textarea
                  dir="rtl"
                  value={aboutContent.mission.description_ar}
                  onChange={(e) => updateField('mission', 'description_ar', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-nutty-orange focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Vision */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {isRTL ? "الرؤية" : "Vision"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {isRTL ? "الوصف (English)" : "Description (English)"}
                </label>
                <textarea
                  value={aboutContent.vision.description_en}
                  onChange={(e) => updateField('vision', 'description_en', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-nutty-orange focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {isRTL ? "الوصف (عربي)" : "Description (Arabic)"}
                </label>
                <textarea
                  dir="rtl"
                  value={aboutContent.vision.description_ar}
                  onChange={(e) => updateField('vision', 'description_ar', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-nutty-orange focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Core Values Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <Globe className={`w-6 h-6 text-nutty-orange ${isRTL ? 'ml-3' : 'mr-3'}`} />
              {isRTL ? "قيمنا الأساسية" : "Core Values"}
            </h2>
            <button
              onClick={addValue}
              className="px-4 py-2 bg-nutty-orange text-white rounded-lg hover:bg-nutty-orange/90 transition-colors text-sm flex items-center shadow-sm"
            >
              <Globe className="w-4 h-4 mr-2" />
              {isRTL ? "إضافة قيمة" : "Add Value"}
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {aboutContent.values?.map((value: any, index: number) => (
              <div key={value.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl relative bg-gray-50/50 dark:bg-gray-900/50 group">
                <button
                  onClick={() => removeValue(value.id)}
                  className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash className="w-5 h-5" />
                </button>
                <div className="space-y-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Icon</label>
                    <select
                      value={value.icon}
                      onChange={(e) => updateValue(value.id, 'icon', e.target.value)}
                      className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-sm focus:ring-1 focus:ring-nutty-orange outline-none"
                    >
                      <option value="Heart">Heart ❤️</option>
                      <option value="Users">Users 👥</option>
                      <option value="Shield">Shield 🛡️</option>
                      <option value="Globe">Globe 🌐</option>
                      <option value="Clock">Clock 🕒</option>
                      <option value="Award">Award 🏆</option>
                      <option value="Beaker">Beaker 🧪</option>
                      <option value="FlaskRound">Flask ⚗️</option>
                      <option value="Atom">Atom ⚛️</option>
                      <option value="Rocket">Rocket 🚀</option>
                      <option value="Brain">Brain 🧠</option>
                      <option value="Microscope">Microscope 🔬</option>
                      <option value="Target">Target 🎯</option>
                      <option value="Eye">Eye 👁️</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Title (EN)</label>
                      <input
                        type="text"
                        value={value.title_en}
                        onChange={(e) => updateValue(value.id, 'title_en', e.target.value)}
                        className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Title (AR)</label>
                      <input
                        type="text"
                        dir="rtl"
                        value={value.title_ar}
                        onChange={(e) => updateValue(value.id, 'title_ar', e.target.value)}
                        className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Description (EN)</label>
                    <textarea
                      value={value.description_en}
                      onChange={(e) => updateValue(value.id, 'description_en', e.target.value)}
                      className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-sm"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Description (AR)</label>
                    <textarea
                      dir="rtl"
                      value={value.description_ar}
                      onChange={(e) => updateValue(value.id, 'description_ar', e.target.value)}
                      className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-sm"
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Journey/Milestones Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <FileText className={`w-6 h-6 text-nutty-orange ${isRTL ? 'ml-3' : 'mr-3'}`} />
              {isRTL ? "رحلتنا (الخط الزمني)" : "Our Journey (Timeline)"}
            </h2>
            <button
              onClick={addMilestone}
              className="px-4 py-2 bg-nutty-orange text-white rounded-lg hover:bg-nutty-orange/90 transition-colors text-sm flex items-center shadow-sm"
            >
              <Globe className="w-4 h-4 mr-2" />
              {isRTL ? "إضافة حدث" : "Add Milestone"}
            </button>
          </div>

          <div className="space-y-4">
            {aboutContent.milestones?.map((m: any) => (
              <div key={m.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-gray-900/50 group relative">
                <div className="grid md:grid-cols-12 gap-4 items-end">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Year</label>
                    <input
                      type="text"
                      value={m.year}
                      onChange={(e) => updateMilestone(m.id, 'year', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-sm"
                    />
                  </div>
                  <div className="md:col-span-4">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Event (EN)</label>
                    <input
                      type="text"
                      value={m.event_en}
                      onChange={(e) => updateMilestone(m.id, 'event_en', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-sm"
                    />
                  </div>
                  <div className="md:col-span-4">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Event (AR)</label>
                    <input
                      type="text"
                      dir="rtl"
                      value={m.event_ar}
                      onChange={(e) => updateMilestone(m.id, 'event_ar', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-sm"
                    />
                  </div>
                  <div className="md:col-span-2 flex justify-end">
                    <button
                      onClick={() => removeMilestone(m.id)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors border border-transparent hover:border-red-200"
                    >
                      <Trash className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center px-6 py-3 bg-nutty-orange text-white rounded-lg hover:bg-nutty-orange/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            <Save className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {saving 
              ? (isRTL ? "جاري الحفظ..." : "Saving...")
              : (isRTL ? "حفظ التغييرات" : "Save Changes")}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}

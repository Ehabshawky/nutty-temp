"use client";

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Handshake, Plus, Trash2, Save, X, Upload, Image as ImageIcon, ChevronRight, ChevronLeft, Globe } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { AdminTableSkeleton } from "@/components/skeletons/AdminTableSkeleton";

interface Partner {
  id: string;
  logo: string;
  name?: string;
}

interface PartnersData {
  global: Partner[];
  egypt: Partner[];
  schools: Partner[];
}

export default function AdminPartnersPage() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const [data, setData] = useState<PartnersData>({
    global: [],
    egypt: [],
    schools: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [activeTab, setActiveTab] = useState<'global' | 'egypt' | 'schools'>('global');

  const fetchData = async () => {
    try {
      const res = await fetch('/api/site-content?section=partners');
      if (res.ok) {
        const siteData = await res.json();
        if (siteData.partners) {
            setData(siteData.partners);
        } else if (siteData.global || siteData.egypt || siteData.schools) {
            setData({
                global: siteData.global || [],
                egypt: siteData.egypt || [],
                schools: siteData.schools || []
            });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogoUpload = async (category: keyof PartnersData, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMessage({ type: "info", text: isRTL ? "جاري الرفع..." : "Uploading..." });

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const result = await res.json();
        const newPartner: Partner = {
          id: Date.now().toString(),
          logo: result.url,
          name: file.name.split('.')[0]
        };
        
        setData(prev => ({
          ...prev,
          [category]: [...prev[category], newPartner]
        }));
        setMessage({ type: "success", text: isRTL ? "تم الرفع بنجاح" : "Uploaded successfully" });
      } else {
        setMessage({ type: "error", text: isRTL ? "فشل الرفع" : "Upload failed" });
      }
    } catch (err) {
      setMessage({ type: "error", text: isRTL ? "خطأ في الاتصال" : "Connection error" });
    }
  };

  const handleDelete = (category: keyof PartnersData, id: string) => {
    setData(prev => ({
      ...prev,
      [category]: prev[category].filter(p => p.id !== id)
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch('/api/site-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: 'partners',
          data: data
        })
      });

      if (res.ok) {
        setMessage({ type: "success", text: isRTL ? "تم الحفظ بنجاح" : "Saved successfully" });
      } else {
        setMessage({ type: "error", text: isRTL ? "فشل الحفظ" : "Failed to save" });
      }
    } catch (err) {
      setMessage({ type: "error", text: isRTL ? "خطأ في الحفظ" : "Error saving" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8">
          <AdminTableSkeleton rows={5} />
        </div>
      </AdminLayout>
    );
  }

  const tabs = [
    { id: 'global', label: isRTL ? 'الشركاء العالميين' : 'Global Partners' },
    { id: 'egypt', label: isRTL ? 'شركاء مصر' : 'Egypt Partners' },
    { id: 'schools', label: isRTL ? 'عملاء المدارس' : 'School Clients' }
  ];

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
              <Handshake className="w-8 h-8 text-nutty-orange" />
              {isRTL ? "إدارة الشركاء والعملاء" : "Partners & Clients Management"}
            </h1>
            <p className="text-gray-500 mt-2">
              {isRTL ? "قم بتحميل شعارات الشركاء والعملاء وتنظيمهم في فئات." : "Upload partner and client logos and organize them into categories."}
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-4 bg-nutty-blue text-white rounded-2xl font-black shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {saving ? (isRTL ? "جاري الحفظ..." : "Saving...") : (isRTL ? "حفظ التغييرات" : "Save Changes")}
          </button>
        </div>

        {message.text && (
          <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 ${
            message.type === "success" 
              ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300" 
              : message.type === "error"
              ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"
              : "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
          }`}>
            <ImageIcon className="w-5 h-5" />
            <span className="font-bold">{message.text}</span>
            <button onClick={() => setMessage({ type: "", text: "" })} className="ml-auto">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Categories Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 rounded-xl font-black transition-all ${
                activeTab === tab.id
                  ? "bg-white dark:bg-gray-700 text-nutty-blue shadow-sm"
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              {tab.label}
              <span className="ml-2 px-2 py-0.5 bg-gray-200 dark:bg-gray-600 rounded-lg text-xs">
                {data[tab.id as keyof PartnersData].length}
              </span>
            </button>
          ))}
        </div>

        {/* Upload Section */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-xl mb-12">
          <div className="flex flex-col items-center justify-center border-4 border-dashed border-gray-100 dark:border-gray-700 rounded-[2rem] p-12 text-center group hover:border-nutty-cyan/30 transition-colors">
            <div className="w-20 h-20 bg-gray-50 dark:bg-gray-900 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Upload className="w-10 h-10 text-gray-400 group-hover:text-nutty-cyan" />
            </div>
            <h3 className="text-xl font-black mb-2">{isRTL ? "رفع شعار جديد" : "Upload New Logo"}</h3>
            <p className="text-gray-500 mb-8 max-w-sm">
              {isRTL ? "اختر صورة الشعار بصيغة PNG أو JPG. يفضل أن تكون بخلفية شفافة." : "Choose a logo image (PNG/JPG). Transparent background is preferred."}
            </p>
            <input
              type="file"
              id="logo-upload"
              accept="image/*"
              onChange={(e) => handleLogoUpload(activeTab, e)}
              className="hidden"
            />
            <label
              htmlFor="logo-upload"
              className="px-10 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-black cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-xl"
            >
              {isRTL ? "اختيار ملف" : "Choose File"}
            </label>
          </div>
        </div>

        {/* Logos Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {data[activeTab].map((partner) => (
            <div key={partner.id} className="relative group aspect-square bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-6 flex items-center justify-center shadow-sm hover:shadow-xl transition-all">
              <img 
                src={partner.logo} 
                alt={partner.name} 
                className="max-w-full max-h-full object-contain"
              />
              <button
                onClick={() => handleDelete(activeTab, partner.id)}
                className="absolute -top-2 -right-2 w-10 h-10 bg-red-500 text-white rounded-xl shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 active:scale-90"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
          {data[activeTab].length === 0 && (
            <div className="col-span-full py-20 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-gray-400 font-bold">
              <ImageIcon className="w-12 h-12 mb-4 opacity-20" />
              {isRTL ? "لا توجد شعارات مضافة في هذا القسم" : "No logos added in this category"}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

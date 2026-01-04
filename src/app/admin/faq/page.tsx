"use client";

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { HelpCircle, Plus, Trash2, Save, X, ChevronRight, ChevronLeft, MessageSquare } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { AdminTableSkeleton } from "@/components/skeletons/AdminTableSkeleton";
import dynamic from 'next/dynamic';

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

interface FAQItem {
  id: string;
  question_en: string;
  question_ar: string;
  answer_en: string;
  answer_ar: string;
}

export default function AdminFAQPage() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<FAQItem>({
    id: "",
    question_en: "",
    question_ar: "",
    answer_en: "",
    answer_ar: ""
  });

  const fetchData = async () => {
    try {
      const res = await fetch('/api/site-content?section=faq');
      if (res.ok) {
        const data = await res.json();
        if (data.faq && data.faq.questions) {
            setFaqs(data.faq.questions);
        } else if (data.questions) {
            setFaqs(data.questions);
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    const newFaqs = editId 
      ? faqs.map(f => f.id === editId ? { ...formData, id: editId } : f)
      : [...faqs, { ...formData, id: Date.now().toString() }];

    try {
      const res = await fetch('/api/site-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: 'faq',
          data: { questions: newFaqs }
        })
      });

      if (res.ok) {
        setFaqs(newFaqs);
        setMessage({ type: "success", text: isRTL ? "تم الحفظ بنجاح" : "Saved successfully" });
        handleCancel();
      } else {
        setMessage({ type: "error", text: isRTL ? "فشل الحفظ" : "Failed to save" });
      }
    } catch (err) {
      setMessage({ type: "error", text: isRTL ? "خطأ في الاتصال" : "Connection error" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(isRTL ? "هل أنت متأكد من الحذف؟" : "Are you sure you want to delete?")) return;
    
    const newFaqs = faqs.filter(f => f.id !== id);
    try {
      const res = await fetch('/api/site-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: 'faq',
          data: { questions: newFaqs }
        })
      });

      if (res.ok) {
        setFaqs(newFaqs);
        setMessage({ type: "success", text: isRTL ? "تم الحذف" : "Deleted successfully" });
      }
    } catch (err) {
      setMessage({ type: "error", text: isRTL ? "خطأ في الحذف" : "Error deleting" });
    }
  };

  const handleEdit = (f: FAQItem) => {
    setEditId(f.id);
    setFormData(f);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditId(null);
    setFormData({
      id: "",
      question_en: "",
      question_ar: "",
      answer_en: "",
      answer_ar: ""
    });
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

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto p-4 md:p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
              <HelpCircle className="w-8 h-8 text-nutty-orange" />
              {isRTL ? "الأسئلة الشائعة للموقع" : "Site FAQ Management"}
            </h1>
            <p className="text-gray-500 mt-2">
              {isRTL ? "إدارة نظام الأسئلة الشائعة التي تظهر في صفحة تواصل معنا." : "Manage the FAQ system displayed on the Contact Us page."}
            </p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-nutty-orange text-white rounded-2xl font-black shadow-lg shadow-orange-500/20 active:scale-95 transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              {isRTL ? "أضف سؤالاً جديداً" : "Add New FAQ"}
            </button>
          )}
        </div>

        {message.text && (
          <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 ${
            message.type === "success" 
              ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300" 
              : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"
          }`}>
            <HelpCircle className="w-5 h-5" />
            <span className="font-bold">{message.text}</span>
            <button onClick={() => setMessage({ type: "", text: "" })} className="ml-auto">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-xl mb-12 animate-in fade-in slide-in-from-top-4 duration-300">
            <h2 className="text-xl font-black mb-6 flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-nutty-orange" />
              {editId ? (isRTL ? "تعديل السؤال" : "Edit FAQ") : (isRTL ? "إضافة سؤال جديد" : "Add New FAQ")}
            </h2>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* English Content */}
                <div className="space-y-4">
                  <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest border-b pb-2">English</h3>
                  <div>
                    <label className="block text-xs font-black text-gray-500 mb-1">Question (EN)</label>
                    <input
                      required
                      value={formData.question_en}
                      onChange={e => setFormData({ ...formData, question_en: e.target.value })}
                      className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl focus:ring-2 focus:ring-nutty-blue transition-all"
                      placeholder="e.g. How can I book a workshop?"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-500 mb-1">Answer (EN)</label>
                    <div className="rounded-2xl overflow-hidden border-2 border-transparent focus-within:border-nutty-blue transition-all">
                      <JoditEditor
                        value={formData.answer_en}
                        onBlur={newContent => setFormData({ ...formData, answer_en: newContent })}
                        config={{
                          readonly: false,
                          height: 300,
                          theme: 'dark',
                          toolbarButtonSize: 'middle',
                          buttons: ['bold', 'italic', 'underline', 'strikethrough', 'eraser', 'ul', 'ol', 'font', 'fontsize', 'paragraph', 'brush', 'image', 'link', 'align', 'undo', 'redo', 'fullsize']
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Arabic Content */}
                <div className="space-y-4">
                  <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest border-b pb-2">العربية</h3>
                  <div dir="rtl">
                    <label className="block text-xs font-black text-gray-500 mb-1">السؤال (عربي)</label>
                    <input
                      required
                      value={formData.question_ar}
                      onChange={e => setFormData({ ...formData, question_ar: e.target.value })}
                      className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl focus:ring-2 focus:ring-nutty-blue transition-all"
                      placeholder="مثال: كيف يمكنني حجز ورشة عمل؟"
                    />
                  </div>
                  <div dir="rtl">
                    <label className="block text-xs font-black text-gray-500 mb-1">الإجابة (عربي)</label>
                    <div className="rounded-2xl overflow-hidden border-2 border-transparent focus-within:border-nutty-blue transition-all">
                      <JoditEditor
                        value={formData.answer_ar}
                        onBlur={newContent => setFormData({ ...formData, answer_ar: newContent })}
                        config={{
                          readonly: false,
                          height: 300,
                          theme: 'dark',
                          toolbarButtonSize: 'middle',
                          buttons: ['bold', 'italic', 'underline', 'strikethrough', 'eraser', 'ul', 'ol', 'font', 'fontsize', 'paragraph', 'brush', 'image', 'link', 'align', 'undo', 'redo', 'fullsize'],
                          direction: 'rtl'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-700">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-3 text-gray-500 font-bold hover:bg-gray-100 dark:hover:bg-gray-700 rounded-2xl transition-colors"
                >
                  {isRTL ? "إلغاء" : "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-8 py-3 bg-nutty-blue text-white rounded-2xl font-black shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {saving ? (isRTL ? "جاري الحفظ..." : "Saving...") : (isRTL ? "حفظ السؤال" : "Save FAQ")}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* FAQ List */}
        <div className="grid grid-cols-1 gap-4">
          {faqs.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-12 text-center border border-gray-100 dark:border-gray-700">
              <HelpCircle className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-400 font-bold">{isRTL ? "لا توجد أسئلة مضافة بعد" : "No FAQs added yet"}</p>
            </div>
          ) : (
            faqs.map((f) => (
              <div key={f.id} className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
                <div className="flex items-center gap-4 flex-1 mr-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center flex-shrink-0 text-nutty-orange">
                    <HelpCircle className="w-6 h-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-black text-gray-900 dark:text-white line-clamp-1">
                      {isRTL ? f.question_ar : f.question_en}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mt-1 whitespace-normal">
                      {(isRTL ? f.answer_ar : f.answer_en).replace(/<[^>]*>?/gm, '')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 transition-opacity">
                  <button
                    onClick={() => handleEdit(f)}
                    className="p-3 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors"
                  >
                    <Plus className="w-5 h-5 rotate-45" />
                  </button>
                  <button
                    onClick={() => handleDelete(f.id)}
                    className="p-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

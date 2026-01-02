"use client";

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Plus, Edit, Trash2, X, Upload, Eye, Clock, Tag } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { AdminGridSkeleton } from "@/components/skeletons/AdminGridSkeleton";

import Image from 'next/image';

export default function AdminBlogs() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  
  const formRef = React.useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    id: null,
    title_en: '',
    title_ar: '',
    excerpt_en: '',
    excerpt_ar: '',
    author_en: '',
    author_ar: '',
    category: 'education',
    image: '',
    content_en: '',
    content_ar: '',
    read_time_en: '5 min read',
    read_time_ar: '5 دقائق للقراءة',
    tags_en: [] as string[],
    tags_ar: [] as string[],
    featured: false
  });

  const categories = ['technology', 'education', 'science', 'innovation', 'parenting', 'psychology'];

  const fetchBlogs = async () => {
    try {
      const res = await fetch('/api/admin/blogs');
      if (res.ok) {
        const data = await res.json();
        setBlogs(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
        const res = await fetch("/api/upload-image", { method: "POST", body: uploadData });
        if (res.ok) {
            const data = await res.json();
            setFormData(prev => ({ ...prev, image: data.url }));
            setImagePreview(data.url);
        }
    } catch (e) {
        alert('Upload failed');
    } finally {
        setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const method = formData.id ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/blogs', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        handleCancel();
        fetchBlogs();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    await fetch(`/api/admin/blogs?id=${id}`, { method: 'DELETE' });
    fetchBlogs();
  };

  const handleEdit = (blog: any) => {
    setFormData({ ...blog });
    setImagePreview(blog.image);
    setShowForm(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleAddNew = () => {
    handleCancel();
    setShowForm(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({
      id: null,
      title_en: '',
      title_ar: '',
      excerpt_en: '',
      excerpt_ar: '',
      author_en: '',
      author_ar: '',
      category: 'education',
      image: '',
      content_en: '',
      content_ar: '',
      read_time_en: '5 min read',
      read_time_ar: '5 دقائق للقراءة',
      tags_en: [],
      tags_ar: [],
      featured: false
    });
    setImagePreview('');
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="max-w-7xl mx-auto p-4 md:p-8 py-20">
          <AdminGridSkeleton count={6} cardsPerRow={3} />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto p-4 md:p-8" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <FileText className="w-8 h-8 text-nutty-orange" />
            {isRTL ? 'إدارة المدونة' : 'Blog Management'}
          </h1>
          <button 
            onClick={handleAddNew}
            className="bg-nutty-lime text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-green-600 font-bold shadow-sm transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" />
            {isRTL ? 'إضافة مقال جديد' : 'Add New Post'}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div ref={formRef} className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-xl mb-12 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex justify-between mb-8 border-b border-gray-100 dark:border-gray-700 pb-4">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 uppercase tracking-widest">
                {formData.id ? (isRTL ? 'تعديل مقال' : 'Edit Post') : (isRTL ? 'مقال جديد' : 'New Post')}
              </h3>
              <button onClick={handleCancel}><X className="w-6 h-6 text-gray-400 hover:text-gray-600" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* English Fields */}
                <div className="space-y-5 bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl">
                  <h4 className="font-black text-gray-400 uppercase tracking-widest mb-4 border-b pb-2">English Content</h4>
                  <div className="space-y-4">
                    <input 
                      placeholder="Title" 
                      className="w-full px-4 py-3 border-none bg-white dark:bg-gray-800 rounded-xl focus:ring-2 focus:ring-nutty-blue transition-all" 
                      value={formData.title_en}
                      onChange={e => setFormData({...formData, title_en: e.target.value})}
                      required 
                    />
                    <textarea 
                      placeholder="Excerpt (Short summary)" 
                      className="w-full px-4 py-3 border-none bg-white dark:bg-gray-800 rounded-xl focus:ring-2 focus:ring-nutty-blue transition-all"
                      rows={3} 
                      value={formData.excerpt_en}
                      onChange={e => setFormData({...formData, excerpt_en: e.target.value})}
                    />
                    <textarea 
                      placeholder="Full Content (HTML or Markdown supported)" 
                      className="w-full px-4 py-3 border-none bg-white dark:bg-gray-800 rounded-xl focus:ring-2 focus:ring-nutty-blue transition-all font-mono text-sm"
                      rows={10}
                      value={formData.content_en}
                      onChange={e => setFormData({...formData, content_en: e.target.value})}
                    />
                     <input 
                      placeholder="Author Name" 
                      className="w-full px-4 py-3 border-none bg-white dark:bg-gray-800 rounded-xl focus:ring-2 focus:ring-nutty-blue transition-all"
                      value={formData.author_en}
                      onChange={e => setFormData({...formData, author_en: e.target.value})}
                    />
                  </div>
                </div>

                {/* Arabic Fields */}
                <div className="space-y-5 bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl" dir="rtl">
                  <h4 className="font-black text-gray-400 uppercase tracking-widest mb-4 border-b pb-2">المحتوى العربي</h4>
                  <div className="space-y-4">
                    <input 
                      placeholder="العنوان" 
                      className="w-full px-4 py-3 border-none bg-white dark:bg-gray-800 rounded-xl focus:ring-2 focus:ring-nutty-blue transition-all"
                      value={formData.title_ar}
                      onChange={e => setFormData({...formData, title_ar: e.target.value})}
                      required 
                    />
                    <textarea 
                      placeholder="مقتطف (ملخص قصير)" 
                      className="w-full px-4 py-3 border-none bg-white dark:bg-gray-800 rounded-xl focus:ring-2 focus:ring-nutty-blue transition-all"
                      rows={3}
                      value={formData.excerpt_ar}
                      onChange={e => setFormData({...formData, excerpt_ar: e.target.value})}
                    />
                    <textarea 
                      placeholder="المحتوى الكامل" 
                      className="w-full px-4 py-3 border-none bg-white dark:bg-gray-800 rounded-xl focus:ring-2 focus:ring-nutty-blue transition-all font-mono text-sm"
                      rows={10}
                      value={formData.content_ar}
                      onChange={e => setFormData({...formData, content_ar: e.target.value})}
                    />
                     <input 
                      placeholder="اسم الكاتب" 
                      className="w-full px-4 py-3 border-none bg-white dark:bg-gray-800 rounded-xl"
                      value={formData.author_ar}
                      onChange={e => setFormData({...formData, author_ar: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                  <div>
                      <label className="block text-sm font-black text-gray-500 uppercase tracking-wider mb-2">{isRTL ? 'صورة الغلاف' : 'Cover Image'}</label>
                      <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-900/30 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                          {imagePreview ? (
                            <div className="relative w-32 h-32 rounded-lg overflow-hidden shrink-0">
                               <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                            </div>
                          ) : (
                            <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-400">No Image</div>
                          )}
                          <div className="flex-1">
                             <label className="cursor-pointer px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl flex items-center gap-2 text-sm font-bold shadow-sm border border-gray-200 dark:border-gray-600 transition-all inline-flex mb-2">
                                  <Upload className="w-4 h-4" /> {uploading ? '...' : (isRTL ? 'رفع صورة جديدة' : 'Upload New Image')}
                                  <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                              </label>
                              <p className="text-xs text-gray-400">Recommended size: 1200x630px. Max 2MB.</p>
                          </div>
                      </div>
                  </div>
                  <div className="space-y-6">
                       <div>
                       <label className="block text-sm font-black text-gray-500 uppercase tracking-wider mb-2">{isRTL ? 'التصنيف' : 'Category'}</label>
                       <select 
                          className="w-full px-4 py-3 border-none bg-white dark:bg-gray-800 rounded-xl shadow-sm focus:ring-2 focus:ring-nutty-blue"
                          value={formData.category}
                          onChange={e => setFormData({...formData, category: e.target.value})}
                      >
                          {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/30">
                          <input 
                              type="checkbox"
                              checked={formData.featured}
                              onChange={e => setFormData({...formData, featured: e.target.checked})}
                              className="w-5 h-5 text-nutty-blue rounded border-gray-300 focus:ring-nutty-blue"
                              id="featured-check"
                          />
                          <label htmlFor="featured-check" className="font-bold text-gray-700 dark:text-gray-200 cursor-pointer select-none">
                              {isRTL ? 'تمييز هذا المقال (Featured)' : 'Mark as Featured Post'}
                          </label>
                      </div>
                  </div>
              </div>

              <div className="flex justify-end gap-4 pt-6">
                  <button type="button" onClick={handleCancel} className="px-8 py-3 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl font-bold transition-all">{isRTL ? 'إلغاء' : 'Cancel'}</button>
                  <button type="submit" disabled={submitting} className="px-8 py-3 bg-nutty-orange text-white rounded-xl hover:bg-orange-600 font-bold shadow-lg shadow-orange-500/20 active:scale-95 transition-all">
                      {submitting ? '...' : (isRTL ? 'حفظ ونشر' : 'Save & Publish')}
                  </button>
              </div>
            </form>
          </div>
        )}

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {blogs.map((blog) => (
             <div key={blog.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden group hover:shadow-md transition-all flex flex-col h-full">
                <div className="relative h-48 w-full bg-gray-200 dark:bg-gray-700">
                   {blog.image ? (
                     <Image src={blog.image} alt={blog.title_en} fill className="object-cover" />
                   ) : (
                     <div className="flex items-center justify-center h-full text-gray-400"><FileText className="w-12 h-12" /></div>
                   )}
                   <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                     {blog.category}
                   </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                   <div className="flex items-center gap-2 text-xs text-gray-400 mb-3 font-medium uppercase tracking-wider">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {isRTL ? blog.read_time_ar : blog.read_time_en}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {blog.views || 0}</span>
                   </div>
                   
                   <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white line-clamp-2" title={isRTL ? blog.title_ar : blog.title_en}>
                     {isRTL ? blog.title_ar : blog.title_en}
                   </h3>
                   
                   <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-3 mb-6 flex-1">
                     {isRTL ? (blog.excerpt_ar || "لا يوجد مقتطف") : (blog.excerpt_en || "No excerpt available")}
                   </p>

                   <div className="flex items-center gap-2 mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                      <button 
                        onClick={() => handleEdit(blog)} 
                        className="flex-1 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 font-bold text-sm hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                      >
                        <Edit className="w-4 h-4" /> {isRTL ? 'تعديل' : 'Edit'}
                      </button>
                      <button 
                        onClick={() => handleDelete(blog.id)} 
                        className="px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 hover:bg-red-100 transition-colors"
                      >
                         <Trash2 className="w-4 h-4" />
                      </button>
                   </div>
                </div>
             </div>
           ))}
           
           {/* Add New Card Button (at end of grid) */}
           {!showForm && (
             <button 
                onClick={handleAddNew}
                className="min-h-[400px] rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center text-gray-400 hover:text-nutty-blue hover:border-nutty-blue hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all gap-4 group"
             >
                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                  <Plus className="w-8 h-8" />
                </div>
                <span className="font-bold text-lg">{isRTL ? 'إضافة مقال جديد' : 'Add New Post'}</span>
             </button>
           )}
        </div>
      </div>
    </AdminLayout>
  );
}

"use client";

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Plus, Edit, Trash2, X, Upload } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminBlogs() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);

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
        setShowModal(false);
        fetchBlogs();
        resetForm();
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
    setShowModal(true);
  };

  const resetForm = () => {
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

  return (
    <AdminLayout>
      <div className="p-8" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FileText className="w-8 h-8 text-nutty-blue" />
            {isRTL ? 'إدارة المدونة' : 'Blog Management'}
          </h1>
          <button 
            onClick={() => { resetForm(); setShowModal(true); }}
            className="bg-nutty-green text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600"
          >
            <Plus className="w-4 h-4" />
            {isRTL ? 'إضافة مقال' : 'Add Post'}
          </button>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left rtl:text-right">{isRTL ? 'العنوان' : 'Title'}</th>
                <th className="px-6 py-4 text-left rtl:text-right">{isRTL ? 'التصنيف' : 'Category'}</th>
                <th className="px-6 py-4 text-left rtl:text-right">{isRTL ? 'المشاهدات' : 'Views'}</th>
                <th className="px-6 py-4 text-left rtl:text-right">{isRTL ? 'إجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {blogs.map((blog) => (
                <tr key={blog.id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {blog.image && <img src={blog.image} className="w-10 h-10 rounded object-cover" />}
                      <div>
                        <div className="font-bold">{isRTL ? blog.title_ar : blog.title_en}</div>
                        <div className="text-xs text-gray-500">{blog.author_en}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 capitalize">{blog.category}</td>
                  <td className="px-6 py-4">{blog.views}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button onClick={() => handleEdit(blog)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(blog.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between mb-6">
                <h3 className="text-xl font-bold">{formData.id ? (isRTL ? 'تعديل' : 'Edit Post') : (isRTL ? 'جديد' : 'New Post')}</h3>
                <button onClick={() => setShowModal(false)}><X className="w-6 h-6" /></button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  {/* English Fields */}
                  <div className="space-y-4">
                    <h4 className="font-bold border-b pb-2">English</h4>
                    <input 
                      placeholder="Title" 
                      className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700" 
                      value={formData.title_en}
                      onChange={e => setFormData({...formData, title_en: e.target.value})}
                      required 
                    />
                    <textarea 
                      placeholder="Excerpt" 
                      className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
                      rows={2} 
                      value={formData.excerpt_en}
                      onChange={e => setFormData({...formData, excerpt_en: e.target.value})}
                    />
                    <textarea 
                      placeholder="Content" 
                      className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
                      rows={6}
                      value={formData.content_en}
                      onChange={e => setFormData({...formData, content_en: e.target.value})}
                    />
                     <input 
                      placeholder="Author" 
                      className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700" 
                      value={formData.author_en}
                      onChange={e => setFormData({...formData, author_en: e.target.value})}
                    />
                  </div>

                  {/* Arabic Fields */}
                  <div className="space-y-4" dir="rtl">
                    <h4 className="font-bold border-b pb-2">العربية</h4>
                    <input 
                      placeholder="العنوان" 
                      className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
                      value={formData.title_ar}
                      onChange={e => setFormData({...formData, title_ar: e.target.value})}
                      required 
                    />
                    <textarea 
                      placeholder="مقتطف" 
                      className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
                      rows={2}
                      value={formData.excerpt_ar}
                      onChange={e => setFormData({...formData, excerpt_ar: e.target.value})}
                    />
                    <textarea 
                      placeholder="المحتوى" 
                      className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
                      rows={6}
                      value={formData.content_ar}
                      onChange={e => setFormData({...formData, content_ar: e.target.value})}
                    />
                     <input 
                      placeholder="الكاتب" 
                      className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700" 
                      value={formData.author_ar}
                      onChange={e => setFormData({...formData, author_ar: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-1">{isRTL ? 'الصورة' : 'Image'}</label>
                        <div className="flex items-center gap-2">
                            {imagePreview && <img src={imagePreview} className="w-16 h-16 rounded object-cover" />}
                            <label className="cursor-pointer px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-2 text-sm">
                                <Upload className="w-4 h-4" /> {uploading ? '...' : (isRTL ? 'رفع' : 'Upload')}
                                <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                            </label>
                        </div>
                    </div>
                    <div>
                         <label className="block text-sm font-medium mb-1">{isRTL ? 'التصنيف' : 'Category'}</label>
                         <select 
                            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
                            value={formData.category}
                            onChange={e => setFormData({...formData, category: e.target.value})}
                        >
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <div className="mt-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="checkbox"
                                    checked={formData.featured}
                                    onChange={e => setFormData({...formData, featured: e.target.checked})}
                                    className="w-4 h-4 text-nutty-blue rounded border-gray-300 focus:ring-nutty-blue"
                                />
                                <span className="text-sm font-medium">{isRTL ? 'مقال مميز' : 'Featured Post'}</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg">{isRTL ? 'إلغاء' : 'Cancel'}</button>
                    <button type="submit" disabled={submitting} className="px-4 py-2 bg-nutty-blue text-white rounded-lg hover:bg-blue-600">
                        {submitting ? '...' : (isRTL ? 'حفظ' : 'Save')}
                    </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

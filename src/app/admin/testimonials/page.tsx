"use client";

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageSquare, AlertCircle, Plus, Trash2, Check, Upload, Star, Eye, X, Quote } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { AdminGridSkeleton } from "@/components/skeletons/AdminGridSkeleton";

import Image from 'next/image';

export default function AdminTestimonials() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [scanPreview, setScanPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  
  const formRef = React.useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
      id: null,
      name: '',
      role: '',
      content: '',
      image: '',
      screenshot_url: '',
      rating: 5,
      is_approved: false
  });

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/testimonials');
      if (res.ok) {
        const data = await res.json();
        setTestimonials(data);
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'image' | 'screenshot_url') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append("file", file);

    try {
      const res = await fetch("/api/upload-image", { method: "POST", body: data });
      if (res.ok) {
        const result = await res.json();
        setFormData(prev => ({ ...prev, [field]: result.url }));
        if (field === 'image') setImagePreview(result.url);
        if (field === 'screenshot_url') setScanPreview(result.url);
      }
    } catch (error) {
       alert(isRTL ? "فشل رفع الصورة" : "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitting(true);
      try {
          const method = editId ? 'PUT' : 'POST';
          const body = editId ? { ...formData, id: editId } : formData;
          
          const res = await fetch('/api/admin/testimonials', {
              method,
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(body) 
          });
          
          if (res.ok) {
              handleCancel();
              fetchData();
          }
      } catch (e) {
          alert('Error');
      } finally {
          setSubmitting(false);
      }
  };

  const handleApprove = async (id: number) => {
      await fetch('/api/admin/testimonials', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, is_approved: true })
      });
      fetchData();
  };

  const handleDelete = async (id: number) => {
      if (!confirm('Are you sure?')) return;
      await fetch(`/api/admin/testimonials?id=${id}`, { method: 'DELETE' });
      fetchData();
  };

  const handleEdit = (item: any) => {
     setEditId(item.id);
     setFormData(item);
     setImagePreview(item.image || '');
     setScanPreview(item.screenshot_url || '');
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
     setEditId(null);
     setFormData({ id: null, name: '', role: '', content: '', image: '', screenshot_url: '', rating: 5, is_approved: false });
     setImagePreview('');
     setScanPreview('');
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="max-w-7xl mx-auto p-4 md:p-8 py-20">
          <AdminGridSkeleton count={4} cardsPerRow={2} />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto p-4 md:p-8" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-nutty-orange" />
            {isRTL ? 'إدارة التقييمات' : 'Testimonials Management'}
          </h1>
          <button
              onClick={handleAddNew}
              className="px-6 py-3 bg-nutty-lime text-white rounded-xl flex items-center gap-2 hover:bg-green-600 font-bold shadow-sm transition-all"
          >
              <Plus className="w-5 h-5" />
              {isRTL ? 'إضافة تقييم جديد' : 'Add New Testimonial'}
          </button>
        </div>

        {/* Form */}
        {showForm && (
            <div ref={formRef} className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-xl mb-12 animate-in fade-in slide-in-from-bottom-4 duration-300">
                 <div className="flex justify-between mb-8 border-b border-gray-100 dark:border-gray-700 pb-4">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 uppercase tracking-widest">
                        {editId ? (isRTL ? 'تعديل التقييم' : 'Edit Testimonial') : (isRTL ? 'إضافة تقييم جديد' : 'Add New Testimonial')}
                    </h3>
                    <button onClick={handleCancel}><X className="w-6 h-6 text-gray-400 hover:text-gray-600" /></button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-4">
                           <label className="block text-sm font-black text-gray-500 uppercase tracking-wider">{isRTL ? 'الاسم' : 'Name'}</label>
                           <input className="w-full px-4 py-3 border-none bg-gray-50 dark:bg-gray-900/50 rounded-xl focus:ring-2 focus:ring-nutty-blue transition-all" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                       </div>
                       <div className="space-y-4">
                           <label className="block text-sm font-black text-gray-500 uppercase tracking-wider">{isRTL ? 'الصفة' : 'Role'}</label>
                           <input className="w-full px-4 py-3 border-none bg-gray-50 dark:bg-gray-900/50 rounded-xl focus:ring-2 focus:ring-nutty-blue transition-all" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} />
                       </div>
                    </div>
                    
                    <div className="space-y-4">
                         <label className="block text-sm font-black text-gray-500 uppercase tracking-wider">{isRTL ? 'المحتوى' : 'Content'}</label>
                         <textarea className="w-full px-4 py-3 border-none bg-gray-50 dark:bg-gray-900/50 rounded-xl focus:ring-2 focus:ring-nutty-blue transition-all" rows={4} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                             <label className="block text-sm font-black text-gray-500 uppercase tracking-wider mb-2">{isRTL ? 'التقييم' : 'Rating'}</label>
                             <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-xl w-fit">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button type="button" key={star} onClick={() => setFormData({...formData, rating: star})}>
                                        <Star className={`w-6 h-6 ${formData.rating >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} transition-all hover:scale-110`} />
                                    </button>
                                ))}
                             </div>
                        </div>
                        
                         <div className="md:col-span-2 flex flex-col sm:flex-row gap-6">
                            <div className="flex-1">
                                <label className="block text-sm font-black text-gray-500 uppercase tracking-wider mb-2">{isRTL ? 'صورة الشخص' : 'Profile Image'}</label>
                                <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-xl">
                                    {imagePreview ? <img src={imagePreview} className="w-10 h-10 rounded-full object-cover" /> : <div className="w-10 h-10 rounded-full bg-gray-200" />}
                                    <label className="cursor-pointer px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2">
                                        <Upload className="w-3 h-3" /> {uploading ? '...' : (isRTL ? 'رفع' : 'Upload')}
                                        <input type="file" hidden accept="image/*" onChange={e => handleImageUpload(e, 'image')} />
                                    </label>
                                </div>
                            </div>
                            
                            <div className="flex-1">
                                <label className="block text-sm font-black text-gray-500 uppercase tracking-wider mb-2">{isRTL ? 'صورة (سكرين شوت)' : 'Screenshot (Optional)'}</label>
                                <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-xl">
                                    {scanPreview ? <img src={scanPreview} className="w-10 h-10 rounded object-cover" /> : <div className="w-10 h-10 rounded bg-gray-200" />}
                                    <label className="cursor-pointer px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2">
                                        <Upload className="w-3 h-3" /> {uploading ? '...' : (isRTL ? 'رفع' : 'Upload')}
                                        <input type="file" hidden accept="image/*" onChange={e => handleImageUpload(e, 'screenshot_url')} />
                                    </label>
                                </div>
                            </div>
                         </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/30">
                          <input 
                              type="checkbox"
                              checked={formData.is_approved}
                              onChange={e => setFormData({...formData, is_approved: e.target.checked})}
                              className="w-5 h-5 text-nutty-blue rounded border-gray-300 focus:ring-nutty-blue"
                              id="approved-check"
                          />
                          <label htmlFor="approved-check" className="font-bold text-gray-700 dark:text-gray-200 cursor-pointer select-none">
                              {isRTL ? 'الموافقة على النشر (Approved)' : 'Approve for Publication'}
                          </label>
                      </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-700">
                        <button type="button" onClick={handleCancel} className="px-6 py-2 text-gray-500 hover:bg-gray-100 rounded-xl font-bold">{isRTL ? 'إلغاء' : 'Cancel'}</button>
                        <button type="submit" disabled={submitting} className="px-8 py-3 bg-nutty-orange text-white rounded-xl hover:bg-orange-600 font-bold shadow-lg shadow-orange-500/20 transition-all">
                            {submitting ? '...' : (isRTL ? 'حفظ' : 'Save')}
                        </button>
                    </div>
                </form>
            </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map(t => (
                <div key={t.id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all relative group flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                         <div className="flex items-center gap-4">
                            {t.image ? (
                                <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-sm">
                                    <Image src={t.image} alt={t.name} fill className="object-cover" />
                                </div>
                            ) : (
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-nutty-blue to-nutty-blue/50 flex items-center justify-center text-white font-bold text-xl shadow-sm">
                                    {t.name[0]}
                                </div>
                            )}
                            <div>
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white leading-tight">{t.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{t.role}</p>
                                <div className="flex items-center gap-0.5 mt-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-3 h-3 ${i < t.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                                    ))}
                                </div>
                            </div>
                         </div>
                         <div className={`px-2 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${t.is_approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                             {t.is_approved ? 'Approved' : 'Pending'}
                         </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900/30 p-4 rounded-xl relative mb-6 flex-1">
                        <Quote className="w-8 h-8 text-gray-300 dark:text-gray-600 absolute -top-3 -right-2 rtl:-right-auto rtl:-left-2 opacity-50 rotate-180 rtl:rotate-0" />
                        <p className="text-gray-600 dark:text-gray-300 italic text-sm leading-relaxed relative z-10">"{t.content}"</p>
                    </div>

                    <div className="flex items-center gap-2 mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                        <button onClick={() => handleEdit(t)} className="flex-1 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 font-bold text-sm hover:bg-blue-100 transition-colors">
                            {isRTL ? 'تعديل' : 'Edit'}
                        </button>
                        {!t.is_approved && (
                             <button onClick={() => handleApprove(t.id)} className="px-4 py-2 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-300 font-bold text-sm hover:bg-green-100 transition-colors" title="Approve">
                                <Check className="w-5 h-5" />
                             </button>
                        )}
                        <button onClick={() => handleDelete(t.id)} className="px-4 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 hover:bg-red-100 transition-colors">
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            ))}
             {!showForm && (
             <button 
                onClick={handleAddNew}
                className="min-h-[250px] rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center text-gray-400 hover:text-nutty-blue hover:border-nutty-blue hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all gap-4 group"
             >
                <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                  <Plus className="w-6 h-6" />
                </div>
                <span className="font-bold text-lg">{isRTL ? 'إضافة تقييم جديد' : 'Add New Testimonial'}</span>
             </button>
           )}
        </div>
      </div>
    </AdminLayout>
  );
}

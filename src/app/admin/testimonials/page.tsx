"use client";

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageSquare, AlertCircle, Plus, Trash2, Check, Upload, Star, Eye, X } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import Image from 'next/image';

export default function AdminTestimonials() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false); // For Add/Edit
  const [showViewModal, setShowViewModal] = useState(false); // For Viewing Details
  const [selectedTestimonial, setSelectedTestimonial] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
      name: '',
      role: '',
      content: '',
      image: '',
      screenshot_url: '',
      rating: 5
  });

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/testimonials');
      if (res.ok) {
        const data = await res.json();
        setTestimonials(data);
      }
    } catch (err) {
      setError('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ... (keep existing handlers) ...
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload-image", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        setFormData(prev => ({ ...prev, image: data.url }));
        setImagePreview(data.url);
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
          const res = await fetch('/api/admin/testimonials', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(formData) 
          });
          
          if (res.ok) {
              setShowModal(false);
              setFormData({ name: '', role: '', content: '', image: '', screenshot_url: '', rating: 5 });
              setImagePreview('');
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
      if (showViewModal) setShowViewModal(false);
  };

  const handleDelete = async (id: number) => {
      if (!confirm('Area you sure?')) return;
      await fetch(`/api/admin/testimonials?id=${id}`, { method: 'DELETE' });
      fetchData();
      if (showViewModal) setShowViewModal(false);
  };

  if (loading) return <AdminLayout>Loading...</AdminLayout>;

  return (
    <AdminLayout>
      <div className="p-8" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-nutty-orange" />
            {isRTL ? 'إدارة التقييمات' : 'Testimonials Management'}
          </h1>
          <button
              onClick={() => { setShowModal(true); setFormData({ name: '', role: '', content: '', image: '', screenshot_url: '', rating: 5 }); }}
              className="px-4 py-2 bg-nutty-green text-white rounded-lg flex items-center gap-2 hover:bg-green-600"
          >
              <Plus className="w-4 h-4" />
              {isRTL ? 'إضافة تقييم' : 'Add Testimonial'}
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
             <table className="w-full text-left rtl:text-right">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                         <th className="px-6 py-4">{isRTL ? 'الاسم' : 'Name'}</th>
                         <th className="px-6 py-4">{isRTL ? 'المحتوى' : 'Content'}</th>
                         <th className="px-6 py-4">{isRTL ? 'التقييم' : 'Rating'}</th>
                         <th className="px-6 py-4">{isRTL ? 'الحالة' : 'Status'}</th>
                         <th className="px-6 py-4">{isRTL ? 'إجراءات' : 'Actions'}</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {testimonials.map(t => (
                        <tr key={t.id}>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    {t.image ? (
                                        <img src={t.image} className="w-10 h-10 rounded-full object-cover" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">{t.name[0]}</div>
                                    )}
                                    <div>
                                        <div className="font-bold">{t.name}</div>
                                        <div className="text-xs text-gray-500">{t.role}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 max-w-xs truncate text-gray-600 cursor-pointer hover:bg-gray-50" onClick={() => { setSelectedTestimonial(t); setShowViewModal(true); }}>
                                {t.content}
                            </td>
                            <td className="px-6 py-4 flex gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> {t.rating}
                            </td>
                            <td className="px-6 py-4">
                                {t.is_approved 
                                    ? <span className="text-green-600 text-sm bg-green-100 px-2 py-1 rounded">Approved</span>
                                    : <span className="text-yellow-600 text-sm bg-yellow-100 px-2 py-1 rounded">Pending</span>
                                }
                            </td>
                            <td className="px-6 py-4 flex gap-2">
                                <button onClick={() => { setSelectedTestimonial(t); setShowViewModal(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded" title="View">
                                    <Eye className="w-4 h-4" />
                                </button>
                                {!t.is_approved && (
                                    <button onClick={() => handleApprove(t.id)} className="p-2 text-green-600 hover:bg-green-50 rounded" title="Approve"><Check className="w-4 h-4" /></button>
                                )}
                                <button onClick={() => handleDelete(t.id)} className="p-2 text-red-600 hover:bg-red-50 rounded" title="Delete"><Trash2 className="w-4 h-4" /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
             </table>
        </div>

        {/* View Details Modal */}
        {showViewModal && selectedTestimonial && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
                    <button 
                        onClick={() => setShowViewModal(false)}
                        className="absolute top-4 right-4 rtl:left-4 rtl:right-auto p-2 hover:bg-gray-100 rounded-full"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-nutty-blue" />
                        {isRTL ? 'تفاصيل التقييم' : 'Testimonial Details'}
                    </h3>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                             {selectedTestimonial.image ? (
                                <img src={selectedTestimonial.image} className="w-20 h-20 rounded-full object-cover border-2 border-gray-100" />
                             ) : (
                                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-500">
                                    {selectedTestimonial.name[0]}
                                </div>
                             )}
                             <div>
                                <div className="text-2xl font-bold">{selectedTestimonial.name}</div>
                                <div className="text-gray-500">{selectedTestimonial.role}</div>
                                <div className="flex items-center mt-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star 
                                            key={i} 
                                            className={`w-4 h-4 ${i < selectedTestimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                                        />
                                    ))}
                                </div>
                             </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                            "{selectedTestimonial.content}"
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-4">
                            <span>ID: {selectedTestimonial.id}</span>
                            <span>Source: {selectedTestimonial.source}</span>
                            <span>Date: {new Date(selectedTestimonial.created_at).toLocaleDateString()}</span>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                             {!selectedTestimonial.is_approved && (
                                <button 
                                    onClick={() => handleApprove(selectedTestimonial.id)}
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                                >
                                    <Check className="w-4 h-4" /> {isRTL ? 'موافقة' : 'Approve'}
                                </button>
                             )}
                             <button 
                                onClick={() => handleDelete(selectedTestimonial.id)}
                                className="px-6 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 flex items-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" /> {isRTL ? 'حذف' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* Modal */}
        {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
                    <h3 className="text-xl font-bold mb-4">{isRTL ? 'إضافة تقييم جديد' : 'Add New Testimonial'}</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                         <div>
                             <label className="block text-sm font-medium mb-1">{isRTL ? 'الاسم' : 'Name'}</label>
                             <input className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                        </div>
                        <div>
                             <label className="block text-sm font-medium mb-1">{isRTL ? 'الصفة' : 'Role'}</label>
                             <input className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} />
                        </div>
                        <div>
                             <label className="block text-sm font-medium mb-1">{isRTL ? 'المحتوى' : 'Content'}</label>
                             <textarea className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700" rows={3} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} />
                        </div>
                         
                         <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">{isRTL ? 'صورة الشخص' : 'Profile Image'}</label>
                                <div className="flex items-center gap-2">
                                    {imagePreview && <img src={imagePreview} className="w-10 h-10 rounded-full object-cover" />}
                                    <label className="cursor-pointer px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-2 text-sm">
                                        <Upload className="w-4 h-4" /> {uploading ? '...' : (isRTL ? 'رفع' : 'Upload')}
                                        <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                                    </label>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">{isRTL ? 'صورة التعليق (سكرين شوت)' : 'Review Screenshot'}</label>
                                <div className="flex items-center gap-2">
                                    {formData.screenshot_url && <img src={formData.screenshot_url} className="w-10 h-10 rounded object-cover border" />}
                                    <label className="cursor-pointer px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-2 text-sm">
                                        <Upload className="w-4 h-4" /> {isRTL ? 'رفع' : 'Upload'}
                                        <input 
                                            type="file" 
                                            hidden 
                                            accept="image/*" 
                                            onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (!file) return;
                                                setUploading(true);
                                                const uploadData = new FormData();
                                                uploadData.append("file", file);
                                                try {
                                                    const res = await fetch("/api/upload-image", { method: "POST", body: uploadData });
                                                    if (res.ok) {
                                                        const data = await res.json();
                                                        setFormData(prev => ({ ...prev, screenshot_url: data.url }));
                                                    }
                                                } catch (e) { alert('Upload failed'); }
                                                finally { setUploading(false); }
                                            }} 
                                        />
                                    </label>
                                </div>
                            </div>
                         </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg">{isRTL ? 'إلغاء' : 'Cancel'}</button>
                            <button type="submit" disabled={submitting} className="px-4 py-2 bg-nutty-orange text-white rounded-lg hover:bg-orange-600">{submitting ? '...' : (isRTL ? 'حفظ' : 'Save')}</button>
                        </div>
                    </form>
                </div>
            </div>
        )}
      </div>
    </AdminLayout>
  );
}

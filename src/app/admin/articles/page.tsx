"use client";

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Search, 
  X, 
  Save, 
  Loader2,
  Image as ImageIcon,
  Upload
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { AdminTableSkeleton } from "@/components/skeletons/AdminTableSkeleton";


export default function AdminArticles() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setFormData(prev => ({ ...prev, image: data.url }));
      } else {
        console.error("Image upload failed");
      }
    } catch (error) {
       console.error("Error uploading image:", error);
    } finally {
      setUploading(false);
    }
  };

  // Form states
  const [formData, setFormData] = useState({
    title_en: '',
    title_ar: '',
    excerpt_en: '',
    excerpt_ar: '',
    author_en: '',
    author_ar: '',
    date_en: '',
    date_ar: '',
    readTime_en: '',
    readTime_ar: '',
    category: 'education',
    image: '',
    featured: false,
    trending: false
  });

  const categories = [
    'education', 'technology', 'chemistry', 'environment', 
    'robotics', 'psychology', 'diversity'
  ];

  useEffect(() => {
    fetchArticles();
  }, []);

  async function fetchArticles() {
    try {
      const res = await fetch(`/api/articles?t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        setArticles(data);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleOpenModal = (article: any = null) => {
    if (article) {
      setCurrentArticle(article);
      setFormData({
        title_en: article.title_en,
        title_ar: article.title_ar,
        excerpt_en: article.excerpt_en,
        excerpt_ar: article.excerpt_ar,
        author_en: article.author_en,
        author_ar: article.author_ar,
        date_en: article.date_en,
        date_ar: article.date_ar,
        readTime_en: article.readTime_en,
        readTime_ar: article.readTime_ar,
        category: article.category,
        image: article.image,
        featured: article.featured,
        trending: article.trending
      });
    } else {
      setCurrentArticle(null);
      setFormData({
        title_en: '',
        title_ar: '',
        excerpt_en: '',
        excerpt_ar: '',
        author_en: '',
        author_ar: '',
        date_en: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        date_ar: new Date().toLocaleDateString('ar-EG', { month: 'numeric', day: 'numeric', year: 'numeric' }),
        readTime_en: '5 min read',
        readTime_ar: '٥ دقائق للقراءة',
        category: 'education',
        image: '',
        featured: false,
        trending: false
      });
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setArticles(articles.filter(a => a.id !== id));
      }
    } catch (error) {
      console.error('Error deleting article:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = currentArticle 
        ? `/api/articles/${currentArticle.id}`
        : '/api/articles';
      
      const method = currentArticle ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        await fetchArticles();
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Error saving article:', error);
    } finally {
      setSaving(false);
    }
  };

  const filteredArticles = articles.filter(article => 
    article.title_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.title_ar.includes(searchQuery)
  );

  return (
  <AdminLayout>
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Articles Management</h1>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center px-4 py-2 bg-nutty-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Article
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-nutty-blue focus:outline-none"
        />
      </div>

      {loading ? (
        <AdminTableSkeleton rows={5} />
      ) : (
        <div className="grid gap-4">
          {filteredArticles.map((article) => (
            <div
              key={article.id}
              className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  {article.image ? (
                    <img src={article.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">{article.title_en}</h3>
                  <p className="text-sm text-gray-500 line-clamp-1">{article.title_ar}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-xs rounded-full">
                      {article.category}
                    </span>
                    {article.featured && (
                      <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleOpenModal(article)}
                  className="p-2 text-gray-600 hover:text-nutty-blue hover:bg-blue-50 dark:text-gray-400 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Pencil className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(article.id)}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {currentArticle ? 'Edit Article' : 'New Article'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white border-b pb-2">English Content</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title (EN)</label>
                    <input
                      type="text"
                      required
                      value={formData.title_en}
                      onChange={e => setFormData({ ...formData, title_en: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Excerpt (EN)</label>
                    <textarea
                      required
                      value={formData.excerpt_en}
                      onChange={e => setFormData({ ...formData, excerpt_en: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 h-24"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Author (EN)</label>
                    <input
                      type="text"
                      required
                      value={formData.author_en}
                      onChange={e => setFormData({ ...formData, author_en: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white border-b pb-2">Arabic Content</h3>
                  <div dir="rtl">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">العنوان</label>
                    <input
                      type="text"
                      required
                      value={formData.title_ar}
                      onChange={e => setFormData({ ...formData, title_ar: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700"
                    />
                  </div>
                  <div dir="rtl">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">مقتطف</label>
                    <textarea
                      required
                      value={formData.excerpt_ar}
                      onChange={e => setFormData({ ...formData, excerpt_ar: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 h-24"
                    />
                  </div>
                  <div dir="rtl">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">المؤلف</label>
                    <input
                      type="text"
                      required
                      value={formData.author_ar}
                      onChange={e => setFormData({ ...formData, author_ar: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700"
                    />
                  </div>
                </div>
              </div>

              {/* Meta & Settings */}
              <div className="grid md:grid-cols-2 gap-6 pt-6 border-t dark:border-gray-700">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="article-image-upload"
                        disabled={uploading}
                      />
                      <label 
                        htmlFor="article-image-upload"
                        className={`flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer transition-colors ${
                          uploading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {uploading ? 'Uploading...' : 'Upload Image'}
                      </label>
                      {formData.image && (
                         <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
                           <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                         </div>
                      )}
                    </div>
                    {formData.image && (
                         <input 
                           type="text" 
                           value={formData.image} 
                           readOnly 
                           className="mt-2 w-full px-4 py-2 text-xs text-gray-500 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                         />
                    )}
                  </div>
                  <div className="flex gap-6 pt-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                        className="rounded text-nutty-blue focus:ring-nutty-blue"
                      />
                      <span className="text-sm font-medium">Featured</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.trending}
                        onChange={e => setFormData({ ...formData, trending: e.target.checked })}
                        className="rounded text-nutty-blue focus:ring-nutty-blue"
                      />
                      <span className="text-sm font-medium">Trending</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date (EN)</label>
                      <input
                        type="text"
                        value={formData.date_en}
                        onChange={e => setFormData({ ...formData, date_en: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700"
                      />
                    </div>
                    <div dir="rtl">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">التاريخ</label>
                      <input
                        type="text"
                        value={formData.date_ar}
                        onChange={e => setFormData({ ...formData, date_ar: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Read Time (EN)</label>
                      <input
                        type="text"
                        value={formData.readTime_en}
                        onChange={e => setFormData({ ...formData, readTime_en: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700"
                      />
                    </div>
                    <div dir="rtl">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">وقت القراءة</label>
                      <input
                        type="text"
                        value={formData.readTime_ar}
                        onChange={e => setFormData({ ...formData, readTime_ar: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-nutty-blue text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
                >
                  {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Save Article
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

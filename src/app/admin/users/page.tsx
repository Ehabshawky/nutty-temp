"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { UserPlus, Trash2, Edit2, Shield, Save, X, Key } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";

interface AdminUser {
  id: string;
  username: string;
  created_at: string;
}

export default function AdminUsersPage() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const router = useRouter();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  
  // Form state
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      const url = "/api/admin/users";
      const method = editId ? "PUT" : "POST";
      const body = editId ? { id: editId, ...formData } : formData;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await res.json();

      if (res.ok) {
        setMessage({ 
          type: "success", 
          text: isRTL ? "تمت العملية بنجاح" : "Operation successful" 
        });
        resetForm();
        fetchUsers();
      } else {
        setMessage({ 
          type: "error", 
          text: result.error || (isRTL ? "فشل تنفيذ العملية" : "Operation failed") 
        });
      }
    } catch (err) {
      setMessage({ 
        type: "error", 
        text: isRTL ? "خطأ في الاتصال" : "Connection error" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(isRTL ? "هل أنت متأكد من حذف هذا المستخدم؟" : "Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(`/api/admin/users?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setUsers(users.filter(u => u.id !== id));
        setMessage({ type: "success", text: isRTL ? "تم الحذف بنجاح" : "Deleted successfully" });
      }
    } catch (err) {
      setMessage({ type: "error", text: isRTL ? "خطأ في الحذف" : "Error deleting" });
    }
  };

  const startEdit = (user: AdminUser) => {
    setEditId(user.id);
    setFormData({ username: user.username, password: "" });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditId(null);
    setFormData({ username: "", password: "" });
    setIsEditing(false);
    setMessage({ type: "", text: "" });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nutty-orange"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Shield className="w-6 h-6 text-nutty-orange" />
              {isRTL ? "إدارة مديري النظام" : "Admin User Management"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {isRTL ? "إضافة أو تعديل حسابات مديري النظام" : "Add or modify administrator accounts"}
            </p>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-nutty-orange text-white rounded-lg flex items-center gap-2 hover:bg-nutty-orange/90 transition-colors shadow-sm"
            >
              <UserPlus className="w-5 h-5" />
              {isRTL ? "إضافة مدير جديد" : "Add New Admin"}
            </button>
          )}
        </div>

        {/* Status Message */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            message.type === "success" 
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200" 
              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200"
          }`}>
            <div className="flex-1">{message.text}</div>
            <button onClick={() => setMessage({ type: "", text: "" })}>
              <X className="w-5 h-5 opacity-50 hover:opacity-100" />
            </button>
          </div>
        )}

        {/* User Form */}
        {isEditing && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8 border border-gray-100 dark:border-gray-700 animate-in fade-in slide-in-from-top-4">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              {editId ? <Edit2 className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
              {editId 
                ? (isRTL ? "تعديل بيانات المدير" : "Edit Admin Details") 
                : (isRTL ? "إنشاء مدير جديد" : "Create New Admin")}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {isRTL ? "اسم المستخدم" : "Username"}
                </label>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-nutty-orange outline-none"
                  placeholder="admin"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {isRTL ? "كلمة المرور" : "Password"}
                  {editId && <span className="text-xs text-gray-500 ml-2">({isRTL ? "اتركها فارغة لعدم التغيير" : "leave empty to keep current"})</span>}
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    required={!editId}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-nutty-orange outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div className="md:col-span-2 flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {isRTL ? "إلغاء" : "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-nutty-orange text-white rounded-lg flex items-center gap-2 hover:bg-nutty-orange/90 transition-colors shadow-sm disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  {isSubmitting ? (isRTL ? "جاري الحفظ..." : "Saving...") : (isRTL ? "حفظ التغييرات" : "Save Changes")}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
          <table className="w-full text-left" dir={isRTL ? "rtl" : "ltr"}>
            <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                  {isRTL ? "اسم المستخدم" : "Username"}
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                  {isRTL ? "تاريخ الإنشاء" : "Created At"}
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white text-end">
                  {isRTL ? "الإجراءات" : "Actions"}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    {user.username}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {new Date(user.created_at).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US')}
                  </td>
                  <td className="px-6 py-4 text-sm text-end">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => startEdit(user)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title={isRTL ? "تعديل" : "Edit"}
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      {users.length > 1 && (
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title={isRTL ? "حذف" : "Delete"}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              {isRTL ? "لا يوجد مستخدمون لعرضهم" : "No users to display"}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

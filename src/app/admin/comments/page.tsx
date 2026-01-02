"use client";

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, X, Trash2, MessageSquare, AlertCircle } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { AdminTableSkeleton } from "@/components/skeletons/AdminTableSkeleton";


export default function AdminComments() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchComments = async () => {
    try {
      const res = await fetch('/api/admin/comments');
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      } else {
        throw new Error('Failed to fetch comments');
      }
    } catch (err) {
      setError('Error loading comments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleApprove = async (id: number, currentStatus: boolean) => {
    // If getting approved, set true. If currently approved (and we want to unapprove? usually moderation is one way or toggle, let's assume toggle for now)
    // Actually simpler: Approve button only shows if !is_approved.
    try {
      const res = await fetch('/api/admin/comments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_approved: true }), // Always approve
      });
      
      if (res.ok) {
        fetchComments();
      }
    } catch (err) {
      console.error('Error approving comment', err);
    }
  };

  const handleReject = async (id: number) => {
    // Rejecting essentially means deleting or hiding. User asked for "Admin must approve before publishing". 
    // So "Reject" could mean just leaving it unapproved, or Deleting it.
    // Let's implement Delete for rejecting.
    if (!confirm(isRTL ? 'هل أنت متأكد من حذف هذا التعليق؟' : 'Are you sure you want to delete this comment?')) return;

    try {
      const res = await fetch(`/api/admin/comments?id=${id}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        fetchComments();
      }
    } catch (err) {
      console.error('Error deleting comment', err);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8">
          <AdminTableSkeleton rows={6} />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
    <div className="p-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <MessageSquare className="w-8 h-8 text-nutty-orange" />
          {isRTL ? 'إدارة التعليقات' : 'Comments Management'}
        </h1>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {isRTL ? 'المستخدم' : 'User'}
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {isRTL ? 'التعليق' : 'Comment'}
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {isRTL ? 'المقال' : 'Article'}
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {isRTL ? 'التاريخ' : 'Date'}
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {isRTL ? 'الحالة' : 'Status'}
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {isRTL ? 'إجراءات' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {comments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    {isRTL ? 'لا توجد تعليقات' : 'No comments found'}
                  </td>
                </tr>
              ) : (
                comments.map((comment) => (
                  <tr key={comment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 dark:text-white">{comment.name}</div>
                      <div className="text-xs text-gray-500">{comment.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600 dark:text-gray-300 max-w-xs truncate" title={comment.content}>
                        {comment.content}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {comment.articles 
                        ? (isRTL ? comment.articles.title_ar : comment.articles.title_en)
                        : (comment.blogs ? (isRTL ? comment.blogs.title_ar : comment.blogs.title_en) : '-')
                      }
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {comment.is_approved ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          {isRTL ? 'منشور' : 'Published'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                          {isRTL ? 'بانتظار الموافقة' : 'Pending'}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {!comment.is_approved && (
                          <button
                            onClick={() => handleApprove(comment.id, comment.is_approved)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title={isRTL ? 'موافقة' : 'Approve'}
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleReject(comment.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title={isRTL ? 'حذف' : 'Delete'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </AdminLayout>
  );
}

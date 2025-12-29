"use client";

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, AlertCircle, Calendar } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminSubscribers() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchSubscribers() {
      try {
        const res = await fetch('/api/admin/subscribers');
        if (res.ok) {
          const data = await res.json();
          setSubscribers(data);
        } else {
          throw new Error('Failed to fetch subscribers');
        }
      } catch (err) {
        setError('Error loading subscribers');
      } finally {
        setLoading(false);
      }
    }
    fetchSubscribers();
  }, []);

  if (loading) return <AdminLayout><div className="p-8">Loading...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="p-8" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Mail className="w-8 h-8 text-nutty-orange" />
            {isRTL ? 'المشتركون في النشرة البريدية' : 'Newsletter Subscribers'}
          </h1>
          <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-bold">
            {subscribers.length} {isRTL ? 'مشترك' : 'Subscribers'}
          </div>
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
                    {isRTL ? 'البريد الإلكتروني' : 'Email'}
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {isRTL ? 'تاريخ الاشتراك' : 'Subscribed At'}
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {isRTL ? 'الحالة' : 'Status'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {subscribers.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                      {isRTL ? 'لا يوجد مشتركين بعد' : 'No subscribers yet'}
                    </td>
                  </tr>
                ) : (
                  subscribers.map((sub, index) => (
                    <tr key={sub.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                        {sub.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {new Date(sub.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          {sub.status || 'Active'}
                        </span>
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

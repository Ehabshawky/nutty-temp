"use client";

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Search, Trash2, Eye, X, Calendar, User, Phone } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminMessages() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/admin/contact');
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
        const res = await fetch(`/api/admin/contact?id=${id}`, { method: 'DELETE' });
        if(res.ok) {
            setMessages(messages.filter(m => m.id !== id));
            if(selectedMessage?.id === id) setSelectedMessage(null);
        }
    } catch(e) {
        console.error(e);
    }
  };

  const filteredMessages = messages.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="p-8" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Mail className="w-8 h-8 text-nutty-blue" />
            {isRTL ? 'رسائل التواصل' : 'Contact Messages'}
          </h1>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden flex flex-col md:flex-row h-[calc(100vh-200px)]">
            {/* List */}
            <div className={`w-full md:w-1/3 border-r dark:border-gray-700 flex flex-col ${selectedMessage ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-4 border-b dark:border-gray-700">
                     <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 rtl:left-auto rtl:right-3" />
                        <input 
                            placeholder={isRTL ? 'بحث...' : 'Search...'}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg border-none focus:ring-2 focus:ring-nutty-blue rtl:pr-10 rtl:pl-4"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                     </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="flex-1 space-y-4 p-4">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="p-4 border-b dark:border-gray-700 animate-pulse">
                                    <div className="flex justify-between mb-2">
                                        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                                        <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                                    </div>
                                    <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                                    <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded" />
                                </div>
                            ))}
                        </div>
                    ) : filteredMessages.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No messages found</div>
                    ) : (
                        filteredMessages.map(msg => (
                            <div 
                                key={msg.id}
                                onClick={() => setSelectedMessage(msg)}
                                className={`p-4 border-b dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${selectedMessage?.id === msg.id ? 'bg-blue-50 dark:bg-gray-700 border-l-4 border-l-nutty-blue' : ''}`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-bold text-gray-900 dark:text-gray-100 truncate pr-2">{msg.name}</h4>
                                    <span className="text-xs text-gray-500 whitespace-nowrap">{new Date(msg.created_at).toLocaleDateString()}</span>
                                </div>
                                <p className="text-sm text-gray-800 dark:text-gray-200 font-medium truncate mb-1">{msg.subject}</p>
                                <p className="text-xs text-gray-500 truncate">{msg.message}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Detail */}
            <div className={`w-full md:w-2/3 flex flex-col ${!selectedMessage ? 'hidden md:flex' : 'flex'}`}>
                {selectedMessage ? (
                    <>
                        <div className="p-6 border-b dark:border-gray-700 flex justify-between items-start">
                            <div className="flex-1">
                                <h2 className="text-xl font-bold mb-2">{selectedMessage.subject}</h2>
                                <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        {selectedMessage.name}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        <a href={`mailto:${selectedMessage.email}`} className="text-nutty-blue hover:underline">{selectedMessage.email}</a>
                                    </div>
                                    {selectedMessage.phone && (
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-4 h-4" />
                                            <a href={`tel:${selectedMessage.phone}`} className="hover:underline">{selectedMessage.phone}</a>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(selectedMessage.created_at).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleDelete(selectedMessage.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                                <button onClick={() => setSelectedMessage(null)} className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        <div className="p-8 flex-1 overflow-y-auto bg-gray-50/50 dark:bg-gray-900/50">
                            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm whitespace-pre-wrap leading-relaxed">
                                {selectedMessage.message}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8">
                        <Mail className="w-16 h-16 mb-4 opacity-50" />
                        <p className="text-lg">Select a message to view details</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </AdminLayout>
  );
}

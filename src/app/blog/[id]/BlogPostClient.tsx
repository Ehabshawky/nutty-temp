"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Calendar, User, Clock, ArrowLeft, ArrowRight } from "lucide-react";

interface BlogPostClientProps {
  post: any;
}

const BlogPostClient = ({ post }: BlogPostClientProps) => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const isArabic = i18n.language === "ar";
  
  const [comments, setComments] = React.useState<any[]>([]);
  const [commentForm, setCommentForm] = React.useState({ name: '', email: '', content: '' });
  const [submittingComment, setSubmittingComment] = React.useState(false);
  const [submitMessage, setSubmitMessage] = React.useState('');

  React.useEffect(() => {
    fetchComments();
    
    // Increment view count
    fetch('/api/blogs/view', {
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: post.id })
    }).catch(console.error);

  }, [post.id]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments?blogId=${post.id}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingComment(true);
    setSubmitMessage('');
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blog_id: post.id,
          ...commentForm
        })
      });

      if (res.ok) {
        setSubmitMessage(isArabic ? 'تم إرسال تعليقك للمراجعة' : 'Your comment has been submitted for moderation');
        setCommentForm({ name: '', email: '', content: '' });
      } else {
        setSubmitMessage(isArabic ? 'حدث خطأ أثناء إرسال التعليق' : 'Error submitting comment');
      }
    } catch (e) {
      setSubmitMessage(isArabic ? 'حدث خطأ أثناء إرسال التعليق' : 'Error submitting comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  // Localized content
  const title = isArabic ? post.title_ar : post.title_en;
  const content = isArabic ? post.content_ar : post.content_en; // Use content field, fallback to excerpt if empty?
  const excerpt = isArabic ? post.excerpt_ar : post.excerpt_en;
  const author = isArabic ? post.author_ar : post.author_en;
  const date = new Date(post.created_at).toLocaleDateString(isArabic ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const readTime = isArabic ? post.read_time_ar : post.read_time_en;
  
  // Display content or excerpt
  const displayContent = content || excerpt;

  return (
    <article className="min-h-screen pt-24 pb-16 bg-white dark:bg-gray-900" dir={isArabic ? "rtl" : "ltr"}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 dark:text-gray-400 hover:text-nutty-blue mb-8 transition-colors group"
        >
          {isArabic ? (
            <ArrowRight className="w-5 h-5 ml-2 group-hover:-translate-x-1 transition-transform" />
          ) : (
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          )}
          {isArabic ? "العودة" : "Back"}
        </button>

        {/* Header */}
        <header className="mb-10 text-center">
          <div className="flex items-center justify-center space-x-6 rtl:space-x-reverse text-sm text-gray-500 mb-6">
            <span className="px-3 py-1 bg-nutty-blue/10 text-nutty-blue rounded-full capitalize font-medium">
              {t(`blogsSection.categories.${post.category}`) || post.category}
            </span>
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
              {readTime}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            {title}
          </h1>
          <div className="flex items-center justify-center space-x-8 rtl:space-x-reverse text-gray-600 dark:text-gray-400">
            <div className="flex items-center">
              <User className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0 text-nutty-blue" />
              <span className="font-medium">{author}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0 text-nutty-blue" />
              <span>{date}</span>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="relative w-full h-64 md:h-96 rounded-3xl overflow-hidden shadow-2xl mb-12">
          <Image
            src={post.image}
            alt={title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Content Body */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8 font-serif whitespace-pre-wrap">
            {displayContent}
          </p>
          <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl border-l-4 border-nutty-blue my-8">
            <p className="italic text-gray-700 dark:text-gray-300 m-0">
              {isArabic 
                ? "هذا نص عنصر نائب للمقال الكامل. في التطبيق الحقيقي، سيكون هذا المحتوى قادمًا من CMS أو ملفات Markdown."
                : "This is a placeholder text for the full article content. In a real application, this would be populated with rich text content from a CMS or Markdown files."}
            </p>
          </div>
          {/* Tags */}
        {/* ... (previous code) ... */}
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
             {((isArabic ? post.tags_ar : post.tags_en) || []).map((tag: string, index: number) => (
              <span 
                key={index}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-nutty-blue hover:text-white transition-colors cursor-default"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Comments Section */}
          <div className="mt-16 pt-10 border-t border-gray-200 dark:border-gray-800">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              {isArabic ? 'التعليقات' : 'Comments'} ({comments.length})
            </h3>

            {/* Comments List */}
            <div className="space-y-8 mb-12">
              {comments.length === 0 ? (
                <p className="text-gray-500 italic">{isArabic ? 'كن أول من يعلق!' : 'Be the first to comment!'}</p>
              ) : (
                comments.map((comment: any) => (
                  <div key={comment.id} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-gray-900 dark:text-white">{comment.name}</span>
                        <span className="text-xs text-gray-500">• {new Date(comment.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300">{comment.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Comment Form */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                {isArabic ? 'أضف تعليقاً' : 'Leave a Comment'}
              </h4>
              <form onSubmit={handleCommentSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder={isArabic ? 'الاسم *' : 'Name *'}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-nutty-blue outline-none"
                    value={commentForm.name}
                    onChange={e => setCommentForm({...commentForm, name: e.target.value})}
                  />
                  <input
                    type="email"
                    placeholder={isArabic ? 'البريد الإلكتروني *' : 'Email *'}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-nutty-blue outline-none"
                    value={commentForm.email}
                    onChange={e => setCommentForm({...commentForm, email: e.target.value})}
                  />
                </div>
                <textarea
                  placeholder={isArabic ? 'التعليق *' : 'Comment *'}
                  required
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-nutty-blue outline-none resize-none"
                  value={commentForm.content}
                  onChange={e => setCommentForm({...commentForm, content: e.target.value})}
                />
                <div className="flex flex-col items-end">
                  <button
                    type="submit"
                    disabled={submittingComment}
                    className="px-6 py-3 bg-nutty-blue text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50"
                  >
                    {submittingComment ? (isArabic ? 'جاري الإرسال...' : 'Sending...') : (isArabic ? 'إرسال التعليق' : 'Post Comment')}
                  </button>
                  {submitMessage && (
                    <p className={`mt-3 text-sm font-medium ${submitMessage.includes('Error') || submitMessage.includes('خطأ') ? 'text-red-500' : 'text-green-600'}`}>
                      {submitMessage}
                    </p>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogPostClient;

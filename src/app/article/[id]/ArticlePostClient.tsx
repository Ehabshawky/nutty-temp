"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Calendar, User, Clock, ArrowLeft, ArrowRight, Share2, Bookmark } from "lucide-react";

const ArticlePostClient = ({ article }: { article: any }) => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const isArabic = i18n.language === "ar";
  
  const [comments, setComments] = React.useState<any[]>([]);
  const [newComment, setNewComment] = React.useState({ name: '', email: '', content: '' });
  const [submitting, setSubmitting] = React.useState(false);
  const [submitMsg, setSubmitMsg] = React.useState('');

  // Increment View Count
  React.useEffect(() => {
    const viewedKey = `viewed_article_${article.id}`;
    if (!sessionStorage.getItem(viewedKey)) {
      fetch(`/api/articles/${article.id}/view`, { method: 'POST' })
        .then(() => sessionStorage.setItem(viewedKey, 'true'))
        .catch(err => console.error('View increment failed', err));
    }
  }, [article.id]);

  // Load Comments
  React.useEffect(() => {
    fetch(`/api/comments?articleId=${article.id}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setComments(data);
      })
      .catch(err => console.error('Failed to load comments', err));
  }, [article.id]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitMsg('');

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          article_id: article.id,
          ...newComment
        })
      });

      const data = await res.json();
      if (res.ok) {
        setSubmitMsg(isArabic ? 'تم استلام تعليقك وسينشر بعد الموافقة.' : 'Comment submitted for moderation.');
        setNewComment({ name: '', email: '', content: '' });
      } else {
        setSubmitMsg(data.error || 'Error');
      }
    } catch (e) {
      setSubmitMsg('Error submitting comment');
    } finally {
      setSubmitting(false);
    }
  };

  const [isBookmarked, setIsBookmarked] = React.useState(false);

  // Check bookmark status on mount
  React.useEffect(() => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarked_articles') || '[]');
    setIsBookmarked(bookmarks.includes(article.id));
  }, [article.id]);

  const handleShare = async () => {
    const url = window.location.href;
    const shareData = {
      title: isArabic ? article.title_ar : article.title_en,
      text: isArabic ? article.excerpt_ar : article.excerpt_en,
      url: url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled or error
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(url);
      setSubmitMsg(isArabic ? 'تم نسخ الرابط!' : 'Link copied!');
      setTimeout(() => setSubmitMsg(''), 2000);
    }
  };

  const handleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarked_articles') || '[]');
    let newBookmarks;
    
    if (isBookmarked) {
      newBookmarks = bookmarks.filter((id: any) => id !== article.id);
    } else {
      newBookmarks = [...bookmarks, article.id];
    }
    
    localStorage.setItem('bookmarked_articles', JSON.stringify(newBookmarks));
    setIsBookmarked(!isBookmarked);
    
    // Optional: Show feedback
    setSubmitMsg(
      !isBookmarked 
        ? (isArabic ? 'تم حفظ المقال' : 'Article Saved') 
        : (isArabic ? 'تم إزالة الحفظ' : 'Article Removed')
    );
    setTimeout(() => setSubmitMsg(''), 2000);
  };

  // Localized content
  const title = isArabic ? article.title_ar : article.title_en;
  const content = isArabic ? article.excerpt_ar : article.excerpt_en;
  const author = isArabic ? article.author_ar : article.author_en;
  const date = isArabic ? article.date_ar : article.date_en;
  const readTime = isArabic ? article.readTime_ar : article.readTime_en;

  return (
    <article className="min-h-screen pt-24 pb-16 bg-white dark:bg-gray-900" dir={isArabic ? "rtl" : "ltr"}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
         {/* Navigation Bar */}
        <div className="flex justify-between items-center mb-10">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-nutty-blue transition-colors group"
          >
            {isArabic ? (
              <ArrowRight className="w-5 h-5 ml-2 group-hover:-translate-x-1 transition-transform" />
            ) : (
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            )}
            {isArabic ? "العودة" : "Back"}
          </button>

          <div className="flex items-center space-x-4 rtl:space-x-reverse">
             <button 
                onClick={handleBookmark}
                className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${isBookmarked ? 'text-nutty-blue' : 'text-gray-500'}`}
                title={isArabic ? "حفظ" : "Save"}
             >
                 <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
             </button>
             <button 
                onClick={handleShare}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-nutty-blue transition-colors"
                title={isArabic ? "مشاركة" : "Share"}
             >
                 <Share2 className="w-5 h-5" />
             </button>
          </div>
        </div>

        {/* Header */}
        <header className="mb-10 text-center">
          <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse text-sm text-nutty-blue font-semibold tracking-wide uppercase mb-4">
              <span>{t(`articlesSection.categories.${article.category}`) || article.category}</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
            {title}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-6 text-gray-500 dark:text-gray-400 text-sm">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3 rtl:ml-3 rtl:mr-0">
                 <User className="w-5 h-5" />
              </div>
              <div className="text-left rtl:text-right">
                  <p className="text-gray-900 dark:text-white font-semibold">{author}</p>
                  <p className="text-xs">Author</p>
              </div>
            </div>
            <div className="hidden md:block w-px h-10 bg-gray-200 dark:bg-gray-800"></div>
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" />
              <span>{date}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" />
              <span>{readTime}</span>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-xl mb-12">
          {article.image && (
          <Image
            src={article.image}
            alt={title || 'Article Image'}
            fill
            className="object-cover"
            priority
          />
          )}
        </div>

        {/* Content Body */}
        <div className="prose prose-lg dark:prose-invert max-w-none mx-auto border-b border-gray-100 dark:border-gray-800 pb-12 mb-12">
          <p className="lead text-2xl text-gray-600 dark:text-gray-300 mb-8 whitespace-pre-line">
            {content}
          </p>
          
          <p>
            {isArabic 
                ? "لوريم إيبسوم دولار سيت أميت، كونسيكتيتور أديبايسينغ إليت. نولام أكتور، نيسل سيد تينسيدونت ألتريشيس، نونك سابيان تينسيدونت ليغولا، إت ساجيتيس إيروس ماغنا فيل إيروس. سيد كوية، فيليس إت أولتريشيس تينسيدونت، سابيان إيروس بيبيندم نولاً، فيل فينيتيس جوستو ماغنا فيل نيسل."
                : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl sed tincidunt ultricies, nunc sapien tincidunt ligula, et sagittis eros magna vel eros. Sed quia, felis et ultricies tincidunt, sapien eros bibendum nulla, vel venenatis justo magna vel nisl."}
          </p>

           <h2 className="text-2xl font-bold mt-8 mb-4">
              {isArabic ? "نظرة متعمقة" : "In-Depth Analysis"}
           </h2>
           
           <p>
               {isArabic 
                ? "هذا نص عنصر نائب إضافي لمحاكاة مقال أطول. نحن ملتزمون بتقديم أفضل المحتوى التعليمي. استكشف المزيد من المقالات لمعرفة كيف نغير مستقبل العلوم."
                : "This is additional placeholder text to simulate a longer article. We are committed to providing the best educational content. Explore more articles to see how we are changing the future of science."}
           </p>

          <div className="bg-blue-50 dark:bg-blue-900/30 p-8 rounded-xl my-8">
             <h3 className="text-nutty-blue font-bold text-xl mb-2">{isArabic ? "نقاط رئيسية" : "Key Takeaways"}</h3>
             <ul className="list-disc list-inside space-y-2">
                 <li>{isArabic ? "النقطة المهمة الأولى حول الموضوع" : "First important point about the topic"}</li>
                 <li>{isArabic ? "رؤية بحثية رئيسية ثانية" : "Second key research insight"}</li>
                 <li>{isArabic ? "خاتمة عملية للقراء" : "Actionable conclusion for readers"}</li>
             </ul>
          </div>
        </div>

        {/* Comments Section */}
        <div className="max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            {isArabic ? 'التعليقات' : 'Comments'} ({comments.length})
          </h3>

          {/* Comment List */}
          <div className="space-y-6 mb-12">
             {comments.length === 0 ? (
               <p className="text-gray-500">{isArabic ? 'لا توجد تعليقات بعد. كن أول من يعلق!' : 'No comments yet. Be the first to share your thoughts!'}</p>
             ) : (
               comments.map((comment) => (
                 <div key={comment.id} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
                    <div className="flex justify-between items-start mb-2">
                       <h4 className="font-bold text-gray-900 dark:text-white">{comment.name}</h4>
                       <span className="text-xs text-gray-500">
                         {new Date(comment.created_at).toLocaleDateString()}
                       </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
                 </div>
               ))
             )}
          </div>

          {/* Comment Form */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
             <h4 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
                {isArabic ? 'اترك تعليقاً' : 'Leave a Comment'}
             </h4>
             
             {submitMsg && (
               <div className={`p-4 mb-6 rounded-lg ${submitMsg.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                 {submitMsg}
               </div>
             )}

             <form onSubmit={handleCommentSubmit} className="space-y-6">
               <div className="grid md:grid-cols-2 gap-6">
                 <div>
                   <label className="block text-sm font-medium mb-2">{isArabic ? 'الاسم' : 'Name'}</label>
                   <input 
                     type="text" 
                     required
                     value={newComment.name}
                     onChange={e => setNewComment({...newComment, name: e.target.value})}
                     className="w-full px-4 py-3 rounded-xl border dark:border-gray-600 dark:bg-gray-700" 
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-medium mb-2">{isArabic ? 'البريد الإلكتروني' : 'Email'}</label>
                   <input 
                     type="email" 
                     required
                     value={newComment.email}
                     onChange={e => setNewComment({...newComment, email: e.target.value})}
                     className="w-full px-4 py-3 rounded-xl border dark:border-gray-600 dark:bg-gray-700" 
                   />
                 </div>
               </div>
               <div>
                  <label className="block text-sm font-medium mb-2">{isArabic ? 'التعليق' : 'Comment'}</label>
                  <textarea 
                    required
                    rows={4}
                    value={newComment.content}
                    onChange={e => setNewComment({...newComment, content: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border dark:border-gray-600 dark:bg-gray-700"
                  ></textarea>
               </div>
               <button 
                 type="submit" 
                 disabled={submitting}
                 className="w-full md:w-auto px-8 py-3 bg-nutty-orange text-white rounded-xl font-bold hover:bg-orange-600 transition-colors disabled:opacity-50"
               >
                 {submitting ? (isArabic ? 'جاري الإرسال...' : 'Submitting...') : (isArabic ? 'إرسال التعليق' : 'Submit Comment')}
               </button>
             </form>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ArticlePostClient;

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const articleId = searchParams.get('articleId');
  const blogId = searchParams.get('blogId');

  if (!articleId && !blogId) {
    return NextResponse.json({ error: 'Article ID or Blog ID is required' }, { status: 400 });
  }

  try {
    let query = supabase
      .from('comments')
      .select('*')
      .eq('is_approved', true) // Only approved comments
      .order('created_at', { ascending: false });

    if (articleId) {
      query = query.eq('article_id', articleId);
    } else if (blogId) {
      query = query.eq('blog_id', blogId);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { article_id, blog_id, name, email, content } = body;

    // Basic validation
    if ((!article_id && !blog_id) || !name || !email || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Insert as unapproved (using supabase client is fine if RLS allows anon insert, but safer to use admin client or fix RLS if needed. 
    // Given previous issues, let's stick to default client but ensure RLS works, or use admin client. 
    // Contact form used admin client. Let's try standard client first as testimonials worked, but remove .select() just in case)
    
    // Actually, let's use supabaseAdmin for insert to be safe against RLS restrictions on return
    // But wait, I need to import it. It's not imported here yet.
    // I'll stick to supabase for now and remove .select(). If it fails, I'll switch.
    
    // Wait, better to use supabaseAdmin anyway for consistency with contact form fixes.
    // I'll add the import.

    const { error } = await supabase
      .from('comments')
      .insert([
        { 
          article_id: article_id || null, 
          blog_id: blog_id || null,
          name, 
          email, 
          content,
          is_approved: false 
        }
      ]); // Removed .select()

    if (error) throw error;

    // Send Notification Email
    try {
      const { sendNotificationEmail } = await import('@/lib/email');
      await sendNotificationEmail({
        subject: `New Comment from ${name}`,
        html: `
          <h3>New Comment on ${article_id ? 'Article' : 'Blog'}</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Content:</strong></p>
          <p>"${content}"</p>
          <p><em>This comment requires approval.</em></p>
        `,
        type: 'comment'
      });
    } catch (e) {
      console.error('Failed to send email notification', e);
    }

    return NextResponse.json({ success: true, message: 'Comment submitted for moderation' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

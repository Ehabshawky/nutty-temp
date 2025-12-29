import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*, comments_count')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Map DB columns (snake_case) to Frontend properties (camelCase for readTime) to match existing code expectations
    const articles = data.map((article: any) => ({
      ...article,
      readTime_en: article.read_time_en,
      readTime_ar: article.read_time_ar,
      comments: article.comments_count || 0,
    }));

    return NextResponse.json(articles);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  // Allow admin actions. If you don't have auth set up locally, you might comment this out for testing, but adhering to jobs pattern:
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    
    // Map frontend properties to DB columns
    const dbPayload = {
      ...body,
      read_time_en: body.readTime_en,
      read_time_ar: body.readTime_ar,
    };
    // Remove the camelCase keys if you want to be clean, or Supabase might ignore them if not in schema.
    delete dbPayload.readTime_en;
    delete dbPayload.readTime_ar;
    // Remove ID if present to let DB auto-generate
    delete dbPayload.id;

    const { data, error } = await supabaseAdmin
      .from('articles')
      .insert([dbPayload])
      .select();

    if (error) throw error;
    
    // Map back for response
    const newArticle = {
        ...data[0],
        readTime_en: data[0].read_time_en,
        readTime_ar: data[0].read_time_ar,
    };

    return NextResponse.json(newArticle);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// This route handles incrementing view counts
export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Blog ID is required' }, { status: 400 });
    }

    // Call the RPC function defined in migration
    const { error } = await supabase.rpc('increment_blog_view', { blog_id: id });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error incrementing view:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const id = params.id;

    const { error } = await supabase.rpc('increment_article_view', { article_id: id });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error incrementing view:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

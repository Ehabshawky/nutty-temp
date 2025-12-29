import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const id = params.id;
    const body = await request.json();
    
    // Map frontend properties to DB columns
    const dbPayload = {
      ...body,
      read_time_en: body.readTime_en,
      read_time_ar: body.readTime_ar,
    };
    delete dbPayload.readTime_en;
    delete dbPayload.readTime_ar;
    delete dbPayload.id; // Don't update ID

    const { data, error } = await supabaseAdmin
      .from('articles')
      .update(dbPayload)
      .eq('id', id)
      .select();

    if (error) throw error;
    
    const updatedArticle = {
        ...data[0],
        readTime_en: data[0].read_time_en,
        readTime_ar: data[0].read_time_ar,
    };

    return NextResponse.json(updatedArticle);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const id = params.id;
    
    const { error } = await supabaseAdmin
      .from('articles')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';
import { deleteFileFromStorage } from '@/lib/storage';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from('blogs')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    // Exclude id for new inserts so Postgres generates it
    const { id, ...newBlog } = body;
    const { data, error } = await supabaseAdmin
      .from('blogs')
      .insert([newBlog])
      .select();

    if (error) throw error;
    return NextResponse.json(data[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { id, ...updates } = body;
    
    // If image is updated, delete the old one
    if (updates.image_url) {
      const { data: oldBlog } = await supabaseAdmin
        .from('blogs')
        .select('image_url')
        .eq('id', id)
        .single();
      
      if (oldBlog && oldBlog.image_url && oldBlog.image_url !== updates.image_url) {
        await deleteFileFromStorage(oldBlog.image_url);
      }
    }

    const { data, error } = await supabaseAdmin
      .from('blogs')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) throw error;
    return NextResponse.json(data[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    // Get the blog to delete its image
    const { data: blog } = await supabaseAdmin
      .from('blogs')
      .select('image_url')
      .eq('id', id)
      .single();

    const { error } = await supabaseAdmin
      .from('blogs')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // Delete the image from storage if it exists
    if (blog?.image_url) {
      await deleteFileFromStorage(blog.image_url);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

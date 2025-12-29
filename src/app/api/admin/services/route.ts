// src/app/api/admin/services/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// Helper to check for admin session
const isAdmin = async () => {
  const session = await getServerSession(authOptions);
  return !!session;
};

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('services')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Map to snake_case for consistency with public API and frontend expectations
  const formattedServices = data.map(svc => ({
    id: svc.id,
    title_en: svc.title_en,
    title_ar: svc.title_ar,
    description_en: svc.description_en,
    description_ar: svc.description_ar,
    long_description_en: svc.long_description_en,
    long_description_ar: svc.long_description_ar,
    image: svc.image,
    icon: svc.icon
  }));

  return NextResponse.json(formattedServices);
}

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const body = await req.json();
  const { 
    title_en, title_ar, 
    description_en, description_ar, 
    long_description_en, long_description_ar,
    image, icon 
  } = body;

  const { data, error } = await supabaseAdmin
    .from('services')
    .insert([
      { 
        title_en, title_ar, 
        description_en, description_ar, 
        long_description_en, long_description_ar,
        image, icon 
      }
    ])
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, service: data[0] }, { status: 201 });
}

export async function PUT(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const updated = await req.json();
  const { id, ...rest } = updated;

  // Ensure id is present
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from('services')
    .update(rest)
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from('services')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

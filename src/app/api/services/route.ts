// src/app/api/services/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Map Supabase fields to the format expected by the frontend (snake_case)
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

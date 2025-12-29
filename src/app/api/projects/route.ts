import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Format response for frontend
  const formattedProjects = data.map(p => ({
    ...p,
    description: {
      en: p.description_en,
      ar: p.description_ar
    }
  }));

  return NextResponse.json(formattedProjects);
}

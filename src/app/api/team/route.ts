import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Format response for frontend to match the existing expectations
  const formattedTeam = data.map(m => ({
    ...m,
    position: {
      en: m.position_en,
      ar: m.position_ar
    },
    bio: {
      en: m.bio_en,
      ar: m.bio_ar
    },
    education: {
      en: m.education_en,
      ar: m.education_ar
    },
    social: {
      linkedin: m.linkedin,
      twitter: m.twitter,
      github: m.github
    }
  }));

  return NextResponse.json(formattedTeam);
}

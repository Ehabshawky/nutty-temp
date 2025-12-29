import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const formattedJobs = data.map(job => ({
      ...job,
      title: {
        en: job.title_en,
        ar: job.title_ar
      },
      department: {
        en: job.department_en,
        ar: job.department_ar
      },
      location: {
        en: job.location_en,
        ar: job.location_ar
      },
      type: {
        en: job.type_en,
        ar: job.type_ar
      },
      description: {
        en: job.description_en,
        ar: job.description_ar
      },
      requirements: {
        en: job.requirements_en || [],
        ar: job.requirements_ar || []
      }
    }));

    return NextResponse.json(formattedJobs);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

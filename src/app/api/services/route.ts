// src/app/api/services/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = searchParams.get('limit');
    
    let query = supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: false });

    // Filter by category if specified
    if (category && category !== 'all') {
      query = query.ilike('category', `%${category}%`);
    }

    // Limit results if specified
    if (limit) {
      query = query.limit(parseInt(limit, 10));
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch services' }, 
        { status: 500 }
      );
    }

    // Format response
    const formattedServices = data?.map(svc => ({
      id: svc.id,
      title_en: svc.title_en || '',
      title_ar: svc.title_ar || '',
      description_en: svc.description_en || '',
      description_ar: svc.description_ar || '',
      long_description_en: svc.long_description_en || '',
      long_description_ar: svc.long_description_ar || '',
      image: svc.image || '',
      icon: svc.icon || 'Beaker',
      category: svc.category || 'families',
      duration: svc.duration || '2-3 hours',
      participants_min: svc.participants_min || 10,
      participants_max: svc.participants_max || 30,
      schedule_type: svc.schedule_type || 'flexible',
      location_type: svc.location_type || 'on-site,online',
      age_group: svc.age_group || '',
      price_range: svc.price_range || '',
      features: svc.features || '[]',
      created_at: svc.created_at,
      updated_at: svc.updated_at
    })) || [];

    return NextResponse.json(formattedServices);
    
  } catch (error: any) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
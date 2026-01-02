// src/app/api/admin/services/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from '@/lib/supabase';
import { deleteFileFromStorage } from '@/lib/storage';

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
    console.error('Error fetching services:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Map all fields including new ones
  const formattedServices = data.map(svc => ({
    id: svc.id,
    title_en: svc.title_en,
    title_ar: svc.title_ar,
    description_en: svc.description_en,
    description_ar: svc.description_ar,
    long_description_en: svc.long_description_en,
    long_description_ar: svc.long_description_ar,
    image: svc.image,
    icon: svc.icon,
    category: svc.category || 'families', // حقل جديد
    duration: svc.duration || '2-3 hours', // حقل جديد
    participants_min: svc.participants_min || 10, // حقل جديد
    participants_max: svc.participants_max || 30, // حقل جديد
    schedule_type: svc.schedule_type || 'flexible', // حقل جديد
    location_type: svc.location_type || 'on-site,online', // حقل جديد
    age_group: svc.age_group || '', // حقل جديد
    price_range: svc.price_range || '', // حقل جديد
    features: svc.features || [], // حقل جديد
    created_at: svc.created_at,
    updated_at: svc.updated_at
  }));

  return NextResponse.json(formattedServices);
}

export async function POST(req: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await req.json();
    const { 
      title_en, title_ar, 
      description_en, description_ar, 
      long_description_en, long_description_ar,
      image, icon, category, duration,
      participants_min, participants_max, schedule_type,
      location_type, age_group, price_range, features
    } = body;

    // Validation
    if (!title_en || !title_ar || !description_en || !description_ar) {
      return NextResponse.json({ 
        error: 'Missing required fields: title and description in both languages' 
      }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('services')
      .insert([
        { 
          title_en, title_ar, 
          description_en, description_ar, 
          long_description_en: long_description_en || '',
          long_description_ar: long_description_ar || '',
          image: image || '',
          icon: icon || 'Beaker',
          category: category || 'families',
          duration: duration || '2-3 hours',
          participants_min: participants_min || 10,
          participants_max: participants_max || 30,
          schedule_type: schedule_type || 'flexible',
          location_type: location_type || 'on-site,online',
          age_group: age_group || '',
          price_range: price_range || '',
          features: features || []
        }
      ])
      .select();

    if (error) {
      console.error('Error creating service:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      service: data[0] 
    }, { status: 201 });

  } catch (error: any) {
    console.error('Unexpected error in POST:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updated = await req.json();
    const { id, ...rest } = updated;

    // Ensure id is present
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    // Add updated_at timestamp
    const updateData = {
      ...rest
    };

    // If image is updated, delete the old one
    if (rest.image) {
      const { data: oldService } = await supabaseAdmin
        .from('services')
        .select('image')
        .eq('id', id)
        .single();

      if (oldService && oldService.image && oldService.image !== rest.image) {
        await deleteFileFromStorage(oldService.image);
      }
    }

    const { error } = await supabaseAdmin
      .from('services')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Error updating service:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Unexpected error in PUT:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    // Get the service to delete its image
    const { data: service } = await supabaseAdmin
      .from('services')
      .select('image')
      .eq('id', id)
      .single();

    const { error } = await supabaseAdmin
      .from('services')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting service:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Delete the image from storage if it exists
    if (service?.image) {
      await deleteFileFromStorage(service.image);
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Unexpected error in DELETE:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
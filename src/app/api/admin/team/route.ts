import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from '@/lib/supabase';
import { deleteFileFromStorage } from '@/lib/storage';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from('team_members')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { 
    name, position_en, position_ar, bio_en, bio_ar, 
    image, department, email, linkedin, twitter, github, 
    skills, education_en, education_ar, featured 
  } = body;

  const { data, error } = await supabaseAdmin
    .from('team_members')
    .insert([
      { 
        name, position_en, position_ar, bio_en, bio_ar, 
        image, department, email, linkedin, twitter, github, 
        skills, education_en, education_ar, featured 
      }
    ])
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, member: data[0] });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const updated = await req.json();
  const { id, created_at, ...rest } = updated;

  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  // If image is updated, delete the old one
  if (rest.image) {
    const { data: oldMember } = await supabaseAdmin
      .from('team_members')
      .select('image')
      .eq('id', id)
      .single();

    if (oldMember && oldMember.image && oldMember.image !== rest.image) {
      await deleteFileFromStorage(oldMember.image);
    }
  }

  const { error } = await supabaseAdmin
    .from('team_members')
    .update(rest)
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  // Get the member to delete its image
  const { data: member } = await supabaseAdmin
    .from('team_members')
    .select('image')
    .eq('id', id)
    .single();

  const { error } = await supabaseAdmin
    .from('team_members')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Delete the image from storage if it exists
  if (member?.image) {
    await deleteFileFromStorage(member.image);
  }

  return NextResponse.json({ success: true });
}

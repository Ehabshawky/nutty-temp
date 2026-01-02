import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [
      { count: programsCount },
      { count: teamCount },
      { count: testimonialsCount },
      { count: pendingTestimonialsCount },
      { count: jobsCount },
      { count: blogsCount },
      { count: messagesCount },
      { count: unreadMessagesCount }
    ] = await Promise.all([
      supabaseAdmin.from('services').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('team_members').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('testimonials').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('testimonials').select('*', { count: 'exact', head: true }).eq('is_approved', false),
      supabaseAdmin.from('jobs').select('*', { count: 'exact', head: true }).eq('active', true),
      supabaseAdmin.from('blogs').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('contact_messages').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('contact_messages').select('*', { count: 'exact', head: true }).eq('is_read', false)
    ]);

    return NextResponse.json({
      programs: programsCount || 0,
      team: teamCount || 0,
      testimonials: testimonialsCount || 0,
      pendingTestimonials: pendingTestimonialsCount || 0,
      jobs: jobsCount || 0,
      blogs: blogsCount || 0,
      messages: messagesCount || 0,
      unreadMessages: unreadMessagesCount || 0
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}

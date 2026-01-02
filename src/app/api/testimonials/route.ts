import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('is_approved', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate required fields
    if (!body.name || !body.content) {
        return NextResponse.json({ error: 'Name and Content are required' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('testimonials')
      .insert([{
        name: body.name,
        role: body.role || 'Customer',
        content: body.content,
        rating: body.rating || 5,
        source: 'website',
        image: body.image || null,
        is_approved: false // Always require approval for public submissions
      }])
      .select();

    if (error) throw error;

    // Send Notification Email
    try {
      const { sendNotificationEmail } = await import('@/lib/email');
      await sendNotificationEmail({
        subject: `New Testimonial from ${body.name}`,
        html: `
          <h3>New Testimonial Submitted</h3>
          <p><strong>Name:</strong> ${body.name}</p>
          <p><strong>Rating:</strong> ${body.rating || 5}/5</p>
          <p><strong>Content:</strong></p>
          <p>"${body.content}"</p>
          <p><em>This testimonial requires approval in the admin panel.</em></p>
        `,
        type: 'review'
      });
    } catch (e) {
      console.error('Failed to send email notification', e);
    }

    return NextResponse.json(data[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // Check if already subscribed
    const { data: existing } = await supabaseAdmin
      .from('subscribers')
      .select('id')
      .eq('email', email)
      .single();

    if (existing) {
      return NextResponse.json({ message: 'Already subscribed' }, { status: 200 });
    }

    const { error } = await supabaseAdmin
      .from('subscribers')
      .insert([{ email }]);

    if (error) throw error;

    return NextResponse.json({ message: 'Subscribed successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

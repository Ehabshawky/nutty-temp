import { NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "@/lib/supabase";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET() {
  const { data, error } = await supabase
    .from('site_configs')
    .select('key, value');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Convert array of {key, value} to a single object like the old JSON
  const configObject = data.reduce((acc: any, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {});

  return NextResponse.json(configObject);
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const payload = await request.json();
    const { section, data } = payload;
    
    if (!section) {
      return NextResponse.json({ error: "Missing section" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('site_configs')
      .upsert({ key: section, value: data, updated_at: new Date().toISOString() });

    if (error) {
       return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, section, data });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

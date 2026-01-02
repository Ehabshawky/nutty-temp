import { NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "@/lib/supabase";
import { deleteFileFromStorage } from "@/lib/storage";
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

    // --- Start Storage Cleanup Logic ---
    // Fetch current data to compare
    const { data: currentConfig } = await supabaseAdmin
      .from('site_configs')
      .select('value')
      .eq('key', section)
      .single();

    if (currentConfig && currentConfig.value) {
      const oldData = currentConfig.value;

      // Handle 'hero' section cleanup
      if (section === 'hero' && oldData.slides && data.slides) {
        const oldSlides = oldData.slides as any[];
        const newSlides = data.slides as any[];

        // Collect all new image/video URLs
        const newImages = new Set(newSlides.map(s => s.image).filter(Boolean));
        const newVideos = new Set(newSlides.map(s => s.video).filter(Boolean));

        // Check old slides
        for (const slide of oldSlides) {
          if (slide.image && !newImages.has(slide.image)) {
            await deleteFileFromStorage(slide.image);
          }
          if (slide.video && !newVideos.has(slide.video)) {
            await deleteFileFromStorage(slide.video);
          }
        }
      }

      // Handle 'about' section cleanup
      if (section === 'about' && oldData.story && data.story) {
        // Check story image
        if (oldData.story.image && oldData.story.image !== data.story.image) {
          await deleteFileFromStorage(oldData.story.image);
        }
        // Check story video
        if (oldData.story.video && oldData.story.video !== data.story.video) {
          await deleteFileFromStorage(oldData.story.video);
        }
      }

      // Handle 'settings' section cleanup
      if (section === 'settings' && oldData.logo_url && data.logo_url) {
        if (oldData.logo_url !== data.logo_url) {
          await deleteFileFromStorage(oldData.logo_url);
        }
      }
    }
    // --- End Storage Cleanup Logic ---

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

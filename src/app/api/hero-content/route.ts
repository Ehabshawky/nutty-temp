// app/api/hero-content/route.ts
import { NextResponse } from "next/server";

export const dynamic = 'force-static';

export async function GET() {
  // Fetch from database
  return NextResponse.json({
    title_en: "Nutty Scientists",
    title_ar: "ناتي ساينتستس",
    subtitle_en: "Where Science Meets Fun!",
    subtitle_ar: "حيث يلتقي العلم بالمرح!",
    description_en:
      "Transforming young minds through innovative science education",
    description_ar: "نحول عقول الشباب من خلال التعليم العلمي المبتكر",
  });
}

export async function PUT(request: Request) {
  const data = await request.json();
  // Update in database (this is a stub for now)
  return NextResponse.json({ success: true, received: data });
}

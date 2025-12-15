import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "data", "site-content.json");

function readData() {
  try {
    const raw = fs.readFileSync(DATA_PATH, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    return null;
  }
}

function writeData(data: any) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf8");
}

export const dynamic = 'force-static';

export async function GET() {
  const data = readData();
  if (!data) {
    return NextResponse.json(
      { error: "Unable to read content" },
      { status: 500 }
    );
  }
  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  try {
    const payload = await request.json();
    // payload expected: { section: 'hero'|'footer'|..., data: { ... } }
    const { section, data } = payload;
    if (!section) {
      return NextResponse.json({ error: "Missing section" }, { status: 400 });
    }
    const current = readData() || {};
    current[section] = data;
    writeData(current);
    return NextResponse.json({ success: true, section, data });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

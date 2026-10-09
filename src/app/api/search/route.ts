import { NextRequest, NextResponse } from "next/server";
import { searchArticles } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (!q) return NextResponse.json({ results: [] });
  const results = await searchArticles(q);
  return NextResponse.json({ results });
}

import { NextRequest, NextResponse } from "next/server";
import { getArticleById, incrementViews } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Ctx = { params: { id: string } };

// Dipanggil ViewBeacon dari browser setiap artikel dibuka. Hanya
// artikel terbit yang dihitung.
export async function POST(_req: NextRequest, { params }: Ctx) {
  const id = Number(params.id);
  if (!id) {
    return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
  }
  const article = await getArticleById(id);
  if (!article || article.status !== "published") {
    return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });
  }
  await incrementViews(id);
  return new NextResponse(null, { status: 204 });
}

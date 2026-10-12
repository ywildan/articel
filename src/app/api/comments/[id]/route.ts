import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { isAdminAuthed } from "@/lib/session";
import { revalidateArticlePaths } from "@/lib/revalidate";

export const dynamic = "force-dynamic";

type Ctx = { params: { id: string } };

// Halaman artikel pemilik komentar ini perlu disegarkan setiap kali
// status moderasi berubah agar komentar tampil/hilang dari cache ISR.
async function revalidateCommentArticle(commentId: number) {
  const rows = await sql`
    SELECT a.slug, a.category, a.tags
    FROM comments c
    JOIN articles a ON a.id = c.article_id
    WHERE c.id = ${commentId}
    LIMIT 1
  `;
  const paths = rows[0] as unknown as
    | { slug: string; category: string; tags: string[] }
    | undefined;
  if (paths) revalidateArticlePaths(paths);
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const id = Number(params.id);
  const { approved } = (await req.json()) as { approved?: boolean };
  if (!id || typeof approved !== "boolean") {
    return NextResponse.json({ error: "Payload tidak valid" }, { status: 400 });
  }
  await sql`UPDATE comments SET approved = ${approved} WHERE id = ${id}`;
  await revalidateCommentArticle(id);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const id = Number(params.id);
  if (!id) {
    return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
  }
  await revalidateCommentArticle(id);
  await sql`DELETE FROM comments WHERE id = ${id}`;
  return NextResponse.json({ ok: true });
}

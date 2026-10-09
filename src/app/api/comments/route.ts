import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: {
    articleId?: number;
    author?: string;
    email?: string;
    content?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body tidak valid" }, { status: 400 });
  }

  const articleId = Number(body.articleId);
  const author = (body.author ?? "").trim();
  const email = (body.email ?? "").trim() || null;
  const content = (body.content ?? "").trim();

  if (!articleId || !author || !content) {
    return NextResponse.json(
      { error: "Nama dan komentar wajib diisi" },
      { status: 400 }
    );
  }
  if (content.length > 2000 || author.length > 80) {
    return NextResponse.json({ error: "Komentar terlalu panjang" }, { status: 400 });
  }

  const article = await sql`
    SELECT id FROM articles WHERE id = ${articleId} AND status = 'published' LIMIT 1
  `;
  if (article.length === 0) {
    return NextResponse.json({ error: "Artikel tidak ditemukan" }, { status: 404 });
  }

  await sql`
    INSERT INTO comments (article_id, author, email, content, approved)
    VALUES (${articleId}, ${author}, ${email}, ${content}, false)
  `;

  return NextResponse.json({ ok: true }, { status: 201 });
}

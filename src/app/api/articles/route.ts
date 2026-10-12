import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { isAdminAuthed } from "@/lib/session";
import { slugify, parseTags } from "@/lib/utils";
import { revalidateArticlePaths } from "@/lib/revalidate";

export const dynamic = "force-dynamic";

async function uniqueSlug(base: string): Promise<string> {
  let slug = base || "artikel";
  let n = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const exists = await sql`SELECT id FROM articles WHERE slug = ${slug} LIMIT 1`;
    if (exists.length === 0) return slug;
    n += 1;
    slug = `${base}-${n}`;
  }
}

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as {
    title?: string;
    slug?: string;
    excerpt?: string;
    content?: string;
    cover_image?: string;
    category?: string;
    tags?: string | string[];
    status?: string;
  };

  const title = (body.title ?? "").trim();
  const content = (body.content ?? "").trim();
  if (!title || !content) {
    return NextResponse.json(
      { error: "Judul dan isi artikel wajib diisi" },
      { status: 400 }
    );
  }

  const slug = await uniqueSlug(slugify(body.slug?.trim() || title));
  const category = (body.category ?? "umum").trim().toLowerCase() || "umum";
  const tags = parseTags(body.tags);
  const status = body.status === "published" ? "published" : "draft";

  const rows = (await sql`
    INSERT INTO articles (slug, title, excerpt, content, cover_image, category, tags, status)
    VALUES (
      ${slug},
      ${title},
      ${body.excerpt?.trim() || null},
      ${content},
      ${body.cover_image?.trim() || null},
      ${category},
      ${tags},
      ${status}
    )
    RETURNING id, slug
  `) as unknown as { id: number; slug: string }[];

  if (status === "published") {
    revalidateArticlePaths({ slug, category, tags });
  }

  return NextResponse.json({ id: rows[0].id, slug: rows[0].slug }, { status: 201 });
}

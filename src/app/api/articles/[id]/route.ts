import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { isAdminAuthed } from "@/lib/session";
import { slugify, parseTags } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Ctx = { params: { id: string } };

export async function GET(_req: NextRequest, { params }: Ctx) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const id = Number(params.id);
  const rows = await sql`SELECT * FROM articles WHERE id = ${id} LIMIT 1`;
  if (rows.length === 0) {
    return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });
  }
  return NextResponse.json({ article: rows[0] });
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const id = Number(params.id);
  if (!id) {
    return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
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

  const slug = slugify(body.slug?.trim() || title);
  const clash = await sql`
    SELECT id FROM articles WHERE slug = ${slug} AND id <> ${id} LIMIT 1
  `;
  if (clash.length > 0) {
    return NextResponse.json(
      { error: "Slug sudah dipakai artikel lain" },
      { status: 409 }
    );
  }

  const category = (body.category ?? "umum").trim().toLowerCase() || "umum";
  const tags = parseTags(body.tags);
  const status = body.status === "published" ? "published" : "draft";

  await sql`
    UPDATE articles SET
      slug = ${slug},
      title = ${title},
      excerpt = ${body.excerpt?.trim() || null},
      content = ${content},
      cover_image = ${body.cover_image?.trim() || null},
      category = ${category},
      tags = ${tags},
      status = ${status},
      updated_at = now()
    WHERE id = ${id}
  `;

  return NextResponse.json({ ok: true, slug });
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const id = Number(params.id);
  const { status } = (await req.json().catch(() => ({}))) as { status?: string };
  if (!id || (status !== "published" && status !== "draft")) {
    return NextResponse.json({ error: "Payload tidak valid" }, { status: 400 });
  }
  await sql`
    UPDATE articles SET status = ${status}, updated_at = now() WHERE id = ${id}
  `;
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
  await sql`DELETE FROM articles WHERE id = ${id}`;
  return NextResponse.json({ ok: true });
}

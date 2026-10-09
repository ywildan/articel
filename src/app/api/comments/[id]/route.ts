import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { isAdminAuthed } from "@/lib/session";

export const dynamic = "force-dynamic";

type Ctx = { params: { id: string } };

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
  await sql`DELETE FROM comments WHERE id = ${id}`;
  return NextResponse.json({ ok: true });
}

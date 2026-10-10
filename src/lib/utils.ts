export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Label tampilan kategori: akronim pendek (<= 3 huruf) jadi uppercase penuh ("ai" -> "AI"), sisanya kapital di awal. */
export function categoryLabel(category: string): string {
  const c = category.trim();
  if (!c) return c;
  if (c.length <= 3) return c.toUpperCase();
  return c.charAt(0).toUpperCase() + c.slice(1);
}

export function formatDate(input: string | Date): string {
  const date = new Date(input);
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function readingMinutes(wordCount: number): number {
  return Math.max(1, Math.round(wordCount / 200));
}

export function readingTime(content: string): number {
  const words = content.trim() ? content.trim().split(/\s+/).length : 0;
  return readingMinutes(words);
}

export function parseTags(raw: string | string[] | undefined): string[] {
  if (Array.isArray(raw)) return raw.map((t) => t.trim()).filter(Boolean);
  if (!raw) return [];
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

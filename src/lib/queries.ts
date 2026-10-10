import { sql, type Article, type ArticleRow, type Comment } from "@/lib/db";

export async function getPublishedArticles(opts?: {
  category?: string;
  tag?: string;
  limit?: number;
}): Promise<ArticleRow[]> {
  const category = opts?.category ?? "";
  const tag = opts?.tag ?? "";
  const limit = opts?.limit ?? 100;

  const rows = await sql`
    SELECT id, slug, title, excerpt, cover_image, category, tags, status, views, created_at, updated_at,
      CASE WHEN trim(content) = '' THEN 0 ELSE COALESCE(array_length(regexp_split_to_array(trim(content), '[[:space:]]+'), 1), 0) END::int AS word_count
    FROM articles
    WHERE status = 'published'
      AND (${category} = '' OR category = ${category})
      AND (${tag} = '' OR ${tag} = ANY(tags))
    ORDER BY created_at DESC
    LIMIT ${limit}
  `;
  return rows as unknown as ArticleRow[];
}

export async function searchArticles(q: string): Promise<ArticleRow[]> {
  const term = `%${q.toLowerCase()}%`;
  const rows = await sql`
    SELECT id, slug, title, excerpt, cover_image, category, tags, status, views, created_at, updated_at,
      CASE WHEN trim(content) = '' THEN 0 ELSE COALESCE(array_length(regexp_split_to_array(trim(content), '[[:space:]]+'), 1), 0) END::int AS word_count
    FROM articles
    WHERE status = 'published'
      AND (
        lower(title) LIKE ${term}
        OR lower(coalesce(excerpt, '')) LIKE ${term}
        OR lower(content) LIKE ${term}
      )
    ORDER BY created_at DESC
    LIMIT 50
  `;
  return rows as unknown as ArticleRow[];
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const rows = await sql`SELECT * FROM articles WHERE slug = ${slug} LIMIT 1`;
  return (rows[0] as Article) ?? null;
}

export async function incrementViews(id: number): Promise<void> {
  await sql`UPDATE articles SET views = views + 1 WHERE id = ${id}`;
}

export type CategorySummary = {
  category: string;
  count: number;
  latest_title: string | null;
  latest_slug: string | null;
  latest_at: string | null;
};

export async function getCategories(): Promise<CategorySummary[]> {
  const rows = await sql`
    SELECT c.category, c.count,
           l.title AS latest_title,
           l.slug AS latest_slug,
           l.created_at AS latest_at
    FROM (
      SELECT category, COUNT(*)::int AS count
      FROM articles
      WHERE status = 'published'
      GROUP BY category
    ) c
    LEFT JOIN LATERAL (
      SELECT title, slug, created_at
      FROM articles a
      WHERE a.category = c.category AND a.status = 'published'
      ORDER BY a.created_at DESC
      LIMIT 1
    ) l ON true
    ORDER BY c.count DESC, c.category ASC
  `;
  return rows as unknown as CategorySummary[];
}

export async function getPopularTags(): Promise<
  { tag: string; count: number }[]
> {
  const rows = await sql`
    SELECT tag, COUNT(*)::int AS count
    FROM articles, unnest(tags) AS tag
    WHERE status = 'published'
    GROUP BY tag
    ORDER BY count DESC
    LIMIT 30
  `;
  return rows as unknown as { tag: string; count: number }[];
}

export async function getApprovedComments(
  articleId: number
): Promise<Comment[]> {
  const rows = await sql`
    SELECT * FROM comments
    WHERE article_id = ${articleId} AND approved = true
    ORDER BY created_at DESC
  `;
  return rows as unknown as Comment[];
}

/* ---- Dashboard (butuh auth, semua status) ---- */

export async function getAllArticles(): Promise<ArticleRow[]> {
  const rows = await sql`
    SELECT id, slug, title, excerpt, cover_image, category, tags, status, views, created_at, updated_at,
      CASE WHEN trim(content) = '' THEN 0 ELSE COALESCE(array_length(regexp_split_to_array(trim(content), '[[:space:]]+'), 1), 0) END::int AS word_count
    FROM articles
    ORDER BY created_at DESC
  `;
  return rows as unknown as ArticleRow[];
}

export async function getArticleById(id: number): Promise<Article | null> {
  const rows = await sql`SELECT * FROM articles WHERE id = ${id} LIMIT 1`;
  return (rows[0] as Article) ?? null;
}

export async function getStats(): Promise<{
  total: number;
  published: number;
  draft: number;
  views: number;
  comments: number;
  pendingComments: number;
}> {
  const a = (await sql`
    SELECT
      COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE status = 'published')::int AS published,
      COUNT(*) FILTER (WHERE status = 'draft')::int AS draft,
      COALESCE(SUM(views), 0)::int AS views
    FROM articles
  `) as unknown as {
    total: number;
    published: number;
    draft: number;
    views: number;
  }[];

  const c = (await sql`
    SELECT
      COUNT(*)::int AS comments,
      COUNT(*) FILTER (WHERE approved = false)::int AS pending
    FROM comments
  `) as unknown as { comments: number; pending: number }[];

  return {
    total: a[0]?.total ?? 0,
    published: a[0]?.published ?? 0,
    draft: a[0]?.draft ?? 0,
    views: a[0]?.views ?? 0,
    comments: c[0]?.comments ?? 0,
    pendingComments: c[0]?.pending ?? 0,
  };
}

export async function getAllComments(): Promise<
  (Comment & { article_title: string; article_slug: string })[]
> {
  const rows = await sql`
    SELECT c.id, c.article_id, c.author, c.email, c.content, c.approved, c.created_at,
           a.title AS article_title, a.slug AS article_slug
    FROM comments c
    JOIN articles a ON a.id = c.article_id
    ORDER BY c.created_at DESC
    LIMIT 200
  `;
  return rows as unknown as (Comment & {
    article_title: string;
    article_slug: string;
  })[];
}

import { neon } from "@neondatabase/serverless";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL belum diisi. Tambahkan connection string Neon di environment variable Vercel."
  );
}

export const sql = neon(connectionString);

export type Article = {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  category: string;
  tags: string[];
  status: "draft" | "published";
  views: number;
  created_at: string;
  updated_at: string;
};

export type Comment = {
  id: number;
  article_id: number;
  author: string;
  email: string | null;
  content: string;
  approved: boolean;
  created_at: string;
};

export type ArticleRow = Omit<Article, "content">;

-- Jalankan SQL ini di Neon SQL Editor (sekali saja) untuk membuat tabel.

CREATE TABLE IF NOT EXISTS articles (
  id            BIGSERIAL PRIMARY KEY,
  slug          TEXT NOT NULL UNIQUE,
  title         TEXT NOT NULL,
  excerpt       TEXT,
  content       TEXT NOT NULL,
  cover_image   TEXT,
  category      TEXT NOT NULL DEFAULT 'umum',
  tags          TEXT[] NOT NULL DEFAULT '{}',
  status        TEXT NOT NULL DEFAULT 'draft',   -- 'draft' | 'published'
  views         INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS articles_status_idx ON articles (status);
CREATE INDEX IF NOT EXISTS articles_category_idx ON articles (category);
-- Index gabungan untuk pola query publik: terbaru (status + created_at),
-- trending (status + views), dan filter tag (GIN untuk operator ANY).
CREATE INDEX IF NOT EXISTS articles_status_created_idx ON articles (status, created_at DESC);
CREATE INDEX IF NOT EXISTS articles_status_views_idx ON articles (status, views DESC);
CREATE INDEX IF NOT EXISTS articles_tags_gin_idx ON articles USING GIN (tags);

CREATE TABLE IF NOT EXISTS comments (
  id            BIGSERIAL PRIMARY KEY,
  article_id    BIGINT NOT NULL REFERENCES articles (id) ON DELETE CASCADE,
  author        TEXT NOT NULL,
  email         TEXT,
  content       TEXT NOT NULL,
  approved      BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS comments_article_idx ON comments (article_id);

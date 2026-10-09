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

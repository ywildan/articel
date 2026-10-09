import Link from "next/link";
import { formatDate, readingMinutes, readingTime } from "@/lib/utils";
import type { ArticleRow } from "@/lib/db";

export default function ArticleCard({ article }: { article: ArticleRow }) {
  const minutes =
    typeof article.word_count === "number"
      ? readingMinutes(article.word_count)
      : readingTime(article.excerpt ?? article.title);

  return (
    <article className="group flex h-full flex-col border border-line bg-surface transition-colors duration-150 hover:border-accent">
      <Link href={`/artikel/${article.slug}`} className="flex h-full flex-col">
        <div className="flex flex-1 flex-col p-5">
          <span className="eyebrow">{article.category}</span>
          <h3 className="mt-2 font-display text-xl font-semibold leading-snug tracking-tight transition-colors group-hover:text-accent">
            {article.title}
          </h3>
          {article.excerpt && (
            <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">
              {article.excerpt}
            </p>
          )}

          <div className="mt-5 flex items-center gap-3 border-t border-line pt-3 font-mono text-[11px] uppercase tracking-wide text-muted">
            <span>{formatDate(article.created_at)}</span>
            <span aria-hidden>·</span>
            <span>{minutes} menit</span>
            <span className="ml-auto">{article.views} views</span>
          </div>
        </div>
      </Link>
    </article>
  );
}

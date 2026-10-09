"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, Eye, Tag as TagIcon, Folder } from "lucide-react";
import { formatDate, readingTime } from "@/lib/utils";
import type { ArticleRow } from "@/lib/db";

export default function ArticleCard({
  article,
  index = 0,
}: {
  article: ArticleRow;
  index?: number;
}) {
  const minutes = readingTime(article.excerpt ?? article.title);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      className="group relative"
    >
      <Link
        href={`/artikel/${article.slug}`}
        className="glass card-hover flex h-full flex-col overflow-hidden rounded-2xl"
      >
        <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-brand-500/20 to-fuchsia-500/20">
          {article.cover_image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={article.cover_image}
              alt={article.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-4xl font-black text-white/20">
              {article.title.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
            <Folder className="h-3 w-3" />
            {article.category}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h3 className="line-clamp-2 text-lg font-bold leading-snug transition-colors group-hover:text-brand-500">
            {article.title}
          </h3>
          {article.excerpt && (
            <p className="mt-2 line-clamp-3 flex-1 text-sm text-black/60 dark:text-white/60">
              {article.excerpt}
            </p>
          )}

          {article.tags?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {article.tags.slice(0, 3).map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 rounded-full bg-brand-500/10 px-2 py-0.5 text-[11px] text-brand-600 dark:text-brand-300"
                >
                  <TagIcon className="h-2.5 w-2.5" />
                  {t}
                </span>
              ))}
            </div>
          )}

          <div className="mt-4 flex items-center gap-4 border-t border-black/5 dark:border-white/10 pt-3 text-[11px] text-black/50 dark:text-white/50">
            <span>{formatDate(article.created_at)}</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" /> {minutes} menit
            </span>
            <span className="ml-auto inline-flex items-center gap-1">
              <Eye className="h-3 w-3" /> {article.views}
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

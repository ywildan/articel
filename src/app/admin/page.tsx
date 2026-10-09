import Link from "next/link";
import { getStats, getAllArticles } from "@/lib/queries";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [stats, articles] = await Promise.all([getStats(), getAllArticles()]);
  const recent = articles.slice(0, 6);

  const cards = [
    { label: "Total artikel", value: stats.total },
    { label: "Terbit", value: stats.published },
    { label: "Draft", value: stats.draft },
    { label: "Total views", value: stats.views },
    { label: "Komentar", value: stats.comments },
    { label: "Menunggu moderasi", value: stats.pendingComments },
  ];

  return (
    <div className="space-y-10">
      <dl className="grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="bg-surface p-5">
            <dt className="eyebrow">{c.label}</dt>
            <dd className="mt-2 font-display text-4xl font-semibold tracking-tight">
              {c.value}
            </dd>
          </div>
        ))}
      </dl>

      <section>
        <div className="flex items-end justify-between border-b border-ink pb-2">
          <h2 className="font-mono text-xs uppercase tracking-eyebrow">
            Artikel terbaru
          </h2>
          <Link
            href="/admin/artikel"
            className="font-mono text-[11px] uppercase tracking-eyebrow text-accent hover:opacity-70"
          >
            Kelola semua →
          </Link>
        </div>

        {recent.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted">
            Belum ada artikel. Klik “Tulis” untuk membuat yang pertama.
          </p>
        ) : (
          <ul className="divide-y divide-line">
            {recent.map((a) => (
              <li key={a.id} className="flex items-center gap-4 py-3">
                <span
                  className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                    a.status === "published" ? "bg-accent" : "bg-muted"
                  }`}
                  title={a.status === "published" ? "Terbit" : "Draft"}
                />
                <Link
                  href={`/admin/artikel/${a.id}/edit`}
                  className="min-w-0 flex-1 truncate text-sm transition-colors hover:text-accent"
                >
                  {a.title}
                </Link>
                <span className="hidden shrink-0 font-mono text-[11px] uppercase tracking-wide text-muted sm:inline">
                  {formatDate(a.created_at)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

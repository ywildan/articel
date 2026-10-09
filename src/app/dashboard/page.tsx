import Link from "next/link";
import { getStats, getAllArticles } from "@/lib/queries";
import Reveal from "@/components/Reveal";
import { formatDate } from "@/lib/utils";
import {
  FileText,
  CheckCircle2,
  FileEdit,
  Eye,
  MessageSquare,
  Clock,
  ArrowRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [stats, articles] = await Promise.all([getStats(), getAllArticles()]);
  const recent = articles.slice(0, 5);

  const cards = [
    { label: "Total Artikel", value: stats.total, icon: FileText, color: "from-brand-500 to-blue-500" },
    { label: "Published", value: stats.published, icon: CheckCircle2, color: "from-emerald-500 to-teal-500" },
    { label: "Draft", value: stats.draft, icon: FileEdit, color: "from-amber-500 to-orange-500" },
    { label: "Total Views", value: stats.views, icon: Eye, color: "from-fuchsia-500 to-pink-500" },
    { label: "Komentar", value: stats.comments, icon: MessageSquare, color: "from-cyan-500 to-sky-500" },
    { label: "Menunggu Moderasi", value: stats.pendingComments, icon: Clock, color: "from-rose-500 to-red-500" },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {cards.map((c, i) => (
          <Reveal key={c.label} delay={i * 0.05}>
            <div className="glass card-hover rounded-2xl p-5">
              <div
                className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${c.color} text-white shadow-lg`}
              >
                <c.icon className="h-5 w-5" />
              </div>
              <p className="mt-4 text-3xl font-black tracking-tight">{c.value}</p>
              <p className="text-xs text-black/60 dark:text-white/60">{c.label}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="glass rounded-2xl p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold">Artikel Terbaru</h2>
          <Link
            href="/dashboard/artikel"
            className="inline-flex items-center gap-1 text-sm font-medium text-brand-500 hover:underline"
          >
            Kelola semua <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {recent.length === 0 ? (
          <p className="py-8 text-center text-sm text-black/50 dark:text-white/50">
            Belum ada artikel. Klik “Tulis” untuk membuat yang pertama.
          </p>
        ) : (
          <ul className="divide-y divide-black/5 dark:divide-white/10">
            {recent.map((a) => (
              <li key={a.id} className="flex items-center gap-3 py-3">
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${
                    a.status === "published" ? "bg-emerald-500" : "bg-amber-500"
                  }`}
                />
                <Link
                  href={`/dashboard/artikel/${a.id}/edit`}
                  className="min-w-0 flex-1 truncate text-sm font-medium hover:text-brand-500"
                >
                  {a.title}
                </Link>
                <span className="hidden shrink-0 text-xs text-black/50 dark:text-white/50 sm:inline">
                  {formatDate(a.created_at)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

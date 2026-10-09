import SearchBox from "@/components/SearchBox";

function editionDate() {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

export default function Hero({ count }: { count: number }) {
  return (
    <section className="border-b border-line">
      <div className="container-x py-12 sm:py-16">
        <div className="flex items-center justify-between border-b border-line pb-3 font-mono text-[11px] uppercase tracking-eyebrow text-muted">
          <span>{editionDate()}</span>
          <span>{count} artikel terbit</span>
        </div>

        <div className="grid gap-10 pt-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
              Tulisan yang layak
              <br />
              dibaca pelan.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
              Kabar mengumpulkan catatan, esai, dan laporan panjang. Disaring
              per kategori dan tag, terbuka untuk dikomentari.
            </p>
          </div>

          <div className="lg:pb-2">
            <p className="eyebrow mb-3">Telusuri arsip</p>
            <SearchBox />
          </div>
        </div>
      </div>
    </section>
  );
}

import DashboardNav from "@/components/dashboard/DashboardNav";

export const dynamic = "force-dynamic";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container-x pt-28 pb-16">
      <div className="mb-6">
        <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
          Dashboard <span className="gradient-text">Admin</span>
        </h1>
        <p className="text-sm text-black/60 dark:text-white/60">
          Kelola artikel, kategori, dan komentar pembaca.
        </p>
      </div>
      <DashboardNav />
      {children}
    </div>
  );
}

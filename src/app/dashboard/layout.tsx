import DashboardNav from "@/components/dashboard/DashboardNav";

export const dynamic = "force-dynamic";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container-x pt-10 pb-16">
      <div className="mb-8">
        <p className="eyebrow">Admin</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-muted">
          Kelola artikel, kategori, dan komentar pembaca.
        </p>
      </div>
      <DashboardNav />
      {children}
    </div>
  );
}

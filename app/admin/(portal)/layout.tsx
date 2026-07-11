import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { requireAdmin } from "@/lib/auth/require-admin";

export default async function AdminPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />

      <div className="min-h-screen lg:pl-72">
        <AdminHeader />

        <main className="px-5 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}

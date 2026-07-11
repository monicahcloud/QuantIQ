import type { ReactNode } from "react";

type AdminTableShellProps = {
  toolbar?: ReactNode;
  children: ReactNode;
};

export default function AdminTableShell({
  toolbar,
  children,
}: AdminTableShellProps) {
  return (
    <div className="space-y-5">
      {toolbar && (
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          {toolbar}
        </section>
      )}

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">{children}</div>
      </section>
    </div>
  );
}

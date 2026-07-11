import type { ElementType, ReactNode } from "react";

type AdminEmptyStateProps = {
  icon: ElementType;
  title: string;
  description: string;
  action?: ReactNode;
};

export default function AdminEmptyState({
  icon: Icon,
  title,
  description,
  action,
}: AdminEmptyStateProps) {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center px-6 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
        <Icon className="h-8 w-8" />
      </div>

      <h2 className="mt-5 text-xl font-black text-[#071d4e]">{title}</h2>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        {description}
      </p>

      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

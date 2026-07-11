type StatCardProps = {
  label: string;
  value: string;
  description: string;
  icon: React.ElementType;
};

export default function StatCard({
  label,
  value,
  description,
  icon: Icon,
}: StatCardProps) {
  return (
    <article className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-slate-500">{label}</p>

          <p className="mt-3 text-4xl font-black tracking-[-0.04em] text-[#071d4e]">
            {value}
          </p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
          <Icon className="h-6 w-6" />
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-500">{description}</p>
    </article>
  );
}

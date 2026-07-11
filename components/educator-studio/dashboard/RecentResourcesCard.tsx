import { FileText } from "lucide-react";
import Link from "next/link";

const resources: {
  title: string;
  detail: string;
}[] = [];

export default function RecentResourcesCard() {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-[#071d4e]">Recent Resources</h2>

        <Link
          href="/educator-studio/dashboard/library"
          className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-[#071d4e]">
          View All
        </Link>
      </div>

      {resources.length === 0 ? (
        <div className="flex min-h-40 flex-col items-center justify-center text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            <FileText className="h-5 w-5" />
          </div>

          <p className="mt-3 text-sm font-black text-slate-700">
            No recent resources
          </p>

          <Link
            href="/educator-studio/dashboard/resources"
            className="mt-3 text-sm font-black text-blue-700">
            Generate a resource
          </Link>
        </div>
      ) : (
        <div className="mt-4 divide-y divide-slate-100">
          {resources.map((resource) => (
            <div key={resource.title} className="flex items-center gap-3 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <FileText className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-black text-slate-700">
                  {resource.title}
                </p>

                <p className="mt-1 text-xs text-slate-500">{resource.detail}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}

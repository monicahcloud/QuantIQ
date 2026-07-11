import Link from "next/link";

const lessons: {
  date: string;
  month: string;
  title: string;
  detail: string;
}[] = [];

export default function UpcomingLessonsCard() {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-[#071d4e]">Upcoming Lessons</h2>

        <Link
          href="/educator-studio/dashboard/curriculum"
          className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-[#071d4e]">
          View Calendar
        </Link>
      </div>

      {lessons.length === 0 ? (
        <div className="flex min-h-40 flex-col items-center justify-center text-center">
          <p className="text-sm font-black text-slate-700">
            No upcoming lessons
          </p>

          <p className="mt-2 text-xs leading-5 text-slate-500">
            Scheduled lessons will appear here.
          </p>

          <Link
            href="/educator-studio/dashboard/lesson-planner"
            className="mt-4 text-sm font-black text-blue-700">
            Create a lesson
          </Link>
        </div>
      ) : (
        <div className="mt-4 divide-y divide-slate-100">
          {lessons.map((lesson) => (
            <div
              key={`${lesson.month}-${lesson.date}-${lesson.title}`}
              className="flex items-center gap-3 py-3">
              <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-slate-50">
                <span className="text-[9px] font-black uppercase text-slate-500">
                  {lesson.month}
                </span>

                <span className="text-lg font-black text-[#071d4e]">
                  {lesson.date}
                </span>
              </div>

              <div>
                <p className="text-sm font-black text-slate-700">
                  {lesson.title}
                </p>

                <p className="mt-1 text-xs text-slate-500">{lesson.detail}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}

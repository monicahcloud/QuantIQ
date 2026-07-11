import type { ReactNode } from "react";

import AcademicCalendarNav from "@/components/admin/education-engine/academic-calendar/AcademicCalendarNav";
import AdminPageHeader from "@/components/admin/shared/AdminPageHeader";

export default function AcademicCalendarLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-[1500px] space-y-7">
      <AdminPageHeader
        eyebrow="Education Engine"
        title="Academic Calendar"
        description="Manage academic years, terms, instructional weeks, holidays, breaks, and calendar settings."
        backHref="/admin/education-engine"
      />

      <AcademicCalendarNav />

      {children}
    </div>
  );
}

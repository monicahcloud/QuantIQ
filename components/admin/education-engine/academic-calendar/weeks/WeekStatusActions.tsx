import { Archive, CalendarCheck2, CalendarX2, RotateCcw } from "lucide-react";

import {
  archiveAcademicWeek,
  restoreAcademicWeek,
  toggleAcademicWeekInstructionalStatus,
} from "@/app/admin/(portal)/education-engine/academic-calendar/weeks/actions";
import { Button } from "@/components/ui/button";

type WeekStatusActionsProps = {
  weekId: string;
  status: "ACTIVE" | "INACTIVE" | "ARCHIVED";
  isInstructional: boolean;
};

export default function WeekStatusActions({
  weekId,
  status,
  isInstructional,
}: WeekStatusActionsProps) {
  if (status === "ARCHIVED") {
    return (
      <form action={restoreAcademicWeek}>
        <input type="hidden" name="academicWeekId" value={weekId} />

        <Button type="submit" size="sm" variant="outline">
          <RotateCcw className="mr-2 h-4 w-4" />
          Restore
        </Button>
      </form>
    );
  }

  return (
    <div className="flex justify-end gap-2">
      <form action={toggleAcademicWeekInstructionalStatus}>
        <input type="hidden" name="academicWeekId" value={weekId} />

        <Button type="submit" size="sm" variant="outline">
          {isInstructional ? (
            <>
              <CalendarX2 className="mr-2 h-4 w-4" />
              Mark Break
            </>
          ) : (
            <>
              <CalendarCheck2 className="mr-2 h-4 w-4" />
              Mark Instructional
            </>
          )}
        </Button>
      </form>

      <form action={archiveAcademicWeek}>
        <input type="hidden" name="academicWeekId" value={weekId} />

        <Button
          type="submit"
          size="sm"
          variant="ghost"
          className="text-slate-500 hover:text-red-700">
          <Archive className="mr-2 h-4 w-4" />
          Archive
        </Button>
      </form>
    </div>
  );
}

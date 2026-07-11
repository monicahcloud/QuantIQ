import { Archive, RotateCcw } from "lucide-react";

import {
  archiveCalendarEvent,
  restoreCalendarEvent,
} from "@/app/admin/(portal)/education-engine/academic-calendar/events/actions";
import { Button } from "@/components/ui/button";

type CalendarEventActionsProps = {
  eventId: string;
  status: "ACTIVE" | "INACTIVE" | "ARCHIVED";
};

export default function CalendarEventActions({
  eventId,
  status,
}: CalendarEventActionsProps) {
  if (status === "ARCHIVED") {
    return (
      <form action={restoreCalendarEvent}>
        <input type="hidden" name="calendarEventId" value={eventId} />

        <Button type="submit" size="sm" variant="outline">
          <RotateCcw className="mr-2 h-4 w-4" />
          Restore
        </Button>
      </form>
    );
  }

  return (
    <form action={archiveCalendarEvent}>
      <input type="hidden" name="calendarEventId" value={eventId} />

      <Button
        type="submit"
        size="sm"
        variant="ghost"
        className="text-slate-500 hover:text-red-700">
        <Archive className="mr-2 h-4 w-4" />
        Archive
      </Button>
    </form>
  );
}

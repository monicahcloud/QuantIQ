import { Archive, CheckCircle2, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  archiveCurriculumVersion,
  markCurriculumVersionCurrent,
  restoreCurriculumVersion,
} from "@/app/admin/(portal)/curriculum-engine/versions/action";

type CurriculumVersionActionsProps = {
  curriculumVersionId: string;
  status:
    | "DRAFT"
    | "UNDER_REVIEW"
    | "APPROVED"
    | "PUBLISHED"
    | "RETIRED"
    | "ARCHIVED";
  isCurrent: boolean;
};

export default function CurriculumVersionActions({
  curriculumVersionId,
  status,
  isCurrent,
}: CurriculumVersionActionsProps) {
  if (status === "ARCHIVED") {
    return (
      <form action={restoreCurriculumVersion}>
        <input
          type="hidden"
          name="curriculumVersionId"
          value={curriculumVersionId}
        />

        <Button type="submit" size="sm" variant="outline">
          <RotateCcw className="mr-2 h-4 w-4" />
          Restore
        </Button>
      </form>
    );
  }

  return (
    <div className="flex justify-end gap-2">
      {!isCurrent && (status === "APPROVED" || status === "PUBLISHED") && (
        <form action={markCurriculumVersionCurrent}>
          <input
            type="hidden"
            name="curriculumVersionId"
            value={curriculumVersionId}
          />

          <Button type="submit" size="sm" variant="outline">
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Make Current
          </Button>
        </form>
      )}

      <form action={archiveCurriculumVersion}>
        <input
          type="hidden"
          name="curriculumVersionId"
          value={curriculumVersionId}
        />

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

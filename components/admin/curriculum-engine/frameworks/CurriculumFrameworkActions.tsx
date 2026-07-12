import { Archive, RotateCcw } from "lucide-react";

import {
  archiveCurriculumFramework,
  restoreCurriculumFramework,
} from "@/app/admin/(portal)/curriculum-engine/frameworks/actions";
import { Button } from "@/components/ui/button";

type CurriculumFrameworkActionsProps = {
  curriculumFrameworkId: string;
  status: "ACTIVE" | "INACTIVE" | "ARCHIVED";
};

export default function CurriculumFrameworkActions({
  curriculumFrameworkId,
  status,
}: CurriculumFrameworkActionsProps) {
  if (status === "ARCHIVED") {
    return (
      <form action={restoreCurriculumFramework}>
        <input
          type="hidden"
          name="curriculumFrameworkId"
          value={curriculumFrameworkId}
        />

        <Button type="submit" size="sm" variant="outline">
          <RotateCcw className="mr-2 h-4 w-4" />
          Restore
        </Button>
      </form>
    );
  }

  return (
    <form action={archiveCurriculumFramework}>
      <input
        type="hidden"
        name="curriculumFrameworkId"
        value={curriculumFrameworkId}
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
  );
}

import { Sparkles } from "lucide-react";

import { analyzeCurriculumDocument } from "@/app/admin/(portal)/curriculum-engine/versions/[versionId]/imports/actions";
import { Button } from "@/components/ui/button";

type AnalyzeWithNovaButtonProps = {
  curriculumDocumentId: string;
  curriculumVersionId: string;
  hasActiveImport: boolean;
};

export default function AnalyzeWithNovaButton({
  curriculumDocumentId,
  curriculumVersionId,
  hasActiveImport,
}: AnalyzeWithNovaButtonProps) {
  return (
    <form action={analyzeCurriculumDocument}>
      <input
        type="hidden"
        name="curriculumDocumentId"
        value={curriculumDocumentId}
      />

      <input
        type="hidden"
        name="curriculumVersionId"
        value={curriculumVersionId}
      />

      <Button
        type="submit"
        disabled={hasActiveImport}
        className="bg-violet-700 hover:bg-violet-800">
        <Sparkles className="mr-2 h-4 w-4" />

        {hasActiveImport ? "Nova Is Analyzing" : "Analyze with Nova"}
      </Button>
    </form>
  );
}

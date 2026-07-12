import { serve } from "inngest/next";

import { inngest } from "@/lib/inngest/client";
import { processCurriculumImport } from "@/lib/inngest/functions/process-curriculum-import";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [processCurriculumImport],
});

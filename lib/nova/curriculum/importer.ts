export type ImportCurriculumResult = {
  importedFrameworks: number;
  importedPackages: number;
  importedNodes: number;
};

export async function importApprovedCurriculum(): Promise<ImportCurriculumResult> {
  throw new Error("Curriculum importing has not been implemented yet.");
}

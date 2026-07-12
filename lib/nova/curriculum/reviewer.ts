export type CurriculumReviewSummary = {
  approved: number;
  edited: number;
  rejected: number;
};

export async function reviewCurriculumExtraction(): Promise<CurriculumReviewSummary> {
  throw new Error("Curriculum review has not been implemented yet.");
}

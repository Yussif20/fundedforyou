export type FAQ = {
  id: string;
  index: number;

  question: string;
  questionArabic: string;
  answer: string;
  answerArabic: string;

  mobileFontSize?: number | null;

  createdAt: string;
};

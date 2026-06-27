import type { Question } from '@/data/quiz';

export function score(
  answers: number[],
  quiz: Question[]
): {
  correct: number;
  total: number;
  percent: number;
  perQuestion: { id: number; correct: boolean; explanation: string }[];
} {
  const total = quiz.length;
  let correct = 0;
  const perQuestion = quiz.map((q, i) => {
    const isCorrect = answers[i] === q.answer;
    if (isCorrect) correct++;
    return { id: q.id, correct: isCorrect, explanation: q.explanation };
  });
  const percent = Math.round((correct / total) * 100);
  return { correct, total, percent, perQuestion };
}

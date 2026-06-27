import { describe, it, expect } from 'vitest';
import { score } from '@/lib/quiz-scoring';

const quiz = [
  { id:1, q:'a', options:['x','y'], answer:0, explanation:'e1' },
  { id:2, q:'b', options:['x','y'], answer:1, explanation:'e2' },
];

it('scores correct answers and returns per-question feedback', () => {
  const r = score([0,1], quiz);
  expect(r.correct).toBe(2);
  expect(r.total).toBe(2);
  expect(r.percent).toBe(100);
  expect(r.perQuestion[0]).toEqual({ id:1, correct:true, explanation:'e1' });
});

it('handles wrong + unanswered', () => {
  const r = score([1,-1], quiz);
  expect(r.correct).toBe(0);
  expect(r.percent).toBe(0);
});

it('rounds percent correctly for partial scores', () => {
  const threeQuiz = [
    { id:1, q:'a', options:['x','y'], answer:0, explanation:'e1' },
    { id:2, q:'b', options:['x','y'], answer:1, explanation:'e2' },
    { id:3, q:'c', options:['x','y'], answer:0, explanation:'e3' },
  ];
  // answers [1,1,1]: only Q2 (answer:1) is correct → 1 out of 3
  const r = score([1, 1, 1], threeQuiz);
  expect(r.correct).toBe(1);
  expect(r.total).toBe(3);
  expect(r.percent).toBe(33); // Math.round(1/3*100) = 33
});

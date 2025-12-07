/**
 * Quiz Utilities
 * Helper functions for parsing and processing quiz data
 */

import { QuizData, QuizQuestion, QuizAnswer, QuizResult } from '../services/learningService';

/**
 * Parse JSON quiz questions string into QuizData object
 */
export const parseQuizQuestions = (jsonString: string | null | undefined): QuizData | null => {
  if (!jsonString) return null;
  
  try {
    const parsed = JSON.parse(jsonString);
    
    // Validate structure
    if (!parsed.questions || !Array.isArray(parsed.questions)) {
      console.error('Invalid quiz structure: missing questions array');
      return null;
    }
    
    return {
      version: parsed.version || '1.0',
      totalQuestions: parsed.totalQuestions || parsed.questions.length,
      totalPoints: parsed.totalPoints || parsed.questions.reduce((sum: number, q: any) => sum + (q.points || 1), 0),
      questions: parsed.questions.map((q: any) => ({
        id: q.id || `q${Math.random().toString(36).substr(2, 9)}`,
        question: q.question || '',
        type: q.type || 'single-choice',
        options: q.options || [],
        correctAnswer: q.correctAnswer,
        points: q.points || 1,
        explanation: q.explanation,
      })),
    };
  } catch (error) {
    console.error('Failed to parse quiz questions:', error);
    return null;
  }
};

/**
 * Randomize question order
 */
export const randomizeQuestions = (questions: QuizQuestion[]): QuizQuestion[] => {
  const shuffled = [...questions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Calculate score based on questions and answers
 */
export const calculateScore = (
  questions: QuizQuestion[],
  answers: QuizAnswer[]
): { score: number; correctAnswers: number; totalQuestions: number } => {
  let correctCount = 0;
  let totalPoints = 0;
  let earnedPoints = 0;
  
  questions.forEach((question) => {
    const answer = answers.find(a => a.questionId === question.id);
    totalPoints += question.points;
    
    if (answer) {
      const isCorrect = Array.isArray(question.correctAnswer)
        ? Array.isArray(answer.answer) &&
          question.correctAnswer.length === answer.answer.length &&
          question.correctAnswer.every((ans, idx) => answer.answer.includes(ans))
        : answer.answer === question.correctAnswer;
      
      if (isCorrect) {
        correctCount++;
        earnedPoints += question.points;
      }
    }
  });
  
  const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
  
  return {
    score,
    correctAnswers: correctCount,
    totalQuestions: questions.length,
  };
};

/**
 * Check if score meets passing requirement
 */
export const checkPassingScore = (score: number, passingScore: number | null | undefined): boolean => {
  if (passingScore === null || passingScore === undefined) return true; // No passing score requirement
  return score >= passingScore;
};


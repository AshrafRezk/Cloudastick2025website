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
      questions: parsed.questions.map((q: any) => {
        // Normalize correctAnswer to handle string numbers and option text
        let normalizedCorrectAnswer = q.correctAnswer;
        
        if (Array.isArray(q.correctAnswer)) {
          normalizedCorrectAnswer = q.correctAnswer.map((a: any) => {
            const optionIndex = q.options?.findIndex((opt: any) => 
              opt === a || String(opt).trim().toLowerCase() === String(a).trim().toLowerCase()
            );
            if (optionIndex !== undefined && optionIndex !== -1) {
              return optionIndex;
            }
            if (!isNaN(Number(a)) && String(a).trim() !== '') {
              return Number(a);
            }
            return a;
          });
        } else {
          const optionIndex = q.options?.findIndex((opt: any) => 
            opt === q.correctAnswer || String(opt).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase()
          );
          if (optionIndex !== undefined && optionIndex !== -1) {
            normalizedCorrectAnswer = optionIndex;
          } else if (!isNaN(Number(q.correctAnswer)) && String(q.correctAnswer).trim() !== '') {
            normalizedCorrectAnswer = Number(q.correctAnswer);
          }
        }

        return {
          id: q.id || `q${Math.random().toString(36).substring(2, 11)}`,
          question: q.question || '',
          type: q.type || 'single-choice',
          options: q.options || [],
          correctAnswer: normalizedCorrectAnswer,
          points: typeof q.points === 'string' && !isNaN(Number(q.points)) ? Number(q.points) : (q.points || 1),
          explanation: q.explanation,
        };
      }),
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
 * Handles both percentage (70) and decimal (0.70) formats from Salesforce
 * Salesforce can store as: 75 (percentage) or 0.75 (decimal percentage)
 */
export const checkPassingScore = (score: number, passingScore: number | null | undefined): boolean => {
  if (passingScore === null || passingScore === undefined) return true; // No passing score requirement
  
  // Convert to percentage if it's a decimal (0.70 -> 70)
  // Check if it's between 0 and 1 (exclusive) to determine if it's a decimal
  let passingScorePercent: number;
  if (passingScore > 0 && passingScore <= 1) {
    // It's a decimal (0.75 means 75%)
    passingScorePercent = passingScore * 100;
  } else {
    // It's already a percentage (75 means 75%)
    passingScorePercent = passingScore;
  }
  
  console.log(`Passing score check: score=${score}%, passingScore=${passingScore}, normalized=${passingScorePercent}%, passed=${score >= passingScorePercent}`);
  
  return score >= passingScorePercent;
};

/**
 * Normalize passing score to percentage format for display
 * Handles both percentage (70) and decimal (0.70) formats from Salesforce
 */
export const normalizePassingScore = (passingScore: number | null | undefined): number | null => {
  if (passingScore === null || passingScore === undefined) return null;
  
  // Convert to percentage if it's a decimal (0.70 -> 70)
  // Check if it's between 0 and 1 (exclusive) to determine if it's a decimal
  if (passingScore > 0 && passingScore <= 1) {
    // It's a decimal (0.75 means 75%)
    return passingScore * 100;
  } else {
    // It's already a percentage (75 means 75%)
    return passingScore;
  }
};


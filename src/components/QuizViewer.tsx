import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Clock, AlertCircle, XCircle, ChevronLeft, ChevronRight, Play, RotateCcw, Loader2 } from 'lucide-react';
import { usePortalUser } from '../contexts/PortalUserContext';
import { LearningMaterialInstance } from '../services/learningService';
import { parseQuizQuestions, randomizeQuestions, calculateScore, checkPassingScore, normalizePassingScore } from '../utils/quizUtils';
import { QuizQuestion, QuizAnswer } from '../services/learningService';
import Button from './Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';

interface QuizViewerProps {
  instance: LearningMaterialInstance | null;
  isOpen: boolean;
  onClose: () => void;
}

const QuizViewer = ({ instance, isOpen, onClose }: QuizViewerProps) => {
  const { updateProgress, user, instances } = usePortalUser();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [quizData, setQuizData] = useState<ReturnType<typeof parseQuizQuestions> | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [timeTaken, setTimeTaken] = useState(0);
  const [quizResult, setQuizResult] = useState<{ score: number; correctAnswers: number; totalQuestions: number; passed: boolean } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [currentInstanceId, setCurrentInstanceId] = useState<string | null>(null);
  const [questionPage, setQuestionPage] = useState(0);
  const [localError, setLocalError] = useState<string | null>(null);
  const [currentAttemptNumber, setCurrentAttemptNumber] = useState<number>(1);
  const [isLoadingAttempts, setIsLoadingAttempts] = useState(false);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeTrackingRef = useRef<NodeJS.Timeout | null>(null);

  const material = instance?.material;

  // Initialize quiz data
  useEffect(() => {
    if (material && material.quizQuestions) {
      const parsed = parseQuizQuestions(material.quizQuestions);
      if (parsed) {
        setQuizData(parsed);
        let questionsToUse = parsed.questions;
        
        // Randomize if needed
        if (material.randomizeQuestions) {
          questionsToUse = randomizeQuestions(questionsToUse);
        }
        
        setQuestions(questionsToUse);
      }
    }
  }, [material]);

  // Count existing attempts for this quiz material (only when not started)
  useEffect(() => {
    if (!isStarted && material && material.materialType === 'Quiz' && user) {
      setIsLoadingAttempts(true);
      // Count completed instances for this material
      const quizInstances = instances.filter(
        inst => inst.learningMaterialId === material.id && inst.status === 'Completed'
      );
      
      // Get the highest attempt number or count instances
      let attemptCount = 0;
      if (quizInstances.length > 0) {
        const maxAttempt = Math.max(
          ...quizInstances.map(inst => inst.attemptNumber || 0),
          quizInstances.length // Fallback to count if attempt numbers not set
        );
        attemptCount = maxAttempt;
      }
      
      setCurrentAttemptNumber(attemptCount + 1);
      setIsLoadingAttempts(false);
    } else if (!material || material.materialType !== 'Quiz') {
      setCurrentAttemptNumber(1);
    }
  }, [material, instances, user, isStarted]);

  // Reset state when material/instance changes (only if quiz not started)
  useEffect(() => {
    if (isStarted) return; // Don't reset if quiz is in progress
    
    if (instance?.id) {
      setCurrentInstanceId(instance.id);
    } else {
      setCurrentInstanceId(null);
    }
    setIsCompleted(false);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setQuestionPage(0);
    setLocalError(null);
  }, [material?.id, instance?.id, isStarted]);

  // Timer logic
  useEffect(() => {
    if (!isStarted || isCompleted || !material?.quizTimeLimitMinutes) return;

    const timeLimitSeconds = material.quizTimeLimitMinutes * 60;
    setTimeRemaining(timeLimitSeconds);

    timerIntervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isStarted, isCompleted, material?.quizTimeLimitMinutes]);

  // Time tracking
  useEffect(() => {
    if (!isStarted || isCompleted) return;

    setStartTime(Date.now());
    timeTrackingRef.current = setInterval(() => {
      if (startTime) {
        const elapsed = (Date.now() - startTime) / 1000 / 60; // minutes
        setTimeTaken(elapsed);
      }
    }, 1000);

    return () => {
      if (timeTrackingRef.current) {
        clearInterval(timeTrackingRef.current);
      }
    };
  }, [isStarted, isCompleted, startTime]);

  const handleTimeUp = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    handleSubmitQuiz(true);
  };

  const handleStartQuiz = async () => {
    if (!material || !user) return;

    // Check max attempts
    if (material.maxAttempts && currentAttemptNumber > material.maxAttempts) {
      setLocalError(`Maximum attempts (${material.maxAttempts}) reached for this quiz.`);
      return;
    }

    // Create new instance for this attempt
    try {
      setIsSubmitting(true);
      setLocalError(null);
      
      // Set started state BEFORE the API call to prevent reset from refreshInstances
      setIsStarted(true);
      setStartTime(Date.now());
      
      const result = await updateProgress({
        contactId: user.id,
        learningMaterialId: material.id,
        progress: 0,
        status: 'In Progress',
        startedOn: new Date().toISOString(),
        attemptNumber: currentAttemptNumber, // Pass the attempt number
      });
      
      // Store the instance ID for later updates
      if (result.instanceId) {
        setCurrentInstanceId(result.instanceId);
      }
      
      console.log('Quiz started successfully:', result);
    } catch (error) {
      console.error('Failed to start quiz:', error);
      setLocalError('Failed to start quiz. Please try again.');
      // Reset started state on error
      setIsStarted(false);
      setStartTime(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAnswerChange = (questionId: string, answer: number) => {
    setAnswers((prev) => {
      const existing = prev.findIndex((a) => a.questionId === questionId);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { questionId, answer };
        return updated;
      }
      return [...prev, { questionId, answer }];
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      const newIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(newIndex);
      // Update page if we've moved to a new page
      const newPage = Math.floor(newIndex / 5);
      if (newPage !== questionPage) {
        setQuestionPage(newPage);
      }
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      const newIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(newIndex);
      // Update page if we've moved to a new page
      const newPage = Math.floor(newIndex / 5);
      if (newPage !== questionPage) {
        setQuestionPage(newPage);
      }
    }
  };

  const handleSubmitQuiz = async (timeUp: boolean = false) => {
    if (!material || !user || !quizData) return;

    setIsSubmitting(true);

    // Calculate final time taken
    const finalTimeTaken = startTime ? (Date.now() - startTime) / 1000 / 60 : timeTaken;

    // Calculate score
    const result = calculateScore(questions, answers);
    const passed = checkPassingScore(result.score, material.passingScore);

    setQuizResult({
      ...result,
      passed,
    });

    setIsCompleted(true);

    // Stop timers
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    if (timeTrackingRef.current) {
      clearInterval(timeTrackingRef.current);
    }

    // Update instance with results - use instanceId if available, otherwise use contactId/materialId
    // For quizzes, always create a new instance for each submission to track attempts
    try {
      const updateParams: any = {
        progress: 100,
        status: 'Completed' as const,
        score: result.score,
        completedOn: new Date().toISOString(),
        timeTakenMinutes: finalTimeTaken,
        attemptNumber: currentAttemptNumber, // Include attempt number
      };

      // For quiz submissions, always create a NEW instance for each attempt
      // This ensures each submission is tracked separately with its own score
      if (material.materialType === 'Quiz') {
        // Always create a new instance for quiz submissions
        // Don't pass instanceId - backend will create new instance with attempt number
        updateParams.contactId = user.id;
        updateParams.learningMaterialId = material.id;
        // Explicitly ensure we're creating new, not updating
        // The backend handles quiz attempt counting
      } else if (currentInstanceId) {
        // For non-quiz materials, update existing instance
        updateParams.instanceId = currentInstanceId;
      } else if (instance?.id) {
        // Use instance ID from props if available
        updateParams.instanceId = instance.id;
      } else {
        // Fallback to creating/updating by contact and material
        updateParams.contactId = user.id;
        updateParams.learningMaterialId = material.id;
      }

      const updateResult = await updateProgress(updateParams);
      console.log('Quiz results saved to Salesforce:', updateResult);
      
      // Store the new instance ID
      if (updateResult.instanceId) {
        setCurrentInstanceId(updateResult.instanceId);
      }
      
      // Refresh instances to get updated attempt count
      // The parent component should refresh, but we can trigger it if needed
    } catch (error) {
      console.error('Failed to save quiz results to Salesforce:', error);
      // Show error but don't prevent showing results
      setLocalError('Quiz completed but failed to save results. Please contact support.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentAnswer = (questionId: string): number | undefined => {
    const answer = answers.find((a) => a.questionId === questionId);
    return answer ? (typeof answer.answer === 'number' ? answer.answer : undefined) : undefined;
  };

  const isQuestionAnswered = (questionId: string): boolean => {
    return answers.some((a) => a.questionId === questionId);
  };

  if (!material || !instance) {
    return null;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;
  const answeredCount = answers.length;

  // Pre-quiz start screen
  if (!isStarted && !isCompleted) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl mb-2">{material.title}</DialogTitle>
            {material.description && (
              <p className="text-sm text-muted-foreground mb-4">{material.description}</p>
            )}
          </DialogHeader>

          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-lg">Quiz Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quizData && (
                <>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total Questions:</span>
                    <span className="font-medium">{quizData.totalQuestions}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total Points:</span>
                    <span className="font-medium">{quizData.totalPoints}</span>
                  </div>
                </>
              )}
              {material.quizTimeLimitMinutes && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Time Limit:</span>
                  <span className="font-medium">{material.quizTimeLimitMinutes} minutes</span>
                </div>
              )}
              {material.passingScore !== null && material.passingScore !== undefined && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Passing Score:</span>
                  <span className="font-medium">{normalizePassingScore(material.passingScore)}%</span>
                </div>
              )}
              {material.maxAttempts && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Max Attempts:</span>
                  <span className="font-medium">{material.maxAttempts}</span>
                </div>
              )}
              {material.materialType === 'Quiz' && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Current Attempt:</span>
                  <span className={`font-medium ${
                    material.maxAttempts && currentAttemptNumber > material.maxAttempts
                      ? 'text-destructive'
                      : 'text-brand-primary'
                  }`}>
                    {isLoadingAttempts ? 'Loading...' : `Attempt ${currentAttemptNumber}${material.maxAttempts ? ` of ${material.maxAttempts}` : ''}`}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex items-center justify-end gap-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleStartQuiz}
              disabled={isSubmitting || !quizData || (material.maxAttempts && currentAttemptNumber > material.maxAttempts)}
              className="flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              {isSubmitting ? 'Starting...' : 
               (material.maxAttempts && currentAttemptNumber > material.maxAttempts) 
                 ? 'Max Attempts Reached' 
                 : 'Start Quiz'}
            </Button>
            {localError && (
              <div className="mt-2 text-sm text-destructive text-center">{localError}</div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Quiz results screen
  if (isCompleted && quizResult) {
    const showResults = material.showResults !== false; // Default to true if not specified

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl mb-2">Quiz Results</DialogTitle>
          </DialogHeader>

          <Card className="mb-4">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${
                  quizResult.passed ? 'bg-green-500/20' : 'bg-red-500/20'
                }`}>
                  {quizResult.passed ? (
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                  ) : (
                    <XCircle className="w-10 h-10 text-red-500" />
                  )}
                </div>
                <div>
                  <h3 className={`text-2xl font-bold ${quizResult.passed ? 'text-green-500' : 'text-red-500'}`}>
                    {quizResult.passed ? 'Passed' : 'Failed'}
                  </h3>
                  <p className="text-muted-foreground mt-2">
                    {quizResult.passed
                      ? `Congratulations! You passed with a score of ${quizResult.score}%`
                      : `You scored ${quizResult.score}%. Minimum passing score is ${normalizePassingScore(material.passingScore) || 0}%`}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${quizResult.passed ? 'text-green-500' : 'text-red-500'}`}>
                      {quizResult.score}%
                    </div>
                    <div className="text-sm text-muted-foreground">Score</div>
                    {material.passingScore && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Min: {normalizePassingScore(material.passingScore)}%
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{quizResult.correctAnswers}/{quizResult.totalQuestions}</div>
                    <div className="text-sm text-muted-foreground">Correct</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{Math.round(timeTaken)}</div>
                    <div className="text-sm text-muted-foreground">Minutes</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {showResults && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Question Review</h3>
              {questions.map((question, index) => {
                const answer = answers.find((a) => a.questionId === question.id);
                const isCorrect = Array.isArray(question.correctAnswer)
                  ? Array.isArray(answer?.answer) &&
                    question.correctAnswer.length === answer?.answer.length &&
                    question.correctAnswer.every((ans) => answer?.answer.includes(ans))
                  : answer?.answer === question.correctAnswer;
                const userAnswer = answer ? (typeof answer.answer === 'number' ? answer.answer : -1) : -1;

                return (
                  <Card key={question.id} className={isCorrect ? 'border-green-500/50' : 'border-red-500/50'}>
                    <CardHeader>
                      <div className="flex items-start gap-2">
                        {isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                        )}
                        <CardTitle className="text-base">
                          Question {index + 1}: {question.question}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="space-y-2">
                        {question.options.map((option, optIndex) => {
                          const isSelected = userAnswer === optIndex;
                          const isCorrectAnswer = Array.isArray(question.correctAnswer)
                            ? question.correctAnswer.includes(optIndex)
                            : question.correctAnswer === optIndex;

                          return (
                            <div
                              key={optIndex}
                              className={`p-3 rounded border ${
                                isCorrectAnswer
                                  ? 'bg-green-500/10 border-green-500/50'
                                  : isSelected && !isCorrectAnswer
                                  ? 'bg-red-500/10 border-red-500/50'
                                  : 'bg-muted/30 border-border'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                {isCorrectAnswer && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                                {isSelected && !isCorrectAnswer && <XCircle className="w-4 h-4 text-red-500" />}
                                <span className={isCorrectAnswer ? 'font-medium' : ''}>{option}</span>
                                {isCorrectAnswer && <span className="text-xs text-green-500 ml-auto">Correct</span>}
                                {isSelected && !isCorrectAnswer && (
                                  <span className="text-xs text-red-500 ml-auto">Your Answer</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      {question.explanation && (
                        <div className="mt-3 p-3 bg-muted/50 rounded text-sm">
                          <strong>Explanation:</strong> {question.explanation}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          <div className="flex items-center justify-end gap-4 mt-6">
            <Button variant="primary" onClick={onClose}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Active quiz screen
  if (!currentQuestion) {
    return null;
  }

  const currentAnswer = getCurrentAnswer(currentQuestion.id);

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">{material.title}</DialogTitle>
            <div className="flex items-center gap-4">
              {timeRemaining !== null && (
                <div className={`flex items-center gap-2 px-3 py-1 rounded ${
                  timeRemaining < 60 ? 'bg-red-500/20 text-red-500' : 'bg-muted'
                }`}>
                  <Clock className="w-4 h-4" />
                  <span className="font-mono font-medium">{formatTime(timeRemaining)}</span>
                </div>
              )}
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span className="text-muted-foreground">
                {answeredCount} of {questions.length} answered
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-auto px-6 py-4">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-lg">{currentQuestion.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={currentAnswer !== undefined ? currentAnswer.toString() : undefined}
                onValueChange={(value) => handleAnswerChange(currentQuestion.id, parseInt(value))}
              >
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label
                        htmlFor={`option-${index}`}
                        className="flex-1 cursor-pointer p-3 rounded border hover:bg-muted/50 transition-colors"
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Question Navigation - Progress Bar Style */}
          <div className="mb-4 space-y-3">
            {/* Progress Bar */}
            <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            {/* Question Navigator - Shows 5 at a time, smart navigation to unanswered */}
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  // Find previous set of questions (answered or unanswered)
                  const currentStart = questionPage * 5;
                  const newStart = Math.max(0, currentStart - 5);
                  setQuestionPage(Math.floor(newStart / 5));
                  setCurrentQuestionIndex(newStart);
                }}
                disabled={questionPage === 0}
                className="px-3 py-2 rounded-lg border border-border bg-muted/50 hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="text-sm hidden sm:inline">Prev</span>
              </button>
              
              <div className="flex-1 flex items-center justify-center gap-2 overflow-hidden">
                {Array.from({ length: Math.min(5, questions.length - questionPage * 5) }).map((_, i) => {
                  const questionIndex = questionPage * 5 + i;
                  if (questionIndex >= questions.length) return null;
                  
                  const question = questions[questionIndex];
                  const isAnswered = isQuestionAnswered(question.id);
                  const isCurrent = questionIndex === currentQuestionIndex;
                  
                  return (
                    <button
                      key={questionIndex}
                      onClick={() => {
                        setCurrentQuestionIndex(questionIndex);
                        // Update page if needed
                        const newPage = Math.floor(questionIndex / 5);
                        if (newPage !== questionPage) {
                          setQuestionPage(newPage);
                        }
                      }}
                      className={`flex-shrink-0 w-10 h-10 rounded-lg border-2 flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                        isCurrent
                          ? 'bg-brand-primary text-white border-brand-primary scale-110 shadow-lg shadow-brand-primary/50'
                          : isAnswered
                          ? 'bg-green-500/20 border-green-500/50 text-green-500 hover:scale-105'
                          : 'bg-muted/50 border-border/50 text-muted-foreground hover:bg-muted hover:border-border hover:scale-105'
                      }`}
                      title={`Question ${questionIndex + 1}${isAnswered ? ' (Answered)' : ' (Unanswered)'}`}
                    >
                      {questionIndex + 1}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => {
                  // Find next set of unanswered questions
                  const unansweredIndices = questions
                    .map((q, idx) => ({ q, idx }))
                    .filter(({ q }) => !isQuestionAnswered(q.id))
                    .map(({ idx }) => idx);
                  
                  if (unansweredIndices.length === 0) {
                    // All answered, just go to next page
                    const maxPage = Math.floor((questions.length - 1) / 5);
                    const newPage = Math.min(maxPage, questionPage + 1);
                    setQuestionPage(newPage);
                    const firstIndex = newPage * 5;
                    if (firstIndex < questions.length) {
                      setCurrentQuestionIndex(firstIndex);
                    }
                    return;
                  }
                  
                  // Find the first unanswered question after current position
                  const nextUnanswered = unansweredIndices.find(idx => idx > currentQuestionIndex);
                  
                  if (nextUnanswered !== undefined) {
                    // Jump to next unanswered question
                    setCurrentQuestionIndex(nextUnanswered);
                    // Update page to show the question
                    const newPage = Math.floor(nextUnanswered / 5);
                    setQuestionPage(newPage);
                  } else {
                    // No more unanswered after current, go to next page
                    const maxPage = Math.floor((questions.length - 1) / 5);
                    const newPage = Math.min(maxPage, questionPage + 1);
                    setQuestionPage(newPage);
                    const firstIndex = newPage * 5;
                    if (firstIndex < questions.length) {
                      setCurrentQuestionIndex(firstIndex);
                    }
                  }
                }}
                disabled={questionPage >= Math.floor((questions.length - 1) / 5) && answeredCount === questions.length}
                className="px-3 py-2 rounded-lg border border-border bg-muted/50 hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                title="Jump to next unanswered question"
              >
                <span className="text-sm hidden sm:inline">Next Unanswered</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            
            {/* Page indicator */}
            <div className="text-center text-xs text-muted-foreground">
              Showing {questionPage * 5 + 1}-{Math.min((questionPage + 1) * 5, questions.length)} of {questions.length} questions
              {answeredCount < questions.length && (
                <span className="ml-2 text-green-500">
                  • {questions.length - answeredCount} unanswered
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={handleNextQuestion}
              disabled={currentQuestionIndex === questions.length - 1}
              className="flex items-center gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center gap-4">
            {answeredCount < questions.length && (
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {questions.length - answeredCount} unanswered
              </span>
            )}
            <Button
              variant="primary"
              onClick={() => handleSubmitQuiz(false)}
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Quiz'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuizViewer;


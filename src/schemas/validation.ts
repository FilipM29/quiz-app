import { z } from 'zod';
import { QuestionType } from '../models/question';
import {
  Difficulty,
  QuizStatus,
  QuizType,
  QuizVisibility
} from '../models/quiz';

/**
 * Core model schemas
 */

export const QuestionSchema = z.object({
  id: z.string(),
  type: z.nativeEnum(QuestionType),
  value: z.number(),
  text: z.string(),
  options: z.array(z.string()),
  answer: z.string(),
  acceptableAnswers: z.array(z.string()),
  pictureUrl: z.string().optional()
});

export const RoundSchema = z.object({
  id: z.string(),
  title: z.string(),
  order: z.number(),
  questions: z.array(QuestionSchema).default([])
});

export const QuizSchema = z.object({
  id: z.string(),
  title: z.string(),
  pictureUrl: z.string().nullish(),
  description: z.string(),
  category: z.string(),
  difficulty: z.nativeEnum(Difficulty),
  quizType: z.nativeEnum(QuizType),
  quizStatus: z.nativeEnum(QuizStatus),
  quizVisibility: z.nativeEnum(QuizVisibility),
  createdAt: z.string(),
  updatedAt: z.string(),
  authorId: z.string(),
  numOfRounds: z.number(),
  numOfPlays: z.number(),
  rating: z.number(),
  rounds: z.array(RoundSchema).optional()
});

/**
 * User and auth schemas
 */

export const UserSchema = z.object({
  id: z.string(),
  firebaseId: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string()
});

/**
 * Category schemas
 */

export const CategorySchema = z.object({
  value: z.string(),
  label: z.string(),
  quizCount: z.number(),
  icon: z.string(),
  color: z.string()
});

export const CategoryWithQuizzesSchema = CategorySchema.extend({
  quizzes: z.array(QuizSchema)
});

/**
 * Pagination schemas
 */

export const PaginationMetaSchema = z.object({
  currentPage: z.number(),
  totalPages: z.number(),
  totalItems: z.number(),
  itemsPerPage: z.number(),
  hasNext: z.boolean(),
  hasPrevious: z.boolean()
});

export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(
  itemSchema: T
) =>
  z.object({
    data: z.array(itemSchema),
    pagination: PaginationMetaSchema
  });

/**
 * Quiz section schemas
 */

export const QuizSectionSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  quizzes: z.array(QuizSchema),
  icon: z.unknown(), // React element - required but not strictly validated
  sectionType: z.enum(['forYou', 'popular', 'highestRated', 'recent'])
});

export const QuizSectionsSchema = z.object({
  forYou: QuizSectionSchema,
  popular: QuizSectionSchema,
  highestRated: QuizSectionSchema,
  recent: QuizSectionSchema
});

/**
 * Quiz session schemas
 */

export const PlayerAnswerSchema = z.object({
  id: z.string(),
  questionId: z.string(),
  playerAnswer: z.string(),
  isCorrect: z.boolean(),
  pointsEarned: z.number(),
  answeredAt: z.string()
});

export const RoundProgressSchema = z.object({
  id: z.string(),
  roundId: z.string(),
  currentQuestionIndex: z.number(),
  isCompleted: z.boolean()
});

export const QuizSessionSchema = z.object({
  id: z.string(),
  quizId: z.string(),
  userId: z.string().optional(),
  score: z.number(),
  totalQuestions: z.number(),
  correctAnswers: z.number(),
  startedAt: z.string(),
  completedAt: z.string().optional(),
  playerAnswers: z.array(PlayerAnswerSchema),
  roundProgress: z.array(RoundProgressSchema)
});

/**
 * Validation helper function
 */

export function validateResponse<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message
      }));
      throw new Error(
        `API response validation failed: ${JSON.stringify(issues, null, 2)}`
      );
    }
    throw error;
  }
}

/**
 * Safe validation that returns a result object instead of throwing
 */

export function safeValidateResponse<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  const issues = result.error.issues.map((issue) => ({
    path: issue.path.join('.'),
    message: issue.message
  }));
  return {
    success: false,
    error: `Validation failed: ${JSON.stringify(issues, null, 2)}`
  };
}

import { describe, it, expect } from 'vitest';
import { Difficulty, Quiz, QuizStatus, QuizType, QuizVisibility } from '../models/quiz';
import {
  isIconUrl,
  detectCategory,
  generateCategoryPlaceholder,
  getQuizPlaceholder,
  getQuizCategory,
  categoryConfig
} from './quiz-placeholders';

describe('quiz-placeholders utilities', () => {
  describe('isIconUrl', () => {
    it('should identify valid URLs', () => {
      expect(isIconUrl('https://example.com/icon.png')).toBe(true);
      expect(isIconUrl('http://example.com/icon.svg')).toBe(true);
      expect(isIconUrl('https://cdn.example.com/path/to/icon.jpg')).toBe(true);
    });

    it('should return false for non-URLs', () => {
      expect(isIconUrl('🎯')).toBe(false);
      expect(isIconUrl('📚')).toBe(false);
      expect(isIconUrl('not a url')).toBe(false);
      expect(isIconUrl('')).toBe(false);
    });
  });

  describe('detectCategory', () => {
    const baseQuiz: Quiz = {
      id: '1',
      title: '',
      description: '',
      category: 'GENERAL',
      difficulty: Difficulty.MEDIUM,
      quizType: QuizType.SLIDES,
      quizStatus: QuizStatus.PUBLISHED,
      quizVisibility: QuizVisibility.PUBLIC,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      authorId: 'test-author',
      numOfRounds: 3,
      numOfPlays: 0,
      rating: 0
    };

    it('should detect science category', () => {
      const quiz = {
        ...baseQuiz,
        title: 'Physics Quiz',
        description: 'Test your knowledge of physics'
      };
      expect(detectCategory(quiz)).toBe('science');
    });

    it('should detect history category', () => {
      const quiz = {
        ...baseQuiz,
        title: 'Ancient Civilizations',
        description: 'Quiz about historical events'
      };
      expect(detectCategory(quiz)).toBe('history');
    });

    it('should detect sports category', () => {
      const quiz = {
        ...baseQuiz,
        title: 'Football Champions',
        description: 'Test your sports knowledge'
      };
      expect(detectCategory(quiz)).toBe('sports');
    });

    it('should detect geography category', () => {
      const quiz = {
        ...baseQuiz,
        title: 'World Geography',
        description: 'Learn about countries and cities'
      };
      expect(detectCategory(quiz)).toBe('geography');
    });

    it('should detect literature category', () => {
      const quiz = {
        ...baseQuiz,
        title: 'Classic Literature',
        description: 'Famous books and authors'
      };
      expect(detectCategory(quiz)).toBe('literature');
    });

    it('should detect business category', () => {
      const quiz = {
        ...baseQuiz,
        title: 'Business Economics',
        description: 'Finance and market knowledge'
      };
      expect(detectCategory(quiz)).toBe('business');
    });

    it('should default to general category', () => {
      const quiz = {
        ...baseQuiz,
        title: 'Random Quiz',
        description: 'Various topics'
      };
      expect(detectCategory(quiz)).toBe('general');
    });
  });

  describe('generateCategoryPlaceholder', () => {
    it('should generate SVG data URL', () => {
      const placeholder = generateCategoryPlaceholder();
      expect(placeholder).toMatch(/^data:image\/svg\+xml;charset=utf-8,/);
      expect(placeholder).toContain('%3Csvg');
    });

    it('should use category color when provided', () => {
      const categoryData = {
        value: 'SCIENCE',
        label: 'Science',
        color: '#FF0000',
        icon: '🔬',
        quizCount: 10
      };
      const placeholder = generateCategoryPlaceholder(categoryData);
      expect(placeholder).toContain(encodeURIComponent('#FF0000'));
    });

    it('should fallback to general config when no category data', () => {
      const placeholder = generateCategoryPlaceholder();
      expect(placeholder).toContain(encodeURIComponent(categoryConfig.general.color));
    });
  });

  describe('getQuizPlaceholder', () => {
    const baseQuiz: Quiz = {
      id: '1',
      title: 'Test Quiz',
      description: 'A test quiz',
      category: 'SCIENCE',
      difficulty: Difficulty.MEDIUM,
      quizType: QuizType.SLIDES,
      quizStatus: QuizStatus.PUBLISHED,
      quizVisibility: QuizVisibility.PUBLIC,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      authorId: 'test-author',
      numOfRounds: 3,
      numOfPlays: 0,
      rating: 0
    };

    it('should return quiz pictureUrl when available', () => {
      const quiz = {
        ...baseQuiz,
        pictureUrl: 'https://example.com/image.jpg'
      };
      expect(getQuizPlaceholder(quiz)).toBe('https://example.com/image.jpg');
    });

    it('should generate placeholder when pictureUrl is empty', () => {
      const quiz = {
        ...baseQuiz,
        pictureUrl: ''
      };
      const placeholder = getQuizPlaceholder(quiz);
      expect(placeholder).toMatch(/^data:image\/svg\+xml/);
    });

    it('should generate placeholder when pictureUrl is null', () => {
      const quiz = {
        ...baseQuiz,
        pictureUrl: null
      };
      const placeholder = getQuizPlaceholder(quiz);
      expect(placeholder).toMatch(/^data:image\/svg\+xml/);
    });

    it('should use category data when provided', () => {
      const quiz = {
        ...baseQuiz,
        pictureUrl: null
      };
      const categoryData = {
        value: 'SCIENCE',
        label: 'Science',
        color: '#4F46E5',
        icon: '🔬',
        quizCount: 10
      };
      const placeholder = getQuizPlaceholder(quiz, categoryData);
      expect(placeholder).toContain(encodeURIComponent('#4F46E5'));
    });
  });

  describe('getQuizCategory', () => {
    const baseQuiz: Quiz = {
      id: '1',
      title: '',
      description: '',
      category: 'GENERAL',
      difficulty: Difficulty.MEDIUM,
      quizType: QuizType.SLIDES,
      quizStatus: QuizStatus.PUBLISHED,
      quizVisibility: QuizVisibility.PUBLIC,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      authorId: 'test-author',
      numOfRounds: 3,
      numOfPlays: 0,
      rating: 0
    };

    it('should return correct category config for science quiz', () => {
      const quiz = {
        ...baseQuiz,
        title: 'Physics Quiz'
      };
      const category = getQuizCategory(quiz);
      expect(category).toEqual(categoryConfig.science);
    });

    it('should return general config for unmatched quiz', () => {
      const quiz = {
        ...baseQuiz,
        title: 'Random Quiz',
        description: 'Misc topics'
      };
      const category = getQuizCategory(quiz);
      expect(category).toEqual(categoryConfig.general);
    });

    it('should include required properties', () => {
      const quiz = {
        ...baseQuiz,
        title: 'History Quiz'
      };
      const category = getQuizCategory(quiz);
      expect(category).toHaveProperty('name');
      expect(category).toHaveProperty('color');
      expect(category).toHaveProperty('emoji');
      expect(category).toHaveProperty('bgColor');
    });
  });
});

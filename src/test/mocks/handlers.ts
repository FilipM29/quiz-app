import { http, HttpResponse } from 'msw';
import { Difficulty, Quiz, QuizStatus, QuizType, QuizVisibility } from '../../models/quiz';

// Mock quiz data
export const mockQuiz: Quiz = {
  id: '1',
  title: 'Test Quiz',
  description: 'A test quiz for testing',
  category: 'SCIENCE',
  difficulty: Difficulty.MEDIUM,
  quizType: QuizType.SLIDES,
  quizStatus: QuizStatus.PUBLISHED,
  quizVisibility: QuizVisibility.PUBLIC,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  authorId: 'test-author-id',
  numOfRounds: 3,
  numOfPlays: 100,
  rating: 4.5
};

export const mockQuizzes: Quiz[] = [
  mockQuiz,
  {
    ...mockQuiz,
    id: '2',
    title: 'Another Test Quiz',
    category: 'HISTORY',
    difficulty: Difficulty.EASY,
    rating: 4.0
  },
  {
    ...mockQuiz,
    id: '3',
    title: 'Third Test Quiz',
    category: 'SPORTS',
    difficulty: Difficulty.HARD,
    rating: 4.8
  }
];

export const mockCategories = [
  { value: 'SCIENCE', label: 'Science', icon: '🔬', color: '#4caf50', quizCount: 10 },
  { value: 'HISTORY', label: 'History', icon: '📚', color: '#ff9800', quizCount: 8 },
  { value: 'SPORTS', label: 'Sports', icon: '⚽', color: '#2196f3', quizCount: 12 },
  { value: 'GEOGRAPHY', label: 'Geography', icon: '🌍', color: '#009688', quizCount: 6 }
];

// Mock API handlers
export const handlers = [
  // Search/discover endpoint
  http.get('*/api/discover/search', ({ request }) => {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '12');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const category = url.searchParams.get('category');

    let filteredQuizzes = mockQuizzes;
    if (category) {
      filteredQuizzes = mockQuizzes.filter(q => q.category === category);
    }

    const paginatedQuizzes = filteredQuizzes.slice(offset, offset + limit);

    return HttpResponse.json({
      quizzes: paginatedQuizzes,
      pagination: {
        total: filteredQuizzes.length,
        limit,
        offset,
        hasMore: offset + limit < filteredQuizzes.length
      }
    });
  }),

  // Categories endpoint
  http.get('*/api/categories', () => {
    return HttpResponse.json(mockCategories);
  }),

  // Single quiz endpoint
  http.get('*/api/quiz/:id', ({ params }) => {
    const quiz = mockQuizzes.find(q => q.id === params.id);
    if (quiz) {
      return HttpResponse.json(quiz);
    }
    return new HttpResponse(null, { status: 404 });
  }),

  // Quiz creation endpoints
  http.post('*/api/quiz', async ({ request }) => {
    const body = await request.json() as any;
    const newQuiz = {
      id: 'quiz-' + Date.now(),
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      authorId: 'test-user-id',
      numOfPlays: 0,
      rating: 0
    };
    return HttpResponse.json(newQuiz, { status: 201 });
  }),

  // Round creation endpoint
  http.post('*/api/rounds', async ({ request }) => {
    const body = await request.json() as any;
    const newRound = {
      id: 'round-' + Date.now(),
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return HttpResponse.json(newRound, { status: 201 });
  }),

  // Question creation endpoint
  http.post('*/api/questions', async ({ request }) => {
    const body = await request.json() as any;
    const newQuestion = {
      id: 'question-' + Date.now(),
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return HttpResponse.json(newQuestion, { status: 201 });
  }),

  // Quiz update (publish) endpoint
  http.put('*/api/quiz/:id', async ({ request, params }) => {
    const body = await request.json() as any;
    const updatedQuiz = {
      id: params.id as string,
      ...body,
      updatedAt: new Date().toISOString()
    };
    return HttpResponse.json(updatedQuiz);
  }),

  // Get rounds by quiz ID
  http.get('*/api/quiz/:quizId/rounds', () => {
    return HttpResponse.json([]);
  }),

  // Get questions by round ID
  http.get('*/api/rounds/:roundId/questions', () => {
    return HttpResponse.json([]);
  })
];

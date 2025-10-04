export type BackendConfig = {
  apiHost: string;
  apiUrl: {
    user: {
      findAll: string;
      findById: (id: string) => string;
      findByFirebaseId: (firebaseId: string) => string;
      create: string;
      update: (id: string) => string;
      delete: (id: string) => string;
    };
    quiz: {
      findAll: string;
      findById: (id: string) => string;
      create: string;
      update: (id: string) => string;
      delete: (id: string) => string;
      sections: string;
      search: string;
      paginated: string;
      getRounds: (id: string) => string;
      myQuizzes: (userId: string) => string;
    };
    category: {
      findAll: string;
      findById: (id: string) => string;
      getQuizzes: (id: string) => string;
    };
    question: {
      findAll: string;
      findById: (id: string) => string;
      create: string;
      update: (id: string) => string;
      delete: (id: string) => string;
    };
    rounds: {
      findById: (id: string) => string;
      create: string;
      update: (id: string) => string;
      delete: (id: string) => string;
      getQuestions: (id: string) => string;
    };
    discover: {
      featured: string;
      popular: string;
      recent: string;
      highestRated: string;
      recommended: string;
      search: string;
      category: (category: string) => string;
      author: (authorId: string) => string;
      similar: (quizId: string) => string;
      stats: string;
    };
    play: {
      start: string;
      join: string;
      startGame: (sessionId: string) => string;
      answer: string;
      next: (sessionId: string) => string;
      finish: (sessionId: string) => string;
    };
    rating: {
      submit: (quizId: string) => string;
      getMyRating: (quizId: string) => string;
    };
  };
};
export const backendConfig: BackendConfig = {
  apiHost: import.meta.env.VITE_BACKEND_API_HOST || 'http://localhost:8080/api',
  apiUrl: {
    user: {
      findAll: '/users',
      findById: (id) => `/users/${id}`,
      findByFirebaseId: (firebaseId) => `/users/firebase/${firebaseId}`,
      create: '/users',
      update: (id) => `/users/${id}`,
      delete: (id) => `/users/${id}`
    },
    quiz: {
      findAll: '/quiz',
      findById: (id) => `/quiz/${id}`,
      create: '/quiz',
      update: (id) => `/quiz/${id}`,
      delete: (id) => `/quiz/${id}`,
      sections: '/quiz/sections',
      search: '/quiz/search',
      paginated: '/quiz/paginated',
      getRounds: (id) => `/quiz/${id}/rounds`,
      myQuizzes: (userId) => `/quiz/my/${userId}`
    },
    category: {
      findAll: '/categories',
      findById: (id) => `/categories/${id}`,
      getQuizzes: (id) => `/categories/${id}/quiz`
    },
    question: {
      findAll: '/questions',
      findById: (id) => `/questions/${id}`,
      create: '/questions',
      update: (id) => `/questions/${id}`,
      delete: (id) => `/questions/${id}`
    },
    rounds: {
      findById: (id) => `/rounds/${id}`,
      create: '/rounds',
      update: (id) => `/rounds/${id}`,
      delete: (id) => `/rounds/${id}`,
      getQuestions: (id) => `/rounds/${id}/questions`
    },
    discover: {
      featured: '/discover/featured',
      popular: '/discover/popular',
      recent: '/discover/recent',
      highestRated: '/discover/highest-rated',
      recommended: '/discover/recommended',
      search: '/discover/search',
      category: (category) => `/discover/category/${category}`,
      author: (authorId) => `/discover/author/${authorId}`,
      similar: (quizId) => `/discover/similar/${quizId}`,
      stats: '/discover/stats'
    },
    play: {
      start: '/play/start',
      join: '/play/join',
      startGame: (sessionId) => `/play/${sessionId}/start-game`,
      answer: '/play/answer',
      next: (sessionId) => `/play/${sessionId}/next`,
      finish: (sessionId) => `/play/${sessionId}/finish`
    },
    rating: {
      submit: (quizId) => `/quiz/rating/${quizId}`,
      getMyRating: (quizId) => `/quiz/rating/${quizId}/me`
    }
  }
};

export type BackendConfig = {
  apiHost: string;
  apiUrl: {
    user: {
      findAll: string;
      findById: (id: string) => string;
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
    };
    question: {
      findAll: string;
      findById: (id: string) => string;
      create: string;
      update: (id: string) => string;
      delete: (id: string) => string;
    };
  };
};
export const backendConfig: BackendConfig = {
  apiHost: "http://localhost:8080/api",
  apiUrl: {
    user: {
      findAll: "/users",
      findById: (id) => `/users/${id}`,
      create: "/users",
      update: (id) => `/users/${id}`,
      delete: (id) => `/users/${id}`,
    },
    quiz: {
      findAll: "/quiz",
      findById: (id) => `/quiz/${id}`,
      create: "/quiz",
      update: (id) => `/quiz/${id}`,
      delete: (id) => `/quiz/${id}`,
    },
    question: {
      findAll: "/questions",
      findById: (id) => `/questions/${id}`,
      create: "/questions",
      update: (id) => `/questions/${id}`,
      delete: (id) => `/questions/${id}`,
    },
  },
};

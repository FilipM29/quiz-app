export interface User {
  id: string;
  firebaseId: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface CreateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  firebaseId: string;
}

export interface UpdateUserRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

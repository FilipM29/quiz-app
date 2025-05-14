import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User,
  type UserCredential
} from 'firebase/auth';
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState
} from 'react';
import { auth } from '../firebase.config.ts';

type Props = {
  children: ReactNode;
};

export type AuthContext = {
  user: User | null;
  signupWithEmailAndPassword: (
    email: string,
    password: string
  ) => Promise<UserCredential>;
  loginWithEmailAndPassword: (
    email: string,
    password: string
  ) => Promise<UserCredential>;
  loginWithGoogle: () => Promise<UserCredential>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
};

const initialValue: AuthContext = {
  user: null,
  signupWithEmailAndPassword: async () => {
    return {} as UserCredential;
  },
  loginWithEmailAndPassword: async () => {
    return {} as UserCredential;
  },
  loginWithGoogle: async () => {
    return {} as UserCredential;
  },
  logout: async () => {},
  resetPassword: async () => {}
};

const AuthContext = createContext<AuthContext>(initialValue);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null);

  function signupWithEmailAndPassword(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function loginWithEmailAndPassword(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  }

  function logout() {
    return signOut(auth);
  }

  function resetPassword(email: string) {
    return sendPasswordResetEmail(auth, email);
  }

  const value = {
    user,
    signupWithEmailAndPassword,
    loginWithEmailAndPassword,
    loginWithGoogle,
    logout,
    resetPassword
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

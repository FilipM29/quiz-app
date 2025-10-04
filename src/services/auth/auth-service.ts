import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User as FirebaseUser
} from 'firebase/auth';
import type {
  LoginCredentials,
  RegisterCredentials,
  User
} from '../../types/auth';
import { logger } from '../../utils/logger';
import { auth } from '../firebase/config';

export class AuthService {
  async login(credentials: LoginCredentials): Promise<FirebaseUser> {
    logger.debug('AuthService: Attempting login');
    const result = await signInWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    );
    logger.debug('Login successful:', auth.currentUser?.uid);
    return result.user;
  }

  async register(credentials: RegisterCredentials): Promise<FirebaseUser> {
    const result = await createUserWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    );

    // Update Firebase profile with display name if provided
    if (credentials.firstName || credentials.lastName) {
      const displayName =
        `${credentials.firstName || ''} ${credentials.lastName || ''}`.trim();
      await updateProfile(result.user, { displayName });
    }

    return result.user;
  }

  async registerComplete(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<{ firebaseUser: FirebaseUser; dbUser: User }> {
    // Step 1: Create Firebase user
    const firebaseUser = await this.register({
      email,
      password,
      firstName,
      lastName
    });

    // Step 2: Import userApiService dynamically to avoid circular dependencies
    const { userApiService } = await import('../api/user-api');

    // Create user in database
    const dbUser = await userApiService.createUser({
      email,
      firstName,
      lastName,
      firebaseId: firebaseUser.uid
    });

    return { firebaseUser, dbUser };
  }

  async logout(): Promise<void> {
    await signOut(auth);
  }

  getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  }

  async getToken(): Promise<string | null> {
    const user = this.getCurrentUser();
    if (!user) return null;
    return await user.getIdToken();
  }
}

export const authService = new AuthService();

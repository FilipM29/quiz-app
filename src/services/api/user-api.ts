import { z } from 'zod';
import { backendConfig } from '../../config/backend';
import { UserSchema } from '../../schemas/validation';
import type {
  CreateUserRequest,
  UpdateUserRequest,
  User
} from '../../types/auth';
import { BaseApiService } from './base-api';

export class UserApiService extends BaseApiService {
  async createUser(userData: CreateUserRequest): Promise<User> {
    return this.post<User>(
      backendConfig.apiUrl.user.create,
      userData,
      UserSchema
    );
  }

  async getUserById(id: string): Promise<User> {
    return this.get<User>(backendConfig.apiUrl.user.findById(id), UserSchema);
  }

  /**
   * Get user by Firebase ID - PREFERRED method for auth
   * @param firebaseId - The Firebase UID
   * @returns User object or throws 404 if not found
   * @note Backend endpoint must be implemented: GET /users/firebase/:firebaseId
   */
  async getUserByFirebaseId(firebaseId: string): Promise<User> {
    return this.get<User>(
      backendConfig.apiUrl.user.findByFirebaseId(firebaseId),
      UserSchema
    );
  }

  /**
   * @deprecated DO NOT USE - Security vulnerability: fetches ALL users
   * Use getUserByFirebaseId() instead
   * This method should be removed once backend implements /users/firebase/:id
   */
  async getAllUsers(): Promise<User[]> {
    return this.get<User[]>(
      backendConfig.apiUrl.user.findAll,
      z.array(UserSchema)
    );
  }

  async updateUser(id: string, userData: UpdateUserRequest): Promise<User> {
    return this.put<User>(
      backendConfig.apiUrl.user.update(id),
      userData,
      UserSchema
    );
  }

  async deleteUser(id: string): Promise<{ message: string }> {
    return this.delete<{ message: string }>(
      backendConfig.apiUrl.user.delete(id),
      z.object({ message: z.string() })
    );
  }
}

export const userApiService = new UserApiService();

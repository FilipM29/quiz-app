import { z } from 'zod';
import { backendConfig } from '../../config/backend';
import { validateResponse } from '../../schemas/validation';
import { fetcher, getApiHeaders } from '../../utils/common';

export class BaseApiService {
  protected baseUrl: string;
  protected authToken: string | null = null;

  constructor() {
    this.baseUrl = backendConfig.apiHost;
  }

  public setAuthToken(token: string | null) {
    this.authToken = token;
  }

  protected getAuthHeaders(method?: string): HeadersInit {
    return getApiHeaders(this.authToken || undefined, method);
  }

  protected async request<T>(
    endpoint: string,
    options: RequestInit = {},
    schema?: z.ZodSchema<T>
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const authHeaders = this.getAuthHeaders(options.method as string);

    const mergedOptions = {
      ...options,
      headers: {
        ...authHeaders,
        ...options.headers
      }
    };

    // Let errors bubble up to be handled by components/hooks
    // Use useAuthRedirect() hook in components to handle 401 errors
    const response = await fetcher<T>(url, mergedOptions);

    // Validate response if schema is provided
    if (schema) {
      return validateResponse(schema, response);
    }

    return response;
  }

  protected async get<T>(
    endpoint: string,
    schema?: z.ZodSchema<T>
  ): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: 'GET'
      },
      schema
    );
  }

  protected async post<T>(
    endpoint: string,
    data?: unknown,
    schema?: z.ZodSchema<T>
  ): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined
      },
      schema
    );
  }

  protected async put<T>(
    endpoint: string,
    data?: unknown,
    schema?: z.ZodSchema<T>
  ): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined
      },
      schema
    );
  }

  protected async delete<T>(
    endpoint: string,
    schema?: z.ZodSchema<T>
  ): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: 'DELETE'
      },
      schema
    );
  }
}

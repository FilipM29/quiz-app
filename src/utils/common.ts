export class FetchError extends Error {
  data: unknown;
  status: number;

  constructor(status: number, data: unknown) {
    super('Fetch Error ' + status);
    this.data = data;
    this.status = status;
  }
}

export async function fetcher<T>(url: string, init: RequestInit = {}) {
  const response = await fetch(url, init);
  const status = response.status;

  // Handle responses that may not have a body
  let data: unknown;
  const contentType = response.headers.get('content-type');

  try {
    // Only parse JSON if content-type indicates JSON or if there's content
    if (contentType?.includes('application/json')) {
      const text = await response.text();
      // Handle empty responses
      data = text ? JSON.parse(text) : null;
    } else {
      // For non-JSON responses, try to read as text
      data = await response.text();
    }
  } catch {
    // If JSON parsing fails, treat as empty response
    data = null;
  }

  if (![200, 201, 204].includes(status)) {
    throw new FetchError(status, data);
  }

  return data as T;
}

export function withHeaders(headers: HeadersInit) {
  return async (url: string, init: RequestInit = {}) => {
    return fetcher(url, {
      ...init,
      headers: { ...init.headers, ...headers }
    });
  };
}

export function withRequestBody<T>(
  body: T,
  method: 'POST' | 'PUT' | 'DELETE' = 'POST'
) {
  return async (url: string, init: RequestInit = {}) => {
    return fetcher(url, {
      ...init,
      method,
      body: JSON.stringify(body)
    });
  };
}

export function getApiHeaders(token: string | undefined, method?: string) {
  const headers: Record<string, string> = {};

  // Only set Content-Type for methods that typically have a body
  if (!method || ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

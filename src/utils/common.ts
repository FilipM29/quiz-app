export class FetchError extends Error {
  data: any;
  status: number;

  constructor(status: number, data: any) {
    super("Fetch Error " + status);
    this.data = data;
    this.status = status;
  }
}

export async function fetcher<T = any>(url: string, init: RequestInit = {}) {
  const response = await fetch(url, init);

  const data = await response.json();
  const status = response.status;

  if (![200, 201].includes(status)) {
    throw new FetchError(status, data);
  }

  return data as T;
}

export function withHeaders(headers: HeadersInit) {
  return async (url: string, init: RequestInit = {}) => {
    return fetcher(url, { ...init, headers: { ...init.headers, ...headers } });
  };
}

export function withRequestBody<T = any>(
  body: T,
  method: "POST" | "PUT" | "DELETE" = "POST"
) {
  return async (url: string, init: RequestInit = {}) => {
    return fetcher(url, { ...init, method, body: JSON.stringify(body) });
  };
}

export function getApiHeaders(
  token: string | undefined,
  type: string = "application/json"
) {
  return {
    "Content-Type": type,
    "x-authorization-firebase": token ?? "",
  };
}

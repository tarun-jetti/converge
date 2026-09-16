import { getAuthToken, clearAuth } from './auth-storage';
import { ApiError } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export class ApiClientError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(message: string, statusCode: number, code: string = 'API_ERROR', details?: unknown) {
    super(message);
    this.name = 'ApiClientError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

interface FetchOptions extends RequestInit {
  token?: string | null;
}

export async function apiFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { token, headers: customHeaders, ...restOptions } = options;
  const authToken = token !== undefined ? token : getAuthToken();

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    ...(customHeaders as Record<string, string>),
  };

  let response: Response;
  try {
    response = await fetch(url, {
      headers,
      ...restOptions,
    });
  } catch (err: unknown) {
    const isNetworkError =
      err instanceof TypeError ||
      (err instanceof Error &&
        (err.message.includes('fetch') ||
          err.message.includes('NetworkError') ||
          err.message.includes('network')));

    if (isNetworkError) {
      throw new ApiClientError(
        `Unable to connect to Converge backend API at ${API_BASE_URL}. Ensure the backend server is running on port 4000.`,
        0,
        'NETWORK_ERROR',
        err
      );
    }
    throw err;
  }

  if (!response.ok) {
    let errorData: { error?: ApiError } = {};
    try {
      errorData = await response.json();
    } catch {
      // Non-JSON response
    }

    const code = errorData.error?.code || 'UNKNOWN_ERROR';
    const message = errorData.error?.message || `Request failed with status ${response.status}`;
    const details = errorData.error?.details;

    if (response.status === 401) {
      clearAuth();
    }

    throw new ApiClientError(message, response.status, code, details);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}

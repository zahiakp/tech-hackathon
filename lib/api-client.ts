export class ApiClientError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public fieldErrors?: Record<string, string[]>,
    public requestId?: string,
  ) {
    super(message);
  }
}

export interface ApiSuccess<T> {
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
}

type ApiFailureBody = {
  error?: {
    code?: string;
    message?: string;
    fieldErrors?: Record<string, string[]>;
    requestId?: string;
  };
};

function isFailureBody(value: unknown): value is ApiFailureBody {
  return typeof value === 'object' && value !== null;
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<ApiSuccess<T>> {
  const url = path.startsWith('/api/')
    ? path
    : `/api/v1${path.startsWith('/') ? path : `/${path}`}`;

  const response = await fetch(url, {
    ...init,
    credentials: 'include',
    headers: {
      ...(init.body ? { 'content-type': 'application/json' } : {}),
      ...init.headers,
    },
  });

  const contentType = response.headers.get('content-type');
  const body: unknown = contentType?.includes('application/json')
    ? await response.json()
    : {};

  if (!response.ok) {
    const failure = isFailureBody(body) ? body : {};
    throw new ApiClientError(
      response.status,
      failure.error?.code ?? 'UNKNOWN_ERROR',
      failure.error?.message ?? 'The API request failed.',
      failure.error?.fieldErrors,
      failure.error?.requestId ??
        response.headers.get('x-request-id') ??
        undefined,
    );
  }

  return body as ApiSuccess<T>;
}
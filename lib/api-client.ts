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

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {}
): Promise<ApiSuccess<T>> {
  const url = path.startsWith('/api/') ? path : `/api/v1${path.startsWith('/') ? path : `/${path}`}`;
  
  const response = await fetch(url, {
    ...init,
    credentials: 'include',
    headers: {
      ...(init.body ? { 'content-type': 'application/json' } : {}),
      ...init.headers,
    },
  });

  const contentType = response.headers.get('content-type');
  let body: any = {};
  if (contentType && contentType.includes('application/json')) {
    body = await response.json();
  }

  if (!response.ok) {
    throw new ApiClientError(
      response.status,
      body.error?.code ?? 'UNKNOWN_ERROR',
      body.error?.message ?? 'The API request failed.',
      body.error?.fieldErrors,
      body.error?.requestId ?? response.headers.get('x-request-id') ?? undefined
    );
  }

  return body;
}

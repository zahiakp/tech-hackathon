import { NextResponse } from "next/server";

export type ApiErrorBody = {
  error: {
    code: string;
    message: string;
    fieldErrors?: Record<string, string[]>;
    requestId?: string;
  };
};

export class AppError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly fieldErrors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ data }, init);
}

export function created<T>(data: T) {
  return NextResponse.json({ data }, { status: 201 });
}

export function paginated<T>(
  data: T,
  meta: { page: number; limit: number; total: number },
) {
  return NextResponse.json({ data, meta });
}

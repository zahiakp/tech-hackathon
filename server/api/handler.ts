import { randomUUID } from "node:crypto";
import { Prisma } from "@/app/generated/prisma/client";
import { ZodError } from "zod";
import { AppError } from "@/server/api/response";

export async function apiHandler(
  request: Request,
  handler: (requestId: string) => Promise<Response>,
): Promise<Response> {
  const requestId = request.headers.get("x-request-id") ?? randomUUID();

  try {
    const response = await handler(requestId);
    response.headers.set("x-request-id", requestId);
    return response;
  } catch (error) {
    if (error instanceof AppError) {
      return Response.json(
        {
          error: {
            code: error.code,
            message: error.message,
            fieldErrors: error.fieldErrors,
            requestId,
          },
        },
        { status: error.status, headers: { "x-request-id": requestId } },
      );
    }

    if (error instanceof ZodError) {
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of error.issues) {
        const key = issue.path.join(".") || "body";
        fieldErrors[key] = [...(fieldErrors[key] ?? []), issue.message];
      }
      return Response.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "The request data is invalid.",
            fieldErrors,
            requestId,
          },
        },
        { status: 400, headers: { "x-request-id": requestId } },
      );
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return Response.json(
        {
          error: {
            code: "CONFLICT",
            message: "A record with these values already exists.",
            requestId,
          },
        },
        { status: 409, headers: { "x-request-id": requestId } },
      );
    }

    console.error(`[api:${requestId}]`, error);
    return Response.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "An unexpected error occurred.",
          requestId,
        },
      },
      { status: 500, headers: { "x-request-id": requestId } },
    );
  }
}

export function parsePagination(url: string) {
  const searchParams = new URL(url).searchParams;
  const page = Math.max(1, Number(searchParams.get("page") ?? 1) || 1);
  const limit = Math.min(
    100,
    Math.max(1, Number(searchParams.get("limit") ?? 20) || 20),
  );
  return { page, limit, skip: (page - 1) * limit };
}

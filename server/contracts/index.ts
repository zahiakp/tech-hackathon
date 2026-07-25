export type ApiSuccess<T> = { data: T; meta?: { page: number; limit: number; total: number } };
export type ApiFailure = { error: { code: string; message: string; fieldErrors?: Record<string, string[]>; requestId?: string } };

export type RealtimeEventMap = {
  "sos.created": { id: string; status: "OPEN"; latitude: number; longitude: number; capturedAt: string };
  "sos.updated": { id: string; status: string; updatedAt?: string };
  "complaint.updated": { id: string; status: string; updatedAt?: string };
  "appointment.updated": { id: string; status: string; startAt?: string };
  "chat.message.created": { id: string; conversationId: string; body: string; createdAt: string };
  "notification.created": { id: string; type: string; title: string; body: string; createdAt: string };
};

export * from "@/server/modules/auth/schemas";
export * from "@/server/modules/sos/schemas";
export * from "@/server/modules/complaints/schemas";
export * from "@/server/modules/support/schemas";
export * from "@/server/modules/operational/schemas";

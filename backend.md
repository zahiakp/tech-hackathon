# Backend API - Frontend Integration Guide

This is the frontend contract for the Campus Safety and Support backend. It covers authentication, API payloads, permissions, uploads, real-time events, error handling, and complete user flows.

Machine-readable documentation:

```text
GET /api/v1/openapi.json
```

Source contracts and fixtures:

```text
server/contracts/index.ts
mocks/backend-fixtures.ts
```

## 1. Base URL and authentication

Local URL:

```text
http://localhost:3000
```

Backend routes are under `/api/v1`. Auth.js remains under `/api/auth/*`, while UploadThing uses `/api/uploadthing`.

Use relative URLs from this Next.js frontend. Auth.js stores the session in an HTTP-only cookie; never store its JWT in local storage.

```ts
const response = await fetch("/api/v1/users/me", {
  credentials: "include",
});
```

## 2. API envelopes

Normal success:

```ts
type ApiSuccess<T> = {
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
};
```

Failure:

```ts
type ApiFailure = {
  error: {
    code: string;
    message: string;
    fieldErrors?: Record<string, string[]>;
    requestId?: string;
  };
};
```

Example validation failure:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request data is invalid.",
    "fieldErrors": {
      "title": ["Title must contain at least 5 characters."]
    },
    "requestId": "392e9290-57fe-4e39-8780-915993be55a2"
  }
}
```

Keep `requestId` when reporting failures. It is also returned in the `x-request-id` header.

Exceptions:

- `POST /api/register` returns `{ "ok": true }` or `{ "error": "..." }`.
- `/api/v1/realtime/auth` returns the raw Pusher authorization response.
- `/api/uploadthing` uses UploadThing's protocol.

Pagination uses `?page=1&limit=20`. Page defaults to 1, limit defaults to 20, and limit is capped at 100. Dates are ISO 8601 strings.

Recommended client:

```ts
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

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<ApiSuccess<T>> {
  const response = await fetch(`/api/v1${path}`, {
    ...init,
    credentials: "include",
    headers: {
      ...(init.body ? { "content-type": "application/json" } : {}),
      ...init.headers,
    },
  });
  const body = await response.json();

  if (!response.ok) {
    throw new ApiClientError(
      response.status,
      body.error?.code ?? "UNKNOWN_ERROR",
      body.error?.message ?? "The request failed.",
      body.error?.fieldErrors,
      body.error?.requestId ?? response.headers.get("x-request-id") ?? undefined,
    );
  }
  return body;
}
```

## 3. Authentication

### Register

```http
POST /api/register
```

```json
{
  "name": "Amina Rahman",
  "email": "amina@example.com",
  "password": "strong-password"
}
```

Name requires 2 characters, password requires 8 characters, and new accounts receive the `STUDENT` role.

### Login and logout

```tsx
"use client";

import { signIn, signOut } from "next-auth/react";

const result = await signIn("credentials", {
  email,
  password,
  redirect: false,
});

if (result?.error) {
  // Show "Invalid email or password"
}

await signOut({ redirectTo: "/login" });
```

The Auth.js session exposes:

```ts
session.user.id: string;
session.user.roles: RoleCode[];
session.sessionVersion: number;
```

Use roles to control presentation only. The API always revalidates sensitive permissions from PostgreSQL.

### OTP and password reset

Request:

```http
POST /api/v1/auth/otp/request
```

```json
{
  "email": "amina@example.com",
  "purpose": "PASSWORD_RESET"
}
```

`purpose` is `EMAIL_VERIFICATION` or `PASSWORD_RESET`. The response is always `{ "data": { "sent": true } }`, even for an unknown email.

Verify:

```http
POST /api/v1/auth/otp/verify
```

```json
{
  "email": "amina@example.com",
  "purpose": "PASSWORD_RESET",
  "code": "123456"
}
```

Password-reset verification returns:

```json
{
  "data": {
    "verified": true,
    "resetToken": "one-time-token"
  }
}
```

Reset:

```http
POST /api/v1/auth/password/reset
```

```json
{
  "token": "one-time-token",
  "password": "new-strong-password"
}
```

OTP codes expire after 10 minutes and permit five failed attempts. Reset tokens expire after 15 minutes and are single-use. Resetting increments `sessionVersion`, invalidating previous sessions.

## 4. Roles

```ts
type RoleCode =
  | "STUDENT"
  | "FACULTY"
  | "COUNSELLOR"
  | "COORDINATOR"
  | "SECURITY"
  | "LIBRARY_STAFF"
  | "ADMIN";
```

One user can hold multiple roles. Always use `roles.includes(role)`.

| UI area | Roles |
|---|---|
| Profile and notifications | All authenticated users |
| Create/view own SOS | Student |
| Security SOS dashboard | Security, Admin |
| Create named complaint | Student, Faculty, Admin |
| Manage complaints | Coordinator, Admin |
| Counsellor profile/appointments | Counsellor, Admin |
| Mentor profile | Student, Faculty, Admin |
| Confidential chat | Conversation participants |
| Users, roles, audit | Admin |

## 5. Current profile

```http
GET /api/v1/users/me
```

Returns identity, account status, roles, profile, and timestamps.

Update:

```http
PATCH /api/v1/users/me
```

```json
{
  "name": "Amina Rahman",
  "phone": "+91 9000000000",
  "studentId": "ST-1001",
  "employeeId": null,
  "department": "Computer Science",
  "course": "BSc",
  "semester": 4,
  "campus": "Main Campus",
  "bloodGroup": "O+",
  "bio": "Student volunteer",
  "emergencyContactName": "Parent",
  "emergencyContactPhone": "+91 9111111111"
}
```

All fields are optional. Omit a field to preserve it; send `null` to clear a nullable field.

## 6. SOS

Status:

```ts
type SosStatus =
  | "OPEN"
  | "ACKNOWLEDGED"
  | "DISPATCHED"
  | "RESOLVED"
  | "CANCELLED_FALSE_ALARM";
```

Flow:

```text
OPEN -> ACKNOWLEDGED -> DISPATCHED -> RESOLVED
  |
  +-> CANCELLED_FALSE_ALARM
```

Create:

```http
POST /api/v1/sos
```

```json
{
  "latitude": 11.2588,
  "longitude": 75.7804,
  "accuracy": 12.5,
  "capturedAt": "2026-07-25T10:00:00.000Z",
  "note": "I need help near the north gate."
}
```

Use `navigator.geolocation.getCurrentPosition()`. Do not invent coordinates if permission fails. Disable the SOS button while the request is pending to reduce accidental duplicates.

List:

```http
GET /api/v1/sos?page=1&limit=20&status=OPEN
```

Students see their own history. Security/Admin see all permitted incidents.

Detail:

```http
GET /api/v1/sos/:id
```

Status update, Security/Admin:

```http
PATCH /api/v1/sos/:id/status
```

```json
{
  "status": "ACKNOWLEDGED",
  "note": "Guard team notified.",
  "assignedSecurityUserId": "cm..."
}
```

`assignedSecurityUserId` is optional; acknowledgement otherwise assigns the current responder.

False-alarm cancellation by the creator, only while `OPEN`:

```http
POST /api/v1/sos/:id/cancel
```

```json
{
  "note": "Button pressed accidentally."
}
```

On `409 INVALID_STATUS_TRANSITION`, refresh the incident because another user may have advanced it.

## 7. Complaints

```ts
type ComplaintPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

type ComplaintStatus =
  | "SUBMITTED"
  | "ASSIGNED"
  | "IN_REVIEW"
  | "ESCALATED"
  | "RESOLVED"
  | "CLOSED";
```

Transitions:

```text
SUBMITTED -> ASSIGNED | IN_REVIEW | ESCALATED
ASSIGNED  -> IN_REVIEW | ESCALATED | RESOLVED
IN_REVIEW -> ESCALATED | RESOLVED
ESCALATED -> IN_REVIEW | RESOLVED
RESOLVED  -> CLOSED | IN_REVIEW
```

Load categories:

```http
GET /api/v1/complaint-categories
```

Always use the returned category `id`.

Create named:

```http
POST /api/v1/complaints
```

```json
{
  "categoryId": "cm...",
  "title": "Broken lighting near the hostel",
  "description": "The pathway lights have not worked for two nights.",
  "priority": "HIGH"
}
```

List:

```http
GET /api/v1/complaints?page=1&limit=20&status=IN_REVIEW
```

Detail:

```http
GET /api/v1/complaints/:id
```

The detail includes category, reporter, assignee, attachments, messages, status history, and feedback. Access is audited.

### Anonymous complaint

```http
POST /api/v1/complaints/anonymous
```

```json
{
  "categoryId": "cm...",
  "title": "Unsafe condition in a corridor",
  "description": "Description without unnecessary identifying details.",
  "priority": "HIGH",
  "contactEmail": "optional@example.com"
}
```

Response:

```json
{
  "data": {
    "id": "cm...",
    "referenceCode": "CMP-2026-12AB34CD",
    "trackingToken": "random-token-returned-once",
    "status": "SUBMITTED",
    "createdAt": "2026-07-25T10:00:00.000Z"
  }
}
```

The raw token is shown once and cannot be recovered. Force the user to copy/save it. Never place it in URLs, analytics, logs, or telemetry.

Track:

```http
POST /api/v1/complaints/track
```

```json
{
  "referenceCode": "CMP-2026-12AB34CD",
  "trackingToken": "saved-token"
}
```

Invalid combinations return `404 NOT_FOUND`.

### Staff operations

Assign, Coordinator/Admin:

```http
PATCH /api/v1/complaints/:id/assignment
```

```json
{
  "assignedToId": "cm..."
}
```

Eligible assignees are Faculty, Counsellor, Coordinator, or Admin.

Update status, Coordinator/Admin:

```http
PATCH /api/v1/complaints/:id/status
```

```json
{
  "status": "IN_REVIEW",
  "note": "Facilities team is inspecting the area."
}
```

### Messages and feedback

Named user message:

```http
POST /api/v1/complaints/:id/messages
```

```json
{
  "body": "Can you provide the nearest building number?"
}
```

Anonymous message:

```json
{
  "body": "It is beside Block B.",
  "trackingToken": "saved-token"
}
```

Feedback is accepted only after `RESOLVED` or `CLOSED`:

```http
POST /api/v1/complaints/:id/feedback
```

```json
{
  "rating": 5,
  "comment": "Resolved quickly.",
  "trackingToken": "only-for-anonymous-reporters"
}
```

Anonymous rate limits:

- Create: 5 per IP-derived hash per hour.
- Track: 20 per 15 minutes.
- Message: 15 per 15 minutes.

### Attachments

Use the UploadThing endpoint named `complaintAttachment`:

```ts
import { generateUploadButton } from "@uploadthing/react";
import type { AppFileRouter } from "@/app/api/uploadthing/core";

export const UploadButton = generateUploadButton<AppFileRouter>();
```

```tsx
<UploadButton
  endpoint="complaintAttachment"
  input={{ complaintId, trackingToken }}
  onClientUploadComplete={(files) => {
    // files[n].serverData has attachmentId and url
    refreshComplaint();
  }}
  onUploadError={(error) => showError(error.message)}
/>
```

Omit `trackingToken` for authenticated named complaints. Create the complaint first, then upload using its ID.

Limits:

- JPEG/PNG: 8 MB.
- PDF: 10 MB application limit.
- Five files per upload request.
- Ownership or anonymous token is checked before upload.

## 8. Peer support and appointments

List profiles:

```http
GET /api/v1/support/profiles
GET /api/v1/support/profiles?type=COUNSELLOR
GET /api/v1/support/profiles?type=MENTOR
```

Create/update own profile:

```http
POST /api/v1/support/profiles
```

```json
{
  "type": "COUNSELLOR",
  "specialties": ["Student wellbeing", "Academic stress"],
  "languages": ["English", "Malayalam"],
  "bio": "Available for confidential student-support appointments."
}
```

Counsellor profiles require Counsellor/Admin. Mentor profiles require Student/Faculty/Admin.

List future unbooked slots:

```http
GET /api/v1/support/profiles/:profileId/availability
```

Publish a slot, profile owner/Admin:

```http
POST /api/v1/support/profiles/:profileId/availability
```

```json
{
  "startAt": "2026-07-27T05:30:00.000Z",
  "endAt": "2026-07-27T06:00:00.000Z"
}
```

Create support request:

```http
POST /api/v1/support/requests
```

```json
{
  "subject": "Need someone to talk to",
  "description": "I would like to arrange a private appointment.",
  "urgency": "MEDIUM"
}
```

List:

```http
GET /api/v1/support/requests?page=1&limit=20
```

Support-request status is `OPEN`, `MATCHED`, `COMPLETED`, or `CANCELLED`.

Book:

```http
POST /api/v1/appointments
```

```json
{
  "slotId": "cm...",
  "supportRequestId": "cm...",
  "notes": "I prefer a quiet meeting space."
}
```

`supportRequestId` and `notes` are optional. Booking atomically claims the slot. Handle `409 SLOT_ALREADY_BOOKED` by refreshing available slots.

Successful booking creates a conversation; read its ID from:

```ts
appointment.conversation.id;
```

List appointments:

```http
GET /api/v1/appointments?page=1&limit=20
```

Appointment flow:

```text
REQUESTED -> CONFIRMED | CANCELLED
CONFIRMED -> COMPLETED | CANCELLED | NO_SHOW
```

Update:

```http
PATCH /api/v1/appointments/:id/status
```

```json
{
  "status": "CONFIRMED",
  "notes": "Meeting room 2."
}
```

Providers/Admin manage states. Students can cancel their own appointment. Cancellation releases the slot.

## 9. Confidential chat

History:

```http
GET /api/v1/conversations/:conversationId/messages?page=1&limit=50
```

Messages are chronological within each requested page.

Send:

```http
POST /api/v1/conversations/:conversationId/messages
```

```json
{
  "body": "Hello, I am available for the appointment."
}
```

Only actual participants can send. Admin transcript reads are exceptional and audited, but admins cannot send unless they are participants.

Chat is access-controlled and stored in PostgreSQL. Do not describe it as end-to-end encrypted.

## 10. Campus-resource chatbot

```http
POST /api/v1/support/chatbot
```

```json
{
  "message": "How can I arrange a counselling appointment?"
}
```

Response:

```json
{
  "data": {
    "intent": "find_counselling",
    "riskLevel": "LOW",
    "answer": "You can contact the Student Counselling Centre...",
    "recommendedResourceIds": ["cm..."],
    "recommendedResources": [],
    "escalate": false
  }
}
```

Risk is `LOW`, `MEDIUM`, `HIGH`, or `IMMINENT`.

Frontend rules:

- Render `answer` as text, never HTML.
- Render only returned approved resources.
- For `escalate: true` or `IMMINENT`, stop normal chat and prominently show SOS, campus security, and counsellor actions.
- Never call it a therapist, diagnosis service, or emergency replacement.
- Do not send names, emails, complaints, or confidential chat history.
- Handle `503 CHATBOT_NOT_CONFIGURED` with static approved campus resources.

Limit: 20 requests per authenticated user per hour.

## 11. Notifications

List:

```http
GET /api/v1/notifications?page=1&limit=20
```

The response header `x-unread-count` contains the total unread count.

Mark one read:

```http
POST /api/v1/notifications/:id/read
```

Mark all read:

```http
PATCH /api/v1/notifications
```

No body is required.

## 12. Pusher

Install the browser SDK:

```bash
npm install pusher-js
```

Required public variables:

```text
NEXT_PUBLIC_PUSHER_KEY
NEXT_PUBLIC_PUSHER_CLUSTER
```

Client:

```ts
import Pusher from "pusher-js";

export const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  channelAuthorization: {
    endpoint: "/api/v1/realtime/auth",
    transport: "ajax",
  },
});
```

Channels:

| Channel | Access |
|---|---|
| `private-user-<currentUserId>` | That user |
| `private-security` | Security, Admin |
| `private-complaints` | Coordinator, Admin |
| `private-conversation-<id>` | Participants; exceptional Admin read access |

Events:

```ts
type RealtimeEventMap = {
  "sos.created": {
    id: string;
    status: "OPEN";
    latitude: number;
    longitude: number;
    accuracy?: number | null;
    capturedAt: string;
    createdAt: string;
  };
  "sos.updated": {
    id: string;
    status: SosStatus;
    updatedAt: string;
  };
  "complaint.updated": {
    id: string;
    status: ComplaintStatus;
    updatedAt?: string;
    referenceCode?: string;
  };
  "appointment.updated": {
    id: string;
    status: string;
    startAt?: string;
  };
  "chat.message.created": {
    id: string;
    conversationId: string;
    sender: { id: string; name: string | null; image: string | null };
    body: string;
    createdAt: string;
  };
  "notification.created": {
    id: string;
    type: string;
    title: string;
    body: string;
    actionUrl: string | null;
    createdAt: string;
  };
};
```

Subscribe in `useEffect`, unbind and unsubscribe on cleanup, and deduplicate pushed records by `id`. Treat status events as invalidation signals and refresh detail when necessary.

Precise SOS coordinates belong only on the authorized security channel. Never put them in browser notifications, toast previews, analytics, or public channels.

## 13. Admin

List users:

```http
GET /api/v1/admin/users?page=1&limit=20
GET /api/v1/admin/users?role=SECURITY
```

Create a user with one or more roles:

```http
POST /api/v1/admin/users
```

```json
{
  "name": "Security Officer",
  "email": "officer@campus.edu",
  "password": "temporary-password",
  "roles": ["SECURITY"],
  "campus": "Main Campus",
  "department": "Campus Security"
}
```

The password must contain at least 8 characters. A duplicate email returns
409 CONFLICT.

Activate or suspend an account:

```http
PATCH /api/v1/admin/users/:id/status
```

```json
{
  "active": false
}
```

Changing account status increments sessionVersion, invalidating existing
sessions. An administrator cannot suspend their own account.

Replace all roles:

```http
PATCH /api/v1/admin/users/:id/roles
```

```json
{
  "roles": ["STUDENT", "FACULTY"]
}
```

This replaces, rather than appends, the role set and invalidates existing sessions.

Audit log:

```http
GET /api/v1/audit?page=1&limit=20
```

## 14. Operational campus modules

All routes below use the normal `{ data, meta? }` envelope and require an Auth.js session.

### Attendance

- `GET /api/v1/attendance?limit=100` — Faculty see their sessions; Admin sees all.
- `POST /api/v1/attendance` — creates a class session and adds every active Student as `ABSENT`.
- `PATCH /api/v1/attendance/:id` — updates `qrActive` and/or an `entries` array containing `studentId` and `status`.
- Marks: `PRESENT`, `ABSENT`, `LATE`, `EXCUSED`.

### Events

- `GET /api/v1/events`, `POST /api/v1/events`.
- `PATCH /api/v1/events/:id` with `{ "status": "ONGOING" }`.
- `POST /api/v1/events/:id/registrations` — automatically uses `WAITLISTED` after capacity is reached.
- `POST /api/v1/events/:id/check-in` with `{ "studentId": "..." }`.
- Statuses: `DRAFT`, `UPCOMING`, `ONGOING`, `COMPLETED`, `CANCELLED`.

### Library

- `GET /api/v1/library` returns `{ books, loans }` and refreshes overdue loan state.
- `POST /api/v1/library` creates a catalogue book and available-copy inventory.
- `POST /api/v1/library/loans` with `bookId`, `borrowerEmail`, and `dueAt` atomically reserves a copy.
- `POST /api/v1/library/loans/:id/return` restores inventory and calculates a daily overdue fine.

### Blood donor network

- `GET /api/v1/blood-donors` returns requests and only available donors who consented to contact.
- `POST /api/v1/blood-donors` uses `type: "donor"` for a personal donor profile or `type: "request"` for an Admin request.
- `PATCH /api/v1/blood-donors/requests/:id` updates `OPEN`, `MATCHED`, `FULFILLED`, or `CANCELLED`.
- Never expose donors whose `contactConsent` is false.

### Campus startups

- `GET /api/v1/startups`, `POST /api/v1/startups`.
- Admin may provide `founderEmail` when creating a profile for a student.
- `PATCH /api/v1/startups/:id` updates the stage and optional `assignedMentor`.
- Stages: `SUBMITTED`, `UNDER_REVIEW`, `APPROVED`, `REJECTED`, `INCUBATING`.

Role access: Faculty manages attendance, Library Staff manages circulation, Students can register for events and maintain donor/startup submissions through the API, and Admin manages every operational module.
## 15. Health, deferred modules, and errors

Health:

```http
GET /api/v1/health
```

It returns `status`, timestamp, and configuration booleans for database, auth, Pusher, UploadThing, Resend, and OpenAI.

These intentionally return `501 MODULE_NOT_AVAILABLE`:

```text
GET /api/v1/rewards
```

Show “Coming soon”; do not treat 501 as an empty successful list.

| Status/code | Frontend action |
|---|---|
| `400 VALIDATION_ERROR` | Map `fieldErrors` to inputs |
| `400 OTP_INVALID` | Keep OTP screen open |
| `400 RESET_TOKEN_INVALID` | Restart reset flow |
| `401 UNAUTHENTICATED` | Redirect to login |
| `401 SESSION_REVOKED` | Sign out and request login |
| `403 FORBIDDEN` | Show access denied; do not retry |
| `404 NOT_FOUND` | Show not found |
| `409 INVALID_STATUS_TRANSITION` | Refresh the record |
| `409 SLOT_ALREADY_BOOKED` | Refresh slots |
| `409 COMPLAINT_NOT_RESOLVED` | Disable feedback |
| `429 RATE_LIMITED` | Temporarily disable submission |
| `501 MODULE_NOT_AVAILABLE` | Show Coming soon |
| `503 EMAIL_NOT_CONFIGURED` | Disable OTP in that environment |
| `503 REALTIME_NOT_CONFIGURED` | Continue with refresh/polling |
| `503 CHATBOT_NOT_CONFIGURED` | Show static campus resources |
| `500 INTERNAL_ERROR` | Generic error; retain `requestId` |

## 16. Complete frontend flows

Student startup:

1. Load the Auth.js session.
2. Load `/users/me`.
3. Build navigation from the role array.
4. Subscribe to `private-user-<id>`.
5. Load notifications and `x-unread-count`.

SOS:

1. Explain location permission.
2. Capture current coordinates.
3. Submit once and disable while pending.
4. Keep the incident ID.
5. Listen for `sos.updated`.
6. Show cancellation only while `OPEN`.

Named complaint:

1. Load category IDs.
2. Create complaint.
3. Upload files using returned complaint ID.
4. Navigate to detail.
5. Listen for `complaint.updated`.

Anonymous complaint:

1. Load categories.
2. Submit without login.
3. Force copy/save of reference and token.
4. Upload with complaint ID and token.
5. Track using reference/token.
6. Send the token only in anonymous request bodies.

Appointment/chat:

1. Load profiles.
2. Load selected profile availability.
3. Optionally create support request.
4. Book the slot.
5. Read `appointment.conversation.id`.
6. Subscribe to the conversation channel.
7. Load message history.
8. Deduplicate fetched/pushed messages.

Crisis response:

1. If chatbot returns normal risk, render the approved resources.
2. If `escalate` or `IMMINENT`, stop normal chat.
3. Display SOS, security, and counsellor actions immediately.
4. Do not wait for another model call before showing emergency options.

## 17. Demo users

When seeded with `SEED_DEMO_USERS=true` and `DEMO_PASSWORD`, these users share the configured password:

```text
student@campus.demo
faculty@campus.demo
counsellor@campus.demo
coordinator@campus.demo
security@campus.demo
library@campus.demo
admin@campus.demo
```

Never enable predictable demo credentials in production.

To create the complete idempotent frontend demo scenario, set
`DEMO_PASSWORD` to at least eight characters and run:

```bash
npm run db:seed:demo
```

This adds role-specific profiles, SOS incidents, complaint states and messages,
support profiles and slots, an appointment and conversation, notifications,
audit examples, and chatbot usage metadata. It intentionally does not create
OTP, password-reset, session, or rate-limit records.

## 18. Frontend checklist

- Use one shared API client.
- Handle field-level validation errors.
- Use Auth.js cookies, not manually stored JWTs.
- Treat client role checks as presentation only.
- Fetch database IDs; do not hard-code them.
- Secure anonymous tracking tokens.
- Create complaints before uploads.
- Refresh after 409 race errors.
- Subscribe only to authorized private channels.
- Unsubscribe during component cleanup.
- Deduplicate real-time records.
- Render chatbot output as plain text.
- Provide fallbacks for optional integration 503s.
- Keep `requestId` in error-reporting UI.
- Test every workflow with its matching demo role.

Backend source of truth:

```text
server/contracts/index.ts
server/openapi.ts
server/modules/*/schemas.ts
app/api/v1/**
app/api/uploadthing/core.ts
mocks/backend-fixtures.ts
```

Do not import Prisma models into client components. Use shared contracts or frontend-owned view models so database-only and sensitive fields do not enter the browser bundle.

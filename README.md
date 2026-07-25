# Vaxa Campus Platform

A modular backend built into the existing Next.js App Router application for the 72-hour Vaxa platform. The API is versioned under `/api/v1` and uses Auth.js, Prisma, Neon PostgreSQL, Zod, Pusher Channels, UploadThing, Resend, and the OpenAI Responses API.

## Delivered modules

- Credentials authentication with Auth.js JWT sessions
- Multiple roles per user and database-backed permissions
- User profiles, email OTP, password reset, and session invalidation
- SOS incidents, assignments, state history, alerts, and private real-time events
- Named and anonymous complaints, hashed tracking tokens, messages, attachments, assignment, resolution, and feedback
- Mentor/counsellor profiles, availability, support requests, atomic appointment booking, and confidential conversations
- In-app notifications and append-only audit logs
- A moderated, structured Lexa campus-resource assistant that does not store raw prompts by default
- OpenAPI, shared TypeScript contracts, and frontend mock fixtures
- Explicit `501 MODULE_NOT_AVAILABLE` scaffolds for attendance, events, rewards, library, blood donors, and startups

## Local setup

Requirements: Node.js 20+, npm, and a PostgreSQL/Neon database.

```bash
npm install
copy .env.example .env
npm run db:migrate
npm run db:seed
npm run db:seed:demo
npm run dev
```

Do not use `prisma db push` for shared or production databases. New schema changes should be committed as versioned migrations and applied with `npm run db:migrate`.

The API contract is available at `http://localhost:3000/api/v1/openapi.json`. Health and integration configuration can be checked at `http://localhost:3000/api/v1/health`.

Frontend developers should use [`backend.md`](./backend.md) for endpoint payloads, authentication flows, permissions, uploads, Pusher events, error handling, and screen-level integration guidance.

## Environment variables

Copy `.env.example` and configure:

- `DATABASE_URL`: pooled Neon PostgreSQL URL
- `AUTH_SECRET`: long random Auth.js secret
- `APP_URL`: public application URL
- `PUSHER_*` and `NEXT_PUBLIC_PUSHER_*`: server and browser Pusher credentials
- `UPLOADTHING_TOKEN`: UploadThing server token
- `RESEND_API_KEY` and `EMAIL_FROM`: transactional email
- `OPENAI_API_KEY`: Lexa campus-resource assistant
- `IP_HASH_SECRET`: hashes IP-derived abuse-prevention identifiers

Optional demo accounts are created only when `SEED_DEMO_USERS=true` and `DEMO_PASSWORD` is set before `npm run db:seed`. The seed then creates one account for every role at `<role>@campus.demo`, for example `student@campus.demo` and `admin@campus.demo`.

## Vercel deployment

Add every required variable in Vercel Project Settings > Environment Variables before triggering the build, especially `DATABASE_URL`. The project runs `prisma generate` during install/postinstall, so a missing database variable can fail dependency installation before Next.js starts building. Configure the variables separately for Production, Preview, and Development as needed, then redeploy.

Apply migrations as a controlled release step:

```bash
npm run db:migrate
```

Do not automatically reset the production database. The committed baseline marks the pre-existing Auth.js tables, and the next migration adds the MVP domain tables non-destructively.

## API conventions

Success:

```json
{ "data": {}, "meta": { "page": 1, "limit": 20, "total": 1 } }
```

Failure:

```json
{ "error": { "code": "FORBIDDEN", "message": "...", "requestId": "...", "fieldErrors": {} } }
```

Dates are ISO 8601 strings. Collection routes accept `page` and `limit`. Sensitive routes validate both the Auth.js session and current database roles/permissions.

Frontend contracts live in `server/contracts/index.ts`; mock data is in `mocks/backend-fixtures.ts`.

## Authentication and roles

Roles are `STUDENT`, `FACULTY`, `COUNSELLOR`, `COORDINATOR`, `SECURITY`, `LIBRARY_STAFF`, and `ADMIN`. A user can hold more than one role. Password reset and administrative role changes increment `sessionVersion`, invalidating existing JWT sessions on the next protected request.

Auth.js uses the existing `/api/auth/*` handlers and credentials login UI. Backend flows include:

- `POST /api/v1/auth/otp/request`
- `POST /api/v1/auth/otp/verify`
- `POST /api/v1/auth/password/reset`
- `GET|PATCH /api/v1/users/me`
- `GET /api/v1/admin/users`
- `PATCH /api/v1/admin/users/:id/roles`

Only hashes of OTPs, reset tokens, and anonymous complaint tokens are stored.

## Real-time frontend contract

Authenticate subscriptions with `POST /api/v1/realtime/auth`. Supported private channel patterns are:

- `private-user-<userId>`
- `private-security`
- `private-complaints`
- `private-conversation-<conversationId>`

Events are typed by `RealtimeEventMap`:

- `sos.created`
- `sos.updated`
- `complaint.updated`
- `appointment.updated`
- `chat.message.created`
- `notification.created`

Precise SOS location is only sent on the authorized security channel and is excluded from notification previews and audit metadata. A Pusher delivery failure is logged but does not undo a committed database mutation.

## File uploads

UploadThing is mounted at `/api/uploadthing`. Complaint images accept JPEG/PNG up to 8 MB. Complaint PDFs use UploadThing's 16 MB provider tier but are rejected by middleware above the application limit of 10 MB. Upload association requires either an authenticated complaint owner/staff member or a valid anonymous tracking token.

## Lexa safety

`POST /api/v1/support/lexa` uses `gpt-5.6-luna`, structured output, a stable pseudonymous safety identifier, input/output moderation with `omni-moderation-latest`, approved `CampusResource` rows, and `store: false`. Crisis-like input takes the local emergency-routing path. Names, emails, complaint content, and conversation transcripts are not sent. Stored interaction data contains usage, risk level, selected resources, and provider metadata, not raw chat text.

## Commands

```bash
npm run dev
npm run lint
npm test
npm run build
npm run db:generate
npm run db:migrate
npm run db:seed
npm run db:seed:demo
```

## Verification scope

Unit tests cover role permissions, SOS transitions, complaint token hashing/transitions, and appointment transitions. Before production release, use a separate Neon branch for integration tests and add live-provider smoke tests for Resend, Pusher, UploadThing, and OpenAI credentials. Deferred module routes intentionally return `501`; they never return fake success.

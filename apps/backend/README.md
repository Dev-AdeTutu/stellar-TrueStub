# TrueStub — Backend (scaffold)

This is the `@truestub/backend` workspace. **It's a scaffold, not a running
part of the product yet** — a health check and a project skeleton, nothing
more. The frontend (`apps/frontend`) does not call this service today; it
talks directly to Firebase and to a remote Hasura GraphQL endpoint (see the
[frontend README](../frontend/README.md#architecture)).

## Why this exists

`apps/frontend` has a handful of Next.js API routes that need a real
server-side home eventually, because they touch secrets that must never
ship to the browser. Today they're thin proxies to external URLs; this
workspace is where their actual implementation should land.

## Current scope

- `GET /health` → `{ "status": "ok", "service": "truestub-backend" }`
- Express + TypeScript, `tsx` for the dev watcher, plain `tsc` build.
- `src/config/env.ts` — the one place environment variables get read.

## Running it

```bash
cp .env.example .env       # PORT only, for now
yarn install                # from the repo root
yarn workspace @truestub/backend dev
curl http://localhost:4000/health
```

## Roadmap: routes to migrate here

These currently live in `apps/frontend` as proxies to external URLs. Moving
their logic here (rather than a separate service) is the natural next step
— each row is what the frontend already expects to exist "on the other
end" of the URL it's calling:

| Frontend route (proxy today) | Points at | What lands here eventually |
| --- | --- | --- |
| `src/app/api/auth/validate-reset-token/route.ts` | `BACKEND_URL` | Validate a password-reset token |
| `src/app/api/auth/sync-user/route.ts` | `BACKEND_URL` | Sync a Firebase user into Hasura/Postgres |
| `src/app/api/auth/reset-password/route.ts` | `BACKEND_URL` | Complete a password reset |
| `src/app/api/auth/forgot-password/route.ts` | `NEXT_PUBLIC_WEBHOOK_URL` | Kick off the forgot-password flow |
| `src/app/webhooks/escrow-status/route.ts` | `TRUSTLESS_WORK_WEBHOOK_SECRET`-verified webhook | Verify the Trustless Work HMAC signature and call `updateEscrowStatus` (currently a stub in `src/lib/server/hasura.ts`, throws "not implemented") |

None of that logic has been moved here yet — this pass only sets up the
workspace it would live in. When it does move, update the frontend's
`BACKEND_URL` / `NEXT_PUBLIC_WEBHOOK_URL` env vars to point at this
service, and delete the corresponding proxy route (or leave it as a thin
pass-through, whichever the routing story ends up needing).

## Not in scope here

Stellar/Soroban contract logic — that's `contracts/` at the repo root, also
a placeholder today. This service is meant to call out to Trustless Work's
hosted escrow API/contracts, not implement contract logic itself.

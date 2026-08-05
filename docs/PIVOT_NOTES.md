# Pivot Notes: SafeTrust → TrueStub

This document records what changed when this repo was personalized from its
upstream, [SafeTrust](https://github.com/safetrustcr/frontend-SafeTrust), and
why — mostly for future-me, and for anyone else who forks this again.

## What changed

- **Name**: SafeTrust → **TrueStub**, across the app, docs, templates, and
  package metadata.
- **Pitch**: The escrow story shifted from hospitality/tourism deposits
  (hotels, vacation rentals) to **secondary-market ticket resale** — buyer
  funds are held in escrow until a verified ticket transfer completes, then
  released to the seller.
- **Copy**: README, page titles, meta descriptions, and a handful of
  user-facing strings (share text, dashboard header) were rewritten to match
  the new pitch.
- **Housekeeping**: `.env.example` no longer carries real-looking Firebase
  values from the original project; broken org-specific links in the issue/PR
  templates now point at the in-repo docs that actually contain that content;
  the placeholder `package.json` name (`my-app`) got a real name.

## What did NOT change (on purpose)

This pass was branding + copy only. The underlying data model, forms, and
business logic are untouched:

- Components and routes still model hotel/room/booking concepts internally
  (`src/components/hotel`, `src/components/rooms`, `useBookingEscrow`, etc.).
- The escrow/dispute/wallet logic itself is unmodified — the pivot reuses the
  same trustless-escrow engine, it doesn't rebuild it.

## Suggested follow-ups (not done here)

- Rename the domain concepts end-to-end (`Hotel` → `Event`, `Room` →
  `Ticket Listing`, `Booking` → `Resale Listing`, checkout/checkin →
  transfer confirmation) across components, GraphQL types, and the data
  model. This is a real feature-level refactor, not a copy change — worth
  its own pass.
- Commission a new logo/favicon; the current one is a generic lock icon
  inherited from SafeTrust.
- Point `NEXT_PUBLIC_HASURA_GRAPHQL_URL` at a Hasura instance whose schema
  actually models tickets/listings, once the domain rename above happens.

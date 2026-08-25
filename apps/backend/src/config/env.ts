/**
 * Environment wiring.
 *
 * Read once, validate, export a typed object — never reach for
 * `process.env` directly from route handlers.
 */
export const env = {
  PORT: Number(process.env.PORT ?? 4000),
  // Hasura admin credentials — this is the only workspace allowed to hold
  // them (see apps/frontend/README.md's Hasura section for why).
  HASURA_GRAPHQL_URL: process.env.HASURA_GRAPHQL_URL,
  HASURA_GRAPHQL_ADMIN_SECRET: process.env.HASURA_GRAPHQL_ADMIN_SECRET,
  // Shared secret that gates server-to-server calls from apps/frontend into
  // this service's /internal/* routes.
  INTERNAL_API_SECRET: process.env.INTERNAL_API_SECRET,
};

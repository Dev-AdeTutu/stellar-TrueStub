/**
 * Environment wiring — the one place environment variables get read.
 *
 * As real routes land here (see the README roadmap), add their required
 * vars below and load them the same way: read once, validate, export a
 * typed object — never reach for `process.env` directly from route
 * handlers.
 */
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  PORT: Number(process.env.PORT ?? 4000),
  FIREBASE_PROJECT_ID: requireEnv("FIREBASE_PROJECT_ID"),
  FIREBASE_CLIENT_EMAIL: requireEnv("FIREBASE_CLIENT_EMAIL"),
  FIREBASE_PRIVATE_KEY: requireEnv("FIREBASE_PRIVATE_KEY"),
  HASURA_GRAPHQL_URL: requireEnv("HASURA_GRAPHQL_URL"),
  HASURA_GRAPHQL_ADMIN_SECRET: requireEnv("HASURA_GRAPHQL_ADMIN_SECRET"),
};

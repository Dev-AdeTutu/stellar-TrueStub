/**
 * Environment wiring.
 *
 * Read once at startup, validated, and exported as a typed object.
 * Route handlers and middleware should never read `process.env` directly.
 *
 * Use `requireEnv` for variables that have no safe default and must be
 * present before the server can start (e.g. database URLs, signing secrets).
 */

export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export const env = {
  // ── Server ────────────────────────────────────────────────────────────────
  PORT: Number(process.env.PORT ?? 4000),
  NODE_ENV: (process.env.NODE_ENV ?? "development") as
    | "development"
    | "production"
    | "test",

  // ── Logging (#23) ─────────────────────────────────────────────────────────
  /** pino log level: trace | debug | info | warn | error | fatal */
  LOG_LEVEL: process.env.LOG_LEVEL ?? "info",

  // ── CORS (#25) ────────────────────────────────────────────────────────────
  /**
   * Comma-separated list of allowed frontend origins.
   * Example: "http://localhost:3000,https://app.truestub.com"
   */
  CORS_ORIGINS: process.env.CORS_ORIGINS ?? "http://localhost:3000",

  // ── Rate limiting (#24) ───────────────────────────────────────────────────
  /**
   * Max requests per window for /api/auth/* routes.
   * Defaults: 20 requests per 15-minute window.
   */
  RATE_LIMIT_WINDOW_MS: Number(process.env.RATE_LIMIT_WINDOW_MS ?? 15 * 60 * 1000),
  RATE_LIMIT_MAX: Number(process.env.RATE_LIMIT_MAX ?? 20),
};

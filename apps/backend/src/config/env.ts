/**
 * Environment wiring — scaffold only.
 *
 * Today this service doesn't do anything beyond serve a health check, so the
 * only variable that matters is PORT. As real routes land here (see the
 * README roadmap), add their required vars below and load them the same
 * way: read once, validate, export a typed object — never reach for
 * `process.env` directly from route handlers.
 */
export const env = {
  PORT: Number(process.env.PORT ?? 4000),
};

/**
 * Environment configuration for TrueStub Backend.
 */
export const env = {
  PORT: Number(process.env.PORT ?? 4000),
  TRUSTLESS_WORK_WEBHOOK_SECRET: process.env.TRUSTLESS_WORK_WEBHOOK_SECRET ?? "safetrust_webhook_secret_dev",
  HASURA_GRAPHQL_URL: process.env.HASURA_GRAPHQL_URL ?? "http://localhost:8080/v1/graphql",
  HASURA_GRAPHQL_ADMIN_SECRET: process.env.HASURA_GRAPHQL_ADMIN_SECRET ?? "safetrust_admin_secret_2024",
  
  // Notification channels
  EMAIL_PROVIDER: process.env.EMAIL_PROVIDER ?? "console", // 'sendgrid' | 'firebase' | 'console'
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY ?? "",
  NOTIFICATION_FROM_EMAIL: process.env.NOTIFICATION_FROM_EMAIL ?? "notifications@truestub.com",
  
  // Firebase Admin / FCM Push
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID ?? "",
  FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL ?? "",
  FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY ?? "",
};


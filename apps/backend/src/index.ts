import "dotenv/config";
import express from "express";
import { env } from "./config/env";
import { healthRouter } from "./routes/health";
import { syncUserRouter } from "./routes/sync-user";

const app = express();

app.use(express.json());
app.use("/health", healthRouter);
app.use("/api/auth/sync-user", syncUserRouter);

app.listen(env.PORT, () => {
  console.log(`TrueStub backend listening on port ${env.PORT}`);
});

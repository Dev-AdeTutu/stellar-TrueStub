import "dotenv/config";
import express from "express";
import { env } from "./config/env";
import { healthRouter } from "./routes/health";
import { webhookRouter } from "./routes/webhooks";

const app = express();

app.use(express.json());
app.use("/health", healthRouter);
app.use("/webhooks", webhookRouter);

app.listen(env.PORT, () => {
  console.log(`TrueStub backend listening on port ${env.PORT}`);
});


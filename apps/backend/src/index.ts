import "dotenv/config";
import express from "express";
import { env } from "./config/env";
import { healthRouter } from "./routes/health";
import { internalEscrowStatusRouter } from "./routes/internal-escrow-status";

const app = express();

app.use(express.json());
app.use("/health", healthRouter);
app.use("/internal/escrow-status", internalEscrowStatusRouter);

app.listen(env.PORT, () => {
  console.log(`TrueStub backend listening on port ${env.PORT}`);
});

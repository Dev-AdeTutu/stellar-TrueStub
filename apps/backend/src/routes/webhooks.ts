import { Router, Request, Response } from "express";
import { createHmac, timingSafeEqual } from "crypto";
import { env } from "../config/env";
import { NotificationService } from "../services/notification.service";
import { HasuraService } from "../services/hasura.service";

export const webhookRouter = Router();

const STATUS_MAP: Record<string, string> = {
  funded: "funded",
  active: "funded",
  completed: "completed",
  released: "released",
  disputed: "disputed",
  resolved: "resolved",
  cancelled: "cancelled",
};

function getSignatureHeader(req: Request): string | undefined {
  const sig =
    req.headers["x-trustless-work-signature"] ||
    req.headers["x-webhook-signature"] ||
    req.headers["x-signature"];
  return typeof sig === "string" ? sig : Array.isArray(sig) ? sig[0] : undefined;
}

function normalizeSignature(sig: string): string {
  return sig.startsWith("sha256=") ? sig.slice(7) : sig;
}

function verifySignature(rawBody: string, signature: string, secret: string): boolean {
  try {
    const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
    const actual = normalizeSignature(signature);
    const expectedBuf = Buffer.from(expected, "utf8");
    const actualBuf = Buffer.from(actual, "utf8");
    if (expectedBuf.length !== actualBuf.length) {
      return false;
    }
    return timingSafeEqual(expectedBuf, actualBuf);
  } catch {
    return false;
  }
}

webhookRouter.post("/escrow-status", async (req: Request, res: Response) => {
  const secret = env.TRUSTLESS_WORK_WEBHOOK_SECRET;
  const signature = getSignatureHeader(req);

  // When signature is present, verify HMAC
  const rawBody = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
  if (signature && secret && !verifySignature(rawBody, signature, secret)) {
    return res.status(401).json({ error: "Invalid webhook signature" });
  }

  const { contractId, engagementId, status, amount, currency, recipientEmail, recipientName, recipientPushToken, role } = req.body || {};

  if (!engagementId && !contractId) {
    return res.status(400).json({ error: "Missing contractId or engagementId" });
  }

  const normalizedStatus = status ? STATUS_MAP[status.toLowerCase()] || status.toLowerCase() : "updated";
  const targetId = engagementId || contractId;

  try {
    // 1. Sync status in DB / Hasura
    const dbResult = await HasuraService.updateEscrowStatus(targetId, normalizedStatus);

    // 2. Dispatch out-of-app external notifications (Email / Push)
    const notificationResult = await NotificationService.notifyEscrowStatusChange({
      escrowId: targetId,
      contractId: contractId || targetId,
      engagementId: engagementId || targetId,
      status: normalizedStatus,
      amount,
      currency,
      recipientEmail,
      recipientName,
      recipientPushToken,
      role,
    });

    console.log(`[Webhook:escrow-status] ✅ Processed status update for ${targetId}: ${status} -> ${normalizedStatus}`);
    console.log(`[Webhook:escrow-status] 📬 Notification result:`, notificationResult);

    return res.status(200).json({
      success: true,
      engagementId: targetId,
      status: normalizedStatus,
      rowsUpdated: dbResult.affected_rows,
      notifications: notificationResult,
    });
  } catch (err) {
    console.error("[Webhook:escrow-status] ❌ Failed to process webhook:", err);
    return res.status(500).json({ error: "Failed to process escrow status webhook" });
  }
});

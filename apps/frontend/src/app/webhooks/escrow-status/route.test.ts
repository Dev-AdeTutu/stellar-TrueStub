/**
 * @jest-environment node
 */
import { createHmac } from "crypto";
import { NextRequest } from "next/server";

import { updateEscrowStatus } from "@/lib/server/hasura";

import { POST } from "./route";

jest.mock("@/lib/server/hasura", () => ({
  updateEscrowStatus: jest.fn(),
}));

const WEBHOOK_SECRET = "test-webhook-secret";

function sign(rawBody: string) {
  return createHmac("sha256", WEBHOOK_SECRET).update(rawBody).digest("hex");
}

function buildRequest(rawBody: string, signature: string | null) {
  return new NextRequest("http://localhost/webhooks/escrow-status", {
    method: "POST",
    body: rawBody,
    headers: signature ? { "x-trustless-work-signature": signature } : undefined,
  });
}

describe("POST /webhooks/escrow-status", () => {
  const originalEnv = process.env;
  const mockedUpdateEscrowStatus = updateEscrowStatus as jest.Mock;

  beforeEach(() => {
    process.env = { ...originalEnv, TRUSTLESS_WORK_WEBHOOK_SECRET: WEBHOOK_SECRET };
    mockedUpdateEscrowStatus.mockReset();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("updates the escrow status in Hasura for a validly signed payload", async () => {
    mockedUpdateEscrowStatus.mockResolvedValue({
      update_escrows: { affected_rows: 1 },
    });

    const payload = JSON.stringify({
      contractId: "contract-123",
      engagementId: "ENG-001",
      status: "completed",
    });

    const response = await POST(buildRequest(payload, sign(payload)));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(mockedUpdateEscrowStatus).toHaveBeenCalledWith("contract-123", "completed");
    expect(body).toEqual({
      success: true,
      engagementId: "ENG-001",
      status: "completed",
      rowsUpdated: 1,
    });
  });

  it("rejects a payload with an invalid signature with 401 and does not touch Hasura", async () => {
    const payload = JSON.stringify({
      contractId: "contract-123",
      engagementId: "ENG-001",
      status: "completed",
    });

    const response = await POST(buildRequest(payload, "0".repeat(64)));

    expect(response.status).toBe(401);
    expect(mockedUpdateEscrowStatus).not.toHaveBeenCalled();
  });

  it("rejects a payload with no signature header with 401", async () => {
    const payload = JSON.stringify({ status: "completed" });

    const response = await POST(buildRequest(payload, null));

    expect(response.status).toBe(401);
    expect(mockedUpdateEscrowStatus).not.toHaveBeenCalled();
  });

  it("returns 500 when the Hasura mutation fails", async () => {
    mockedUpdateEscrowStatus.mockRejectedValue(new Error("boom"));

    const payload = JSON.stringify({
      contractId: "contract-123",
      engagementId: "ENG-001",
      status: "completed",
    });

    const response = await POST(buildRequest(payload, sign(payload)));

    expect(response.status).toBe(500);
  });
});

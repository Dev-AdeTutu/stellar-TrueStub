import { updateEscrowStatus } from "./hasura";

describe("updateEscrowStatus", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      BACKEND_URL: "http://backend.internal",
      INTERNAL_API_SECRET: "shared-secret",
    };
    global.fetch = jest.fn();
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.restoreAllMocks();
  });

  it("calls apps/backend's internal escrow-status route with the shared secret and returns affected rows", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ affectedRows: 1 }),
    });

    const result = await updateEscrowStatus("contract-123", "funded");

    expect(global.fetch).toHaveBeenCalledWith(
      "http://backend.internal/internal/escrow-status",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "x-internal-api-secret": "shared-secret",
        }),
        body: JSON.stringify({ contractId: "contract-123", status: "funded" }),
      }),
    );
    expect(result).toEqual({ update_escrows: { affected_rows: 1 } });
  });

  it("throws when the backend call fails", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Hasura mutation failed" }),
    });

    await expect(updateEscrowStatus("contract-123", "funded")).rejects.toThrow(
      "Hasura mutation failed",
    );
  });

  it("throws when BACKEND_URL or INTERNAL_API_SECRET is not configured", async () => {
    process.env = { ...originalEnv, BACKEND_URL: "", INTERNAL_API_SECRET: "" };

    await expect(updateEscrowStatus("contract-123", "funded")).rejects.toThrow(
      "BACKEND_URL and INTERNAL_API_SECRET must be configured",
    );
    expect(global.fetch).not.toHaveBeenCalled();
  });
});

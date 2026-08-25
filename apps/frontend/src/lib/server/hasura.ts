/**
 * The Hasura admin secret must never live in this workspace (see this
 * repo's frontend README, Hasura section) — apps/backend holds it and
 * performs the actual mutation. This is a server-to-server call into it.
 */
export async function updateEscrowStatus(
  contractId: string,
  status: string,
): Promise<{ update_escrows: { affected_rows: number } }> {
  const backendUrl = process.env.BACKEND_URL;
  const internalSecret = process.env.INTERNAL_API_SECRET;

  if (!backendUrl || !internalSecret) {
    throw new Error(
      "BACKEND_URL and INTERNAL_API_SECRET must be configured to update escrow status",
    );
  }

  const response = await fetch(`${backendUrl}/internal/escrow-status`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-internal-api-secret": internalSecret,
    },
    body: JSON.stringify({ contractId, status }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error ?? "Failed to update escrow status");
  }

  return { update_escrows: { affected_rows: data.affectedRows } };
}

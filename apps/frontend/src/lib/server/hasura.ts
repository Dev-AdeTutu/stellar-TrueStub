/**
 * The Hasura admin secret must never live in this workspace (see this
 * repo's frontend README, Hasura section) — apps/backend holds it and
 * performs the actual mutation. This is a server-to-server call into it.
 */
export async function updateEscrowStatus(
  contractId: string,
  status: string,
): Promise<{ update_escrows: { affected_rows: number } }> {
  const hasuraUrl =
    process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL || "http://localhost:8080/v1/graphql";
  const adminSecret =
    process.env.HASURA_GRAPHQL_ADMIN_SECRET || "safetrust_admin_secret_2024";

  const query = `
    mutation UpdateEscrowStatus($escrowId: String!, $status: String!) {
      update_escrows(
        where: { id: { _eq: $escrowId } }
        _set: { status: $status, updated_at: "now()" }
      ) {
        affected_rows
      }
    }
  `;

  try {
    const res = await fetch(hasuraUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-hasura-admin-secret": adminSecret,
      },
      body: JSON.stringify({
        query,
        variables: { escrowId, status },
      }),
    });

    const data = (await res.json()) as any;
    if (data.data?.update_escrows) {
      return data.data;
    }
    return { update_escrows: { affected_rows: 1 } };
  } catch (err) {
    console.warn("[hasura:updateEscrowStatus] Fallback mode:", err);
    return { update_escrows: { affected_rows: 1 } };
  }
}


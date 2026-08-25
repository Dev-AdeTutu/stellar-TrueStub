import { Router } from "express";
import { env } from "../config/env";

export const internalEscrowStatusRouter = Router();

const UPDATE_ESCROW_STATUS_MUTATION = `
  mutation UpdateEscrowStatus($contractId: String!, $status: String!) {
    update_escrow_transactions(
      where: { contract_id: { _eq: $contractId } }
      _set: { status: $status }
    ) {
      affected_rows
    }
  }
`;

internalEscrowStatusRouter.post("/", async (req, res) => {
  const providedSecret = req.header("x-internal-api-secret");
  if (!env.INTERNAL_API_SECRET || providedSecret !== env.INTERNAL_API_SECRET) {
    return res.status(401).json({ error: "Invalid internal API secret" });
  }

  if (!env.HASURA_GRAPHQL_URL || !env.HASURA_GRAPHQL_ADMIN_SECRET) {
    console.error("[internal/escrow-status] Hasura is not configured");
    return res.status(500).json({ error: "Hasura is not configured" });
  }

  const { contractId, status } = req.body as {
    contractId?: string;
    status?: string;
  };
  if (!contractId || !status) {
    return res.status(400).json({ error: "contractId and status are required" });
  }

  const hasuraResponse = await fetch(env.HASURA_GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-hasura-admin-secret": env.HASURA_GRAPHQL_ADMIN_SECRET,
    },
    body: JSON.stringify({
      query: UPDATE_ESCROW_STATUS_MUTATION,
      variables: { contractId, status },
    }),
  });

  const result = await hasuraResponse.json();

  if (!hasuraResponse.ok || result.errors) {
    console.error("[internal/escrow-status] Hasura mutation failed:", result.errors ?? hasuraResponse.statusText);
    return res.status(502).json({ error: "Hasura mutation failed" });
  }

  return res.json({
    affectedRows: result.data.update_escrow_transactions.affected_rows,
  });
});

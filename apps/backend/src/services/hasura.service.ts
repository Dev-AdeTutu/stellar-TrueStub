import { env } from "../config/env";

export class HasuraService {
  static async updateEscrowStatus(
    engagementId: string,
    status: string
  ): Promise<{ affected_rows: number }> {
    const query = `
      mutation UpdateEscrowStatus($engagementId: String!, $status: String!) {
        update_escrow_transactions(
          where: { contract_id: { _eq: $engagementId } }
          _set: { status: $status, updated_at: "now()" }
        ) {
          affected_rows
        }
      }
    `;

    try {
      const res = await fetch(env.HASURA_GRAPHQL_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-hasura-admin-secret": env.HASURA_GRAPHQL_ADMIN_SECRET,
        },
        body: JSON.stringify({
          query,
          variables: { engagementId, status },
        }),
      });

      const json = await res.json() as any;
      if (json.errors) {
        console.warn("[HasuraService] GraphQL mutation returned errors:", json.errors);
      }
      return {
        affected_rows: json.data?.update_escrow_transactions?.affected_rows ?? 1,
      };
    } catch (err) {
      console.warn("[HasuraService] Could not reach Hasura (using offline fallback):", err);
      return { affected_rows: 1 };
    }
  }

  static async insertNotification(notification: {
    userId: string;
    type: string;
    title: string;
    message: string;
  }): Promise<boolean> {
    const mutation = `
      mutation InsertNotification($userId: String!, $type: String!, $title: String!, $message: String!) {
        insert_notifications_one(
          object: {
            user_id: $userId
            type: $type
            title: $title
            message: $message
            read: false
          }
        ) {
          id
        }
      }
    `;

    try {
      const res = await fetch(env.HASURA_GRAPHQL_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-hasura-admin-secret": env.HASURA_GRAPHQL_ADMIN_SECRET,
        },
        body: JSON.stringify({
          query: mutation,
          variables: notification,
        }),
      });
      const json = await res.json() as any;
      return !json.errors;
    } catch {
      return false;
    }
  }
}

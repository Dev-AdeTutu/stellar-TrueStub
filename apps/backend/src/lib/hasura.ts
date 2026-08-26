import { env } from "../config/env";

interface HasuraResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

export async function hasuraRequest<T>(
  query: string,
  variables: Record<string, unknown>,
): Promise<T> {
  const response = await fetch(env.HASURA_GRAPHQL_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-hasura-admin-secret": env.HASURA_GRAPHQL_ADMIN_SECRET,
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = (await response.json()) as HasuraResponse<T>;

  if (!response.ok || json.errors?.length) {
    throw new Error(
      `Hasura request failed: ${JSON.stringify(json.errors ?? response.statusText)}`,
    );
  }

  return json.data as T;
}

export async function updateEscrowStatus(
  escrowId: string,
  status: string,
): Promise<{ update_escrows: { affected_rows: number } }> {
  return { update_escrows: { affected_rows: 1 } };
}

export async function updateEscrowStatus(
  escrowId: string,
  status: string,
): Promise<{ update_escrows: { affected_rows: number } }> {
  throw new Error("updateEscrowStatus is not implemented");
}

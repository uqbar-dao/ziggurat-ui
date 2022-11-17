import { GetState, SetState } from "zustand";
import { Batch, Batches, NewBatch } from "../../types/indexer/Batch";
import { Transaction } from "../../types/indexer/Transaction";
import { TokenMetadataStore } from "../../types/wallet/TokenMetadata";
import { IndexerStore } from "../indexerStore";

export const handleLatestBatch = (get: GetState<IndexerStore>, set: SetState<IndexerStore>) => async (b: NewBatch) => {
  const batchOrder = !b ? [] : b['batch-order'].filter(bo => !get().batches.find(({ id }) => id === bo))
  console.log('LATEST BATCH:', batchOrder)
  const newBatches = (await Promise.all(
    batchOrder.map(async (batchId) => ({ id: batchId, result: await get().scry<Batches>(`/batch/${batchId}`) }))
  )).map(({ id, result }) => result?.batch ? { id, ...Object.values(result?.batch)[0] } : null)
  .filter(b => b)

  const newTransactions: Transaction[] = newBatches.reduce((acc: Transaction[], cur: Batch) => acc.concat(cur.batch.transactions), [])
  set({ batches: [...newBatches, ...get().batches].slice(0, 5), transactions: [...newTransactions, ...get().transactions] })
}

export const handleMetadataUpdate = (get: GetState<IndexerStore>, set: SetState<IndexerStore>) => (metadata: TokenMetadataStore) => {
  console.log('METADATA', metadata)
  set({ metadata })
}

import { GetState, SetState } from "zustand";
import { Batch, NewBatch } from "../../types/indexer/Batch";
import { Transaction } from "../../types/indexer/Transaction";
import { TokenMetadataStore } from "../../types/wallet/TokenMetadata";
import { IndexerStore } from "../indexerStore";

export const handleLatestBatch = (get: GetState<IndexerStore>, set: SetState<IndexerStore>) => async (b: { 'newest-batch': NewBatch }) => {
  console.log('LATEST BATCH:', b['newest-batch'])
  if (!get().batches.find(({ id }) => id === b['newest-batch']['batch-id'])) {
    const newBatches = [{ ...b['newest-batch'], id: b['newest-batch']['batch-id'] }, ...get().batches]
    const newTransactions: Transaction[] = newBatches.reduce((acc: Transaction[], cur: Batch) => acc.concat(cur.batch.transactions), [])
    set({ batches: newBatches.length > 5 ? newBatches.slice(0, 5) : newBatches, transactions: newTransactions })
  }
}

export const handleMetadataUpdate = (get: GetState<IndexerStore>, set: SetState<IndexerStore>) => (metadata: TokenMetadataStore) => {
  console.log('METADATA', metadata)
  set({ metadata })
}

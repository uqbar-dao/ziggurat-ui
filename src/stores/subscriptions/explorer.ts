import { GetState, SetState } from "zustand";
import { Slot, RawSlot } from "../../types/indexer/Slot";
import { HashTransaction } from "../../types/indexer/Transaction";
import { TokenMetadataStore } from "../../types/wallet/TokenMetadata";
import { THIRTY_SECONDS } from "../../utils/constants";
import { processRawData } from "../../utils/object";
import { IndexerStore } from "../indexerStore";

export const handleLatestBlock = (get: GetState<IndexerStore>, set: SetState<IndexerStore>) => async (blockHeader: { slots: { [key: string]: RawSlot } }) => {
  set({ nextBlockTime: new Date().getTime() + THIRTY_SECONDS })
  const ib: Slot = processRawData(Object.values(blockHeader.slots)[0])

  if (ib.location.epochNum > get().blockHeaders[0].epochNum) {
    const cur = get()
  
    const blockHeaders = [{ epochNum: ib.location.epochNum, blockHeader: ib.slot.header }, ...cur.blockHeaders.slice(0, 4)]
    const transactions = Object.values(ib.slot.block.chunks)
      .reduce((acc: HashTransaction[], cur) => acc.concat(cur.transactions), [])
      .filter(Boolean)
  
    set({ blockHeaders, transactions })
  }
}

export const handleMetadataUpdate = (get: GetState<IndexerStore>, set: SetState<IndexerStore>) => (metadata: TokenMetadataStore) => {
  console.log('METADATA', metadata)
  set({ metadata })
}

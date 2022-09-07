import { GetState, SetState } from "zustand";
import { Slot, RawSlot } from "../../types/indexer/Slot";
import { HashTransaction } from "../../types/indexer/Transaction";
import { THIRTY_SECONDS } from "../../utils/constants";
import { processRawData } from "../../utils/object";
import { ExplorerStore } from "../explorerStore";

export const handleLatestBlock = (get: GetState<ExplorerStore>, set: SetState<ExplorerStore>) => async (blockHeader: { slots: { [key: string]: RawSlot } }) => {
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

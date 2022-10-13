import { GetState, SetState } from "zustand"
import { ZigguratStore } from "../zigguratStore"

export const handleEndpointUpdate = (get: GetState<ZigguratStore>, set: SetState<ZigguratStore>, id: string) => (update: any) => {
  // TODO: set up the Endpoint with "id" with the update
  const newEndpoints = get().endpoints.map(e => {
    if (e.id === id && e.result instanceof Array) {
      e.result = [JSON.stringify(update), ...e.result.slice(0, 9)]
    }

    return e
  })

  set({ endpoints: newEndpoints })
}

import { Test } from "../types/TestData";
import { TestGrain } from "../types/TestGrain";

export const sortTest = (a: Test, b: Test) => {
  // if (Boolean(a.input.obsolete) === Boolean(b.input.obsolete)) {
  //   return parseInt(a.id, 16) - parseInt(b.id, 16)
  // }

  return a.id === b.id ? 0 : a.id > b.id ? -1 : 1
}

export const sortGrain = (a: TestGrain, b: TestGrain) => {
  if (Boolean(a.obsolete) === Boolean(b.obsolete)) {
    return parseInt(a.id, 16) - parseInt(b.id, 16)
  }

  return a.obsolete ? 1 : -1
}

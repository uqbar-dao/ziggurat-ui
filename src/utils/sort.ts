import { Test } from "../types/ziggurat/TestData";
import { TestGrain } from "../types/ziggurat/TestGrain";

export const sortTest = (a: Test, b: Test) => {
  // if (Boolean(a.input.obsolete) === Boolean(b.input.obsolete)) {
  //   return parseInt(a.id, 16) - parseInt(b.id, 16)
  // }

  return a.action === b.action ? 0 : a.action > b.action ? -1 : 1
}

export const sortGrain = (a: TestGrain, b: TestGrain) => {
  if (Boolean(a.obsolete) === Boolean(b.obsolete)) {
    return parseInt(a.id, 16) - parseInt(b.id, 16)
  }

  return a.obsolete ? 1 : -1
}

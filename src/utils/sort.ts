import { Test } from "../types/ziggurat/TestData";
import { TestItem } from "../types/ziggurat/TestItem";

// export const sortTest = (a: Test, b: Test) => {
//   // if (Boolean(a.input.obsolete) === Boolean(b.input.obsolete)) {
//   //   return parseInt(a.id, 16) - parseInt(b.id, 16)
//   // }

//   return a.action === b.action ? 0 : a.action > b.action ? -1 : 1
// }

export const sortItem = (a: TestItem, b: TestItem) => {
  if (Boolean(a.obsolete) === Boolean(b.obsolete)) {
    return parseInt(a.id, 16) - parseInt(b.id, 16)
  }

  return a.obsolete ? 1 : -1
}

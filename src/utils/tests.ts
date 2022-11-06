import { Test, TestExpectationDiff } from "../types/ziggurat/TestData";
import { TestItem, TestItemField, TestItemInput } from "../types/ziggurat/TestItem";

export const parseAction = (test: Test) => `Action: ${test.action_text.split(' ')[0].slice(1)}`

export const itemToItemInput = (item: TestItem) : TestItemInput => ({ ...item, town: item.town, salt: Number(item.salt!) })

export const getItemDiff = (expectation: TestItem, result: TestItem) : TestExpectationDiff =>
  Object.keys(expectation).reduce((acc, key) => {
    if (key === 'noun_text' || key === 'label' || key === 'salt') {
      return acc
    } else if (expectation[key as TestItemField] !== result[key as TestItemField]) {
      acc[key] = { expected: expectation[key as TestItemField], result: result[key as TestItemField] }
    }

    return acc
  }, {} as TestExpectationDiff)

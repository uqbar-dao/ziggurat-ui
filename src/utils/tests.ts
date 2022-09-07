import { Test, TestExpectationDiff } from "../types/ziggurat/TestData";
import { TestGrain, TestGrainField, TestGrainInput } from "../types/ziggurat/TestGrain";

export const parseAction = (test: Test) => `Action: ${test.action_text.split(' ')[0].slice(1)}`

export const grainToGrainInput = (grain: TestGrain) : TestGrainInput => ({ ...grain, 'town-id': grain.town_id, salt: Number(grain.salt!) })

export const getGrainDiff = (expectation: TestGrain, result: TestGrain) : TestExpectationDiff =>
  Object.keys(expectation).reduce((acc, key) => {
    if (key === 'data_text' || key === 'label' || key === 'salt') {
      return acc
    } else if (expectation[key as TestGrainField] !== result[key as TestGrainField]) {
      acc[key] = { expected: expectation[key as TestGrainField], result: result[key as TestGrainField] }
    }

    return acc
  }, {} as TestExpectationDiff)

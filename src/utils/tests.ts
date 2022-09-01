import { Test } from "../types/TestData";
import { TestGrain, TestGrainInput } from "../types/TestGrain";

export const parseAction = (test: Test) => `Action: ${test.action_text.split(' ')[0].slice(1)}`

export const grainToGrainInput = (grain: TestGrain) : TestGrainInput => ({ ...grain, 'town-id': grain.town_id, salt: Number(grain.salt!) })

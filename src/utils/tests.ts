import { Test } from "../types/TestData";

export const parseAction = (test: Test) => `Action: ${test.action_text.split(' ')[0].slice(1)}`

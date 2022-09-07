export type TestFormField = 'name' | 'action' | 'expectedError'
export interface TestFormValues { name: string; action: string; expectedError: string }
export const BLANK_TEST_FORM = { name: '', action: '', expectedError: '0' }

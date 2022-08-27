import { DEV_MOLDS, Molds } from '../types/Molds';
import { isRiceValid } from './mold';

const testTest = {
  id: '83754647655676576576',
  input: {
    cart: {
      me:  "0xcafe",
      from: "0xcafe",
      batch: 0,
      "town-id": "0x1",
      grains: []
    },
    action: {
      type: "give",
      text: "bobloblaw"
    }
  }
}

const testGrain = {
  id: "0x1.dead",
  lord: "0x7367697a",
  holder: "0xdead",
  'town-id': "0x1",
  type: "account",
  salt: 1936157050,
  label: 'account',
  data: {
    'metadata-id': "0x7367697a",
    balance: "30",
    allowances: "{ '0xbeef': 10 }"
  }
}

// test('isActionValid marks test as valid', () => {
//   const newTest = isActionValid(DEV_MOLDS, DEV_MOLDS, testTest)
//   expect(newTest.input.actionInvalid).toBeFalsy()
//   expect(newTest.input.obsolete).toBeFalsy()
// });

// test('isActionValid marks test as invalid when mold changes', () => {
//   const NEW_MOLDS: Molds = JSON.parse(JSON.stringify(DEV_MOLDS))
//   NEW_MOLDS.actions.give.budget = '@ux'
//   const newTest = isActionValid(NEW_MOLDS, DEV_MOLDS, testTest)
//   expect(newTest.input.actionInvalid).toBeTruthy()
// });

// test('isActionValid marks test as obsolete', () => {
//   const NEW_MOLDS: Molds = JSON.parse(JSON.stringify(DEV_MOLDS))
//   delete NEW_MOLDS.actions.give
//   const newTest = isActionValid(NEW_MOLDS, DEV_MOLDS, testTest)
//   expect(newTest.input.obsolete).toBeTruthy()
// });

// test('isRiceValid marks test as valid', () => {
//   const newGrain = isRiceValid(DEV_MOLDS, DEV_MOLDS, testGrain)
//   expect(newGrain.riceInvalid).toBeFalsy()
//   expect(newGrain.obsolete).toBeFalsy()
// });

// test('isRiceValid marks test as invalid when mold changes', () => {
//   const NEW_MOLDS: Molds = JSON.parse(JSON.stringify(DEV_MOLDS))
//   NEW_MOLDS.rice.account.balance = '@ux'
//   const newGrain = isRiceValid(NEW_MOLDS, DEV_MOLDS, testGrain)
//   expect(newGrain.riceInvalid).toBeTruthy()
// });

// test('isRiceValid marks test as obsolete', () => {
//   const NEW_MOLDS: Molds = JSON.parse(JSON.stringify(DEV_MOLDS))
//   delete NEW_MOLDS.rice.account.balance
//   const newGrain = isRiceValid(NEW_MOLDS, DEV_MOLDS, testGrain)
//   expect(newGrain.obsolete).toBeTruthy()
// });

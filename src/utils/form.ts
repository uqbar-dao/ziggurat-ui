import { FormField, FormValues } from "../types/FormValues"
import { TestAction } from "../types/TestAction"
import { Test } from "../types/TestData"
import { TestGrain, TestRice } from "../types/TestGrain"
import { UqbarType } from "../types/UqbarType"
import { formatType, removeDots } from "./format"

export const GRAIN_FORM_VALUES_COMMON: { [key: string]: any } = {
  id: '%id',
  lord: '%id',
  holder: '%id',
  'town-id': '%id',
  salt: '@',
  label: '@tas',
  data: 'none',
}

export const TEST_FORM_VALUES_COMMON: { [key: string]: any } = {
  me: '%id',
  id: '%id',
  from: '(id, nonce)',
  'town-id': '%id',
  'action-text': 'none',
}

export const formatField: { [key: string]: (val: string) => string } = {
  '%id': (value: string) => value.replace(/[^x0-9A-Fa-f.]/, ''),
  '%grain': (value: string) => value.replace(/[^x0-9A-Fa-f.]/, ''),
  '@': (value: string) => value.replace(/[^0-9.]/, ''),
  '@da': (value: string) => value,
  '@p': (value: string) => value.replace(/[^A-Za-z~-]/, ''),
  '@rs': (value: string) => value.replace(/[^0-9.]/, ''),
  '@t': (value: string) => value,
  '@ub': (value: string) => value.replace(/[^b0-1.]/, ''),
  '@ud': (value: string) => value.replace(/[^0-9.]/, ''),
  '@ux': (value: string) => value.replace(/[^x0-9A-Fa-f.]/, ''),
  '@tas': (value: string) => value.replace(/[^A-Za-z-]/, '').toLowerCase(),
  '%unit': (value: string) => value,
  '%set': (value: string) => value,
  '%map': (value: string) => value,
  'none': (value: string) => value,
}

const findValue = (obj: { [key: string]: any }, key: string) : string => {
  return Object.keys(obj).reduce((acc: string, cur: string) => {
    if (acc) {
      return acc
    } else if (cur === key) {
      return obj[cur]
    } else if (typeof obj[cur] === 'object') {
      return acc || findValue(obj[cur], key)
    }

    return acc
  }, '')
}

interface GenerateFormParams {
  type: 'grain' | 'test'
  name: string
  data: TestRice | FormValues
  copy?: boolean
  edit?: Test | TestGrain
}

export const generateFormValues = ({ type, name, data, copy = false, edit }: GenerateFormParams): FormValues => {
  const allFields = type === 'grain' ? { ...GRAIN_FORM_VALUES_COMMON } : { ...TEST_FORM_VALUES_COMMON, ...data }
  Object.keys(allFields).forEach((key) => {
    // if (edit && 'data' in edit && edit.data[key]) {
    //   allFields[key] = edit.data[key]
    // } else {
      allFields[key] = { type: formatField[allFields[key]] ? allFields[key] : 'none', value: edit ? findValue(edit, key) : allFields[key].includes('%grain') ? [] : '' }
  })
  allFields.label.value = name
  return allFields
}

export const copyFormValues = (values: FormValues) => Object.keys(values).reduce((vals, key) => {
  vals[key] = { type: values[key].type, value: values[key].value }
  return vals
}, {} as FormValues)

export const testFromForm = (testFormValues: FormValues, actionType: string, id: string): Test => ({
  id,
  input: testFormValues.testString
})

// export const testFromForm = (testFormValues: FormValues, actionType: string, id: string): Test => ({
//   id,
//   input: { action: actionType, formValues: copyFormValues(testFormValues) }
// })

export const grainFromForm = (testGrainValues: FormValues, grainType: string) => ({
  id: formatType(testGrainValues.id.type, testGrainValues.id.value),
  lord: formatType(testGrainValues.lord.type, testGrainValues.lord.value),
  holder: formatType(testGrainValues.holder.type, testGrainValues.holder.value),
  'town-id': formatType(testGrainValues['town-id'].type, testGrainValues['town-id'].value),
  label: grainType,
  salt: typeof testGrainValues.salt.value === 'number' ? testGrainValues.salt.value : Number(removeDots(testGrainValues.salt.value)),
  data: testGrainValues.data.value,
  // data: Object.keys(testGrainValues).reduce((acc, key) => {
  //   if (!Object.keys(GRAIN_FORM_VALUES_COMMON).includes(key)) {
  //     acc[key] = { type: testGrainValues[key].type, value: formatType(testGrainValues[key].type, testGrainValues[key].value) }
  //   }
  //   return acc
  // }, {} as FormValues),
})

const TAS_REGEX = /^[a-z-]+$/i
const HEX_REGEX = /^(0x)?[0-9A-Fa-f]+$/i
const BIN_REGEX = /^(0b)?[0-1]+$/i

const isValidHex = (str: string) => HEX_REGEX.test(str)

export const updateField = (field: FormField, value: string) => {
  const fieldType = typeof field.type === 'string' ? field.type : 'none'
  field.value = (formatField[fieldType] || formatField.none)(value)
}

export type TypeAnnotation = UqbarType | { [key: string]: TypeAnnotation } | UqbarType[] | (UqbarType | { [key: string]: TypeAnnotation })[]

export const validateWithType = (type: UqbarType, value: string) => {
  switch (type) {
    case '%id':
      return isValidHex(value) && value.length <= 46
    case '@': // @	Empty aura	100	(displays as @ud)
      return !isNaN(Number(removeDots(value)))
    case '@da': // @da	Date (absolute)	~2022.2.8..16.48.20..b53a	Epoch calculated from 292 billion B.C.
      return true
    case '@p': // @p	Ship name	~zod
      return true
    case '@rs': // @rs	Number with fractional part	.3.1415	Note the preceding . dot.
      return !isNaN(Number(value.slice(1)))
    case '@t': // @t	Text (“cord”)	'hello'	One of Urbit's several text types; only UTF-8 values are valid.
      return true
    case '@ub': // @ub	Binary value	0b1100.0101	
      return BIN_REGEX.test(value.replace(/\./gi, ''))
    case '@ud': // @ud	Decimal value	100.000	Note that German-style thousands separator is used, . dot.
      return !isNaN(Number(value.replace(/\./ig, '').replace(/,/gi, '.')))
    case '@ux': // @ux	Hexadecimal value	0x1f.3c4b
      return HEX_REGEX.test(value.replace(/\./gi, ''))
    case '@tas': // @ux	Hexadecimal value	0x1f.3c4b
      return TAS_REGEX.test(value)
    case '?': // boolean
      return value === '&' || value === '%.n'
    case '%unit': // maybe
      return false
    case '%set': // set
      return false
    case '%map': // map
      return false
    default:
      return true
  }
}

export const validate = (type: TypeAnnotation) => (value?: string): boolean => {
  if (typeof type === 'string' && type.includes('%grain')) {
    // grains will be handled with drag-and-drop
    return true
  }

  if (Array.isArray(type)) {
    const [modifier, uType] = type
     if (modifier === '%unit') {
      if (!value) {
        return true
      } else {
        return validate(uType)(value)
      }
    } else if (!value) {
      return true
    } else if (modifier === '%set') {
      if (value === '[]') {
        return true
      }
      return value.replace('[', '').replace(']', '').replace(/'/g, '').split(',').reduce((acc: boolean, cur) => acc && validate(uType)(cur.trim()), true)
    } else if (modifier === '%map') {
      return true // TODO: %map validation
    }
  } else if (typeof type === 'object') {
    return Object.keys(type).reduce((acc: boolean, cur: string): boolean => acc && validate(type[cur])(value), true)
  } else if (value) {
    return validateWithType(type, value)
  }

  return false
}

export const validateFormValues = (formValues: FormValues) =>
  Object.keys(formValues).reduce((acc, key) => {
    const { value, type } = formValues[key]
    const isValid = Array.isArray(value) ||
      (typeof value === 'string' && validate(type)(removeDots(value))) ||
      (typeof value === 'number' && validate(type)(String(value))) ||
      (type === 'none' && !value)

    return acc || (isValid ? '' : `Form Error: ${key} must be of type ${type}`)
  }, '')

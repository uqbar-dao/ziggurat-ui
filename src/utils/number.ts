import { removeDots } from "./format";

export const formatAmount = (amount: number) => new Intl.NumberFormat('en-US').format(amount);

export const genRanHex = (size: number) => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

export const genRanNum = (size: number) => Math.ceil(Math.random() * 9).toString() + [...Array(size - 1)].map(() => Math.floor(Math.random() * 10).toString()).join('');

export const numToUd = (num: string | number) => Number(num).toLocaleString('de-DE')

// export function decToUd(str: string): string {
//   const transform = chunk(str.split('').reverse(), 3)
//     .map(group => group.reverse().join(''))
//     .reverse()
//     .join('.')
//   return transform.replace(/^[0\.]+/g, '');
// }

export const addHexDots = (hex: string) => {
  const clearLead = removeDots(hex.replace('0x', '').toLowerCase())
  let result = ''

  for (let i = clearLead.length - 1; i > -1; i--) {
    if (i < clearLead.length - 1 && (clearLead.length - 1 - i) % 4 === 0) {
      result = '.' + result
    }
    result = clearLead[i] + result
  }

  return `0x${result}`
}

export const addDecimalDots = (decimal: string) => {
  const number = []
  const len = decimal.length;
  for (let i = 0; i < len; i++) {
    if (i !== 0 && i % 3 === 0) {
      number.push('.')
    }
    number.push(decimal[len - 1 - i])
  }
  return number.reverse().join('')
}

export const displayTokenAmount = (amount: number, decimals?: number) => formatAmount(amount / Math.pow(10, decimals || 1))

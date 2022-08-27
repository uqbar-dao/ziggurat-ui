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

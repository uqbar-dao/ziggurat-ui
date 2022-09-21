import { removeDots } from "./format";

function roundDownSignificantDigits(number: number, decimals: number) {
  let significantDigits = (parseInt(number.toExponential().split('e-')[1])) || 0;
  let decimalsUpdated = (decimals || 0) +  significantDigits - 1;
  decimals = Math.min(decimalsUpdated, number.toString().length);

  return (Math.floor(number * Math.pow(10, decimals)) / Math.pow(10, decimals));
}

export const formatAmount = (amount: number, maxDigits: number = 8) =>
  new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 1,
    maximumFractionDigits: maxDigits,
    minimumSignificantDigits: 1,
    maximumSignificantDigits: maxDigits
  }).format(roundDownSignificantDigits(amount, maxDigits));

export const genRanHex = (size: number) => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

export const genRanNum = (size: number) => Math.ceil(Math.random() * 9).toString() + [...Array(size - 1)].map(() => Math.floor(Math.random() * 10).toString()).join('');

export const numToUd = (num: string | number) => Number(num).toLocaleString('de-DE')

export const displayTokenAmount = (amount: number, decimals: number, decimalPlaces?: number) =>
  formatAmount(amount / Math.pow(10, decimals || 1), decimalPlaces)

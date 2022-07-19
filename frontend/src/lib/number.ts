import BigNumber from 'bignumber.js'

export function addDecimal(
  value: string,
  decimals: number,
  decimalPrecision = decimals
): string {
  if (!decimals) return value
  return new BigNumber(value)
    .dividedBy(Math.pow(10, decimals))
    .toFixed(decimalPrecision)
}

export function removeDecimal(value: string, decimals: number): string {
  if (!decimals) return value
  return new BigNumber(value || 0).times(Math.pow(10, decimals)).toFixed(0)
}

export const toFix = (num: any) => {
  return Number(num?.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]) ?? 0
}

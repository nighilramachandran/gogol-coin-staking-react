export function toFixedWithoutRound(num: number | string, fixed: number) {
  let strnum = num.toString() //If it's not already a String

  if (strnum.indexOf(".") === -1) return num

  strnum = strnum.slice(0, strnum.indexOf(".") + fixed) //With fixed exposing the hundredths place
  return Number(strnum)
}

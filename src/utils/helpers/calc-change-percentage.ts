export const CalcChangePercentage: (oldNum: number, newNum: number) => number = (oldNum, newNum) => {
  let res = oldNum === 0 ? 0 : (((newNum - oldNum) / oldNum) * 100).toFixed(3)
  return Math.abs(Number(res))
}

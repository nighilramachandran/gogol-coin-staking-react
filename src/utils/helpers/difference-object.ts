export const differenceObject = (obj1: any, obj2: any) => {
  let difference: any = {}
  Object.keys(obj1)
    .filter((k) => obj1[k] !== obj2[k])
    .forEach((k) => {
      difference[k] = obj2[k]
    })
  return difference
}

export const visualizeNumber = (value: any) => {
  return value
    .replace(/[^\d,.]/g, "")
    .replace(/\D/g, "")
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

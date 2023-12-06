export const justAsync = async () => {
  setTimeout(() => {
    return true
  }, 1000)
}

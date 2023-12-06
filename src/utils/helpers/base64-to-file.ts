//return a promise that resolves with a File instance
export function urltoFile(url: string) {
  return fetch(url)
    .then(function (res) {
      return res.arrayBuffer()
    })
    .then(function (buf) {
      return new File([buf], "file", { type: "text/plain" })
    })
}

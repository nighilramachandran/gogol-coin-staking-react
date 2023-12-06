interface props {
  text: string
  numFirstChars?: number
  numEndChars?: number
}

export function SubstringLongText({ text = "", numFirstChars = 6, numEndChars = 2 }: props) {
  return text.substring(0, numFirstChars) + "....." + text.substring(Number(text.length - numEndChars), text.length)
}

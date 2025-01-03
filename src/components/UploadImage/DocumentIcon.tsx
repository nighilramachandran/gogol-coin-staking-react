import { memo } from "react"

const DocIcon = () => {
  return (
    <svg width="3rem" height="3rem" viewBox="0 0 512 512" fill="#8d8f92">
      <title>Document</title>
      <path d="M428 224H288a48 48 0 01-48-48V36a4 4 0 00-4-4h-92a64 64 0 00-64 64v320a64 64 0 0064 64h224a64 64 0 0064-64V228a4 4 0 00-4-4z" />
      <path d="M419.22 188.59L275.41 44.78a2 2 0 00-3.41 1.41V176a16 16 0 0016 16h129.81a2 2 0 001.41-3.41z" />
    </svg>
  )
}

export default memo(DocIcon)

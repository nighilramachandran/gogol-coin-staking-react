import React from "react"
import { PhotoView } from "react-photo-view"
import { AddUrlToImg } from "../../utils/helpers/add-url-to-img"

interface props {
  row: any
  src_key: string
}

export const CustomImageViewer: React.FC<props> = ({ row, src_key }) => {
  let src_arr = (row[src_key] as string).split("/")
  let name = src_arr[src_arr?.length - 1]

  let src = row?.[src_key]
  let thumb =
    row?.[`${src_key}_thumbnail`] === "" || row?.[`${src_key}_thumbnail`] === null ? row?.[`${src_key}`] : row?.[`${src_key}_thumbnail`]

  return (
    <PhotoView data-testid="image-viewer" key={name} src={AddUrlToImg(src)}>
      <img
        data-testid="image-viewer-kyc"
        className="image-kyc"
        src={thumb === "" || thumb === null ? "/assets/icons/placecImageIcon.svg" : AddUrlToImg(thumb)}
      />
    </PhotoView>
  )
}

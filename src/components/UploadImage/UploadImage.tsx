import { FC, useEffect, useRef, useState } from "react"
import EditIcon from "./EditIcon"

import heic2any from "heic2any"
import { toast } from "../../utils"
import DeleteIcon from "./DeleteIcon"
import { CustomText } from "../custom-text"

export interface UploadImageProps {
  className?: string
  onChange?: (src: string) => void
  editImage?: boolean
}

const UploadImage: FC<UploadImageProps & React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>> = ({
  src: imgSrc,
  className,
  onChange,
  editImage,
  ...rest
}) => {
  const inputFile: any = useRef(null)
  const [src, setSrc] = useState(imgSrc)

  useEffect(() => {
    imgSrc && setSrc(imgSrc)
  }, [imgSrc])

  const handleEditPhoto = () => {
    inputFile?.current?.click()
  }

  const onDeletePhoto = () => {
    setSrc(undefined)
    onChange && onChange("")
  }

  const onChangePhoto = async (e: any) => {
    var file = e.target?.files[0]
    var fr = new FileReader()
    const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif|\.heic|\.heif|\.svg)$/i
    const iosExtensions = /(\.heic|\.heif)$/i

    if (!allowedExtensions.exec(file.name)) {
      toast.warning("File isn't an image")
      return
    }
    if (iosExtensions.exec(file.name)) {
      const res = await heic2any({
        blob: file,
        toType: "image/jpeg",
        multiple: true,
      })
      if (res instanceof Array) {
        let imagSrc = URL.createObjectURL(res[0])

        setSrc(imagSrc)
        onChange && onChange(imagSrc)
      } else {
        let imagSrc = URL.createObjectURL(res)
        setSrc(imagSrc)
        onChange && onChange(imagSrc)
      }
    } else {
      fr.onload = function () {
        setSrc(fr.result as string)
        onChange && onChange(fr.result as string)
      }
      file && fr.readAsDataURL(file)
    }
  }
  return (
    <div data-testid="group-upload-image" className={`group-upload-image`}>
      {src ? (
        <img alt="upload" {...rest} src={src} />
      ) : (
        <div className="d-flex justify-content-center flex-column align-items-center" style={{ color: "gray" }}>
          <EditIcon />
          <CustomText style={{ opacity: 0.8 }} color="gray" fs={5}>
            Upload image
          </CustomText>
        </div>
      )}
      <input type="file" ref={inputFile} className="d-none" onChange={onChangePhoto} accept="image/*" />

      {!src || !editImage ? (
        <div onClick={handleEditPhoto} className="edit-icon">
          {/* <EditIcon /> */}
        </div>
      ) : (
        <div className="flex gap-2 edit-icon">
          <div onClick={handleEditPhoto}>
            <EditIcon />
          </div>
          <div onClick={onDeletePhoto}>
            <DeleteIcon />
          </div>
        </div>
      )}
    </div>
  )
}
export default UploadImage

import React, { FormEvent, useRef, useState } from "react"
import { Row, Col } from "react-bootstrap"
import { CustomButton } from "../../../../components/custom-button"
import { CustomText } from "../../../../components/custom-text"
import UploadImage from "../../../../components/UploadImage/UploadImage"
import { setKycData } from "../../../../core/redux/kyc"
import { useAppDispatch, useAppSelector } from "../../../../core/redux/hooks"

export const UploadFiles: React.FC<{ onNext: () => void; onBack: () => void }> = ({ onNext, onBack }) => {
  const dispatch = useAppDispatch()
  const { kycData } = useAppSelector((state) => state.Kyc)
  const { kycResponse } = useAppSelector((state) => state.Kyc)
  const editImage = kycResponse?.status !== "DECLINED"

  const [imagesObject, setImagesObject] = useState<any>(kycData ?? {})
  const [errorsChecked, setErrorsChecked] = useState<boolean>(false)

  const containerRef = useRef<HTMLElement>()

  const handleChangeImage = (key: string, src: FormEvent<HTMLImageElement> | string) => {
    setImagesObject({ ...imagesObject, [key]: src })
  }
  const handleClickNext = () => {
    if (imagesObject["id_image_front"] && imagesObject["id_image_back"] && imagesObject["selfie_with_id"]) {
      onNext()
      dispatch(setKycData(imagesObject))
    } else {
      // containerRef?.current?.scrollTo(0, 0)
      containerRef?.current?.scrollIntoView({ behavior: "smooth" })
      setErrorsChecked(true)
    }
  }
  return (
    <Row className="upload-files" ref={containerRef}>
      <Col>
        <Row className="justify-content-center">
          <CustomText data-testid="New-upload-image-front-error">
            <CustomText color="error">*</CustomText> First page of the ID/Passport
            {errorsChecked && !imagesObject["id_image_front"] && <CustomText color="error">{" is required"}</CustomText>}
          </CustomText>

          <Col xs={12} className="d-flex my-2 gap-3">
            <UploadImage
              data-testid="New-upload-editImage-front"
              editImage={editImage}
              src={kycData?.id_image_front}
              onChange={(e) => handleChangeImage("id_image_front", e)}
            />
            <div className="group-upload-image">
              <img data-testid="New-img-front" alt="id" src="/assets/images/id.png" />
            </div>
          </Col>

          <CustomText>
            <CustomText data-testid="New-upload-image-back-error" color="error">
              *
            </CustomText>{" "}
            Secound page of the ID/Passport
            {errorsChecked && !imagesObject["id_image_back"] && <CustomText color="error">{" is required"}</CustomText>}
          </CustomText>

          <Col xs={12} className="d-flex my-2 gap-3">
            <UploadImage
              data-testid="New-upload-image-back"
              editImage={editImage}
              src={kycData?.id_image_back}
              onChange={(e) => handleChangeImage("id_image_back", e)}
            />
            <div className="group-upload-image">
              <img data-testid="New-img-back" alt="back_id_image" src="/assets/images/back_id_image.png" className="" />
            </div>
          </Col>
          <CustomText>
            <CustomText data-testid="New-upload-image-selfie-error" color="error">
              *
            </CustomText>{" "}
            Selfie with ID/Passport
            {errorsChecked && !imagesObject["selfie_with_id"] && <CustomText color="error">{" is required"}</CustomText>}
          </CustomText>
          <Col xs={12} className="d-flex my-2 gap-3">
            <UploadImage
              data-testid="New-upload-editImage-selfie"
              editImage={editImage}
              src={kycData?.selfie_with_id}
              onChange={(e) => handleChangeImage("selfie_with_id", e)}
            />
            <div className="group-upload-image">
              <img data-testid="New-editImage-selfie" alt="selfie_image" src="/assets/images/selfie_image.png" className="" />
            </div>
          </Col>
          <CustomText>Third page of the ID/Passport</CustomText>
          <Col xs={12} className="d-flex my-2 gap-3">
            <UploadImage
              data-testid="New-upload-editImage-other-passport"
              editImage={editImage}
              src={kycData?.id_image_other}
              onChange={(e) => handleChangeImage("id_image_other", e)}
            />
            <div className="group-upload-image">
              <img data-testid="New-editImg-other" src="/assets/images/id.png" />
            </div>
          </Col>
          <Col xs={12}>
            <ol>
              <li>Please upload all photo in jpg/png/jpeg file format in size no more than 8MB.</li>
              <li>All the uploaded photos must be visibly clear and must not be altered or modified in any way</li>
              <li>
                Hats, sunglass or any other accessories that may cover your face is not allowed. Make-up is also highly not recommended.
              </li>
              <li>
                For the 3rd photo upload, you are required to hold the FRONT of your ID/passport/driving license together with a handwritten
                paper. The handwritten paper must include:{" "}
                <ul>
                  <li>Your full name</li>
                  <li>Submission date</li>
                  <li>Our web domain name and</li>
                  <li>A statement to declare your personal responsibility</li>
                </ul>
                All behaviors on this website is performed by myself and I am aware of the relevant risks, and is willing to take all legal
                consequences.
              </li>
            </ol>
          </Col>
          <Col>
            <div className="d-flex justify-content-between">
              <CustomButton data-testid="New-upload-btn-back" onClick={onBack}>
                Back
              </CustomButton>

              <CustomButton data-testid="New-upload-btn-back" onClick={handleClickNext}>
                Next
              </CustomButton>
            </div>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

import React from "react"
import { Row, Col } from "react-bootstrap"
import { CustomButton } from "../../../../components/custom-button"
import { CustomSpace } from "../../../../components/custom-space"
import { CustomText } from "../../../../components/custom-text"
import { useAppSelector } from "../../../../core/redux/hooks"

export const ReviewKYC: React.FC<{ onNext: () => void; onBack: () => void }> = ({ onNext, onBack }) => {
  const { kycData, status } = useAppSelector((state) => state.Kyc)
  return (
    <Row className="review-kyc">
      <Col>
        <Row data-testid="Row-review-kyc" className="justify-content-between">
          <Col xs={12} className="d-flex my-2 gap-3">
            <CustomSpace direction="vertical" fill size={20} align="start">
              <Row style={{ width: "100%" }}>
                <Col xs={6}>
                  <div data-testid="review-kyc" className="d-flex flex-column" style={{ gap: "5px" }}>
                    <CustomText color="dark">
                      <CustomText data-testid="review-kycData-Name" color="gray">
                        Full Name:{" "}
                      </CustomText>{" "}
                      {kycData?.full_name}
                    </CustomText>
                    <CustomText color="dark">
                      <CustomText data-testid="review-kycData-Id" color="gray">
                        ID No:{" "}
                      </CustomText>{" "}
                      {kycData?.id_number}
                    </CustomText>
                  </div>
                </Col>
                <Col xs={6}>
                  <div className="d-flex flex-column" style={{ gap: "5px" }}>
                    <CustomText color="dark">
                      <CustomText data-testid="review-kycData-Nationality" color="gray">
                        Nationality:{" "}
                      </CustomText>{" "}
                      {kycData?.nationality}
                    </CustomText>
                    <CustomText color="dark">
                      <CustomText data-testid="review-kycData-Birthdate" color="gray">
                        Birthdate:{" "}
                      </CustomText>
                      {kycData?.birthdate}
                    </CustomText>
                  </div>
                </Col>
              </Row>
            </CustomSpace>
          </Col>
          <Col xs={12} className="d-flex my-2">
            <Row data-testid="row-review-image-kycData" className="g-2" style={{ width: "100%" }}>
              {kycData?.id_image_front && (
                <Col xs={6}>
                  <div className="group-upload-image">
                    <img data-testid="review-Id_image-front" alt="" src={kycData?.id_image_front} />
                  </div>
                </Col>
              )}
              {kycData?.id_image_back && (
                <Col xs={6}>
                  <div className="group-upload-image">
                    <img data-testid="review-Id_image-back" alt="" src={kycData?.id_image_back} />
                  </div>
                </Col>
              )}
              {kycData?.selfie_with_id && (
                <Col xs={6}>
                  <div className="group-upload-image">
                    <img data-testid="review-selfie-with-id" alt="" src={kycData?.selfie_with_id} />
                  </div>
                </Col>
              )}
              {kycData?.id_image_other && (
                <Col xs={6}>
                  <div className="group-upload-image">
                    <img data-testid="review-selfie-with-other" alt="" src={kycData?.id_image_other} />
                  </div>
                </Col>
              )}
            </Row>
          </Col>

          <Col xs={12} className="mt-5">
            <div data-testid="review-btn-status" className="d-flex justify-content-between">
              <CustomButton onClick={onBack} disabled={status === "loading"}>
                Back
              </CustomButton>

              <CustomButton onClick={onNext} disabled={status === "loading"}>
                Submit
              </CustomButton>
            </div>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

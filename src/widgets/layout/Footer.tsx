import React from "react"
import { Row } from "react-bootstrap"
import { CustomText } from "../../components/custom-text"
export const Footer: React.FC = () => {
  return (
    <div className="w-100 mt-1 mb-3">
      <Row data-testid="row-footer" className="justify-content-center text-center  g-0">
        <CustomText data-testid="text-footer" en color={"white"} className="t-6" fw={"light"}>
          GolCoin.io - © 2022 All Rights Reserved
        </CustomText>
      </Row>
    </div>
  )
}

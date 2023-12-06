import React from "react"
import { Profit } from "../../core/models"
import { CustomText } from "../custom-text"
import { RequestStatus } from "../../utils/constants"
import { Row, Col, Placeholder } from "react-bootstrap"

export const GuideTimeline: React.FC<{ status: RequestStatus; profits: Profit[] }> = ({ status, profits }) => {
  if (status !== "data") {
    return (
      <Placeholder as={Row} animation="glow" className="justify-content-center mb-5 py-4">
        <Placeholder as={Col} className="w-100 rounded" />
      </Placeholder>
    )
  } else {
    return (
      <Col xs={12} className="static-line-container" style={{ "--length": profits?.length * 151 + "px" } as any}>
        <div data-testid="text-guide-timeline" className="static-line">
          <div className="c1">
            <div className="l1" />
            <CustomText data-testid="text-guide-timeline" color="white" fs={5}>
              Can’t claim bafore 67 days
            </CustomText>
          </div>
          <div className="c2">
            <div className="l2" />
            <CustomText color="primary" fs={5}>
              30% will be deducted
              <br /> If you claimed before 90 days
            </CustomText>
          </div>
          <div className="c3">
            <div className="l3" />
            <CustomText color="primary" fs={5}>
              25% will be deducted
              <br /> If you claimed at
              <br /> day 90 or after
            </CustomText>
          </div>
          <div className="c4">
            <div className="l4" />
            <CustomText color="primary" fs={5}>
              0% will be deducted
              <br /> If you claimed on day 365 or after
            </CustomText>
          </div>
        </div>
      </Col>
    )
  }
}

import React from "react"
import { Row, Col } from "react-bootstrap"
import { Player } from "@lottiefiles/react-lottie-player"
import spinner from "../../animation/loader.json"
export const Spinner: React.FC = () => {
  return (
    <Row className="g-0">
      <Col>
        <Player style={{ width: 500 }} autoplay loop src={spinner} />
      </Col>
    </Row>
  )
}

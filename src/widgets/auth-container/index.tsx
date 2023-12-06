import React from "react"
import { Outlet } from "react-router-dom"
import { Row, Col } from "react-bootstrap"

export const AuthContainer: React.FC = () => {
  return (
    <Row data-testid="auth-container" className="justify-content-center pt-5 g-0">
      <Col xl={9} lg={10} md={10} xs={10} className="auth-container">
        <Outlet />
      </Col>
    </Row>
  )
}

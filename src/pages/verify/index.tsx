import React, { useEffect } from "react"
import { Row, Col } from "react-bootstrap"
import { useAppDispatch, useAppSelector } from "../../core/redux/hooks"
import { Navigate, useSearchParams } from "react-router-dom"
import { VerifyEmailAsync } from "../../core/redux"

import "./index.scss"

export const Verify: React.FC = () => {
  let [searchParam] = useSearchParams()
  let verification_string = searchParam.get("verification_string")
  const { login_status } = useAppSelector((state) => state.Auth)
  const dispatch = useAppDispatch()

  useEffect(() => {
    verification_string && dispatch(VerifyEmailAsync({ verification_string }))
  }, [])

  if (!verification_string) return <Navigate to="/login" />
  else
    return (
      <Row data-testid="row-verify" className="email-sent justify-content-center">
        <Col xs={12}>{login_status === "loading" && <>Loading...</>}</Col>
      </Row>
    )
}

import React, { useEffect } from "react"
import { Row, Col, Container } from "react-bootstrap"
import { CustomText } from "../../components/custom-text"
import { CreateNewPasswordAsync, logout } from "../../core/redux"
import { useSearchParams, Navigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../core/redux/hooks"
import { CustomForm, CustomInputFormProps } from "../../components/custom-form/custom-form"
import { CustomCard } from "../../components/custom-card"
import { CustomSpace } from "../../components/custom-space"

const inputs: CustomInputFormProps[] = [
  {
    type: "password",
    name: "current_password",
    label: "Current Password",
    validate: { required: true },
    colProps: { xs: 12 },
  },
  {
    type: "password",
    name: "password",
    label: "New Password",
    validate: { required: true },
    colProps: { xs: 12 },
  },
  {
    type: "password",
    name: "confirmPassword",
    label: "Confirm Password",
    validate: { required: true },
    colProps: { xs: 12 },
  },
]

export const ChangePassword: React.FC = () => {
  const dispatch = useAppDispatch()
  const [searchParams] = useSearchParams()
  let email = searchParams.get("email")!.replaceAll(" ", "+")
  let code = searchParams.get("code")!

  const { login_status } = useAppSelector((state) => state.Auth)

  useEffect(() => {
    dispatch(logout())
  }, [])

  if (email && code) {
    return (
      <Container>
        <Row data-testid="row-change-password" className="justify-content-center g-0">
          <Col lg={6} md={10} xs={11}>
            <Row className="justify-content-center g-5">
              <Col style={{ textAlign: "center" }}>
                <CustomText en color="white" tag="h3">
                  Create New Password for
                </CustomText>
                <CustomText data-testid="email-change-password" en color="gold" tag="h4">
                  {email}
                </CustomText>
              </Col>

              <Col xs={12}>
                <Row className="justify-content-center">
                  <Col xs={8}>
                    <div className="divider-horizental" />
                  </Col>
                </Row>
              </Col>
              <Col xs={12}>
                <CustomForm
                  data-testid="input-change-password"
                  inputs={inputs}
                  onSubmit={(vals: { password: string }) => dispatch(CreateNewPasswordAsync({ code, email, password: vals.password }))}
                  submitLable="Change Password"
                  status={login_status}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    )
  } else {
    return <Navigate to="/" replace />
  }
}

import React from "react"
import { Row, Col } from "react-bootstrap"
import { ResendEmailReq } from "../../core/models"
import { CheckEmailExistAsync } from "../../core/redux"
import { useAppDispatch, useAppSelector } from "../../core/redux/hooks"
import { CustomForm, CustomInputFormProps } from "../../components/custom-form/custom-form"
import { CustomSpace } from "../../components/custom-space"
import { CustomText } from "../../components/custom-text"
import { Icon } from "../../components/icon"

const inputs: CustomInputFormProps[] = [
  {
    type: "email",
    name: "email",
    label: "Email",
    validate: {
      required: true,
      rule: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    },
    colProps: { xs: 12 },
  },
]

export const ForgetPassword: React.FC = () => {
  const dispatch = useAppDispatch()

  const { login_status, email_changed, email } = useAppSelector((state) => state.Auth)

  const target = { target: "_blank" }

  if (login_status === "data") {
    if (!email_changed)
      return (
        <Row className="email-sent" data-testid="row-email-sent">
          <Col xs={12}>
            <CustomSpace direction="vertical" size={20} fill>
              <Icon src="/assets/icons/email.svg" className="email-icon" />

              <CustomText fw="medium" en tag="h3" color="dark">
                Reset your password
              </CustomText>
              {/* <Col xs={8}>
                <div className="divider-horizental" />
              </Col> */}
              <CustomText en color="gray" fs={2}>
                We've sent you a reset password email to <br />
              </CustomText>
              <CustomText en color="gold" fs={2} tag="a" href="https://mail.google.com/mail/u/0/#inbox" {...target}>
                {email}
              </CustomText>
              <CustomText en color="gray" fs={3}>
                Please check your email.
              </CustomText>
            </CustomSpace>
          </Col>
        </Row>
      )
    else
      return (
        <Row className="email-sent">
          <Col xs={12}>
            <CustomSpace direction="vertical" size={20} fill>
              <CustomText en color="gray" fs={2}>
                You changed your email to <br />
              </CustomText>
              <CustomText en color="gold" fs={2} tag="a" {...target}>
                {email}
              </CustomText>
            </CustomSpace>
          </Col>
        </Row>
      )
  } else
    return (
      <Row className="justify-content-center g-0" data-testid="row-find-your-account">
        <Col lg={6} md={10} xs={11}>
          <Row className="justify-content-center">
            <Col style={{ textAlign: "center" }}>
              <CustomText fw="medium" en color="dark" tag="h3">
                Find Your Account
              </CustomText>
            </Col>
            <Col xs={12} style={{ textAlign: "center" }}>
              <CustomText en color="gray">
                Please enter your email to search for your account.
              </CustomText>
            </Col>
            {/* <Col xs={12}>
              <Row className="justify-content-center">
                <Col xs={8}>
                  <div className="divider-horizental" />
                </Col>
              </Row>
            </Col> */}
            <Col xs={12}>
              <CustomForm
                data-testid="input-search-email"
                inputs={inputs}
                onSubmit={(vals: ResendEmailReq) => dispatch(CheckEmailExistAsync(vals))}
                submitLable="Search"
                status={login_status}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    )
}

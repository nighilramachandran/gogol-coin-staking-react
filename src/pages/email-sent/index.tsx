import React from "react"
import { Row, Col } from "react-bootstrap"
import { Navigate, useSearchParams } from "react-router-dom"
import { CustomButton } from "../../components/custom-button"
import { CustomSpace } from "../../components/custom-space"
import { CustomText } from "../../components/custom-text"
import { Icon } from "../../components/icon"
import { ResendEmailAsync } from "../../core/redux"
import { useAppDispatch, useAppSelector } from "../../core/redux/hooks"

import "./index.scss"

export const EmailSent: React.FC = () => {
  const dispatch = useAppDispatch()
  const { login_status } = useAppSelector((state) => state.Auth)
  const [searchParams] = useSearchParams()
  let email = searchParams.get("email")?.replaceAll(" ", "+")

  if (!email) {
    return <Navigate to="/login" />
  } else
    return (
      <Row data-testid="row-email-sent" className="email-sent align-items-center">
        <Col md={{ span: 6, order: 1 }} xs={{ span: 12, order: 2 }}>
          <CustomSpace direction="vertical" size={40} fill>
            <CustomText en fs={3} fw={"bold"} color="dark" style={{ textAlign: "center" }}>
              Email Confirmation Required
            </CustomText>
            <CustomText en color="dark" fs={3} style={{ textAlign: "center" }}>
              We've sent you a verification email to
            </CustomText>
          </CustomSpace>
          <CustomSpace direction="vertical" size={20} fill>
            <CustomText en color="gold" fs={3} fw={"bold"} style={{ paddingTop: "10px" }}>
              {email}
            </CustomText>
            <CustomText en color="dark" fs={3} style={{ textAlign: "center" }}>
              Click the link inside to get started
            </CustomText>
            <CustomText style={{ textAlign: "center" }} en color="dark" fs={3}>
              If it doesn't arrive then please check your spam folder.
            </CustomText>

            <CustomButton bg="orange" href="/login">
              I’ve Already Verified My Email
            </CustomButton>
            <CustomSpace direction="vertical" size={5} style={{ marginTop: 20 }}>
              <CustomText
                data-testid="email-email-sent"
                en
                color="gold"
                fs={4}
                disable={login_status === "loading"}
                onClick={() => email && dispatch(ResendEmailAsync({ email }))}
              >
                Resend Verification Email
              </CustomText>
              <CustomText style={{ textAlign: "center" }} en color="gray" fs={4}>
                Already Have an Account,{" "}
                <CustomText color="gold" tag="a" href="/login">
                  Login
                </CustomText>
              </CustomText>
            </CustomSpace>
          </CustomSpace>
        </Col>
        <Col md={{ span: 6, order: 2 }} xs={{ span: 12, order: 1 }}>
          <div className="auth-wallet-background">
            <img data-testid="img-email-sent" src="/assets/images/auth-bck-wallet.svg" alt="" />
          </div>
        </Col>
      </Row>
    )
}

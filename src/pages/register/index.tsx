import React, { useMemo, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../core/redux/hooks"
import { CustomForm, CustomInputFormProps } from "../../components/custom-form/custom-form"
import { RegisterReq } from "../../core/models"
import { Row, Col } from "react-bootstrap"
import { CustomSpace } from "../../components/custom-space"
import { CustomText } from "../../components/custom-text"
import { RegisterAsync } from "../../core/redux"
import PhoneInput from "react-phone-input-2"
import { toast } from "../../utils"

const inputs: CustomInputFormProps[] = [
  {
    type: "text",
    name: "first_name",
    label: "First name",
    colProps: { md: 6, xs: 12 },
    validate: { required: true },
  },
  {
    type: "text",
    label: "Last name",
    name: "last_name",
    colProps: { md: 6, xs: 12 },
    validate: { required: true },
  },
  {
    type: "text",
    name: "username",
    label: "Username",
    colProps: { xs: 12 },
    validate: { required: true, rule: /^\s*\S+\s*$/, rule_message: "Username should not have spaces" },
  },
  {
    type: "email",
    name: "email",
    label: "Your Email",
    validate: {
      required: true,
      rule: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    },
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

export const Register: React.FC = () => {
  const dispatch = useAppDispatch()
  const [phone_number, setphone_number] = useState<string>()
  const { login_status } = useAppSelector((state) => state.Auth)

  const onSubmit = (vals: RegisterReq) => {
    if (!vals.privacy) {
      toast.error(`You must agree to the User Agreement and Privacy Policy`)
    } else dispatch(RegisterAsync({ ...vals, phone_number }))
  }

  const rest_inputs: CustomInputFormProps[] = useMemo(
    () => [
      {
        type: "number",
        name: "phone_number",
        label: "Phone Number",
        colProps: { xs: 12 },
        component: (_) => (
          <PhoneInput
            containerClass="custom-input"
            specialLabel=""
            placeholder="Phone Number"
            country={"ae"}
            value={phone_number}
            onChange={(e: string) => setphone_number(`+${e}`)}
            inputStyle={{ width: "100%" }}
          />
        ),
      },
      {
        type: "checkbox",
        name: "privacy",
        label: (
          <CustomText color="gray" fw="small" en>
            I certify that I am 18 years of age or older, and agree to the User Agreement and Privacy Policy
          </CustomText>
        ),
        colProps: { xs: 12 },
      },
    ],
    [phone_number]
  )

  return (
    <Row className="justify-content-around align-items-center g-0" data-testid="row-register">
      <Col xl={{ span: 4, order: 1 }} md={{ span: 11, order: 2 }} xs={{ span: 11, order: 2 }}>
        <Row className="justify-content-center g-5">
          <Col>
            <CustomText en color="dark" tag="h3" fw="bold">
              Create your Account
            </CustomText>
            <CustomText en color="gold" fw="small">
              Start earning from GolCoin
            </CustomText>
          </Col>

          <Col data-testid="inputs-register-form" xs={12}>
            <CustomForm inputs={[...inputs, ...rest_inputs]} onSubmit={onSubmit} submitLable="Sign Up" status={login_status} />
          </Col>
          <Col xs={12}>
            <CustomSpace direction="vertical" fill>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <CustomSpace size={5}>
                  <CustomText en color="gray">
                    Already Have an Account,{" "}
                  </CustomText>
                  <CustomText en color="gold" href="/login">
                    {" "}
                    Login
                  </CustomText>
                </CustomSpace>
              </div>
            </CustomSpace>
          </Col>
        </Row>
      </Col>
      <Col data-testid="img-register" xl={{ span: 6, order: 2 }} md={{ span: 11, order: 1 }}>
        <div className="auth-wallet-background">
          <img src="/assets/images/auth-bck-wallet.svg" alt="" />
        </div>
      </Col>
    </Row>
  )
}

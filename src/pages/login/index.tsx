import React from "react"
import { LoginAsync } from "../../core/redux"
import { useAppDispatch, useAppSelector } from "../../core/redux/hooks"
import { CustomForm, CustomInputFormProps } from "../../components/custom-form/custom-form"
import { LoginReq } from "../../core/models"
import { Row, Col } from "react-bootstrap"
import { CustomText } from "../../components/custom-text"
import { CustomSpace } from "../../components/custom-space"
import { useNavigate } from "react-router-dom"
import { CustomInput } from "../../components/custom-input"
import { useBreakpoints } from "../../utils/hooks"

export const Login: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { login_status } = useAppSelector((state) => state.Auth)

  const { md, lg } = useBreakpoints()

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
    {
      type: "password",
      name: "password",
      label: "Password",
      validate: { required: true },
      colProps: { xs: 12 },
    },
    // {
    //   type: "checkbox",
    //   name: "remember-me",
    //   label: (
    //     <CustomText color="gray" fw="small" en>
    //       Remember me
    //     </CustomText>
    //   ),
    //   colProps: { md: 6, xs: 12 },
    // },
    {
      name: "forget-password",
      component: (_) => (
        <div className={`d-flex justify-content-center`}>
          <CustomText en color="gold" tag="a" href="/forget-password">
            Forgot password?
          </CustomText>
        </div>
      ),
      ignore: true,
      colProps: { xs: 12 },
    },
  ]

  // const [formated, setformated] = useState("")
  // const end = moment("2022-06-10T00:00:00")
  // const calc = () => {
  //   const timeLeft = moment(end.diff(moment())) // get difference between now and timestamp
  //   const formatted = timeLeft.format("D [Days &] HH:mm:ss") // make pretty
  //   setformated(formatted) // or do your jQuery stuff here
  // }
  // useEffect(() => {
  //   calc()
  //   setInterval(calc, 1000)
  // }, [])

  return (
    <Row className="justify-content-around align-items-center g-0">
      {/* <Col lg={8} md={10} xs={11}> */}
      <Col xl={{ span: 4, order: 1 }} md={{ span: 11, order: 2 }} xs={{ span: 11, order: 2 }}>
        <Row className="justify-content-center g-5" data-testid="row-input-login">
          <Col>
            <CustomText en color="dark" tag="h3" fw="bold">
              Log in To Your Account
            </CustomText>
            <CustomText en color="gold" fw="small">
              See what is going on with your Golstaking
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
              data-testid="input-login-form"
              inputs={inputs}
              onSubmit={(vals: LoginReq) => dispatch(LoginAsync(vals))}
              submitLable="Login"
              status={login_status}
            />
          </Col>
          <Col xs={12}>
            <CustomSpace direction="vertical" fill>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <CustomSpace size={5}>
                  <CustomText en color="gray">
                    Don't Have an Account,
                  </CustomText>
                  <CustomText
                    en
                    color="gold"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      navigate("/register")
                    }}
                  >
                    {" "}
                    Create an account
                  </CustomText>
                </CustomSpace>
              </div>
            </CustomSpace>
          </Col>
        </Row>
      </Col>
      <Col data-testid="img-login" xl={{ span: 6, order: 2 }} md={{ span: 11, order: 1 }}>
        <div className="auth-wallet-background">
          <img src="/assets/images/auth-bck-wallet.svg" alt="" />
        </div>
      </Col>
    </Row>
  )
}

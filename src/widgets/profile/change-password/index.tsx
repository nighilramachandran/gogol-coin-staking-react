import { FC } from "react"
import { Col, Container, Row } from "react-bootstrap"
import { CustomCard } from "../../../components/custom-card"
import { CustomForm, CustomInputFormProps } from "../../../components/custom-form/custom-form"
import { CustomSpace } from "../../../components/custom-space"
import { CustomText } from "../../../components/custom-text"
import { ChangePasswordAsync } from "../../../core/redux"
import { useAppDispatch, useAppSelector } from "../../../core/redux/hooks"

const inputs: CustomInputFormProps[] = [
  {
    type: "password",
    name: "current_password",
    label: "Current Password",
    placeholder: "current password.",
    validate: { required: true },
    colProps: { xs: 12 },
  },
  {
    type: "password",
    name: "password",
    label: "New Password",
    placeholder: "New Password",
    validate: { required: true },
    colProps: { xs: 12 },
  },
  {
    type: "password",
    name: "confirmPassword",
    label: "Confirm Password",
    placeholder: "Confirm Password",
    validate: { required: true },
    colProps: { xs: 12 },
  },
]

export const ChangePassword: FC<{}> = () => {
  const dispatch = useAppDispatch()
  const { update_profile_status } = useAppSelector((state) => state.Auth)

  return (
    <Container>
      <Row data-testid="row-change-password" className="justify-content-center">
        <Col md={12} lg={8}>
          <CustomCard>
            <CustomSpace fill direction="vertical" size={50}>
              <CustomText color="dark" fs={2} fw={"medium"}>
                Change Password
              </CustomText>
              <Row className="justify-content-center">
                <Col md={12} lg={6}>
                  <CustomForm
                    data-testid="input-form-change-password"
                    submitWhenDirty={false}
                    inputs={inputs}
                    onSubmit={(values) =>
                      dispatch(ChangePasswordAsync({ current_password: values.current_password, new_password: values.password }))
                    }
                    status={update_profile_status}
                    submitLable={"Change Password"}
                  />
                </Col>
              </Row>
            </CustomSpace>
          </CustomCard>
        </Col>
      </Row>
    </Container>
  )
}

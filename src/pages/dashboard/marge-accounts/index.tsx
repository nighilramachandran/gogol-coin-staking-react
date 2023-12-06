import { useEffect, useState } from "react"
import { Col, Row } from "react-bootstrap"
import { CustomButton } from "../../../components/custom-button"
import { CustomCard } from "../../../components/custom-card"
import { CustomForm, CustomInputFormProps } from "../../../components/custom-form/custom-form"
import { CustomModal } from "../../../components/custom-modal"
import { CustomSpace } from "../../../components/custom-space"
import { CustomText } from "../../../components/custom-text"
import { MargeAccountsAsync } from "../../../core/redux/dashboard/users"
import { useAppDispatch, useAppSelector } from "../../../core/redux/hooks"

const inputs: CustomInputFormProps[] = [
  {
    type: "email",
    name: "first_email",
    label: "First Email",
    placeholder: "Please enter current email (to be disabled)",
    validate: {
      required: true,
      rule: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    },
    colProps: { xs: 12 },
  },
  {
    type: "email",
    name: "second_email",
    label: "Second Email",
    placeholder: "Please enter an email (active email)",
    validate: {
      required: true,
      rule: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    },
    colProps: { xs: 12 },
  },
]
export const MargeAccounts = () => {
  const dispatch = useAppDispatch()
  const { margeAccountsStatus } = useAppSelector((state) => state.AdminUsers)

  const [showConfirm, setShowConfirm] = useState(false)
  const [currentData, setCurrentData] = useState<any>(null)

  const handelSubmit = ({ first_email, second_email }: any) => {
    setShowConfirm(true)
    setCurrentData({
      first_email,
      second_email,
    })
  }

  const handleConfirm = () => {
    dispatch(MargeAccountsAsync(currentData))
  }
  const onHideModal = () => {
    setShowConfirm(false)
  }

  useEffect(() => {
    if (margeAccountsStatus === "data" || margeAccountsStatus === "error") setShowConfirm(false)
  }, [margeAccountsStatus])

  return (
    <Row className="px-3 g-0">
      <CustomModal title="Merge Confirm" show={showConfirm} onHide={onHideModal}>
        <Row className="g-3 mx-2" data-testid="row-marge-accounts">
          <Col xs={12}>
            <CustomText>Are you sure to merge</CustomText>{" "}
            <CustomText data-testid="first_email" color="gold">
              {currentData?.first_email}{" "}
            </CustomText>{" "}
            <CustomText data-testid="second_email">into</CustomText> <CustomText color="gold">{currentData?.second_email}</CustomText>
          </Col>
          <Col xs={12}>
            <CustomText data-testid="first_email" color="gold">
              {currentData?.first_email}{" "}
            </CustomText>
            <CustomText>will be disabled</CustomText>
          </Col>
          <Col xs={12}>
            <CustomText color="gold">{currentData?.second_email} </CustomText>
            <CustomText>will be the email</CustomText>
          </Col>
          <Col xs={12}>
            <Row className="justify-content-end">
              <Col xs={2}>
                <CustomButton data-testid="btn-confirm-merge-account" disabled={margeAccountsStatus === "loading"} onClick={handleConfirm}>
                  Confirm
                </CustomButton>
              </Col>
            </Row>
          </Col>
        </Row>
      </CustomModal>
      <Col>
        {/* <CustomCard dashboard className="c-card dashboard-table-card"> */}
        <Row className="justify-content-center">
          <Col xs={6}>
            <CustomCard dashboard data-testid="card merge account">
              <CustomForm resetFrom inputs={inputs} onSubmit={handelSubmit} submitLable={"Merge Accounts"} />
            </CustomCard>
          </Col>
        </Row>
        {/* </CustomCard> */}
      </Col>
    </Row>
  )
}

import React, { useEffect, useState } from "react"
import { Row, Col, Container } from "react-bootstrap"
import { CustomButton } from "../../../components/custom-button"
import { CustomCard } from "../../../components/custom-card"
import { CustomForm, CustomInputFormProps } from "../../../components/custom-form/custom-form"
import { CustomModal } from "../../../components/custom-modal"
import { CustomText } from "../../../components/custom-text"
import { CreateUserWithBalanceAsync, UserWithBalance } from "../../../core/redux/dashboard/balance"
import { useAppDispatch, useAppSelector } from "../../../core/redux/hooks"

export const AddStaking: React.FC = () => {
  const inputs: CustomInputFormProps[] = [
    {
      type: "text",
      name: "name",
      label: "Name",
      validate: {
        required: true,
        rule: /^[^\s]+(\s+[^\s]+)*$/,
        rule_message: "No whitespace at the beginning and end",
      },
      colProps: { xs: 12 },
    },
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
      type: "number",
      name: "amount",
      label: "Amount",
      validate: { required: true },
      colProps: { xs: 12 },
    },
    {
      type: "checkbox",
      name: "golc",
      label: "Golc",
      colProps: { xs: 12 },
    },
  ]

  const dispatch = useAppDispatch()
  const [showConfirm, setShowConfirm] = useState(false)
  const [formData, setFormData] = useState<any>({})
  const { status } = useAppSelector((state) => state.AdminBalance)

  const toggleModal = () => {
    setShowConfirm(!showConfirm)
  }
  const handleConfirm = () => {
    dispatch(CreateUserWithBalanceAsync(formData))
    toggleModal()
  }
  // useEffect(() => {
  //   if (status === "data" || status === "error") toggleModal()
  // }, [status])
  return (
    <Row>
      <CustomModal title="Add Staking Confirm" show={showConfirm} onHide={toggleModal}>
        <Row className="g-3 mx-2">
          <Col xs={12}>
            <Row className="justify-content-end">
              <Col xs={12}>
                <CustomText>Are you sure to add </CustomText> <CustomText color="gold">{formData?.amount} </CustomText>{" "}
                <CustomText>into</CustomText> <CustomText color="gold">{formData?.email}</CustomText>
              </Col>

              <Col xs={2}>
                <CustomButton disabled={status === "loading"} onClick={handleConfirm}>
                  Confirm
                </CustomButton>
              </Col>
            </Row>
          </Col>
        </Row>
      </CustomModal>
      <Col>
        <Container className="my-2">
          <CustomCard data-testid="card-add-staking" dashboard>
            <CustomText data-testid="title-add-staking" tag="h2" color="white" className="py-3">
              Add new user with balance
            </CustomText>
            <CustomForm
              data-testid="table-add-staking"
              inputs={inputs}
              resetFrom
              onSubmit={(vals: UserWithBalance) => {
                toggleModal()
                setFormData({ ...vals, name: vals.name.replace(/\s+/g, " ").trim() })
              }}
              submitLable="Add"
              status={status}
            />
          </CustomCard>
        </Container>
      </Col>
    </Row>
  )
}

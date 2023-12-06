import { FC, useEffect, useState } from "react"

import { CustomCard } from "../../../components/custom-card"
import { Col, Container, Row } from "react-bootstrap"
import { CustomForm, CustomInputFormProps } from "../../../components/custom-form/custom-form"
import PhoneInput from "react-phone-input-2"
import { CustomText } from "../../../components/custom-text"
import { useAppDispatch, useAppSelector } from "../../../core/redux/hooks"
import { FetchUserStatus } from "../../../core/redux/kyc"
import kyc from "../../../core/redux/dashboard/kyc"
import { RefreshAuthAsync, UpdateProfile } from "../../../core/redux"
import { Icon } from "../../../components/icon"
import { primarycolor } from "../../../utils/constants/valiables"
import { CustomButton } from "../../../components/custom-button"
import { CustomModal } from "../../../components/custom-modal"
import { TransferForm } from "../../pools/running/kyc"
import Termsandcondition from "../../pools/running/kyc/termsandcondition"
import { TransferToGolc } from "../../../core/redux/balance"
import { KycButton } from "../../pools/running"
import { differenceObject } from "../../../utils/helpers/difference-object"
import { CustomSpace } from "../../../components/custom-space"
import eventManager, { EVENT_UNAUTHORIZED } from "../../../utils/api/event-manager"

export const GeneralInformation: FC<{}> = () => {
  const dispatch = useAppDispatch()
  const { user, update_profile_status } = useAppSelector((state) => state.Auth)

  const { kycResponse, userStatus, status } = useAppSelector((state) => state.Kyc)

  useEffect(() => {
    dispatch(FetchUserStatus())
  }, [dispatch])

  const [openTransfer, setOpenTransfer] = useState<boolean>(false)

  const [openForm, setOpenForm] = useState<boolean>(true)

  const onAcceptTearms = () => {
    dispatch(TransferToGolc())
    setOpenTransfer(false)
  }
  const handleClickKycButton = () => {
    if (kycResponse?.status === "APPROVED") {
      setOpenForm(false)
    }
    setOpenTransfer(true)
  }
  const toggleModal = () => setOpenTransfer(!openTransfer)

  const inputs: CustomInputFormProps[] = [
    {
      type: "text",
      name: "first_name",
      label: "First name",
      colProps: { xs: 12 },
      validate: { required: true },
    },
    {
      type: "text",
      label: "Last name",
      name: "last_name",
      colProps: { xs: 12 },
      validate: { required: true },
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
      name: "phone_number",
      label: "Phone Number",
      colProps: { xs: 12 },
      component: (formik) => (
        <PhoneInput
          containerClass="custom-input"
          specialLabel=""
          placeholder="Phone Number"
          // country={"ae"}
          value={formik.values["phone_number"]}
          onChange={(e: string) => formik.setFieldValue("phone_number", `+${e}`, true)}
          inputStyle={{ width: "100%" }}
        />
      ),
      validate: {
        required: true,
      },
    },
    // {
    //   name: "",
    //   component: () => (
    //     <div className="d-flex g-3">
    //       <KycButton onClick={handleClickKycButton} status={kycResponse?.status} loading={status === "loading"} />
    //     </div>
    //   ),
    // },
    // {
    //   name: "",
    //   component: (_) => (
    //     <Row data-testid="row-general-information" className="g-2 align-items-center">
    //       <Col lg={3}>
    //         <CustomText ata-testid="Account-general-information" en color="gray">
    //           Account
    //         </CustomText>
    //       </Col>
    //       <Col lg={9}>
    //         {user?.verified === 1 ? (
    //           <CustomText data-testid="Verified-general-information" color="gold">
    //             Verified
    //           </CustomText>
    //         ) : (
    //           <CustomText data-testid="not-verified-general-information" color="gold">
    //             Not Verified
    //           </CustomText>
    //         )}
    //         {user?.verified === 1 && (
    //           <Icon
    //             data-testid="icons-general-information"
    //             style={{ color: primarycolor, border: "1px solid", borderRadius: "50%" }}
    //             className="icon t-8  p-1"
    //             size="small"
    //             src={`/assets/icons/check.svg`}
    //           ></Icon>
    //         )}
    //       </Col>
    //       {user?.verified === 1 && (
    //         <>
    //           {" "}
    //           <Col data-testid="col-general-information" lg={3}>
    //             <CustomText en color="gray">
    //               Full Name
    //             </CustomText>
    //           </Col>
    //           <Col lg={9}>
    //             <CustomText data-testid="full-name-general-information" en color="gold" status={userStatus}>
    //               {kycResponse?.full_name}
    //             </CustomText>
    //           </Col>
    //           <Col lg={3}>
    //             <CustomText en color="gray">
    //               Country
    //             </CustomText>
    //           </Col>
    //           <Col lg={9}>
    //             <CustomText data-testid="nationality-general-information" en color="gold" status={userStatus}>
    //               {kycResponse?.nationality}
    //             </CustomText>
    //           </Col>
    //           <Col lg={3}>
    //             <CustomText en color="gray">
    //               ID Number
    //             </CustomText>
    //           </Col>
    //           <Col lg={9}>
    //             <CustomText data-testid="id-general-information" en color="gold" status={userStatus}>
    //               {kycResponse?.id}
    //             </CustomText>
    //           </Col>
    //           <Col lg={3}>
    //             <CustomText en color="gray">
    //               Date of Birth
    //             </CustomText>
    //           </Col>
    //           <Col lg={9}>
    //             <CustomText data-testid="birthdate-general-information" en color="gold" status={userStatus}>
    //               {kycResponse?.birthdate}
    //             </CustomText>
    //           </Col>
    //         </>
    //       )}
    //     </Row>
    //   ),
    //   ignore: true,
    //   colProps: { xs: 12 },
    // },
  ]

  const initValues = { first_name: user?.first_name, last_name: user?.last_name, email: user?.email, phone_number: user?.phone_number }

  return (
    <Container>
      <Row className="justify-content-center">
        {/* <CustomModal data-testid="openTransfer-general-information" show={openTransfer} onHide={() => setOpenTransfer(false)}>
          {openForm ? (
            <TransferForm toggleModal={toggleModal} />
          ) : (
            <Termsandcondition onClose={toggleModal} onAccept={onAcceptTearms} loading={status === "loading"} />
          )}
        </CustomModal> */}

        <Col md={12} lg={8}>
          <CustomCard>
            <CustomSpace fill direction="vertical" size={50}>
              <CustomText style={{ textAlign: "center" }} color="dark" fs={2} fw={"medium"}>
                Update Information
              </CustomText>
              <Row className="justify-content-center">
                <Col md={12} lg={6}>
                  <CustomForm
                    data-testid="input-general-information"
                    submitWhenDirty={false}
                    initialInputValues={initValues}
                    inputs={inputs}
                    onSubmit={(values) => {
                      dispatch(UpdateProfile(differenceObject(initValues, values)))
                    }}
                    submitLable="Confirm"
                    status={update_profile_status}
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

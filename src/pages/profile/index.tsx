import React, { useEffect, useState } from "react"
import { Col, Container, Row } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { CustomCard } from "../../components/custom-card"
import { CustomGroupButtons } from "../../components/custom-group-buttons"
import { CustomModal } from "../../components/custom-modal"
import { CustomSpace } from "../../components/custom-space"
import { CustomText } from "../../components/custom-text"
import { useAppDispatch, useAppSelector } from "../../core/redux/hooks"
import { FetchUserStatus } from "../../core/redux/kyc"
import { useBreakpoints } from "../../utils/hooks"
import { TransferForm } from "../../widgets/pools/running/kyc"
import Termsandcondition from "../../widgets/pools/running/kyc/termsandcondition"
import { ChangePassword } from "../../widgets/profile/change-password"
import { GeneralInformation } from "../../widgets/profile/general-information"

export const Profile: React.FC = () => {
  const dispatch = useAppDispatch()
  // const radios = [
  //   { name: "General Information", value: "1" },
  //   { name: "Change Password", value: "2" },
  // ]
  // const [currentTap, setCurrentTap] = useState<string>("1")

  const { user }: any = useAppSelector((state) => state.Auth)
  const { kycResponse } = useAppSelector((state) => state.Kyc)

  const [showModal, setshowModal] = useState(false)

  const SetStatus = (value: string | null | undefined) => {
    switch (value) {
      case "APPROVED":
        return (
          <CustomSpace>
            <img src="/assets/icons/Approved.svg" alt="Approved" />
            <CustomText color="active">{value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()}</CustomText>
          </CustomSpace>
        )
      case "PENDING":
        return (
          <CustomSpace>
            <img src="/assets/icons/Pending.svg" alt="Pending" />
            <CustomText color="light-yellow">{value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()}</CustomText>
          </CustomSpace>
        )
      case "REJECTED":
        return (
          <CustomSpace>
            <img src="/assets/icons/Rejected.svg" alt="Rejected" />
            <CustomText color="danger">{value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()}</CustomText>
            <CustomText style={{ borderBottom: "1.8px solid #8D8F92" }} color="gray" onClick={() => setshowModal(true)}>
              Try Again
            </CustomText>
          </CustomSpace>
        )
      case "BANNED":
        return (
          <CustomSpace>
            <img src="/assets/icons/ban.svg" alt="ban" />
            <CustomText color="gray">{value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()}</CustomText>
          </CustomSpace>
        )

      default:
        return (
          <CustomSpace>
            <img src="/assets/icons/Not-Approved.svg" alt="Not-Approved" />
            <CustomText style={{ borderBottom: "1.8px solid #8D8F92" }} color="gray" onClick={() => setshowModal(true)}>
              Proceed to KYC
            </CustomText>
          </CustomSpace>
        )
    }
  }

  const userInformation = [
    { name: "Full Name", data: user?.first_name + " " + user?.last_name },
    { name: "Email", data: user?.email },
    { name: "User Name", data: user?.username },
    { name: "Phone Number", data: user?.phone_number },
    { name: "KYC Status", data: kycResponse?.status ? SetStatus(kycResponse?.status) : "loading..." },
  ]

  useEffect(() => {
    dispatch(FetchUserStatus())
  }, [])

  const [Class, setClass] = useState("")

  const { lg } = useBreakpoints()

  useEffect(() => {
    if (lg) {
      setClass("")
    } else {
      setClass("d-flex justify-content-center")
    }
  }, [lg])

  const navigate = useNavigate()

  return (
    <Container data-testid="home-content" className="home-content">
      <KYCModal showModal={showModal} setshowModal={setshowModal} />
      <Row className="justify-content-center">
        <Col md={12} lg={8}>
          <CustomCard bottomRadiusOnly>
            <div className="d-flex justify-content-center mb-5">
              <CustomText style={{ textAlign: "center" }} color="dark" fs={2} fw={"medium"}>
                Account information
              </CustomText>
            </div>
            {userInformation.map((el) => (
              <Row className="justify-content-center mb-4">
                <Col lg={4} className={`${Class}`}>
                  <CustomText en color="dark">
                    {el.name}
                  </CustomText>
                </Col>
                <Col lg={4} className={`${Class}`}>
                  <CustomText en color="gray">
                    {el.data}
                  </CustomText>
                </Col>
              </Row>
            ))}

            <Row className="justify-content-center mt-4">
              <Col lg={3} className={`${Class} mb-2`}>
                <CustomText style={{ cursor: "pointer" }} onClick={() => navigate("/profile/update-info")} color="gold">
                  Update Info
                </CustomText>
              </Col>
              <Col lg={3} className={`${Class}`}>
                <CustomText style={{ cursor: "pointer" }} onClick={() => navigate("/profile/change-password")} color="gold">
                  Change Password
                </CustomText>
              </Col>
            </Row>

            {/* <div className="d-flex justify-content-center mb-4">
          <CustomGroupButtons radios={radios} onChange={(value) => setCurrentTap(value)} />
        </div>   
        {currentTap === "1" && <GeneralInformation />}  
         {currentTap === "2" && <ChangePassword />} */}
          </CustomCard>
        </Col>
      </Row>
    </Container>
  )
}

const KYCModal = ({ showModal, setshowModal }: { showModal: boolean; setshowModal: (status: boolean) => void }) => {
  return (
    <CustomModal data-testid="openTransfer-general-information" show={showModal} onHide={() => setshowModal(false)}>
      <TransferForm toggleModal={() => setshowModal(!showModal)} />
    </CustomModal>
  )
}

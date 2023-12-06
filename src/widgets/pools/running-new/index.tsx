import React, { FC, useEffect, useMemo, useState } from "react"
import { Col, Row } from "react-bootstrap"
import { CustomText } from "../../../components/custom-text"
import { CustomSpace } from "../../../components/custom-space"
import { TransferToGolc } from "../../../core/redux/balance"
import { useAppDispatch, useAppSelector } from "../../../core/redux/hooks"
import { FetchTimeLineDataAsync } from "../../../core/redux/profit"
import { Balance } from "../../../core/models/balance"
import { toFix } from "../../../utils/helpers/ot-fix"

import { ClaimButtonNew } from "./claim-button-new"
import { CustomButton } from "../../../components/custom-button"
import { CustomModal } from "../../../components/custom-modal"
import Termsandcondition from "./kyc/termsandcondition"
import { FetchUserStatus } from "../../../core/redux/kyc"
import { FetchBalanceInfoGolcAsync } from "../../../core/redux/balance-new"
import { TimelineNew } from "../../../components/timeline-new"
import { TransferForm } from "./kyc"
import "./style.scss"
import moment from "moment"

export const RunningPoolNew: React.FC = () => {
  const dispatch = useAppDispatch()

  const [openTransfer, setOpenTransfer] = useState<boolean>(false)

  const [openForm, setOpenForm] = useState<boolean>(true)

  const { time_line_data } = useAppSelector((state) => state.Profit)
  const { balance_info, status: balances_status } = useAppSelector((state) => state.BalanceGolc)
  const { kycResponse, status } = useAppSelector((state) => state.Kyc)
  const { user } = useAppSelector((state) => state.Auth)

  //get data
  const getData = () => {
    dispatch(FetchTimeLineDataAsync())
    dispatch(FetchBalanceInfoGolcAsync())
    dispatch(FetchUserStatus())
    localStorage.removeItem("sent_transaction")
  }

  useEffect(() => {
    getData()
  }, [])

  const onAcceptTearms = () => {
    dispatch(TransferToGolc())
    setOpenTransfer(false)
  }

  const toggleModal = () => setOpenTransfer(!openTransfer)

  const handleClickKycButton = () => {
    if (kycResponse?.status === "APPROVED") {
      setOpenForm(false)
    }
    setOpenTransfer(true)
  }

  return (
    <Row data-testid="row-kyc--New-index" className="g-3">
      <Col xs={12}>
        <CustomSpace justify="center">
          {/* <img src="/assets/images/gold-golcoin.png" alt="Logo" height={80} /> */}
          <CustomText en color="gray" fw="light" fs={4}>
            Pool:
          </CustomText>
          <CustomText en color="gold" fs={4}>
            GolCoin Gold
          </CustomText>
        </CustomSpace>
      </Col>
      <Col xs={12}>
        <Row className="justify-content-center text-center">
          <Col>
            <CustomText en color="gray" className="mx-2">
              APR:
            </CustomText>
            <CustomText en color="gold">
              0%
            </CustomText>
          </Col>
          <Col>
            <CustomText en color="gray" className="mx-2">
              Lock-up Period:
            </CustomText>
            <CustomText en color="gold" data_test="days" className="w-50" status={balances_status}>
              open
            </CustomText>
          </Col>
          <Col>
            <CustomText en color="gray" className="mx-2">
              CAP:
            </CustomText>
            <CustomText
              data-testid="New-kyc-stacking_balance"
              en
              color="gold"
              data_test="staking-amount"
              className="w-50"
              type="number"
              status={balances_status}
            >
              {toFix(balance_info?.stacking_balance)?.toLocaleString()} Gol
            </CustomText>
          </Col>
        </Row>
      </Col>

      <div className="divider-horizental mt-3 mb-3" />

      <Col xs={12} style={{ marginTop: 70 }}>
        {/* <TimelineNew time_line_data={time_line_data!} /> */}
      </Col>

      <Col xs={12} className="d-flex justify-content-center mt-5 mb-2">
        <CustomSpace direction="horizontal" justify="center">
          {/* <img src="/assets/images/gold-golcoin.png" width={50} /> */}
          <CustomText
            data-testid="New-kyc-remaining_amount"
            en
            tag="h1"
            color="gold"
            data_test="total-balance"
            type="number"
            status={balances_status}
            className="m-0"
            fw={"bolder"}
          >
            {toFix(balance_info?.remaining_amount).toLocaleString("en") ?? 0} Gol
          </CustomText>
          {/* <CustomText en fs={3} color="gray" style={{ textAlign: "center" }}>
            Staking Amount
          </CustomText> */}
        </CustomSpace>
      </Col>

      <Col xs={12} className="d-flex justify-content-center mt-5 mb-5">
        <CustomSpace direction="vertical">
          <ClaimButtonNew
            data-testid="New-kyc-btn-claim"
            time_line_data={time_line_data!}
            balances_status={balances_status}
            getData={getData}
          />

          {user?.golc === 0 && (
            <>
              <KycButton
                data-testid="btn-New-kyc-status"
                onClick={handleClickKycButton}
                status={kycResponse?.status}
                loading={status === "loading"}
              />
              <CustomModal data-testid="New-kyc-openTransfer" show={openTransfer} onHide={() => setOpenTransfer(false)}>
                {openForm ? (
                  <TransferForm toggleModal={toggleModal} />
                ) : (
                  <Termsandcondition onClose={toggleModal} onAccept={onAcceptTearms} loading={balances_status === "loading"} />
                )}
              </CustomModal>
            </>
          )}
        </CustomSpace>
      </Col>
    </Row>
  )
}

interface props {
  status?: "PENDING" | "DECLINED" | "APPROVED" | "BANNED"
  loading?: boolean
  onClick?: VoidFunction
}
const KycButton: FC<props> = ({ loading, status, onClick }) => {
  const Component = useMemo(() => {
    switch (status) {
      case "APPROVED":
        // return null
        return (
          <CustomButton data-testid="btn-New-kyc-Complete-change-GOLC" onClick={onClick}>
            {"Complete your request"}
          </CustomButton>
        )

      case "DECLINED":
        return (
          <>
            <CustomText color="white">Your request is rejected</CustomText>
            <CustomButton data-testid="btn-New-kyc-Update-request" onClick={onClick}>
              {"Update your request"}
            </CustomButton>
          </>
        )
      case "PENDING":
        return (
          <CustomButton data-testid="btn-New-kyc-request-pending" disabled>
            {"Your Request is Pending"}
          </CustomButton>
        )
      case "BANNED":
        return (
          <>
            <CustomButton data-testid="btn-New-kyc-disabled-Banned" disabled>
              {"Your Account is Banned"}
            </CustomButton>
            <CustomText color="white">Please contact the support team</CustomText>
          </>
        )
      default:
        // return null
        return (
          <CustomButton data-testid="btn-New-kyc-Complete-change-GOLC" onClick={onClick}>
            {"Change to Golcoin"}
          </CustomButton>
        )
    }
  }, [status])
  return <>{loading ? "Loading..." : Component}</>
}

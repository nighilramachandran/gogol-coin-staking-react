import React, { FC, useEffect, useMemo, useState } from "react"
import { Col, Row, Spinner } from "react-bootstrap"
import { CustomText } from "../../../components/custom-text"
import { CustomSpace } from "../../../components/custom-space"
import { Timeline } from "../../../components/timeline"
import {
  FetchCurrentBalanceInfoAsync,
  FetchRemainingInfoAsync,
  FetchCurrentProfitAmountAsync,
  TransferToGolc,
} from "../../../core/redux/balance"
import { useAppDispatch, useAppSelector } from "../../../core/redux/hooks"
import { FetchProfitsAsync } from "../../../core/redux/profit"
import { Balance } from "../../../core/models/balance"
import { toFix } from "../../../utils/helpers/ot-fix"

import "./style.scss"
import { ClaimButton } from "./claim-button"
import { CustomButton } from "../../../components/custom-button"
import { CustomModal } from "../../../components/custom-modal"
import Termsandcondition from "./kyc/termsandcondition"
import { FetchUserStatus } from "../../../core/redux/kyc"
import { TransferForm } from "./kyc"
import { GuideTimeline } from "../../../components/guide-timeline/guide-timeline"

export const RunningPool: React.FC<{ balances: Balance[] }> = ({ balances }) => {
  const dispatch = useAppDispatch()

  const [openTransfer, setOpenTransfer] = useState<boolean>(false)

  const [openForm, setOpenForm] = useState<boolean>(true)

  const { profits } = useAppSelector((state) => state.Profit)
  const {
    BalanceInfo,
    remaining_info,
    status: balances_status,
    CurrentProfitAmount,
    golc_config,
  } = useAppSelector((state) => state.Balance)
  const { kycResponse, status } = useAppSelector((state) => state.Kyc)

  // useEffect(() => {
  //   if (status === "data") {
  //     setOpenForm(false)
  //   }
  // }, [status])

  //lazy load naimation
  // const [RunningPools, setRunningPools] = useState<any>(null)
  // useEffect(() => {
  //   import("../../../animation/RunningPools.json").then(setRunningPools)
  // }, [])

  //get data
  const getData = () => {
    dispatch(FetchProfitsAsync())
    dispatch(FetchCurrentBalanceInfoAsync())
    dispatch(FetchCurrentProfitAmountAsync())
    dispatch(FetchRemainingInfoAsync())
    dispatch(FetchUserStatus())
    localStorage.removeItem("sent_transaction")
  }

  useEffect(() => getData(), [])

  const { current_stake } = useMemo(() => {
    let cap = balances[0]?.stacking_balance
    let current_stake = cap - balances[0]?.reward ?? 0
    return { current_stake }
  }, [balances])

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
    <>
      {balances.length && (
        <Row data-testid="row-kyc-index" className="g-3">
          <Col xs={12}>
            <CustomSpace justify="center">
              {/* <img src="/assets/images/logo.png" alt="Logo" height={80} /> */}
              <CustomText en color="gray" fw="light" fs={4}>
                Pool:
              </CustomText>
              <CustomText en color="gold" fs={4}>
                GogolCoin Gold
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
                  1 Year
                </CustomText>
              </Col>
              <Col>
                <CustomText en color="gray" className="mx-2">
                  Lock-up Period:
                </CustomText>
                <CustomText data-testid="kyc-BalanceInfo" en color="gold" data_test="days" className="w-50" status={balances_status}>
                  {BalanceInfo?.balance_info.days} Days
                </CustomText>
              </Col>
              <Col>
                <CustomText en color="gray" className="mx-2">
                  Staking Amount:
                </CustomText>
                <CustomText
                  data-testid="kyc-current-stake"
                  en
                  color="gold"
                  data_test="staking-amount"
                  className="w-50"
                  type="number"
                  status={balances_status}
                >
                  {toFix(current_stake)?.toLocaleString()} Gol
                </CustomText>
              </Col>
              <Col>
                <CustomText en color="gray" className="mx-2">
                  Staking Profit:
                </CustomText>
                <CustomText
                  data-testid="kyc-balances_status-stake"
                  en
                  color="gold"
                  data_test="staking-amount"
                  className="w-50"
                  status={balances_status}
                >
                  150%
                </CustomText>
              </Col>
            </Row>
          </Col>

          {/* // */}
          <div className="divider-horizental mt-3 mb-3" />

          <div className="lines-container">
            <Col xs={12}>
              <Timeline data-testid="timeline-profits-stake" profits={profits} current_stake={current_stake} />
            </Col>
            <GuideTimeline data-testid="guide-timeline-stake" status={balances_status} profits={profits} />
          </div>

          <Col md={6} className="d-flex justify-content-center mt-5 mb-2">
            <CustomSpace direction="vertical">
              {/* <img src="/assets/images/gold-golcoin.png" width={50} /> */}
              <CustomText
                data-testid="kyc-total-balance-stake"
                en
                tag="h1"
                color="white"
                data_test="total-balance"
                type="number"
                status={balances_status}
                className="m-0"
              >
                {toFix(BalanceInfo?.balance_info?.total_balance).toLocaleString("en") ?? 0} Gol
              </CustomText>
              <CustomText en fs={3} color="gray" style={{ textAlign: "center" }}>
                CAP
                <br></br>
                <small>
                  <small>
                    <i>(Staking Amount + Air Drop)</i>
                  </small>
                </small>
              </CustomText>
            </CustomSpace>
          </Col>
          <Col md={6} className="d-flex justify-content-center mt-5 mb-2">
            <CustomSpace direction="vertical">
              <CustomText data-testid="kyc-percentage-stake" en fs={1} color="white" data_test="percentage" status={balances_status}>
                {/* {persentage ?? "-"} */}
                {((BalanceInfo?.balance_info?.percentage ?? 0) * 100).toFixed(0)}%
              </CustomText>
              <CustomText en fs={3} color="gray" style={{ textAlign: "center" }}>
                Percentage
                <br></br>
                <small>
                  <small>
                    <i>(Profit + Air Drop)</i>
                  </small>
                </small>
              </CustomText>
            </CustomSpace>
          </Col>

          <Col md={6} className="d-flex justify-content-center mt-5 mb-2">
            <CustomSpace direction="vertical">
              <CustomText
                data-testid="kyc-reward-stake"
                en
                fs={1}
                color="white"
                data_test="air-drop"
                type="number"
                status={balances_status}
              >
                {toFix(BalanceInfo?.balance_info?.reward)?.toLocaleString() ?? 0} Gol
              </CustomText>
              <CustomText en fs={3} color="gray">
                Air Drop
              </CustomText>
            </CustomSpace>
          </Col>

          <Col md={6} className="d-flex justify-content-center mt-5 mb-2">
            <CustomSpace direction="vertical">
              <CustomText
                data-testid="kyc-profit-stake"
                en
                fs={1}
                color="white"
                data_test="total-profit"
                type="number"
                status={balances_status}
              >
                {toFix(BalanceInfo?.balance_info?.profit)?.toLocaleString() ?? 0} Gol
              </CustomText>
              <CustomText en fs={3} color="gray">
                Reward
              </CustomText>
            </CustomSpace>
          </Col>

          <Col xs={12} className="d-flex justify-content-center mt-5 mb-5">
            <CustomSpace direction="vertical">
              <CustomText en fs={1} color="gray" className="text-center">
                You have earned
              </CustomText>

              <CustomText
                data-testid="kyc-current-profit-amount-stake"
                en
                fs={1}
                color="white"
                data_test="current-profit"
                type="number"
                status={balances_status}
              >
                {toFix(CurrentProfitAmount)?.toLocaleString() ?? 0} Gol
              </CustomText>

              <ClaimButton
                data-testid="btn-kyc-claim"
                remaining_info={remaining_info!}
                balances_status={balances_status}
                getData={getData}
              />

              <KycButton
                data-testid="btn-kyc-status"
                onClick={handleClickKycButton}
                status={kycResponse?.status}
                loading={status === "loading"}
              />
              <CustomModal data-testid="kyc-openTransfer" show={openTransfer} onHide={() => setOpenTransfer(false)}>
                {openForm ? (
                  <TransferForm toggleModal={toggleModal} />
                ) : (
                  <Termsandcondition onClose={toggleModal} onAccept={onAcceptTearms} loading={balances_status === "loading"} />
                )}
              </CustomModal>
            </CustomSpace>
          </Col>
        </Row>
      )}
    </>
  )
}

interface props {
  status?: "PENDING" | "DECLINED" | "APPROVED" | "BANNED"
  loading?: boolean
  onClick?: VoidFunction
}
export const KycButton: FC<props> = ({ loading, status, onClick }) => {
  const { golc_config } = useAppSelector((state) => state.Balance)

  const Component = useMemo(() => {
    switch (status) {
      case "APPROVED":
        if (golc_config?.transfer_to_golc) {
          return (
            <CustomButton data-testid="btn-kyc-Change-to-GOLC" onClick={onClick}>
              {"Change to GOLC"}
            </CustomButton>
          )
        } else return null

      case "DECLINED":
        return (
          <>
            <CustomText color="white">Your KYC request is rejected</CustomText>
            <CustomButton data-testid="btn-kyc-Update-request" onClick={onClick}>
              {"Update your request"}
            </CustomButton>
          </>
        )
      case "PENDING":
        return (
          <CustomButton data-testid="btn-kyc-request-pending" disabled>
            {"Your request is pending"}
          </CustomButton>
        )
      case "BANNED":
        return (
          <>
            <CustomButton data-testid="btn-kyc-disabled-Banned" disabled>
              {"Your Account is Banned"}
            </CustomButton>
            <CustomText color="white">Please contact the support team</CustomText>
          </>
        )
      default:
        if (golc_config?.transfer_to_golc) {
          return (
            <CustomButton data-testid="btn-kyc-Complete-change-GOLC" onClick={onClick}>
              {"Complete your profile to change to GOLC"}
            </CustomButton>
          )
        } else
          return (
            <CustomButton data-testid="btn-kyc-Complete-profile" onClick={onClick}>
              {"Complete your profile"}
            </CustomButton>
          )
    }
  }, [status])

  return <>{loading ? <Spinner animation="border" variant="primary" /> : Component}</>
}

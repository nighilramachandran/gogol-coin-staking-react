import React, { useEffect, useState } from "react"
import { Container, Row, Col } from "react-bootstrap"
import { OpenPool } from "../../widgets/pools/open"
import { RunningPool } from "../../widgets/pools/running"
import { ClosedPool } from "../../widgets/pools/closed"
import { FetchActiveBalancesAsync, FetchBalancesAsync, GetGolcConfigAsync } from "../../core/redux/balance"
import { useAppDispatch, useAppSelector } from "../../core/redux/hooks"

import "./index.scss"
import { RunningPoolNew } from "../../widgets/pools/running-new"
import { OpenPoolNew } from "../../widgets/pools/open-new"
import { coinDecimal, coinDecimalGolc, tokenContractAddress, tokenContractAddress_golc } from "../../utils/constants"

import GOLABI from "../../GOLABI"
import GOLCABI from "../../GOLCABI"
import { CustomCard } from "../../components/custom-card"
import { CustomGroupButtons } from "../../components/custom-group-buttons"
import { AddStaking } from "../../widgets/pools/add-staking"
import { ConnectWallet } from "../../widgets/pools/connect-wallet"
// import { ConnectWallet } from "../../widgets/pools/connect-wallet"
import { FetchBalanceInfoGolcAsync } from "../../core/redux/balance-new"

export const Home: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<any>(1)
  const dispatch = useAppDispatch()
  const { active_balances, golc_config } = useAppSelector((state) => state.Balance)
  const { balance_info } = useAppSelector((state) => state.BalanceGolc)
  const { user } = useAppSelector((state) => state.Auth)
  const [hasBalance, setHasBalance] = useState<boolean>(false)

  useEffect(() => {
    if (Boolean(user?.golc)) {
      balance_info ? setSelectedTab(2) : golc_config?.add_staking ? setSelectedTab(1) : setSelectedTab(3)
      setHasBalance(true)
    } else if (active_balances.length) {
      setSelectedTab(2)
      setHasBalance(true)
    }
  }, [active_balances, user])

  useEffect(() => {
    dispatch(GetGolcConfigAsync())
    Boolean(!user?.golc) ? dispatch(FetchActiveBalancesAsync()) : dispatch(FetchBalanceInfoGolcAsync())
  }, [])

  const tokenContract = golc_config?.add_staking === "golc" ? tokenContractAddress_golc : tokenContractAddress
  const ABIContract = golc_config?.add_staking === "golc" ? GOLCABI : GOLABI
  const coinDecimals = golc_config?.add_staking === "golc" ? coinDecimalGolc : coinDecimal

  const radios = [
    {
      value: 2,
      name: "Running Pool",
    },
    {
      value: 3,
      name: "Completed Pool",
    },
  ]

  const onChangeTab = (value: any) => {
    let intValue = parseInt(value)
    if (intValue === 2) {
      if (hasBalance) setSelectedTab(2)
    }
    if (intValue === 3) {
      setSelectedTab(3)
    }
  }

  const canStaking = (golc_config?.add_staking && user?.golc) || (!user?.golc && !hasBalance)

  return (
    <Container className="home-content">
      <CustomCard>
        {selectedTab !== 1 ? (
          <>
            <Row className="justify-content-around align-items-center g-2">
              <Col xl={2} lg={1}></Col>
              <Col xl={canStaking ? 8 : 12} lg={canStaking ? 8 : 12}>
                <div className="d-flex justify-content-center ">
                  <CustomGroupButtons currentValue={selectedTab} onChange={onChangeTab} radios={radios} />
                </div>
              </Col>
              {canStaking && (
                <Col xl={2} lg={3}>
                  <div className="d-flex justify-content-center ">
                    <AddStaking tokenContractAddress={tokenContract} tokenABI={ABIContract} coinDecimal={coinDecimals} />
                  </div>
                </Col>
              )}
            </Row>
            {/* <Row className="m-section justify-content-center">
        <Col className="home-top-nav" xs={11}>
          <Row className="text-center">
            <Col
              xs={4}
              className={selectedTab === 1 ? "item active" : "item"}
              onClick={() => {
                if (golc_config?.add_staking) setSelectedTab(1)
              }}
            >
              {user?.golc ? "Add Staking" : "Open Pools"}
            </Col>
            <Col
              xs={4}
              className={selectedTab === 2 ? "item active" : "item"}
              onClick={() => {
                if (!user?.golc && hasBalance) setSelectedTab(2)
                if (user?.golc && balance_info) setSelectedTab(2)
              }}
            >
              Running Pools
            </Col>
            <Col
              xs={4}
              className={selectedTab === 3 ? "item active" : "item"}
              onClick={() => {
                setSelectedTab(3)
              }}
            >
              Details
            </Col>
          </Row>
        </Col>
      </Row>
*/}
            <Row className="justify-content-center mt-5">
              <Col xs={11}>
                {selectedTab === 1 &&
                  (golc_config?.add_staking === "golc" ? (
                    <OpenPoolNew tokenContractAddress={tokenContract} tokenABI={ABIContract} coinDecimal={coinDecimals} />
                  ) : (
                    <OpenPool tokenContractAddress={tokenContract} tokenABI={ABIContract} coinDecimal={coinDecimals} />
                  ))}
                {selectedTab === 2 && hasBalance && (Boolean(user?.golc) ? <RunningPoolNew /> : <RunningPool balances={active_balances} />)}
                {selectedTab === 3 && <ClosedPool />}
              </Col>
            </Row>
          </>
        ) : (
          <ConnectWallet tokenContractAddress={tokenContract} tokenABI={ABIContract} coinDecimal={coinDecimals} />
        )}
      </CustomCard>
    </Container>
  )
}

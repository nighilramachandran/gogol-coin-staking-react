import React, { useEffect, useMemo, useState } from "react"
import { Col, Row, Stack } from "react-bootstrap"
import { CustomButton } from "../../../components/custom-button"
import { CustomText } from "../../../components/custom-text"
import { Contract, ethers } from "ethers"
import { StakeForm } from "./stake-form"
import { CustomSpace } from "../../../components/custom-space"
import { useAppDispatch, useAppSelector } from "../../../core/redux/hooks"
import { SetWalletAddressAsync, CheckPendingTransactionAsync } from "../../../core/redux"
import { CustomCard } from "../../../components/custom-card"
import "./style.scss"
import { visualizeNumber } from "../../../utils/helpers/visualize-number"

export const OpenPool: React.FC<any> = ({ tokenContractAddress, tokenABI, coinDecimal }) => {
  const dispatch = useAppDispatch()
  const { wallet_address, hasPending } = useAppSelector((state) => state.Transaction)

  const [isConnected, setIsConnected] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isRejected, setIsRejected] = useState<boolean>(false)
  const [noWalllet, setNoWalllet] = useState<boolean>(false)
  const [userTokenBalance, setUserTokenBalance] = useState<any>(0)
  const [isInsufficient, setIsInsufficient] = useState<boolean>(false)

  const { user } = useAppSelector((state) => state.Auth)

  let tokenContract = new Contract(tokenContractAddress, tokenABI)
  let provider: any = {}

  useEffect(() => {
    dispatch(CheckPendingTransactionAsync())
  }, [])

  useEffect(() => {
    window.onbeforeunload = function () {
      if (isConnected) return true
    }

    return () => {
      window.onbeforeunload = null
    }
  }, [isConnected])

  const requestAccount = async () => {
    console.log("Requesting Wallet...")
    setIsLoading(true)
    // ❌ Check if Meta Mask Extension exists
    if ((window as any).ethereum) {
      console.log("Detected Wallet")

      try {
        await (window as any).ethereum.request({
          method: "eth_requestAccounts",
        })
      } catch (e) {
        setIsLoading(false)
        setIsRejected(true)
      }

      provider = new ethers.providers.Web3Provider((window as any).ethereum)

      let signer = (provider as any).getSigner()
      let signerAddress = await signer.getAddress()
      tokenContract = new ethers.Contract(tokenContractAddress, tokenABI, signer)

      let userTokenBalance = parseInt(((await tokenContract.balanceOf(signerAddress)) / 10000).toString())
      if (userTokenBalance < 25) setIsInsufficient(true)
      setUserTokenBalance(userTokenBalance)
      dispatch(SetWalletAddressAsync({ address: signerAddress }))
      setIsConnected(1)
      setIsLoading(false)
    } else {
      setIsLoading(false)
      setNoWalllet(true)
    }
    setIsLoading(false)
  }

  // Create a provider to interact with a smart contract
  const connectWallet = async () => {
    if (typeof (window as any).ethereum !== "undefined") {
      await requestAccount()
    } else {
      setNoWalllet(true)
      return
    }
    provider = new ethers.providers.Web3Provider((window as any).ethereum)
  }

  const ConnectWalletForm = () =>
    useMemo(() => {
      return (
        <>
          <Col xs={12} className="text-center m-sub-section">
            <CustomText data-testid="status-user-wallet" tag="h4" color="white">
              {user?.golc ? "Connect Your Wallet To Add Staking" : "Connect Your Wallet To Calculate Your Reward"}
            </CustomText>
            {isRejected && (
              <CustomText data-testid="Rejected-wallet" tag="h4" color="gold">
                You have to connect your wallet
              </CustomText>
            )}
          </Col>

          <Col lg={6} className="text-center mt-5">
            {noWalllet ? (
              <>
                <CustomText data-testid="detected-wallet" tag="h4" color="gold">
                  No Wallet Detected
                </CustomText>
                <CustomButton data-testid="btn-download-wallet" onClick={() => window.open("https://metamask.io/download/", "_blank")}>
                  Download Wallet Extension to your browser
                </CustomButton>
              </>
            ) : (
              <CustomButton data-testid="btn-loading-wallet" onClick={connectWallet} disabled={isLoading || hasPending}>
                {isLoading ? "Loading" : hasPending ? "You Have Pending Transaction" : "Connect your Wallet"}
              </CustomButton>
            )}
          </Col>
        </>
      )
    }, [isRejected, noWalllet, isLoading, hasPending])

  return (
    <Row className="justify-content-center">
      <Col>
        <Row className="align-items-center">
          <Col>
            <Stack direction="horizontal" gap={{ xs: 1 }} className="details-coin">
              <img
                data-testid="img-user-goldcoin-logo"
                src={user?.golc ? "/assets/images/gold-golcoin.png" : "/assets/images/logo.png"}
                alt="Logo"
                width={90}
                height={90}
                style={{ objectFit: "contain" }}
              />
              <CustomText color="gray">Pool: </CustomText>
              <CustomText color="white"> {" GogolCoin Gold"}</CustomText>
            </Stack>
          </Col>
          <div className="divider rounded m-3" />
          <Col>
            <Stack gap={{ xs: 2 }} className="stake-detail-container">
              <CustomSpace size={10} className="stake-detail">
                <CustomText color="gray">{"Pool Name: "}</CustomText>
                <CustomText color="white">GogolCoin Gold</CustomText>
              </CustomSpace>

              <CustomSpace size={10} className="stake-detail">
                <CustomText color="gray">{"APR: "}</CustomText>
                <CustomText color="white">1 Year</CustomText>
              </CustomSpace>

              <CustomSpace size={10} className="stake-detail">
                <CustomText color="gray">{"Lock-up Period: "}</CustomText>
                <CustomText color="white">365 Days</CustomText>
              </CustomSpace>

              <CustomSpace size={10} className="stake-detail">
                <CustomText color="gray">{"Minimum Stake: "}</CustomText>
                <CustomText color="white">25 GogolCoin</CustomText>
              </CustomSpace>

              <CustomSpace data-testid="stake-detail" size={10} className="stake-detail">
                <CustomText data-testid="stake-wallet-balance" color="gray">
                  {"Wallet Balance: "}
                </CustomText>
                <CustomText data-testid="stake-user-TokenBalance" color="white">
                  {visualizeNumber(userTokenBalance.toString())} GogolCoin
                </CustomText>
              </CustomSpace>
            </Stack>
          </Col>
        </Row>
      </Col>

      {/* <Col xs={12} className="divider-horizental w-75 mt-4"></Col> */}

      {isConnected && wallet_address ? (
        <StakeForm
          data-testid="table-form-stake"
          accountKey={wallet_address}
          tokenBalance={userTokenBalance}
          sufficient={!isInsufficient}
          tokenContractAddress={tokenContractAddress}
          tokenABI={tokenABI}
        />
      ) : (
        <ConnectWalletForm />
      )}
    </Row>
  )
}

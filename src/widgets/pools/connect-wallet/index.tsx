import { FC, useEffect, useState } from "react"
import { Col, Row, Stack } from "react-bootstrap"
import { CustomButton } from "../../../components/custom-button"
import { CustomText } from "../../../components/custom-text"
import { CheckPendingTransactionAsync, SetWalletAddressAsync } from "../../../core/redux"
import { useAppDispatch, useAppSelector } from "../../../core/redux/hooks"
import { Contract, ethers } from "ethers"
import { CustomSpace } from "../../../components/custom-space"
import { visualizeNumber } from "../../../utils/helpers/visualize-number"
import { StakeForm } from "../open-new/stake-form"

// export interface ConnectWalletProps {}
//TODO :Compare between golc and gogolcoin
export const ConnectWallet: FC<any> = ({ tokenContractAddress, tokenABI, coinDecimal, modal }) => {
  const dispatch = useAppDispatch()
  const { wallet_address, hasPending } = useAppSelector((state) => state.Transaction)
  const { user } = useAppSelector((state) => state.Auth)
  const [noWalllet, setNoWalllet] = useState<boolean>(false)

  const [isConnected, setIsConnected] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isRejected, setIsRejected] = useState<boolean>(false)
  let tokenContract = new Contract(tokenContractAddress, tokenABI)
  const [isInsufficient, setIsInsufficient] = useState<boolean>(false)
  const [userTokenBalance, setUserTokenBalance] = useState<any>(0)

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
  return (
    <Row data-testid="row-connect-wallet" className="align-items-center justify-content-center g-3">
      {!modal && (
        <Col lg={6} xs={12}>
          <img className="w-100" src={"assets/images/connect_gogol.png"} style={{ borderRadius: "13px" }} />
        </Col>
      )}
      <Col lg={!modal ? 6 : 12} xs={!modal ? 12 : 10}>
        <Row className="align-items-center justify-content-center mb-4">
          <Col xs={6}>
            <Stack gap={{ xs: 3 }} className="justify-content-center">
              <Row fill size={60} justify="start">
                <Col xs={6}>
                  <CustomText data-testid="connect-wallet-pool-name" color="gray">
                    {"Pool Name: "}
                  </CustomText>
                </Col>
                <Col xs={6}>
                  <CustomText data-testid="connect-wallet-coin-Gold" color="gold">
                    GogolCoin Gold
                  </CustomText>
                </Col>
              </Row>

              <Row fill size={118} justify="start">
                <Col xs={6}>
                  <CustomText data-testid="connect-wallet-APR" color="gray">
                    {"APR: "}
                  </CustomText>
                </Col>
                <Col xs={6}>
                  <CustomText data-testid="connect-wallet-Year" color="gold">
                    1 Year
                  </CustomText>
                </Col>
              </Row>

              <Row fill size={28} justify="start">
                <Col xs={6}>
                  <CustomText data-testid="connect-wallet-lock-up-Period" color="gray">
                    {"Lock-up Period: "}
                  </CustomText>
                </Col>
                <Col xs={6}>
                  <CustomText data-testid="connect-wallet-Days" color="gold">
                    365 Days
                  </CustomText>
                </Col>
              </Row>

              <Row fill size={25} justify="start">
                <Col xs={6}>
                  <CustomText data-testid="connect-wallet-minimum-stake" color="gray">
                    {"Minimum Stake: "}
                  </CustomText>
                </Col>
                <Col xs={6}>
                  <CustomText color="gold">25 GogolCoin</CustomText>
                </Col>
              </Row>

              <Row fill size={30} justify="start">
                <Col xs={6}>
                  <CustomText data-testid="connect-wallet-balance" color="gray">
                    {"Wallet Balance: "}
                  </CustomText>
                </Col>
                <Col xs={6}>
                  <CustomText data-testid="connect-wallet-user-token-balance" color="gold">
                    {visualizeNumber(userTokenBalance.toString())} GogolCoin
                  </CustomText>
                </Col>
              </Row>
            </Stack>
          </Col>
        </Row>

        <Row data-testid="row-form-connect-wallet" className="align-items-center justify-content-center">
          {isConnected && wallet_address ? (
            <StakeForm
              data-testid="form-connect-wallet"
              accountKey={wallet_address}
              tokenBalance={userTokenBalance}
              sufficient={!isInsufficient}
              tokenContractAddress={tokenContractAddress}
              tokenABI={tokenABI}
              coinDecimal={coinDecimal}
            />
          ) : (
            <>
              <Col data-testid="form-nowallet" lg={6} className="text-center">
                {noWalllet ? (
                  <>
                    <CustomText data-testid="nowallet" tag="h4" color="gold">
                      No Wallet Detected
                    </CustomText>
                    <CustomButton data-testid="btn-download-wallet" onClick={() => window.open("https://metamask.io/download/", "_blank")}>
                      Download Wallet Extension to your browser
                    </CustomButton>
                  </>
                ) : (
                  <CustomButton data-testid="btn-connect-wallet" onClick={connectWallet} disabled={isLoading || hasPending}>
                    {isLoading ? "Loading" : hasPending ? "You Have Pending Transaction" : "Connect your Wallet"}
                  </CustomButton>
                )}
              </Col>
              <Col xs={12} className="text-center m-sub-section">
                <CustomText data-testid="text-user-wallet" fs={5} color="gray">
                  {user?.golc ? "Connect Your Wallet To Add Staking" : "Connect Your Wallet To Calculate Your Reward"}
                </CustomText>
                {isRejected && (
                  <CustomText data-testid="text-user-have-to-connect" fs={5} color="gold">
                    You have to connect your wallet
                  </CustomText>
                )}
              </Col>
            </>
          )}
        </Row>
      </Col>
    </Row>
  )
}

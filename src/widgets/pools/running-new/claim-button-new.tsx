import { ethers } from "ethers"
import moment from "moment"
import React, { useEffect, useState } from "react"
import { Modal, Row, Col } from "react-bootstrap"
import { useIsMounted } from "usehooks-ts"
import { CustomButton } from "../../../components/custom-button"
import { CustomSpace } from "../../../components/custom-space"
import { CustomText } from "../../../components/custom-text"
import { Timeline_Res } from "../../../core/models"
import { useAppDispatch, useAppSelector } from "../../../core/redux/hooks"
import { WithdrawAsync } from "../../../core/redux/profit"
import { RequestStatus } from "../../../utils/constants"
import { greencolor } from "../../../utils/constants/valiables"

export const ClaimButtonNew: React.FC<{
  time_line_data: Timeline_Res
  balances_status: RequestStatus
  getData: () => void
}> = ({ time_line_data, balances_status, getData }) => {
  const [wallet_dialog_visible, setwallet_dialog_visible] = useState(false)
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.Auth)

  const [isConnected, setIsConnected] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isRejected, setIsRejected] = useState<boolean>(false)
  const [noWalllet, setNoWalllet] = useState<boolean>(false)
  const isMounted = useIsMounted()

  const { withdraw_success, status } = useAppSelector((state) => state.Profit)

  let provider: any = {}

  useEffect(() => {
    window.onbeforeunload = function () {
      if (isConnected) return true
    }
    return () => {
      window.onbeforeunload = null
    }
  }, [isConnected])

  useEffect(() => {
    if (isMounted() && withdraw_success) {
      console.log(`data is here`)
      getData()
    }
  }, [withdraw_success, isMounted])

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
      setIsConnected(1)
      setIsLoading(false)
      return signerAddress
    } else {
      setNoWalllet(true)
      setIsLoading(false)
      return undefined
    }
  }

  // Create a provider to interact with a smart contract
  const connectWallet = async () => {
    if (typeof (window as any).ethereum !== "undefined") {
      const receiver_wallet_public_key = await requestAccount()
      dispatch(WithdrawAsync({ receiver_wallet_public_key }))
      setwallet_dialog_visible(false)
      getData()
    } else {
      setNoWalllet(true)
      return
    }
    provider = new ethers.providers.Web3Provider((window as any).ethereum)
  }

  const wallet_dialog = (
    <Modal show={!!wallet_dialog_visible} onHide={() => setwallet_dialog_visible(false)}>
      <Modal.Header>
        <Modal.Title data-testid="New-title-connect-wallet">Connect Wallet</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col xs={12} className="m-sub-section">
            <CustomText tag="h5" color="white">
              Connect Your Wallet To Calculate Your Reward
            </CustomText>
            {noWalllet && (
              <div className="p-4">
                <CustomText tag="h5" color="gold">
                  No Wallet Detected
                </CustomText>
                <CustomButton
                  data-testid="btn-download-New-claim"
                  bg="gray"
                  onClick={() => window.open("https://metamask.io/download/", "_blank")}
                >
                  Download Wallet Extension to your browser
                </CustomButton>
              </div>
            )}
            {isRejected && (
              <CustomText tag="p" color="error">
                You have to connect your wallet
              </CustomText>
            )}
          </Col>
        </Row>
        <CustomSpace style={{ marginLeft: "auto" }}>
          <CustomButton data-testid="btn-cancel-New-claim" bg="gray" onClick={() => setwallet_dialog_visible(false)}>
            Cancel
          </CustomButton>

          <CustomButton data-testid="btn-connect-New-claim" onClick={connectWallet} disabled={isLoading || status === "loading"}>
            Connect
          </CustomButton>
        </CustomSpace>
      </Modal.Body>
    </Modal>
  )

  return (
    <>
      {wallet_dialog}
      <CustomButton
        disabled={!time_line_data?.withdrawable || user?.status === "HOLD"}
        style={{ color: "#000", background: greencolor, border: `1px solid ${greencolor}`, minWidth: 160, fontSize: 22 }}
        onClick={() => setwallet_dialog_visible(true)}
      >
        {/* {false ? ( */}
        {!time_line_data?.withdrawable && time_line_data?.current_draw_date ? (
          <CustomText>
            Claim after{" "}
            <CustomText data_test="claim-after" status={balances_status}>
              {moment(time_line_data?.current_draw_date).diff(moment().clone().hour(0).minute(0).second(0).millisecond(0), "days")}
            </CustomText>{" "}
            days
          </CustomText>
        ) : (
          // <CustomText data_test="claim" disable={true} status={balances_status}>
          //   Pending
          // </CustomText>
          <CustomText data_test="claim" status={balances_status}>
            {time_line_data?.current_draw_date ? "Claim" : "Pending"}
          </CustomText>
        )}
      </CustomButton>
    </>
  )
}
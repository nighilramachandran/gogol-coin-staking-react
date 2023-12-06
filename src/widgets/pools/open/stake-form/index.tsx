import React, { useEffect, useState } from "react"
import { Col } from "react-bootstrap"
import { CustomButton } from "../../../../components/custom-button"
import { CustomText } from "../../../../components/custom-text"
import { CustomInput } from "../../../../components/custom-input"
import { ethers } from "ethers"
import { api } from "../../../../utils/api"
import { toast } from "../../../../utils"
import { useTranslation } from "react-i18next"
import { useAppSelector } from "../../../../core/redux/hooks"
import { ourWalletAddress } from "../../../../utils/constants"
import { visualizeNumber } from "../../../../utils/helpers/visualize-number"

export const StakeForm: React.FC<{
  tokenBalance: number
  accountKey: string
  sufficient: boolean
  tokenContractAddress: string
  tokenABI: any
}> = ({ tokenBalance, tokenContractAddress, sufficient, tokenABI }) => {
  const [amount, setAmount] = useState<string>(tokenBalance.toString())
  const [dropReward, setDropReward] = useState<string>("0")
  const [totalReward, setTotalReward] = useState<string>("0")
  const [userTokenBalance, setUserTokenBalance] = useState<any>(-1)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isSent, setIsSent] = useState<boolean>(false)

  const { t } = useTranslation()
  const { user } = useAppSelector((state) => state.Auth)

  async function transactionAPI(txHash: string, amount: number, walletAddress: string) {
    let response = await api.post("/transaction/create", {
      sender_wallet_public_id: walletAddress,
      txhash: txHash,
      amount: amount,
      currency: "GOL",
      subscription_id: user?.golc ? 2 : 1,
    })

    if (response?.status) {
      toast.success("Success")
      window.location.reload()
    } else {
      toast.error("Error, Please Contact us ASAP")
    }
  }

  async function transferGols(amount: any) {
    amount = parseInt(amount.replaceAll(",", ""))
    if (amount < 25) {
      if (user?.golc) return
      else {
        toast.error("Minimum Stake Amount is 25")
        return
      }
    }

    setIsLoading(true)
    let provider: ethers.providers.Web3Provider = new ethers.providers.Web3Provider((window as any).ethereum)

    let signer = provider.getSigner()
    let gasPrice = provider.getGasPrice()
    let walletAddress = await signer.getAddress()
    let transferContract: ethers.Contract = await new ethers.Contract(tokenContractAddress, tokenABI, signer)

    try {
      let transaction = await transferContract.connect(signer).transfer(ourWalletAddress, amount * 10000, {
        gasPrice: gasPrice,
      })
      let txHash = transaction.hash.toString()

      // Transaction Done
      localStorage.setItem("transaction_hold", txHash)
      transactionAPI(txHash, amount, walletAddress)
      setIsSent(true)
      localStorage.setItem("sent_transaction", "true")
      localStorage.removeItem("transaction_hold")
      toast.success("Sent Successfully, Please wait it may take 2 mins...")
    } catch (e: any) {
      if (e?.code === 4001) {
        console.log(e?.code)
        toast.error("Transaction Canceled")
      } else toast.error("Inufficient Coins in Wallet")
    }
    setIsLoading(false)
  }

  useEffect(() => {
    if (userTokenBalance === -1) {
      setUserTokenBalance(tokenBalance)
      calculateReward(tokenBalance)
    }
  }, [userTokenBalance])

  const getDropReward = (value: any) => {
    let drop = 0
    if (value >= 10000) drop = 1000
    if (value >= 25000) drop = 3500
    if (value >= 50000) drop = 7500
    if (value >= 100000) drop = 15000
    if (value >= 150000) drop = 35000
    if (value >= 200000) drop = 50000
    if (value >= 250000) drop = 70000
    drop = 0
    return drop
  }

  const calculateReward = (value: any) => {
    if (userTokenBalance === -1) {
      value = tokenBalance
    }
    let visualValue = visualizeNumber(value.toString())

    let actualValue = parseInt(visualValue.replaceAll(",", ""))

    if (actualValue > userTokenBalance && userTokenBalance !== -1) {
      actualValue = userTokenBalance
      visualValue = visualizeNumber(actualValue.toString())
    }

    setAmount(visualValue)
    let drop = getDropReward(actualValue)

    setDropReward(drop.toString())
    actualValue += drop

    let total = Math.floor(actualValue * 1.5) + drop
    if (!total) total = 0
    setTotalReward(visualizeNumber(total.toString()))
  }

  return (
    <>
      <Col xs={12} className="text-center m-sub-section">
        <CustomText data-testid="enter-GOL-staking" tag="h4" color="gold" style={{ color: "#fff" }}>
          Enter Your GOL Staking Amount
        </CustomText>
      </Col>
      <Col xs={10}>
        {!sufficient && (
          <CustomText data-testid="sufficient_warning" color="white">
            {t("sufficient_warning")}
          </CustomText>
        )}
        <CustomInput
          data-testid="input-sufficient_warning"
          name="sufficient_warning"
          onInput={(e: any) => calculateReward(e.target.value)}
          autoFocus
          value={amount}
        ></CustomInput>
      </Col>
      {/* <Col xs={12} className="text-center m-sub-section">
        <CustomText tag="h4" color="gold">
          Air Drop Estimate
        </CustomText>
      </Col>
      <Col xs={8} className="text-center">
        <CustomText className="t-2">{dropReward}</CustomText>
      </Col> */}
      {/* <Col xs={12} className="text-center m-sub-section">
        <CustomText tag="h4" color="gold">
          Reward Estimate in 1 Year
        </CustomText>
      </Col> */}
      {/* <Col xs={8} className="text-center">
        <CustomText className="t-2">{totalReward}</CustomText>
      </Col> */}
      <Col lg={6} className="text-center mt-5">
        <CustomButton
          data-testid="btn-transferGols"
          onClick={() => {
            transferGols(amount)
          }}
          disabled={isLoading || !sufficient}
        >
          {!isLoading || isSent ? (user?.golc ? "Add Stake" : "Start Your Stake") : "Loading"}
        </CustomButton>
      </Col>
    </>
  )
}

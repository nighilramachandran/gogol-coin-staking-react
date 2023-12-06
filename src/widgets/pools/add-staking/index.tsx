import { FC, useState } from "react"
import { CustomModal } from "../../../components/custom-modal"
import { CustomText } from "../../../components/custom-text"
import { ConnectWallet } from "../connect-wallet"
import "./index.scss"

export const AddStaking: FC<any> = ({ tokenContractAddress, tokenABI, coinDecimal }) => {
  const [showModal, setShowModal] = useState<boolean>(false)
  return (
    <>
      <CustomModal show={showModal} onHide={() => setShowModal(false)}>
        <ConnectWallet modal tokenContractAddress={tokenContractAddress} tokenABI={tokenABI} coinDecimal={coinDecimal} />
      </CustomModal>
      <div className="d-flex align-items-center gap-2 add-staking-container" onClick={() => setShowModal(true)}>
        <div className="circle-container">
          <div className="circle">
            <img data-testid="img-add-staking" src="/assets/icons/plus.svg" />
          </div>
        </div>
        <CustomText data-testid="title-add-staking" color="gray">
          Add staking
        </CustomText>
      </div>
    </>
  )
}

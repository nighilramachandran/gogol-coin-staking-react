import React, { useState, useEffect, useRef, useCallback } from "react"
import { CustomText } from "../../../../components/custom-text"
import { CustomButton } from "../../../../components/custom-button"
import { useAppDispatch, useAppSelector } from "../../../../core/redux/hooks"

import "../style.scss"
import { FetchChangeToGolCalc } from "../../../../core/redux/balance"

interface TermsProps {
  onAccept: VoidFunction
  onClose?: VoidFunction
  loading: boolean
}

export default function Termsandcondition({ onAccept, onClose, loading }: TermsProps) {
  const [input1, setInput1] = useState<boolean>(false)
  const [input2, setInput2] = useState<boolean>(false)
  const [input3, setInput3] = useState<boolean>(false)
  const [input4, setInput4] = useState<boolean>(false)

  const dispatch = useAppDispatch()
  const { golc_calc } = useAppSelector((state) => state.Balance)
  const arr = Array.from(Array(golc_calc?.number_of_held_balances ?? 0).keys())

  useEffect(() => {
    dispatch(FetchChangeToGolCalc())
  }, [])
  const [counter, setCounter] = React.useState(15)

  // // Third Attempts
  React.useEffect(() => {
    const timer: any = counter > 0 && setInterval(() => setCounter(counter - 1), 1000)
    return () => clearInterval(timer)
  }, [counter])

  return (
    <div className="termsandcondition">
      <CustomText
        data-testid="New-Change-to-golcoin"
        en
        style={{ fontSize: "30px" }}
        className="termsandcondition-title"
        color="gold"
        fw="bold"
      >
        Change to GolCoin Currency
      </CustomText>

      <div className="terms-and-condition-wrapper">
        <div data-testid="New-kyc-terms" className="terms-and-condition">
          <CustomText en color="white">
            <CustomText data-testid="New-kyc-title-terms" fw="bold">
              You are about to make an irreversible action.{" "}
            </CustomText>
            <br />
            This action cannot be changed or reversed if you submit the acceptance form, Please read the terms and conditions of changing
            your GOLs to GOLCs.
          </CustomText>

          <CustomText en color="white">
            Those are the major 4 terms of changing to GOLC:
          </CustomText>

          <CustomText>
            <input data-testid="New-input-kyc-terms" type="checkbox" checked={input1} onChange={() => setInput1(!input1)} />
            All your profit and airdrops (rewards) will be deleted, and you will be only getting the amount that you have sent through your
            wallet.
          </CustomText>
          <CustomText en color="white">
            <input data-testid="New-inpu2t-kyc-terms" type="checkbox" checked={input2} onChange={() => setInput2(!input2)} />
            Your unclaimed profit will be removed, and your claimed profit will be deducted from the staking amount.
          </CustomText>
          <CustomText en color="white">
            <input data-testid="New-input3-kyc-terms" type="checkbox" checked={input3} onChange={() => setInput3(!input3)} />
            You are only allowed to submit your lists of GOLCs after 3 months from the date of acceptance, and you will be allowed to get 4%
            on the balance below 100,000 GOLC and calculate the 0.05% increase on every 10,000 GOLC above 100,000 GOLC and calculate the 5%
            on the balance greater than 300,000 GOLC of the remaining staking amount per month.
          </CustomText>
          <CustomText en color="white">
            <input data-testid="New-input4-kyc-terms" type="checkbox" checked={input4} onChange={() => setInput4(!input4)} />
            Not all the staking balance will be available and active, please refer to terms & conditions for more information.
          </CustomText>
          <CustomText en color="white">
            To read the full terms and conditions, please refer to our{" "}
            <a href="/terms-and-conditions" target={"_blank"}>
              <CustomText color="gold">Terms and Condition</CustomText>
            </a>{" "}
            page
          </CustomText>
          <CustomText en color="white">
            Your staking balance will be as shown below:
          </CustomText>
          <div className="d-flex justify-content-center">
            <div data-testid="New-table-wrapper-kyc-terms" className="table-wrapper">
              <table>
                <tr>
                  <th>
                    <CustomText en color="gold" fw="bold">
                      Balance
                    </CustomText>
                  </th>
                  {arr.map((el) => (
                    <th>
                      <CustomText color="white" fw="regular">
                        100k
                      </CustomText>
                    </th>
                  ))}

                  <th>
                    <CustomText color="white" fw="regular">
                      {golc_calc?.active_balance}
                    </CustomText>
                  </th>
                </tr>
                <tr>
                  <td>
                    <CustomText en color="gold" fw="bold">
                      Status
                    </CustomText>
                  </td>
                  {arr.map((el) => (
                    <td>
                      <CustomText color="white">Held</CustomText>
                    </td>
                  ))}
                  <td>
                    <CustomText color="white">Active</CustomText>
                  </td>
                </tr>
              </table>
            </div>
          </div>
          <div className="d-flex justify-content-around">
            <CustomButton data-testid="New-btn-table-kyc-terms" className="btn-terms-decline" onClick={onClose}>
              Decline
            </CustomButton>
            <CustomButton
              className="btn-terms-active"
              onClick={onAccept}
              disabled={!input1 || !input2 || !input3 || !input4 || counter !== 0 || loading}
            >
              Accept
              {counter > 0 && ` (${counter})`}
            </CustomButton>
          </div>
        </div>
      </div>
    </div>
  )
}

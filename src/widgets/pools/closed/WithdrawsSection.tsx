import { FC, useEffect } from "react"
import { Col, Row } from "react-bootstrap"
import { CustomTablePool } from "../../../components/custom-table-pool"
import { CustomText } from "../../../components/custom-text"
import { useAppDispatch, useAppSelector } from "../../../core/redux/hooks"
import { FetchWithDrawHistoryAsync } from "../../../core/redux/profit"
import { toFixedWithoutRound } from "../../../utils/helpers/to-fixed-without-round"
import "./index.scss"

export const WithdrawsSection: FC<{}> = () => {
  const dispatch = useAppDispatch()
  const { withdraw_history } = useAppSelector((state) => state.Profit)
  const { user } = useAppSelector((state) => state.Auth)

  useEffect(() => {
    dispatch(FetchWithDrawHistoryAsync(user?.golc))
  }, [])
  return (
    <div className="d-flex flex-column align-items-center gap-4">
      <div className="closed-content">
        <Row data-testid="row-Withdraw-pool" className="justify-content-center g-0">
          <Col xs={12}>
            {withdraw_history.length !== 0 ? (
              <CustomTablePool
                data-testid="table-Withdraw-pool"
                header={["Created at", "Reciver Wallet", "Original Amount", "Received Amount", "Currency", "Status"]}
                content={[
                  ...withdraw_history.map(({ created_at, receiver_wallet_public_key, currency, status, gross_amount, net_amount }) => [
                    created_at.toDateString(),
                    receiver_wallet_public_key,
                    toFixedWithoutRound((gross_amount * 100).toFixed(3), 3).toString(),
                    toFixedWithoutRound((net_amount * 100).toFixed(3), 3).toString(),
                    currency,
                    status,
                  ]),
                ]}
              />
            ) : (
              <CustomText>No results found </CustomText>
            )}
          </Col>
        </Row>
      </div>

      {/* <img style={{ height: "280px", width: "280px" }} src="/assets/images/withdraws-golcoin.svg" /> */}
    </div>
  )
}

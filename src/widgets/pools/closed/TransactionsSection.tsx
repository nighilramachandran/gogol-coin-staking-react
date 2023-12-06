import { FC, useEffect } from "react"
import { Col, Container, Row } from "react-bootstrap"
import { CustomTablePool } from "../../../components/custom-table-pool"
import { CustomText } from "../../../components/custom-text"
import { FetchTransHistoryAsync } from "../../../core/redux"
import { useAppDispatch, useAppSelector } from "../../../core/redux/hooks"
import { FetchWithDrawHistoryAsync } from "../../../core/redux/profit"
import { TableComponent } from "../../../pages"
import "./index.scss"

export const TransactionsSection: FC<{}> = () => {
  const dispatch = useAppDispatch()
  const { transactionsHistory } = useAppSelector((state) => state.Transaction)
  //   const { user } = useAppSelector((state) => state.Auth)

  useEffect(() => {
    dispatch(FetchTransHistoryAsync())
  }, [])
  return (
    <div className="ml-6 mr-6 closed-content">
      {/* <div className="learn-more-content"> */}
      {/* <Row className="justify-content-center g-0"> */}
      {/* <div className="closed-content"> */}

      <Row data-testid="row-transactions-pool" className="justify-content-center g-0">
        <Col md={9} xs={11}>
          {transactionsHistory.length !== 0 ? (
            <CustomTablePool
              data-testid="table-transactions-pool"
              header={["Created at", "Amount", "Currency", "Status"]}
              content={[
                ...transactionsHistory.map(({ created_at, amount, currency, status }) => [
                  created_at.toString(),
                  Number(amount).toFixed(2).toString(),
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

      {/* </div> */}

      {/* </Row> */}
      {/* </div> */}

      {/* <img style={{ height: "280px", width: "280px" }} src="/assets/images/withdraws-golcoin.svg" /> */}
    </div>
  )
}

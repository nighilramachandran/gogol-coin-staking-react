import moment from "moment"
import React, { useEffect } from "react"
import { Row, Col } from "react-bootstrap"
import { CustomCard } from "../../../components/custom-card"
import { CustomInputFormProps } from "../../../components/custom-form/custom-form"
import { WithDrawHistory } from "../../../core/models"
import { FetchAcceptedClaimsAsync } from "../../../core/redux/dashboard/balance"
import { useAppDispatch, useAppSelector } from "../../../core/redux/hooks"
import { CRUDBuilder } from "../../../widgets/crud-builder"

import "../index.scss"

const inputs: CustomInputFormProps[] = [
  {
    type: "text",
    name: "id",
    label: "ID",
    colProps: { xs: 12 },
    ignore: true,
  },
  {
    type: "text",
    name: "name",
    label: "Full Name",
    colProps: { xs: 12 },
    accessor: (row: any) => `${row.balance.user.first_name} ${row.balance.user.last_name}`,
    ignore: true,
  },
  {
    type: "email",
    name: "email",
    label: "Email",
    colProps: { xs: 12 },
    accessor: (row: any) => `${row.balance.user.email}`,
    ignore: true,
  },
  {
    type: "text",
    name: "txhash",
    label: "TxHash",
    colProps: { xs: 12 },
    ignore: true,
  },

  {
    type: "text",
    name: "receiver_wallet_public_key",
    label: "Receiver Wallet Public Key",
    colProps: { xs: 12 },
    ignore: true,
  },
  {
    type: "text",
    name: "gross_amount",
    label: "Original Amount",
    colProps: { xs: 12 },
    ignore: true,
  },
  {
    type: "text",
    name: "net_amount",
    label: "Received Amount",
    colProps: { xs: 12 },
    ignore: true,
  },
  {
    type: "text",
    name: "status",
    label: "Status",
    colProps: { xs: 12 },
    ignore: true,
  },
  {
    type: "text",
    name: "created_at",
    label: "Created At",
    accessor: (withdraw: WithDrawHistory) => moment(withdraw.created_at).format("YYYY-MM-DD hh:mm:ss"),
    colProps: { xs: 12 },
    ignore: true,
  },
]

export const AcceptedClaims: React.FC = () => {
  const dispatch = useAppDispatch()
  const { status, accepted_claims } = useAppSelector((state) => state.AdminBalance)

  useEffect(() => {
    dispatch(FetchAcceptedClaimsAsync())
  }, [])

  return (
    <Row className="px-3 g-0" data-testid="row-accepted-claims">
      <Col>
        <CustomCard data-testid="card-accepted-claims" dashboard>
          <CRUDBuilder
            data-testid="table-accepted-claims"
            inputs={inputs}
            title={"Accepted Claims"}
            data={accepted_claims.data}
            status={status}
            reFetch={() => dispatch(FetchAcceptedClaimsAsync())}
            nextPage={() => dispatch(FetchAcceptedClaimsAsync({ page: Number(accepted_claims.page) + 1 }))}
            prevPage={() => dispatch(FetchAcceptedClaimsAsync({ page: Number(accepted_claims.page) - 1 }))}
            gotoPage={(page: number) => dispatch(FetchAcceptedClaimsAsync({ page }))}
            page={Number(accepted_claims.page)}
            total_pages={Number(accepted_claims.total_pages)}
            onSearch={(search: string) => dispatch(FetchAcceptedClaimsAsync({ page: 0, search }))}
          />
        </CustomCard>
      </Col>
    </Row>
  )
}

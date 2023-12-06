import React, { useEffect } from "react"
import { Row, Col } from "react-bootstrap"
import { CustomCard } from "../../../components/custom-card"
import { CustomInputFormProps } from "../../../components/custom-form/custom-form"
import { CustomText } from "../../../components/custom-text"
import {
  DeleteAdminTransactionAsync,
  DeleteGolcAdminTransactionAsync,
  FetchAdminTransactionsAsync,
  FetchGolcAdminTransactionsAsync,
  UpdateAdminTransactionAsync,
  UpdateGolcAdminTransactionAsync,
} from "../../../core/redux/dashboard/transaction"
import { useAppDispatch, useAppSelector } from "../../../core/redux/hooks"
import { toast } from "../../../utils"
import { SubstringLongText } from "../../../utils/helpers/substringLongText"
import { CRUDBuilder } from "../../../widgets/crud-builder"

const handleCopy = (text: string) => {
  navigator.clipboard.writeText(text)
  toast.success("Text copied")
}
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
    name: "first_name",
    accessor: (row: any) => `${row.user?.first_name} ${row.user?.last_name}`,
    label: "Full Name",
    colProps: { xs: 12 },
    ignore: true,
  },
  {
    type: "text",
    name: "email",
    accessor: (row: any) => row.user?.email,
    label: "Email",
    colProps: { xs: 12 },
    ignore: true,
  },

  {
    type: "text",
    name: "subscription",
    accessor: (row: any) => row.subscription.pool,
    label: "Subscription Name",
    validate: { required: true },
    colProps: { xs: 12 },
    ignore: true,
  },
  {
    type: "text",
    name: "phone_number",
    accessor: (row: any) => row.user?.phone_number,
    label: "Phone Number",
    colProps: { xs: 12 },
    ignore: true,
  },
  {
    type: "text",
    name: "created_at",
    // accessor: (row: any) => Number(row.amount).toLocaleString("en"),
    label: "Transaction Date",
    ignore: true,
  },
  {
    type: "text",
    name: "amount",
    accessor: (row: any) => Number(row.amount).toLocaleString("en"),
    label: "Transaction Amount",
    validate: { required: true },
    colProps: { xs: 12 },
  },
  {
    type: "text",
    name: "currency",
    accessor: (row: any) => row.currency,
    label: "Currency",
    validate: { required: true },
    colProps: { xs: 12 },
  },
  {
    type: "text",
    name: "txhash",
    accessor(row) {
      return (
        <CustomText copyable={row.txhash} onClick={() => handleCopy(row.txhash)}>
          {SubstringLongText({ text: String(row.txhash), numFirstChars: 8, numEndChars: 4 })}
        </CustomText>
      )
    },
    label: "TxHash",
    validate: { required: true },
    colProps: { xs: 12 },
    ignore: true,
  },
  {
    type: "text",

    name: "sender_wallet_public_key",
    accessor(row) {
      return (
        <CustomText copyable={row.sender_wallet_public_key} onClick={() => handleCopy(row.sender_wallet_public_key)}>
          {SubstringLongText({ text: String(row.sender_wallet_public_key), numFirstChars: 8, numEndChars: 4 })}
        </CustomText>
      )
    },
    label: "Sender Wallet",
    validate: { required: true },
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
]

export const Transaction: React.FC = () => {
  const dispatch = useAppDispatch()
  const { Transactions, status } = useAppSelector((state) => state.AdminTransaction)
  const { permessions } = useAppSelector((state) => state.Auth)

  useEffect(() => {
    dispatch(FetchAdminTransactionsAsync())
  }, [])

  return (
    <Row className="px-3 g-0" data-testid="row-Transaction">
      <Col>
        <CustomCard data-testid="card-transaction" dashboard>
          <CRUDBuilder
            data-testid="table-Transaction"
            inputs={inputs}
            title={"Transaction"}
            data={Transactions.data}
            status={status}
            onUpdate={
              permessions.isAdmin
                ? (vals: any) =>
                    dispatch(UpdateAdminTransactionAsync({ ...vals, amount: Number((vals.amount as string).replaceAll(",", "")) }))
                : undefined
            }
            onDelete={permessions.isAdmin ? (id: number) => dispatch(DeleteAdminTransactionAsync({ id })) : undefined}
            reFetch={() => dispatch(FetchAdminTransactionsAsync())}
            nextPage={() => dispatch(FetchAdminTransactionsAsync({ page: Number(Transactions.page) + 1 }))}
            prevPage={() => dispatch(FetchAdminTransactionsAsync({ page: Number(Transactions.page) - 1 }))}
            gotoPage={(page: number) => dispatch(FetchAdminTransactionsAsync({ page }))}
            page={Number(Transactions.page)}
            total_pages={Number(Transactions.total_pages)}
            onSearch={(search: string) => dispatch(FetchAdminTransactionsAsync({ page: 0, search }))}
          />
        </CustomCard>
      </Col>
    </Row>
  )
}

export const GolcTransaction: React.FC = () => {
  const dispatch = useAppDispatch()
  const { GolcTransactions, status } = useAppSelector((state) => state.AdminTransaction)
  const { permessions } = useAppSelector((state) => state.Auth)

  useEffect(() => {
    dispatch(FetchGolcAdminTransactionsAsync())
  }, [])

  return (
    <Row className="px-3 g-0" data-testid="row-GolcTransaction">
      <Col>
        <CustomCard data-testid="card-golc-transaction" dashboard>
          <CRUDBuilder
            data-testid="table-GolcTransaction"
            inputs={inputs}
            title={"Transaction"}
            data={GolcTransactions.data}
            status={status}
            onUpdate={
              permessions.isAdmin
                ? (vals: any) =>
                    dispatch(UpdateGolcAdminTransactionAsync({ ...vals, amount: Number((vals.amount as string).replaceAll(",", "")) }))
                : undefined
            }
            onDelete={permessions.isAdmin ? (id: number) => dispatch(DeleteGolcAdminTransactionAsync({ id })) : undefined}
            reFetch={() => dispatch(FetchGolcAdminTransactionsAsync())}
            nextPage={() => dispatch(FetchGolcAdminTransactionsAsync({ page: Number(GolcTransactions.page) + 1 }))}
            prevPage={() => dispatch(FetchGolcAdminTransactionsAsync({ page: Number(GolcTransactions.page) - 1 }))}
            gotoPage={(page: number) => dispatch(FetchGolcAdminTransactionsAsync({ page }))}
            page={Number(GolcTransactions.page)}
            total_pages={Number(GolcTransactions.total_pages)}
            onSearch={(search: string) => dispatch(FetchGolcAdminTransactionsAsync({ page: 0, search }))}
          />
        </CustomCard>
      </Col>
    </Row>
  )
}

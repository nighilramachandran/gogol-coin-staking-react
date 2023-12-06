import React, { useEffect } from "react"
import { Row, Col } from "react-bootstrap"
import { CustomCard } from "../../../components/custom-card"
import { CustomInputFormProps } from "../../../components/custom-form/custom-form"
import {
  DeleteAdminBalanceAsync,
  FetchAdminBalancesAsync,
  UpdateAdminRewardAsync,
  FetchAdminGolcBalancesAsync,
  DeleteAdminGolcBalanceAsync,
} from "../../../core/redux/dashboard/balance"
import { useAppDispatch, useAppSelector } from "../../../core/redux/hooks"
import { toFixedWithoutRound } from "../../../utils/helpers/to-fixed-without-round"
import { CRUDBuilder } from "../../../widgets/crud-builder"
import { CRUDBuilderKyc } from "../../../widgets/crud-builder-kyc"

// const dispatch = useAppDispatch()
// const [showModal, setshowModal] = useState(null)
// const { allbalances, status } = useAppSelector((state) => state.AdminBalance)
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
    name: "stacking_balance",
    accessor: (row: any) => Number(row.stacking_balance).toLocaleString("en"),
    label: "CAP",
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
    name: "profit_percentage",
    accessor: (row: any) => toFixedWithoutRound((row.profit_percentage * 100).toFixed(3), 3) + "%",
    label: "Staking Profit",
    colProps: { xs: 12 },
    ignore: true,
  },
  {
    type: "text",
    name: "profit_per_day",
    label: "Profit Per Day",
    ignore: true,
  },
  {
    type: "text",
    name: "started_at",
    label: "Started At",
    ignore: true,
  },
  {
    type: "text",
    name: "reward",
    accessor: (row: any) => Number(row.reward).toLocaleString("en"),
    label: "Air Drop",
    validate: { required: true },
    colProps: { xs: 12 },
  },

  {
    type: "text",
    name: "golc",
    accessor: (row: any) => (row.user.golc === 0 ? "No" : "Yes"),
    label: "Golc",
    validate: { required: true },
    colProps: { xs: 12 },
    ignore: true,
  },
  {
    type: "text",
    name: "status",
    accessor: (row: any) => row.status,
    label: "Status",
    validate: { required: true },
    colProps: { xs: 12 },
  },
]

export const Balances: React.FC = () => {
  const dispatch = useAppDispatch()
  const { allbalances, status } = useAppSelector((state) => state.AdminBalance)
  const { permessions } = useAppSelector((state) => state.Auth)

  // const { balances, status } = useAppSelector((state) => state.AdminBalance)

  useEffect(() => {
    dispatch(FetchAdminBalancesAsync())
  }, [])

  return (
    <Row className="px-3 g-0" data-testid="row-balance">
      <Col>
        <CustomCard data-testid="card-balance" dashboard>
          <CRUDBuilder
            data-testid="table-balance"
            inputs={inputs}
            title={"Balance"}
            data={allbalances?.data}
            status={status}
            onUpdate={
              permessions.isAdmin
                ? (vals: any) => dispatch(UpdateAdminRewardAsync({ reward: vals.reward, id: Number(vals.id) }))
                : undefined
            }
            onDelete={permessions.isAdmin ? (id: number) => dispatch(DeleteAdminBalanceAsync({ id })) : undefined}
            reFetch={() => dispatch(FetchAdminBalancesAsync())}
            nextPage={() => dispatch(FetchAdminBalancesAsync({ page: Number(allbalances.page) + 1 }))}
            prevPage={() => dispatch(FetchAdminBalancesAsync({ page: Number(allbalances.page) - 1 }))}
            gotoPage={(page: number) => dispatch(FetchAdminBalancesAsync({ page }))}
            page={Number(allbalances.page)}
            total_pages={Number(allbalances.total_pages)}
            onSearch={(search: string) => dispatch(FetchAdminBalancesAsync({ page: 0, search }))}
          />

          {/* <CRUDBuilderKyc
            inputs={inputs}
            title={"Pending KYC"}
            data={allbalances?.data}
            status={status}
            // onAccept={(id: number) => dispatch(AcceptAdminKYCAsync({ id }))}
            // onReject={(req: { id: number; note: string }) => dispatch(RejectAdminKYCAsync(req))}
            // onBan={(req: { id: number; note: string }) => dispatch(BanAdminKYCAsync(req))}
            reFetch={() => dispatch(FetchAdminBalancesAsync())}
            nextPage={() => dispatch(FetchAdminBalancesAsync({ page: Number(allbalances.page) + 1 }))}
            prevPage={() => dispatch(FetchAdminBalancesAsync({ page: Number(allbalances.page) - 1 }))}
            // onUpdate={(vals: any) => dispatch(UpdateAdminRewardAsync({ reward: vals.reward, id: Number(vals.id) }))}
            // onDelete={(id: number) => dispatch(DeleteAdminBalanceAsync({ id }))}
            gotoPage={(page: number) => dispatch(FetchAdminBalancesAsync({ page }))}
            page={Number(allbalances.page)}
            total_pages={Number(allbalances.total_pages)}
            onSearch={(search: string) => dispatch(FetchAdminBalancesAsync({ page: 0, search }))}
          /> */}
        </CustomCard>
      </Col>
    </Row>
  )
}

const Golcinputs: CustomInputFormProps[] = [
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
    name: "phone_number",
    accessor: (row: any) => row.user?.phone_number,
    label: "Phone Number",
    colProps: { xs: 12 },
    ignore: true,
  },
  {
    type: "text",
    name: "stacking_balance",
    accessor: (row: any) => Number(row.stacking_balance).toLocaleString("en"),
    label: "CAP",
    colProps: { xs: 12 },
    ignore: true,
  },
  {
    type: "text",
    name: "profit_percentage",
    accessor: (row: any) => toFixedWithoutRound((row.profit_percentage * 100).toFixed(3), 3) + "%",
    label: "Staking Profit",
    colProps: { xs: 12 },
    ignore: true,
  },
  {
    type: "text",
    name: "remaining_amount",
    accessor: (row: any) => row.remaining_amount.toLocaleString("en"),
    label: "Remaining Amount",
    colProps: { xs: 12 },
    ignore: true,
  },
  {
    type: "text",
    name: "withdrew_at",
    accessor: (row: any) => row.withdrew_at,
    label: "Withdrew At",
    colProps: { xs: 12 },
    ignore: true,
  },
  {
    type: "text",
    name: "started_at",
    label: "Started At",
    ignore: true,
  },
  {
    type: "text",
    name: "status",
    accessor: (row: any) => row.status,
    label: "status",
    validate: { required: true },
    colProps: { xs: 12 },
  },
]
export const GolcBalances: React.FC = () => {
  const dispatch = useAppDispatch()
  const { all_golc_balances, status } = useAppSelector((state) => state.AdminBalance)
  const { permessions } = useAppSelector((state) => state.Auth)

  useEffect(() => {
    dispatch(FetchAdminGolcBalancesAsync())
  }, [])

  return (
    <Row className="px-3 g-0" data-testid="Golc-Balances">
      <Col>
        <CustomCard data-testid="card-golc-balances" dashboard>
          <CRUDBuilder
            data-testid="table-golc-balances"
            inputs={Golcinputs}
            title={"Golc Balance"}
            data={all_golc_balances?.data}
            status={status}
            // onUpdate={(vals: any) => dispatch(UpdateAdminRewardAsync({ reward: vals.reward, id: Number(vals.id) }))}
            onDelete={permessions.isAdmin ? (id: number) => dispatch(DeleteAdminGolcBalanceAsync({ id })) : undefined}
            reFetch={() => dispatch(FetchAdminGolcBalancesAsync())}
            nextPage={() => dispatch(FetchAdminGolcBalancesAsync({ page: Number(all_golc_balances.page) + 1 }))}
            prevPage={() => dispatch(FetchAdminGolcBalancesAsync({ page: Number(all_golc_balances.page) - 1 }))}
            gotoPage={(page: number) => dispatch(FetchAdminGolcBalancesAsync({ page }))}
            page={Number(all_golc_balances.page)}
            total_pages={Number(all_golc_balances.total_pages)}
            onSearch={(search: string) => dispatch(FetchAdminGolcBalancesAsync({ page: 0, search }))}
          />
        </CustomCard>
      </Col>
    </Row>
  )
}

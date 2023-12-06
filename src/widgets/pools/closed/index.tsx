import moment from "moment"
import React, { useState } from "react"
import { Col, Row } from "react-bootstrap"
import { Column } from "react-table"
import { CustomSpace } from "../../../components/custom-space"
import { CustomText } from "../../../components/custom-text"
import { Icon } from "../../../components/icon"
import { useAppSelector } from "../../../core/redux/hooks"
import { toast } from "../../../utils"
import { SubstringLongText } from "../../../utils/helpers/substringLongText"
import "../../index.scss"
import { TransactionsSection } from "./TransactionsSection"
import { WithdrawsSection } from "./WithdrawsSection"

export const ClosedPool: React.FC = () => {
  const { user } = useAppSelector((state) => state.Auth)

  const [currentTap, setCurrentTap] = useState<string>("1")

  // const dispatch = useAppDispatch()
  // const { withdraw_history, status } = useAppSelector((state) => state.Profit)

  // useEffect(() => {
  //   dispatch(FetchWithDrawHistoryAsync())
  // }, [])

  const Toggle = (e: any) => {
    setCurrentTap(e)
  }

  return (
    <>
      <CustomSpace data-testid="Custom-closed-pool" size={20}>
        <div className={`toggle-transaction ${currentTap === "1" ? "active" : ""}`} onClick={() => Toggle("1")}>
          <img
            data-testid="icon-withdraw-history"
            src={`/assets/icons/withdraw-history${currentTap === "1" ? "-active" : ""}.svg`}
            alt=""
          />
          <CustomText data-testid="title-withdraw-history">Your Withdraw History</CustomText>
        </div>
        <div className={`toggle-transaction ${currentTap === "2" ? "active" : ""}`} onClick={() => Toggle("2")}>
          <img
            data-testid="icon-transaction-history"
            src={`/assets/icons/transaction-history${currentTap === "2" ? "-active" : ""}.svg`}
            alt=""
          />
          <CustomText data-testid="title-transaction-history">Your Transaction History</CustomText>
        </div>
      </CustomSpace>

      {currentTap === "1" && <WithdrawsSection />}
      {currentTap === "2" && <TransactionsSection />}
    </>
  )
}

// const handleCopy = (text: string) => {
//   navigator.clipboard.writeText(text)
//   toast.success("Text copied")
// }

// const getColumns = (id: string): Column[] => [
//   {
//     id,
//     Header: () => (
//       <Row className="justify-content-between">
//         <Col>
//           <CustomSpace>
//             <Icon name="person-outline" className="header-icon" />
//             <CustomText data_test={id}>{id}</CustomText>
//           </CustomSpace>
//         </Col>
//       </Row>
//     ),
//     columns: [
//       {
//         Header: "Receiver Wallet",
//         accessor: (row: any) => (
//           <CustomText copyable onClick={() => handleCopy(row.receiver_wallet_public_key)}>
//             {SubstringLongText({ text: String(row.receiver_wallet_public_key) })}
//           </CustomText>
//         ),
//       },
//       {
//         Header: "Received Amount",
//         accessor: "net_amount",
//       },
//       {
//         Header: "Original Amount",
//         accessor: "gross_amount",
//       },

//       {
//         Header: "Currency",
//         accessor: "currency",
//       },
//       {
//         Header: "Created At",
//         accessor: (withdraw: any) => moment(withdraw?.created_at).format("YYYY-MM-DD hh:mm"),
//       },
//       {
//         Header: "Status",
//         accessor: "status",
//       },
//     ],
//   },
// ]

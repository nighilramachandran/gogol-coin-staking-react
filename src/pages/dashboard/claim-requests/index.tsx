import moment from "moment"
import React, { useEffect } from "react"
import { Row, Col } from "react-bootstrap"
import { CustomCard } from "../../../components/custom-card"
import { CustomInputFormProps } from "../../../components/custom-form/custom-form"
import { WithDrawHistory } from "../../../core/models"
import { DeleteAcceptedClaimAsync, FetchClaimRequestsAsync, SetAdminBalanceStatusAsync } from "../../../core/redux/dashboard/balance"
import { useAppDispatch, useAppSelector } from "../../../core/redux/hooks"
import { CRUDBuilder } from "../../../widgets/crud-builder"
import tokenABI from "../../../GOLABI"
import { toast } from "../../../utils"
import { ethers } from "ethers"
import { api } from "../../../utils/api"

const tokenContractAddress = "0x083d41d6dd21ee938f0c055ca4fb12268df0efac"
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
    type: "text",
    name: "Email",
    label: "Email",
    colProps: { xs: 12 },
    accessor: (row: any) => `${row.balance.user.email}`,
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

export const ClaimRequests: React.FC = () => {
  const dispatch = useAppDispatch()
  const { status, claim_requests } = useAppSelector((state) => state.AdminBalance)

  useEffect(() => {
    dispatch(FetchClaimRequestsAsync())
    requestAccount()
  }, [])

  const requestAccount = async () => {
    console.log("Requesting Wallet...")
    // ❌ Check if Meta Mask Extension exists
    if ((window as any).ethereum) {
      console.log("Detected Wallet")

      try {
        await (window as any).ethereum.request({
          method: "eth_requestAccounts",
        })
      } catch (error: any) {
        toast.error(String(error.message))
      }
    } else {
      toast.error("No wallet detected, try to connect your wallet or install metamask")
    }
  }

  async function transferStakingAmountETH(claimRequest: WithDrawHistory) {
    dispatch(SetAdminBalanceStatusAsync("loading"))
    try {
      var provider = new ethers.providers.Web3Provider((window as any).ethereum)

      let signer = provider.getSigner()
      let transferContract: ethers.Contract = await new ethers.Contract(tokenContractAddress, tokenABI, signer)
      // let gasPrice = await provider.getGasPrice()

      let transaction = await transferContract
        .connect(signer)
        .transfer(claimRequest.receiver_wallet_public_key, ((Math.ceil(claimRequest.net_amount * 100) / 100) * 10000) | 0, {
          gasLimit: 100000,
        })
      let txHash: string = transaction.hash.toString()
      closeRequest(claimRequest.id, txHash)

      dispatch(DeleteAcceptedClaimAsync(claimRequest.id))
      dispatch(SetAdminBalanceStatusAsync("data"))
    } catch (error: any) {
      console.log(error)
      toast.error("No wallet detected, try to connect your wallet or install metamask")
      dispatch(SetAdminBalanceStatusAsync("error"))
    }
  }

  async function closeRequest(requestId: number, txHash: string) {
    let response = await api.post(`/admin/profit/requests/${requestId}/close`, {
      tx_hash: txHash,
    })

    if (response?.status) {
      toast.success("Success")
    } else {
      toast.error("Error, Please Contact us ASAP")
    }
  }

  return (
    <Row className="px-3 g-0" data-testid="row-claim-requests">
      <Col>
        <CustomCard data-testid="card-claim-requests" dashboard>
          <CRUDBuilder
            data-testid="table-claim-requests"
            inputs={inputs}
            title={"Claim Requests"}
            data={claim_requests.data}
            status={status}
            onSendGols={(vals: WithDrawHistory) => transferStakingAmountETH(vals)}
            reFetch={() => dispatch(FetchClaimRequestsAsync())}
            nextPage={() => dispatch(FetchClaimRequestsAsync({ page: Number(claim_requests.page) + 1 }))}
            prevPage={() => dispatch(FetchClaimRequestsAsync({ page: Number(claim_requests.page) - 1 }))}
            gotoPage={(page: number) => dispatch(FetchClaimRequestsAsync({ page }))}
            page={Number(claim_requests.page)}
            total_pages={Number(claim_requests.total_pages)}
            onSearch={(search: string) => dispatch(FetchClaimRequestsAsync({ page: 0, search }))}
          />
        </CustomCard>
      </Col>
    </Row>
  )
}

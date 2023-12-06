import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AppThunk } from "../store"
import { toast } from "../../../utils/ui/toasts/ToastConfigurator"
import { Transaction } from "../../models"
import { api } from "../../../utils/api"
import { RequestStatus } from "../../../utils/constants"

interface TransactionsState {
  status: RequestStatus
  transactions: Transaction[]
  transactionsHistory: Transaction[]
  transaction?: Transaction
  wallet_address?: string
  hasPending: boolean
}

let initialState: TransactionsState = {
  status: "nothing",
  transactions: [],
  transactionsHistory: [],
  hasPending: false,
}

const TransactionsSlice = createSlice({
  name: "Transactions",
  initialState,
  reducers: {
    setStatus: (state, { payload }: PayloadAction<RequestStatus>) => {
      state.status = payload
    },
    setWallet: (state, { payload }: PayloadAction<{ address: string }>) => {
      state.wallet_address = payload.address
    },
    checkPendingTransaction: (state, { payload }: PayloadAction<boolean>) => {
      state.hasPending = payload
    },
    setTransactionsHistory: (state, { payload }: PayloadAction<Transaction[]>) => {
      state.transactionsHistory = payload
    },
  },
})

// const { setStatus, Fetch } = TransactionsSlice.actions
const { setStatus, setWallet, checkPendingTransaction, setTransactionsHistory } = TransactionsSlice.actions

export const FetchTransHistoryAsync = (): AppThunk => async (dispatch) => {
  dispatch(setStatus("loading"))
  try {
    const { data } = await api.get("/transactions")
    dispatch(setTransactionsHistory(data.body))
    dispatch(setStatus("data"))
    // toast.success("Wallet Connected Successfully")
  } catch (e: any) {
    dispatch(setStatus("error"))
    toast.error(e?.data?.body?.message ?? "Error")
  }
}

export const SetWalletAddressAsync =
  ({ address }: { address: string }): AppThunk =>
  async (dispatch) => {
    dispatch(setStatus("loading"))
    try {
      await api.post("/profile/update", { wd_key: address })
      dispatch(setWallet({ address }))
      dispatch(setStatus("data"))
      toast.success("Wallet Connected Successfully")
    } catch (e: any) {
      dispatch(setStatus("error"))
      toast.error(e?.data?.body?.message ?? "Error connecting your wallet")
    }
  }

export const CheckPendingTransactionAsync = (): AppThunk => async (dispatch) => {
  try {
    dispatch(setStatus("loading"))
    const res = await api.get("/transaction/pending")
    if (res?.data?.body) {
      dispatch(checkPendingTransaction(true))
      dispatch(setStatus("data"))
    }
  } catch (error) {
    dispatch(checkPendingTransaction(false))
    dispatch(setStatus("error"))
  }
}

export default TransactionsSlice.reducer

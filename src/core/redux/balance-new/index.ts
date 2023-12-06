import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AppThunk } from "../store"
import { toast } from "../../../utils/ui/toasts/ToastConfigurator"
import { RequestStatus } from "../../../utils/constants"
import { api } from "../../../utils/api"
import { BalanceInfoGolc } from "../../models/balance-new"

interface BalancesState {
  status: RequestStatus
  balance_info?: BalanceInfoGolc
}

let initialState: BalancesState = {
  status: "nothing",
}

const BalancesSlice = createSlice({
  name: "BalancesGolc",
  initialState,
  reducers: {
    setStatus: (state, { payload }: PayloadAction<RequestStatus>) => {
      state.status = payload
    },

    FetchBalanceInfoGolc: (state, { payload }: PayloadAction<BalanceInfoGolc>) => {
      state.balance_info = payload
    },
  },
})

const { setStatus, FetchBalanceInfoGolc } = BalancesSlice.actions

export const FetchBalanceInfoGolcAsync = (): AppThunk => async (dispatch) => {
  dispatch(setStatus("loading"))
  try {
    const result = await api.get<{ body: BalanceInfoGolc }>("/balance-info/golc")
    dispatch(FetchBalanceInfoGolc(result.data.body))
    dispatch(setStatus("data"))
  } catch (err: any) {
    dispatch(setStatus("error"))
    toast.error(err?.response?.data?.message)
  }
}

export const TransferToGolc = (): AppThunk => async (dispatch) => {
  dispatch(setStatus("loading"))
  try {
    const result = await api.post<{ message: string }>("/balances/togolc")
    dispatch(setStatus("data"))
    toast.success(result?.data?.message)
  } catch (err: any) {
    dispatch(setStatus("error"))
    toast.error(err?.response?.data?.message)
  }
}

export default BalancesSlice.reducer

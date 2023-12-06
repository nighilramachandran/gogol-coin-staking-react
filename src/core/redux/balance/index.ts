import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AppThunk } from "../store"
import { toast } from "../../../utils/ui/toasts/ToastConfigurator"
import { Balance, BalanceInfo, GolcCal, GolcConfig, RemainingInfo } from "../../models"
import { RequestStatus } from "../../../utils/constants"
import { api } from "../../../utils/api"
import { RefreshAuthAsync } from ".."

interface BalancesState {
  status: RequestStatus
  balances: Balance[]
  active_balances: Balance[]
  balance?: Balance
  BalanceInfo?: BalanceInfo
  remaining_info?: RemainingInfo
  CurrentProfitAmount?: number
  golc_calc?: GolcCal
  golc_config?: GolcConfig
}

let initialState: BalancesState = {
  status: "nothing",
  balances: [],
  active_balances: [],
  CurrentProfitAmount: 0,
}

const BalancesSlice = createSlice({
  name: "Balances",
  initialState,
  reducers: {
    setStatus: (state, { payload }: PayloadAction<RequestStatus>) => {
      state.status = payload
    },
    Insert: ({ balances }, { payload }: PayloadAction<Balance>) => {
      balances.push(payload)
    },
    Update: (state, { payload }: PayloadAction<Balance>) => {
      let ind = state.balances.findIndex((el) => el.id === payload.id)
      if (ind !== -1) state.balances[ind] = payload
    },
    Delete: ({ balances }, { payload }: PayloadAction<number>) => {
      let index = balances.findIndex((el) => el.id === payload)
      if (index !== -1) balances.splice(index, 1)
    },
    Show: (state, { payload }: PayloadAction<Balance>) => {
      state.balance = payload
    },
    Fetch: (state, { payload }: PayloadAction<Balance[]>) => {
      state.balances = payload
    },
    FetchActive: (state, { payload }: PayloadAction<Balance[]>) => {
      state.active_balances = payload
    },
    FetchInfo: (state, { payload }: PayloadAction<BalanceInfo>) => {
      state.BalanceInfo = payload
    },
    FetchCurrentProfit: (state, { payload }: PayloadAction<number>) => {
      state.CurrentProfitAmount = payload
    },
    FetchRemainingInfo: (state, { payload }: PayloadAction<RemainingInfo>) => {
      state.remaining_info = payload
    },
    FetchGolcCal: (state, { payload }: PayloadAction<GolcCal>) => {
      state.golc_calc = payload
    },
    GetGolcConfig: (state, { payload }: PayloadAction<GolcConfig>) => {
      state.golc_config = payload
    },
  },
})

const { setStatus, Fetch, FetchActive, FetchCurrentProfit, FetchInfo, FetchRemainingInfo, FetchGolcCal, GetGolcConfig } =
  BalancesSlice.actions

export const FetchChangeToGolCalc = (): AppThunk => async (dispatch) => {
  dispatch(setStatus("loading"))
  try {
    const result = await api.get<{ body: GolcCal }>("/balance/calc/golc")
    dispatch(FetchGolcCal(result.data.body))
    dispatch(setStatus("data"))
  } catch (err: any) {
    dispatch(setStatus("error"))
  }
}

export const FetchBalancesAsync = (): AppThunk => async (dispatch) => {
  dispatch(setStatus("loading"))
  try {
    const result = await api.get<{ body: Balance[] }>("/balances")
    dispatch(Fetch(result.data.body))
    dispatch(setStatus("data"))
  } catch (err: any) {
    dispatch(setStatus("error"))
    toast.error(err?.response?.data?.message)
  }
}

export const FetchActiveBalancesAsync = (): AppThunk => async (dispatch) => {
  dispatch(setStatus("loading"))
  try {
    const result = await api.get<{ body: Balance[] }>("/active-balances")
    dispatch(FetchActive(result.data.body))
    dispatch(setStatus("data"))
  } catch (err: any) {
    dispatch(setStatus("error"))
    toast.error(err?.response?.data?.message)
  }
}

export const FetchCurrentBalanceInfoAsync = (): AppThunk => async (dispatch) => {
  dispatch(setStatus("loading"))
  try {
    const result = await api.get<{ body: BalanceInfo }>("/balance-info")
    dispatch(FetchInfo(result.data.body))
    dispatch(setStatus("data"))
  } catch (err: any) {
    dispatch(setStatus("error"))
    toast.error(err?.response?.data?.message)
  }
}

export const FetchCurrentProfitAmountAsync = (): AppThunk => async (dispatch) => {
  dispatch(setStatus("loading"))
  try {
    const result = await api.get<{ body: { myProfitAmount: number } }>("/profit/remaining")
    dispatch(FetchCurrentProfit(result.data.body?.myProfitAmount))
    dispatch(setStatus("data"))
  } catch (err: any) {
    dispatch(setStatus("error"))
    toast.error(err?.response?.data?.message)
  }
}

export const FetchRemainingInfoAsync = (): AppThunk => async (dispatch) => {
  dispatch(setStatus("loading"))
  try {
    const result = await api.get<{ body: RemainingInfo }>("/profit/remaining-info")
    dispatch(FetchRemainingInfo(result.data.body))
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
    dispatch(RefreshAuthAsync(true))
    // window.location.reload()
  } catch (err: any) {
    dispatch(setStatus("error"))
    toast.error(err?.response?.data?.message)
  }
}

export const GetGolcConfigAsync = (): AppThunk => async (dispatch) => {
  dispatch(setStatus("loading"))
  try {
    const result = await api.get<{ body: GolcConfig }>("/features")
    dispatch(GetGolcConfig(result.data.body))
    dispatch(setStatus("data"))
  } catch (err: any) {
    dispatch(setStatus("error"))
    toast.error(err?.response?.data?.message)
  }
}

export default BalancesSlice.reducer

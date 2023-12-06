import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AppThunk, store } from "../store"
import { Profit, Timeline_Res, WithDrawHistory } from "../../models/profit"
import { RequestStatus } from "../../../utils/constants"
import { api } from "../../../utils/api"
import { toast } from "../../../utils"
import { Moment } from "moment"
import moment from "moment"
import axios from "axios"

function removeTime(date: Moment) {
  return moment(date).format(moment.HTML5_FMT.DATE)
}

interface ProfitsState {
  status: RequestStatus
  profits: Profit[]
  profit?: Profit
  withdraw_history: WithDrawHistory[]
  withdraw_success?: boolean
  time_line_data?: Timeline_Res
}

let initialState: ProfitsState = {
  status: "nothing",
  profits: [],
  withdraw_history: [],
}

const ProfitsSlice = createSlice({
  name: "Profits",
  initialState,
  reducers: {
    setStatus: (state, { payload }: PayloadAction<RequestStatus>) => {
      state.status = payload
    },
    Insert: ({ profits }, { payload }: PayloadAction<Profit>) => {
      profits.push(payload)
    },
    Show: (state, { payload }: PayloadAction<Profit>) => {
      state.profit = payload
    },
    Fetch: (state, { payload }: PayloadAction<Profit[]>) => {
      //remove duplicated
      state.profits = payload.filter(
        (v, ind, self) => ind === self.findIndex((t) => removeTime(moment(t.date)) === removeTime(moment(v.date)))
      )
    },
    FetchTimeLineData: (state, { payload }: PayloadAction<Timeline_Res>) => {
      state.time_line_data = payload
    },
    Withdraw: (state, { payload }: PayloadAction<boolean>) => {
      state.withdraw_success = payload
    },
    FetchWithDrawHistory: (state, { payload }: PayloadAction<WithDrawHistory[]>) => {
      state.withdraw_history = payload
    },
  },
})

const { setStatus, Fetch, FetchWithDrawHistory, Withdraw, FetchTimeLineData } = ProfitsSlice.actions

export const FetchTimeLineDataAsync = (): AppThunk => async (dispatch) => {
  dispatch(setStatus("loading"))
  try {
    const result = await api.get<{ body: Timeline_Res }>(`/profit/remaining-info/golc`)
    dispatch(FetchTimeLineData(result.data.body))
    dispatch(setStatus("data"))
  } catch (err: any) {
    if (axios.isAxiosError(err)) toast.error(err.message)
    else toast.error(err?.response?.data?.message)
    dispatch(setStatus("error"))
  }
}

export const FetchProfitsAsync = (): AppThunk => async (dispatch) => {
  dispatch(setStatus("loading"))
  try {
    const result = await api.get<{ body: Profit[] }>(`/profit/withdraw-monthly-schedule`)
    dispatch(Fetch(result.data.body))
    dispatch(setStatus("data"))
  } catch (err: any) {
    dispatch(setStatus("error"))
    toast.error(err?.response?.data?.message)
  }
}

export const WithdrawAsync =
  ({ receiver_wallet_public_key }: { receiver_wallet_public_key: string }): AppThunk =>
  async (dispatch) => {
    dispatch(setStatus("loading"))
    try {
      await api.post(`/profit/withdraw`, { receiver_wallet_public_key })
      dispatch(Withdraw(true))
      dispatch(setStatus("data"))
    } catch (err: any) {
      dispatch(Withdraw(false))
      dispatch(setStatus("error"))
      toast.error(err?.response?.data?.message)
    }
  }

export const FetchWithDrawHistoryAsync =
  (golc: number = 0): AppThunk =>
  async (dispatch) => {
    dispatch(setStatus("loading"))

    try {
      const result = await api.get<{ body: WithDrawHistory[] }>(`/profit/history${golc === 1 ? "/golc" : ""}`)
      dispatch(FetchWithDrawHistory(result.data.body))
      dispatch(setStatus("data"))
    } catch (err: any) {
      dispatch(setStatus("error"))
      toast.error(err?.response?.data?.message)
    }
  }

export default ProfitsSlice.reducer

import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { api } from "../../../../utils/api"
import { RequestStatus } from "../../../../utils/constants"
import { Staker } from "../../../models/staker"
import { AppThunk } from "../../store"

interface HomeState {
  status: RequestStatus
  top_stakers_status: RequestStatus
  recent_stakers_status: RequestStatus
  top_stakers: Staker[]
  recent_stakers: Staker[]
  counts: {
    current_staking_amount: number
    this_month_staking_amount: number
    last_month_staking_amount: number
    last_two_month_staking_amount: number
    overall_last_month_staking_amount: number
    overall_last_two_month_staking_amount: number
    current_staking_users: number
    this_month_staking_users: number
    last_month_staking_users: number
    last_two_month_staking_users: number
    overall_last_month_staking_users: number
    overall_last_two_month_staking_users: number
  }
  monthly_amount?: any
}

let initialState: HomeState = {
  status: "nothing",
  top_stakers_status: "nothing",
  recent_stakers_status: "nothing",
  top_stakers: [],
  recent_stakers: [],
  counts: {
    current_staking_amount: 0,
    this_month_staking_amount: 0,
    last_month_staking_amount: 0,
    last_two_month_staking_amount: 0,
    overall_last_month_staking_amount: 0,
    overall_last_two_month_staking_amount: 0,
    current_staking_users: 0,
    this_month_staking_users: 0,
    last_month_staking_users: 0,
    last_two_month_staking_users: 0,
    overall_last_month_staking_users: 0,
    overall_last_two_month_staking_users: 0,
  },
}

const HomeDashboardSlice = createSlice({
  name: "Home",
  initialState,
  reducers: {
    setStatus: (state, { payload }: PayloadAction<RequestStatus>) => {
      state.status = payload
    },
    setTopStakersStatus: (state, { payload }: PayloadAction<RequestStatus>) => {
      state.top_stakers_status = payload
    },
    setRecentStakersStatus: (state, { payload }: PayloadAction<RequestStatus>) => {
      state.recent_stakers_status = payload
    },
    FetchCounts: (state, { payload }: PayloadAction<any>) => {
      state.counts = payload
    },
    FetchMonthlyAmount: (state, { payload }: PayloadAction<any>) => {
      state.monthly_amount = payload
    },
    FetchTopStakers: (state, { payload }: PayloadAction<any>) => {
      state.top_stakers = payload
    },
    FetchRecentStakers: (state, { payload }: PayloadAction<any>) => {
      state.recent_stakers = payload
    },
  },
})

const { setStatus, setRecentStakersStatus, setTopStakersStatus, FetchCounts, FetchMonthlyAmount, FetchTopStakers, FetchRecentStakers } =
  HomeDashboardSlice.actions

export const FetchCountsAsync = (): AppThunk => async (dispatch) => {
  dispatch(setStatus("loading"))
  try {
    const result = await api.get<{ body: any }>(`/admin/dashboard/counts`)
    dispatch(FetchCounts(result.data.body))
    dispatch(setStatus("data"))
  } catch (err: any) {
    dispatch(setStatus("error"))
    // toast.error(err)
  }
}

export const FetchGolcCountsAsync = (): AppThunk => async (dispatch) => {
  dispatch(setStatus("loading"))
  try {
    const result = await api.get<{ body: any }>(`/admin/dashboard/golc/counts`)
    dispatch(FetchCounts(result.data.body))
    dispatch(setStatus("data"))
  } catch (err: any) {
    dispatch(setStatus("error"))
    // toast.error(err)
  }
}

export const FetchMonthlyAmountAsync = (): AppThunk => async (dispatch) => {
  dispatch(setStatus("loading"))
  try {
    const result = await api.get<{ body: any }>(`/admin/dashboard/chart/balances`)
    dispatch(FetchMonthlyAmount(result.data.body))
    dispatch(setStatus("data"))
  } catch (err: any) {
    dispatch(setStatus("error"))
    // toast.error(err)
  }
}

export const FetchGolcMonthlyAmountAsync = (): AppThunk => async (dispatch) => {
  dispatch(setStatus("loading"))
  try {
    const result = await api.get<{ body: any }>(`/admin/dashboard/golc/chart/balances`)
    dispatch(FetchMonthlyAmount(result.data.body))
    dispatch(setStatus("data"))
  } catch (err: any) {
    dispatch(setStatus("error"))
    // toast.error(err)
  }
}

export const FetchTopStakersAsync = (): AppThunk => async (dispatch) => {
  dispatch(setTopStakersStatus("loading"))
  try {
    const result = await api.get<{ body: any }>(`/admin/dashboard/stakers`)
    dispatch(FetchTopStakers(result.data.body))
    dispatch(setTopStakersStatus("data"))
  } catch (err: any) {
    dispatch(setTopStakersStatus("error"))
    // toast.error(err)
  }
}
export const FetchGolcTopStakersAsync = (): AppThunk => async (dispatch) => {
  dispatch(setTopStakersStatus("loading"))
  try {
    const result = await api.get<{ body: any }>(`/admin/dashboard/golc/stakers`)
    dispatch(FetchTopStakers(result.data.body))
    dispatch(setTopStakersStatus("data"))
  } catch (err: any) {
    dispatch(setTopStakersStatus("error"))
    // toast.error(err)
  }
}

export const FetchRecentStakersAsync = (): AppThunk => async (dispatch) => {
  dispatch(setRecentStakersStatus("loading"))
  try {
    const result = await api.get<{ body: any }>(`/admin/dashboard/recentStakes`)
    dispatch(FetchRecentStakers(result.data.body))
    dispatch(setRecentStakersStatus("data"))
  } catch (err: any) {
    dispatch(setRecentStakersStatus("error"))
    // toast.error(err)
  }
}
export const FetchGolcRecentStakersAsync = (): AppThunk => async (dispatch) => {
  dispatch(setRecentStakersStatus("loading"))
  try {
    const result = await api.get<{ body: any }>(`/admin/dashboard/golc/recentStakes`)
    dispatch(FetchRecentStakers(result.data.body))
    dispatch(setRecentStakersStatus("data"))
  } catch (err: any) {
    dispatch(setRecentStakersStatus("error"))
    // toast.error(err)
  }
}

export default HomeDashboardSlice.reducer

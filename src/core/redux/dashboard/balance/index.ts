import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"
import { NULL } from "sass"
import { toast } from "../../../../utils"
import { api } from "../../../../utils/api"
import { Paginate, Response } from "../../../../utils/api/types"
import { RequestStatus } from "../../../../utils/constants"
import { GolcBalanceRes, BalanceRes, Balance, WithDrawHistory, GolcBalance, BalanceUser } from "../../../models"
import { AppThunk } from "../../store"

export interface UserWithBalance {
  email: string
  name: string
  amount: number
}

interface AdminBalancesState {
  status: RequestStatus
  balances: Balance[]
  allbalances: BalanceRes
  balance?: Balance
  all_golc_balances: GolcBalanceRes
  golc_balance?: GolcBalance
  claim_requests: Response<WithDrawHistory>

  accepted_claims: Response<WithDrawHistory>
}

let initialState: AdminBalancesState = {
  status: "nothing",
  balances: [],
  all_golc_balances: { count: 0, page: "0", total_pages: 0, search: undefined, data: [] },
  allbalances: { count: 0, page: "0", total_pages: 0, search: undefined, data: [] },
  claim_requests: { count: 0, page: "0", total_pages: 0, search: undefined, data: [] },
  accepted_claims: { count: 0, page: "0", total_pages: 0, search: undefined, data: [] },
}

const AdminBalancesSlice = createSlice({
  name: "AdminBalances",
  initialState,
  reducers: {
    setStatus: (state, { payload }: PayloadAction<RequestStatus>) => {
      state.status = payload
    },
    Insert: ({ balances }, { payload }: PayloadAction<Balance>) => {
      balances.push(payload)
    },
    UpdateReward: (state, { payload }: PayloadAction<Balance>) => {
      let ind = state.balances.findIndex((el) => el.id === payload.id)
      if (ind !== -1) state.balances[ind] = payload
    },
    Delete: ({ balances }, { payload }: PayloadAction<number>) => {
      let index = balances.findIndex((el) => el.id === payload)
      if (index !== -1) balances.splice(index, 1)
    },
    DeleteGolc: ({ all_golc_balances }, { payload }: PayloadAction<number>) => {
      let index = all_golc_balances.data?.findIndex((el) => el.id === payload)
      if (index !== -1) all_golc_balances?.data?.splice(index, 1)
    },
    DeleteClaimRequest: ({ claim_requests }, { payload }: PayloadAction<number>) => {
      let index = claim_requests.data.findIndex((el) => el.id === payload)
      if (index !== -1) claim_requests.data.splice(index, 1)
    },
    Show: (state, { payload }: PayloadAction<Balance>) => {
      state.balance = payload
    },

    Fetch: (state, { payload }: PayloadAction<BalanceRes>) => {
      const DeletedUserObj: BalanceUser = {
        first_name: "Deleted User",
        last_name: "Deleted User",
        email: "Deleted User",
        id: 0,
        email_verified_at: undefined,
        created_at: undefined,
        updated_at: undefined,
        status: "Deleted User",
        role: "Deleted User",
        username: "Deleted User",
        user_info_id: 0,
        verified: 0,
        golc: 0,
        deleted_at: undefined,
      }

      payload.data?.map((el) => {
        if (el.user === null) {
          el.user_id = DeletedUserObj.id
          el.user = DeletedUserObj
        }
      })
      state.allbalances = payload
    },
    FetchGolcBalances: (state, { payload }: PayloadAction<GolcBalanceRes>) => {
      const DeletedUserObj: BalanceUser = {
        first_name: "Deleted User",
        last_name: "Deleted User",
        email: "Deleted User",
        id: 0,
        email_verified_at: undefined,
        created_at: undefined,
        updated_at: undefined,
        status: "Deleted User",
        role: "Deleted User",
        username: "Deleted User",
        user_info_id: 0,
        verified: 0,
        golc: 0,
        deleted_at: undefined,
      }
      payload.data?.map((el: any) => {
        // if (el.id === 3860) {
        //   console.log(el)
        // }
        if (el.user === null) {
          el.user_id = DeletedUserObj.id
          el.user = DeletedUserObj
        }
      })
      state.all_golc_balances = payload
      // console.log(payload.filter((balance: any) => !balance.user))
    },

    FetchClaimRequests: (state, { payload }: PayloadAction<Response<WithDrawHistory>>) => {
      state.claim_requests = payload
    },
    FetchAcceptedClaims: (state, { payload }: PayloadAction<Response<WithDrawHistory>>) => {
      state.accepted_claims = payload
    },
  },
})

const {
  setStatus,
  Fetch,
  Delete,
  DeleteGolc,
  UpdateReward,
  FetchClaimRequests,
  FetchAcceptedClaims,
  DeleteClaimRequest,
  FetchGolcBalances,
} = AdminBalancesSlice.actions

export const DeleteAcceptedClaimAsync =
  (claim_id: number): AppThunk =>
  async (dispatch) => {
    dispatch(DeleteClaimRequest(claim_id))
  }

export const SetAdminBalanceStatusAsync =
  (status: RequestStatus): AppThunk =>
  async (dispatch) => {
    dispatch(setStatus(status))
  }

export const FetchAdminBalancesAsync =
  (paginate: Paginate = { page: 0, search: "" }): AppThunk =>
  async (dispatch, getState) => {
    dispatch(setStatus("loading"))
    try {
      // console.log(paginate?.search, "paginate?.search")
      // console.log(getState().AdminBalance.allbalances.search, "getState().AdminBalance.allbalances.search")

      const search_query =
        paginate?.search || getState().AdminBalance.allbalances.search
          ? `&search=${paginate?.search ?? getState().AdminBalance.allbalances.search ?? ""}`
          : ``
      const page_query = `?page=` + (paginate?.page ?? getState().AdminBalance.allbalances?.page)
      const url = `/admin/balances${page_query + search_query}`

      const result = await api.get<{ body: BalanceRes }>(url)
      dispatch(Fetch(result.data.body))
      dispatch(setStatus("data"))
    } catch (err: any) {
      dispatch(setStatus("error"))
    }
  }

export const FetchAdminGolcBalancesAsync =
  (paginate: Paginate = { page: 0, search: "" }): AppThunk =>
  async (dispatch, getState) => {
    dispatch(setStatus("loading"))
    try {
      const search_query =
        paginate?.search || getState().AdminBalance.all_golc_balances.search
          ? `&search=${paginate?.search ?? getState().AdminBalance.all_golc_balances.search ?? ""}`
          : ``

      const page_query = `?page=` + (paginate?.page ?? getState().AdminBalance.all_golc_balances?.page)
      const url = `/admin/golc/balances${page_query + search_query}`

      const result = await api.get<{ body: GolcBalanceRes }>(url)
      dispatch(FetchGolcBalances(result.data.body))
      dispatch(setStatus("data"))
    } catch (err: any) {
      dispatch(setStatus("error"))
    }
  }
export const UpdateAdminRewardAsync =
  (req: { id: number; reward: number }): AppThunk =>
  async (dispatch) => {
    dispatch(setStatus("loading"))
    try {
      const result = await api.post<{ body: Balance }>(`/admin/dashboard/balance/reward/${req.id}/edit`, { reward: req.reward })
      dispatch(UpdateReward(result.data.body))
      dispatch(setStatus("data"))
      toast.success("Updated successfully")
    } catch (err: any) {
      dispatch(setStatus("error"))
      toast.error("error")
    }
  }

export const DeleteAdminBalanceAsync =
  (req: { id: number }): AppThunk =>
  async (dispatch) => {
    dispatch(setStatus("loading"))
    try {
      await api.delete<{ body: Balance }>(`/admin/balance/${req.id}/delete`)
      dispatch(Delete(req.id))
      dispatch(setStatus("data"))
      toast.success("Deleted successfully")
    } catch (err: any) {
      dispatch(setStatus("error"))
      toast.error("error")
    }
  }

export const DeleteAdminGolcBalanceAsync =
  (req: { id: number }): AppThunk =>
  async (dispatch) => {
    dispatch(setStatus("loading"))
    try {
      await api.delete<{ body: Balance }>(`/admin/balance/golc/${req.id}/delete`)
      dispatch(DeleteGolc(req.id))
      dispatch(setStatus("data"))
      toast.success("Deleted successfully")
    } catch (err: any) {
      dispatch(setStatus("error"))
      toast.error("error")
    }
  }

export const CreateUserWithBalanceAsync =
  (vals: UserWithBalance): AppThunk =>
  async (dispatch) => {
    dispatch(setStatus("loading"))
    try {
      await api.post<{ body: any }>("/admin/staking/create", vals)
      dispatch(setStatus("data"))
      toast.success("Added successfully")
    } catch (error: any) {
      dispatch(setStatus("error"))
      if (error?.response?.data?.message) {
        toast.error(error?.response?.data?.message)
      } else {
        toast.error(error.message)
      }
    }
  }

export const FetchClaimRequestsAsync =
  (paginate: Paginate = { page: 0, search: "" }): AppThunk =>
  async (dispatch, getState) => {
    dispatch(setStatus("loading"))
    try {
      const search_query =
        paginate?.search || getState().AdminBalance.claim_requests.search
          ? `&search=${paginate?.search ?? getState().AdminBalance.claim_requests.search ?? ""}`
          : ``
      const page_query = `?page=` + (paginate?.page ?? getState().AdminBalance.claim_requests?.page)
      const url = `/admin/profit/requests${page_query + search_query}`
      const result = await api.get<{ body: Response<WithDrawHistory> }>(url)
      dispatch(FetchClaimRequests(result.data.body))
      dispatch(setStatus("data"))
    } catch (err: any) {
      dispatch(setStatus("error"))
      toast.error("Somthing went wrong")
    }
  }

export const FetchAcceptedClaimsAsync =
  (paginate: Paginate = { page: 0, search: "" }): AppThunk =>
  async (dispatch, getState) => {
    dispatch(setStatus("loading"))
    try {
      const search_query =
        paginate?.search || getState().AdminBalance.accepted_claims.search
          ? `&search=${paginate?.search ?? getState().AdminBalance.accepted_claims.search ?? ""}`
          : ``
      const page_query = `?page=` + (paginate?.page ?? getState().AdminBalance.accepted_claims?.page)
      const url = `/admin/profit/requests/manage${page_query + search_query}`
      const result = await api.get<{ body: Response<WithDrawHistory> }>(url)
      dispatch(FetchAcceptedClaims(result.data.body))
      dispatch(setStatus("data"))
    } catch (err: any) {
      dispatch(setStatus("error"))
      toast.error("Somthing went wrong")
    }
  }

export default AdminBalancesSlice.reducer

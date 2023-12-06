import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { toast } from "../../../../utils"

import { api } from "../../../../utils/api"
import { Paginate } from "../../../../utils/api/types"
import { RequestStatus } from "../../../../utils/constants"
import { KYC, KYC_Res } from "../../../models"
import { AppThunk } from "../../store"

interface AdminKYCsState {
  status: RequestStatus
  kycs: KYC_Res
  pendingKycs: KYC_Res
  kyc?: KYC
}

let initialState: AdminKYCsState = {
  status: "nothing",
  kycs: { count: 0, page: 0, total_pages: 0, search: null, data: [] },
  pendingKycs: { count: 0, page: 0, total_pages: 0, search: null, data: [] },
}

const AdminKYCsSlice = createSlice({
  name: "AdminKYCs",
  initialState,
  reducers: {
    setStatus: (state, { payload }: PayloadAction<RequestStatus>) => {
      state.status = payload
    },
    Update: (state, { payload }: PayloadAction<KYC>) => {
      let ind = state.kycs.data.findIndex((el) => el.id === payload.id)
      if (ind !== -1) state.kycs.data[ind] = payload
      else {
        let ind = state.pendingKycs.data.findIndex((el) => el.id === payload.id)
        if (ind !== -1) state.pendingKycs.data[ind] = payload
      }
    },
    Show: (state, { payload }: PayloadAction<KYC>) => {
      state.kyc = payload
    },
    Fetch: (state, { payload }: PayloadAction<KYC_Res>) => {
      state.kycs = payload
    },
    UpdatePending: (state, { payload }: PayloadAction<KYC>) => {
      let ind = state.pendingKycs.data.findIndex((el) => el.id === payload.id)
      if (ind !== -1) state.pendingKycs.data[ind] = payload
    },
    FetchPending: (state, { payload }: PayloadAction<KYC_Res>) => {
      state.pendingKycs = { ...payload, page: Number(payload.page) }
    },
  },
})

const { setStatus, Fetch, Update, FetchPending, UpdatePending } = AdminKYCsSlice.actions

export const FetchAdminKYCsAsync =
  (paginate: Paginate = { page: 0, search: "" }): AppThunk =>
  async (dispatch, getState) => {
    dispatch(setStatus("loading"))
    const search_query =
      paginate?.search || getState().AdminKycs.kycs.search ? `&search=${paginate?.search ?? getState().AdminKycs.kycs.search}` : ``
    const page_query = `?page=` + (paginate?.page ?? getState().AdminKycs.kycs?.page)
    const url = `/admin/kyc${page_query + search_query}`

    try {
      const res = await api.get(url)
      dispatch(Fetch(res.data.body))
      dispatch(setStatus("data"))
    } catch (err: any) {
      dispatch(setStatus("error"))
    }
  }

export const FetchAdminPendingKYCsAsync =
  (paginate: Paginate = { page: 0, search: "" }): AppThunk =>
  async (dispatch, getState) => {
    dispatch(setStatus("loading"))
    const search_query =
      paginate?.search || getState().AdminKycs.pendingKycs.search
        ? `&search=${paginate?.search ?? getState().AdminKycs.pendingKycs.search}`
        : ``
    const page_query = `?page=` + (paginate?.page ?? getState().AdminKycs.pendingKycs?.page)
    const url = `/admin/kyc/pending${page_query + search_query}`
    try {
      const res = await api.get(url)
      dispatch(FetchPending(res.data.body))
      dispatch(setStatus("data"))
    } catch (err: any) {
      dispatch(setStatus("error"))
    }
  }

export const AcceptAdminKYCAsync =
  (req: { id: number }): AppThunk =>
  async (dispatch) => {
    dispatch(setStatus("loading"))
    try {
      const result = await api.get<{ body: any }>(`/admin/kyc/${req.id}/accept`)
      dispatch(UpdatePending(result.data.body))
      dispatch(setStatus("data"))
      toast.success("Updated successfully")
      dispatch(FetchAdminPendingKYCsAsync())
    } catch (err: any) {
      dispatch(setStatus("error"))
      toast.error("error")
    }
  }

export const RejectAdminKYCAsync =
  (req: { id: number; note: string }): AppThunk =>
  async (dispatch) => {
    dispatch(setStatus("loading"))
    try {
      const result = await api.post<{ body: any }>(`/admin/kyc/${req.id}/reject`, { note: req.note })
      dispatch(UpdatePending(result.data.body))
      dispatch(setStatus("data"))
      toast.success("Updated successfully")
      dispatch(FetchAdminPendingKYCsAsync())
    } catch (err: any) {
      dispatch(setStatus("error"))
      toast.error("error")
    }
  }

export const BanAdminKYCAsync =
  (req: { id: number; note: string }): AppThunk =>
  async (dispatch) => {
    dispatch(setStatus("loading"))
    try {
      const result = await api.post<{ body: any }>(`/admin/kyc/${req.id}/ban`, { note: req.note })
      dispatch(Update(result.data.body))
      dispatch(setStatus("data"))
      toast.success("Updated successfully")
    } catch (err: any) {
      dispatch(setStatus("error"))
      toast.error("error")
    }
  }
export const UnBanAdminKYCAsync =
  (req: { id: number; note: string }): AppThunk =>
  async (dispatch) => {
    dispatch(setStatus("loading"))
    try {
      const result = await api.post<{ body: any }>(`/admin/kyc/${req.id}/unban`, { note: req.note })
      dispatch(Update(result.data.body))
      dispatch(setStatus("data"))
      toast.success("Updated successfully")
    } catch (err: any) {
      dispatch(setStatus("error"))
      toast.error("error")
    }
  }

export default AdminKYCsSlice.reducer

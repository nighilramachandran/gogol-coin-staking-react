import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { toast } from "../../../../utils"
import { api } from "../../../../utils/api"
import { Paginate, Response } from "../../../../utils/api/types"
import { RequestStatus } from "../../../../utils/constants"
import { Transaction } from "../../../models"
import { AppThunk } from "../../store"

interface AdminTransactionsState {
  status: RequestStatus
  Transactions: Response<Transaction>
  GolcTransactions: Response<Transaction>
  Transaction?: Transaction
}

let initialState: AdminTransactionsState = {
  status: "nothing",
  Transactions: { count: 0, page: "0", total_pages: 0, search: undefined, data: [] },
  GolcTransactions: { count: 0, page: "0", total_pages: 0, search: undefined, data: [] },
}

const AdminTransactionsSlice = createSlice({
  name: "AdminTransactions",
  initialState,
  reducers: {
    setStatus: (state, { payload }: PayloadAction<RequestStatus>) => {
      state.status = payload
    },
    Insert: ({ Transactions }, { payload }: PayloadAction<Transaction>) => {
      Transactions.data.push(payload)
    },
    Update: (state, { payload }: PayloadAction<Transaction>) => {
      let ind = state.Transactions.data?.findIndex((el) => el.id === payload.id)
      if (ind !== -1) state.Transactions.data[ind] = payload
    },
    UpdateGolc: (state, { payload }: PayloadAction<Transaction>) => {
      let ind = state.Transactions.data?.findIndex((el) => el.id === payload.id)
      if (ind !== -1) state.GolcTransactions.data[ind] = payload
    },
    Delete: ({ Transactions }, { payload }: PayloadAction<number>) => {
      let index = Transactions.data.findIndex((el) => el.id === payload)
      if (index !== -1) Transactions.data.splice(index, 1)
    },
    DeleteGolc: ({ GolcTransactions }, { payload }: PayloadAction<number>) => {
      let index = GolcTransactions.data.findIndex((el) => el.id === payload)
      if (index !== -1) GolcTransactions.data.splice(index, 1)
    },
    Show: (state, { payload }: PayloadAction<Transaction>) => {
      state.Transaction = payload
    },
    Fetch: (state, { payload }: PayloadAction<Response<Transaction>>) => {
      const DeletedUserObj: any = {
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
        if (el.user === null) {
          el.user_id = DeletedUserObj.id
          el.user = DeletedUserObj
        }
      })

      state.Transactions = payload
    },
    FetchGolc: (state, { payload }: PayloadAction<Response<Transaction>>) => {
      const DeletedUserObj: any = {
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
        if (el.user === null) {
          el.user_id = DeletedUserObj.id
          el.user = DeletedUserObj
        }
      })
      state.GolcTransactions = payload
    },
  },
})

const { setStatus, Fetch, FetchGolc, Delete, DeleteGolc, Update, UpdateGolc } = AdminTransactionsSlice.actions

export const FetchAdminTransactionsAsync =
  (paginate: Paginate = { page: 0, search: "" }): AppThunk =>
  async (dispatch, getState) => {
    dispatch(setStatus("loading"))
    try {
      const search_query =
        paginate?.search || getState().AdminTransaction.Transactions.search
          ? `&search=${paginate?.search ?? getState().AdminTransaction.Transactions.search ?? ""}`
          : ``
      const page_query = `?page=` + (paginate?.page ?? getState().AdminTransaction.Transactions?.page)
      const url = `/admin/transactions${page_query + search_query}`

      const result = await api.get<{ body: Response<Transaction> }>(url)
      dispatch(Fetch(result.data.body))
      dispatch(setStatus("data"))
    } catch (err: any) {
      dispatch(setStatus("error"))
    }
  }
export const FetchGolcAdminTransactionsAsync =
  (paginate: Paginate = { page: 0, search: "" }): AppThunk =>
  async (dispatch, getState) => {
    dispatch(setStatus("loading"))
    try {
      const search_query =
        paginate?.search || getState().AdminTransaction.GolcTransactions.search
          ? `&search=${paginate?.search ?? getState().AdminTransaction.GolcTransactions.search ?? ""}`
          : ``
      const page_query = `?page=` + (paginate?.page ?? getState().AdminTransaction.GolcTransactions?.page)
      const url = `/admin/golc/transactions${page_query + search_query}`
      const result = await api.get<{ body: Response<Transaction> }>(url)
      dispatch(FetchGolc(result.data.body))
      dispatch(setStatus("data"))
    } catch (err: any) {
      dispatch(setStatus("error"))
    }
  }

export const DeleteAdminTransactionAsync =
  (req: { id: number }): AppThunk =>
  async (dispatch) => {
    dispatch(setStatus("loading"))
    try {
      await api.delete<{ body: Transaction }>(`/admin/transaction/${req.id}/delete`)
      dispatch(Delete(req.id))
      dispatch(setStatus("data"))
      toast.success("Deleted successfully")
    } catch (err: any) {
      dispatch(setStatus("error"))
      toast.error("error")
    }
  }
export const DeleteGolcAdminTransactionAsync =
  (req: { id: number }): AppThunk =>
  async (dispatch) => {
    dispatch(setStatus("loading"))
    try {
      await api.delete<{ body: Transaction }>(`/admin/transaction/${req.id}/delete`)
      dispatch(DeleteGolc(req.id))
      dispatch(setStatus("data"))
      toast.success("Deleted successfully")
    } catch (err: any) {
      dispatch(setStatus("error"))
      toast.error("error")
    }
  }

export const UpdateAdminTransactionAsync =
  (req: { id: number; amount: number; txhash: string }): AppThunk =>
  async (dispatch) => {
    dispatch(setStatus("loading"))
    try {
      const result = await api.post<{ body: Transaction }>(`/admin/transaction/${req.id}/edit`, req)
      dispatch(Update(result.data.body))
      dispatch(setStatus("data"))
      toast.success("Updated successfully")
    } catch (error: any) {
      dispatch(setStatus("error"))
      toast.error(error?.response?.data?.message)
    }
  }
export const UpdateGolcAdminTransactionAsync =
  (req: { id: number; amount: number; txhash: string }): AppThunk =>
  async (dispatch) => {
    dispatch(setStatus("loading"))
    try {
      const result = await api.post<{ body: Transaction }>(`/admin/transaction/${req.id}/edit`, req)
      dispatch(UpdateGolc(result.data.body))
      dispatch(setStatus("data"))
      toast.success("Updated successfully")
    } catch (error: any) {
      dispatch(setStatus("error"))
      toast.error(error?.response?.data?.message)
    }
  }

export default AdminTransactionsSlice.reducer

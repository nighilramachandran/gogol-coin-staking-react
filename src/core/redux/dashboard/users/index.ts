import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { toast } from "../../../../utils"
import { api } from "../../../../utils/api"
import { Paginate } from "../../../../utils/api/types"
import { RequestStatus } from "../../../../utils/constants"
import { Response, User } from "../../../models"
import { AppThunk } from "../../store"

interface AdminUsersState {
  status: RequestStatus
  margeAccountsStatus: RequestStatus

  users: Response<User>
  user?: User
  deletedUsers: Response<User>
}

let initialState: AdminUsersState = {
  status: "nothing",
  margeAccountsStatus: "nothing",
  users: { count: 0, page: "0", total_pages: 0, search: undefined, data: [] },
  deletedUsers: { count: 0, page: "0", total_pages: 0, search: undefined, data: [] },
}

const AdminUsersSlice = createSlice({
  name: "AdminUsers",
  initialState,
  reducers: {
    setMargeStatus: (state, { payload }: PayloadAction<RequestStatus>) => {
      state.margeAccountsStatus = payload
    },
    setStatus: (state, { payload }: PayloadAction<RequestStatus>) => {
      state.status = payload
    },
    Insert: ({ users }, { payload }: PayloadAction<User>) => {
      users.data.push(payload)
    },
    Update: (state, { payload }: PayloadAction<User>) => {
      let ind = state.users?.data.findIndex((el) => el.id === payload.id)
      if (ind !== -1) state.users.data[ind] = payload
    },
    // UpdateDeletedUser: (state, { payload }: PayloadAction<User>) => {
    //   let ind = state.users?.data.findIndex((el) => el.id === payload.id)
    //   if (ind !== -1) state.users.data[ind] = payload
    // },
    UpdateAfterGolcChange: (state, { payload }: PayloadAction<any>) => {
      let ind = state.users?.data.findIndex((el) => el.id === payload)
      if (ind !== -1) state.users.data[ind].golc = 1
    },
    Delete: ({ users }, { payload }: PayloadAction<number>) => {
      let index = users?.data.findIndex((el) => el.id === payload)
      if (index !== -1) users.data.splice(index, 1)
    },
    RemoveDeletedUser: ({ deletedUsers }, { payload }: PayloadAction<number>) => {
      let index = deletedUsers?.data.findIndex((el) => el.id === payload)
      if (index !== -1) deletedUsers.data.splice(index, 1)
    },
    Show: (state, { payload }: PayloadAction<User>) => {
      state.user = payload
    },
    Fetch: (state, { payload }: PayloadAction<Response<User>>) => {
      state.users = payload
    },
    FetchDeletedUser: (state, { payload }: PayloadAction<Response<User>>) => {
      state.deletedUsers = payload
    },
  },
})

const { setStatus, Fetch, FetchDeletedUser, Delete, RemoveDeletedUser, Update, UpdateAfterGolcChange, setMargeStatus } =
  AdminUsersSlice.actions

export const FetchAdminUsersAsync =
  (paginate: Paginate = { page: 0, search: "" }, golc?: 0 | 1): AppThunk =>
  async (dispatch, getState) => {
    dispatch(setStatus("loading"))
    try {
      const search_query =
        paginate?.search || getState().AdminUsers.users.search ? `&search=${paginate?.search ?? getState().AdminUsers.users.search}` : ``
      const page_query = `?page=` + (paginate?.page ?? getState().AdminUsers.users?.page)
      const url = `/admin/users${page_query + search_query}`

      const result = await api.get<{ body: Response<User> }>(url, {
        params: {
          ...(golc !== undefined && { golc }),
        },
      })
      dispatch(Fetch(result.data.body))
      dispatch(setStatus("data"))
    } catch (err: any) {
      dispatch(setStatus("error"))
    }
  }
export const FetchAdminDeletedUsersAsync =
  (paginate: Paginate = { page: 0, search: "" }, golc?: 0 | 1): AppThunk =>
  async (dispatch, getState) => {
    dispatch(setStatus("loading"))
    try {
      const search_query =
        paginate?.search || getState().AdminUsers.deletedUsers.search
          ? `&search=${paginate?.search ?? getState().AdminUsers.deletedUsers.search}`
          : ``
      const page_query = `?page=` + (paginate?.page ?? getState().AdminUsers.deletedUsers?.page)
      const url = `/admin/users/deleted${page_query + search_query}`

      const result = await api.get<{ body: Response<User> }>(url, {
        params: {
          ...(golc !== undefined && { golc }),
        },
      })
      dispatch(FetchDeletedUser(result.data.body))
      dispatch(setStatus("data"))
    } catch (err: any) {
      dispatch(setStatus("error"))
    }
  }

export const UpdateAdminUserAsync =
  (req: { id: number; email: string }): AppThunk =>
  async (dispatch) => {
    dispatch(setStatus("loading"))
    try {
      const result = await api.post<{ body: User }>(`/admin/user/${req.id}/edit`, { email: req.email })
      dispatch(Update(result.data.body))
      dispatch(setStatus("data"))
      toast.success("Updated successfully")
    } catch (err: any) {
      dispatch(setStatus("error"))
      toast.error(err?.response?.data?.message)
    }
  }
export const MargeAccountsAsync =
  (req: { first_email: string; second_email: string }): AppThunk =>
  async (dispatch) => {
    dispatch(setMargeStatus("loading"))
    try {
      await api.post<{ body: User }>(`admin/accounts/merge`, req)
      dispatch(setMargeStatus("data"))
      toast.success("Merged successfully")
    } catch (err: any) {
      dispatch(setMargeStatus("error"))
      toast.error(err?.response?.data?.message)
    }
  }

export const DeleteAdminUserAsync =
  (req: { id: number }): AppThunk =>
  async (dispatch) => {
    dispatch(setStatus("loading"))
    try {
      await api.delete<{ body: User }>(`/admin/user/${req.id}/delete`)
      dispatch(Delete(req.id))
      dispatch(setStatus("data"))
      toast.success("Updated successfully")
    } catch (err: any) {
      dispatch(setStatus("error"))
      toast.error("error")
    }
  }

export const SoftDeleteAdminUserAsync =
  (req: { id: number }): AppThunk =>
  async (dispatch) => {
    dispatch(setStatus("loading"))
    try {
      await api.delete<{ body: User }>(`/admin/user/delete/${req.id}`)
      dispatch(Delete(req.id))
      dispatch(setStatus("data"))
      toast.success("Updated successfully")
    } catch (err: any) {
      dispatch(setStatus("error"))
      toast.error("error")
    }
  }

export const ChangeRoleAdminUserAsync =
  (req: { id: number; role: string }): AppThunk =>
  async (dispatch) => {
    dispatch(setStatus("loading"))
    try {
      const { data } = await api.post<{ body: User }>(`/admin/user/role/change`, { user_id: req.id, role: req.role })
      dispatch(Update(data.body))
      dispatch(setStatus("data"))
      toast.success("Updated successfully")
    } catch (err: any) {
      dispatch(setStatus("error"))
      toast.error("error")
    }
  }

export const ActiveAdminUserAsync =
  (req: { id: number }): AppThunk =>
  async (dispatch) => {
    dispatch(setStatus("loading"))
    try {
      const result = await api.get<{ body: any }>(`/admin/user/${req.id}/activate`)
      dispatch(Update(result.data.body))
      dispatch(setStatus("data"))
      toast.success("Updated successfully")
    } catch (err: any) {
      dispatch(setStatus("error"))
      toast.error("error")
    }
  }
export const RestoreAdminUserAsync =
  (req: { id: number }): AppThunk =>
  async (dispatch) => {
    dispatch(setStatus("loading"))
    try {
      const result = await api.post<{ body: any }>(`/admin/user/restore/${req.id}`)
      dispatch(RemoveDeletedUser(req.id))
      dispatch(setStatus("data"))
      toast.success("Updated successfully")
    } catch (err: any) {
      dispatch(setStatus("error"))
      toast.error("error")
    }
  }
export const ChangeUserToGolcAsync =
  (req: { id: number }): AppThunk =>
  async (dispatch) => {
    dispatch(setStatus("loading"))
    try {
      const result = await api.post<{ body: any }>(`/admin/user/balances/togolc`, { user_id: req.id })
      dispatch(UpdateAfterGolcChange(req.id))
      dispatch(setStatus("data"))
      toast.success("Updated successfully")
    } catch (err: any) {
      dispatch(setStatus("error"))
      toast.error("error")
    }
  }

export const DeActiveAdminUserAsync =
  (req: { id: number }): AppThunk =>
  async (dispatch) => {
    dispatch(setStatus("loading"))
    try {
      const result = await api.get<{ body: any }>(`/admin/user/${req.id}/deactivate`)
      dispatch(Update(result.data.body))
      dispatch(setStatus("data"))
      toast.success("Updated successfully")
    } catch (err: any) {
      dispatch(setStatus("error"))
      toast.error("error")
    }
  }

// export const HoldAdminUserAsync =
//   (req: { id: number }): AppThunk =>
//   async (dispatch) => {
//     dispatch(setStatus("loading"))
//     try {
//       const result = await api.get<{ body: any }>(`/admin/user/${req.id}/hold`)
//       dispatch(Update(result.data.body))
//       dispatch(setStatus("data"))
//       toast.success("Updated successfully")
//     } catch (err: any) {
//       dispatch(setStatus("error"))
//       toast.error("error")
//     }
//   }

export default AdminUsersSlice.reducer

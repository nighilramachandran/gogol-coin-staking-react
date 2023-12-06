import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { toast } from "../../../utils"
import { api } from "../../../utils/api"
import { RequestStatus } from "../../../utils/constants"
import { saveAuth, deleteAuth, getAuth } from "../../../utils/helpers/auth"
import {
  ChangePasswordReq,
  CreateNewPasswordReq,
  LoginReq,
  LoginRes,
  RegisterReq,
  ResendEmailReq,
  User,
  VerifyEmailReq,
} from "../../models"
import history from "../../../utils/helpers/history"
import { AppThunk } from "../store"
import axios, { AxiosError } from "axios"
import { justAsync } from "../../../utils/helpers/just-async"
import { permessionsChecker } from "../../../utils/helpers/permessions-checker"

interface InitialState {
  status: RequestStatus
  login_status: RequestStatus
  update_profile_status: RequestStatus
  isAuth: boolean
  isAdmin: boolean
  user?: User
  email?: string
  email_changed?: boolean
  permessions: Record<string, boolean>
}

let initialState: InitialState = {
  status: "loading",
  login_status: "nothing",
  update_profile_status: "nothing",
  isAuth: false,
  isAdmin: false,
  permessions: {
    isAdmin: false,
    isView: false,
    isKyc: false,
    isStaking: false,
  },
}

const AuthSlice = createSlice({
  name: "Auth",
  initialState,
  reducers: {
    setStatus: (state, { payload }: PayloadAction<RequestStatus>) => {
      state.status = payload
    },
    setLoginStatus: (state, { payload }) => {
      state.login_status = payload
    },
    setUpdateProfileStatus: (state, { payload }) => {
      state.update_profile_status = payload
    },
    login: (state, { payload }: PayloadAction<LoginRes>) => {
      state.user = payload.user
      if (payload.auth_token) {
        state.isAuth = true
        saveAuth(payload)
      }

      if (payload.user && payload.user.role === "ADMIN") {
        state.isAdmin = true
      }
      if (payload.user) state.permessions = permessionsChecker(payload.user.role)
    },
    setUser: (state, { payload }: PayloadAction<{ email?: string; phone_number?: string; first_name?: string; last_name?: string }>) => {
      if (state.user) {
        if (payload.email) state.user.email = payload.email
        if (payload.phone_number) state.user.phone_number = payload.phone_number
        if (payload.first_name) state.user.first_name = payload.first_name
        if (payload.last_name) state.user.last_name = payload.last_name
      }
    },
    refreshAuth: (state, { payload }) => {
      state.user = payload.user
      state.isAuth = true
      saveAuth(payload)
      if (payload.user && payload.user.role === "ADMIN") {
        state.isAdmin = true
      }
      if (payload.user) state.permessions = permessionsChecker(payload.user.role)
    },
    logout: (state) => {
      state.isAuth = false
      state.isAdmin = false
      state.permessions = {
        isAdmin: false,
        isView: false,
        isKyc: false,
        isStaking: false,
      }
      state.user = initialState.user
      deleteAuth()
    },
    forgotPassword: (state, { payload }: PayloadAction<{ email: string; email_changed: boolean }>) => {
      state.email = payload.email
      state.email_changed = payload.email_changed
    },
  },
})

const { setStatus, login, setLoginStatus, forgotPassword, setUser, setUpdateProfileStatus } = AuthSlice.actions
export const { logout } = AuthSlice.actions

export const UpdateProfile =
  (req: { email?: string; phone_number?: string }): AppThunk =>
  async (dispatch) => {
    dispatch(setUpdateProfileStatus("loading"))
    try {
      const { data } = await api.post<{ body: User; message: string }>("/profile/update", req)
      dispatch(setUser(data.body))
      toast.success(data?.message)
      dispatch(setUpdateProfileStatus("data"))
    } catch (error: any) {
      toast.error("Email or Phone Number has already been taken")
      // if (axios.isAxiosError(error)) {
      //   toast.error(error.message)
      // } else toast.error(error?.response?.data?.message)
      dispatch(setUpdateProfileStatus("data"))
    }
  }

export const LoginAsync =
  (req: LoginReq): AppThunk =>
  async (dispatch) => {
    dispatch(setLoginStatus("loading"))
    try {
      const result = await api.post<{ body: LoginRes; message: string }>("/login", req)
      if (result.data.body.user?.status === "DISABLED") {
        throw new AxiosError("Your account is deactivated, Please contact the support team")
      }
      dispatch(login(result.data.body))
      toast.success(result?.data?.message)
      dispatch(setLoginStatus("data"))
      if (result?.data?.body.auth_token) {
        // console.log("user", result?.data?.body)
        // result?.data?.body?.user?.role === "ADMIN" ? history.navigate("/dashboard") : history.navigate("/home")
      } else history.navigate(`/email-sent?email=${req.email}`)
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.log(error)
        if (error?.response?.status === 500) {
          toast.error("Error, Please try later")
        } else toast.error((error as any)?.response?.data?.message ?? error.message)
      } else toast.error(error?.response?.data?.message)
      dispatch(setLoginStatus("data"))
    }
  }

//change params to LoginRes
export const RefreshAuthAsync =
  (withReload?: boolean): AppThunk =>
  async (dispatch) => {
    dispatch(setStatus("loading"))
    if (window.location.pathname === "/change-password") dispatch(setStatus("data"))
    else
      try {
        const res = await api.get<{ body: LoginRes }>("/refresh")
        if (res.data.body.user?.status === "DISABLED") {
          throw new AxiosError("Your account is deactivated, Please contact the support team")
        }
        dispatch(login(res.data.body))

        dispatch(setStatus("data"))
        if (withReload) window.location.reload()
      } catch (error) {
        dispatch(logout())
        dispatch(setStatus("error"))
      }
  }

export const CheckAuthAsync = (): AppThunk => async (dispatch) => {
  dispatch(setStatus("loading"))
  if (window.location.pathname === "/change-password") dispatch(setStatus("data"))
  else
    try {
      const auth = await getAuth()
      if (auth.auth_token && auth.user) dispatch(login(auth))
      dispatch(setStatus("data"))
    } catch (error) {
      dispatch(logout())
      dispatch(setStatus("error"))
    }
}

export const LogoutAsync = (): AppThunk => async (dispatch) => {
  try {
    dispatch(setStatus("loading"))
    await justAsync()
    dispatch(logout())
    dispatch(setStatus("data"))
    history.navigate("/")
  } catch (error) {
    console.error(error)
  }
}

export const RegisterAsync =
  (req: RegisterReq): AppThunk =>
  async (dispatch) => {
    dispatch(setLoginStatus("loading"))
    try {
      const result = await api.post("/register", req)
      toast.success(result?.data?.message)
      dispatch(setLoginStatus("data"))
      history.navigate(`/email-sent?email=${req.email}`)
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.log(error)
        if (error?.response?.status === 500) {
          toast.error("Error, Please try later")
        } else toast.error((error as any)?.response?.data?.message ?? error.message)
      } else toast.error(error?.response?.data?.message)
      dispatch(setLoginStatus("data"))
    }
  }

export const ResendEmailAsync =
  (req: ResendEmailReq): AppThunk =>
  async (dispatch) => {
    dispatch(setLoginStatus("loading"))
    try {
      await api.post("/resendCode", req)
      toast.success("Email sent successfully")
      dispatch(setLoginStatus("data"))
    } catch (error: any) {
      toast.error(error?.response?.data?.message)
    }
  }

export const VerifyEmailAsync =
  (req: VerifyEmailReq): AppThunk =>
  async (dispatch) => {
    dispatch(setLoginStatus("loading"))
    try {
      const res = await api.post<{ body: LoginRes }>("/verify", req)
      dispatch(login(res?.data?.body))
      dispatch(setLoginStatus("data"))
      toast.success("Email verified successfully")
      history.navigate("/home")
    } catch (error: any) {
      toast.error(error?.response?.data?.message)
      history.navigate("/login")
      dispatch(setLoginStatus("error"))
    }
  }

export const CheckEmailExistAsync =
  (req: ResendEmailReq): AppThunk =>
  async (dispatch) => {
    dispatch(setLoginStatus("loading"))
    try {
      const { data } = await api.post<{ body: string | null }>("/password/forget", req)
      dispatch(setLoginStatus("data"))
      //check if user changed his email
      if (data.body) {
        dispatch(forgotPassword({ email: data.body, email_changed: true }))
      } else {
        dispatch(forgotPassword({ email: req.email, email_changed: false }))
      }
      toast.success("Email sent successfully")
    } catch (error: any) {
      toast.error(error?.response?.data?.message)
      dispatch(setLoginStatus("error"))
    }
  }

export const CreateNewPasswordAsync =
  (req: CreateNewPasswordReq): AppThunk =>
  async (dispatch) => {
    dispatch(setLoginStatus("loading"))
    try {
      await api.post<{ body: CreateNewPasswordReq }>("/password/change", req)
      dispatch(setLoginStatus("data"))
      toast.success("Password changed successfully")
      history.navigate("/login")
    } catch (error: any) {
      toast.error(error?.response?.data?.message)
      dispatch(setLoginStatus("error"))
    }
  }

export const ChangePasswordAsync =
  (req: ChangePasswordReq): AppThunk =>
  async (dispatch) => {
    dispatch(setUpdateProfileStatus("loading"))
    try {
      await api.post("/profile/password/update", req)
      dispatch(setUpdateProfileStatus("data"))
      toast.success("Password changed successfully")
      // history.navigate("/login")
    } catch (error: any) {
      toast.error(error?.response?.data?.message)
      dispatch(setUpdateProfileStatus("error"))
    }
  }

export default AuthSlice.reducer

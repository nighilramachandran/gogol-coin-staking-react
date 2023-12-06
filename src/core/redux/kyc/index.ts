import { createSlice } from "@reduxjs/toolkit"
import { toast } from "../../../utils"

import { RequestStatus } from "../../../utils/constants"
import { KYC, KYCForm } from "../../models/kyc"
import { AppThunk } from "../store"
import { api } from "../../../utils/api"
import axios from "axios"
import { urltoFile } from "../../../utils/helpers/base64-to-file"
import { getFormData } from "../../../utils/helpers/convert-to-formdata"

interface InitialState {
  status: RequestStatus
  userStatus: RequestStatus
  kycData?: KYCForm
  kycResponse: KYC | null
}

let initialState: InitialState = {
  status: "nothing",
  userStatus: "nothing",
  kycResponse: null,
}

const KycSlice = createSlice({
  name: "Kyc",
  initialState,
  reducers: {
    setStatus: (state, { payload }) => {
      state.status = payload
    },
    setUserStatus: (state, { payload }) => {
      state.userStatus = payload
    },
    setKycData: (state, { payload }) => {
      state.kycData = { ...state.kycData, ...payload }
    },
    setKycResponse: (state, { payload }) => {
      state.kycResponse = payload
    },
  },
})

export const { setKycData, setStatus, setKycResponse, setUserStatus } = KycSlice.actions

// export const CreateNewPasswordAsync =
//   (): AppThunk =>
//   async (dispatch) => {
//     dispatch(setStatus("loading"))
//     try {
//       dispatch(setStatus("data"))
//       toast.success("Password changed successfully")
//       history.navigate("/login")
//     } catch (error: any) {
//       toast.error(error?.response?.data?.message)
//       dispatch(setStatus("error"))
//     }
//   }

export const FetchUserStatus = (): AppThunk => async (dispatch) => {
  dispatch(setUserStatus("loading"))
  try {
    const res = await api.get(`/profile/kyc/status`)
    if (res.data.body) {
      let body = Object.assign({}, res.data.body)
      body = {
        ...body,
        id_image_front: `${process.env.REACT_APP_STORAGE}${res.data.body.id_image_front}`,
        id_image_back: `${process.env.REACT_APP_STORAGE}${res.data.body.id_image_back}`,
        id_image_other: res.data.body.id_image_other ? `${process.env.REACT_APP_STORAGE}${res.data.body.id_image_other}` : undefined,
        selfie_with_id: `${process.env.REACT_APP_STORAGE}${res.data.body.selfie_with_id}`,
      }
      dispatch(setKycResponse(body))
      dispatch(setKycData(body))
    }

    dispatch(setUserStatus("data"))
  } catch (error: any) {
    if (axios.isAxiosError(error)) toast.error((error?.response?.data as any)?.message ?? error.message)
    else toast.error(error?.response?.data?.message)
    dispatch(setUserStatus("error"))
  }
}

export const CreateUserInfoAsync =
  (req: KYCForm): AppThunk =>
  async (dispatch) => {
    if (!req.id_image_other) {
      delete req["id_image_other"]
    }
    req = {
      ...req,
      ...(req.id_image_back && { id_image_back: (await urltoFile(req?.id_image_back)) as any }),
      ...(req.id_image_front && { id_image_front: (await urltoFile(req?.id_image_front)) as any }),
      ...(req.selfie_with_id && { selfie_with_id: (await urltoFile(req.selfie_with_id)) as any }),
      ...(req.id_image_other && { id_image_other: (await urltoFile(req.id_image_other)) as any }),
    }
    dispatch(setStatus("loading"))
    try {
      await api.post(`/profile/kyc/create`, getFormData(req))
      dispatch(FetchUserStatus())
      dispatch(setStatus("data"))
      toast.success("Success")
    } catch (error: any) {
      if (axios.isAxiosError(error)) toast.error((error?.response?.data as any)?.message ?? error.message)
      else toast.error(error?.response?.data?.message)
      dispatch(setStatus("error"))
    }
  }

export const UpdateUserInfoAsync =
  (reqest: KYCForm): AppThunk =>
  async (dispatch, getState) => {
    dispatch(setStatus("loading"))
    //prepear request
    let req = Object.assign({}, reqest)
    const {
      Kyc: { kycResponse },
    } = getState()
    if (!req.id_image_other) {
      delete req["id_image_other"]
    }
    if (req.id_image_back === kycResponse?.id_image_back) {
      delete req["id_image_back"]
    }
    if (req.id_image_front === kycResponse?.id_image_front) {
      delete req["id_image_front"]
    }
    if (req.selfie_with_id === kycResponse?.selfie_with_id) {
      delete req["selfie_with_id"]
    }
    if (req.id_image_other === kycResponse?.id_image_other) {
      delete req["id_image_other"]
    }
    req = {
      ...req,
      ...(req.id_image_back && { id_image_back: (await urltoFile(req?.id_image_back)) as any }),
      ...(req.id_image_front && { id_image_front: (await urltoFile(req?.id_image_front)) as any }),
      ...(req.selfie_with_id && { selfie_with_id: (await urltoFile(req.selfie_with_id)) as any }),
      ...(req.id_image_other && { id_image_other: (await urltoFile(req.id_image_other)) as any }),
    }

    try {
      await api.post(`/profile/kyc/update`, getFormData(req))
      dispatch(FetchUserStatus())
      dispatch(setStatus("data"))
      toast.success("Success")
    } catch (error: any) {
      if (axios.isAxiosError(error)) toast.error((error?.response?.data as any)?.message ?? error.message)
      else toast.error(error?.response?.data?.message)
      dispatch(setStatus("error"))
    }
  }
export default KycSlice.reducer

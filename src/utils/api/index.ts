import axios from "axios"
import { logout } from "../../core/redux"
import { store } from "../../core/redux/store"
import { getAuth } from "../helpers/auth"
import eventManager, { EVENT_UNAUTHORIZED } from "./event-manager"

let baseURL = process.env.REACT_APP_URL_STAG
if (process.env.REACT_APP_ENV === "production") {
  baseURL = process.env.REACT_APP_URL_PROD
}

export const api = axios.create({
  baseURL,
  timeout: 180000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})

api.interceptors.request.use(async (config) => {
  const auth_token = (await getAuth()).auth_token

  if (auth_token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${auth_token}`,
    }
  }

  return config
})

api.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error.response.status === 403 || error.response.status === 404) {
      eventManager.emit(EVENT_UNAUTHORIZED)
    }

    return Promise.reject(error)
  }
)

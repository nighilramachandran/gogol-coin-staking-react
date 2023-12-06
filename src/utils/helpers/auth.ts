import { LoginRes } from "../../core/models"
import { TOKEN_KEY, USER_KEY } from "../constants"

export const getAuth = async () => {
  let user = JSON.parse(localStorage.getItem(USER_KEY) as string)
  let auth_token = localStorage.getItem(TOKEN_KEY)

  return { user, auth_token } as unknown as LoginRes
}
export const saveAuth = (res: any) => {
  localStorage.setItem(USER_KEY, JSON.stringify(res.user))
  localStorage.setItem(TOKEN_KEY, res.auth_token)
  // api.defaults.headers.Authorization = `Bearer ${res.auth_token}`
}

export const deleteAuth = () => {
  localStorage.removeItem(USER_KEY)
  localStorage.removeItem(TOKEN_KEY)
}

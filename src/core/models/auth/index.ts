//----Login-----
export interface LoginReq {
  email: string
  password: string
}

export interface LoginRes {
  auth_token: string
  user?: User
}

//----Register-----
export interface RegisterReq {
  first_name: string
  last_name: string
  email: string
  password: string
  privacy: boolean
  phone_number?: string
}

export interface RegisterRes {}

export interface ResendEmailReq {
  email: string
}

export interface CreateNewPasswordReq {
  email: string
  password: string
  code: string
}
export interface ChangePasswordReq {
  current_password: string
  new_password: string
}

export interface VerifyEmailReq {
  verification_string: string
}

//----User-----
export interface User {
  id: number
  // name: string
  first_name: string
  last_name: string
  role: string
  email: string
  emails: {
    id: number
    user_id: number
    old_email: string
    new_email: string
    created_at: string
    updated_at: string
  }[]
  phone_number?: string
  status: "ENABLED" | "DISABLED" | "HOLD"
  verified: 0 | 1
  golc: 0 | 1
}

export interface Response<Type> {
  count: number
  data: Type[]
  page: string
  total_pages: number
  search?: string
}

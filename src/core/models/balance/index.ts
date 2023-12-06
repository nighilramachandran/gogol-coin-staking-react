import { User } from "../auth"

//----Balance-----
export interface BalanceReq {}

export interface BalanceRes {
  count: number
  data?: Balance[]
  page: string
  total_pages: number
  search?: string
}

export interface GolcBalanceRes {
  count: number
  data: GolcBalance[]
  page: string
  total_pages: number
  search?: string
}

export interface Balance {}

export interface Balance {
  id: number
  stacking_balance: number
  started_at: string
  profit_percentage: string
  status: string
  withdrew_at?: any
  withdraw_amount?: any
  profit_per_day: number
  user_id: number
  created_at: Date
  updated_at: Date
  reward: number
  user?: any
}
export interface BalanceUser {
  id: number
  first_name: string
  last_name: string
  wd_key?: any
  email: string
  email_verified_at?: Date
  phone_number?: any
  created_at?: Date
  updated_at?: Date
  status: string
  role: string
  username: string
  user_info_id: number
  verified: number
  golc: number
  deleted_at?: Date
}
export interface GolcBalance {
  id: number
  stacking_balance: number
  started_at: string
  profit_percentage: string
  status: string
  withdrew_at?: any
  withdraw_amount?: any
  profit_per_day: number
  user_id: number
  created_at: Date
  updated_at: Date
  reward: number
  old_stacking_balance: number
}
export interface GolcCal {
  active_balance: number
  number_of_held_balances: number
}

export interface BalanceWithUser {
  id: number
  stacking_balance: number
  started_at: string
  reward: number
  profit_per_day: number
  user_id: number
  user: User
}

export interface BalanceInfo {
  tranaction_status: string
  balance_info: {
    days: number
    base_balance: number
    reward: number
    total_balance: number
    profit_per_day: number
    profit: number
    percentage: number
    total_balance_with_profit: number
  }
}

export interface RemainingInfo {
  my_profit_amount: number
  days: number
  withdrawable: 1 | 0
}

export interface GolcConfig {
  transfer_to_golc: boolean
  add_staking: "gogolcoin" | "golc" | null
}

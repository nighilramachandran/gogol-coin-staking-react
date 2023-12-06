export interface User {
  id: number
  first_name: string
  last_name: string
  wd_key?: any
  email: string
  email_verified_at: Date
  phone_number?: any
  created_at: Date
  updated_at: Date
  status: string
  role: string
  username: string
}

export interface Staker {
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
  staking_balance: number
  user: User
}

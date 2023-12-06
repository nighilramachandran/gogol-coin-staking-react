export interface BalanceInfoGolc {
  id: number
  stacking_balance: number
  remaining_amount: number
  started_at: string
  status: string
  withdrew_at: any
  withdraw_amount: any
  user_id: number
  created_at: string
  updated_at: string
}
export interface RemaningInfoGolc {
  first_three_months: boolean
  start_date: string
  withdrawable: boolean
  last_drawn_date: string
  current_draw_date: string
  current_draw_amount: number
  current_draw_done: boolean
  next_draw_date: string
  next_draw_amount: number
  remaining_amount: number
  claimable_months_count: number
}

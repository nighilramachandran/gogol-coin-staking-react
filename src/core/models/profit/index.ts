//----Profit-----
export interface ProfitReq {}

export interface ProfitRes {}

export interface Profit {
  date: string
  claim: 0 | 1
  withdrawable: 0 | 1
  amount: number
  step: number
}

export interface Timeline_Res {
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
export interface WithDrawHistory {
  id: number
  receiver_wallet_public_key: string
  txhash: string
  gross_amount: number
  net_amount: number
  currency: string
  status: string
  balance_id: number
  created_at: Date
  updated_at: Date
}

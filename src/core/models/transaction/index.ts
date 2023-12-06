//----Transaction-----
export interface TransactionReq {
  key: string
  value: string
  description: string
  type: string
  enabled: boolean
}

export interface Transaction {
  id: number
  sender_wallet_public_key: string
  txhash: string
  amount: number
  currency: string
  status: string
  user_id: number
  subscription_id: number
  created_at: Date
  updated_at: Date
  subscription: Subscription
}

export interface Subscription {
  id: number
  stacking_balance: number
  min_month: number
  profit_percentage: string
  pool: string
  status: string
  created_at: Date
  updated_at: Date
}

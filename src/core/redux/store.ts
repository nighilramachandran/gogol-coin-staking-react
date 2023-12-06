import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit"
import Auth from "./auth"
import Transaction from "./transaction"
import Balance from "./balance"
import BalanceGolc from "./balance-new"
import Profit from "./profit"
import HomeDashboardSlice from "./dashboard/home"
import AdminBalance from "./dashboard/balance"
import AdminTransaction from "./dashboard/transaction"
import AdminUsers from "./dashboard/users"
import Kyc from "./kyc"
import AdminKycs from "./dashboard/kyc"

export const store = configureStore({
  reducer: {
    Auth,
    Transaction,
    Balance,
    BalanceGolc,
    Profit,
    HomeDashboardSlice,
    AdminBalance,
    AdminTransaction,
    AdminUsers,
    Kyc,
    AdminKycs,
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>

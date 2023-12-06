import React from "react"
import { Layout } from "./widgets/layout"
import { AuthContainer } from "./widgets/auth-container"
import { useAppSelector } from "./core/redux/hooks"
import { Login, Register, EmailSent, LearnMore, Landing, Home, Verify, ForgetPassword, Dashboard, ChangePassword, NotFound } from "./pages"
import { Routes, Route, BrowserRouter, Navigate, useNavigate, Outlet } from "react-router-dom"
import history from "../src/utils/helpers/history"
import { Balances, GolcBalances } from "./pages/dashboard/balances"
import { Transaction, GolcTransaction } from "./pages/dashboard/transaction"
import { Users, DeletedUsers } from "./pages/dashboard/users"
import { AddStaking } from "./pages/dashboard/add-staking"
import { ClaimRequests } from "./pages/dashboard/claim-requests"
import { AcceptedClaims } from "./pages/dashboard/accepted-claims"
import { Subscriptions } from "./pages/subscriptions"
import { TermsAndConditions } from "./pages/terms-and-conditions"
import { KYCs } from "./pages/dashboard/kyc"
import { PendingKYCs } from "./pages/dashboard/pending-kyc"
import { Profile } from "./pages/profile"
import { MargeAccounts } from "./pages/dashboard/marge-accounts"
import { ChangePassword as ChangePasswordProfile } from "./widgets/profile/change-password"
import { GeneralInformation } from "./widgets/profile/general-information"

export const AppRoutes: React.FC = () => {
  const { isAuth, isAdmin, permessions } = useAppSelector((state) => state.Auth)

  const NavigateSetter = () => {
    history.navigate = useNavigate()
    return null
  }

  return (
    <BrowserRouter>
      <NavigateSetter />
      <Routes>
        {/* Private routes */}
        <Route element={<Layout />}>
          <Route element={!isAuth ? <Navigate to="/login" replace /> : <Outlet />}>
            <Route path="home" element={<Home />} />
            <Route path="profile" element={<Outlet />}>
              <Route index element={<Profile />} />
              <Route path="update-info" element={<GeneralInformation />} />
              <Route path="change-password" element={<ChangePasswordProfile />} />
            </Route>
            <Route path="dashboard" element={!permessions.isView ? <Navigate to="/" replace /> : <Outlet />}>
              <Route index element={<Dashboard />} />
              <Route path="golc-dashboard" element={<Dashboard />} />
              <Route path="balances" element={<Balances />} />
              <Route path="golc-balances" element={<GolcBalances />} />
              <Route path="transaction" element={<Transaction />} />
              <Route path="golc-transaction" element={<GolcTransaction />} />
              <Route path="users" element={<Users />} />
              <Route path="deleted-users" element={<DeletedUsers />} />

              <Route path="add-staking" element={!permessions.isStaking ? <Navigate to="/dashboard" replace /> : <Outlet />}>
                <Route index element={<AddStaking />} />
              </Route>
              <Route path="claim-requests" element={!permessions.isAdmin ? <Navigate to="/dashboard" replace /> : <Outlet />}>
                <Route index element={<ClaimRequests />} />
                <Route path="merge-accounts" element={<MargeAccounts />} />
              </Route>
              <Route path="merge-accounts" element={!permessions.isAdmin ? <Navigate to="/dashboard" replace /> : <Outlet />}>
                <Route index element={<MargeAccounts />} />
                {/* <Route path="merge-accounts" element={<MargeAccounts />} /> */}
              </Route>

              <Route path="manage-claims" element={<AcceptedClaims />} />
              <Route path="manage-kycs" element={<KYCs />} />
              <Route path="manage-pending-kycs" element={<PendingKYCs />} />
            </Route>
          </Route>
          {/* Public routes */}
          <Route element={isAuth ? <Navigate to={permessions.isView ? "/dashboard" : "/home"} replace /> : <AuthContainer />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="email-sent" element={<EmailSent />} />
            <Route path="forget-password" element={<ForgetPassword />} />
          </Route>
          {/*Private and Public routes */}
          <Route path="learn-more" element={<LearnMore />} />
          <Route path="terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="subscriptions" element={<Subscriptions />} />
          <Route path="/" element={<Landing />} />
          <Route path="*" element={<Navigate to={"/"} />} />
          <Route path="verify" element={<Verify />} />
          {/* change password */}
          <Route element={<AuthContainer />}>
            <Route path="change-password" element={<ChangePassword />} />
          </Route>
          {/* <Route path="/not-found" element={<NotFound />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

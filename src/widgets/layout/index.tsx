import React, { useEffect } from "react"
import { Footer } from "./Footer"
import { Header } from "./Header"
import { Outlet, matchPath, useLocation } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { SideBar } from "./side-bar"
import { useAppDispatch, useAppSelector } from "../../core/redux/hooks"
import { RefreshAuthAsync } from "../../core/redux"
import { Spinner } from "../../components/spinner"
import eventManager, { EVENT_UNAUTHORIZED } from "../../utils/api/event-manager"

export const Layout: React.FC = () => {
  const {
    i18n: { language: lang },
  } = useTranslation()
  const { pathname } = useLocation()
  const land =
    matchPath("/login", pathname) ||
    matchPath("/register", pathname) ||
    matchPath("/email-sent", pathname) ||
    matchPath("/forget-password", pathname) ||
    matchPath("/home", pathname)
  const dashboard = pathname.includes("dashboard")

  const dispatch = useAppDispatch()
  const { status, user } = useAppSelector((state) => state.Auth)

  useEffect(() => {
    // dispatch(CheckAuthAsync())
    dispatch(RefreshAuthAsync())

    eventManager.on(EVENT_UNAUTHORIZED, () => {
      dispatch(RefreshAuthAsync())
      eventManager.removeAllListeners()
    })
    return () => {
      eventManager.removeAllListeners()
    }
  }, [dispatch])

  if (status === "loading") {
    return (
      <div className="mt-5">
        <Spinner />
      </div>
    )
  } else
    return (
      <>
        <main lang={lang} dir={lang === "en" ? "ltr" : "rtl"} id="main" className={land ? "main-bg" : ""}>
          {/* <div className="bg-ellipse top" />
        <div className="bg-ellipse bottom" /> */}
          <Header />
          <div className="content" data-testid="dashboard">
            {dashboard && <SideBar />}
            <div className={dashboard ? "dashboard-container" : "site-container"}>
              <Outlet />
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
}

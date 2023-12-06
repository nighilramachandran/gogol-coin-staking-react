import React from "react"
import { Row, Col } from "react-bootstrap"
import { useMatch, useNavigate, useResolvedPath } from "react-router-dom"
import { CustomSpace } from "../../components/custom-space"
import { CustomText } from "../../components/custom-text"
import { Icon } from "../../components/icon"
import { useAppSelector } from "../../core/redux/hooks"
import { useBreakpoints } from "../../utils/hooks"

import "./index.scss"

export const SideBar: React.FC = () => {
  const { lg } = useBreakpoints()
  const { permessions } = useAppSelector((state) => state.Auth)
  //menu item component
  const MenuItem = ({ title, icon, to, ...props }: { title: string; icon: string; to: string }) => {
    const navigate = useNavigate()
    let resolved = useResolvedPath(to)
    let match = useMatch({ path: resolved.pathname, end: true })

    return (
      <div className={`menu-item ${match ? "active" : ""}`} onClick={() => navigate(to)} {...props}>
        <div className="d-flex align-items-center" style={{ gap: "20px" }}>
          <Icon style={{ width: "26px", height: "26px", color: "white" }} src={`/assets/icons/${icon}.svg`} />
          {lg && (
            <>
              <CustomText data-testid="title-Sidebar" fw="medium" fs={4} color={"white"}>
                {title}
              </CustomText>
              <span className="active-anchor" />
            </>
          )}
        </div>
      </div>
    )
  }

  const tabs = [
    "Dashboard",
    "Golc-Dashboard",
    "Merge Accounts",
    "Users",
    "Deleted-Users",
    "Balances",
    "Golc-Balances",
    "Transaction",
    "Golc-Transaction",
    "Add Staking",
    "Claim Requests",
    "Manage Claims",
    "Manage KYCs",
    "Manage Pending KYCs",
  ]

  return (
    <div id="side-bar">
      <Row className="justify-content-center g-2">
        <Col xs={12}>
          <CustomSpace data-testid="Dashboard-SideBar" direction="vertical" size={8} style={{ width: "100%" }}>
            {tabs.map((el) => {
              if (
                (el === "Add Staking" && !permessions.isStaking) ||
                (el === "Claim Requests" && !permessions.isAdmin) ||
                (el === "Merge Accounts" && !permessions.isAdmin)
              ) {
                return <></>
              }
              return (
                <MenuItem
                  key={el}
                  to={el === "Dashboard" ? `/dashboard` : `/dashboard/${el.toLowerCase().replace(/\s/g, "-")}`}
                  title={el}
                  icon={el}
                  data-testid={`$tab-${el}`}
                />
              )
            })}
          </CustomSpace>
        </Col>
      </Row>
    </div>
  )
}

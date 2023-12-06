import React from "react"
import { useBreakpoints } from "../../utils/hooks"
import { Container, Nav, Navbar } from "react-bootstrap"
import Hamburger from "hamburger-react"
import { useAppDispatch, useAppSelector } from "../../core/redux/hooks"
import { CustomButton } from "../../components/custom-button"
import { LogoutAsync } from "../../core/redux"
import { useLocation } from "react-router-dom"
import { CustomText } from "../../components/custom-text"

export const Header: React.FC = () => {
  const { isAuth, user } = useAppSelector((state) => state.Auth)
  const dispatch = useAppDispatch()
  const { md, lg, xl } = useBreakpoints()
  const { pathname } = useLocation()
  const dashboard = pathname.includes("dashboard")

  const links = [
    { name: "GolCoin", link: "https://gogolcoin.io", target: "_blank", "data-testid": "golcoin" },
    { name: "|" },
    { name: "Home", link: "/home", "data-testid": "Home" },
    { name: "|" },
    { name: "Objective", link: "https://gogolcoin.io/#objective", target: "_blank", "data-testid": "objective" },
    { name: "|" },
    { name: "Road Map", link: "https://gogolcoin.io/#roadmap", target: "_blank", "data-testid": "road map" },
    { name: "|" },
    { name: "Contact Us", link: "", target: "_blank", "data-testid": "contact us" },
    // { name: "|" },
    // { name: "Home", link: "/home" },
  ]

  return (
    <Navbar expand="lg" className="nav-bar" data-testid="navbar">
      <Container fluid={dashboard} className={dashboard ? "px-4" : ""} dir="ltr">
        <Navbar.Brand data-testid="img-navbar" href="/" dir="ltr" className="d-flex align-items-center">
          <img data-testid="img-navbar" src="/assets/icons/GolCoin.svg" alt="GogolCoin" style={{ margin: "0 10px 5px 0" }} />

          {md && <img data-testid="img2-navbar" src="/assets/icons/GolCoinStakingText.svg" alt="GolCoinStakingText" />}
          {/* {md && (
            <CustomText en color="white" fw="medium" className="t-36">
              Staking
            </CustomText>
          )} */}
        </Navbar.Brand>
        <Navbar.Toggle as={"span"}>
          <div className="d-flex g-2 align-items-center">
            {isAuth && !lg && (
              <Nav.Link href="/profile">
                <div className="avatar">{user?.first_name.charAt(0)}</div>
              </Nav.Link>
            )}
            <Hamburger color="white" size={25} />
          </div>
        </Navbar.Toggle>

        <Navbar.Collapse dir="ltr">
          <Nav className={`ml-auto `} dir="ltr" style={{ alignItems: "center" }}>
            {links.map(({ name, link, target, ...props }, ind) => {
              if (ind % 2 === 0) {
                return (
                  <Nav.Link
                    data-testid={props["data-testid"]}
                    key={ind}
                    href={link!}
                    target={target}
                    style={{ padding: xl ? "1rem 1.1rem" : "1rem" }}
                  >
                    {name}
                  </Nav.Link>
                )
              } else if (lg) {
                return (
                  <Nav.Link data-testid="title-nav-link2" key={ind} style={{ padding: xl ? "1rem 1rem" : "1rem" }}>
                    {name}
                  </Nav.Link>
                )
              } else <></>
            })}
            {isAuth ? (
              <CustomButton
                data-testid="btn-header-logout"
                bg="outline"
                onClick={() => {
                  dispatch(LogoutAsync())
                  // window.location.reload()
                }}
              >
                Logout
              </CustomButton>
            ) : (
              <CustomButton
                data-testid="btn-header-my-account"
                className="d-flex justify-align-content-center align-items-center"
                bg="outline"
                href="/login"
              >
                My Account
              </CustomButton>
            )}
            {isAuth && lg && (
              <Nav.Link href="/profile">
                <div className="avatar">{user?.first_name.charAt(0)}</div>
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

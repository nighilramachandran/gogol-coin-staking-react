import React, { useEffect, useState } from "react"
import { Container, Col, Row, Stack } from "react-bootstrap"
import { CustomText } from "../../components/custom-text"
import { CustomButton } from "../../components/custom-button"
import { useAppSelector } from "../../core/redux/hooks"
import { useBreakpoints } from "../../utils/hooks"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

import "./index.scss"
import { visualizeNumber } from "../../utils/helpers/visualize-number"

const defaultOptions = {
  loop: false,
  autoplay: false,
}

const getDropReward = (value: any) => {
  let drop = 0
  if (value >= 10000) drop = 1000
  if (value >= 25000) drop = 3500
  if (value >= 50000) drop = 7500
  if (value >= 100000) drop = 15000
  if (value >= 150000) drop = 35000
  if (value >= 200000) drop = 50000
  if (value >= 250000) drop = 70000
  drop = 0
  return drop
}

export const Landing: React.FC = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { lg } = useBreakpoints()

  const [amount, setAmount] = useState<string>("250,000")
  const [dropReward, setDropReward] = useState<string>("70,000")
  const [totalReward, setTotalReward] = useState<string>("375,000")
  const [isAnimationStopped, setisAnimationStopped] = useState<boolean>(true)
  const { isAdmin, permessions } = useAppSelector((state) => state.Auth)

  const calculateReward = (e: any) => {
    let visualValue = visualizeNumber(e.target.value)
    setAmount(visualValue)

    let actualValue = parseInt(visualValue.replaceAll(",", ""))
    let drop = getDropReward(actualValue)

    setDropReward(drop.toString())
    actualValue += drop

    let total = Math.floor(actualValue * 1.5) + drop
    if (!total) total = 0
    setTotalReward(visualizeNumber(total.toString()))
  }

  //lazy load animations
  const [Column, setColumn] = useState<any>()
  const [Platform, setPlatform] = useState<any>()
  useEffect(() => {
    import("../../animation/Column.json").then(setColumn)
    import("../../animation/Platform.json").then(setPlatform)
  }, [])

  return (
    <>
      <div className="landing-content">
        <Container>
          <Row className="justify-content-center align-items-center" data-testid="row-landing-content">
            <Col lg={6} md={12}>
              <div className="w-100 landing-text">
                <div>
                  <div className="d-flex align-items-center gap-2">
                    <div className="line"></div>
                    <CustomText data-testid="title-GolStaking" en color="white" className="t-25" fs={3} tag="a" href="/learn-more">
                      {t("GolStaking")}
                    </CustomText>
                  </div>
                  <CustomText en color="white" tag={"h1"} fw="bold" fs={1} className="t-32">
                    {t("Start Earning")}
                  </CustomText>
                  <CustomText en color="white" tag={"h1"} fw="bold" fs={1} className="t-32">
                    {t("From Your")}
                    <CustomText en color="gold" fs={1}>
                      {t("GolCoin")}
                    </CustomText>
                  </CustomText>
                </div>
                <div>
                  <CustomText data-testid="Earn-up-to-220%" en color="white" fw="normal" fs={3} className="t-25">
                    {t("Earn up to")}&nbsp;
                    <CustomText en color="gold" fw="bold">
                      220%
                    </CustomText>
                    {t("interest on GolCoin you buy, hold or transfer")}.
                  </CustomText>
                </div>
                <div className="desc-div">
                  <CustomText en color="light-grey" tag="p" fw="small" fs={4} className="t-25" style={{ maxWidth: "500px" }}>
                    {t("GolCoin Staking is a simple Platform that helps you to invest and earn interest on your GolCoin assets.")}
                    <CustomText en color="light-grey" tag="p" fw="small" fs={4}>
                      Your annual interest is paid daily and tracked to the second.
                    </CustomText>
                  </CustomText>
                </div>
                <div className="learn-div">
                  <div className="d-flex align-items-center">
                    <CustomText data-testid="btn-Learn-More" en color="gold" className="t-25" fw="medium" fs={2} tag="a" href="/learn-more">
                      {t("Learn More >")}
                    </CustomText>
                  </div>
                </div>
                <div className="desc-div">
                  <CustomButton
                    data-testid="btn-landing-Claim-reward"
                    icon={false}
                    noRound
                    onClick={() => {
                      setisAnimationStopped(false)
                      navigate("/login")
                    }}
                    className="px-5 py-2"
                  >
                    {permessions.isView ? "Go To Dashboard" : "Collect Your Rewards"}
                  </CustomButton>
                </div>
              </div>
            </Col>
            <Col md={12} lg={{ offset: 1, span: 5 }} className="d-none d-lg-block col">
              <img data-testid="img-landing-home" src="/assets/images/golco.svg" alt="" style={{ width: "100%", height: "100%" }} />
            </Col>
          </Row>

          <Row className="g-2 mt-5" data-testid="row-landing-calc">
            <Col className="text-center" xs={12} lg={4}>
              <CustomText data-testid="amount-clac-landing-home" fs={3} fw="bolder" color="gold">
                {t("Amount")}
                <CustomText color="gray"> (GOGOL)</CustomText>
              </CustomText>{" "}
              <CustomText data-testid="input " color="gray">
                <input
                  data-testid="input-landing-content"
                  className="amount-input t-26 "
                  value={amount}
                  type="text"
                  placeholder="Enter Amount"
                  autoFocus
                  onInput={calculateReward}
                />{" "}
              </CustomText>{" "}
              <CustomText data-testid="coin-type-landing" en fw="bold" fs={5} className="t-26" color="gold">
                (GOGOL)
              </CustomText>
            </Col>
            <Col className="text-center" xs={12} lg={4}>
              <CustomText data-testid="staking-term-landing" en fw="bold" fs={3} className="t-26" color="gold">
                {t("Staking Term")}{" "}
                <CustomText data-testid="year-landing" en color="white" fs={3} fw="small" className="t-4">
                  1 {t("Year")}
                </CustomText>
              </CustomText>
            </Col>
            <Col className="text-center" xs={12} lg={4}>
              <CustomText data-testid="total-reward" en fw="bold" fs={3} className="t-26" color="gold">
                {t("Total Reward")}{" "}
                <CustomText data-testid="amount-total-reward" en color="white" fw="small" fs={3} className="t-26">
                  {totalReward}{" "}
                </CustomText>
                <CustomText data-testid="coin-type-landing2" en fw="bold" fs={5} className="t-26" color="gold">
                  (GOGOL)
                </CustomText>
              </CustomText>
            </Col>
          </Row>
        </Container>
      </div>

      {/* <div className="landing-footer">
        <Container fluid></Container>
      </div> */}
    </>
  )
}

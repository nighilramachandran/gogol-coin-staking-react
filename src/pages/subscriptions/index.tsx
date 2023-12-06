import React from "react"
import { Row, Col, Container, Button } from "react-bootstrap"
import { CustomSpace } from "../../components/custom-space"
import { CustomText } from "../../components/custom-text"

// import { SubscriptionCard } from "../../widgets/subscription-card"

import "./index.scss"

export const Subscriptions: React.FC = () => {
  const subscribtionData = [
    { image: "golcoin", name: "GolCoin", apr: "OPEN", MinimumStake: "0.01 GOLC", CurrentStake: "0 GOLC" },
    { image: "gogolcoin", name: "GogolCoin", apr: "OP1 yearEN", MinimumStake: "25 GOL", CurrentStake: "0 GOLC", LockupPeriod: "365 Days" },
  ]

  return (
    <Container>
      <div className="subscribtion-container">
        <Row className="justify-content-center">
          {subscribtionData.map((el, index) => (
            <Col className="d-flex justify-content-center" lg={4}>
              <div className={`subscribtion-card subscribtion-card-${index}`}>
                <img src={`/assets/images/${el.image}-subscribtion.svg`} alt="" />
                <div className="d-flex flex-column align-items-center justify-content-around h-100">
                  <CustomSpace direction="vertical">
                    <CustomText fs={5} color="gray">
                      Pool Name
                    </CustomText>
                    <CustomText fs={3} color="dark">
                      {el.name}
                    </CustomText>
                  </CustomSpace>
                  <CustomSpace direction="vertical">
                    <CustomText fs={5} color="gray">
                      APR
                    </CustomText>
                    <CustomText fs={3} color="dark">
                      {el.apr}
                    </CustomText>
                  </CustomSpace>
                  {el.LockupPeriod && (
                    <CustomSpace direction="vertical">
                      <CustomText fs={5} color="gray">
                        Lock-up Period
                      </CustomText>
                      <CustomText fs={3} color="dark">
                        {el.LockupPeriod}
                      </CustomText>
                    </CustomSpace>
                  )}
                  <CustomSpace direction="vertical">
                    <CustomText fs={5} color="gray">
                      Minimum Stake
                    </CustomText>
                    <CustomText fs={3} color="dark">
                      {el.MinimumStake}
                    </CustomText>
                  </CustomSpace>
                  <CustomSpace direction="vertical">
                    <CustomText fs={5} color="gray">
                      Current Stake
                    </CustomText>
                    <CustomText fs={3} color="dark">
                      {el.CurrentStake}
                    </CustomText>
                  </CustomSpace>
                </div>
                <Button className="stakenow-btn">Stake now</Button>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </Container>
    // <Container style={{ paddingTop: "150px" }}>
    //   <Row data-testid="Row-subscrip" className="justify-content-center">
    //     <Col data-testid="silver-subscrip" lg={4} sm={12} className="cardS">
    //       <SubscriptionCard type="silver" />
    //     </Col>
    //     <Col data-testid="gold-subscrip" lg={4} sm={12} className="edge-card-two">
    //       <SubscriptionCard type="gold" />
    //     </Col>
    //     <Col data-testid="bronze-subscrip" lg={4} sm={12} className="cardB">
    //       <SubscriptionCard type="bronze" />
    //     </Col>
    //   </Row>
    // </Container>
  )
}

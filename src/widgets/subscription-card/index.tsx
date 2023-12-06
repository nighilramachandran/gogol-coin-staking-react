import React from "react"
import { Stack } from "react-bootstrap"
import { CustomButton } from "../../components/custom-button"
import { CustomCard } from "../../components/custom-card"
import { CustomText } from "../../components/custom-text"

type SubscriptionType = "bronze" | "gold" | "silver"

export interface SubscriptionCardProps {
  type: SubscriptionType
}

interface Subscription {
  image: string
  name: string
  apr: string
  lookupPeriod: string
  minimumStack: string
  currentStack: string
}

const subscriptionsData: Record<SubscriptionType, Subscription> = {
  silver: {
    image: "/assets/images/gogolsilver.png",
    name: "GolCoin Silver",
    apr: "6 Months",
    lookupPeriod: "180 Days",
    minimumStack: "1000 GOL",
    currentStack: "0 GOL",
  },
  gold: {
    image: "/assets/images/gogolgold.png",
    name: "GogolCoin Gold",
    apr: "1 Year",
    lookupPeriod: "365 Days",
    minimumStack: "1000 GOL",
    currentStack: "0 GOL",
  },

  bronze: {
    image: "/assets/images/gogolbronze.png",
    name: "GolCoin Bronze",
    apr: "3 Months",
    lookupPeriod: "90 Days",
    minimumStack: "1000 GOL",
    currentStack: "0 GOL",
  },
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ type }) => {
  const { apr, currentStack, image, lookupPeriod, minimumStack, name } = subscriptionsData[type]

  return (
    <CustomCard data-testid="Card-subscrip">
      <Stack gap={2} direction="vertical" className="align-items-center pt-5">
        <img
          data-testid="Img-subscrip"
          src={image}
          style={{ position: "absolute", margin: "-170px" }}
          width={172}
          height={172}
          alt={name}
        />

        {/* <Col xs={12}>
          <Row className="justify-content-center" style={{ paddingTop: "80px" }}>
            <Col xs={8} style={{ background: "red" }}>
              <div className="divider-horizental rounded" />
            </Col>
          </Row>
        </Col> */}

        <CustomText color="gray" fs={2}>
          {"Pool Name"}
        </CustomText>
        <CustomText color="dark" fs={2}>
          {name}
        </CustomText>

        <CustomText color="gray" fs={2}>
          {"APR"}
        </CustomText>
        <CustomText color="dark" fs={2}>
          {apr}
        </CustomText>

        <CustomText color="gray" fs={2}>
          {"Lock-up Period"}
        </CustomText>
        <CustomText color="dark" fs={2}>
          {lookupPeriod}
        </CustomText>

        <CustomText color="gray" fs={2}>
          {"Minimum Stake"}
        </CustomText>
        <CustomText color="dark" fs={2}>
          {minimumStack}
        </CustomText>

        <CustomText color="gray" fs={2}>
          {"Current Stake"}
        </CustomText>
        <CustomText color="dark" fs={2}>
          {currentStack}
        </CustomText>
        <CustomButton style={{ width: "200px", height: "60px", position: "absolute", margin: "447px" }} bg="primary">
          Start your stake
        </CustomButton>
      </Stack>
    </CustomCard>
  )
}

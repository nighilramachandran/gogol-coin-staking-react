import React from "react"
import { CustomText } from "../../../components/custom-text"
import { Icon } from "../../../components/icon"

export const Stats: React.FC<{ title?: string; up?: boolean; value?: number | string; percentage?: number | string }> = ({
  title,
  up,
  value,
  percentage,
}) => {
  const dt = title?.toLocaleLowerCase().replace(/\s+/g, "_")

  return (
    <div data-testid="stats" className="stats">
      <CustomText data-testid="title-state" fs={4} color="light-grey">
        {title}
      </CustomText>
      <CustomText data-testid="value-state" data_test={dt + "-value"} color="white" fs={2} fw="bold">
        {value}
      </CustomText>
      {up ? (
        <CustomText data-testid="percentage-state" data_test={dt + "-percent"} className="green" fs={5}>
          <Icon name="caret-up-sharp" /> {percentage ?? 0}%
        </CustomText>
      ) : (
        <CustomText data-testid="percentage-state" data_test={dt + "-percent"} className="red" fs={5}>
          <Icon name="caret-down-sharp" /> {percentage ?? 0}%
        </CustomText>
      )}
      <CustomText color="gray" fs={5}>
        {/* Since last month */}
      </CustomText>
    </div>
  )
}

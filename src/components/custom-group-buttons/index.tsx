import React, { useEffect, useState } from "react"
import { ButtonGroup, ToggleButton } from "react-bootstrap"
import { NumberLiteralType } from "typescript"
import "../index.scss"

interface CustomGroupButtonsProps {
  radios: { name: string; value: any }[]
  currentValue?: any
  onChange?: (value: any) => void
}

export const CustomGroupButtons: React.FC<CustomGroupButtonsProps> = ({ radios, onChange, currentValue }) => {
  const [radioValue, setRadioValue] = useState<any>(currentValue ?? radios[0].value ?? "")
  useEffect(() => {
    if (currentValue) setRadioValue(currentValue)
  }, [currentValue])

  const handleChageButton = (value: any) => {
    if (!currentValue) setRadioValue(value)
    onChange && onChange(value)
  }
  return (
    <ButtonGroup data-testid="custom-group-buttons" className="outline-group-buttons">
      {radios.map((radio, idx) => (
        <ToggleButton
          data-testid={`$btn-${radio.name}`}
          key={idx}
          id={`radio-${idx}`}
          type="radio"
          variant="outline-primary"
          name="radio"
          value={radio.value}
          checked={radioValue == radio.value}
          onChange={(e) => handleChageButton(e.currentTarget.value)}
        >
          {radio.name}
        </ToggleButton>
      ))}
    </ButtonGroup>
  )
}

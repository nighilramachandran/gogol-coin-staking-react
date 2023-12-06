import React from "react"
import { NumberLiteralType } from "typescript"
import "../index.scss"

export interface CustomCardProps {
  children?: React.ReactNode
  header?: React.ReactNode
  padding?: NumberLiteralType
  bottomRadiusOnly?: boolean
  dashboard?: boolean
}

export const CustomCard: React.FC<CustomCardProps | any> = ({ children, header, padding, bottomRadiusOnly, dashboard, ...rest }) => {
  return (
    <div
      data-testid="custom-Card"
      // data-testid={`$card-${header}`}
      className={`c-card ${bottomRadiusOnly ? "pool" : ""} ${dashboard ? "dashboard" : ""}`}
      style={{ padding: padding, ...(rest as any).style }}
      {...rest}
    >
      {header}
      {children}
    </div>
  )
}

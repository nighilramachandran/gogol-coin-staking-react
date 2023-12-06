import React, { useMemo, CSSProperties } from "react"
import { Button, ButtonProps } from "react-bootstrap"
import { dangercolor, greencolor, primarycolor, secondarycolor, text1color } from "../../utils/constants/valiables"
import { Icon } from "../icon"
import { useTranslation } from "react-i18next"
interface props extends ButtonProps {
  bg?: "primary" | "secondary" | "gray" | "outline" | "danger" | "orange" | "green"
  icon?: boolean
  noRound?: boolean
}

export const CustomButton: React.FC<props> = ({ children, bg = "primary", noRound, icon = false, style, ...rest }) => {
  const {
    i18n: { language },
  } = useTranslation()
  const styles: CSSProperties = useMemo(() => {
    switch (bg) {
      case "secondary":
        return { background: secondarycolor }
      case "gray":
        return { background: text1color + "1a" }
      case "danger":
        return { background: dangercolor, borderColor: dangercolor }
      case "green":
        return { background: greencolor, color: "black", borderRadius: "0px", fontWeight: "bold", fontSize: "20px" }
      case "outline":
        return {
          // padding: "10px 12px",
          // minWidth: "150px",
          // maxHeight: "36px",
          color: "#fff",
          borderColor: primarycolor,
          borderRadius: "68px",
          border: "2px solid #FF6600",
        }

      default:
        return { background: primarycolor, borderRadius: noRound ? "0px" : "40px" }
    }
  }, [bg, noRound])

  const allStyle = { padding: "6px 18px", borderRadius: noRound ? "0px" : "40px", color: "#fff", ...styles, ...style }

  return (
    <Button variant={bg} style={allStyle} {...rest}>
      {children}
      {icon && <Icon class="icon t-5" size="large" src={`/assets/icons/arrow-${language === "en" ? "right" : "left"}.svg`}></Icon>}
    </Button>
  )
}

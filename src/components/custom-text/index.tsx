import React, { useMemo } from "react"
import { OverlayTrigger, Placeholder, Tooltip } from "react-bootstrap"
import { RequestStatus } from "../../utils/constants"
import { SplitNumber } from "../../utils/helpers/split-number"

type tags = "h1" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span" | "p" | "a"

interface props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  fw?: "light" | "normal" | "bold" | "bolder" | "regular" | "medium" | "small"
  fs?: 1 | 2 | 3 | 4 | 5 | 6 | 7
  color?: "gold" | "gray" | "error" | "white" | "light-grey" | "primary" | "success" | "danger" | "dark" | "light-yellow" | "active"
  disable?: boolean
  style?: React.CSSProperties
  href?: string
  tag?: tags
  en?: boolean
  data_test?: string
  status?: RequestStatus
  type?: "number" | "text"
  copyable?: boolean | string
}

export const CustomText: React.FC<props> = ({
  children,
  fw = "normal",
  fs = -1,
  color = "inherit",
  style,
  disable,
  href,
  tag = "span",
  en = "en",
  data_test,
  status = "data",
  type = "text",
  copyable,
  ...rest
}) => {
  // 6pt, 8pt, 12pt, 24pt, 36pt, 48pt, 60pt, 72pt
  var fontSize = useMemo(() => {
    switch (fs) {
      case 1:
        return "59px"
      case 2:
        return "24px"
      case 3:
        return "18px"
      case 4:
        return "16px"
      case 5:
        return "12px"
      case 6:
        return "10px"
      case 7:
        return "8x"
      default:
        return ""
    }
  }, [fs])

  var fontWeight: any = useMemo(() => {
    switch (fw) {
      case "small":
        return 400
      case "regular":
        return 500
      case "medium":
        return 600
      case "bold":
        return 700
      case "bolder":
        return "bolder"
      case "light":
        return "light"
      default:
        return "inherit"
    }
  }, [fw])

  var fontColor: string = useMemo(() => {
    switch (color) {
      case "gold":
        return "#FF6600"
      case "gray":
        return "#8D8F92"
      case "error":
        return "#E1546E"
      case "white":
        return "#fff"
      case "light-grey":
        return "#CCCCCC"
      case "dark":
        return "#060226"
      case "success":
        return "#00FF38"
      case "danger":
        return "#FF0000"
      case "light-yellow":
        return "#FBD654"
      case "active":
        return "#33C500"
      default:
        return "inherit"
    }
  }, [color])

  const default_style: React.CSSProperties = useMemo(
    () => ({
      fontSize,
      fontWeight,
      opacity: 1,
      color: fontColor,
      textDecoration: "none",
      fontFamily: en ? "MyriadPro" : "HSIshraq",
      direction: en ? "ltr" : "rtl",
      cursor: disable ? "not-allowed" : href || rest.onClick || copyable ? "pointer" : "unset",
    }),
    [fontSize, fontWeight, fontColor, en, disable, href]
  )

  const porps = {
    style: { ...default_style, ...style },
    href,
    "data-test": data_test,
    ...rest,
  }

  tag = href ? "a" : tag

  let children0 = null
  let children1 = null

  let chil = null
  if (type === "number") {
    if (Array.isArray(children)) chil = children[0]
    if (typeof children === "string") chil = children
    if (typeof chil === "string") {
      children0 = SplitNumber(chil)[0]
      children1 = SplitNumber(chil)[1]
    }
  }

  if (status !== "data") {
    return (
      <Placeholder as={CustomText} animation="glow" className="w-100 d-grid">
        <Placeholder className="rounded" />
      </Placeholder>
    )
  } else if (copyable) {
    return (
      <OverlayTrigger placement="top" delay={{ show: 100, hide: 100 }} overlay={(props) => renderTooltip(props, copyable)}>
        {React.createElement(
          `${tag}`,
          porps,
          children0 ? (
            <>
              {children0}.<small>{children1 ?? "00"}</small>
            </>
          ) : (
            children
          )
        )}
      </OverlayTrigger>
    )
  } else
    return React.createElement(
      `${tag}`,
      porps,
      children0 ? (
        <>
          {children0}.<small>{children1 ?? "00"}</small>
        </>
      ) : (
        children
      )
    )
}

const renderTooltip = (props: any, copyable: string | boolean) => (
  <Tooltip id="button-tooltip" {...props}>
    {/* Press to copy */}
    {typeof copyable === "string" ? copyable : "Press to copy "}
  </Tooltip>
)

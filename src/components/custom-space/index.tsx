import classNames from "classnames"
import { FC, useMemo } from "react"

interface props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  direction?: "horizontal" | "vertical"
  size?: number //row, col
  fill?: boolean
  justify?: "center" | "start" | "end" | "between"
  align?: "center" | "start" | "end" | "between"
}

export const CustomSpace: FC<props> = ({
  children,
  size = 10,
  direction = "horizontal",
  justify = "center",
  align = "center",
  fill = false,
  style,
  ...rest
}) => {
  let directionClassName = useMemo(() => {
    switch (direction) {
      case "horizontal":
        return `d-flex align-items-${align} justify-content-${justify}`
      case "vertical":
        return `d-flex flex-column align-items-${align}`
      default:
        return `d-flex flex-column align-items-${align}`
    }
  }, [direction, justify, align])

  return (
    <div
      className={classNames(directionClassName, rest.className)}
      style={{ width: fill ? "100%" : "fit-content", gap: `${size}px`, ...style }}
      {...rest}
    >
      {children}
    </div>
  )
}

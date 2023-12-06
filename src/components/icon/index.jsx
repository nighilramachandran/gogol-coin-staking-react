import "./index.scss"

/**
 *
 * @param {*} param0
 * @returns
 */
export const Icon = ({ size = "default", color = "white", ...rest }) => {
  return <ion-icon class={`md hydrated ${size} ${color} ${rest.onClick && "cursor-pointer"} ${rest.className}`} {...rest} />
}

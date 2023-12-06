import { useMediaQuery } from "usehooks-ts"

interface ReturnType {
  xs: boolean
  sm: boolean
  md: boolean
  lg: boolean
  xl: boolean
}

export const useBreakpoints = (): ReturnType => {
  const xs = useMediaQuery("(min-width: 0px)")
  const sm = useMediaQuery("(min-width: 576px)")
  const md = useMediaQuery("(min-width: 768px)")
  const lg = useMediaQuery("(min-width: 992px)")
  const xl = useMediaQuery("(min-width: 1200px)")

  return { xs, sm, md, lg, xl }
}

export default useBreakpoints

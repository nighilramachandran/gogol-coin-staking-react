import React, { useEffect, useState } from "react"
import { Row, Col } from "react-bootstrap"
// import Lottie from "react-lottie"

export const NotFound: React.FC = () => {
  const [defaultOptions, setdefaultOptions] = useState<any>({
    loop: true,
    autoplay: true,
    animationData: null,
  })
  useEffect(() => {
    import("../../animation/not-found.json").then((animationData) => {
      setdefaultOptions({ ...defaultOptions, animationData })
    })
  }, [])

  return (
    <Row>{/* <Col>{!defaultOptions.animationData ? null : <Lottie options={defaultOptions} width={"100%"} height="70vh" />}</Col> */}</Row>
  )
}

import moment from "moment"
import React, { useMemo } from "react"
import { Row, Col, Placeholder } from "react-bootstrap"
import { Profit } from "../../core/models"
import { useAppSelector } from "../../core/redux/hooks"
import { toFix } from "../../utils/helpers/ot-fix"
import { CustomText } from "../custom-text"
import { Icon } from "../icon"

import "./index.scss"

interface props {
  current_stake: number
  profits: Profit[]
}

// const newdata = {
//   first_three_months: false,
//   start_date: "2022-06-14",
//   withdrawable: true,
//   last_drawn_date: "2022-09-14",
//   current_draw_date: "2022-09-14",
//   current_draw_amount: 10400,
//   current_draw_done: true,
//   next_draw_date: "2022-10-14",
//   next_draw_amount: 9984,
//   remaining_amount: 249600,
//   claimable_months_count: 1,
// }

export const Timeline: React.FC<props> = ({ profits }) => {
  const now = moment.now()
  const { status } = useAppSelector((state) => state.Profit)

  // let dates_arr = dateRange(time_line_data?.start_date, time_line_data?.next_draw_date)
  // const points = useMemo(() => {
  //   let points = dates_arr?.map((prof, ind) => {
  //     let last_point = ind === dates_arr.length - 1
  //     let before_last_point = ind === dates_arr.length - 2
  //     //
  //     let claim_status = last_point
  //       ? "You Can’t Claim"
  //       : before_last_point
  //       ? time_line_data?.withdrawable
  //         ? "You Can Claim"
  //         : "You Can’t Claim"
  //       : undefined
  //     let date = moment(prof, "YYYY-MM-DD")
  //     let prev_date = moment(dates_arr[ind - 1], "YYYY-MM-DD")
  //     let month = moment(date).format("MMM DD, YYYY")
  //     let class_on_status = moment(now).isAfter(date) ? "passed-l" : moment(now).isSame(date) ? "active-l" : "not-started"
  //     let draw_amount = last_point
  //       ? toFix(time_line_data?.next_draw_amount) ?? 0
  //       : before_last_point
  //       ? toFix(time_line_data?.current_draw_amount) ?? 0
  //       : undefined
  //     //calculate passed line width
  //     let diff_between_now_point = moment(now).diff(prev_date, "day")
  //     let days_between_two_points = ind && moment(date).diff(prev_date, "day")
  //     let days = diff_between_now_point >= days_between_two_points ? days_between_two_points : diff_between_now_point

  //     let width_depend_on_days = `${(days * 80) / days_between_two_points}%`

  //     return { claim_status, draw_amount, month, class_on_status, width_depend_on_days, date }
  //   })
  //   return points
  // }, [time_line_data])

  const points = useMemo(() => {
    let points = profits?.map((prof, ind) => {
      let claim_status = Boolean(prof.claim) ? "You Can Claim" : "You Can’t Claim"
      let date = moment(prof.date, "YYYY-MM-DD")
      let prev_date = moment(profits[ind - 1]?.date, "YYYY-MM-DD")
      let month = moment(date).format("MMM DD, YYYY")
      let class_on_status = moment(now).isAfter(date) ? "passed-l" : moment(now).isSame(date) ? "active-l" : "not-started"
      let profit_per_point = toFix(prof.amount) ?? 0
      //calculate passed line width
      let diff_between_now_point = moment(now).diff(prev_date, "day")
      let days_between_two_points = ind && moment(date).diff(prev_date, "day")
      let days = diff_between_now_point >= days_between_two_points ? days_between_two_points : diff_between_now_point

      let width_depend_on_days = `${(days * 80) / days_between_two_points}%`

      return { claim_status, profit_per_point, month, class_on_status, width_depend_on_days, date }
    })
    return points
  }, [profits])

  if (status !== "data") {
    return (
      <Col xs={12}>
        <Placeholder as={Row} animation="glow" className="justify-content-center">
          <Placeholder as={Col} xs={12} className="w-75 rounded" />
        </Placeholder>
      </Col>
    )
  } else
    return (
      <Row id="timeline" className="justify-content-center g-0">
        <Col xs={12}>
          <div className="container">
            <ul
              className="timeline"
              style={
                {
                  "--length": (points.length - 1) * 140 + (points.length - 1) * 10.5 + "px",
                } as any
              }
            >
              {points.map((point, ind) => (
                <li
                  key={ind}
                  className={`${ind === 0 ? "active-l" : point.class_on_status}`}
                  style={{ "--width": point.width_depend_on_days } as any}
                >
                  <p>{point.month}</p>
                  <span>
                    <CustomText type="number">{point.profit_per_point?.toLocaleString()}</CustomText> <br />
                    {point.claim_status}
                    <br />
                    {/* {point.can_claim ? `with ${25}% discount` : ``} */}
                  </span>
                  {point.class_on_status !== "not-started" &&
                    (ind === 0 ? (
                      <Icon src="/assets/icons/flag.svg" />
                    ) : (
                      <Icon style={{ color: "#C8C8C8" }} src="/assets/icons/check.svg" />
                    ))}
                </li>
              ))}
            </ul>
          </div>
        </Col>
      </Row>
    )
}

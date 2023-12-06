import moment from "moment"
import React, { useMemo } from "react"
import { Row, Col, Placeholder } from "react-bootstrap"
import { Timeline_Res } from "../../core/models"
import { useAppSelector } from "../../core/redux/hooks"
import { dateRange } from "../../utils/helpers/getMonthsBetweenTwoDates"
import { toFix } from "../../utils/helpers/ot-fix"
import { CustomText } from "../custom-text"
import { Icon } from "../icon"

import "../timeline/index.scss"

interface props {
  time_line_data?: Timeline_Res
}

// const time_line_data = {
//   first_three_months: false,
//   start_date: "2022-03-14",
//   withdrawable: true,
//   last_drawn_date: "2022-07-14",
//   current_draw_date: "2022-09-14",
//   current_draw_amount: 27619.0986239999983808957040309906005859375,
//   current_draw_done: false,
//   next_draw_date: "2022-10-14",
//   next_draw_amount: 8479.87605504000021028332412242889404296875,
//   remaining_amount: 211996.90137599999434314668178558349609375,
//   claimable_months_count: 3,
// }

export const TimelineNew: React.FC<props> = ({ time_line_data }) => {
  const now = moment.now()
  const { status } = useAppSelector((state) => state.Profit)

  let dates_arr = dateRange(
    time_line_data?.first_three_months ? time_line_data?.start_date : time_line_data?.last_drawn_date,
    time_line_data?.next_draw_date
  )
  const points = useMemo(() => {
    let points = dates_arr?.map((prof, ind) => {
      let last_point = ind === dates_arr.length - 1
      let before_last_point = ind === dates_arr.length - 2
      //
      let claim_status = last_point
        ? "You Can Claim"
        : before_last_point && time_line_data?.current_draw_amount
        ? `You Can${time_line_data?.withdrawable ? "" : `'t`} Claim`
        : undefined
      let date = moment(prof, "YYYY-MM-DD")
      let prev_date = moment(dates_arr[ind - 1], "YYYY-MM-DD")
      let month = moment(date).format("MMM DD, YYYY")
      let class_on_status = moment(now).isAfter(date) ? "passed-l" : moment(now).isSame(date) ? "active-l" : "not-started"
      let draw_amount = last_point
        ? toFix(time_line_data?.next_draw_amount) ?? 0
        : before_last_point && time_line_data?.current_draw_amount
        ? toFix(time_line_data?.current_draw_amount) ?? 0
        : undefined
      //calculate passed line width
      let diff_between_now_point = moment(now).diff(prev_date, "day")
      let days_between_two_points = ind && moment(date).diff(prev_date, "day")
      let days = diff_between_now_point >= days_between_two_points ? days_between_two_points : diff_between_now_point

      let width_depend_on_days = `${(days * 80) / days_between_two_points}%`

      return { claim_status, draw_amount, month, class_on_status, width_depend_on_days, date }
    })
    return points
  }, [time_line_data])

  if (status !== "data") {
    return (
      <Col xs={12}>
        <Placeholder as={Row} animation="glow" className="justify-content-center my-4">
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
                  "--length": (dates_arr.length - 1) * 140 + (dates_arr.length - 1) * 10.5 + "px",
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
                    <CustomText type="number">{point.draw_amount?.toLocaleString()}</CustomText> <br />
                    {point.claim_status}
                    <br />
                  </span>
                  {point.class_on_status !== "not-started" &&
                    (ind === 0 ? <Icon src="/assets/icons/flag.svg" /> : <Icon src="/assets/icons/check.svg" />)}
                </li>
              ))}
            </ul>
          </div>
        </Col>
      </Row>
    )
}

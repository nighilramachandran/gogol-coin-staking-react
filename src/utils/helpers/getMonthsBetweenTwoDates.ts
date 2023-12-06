import moment from "moment"

export function dateRange(startDate: any, endDate: any): string[] {
  let start = moment(startDate)
  var end = moment(endDate)

  var timeValues: any[] = []

  if (moment(start).diff(end) === 0) end = moment(end).add(1, "month")

  while (end > start || start.format("M") === end.format("M")) {
    timeValues.push(start.format("YYYY-MM-DD"))

    start.add(1, "month")
  }
  return timeValues
}

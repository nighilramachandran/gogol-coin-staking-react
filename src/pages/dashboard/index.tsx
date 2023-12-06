import React, { useEffect, useMemo, useState } from "react"
import { Row, Col, Container } from "react-bootstrap"
import { CustomText } from "../../components/custom-text"
import { CustomCard } from "../../components/custom-card"
import { CustomTable } from "../../components/custom-table"
import { useAppDispatch, useAppSelector } from "../../core/redux/hooks"
import {
  FetchCountsAsync,
  FetchMonthlyAmountAsync,
  FetchRecentStakersAsync,
  FetchTopStakersAsync,
  FetchGolcCountsAsync,
  FetchGolcMonthlyAmountAsync,
  FetchGolcTopStakersAsync,
  FetchGolcRecentStakersAsync,
} from "../../core/redux"
import { CalcChangePercentage } from "../../utils/helpers/calc-change-percentage"
import { Stats } from "../../widgets/dashboard/stats"
import { Column } from "react-table"

import "./index.scss"

import {
  Chart,
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Filler,
  Legend,
  Tooltip,
  ChartConfiguration,
  ChartOptions,
} from "chart.js"
import moment from "moment"
import { useMatch } from "react-router-dom"
import { toFixedWithoutRound } from "../../utils/helpers/to-fixed-without-round"

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

Chart.register(
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Filler,
  Legend,
  Tooltip
)

var myChart1: Chart

const default_options: ChartOptions = {
  elements: {
    point: {
      radius: 1,
    },
  },

  scales: {
    y: {
      type: "logarithmic",
    },
    x: {
      title: {
        display: true,
      },
      grid: {
        display: false,
        drawBorder: false,
        borderColor: "#fff",
      },
      ticks: {
        display: true,
      },
    },
  },
  plugins: {
    legend: {
      labels: {
        usePointStyle: true,
        pointStyle: "circle",
        padding: 40,
        font: { size: 14 },
      },
    },
  },
  responsive: true,
  maintainAspectRatio: false,
}

export const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch()
  const match = useMatch("/dashboard/golc-dashboard")

  const { counts, monthly_amount, top_stakers, recent_stakers, recent_stakers_status, top_stakers_status } = useAppSelector(
    (state) => state.HomeDashboardSlice
  )

  const chartConfig: ChartConfiguration = useMemo(
    () => ({
      type: "line",
      data: {
        labels: monthly_amount ? [...monthly_amount?.balance.map((el: any) => months[el.Month - 1])] : [],
        datasets: [
          {
            label: "Users Count",
            data: monthly_amount ? monthly_amount?.balance.map((el: any) => el.count) : [],
            borderColor: "#FF4D2C",
            tension: 0.4,
            borderWidth: 3,
          },
          {
            label: "Staking Amount",
            data: monthly_amount ? monthly_amount?.balance.map((el: any) => el.Amount) : [],
            borderColor: "#CFD9DF",
            tension: 0.4,
            borderWidth: 3,
          },
        ],
      },
      options: default_options,
    }),
    [monthly_amount]
  )

  const current_staking_amount = useMemo(() => {
    let thismo_amo = counts.this_month_staking_amount
    let currmo_amo = counts.current_staking_amount
    let lsmo_amo = counts.last_month_staking_amount
    return (
      counts && {
        value: Number(currmo_amo.toFixed(3)).toLocaleString("en"),
        up: thismo_amo > lsmo_amo,
        percentage: CalcChangePercentage(lsmo_amo, thismo_amo),
      }
    )
  }, [counts])

  const current_staking_users = useMemo(() => {
    let thismo_usrs = counts.this_month_staking_users
    let currmo_usrs = counts.current_staking_users
    let lsmo_usrs = counts.last_month_staking_users
    return (
      counts && {
        value: Number(currmo_usrs.toFixed(3)).toLocaleString("en"),
        up: thismo_usrs > lsmo_usrs,
        percentage: CalcChangePercentage(lsmo_usrs, thismo_usrs),
      }
    )
  }, [counts])

  useEffect(() => {
    if (window && chartConfig) {
      var ctx1 = document.getElementById("myChart1") as HTMLCanvasElement
      myChart1 && myChart1.destroy()
      myChart1 = new Chart(ctx1, chartConfig)
    }
  }, [chartConfig])

  useEffect(() => {
    if (!match) {
      dispatch(FetchCountsAsync())
      dispatch(FetchMonthlyAmountAsync())
      dispatch(FetchTopStakersAsync())
      dispatch(FetchRecentStakersAsync())
      dispatch(FetchMonthlyAmountAsync())
    } else {
      dispatch(FetchGolcCountsAsync())
      dispatch(FetchGolcMonthlyAmountAsync())
      dispatch(FetchGolcTopStakersAsync())
      dispatch(FetchGolcRecentStakersAsync())
      dispatch(FetchGolcMonthlyAmountAsync())
    }
  }, [match])

  const handleChangeFilter = (value: string | number) => {
    const intValue = typeof value === "string" ? parseInt(value) : value
    switch (intValue) {
      case 1:
        setfilterState(1)
        if (!match) {
          dispatch(FetchTopStakersAsync())
        } else {
          dispatch(FetchGolcTopStakersAsync())
        }
        break
      case 2:
        setfilterState(2)
        if (!match) {
          dispatch(FetchRecentStakersAsync())
        } else {
          dispatch(FetchGolcRecentStakersAsync())
        }

        break
      default:
        break
    }
  }

  const [filterState, setfilterState] = useState<number>(1)
  return (
    <Container fluid id="dashboard">
      <Row className="g-4" data-testid="row-user">
        <Col xl={7} lg={12}>
          <CustomCard data-testid="card-user-dashboard" dashboard>
            {top_stakers && recent_stakers && (
              <CustomTable
                data-testid="table-user"
                columns={getColumns("Top 10 Stakers")}
                reFetch={() => handleChangeFilter(filterState)}
                paginate={true}
                data={filterState === 1 ? top_stakers : recent_stakers}
                status={filterState === 1 ? top_stakers_status : recent_stakers_status}
                filterAction={handleChangeFilter}
                filter={[
                  {
                    value: 1,
                    name: "Top 10 Stakers",
                  },
                  {
                    value: 2,
                    name: "Recent 10 Stakers",
                  },
                ]}
                search={false}
              />
            )}
          </CustomCard>
        </Col>
        <Col xl={5} lg={12}>
          <Row className="g-4">
            <Col xl={6} xs={12}>
              <CustomCard data-testid="card-overall-staking-amount" dashboard>
                <Stats
                  title="Overall Staking Amount"
                  value={current_staking_amount.value}
                  percentage={current_staking_amount.percentage}
                  up={current_staking_amount.up}
                />
              </CustomCard>
            </Col>
            <Col xl={6} xs={12}>
              <CustomCard data-testid="card-overall-staking-users" dashboard>
                <Stats
                  title="Overall Staking Users"
                  value={current_staking_users.value}
                  percentage={current_staking_users.percentage}
                  up={current_staking_users.up}
                />
              </CustomCard>
            </Col>
            <Col xl={6} xs={12}>
              <CustomCard data-testid="card-overall-staking-amount-until" dashboard>
                <Stats
                  title={`Overall Staking Amount Until ${moment().add(-1, "months").format("MMMM")}`}
                  value={Number((counts?.overall_last_month_staking_amount).toFixed(3)).toLocaleString("en")}
                  percentage={CalcChangePercentage(counts?.last_two_month_staking_amount, counts?.last_month_staking_amount)}
                  up={counts?.last_month_staking_amount > counts?.last_two_month_staking_amount}
                />
              </CustomCard>
            </Col>
            <Col xl={6} xs={12}>
              <CustomCard data-testid="card-overall-staking-users-until" dashboard>
                <Stats
                  title={`Overall Staking Users Until ${moment().add(-1, "months").format("MMMM")}`}
                  value={Number((counts?.overall_last_month_staking_users).toFixed(3)).toLocaleString("en")}
                  percentage={CalcChangePercentage(counts?.last_two_month_staking_users, counts?.last_month_staking_users)}
                  up={counts?.last_month_staking_users > counts?.last_two_month_staking_users}
                />
              </CustomCard>
            </Col>
            <Col xs={12}>
              <CustomCard data-testid="card-revenue-and-users" dashboard>
                <CustomText data_test="revenue" color="white">
                  Revenue And Users
                </CustomText>
                <div style={{ width: "100%", height: 315 }}>{<canvas id="myChart1"></canvas>}</div>
              </CustomCard>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  )
}

const getColumns = (id: string): Column[] => [
  {
    id,
    Header: () => (
      <Row className="justify-content-between">
        {/* <Col>
          <CustomSpace>
            <Icon name="person-outline" className="header-icon" />
            <CustomText data_test={id}>{id}</CustomText>
          </CustomSpace>
        </Col> */}
      </Row>
    ),
    columns: [
      {
        Header: "#",
        accessor: (_: any, ind: number) => (id === "Recent 10 Stakers" ? 10 - ind : ind + 1),
        width: "10%",
      },
      {
        Header: "Full Name",
        accessor: (row: any) => `${row.user?.first_name} ${row.user?.last_name}`,
        width: "22.5%",
      },
      {
        Header: "CAP",
        accessor: (row: any) => Number(row?.stacking_balance).toLocaleString("en"),
        width: "22.5%",
      },
      {
        Header: "Phone Number",
        accessor: (row: any) => row?.user?.phone_number,
        width: "22.5%",
      },
      {
        Header: "Staking Profit",
        accessor: (row: any) => toFixedWithoutRound((row.profit_percentage * 100).toFixed(3), 3) + "%",
        width: "18%",
      },
      // {
      //   Header: "Air Drop",
      //   accessor: (row: any) => Number(row.reward).toLocaleString("en"),
      //   width: "18%",
      // },
    ],
  },
]

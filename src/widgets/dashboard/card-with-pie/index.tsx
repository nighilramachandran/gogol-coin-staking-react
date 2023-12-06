import { Chart, ChartConfiguration, LegendItem } from "chart.js"
import React, { useEffect, useRef, useState } from "react"
import { CustomCard } from "../../../components/custom-card"
import { CustomSpace } from "../../../components/custom-space"
import { CustomText } from "../../../components/custom-text"

export const CardWithPie: React.FC<{ chart: Chart }> = ({ chart }) => {
  const ref = useRef<HTMLCanvasElement>(null)
  const [chartConfig, setchartConfig] = useState<ChartConfiguration | any>({
    type: "doughnut",
    data: {
      labels: ["Trader6B9", "Trader6B9"],
      datasets: [
        {
          label: "Traders profit",
          data: [300, 50],
          backgroundColor: ["#E5CAA6", "#A18C71"],
          hoverOffset: 2,
          borderWidth: 0,
        },
      ],
    },
    options: {
      cutout: "70%",
      aspectRatio: 1,
      responsive: true,
      plugins: {
        legend: {
          position: "right",
          align: "start",
          labels: {
            usePointStyle: true,
            pointStyle: "circle",
            padding: 20,
            boxPadding: 40,
          },
        },
      },
    },
  })

  useEffect(() => {
    if (window && ref.current) {
      // var ctx2 = document.getElementById("myChart2") as HTMLCanvasElement

      chart && chart.destroy()
      chart = new Chart(ref.current, chartConfig)
    }
  }, [chartConfig, ref])

  return (
    <CustomCard
      data-testid="card-with-Pie"
      header={
        <div className="c-card-header">
          <CustomText data-testid="title-with-Pie" color="white">
            Traders profit
          </CustomText>
          <CustomText data-testid="text-with-Pie" color="white">
            Total: 0 BTC
          </CustomText>
        </div>
      }
    >
      <div style={{ width: "100%", maxWidth: 250, height: "fit-content", padding: 0 }}>{<canvas ref={ref}></canvas>}</div>
    </CustomCard>
  )
}

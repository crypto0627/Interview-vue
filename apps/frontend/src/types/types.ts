export interface Data {
  id: number
  time: string
  data: number
}

export type ChartData = {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor: string[]
    borderColor: string[]
    borderWidth: number
  }[]
}

export type ChartOptions = {
  responsive: boolean
  scales: {
    x: {
      grid: { drawOnChartArea: boolean }
      border: { display: boolean; color: string; width: number }
      ticks: { maxRotation: number; minRotation: number; autoSkip: boolean }
    }
    y: {
      type: 'linear'
      ticks: {
        callback: (value: number) => string
      }
      min: number
      max: number
      title: {
        display: boolean
        text: string
        color: string
        font: { size: number; family: string; weight: string }
      }
      grid: { drawOnChartArea: boolean }
      border: { display: boolean; color: string; width: number }
    }
  }
}

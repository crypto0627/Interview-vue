<template>
  <div v-if="loading" class="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-xl mt-8 text-center">
    <p>Loading...</p>
  </div>
  <div v-else class="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-xl mt-8">
    <Bar v-if="chartKey" :data="chartData" :options="chartOptions" :key="chartKey" ref="barChart" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { DataFetcher } from '../services/fetchData'
import type { ChartData } from '../types/types'
import { rawData } from '../constants/InitData'
import eventBus from '../services/eventBus'
import type { ChartOptions, FontSpec } from 'chart.js'
import { allowedLabels } from '../constants/allowedLabels'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default defineComponent({
  components: {
    Bar,
  },
  setup() {
    const loading = ref(true)
    const chartKey = ref(0) // 渲染圖表的key
    const chartData = ref<ChartData>({
      labels: [],
      datasets: [
        {
          label: 'Data value',
          data: [],
          backgroundColor: [],
          borderColor: [],
          borderWidth: 1,
        },
      ],
    })

    const chartOptions = ref<ChartOptions<'bar'>>({
      responsive: true,
      scales: {
        x: {
          grid: {
            drawOnChartArea: true,
          },
          border: {
            display: true,
            color: 'black',
            width: 2,
          },
          ticks: {
            maxRotation: 45,
            minRotation: 45,
            autoSkip: false,
          },
        },
        y: {
          type: 'linear',
          ticks: {
            callback: (tickValue: string | number) => {
              const allowedValues = [1200, 1000, 500, 0, -500, -1064]

              if (typeof tickValue === 'number' && allowedValues.includes(tickValue)) {
                return tickValue.toString()
              }
              return ''
            },
          },
          min: -1064,
          max: 1200,
          title: {
            display: true,
            text: '排程 (kW)',
            color: 'black',
            font: {
              size: 12,
              family: 'Arial',
              weight: 'bold',
            } as FontSpec,
          },
          grid: {
            drawOnChartArea: true,
          },
          border: {
            display: true,
            color: 'black',
            width: 2,
          },
        },
      },
    })

    const updateChartData = (newData: typeof rawData.value) => {
      const filteredLabels = allowedLabels.filter((label) =>
        newData.some((item) => item.time === label),
      )

      const filteredData = filteredLabels.map((label) => {
        const item = newData.find((data) => data.time === label)
        return item ? item.data : null
      })

      chartData.value.labels = filteredLabels
      chartData.value.datasets[0].data = filteredData.map((d) => d ?? 0)
      chartData.value.datasets[0].backgroundColor = filteredData.map((data) =>
        data ? (data > 0 ? 'green' : 'red') : 'gray',
      )
      chartData.value.datasets[0].borderColor = filteredData.map((data) =>
        data ? (data > 0 ? 'green' : 'red') : 'gray',
      )

      chartKey.value++
    }

    const fetchData = async () => {
      const apiUrl = `${import.meta.env.VITE_SCHEDULE_DATA_API_URL}/api/data`
      const dataFetcher = new DataFetcher(apiUrl)
      try {
        const response = await dataFetcher.fetchData()
        if (response) {
          rawData.value = response
          updateChartData(response)
          loading.value = false
        }
      } catch (error) {
        console.error('API 請求失敗:', error)
        loading.value = false
      }
    }

    watch(rawData, (newData) => {
      updateChartData(newData)
    })

    eventBus.on('data-updated', () => {
      console.log('資料更新事件觸發')
      fetchData()
    })

    onMounted(async () => {
      await fetchData()
    })

    return {
      chartData,
      chartOptions,
      loading,
      chartKey,
    }
  },
})
</script>

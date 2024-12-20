<template>
  <div class="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-xl mt-8">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
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

// Register necessary chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default defineComponent({
  components: {
    Bar
  },
  setup() {
    const chartData = ref({
      ids: [],
      labels: [], // Time labels for X-axis
      datasets: [
        {
          label: 'Data over Time',
          data: [], // The actual data values
          backgroundColor: [], // Colors based on values (green or red)
          borderColor: [], // Border colors based on values (green or red)
          borderWidth: 1,
        },
      ],
    })

    const chartOptions = ref({
      responsive: true,
      scales: {
        x: {
          title: {
            display: false,
          },
          grid: {
            drawOnChartArea: false, // Hide grid lines if needed
          },
          border: {
            display: true, // Display the X-axis line
            color: 'black', // Set the color of the X-axis line
            width: 2, // Set the width of the X-axis line
          },
          ticks: {
            autoSkip: true,
            maxRotation: 45,
            minRotation: 45,
          },
        },
        y: {
          beginAtZero: false,
          min: -1064,
          max: 1200,
          ticks: {
            stepSize: 500,
          },
          title: {
            display: true,
            text: 'Data Value',
          },
          border: {
            display: true, // Display the Y-axis line
            color: 'black', // Set the color of the Y-axis line
            width: 2, // Set the width of the Y-axis line
          },
        },
      },
    })

    // Function to generate time labels every 30 minutes from 00:00 to 24:00
    const generateTimeLabels = () => {
      const times = []
      let hour = 0
      let minute = 0
      for (let i = 0; i < 48; i++) {
        // 48 half-hour intervals in 24 hours
        const timeString = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
        times.push(timeString)
        minute += 30
        if (minute === 60) {
          minute = 0
          hour += 1
        }
      }
      return times
    }

    // Fetch data from the API and update chartData
    const fetchData = async () => {
      const apiUrl = `${import.meta.env.VITE_SCHEDULE_DATA_API_URL}/api/data`
      try {
        const response = await fetch(apiUrl)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()

        // Extract time, data, and assign colors based on values
        const ids = data.map((item) => item.id)
        const times = data.map((item) => item.time)
        const values = data.map((item) => item.data)
        const backgroundColors = values.map((value) =>
          value > 0 ? 'rgba(0, 255, 0, 0.6)' : 'rgba(255, 0, 0, 0.6)',
        )
        const borderColors = values.map((value) => (value > 0 ? 'green' : 'red'))

        // Generate all time labels from 00:00 to 24:00
        const allLabels = generateTimeLabels()

        // Match the data to the times and insert the values
        const chartLabels = allLabels
        const chartDataValues = allLabels.map((time) => {
          const matchingItem = data.find((item) => item.time === time)
          return matchingItem ? matchingItem.data : null // Default to null for missing data
        })

        chartData.value.ids = ids
        chartData.value.labels = chartLabels
        chartData.value.datasets[0].data = chartDataValues
        chartData.value.datasets[0].backgroundColor = backgroundColors
        chartData.value.datasets[0].borderColor = borderColors
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    // Fetch data when the component is mounted
    onMounted(async () => {
      await fetchData()
    })

    return {
      chartData,
      chartOptions,
    }
  },
})
</script>

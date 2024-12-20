<template>
  <div class="flex flex-col p-4">
    <div class="text-lg font-bold mb-4">00:00 -> 00:15</div>

    <div class="controls flex flex-col space-y-4 mt-4">
      <div class="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-5">
        <label class="flex items-center space-x-2 w-full sm:w-auto">
          <input type="radio" id="setSchedule" name="mode" v-model="mode" value="schedule" />
          <span>設定排程</span>
        </label>

        <!-- Input and Button in a flex container -->
        <div class="flex items-center space-x-2 w-full sm:w-auto">
          <div class="relative w-full sm:w-48 md:w-64 lg:w-80 xl:w-96">
            <input
              v-model="inputValue"
              min="0"
              type="number"
              class="border px-2 py-1 w-full pr-14"
              :disabled="mode !== 'schedule'"
            />
            <span class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600"
              >kW</span
            >
          </div>

          <button
            class="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            type="button"
            :disabled="mode !== 'schedule'"
            @click="handleSubmit"
          >
            Submit
          </button>
        </div>
      </div>

      <div class="flex items-center space-x-4">
        <label class="flex items-center space-x-2">
          <input type="radio" id="standby" name="mode" v-model="mode" value="standby" />
          <span>待機</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const mode = ref<string>('standby')
    const inputValue = ref<number | string>('')

    const apiUrl = import.meta.env.SCHEDULE_DATA_API_URL
    const handleSubmit = async () => {
      if (mode.value === 'schedule' && inputValue.value !== '') {
        try {
          const data = {
            time: '00:00 -> 00:15',
            schedule: inputValue.value,
          }

          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          })

          if (response.ok) {
            const result = await response.json()
            console.log('Data saved:', result)
            alert('Data saved successfully')
          } else {
            console.error('Failed to save data')
            alert('Failed to save data')
          }
        } catch (error) {
          console.error('Error:', error)
          alert('Error occurred while saving data')
        }
      } else {
        alert('Please enter a valid value and select "設定排程"')
      }
    }

    return { mode, inputValue, handleSubmit }
  },
})
</script>

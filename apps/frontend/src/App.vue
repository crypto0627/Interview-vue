<script setup lang="ts">
import BarChart from './components/BarChart.vue'
import Schedule from './components/Schedule.vue'
</script>

<template>
  <div class="flex flex-col w-full h-screen px-10">
    <div
      class="h-[10vh] min-h-[10vh] max-h-[10vh] flex flex-col sm:flex-row justify-center items-center gap-4"
    >
      <div class="flex items-center gap-2">
        <div class="w-16 h-4 bg-green-600"></div>
        <span class="text-black text-xl sm:text-2xl font-bold">充電</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-16 h-4 bg-red-600"></div>
        <span class="text-black text-xl sm:text-2xl font-bold">放電</span>
      </div>
    </div>

    <div class="h-[60vh] min-h-[60vh] max-h-[60vh] bg-white">
      <BarChart />
    </div>

    <div class="h-[30vh] min-h-[30vh] max-h-[30vh] border-t-4 border-black">
      <Schedule />
    </div>
  </div>
</template>

<template>
  <div class="flex justify-center gap-4 md:gap-8">
    <div v-for="item in timeUnits" :key="item.label" class="flex flex-col items-center">
      <div class="relative">
        <div class="w-20 h-20 md:w-24 md:h-24 bg-white/20 backdrop-blur-sm border border-gold-300/40 rounded-xl flex items-center justify-center shadow-inner">
          <span class="font-serif text-3xl md:text-4xl font-bold text-white">{{ String(item.value).padStart(2, '0') }}</span>
        </div>
        <!-- Shimmer border -->
        <div class="absolute inset-0 rounded-xl border border-gold-200/20 pointer-events-none" />
      </div>
      <span class="font-sans text-xs tracking-widest uppercase text-gold-200 mt-2">{{ item.label }}</span>
    </div>
  </div>

  <p v-if="isPast" class="text-center text-gold-200 font-serif text-lg mt-6 animate-pulse">
    ✨ Hari bahagia telah tiba ✨
  </p>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  targetDate: { type: String, required: true },
})

const now = ref(new Date())
let timer = null

const target = computed(() => new Date(props.targetDate))
const diff = computed(() => target.value - now.value)
const isPast = computed(() => diff.value <= 0)

const timeUnits = computed(() => {
  if (isPast.value) return [
    { label: 'Hari', value: 0 },
    { label: 'Jam', value: 0 },
    { label: 'Menit', value: 0 },
    { label: 'Detik', value: 0 },
  ]

  const totalSeconds = Math.floor(diff.value / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return [
    { label: 'Hari', value: days },
    { label: 'Jam', value: hours },
    { label: 'Menit', value: minutes },
    { label: 'Detik', value: seconds },
  ]
})

onMounted(() => {
  timer = setInterval(() => { now.value = new Date() }, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>

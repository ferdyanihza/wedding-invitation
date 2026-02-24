<template>
  <div v-if="musicUrl" class="fixed bottom-6 right-6 z-50">
    <button
      @click="togglePlay"
      :class="[
        'w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300',
        isPlaying
          ? 'bg-gradient-to-br from-gold-500 to-gold-700'
          : 'bg-white border-2 border-gold-400'
      ]"
      :title="isPlaying ? 'Pause musik' : 'Play musik'"
    >
      <!-- Vinyl record animation when playing -->
      <div v-if="isPlaying" class="absolute inset-0 rounded-full border-4 border-gold-300/40 animate-ping" />
      <svg v-if="isPlaying" class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
      </svg>
      <svg v-else class="w-6 h-6 text-gold-600" fill="currentColor" viewBox="0 0 24 24">
        <path d="M8 5v14l11-7z"/>
      </svg>
    </button>

    <!-- Music title tooltip -->
    <div v-if="showTitle" class="absolute bottom-16 right-0 w-48 bg-white rounded-xl shadow-lg p-3 border border-gold-200 text-right">
      <p class="text-xs text-brown-400 font-sans">♪ Sedang diputar</p>
      <p class="text-sm font-serif text-brown-700 mt-0.5">{{ musicTitle }}</p>
    </div>

    <audio ref="audioRef" :src="musicUrl" loop preload="none" @play="isPlaying = true" @pause="isPlaying = false" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  musicUrl: String,
  musicTitle: { type: String, default: 'Wedding Song' },
})

const audioRef = ref(null)
const isPlaying = ref(false)
const showTitle = ref(false)

const togglePlay = () => {
  if (!audioRef.value) return
  if (isPlaying.value) {
    audioRef.value.pause()
  } else {
    audioRef.value.play().catch(() => {})
    showTitle.value = true
    setTimeout(() => { showTitle.value = false }, 3000)
  }
}

// Auto-play on first interaction
const handleFirstInteraction = () => {
  if (audioRef.value && !isPlaying.value) {
    audioRef.value.play().catch(() => {})
    document.removeEventListener('click', handleFirstInteraction)
  }
}

onMounted(() => {
  document.addEventListener('click', handleFirstInteraction, { once: true })
})
</script>

<template>
  <div>
    <div v-if="loading" class="grid grid-cols-2 md:grid-cols-3 gap-3">
      <div v-for="n in 6" :key="n" class="aspect-square bg-gold-100 rounded-2xl animate-pulse" />
    </div>

    <div v-else-if="photos.length > 0" class="columns-2 md:columns-3 gap-3 space-y-3">
      <div
        v-for="(photo, idx) in photos" :key="photo.id"
        class="break-inside-avoid rounded-2xl overflow-hidden cursor-pointer group relative shadow-md hover:shadow-xl transition-all duration-300"
        @click="openLightbox(idx)"
      >
        <img
          :src="photo.url"
          :alt="photo.caption || `Foto ${idx + 1}`"
          class="w-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-brown-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
          <p v-if="photo.caption" class="text-white font-sans text-sm">{{ photo.caption }}</p>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-12 text-brown-300">
      <p class="text-4xl mb-2">📷</p>
      <p class="font-serif text-lg">Belum ada foto</p>
    </div>

    <!-- Lightbox -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="lightboxIndex !== null"
          class="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          @click.self="closeLightbox"
        >
          <button @click="closeLightbox" class="absolute top-4 right-4 text-white/80 hover:text-white transition">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>

          <button v-if="lightboxIndex > 0" @click="prevPhoto" class="absolute left-4 text-white/80 hover:text-white transition p-2">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>

          <img
            :src="photos[lightboxIndex]?.url"
            :alt="photos[lightboxIndex]?.caption"
            class="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
          />

          <button v-if="lightboxIndex < photos.length - 1" @click="nextPhoto" class="absolute right-4 text-white/80 hover:text-white transition p-2">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>

          <div v-if="photos[lightboxIndex]?.caption" class="absolute bottom-4 left-0 right-0 text-center text-white/80 font-sans text-sm">
            {{ photos[lightboxIndex].caption }}
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import api from '@/api'

const photos = ref([])
const loading = ref(true)
const lightboxIndex = ref(null)

const fetchPhotos = async () => {
  try {
    const { data } = await api.get('/gallery')
    photos.value = data.data
  } catch {
    console.error('Gagal memuat galeri')
  } finally {
    loading.value = false
  }
}

const openLightbox = (idx) => { lightboxIndex.value = idx }
const closeLightbox = () => { lightboxIndex.value = null }
const prevPhoto = () => { if (lightboxIndex.value > 0) lightboxIndex.value-- }
const nextPhoto = () => { if (lightboxIndex.value < photos.value.length - 1) lightboxIndex.value++ }

const handleKeydown = (e) => {
  if (lightboxIndex.value === null) return
  if (e.key === 'ArrowLeft') prevPhoto()
  if (e.key === 'ArrowRight') nextPhoto()
  if (e.key === 'Escape') closeLightbox()
}

onMounted(() => {
  fetchPhotos()
  window.addEventListener('keydown', handleKeydown)
})
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
